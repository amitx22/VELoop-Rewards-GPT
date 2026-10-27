import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentGiveaway, setCurrentGiveaway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserKey, setSelectedUserKey] = useState('VE10025'); // default to Rahul Sharma
  const [activeTab, setActiveTab] = useState('winners'); // 'winners' | 'previous'

  // Fetch Current User
  const loadUser = useCallback(async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.isAuthenticated) {
        setUser(res.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.warn('Could not load user profile', err);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Fetch Current Giveaway
  const loadCurrentGiveaway = useCallback(async () => {
    try {
      setError(null);
      const res = await api.getCurrentGiveaway();
      if (res.success) {
        setCurrentGiveaway(res.giveaway);
      }
    } catch (err) {
      console.error('Failed to load current giveaway', err);
      setError(err.message || 'Unable to load giveaway information.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadUser();
      await loadCurrentGiveaway();
    };
    init();
  }, [loadUser, loadCurrentGiveaway]);

  // Switch User (Demo state switcher)
  const handleSwitchUser = async (userId) => {
    try {
      setLoading(true);
      setSelectedUserKey(userId);
      const res = await api.switchUser(userId);
      if (res.success) {
        setUser(res.user);
        setIsAuthenticated(res.isAuthenticated);
      }
      await loadCurrentGiveaway();
    } catch (err) {
      console.error('Failed to switch user', err);
    } finally {
      setLoading(false);
    }
  };

  // Add virtual balance
  const handleAddBalance = async (currency, amount) => {
    try {
      const res = await api.addBalance(currency, amount);
      if (res.success) {
        setUser((prev) => (prev ? { ...prev, balances: res.balances } : null));
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Switch giveaway status (Admin testing)
  const handleSetGiveawayStatus = async (status) => {
    if (!currentGiveaway) return;
    try {
      setLoading(true);
      await api.setGiveawayStatus(currentGiveaway.giveawayId, status);
      await loadCurrentGiveaway();
    } catch (err) {
      console.error('Failed to change status', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        currentGiveaway,
        loading,
        error,
        selectedUserKey,
        activeTab,
        setActiveTab,
        loadCurrentGiveaway,
        loadUser,
        handleSwitchUser,
        handleAddBalance,
        handleSetGiveawayStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
