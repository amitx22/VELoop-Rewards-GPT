import express from 'express';
import { giveawayController } from '../controllers/giveawayController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/current', optionalAuthMiddleware, giveawayController.getCurrentGiveaway);
router.get('/previous', giveawayController.getPreviousGiveaways);
router.get('/all', giveawayController.getAllGiveaways);
router.get('/:id', optionalAuthMiddleware, giveawayController.getGiveawayById);

export default router;
