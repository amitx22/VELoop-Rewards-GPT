import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { Countdown } from '../Countdown/Countdown.jsx';
import styles from './GiveawayHero.module.css';
import {
  Sparkles, ArrowRight, CheckCircle2, Shield, Gift,
  Bell, Trophy, Flame, Zap, ChevronDown,
} from 'lucide-react';

export const GiveawayHero = () => {
  const { currentGiveaway, user, isAuthenticated } = useApp();
  const navigate = useNavigate();

  if (!currentGiveaway) return null;

  const isEnded = currentGiveaway.status === 'ENDED';
  const isUpcoming = currentGiveaway.status === 'UPCOMING';
  const isParticipating = currentGiveaway.userState?.isParticipating;

  const handleCtaClick = () => {
    if (isEnded) {
      document.getElementById('winners-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (isUpcoming) {
      alert('You will be notified as soon as this giveaway opens!');
      return;
    }
    document.getElementById('featured-rewards')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.heroSection}>
      {/* Layered backgrounds */}
      <div className={styles.heroBg} />
      <div className={styles.heroBgImage} />
      <div className={styles.heroOverlay} />
      <div className={styles.gridLines} />

      <div className={`container ${styles.heroContainer}`}>
        {/* ── LEFT: Content ── */}
        <div className={styles.contentCol}>
          {/* Season Badge */}
          <div className={styles.seasonBadge}>
            <span className={styles.badgeDot} />
            <Flame size={13} className={styles.badgeIcon} />
            <span className={styles.badgeText}>
              {isEnded
                ? 'Season 2026 • Concluded'
                : isUpcoming
                ? 'Season 2026 • Opening Soon'
                : 'Season 2026 • Exclusive Giveaway'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className={styles.mainHeading}>
            <span>VELOOP</span>
            <span className="gold-gradient-text">Elite Rewards</span>
            <span>Giveaway</span>
          </h1>

          {/* Supporting Text */}
          <p className={styles.supportingText}>
            Complete eligible platform activities, earn entries, and get a chance to win{' '}
            <strong>iPhone 15 Pro</strong>, <strong>Apple Watch Series 9</strong>, <strong>AirPods Pro</strong>,
            and instant Amazon vouchers.
          </p>

          {/* Feature Pills */}
          <div className={styles.featurePills}>
            <div className={styles.featurePill}>
              <Zap size={12} className={styles.iconCyan} />
              <span>Instant Entry Lock</span>
            </div>
            <div className={styles.featurePill}>
              <Shield size={12} className={styles.iconGold} />
              <span>100% Provably Fair</span>
            </div>
            <div className={styles.featurePill}>
              <Gift size={12} className={styles.iconEmerald} />
              <span>Doorstep Courier</span>
            </div>
          </div>

          {/* Countdown HUD Card */}
          <div className={styles.countdownCard}>
            <div className={styles.countdownHeaderRow}>
              <div className={styles.statusIndicator}>
                <span
                  className={`${styles.statusDot} ${
                    isEnded ? styles.statusEnded : isUpcoming ? styles.statusUpcoming : styles.statusLive
                  }`}
                />
                <span className={styles.statusLabel}>
                  {isEnded ? 'Event Concluded' : isUpcoming ? 'Opens Soon' : 'Live Draw Countdown'}
                </span>
              </div>
              <span className={styles.roundLabel}>Draw #08</span>
            </div>

            <Countdown
              targetDate={currentGiveaway.endAt}
              label={isEnded ? 'Event Ended' : 'Draw Locks In'}
            />
          </div>

          {/* CTA & State Actions */}
          <div className={styles.ctaWrapper}>
            <div className={styles.btnRow}>
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className={`${styles.primaryBtn} ${styles.goldBtn}`}
                >
                  <Sparkles size={17} />
                  <span>Sign In to Participate</span>
                  <ArrowRight size={17} />
                </button>
              ) : isParticipating ? (
                <div className={styles.participatingBadge}>
                  <CheckCircle2 size={24} className={styles.checkIcon} />
                  <div>
                    <span className={styles.participatingTitle}>Ticket Locked & Confirmed ✓</span>
                    <span className={styles.participatingSub}>
                      Entry verified with {currentGiveaway.userState?.participation?.entryAmount}{' '}
                      {currentGiveaway.userState?.participation?.entryCurrency} • Good Luck!
                    </span>
                  </div>
                </div>
              ) : isEnded ? (
                <button
                  onClick={handleCtaClick}
                  className={`${styles.primaryBtn} ${styles.purpleBtn}`}
                >
                  <Trophy size={17} />
                  <span>View Official Winners</span>
                  <ArrowRight size={17} />
                </button>
              ) : isUpcoming ? (
                <button
                  onClick={handleCtaClick}
                  className={`${styles.primaryBtn} ${styles.outlineBtn}`}
                >
                  <Bell size={17} />
                  <span>Notify Me When Live</span>
                </button>
              ) : (
                <button
                  onClick={handleCtaClick}
                  className={`${styles.primaryBtn} ${styles.goldBtn}`}
                >
                  <span>Enter Giveaway Draw</span>
                  <ArrowRight size={17} />
                </button>
              )}

              <button
                onClick={() => document.getElementById('featured-rewards')?.scrollIntoView({ behavior: 'smooth' })}
                className={styles.secondaryBtn}
              >
                <span>View Prizes</span>
                <ChevronDown size={15} />
              </button>
            </div>

            <div className={styles.trustMicro}>
              <Shield size={14} className={styles.shieldIcon} />
              <span>Cryptographically seeded • 1 entry per account • Anti-fraud protected</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Visual ── */}
        <div className={styles.visualCol}>
          <div className={styles.imageFrame}>
            <div className={styles.imageBackdropGlow} />

            <img
              src="/assets/hero-banner.jpg"
              alt="VELOOP Exclusive Rewards Giveaway"
              className={styles.heroImage}
              loading="eager"
            />

            <div className={styles.frameBorderHighlight} />

            {/* Grand Prize Pill */}
            <div className={`${styles.floatPill} ${styles.pillTopRight}`}>
              <div className={styles.pillIconWrapGold}>
                <Trophy size={15} />
              </div>
              <div>
                <div className={styles.pillTitle}>Grand Prize</div>
                <div className={styles.pillValue}>iPhone 15 Pro Titanium</div>
              </div>
            </div>

            {/* Live Activity Pill */}
            <div className={`${styles.floatPill} ${styles.pillBottomLeft}`}>
              <span className={styles.pillPulseDot} />
              <div>
                <div className={styles.pillTitle}>Live Activity</div>
                <div className={styles.pillValue}>8,500+ Participants</div>
              </div>
            </div>

            {/* Vault Pill */}
            <div className={`${styles.floatPill} ${styles.pillBottomRight}`}>
              <div className={styles.pillIconWrapEmerald}>
                <Gift size={15} />
              </div>
              <div>
                <div className={styles.pillTitle}>Verified Vault</div>
                <div className={styles.pillValue}>1,200+ Prizes Dispatched</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
