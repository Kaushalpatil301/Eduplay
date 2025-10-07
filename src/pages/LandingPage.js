import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const floatingIcons = ['🎮', '📚', '🎨', '🎵', '🧩', '⭐', '🏆', '✨', '🎯', '🚀'];

  return (
    <div style={styles.container}>
      {/* Animated Background Icons */}
      {floatingIcons.map((icon, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 30 - 15, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: index * 0.3,
            ease: 'easeInOut',
          }}
          style={{
            ...styles.floatingIcon,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 80}%`,
          }}
        >
          {icon}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={styles.content}
      >
        {/* Hero Section */}
        <motion.h1 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={styles.title}
        >
          Welcome to{' '}
          <motion.span
            animate={{ textShadow: ['0 0 20px rgba(255, 215, 0, 0.5)', '0 0 40px rgba(255, 215, 0, 0.8)', '0 0 20px rgba(255, 215, 0, 0.5)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={styles.brandName}
          >
            EduPlay
          </motion.span>{' '}
          🎮
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={styles.subtitle}
        >
          Transform screen time into learning time! Fun, educational activities that kids love and parents trust.
        </motion.p>

        {/* Login Buttons */}
        <div style={styles.buttonContainer}>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 15px 40px rgba(255, 179, 71, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login?role=parent')}
            style={styles.parentBtn}
          >
            <span style={styles.btnIcon}>👨‍👩‍👧</span>
            <div style={styles.btnText}>
              <div style={styles.btnTitle}>Login as Parent</div>
              <div style={styles.btnSubtitle}>Track & manage</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 15px 40px rgba(0, 191, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login?role=kid')}
            style={styles.kidBtn}
          >
            <span style={styles.btnIcon}>🧒</span>
            <div style={styles.btnText}>
              <div style={styles.btnTitle}>Login as Kid</div>
              <div style={styles.btnSubtitle}>Play & learn</div>
            </div>
          </motion.button>
        </div>

        {/* Features Section */}
        <div style={styles.features}>
          <motion.div 
            whileHover={{ y: -8, scale: 1.05 }} 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={styles.featureCard}
          >
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Track Progress</h3>
            <p style={styles.featureDesc}>Monitor learning activities and achievements</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8, scale: 1.05 }} 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={styles.featureCard}
          >
            <div style={styles.featureIcon}>⏰</div>
            <h3 style={styles.featureTitle}>Set Limits</h3>
            <p style={styles.featureDesc}>Smart screen time control & scheduling</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8, scale: 1.05 }} 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={styles.featureCard}
          >
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Earn Rewards</h3>
            <p style={styles.featureDesc}>Unlock achievements and collect stars</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  floatingIcon: {
    position: 'absolute',
    fontSize: '3rem',
    opacity: 0.15,
    pointerEvents: 'none',
    filter: 'blur(1px)',
  },
  content: {
    textAlign: 'center',
    zIndex: 1,
    maxWidth: '1100px',
  },
  title: {
    fontSize: '4rem',
    color: 'white',
    marginBottom: '1.5rem',
    fontWeight: '700',
    lineHeight: '1.2',
  },
  brandName: {
    color: '#FFD700',
    display: 'inline-block',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: '3rem',
    maxWidth: '700px',
    margin: '0 auto 3rem',
    lineHeight: '1.6',
  },
  buttonContainer: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '5rem',
  },
  parentBtn: {
    background: 'linear-gradient(135deg, #FFB347 0%, #ff9a00 100%)',
    color: 'white',
    border: 'none',
    padding: '1.5rem 2.5rem',
    borderRadius: '2rem',
    fontSize: '1.3rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(255, 179, 71, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minWidth: '280px',
  },
  kidBtn: {
    background: 'linear-gradient(135deg, #00BFFF 0%, #0099cc 100%)',
    color: 'white',
    border: 'none',
    padding: '1.5rem 2.5rem',
    borderRadius: '2rem',
    fontSize: '1.3rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0, 191, 255, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minWidth: '280px',
  },
  btnIcon: {
    fontSize: '2.5rem',
  },
  btnText: {
    textAlign: 'left',
  },
  btnTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  btnSubtitle: {
    fontSize: '0.9rem',
    opacity: 0.9,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '2rem',
    padding: '2.5rem',
    color: 'white',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  featureDesc: {
    fontSize: '1rem',
    opacity: 0.9,
    lineHeight: '1.5',
  },
};

export default LandingPage;
