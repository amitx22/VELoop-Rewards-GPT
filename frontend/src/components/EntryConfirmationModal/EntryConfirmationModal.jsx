import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api.js';
import { useApp } from '../../context/AppContext.jsx';
import styles from './EntryConfirmationModal.module.css';
import { Ticket, X, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export const EntryConfirmationModal = ({
  isOpen,
  onClose,
  prize,
  giveawayId,
  onSuccess,
}) => {
  const { user, handleSwitchUser, loadUser, loadCurrentGiveaway } = useApp();
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [joinSuccess, setJoinSuccess] = useState(null);

  if (!isOpen || !prize) return null;

  const currency = prize.entryCurrency || 'VEs';
  const entryFee = prize.entryFee || 0;
  const userBalance = user?.balances?.[currency] || 0;
  const balanceAfter = userBalance - entryFee;
  const hasEnough = userBalance >= entryFee;

  const handleConfirm = async () => {
    if (!agreed) {
      setError('Please agree to the giveaway rules and terms to continue.');
      return;
    }
    if (!hasEnough) {
      setError(`Insufficient ${currency} balance. You need ${entryFee - userBalance} more ${currency}.`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.joinGiveaway(giveawayId, prize.prizeId);
      if (res.success) {
        setJoinSuccess(res);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffd000', '#f5a623', '#34d399', '#6366f1'],
        });
        await loadUser();
        await loadCurrentGiveaway();
        if (onSuccess) onSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Unable to join giveaway. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrap}>
              <Ticket size={20} />
            </div>
            <div>
              <h3 className={styles.modalTitle}>Confirm Participation</h3>
              <p className={styles.modalSub}>{prize.name}</p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {joinSuccess ? (
          // Success State (Page 48, 78)
          <div className={styles.successBody}>
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={44} className={styles.successCheck} />
            </div>
            <h4 className={styles.successTitle}>You're In!</h4>
            <p className={styles.successMessage}>
              Your participation for the <strong>{prize.name}</strong> giveaway has been successfully recorded.
            </p>

            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>Entry Fee Deducted:</span>
                <strong>
                  {entryFee} {currency}
                </strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Transaction Ref:</span>
                <code>{joinSuccess.entryDetails?.transactionId}</code>
              </div>
              <div className={styles.summaryRow}>
                <span>Remaining Balance:</span>
                <strong>
                  {joinSuccess.entryDetails?.balanceRemaining?.toLocaleString()} {currency}
                </strong>
              </div>
            </div>

            <p className={styles.goodLuckText}>Good luck! 🎉</p>

            <button onClick={onClose} className={styles.viewGiveawayBtn}>
              Return to Giveaway
            </button>
          </div>
        ) : (
          // Confirmation Form (Page 47)
          <div className={styles.modalBody}>
            {error && (
              <div className={styles.errorAlert}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Balance Calculation Table */}
            <div className={styles.balanceSummary}>
              <div className={styles.calcRow}>
                <span className={styles.calcLabel}>Entry Fee</span>
                <span className={styles.calcValGold}>
                  {entryFee} {currency}
                </span>
              </div>
              <div className={styles.calcRow}>
                <span className={styles.calcLabel}>Your Current Balance</span>
                <span className={styles.calcVal}>
                  {userBalance.toLocaleString()} {currency}
                </span>
              </div>
              <div className={`${styles.calcRow} ${styles.calcRowTotal}`}>
                <span className={styles.calcLabelBold}>Balance After Joining</span>
                <span className={hasEnough ? styles.calcValGreen : styles.calcValRed}>
                  {balanceAfter >= 0 ? `${balanceAfter.toLocaleString()} ${currency}` : 'Insufficient Balance'}
                </span>
              </div>
            </div>

            {!hasEnough && (
              <div className={styles.insufficientWarning}>
                <AlertTriangle size={15} />
                <span>
                  You need {entryFee - userBalance} more {currency} to join. Earn more via platform activities.
                </span>
              </div>
            )}

            {/* Agreement Checkbox */}
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                By continuing, you confirm that you have reviewed the giveaway rules and terms, and agree to the 1 entry per account policy.
              </span>
            </label>

            {/* Footer Buttons */}
            <div className={styles.modalFooter}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>
                Cancel
              </button>
              <button
                id="btn-confirm-and-join"
                onClick={handleConfirm}
                disabled={loading || !hasEnough}
                className={styles.confirmBtn}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    <span>Joining Giveaway...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Join ({entryFee} {currency})</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
