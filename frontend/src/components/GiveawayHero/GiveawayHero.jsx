import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { Countdown } from '../Countdown/Countdown.jsx';
import styles from './GiveawayHero.module.css';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Shield,
  Gift,
  Bell,
  Trophy,
  Flame,
  Zap,
  Coins,
  ChevronDown,
} from 'lucide-react';

export const GiveawayHero = () => {
  const { currentGiveaway, user, isAuthenticated } = useApp();
  const navigate = useNavigate();

  if (!currentGiveaway) return null;

  const isEnded = currentGiveaway.status === 'ENDED';
  const isUpcoming = currentGiveaway.status === 'UPCOMING';
  const isParticipating = currentGiveaway.userState?.isParticipating;

  // Primary CTA click action
  const handleCtaClick = () => {
    if (isEnded) {
      const el = document.getElementById('winners-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (isUpcoming) {
      alert('You will be notified as soon as this giveaway opens for entry!');
      return;
    }

    // Direct user to first featured prize or prizes section
    const el = document.getElementById('featured-rewards');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.heroSection}>
      {/* Background Cyber Glow Ambience */}
      <div className={styles.ambientGlowPrimary}></div>
      <div className={styles.ambientGlowSecondary}></div>

      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.contentCol}>
          {/* Top Gaming Badge */}
          <div className={styles.badgeWrapper}>
            <span className={styles.badgePulse}></span>
            <Flame size={14} className={styles.badgeIcon} />
            <span className={styles.badgeText}>
              {isEnded
                ? 'SEASON 2026 • CONCLUDED'
                : isUpcoming
                ? 'SEASON 2026 • UPCOMING DROP'
                : 'SEASON 2026 • EXCLUSIVE VAULT DROP'}
            </span>
          </div>

          {/* Main Epic Heading */}
          <h1 className={styles.mainHeading}>
            VELOOP <span className="gold-gradient-text">Elite Rewards</span> Giveaway
          </h1>

          {/* Supporting Text */}
          <p className={styles.supportingText}>
            Collect platform entries through challenges, unlock cryptographic draw tickets, and win
            the flagship <strong>iPhone 15 Pro Titanium</strong>, <strong>Apple Watch Series 9</strong>,
            and instant Amazon Pay vouchers.
          </p>

          {/* Quick Highlight Pills */}
          <div className={styles.featurePills}>
            <div className={styles.featurePill}>
              <Zap size={13} className={styles.featIconCyan} />
              <span>Instant Entry Locking</span>
            </div>
            <div className={styles.featurePill}>
              <Shield size={13} className={styles.featIconGold} />
              <span>100% Provably Fair</span>
            </div>
            <div className={styles.featurePill}>
              <Gift size={13} className={styles.featIconEmerald} />
              <span>Doorstep Courier</span>
            </div>
          </div>

          {/* Status & Live Countdown HUD */}
          <div className={styles.countdownCard}>
            <div className={styles.countdownHeaderRow}>
              <div className={styles.statusIndicator}>
                <span
                  className={`${styles.statusDot} ${
                    isEnded ? styles.statusEnded : isUpcoming ? styles.statusUpcoming : styles.statusLive
                  }`}
                ></span>
                <span className={styles.statusLabel}>
                  {isEnded ? 'EVENT CONCLUDED' : isUpcoming ? 'OPENS IN' : 'LIVE DRAW COUNTDOWN'}
                </span>
              </div>
              <span className={styles.roundLabel}>Draw Round #08</span>
            </div>

            <Countdown
              targetDate={currentGiveaway.endAt}
              label={isEnded ? 'Event Ended' : 'Draw Locks In'}
            />
          </div>

          {/* Interactive CTA & State Feedback */}
          <div className={styles.ctaWrapper}>
            <div className={styles.btnRow}>
              {!isAuthenticated ? (
                <button
                  id="hero-join-cta"
                  onClick={() => navigate('/login')}
                  className={`${styles.primaryBtn} ${styles.goldBtn}`}
                >
                  <Sparkles size={18} />
                  <span>Sign In to Participate</span>
                  <ArrowRight size={18} />
                </button>
              ) : isParticipating ? (
                <div className={styles.participatingBadge}>
                  <CheckCircle2 size={24} className={styles.checkIcon} />
                  <div className={styles.participatingTextGroup}>
                    <span className={styles.participatingTitle}>Ticket Locked & Confirmed ✓</span>
                    <span className={styles.participatingSub}>
                      Entry verified with {currentGiveaway.userState?.participation?.entryAmount}{' '}
                      {currentGiveaway.userState?.participation?.entryCurrency} • Good Luck!
                    </span>
                  </div>
                </div>
              ) : isEnded ? (
                <button
                  id="hero-winners-cta"
                  onClick={handleCtaClick}
                  className={`${styles.primaryBtn} ${styles.purpleBtn}`}
                >
                  <Trophy size={18} />
                  <span>View Official Winners</span>
                  <ArrowRight size={18} />
                </button>
              ) : isUpcoming ? (
                <button
                  id="hero-notify-cta"
                  onClick={handleCtaClick}
                  className={`${styles.primaryBtn} ${styles.outlineBtn}`}
                >
                  <Bell size={18} />
                  <span>Notify Me When Live</span>
                </button>
              ) : (
                <button
                  id="hero-enter-cta"
                  onClick={handleCtaClick}
                  className={`${styles.primaryBtn} ${styles.goldBtn}`}
                >
                  <span>Enter Giveaway Draw</span>
                  <ArrowRight size={18} />
                </button>
              )}

              <button
                onClick={() => {
                  const el = document.getElementById('featured-rewards');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={styles.secondaryBtn}
              >
                <span>View Prizes</span>
                <ChevronDown size={16} />
              </button>
            </div>

            <div className={styles.trustMicro}>
              <Shield size={15} className={styles.shieldIcon} />
              <span>Cryptographically Seeded • 1 Entry Per Account • Anti-Fraud Protected</span>
            </div>
          </div>
        </div>

        {/* Visual Hero Showcase */}
        <div className={styles.visualCol}>
          <div className={styles.imageBackdropGlow}></div>
          <div className={styles.cyberRingOuter}></div>
          
          <div className={styles.imageFrame}>
            <img
              src="/assets/hero-banner.jpg"
              alt="VELOOP Exclusive Rewards Giveaway Showcase"
              className={styles.heroImage}
              loading="eager"
            />

            {/* Glowing Accent Overlay Border */}
            <div className={styles.frameBorderHighlight}></div>

            {/* Floating Info Pill 1 */}
            <div className={`${styles.floatPill} ${styles.pillTopLeft}`}>
              <div className={styles.pillIconWrapGold}>
                <Trophy size={16} />
              </div>
              <div>
                <div className={styles.pillTitle}>Grand Prize</div>
                <div className={styles.pillValue}>iPhone 15 Pro Titanium</div>
              </div>
            </div>

            {/* Floating Info Pill 2 */}
            <div className={`${styles.floatPill} ${styles.pillBottomRight}`}>
              <div className={styles.pillIconWrapEmerald}>
                <Gift size={16} />
              </div>
              <div>
                <div className={styles.pillTitle}>Verified Vault</div>
                <div className={styles.pillValue}>1,200+ Prizes Dispatched</div>
              </div>
            </div>

            {/* Floating Live Contenders Pill */}
            <div className={`${styles.floatPill} ${styles.pillBottomLeft}`}>
              <div className={styles.pillPulseDot}></div>
              <div>
                <div className={styles.pillTitle}>Live Activity</div>
                <div className={styles.pillValue}>8,500+ Participants</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};