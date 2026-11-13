import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import styles from './Navbar.module.css';
import {
  Gift,
  Award,
  Coins,
  Zap,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, handleLogout } = useApp();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'VL';

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        {/* Brand Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIconWrapper}>
            <Gift className={styles.logoIcon} size={20} />
          </div>
          <div className={styles.logoTextWrapper}>
            <span className={styles.logoName}>VELOOP</span>
            <span className={styles.logoBadge}>REWARDS</span>
          </div>
        </Link>

        {/* Navigation Links (desktop) */}
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
            Winners
          </Link>
          <a href="/#rules-and-faq" className={styles.navLink}>
            Rules & FAQ
          </a>
        </nav>

        {/* Right Section */}
        <div className={styles.navRight}>
          {isAuthenticated && user ? (
            <>
              {/* Balance Pills */}
              <div className={styles.balancesGroup}>
                <div className={`${styles.balancePill} ${styles.vePill}`} title="VELOOP Entries">
                  <Coins size={13} className={styles.balanceIconGold} />
                  <span className={styles.balanceVal}>{user.balances?.VEs?.toLocaleString() || 0}</span>
                  <span className={styles.currencyName}>VEs</span>
                </div>

                <div className={`${styles.balancePill} ${styles.svePill}`} title="Special VEs">
                  <Zap size={13} className={styles.balanceIconCyan} />
                  <span className={styles.balanceVal}>{user.balances?.SVEs?.toLocaleString() || 0}</span>
                  <span className={styles.currencyName}>SVEs</span>
                </div>

                <div className={`${styles.balancePill} ${styles.tokenPill}`} title="Tokens">
                  <Award size={13} className={styles.balanceIconEmerald} />
                  <span className={styles.balanceVal}>{user.balances?.Tokens?.toLocaleString() || 0}</span>
                  <span className={styles.currencyName}>Tokens</span>
                </div>
              </div>

              {/* User Dropdown */}
              <div className={styles.userMenu}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={styles.userBtn}
                >
                  <div className={styles.userAvatar}>{initials}</div>
                  <span>{user.fullName.split(' ')[0]}</span>
                  <ChevronDown
                    size={14}
                    className={`${styles.chevronIcon} ${dropdownOpen ? styles.chevronIconOpen : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownTop}>
                      <div className={styles.dropdownName}>{user.fullName}</div>
                      <div className={styles.dropdownEmail}>{user.email}</div>
                    </div>

                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className={styles.dropdownItem}
                    >
                      <User size={14} />
                      <span>Switch Account</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <nav className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        <Link to="/" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Giveaways</Link>
        <a href="/#featured-rewards" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Prizes</a>
        <a href="/#how-to-participate" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>How It Works</a>
        <Link to="/winners" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Winners</Link>
        <a href="/#rules-and-faq" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Rules & FAQ</a>
        <div className={styles.mobileDivider} />
        {isAuthenticated && user ? (
          <>
            {isAuthenticated && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '4px 14px' }}>
                <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>
                  {user.balances?.VEs || 0} VEs
                </span>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700 }}>
                  {user.balances?.SVEs || 0} SVEs
                </span>
                <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700 }}>
                  {user.balances?.Tokens || 0} Tokens
                </span>
              </div>
            )}
            <button
              className={styles.mobileNavLink}
              style={{ background: 'rgba(244,63,94,0.08)', color: '#fb7185', textAlign: 'left', border: 'none', cursor: 'pointer' }}
              onClick={() => { setMobileOpen(false); handleLogout(); }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Sign In / Join</Link>
        )}
      </nav>
    </header>
  );
};
