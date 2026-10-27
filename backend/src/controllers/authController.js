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

  // POST /api/auth/login
  login(req, res) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          errorCode: 'MISSING_CREDENTIALS',
          message: 'Please enter your Email or User ID and Password.',
        });
      }

      const user = store.findUserByEmailOrId(identifier);

      if (!user) {
        return res.status(401).json({
          success: false,
          errorCode: 'INVALID_CREDENTIALS',
          message: 'No account found with that email or User ID.',
        });
      }

      // Password verification (Default test accounts accept password123 or their seeded password)
      if (user.password && user.password !== password) {
        return res.status(401).json({
          success: false,
          errorCode: 'INVALID_CREDENTIALS',
          message: 'Incorrect password entered. (Default demo password is password123)',
        });
      }

      const token = jwt.sign(
        { userId: user.userId, role: user.role, email: user.email },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      store.createAuditLog({
        userId: user.userId,
        action: 'JOIN_GIVEAWAY', // session auth
        result: 'LOGIN_SUCCESS',
      });

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
        message: `Welcome back, ${user.fullName}!`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/auth/register
  register(req, res) {
    try {
      const { fullName, email, password } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({
          success: false,
          errorCode: 'MISSING_FIELDS',
          message: 'Full Name, Email, and Password are required.',
        });
      }

      if (!email.includes('@')) {
        return res.status(400).json({
          success: false,
          errorCode: 'INVALID_EMAIL',
          message: 'Please enter a valid email address.',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          errorCode: 'WEAK_PASSWORD',
          message: 'Password must be at least 6 characters.',
        });
      }

      const newUser = store.createUser({ fullName, email, password });

      const token = jwt.sign(
        { userId: newUser.userId, role: newUser.role, email: newUser.email },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      store.createAuditLog({
        userId: newUser.userId,
        action: 'JOIN_GIVEAWAY',
        result: 'ACCOUNT_CREATED',
      });

      return res.status(201).json({
        success: true,
        isAuthenticated: true,
        token,
        user: {
          userId: newUser.userId,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          balances: newUser.balances,
          isSuspicious: false,
        },
        message: `Account created successfully! Welcome bonus credited: 300 VEs, 500 SVEs, 2,500 Tokens!`,
      });
    } catch (error) {
      if (error.message === 'EMAIL_ALREADY_REGISTERED') {
        return res.status(409).json({
          success: false,
          errorCode: 'EMAIL_ALREADY_REGISTERED',
          message: 'An account with this email is already registered. Please sign in.',
        });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/auth/logout
  logout(req, res) {
    return res.json({
      success: true,
      isAuthenticated: false,
      token: null,
      user: null,
      message: 'Logged out successfully.',
    });
  },

  // POST /api/auth/switch-user (For rapid demo evaluation)
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
