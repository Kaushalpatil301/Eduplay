import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>© 2025 EduPlay - Making Learning Fun 🎮</p>
        <p style={styles.subtext}>Built with ❤️ for mindful screen time</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    marginTop: 'auto',
    textAlign: 'center',
    color: 'white',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  text: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  subtext: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
};

export default Footer;
