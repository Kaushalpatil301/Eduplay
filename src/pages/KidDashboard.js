import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import Confetti from 'react-confetti';

const KidDashboard = () => {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const { stats, refreshData } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevStars, setPrevStars] = useState(stats?.totalStars || 0);

  // Show confetti when stars increase
  useEffect(() => {
    if (stats?.totalStars && stats.totalStars > prevStars && prevStars > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setPrevStars(stats?.totalStars || 0);
  }, [stats?.totalStars]);

  // Safe stats with defaults
  const safeStats = {
    totalStars: stats?.totalStars || 0,
    completedActivities: stats?.completedActivities || 0,
    timeRemaining: stats?.timeRemaining || 120,
    streak: stats?.streak || 0,
    totalTime: stats?.totalTime || 0,
    dailyLimit: stats?.dailyLimit || 120,
  };

  const statCards = [
    {
      icon: '⭐',
      label: 'Total Stars',
      value: safeStats.totalStars,
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    },
    {
      icon: '🎯',
      label: 'Activities',
      value: safeStats.completedActivities,
      color: '#00BFFF',
      gradient: 'linear-gradient(135deg, #00BFFF 0%, #0099cc 100%)',
    },
    {
      icon: '⏱️',
      label: 'Time Left',
      value: `${safeStats.timeRemaining}m`,
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #ff4757 100%)',
    },
    {
      icon: '🔥',
      label: 'Streak',
      value: `${safeStats.streak} days`,
      color: '#FF4500',
      gradient: 'linear-gradient(135deg, #FF4500 0%, #ff6347 100%)',
    },
  ];

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={styles.header}
      >
        <div>
          <h1 style={styles.title}>Hey {username}! 🎮</h1>
          <p style={styles.subtitle}>Ready to play and learn?</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={logout}
          style={styles.logoutBtn}
        >
          👋 Logout
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            style={{
              ...styles.statCard,
              background: stat.gradient,
            }}
          >
            <div style={styles.statIcon}>{stat.icon}</div>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={styles.actionsGrid}>
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/kid/activities')}
          style={{
            ...styles.actionBtn,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div style={styles.actionIcon}>🎯</div>
          <div style={styles.actionText}>Play Games</div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/kid/rewards')}
          style={{
            ...styles.actionBtn,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          }}
        >
          <div style={styles.actionIcon}>🏆</div>
          <div style={styles.actionText}>My Rewards</div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshData}
          style={{
            ...styles.actionBtn,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          }}
        >
          <div style={styles.actionIcon}>🔄</div>
          <div style={styles.actionText}>Refresh</div>
        </motion.button>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={styles.progressContainer}
      >
        <div style={styles.progressLabel}>
          Daily Progress: {safeStats.totalTime}/{safeStats.dailyLimit} minutes
        </div>
        <div style={styles.progressBar}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min((safeStats.totalTime / safeStats.dailyLimit) * 100, 100)}%` 
            }}
            transition={{ duration: 1, delay: 0.5 }}
            style={styles.progressFill}
          />
        </div>
        <div style={styles.progressPercentage}>
          {Math.round((safeStats.totalTime / safeStats.dailyLimit) * 100)}% Complete
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem 2rem',
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5rem',
    color: 'white',
    fontWeight: '700',
    margin: 0,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0.5rem 0 0 0',
  },
  logoutBtn: {
    padding: '1rem 2rem',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid white',
    borderRadius: '1rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    padding: '2rem',
    borderRadius: '1.5rem',
    textAlign: 'center',
    color: 'white',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
  statIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: '1rem',
    opacity: 0.9,
    marginTop: '0.5rem',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  actionBtn: {
    padding: '2rem',
    border: 'none',
    borderRadius: '1.5rem',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
  actionIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  actionText: {
    fontSize: '1.3rem',
    fontWeight: '700',
  },
  progressContainer: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem',
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  progressLabel: {
    color: 'white',
    fontSize: '1.1rem',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  progressBar: {
    height: '30px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)',
    borderRadius: '15px',
    boxShadow: '0 2px 8px rgba(0, 242, 254, 0.5)',
  },
  progressPercentage: {
    color: 'white',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    textAlign: 'right',
    opacity: 0.9,
  },
};

export default KidDashboard;
