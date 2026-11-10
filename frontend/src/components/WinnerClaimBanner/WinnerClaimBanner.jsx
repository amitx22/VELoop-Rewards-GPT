import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';
import styles from './WinnerClaimBanner.module.css';
import { Trophy, Gift, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const WinnerClaimBanner = ({ onOpenClaimModal }) => {
  const { user, isAuthenticated, currentGiveaway } = useApp();
  const [winnerData, setWinnerData] = useState(null);
  const [claimStatus, setClaimStatus] = useState(null);

  useEffect(() => {
    const checkWinner = async () => {
      if (!isAuthenticated || !user) {
        setWinnerData(null);
        return;
      }

      try {
        // Query claim status from completed or active event
        // We check the completed giveaway 'GW-2026-07' where user VE10025 won Apple Watch Series 9
        const res = await api.getMyClaim('GW-2026-07');
        if (res.success && res.isWinner) {
          setWinnerData(res.winner);
          setClaimStatus(res.claimStatus);
        } else {
          setWinnerData(null);
        }
      } catch (err) {
        console.warn('Could not check winner claim status', err);
      }
    };

    checkWinner();
  }, [user, isAuthenticated]);

  if (!winnerData) return null;

  const isClaimed = winnerData.status === 'CLAIM_SUBMITTED' || winnerData.status === 'COMPLETED';

  return (
    <div className={styles.bannerOuter}>
      <div className={`container ${styles.container}`}>
        <div className={styles.bannerCard}>
          <div className={styles.ambientGlow}></div>

          <div className={styles.leftInfo}>
            <div className={styles.trophyIconWrap}>
              <Trophy size={32} className={styles.trophyIcon} />
              <Sparkles size={16} className={styles.sparkleTag} />
            </div>
            <div className={styles.textGroup}>
              <div className={styles.congratsBadge}>
                <span className={styles.pulseDot}></span>
                <span>OFFICIAL WINNER SPOTLIGHT</span>
              </div>
              <h2 className={styles.heading}>
                Congratulations, {user.fullName}! You won {winnerData.prizeName}!
              </h2>
              <p className={styles.subtext}>
                {isClaimed
                  ? 'Your reward claim details have been recorded. Our fulfillment team is preparing your dispatch.'
                  : 'Your ticket was drawn as an official verified winner! Please submit your delivery details before the deadline.'}
              </p>
            </div>
          </div>

          <div className={styles.actionCol}>
            {isClaimed ? (
              <div className={styles.claimedPill}>
                <CheckCircle2 size={18} />
                <span>Claim Received ✓</span>
              </div>
            ) : (
              <button
                id="btn-claim-prize"
                onClick={() => onOpenClaimModal(winnerData)}
                className={styles.claimBtn}
              >
                <span>Claim Your Prize</span>
                <ArrowRight size={17} />
              </button>
            )}
            <div className={styles.deadlineInfo}>
              <Clock size={13} />
              <span>Claim Window: <strong>7 Days Remaining</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};