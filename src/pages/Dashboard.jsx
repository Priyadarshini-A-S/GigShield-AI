import { motion } from 'framer-motion';
import { FiCloud, FiWind, FiTrendingUp, FiThermometer, FiShield, FiDollarSign, FiActivity } from 'react-icons/fi';
import ScoreArc from '../components/ScoreArc';
import Toggle from '../components/Toggle';
import { calculateWorkabilityScore, getScoreExplanation } from '../utils';

export default function Dashboard({ workerProfile, environmentalData, policyActive, onTogglePolicy }) {
  const { rainfall, aqi, traffic, temperature } = environmentalData;
  const score = calculateWorkabilityScore(rainfall, aqi, traffic, temperature);
  const explanation = getScoreExplanation(rainfall, aqi, traffic);
  const hourly = workerProfile.avgEarnings / workerProfile.avgHours;
  const predicted = workerProfile.avgEarnings;
  const actual = Math.round(predicted * (score / 100));
  const isAlert = rainfall > 30 || aqi > 200 || traffic > 75;
  const scoreColor = score > 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Greeting + alert */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>
            Good {getGreeting()}, {workerProfile.name.split(' ')[0]} 👋
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 3 }}>
            {workerProfile.workerId} · {workerProfile.platform} · {workerProfile.city}
          </p>
        </div>
        {isAlert && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="alert-strip"
            style={{ padding: '10px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠️</span>
            <span style={{ fontSize: 13, color: '#fca5a5', fontWeight: 500 }}>{explanation}</span>
          </motion.div>
        )}
      </div>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
        {/* Score card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="panel stat-card" style={{ padding: 24 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 16 }}>
            AI WORKABILITY SCORE
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ScoreArc score={score} size={120} />
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 16 }}>{explanation}</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 20,
                background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: scoreColor }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: scoreColor }}>
                  {score > 70 ? 'Good Conditions' : score >= 40 ? 'Moderate Risk' : 'High Risk'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <Toggle checked={policyActive} onChange={onTogglePolicy}
              label={policyActive ? 'Insurance Active' : 'Insurance Off'} />
            {policyActive && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ fontSize: 11, color: '#34d399', marginTop: 8 }}>
                ✓ Coverage active · up to ₹500 this week
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Env grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="panel" style={{ padding: 24 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 16 }}>
            LIVE ENVIRONMENTAL CONDITIONS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Rainfall',          value: `${rainfall.toFixed(1)} mm/hr`, icon: FiCloud,      color: '#60a5fa', warn: rainfall > 30 },
              { label: 'Air Quality Index', value: `AQI ${Math.round(aqi)}`,       icon: FiWind,       color: '#a78bfa', warn: aqi > 200 },
              { label: 'Traffic Congestion',value: `${Math.round(traffic)}%`,      icon: FiTrendingUp, color: '#fbbf24', warn: traffic > 70 },
              { label: 'Temperature',       value: `${temperature.toFixed(1)}°C`,  icon: FiThermometer,color: '#f87171', warn: temperature > 38 },
            ].map(item => (
              <motion.div key={item.label}
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                style={{
                  background: item.warn ? 'rgba(239,68,68,0.05)' : 'var(--bg)',
                  border: `1px solid ${item.warn ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
                  borderRadius: 12, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12
                }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon style={{ color: item.color, fontSize: 16 }} />
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{item.value}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 3 }}>{item.label}</p>
                </div>
                {item.warn && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="panel stat-card" style={{ padding: 24, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em' }}>TODAY'S EARNINGS</p>
            <FiActivity style={{ color: 'var(--text-4)', fontSize: 14 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <EarningsRow label="Expected Earnings"    amount={predicted} color="#6366f1"   pct={100} />
            <EarningsRow label="Risk-Adjusted Actual" amount={actual}    color={scoreColor} pct={score} />
            <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Potential loss today</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f87171' }}>−₹{predicted - actual}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Hourly Rate',     value: `₹${hourly.toFixed(0)}`,                    icon: FiDollarSign, color: '#6366f1' },
            { label: 'Working Hours',   value: `${workerProfile.avgHours} hrs/day`,          icon: FiActivity,   color: '#34d399' },
            { label: 'Coverage Status', value: policyActive ? 'Protected' : 'Unprotected',  icon: FiShield,     color: policyActive ? '#34d399' : '#f87171' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              className="panel stat-card"
              style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon style={{ color: s.color, fontSize: 15 }} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function EarningsRow({ label, amount, color, pct }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>₹{amount}</span>
      </div>
      <div className="bar-track">
        <motion.div className="bar-fill" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }} />
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
}
