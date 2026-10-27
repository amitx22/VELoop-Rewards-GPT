import { store } from '../models/store.js';

export const claimController = {
  // GET /api/giveaways/:id/my-claim
  getMyClaim(req, res) {
    try {
      const { id } = req.params;
      const giveaway = store.getGiveawayById(id);
      if (!giveaway) {
        return res.status(404).json({ success: false, message: 'Giveaway not found' });
      }

      const winnerRecord = store.findWinner(giveaway.giveawayId, req.user.userId);
      if (!winnerRecord) {
        return res.json({
          success: true,
          isWinner: false,
          message: "You did not win in this giveaway event. Keep participating for the next one!",
        });
      }

      const existingClaim = store.getClaimByWinner(giveaway.giveawayId, req.user.userId);

      return res.json({
        success: true,
        isWinner: true,
        winner: {
          winnerId: winnerRecord.winnerId,
          prizeName: winnerRecord.prizeName,
          prizeType: winnerRecord.prizeType,
          status: winnerRecord.status,
          claimDeadline: winnerRecord.claimDeadline,
        },
        claim: existingClaim || null,
        claimStatus: existingClaim ? existingClaim.status : 'NOT_SUBMITTED',
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/giveaways/:id/claim
  submitClaim(req, res) {
    try {
      const { id } = req.params;
      const giveaway = store.getGiveawayById(id);
      if (!giveaway) {
        return res.status(404).json({ success: false, message: 'Giveaway not found' });
      }

      // Security Check: Authenticated User MUST match winner in DB
      const winner = store.findWinner(giveaway.giveawayId, req.user.userId);
      if (!winner) {
        store.createAuditLog({
          userId: req.user.userId,
          action: 'CLAIM_SUBMITTED',
          giveawayId: giveaway.giveawayId,
          result: 'CLAIM_NOT_ALLOWED',
        });

        return res.status(403).json({
          success: false,
          errorCode: 'CLAIM_NOT_ALLOWED',
          message: 'You are not listed as a verified winner for this giveaway event.',
        });
      }

      if (winner.status === 'COMPLETED' || winner.status === 'CLAIM_SUBMITTED') {
        return res.status(400).json({
          success: false,
          errorCode: 'CLAIM_ALREADY_SUBMITTED',
          message: 'Your prize claim has already been received and is being processed.',
        });
      }

      const { shippingDetails, emailDetails } = req.body;

      // Prize-Type-Specific Validation
      if (winner.prizeType === 'PHYSICAL') {
        if (
          !shippingDetails ||
          !shippingDetails.fullName ||
          !shippingDetails.phoneNumber ||
          !shippingDetails.completeAddress ||
          !shippingDetails.city ||
          !shippingDetails.state ||
          !shippingDetails.pinCode
        ) {
          return res.status(400).json({
            success: false,
            errorCode: 'MISSING_SHIPPING_DETAILS',
            message: 'All physical shipping fields (Full Name, Phone, Address, City, State, PIN) are required.',
          });
        }
      } else if (winner.prizeType === 'GIFT_CARD' || winner.prizeType === 'DIGITAL') {
        if (!emailDetails || !emailDetails.emailAddress || !emailDetails.emailAddress.includes('@')) {
          return res.status(400).json({
            success: false,
            errorCode: 'MISSING_EMAIL_DETAILS',
            message: 'A valid email address is required for digital gift card fulfillment.',
          });
        }
      }

      // Record Claim
      const claim = store.createPrizeClaim({
        giveawayId: giveaway.giveawayId,
        prizeId: winner.prizeId,
        userId: req.user.userId,
        prizeType: winner.prizeType,
        shippingDetails: winner.prizeType === 'PHYSICAL' ? shippingDetails : undefined,
        emailDetails: winner.prizeType !== 'PHYSICAL' ? emailDetails : undefined,
      });

      // Update Winner Status
      store.updateWinnerStatus(winner.winnerId, 'CLAIM_SUBMITTED');

      // Audit Log
      store.createAuditLog({
        userId: req.user.userId,
        action: 'CLAIM_SUBMITTED',
        giveawayId: giveaway.giveawayId,
        result: 'SUCCESS',
        requestIdentifier: claim.claimId,
      });

      return res.status(201).json({
        success: true,
        message: 'Claim submitted successfully! Our fulfillment team will process your prize.',
        claim,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
