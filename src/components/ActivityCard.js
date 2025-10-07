import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ActivityCard = ({ activity }) => {
  const navigate = useNavigate();

  const icons = {
    puzzle: '🧩',
    quiz: '❓',
    story: '📖',
    drawing: '🎨',
    music: '🎵',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(`/kid/activity/${activity.type}`)}
      style={styles.card}
    >
      <div style={styles.icon}>{icons[activity.type]}</div>
      <h3 style={styles.title}>{activity.title}</h3>
      <p style={styles.points}>⭐ {activity.points} Points</p>
      <div style={styles.badge}>
        {activity.completed ? '✅ Completed' : '🎯 Start'}
      </div>
    </motion.div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '2rem',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  points: {
    fontSize: '1.1rem',
    color: '#FFB347',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  badge: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '1rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'inline-block',
  },
};

export default ActivityCard;
