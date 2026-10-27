import express from 'express';
import { adminGiveawayController } from '../controllers/adminGiveawayController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/giveaway-status', optionalAuthMiddleware, adminGiveawayController.setGiveawayStatus);
router.post('/select-winners', optionalAuthMiddleware, adminGiveawayController.selectWinners);
router.get('/audit-logs', optionalAuthMiddleware, adminGiveawayController.getAuditLogs);
router.get('/fraud-events', optionalAuthMiddleware, adminGiveawayController.getFraudEvents);
router.post('/reset', adminGiveawayController.resetDemo);

export default router;
