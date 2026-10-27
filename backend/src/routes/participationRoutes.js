import express from 'express';
import { participationController } from '../controllers/participationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { joinLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.get('/:id/my-status', authMiddleware, participationController.getMyStatus);
router.post('/:id/join', authMiddleware, joinLimiter, participationController.joinGiveaway);

export default router;
