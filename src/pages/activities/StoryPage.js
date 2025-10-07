import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

const StoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeActivity, stats } = useGame();
  const activity = location.state?.activity || { id: 7, title: 'Adventure Story', points: 15, timeSpent: 4 };
  
  const [currentPage, setCurrentPage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(activity.timeSpent * 60);
  const [gameStarted, setGameStarted] = useState(false);
  const [storyComplete, setStoryComplete] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const story = [
    { text: "Once upon a time, in a magical forest, there lived a curious little fox named Luna. 🦊", image: "🌲", bg: '#43e97b' },
    { text: "Luna loved to explore and learn new things every day. One morning, she discovered a glowing book! 📚✨", image: "📖", bg: '#4facfe' },
    { text: "The book was filled with puzzles and stories. Luna realized learning is an adventure! 🎯", image: "🧩", bg: '#f093fb' },
    { text: "Every page made her smarter and happier. She earned golden stars! ⭐", image: "⭐", bg: '#FFD700' },
    { text: "Luna shared her magical book with all her friends. Just like you! 🌟", image: "🎉", bg: '#fa709a' }
  ];

  useEffect(() => {
    if (gameStarted && !storyComplete && !gameLost && timeLeft > 0) {
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
  }, [gameStarted, storyComplete, gameLost, timeLeft]);

  const handleNext = async () => {
    if (!gameStarted) setGameStarted(true);

    if (currentPage < story.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setStoryComplete(true);
      setGameStarted(false);
      await completeActivity(activity.id);
    }
  };

  const handlePrevious = () => {
    if (!gameStarted) setGameStarted(true);
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetStory = () => {
    setCurrentPage(0);
    setTimeLeft(activity.timeSpent * 60);
    setGameStarted(false);
    setStoryComplete(false);
    setGameLost(false);
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
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/kid/activities')} style={styles.backBtn}>←</motion.button>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>📚 {activity.title}</h1>
          <div style={styles.info}>
            <span style={styles.badge}>⭐ {stats?.totalStars || 0}</span>
            <span style={styles.badge}>Page {currentPage + 1}/{story.length}</span>
            <span style={{...styles.badge, background: timeLeft < 30 ? 'rgba(255, 107, 107, 0.5)' : 'rgba(255,255,255,0.25)', animation: timeLeft < 30 ? 'pulse 1s infinite' : 'none'}}>⏱️ {formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div style={styles.progressDots}>
        {story.map((_, index) => (
          <motion.div 
            key={index} 
            animate={{ 
              scale: index === currentPage ? 1.3 : 1,
              background: index === currentPage ? '#FFD700' : index < currentPage ? '#4CAF50' : 'rgba(255,255,255,0.3)'
            }}
            style={styles.progressDot}
          />
        ))}
      </div>

      {/* Instructions */}
      <div style={styles.instructions}>
        <p style={styles.instructionText}>
          {!gameStarted && !storyComplete && !gameLost && '💡 Click Next to begin the adventure!'}
          {gameStarted && '📖 Enjoy Luna\'s magical journey!'}
        </p>
      </div>

      {/* Story Area */}
      <div style={styles.storyArea}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage} 
            initial={{ opacity: 0, x: 100, rotateY: -90 }} 
            animate={{ opacity: 1, x: 0, rotateY: 0 }} 
            exit={{ opacity: 0, x: -100, rotateY: 90 }}
            transition={{ duration: 0.6, type: 'spring' }}
            style={{
              ...styles.storyCard,
              background: `linear-gradient(135deg, ${story[currentPage].bg}20 0%, ${story[currentPage].bg}10 100%)`
            }}
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0]
              }} 
              transition={{ duration: 3, repeat: Infinity }}
              style={styles.storyImage}
            >
              {story[currentPage].image}
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={styles.storyText}
            >
              {story[currentPage].text}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <motion.button 
          whileHover={{ scale: 1.05, x: -5 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={handlePrevious} 
          disabled={currentPage === 0 || storyComplete || gameLost} 
          style={{
            ...styles.controlBtn, 
            opacity: (currentPage === 0 || storyComplete || gameLost) ? 0.4 : 1, 
            cursor: (currentPage === 0 || storyComplete || gameLost) ? 'not-allowed' : 'pointer'
          }}
        >
          ← Previous
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05, x: 5 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={handleNext} 
          disabled={storyComplete || gameLost} 
          style={{
            ...styles.controlBtn, 
            ...styles.nextBtn,
            opacity: (storyComplete || gameLost) ? 0.4 : 1, 
            cursor: (storyComplete || gameLost) ? 'not-allowed' : 'pointer'
          }}
        >
          {currentPage === story.length - 1 ? '🎉 Finish' : 'Next →'}
        </motion.button>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {storyComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.modal}>
            <motion.div 
              initial={{ scale: 0, rotate: -180 }} 
              animate={{ scale: 1, rotate: 0 }} 
              transition={{ type: 'spring', stiffness: 100 }}
              style={styles.modalContent}
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                style={styles.modalIcon}
              >
                🎉
              </motion.div>
              <h2 style={styles.modalTitle}>Story Complete!</h2>
              <p style={styles.modalText}>What an amazing adventure with Luna!</p>
              <motion.p 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                style={styles.modalPoints}
              >
                +{activity.points} ⭐
              </motion.p>
              <div style={styles.modalButtons}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetStory} style={styles.playAgainBtn}>📚 Read Again</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/kid/activities')} style={styles.continueBtn}>Continue →</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time's Up Modal */}
      <AnimatePresence>
        {gameLost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.modal}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={styles.modalContent}>
              <div style={styles.modalIcon}>⏰</div>
              <h2 style={styles.modalTitle}>Time's Up!</h2>
              <p style={styles.modalText}>You read {currentPage + 1}/{story.length} pages! Great start!</p>
              <div style={styles.modalButtons}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetStory} style={styles.playAgainBtn}>🔄 Try Again</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/kid/activities')} style={styles.backBtn2}>← Back</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse { 
          0%, 100% { opacity: 1; transform: scale(1); } 
          50% { opacity: 0.7; transform: scale(0.98); } 
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { height: '100vh', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '0.8rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '1.2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
  backBtn: { minWidth: '50px', height: '50px', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', color: 'white', fontSize: '1.5rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  headerCenter: { flex: 1, textAlign: 'center' },
  title: { fontSize: '1.8rem', color: 'white', fontWeight: '700', margin: 0, marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  info: { display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' },
  badge: { background: 'rgba(255,255,255,0.25)', padding: '0.4rem 1rem', borderRadius: '1.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)' },
  progressDots: { display: 'flex', gap: '0.8rem', justifyContent: 'center', padding: '0.5rem' },
  progressDot: { width: '16px', height: '16px', borderRadius: '50%', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  instructions: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.8rem 1.5rem', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
  instructionText: { color: 'white', fontSize: '1.1rem', fontWeight: '600', margin: 0 },
  storyArea: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  storyCard: { background: 'rgba(255,255,255,0.95)', borderRadius: '2rem', padding: '3rem', maxWidth: '700px', textAlign: 'center', boxShadow: '0 15px 50px rgba(0,0,0,0.3)', border: '3px solid rgba(255,255,255,0.5)' },
  storyImage: { fontSize: '6rem', marginBottom: '2rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' },
  storyText: { fontSize: '1.4rem', color: '#333', lineHeight: '1.8', fontWeight: '500' },
  controls: { display: 'flex', justifyContent: 'space-between', gap: '1rem' },
  controlBtn: { padding: '1rem 2rem', background: 'rgba(255,255,255,0.95)', color: '#333', border: 'none', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,0,0,0.2)', flex: 1 },
  nextBtn: { background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: 'white', boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modalContent: { background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', padding: '3rem', borderRadius: '2rem', textAlign: 'center', maxWidth: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' },
  modalIcon: { fontSize: '5rem', marginBottom: '1rem' },
  modalTitle: { fontSize: '2.5rem', fontWeight: '700', color: '#333', marginBottom: '1rem' },
  modalText: { fontSize: '1.3rem', color: '#666', marginBottom: '1rem', lineHeight: '1.5' },
  modalPoints: { fontSize: '2rem', color: '#FFD700', fontWeight: '700', marginBottom: '1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' },
  modalButtons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  playAgainBtn: { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(79, 172, 254, 0.4)' },
  continueBtn: { background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)' },
  backBtn2: { background: 'linear-gradient(135deg, #FF6B6B 0%, #ff4757 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)' }
};

export default StoryPage;
