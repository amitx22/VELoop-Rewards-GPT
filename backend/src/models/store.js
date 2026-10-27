import { v4 as uuidv4 } from 'uuid';

// In-Memory Database store with index enforcement, ACID transaction emulation, and audit tracking
class DataStore {
  constructor() {
    this.users = new Map();
    this.giveaways = new Map();
    this.participations = new Map(); // key: `${userId}_${giveawayId}`
    this.transactions = new Map();
    this.winners = new Map();
    this.claims = new Map();
    this.fraudEvents = new Map();
    this.auditLogs = new Map();
    this.deviceParticipationMap = new Map(); // key: `${deviceHash}_${giveawayId}` -> userId
    this.idempotencyKeys = new Map(); // key: idempotencyKey -> result
    this.initSeedData();
  }

  initSeedData() {
    // Seed Users
    const usersList = [
      {
        userId: 'VE10025',
        fullName: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        password: 'password123',
        role: 'USER',
        balances: { VEs: 850, SVEs: 1200, Tokens: 5000 },
        isSuspicious: false,
        deviceHashes: ['device_hash_user_10025'],
      },
      {
        userId: 'VE10042',
        fullName: 'Priya Patel',
        email: 'priya.patel@example.com',
        password: 'password123',
        role: 'USER',
        balances: { VEs: 350, SVEs: 800, Tokens: 3500 },
        isSuspicious: false,
        deviceHashes: ['device_hash_user_10042'],
      },
      {
        userId: 'VE10099',
        fullName: 'Amit Kumar (Low Balance Test)',
        email: 'amit.lowbalance@example.com',
        password: 'password123',
        role: 'USER',
        balances: { VEs: 50, SVEs: 40, Tokens: 200 },
        isSuspicious: false,
        deviceHashes: ['device_hash_user_10099'],
      },
      {
        userId: 'VE99999',
        fullName: 'Flagged Test Account',
        email: 'suspicious.user@example.com',
        password: 'password123',
        role: 'USER',
        balances: { VEs: 1000, SVEs: 2000, Tokens: 10000 },
        isSuspicious: true,
        deviceHashes: ['device_hash_suspicious'],
      },
      {
        userId: 'ADMIN01',
        fullName: 'VELOOP Admin',
        email: 'admin@veloop.io',
        password: 'adminpassword123',
        role: 'ADMIN',
        balances: { VEs: 99999, SVEs: 99999, Tokens: 99999 },
        isSuspicious: false,
        deviceHashes: ['admin_device_hash'],
      },
    ];

    usersList.forEach((u) => this.users.set(u.userId, { ...u, createdAt: new Date() }));

    // Prizes list for Active Giveaway
    const activePrizes = [
      {
        prizeId: 'PRIZE-001',
        slug: 'iphone-15-pro',
        name: 'iPhone 15 Pro (128GB)',
        position: 1,
        positionLabel: '1st Prize',
        image: '/assets/iphone-15-pro.jpg',
        description: 'Titanium design with A17 Pro chip and state-of-the-art camera system.',
        winnerCount: 1,
        type: 'PHYSICAL',
        claimType: 'SHIPPING_ADDRESS',
        entryFee: 250,
        entryCurrency: 'VEs',
        approxValue: '₹1,34,900',
        specs: ['128GB Storage', 'Natural Titanium', 'Super Retina XDR OLED', 'A17 Pro Bionic Chip'],
      },
      {
        prizeId: 'PRIZE-002',
        slug: 'apple-watch',
        name: 'Apple Watch Series 9',
        position: 2,
        positionLabel: '2nd Prize',
        image: '/assets/apple-watch.jpg',
        description: 'Powerful health monitoring, Double Tap gesture, and bright Always-On display.',
        winnerCount: 3,
        type: 'PHYSICAL',
        claimType: 'SHIPPING_ADDRESS',
        entryFee: 200,
        entryCurrency: 'VEs',
        approxValue: '₹41,900',
        specs: ['45mm Midnight Aluminum', 'S9 SiP with Double Tap', 'ECG & Blood Oxygen Apps', 'Water resistant 50m'],
      },
      {
        prizeId: 'PRIZE-003',
        slug: 'airpods-pro',
        name: 'AirPods Pro (2nd Gen)',
        position: 3,
        positionLabel: '3rd Prize',
        image: '/assets/airpods-pro.jpg',
        description: 'Next-level Active Noise Cancellation with Adaptive Audio and MagSafe USB-C case.',
        winnerCount: 5,
        type: 'PHYSICAL',
        claimType: 'SHIPPING_ADDRESS',
        entryFee: 500,
        entryCurrency: 'SVEs',
        approxValue: '₹24,900',
        specs: ['H2 Headphone chip', '2x Active Noise Cancellation', 'Personalized Spatial Audio', 'Up to 30h listening time'],
      },
      {
        prizeId: 'PRIZE-004',
        slug: 'amazon-2000',
        name: '₹2,000 Amazon Voucher',
        position: 4,
        positionLabel: 'Lucky Draw Tier 1',
        image: '/assets/amazon-voucher.jpg',
        description: 'Instant Amazon Pay gift card credited directly to your registered email address.',
        winnerCount: 10,
        type: 'GIFT_CARD',
        claimType: 'EMAIL_DELIVERY',
        entryFee: 500,
        entryCurrency: 'VEs',
        approxValue: '₹2,000',
        specs: ['Instant Digital Delivery', 'Valid for 1 Year', 'Redeemable on all Amazon products', 'Zero fees'],
      },
      {
        prizeId: 'PRIZE-005',
        slug: 'amazon-500',
        name: '₹500 Amazon Voucher',
        position: 5,
        positionLabel: 'Lucky Draw Tier 2',
        image: '/assets/amazon-voucher.jpg',
        description: 'Digital Amazon Pay gift card for seamless online shopping and bill payments.',
        winnerCount: 25,
        type: 'GIFT_CARD',
        claimType: 'EMAIL_DELIVERY',
        entryFee: 300,
        entryCurrency: 'VEs',
        approxValue: '₹500',
        specs: ['Fast Email Code', 'Valid across Amazon India', 'Instant balance addition'],
      },
      {
        prizeId: 'PRIZE-006',
        slug: 'amazon-20',
        name: '₹20 Quick Token Voucher',
        position: 6,
        positionLabel: 'Token Blitz Draw',
        image: '/assets/amazon-voucher.jpg',
        description: 'Micro-reward gift card claimable using platform activity tokens.',
        winnerCount: 100,
        type: 'GIFT_CARD',
        claimType: 'EMAIL_DELIVERY',
        entryFee: 2000,
        entryCurrency: 'Tokens',
        approxValue: '₹20',
        specs: ['Claimable with Activity Tokens', 'Direct code issuance', 'Instant validation'],
      },
    ];

    // Seed Active Giveaway (Ends in 12 days 8 hours 45 mins)
    const activeEndTime = new Date(Date.now() + 12 * 24 * 3600 * 1000 + 8 * 3600 * 1000 + 45 * 60 * 1000);
    const activeGiveaway = {
      giveawayId: 'GW-2026-08',
      slug: 'mega-tech-rewards',
      title: 'VELOOP Mega Tech & Rewards Rush 2026',
      subtitle: 'EXCLUSIVE GIVEAWAY',
      description: 'Complete eligible activities, collect entries, and get a chance to win premier electronics and instant Amazon vouchers.',
      status: 'ACTIVE',
      startAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      endAt: activeEndTime,
      participantsCount: 8540,
      totalGiveawaysCount: 24,
      prizesWonCount: 1240,
      participationSettings: {
        maxPerUser: 1,
        allowReentry: false,
      },
      rules: [
        'Open to verified VELOOP account holders aged 18 and older.',
        'Strict limit of ONE participation entry per user for this event.',
        'Required entry currency (VEs, SVEs, or Tokens) is verified and atomically deducted upon confirmation.',
        'Winner selection is conducted securely on backend servers via cryptographically verifiable random seed.',
        'Physical prize winners must submit delivery information within 7 calendar days of announcement.',
        'Fraudulent behavior, multiple accounts, or bot attempts will result in immediate disqualification and forfeiture.',
      ],
      eligibility: 'All active VELOOP members with verified email and good platform standing.',
      prizes: activePrizes,
    };
    this.giveaways.set(activeGiveaway.giveawayId, activeGiveaway);

    // Seed Ended Giveaway (August Reward Rush) with Winners
    const endedGiveaway = {
      giveawayId: 'GW-2026-07',
      slug: 'august-reward-rush',
      title: 'August Reward Rush',
      subtitle: 'COMPLETED EVENT',
      description: 'The premier August flagship giveaway event. All prizes finalized and ready for claims.',
      status: 'ENDED',
      startAt: new Date(Date.now() - 15 * 24 * 3600 * 1000),
      endAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      participantsCount: 9210,
      prizes: activePrizes.slice(0, 4),
      rules: ['Completed on August 10, 2026.'],
    };
    this.giveaways.set(endedGiveaway.giveawayId, endedGiveaway);

    // Seed Upcoming Giveaway
    const upcomingGiveaway = {
      giveawayId: 'GW-2026-09',
      slug: 'diwali-gold-gala',
      title: 'Diwali Tech & Gold Bonanza',
      subtitle: 'COMING SOON',
      description: 'Get ready for our most massive reward spectacle yet. Stay tuned for registration launch!',
      status: 'UPCOMING',
      startAt: new Date(Date.now() + 3 * 24 * 3600 * 1000),
      endAt: new Date(Date.now() + 18 * 24 * 3600 * 1000),
      participantsCount: 0,
      prizes: [activePrizes[0], activePrizes[1]],
      rules: ['Starts in 3 days. Prepare your VEs!'],
    };
    this.giveaways.set(upcomingGiveaway.giveawayId, upcomingGiveaway);

    // Seed Previous Winner Records
    const seedWinners = [
      {
        winnerId: 'WIN-001',
        giveawayId: 'GW-2026-07',
        giveawayName: 'August Reward Rush',
        prizeId: 'PRIZE-002',
        prizeName: 'Apple Watch Series 9',
        prizeType: 'PHYSICAL',
        userId: 'VE10025', // Matches our logged-in test user so they can test the claim modal!
        displayName: 'Rahul S. (VE****25)',
        selectionMethod: 'ALGORITHMIC_RANDOM',
        selectedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        claimDeadline: new Date(Date.now() + 5 * 24 * 3600 * 1000),
        status: 'NOT_CLAIMED',
      },
      {
        winnerId: 'WIN-002',
        giveawayId: 'GW-2026-07',
        giveawayName: 'August Reward Rush',
        prizeId: 'PRIZE-001',
        prizeName: 'iPhone 15 Pro',
        prizeType: 'PHYSICAL',
        userId: 'VE10072',
        displayName: 'User VE****72',
        selectionMethod: 'ALGORITHMIC_RANDOM',
        selectedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        claimDeadline: new Date(Date.now() + 5 * 24 * 3600 * 1000),
        status: 'CLAIM_SUBMITTED',
      },
      {
        winnerId: 'WIN-003',
        giveawayId: 'GW-2026-07',
        giveawayName: 'August Reward Rush',
        prizeId: 'PRIZE-003',
        prizeName: 'AirPods Pro',
        prizeType: 'PHYSICAL',
        userId: 'VE10054',
        displayName: 'User VE****54',
        selectionMethod: 'ALGORITHMIC_RANDOM',
        selectedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        claimDeadline: new Date(Date.now() + 5 * 24 * 3600 * 1000),
        status: 'COMPLETED',
      },
      {
        winnerId: 'WIN-004',
        giveawayId: 'GW-2026-07',
        giveawayName: 'August Reward Rush',
        prizeId: 'PRIZE-004',
        prizeName: '₹2,000 Amazon Voucher',
        prizeType: 'GIFT_CARD',
        userId: 'VE10092',
        displayName: 'User VE****92',
        selectionMethod: 'ALGORITHMIC_RANDOM',
        selectedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        claimDeadline: new Date(Date.now() + 5 * 24 * 3600 * 1000),
        status: 'COMPLETED',
      },
      // Previous Giveaway historical winners (Summer Rewards)
      {
        winnerId: 'WIN-005',
        giveawayId: 'GW-2026-06',
        giveawayName: 'Summer Rewards Carnival',
        prizeId: 'PRIZE-001',
        prizeName: 'iPhone 15 Pro',
        prizeType: 'PHYSICAL',
        userId: 'VE10082',
        displayName: 'User VE****82',
        selectionMethod: 'ALGORITHMIC_RANDOM',
        selectedAt: new Date('2026-08-05T12:00:00Z'),
        claimDeadline: new Date('2026-08-12T12:00:00Z'),
        status: 'COMPLETED',
      },
      {
        winnerId: 'WIN-006',
        giveawayId: 'GW-2026-06',
        giveawayName: 'Summer Rewards Carnival',
        prizeId: 'PRIZE-002',
        prizeName: 'Apple Watch Series 9',
        prizeType: 'PHYSICAL',
        userId: 'VE10042',
        displayName: 'User VE****42',
        selectionMethod: 'ALGORITHMIC_RANDOM',
        selectedAt: new Date('2026-08-06T14:30:00Z'),
        claimDeadline: new Date('2026-08-13T14:30:00Z'),
        status: 'COMPLETED',
      },
      {
        winnerId: 'WIN-007',
        giveawayId: 'GW-2026-06',
        giveawayName: 'Summer Rewards Carnival',
        prizeId: 'PRIZE-003',
        prizeName: 'AirPods Pro',
        prizeType: 'PHYSICAL',
        userId: 'VE10027',
        displayName: 'User VE****27',
        selectionMethod: 'ALGORITHMIC_RANDOM',
        selectedAt: new Date('2026-08-10T10:00:00Z'),
        claimDeadline: new Date('2026-08-17T10:00:00Z'),
        status: 'COMPLETED',
      },
    ];

    seedWinners.forEach((w) => this.winners.set(w.winnerId, w));
  }

