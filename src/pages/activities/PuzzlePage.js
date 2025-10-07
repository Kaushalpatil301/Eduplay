import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';

const PuzzlePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeActivity, stats } = useGame();
  const activity = location.state?.activity || { 
    id: 1, 
    title: 'Picture Match', 
    points: 15, 
    timeSpent: 3 
  };
  
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(activity.timeSpent * 60); // Convert minutes to seconds
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const emojis = ['🎮', '⚽', '🎨', '🎸', '🚀', '🍕'];

  useEffect(() => {
    initializeGame();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameStarted && !gameWon && !gameLost && timeLeft > 0) {
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
  }, [gameStarted, gameWon, gameLost, timeLeft]);

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimeLeft(activity.timeSpent * 60);
    setGameStarted(false);
    setGameWon(false);
    setGameLost(false);
  };

  const handleCardClick = (index) => {
    if (!gameStarted) setGameStarted(true); // Start timer on first click
    if (gameWon || gameLost) return;
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index].emoji)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;

      if (cards[first].emoji === cards[second].emoji) {
        const newMatchedPairs = [...matchedPairs, cards[first].emoji];
        setMatchedPairs(newMatchedPairs);
        setFlippedIndices([]);

        if (newMatchedPairs.length === emojis.length) {
          setTimeout(async () => {
            setGameWon(true);
            setGameStarted(false);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            await completeActivity(activity.id);
          }, 500);
        }
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          onClick={() => navigate('/kid/activities')} 
          style={styles.backBtn}
        >
          ←
        </motion.button>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>🧩 {activity.title}</h1>
          <div style={styles.info}>
            <span style={styles.badge}>⭐ {stats?.totalStars || 0}</span>
            <span style={styles.badge}>🎯 {moves} moves</span>
            <span style={{
              ...styles.badge,
              background: timeLeft < 30 ? 'rgba(255, 107, 107, 0.4)' : 'rgba(255, 255, 255, 0.25)',
              animation: timeLeft < 30 ? 'pulse 1s infinite' : 'none'
            }}>
              ⏱️ {formatTime(timeLeft)}
            </span>
            <span style={styles.badge}>🎪 {matchedPairs.length}/{emojis.length}</span>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={initializeGame} 
          style={styles.resetBtn}
        >
          🔄
        </motion.button>
      </div>

      {/* Instructions */}
      <div style={styles.instructions}>
        <p style={styles.instructionText}>
          {!gameStarted && !gameWon && !gameLost && '💡 Click any card to start!'}
          {gameStarted && '🎮 Find all matching pairs before time runs out!'}
        </p>
      </div>

      {/* Game Board */}
      <div style={styles.gameArea}>
        <div style={styles.gameBoard}>
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card.emoji);
            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: isFlipped ? 1 : 1.08 }}
                whileTap={{ scale: isFlipped ? 1 : 0.92 }}
                onClick={() => handleCardClick(index)}
                style={{
                  ...styles.card,
                  cursor: isFlipped ? 'default' : 'pointer',
                  opacity: isFlipped ? 0.95 : 1
                }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={styles.cardInner}
                >
                  <div style={styles.cardFront}>❓</div>
                  <div style={{ ...styles.cardBack, transform: 'rotateY(180deg)' }}>{card.emoji}</div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {gameWon && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.modal}>
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.6 }} style={styles.modalContent}>
              <div style={styles.modalIcon}>🎉</div>
              <h2 style={styles.modalTitle}>Puzzle Complete!</h2>
              <p style={styles.modalSubtitle}>You did it with time to spare!</p>
              <div style={styles.modalStats}>
                <div style={styles.stat}>
                  <div style={styles.statIcon}>🎯</div>
                  <div style={styles.statValue}>{moves}</div>
                  <div style={styles.statLabel}>Moves</div>
                </div>
                <div style={styles.statDivider}></div>
                <div style={styles.stat}>
                  <div style={styles.statIcon}>⏱️</div>
                  <div style={styles.statValue}>{formatTime(timeLeft)}</div>
                  <div style={styles.statLabel}>Time Left</div>
                </div>
                <div style={styles.statDivider}></div>
                <div style={styles.stat}>
                  <div style={styles.statIcon}>⭐</div>
                  <div style={styles.statValue}>+{activity.points}</div>
                  <div style={styles.statLabel}>Stars</div>
                </div>
              </div>
              <div style={styles.modalButtons}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={initializeGame} style={styles.playAgainBtn}>🔄 Play Again</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/kid/activities')} style={styles.continueBtn}>Continue →</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lose Modal */}
      <AnimatePresence>
        {gameLost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.modal}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={styles.modalContent}>
              <div style={styles.modalIcon}>⏰</div>
              <h2 style={styles.modalTitle}>Time's Up!</h2>
              <p style={styles.modalSubtitle}>You matched {matchedPairs.length}/{emojis.length} pairs</p>
              <div style={styles.modalButtons}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={initializeGame} style={styles.playAgainBtn}>🔄 Try Again</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/kid/activities')} style={styles.backBtnModal}>← Back</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '1rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '1.2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
  backBtn: { minWidth: '50px', height: '50px', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', color: 'white', fontSize: '1.5rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  headerCenter: { flex: 1, textAlign: 'center' },
  title: { fontSize: '1.8rem', color: 'white', fontWeight: '700', margin: 0, marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  info: { display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' },
  badge: { background: 'rgba(255,255,255,0.25)', padding: '0.4rem 1rem', borderRadius: '1.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)' },
  resetBtn: { minWidth: '50px', height: '50px', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', color: 'white', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  instructions: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.8rem 1.5rem', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
  instructionText: { color: 'white', fontSize: '1.1rem', fontWeight: '600', margin: 0 },
  gameArea: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  gameBoard: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: '600px', width: '100%' },
  card: { aspectRatio: '1', perspective: '1000px' },
  cardInner: { position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' },
  cardFront: { position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(135deg, #FFB347 0%, #ff9a00 100%)', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', backfaceVisibility: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', border: '3px solid rgba(255,255,255,0.3)' },
  cardBack: { position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', backfaceVisibility: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', border: '3px solid rgba(102, 126, 234, 0.3)' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modalContent: { background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', padding: '2.5rem', borderRadius: '2rem', textAlign: 'center', maxWidth: '450px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' },
  modalIcon: { fontSize: '5rem', marginBottom: '1rem' },
  modalTitle: { fontSize: '2.2rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' },
  modalSubtitle: { fontSize: '1.1rem', color: '#666', marginBottom: '2rem' },
  modalStats: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.08)', borderRadius: '1.5rem' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  statIcon: { fontSize: '2rem' },
  statValue: { fontSize: '2rem', fontWeight: '700', color: '#667eea' },
  statLabel: { fontSize: '0.9rem', color: '#666', fontWeight: '500' },
  statDivider: { width: '2px', height: '60px', background: 'linear-gradient(180deg, transparent, #ddd, transparent)' },
  modalButtons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  playAgainBtn: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)' },
  continueBtn: { background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)' },
  backBtnModal: { background: 'linear-gradient(135deg, #FF6B6B 0%, #ff4757 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)' },
};

export default PuzzlePage;
