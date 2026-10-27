import React from 'react';
import styles from './HowToParticipate.module.css';
import { UserCheck, CheckSquare, Ticket, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Sign Up / Login',
    description: 'Access your authenticated VELOOP account to review active events and live balances.',
    icon: <UserCheck size={24} />,
    color: '#ffd000',
  },
  {
    step: '02',
    title: 'Complete Tasks',
    description: 'Participate in ecosystem activities, app challenges, and streaks to earn VEs and SVEs.',
    icon: <CheckSquare size={24} />,
    color: '#38bdf8',
  },
  {
    step: '03',
    title: 'Lock Your Entry',
    description: 'Select your target prize, confirm entry fee deduction, and receive your cryptographic ticket.',
    icon: <Ticket size={24} />,
    color: '#a855f7',
  },
  {
    step: '04',
    title: 'Win & Claim',
    description: 'Automated backend algorithm finalizes winners at timer expiry. Instant claim for physical or gift cards.',
    icon: <Trophy size={24} />,
    color: '#34d399',
  },
];

export const HowToParticipate = () => {
  return (
    <section id="how-to-participate" className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.tag}>
            <ShieldCheck size={14} />
            <span>TRANSPARENT PARTICIPATION JOURNEY</span>
          </div>
          <h2 className={styles.title}>
            How to Participate in <span className="gold-gradient-text">Giveaways</span>
          </h2>
          <p className={styles.subtitle}>
            A straightforward, reliable entry system designed with full financial and cryptographic integrity.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className={styles.timelineGrid}>
          {STEPS.map((step, idx) => (
            <div key={step.step} className={styles.stepCard}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber} style={{ color: step.color }}>
                  {step.step}
                </span>
                <div className={styles.iconCircle} style={{ color: step.color, borderColor: `${step.color}40` }}>
                  {step.icon}
                </div>
              </div>

              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>

              {idx < STEPS.length - 1 && (
                <div className={styles.arrowConnector}>
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
