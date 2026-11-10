import React, { useState } from 'react';
import styles from './WinnerSlider.module.css';
import { Trophy, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const WINNER_ANNOUNCEMENTS = [
  { id: 1, user: 'VE****72', prize: 'iPhone 15 Pro Titanium', date: 'August 2026', tag: '1st Prize', icon: '📱' },
  { id: 2, user: 'VE****83', prize: 'Apple Watch Series 9', date: 'August 2026', tag: '2nd Prize', icon: '⌚' },
  { id: 3, user: 'VE****54', prize: 'AirPods Pro 2 USB-C', date: 'August 2026', tag: '3rd Prize', icon: '🎧' },
  { id: 4, user: 'VE****92', prize: '₹2,000 Amazon Gift Card', date: 'August 2026', tag: 'Voucher', icon: '💳' },
  { id: 5, user: 'VE****21', prize: 'iPhone 15 Pro Titanium', date: 'August 2026', tag: '1st Prize', icon: '📱' },
  { id: 6, user: 'VE****42', prize: 'Apple Watch Series 9', date: 'August 2026', tag: '2nd Prize', icon: '⌚' },
  { id: 7, user: 'VE****27', prize: 'AirPods Pro 2 USB-C', date: 'August 2026', tag: '3rd Prize', icon: '🎧' },
  { id: 8, user: 'VE****66', prize: '₹500 Amazon Gift Card', date: 'August 2026', tag: 'Voucher', icon: '💳' },
];

export const WinnerSlider = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate list to achieve continuous seamless marquee
  const items = [...WINNER_ANNOUNCEMENTS, ...WINNER_ANNOUNCEMENTS];

  return (
    <div className={styles.sliderOuter}>
      <div className={`container ${styles.sliderContainer}`}>
        {/* Ticker Lead Tag */}
        <div className={styles.tickerLead}>
          <span className={styles.pulseDot}></span>
          <Trophy size={15} className={styles.leadIcon} />
          <span className={styles.leadText}>LIVE REWARD ROLL</span>
        </div>

        {/* Scrolling Ticker Track */}
        <div
          className={styles.trackWrapper}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`${styles.track} ${isPaused ? styles.paused : ''}`}>
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className={styles.tickerCard}>
                <span className={styles.prizeEmoji}>{item.icon}</span>
                <span className={styles.userBadge}>{item.user}</span>
                <span className={styles.wonText}>won</span>
                <span className={styles.prizeName}>{item.prize}</span>
                <span className={styles.tierTag}>{item.tag}</span>
                <div className={styles.verifiedBadge}>
                  <CheckCircle2 size={12} />
                  <span>Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};