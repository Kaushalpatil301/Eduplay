import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const ActivitiesPage = () => {
  const navigate = useNavigate();
  const { activities, stats } = useGame();

  // Filter activities: one of each type, two drawing activities
  const filteredActivities = useMemo(() => {
    const activityMap = {};
    let drawingCount = 0;

    activities.forEach(activity => {
      if (activity.type === 'drawing') {
        if (drawingCount < 2) {
          if (!activityMap[`drawing_${drawingCount}`]) {
            activityMap[`drawing_${drawingCount}`] = {
              ...activity,
              title: drawingCount === 0 ? 'Creative Drawing' : 'Art Studio',
              description: drawingCount === 0 ? 'Express your creativity with colors!' : 'Create amazing artwork!'
            };
            drawingCount++;
          }
        }
      } else if (!activityMap[activity.type]) {
        // Generic names and descriptions
        const genericInfo = {
          puzzle: { title: 'Memory Puzzle', description: 'Match pairs and test your memory!' },
          quiz: { title: 'Brain Quiz', description: 'Answer questions and learn new things!' },
          story: { title: 'Story Time', description: 'Read magical adventures and stories!' },
          music: { title: 'Music Maker', description: 'Create beautiful melodies and sounds!' }
        };

        activityMap[activity.type] = {
          ...activity,
          title: genericInfo[activity.type]?.title || activity.title,
          description: genericInfo[activity.type]?.description || activity.description
        };
      }
    });

    return Object.values(activityMap);
  }, [activities]);

  const handlePlayActivity = (activity) => {
    const routes = {
      puzzle: '/kid/activity/puzzle',
      quiz: '/kid/activity/quiz',
      story: '/kid/activity/story',
      drawing: '/kid/activity/drawing',
      music: '/kid/activity/music',
    };
    const route = routes[activity.type];
    if (route) navigate(route, { state: { activity } });
  };

  const getActivityIcon = (type) => {
    const icons = { puzzle: '🧩', quiz: '❓', story: '📚', drawing: '🎨', music: '🎵' };
    return icons[type] || '🎮';
  };

  const getActivityColor = (type) => {
    const colors = {
      puzzle: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      quiz: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      story: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      drawing: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      music: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    };
    return colors[type] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  return (
    <div style={styles.container}>
      {/* Fixed Header */}
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={styles.header}>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/kid/dashboard')} style={styles.backBtn}>← Back</motion.button>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>🎮 Choose Your Game</h1>
          <p style={styles.subtitle}>Pick a game and start learning!</p>
        </div>
        <div style={styles.statsBox}>
          <div style={styles.statItem}>⭐ {stats?.totalStars || 0}</div>
          <div style={styles.statLabel}>Total Stars</div>
        </div>
      </motion.div>

      {/* Scrollable Activities Grid */}
      <div style={styles.scrollArea}>
        <div style={styles.grid}>
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlayActivity(activity)}
              style={{
                ...styles.card,
                background: getActivityColor(activity.type),
              }}
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                style={styles.cardIcon}
              >
                {getActivityIcon(activity.type)}
              </motion.div>
              <h3 style={styles.cardTitle}>{activity.title}</h3>
              <p style={styles.cardDesc}>{activity.description}</p>
              <div style={styles.cardInfo}>
                <div style={styles.infoItem}>⭐ {activity.points}</div>
                <div style={styles.infoItem}>⏱️ {activity.timeSpent}m</div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} style={styles.playBtn}>▶️ Play Now</motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem 2rem',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  backBtn: {
    padding: '0.8rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.25)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '1rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.95)',
    margin: '0.5rem 0 0 0',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.1)',
  },
  statsBox: {
    background: 'rgba(255, 255, 255, 0.25)',
    padding: '1rem 1.5rem',
    borderRadius: '1rem',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  statItem: {
    fontSize: '1.8rem',
    color: 'white',
    fontWeight: '700',
    marginBottom: '0.2rem',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '2rem',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    borderRadius: '2rem',
    padding: '2rem',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'transform 0.3s, box-shadow 0.3s',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  },
  cardIcon: {
    fontSize: '4.5rem',
    textAlign: 'center',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
  },
  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: 0,
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  cardDesc: {
    fontSize: '1.1rem',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: '1.6',
    margin: 0,
  },
  cardInfo: {
    display: 'flex',
    justifyContent: 'space-around',
    background: 'rgba(255, 255, 255, 0.25)',
    padding: '1rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  infoItem: {
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  playBtn: {
    background: 'rgba(255, 255, 255, 0.3)',
    border: '2px solid white',
    padding: '1rem',
    borderRadius: '1rem',
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: '700',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
};

export default ActivitiesPage;
