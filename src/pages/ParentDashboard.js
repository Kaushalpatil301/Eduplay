import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const ParentDashboard = () => {
  const { api } = useAuth();
  const [kids, setKids] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [kidDetails, setKidDetails] = useState(null);
  const [editingLimit, setEditingLimit] = useState(false);
  const [newLimit, setNewLimit] = useState(120);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKids();
  }, []);

  const fetchKids = async () => {
    try {
      const response = await api.get('/parent/kids');
      setKids(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchKidDetails = async (kidId) => {
    try {
      const response = await api.get(`/parent/kids/${kidId}`);
      setKidDetails(response.data);
      setNewLimit(response.data.kid.dailyLimit);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectKid = (kid) => {
    setSelectedKid(kid);
    fetchKidDetails(kid.id);
    setEditingLimit(false);
  };

  const handleUpdateLimit = async () => {
    try {
      await api.put(`/parent/kids/${selectedKid.id}/limit`, { dailyLimit: parseInt(newLimit) });
      setKidDetails({ ...kidDetails, kid: { ...kidDetails.kid, dailyLimit: parseInt(newLimit) }});
      setEditingLimit(false);
      alert('✅ Limit updated!');
    } catch (error) {
      alert('❌ Update failed');
    }
  };

  if (loading) {
    return (
      <div style={s.loading}>
        <div style={s.spinner}>🎮</div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <Navbar />
      <div style={s.content}>
        <AnimatePresence mode="wait">
          {!selectedKid ? (
            <motion.div key="select" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <h1 style={s.title}>👨‍👩‍👧 Select a Child</h1>
              <div style={s.grid}>
                {kids.map((kid) => (
                  <motion.div
                    key={kid.id}
                    whileHover={{y:-5}}
                    onClick={() => handleSelectKid(kid)}
                    style={s.card}
                  >
                    <div style={s.avatar}>{kid.username[0].toUpperCase()}</div>
                    <h2 style={s.name}>{kid.username}</h2>
                    <div style={s.stats}>
                      <span>⭐ {kid.totalStars}</span>
                      <span>🔥 {kid.streak}d</span>
                    </div>
                    <div style={s.limit}>⏱️ {kid.dailyLimit} min/day</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="details" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <button onClick={() => setSelectedKid(null)} style={s.back}>← Back</button>
              
              {kidDetails && (
                <>
                  <div style={s.header}>
                    <div style={s.avatar}>{selectedKid.username[0].toUpperCase()}</div>
                    <div>
                      <h1 style={s.title}>{selectedKid.username}'s Dashboard</h1>
                      <p style={s.subtitle}>Learning progress and activity</p>
                    </div>
                  </div>

                  <div style={s.statsGrid}>
                    <div style={{...s.stat, background: 'linear-gradient(135deg, #FFB347 0%, #ff9a00 100%)'}}>
                      <div style={s.statIcon}>⭐</div>
                      <div style={s.statValue}>{kidDetails.kid.totalStars}</div>
                      <div style={s.statLabel}>Stars</div>
                    </div>
                    <div style={{...s.stat, background: 'linear-gradient(135deg, #00BFFF 0%, #0099cc 100%)'}}>
                      <div style={s.statIcon}>📊</div>
                      <div style={s.statValue}>{kidDetails.activityCount}</div>
                      <div style={s.statLabel}>Activities</div>
                    </div>
                    <div style={{...s.stat, background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'}}>
                      <div style={s.statIcon}>⏱️</div>
                      <div style={s.statValue}>{kidDetails.totalTime}</div>
                      <div style={s.statLabel}>Minutes</div>
                    </div>
                    <div style={{...s.stat, background: 'linear-gradient(135deg, #FF6B9D 0%, #ff4d7d 100%)'}}>
                      <div style={s.statIcon}>🏆</div>
                      <div style={s.statValue}>{kidDetails.rewardCount}</div>
                      <div style={s.statLabel}>Rewards</div>
                    </div>
                  </div>

                  <div style={s.box}>
                    <div style={s.boxHeader}>
                      <h2 style={s.boxTitle}>⏰ Daily Time Limit</h2>
                      {!editingLimit && (
                        <button onClick={() => setEditingLimit(true)} style={s.editBtn}>✏️ Edit</button>
                      )}
                    </div>
                    {editingLimit ? (
                      <div style={s.editor}>
                        <input
                          type="range"
                          min="15"
                          max="240"
                          step="15"
                          value={newLimit}
                          onChange={(e) => setNewLimit(e.target.value)}
                          style={s.slider}
                        />
                        <div style={s.sliderVal}>{newLimit} minutes</div>
                        <div style={s.btnRow}>
                          <button onClick={handleUpdateLimit} style={s.saveBtn}>💾 Save</button>
                          <button onClick={() => setEditingLimit(false)} style={s.cancelBtn}>❌ Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={s.currentLimit}>
                        <div style={s.limitCircle}>
                          <div style={s.limitNum}>{kidDetails.kid.dailyLimit}</div>
                          <div>min/day</div>
                        </div>
                        <div style={{flex:1}}>
                          <div style={s.progressBar}>
                            <div style={{...s.progressFill, width: `${(kidDetails.totalTime/kidDetails.kid.dailyLimit)*100}%`}}></div>
                          </div>
                          <span>{kidDetails.totalTime} / {kidDetails.kid.dailyLimit} min used</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={s.box}>
                    <h2 style={s.boxTitle}>📝 Recent Activities</h2>
                    {kidDetails.activities?.slice(0,10).map((a, i) => (
                      <div key={i} style={s.activity}>
                        <div style={s.actIcon}>
                          {a.activityName.includes('Puzzle')?'🧩':a.activityName.includes('Quiz')?'📝':a.activityName.includes('Story')?'📖':a.activityName.includes('Draw')?'🎨':'🎵'}
                        </div>
                        <div style={{flex:1}}>
                          <div style={s.actName}>{a.activityName}</div>
                          <div style={s.actDate}>{new Date(a.completedAt).toLocaleString()}</div>
                        </div>
                        <div style={s.actStats}>
                          <span>⏱️ {a.timeSpent}m</span>
                          <span>⭐ {a.starsEarned}</span>
                        </div>
                      </div>
                    ))}
                    {(!kidDetails.activities || kidDetails.activities.length === 0) && (
                      <p style={s.noData}>No activities yet</p>
                    )}
                  </div>

                  <div style={s.box}>
                    <h2 style={s.boxTitle}>🏆 Earned Rewards</h2>
                    <div style={s.rewards}>
                      {kidDetails.rewards?.map((r, i) => (
                        <div key={i} style={s.reward}>
                          <div style={s.rewardIcon}>
                            {r.rewardName.includes('Bronze')?'🥉':r.rewardName.includes('Silver')?'🥈':r.rewardName.includes('Gold')?'🥇':r.rewardName.includes('Diamond')?'💎':r.rewardName.includes('Champion')?'🏆':'👑'}
                          </div>
                          <div style={s.rewardName}>{r.rewardName}</div>
                        </div>
                      ))}
                      {(!kidDetails.rewards || kidDetails.rewards.length === 0) && (
                        <p style={s.noData}>No rewards earned yet</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

const s = {
  container: {minHeight:'100vh',display:'flex',flexDirection:'column',background:'linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)'},
  loading: {minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'},
  spinner: {fontSize:'4rem',marginBottom:'1rem'},
  content: {flex:1,maxWidth:'1400px',margin:'0 auto',padding:'2rem',width:'100%'},
  title: {fontSize:'2.5rem',color:'#333',fontWeight:'700',marginBottom:'1rem',textAlign:'center'},
  subtitle: {fontSize:'1.1rem',color:'#666'},
  grid: {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'2rem',marginTop:'2rem'},
  card: {background:'white',borderRadius:'1.5rem',padding:'2rem',textAlign:'center',boxShadow:'0 10px 30px rgba(0,0,0,0.1)',cursor:'pointer'},
  avatar: {width:'100px',height:'100px',borderRadius:'50%',background:'linear-gradient(135deg,#FFB347 0%,#ff9a00 100%)',color:'white',fontSize:'3rem',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'},
  name: {fontSize:'1.8rem',color:'#333',marginBottom:'1rem',fontWeight:'700'},
  stats: {display:'flex',justifyContent:'center',gap:'2rem',marginBottom:'1rem',fontSize:'1.1rem',color:'#666'},
  limit: {padding:'0.6rem 1rem',background:'#f5f7fa',borderRadius:'0.8rem',fontSize:'1rem',color:'#666',fontWeight:'600'},
  back: {padding:'0.8rem 1.5rem',background:'white',border:'2px solid #e0e0e0',borderRadius:'1rem',fontSize:'1rem',fontWeight:'600',cursor:'pointer',marginBottom:'2rem'},
  header: {display:'flex',alignItems:'center',gap:'1.5rem',background:'white',borderRadius:'1.5rem',padding:'2rem',marginBottom:'2rem',boxShadow:'0 10px 30px rgba(0,0,0,0.1)'},
  statsGrid: {display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.5rem',marginBottom:'2rem'},
  stat: {borderRadius:'1.5rem',padding:'2rem',textAlign:'center',color:'white'},
  statIcon: {fontSize:'2.5rem',marginBottom:'0.8rem'},
  statValue: {fontSize:'2.5rem',fontWeight:'700',marginBottom:'0.5rem'},
  statLabel: {fontSize:'1rem',opacity:0.9},
  box: {background:'white',borderRadius:'1.5rem',padding:'2rem',marginBottom:'2rem',boxShadow:'0 10px 30px rgba(0,0,0,0.1)'},
  boxHeader: {display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'},
  boxTitle: {fontSize:'1.5rem',color:'#333',fontWeight:'700'},
  editBtn: {padding:'0.6rem 1.2rem',background:'linear-gradient(135deg,#00BFFF 0%,#0099cc 100%)',color:'white',border:'none',borderRadius:'0.8rem',fontWeight:'600',cursor:'pointer'},
  editor: {padding:'1.5rem',background:'#f5f7fa',borderRadius:'1rem'},
  slider: {width:'100%',height:'10px',borderRadius:'5px',marginBottom:'1rem'},
  sliderVal: {fontSize:'2rem',color:'#FFB347',fontWeight:'700',textAlign:'center',marginBottom:'1rem'},
  btnRow: {display:'flex',gap:'1rem'},
  saveBtn: {flex:1,padding:'1rem',background:'linear-gradient(135deg,#4CAF50 0%,#45a049 100%)',color:'white',border:'none',borderRadius:'0.8rem',fontWeight:'700',cursor:'pointer'},
  cancelBtn: {flex:1,padding:'1rem',background:'#e0e0e0',color:'#666',border:'none',borderRadius:'0.8rem',fontWeight:'700',cursor:'pointer'},
  currentLimit: {display:'flex',alignItems:'center',gap:'2rem',padding:'1.5rem',background:'#f5f7fa',borderRadius:'1rem'},
  limitCircle: {width:'120px',height:'120px',borderRadius:'50%',background:'linear-gradient(135deg,#FFB347 0%,#ff9a00 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white'},
  limitNum: {fontSize:'2.5rem',fontWeight:'700'},
  progressBar: {width:'100%',height:'20px',background:'#e0e0e0',borderRadius:'10px',overflow:'hidden',marginBottom:'0.5rem'},
  progressFill: {height:'100%',background:'linear-gradient(90deg,#4CAF50 0%,#45a049 100%)'},
  activity: {display:'flex',alignItems:'center',gap:'1rem',padding:'1rem',background:'#f5f7fa',borderRadius:'1rem',marginBottom:'0.8rem'},
  actIcon: {fontSize:'2rem',width:'50px',height:'50px',display:'flex',alignItems:'center',justifyContent:'center',background:'white',borderRadius:'0.8rem'},
  actName: {fontSize:'1rem',fontWeight:'700',color:'#333'},
  actDate: {fontSize:'0.85rem',color:'#999',marginTop:'0.2rem'},
  actStats: {display:'flex',gap:'0.8rem',fontSize:'0.9rem',fontWeight:'600'},
  rewards: {display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'1rem'},
  reward: {padding:'1.5rem',background:'linear-gradient(135deg,#FFD700 0%,#ffb700 100%)',borderRadius:'1rem',textAlign:'center',color:'white'},
  rewardIcon: {fontSize:'2.5rem',marginBottom:'0.5rem'},
  rewardName: {fontSize:'0.95rem',fontWeight:'700'},
  noData: {textAlign:'center',color:'#999',padding:'2rem',fontStyle:'italic'},
};

export default ParentDashboard;
