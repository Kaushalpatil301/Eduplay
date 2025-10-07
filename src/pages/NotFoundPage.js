import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleGoHome = () => {
    // Navigate based on user role
    if (role === 'PARENT') {
      navigate('/parent/dashboard');
    } else if (role === 'KID') {
      navigate('/kid/dashboard');
    } else {
      navigate('/'); // If not logged in, go to landing page
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={styles.content}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
          style={styles.emoji}
        >
          🚀
        </motion.div>
        
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Lost in Space! 🌌</h2>
        <p style={styles.text}>
          Oops! Looks like you've ventured into uncharted territory.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleGoHome}
          style={styles.button}
        >
          🏠 Return to {role === 'PARENT' ? 'Dashboard' : role === 'KID' ? 'Earth' : 'Home'}
        </motion.button>
      </motion.div>

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: '1.5rem',
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    textAlign: 'center',
    color: 'white',
    zIndex: 1,
  },
  emoji: {
    fontSize: '8rem',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '6rem',
    fontWeight: '700',
    marginBottom: '1rem',
    fontFamily: 'Fredoka One, cursive',
  },
  subtitle: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1.3rem',
    marginBottom: '3rem',
    opacity: 0.9,
  },
  button: {
    background: 'white',
    color: '#667eea',
    border: 'none',
    padding: '1.5rem 3rem',
    borderRadius: '2rem',
    fontSize: '1.3rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    fontFamily: 'Poppins, sans-serif',
  },
};

export default NotFoundPage;
