import React from 'react';
import styles from './HowToParticipate.module.css';
import { UserCheck, CheckSquare, Ticket, Trophy, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    phase: 'STEP 01',
    title: 'Sign In / Connect',
    description: 'Access your authenticated VELOOP account to review active events, real-time draws, and live balances.',
    icon: <UserCheck size={24} />,
    color: '#ffe600',
    badgeText: 'IDENTITY',
  },
  {
    step: '02',
    phase: 'STEP 02',
    title: 'Complete Activities',
    description: 'Participate in platform challenges, streaks, and partner quests to accumulate VEs, SVEs, and Tokens.',
    icon: <CheckSquare size={24} />,
    color: '#38bdf8',
    badgeText: 'ACCUMULATE',
  },
  {
    step: '03',
    phase: 'STEP 03',
    title: 'Lock Draw Entry',
    description: 'Select your target prize tier, confirm entry fee deduction, and receive your cryptographic draw ticket.',
    icon: <Ticket size={24} />,
    color: '#c084fc',
    badgeText: 'TICKET LOCK',
  },
  {
    step: '04',
    phase: 'STEP 04',
    title: 'Win & Claim Loot',
    description: 'Server algorithm finalizes winners at timer expiry. Instant claim for trackable doorstep shipment or gift voucher.',
    icon: <Trophy size={24} />,
    color: '#34d399',
    badgeText: 'FULFILLMENT',
  },
];

export const HowToParticipate = () => {
  return (
    <section id="how-to-participate" className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.tag}>
            <ShieldCheck size={14} className={styles.tagIcon} />
            <span>TRANSPARENT PARTICIPATION PATHWAY</span>
          </div>
          <h2 className={styles.title}>
            How to Participate in <span className="gold-gradient-text">Giveaways</span>
          </h2>
          <p className={styles.subtitle}>
            A 4-step verifiable questline engineered with strict cryptographic fairness and atomic balance deduction.
          </p>
        </div>

        {/* Timeline Grid with Connected Pathway */}
        <div className={styles.timelineWrapper}>
          <div className={styles.laserConnectorLine}></div>

          <div className={styles.timelineGrid}>
            {STEPS.map((step, idx) => (
              <div key={step.step} className={styles.stepCard}>
                <div className={styles.stepHeader}>
                  <span className={styles.phaseBadge} style={{ color: step.color, borderColor: `${step.color}40`, background: `${step.color}15` }}>
                    {step.phase}
                  </span>
                  <div
                    className={styles.iconCircle}
                    style={{ color: step.color, borderColor: `${step.color}50`, background: `${step.color}18` }}
                  >
                    {step.icon}
                  </div>
                </div>

                <div className={styles.stepContent}>
                  <div className={styles.stepNumberWatermark}>{step.step}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                </div>

                {idx < STEPS.length - 1 && (
                  <div className={styles.arrowConnector}>
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};