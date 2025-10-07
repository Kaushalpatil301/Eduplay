import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

const MusicPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeActivity, stats } = useGame();
  const activity = location.state?.activity || { id: 12, title: 'Music Maker', points: 18, timeSpent: 4 };
  
  const [playingNote, setPlayingNote] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(activity.timeSpent * 60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const notes = [
    { id: 1, note: 'C', color: '#FF6B6B', emoji: '🎵', frequency: 261.63 },
    { id: 2, note: 'D', color: '#4ECDC4', emoji: '🎶', frequency: 293.66 },
    { id: 3, note: 'E', color: '#45B7D1', emoji: '🎼', frequency: 329.63 },
    { id: 4, note: 'F', color: '#96CEB4', emoji: '🎹', frequency: 349.23 },
    { id: 5, note: 'G', color: '#FFEAA7', emoji: '🎺', frequency: 392.00 },
    { id: 6, note: 'A', color: '#DFE6E9', emoji: '🎸', frequency: 440.00 },
  ];

  useEffect(() => {
    if (gameStarted && !gameComplete && !gameLost && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameLost(true);
            setGameStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameComplete, gameLost, timeLeft]);

  const playSound = (frequency) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNoteClick = (note) => {
    if (!gameStarted) setGameStarted(true);
    if (gameComplete || gameLost) return;

    setPlayingNote(note.id);
    playSound(note.frequency);
    setTimeout(() => setPlayingNote(null), 300);
    
    const newScore = score + 1;
    setScore(newScore);

    if (newScore >= 10) {
      setGameComplete(true);
      setGameStarted(false);
      setTimeout(async () => {
        await completeActivity(activity.id);
      }, 500);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(activity.timeSpent * 60);
    setGameStarted(false);
    setGameComplete(false);
    setGameLost(false);
    setPlayingNote(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/kid/activities')} style={styles.backBtn}>←</motion.button>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>🎵 {activity.title}</h1>
          <div style={styles.info}>
            <span style={styles.badge}>⭐ {stats?.totalStars || 0}</span>
            <span style={styles.badge}>🎶 Score: {score}/10</span>
            <span style={{...styles.badge, background: timeLeft < 30 ? 'rgba(255, 107, 107, 0.4)' : 'rgba(255,255,255,0.2)', animation: timeLeft < 30 ? 'pulse 1s infinite' : 'none'}}>⏱️ {formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div style={styles.instructions}>
        <p style={styles.instructionText}>
          {!gameStarted && !gameComplete && !gameLost && '💡 Click any note to start making music!'}
          {gameStarted && `🎵 Keep playing! Score ${10 - score} more notes to complete!`}
        </p>
      </div>

      <div style={styles.musicGrid}>
        {notes.map((note) => (
          <motion.div key={note.id} whileHover={{ scale: (!gameComplete && !gameLost) ? 1.1 : 1 }} whileTap={{ scale: (!gameComplete && !gameLost) ? 0.9 : 1 }} animate={{ scale: playingNote === note.id ? 1.2 : 1, boxShadow: playingNote === note.id ? `0 0 40px ${note.color}` : '0 8px 20px rgba(0,0,0,0.2)' }} onClick={() => handleNoteClick(note)} style={{...styles.musicTile, background: `linear-gradient(135deg, ${note.color} 0%, ${note.color}dd 100%)`, cursor: (!gameComplete && !gameLost) ? 'pointer' : 'default', opacity: (gameComplete || gameLost) ? 0.7 : 1}}>
            <div style={styles.noteEmoji}>{note.emoji}</div>
            <div style={styles.noteName}>{note.note}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {gameComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.modal}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={styles.modalContent}>
              <div style={styles.modalIcon}>🎉</div>
              <h2 style={styles.modalTitle}>Musical Masterpiece!</h2>
              <p style={styles.modalText}>You played {score} notes!</p>
              <p style={styles.modalPoints}>+{activity.points} ⭐</p>
              <div style={styles.modalButtons}>
                <motion.button whileHover={{ scale: 1.05 }} onClick={resetGame} style={styles.playAgainBtn}>🔄 Play Again</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/kid/activities')} style={styles.continueBtn}>Continue →</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameLost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.modal}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={styles.modalContent}>
              <div style={styles.modalIcon}>⏰</div>
              <h2 style={styles.modalTitle}>Time's Up!</h2>
              <p style={styles.modalText}>You played {score} notes!</p>
              <div style={styles.modalButtons}>
                <motion.button whileHover={{ scale: 1.05 }} onClick={resetGame} style={styles.playAgainBtn}>🔄 Try Again</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/kid/activities')} style={styles.backBtn2}>← Back</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }`}</style>
    </div>
  );
};

const styles = {
  container: { height: '100vh', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', padding: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '1rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '1rem' },
  backBtn: { width: '45px', height: '45px', background: 'rgba(255,255,255,0.2)', border: '2px solid white', borderRadius: '50%', color: 'white', fontSize: '1.3rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, textAlign: 'center' },
  title: { fontSize: '1.6rem', color: 'white', fontWeight: '700', margin: 0, marginBottom: '0.3rem' },
  info: { display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' },
  badge: { background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: '600', color: 'white' },
  instructions: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.8rem 1.5rem', borderRadius: '1rem', textAlign: 'center' },
  instructionText: { color: 'white', fontSize: '1rem', fontWeight: '600', margin: 0 },
  musicGrid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '600px', margin: '0 auto', width: '100%' },
  musicTile: { borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.3s', aspectRatio: '1' },
  noteEmoji: { fontSize: '4rem', marginBottom: '0.5rem' },
  noteName: { fontSize: '2rem', fontWeight: '700' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '2rem', borderRadius: '2rem', textAlign: 'center', maxWidth: '400px' },
  modalIcon: { fontSize: '4rem', marginBottom: '0.5rem' },
  modalTitle: { fontSize: '2rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' },
  modalText: { fontSize: '1.3rem', color: '#666', marginBottom: '0.5rem' },
  modalPoints: { fontSize: '1.5rem', color: '#FFD700', fontWeight: '700', marginBottom: '1rem' },
  modalButtons: { display: 'flex', gap: '1rem', justifyContent: 'center' },
  playAgainBtn: { background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' },
  continueBtn: { background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' },
  backBtn2: { background: 'linear-gradient(135deg, #FF6B6B 0%, #ff4757 100%)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }
};

export default MusicPage;
