import { store } from '../models/store.js';

export const winnerController = {
  // GET /api/giveaways/:id/winners
  getWinnersByGiveaway(req, res) {
    try {
      const { id } = req.params;
      const giveaway = store.getGiveawayById(id);

      if (!giveaway) {
        return res.status(404).json({
          success: false,
          errorCode: 'GIVEAWAY_NOT_FOUND',
          message: 'Giveaway not found.',
        });
      }

      // If active, do not falsely display winners
      if (giveaway.status === 'ACTIVE') {
        return res.json({
          success: true,
          status: 'LIVE',
          giveawayId: giveaway.giveawayId,
          isFinalized: false,
          message: 'Giveaway is still live. Winners will be announced after the giveaway ends.',
          winnerAnnouncement: 'Coming after the giveaway ends',
          winners: [],
        });
      }

      const winners = store.getWinnersByGiveaway(giveaway.giveawayId);

      return res.json({
        success: true,
        status: giveaway.status,
        giveawayId: giveaway.giveawayId,
        isFinalized: true,
        winners: winners.map((w) => ({
          winnerId: w.winnerId,
          prizeName: w.prizeName,
          prizeType: w.prizeType,
          displayName: w.displayName, // masked
          selectedAt: w.selectedAt,
          claimDeadline: w.claimDeadline,
          status: w.status,
        })),
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/giveaways/previous/winners
  getAllPreviousWinners(req, res) {
    try {
      const allWinners = store.getAllPreviousWinners();

      // Return privacy-masked winner records
      return res.json({
        success: true,
        winners: allWinners.map((w) => ({
          winnerId: w.winnerId,
          giveawayId: w.giveawayId,
          giveawayName: w.giveawayName,
          prizeName: w.prizeName,
          prizeType: w.prizeType,
          displayName: w.displayName,
          selectedAt: w.selectedAt,
          status: w.status,
        })),
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
