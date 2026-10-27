import React, { useState } from 'react';
import styles from './RulesAndFAQ.module.css';
import { HelpCircle, FileText, ChevronDown, CheckCircle2, ShieldAlert } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I participate in VELOOP giveaways?',
    a: 'Simply select your desired prize from the active giveaway catalog, verify that you hold the required entry fee (in VEs, SVEs, or Tokens), and confirm your entry on the dedicated giveaway details page. Your participation is atomically recorded in our database.',
  },
  {
    q: 'How are winners selected?',
    a: 'Winner selection is fully automated and backend-controlled. When the countdown reaches zero, the server generates a cryptographically seeded random draw across all verified entry tickets. No client-side code can influence or tamper with the selection.',
  },
  {
    q: 'When are winners announced?',
    a: 'Winners are announced immediately after the giveaway timer reaches 00:00:00. The active giveaway transitions to ENDED status, and the public winner rolls become visible with masked user IDs.',
  },
  {
    q: 'What happens if I win?',
    a: 'If your authenticated user ID is selected, a personalized Winner Celebration Banner will appear when you visit VELOOP Rewards. You will be prompted to submit your claim details within 7 calendar days.',
  },
  {
    q: 'How do I claim my prize?',
    a: 'For physical rewards (iPhone 15 Pro, Apple Watch, AirPods Pro), you provide your shipping address and contact number for courier dispatch. For Amazon Gift Cards, only your verified email address is requested.',
  },
  {
    q: 'Can I participate in multiple giveaways?',
    a: 'Yes! While you are strictly limited to one participation entry per giveaway event, you are encouraged to join multiple distinct giveaway events and across different prize tiers as long as you meet the balance requirements.',
  },
  {
    q: 'What is the refund and entry policy?',
    a: 'Entry fees (VEs, SVEs, Tokens) are deducted upon participation confirmation and locked into the official event prize pool. In the unlikely event of an event cancellation by administration, a compensating reversal transaction is automatically credited back to your balance.',
  },
];

const RULES = [
  {
    title: 'Eligibility Requirements',
    detail: 'Open to verified VELOOP members in good standing. Accounts flagged for suspicious behavior or bot networks are disqualified.',
  },
  {
    title: 'Strict Entry Limits',
    detail: 'Strict limit of 1 entry per account and 1 entry per unique device per giveaway event enforced at database level.',
  },
  {
    title: 'Cryptographic Draw Integrity',
    detail: 'iPhone 1st prize is awarded to exactly 1 winner. Other prize tiers are distributed according to verified winner limits.',
  },
  {
    title: '7-Day Claim Window',
    detail: 'Winners must submit required shipping/email details within 7 calendar days of announcement. Unclaimed prizes are re-allocated.',
  },
  {
    title: 'Anti-Fraud & Multi-Account Protection',
    detail: 'VELOOP employs device fingerprint hashing, request velocity throttling, and IP anomaly checks to prevent abuse.',
  },
];

export const RulesAndFAQ = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="rules-and-faq" className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>
            <FileText size={14} />
            <span>TERMS, GUIDELINES & ANSWERS</span>
          </div>
          <h2 className={styles.title}>
            Rules & Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>
          <p className={styles.subtitle}>
            Everything you need to know about eligibility, fairness, and prize dispatching.
          </p>
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column: Official Rules */}
          <div className={styles.rulesCol}>
            <div className={styles.colHeader}>
              <ShieldAlert size={20} className={styles.colHeaderIconGold} />
              <h3 className={styles.colTitle}>Giveaway Rules & Guidelines</h3>
            </div>

            <div className={styles.rulesList}>
              {RULES.map((rule, idx) => (
                <div key={idx} className={styles.ruleCard}>
                  <div className={styles.ruleIconCheck}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className={styles.ruleName}>{rule.title}</h4>
                    <p className={styles.ruleText}>{rule.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className={styles.faqCol}>
            <div className={styles.colHeader}>
              <HelpCircle size={20} className={styles.colHeaderIconCyan} />
              <h3 className={styles.colTitle}>Frequently Asked Questions</h3>
            </div>

            <div className={styles.accordion}>
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ''}`}>
                    <button
                      onClick={() => toggleFaq(idx)}
                      className={styles.accordionHeader}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.questionText}>{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className={styles.accordionBody}>
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
