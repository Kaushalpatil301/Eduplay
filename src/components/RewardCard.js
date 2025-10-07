import React from 'react';
import { motion } from 'framer-motion';

const RewardCard = ({ reward, unlocked }) => {
  return (
    <motion.div
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
      style={{
        ...styles.card,
        opacity: unlocked ? 1 : 0.5,
        filter: unlocked ? 'none' : 'grayscale(100%)',
      }}
    >
      <div style={styles.icon}>{reward.icon || '🏆'}</div>
      <h4 style={styles.name}>{reward.name}</h4>
      <p style={styles.description}>{reward.description}</p>
      <div style={styles.stars}>⭐ {reward.starsRequired} Stars</div>
      {unlocked && <div style={styles.unlocked}>✅ Unlocked!</div>}
    </motion.div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  name: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '1rem',
  },
  stars: {
    fontSize: '1rem',
    color: '#FFD700',
    fontWeight: '600',
  },
  unlocked: {
    background: '#4CAF50',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '1rem',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginTop: '0.5rem',
    display: 'inline-block',
  },
};

export default RewardCard;
