import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { PrizeCard } from '../PrizeCard/PrizeCard.jsx';
import styles from './FeaturedGiveaways.module.css';
import { Gift, Smartphone, CreditCard, Sparkles, Filter } from 'lucide-react';

export const FeaturedGiveaways = () => {
  const { currentGiveaway } = useApp();
  const [filter, setFilter] = useState('ALL');

  if (!currentGiveaway || !currentGiveaway.prizes) return null;

  const prizes = currentGiveaway.prizes;

  const filteredPrizes = prizes.filter((p) => {
    if (filter === 'PHYSICAL') return p.type === 'PHYSICAL';
    if (filter === 'GIFT_CARD') return p.type === 'GIFT_CARD';
    return true;
  });

  return (
    <section id="featured-rewards" className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.subTag}>
              <Sparkles size={14} className={styles.sparkleIcon} />
              <span>OFFICIAL REWARD TIERS</span>
            </div>
            <h2 className={styles.title}>
              Available Giveaway <span className="gold-gradient-text">Prizes</span>
            </h2>
            <p className={styles.subtitle}>
              Review active reward tiers below. Select <strong>Join Now</strong> to inspect entry terms,
              check available balance, and secure your official draw ticket.
            </p>
          </div>

          {/* Filter Pills with Gaming HUD Aesthetics */}
          <div className={styles.filterPills}>
            <button
              onClick={() => setFilter('ALL')}
              className={`${styles.filterBtn} ${filter === 'ALL' ? styles.filterActive : ''}`}
            >
              <Gift size={14} />
              <span>All Rewards ({prizes.length})</span>
            </button>
            <button
              onClick={() => setFilter('PHYSICAL')}
              className={`${styles.filterBtn} ${filter === 'PHYSICAL' ? styles.filterActive : ''}`}
            >
              <Smartphone size={14} />
              <span>Flagship Tech</span>
            </button>
            <button
              onClick={() => setFilter('GIFT_CARD')}
              className={`${styles.filterBtn} ${filter === 'GIFT_CARD' ? styles.filterActive : ''}`}
            >
              <CreditCard size={14} />
              <span>Amazon Gift Cards</span>
            </button>
          </div>
        </div>

        {/* Prize Cards Grid */}
        <div className={styles.prizesGrid}>
          {filteredPrizes.map((prize) => (
            <PrizeCard
              key={prize.prizeId}
              prize={prize}
              giveawayId={currentGiveaway.giveawayId}
            />
          ))}
        </div>
      </div>
    </section>
  );
};