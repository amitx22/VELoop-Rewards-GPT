import React, { useState, useEffect } from 'react';
import styles from './Countdown.module.css';
import { Clock } from 'lucide-react';

export const Countdown = ({ targetDate, onEnd, label = 'Giveaway Ends In' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        if (onEnd) onEnd();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onEnd]);

  if (timeLeft.isEnded) {
    return (
      <div className={styles.endedBadge}>
        <Clock size={16} />
        <span>GIVEAWAY HAS CONCLUDED</span>
      </div>
    );
  }

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className={styles.wrapper}>
      {label && (
        <div className={styles.headerLabel}>
          <Clock size={14} className={styles.clockIcon} />
          <span>{label}</span>
        </div>
      )}
      <div className={styles.timerGrid}>
        <div className={styles.timeBox}>
          <span className={styles.timeVal}>{pad(timeLeft.days)}</span>
          <span className={styles.timeUnit}>Days</span>
        </div>
        <span className={styles.sep}>:</span>
        <div className={styles.timeBox}>
          <span className={styles.timeVal}>{pad(timeLeft.hours)}</span>
          <span className={styles.timeUnit}>Hours</span>
        </div>
        <span className={styles.sep}>:</span>
        <div className={styles.timeBox}>
          <span className={styles.timeVal}>{pad(timeLeft.minutes)}</span>
          <span className={styles.timeUnit}>Mins</span>
        </div>
        <span className={styles.sep}>:</span>
        <div className={styles.timeBox}>
          <span className={`${styles.timeVal} ${styles.pulseVal}`}>{pad(timeLeft.seconds)}</span>
          <span className={styles.timeUnit}>Secs</span>
        </div>
      </div>
    </div>
  );
};
