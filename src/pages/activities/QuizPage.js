import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeActivity, stats } = useGame();
  const activity = location.state?.activity || { id: 4, title: 'Math Quiz', points: 25, timeSpent: 5 };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activity.timeSpent * 60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const questions = [
    { question: "What is 5 + 3?", options: ["6", "7", "8", "9"], correct: 2, emoji: "🔢" },
    { question: "Which planet is closest to the sun?", options: ["Mars", "Venus", "Mercury", "Earth"], correct: 2, emoji: "🌍" },
    { question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], correct: 1, emoji: "🕷️" },
    { question: "Blue + Yellow makes?", options: ["Green", "Purple", "Orange", "Red"], correct: 0, emoji: "🎨" },
    { question: "Capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: 2, emoji: "🗼" }
  ];

  useEffect(() => {
    if (gameStarted && !quizComplete && !gameLost && timeLeft > 0) {
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
  }, [gameStarted, quizComplete, gameLost, timeLeft]);

  const handleAnswerClick = (index) => {
    if (!gameStarted) setGameStarted(true);
    if (selectedAnswer !== null || gameLost) return;

    setSelectedAnswer(index);
    setShowResult(true);

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }

    setTimeout(async () => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
        setGameStarted(false);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        await completeActivity(activity.id);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setTimeLeft(activity.timeSpent * 60);
    setGameStarted(false);
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
          <h1 style={styles.title}>❓ {activity.title}</h1>
          <div style={styles.info}>
            <span style={styles.badge}>⭐ {stats?.totalStars || 0}</span>
            <span style={styles.badge}>Q {currentQuestion + 1}/{questions.length}</span>
            <span style={styles.badge}>Score: {score}</span>
            <span style={{...styles.badge, background: timeLeft < 30 ? 'rgba(255, 107, 107, 0.5)' : 'rgba(255,255,255,0.25)', animation: timeLeft < 30 ? 'pulse 1s infinite' : 'none'}}>⏱️ {formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
          style={styles.progressBar}
        />
      </div>

      {/* Instructions */}
      <div style={styles.instructions}>
        <p style={styles.instructionText}>
          {!gameStarted && !quizComplete && !gameLost && '💡 Choose an answer to start the quiz!'}
          {gameStarted && '🧠 Think carefully and choose wisely!'}
        </p>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <AnimatePresence mode="wait">
          {!quizComplete && !gameLost ? (
            <motion.div 
              key={currentQuestion} 
              initial={{ opacity: 0, x: 100, scale: 0.8 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={styles.quizBox}
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                style={styles.emoji}
              >
                {questions[currentQuestion].emoji}
              </motion.div>
              <h2 style={styles.question}>{questions[currentQuestion].question}</h2>
              <div style={styles.optionsGrid}>
                {questions[currentQuestion].options.map((option, index) => {
                  let btnStyle = styles.option;
                  if (showResult) {
                    if (index === questions[currentQuestion].correct) {
                      btnStyle = { ...styles.option, ...styles.correct };
                    } else if (index === selectedAnswer) {
                      btnStyle = { ...styles.option, ...styles.wrong };
                    }
                  }
                  return (
                    <motion.button 
                      key={index} 
                      whileHover={{ scale: selectedAnswer === null ? 1.05 : 1, y: selectedAnswer === null ? -5 : 0 }} 
                      whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }} 
                      onClick={() => handleAnswerClick(index)} 
                      style={btnStyle} 
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                      {showResult && index === questions[currentQuestion].correct && " ✅"}
                      {showResult && index === selectedAnswer && index !== questions[currentQuestion].correct && " ❌"}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }} 
              animate={{ opacity: 1, scale: 1, rotate: 0 }} 
              transition={{ type: 'spring', stiffness: 100 }}
              style={styles.resultBox}
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                style={styles.resultEmoji}
              >
                {quizComplete ? '🎉' : '⏰'}
              </motion.div>
              <h2 style={styles.resultTitle}>{quizComplete ? 'Quiz Complete!' : 'Time\'s Up!'}</h2>
              <div style={styles.scoreCircle}>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  style={styles.scoreText}
                >
                  {score}/{questions.length}
                </motion.span>
              </div>
              <p style={styles.resultMsg}>
                {quizComplete ? (
                  score === questions.length ? "Perfect Score! 🌟" : 
                  score >= 3 ? "Great job! Keep it up! 📚" : 
                  "Good try! Practice makes perfect! 💪"
                ) : `You scored ${score}/${questions.length}!`}
              </p>
              {quizComplete && (
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  style={styles.pointsText}
                >
                  +{activity.points} ⭐
                </motion.p>
              )}
              <div style={styles.buttons}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetQuiz} style={styles.retryBtn}>🔄 Try Again</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/kid/activities')} style={styles.homeBtn}>← Games</motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
  container: { height: '100vh', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '0.8rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '1.2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
  backBtn: { minWidth: '50px', height: '50px', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', color: 'white', fontSize: '1.5rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  headerCenter: { flex: 1, textAlign: 'center' },
  title: { fontSize: '1.8rem', color: 'white', fontWeight: '700', margin: 0, marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  info: { display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' },
  badge: { background: 'rgba(255,255,255,0.25)', padding: '0.4rem 1rem', borderRadius: '1.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)' },
  progressContainer: { height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
  progressBar: { height: '100%', background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)', borderRadius: '10px', transition: 'width 0.5s ease', boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)' },
  instructions: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.8rem 1.5rem', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
  instructionText: { color: 'white', fontSize: '1.1rem', fontWeight: '600', margin: 0 },
  main: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  quizBox: { background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', borderRadius: '2rem', padding: '2.5rem', width: '100%', maxWidth: '650px', boxShadow: '0 15px 50px rgba(0,0,0,0.3)' },
  emoji: { fontSize: '4rem', textAlign: 'center', marginBottom: '1.5rem' },
  question: { fontSize: '1.6rem', color: '#333', textAlign: 'center', marginBottom: '2rem', fontWeight: '700', lineHeight: '1.4' },
  optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
  option: { background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)', border: '2px solid #dee2e6', padding: '1.2rem', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', color: '#333', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  correct: { background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', border: '2px solid #4CAF50', boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)' },
  wrong: { background: 'linear-gradient(135deg, #f44336 0%, #da190b 100%)', color: 'white', border: '2px solid #f44336', boxShadow: '0 6px 20px rgba(244, 67, 54, 0.4)' },
  resultBox: { background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', borderRadius: '2rem', padding: '3rem', textAlign: 'center', maxWidth: '500px', boxShadow: '0 15px 50px rgba(0,0,0,0.3)' },
  resultEmoji: { fontSize: '5rem', marginBottom: '1rem' },
  resultTitle: { fontSize: '2.5rem', fontWeight: '700', color: '#333', marginBottom: '1.5rem' },
  scoreCircle: { width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.5rem auto', boxShadow: '0 10px 30px rgba(255,215,0,0.5)', border: '5px solid white' },
  scoreText: { fontSize: '2.5rem', fontWeight: '700', color: 'white' },
  resultMsg: { fontSize: '1.3rem', color: '#666', marginBottom: '1rem', lineHeight: '1.5' },
  pointsText: { fontSize: '2rem', color: '#FFD700', fontWeight: '700', marginBottom: '1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' },
  buttons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  retryBtn: { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(240, 147, 251, 0.4)' },
  homeBtn: { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '1.2rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(79, 172, 254, 0.4)' }
};

export default QuizPage;
