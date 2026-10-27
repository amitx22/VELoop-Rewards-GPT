import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import styles from './GiveawayStats.module.css';
import { Gift, Users, Trophy, Sparkles } from 'lucide-react';

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
          {/* Stat 1 */}
          <div className={styles.statCard}>
            <div className={`${styles.iconWrap} ${styles.goldIcon}`}>
              <Gift size={22} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {totalGiveaways} <span className={styles.statSub}>Active</span>
              </div>
              <div className={styles.statLabel}>Total Giveaways</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className={styles.statCard}>
            <div className={`${styles.iconWrap} ${styles.cyanIcon}`}>
              <Users size={22} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {participants} <span className={styles.statSub}>Users</span>
              </div>
              <div className={styles.statLabel}>Total Participants</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className={styles.statCard}>
            <div className={`${styles.iconWrap} ${styles.emeraldIcon}`}>
              <Trophy size={22} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {prizesWon} <span className={styles.statSub}>Rewards</span>
              </div>
              <div className={styles.statLabel}>Prizes Won to Date</div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className={styles.statCard}>
            <div className={`${styles.iconWrap} ${styles.indigoIcon}`}>
              <Sparkles size={22} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>Transparent Selection</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
