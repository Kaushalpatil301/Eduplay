import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { username, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleHome = () => {
    navigate(role === 'PARENT' ? '/parent/dashboard' : '/kid/dashboard');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={styles.navbar}
    >
      <div style={styles.container}>
        <div style={styles.logo} onClick={handleHome}>
          <span style={styles.logoIcon}>🎮</span>
          <span style={styles.logoText}>EduPlay</span>
        </div>
        
        <div style={styles.right}>
          <span style={styles.username}>
            {role === 'PARENT' ? '👨‍👩‍👧' : '🧒'} {username}
          </span>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #FFB347 0%, #ff9a00 100%)',
    padding: '1rem 2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  logoText: {
    fontSize: '1.8rem',
    fontFamily: 'Fredoka One, cursive',
    color: 'white',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  username: {
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  logoutBtn: {
    background: 'white',
    color: '#FFB347',
    border: 'none',
    padding: '0.7rem 1.5rem',
    borderRadius: '2rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
};

export default Navbar;
