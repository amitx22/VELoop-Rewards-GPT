import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import styles from './GiveawayStats.module.css';
import { Gift, Users, Trophy, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';

export const GiveawayStats = () => {
  const { currentGiveaway } = useApp();

  const totalGiveaways = currentGiveaway?.totalGiveawaysCount || 24;
  const participants = currentGiveaway?.participantsCount
    ? `${(currentGiveaway.participantsCount / 1000).toFixed(1)}K+`
    : '8.5K+';
  const prizesWon = currentGiveaway?.prizesWonCount
    ? `${(currentGiveaway.prizesWonCount / 1000).toFixed(1)}K+`
    : '1.2K+';

  return (
    <section className={styles.statsSection}>
      <div className={`container ${styles.statsContainer}`}>
        <div className={styles.statsGrid}>
          {/* Stat 1: Total Giveaways */}
          <div className={`${styles.statCard} ${styles.cardGold}`}>
            <div className={styles.topRow}>
              <div className={`${styles.iconWrap} ${styles.goldIcon}`}>
                <Gift size={20} />
              </div>
              <span className={styles.hudBadgeGold}>LIVE SEASON</span>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {totalGiveaways} <span className={styles.statSub}>Active</span>
              </div>
              <div className={styles.statLabel}>Total Giveaways Hosted</div>
            </div>
            <div className={styles.bottomBarGold}></div>
          </div>

          {/* Stat 2: Total Participants */}
          <div className={`${styles.statCard} ${styles.cardCyan}`}>
            <div className={styles.topRow}>
              <div className={`${styles.iconWrap} ${styles.cyanIcon}`}>
                <Users size={20} />
              </div>
              <span className={styles.hudBadgeCyan}>+14% TODAY</span>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {participants} <span className={styles.statSub}>Users</span>
              </div>
              <div className={styles.statLabel}>Verified Participants</div>
            </div>
            <div className={styles.bottomBarCyan}></div>
          </div>

          {/* Stat 3: Prizes Won */}
          <div className={`${styles.statCard} ${styles.cardEmerald}`}>
            <div className={styles.topRow}>
              <div className={`${styles.iconWrap} ${styles.emeraldIcon}`}>
                <Trophy size={20} />
              </div>
              <span className={styles.hudBadgeEmerald}>100% CLAIMED</span>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {prizesWon} <span className={styles.statSub}>Prizes</span>
              </div>
              <div className={styles.statLabel}>Delivered to Winners</div>
            </div>
            <div className={styles.bottomBarEmerald}></div>
          </div>

          {/* Stat 4: Transparent Selection */}
          <div className={`${styles.statCard} ${styles.cardPurple}`}>
            <div className={styles.topRow}>
              <div className={`${styles.iconWrap} ${styles.purpleIcon}`}>
                <ShieldCheck size={20} />
              </div>
              <span className={styles.hudBadgePurple}>SHA-256 SEED</span>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                100% <span className={styles.statSub}>Fair</span>
              </div>
              <div className={styles.statLabel}>Cryptographic Integrity</div>
            </div>
            <div className={styles.bottomBarPurple}></div>
          </div>
        </div>
      </div>
    </section>
  );
};