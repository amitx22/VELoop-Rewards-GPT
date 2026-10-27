import mongoose from 'mongoose';

// 1. Giveaway Schema
export const GiveawaySchema = new mongoose.Schema(
  {
    giveawayId: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['UPCOMING', 'ACTIVE', 'ENDED', 'ARCHIVED'],
      default: 'ACTIVE',
    },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    rules: [{ type: String }],
    eligibility: { type: String },
    participantsCount: { type: Number, default: 0 },
    participationSettings: {
      maxPerUser: { type: Number, default: 1 },
      allowReentry: { type: Boolean, default: false },
    },
    prizes: [
      {
        prizeId: { type: String, required: true },
        name: { type: String, required: true },
        position: { type: Number, required: true },
        positionLabel: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        winnerCount: { type: Number, default: 1 },
        type: {
          type: String,
          enum: ['PHYSICAL', 'GIFT_CARD', 'DIGITAL'],
          required: true,
        },
        claimType: {
          type: String,
          enum: ['SHIPPING_ADDRESS', 'EMAIL_DELIVERY', 'INSTANT_CODE'],
          required: true,
        },
        entryFee: { type: Number, required: true },
        entryCurrency: {
          type: String,
          enum: ['VEs', 'SVEs', 'Tokens'],
          required: true,
        },
        approxValue: { type: String },
        specs: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

// 2. Giveaway Participation Schema (Compound Unique Index userId + giveawayId)
export const GiveawayParticipationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    giveawayId: { type: String, required: true },
    prizeId: { type: String, required: true },
    entryCurrency: { type: String, required: true },
    entryAmount: { type: Number, required: true },
    deviceHash: { type: String, required: true },
    ipAddress: { type: String },
    status: {
      type: String,
      enum: ['CONFIRMED', 'FLAGGED', 'REVOKED'],
      default: 'CONFIRMED',
    },
    joinedAt: { type: Date, default: Date.now },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

// COMPOUND UNIQUE INDEX: Enforces 1 participation per user per giveaway at DB level!
GiveawayParticipationSchema.index({ userId: 1, giveawayId: 1 }, { unique: true });

// 3. Giveaway Entry Transaction Schema
export const GiveawayEntryTransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    giveawayId: { type: String, required: true },
    prizeId: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ['ENTRY_FEE', 'REVERSAL'],
      default: 'ENTRY_FEE',
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REVERSED'],
      default: 'SUCCESS',
    },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 4. Giveaway Winner Schema
export const GiveawayWinnerSchema = new mongoose.Schema(
  {
    giveawayId: { type: String, required: true },
    prizeId: { type: String, required: true },
    userId: { type: String, required: true },
    displayName: { type: String, required: true },
    prizeName: { type: String, required: true },
    prizeType: { type: String, required: true },
    selectionMethod: {
      type: String,
      enum: ['ALGORITHMIC_RANDOM', 'MANUAL_VERIFIED'],
      default: 'ALGORITHMIC_RANDOM',
    },
    selectedAt: { type: Date, default: Date.now },
    claimDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['NOT_CLAIMED', 'CLAIM_SUBMITTED', 'PROCESSING', 'COMPLETED', 'EXPIRED'],
      default: 'NOT_CLAIMED',
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate winner records
GiveawayWinnerSchema.index({ giveawayId: 1, prizeId: 1, userId: 1 }, { unique: true });

// 5. Prize Claim Schema
export const PrizeClaimSchema = new mongoose.Schema(
  {
    claimId: { type: String, required: true, unique: true },
    giveawayId: { type: String, required: true },
    prizeId: { type: String, required: true },
    userId: { type: String, required: true },
    prizeType: { type: String, required: true },
    shippingDetails: {
      fullName: String,
      phoneNumber: String,
      completeAddress: String,
      city: String,
      state: String,
      pinCode: String,
    },
    emailDetails: {
      emailAddress: String,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'VERIFYING', 'DISPATCHED', 'COMPLETED'],
      default: 'SUBMITTED',
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 6. Fraud Event Schema
export const FraudEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    giveawayId: { type: String, required: true },
    deviceHash: { type: String, required: true },
    ipAddress: { type: String },
    riskScore: { type: Number, required: true },
    riskClassification: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
    },
    reason: { type: String, required: true },
    signals: [{ type: String }],
    action: {
      type: String,
      enum: ['LOGGED', 'FLAGGED', 'BLOCKED'],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 7. Audit Log Schema
export const AuditLogSchema = new mongoose.Schema(
  {
    auditId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    action: {
      type: String,
      enum: [
        'JOIN_GIVEAWAY',
        'ENTRY_FEE_DEDUCTED',
        'JOIN_REJECTED',
        'DUPLICATE_ATTEMPT',
        'FRAUD_FLAGGED',
        'CLAIM_SUBMITTED',
        'WINNER_SELECTED',
      ],
      required: true,
    },
    giveawayId: { type: String },
    amount: { type: Number },
    currency: { type: String },
    result: { type: String, required: true },
    requestIdentifier: { type: String },
    securityInfo: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 8. User Schema
export const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    balances: {
      VEs: { type: Number, default: 0 },
      SVEs: { type: Number, default: 0 },
      Tokens: { type: Number, default: 0 },
    },
    deviceHashes: [{ type: String }],
    isSuspicious: { type: Boolean, default: false },
  },
  { timestamps: true }
);
