import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { Countdown } from '../../components/Countdown/Countdown.jsx';
import { EntryConfirmationModal } from '../../components/EntryConfirmationModal/EntryConfirmationModal.jsx';
import { ThemedLoader } from '../../components/ThemedLoader/ThemedLoader.jsx';
import styles from './GiveawayDetail.module.css';
import {
  ArrowLeft,
  Shield,
  Coins,
  Zap,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trophy,
  ChevronRight,
  FileCheck,
  Check,
  ExternalLink,
  Sparkles,
  Flame,
} from 'lucide-react';

const HOW_WORKS_STEPS = [
  { num: '01', title: 'Review the Giveaway', desc: 'Inspect prize specifications, draw schedule, and winner limits.' },
  { num: '02', title: 'Check Your Eligibility', desc: 'Verify your account status and required virtual currency.' },
  { num: '03', title: 'Pay Required Entry Amount', desc: 'Authoritative server deduction locks your official draw ticket.' },
  { num: '04', title: 'Participation Recorded', desc: 'Your entry transaction ID is permanently logged into the audit ledger.' },
  { num: '05', title: 'Wait Until Giveaway Ends', desc: 'Live countdown ticks down until final draw execution.' },
  { num: '06', title: 'Winner is Selected', desc: 'Cryptographically seeded random algorithm finalizes the winner.' },
  { num: '07', title: 'Winner Claims Prize', desc: 'Physical shipment or digital voucher issued within 7 days.' },
];

