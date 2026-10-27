import { store } from '../models/store.js';
import { fraudService } from '../services/fraudService.js';

export const participationController = {
  // GET /api/giveaways/:id/my-status
  getMyStatus(req, res) {
    try {
      const { id } = req.params;
      const giveaway = store.getGiveawayById(id);
      if (!giveaway) {
        return res.status(404).json({
          success: false,
          errorCode: 'GIVEAWAY_NOT_FOUND',
          message: 'Giveaway not found',
        });
      }

      const participation = store.getParticipation(req.user.userId, giveaway.giveawayId);
      const winner = store.findWinner(giveaway.giveawayId, req.user.userId);

      return res.json({
        success: true,
        giveawayId: giveaway.giveawayId,
        isParticipating: !!participation,
        participation,
        isWinner: !!winner,
        winner,
        balances: req.user.balances,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/giveaways/:id/join
  async joinGiveaway(req, res, next) {
    try {
      const { id } = req.params;
      const { prizeId, explicitDeviceHash } = req.body || {};
      const user = req.user;

      // Idempotency Key check to prevent rapid repeated deductions
      const idempotencyKey = req.headers['x-idempotency-key'];
      if (idempotencyKey && store.idempotencyKeys.has(idempotencyKey)) {
        console.log(`[Idempotency] Returning cached response for key: ${idempotencyKey}`);
        return res.status(200).json(store.idempotencyKeys.get(idempotencyKey));
      }

      // 1. Authoritative Backend Lookup
      const giveaway = store.getGiveawayById(id);
      if (!giveaway) {
        return res.status(404).json({
          success: false,
          errorCode: 'GIVEAWAY_NOT_FOUND',
          message: 'Giveaway does not exist.',
        });
      }

      // 2. Authoritative Status & Server Time Validation
      const now = new Date();
      if (giveaway.status !== 'ACTIVE') {
        store.createAuditLog({
          userId: user.userId,
          action: 'JOIN_REJECTED',
          giveawayId: giveaway.giveawayId,
          result: 'GIVEAWAY_NOT_ACTIVE',
        });
        return res.status(400).json({
          success: false,
          errorCode: 'GIVEAWAY_NOT_ACTIVE',
          message: 'This giveaway is not currently active.',
        });
      }

      if (new Date(giveaway.endAt) < now) {
        store.createAuditLog({
          userId: user.userId,
          action: 'JOIN_REJECTED',
          giveawayId: giveaway.giveawayId,
          result: 'GIVEAWAY_ENDED',
        });
        return res.status(400).json({
          success: false,
          errorCode: 'GIVEAWAY_ENDED',
          message: 'This giveaway has ended. Check out the winners and get ready for the next giveaway.',
        });
      }

      // 3. Prize & Required Fee Resolution (FROM DATABASE, NEVER CLIENT BODY!)
      const targetPrizeId = prizeId || (giveaway.prizes[0] ? giveaway.prizes[0].prizeId : null);
      const prize = giveaway.prizes.find((p) => p.prizeId === targetPrizeId || p.slug === targetPrizeId);

      if (!prize) {
        return res.status(400).json({
          success: false,
          errorCode: 'INVALID_PRIZE',
          message: 'Selected prize configuration is not available.',
        });
      }

      const authoritativeCurrency = prize.entryCurrency; // 'VEs' | 'SVEs' | 'Tokens'
      const authoritativeFee = prize.entryFee; // e.g. 250

      // 4. Compound Unique Participation Check (userId + giveawayId)
      const existing = store.getParticipation(user.userId, giveaway.giveawayId);
      if (existing) {
        store.createAuditLog({
          userId: user.userId,
          action: 'DUPLICATE_ATTEMPT',
          giveawayId: giveaway.giveawayId,
          result: 'ALREADY_PARTICIPATING',
        });
        return res.status(409).json({
          success: false,
          errorCode: 'ALREADY_PARTICIPATING',
          message: "You're already participating! You can participate again when a new giveaway event begins.",
        });
      }

      // 5. Fraud Risk Evaluation Layer
      const deviceHash = fraudService.generateDeviceHash(req);
      const fraudAssessment = fraudService.evaluateRisk({
        user,
        giveawayId: giveaway.giveawayId,
        deviceHash,
        ipAddress: req.ip || req.connection.remoteAddress,
        explicitDeviceHash,
      });

      if (!fraudAssessment.isAllowed) {
        store.createAuditLog({
          userId: user.userId,
          action: 'FRAUD_FLAGGED',
          giveawayId: giveaway.giveawayId,
          result: 'PARTICIPATION_BLOCKED',
          securityInfo: fraudAssessment,
        });

        return res.status(403).json({
          success: false,
          errorCode: 'PARTICIPATION_BLOCKED',
          message: "Participation couldn't be completed. We couldn't verify this participation request. Please try again later or contact support if you believe this is an error.",
        });
      }

      // 6. User Authoritative Balance Verification
      const userBalance = user.balances[authoritativeCurrency] || 0;
      if (userBalance < authoritativeFee) {
        const deficit = authoritativeFee - userBalance;
        store.createAuditLog({
          userId: user.userId,
          action: 'JOIN_REJECTED',
          giveawayId: giveaway.giveawayId,
          result: `INSUFFICIENT_${authoritativeCurrency}_BALANCE`,
          amount: authoritativeFee,
          currency: authoritativeCurrency,
        });

        return res.status(400).json({
          success: false,
          errorCode: `INSUFFICIENT_${authoritativeCurrency.toUpperCase()}_BALANCE`,
          message: `Not enough ${authoritativeCurrency}. You need ${deficit} more ${authoritativeCurrency} to join this giveaway.`,
          required: authoritativeFee,
          available: userBalance,
          deficit,
          currency: authoritativeCurrency,
        });
      }

      // 7. Atomic Execution (Deduct currency + Create entry + Create Transaction + Audit)
      const result = store.createParticipationAtomic({
        userId: user.userId,
        giveawayId: giveaway.giveawayId,
        prizeId: prize.prizeId,
        currency: authoritativeCurrency,
        amount: authoritativeFee,
        deviceHash: explicitDeviceHash || deviceHash,
        ipAddress: req.ip,
      });

      const responsePayload = {
        success: true,
        message: "You're In! Your entry has been successfully recorded.",
        prize: {
          prizeId: prize.prizeId,
          name: prize.name,
          positionLabel: prize.positionLabel,
        },
        entryDetails: {
          feePaid: authoritativeFee,
          currency: authoritativeCurrency,
          transactionId: result.transaction.transactionId,
          balanceRemaining: result.newBalance,
          joinedAt: result.participation.joinedAt,
        },
        newBalances: user.balances,
      };

      // Cache response for idempotency
      if (idempotencyKey) {
        store.idempotencyKeys.set(idempotencyKey, responsePayload);
      }

      return res.status(201).json(responsePayload);
    } catch (error) {
      next(error);
    }
  },
};
