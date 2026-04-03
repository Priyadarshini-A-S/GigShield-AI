import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiZap, FiShield, FiStar, FiInfo, FiPause, FiPlay } from 'react-icons/fi';
import Toggle from '../components/Toggle';
import { getPremiumBreakdown } from '../utils';
import { TRIGGERS } from '../mockData';

const plans = [
  {
    id: 'basic', label: 'Basic', icon: FiShield, mult: 0.7, covX: 8, color: '#60a5fa',
    triggers: ['rain', 'poll'],
    perks: ['Rain & pollution coverage', 'Weekly auto-payout', 'SMS alerts'],
  },
  {
    id: 'smart', label: 'Smart', icon: FiZap, mult: 1.0, covX: 10, color: '#818cf8', popular: true,
    triggers: ['rain', 'heat', 'poll', 'traffic'],
    perks: ['All Basic perks', 'Heat & traffic coverage', 'Digital Twin access', 'Priority support'],
  },
  {
    id: 'pro', label: 'Pro', icon: FiStar, mult: 1.4, covX: 14, color: '#a78bfa',
    triggers: ['rain', 'heat', 'flood', 'poll', 'traffic'],
    perks: ['All 5 triggers covered', 'Flood & curfew coverage', 'Instant UPI payout', 'Dedicated manager'],
  },
];

export default function BuyPolicy({ environmentalData, onActivate, policyActive, workerProfile }) {
  const [selected, setSelected]     = useState('smart');
  const [autoRenew, setAutoRenew]   = useState(true);
  const [activated, setActivated]   = useState(policyActive);
  const [paused, setPaused]         = useState(false);
  const [activating, setActivating] = useState(false);
  const [showWhy, setShowWhy]       = useState(false);

  const { rainfall, aqi, traffic, temperature } = environmentalData;
  const city = workerProfile?.city || 'Delhi';
  const { premium: basePremium, breakdown, reason } = getPremiumBreakdown(rainfall, aqi, traffic, temperature, city);

  const plan     = plans.find(p => p.id === selected);
  const premium  = Math.round(basePremium * plan.mult);
  const coverage = premium * plan.covX;

  const handleActivate = () => {
    if (activated) return;
    setActivating(true);
    setTimeout(() => { setActivated(true); setActivating(false); onActivate(); }, 1200);
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>Weekly Coverage Plan</h2>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 3 }}>
            AI-priced based on live conditions in <span style={{ color: '#818cf8', fontWeight: 600 }}>{city}</span>
          </p>
        </div>
        <div className="panel" style={{ padding: '10px 18px' }}>
          <Toggle checked={autoRenew} onChange={setAutoRenew} label="Auto-renew weekly" size="sm" />
        </div>
      </div>

      {/* Why this price? */}
      <motion.div className="panel" style={{ padding: '14px 20px', cursor: 'pointer' }} onClick={() => setShowWhy(v => !v)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiInfo style={{ color: '#818cf8', fontSize: 15 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
              Why is your premium ₹{premium}/week?
            </span>
          </div>
          <motion.span animate={{ rotate: showWhy ? 180 : 0 }} style={{ color: 'var(--text-4)', fontSize: 12 }}>▼</motion.span>
        </div>
        <AnimatePresence>
          {showWhy && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 10, marginBottom: 14 }}>
                📍 {reason}. Here's how your ₹{premium} is calculated:
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {breakdown.map(b => b.amount > 0 && (
                  <div key={b.label} style={{
                    padding: '6px 14px', borderRadius: 8,
                    background: `${b.color}12`, border: `1px solid ${b.color}30`,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ fontSize: 12, color: b.color, fontWeight: 700 }}>+₹{b.amount}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {plans.map((p, i) => {
          const prem = Math.round(basePremium * p.mult);
          const cov  = prem * p.covX;
          const isSel = selected === p.id;
          return (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(p.id)}
              style={{
                borderRadius: 16, padding: 22, cursor: 'pointer', position: 'relative',
                background: isSel ? `linear-gradient(160deg,${p.color}18,${p.color}06)` : 'var(--panel-bg)',
                border: `1.5px solid ${isSel ? p.color : 'var(--border)'}`,
                boxShadow: isSel ? `0 0 24px ${p.color}20` : 'none',
                transition: 'all 0.2s',
              }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20 }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p.icon style={{ color: p.color, fontSize: 15 }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{p.label}</span>
                {isSel && (
                  <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiCheck style={{ color: 'white', fontSize: 10 }} />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-1)' }}>₹{prem}</span>
                <span style={{ fontSize: 12, color: 'var(--text-4)' }}>/week</span>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-4)', marginBottom: 5 }}>
                  <span>Max coverage</span>
                  <span style={{ color: p.color, fontWeight: 600 }}>₹{cov}/week</span>
                </div>
                <div className="bar-track">
                  <motion.div className="bar-fill" style={{ background: p.color }}
                    initial={{ width: 0 }} animate={{ width: `${(cov / 1000) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }} />
                </div>
              </div>

              {/* Triggers covered */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 10, color: 'var(--text-5)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>TRIGGERS COVERED</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.values(TRIGGERS).map(t => {
                    const covered = p.triggers.includes(t.id);
                    return (
                      <span key={t.id} style={{
                        fontSize: 16, opacity: covered ? 1 : 0.25,
                        filter: covered ? 'none' : 'grayscale(1)',
                      }} title={t.label}>{t.icon}</span>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {p.perks.map(perk => (
                  <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 15, height: 15, borderRadius: '50%', flexShrink: 0, background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiCheck style={{ color: p.color, fontSize: 8 }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{perk}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activate / pause bar */}
      <div className="panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
            {plan.label} Plan · ₹{premium}/week · Coverage up to ₹{coverage}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 3 }}>
            {autoRenew ? 'Auto-renews every Monday · Cancel anytime' : 'One-time weekly plan'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {activated && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setPaused(v => !v)}
              style={{
                height: 44, padding: '0 20px', borderRadius: 10, border: '1px solid var(--border)',
                background: 'var(--bg)', color: 'var(--text-3)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
              {paused ? <><FiPlay /> Resume</> : <><FiPause /> Pause</>}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: activated ? 1 : 1.02 }} whileTap={{ scale: activated ? 1 : 0.97 }}
            onClick={handleActivate} disabled={activated || activating}
            style={{
              height: 44, padding: '0 26px', borderRadius: 10, border: 'none',
              background: activated
                ? paused ? 'rgba(251,191,36,0.2)' : 'linear-gradient(135deg,#10b981,#059669)'
                : activating ? 'var(--bg-3)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: activated ? (paused ? '#fbbf24' : 'white') : activating ? 'var(--text-5)' : 'white',
              fontWeight: 600, fontSize: 14, cursor: activated ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}>
            {activating ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />Activating...</>
            ) : activated
              ? paused ? '⏸ Policy Paused' : <><FiCheck /> Policy Active</>
              : <>Activate {plan.label} Plan</>}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
