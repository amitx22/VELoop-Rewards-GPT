import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api.js';
import styles from './PrizeClaimModal.module.css';
import { Trophy, X, ShieldCheck, Mail, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const PrizeClaimModal = ({ isOpen, onClose, winnerRecord, onSuccess }) => {
  if (!isOpen || !winnerRecord) return null;

  const isPhysical = winnerRecord.prizeType === 'PHYSICAL';

  // Physical Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [completeAddress, setCompleteAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Gift Card Form State
  const [emailAddress, setEmailAddress] = useState('');

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedClaim, setSubmittedClaim] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const claimPayload = {
        giveawayId: winnerRecord.giveawayId,
        prizeId: winnerRecord.prizeId,
      };

      if (isPhysical) {
        if (!fullName || !phoneNumber || !completeAddress || !city || !state || !pinCode) {
          throw new Error('Please fill out all delivery address fields.');
        }
        claimPayload.shippingDetails = {
          fullName,
          phoneNumber,
          completeAddress,
          city,
          state,
          pinCode,
        };
      } else {
        if (!emailAddress || !emailAddress.includes('@')) {
          throw new Error('Please enter a valid recipient email address.');
        }
        claimPayload.emailDetails = {
          emailAddress,
        };
      }

      const res = await api.submitClaim(winnerRecord.giveawayId, claimPayload);

      if (res.success) {
        setSubmittedClaim(res.claim);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffd000', '#f5a623', '#34d399', '#6366f1'],
        });
        if (onSuccess) onSuccess(res.claim);
      }
    } catch (err) {
      setError(err.message || 'Unable to submit claim. Please try again.');
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
            <div className={styles.trophyIcon}>
              <Trophy size={20} />
            </div>
            <div>
              <h3 className={styles.modalTitle}>
                {isPhysical ? 'Claim Your Physical Prize' : 'Claim Your Amazon Gift Card'}
              </h3>
              <p className={styles.modalSub}>Verified Prize Allocation for {winnerRecord.userId}</p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {/* Verification Strip (Page 15) */}
        <div className={styles.verificationStrip}>
          <div className={styles.verifyItem}>
            <span className={styles.verifyLabel}>Prize</span>
            <span className={styles.verifyVal}>{winnerRecord.prizeName}</span>
          </div>
          <div className={styles.verifyItem}>
            <span className={styles.verifyLabel}>Winner Status</span>
            <span className={styles.statusVerified}>
              <CheckCircle2 size={13} />
              <span>Winner ✓</span>
            </span>
          </div>
          <div className={styles.verifyItem}>
            <span className={styles.verifyLabel}>Claim Deadline</span>
            <span className={styles.verifyDeadline}>
              <Clock size={13} />
              <span>Within 7 days</span>
            </span>
          </div>
        </div>

        {/* Form Body or Submitted State */}
        {submittedClaim ? (
          <div className={styles.successState}>
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={42} className={styles.successCheck} />
            </div>
            <h4 className={styles.successTitle}>Claim Submitted Successfully!</h4>
            <p className={styles.successMessage}>
              Your verification has been recorded (Claim ID: <strong>{submittedClaim.claimId}</strong>).
              Our rewards fulfillment desk will verify and dispatch tracking details within 48 hours.
            </p>
            <div className={styles.claimStatusBadge}>
              <Clock size={14} />
              <span>Status: Verification In Progress</span>
            </div>
            <button onClick={onClose} className={styles.doneBtn}>
              Return to Giveaway
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.claimForm}>
            {error && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {isPhysical ? (
              // Physical Prize Form: Full Name, Phone, Address, City, State, PIN (Page 16)
              <div className={styles.formFields}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number (for Courier Delivery) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Complete Delivery Address *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Flat number, Street name, Landmark"
                    value={completeAddress}
                    onChange={(e) => setCompleteAddress(e.target.value)}
                  />
                </div>

                <div className={styles.grid3}>
                  <div className={styles.formGroup}>
                    <label>City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>PIN Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="400001"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Amazon Gift Card Form: Email Address only (Page 16)
              <div className={styles.formFields}>
                <div className={styles.giftCardNotice}>
                  <Mail size={18} className={styles.mailIcon} />
                  <span>
                    For Amazon Gift Cards, no physical delivery is required. Your digital voucher code
                    will be transmitted securely to the verified email below.
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label>Email Address for Gift Card *</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className={styles.modalFooter}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Submitting Claim...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
