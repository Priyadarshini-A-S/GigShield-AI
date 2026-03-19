import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiZap, FiShield, FiStar } from 'react-icons/fi';
import Toggle from '../components/Toggle';
import { calculateWorkabilityScore, calculatePremium } from '../utils';

const plans = [
  { id: 'basic', label: 'Basic', icon: FiShield, mult: 0.7, covX: 8,  color: '#60a5fa', perks: ['Rainfall coverage', 'Weekly payout', 'Basic alerts', 'Email support'] },
  { id: 'smart', label: 'Smart', icon: FiZap,    mult: 1.0, covX: 10, color: '#818cf8', popular: true, perks: ['All Basic perks', 'AQI + Traffic coverage', 'Digital Twin access', 'Priority support', 'Fraud protection'] },
  { id: 'pro',   label: 'Pro',   icon: FiStar,   mult: 1.4, covX: 14, color: '#a78bfa', perks: ['All Smart perks', 'Instant UPI payout', 'Dedicated manager', 'Custom risk alerts', 'API access'] },
];

export default function BuyPolicy({ environmentalData, onActivate, policyActive }) {
  const [selected, setSelected]   = useState('smart');
  const [autoRenew, setAutoRenew] = useState(true);
  const [activated, setActivated] = useState(policyActive);
  const [activating, setActivating] = useState(false);

  const { rainfall, aqi, traffic, temperature } = environmentalData;
  const score     = calculateWorkabilityScore(rainfall, aqi, traffic, temperature);
  const riskScore = 100 - score;
  const plan      = plans.find(p => p.id === selected);
  const premium   = Math.round(calculatePremium(riskScore) * plan.mult);
  const coverage  = premium * plan.covX;

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
            Current risk level: <span style={{ color: '#fbbf24', fontWeight: 600 }}>{riskScore}%</span>
            &nbsp;· Premium calculated from live conditions
          </p>
        </div>
        <div className="panel" style={{ padding: '10px 18px' }}>
          <Toggle checked={autoRenew} onChange={setAutoRenew} label="Auto-renew" size="sm" />
        </div>
      </div>

      {/* 3-column plans */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {plans.map((p, i) => {
          const prem = Math.round(calculatePremium(riskScore) * p.mult);
          const cov  = prem * p.covX;
          const isSel = selected === p.id;
          return (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(p.id)}
              style={{
                borderRadius: 16, padding: 24, cursor: 'pointer', position: 'relative',
                background: isSel ? `linear-gradient(160deg,${p.color}18,${p.color}08)` : 'var(--panel-bg)',
                border: `1.5px solid ${isSel ? p.color : 'var(--border)'}`,
                boxShadow: isSel ? `0 0 24px ${p.color}20` : 'none',
                transition: 'all 0.2s'
              }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20 }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p.icon style={{ color: p.color, fontSize: 16 }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{p.label}</span>
                {isSel && (
                  <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiCheck style={{ color: 'white', fontSize: 10 }} />
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-1)' }}>₹{prem}</span>
                <span style={{ fontSize: 12, color: 'var(--text-4)' }}>/week</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>
                  <span>Coverage</span>
                  <span style={{ color: p.color, fontWeight: 600 }}>up to ₹{cov}</span>
                </div>
                <div className="bar-track">
                  <motion.div className="bar-fill" style={{ background: p.color }}
                    initial={{ width: 0 }} animate={{ width: `${(cov / 1000) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.perks.map(perk => (
                  <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiCheck style={{ color: p.color, fontSize: 9 }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{perk}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activate bar */}
      <div className="panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
            {plan.label} Plan · ₹{premium}/week · Coverage up to ₹{coverage}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 3 }}>
            {autoRenew ? 'Auto-renews every Monday' : 'One-time weekly plan'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: activated ? 1 : 1.02 }} whileTap={{ scale: activated ? 1 : 0.98 }}
          onClick={handleActivate} disabled={activated || activating}
          style={{
            height: 44, padding: '0 28px', borderRadius: 10, border: 'none',
            background: activated ? 'linear-gradient(135deg,#10b981,#059669)' : activating ? 'var(--bg-3)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: 'white', fontWeight: 600, fontSize: 14, cursor: activated ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
          }}>
          {activating ? (
            <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />Activating...</>
          ) : activated ? <><FiCheck /> Plan Active</> : <>Activate {plan.label} Plan</>}
        </motion.button>
      </div>
    </div>
  );
}
