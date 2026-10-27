import React, { useState, useEffect } from 'react';
import styles from './ThemedLoader.module.css';
import { Gift, Sparkles, Award } from 'lucide-react';

const MESSAGES = [
  "Preparing today's rewards...",
  'Checking active giveaways...',
  'Loading available prizes...',
  'Bringing your rewards closer...',
  'Securing authentic reward draw...',
];

export const ThemedLoader = ({ fullScreen = false }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.loaderContainer} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.glowAura}></div>

      <div className={styles.visualWrapper}>
        <div className={styles.orbitRing}></div>
        <div className={styles.orbitDot}></div>
        
        {/* Floating animated gold coin */}
        <div className={styles.floatingCoin}>
          <span>V</span>
        </div>

        {/* Central glowing gift box */}
        <div className={styles.giftBoxWrapper}>
          <div className={styles.giftIconBox}>
            <Gift className={styles.giftIcon} size={42} />
          </div>
          <Sparkles className={styles.sparkle1} size={20} />
          <Sparkles className={styles.sparkle2} size={16} />
        </div>
      </div>

      <div className={styles.badgeLabel}>
        <Award size={14} className={styles.badgeIcon} />
        <span>VELOOP REWARDS</span>
      </div>

      <p className={styles.loadingMessage}>{MESSAGES[msgIndex]}</p>

      {/* Progress pill dots */}
      <div className={styles.progressDots}>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </div>
    </div>
  );
};
