import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { store } from '../models/store.js';

export const authController = {
  // GET /api/auth/me
  getMe(req, res) {
    if (!req.user) {
      return res.json({
        success: true,
        isAuthenticated: false,
        user: null,
      });
    }

    return res.json({
      success: true,
      isAuthenticated: true,
      user: {
        userId: req.user.userId,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        balances: req.user.balances,
        isSuspicious: req.user.isSuspicious,
      },
    });
  },

  // POST /api/auth/switch-user
  switchUser(req, res) {
    const { userId } = req.body;

    if (!userId || userId === 'VISITOR') {
      return res.json({
        success: true,
        isAuthenticated: false,
        token: null,
        user: null,
        message: 'Switched to Anonymous Visitor state.',
      });
    }

    const user = store.getUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        errorCode: 'USER_NOT_FOUND',
        message: `User ${userId} not found in system.`,
      });
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      isAuthenticated: true,
      token,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        balances: user.balances,
        isSuspicious: user.isSuspicious,
      },
      message: `Switched user to ${user.fullName} (${user.userId})`,
    });
  },

  // POST /api/auth/add-balance (For testing balance replenish)
  addBalance(req, res) {
    const { currency, amount } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Login required' });
    }

    const current = req.user.balances[currency] || 0;
    const updated = store.updateUserBalance(req.user.userId, currency, current + Number(amount));

    return res.json({
      success: true,
      message: `Added ${amount} ${currency}.`,
      balances: updated.balances,
    });
  },
};
