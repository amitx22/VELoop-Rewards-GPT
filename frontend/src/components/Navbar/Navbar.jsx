import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import styles from './Navbar.module.css';
import {
  Gift,
  Award,
  Coins,
  Zap,
  Shield,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, handleLogout } = useApp();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        {/* Brand Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIconWrapper}>
            <Gift className={styles.logoIcon} size={22} />
          </div>
          <div className={styles.logoTextWrapper}>
            <span className={styles.logoName}>VELOOP</span>
            <span className={styles.logoBadge}>REWARDS</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.navLinkActive : ''}`}
          >
            Giveaways
          </Link>
          <a href="/#featured-rewards" className={styles.navLink}>
            Prizes
          </a>
          <a href="/#how-to-participate" className={styles.navLink}>
            How It Works
          </a>
          <Link
            to="/winners"
            className={`${styles.navLink} ${location.pathname === '/winners' ? styles.navLinkActive : ''}`}
          >
            Winners & Claims
          </Link>
          <a href="/#rules-and-faq" className={styles.navLink}>
            Rules & FAQ
          </a>
        </nav>

        {/* Right Section: Balances & User Status */}
        <div className={styles.navRight}>
          {isAuthenticated && user ? (
            <>
              {/* Currency Badges */}
              <div className={styles.balancesGroup}>
                <div className={`${styles.balancePill} ${styles.vePill}`} title="VELOOP Entries">
                  <Coins size={14} className={styles.balanceIconGold} />
                  <span className={styles.balanceVal}>{user.balances?.VEs?.toLocaleString() || 0}</span>
                  <span className={styles.currencyName}>VEs</span>
                </div>

                <div className={`${styles.balancePill} ${styles.svePill}`} title="Special VELOOP Entries">
                  <Zap size={14} className={styles.balanceIconCyan} />
                  <span className={styles.balanceVal}>{user.balances?.SVEs?.toLocaleString() || 0}</span>
                  <span className={styles.currencyName}>SVEs</span>
                </div>

                <div className={`${styles.balancePill} ${styles.tokenPill}`} title="Activity Tokens">
                  <Award size={14} className={styles.balanceIconEmerald} />
                  <span className={styles.balanceVal}>{user.balances?.Tokens?.toLocaleString() || 0}</span>
                  <span className={styles.currencyName}>Tokens</span>
                </div>
              </div>

              {/* User Profile Pill with Dropdown */}
              <div className={styles.userProfileWrapper}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={styles.userProfile}
                >
                  <div className={styles.avatar}>
                    <User size={15} />
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.fullName}</span>
                    <span className={styles.userIdBadge}>{user.userId}</span>
                  </div>
                  <ChevronDown size={14} className={styles.chevronIcon} />
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <span className={styles.ddUserName}>{user.fullName}</span>
                      <span className={styles.ddUserEmail}>{user.email}</span>
                    </div>

                    <div className={styles.dropdownDivider}></div>

                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className={styles.dropdownItem}
                    >
                      <User size={14} />
                      <span>Switch / Sign In Other</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className={`${styles.dropdownItem} ${styles.logoutItem}`}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.visitorAuth}>
              <span className={styles.visitorTag}>Visitor</span>
              <Link to="/login" className={styles.loginBtn}>
                <LogIn size={15} />
                <span>Sign In / Join</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
