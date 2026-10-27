import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { store } from '../models/store.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        userId = decoded.userId;
      } catch (err) {
        // Token invalid, check fallback header
      }
    }

    // Support X-User-Id header for effortless interactive state-switching in UI/demo
    if (!userId && req.headers['x-user-id']) {
      userId = req.headers['x-user-id'];
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        errorCode: 'LOGIN_REQUIRED',
        message: 'Please log in to participate in the giveaway.',
      });
    }

    const user = store.getUser(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        errorCode: 'USER_NOT_FOUND',
        message: 'Authenticated user session not recognized.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorCode: 'AUTH_INTERNAL_ERROR',
      message: 'Authentication verification failure.',
    });
  }
};

// Optional auth: sets req.user if provided, but does not block visitor requests
export const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      userId = decoded.userId;
    } catch (err) {}
  }

  if (!userId && req.headers['x-user-id']) {
    userId = req.headers['x-user-id'];
  }

  if (userId) {
    req.user = store.getUser(userId) || null;
  } else {
    req.user = null;
  }
  next();
};

export const adminOnlyMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      errorCode: 'FORBIDDEN_ADMIN_ONLY',
      message: 'Admin authorization required for this action.',
    });
  }
  next();
};
