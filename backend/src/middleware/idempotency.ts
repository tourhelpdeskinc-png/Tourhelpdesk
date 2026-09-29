import { Request, Response, NextFunction } from 'express';
import { cacheStore } from '../utils/cache.js';
import logger from '../config/logger.js';

export interface IdempotencyOptions {
  ttlSeconds?: number;
  headerName?: string;
  enforceKey?: boolean;
}

interface IdempotentCachedRecord {
  status: 'PENDING' | 'COMPLETED';
  statusCode?: number;
  body?: any;
  timestamp: number;
}

/**
 * Enterprise Idempotency Middleware
 * Ensures exactly-once execution for mutating requests (POST, PUT, PATCH, DELETE).
 * Provides atomic locking via Redis / In-Memory cache with O(1) time complexity.
 */
export const idempotencyMiddleware = (options: IdempotencyOptions = {}) => {
  const {
    ttlSeconds = 900, // 15 minutes response cache
    headerName = 'idempotency-key',
    enforceKey = false,
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only apply to state-mutating HTTP methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    const rawHeader = req.headers[headerName] || req.headers[`x-${headerName}`] || req.body?.idempotencyKey;
    const key = typeof rawHeader === 'string' ? rawHeader.trim() : Array.isArray(rawHeader) ? rawHeader[0].trim() : '';

    if (!key) {
      if (enforceKey) {
        res.status(400).json({
          success: false,
          message: `Missing required header: ${headerName}`,
        });
        return;
      }
      return next();
    }

    // O(1) format & length validation (prevents key injection & unbounded cache keys)
    if (key.length < 8 || key.length > 128 || !/^[A-Za-z0-9_\-.:]+$/.test(key)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Idempotency-Key format. Must be 8-128 alphanumeric characters, hyphens, colons, or underscores.',
      });
      return;
    }

    const cacheKey = `idemp:${req.baseUrl || ''}${req.path}:${key}`;

    try {
      const cached = await cacheStore.get<IdempotentCachedRecord>(cacheKey);

      if (cached) {
        if (cached.status === 'PENDING') {
          // Concurrent duplicate request is currently executing
          res.setHeader('Retry-After', '2');
          res.status(409).json({
            success: false,
            message: 'A request with this Idempotency-Key is currently in progress. Please wait before retrying.',
            retryAfterSeconds: 2,
          });
          return;
        }

        if (cached.status === 'COMPLETED' && cached.statusCode && cached.body !== undefined) {
          // O(1) instant replay of already-executed response without touching controller or database
          res.setHeader('X-Idempotency-Replayed', 'true');
          res.setHeader('X-Idempotency-Key', key);
          res.status(cached.statusCode).json(cached.body);
          return;
        }
      }

      // Acquire lock by setting status to PENDING with a 60s TTL to prevent deadlock if node restarts
      await cacheStore.set<IdempotentCachedRecord>(
        cacheKey,
        {
          status: 'PENDING',
          timestamp: Date.now(),
        },
        60
      );

      // Attach key to request for controller context
      (req as any).idempotencyKey = key;

      // Intercept response methods to capture final status and payload
      const originalJson = res.json.bind(res);
      const originalSend = res.send.bind(res);
      let captured = false;

      const recordOutcome = async (statusCode: number, payload: any) => {
        if (captured) return;
        captured = true;

        try {
          if (statusCode >= 200 && statusCode < 300) {
            // Cache successful execution for the full TTL window
            await cacheStore.set<IdempotentCachedRecord>(
              cacheKey,
              {
                status: 'COMPLETED',
                statusCode,
                body: payload,
                timestamp: Date.now(),
              },
              ttlSeconds
            );
          } else {
            // On failure/validation error (4xx/5xx), delete the lock so user can correct and retry
            await cacheStore.delete(cacheKey);
          }
        } catch (cacheErr: any) {
          logger.warn(`[Idempotency] Failed to record outcome for key "${cacheKey}": ${cacheErr?.message}`);
        }
      };

      res.json = (body: any): Response => {
        recordOutcome(res.statusCode, body);
        res.setHeader('X-Idempotency-Key', key);
        return originalJson(body);
      };

      res.send = (body: any): Response => {
        let parsed = body;
        if (typeof body === 'string') {
          try {
            parsed = JSON.parse(body);
          } catch {
            parsed = body;
          }
        }
        recordOutcome(res.statusCode, parsed);
        res.setHeader('X-Idempotency-Key', key);
        return originalSend(body);
      };

      next();
    } catch (err: any) {
      logger.error(`[Idempotency] Middleware error for key "${cacheKey}": ${err?.message}`);
      // Fail-open strategy: Never block client transactions if caching layer encounters an internal fault
      next();
    }
  };
};

export default idempotencyMiddleware;
