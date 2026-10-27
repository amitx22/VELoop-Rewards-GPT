import crypto from 'crypto';
import { store } from '../models/store.js';
import { config } from '../config/config.js';

// Cache to detect rapid click velocity per user/device
const velocityCache = new Map();

export const fraudService = {
  // Generate privacy-conscious hashed device fingerprint
  generateDeviceHash(req) {
    const rawSignals = [
      req.headers['user-agent'] || '',
      req.headers['accept-language'] || '',
      req.ip || req.connection.remoteAddress || '',
      config.deviceSalt,
    ].join('::');

    return crypto.createHash('sha256').update(rawSignals).digest('hex').substring(0, 24);
  },

  // Calculate Fraud Risk Score (0 - 100)
  evaluateRisk({ user, giveawayId, deviceHash, ipAddress, explicitDeviceHash }) {
    let riskScore = 0;
    const signals = [];
    const usedHash = explicitDeviceHash || deviceHash;

    // Signal 1: Account flagged suspicious by admin/security
    if (user.isSuspicious) {
      riskScore += 70;
      signals.push('ACCOUNT_PREVIOUSLY_FLAGGED_SUSPICIOUS');
    }

    // Signal 2: Request Velocity (Rapid fire requests within 1.5 seconds)
    const now = Date.now();
    const lastRequestTime = velocityCache.get(`${user.userId}_${giveawayId}`);
    if (lastRequestTime && now - lastRequestTime < 1500) {
      riskScore += 40;
      signals.push('EXCESSIVE_REQUEST_VELOCITY_RAPID_CLICK');
    }
    velocityCache.set(`${user.userId}_${giveawayId}`, now);

    // Signal 3: Multiple accounts from identical device
    const existingUserForDevice = store.getDeviceParticipationUser(usedHash, giveawayId);
    if (existingUserForDevice && existingUserForDevice !== user.userId) {
      riskScore += 55;
      signals.push(`MULTIPLE_ACCOUNTS_SAME_DEVICE_PREVIOUS_USER_${existingUserForDevice}`);
    }

    // Signal 4: Disposable / Malicious pattern check (e.g. testing flag)
    if (user.email && user.email.includes('suspicious')) {
      riskScore += 30;
      signals.push('SUSPICIOUS_EMAIL_DOMAIN_OR_PATTERN');
    }

    // Determine Risk Classification
    let riskLevel = 'LOW';
    let action = 'LOGGED';

    if (riskScore >= 80) {
      riskLevel = 'CRITICAL';
      action = 'BLOCKED';
    } else if (riskScore >= 60) {
      riskLevel = 'HIGH';
      action = 'BLOCKED';
    } else if (riskScore >= 30) {
      riskLevel = 'MEDIUM';
      action = 'FLAGGED';
    } else {
      riskLevel = 'LOW';
      action = 'LOGGED';
    }

    // Log FraudEvent if non-zero signals or high score
    if (riskScore >= 30) {
      store.createFraudEvent({
        userId: user.userId,
        giveawayId,
        deviceHash: usedHash,
        ipAddress,
        riskScore,
        riskClassification: riskLevel,
        reason: signals.join('; ') || 'EVALUATED_ANOMALOUS_SIGNALS',
        signals,
        action,
      });
    }

    return {
      riskScore,
      riskLevel,
      signals,
      action,
      isAllowed: action !== 'BLOCKED',
    };
  },
};
