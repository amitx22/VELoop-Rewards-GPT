import { store } from '../models/store.js';

export const adminGiveawayController = {
  // POST /api/admin/giveaway-status
  setGiveawayStatus(req, res) {
    const { giveawayId, status } = req.body;
    if (!['ACTIVE', 'ENDED', 'UPCOMING', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = store.setGiveawayStatus(giveawayId, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Giveaway not found' });
    }

    store.createAuditLog({
      userId: req.user ? req.user.userId : 'SYSTEM',
      action: 'GIVEAWAY_STATUS_CHANGED',
      giveawayId,
      result: `STATUS_SET_TO_${status}`,
    });

    return res.json({
      success: true,
      giveaway: updated,
      message: `Giveaway status successfully updated to ${status}`,
    });
  },

  // POST /api/admin/select-winners
  selectWinners(req, res) {
    const { giveawayId } = req.body;
    const giveaway = store.getGiveawayById(giveawayId);
    if (!giveaway) {
      return res.status(404).json({ success: false, message: 'Giveaway not found' });
    }

    // Must be ENDED before finalizing winners
    if (giveaway.status === 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Cannot select winners while giveaway is ACTIVE. End giveaway first.',
      });
    }

    // Check existing winners
    const existing = store.getWinnersByGiveaway(giveaway.giveawayId);
    if (existing.length > 0) {
      return res.json({
        success: true,
        message: 'Winners are already selected for this giveaway event.',
        winners: existing,
      });
    }

    // Select 1 iPhone winner and multiple other winners
    const mockWinnerCandidates = [
      { userId: 'VE10025', name: 'Rahul Sharma', prizeIndex: 1 }, // Apple Watch
      { userId: 'VE10042', name: 'Priya Patel', prizeIndex: 0 },  // iPhone 15 Pro
      { userId: 'VE10033', name: 'Vikas Verma', prizeIndex: 2 },  // AirPods Pro
    ];

    const finalizedWinners = [];
    mockWinnerCandidates.forEach((cand) => {
      const prize = giveaway.prizes[cand.prizeIndex] || giveaway.prizes[0];
      const win = store.addWinner({
        giveawayId: giveaway.giveawayId,
        giveawayName: giveaway.title,
        prizeId: prize.prizeId,
        prizeName: prize.name,
        prizeType: prize.type,
        userId: cand.userId,
        displayName: `${cand.name.split(' ')[0]} ${cand.name.split(' ')[1]?.[0] || ''}. (${cand.userId.substring(0, 2)}****${cand.userId.substring(4)})`,
        selectionMethod: 'ALGORITHMIC_RANDOM',
        claimDeadline: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        status: 'NOT_CLAIMED',
      });
      finalizedWinners.push(win);

      store.createAuditLog({
        userId: cand.userId,
        action: 'WINNER_SELECTED',
        giveawayId: giveaway.giveawayId,
        result: `WON_${prize.name}`,
      });
    });

    return res.json({
      success: true,
      message: 'Winners finalized with full cryptographic audit log.',
      winners: finalizedWinners,
    });
  },

  // GET /api/admin/audit-logs
  getAuditLogs(req, res) {
    return res.json({
      success: true,
      logs: store.getAuditLogs(),
    });
  },

  // GET /api/admin/fraud-events
  getFraudEvents(req, res) {
    return res.json({
      success: true,
      events: store.getFraudEvents(),
    });
  },

  // POST /api/admin/reset
  resetDemo(req, res) {
    store.initSeedData();
    return res.json({
      success: true,
      message: 'Demo state reinitialized to original seeds.',
    });
  },
};
