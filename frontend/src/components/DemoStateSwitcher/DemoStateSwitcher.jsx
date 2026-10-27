import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';
import styles from './DemoStateSwitcher.module.css';
import { Sliders, User, RefreshCw, PlusCircle, Activity, ChevronUp, ChevronDown, Shield } from 'lucide-react';

const USER_PRESETS = [
  { id: 'VE10025', label: 'Rahul S. (Winner of Apple Watch, 850 VEs)', type: 'winner' },
  { id: 'VE10042', label: 'Priya P. (Standard User, 350 VEs)', type: 'normal' },
  { id: 'VE10099', label: 'Amit K. (Low Balance - 50 VEs)', type: 'low_balance' },
  { id: 'VE99999', label: 'Flagged Account (Simulate Fraud Block)', type: 'fraud' },
  { id: 'VISITOR', label: 'Anonymous Visitor (Logged Out)', type: 'visitor' },
];

export const DemoStateSwitcher = () => {
  const {
    user,
    isAuthenticated,
    selectedUserKey,
    handleSwitchUser,
    handleAddBalance,
    currentGiveaway,
    handleSetGiveawayStatus,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [logsModal, setLogsModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [fraudEvents, setFraudEvents] = useState([]);

  const openAuditLogs = async () => {
    try {
      const logsRes = await api.getAuditLogs();
      const fraudRes = await api.getFraudEvents();
      if (logsRes.success) setAuditLogs(logsRes.logs);
      if (fraudRes.success) setFraudEvents(fraudRes.events);
      setLogsModal(true);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all demo state to original seeds?')) {
      await api.resetDemo();
      window.location.reload();
    }
  };

  return (
    <>
      <div className={`${styles.switcherContainer} ${isOpen ? styles.open : styles.collapsed}`}>
        {/* Toggle Bar */}
        <div className={styles.toggleBar} onClick={() => setIsOpen(!isOpen)}>
          <div className={styles.barTitle}>
            <Sliders size={16} className={styles.sliderIcon} />
            <span>Interactive Demo & State Switcher</span>
            <span className={styles.activeTag}>
              {user ? `${user.fullName} (${user.userId})` : 'Visitor Mode'}
            </span>
          </div>
          <button className={styles.chevronBtn}>
            {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>

        {isOpen && (
          <div className={styles.panelBody}>
            {/* User State Selector */}
            <div className={styles.controlGroup}>
              <label className={styles.groupLabel}>
                <User size={14} />
                <span>Simulate User State (Pages 26-28):</span>
              </label>
              <div className={styles.userButtons}>
                {USER_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSwitchUser(p.id)}
                    className={`${styles.userPill} ${
                      selectedUserKey === p.id || (!isAuthenticated && p.id === 'VISITOR')
                        ? styles.pillSelected
                        : ''
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Giveaway Status Selector */}
            <div className={styles.controlGroup}>
              <label className={styles.groupLabel}>
                <Activity size={14} />
                <span>Giveaway Lifecycle Status:</span>
              </label>
              <div className={styles.statusButtons}>
                <button
                  onClick={() => handleSetGiveawayStatus('ACTIVE')}
                  className={`${styles.statusPill} ${
                    currentGiveaway?.status === 'ACTIVE' ? styles.statusActive : ''
                  }`}
                >
                  ACTIVE (Live Ticking)
                </button>
                <button
                  onClick={() => handleSetGiveawayStatus('ENDED')}
                  className={`${styles.statusPill} ${
                    currentGiveaway?.status === 'ENDED' ? styles.statusEnded : ''
                  }`}
                >
                  ENDED (Winners Revealed)
                </button>
                <button
                  onClick={() => handleSetGiveawayStatus('UPCOMING')}
                  className={`${styles.statusPill} ${
                    currentGiveaway?.status === 'UPCOMING' ? styles.statusUpcoming : ''
                  }`}
                >
                  UPCOMING (Starts in 3d)
                </button>
              </div>
            </div>

            {/* Quick Balance Actions & Audit Modal */}
            <div className={styles.actionRow}>
              {isAuthenticated && (
                <div className={styles.balanceAddGroup}>
                  <button
                    onClick={() => handleAddBalance('VEs', 250)}
                    className={styles.addBalanceBtn}
                  >
                    <PlusCircle size={14} />
                    <span>+250 VEs</span>
                  </button>
                  <button
                    onClick={() => handleAddBalance('SVEs', 500)}
                    className={styles.addBalanceBtn}
                  >
                    <PlusCircle size={14} />
                    <span>+500 SVEs</span>
                  </button>
                </div>
              )}

              <button onClick={openAuditLogs} className={styles.auditLogsBtn}>
                <Shield size={14} />
                <span>View Real-Time Audit & Fraud Logs</span>
              </button>

              <button onClick={handleReset} className={styles.resetBtn} title="Reset demo seed">
                <RefreshCw size={14} />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit & Fraud Logs Modal */}
      {logsModal && (
        <div className={styles.modalOverlay} onClick={() => setLogsModal(false)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <Shield size={18} className={styles.shieldGold} />
                <h3>Backend Audit Trail & Fraud Protection Events</h3>
              </div>
              <button onClick={() => setLogsModal(false)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <h4>Recent Audit Log Records (Page 66)</h4>
              <div className={styles.tableWrap}>
                <table className={styles.logTable}>
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>User</th>
                      <th>Giveaway</th>
                      <th>Result</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log) => (
                        <tr key={log.auditId}>
                          <td>
                            <code>{log.action}</code>
                          </td>
                          <td>{log.userId}</td>
                          <td>{log.giveawayId || '-'}</td>
                          <td>
                            <span
                              className={
                                log.result === 'SUCCESS' ? styles.resSuccess : styles.resFail
                              }
                            >
                              {log.result}
                            </span>
                          </td>
                          <td>{new Date(log.createdAt).toLocaleTimeString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No audit logs recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <h4 style={{ marginTop: '20px' }}>Fraud Prevention Events (Page 65)</h4>
              <div className={styles.tableWrap}>
                <table className={styles.logTable}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Risk Score</th>
                      <th>Classification</th>
                      <th>Action</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fraudEvents.length > 0 ? (
                      fraudEvents.map((fe) => (
                        <tr key={fe.eventId}>
                          <td>{fe.userId}</td>
                          <td>{fe.riskScore} / 100</td>
                          <td>
                            <span className={styles.resFail}>{fe.riskClassification}</span>
                          </td>
                          <td>
                            <strong>{fe.action}</strong>
                          </td>
                          <td style={{ fontSize: '11px' }}>{fe.reason}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No fraud triggers recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
