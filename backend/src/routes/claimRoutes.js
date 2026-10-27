import express from 'express';
import { claimController } from '../controllers/claimController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { joinLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.get('/:id/my-claim', authMiddleware, claimController.getMyClaim);
router.post('/:id/claim', authMiddleware, joinLimiter, claimController.submitClaim);

export default router;
