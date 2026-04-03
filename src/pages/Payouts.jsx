import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiZap, FiClock, FiTrendingUp } from 'react-icons/fi';
import { checkAllTriggers, calculateIncomeLoss } from '../utils';
import { TRIGGERS } from '../mockData';

const steps = ['Disruption detected', 'Income loss calculated', 'Payout initiated', '₹ Credited to UPI'];

export default function Payouts({ payouts, environmentalData, workerProfile, onNewPayout }) {
  const [active, setActive]       = useState(null);
  const [tlStep, setTlStep]       = useState(-1);
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      const triggers = checkAllTriggers(environmentalData);
      if (triggers.length > 0 && !active) {
        const trigger = triggers[0];
        const hourly  = workerProfile.avgEarnings / workerProfile.avgHours;
        const { incomeLoss } = calculateIncomeLoss(hourly, trigger.hoursLost);
        const p = {
          id: Date.now(), type: trigger.label, icon: trigger.icon,
          amount: incomeLoss, hoursLost: trigger.hoursLost,
          timestamp: new Date().toLocaleString(),
          trigger: trigger.id,
        };
        setActive(p); setTlStep(0);
        setTimeout(() => setTlStep(1), 900);
        setTimeout(() => setTlStep(2), 1800);
        setTimeout(() => setTlStep(3), 2700);
        setTimeout(() => {
          onNewPayout(p);
          setActive(null); setTlStep(-1);
          setShowToast(p);
          setTimeout(() => setShowToast(null), 5000);
        }, 3800);
      }
    }, 15000);
    return () => clearInterval(id);
  }, [environmentalData, workerProfile, onNewPayout, active]);

  const total = payouts.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Payout toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
            style={{
              borderRadius: 16, padding: '16px 22px',
              background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05))',
              border: '1px solid rgba(52,211,153,0.4)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
            <span style={{ fontSize: 32 }}>{showToast.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#34d399' }}>
                ₹{showToast.amount} credited to your UPI! 🎉
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>
                {showToast.type} disruption · {showToast.hoursLost} hours of income covered automatically
              </p>
            </div>
            <FiCheckCircle style={{ color: '#34d399', fontSize: 28, flexShrink: 0 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>Automatic Payouts</h2>
        <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 3 }}>
          No claims needed · Paid instantly when disruptions are detected
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {[
          { label: 'Total Received',  value: `₹${total.toLocaleString()}`, color: '#34d399', icon: '💰' },
          { label: 'Payouts Issued',  value: payouts.length,               color: '#818cf8', icon: '⚡' },
          { label: 'Avg per Payout',  value: `₹${payouts.length ? Math.round(total / payouts.length) : 0}`, color: '#fbbf24', icon: '📊' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="panel stat-card" style={{ padding: '20px 22px' }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)', marginTop: 8 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16 }}>
        {/* Active payout timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AnimatePresence>
            {active && (
              <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ borderRadius: 16, padding: 22, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 28 }}>{active.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: 14 }}>{active.type} Detected</p>
                    <p style={{ fontSize: 12, color: 'var(--text-4)' }}>Processing ₹{active.amount} payout...</p>
                  </div>
                </div>

                <div style={{ position: 'relative', paddingLeft: 32 }}>
                  <div className="tl-line" />
                  {steps.map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < steps.length - 1 ? 18 : 0 }}>
                      <div style={{
                        position: 'absolute', left: 0,
                        width: 22, height: 22, borderRadius: '50%',
                        background: i < tlStep ? '#6366f1' : i === tlStep ? 'rgba(99,102,241,0.3)' : 'var(--bg-3)',
                        border: `2px solid ${i <= tlStep ? '#6366f1' : 'var(--border-2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        top: i * 40,
                      }}>
                        {i < tlStep && <FiCheckCircle style={{ color: 'white', fontSize: 10 }} />}
                        {i === tlStep && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                          style={{ width: 8, height: 8, borderRadius: '50%', background: '#818cf8' }} />}
                      </div>
                      <p style={{ fontSize: 13, color: i <= tlStep ? 'var(--text-1)' : 'var(--text-5)', fontWeight: i === tlStep ? 600 : 400 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!active && (
            <div className="panel" style={{ padding: 24, textAlign: 'center' }}>
              <FiClock style={{ fontSize: 32, color: 'var(--bg-3)', marginBottom: 10 }} />
              <p style={{ color: 'var(--text-4)', fontSize: 13, fontWeight: 500 }}>Monitoring for disruptions</p>
              <p style={{ color: 'var(--text-5)', fontSize: 11, marginTop: 6 }}>Payouts trigger automatically — no action needed</p>
            </div>
          )}

          {/* Trigger reference */}
          <div className="panel" style={{ padding: 18 }}>
            <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 12 }}>PAYOUT TRIGGERS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.values(TRIGGERS).map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{t.label}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-5)' }}>{t.threshold}</p>
                  </div>
                  <span style={{ fontSize: 11, color: t.color, fontWeight: 600, background: `${t.color}12`, padding: '2px 8px', borderRadius: 6 }}>
                    {t.hoursLost}h pay
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History */}
        <div className="panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Payout History</p>
            {payouts.length > 0 && (
              <span style={{ fontSize: 11, color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                {payouts.length} payouts
              </span>
            )}
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 420 }}>
            {payouts.length > 0 ? payouts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 26 }}>{p.icon || '💰'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{p.type}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{p.timestamp} · {p.hoursLost}h covered</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>+₹{p.amount}</p>
                  <span style={{ fontSize: 10, color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 8px', borderRadius: 10 }}>Credited</span>
                </div>
              </motion.div>
            )) : (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <FiTrendingUp style={{ fontSize: 36, color: 'var(--bg-3)', marginBottom: 12 }} />
                <p style={{ color: 'var(--text-5)', fontSize: 13 }}>No payouts yet</p>
                <p style={{ color: 'var(--text-5)', fontSize: 11, marginTop: 6 }}>Payouts appear here automatically when disruptions occur</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
