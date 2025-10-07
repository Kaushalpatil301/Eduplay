import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, label, color = '#4CAF50' }) => {
  return (
    <div style={styles.container}>
      <div style={styles.labelContainer}>
        <span style={styles.label}>{label}</span>
        <span style={{ ...styles.percentage, color }}>{progress}%</span>
      </div>
      <div style={styles.track}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
          style={{ ...styles.fill, background: color }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    marginBottom: '1.5rem',
  },
  labelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  label: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
  },
  percentage: {
    fontSize: '1rem',
    fontWeight: '700',
  },
  track: {
    width: '100%',
    height: '12px',
    background: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: '10px',
  },
};

export default ProgressBar;
