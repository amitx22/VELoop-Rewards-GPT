import rateLimit from 'express-rate-limit';

// Global API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    errorCode: 'RATE_LIMITED',
    message: 'Too many requests from this IP. Please try again later.',
  },
});

// Strict rate limit for Join & Claim endpoints
export const joinLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit to 15 attempts per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    errorCode: 'RATE_LIMITED',
    message: 'Too many participation requests. Please wait a moment before trying again.',
  },
});
