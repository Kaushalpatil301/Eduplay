import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const RewardsPage = () => {
  const navigate = useNavigate();
  const { rewards, stats } = useGame();

  return (
    <div style={styles.container}>
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={styles.header}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/kid/dashboard')}
          style={styles.backBtn}
        >
          ← Back
        </motion.button>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>🏆 My Rewards</h1>
          <p style={styles.subtitle}>Unlock amazing achievements!</p>
        </div>
        <div style={styles.statsDisplay}>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={styles.starCount}
          >
            ⭐
          </motion.div>
          <div style={styles.starText}>{stats?.totalStars || 0} Stars</div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={styles.progressSection}
      >
        <div style={styles.progressLabel}>
          {rewards.filter(r => (stats?.totalStars || 0) >= r.starsRequired).length}/{rewards.length} Rewards Unlocked
        </div>
        <div style={styles.progressBar}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(rewards.filter(r => (stats?.totalStars || 0) >= r.starsRequired).length / rewards.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            style={styles.progressFill}
          />
        </div>
      </motion.div>

      {/* Rewards Grid */}
      <div style={styles.rewardsGrid}>
        {rewards.map((reward, index) => {
          const unlocked = (stats?.totalStars || 0) >= reward.starsRequired;
          return (
            <motion.div
              key={reward.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.08, type: 'spring' }}
              whileHover={{ 
                scale: unlocked ? 1.08 : 1.02, 
                y: unlocked ? -10 : -3,
                boxShadow: unlocked ? '0 20px 50px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.2)'
              }}
              style={{
                ...styles.rewardCard,
                opacity: unlocked ? 1 : 0.6,
                filter: unlocked ? 'none' : 'grayscale(100%)',
                border: unlocked ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <motion.div 
                animate={unlocked ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                style={styles.rewardIcon}
              >
                {reward.icon}
              </motion.div>
              <h3 style={styles.rewardName}>{reward.name}</h3>
              <p style={styles.rewardDesc}>{reward.description}</p>
              <div style={{
                ...styles.rewardStars,
                background: unlocked ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'rgba(255, 255, 255, 0.3)',
                color: unlocked ? 'white' : 'rgba(255,255,255,0.9)'
              }}>
                {unlocked ? '✅ Unlocked!' : `🔒 ${reward.starsRequired} stars`}
              </div>
              {unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.badge}
                >
                  🌟
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem 2rem',
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  backBtn: {
    padding: '1rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.25)',
    border: '2px solid rgba(255,255,255,0.5)',
    borderRadius: '1rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  headerCenter: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    color: 'white',
    fontWeight: '700',
    margin: 0,
    textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.95)',
    margin: '0.5rem 0 0 0',
  },
  statsDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.25)',
    padding: '1rem 1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  starCount: {
    fontSize: '2rem',
  },
  starText: {
    fontSize: '1.3rem',
    color: 'white',
    fontWeight: '700',
  },
  progressSection: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem',
    borderRadius: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  progressLabel: {
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  progressBar: {
    height: '20px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(255,215,0,0.5)',
  },
  rewardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  rewardCard: {
    padding: '2.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '2rem',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'all 0.3s',
  },
  rewardIcon: {
    fontSize: '5rem',
    marginBottom: '1rem',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
  },
  rewardName: {
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '0.8rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  rewardDesc: {
    fontSize: '1.05rem',
    opacity: 0.95,
    marginBottom: '1.5rem',
    lineHeight: '1.5',
  },
  rewardStars: {
    fontSize: '1.1rem',
    fontWeight: '700',
    padding: '0.8rem 1.2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  badge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '2rem',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
  },
};

export default RewardsPage;
