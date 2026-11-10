import React, { useState } from 'react';
import styles from './RulesAndFAQ.module.css';
import { HelpCircle, FileText, ChevronDown, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I participate in VELOOP giveaways?',
    a: 'Simply select your desired prize from the active giveaway catalog, verify that you hold the required entry fee (in VEs, SVEs, or Tokens), and confirm your entry on the dedicated giveaway details page. Your participation is atomically recorded in our database ledger.',
  },
  {
    q: 'How are winners selected?',
    a: 'Winner selection is fully automated and server-controlled. When the countdown reaches zero, the server generates a cryptographically seeded random draw across all verified entry tickets. No client-side code can influence or tamper with the selection.',
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
    a: 'For physical rewards (iPhone 15 Pro, Apple Watch, AirPods Pro), you provide your shipping address and contact number for courier dispatch. For Amazon Gift Cards, only your verified recipient email address is requested.',
  },
  {
    q: 'Can I participate in multiple giveaways?',
    a: 'Yes! While you are strictly limited to one participation entry per giveaway event, you are encouraged to join multiple distinct giveaway events and across different prize tiers as long as you meet the balance requirements.',
  },
  {
    q: 'What is the entry fee policy?',
    a: 'Entry fees (VEs, SVEs, Tokens) are deducted upon participation confirmation and locked into the official event prize pool. In the unlikely event of an event cancellation by administration, a compensating reversal transaction is automatically credited back to your balance.',
  },
];

const RULES = [
  {
    id: 'R1',
    title: 'Account Eligibility',
    detail: 'Open to verified VELOOP members in good standing. Accounts flagged for suspicious behavior or bot networks are strictly disqualified.',
  },
  {
    id: 'R2',
    title: 'Single-Entry Rule',
    detail: 'Strict limit of 1 entry per account and 1 entry per unique device per giveaway event, enforced with compound unique database constraints.',
  },
  {
    id: 'R3',
    title: 'Cryptographic Draw Integrity',
    detail: 'Grand 1st Prize is awarded to exactly 1 winner. Other prize tiers are distributed according to verified winner quotas.',
  },
  {
    id: 'R4',
    title: '7-Day Claim Window',
    detail: 'Winners must submit required shipping/email details within 7 calendar days of announcement. Unclaimed prizes are re-allocated.',
  },
  {
    id: 'R5',
    title: 'Anti-Abuse & Rate Limiting',
    detail: 'VELOOP employs salted device fingerprint hashing, request velocity throttling, and IP anomaly checks to prevent fraudulent manipulation.',
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
            <FileText size={14} className={styles.tagIcon} />
            <span>TERMS, GUIDELINES & ANSWERS</span>
          </div>
          <h2 className={styles.title}>
            Rules & Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>
          <p className={styles.subtitle}>
            Everything you need to know about participation rules, cryptographic fairness, and prize dispatching.
          </p>
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column: Official Rules */}
          <div className={styles.rulesCol}>
            <div className={styles.colHeader}>
              <div className={styles.colIconWrapGold}>
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className={styles.colTitle}>Giveaway Rules & Guidelines</h3>
                <span className={styles.colSub}>Official compliance handbook</span>
              </div>
            </div>

            <div className={styles.rulesList}>
              {RULES.map((rule) => (
                <div key={rule.id} className={styles.ruleCard}>
                  <div className={styles.ruleIdTag}>{rule.id}</div>
                  <div className={styles.ruleContent}>
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
              <div className={styles.colIconWrapCyan}>
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className={styles.colTitle}>Frequently Asked Questions</h3>
                <span className={styles.colSub}>Instant answers to common queries</span>
              </div>
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
                      <div className={`${styles.chevronWrap} ${isOpen ? styles.chevronWrapOpen : ''}`}>
                        <ChevronDown size={16} />
                      </div>
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