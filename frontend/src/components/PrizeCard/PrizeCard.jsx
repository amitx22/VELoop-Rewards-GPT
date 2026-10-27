import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PrizeCard.module.css';
import { Users, Clock, ArrowRight, Trophy, Zap, Coins, Award } from 'lucide-react';

export const PrizeCard = ({ prize, giveawayId, remainingDays = '12d' }) => {
  const navigate = useNavigate();

  const handleOpenDetail = () => {
    navigate(`/giveaway/${prize.slug || prize.prizeId}`);
  };

  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case 'SVEs':
        return <Zap size={14} className={styles.iconCyan} />;
      case 'Tokens':
        return <Award size={14} className={styles.iconEmerald} />;
      case 'VEs':
      default:
        return <Coins size={14} className={styles.iconGold} />;
    }
  };

  return (
    <div className={styles.card}>
      {/* Position Badge */}
      <div className={styles.badgeRow}>
        <div className={`${styles.positionBadge} ${prize.position === 1 ? styles.goldBadge : ''}`}>
          <Trophy size={13} />
          <span>{prize.positionLabel || `${prize.position} Prize`}</span>
        </div>
        <div className={styles.winnerCountBadge}>
          {prize.winnerCount === 1 ? '1 Winner' : `${prize.winnerCount} Winners`}
        </div>
      </div>

      {/* Prize Image Frame */}
      <div className={styles.imageContainer} onClick={handleOpenDetail}>
        <div className={styles.imageGlow}></div>
        <img src={prize.image} alt={prize.name} className={styles.prizeImage} loading="lazy" />
      </div>

      {/* Prize Content */}
      <div className={styles.cardContent}>
        <div className={styles.prizeTypeTag}>{prize.type} REWARD</div>
        <h3 className={styles.prizeName} onClick={handleOpenDetail}>
          {prize.name}
        </h3>
        <p className={styles.prizeDesc}>{prize.description}</p>

        {/* Prize Meta (Participants & Duration) */}
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <Users size={14} className={styles.metaIcon} />
            <span>2.3K+ Joined</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={14} className={styles.metaIcon} />
            <span>{remainingDays} left</span>
          </div>
        </div>

        {/* Entry Fee Bar & Join CTA */}
        <div className={styles.feeCtaRow}>
          <div className={styles.feeGroup}>
            <span className={styles.feeLabel}>Entry Requirement</span>
            <div className={styles.feeValue}>
              {getCurrencyIcon(prize.entryCurrency)}
              <span className={styles.feeAmount}>{prize.entryFee?.toLocaleString()}</span>
              <span className={styles.feeCurrency}>{prize.entryCurrency}</span>
            </div>
          </div>

          <button
            id={`btn-join-${prize.slug || prize.prizeId}`}
            onClick={handleOpenDetail}
            className={styles.joinBtn}
            title={`View details and join for ${prize.name}`}
          >
            <span>Join Now</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
