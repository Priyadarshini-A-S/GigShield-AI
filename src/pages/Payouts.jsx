import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiCheckCircle, FiZap, FiClock } from 'react-icons/fi';
import { checkDisruptionTrigger, calculateIncomeLoss } from '../utils';

const steps = ['Disruption detected', 'Loss calculated', 'Payout initiated', 'Funds transferred'];

export default function Payouts({ payouts, environmentalData, workerProfile, onNewPayout }) {
  const [active, setActive] = useState(null);
  const [tlStep, setTlStep] = useState(-1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const { rainfall, aqi, traffic } = environmentalData;
      if (checkDisruptionTrigger(rainfall, aqi, traffic) && !active) {
        const hourly = workerProfile.avgEarnings / workerProfile.avgHours;
        const { incomeLoss } = calculateIncomeLoss(hourly, 4);
        const type = rainfall > 50 ? 'Heavy Rainfall' : aqi > 250 ? 'Poor Air Quality' : 'Extreme Traffic';
        const p = { id:Date.now(), type, amount:incomeLoss, timestamp:new Date().toLocaleString() };
        setActive(p); setTlStep(0);
        setTimeout(() => setTlStep(1), 900);
        setTimeout(() => setTlStep(2), 1800);
        setTimeout(() => setTlStep(3), 2700);
        setTimeout(() => {
          onNewPayout(p); setActive(null); setTlStep(-1); setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }, 3800);
      }
    }, 15000);
    return () => clearInterval(id);
  }, [environmentalData, workerProfile, onNewPayout, active]);

  const total = payouts.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="page-enter" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h2 style={{ fontSize:22, fontWeight:800, color:'var(--text-1)' }}>Automated Parametric Payouts</h2>
        <p style={{ fontSize:13, color:'var(--text-4)', marginTop:3 }}>Instant compensation triggered by environmental data</p>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { label:'Total Received', value:`₹${total.toLocaleString()}`, color:'#34d399', icon:FiDollarSign },
          { label:'Payouts Issued', value:payouts.length, color:'#818cf8', icon:FiCheckCircle },
          { label:'Avg Payout', value:`₹${payouts.length ? Math.round(total/payouts.length) : 0}`, color:'#fbbf24', icon:FiZap },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            className="panel stat-card" style={{ padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${s.color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <s.icon style={{ color:s.color, fontSize:15 }} />
              </div>
            </div>
            <p style={{ fontSize:26, fontWeight:800, color:'var(--text-1)' }}>{s.value}</p>
            <p style={{ fontSize:11, color:'var(--text-4)', marginTop:4 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:16 }}>
        {/* Active payout / timeline */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <AnimatePresence>
            {active && (
              <motion.div key="active" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                style={{ borderRadius:16, padding:22, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.3)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                  <motion.div animate={{ rotate:360 }} transition={{ duration:2, repeat:Infinity, ease:'linear' }}
                    style={{ width:36, height:36, borderRadius:10, background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <FiZap style={{ color:'#818cf8', fontSize:16 }} />
                  </motion.div>
                  <div>
                    <p style={{ fontWeight:700, color:'var(--text-1)', fontSize:14 }}>{active.type} Detected</p>
                    <p style={{ fontSize:11, color:'var(--text-4)' }}>Processing ₹{active.amount}</p>
                  </div>
                </div>

                <div style={{ position:'relative', paddingLeft:32 }}>
                  <div className="tl-line" />
                  {steps.map((s, i) => (
                    <div key={s} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:i < steps.length-1 ? 16 : 0 }}>
                      <div style={{
                        position:'absolute', left:0,
                        width:22, height:22, borderRadius:'50%',
                        background: i < tlStep ? '#6366f1' : i === tlStep ? 'rgba(99,102,241,0.3)' : 'var(--bg-3)',
                        border:`2px solid ${i <= tlStep ? '#6366f1' : 'var(--border-2)'}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        top: i * 38
                      }}>
                        {i < tlStep && <FiCheckCircle style={{ color:'white', fontSize:10 }} />}
                        {i === tlStep && <motion.div animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:0.8 }}
                          style={{ width:8, height:8, borderRadius:'50%', background:'#818cf8' }} />}
                      </div>
                      <p style={{ fontSize:13, color: i <= tlStep ? 'var(--text-1)' : 'var(--text-5)', fontWeight: i === tlStep ? 600 : 400 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {showSuccess && (
              <motion.div key="success" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ borderRadius:16, padding:18, background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.3)', display:'flex', alignItems:'center', gap:12 }}>
                <FiCheckCircle style={{ color:'#34d399', fontSize:24 }} />
                <div>
                  <p style={{ fontWeight:700, color:'#34d399' }}>Payout Completed!</p>
                  <p style={{ fontSize:12, color:'var(--text-4)' }}>Funds transferred successfully</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!active && !showSuccess && (
            <div className="panel" style={{ padding:24, textAlign:'center' }}>
              <FiClock style={{ fontSize:32, color:'var(--bg-3)', marginBottom:10 }} />
              <p style={{ color:'var(--text-5)', fontSize:13 }}>Monitoring for disruptions...</p>
              <p style={{ color:'var(--text-5)', fontSize:11, marginTop:4 }}>Payouts trigger automatically</p>
            </div>
          )}
        </div>

        {/* History */}
        <div className="panel" style={{ overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
            <p style={{ fontSize:13, fontWeight:600, color:'var(--text-1)' }}>Payout History</p>
          </div>
          <div style={{ overflowY:'auto', maxHeight:360 }}>
            {payouts.length > 0 ? payouts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
                style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:'rgba(52,211,153,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <FiDollarSign style={{ color:'#34d399', fontSize:15 }} />
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:'var(--text-1)' }}>{p.type}</p>
                    <p style={{ fontSize:11, color:'var(--text-4)' }}>{p.timestamp}</p>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:16, fontWeight:700, color:'#34d399' }}>+₹{p.amount}</p>
                  <span style={{ fontSize:10, color:'#34d399', background:'rgba(52,211,153,0.1)', padding:'2px 8px', borderRadius:10 }}>Credited</span>
                </div>
              </motion.div>
            )) : (
              <div style={{ padding:40, textAlign:'center' }}>
                <p style={{ color:'var(--text-5)', fontSize:13 }}>No payouts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
