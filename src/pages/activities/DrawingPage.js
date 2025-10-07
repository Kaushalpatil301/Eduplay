import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

const DrawingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeActivity, stats } = useGame();
  const activity = location.state?.activity || { id: 10, title: 'Creative Canvas', points: 12, timeSpent: 6 };
  
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(5);
  const [timeLeft, setTimeLeft] = useState(activity.timeSpent * 60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFEAA7', '#A29BFE', '#FD79A8'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

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

  const startDrawing = (e) => {
    if (!gameStarted) setGameStarted(true);
    if (gameComplete || gameLost) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || gameComplete || gameLost) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    const context = canvas.getContext('2d');
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const completeDrawing = async () => {
    setGameComplete(true);
    setGameStarted(false);
    await completeActivity(activity.id);
  };

  const resetGame = () => {
    setTimeLeft(activity.timeSpent * 60);
    setGameStarted(false);
    setGameComplete(false);
    setGameLost(false);
    clearCanvas();
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
          <h1 style={styles.title}>🎨 {activity.title}</h1>
          <div style={styles.info}>
            <span style={styles.badge}>⭐ {stats?.totalStars || 0}</span>
            <span style={{...styles.badge, background: timeLeft < 30 ? 'rgba(255, 107, 107, 0.4)' : 'rgba(255,255,255,0.25)', animation: timeLeft < 30 ? 'pulse 1s infinite' : 'none'}}>⏱️ {formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div style={styles.instructions}>
        <p style={styles.instructionText}>
          {!gameStarted && !gameComplete && !gameLost && '💡 Start drawing to begin!'}
          {gameStarted && '🎨 Create your masterpiece!'}
        </p>
      </div>

      <div style={styles.main}>
        <div style={styles.toolbar}>
          <div style={styles.section}>
            <div style={styles.label}>🎨 Colors</div>
            <div style={styles.colorGrid}>
              {colors.map((c) => (
                <motion.div key={c} whileTap={{ scale: 0.8 }} onClick={() => setColor(c)} style={{...styles.colorBtn, background: c, border: color === c ? '3px solid white' : '2px solid rgba(255,255,255,0.3)'}} />
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.label}>📏 Size: {brushSize}px</div>
            <input type="range" min="1" max="15" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} style={styles.slider} />
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearCanvas} style={{...styles.btn, background: '#f44336'}} disabled={gameComplete || gameLost}>🗑️ Clear</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={completeDrawing} style={{...styles.btn, background: '#4CAF50'}} disabled={gameComplete || gameLost}>✓ Done</motion.button>
        </div>

        <div style={styles.canvasArea}>
          <canvas ref={canvasRef} width={600} height={400} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} style={{...styles.canvas, opacity: (gameComplete || gameLost) ? 0.7 : 1}} />
        </div>
      </div>

      <AnimatePresence>
        {gameComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.modal}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={styles.modalContent}>
              <div style={styles.modalIcon}>🎉</div>
              <h2 style={styles.modalTitle}>Amazing Art!</h2>
              <p style={styles.modalText}>Your creativity is incredible!</p>
              <p style={styles.modalPoints}>+{activity.points} ⭐</p>
              <div style={styles.modalButtons}>
                <motion.button whileHover={{ scale: 1.05 }} onClick={resetGame} style={styles.playAgainBtn}>🎨 Draw Again</motion.button>
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
              <p style={styles.modalText}>Great start on your artwork!</p>
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
  container: { height: '100vh', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '0.8rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '1rem' },
  backBtn: { width: '45px', height: '45px', background: 'rgba(255,255,255,0.2)', border: '2px solid white', borderRadius: '50%', color: 'white', fontSize: '1.3rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, textAlign: 'center' },
  title: { fontSize: '1.6rem', color: 'white', fontWeight: '700', margin: 0, marginBottom: '0.3rem' },
  info: { display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' },
  badge: { background: 'rgba(255,255,255,0.25)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: '600', color: 'white' },
  instructions: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.6rem 1rem', borderRadius: '1rem', textAlign: 'center' },
  instructionText: { color: 'white', fontSize: '1rem', fontWeight: '600', margin: 0 },
  main: { flex: 1, display: 'flex', gap: '1rem', overflow: 'hidden' },
  toolbar: { width: '180px', background: 'rgba(255,255,255,0.95)', borderRadius: '1rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' },
  section: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.9rem', fontWeight: '700', color: '#333' },
  colorGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' },
  colorBtn: { width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  slider: { width: '100%', height: '6px', borderRadius: '10px', outline: 'none', cursor: 'pointer' },
  btn: { padding: '0.8rem', border: 'none', borderRadius: '1rem', color: 'white', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
  canvasArea: { flex: 1, background: 'rgba(255,255,255,0.95)', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' },
  canvas: { border: '2px solid #ddd', borderRadius: '0.5rem', cursor: 'crosshair', background: 'white', maxWidth: '100%', maxHeight: '100%', touchAction: 'none' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '2rem', borderRadius: '2rem', textAlign: 'center', maxWidth: '400px' },
  modalIcon: { fontSize: '4rem', marginBottom: '0.5rem' },
  modalTitle: { fontSize: '2rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' },
  modalText: { fontSize: '1.3rem', color: '#666', marginBottom: '0.5rem' },
  modalPoints: { fontSize: '1.5rem', color: '#FFD700', fontWeight: '700', marginBottom: '1rem' },
  modalButtons: { display: 'flex', gap: '1rem', justifyContent: 'center' },
  playAgainBtn: { background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' },
  continueBtn: { background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' },
  backBtn2: { background: 'linear-gradient(135deg, #FF6B6B 0%, #ff4757 100%)', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }
};

export default DrawingPage;
