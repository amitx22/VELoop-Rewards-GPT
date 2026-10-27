import express from 'express';
import { winnerController } from '../controllers/winnerController.js';

const router = express.Router();

router.get('/previous/winners', winnerController.getAllPreviousWinners);
router.get('/:id/winners', winnerController.getWinnersByGiveaway);

export default router;
