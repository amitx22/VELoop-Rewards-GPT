import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';
import styles from './WinnersTabs.module.css';
import { Trophy, History, Clock, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const WinnersTabs = ({ onOpenClaimModal }) => {
  const { currentGiveaway, user, isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'previous'
  const [currentWinners, setCurrentWinners] = useState([]);
  const [previousWinners, setPreviousWinners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true);
      try {
        if (currentGiveaway) {
          const res = await api.getGiveawayWinners(currentGiveaway.giveawayId);
          if (res.success) {
            setCurrentWinners(res.winners || []);
          }
        }
        const prevRes = await api.getAllPreviousWinners();
        if (prevRes.success) {
          setPreviousWinners(prevRes.winners || []);
        }
      } catch (err) {
        console.error('Error fetching winners', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [currentGiveaway]);

  const isLive = currentGiveaway?.status === 'ACTIVE';

  return (
    <section id="winners-section" className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>
            <Trophy size={14} />
            <span>TRANSPARENT REWARDS ARCHIVE</span>
          </div>
          <h2 className={styles.title}>
            Winners & <span className="gold-gradient-text">Hall of Fame</span>
          </h2>
          <p className={styles.subtitle}>
            Every winner is algorithmically determined and cryptographically verified. Personal details
            are masked to protect user privacy.
          </p>

          {/* Tab Selector */}
          <div className={styles.tabBar}>
            <button
              onClick={() => setActiveTab('current')}
              className={`${styles.tabBtn} ${activeTab === 'current' ? styles.tabActive : ''}`}
            >
              <Trophy size={15} />
              <span>Current Giveaway</span>
              {isLive && <span className={styles.liveBadgePill}>LIVE</span>}
            </button>
            <button
              onClick={() => setActiveTab('previous')}
              className={`${styles.tabBtn} ${activeTab === 'previous' ? styles.tabActive : ''}`}
            >
              <History size={15} />
              <span>Previous Winners ({previousWinners.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Current Giveaway */}
        {activeTab === 'current' && (
          <div className={styles.tabContent}>
            {isLive ? (
              // Active giveaway message: DO NOT FALSELY SHOW CURRENT WINNERS (Page 12)
              <div className={styles.liveNoticeCard}>
                <div className={styles.livePulseRing}>
                  <Clock size={28} className={styles.clockIcon} />
                </div>
                <div className={styles.liveNoticeInfo}>
                  <div className={styles.liveStatusBadge}>
                    <span className={styles.pulseGreen}></span>
                    <span>Status: LIVE & ACCEPTING ENTRIES</span>
                  </div>
                  <h3 className={styles.liveNoticeTitle}>Giveaway is Still Active!</h3>
                  <p className={styles.liveNoticeText}>
                    Winners have <strong>not yet been finalized</strong>. Selection is executed automatically
                    on backend servers when the countdown timer expires.
                  </p>
                  <div className={styles.announcementMeta}>
                    <span>Winner announcement:</span>
                    <strong>Coming immediately after giveaway ends</strong>
                  </div>
                </div>
              </div>
            ) : currentWinners.length > 0 ? (
              <div className={styles.winnersGrid}>
                {currentWinners.map((winner) => (
                  <div key={winner.winnerId} className={styles.winnerCard}>
                    <div className={styles.winnerHeader}>
                      <div className={styles.trophyIconWrap}>
                        <Trophy size={18} />
                      </div>
                      <div className={styles.verifiedShield}>
                        <ShieldCheck size={13} />
                        <span>Verified</span>
                      </div>
                    </div>
                    <div className={styles.winnerName}>{winner.displayName}</div>
                    <div className={styles.winnerPrize}>{winner.prizeName}</div>
                    <div className={styles.winnerFooter}>
                      <span className={styles.winnerDate}>
                        Announced {new Date(winner.selectedAt).toLocaleDateString()}
                      </span>
                      <span className={styles.winnerStatus}>{winner.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>No winner data currently recorded for this event.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Previous Winners */}
        {activeTab === 'previous' && (
          <div className={styles.tabContent}>
            <div className={styles.winnersGrid}>
              {previousWinners.map((winner) => (
                <div key={winner.winnerId} className={styles.winnerCard}>
                  <div className={styles.winnerHeader}>
                    <span className={styles.giveawayOriginBadge}>{winner.giveawayName}</span>
                    <div className={styles.verifiedShield}>
                      <ShieldCheck size={13} />
                      <span>Verified</span>
                    </div>
                  </div>
                  <div className={styles.winnerName}>{winner.displayName}</div>
                  <div className={styles.winnerPrize}>{winner.prizeName}</div>
                  <div className={styles.winnerFooter}>
                    <span className={styles.winnerDate}>
                      {new Date(winner.selectedAt).toLocaleDateString()}
                    </span>
                    <span className={styles.winnerStatusPill}>
                      <CheckCircle2 size={12} />
                      <span>{winner.status === 'COMPLETED' ? 'Delivered' : 'Claimed'}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Non-Winner Comfort State (Page 18: Users who did not win) */}
        <div className={styles.nonWinnerBanner}>
          <div className={styles.nonWinnerLeft}>
            <Sparkles size={20} className={styles.sparkleIcon} />
            <div>
              <div className={styles.nonWinnerTitle}>Didn't win this time?</div>
              <div className={styles.nonWinnerSub}>
                Keep participating and accumulating VEs for upcoming flagship giveaways.
              </div>
            </div>
          </div>
          <a href="#featured-rewards" className={styles.exploreNextBtn}>
            <span>Explore Next Giveaway</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
};
