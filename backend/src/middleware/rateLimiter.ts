import rateLimit from 'express-rate-limit';

// General API Rate Limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Strict Auth Limiter (Only penalizes failed attempts)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many failed authentication attempts. Please try again in a few minutes.',
  },
});

// Dedicated Strict Password Reset Limiter (Prevents Email Abuse / Spamming)
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again after 15 minutes.',
  },
});

// Dedicated AI Assistant Rate Limiter (Protects LLM Quota & Prevents Cost Abuse)
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 queries per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI Assistant queries from this IP. Please wait a few minutes before trying again.',
  },
});

// Dedicated Flight Search Rate Limiter (Protects expensive live GDS/Aggregator APIs from bot scraping)
export const flightSearchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Max 20 searches per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'High flight search activity detected. Please wait a moment before searching again.',
  },
});

// Dedicated Hotel Search Rate Limiter
export const hotelSearchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Max 30 searches per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many hotel search requests. Please slow down and try again in a minute.',
  },
});