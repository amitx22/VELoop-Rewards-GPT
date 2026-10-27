import React from 'react';
import styles from './TrustSection.module.css';
import { ShieldCheck, Lock, Award, Eye } from 'lucide-react';

const TRUST_POINTS = [
  {
    icon: <Eye size={22} />,
    title: '100% Transparent',
    desc: 'Giveaway rules, live participant counts, and selection deadlines are publicly displayed without hidden conditions.',
    color: '#ffd000',
  },
  {
    icon: <Lock size={22} />,
    title: 'Secure & Privacy-Conscious',
    desc: 'User identifiers are masked in public winner rolls. Device verification uses one-way salted hashes.',
    color: '#38bdf8',
  },
  {
    icon: <Award size={22} />,
    title: 'Fair Algorithmic Draw',
    desc: 'Backend deterministic random generation ensures equal opportunity. Strict database unique indexing prevents duplicate voting.',
    color: '#34d399',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Reward Fulfillment Guaranteed',
    desc: 'Real physical products dispatched via trackable couriers, and instant digital vouchers delivered directly to verified email.',
    color: '#a855f7',
  },
];

export const TrustSection = () => {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          {TRUST_POINTS.map((pt, i) => (
            <div key={i} className={styles.trustCard}>
              <div className={styles.iconCircle} style={{ color: pt.color, borderColor: `${pt.color}35` }}>
                {pt.icon}
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