  // User queries
  getUser(userId) {
    return this.users.get(userId);
  }

  updateUserBalance(userId, currency, newBalance) {
    const user = this.users.get(userId);
    if (user) {
      user.balances[currency] = newBalance;
      this.users.set(userId, user);
    }
    return user;
  }

  findUserByEmailOrId(query) {
    if (!query) return null;
    const qLower = query.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (
        u.userId.toLowerCase() === qLower ||
        (u.email && u.email.toLowerCase() === qLower)
      ) {
        return u;
      }
    }
    return null;
  }

  createUser({ fullName, email, password, role = 'USER' }) {
    // Check if email already registered
    const existing = this.findUserByEmailOrId(email);
    if (existing) {
      throw new Error('EMAIL_ALREADY_REGISTERED');
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const userId = `VE${randomSuffix}`;

    const newUser = {
      userId,
      fullName: fullName || `User ${randomSuffix}`,
      email: email.trim().toLowerCase(),
      password: password || 'password123',
      role,
      balances: {
        VEs: 300, // 300 VEs Welcome Bonus! Enough for iPhone or Apple Watch entry!
        SVEs: 500, // 500 SVEs for AirPods entry!
        Tokens: 2500, // 2500 Tokens for Amazon ₹20 entry!
      },
      isSuspicious: false,
      deviceHashes: [],
      createdAt: new Date(),
    };

    this.users.set(userId, newUser);
    return newUser;
  }

  // Giveaway queries
  getCurrentGiveaway() {
    for (const g of this.giveaways.values()) {
      if (g.status === 'ACTIVE') return g;
    }
    // Return first if none active
    return this.giveaways.values().next().value;
  }

  getGiveawayById(idOrSlug) {
    for (const g of this.giveaways.values()) {
      if (g.giveawayId === idOrSlug || g.slug === idOrSlug) return g;
    }
    return null;
  }

  getPreviousGiveaways() {
    const list = [];
    for (const g of this.giveaways.values()) {
      if (g.status === 'ENDED' || g.status === 'ARCHIVED') {
        list.push(g);
      }
    }
    return list;
  }

  getAllGiveaways() {
    return Array.from(this.giveaways.values());
  }

  setGiveawayStatus(giveawayId, status) {
    const g = this.giveaways.get(giveawayId);
    if (g) {
      g.status = status;
      this.giveaways.set(giveawayId, g);
      return g;
    }
    return null;
  }

  // Participations - COMPOUND KEY: `${userId}_${giveawayId}`
  getParticipation(userId, giveawayId) {
    return this.participations.get(`${userId}_${giveawayId}`) || null;
  }

  hasDeviceParticipated(deviceHash, giveawayId) {
    return this.deviceParticipationMap.has(`${deviceHash}_${giveawayId}`);
  }

  getDeviceParticipationUser(deviceHash, giveawayId) {
    return this.deviceParticipationMap.get(`${deviceHash}_${giveawayId}`);
  }

  // Atomic join execution with ACID simulation
  createParticipationAtomic({
    userId,
    giveawayId,
    prizeId,
    currency,
    amount,
    deviceHash,
    ipAddress,
  }) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const giveaway = this.giveaways.get(giveawayId);
    if (!giveaway) {
      throw new Error('GIVEAWAY_NOT_FOUND');
    }

    // Server-side authoritative status & time check
    const now = new Date();
    if (giveaway.status !== 'ACTIVE') {
      throw new Error(`GIVEAWAY_NOT_ACTIVE`);
    }
    if (new Date(giveaway.endAt) < now) {
      throw new Error('GIVEAWAY_ENDED');
    }
    if (new Date(giveaway.startAt) > now) {
      throw new Error('GIVEAWAY_NOT_STARTED');
    }

    // COMPOUND UNIQUE INDEX CHECK (userId + giveawayId)
    const participationKey = `${userId}_${giveawayId}`;
    if (this.participations.has(participationKey)) {
      throw new Error('ALREADY_PARTICIPATING');
    }

    // Verify balance
    const currentBalance = user.balances[currency] || 0;
    if (currentBalance < amount) {
      throw new Error(`INSUFFICIENT_${currency.toUpperCase()}_BALANCE`);
    }

    // Atomic execution:
    const balanceBefore = currentBalance;
    const balanceAfter = balanceBefore - amount;
    const transactionId = `TXN-${uuidv4().substring(0, 8).toUpperCase()}`;

    // 1. Deduct currency
    user.balances[currency] = balanceAfter;
    this.users.set(userId, user);

    // 2. Create Participation Record
    const participation = {
      userId,
      giveawayId,
      prizeId,
      entryCurrency: currency,
      entryAmount: amount,
      deviceHash,
      ipAddress,
      status: 'CONFIRMED',
      joinedAt: new Date(),
      transactionId,
    };
    this.participations.set(participationKey, participation);

    // 3. Increment giveaway participant counter
    giveaway.participantsCount = (giveaway.participantsCount || 0) + 1;
    this.giveaways.set(giveawayId, giveaway);

    // 4. Record device participation
    if (deviceHash) {
      this.deviceParticipationMap.set(`${deviceHash}_${giveawayId}`, userId);
    }

    // 5. Create Transaction Record
    const transaction = {
      transactionId,
      userId,
      giveawayId,
      prizeId,
      currency,
      amount,
      type: 'ENTRY_FEE',
      status: 'SUCCESS',
      balanceBefore,
      balanceAfter,
      createdAt: new Date(),
    };
    this.transactions.set(transactionId, transaction);

    // 6. Record Audit Log
    this.createAuditLog({
      userId,
      action: 'JOIN_GIVEAWAY',
      giveawayId,
      amount,
      currency,
      result: 'SUCCESS',
      requestIdentifier: transactionId,
      securityInfo: { deviceHash, ipAddress },
    });

    return {
      participation,
      transaction,
      newBalance: balanceAfter,
    };
  }

  // Winners queries
  getWinnersByGiveaway(giveawayId) {
    const results = [];
    for (const w of this.winners.values()) {
      if (w.giveawayId === giveawayId) results.push(w);
    }
    return results;
  }

  getAllPreviousWinners() {
    return Array.from(this.winners.values());
  }

  findWinner(giveawayId, userId) {
    for (const w of this.winners.values()) {
      if (w.giveawayId === giveawayId && w.userId === userId) {
        return w;
      }
    }
    return null;
  }

  addWinner(winner) {
    const id = winner.winnerId || `WIN-${uuidv4().substring(0, 8).toUpperCase()}`;
    const record = { ...winner, winnerId: id, selectedAt: new Date() };
    this.winners.set(id, record);
    return record;
  }

  updateWinnerStatus(winnerId, status) {
    const w = this.winners.get(winnerId);
    if (w) {
      w.status = status;
      this.winners.set(winnerId, w);
    }
    return w;
  }

  // Claims
  createPrizeClaim(claimData) {
    const claimId = `CLAIM-${uuidv4().substring(0, 8).toUpperCase()}`;
    const claim = {
      claimId,
      ...claimData,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    };
    this.claims.set(claimId, claim);
    return claim;
  }

  getClaimByWinner(giveawayId, userId) {
    for (const c of this.claims.values()) {
      if (c.giveawayId === giveawayId && c.userId === userId) {
        return c;
      }
    }
    return null;
  }

  // Fraud & Audit
  createFraudEvent(event) {
    const eventId = `FRD-${uuidv4().substring(0, 8).toUpperCase()}`;
    const record = { eventId, ...event, createdAt: new Date() };
    this.fraudEvents.set(eventId, record);
    return record;
  }

  createAuditLog(log) {
    const auditId = `AUD-${uuidv4().substring(0, 8).toUpperCase()}`;
    const record = { auditId, ...log, createdAt: new Date() };
    this.auditLogs.set(auditId, record);
    return record;
  }

  getAuditLogs() {
    return Array.from(this.auditLogs.values()).reverse().slice(0, 50);
  }

  getFraudEvents() {
    return Array.from(this.fraudEvents.values()).reverse().slice(0, 50);
  }
}

export const store = new DataStore();
