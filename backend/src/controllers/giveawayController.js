import { store } from '../models/store.js';

export const giveawayController = {
  // GET /api/giveaways/current
  getCurrentGiveaway(req, res) {
    try {
      const giveaway = store.getCurrentGiveaway();
      if (!giveaway) {
        return res.status(404).json({
          success: false,
          errorCode: 'NO_ACTIVE_GIVEAWAY',
          message: 'No active giveaway currently found.',
        });
      }

      // Check user participation if authenticated
      let userParticipation = null;
      let isWinner = false;
      let wonPrize = null;

      if (req.user) {
        userParticipation = store.getParticipation(req.user.userId, giveaway.giveawayId);
        const winnerRecord = store.findWinner(giveaway.giveawayId, req.user.userId);
        if (winnerRecord) {
          isWinner = true;
          wonPrize = winnerRecord;
        }
      }

      return res.json({
        success: true,
        giveaway: {
          ...giveaway,
          serverTime: new Date().toISOString(),
          userState: {
            isAuthenticated: !!req.user,
            userId: req.user ? req.user.userId : null,
            isParticipating: !!userParticipation,
            participation: userParticipation,
            isWinner,
            wonPrize,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/giveaways/:idOrSlug
  getGiveawayById(req, res) {
    try {
      const { id } = req.params;
      const giveaway = store.getGiveawayById(id);

      if (!giveaway) {
        return res.status(404).json({
          success: false,
          errorCode: 'GIVEAWAY_NOT_FOUND',
          message: `Giveaway with identifier "${id}" could not be found.`,
        });
      }

      let userParticipation = null;
      let isWinner = false;
      let wonPrize = null;

      if (req.user) {
        userParticipation = store.getParticipation(req.user.userId, giveaway.giveawayId);
        const winnerRecord = store.findWinner(giveaway.giveawayId, req.user.userId);
        if (winnerRecord) {
          isWinner = true;
          wonPrize = winnerRecord;
        }
      }

      return res.json({
        success: true,
        giveaway: {
          ...giveaway,
          serverTime: new Date().toISOString(),
          userState: {
            isAuthenticated: !!req.user,
            userId: req.user ? req.user.userId : null,
            isParticipating: !!userParticipation,
            participation: userParticipation,
            isWinner,
            wonPrize,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/giveaways/previous
  getPreviousGiveaways(req, res) {
    try {
      const previous = store.getPreviousGiveaways();
      return res.json({
        success: true,
        giveaways: previous,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/giveaways/all
  getAllGiveaways(req, res) {
    try {
      const all = store.getAllGiveaways();
      return res.json({
        success: true,
        giveaways: all,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
