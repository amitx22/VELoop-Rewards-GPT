import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import styles from './LoginPage.module.css';
import {
  Gift,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  Coins,
  ArrowLeft,
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin, handleRegister, handleSwitchUser, isAuthenticated, user } = useApp();

  // Parse redirect query param if any
  const query = new URLSearchParams(location.search);
  const redirectPath = query.get('redirect') || '/';

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // If already logged in, show status with redirect button
  if (isAuthenticated && user) {
    return (
      <div className={styles.pageOuter}>
        <div className={styles.cardContainer}>
          <div className={styles.alreadyLoggedCard}>
            <div className={styles.userIconCircle}>
              <CheckCircle2 size={44} className={styles.greenCheck} />
            </div>
            <h2 className={styles.title}>Already Signed In</h2>
            <p className={styles.subtitle}>
              You are currently signed in as <strong>{user.fullName}</strong> ({user.userId}).
            </p>
            <div className={styles.balancePreview}>
              <div className={styles.balPill}>
                <Coins size={14} className={styles.goldIcon} />
                <span>{user.balances?.VEs?.toLocaleString()} VEs</span>
              </div>
              <div className={styles.balPill}>
                <Zap size={14} className={styles.cyanIcon} />
                <span>{user.balances?.SVEs?.toLocaleString()} SVEs</span>
              </div>
            </div>
            <div className={styles.actionRow}>
              <button onClick={() => navigate(redirectPath)} className={styles.submitBtn}>
                <span>Continue to {redirectPath === '/' ? 'Giveaways' : 'Destination'}</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  handleSwitchUser('VISITOR');
                }}
                className={styles.switchBtn}
              >
                Sign In With Another Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle Sign In Submit
  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await handleLogin(identifier, password);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          navigate(redirectPath);
        }, 600);
      }
    } catch (err) {
      setError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await handleRegister({ fullName, email, password });
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          navigate(redirectPath);
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Fill Demo Credentials
  const fillDemoAccount = (demoId, demoEmail, demoPass) => {
    setActiveTab('login');
    setIdentifier(demoEmail || demoId);
    setPassword(demoPass || 'password123');
    setError(null);
  };

  return (
    <div className={styles.pageOuter}>
      <div className={styles.glowBackdrop}></div>

      {/* Top Back Nav */}
      <div className={`container ${styles.topBackNav}`}>
        <Link to="/" className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to Giveaways</span>
        </Link>
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.authCard}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <Link to="/" className={styles.logoLink}>
              <div className={styles.logoIcon}>
                <Gift size={24} className={styles.giftIcon} />
              </div>
              <div className={styles.logoTextGroup}>
                <span className={styles.brandTitle}>VELOOP</span>
                <span className={styles.brandSub}>REWARDS AUTH</span>
              </div>
            </Link>

            <h1 className={styles.headerHeading}>
              {activeTab === 'login' ? 'Welcome Back' : 'Join VELOOP Rewards'}
            </h1>
            <p className={styles.headerDesc}>
              {activeTab === 'login'
                ? 'Sign in to access exclusive giveaways and claim prizes.'
                : 'Create an account to start earning VEs and entering premier draws.'}
            </p>

            {/* Tab Switcher */}
            <div className={styles.tabNav}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError(null);
                }}
                className={`${styles.tabBtn} ${activeTab === 'login' ? styles.tabActive : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError(null);
                }}
                className={`${styles.tabBtn} ${activeTab === 'register' ? styles.tabActive : ''}`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className={styles.successAlert}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === 'login' ? (
            <form onSubmit={onLoginSubmit} className={styles.formBody}>
              <div className={styles.inputGroup}>
                <label>Email Address or User ID</label>
                <div className={styles.inputWrap}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. rahul.sharma@example.com or VE10025"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.passwordLabelRow}>
                  <label>Password</label>
                  <span className={styles.forgotPass}>Default: password123</span>
                </div>
                <div className={styles.inputWrap}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeBtn}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? 'Authenticating...' : 'Sign In to Account →'}
              </button>
            </form>
          ) : (
            /* Create Account Form */
            <form onSubmit={onRegisterSubmit} className={styles.formBody}>
              {/* Welcome Bonus Perk */}
              <div className={styles.perkCard}>
                <Sparkles size={18} className={styles.goldIcon} />
                <div className={styles.perkInfo}>
                  <strong>Welcome Sign Up Bonus</strong>
                  <span>Instant +300 VEs, +500 SVEs, and +2,500 Tokens credited upon registration!</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <div className={styles.inputWrap}>
                  <User size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <div className={styles.inputWrap}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Password (min 6 characters)</label>
                <div className={styles.inputWrap}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeBtn}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                id="btn-submit-register"
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? 'Creating Account...' : 'Create Account & Claim Bonus →'}
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Accounts */}
          <div className={styles.demoSection}>
            <div className={styles.demoDivider}>
              <span>Or 1-Click Test Accounts</span>
            </div>
            <div className={styles.demoPresetsGrid}>
              <button
                type="button"
                onClick={() =>
                  fillDemoAccount('VE10025', 'rahul.sharma@example.com', 'password123')
                }
                className={styles.demoPresetCard}
              >
                <span className={styles.demoRole}>👑 Apple Watch Winner</span>
                <span className={styles.demoName}>Rahul Sharma (850 VEs)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemoAccount('VE10042', 'priya.patel@example.com', 'password123')
                }
                className={styles.demoPresetCard}
              >
                <span className={styles.demoRole}>👤 Regular Member</span>
                <span className={styles.demoName}>Priya Patel (350 VEs)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemoAccount('VE10099', 'amit.lowbalance@example.com', 'password123')
                }
                className={styles.demoPresetCard}
              >
                <span className={styles.demoRole}>⚠️ Low Balance</span>
                <span className={styles.demoName}>Amit Kumar (50 VEs)</span>
              </button>
            </div>
          </div>

          {/* Trust Footer */}
          <div className={styles.cardFooter}>
            <ShieldCheck size={14} className={styles.shieldGreen} />
            <span>256-bit Encrypted Session • Single Account Enforcement</span>
          </div>
        </div>
      </div>
    </div>
  );
};