export const GiveawayDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentGiveaway, user, isAuthenticated, handleSwitchUser, handleAddBalance } = useApp();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Find the prize matching the slug or prizeId
  const prize = currentGiveaway?.prizes?.find(
    (p) => p.slug === slug || p.prizeId === slug
  ) || currentGiveaway?.prizes?.[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!currentGiveaway || !prize) {
    return <ThemedLoader fullScreen />;
  }

  const currency = prize.entryCurrency || 'VEs';
  const entryFee = prize.entryFee || 0;
  const userBalance = user?.balances?.[currency] || 0;
  const hasEnough = userBalance >= entryFee;
  const deficit = entryFee - userBalance;
  const isParticipating = currentGiveaway.userState?.isParticipating;
  const isEnded = currentGiveaway.status === 'ENDED';

  const getCurrencyIcon = (cur) => {
    switch (cur) {
      case 'SVEs':
        return <Zap size={16} className={styles.iconCyan} />;
      case 'Tokens':
        return <Award size={16} className={styles.iconEmerald} />;
      case 'VEs':
      default:
        return <Coins size={16} className={styles.iconGold} />;
    }
  };

  const specsList = Array.isArray(prize.specs)
    ? prize.specs
    : typeof prize.specs === 'string'
    ? prize.specs.split(/(?<=[a-z0-9])\s+(?=[A-Z0-9])|,\s*|\n/)
    : [];

  return (
    <div className={styles.pageWrapper}>
      {/* Top Breadcrumb Navigation */}
      <div className={styles.navBar}>
        <div className={`container ${styles.navBarContainer}`}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Giveaway Home</span>
          </Link>
          <div className={styles.breadcrumb}>
            <span>Rewards Catalog</span>
            <ChevronRight size={14} />
            <span className={styles.crumbCurrent}>{prize.name}</span>
          </div>
        </div>
      </div>

      <div className={`container ${styles.detailContainer}`}>
        {/* Main Hero Section: 2 Columns on Desktop */}
        <div className={styles.heroGrid}>
          {/* Left Column: Visual Showcase */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageGlow}></div>
              <div className={styles.pedestalStage}></div>
              <img src={prize.image} alt={prize.name} className={styles.prizeImage} />
              
              <div className={styles.positionTag}>
                <Trophy size={14} className={styles.trophyIcon} />
                <span>{prize.positionLabel}</span>
              </div>
            </div>

            {/* Quick Specs Card */}
            {specsList.length > 0 && (
              <div className={styles.specsCard}>
                <div className={styles.specsHeader}>
                  <Sparkles size={14} className={styles.specsStar} />
                  <span className={styles.specsTitle}>Technical Highlights</span>
                </div>
                <ul className={styles.specsList}>
                  {specsList.map((spec, i) => (
                    <li key={i}>
                      <Check size={14} className={styles.specCheck} />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Giveaway Information & Action Card */}
          <div className={styles.infoCol}>
            {/* Giveaway Badges */}
            <div className={styles.badgeRow}>
              <span className={styles.exclusiveBadge}>
                <Flame size={13} />
                <span>EXCLUSIVE VAULT DROP</span>
              </span>
              <span className={styles.liveBadge}>
                <span className={styles.dot}></span>
                <span>{currentGiveaway.status === 'ACTIVE' ? 'GIVEAWAY LIVE' : currentGiveaway.status}</span>
              </span>
            </div>

            <h1 className={styles.prizeTitle}>Win {prize.name}</h1>
            <p className={styles.prizeDesc}>{prize.description}</p>

            {/* Meta Row: Winners, Participants, Approx Value */}
            <div className={styles.metaBox}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Winners</span>
                <span className={styles.metaValue}>
                  {prize.winnerCount === 1 ? '1 Winner' : `${prize.winnerCount} Winners`}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Participants</span>
                <span className={styles.metaValue}>2.3K+ Verified</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Approx Value</span>
                <span className={styles.metaValueGold}>{prize.approxValue || 'Exclusive'}</span>
              </div>
            </div>

            {/* Countdown Bar */}
            <div className={styles.countdownBox}>
              <Countdown targetDate={currentGiveaway.endAt} label="Draw Ends In" />
            </div>

            {/* Price & Balance Verification Area */}
            <div className={styles.participationCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardHeaderTitle}>Entry Verification & Balance</span>
                <span className={styles.singleEntryTag}>1 Entry Per Account</span>
              </div>

              <div className={styles.feeVerificationRow}>
                <div className={styles.feeBlock}>
                  <span className={styles.feeBlockLabel}>Required Entry Fee</span>
                  <div className={styles.feeNumber}>
                    {getCurrencyIcon(currency)}
                    <span>{entryFee?.toLocaleString()}</span>
                    <span className={styles.currencySuffix}>{currency}</span>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className={styles.balanceBlock}>
                    <span className={styles.feeBlockLabel}>Your Available Balance</span>
                    <div className={styles.balanceNumber}>
                      <span>{userBalance?.toLocaleString()}</span>
                      <span className={styles.currencySuffix}>{currency}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Message based on user state */}
              {!isAuthenticated ? (
                <div className={styles.stateNotice}>
                  <AlertTriangle size={16} className={styles.warnIcon} />
                  <span>Please sign in or create a VELOOP account to participate.</span>
                </div>
              ) : isParticipating ? (
                <div className={styles.alreadyParticipatingNotice}>
                  <CheckCircle2 size={20} className={styles.greenCheck} />
                  <div>
                    <strong>You're Already Participating ✓</strong>
                    <p>Your official draw ticket has already been recorded for this event.</p>
                  </div>
                </div>
              ) : hasEnough ? (
                <div className={styles.eligibleNotice}>
                  <CheckCircle2 size={16} className={styles.greenCheck} />
                  <span>✓ You have enough {currency} to join this giveaway.</span>
                </div>
              ) : (
                <div className={styles.insufficientNotice}>
                  <AlertTriangle size={16} className={styles.redWarn} />
                  <span>
                    Insufficient {currency}. You need <strong>{deficit} more {currency}</strong> to participate.
                  </span>
                </div>
              )}

              {/* Dynamic Action CTA Button */}
              <div className={styles.actionBtnWrapper}>
                {!isAuthenticated ? (
                  <button
                    id="btn-login-detail"
                    onClick={() =>
                      navigate(`/login?redirect=/giveaway/${prize.slug || prize.prizeId}`)
                    }
                    className={`${styles.mainCtaBtn} ${styles.goldBtn}`}
                  >
                    <span>Sign In to Participate</span>
                  </button>
                ) : isParticipating ? (
                  <button disabled className={`${styles.mainCtaBtn} ${styles.disabledBtn}`}>
                    <CheckCircle2 size={18} />
                    <span>Participation Confirmed</span>
                  </button>
                ) : isEnded ? (
                  <button
                    onClick={() => navigate('/winners')}
                    className={`${styles.mainCtaBtn} ${styles.blueBtn}`}
                  >
                    <span>View Winners Announcement</span>
                  </button>
                ) : !hasEnough ? (
                  <button
                    id="btn-earn-more"
                    onClick={() => handleAddBalance(currency, deficit + 100)}
                    className={`${styles.mainCtaBtn} ${styles.earnMoreBtn}`}
                  >
                    <span>Earn More {currency} (Click to Simulate +{deficit + 100})</span>
                  </button>
                ) : (
                  <button
                    id="btn-join-giveaway-detail"
                    onClick={() => setConfirmModalOpen(true)}
                    className={`${styles.mainCtaBtn} ${styles.goldBtn}`}
                  >
                    <span>Join Giveaway – {entryFee} {currency}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section: How This Giveaway Works */}
        <div className={styles.howItWorksSection}>
          <div className={styles.secHeader}>
            <h2 className={styles.secTitle}>How This Giveaway Works</h2>
            <p className={styles.secSub}>Step-by-step lifecycle from ticket locking to doorstep delivery.</p>
          </div>

          <div className={styles.stepsTimeline}>
            {HOW_WORKS_STEPS.map((s) => (
              <div key={s.num} className={styles.stepItem}>
                <div className={styles.stepNumPill}>{s.num}</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepHeading}>{s.title}</h4>
                  <p className={styles.stepParagraph}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Important Terms & Conditions */}
        <div className={styles.termsSection}>
          <div className={styles.secHeader}>
            <h2 className={styles.secTitle}>Important Terms & Conditions</h2>
            <p className={styles.secSub}>Please review the giveaway rules and participation requirements carefully.</p>
          </div>

          <div className={styles.termsGrid}>
            <div className={styles.termCard}>
              <div className={styles.termTitle}>Eligibility</div>
              <p>
                Open to all verified VELOOP account holders. You must maintain good platform standing
                without fraudulent or bot flags.
              </p>
            </div>

            <div className={styles.termCard}>
              <div className={styles.termTitle}>Entry Requirement</div>
              <p>
                Participation requires precisely <strong>{entryFee} {currency}</strong>, deducted atomically upon entry confirmation.
              </p>
            </div>

            <div className={styles.termCard}>
              <div className={styles.termTitle}>Single Entry Policy</div>
              <p>
                Strict limit of ONE participation entry per user and per unique device fingerprint for this event.
              </p>
            </div>

            <div className={styles.termCard}>
              <div className={styles.termTitle}>Winner Selection</div>
              <p>
                Server-side algorithmic random selection occurs immediately upon countdown completion.
              </p>
            </div>

            <div className={styles.termCard}>
              <div className={styles.termTitle}>Prize Claim Deadline</div>
              <p>
                Winners are notified in their portal and have <strong>7 calendar days</strong> to submit shipping details.
              </p>
            </div>

            <div className={styles.termCard}>
              <div className={styles.termTitle}>Disqualification Policy</div>
              <p>
                Multiple accounts, synthetic fingerprints, or unauthorized API scripts result in forfeiture and suspension.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <EntryConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        prize={prize}
        giveawayId={currentGiveaway.giveawayId}
        onSuccess={() => {
          // Handled inside modal with celebratory feedback
        }}
      />
    </div>
  );
};