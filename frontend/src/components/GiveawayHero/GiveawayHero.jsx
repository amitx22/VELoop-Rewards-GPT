import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { Countdown } from '../Countdown/Countdown.jsx';
import styles from './GiveawayHero.module.css';
import { Sparkles, ArrowRight, CheckCircle2, Shield, Gift, Bell, Trophy } from 'lucide-react';

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
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.contentCol}>
          {/* Label Badge */}
          <div className={styles.badgeWrapper}>
            <span className={styles.badgePulse}></span>
            <Sparkles size={14} className={styles.badgeIcon} />
            <span className={styles.badgeText}>
              {isEnded ? 'GIVEAWAY CONCLUDED' : isUpcoming ? 'UPCOMING GIVEAWAY' : 'EXCLUSIVE GIVEAWAY'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className={styles.mainHeading}>
            VELOOP <span className="gold-gradient-text">Rewards</span> Giveaway
          </h1>

          {/* Supporting Text */}
          <p className={styles.supportingText}>
            Complete eligible activities, collect entries and get an authentic chance to win the latest
            iPhone 15 Pro, Apple Watch, AirPods, and instant Amazon Pay gift cards.
          </p>

          {/* Status & Live Countdown */}
          <div className={styles.countdownCard}>
            <div className={styles.statusIndicator}>
              <span
                className={`${styles.statusDot} ${
                  isEnded ? styles.statusEnded : isUpcoming ? styles.statusUpcoming : styles.statusLive
                }`}
              ></span>
              <span className={styles.statusLabel}>
                {isEnded ? 'EVENT CONCLUDED' : isUpcoming ? 'STARTS IN' : 'GIVEAWAY LIVE'}
              </span>
            </div>

            <Countdown
              targetDate={currentGiveaway.endAt}
              label={isEnded ? 'Event Ended' : 'Giveaway Ends In'}
            />
          </div>

          {/* Interactive CTA & State Feedback */}
          <div className={styles.ctaWrapper}>
            {!isAuthenticated ? (
              <button
                id="hero-join-cta"
                onClick={handleCtaClick}
                className={`${styles.primaryBtn} ${styles.goldBtn}`}
              >
                <span>Login to Participate</span>
                <ArrowRight size={18} />
              </button>
            ) : isParticipating ? (
              <div className={styles.participatingBadge}>
                <CheckCircle2 size={20} className={styles.checkIcon} />
                <div className={styles.participatingTextGroup}>
                  <span className={styles.participatingTitle}>You're Participating ✓</span>
                  <span className={styles.participatingSub}>
                    Entry confirmed with {currentGiveaway.userState?.participation?.entryAmount}{' '}
                    {currentGiveaway.userState?.participation?.entryCurrency}
                  </span>
                </div>
              </div>
            ) : isEnded ? (
              <button
                id="hero-winners-cta"
                onClick={handleCtaClick}
                className={`${styles.primaryBtn} ${styles.blueBtn}`}
              >
                <Trophy size={18} />
                <span>View Final Winners</span>
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
                <span>Enter Giveaway Now</span>
                <ArrowRight size={18} />
              </button>
            )}

            <div className={styles.trustMicro}>
              <Shield size={15} className={styles.shieldIcon} />
              <span>100% Transparent & Verifiable Algorithm</span>
            </div>
          </div>
        </div>

        {/* Visual Hero Illustration */}
        <div className={styles.visualCol}>
          <div className={styles.imageBackdropGlow}></div>
          <div className={styles.imageFrame}>
            <img
              src="/assets/hero-banner.jpg"
              alt="VELOOP Exclusive Rewards Giveaway Showcase"
              className={styles.heroImage}
              loading="eager"
            />
            {/* Floating Info Pill 1 */}
            <div className={`${styles.floatPill} ${styles.pillTopLeft}`}>
              <Gift size={16} className={styles.pillIconGold} />
              <div>
                <div className={styles.pillTitle}>1st Prize</div>
                <div className={styles.pillValue}>iPhone 15 Pro</div>
              </div>
            </div>

            {/* Floating Info Pill 2 */}
            <div className={`${styles.floatPill} ${styles.pillBottomRight}`}>
              <Trophy size={16} className={styles.pillIconEmerald} />
              <div>
                <div className={styles.pillTitle}>Verified Pool</div>
                <div className={styles.pillValue}>1,200+ Prizes Won</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
