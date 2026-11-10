import React from 'react';
import styles from './TrustSection.module.css';
import { ShieldCheck, Lock, Award, Eye, CheckCircle2 } from 'lucide-react';

const TRUST_POINTS = [
  {
    icon: <Eye size={22} />,
    title: '100% Transparent Draw',
    desc: 'Public draw schedules, verified participant counts, and server selection timestamps are publicly verifiable with zero hidden terms.',
    color: '#ffe600',
    tag: 'AUDITABLE',
  },
  {
    icon: <Lock size={22} />,
    title: 'Privacy-Preserving Security',
    desc: 'User identity is masked on public winner rolls. Device verification uses salted, one-way SHA hashes without storing invasive data.',
    color: '#38bdf8',
    tag: 'ENCRYPTED',
  },
  {
    icon: <Award size={22} />,
    title: 'Fair Algorithmic Selection',
    desc: 'Deterministic cryptographically seeded random generation guarantees equal odds for all valid entry tickets with compound unique constraints.',
    color: '#34d399',
    tag: 'PROVABLY FAIR',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Guaranteed Fulfillment',
    desc: 'Physical rewards are dispatched via insured trackable couriers, while Amazon gift cards are delivered directly to verified email.',
    color: '#c084fc',
    tag: 'FULFILLED',
  },
];

export const TrustSection = () => {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.tagBadge}>
            <ShieldCheck size={14} className={styles.badgeIcon} />
            <span>PLATFORM COMPLIANCE & INTEGRITY</span>
          </div>
          <h2 className={styles.heading}>
            Built on <span className="gold-gradient-text">Trust & Fairness</span>
          </h2>
          <p className={styles.subheading}>
            VELOOP Rewards operates under rigorous fintech security guidelines, ensuring fair draws and reliable loot fulfillment.
          </p>
        </div>

        <div className={styles.grid}>
          {TRUST_POINTS.map((pt, i) => (
            <div key={i} className={styles.trustCard}>
              <div className={styles.cardTop}>
                <div
                  className={styles.iconCircle}
                  style={{ color: pt.color, borderColor: `${pt.color}45`, background: `${pt.color}14` }}
                >
                  {pt.icon}
                </div>
                <span
                  className={styles.pointTag}
                  style={{ color: pt.color, borderColor: `${pt.color}35`, background: `${pt.color}10` }}
                >
                  {pt.tag}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{pt.title}</h3>
              <p className={styles.cardDesc}>{pt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};