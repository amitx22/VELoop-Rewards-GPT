import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PrizeCard.module.css';
import { Users, Clock, ArrowRight, Trophy, Zap, Coins, Award, Sparkles, ShieldCheck } from 'lucide-react';

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

  const isFirstPrize = prize.position === 1;
  const isSecondPrize = prize.position === 2;
  const isThirdPrize = prize.position === 3;

  const getPositionClass = () => {
    if (isFirstPrize) return styles.badgeGold;
    if (isSecondPrize) return styles.badgeCyan;
    if (isThirdPrize) return styles.badgePurple;
    return styles.badgeDefault;
  };

  const getCardThemeClass = () => {
    if (isFirstPrize) return styles.cardThemeGold;
    if (isSecondPrize) return styles.cardThemeCyan;
    if (isThirdPrize) return styles.cardThemePurple;
    return styles.cardThemeEmerald;
  };

  const firstSpec = Array.isArray(prize.specs)
    ? prize.specs[0]
    : typeof prize.specs === 'string'
    ? prize.specs.split(' ').slice(0, 2).join(' ')
    : null;

  return (
    <div className={`${styles.card} ${getCardThemeClass()}`}>
      {/* Top Lighting Accent Strip */}
      <div className={styles.topAccentGlow}></div>

      {/* Badges Header Row */}
      <div className={styles.badgeRow}>
        <div className={`${styles.positionBadge} ${getPositionClass()}`}>
          {isFirstPrize ? (
            <Trophy size={13} className={styles.trophyFirst} />
          ) : (
            <Sparkles size={13} />
          )}
          <span>{prize.positionLabel || `${prize.position} Prize`}</span>
        </div>
        <div className={styles.winnerCountBadge}>
          {prize.winnerCount === 1 ? '1 Winner' : `${prize.winnerCount} Winners`}
        </div>
      </div>

      {/* Prize Image Showcase Stage */}
      <div className={styles.imageContainer} onClick={handleOpenDetail}>
        <div className={styles.imageBackdropGlow}></div>
        <div className={styles.stagePedestal}></div>
        <img
          src={prize.image}
          alt={prize.name}
          className={styles.prizeImage}
          loading="lazy"
        />

        {/* Floating Spec Tag */}
        {firstSpec && (
          <div className={styles.specFloatTag}>
            <ShieldCheck size={11} />
            <span>{firstSpec}</span>
          </div>
        )}
      </div>

      {/* Prize Content */}
      <div className={styles.cardContent}>
        <div className={styles.prizeTypeTag}>
          <span>{prize.type === 'PHYSICAL' ? '📦 PHYSICAL COURIER' : '⚡ DIGITAL VOUCHER'}</span>
          {prize.approxValue && <span className={styles.approxVal}>Approx {prize.approxValue}</span>}
        </div>

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
            <ArrowRight size={15} className={styles.btnArrow} />
          </button>
        </div>
      </div>
    </div>
  );
};