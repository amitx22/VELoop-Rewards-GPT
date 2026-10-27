import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { Gift, ShieldCheck, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topRow}>
          <div className={styles.brandCol}>
            <div className={styles.logo}>
              <div className={styles.logoIconWrap}>
                <Gift size={20} className={styles.logoIcon} />
              </div>
              <span className={styles.logoText}>VELOOP REWARDS</span>
            </div>
            <p className={styles.tagline}>
              Empowering consumers with transparent, tamper-proof rewards, authentic tech giveaways, and instant voucher claims.
            </p>
            <div className={styles.supportContact}>
              <Mail size={14} className={styles.mailIcon} />
              <span>Have questions? Contact <strong>support@veloop.io</strong></span>
            </div>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkGroup}>
              <h4>Ecosystem</h4>
              <Link to="/">Giveaway Home</Link>
              <a href="#featured-rewards">Prize Catalog</a>
              <Link to="/winners">Winner Hall of Fame</Link>
              <a href="#how-to-participate">Participation Guide</a>
            </div>

            <div className={styles.linkGroup}>
              <h4>Compliance & Trust</h4>
              <a href="#rules-and-faq">Official Rules</a>
              <a href="#rules-and-faq">Terms of Participation</a>
              <a href="#rules-and-faq">Anti-Fraud Policy</a>
              <a href="#rules-and-faq">Privacy & Security</a>
            </div>

            <div className={styles.linkGroup}>
              <h4>Currencies</h4>
              <span>VEs (VELOOP Entries)</span>
              <span>SVEs (Special Entries)</span>
              <span>Activity Tokens</span>
              <span>Cryptographic Random Seed</span>
            </div>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} VELOOP Rewards Inc. All rights reserved. Built with full-stack fintech architecture.
          </div>
          <div className={styles.badges}>
            <span className={styles.badgeShield}>
              <ShieldCheck size={14} />
              <span>SOC-2 & Anti-Abuse Protected</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
