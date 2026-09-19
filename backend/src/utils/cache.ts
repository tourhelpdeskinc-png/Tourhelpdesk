import Redis from 'ioredis';
import env from '../config/env.js';
import logger from '../config/logger.js';

export interface ICacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, data: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class InMemoryCacheStore implements ICacheStore {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private maxKeys = 500;
  private sweepTimer: NodeJS.Timeout;

  constructor() {
    // Active sweep every 60 seconds to prune expired entries
    this.sweepTimer = setInterval(() => this.pruneExpired(), 60 * 1000);
    if (this.sweepTimer.unref) {
      this.sweepTimer.unref(); // Does not prevent Node.js clean exit
    }
  }

  private pruneExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    // Refresh LRU order: re-insert so accessed item becomes most recently used
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.data as T;
  }

  async set<T>(key: string, data: T, ttlSeconds = 600): Promise<void> {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxKeys) {
      // First purge any dead expired keys before dropping active ones
      this.pruneExpired();
      if (this.cache.size >= this.maxKeys) {
        const lruKey = this.cache.keys().next().value;
        if (lruKey !== undefined) this.cache.delete(lruKey);
      }
    }
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

export class RedisCacheStore implements ICacheStore {
  private redis: Redis;
  private fallback: InMemoryCacheStore;
  private isConnected = false;

  constructor(redisUrl: string) {
    this.fallback = new InMemoryCacheStore();
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: false,
      retryStrategy: (times) => Math.min(times * 200, 3000),
    });

    this.redis.on('connect', () => {
      this.isConnected = true;
      logger.info('✅ Production Redis Connected Successfully!');
    });

    this.redis.on('error', (err) => {
      this.isConnected = false;
      logger.warn(`⚠️ Redis connection note: ${err?.message || err}. Operating with in-memory fallback.`);
    });

    this.redis.on('close', () => {
      this.isConnected = false;
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      return this.fallback.get<T>(key);
    }
    try {
      const data = await this.redis.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (err: any) {
      logger.warn(`[RedisCache] get error for key "${key}": ${err?.message}`);
      return this.fallback.get<T>(key);
    }
  }

  async set<T>(key: string, data: T, ttlSeconds = 600): Promise<void> {
    if (!this.isConnected) {
      await this.fallback.set(key, data, ttlSeconds);
      return;
    }
    try {
      await this.redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
    } catch (err: any) {
      logger.warn(`[RedisCache] set error for key "${key}": ${err?.message}`);
      await this.fallback.set(key, data, ttlSeconds);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.isConnected) {
      await this.fallback.delete(key);
      return;
    }
    try {
      await this.redis.del(key);
    } catch {
      await this.fallback.delete(key);
    }
  }
}

const createCacheStore = (): ICacheStore => {
  if (env.REDIS_URL) {
    try {
      return new RedisCacheStore(env.REDIS_URL);
    } catch (err: any) {
      logger.warn(`⚠️ Could not instantiate RedisCacheStore: ${err?.message || err}. Falling back to InMemoryCacheStore.`);
      return new InMemoryCacheStore();
    }
  }
  return new InMemoryCacheStore();
};

export const cacheStore: ICacheStore = createCacheStore();

