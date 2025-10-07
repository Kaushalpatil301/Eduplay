import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { api, isAuthenticated, role } = useAuth();
  const [stats, setStats] = useState({
    totalStars: 0,
    completedActivities: 0,
    timeRemaining: 120,
    dailyLimit: 120,
    streak: 0,
    totalTime: 0,
  });
  const [activities, setActivities] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [earnedRewards, setEarnedRewards] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);

  useEffect(() => {
    if (isAuthenticated && role === 'KID') {
      fetchData();
    }
  }, [isAuthenticated, role]);

  const fetchData = async () => {
    await Promise.all([
      fetchStats(),
      fetchActivities(),
      fetchRewards(),
      fetchEarnedRewards(),
      fetchActivityHistory(),
    ]);
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/kid/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await api.get('/kid/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await api.get('/kid/rewards');
      setRewards(response.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const fetchEarnedRewards = async () => {
    try {
      const response = await api.get('/kid/rewards/earned');
      setEarnedRewards(response.data);
    } catch (error) {
      console.error('Error fetching earned rewards:', error);
    }
  };

  const fetchActivityHistory = async () => {
    try {
      const response = await api.get('/kid/activity/history');
      setActivityHistory(response.data);
    } catch (error) {
      console.error('Error fetching activity history:', error);
    }
  };

  const completeActivity = async (activityId) => {
    try {
      const response = await api.post('/kid/activity/complete', { activityId });
      
      // Refresh data
      await fetchStats();
      await fetchEarnedRewards();
      await fetchActivityHistory();
      
      return response.data;
    } catch (error) {
      console.error('Error completing activity:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  return (
    <GameContext.Provider
      value={{
        stats,
        activities,
        rewards,
        earnedRewards,
        activityHistory,
        completeActivity,
        refreshData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
