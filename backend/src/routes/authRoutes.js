import express from 'express';
import { authController } from '../controllers/authController.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', optionalAuthMiddleware, authController.getMe);
router.post('/switch-user', authController.switchUser);
router.post('/add-balance', authMiddleware, authController.addBalance);

export default router;
