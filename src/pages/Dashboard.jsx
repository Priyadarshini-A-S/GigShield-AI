import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiDollarSign, FiActivity, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import ScoreArc from '../components/ScoreArc';
import Toggle from '../components/Toggle';
import { calculateWorkabilityScore, getScoreExplanation, checkAllTriggers } from '../utils';
import { TRIGGERS } from '../mockData';

export default function Dashboard({ workerProfile, environmentalData, policyActive, onTogglePolicy }) {
  const { rainfall, aqi, traffic, temperature, floodAlert, curfew } = environmentalData;
  const score       = calculateWorkabilityScore(rainfall, aqi, traffic, temperature, floodAlert, curfew);
  const explanation = getScoreExplanation(rainfall, aqi, traffic, temperature, floodAlert, curfew);
  const hourly      = workerProfile.avgEarnings / workerProfile.avgHours;
  const predicted   = workerProfile.avgEarnings;
  const actual      = Math.round(predicted * (score / 100));
  const loss        = predicted - actual;
  const scoreColor  = score > 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';
  const activeTriggers = checkAllTriggers(environmentalData);
  const isDisrupted    = activeTriggers.length > 0;

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Disruption banner */}
      <AnimatePresence>
        {isDisrupted && (
          <motion.div key="banner"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              borderRadius: 14, padding: '14px 20px',
              background: 'linear-gradient(90deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
              border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
            <span style={{ fontSize: 24 }}>{activeTriggers[0].icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#f87171' }}>
                {activeTriggers[0].label} detected in your area
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>
                {policyActive
                  ? `Coverage active · Payout will be processed automatically`
                  : `Activate your policy to get paid during disruptions`}
              </p>
            </div>
            {policyActive && (
              <div style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>🛡 Protected</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>
            {getGreeting()}, {workerProfile.name.split(' ')[0]} 👋
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 3 }}>
            {workerProfile.workerId} · {workerProfile.platform} · {workerProfile.city}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            padding: '8px 16px', borderRadius: 10,
            background: policyActive ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
            border: `1px solid ${policyActive ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
          }}>
            <Toggle checked={policyActive} onChange={onTogglePolicy}
              label={policyActive ? '🛡 Coverage ON' : '⚠ Coverage OFF'} />
          </div>
        </div>
      </div>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 16 }}>
        {/* Score */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="panel stat-card" style={{ padding: 22 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 14 }}>
            AI WORKABILITY SCORE
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ScoreArc score={score} size={110} />
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 12 }}>{explanation}</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 20,
                background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: scoreColor }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: scoreColor }}>
                  {score > 70 ? 'Good to work' : score >= 40 ? 'Moderate risk' : 'High risk'}
                </span>
              </div>
            </div>
          </div>
          {policyActive && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ marginTop: 14, padding: '8px 12px', borderRadius: 8, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <p style={{ fontSize: 11, color: '#34d399' }}>✓ You're covered up to ₹{Math.round(workerProfile.avgEarnings * 1.5)} this week</p>
            </motion.div>
          )}
        </motion.div>

        {/* Env conditions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="panel" style={{ padding: 22 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 14 }}>
            LIVE CONDITIONS IN {workerProfile.city.toUpperCase()}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Rainfall',    value: `${rainfall.toFixed(1)} mm/hr`, warn: rainfall > 30,   warnMsg: 'Heavy rain',    icon: '🌧️', color: '#60a5fa' },
              { label: 'Air Quality', value: `AQI ${Math.round(aqi)}`,       warn: aqi > 200,        warnMsg: 'Unhealthy',     icon: '😷', color: '#a78bfa' },
              { label: 'Traffic',     value: `${Math.round(traffic)}%`,      warn: traffic > 70,     warnMsg: 'Congested',     icon: '🚗', color: '#fbbf24' },
              { label: 'Temperature', value: `${temperature.toFixed(1)}°C`,  warn: temperature > 38, warnMsg: 'Extreme heat',  icon: '🌡️', color: '#f87171' },
            ].map(item => (
              <motion.div key={item.label}
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                style={{
                  background: item.warn ? 'rgba(239,68,68,0.05)' : 'var(--bg)',
                  border: `1px solid ${item.warn ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
                  borderRadius: 12, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{item.value}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>{item.label}</p>
                </div>
                {item.warn && (
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 6 }}>
                    {item.warnMsg}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Parametric triggers row */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="panel" style={{ padding: '16px 20px' }}>
        <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 14 }}>
          PARAMETRIC TRIGGERS — AUTO-PAYOUT WHEN ACTIVE
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
          {Object.values(TRIGGERS).map(t => {
            const isActive = activeTriggers.some(a => a.id === t.id);
            return (
              <div key={t.id} style={{
                padding: '12px 14px', borderRadius: 12,
                background: isActive ? `${t.color}12` : 'var(--bg)',
                border: `1px solid ${isActive ? t.color + '40' : 'var(--border)'}`,
                transition: 'all 0.3s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  {isActive
                    ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                        style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                    : <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bg-3)' }} />}
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, color: isActive ? t.color : 'var(--text-3)' }}>{t.label}</p>
                <p style={{ fontSize: 10, color: 'var(--text-5)', marginTop: 2 }}>{t.hoursLost}h covered</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Earnings row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="panel stat-card" style={{ padding: 22, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em' }}>TODAY'S EARNINGS FORECAST</p>
            <FiActivity style={{ color: 'var(--text-4)', fontSize: 14 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <EarningsRow label="Expected earnings"     amount={predicted} color="#6366f1"   pct={100} />
            <EarningsRow label="Risk-adjusted forecast" amount={actual}    color={scoreColor} pct={score} />
            <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Potential income loss today</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f87171' }}>−₹{loss}</span>
                {policyActive && loss > 0 && (
                  <span style={{ fontSize: 11, color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                    Covered ✓
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Hourly Rate',     value: `₹${hourly.toFixed(0)}/hr`,                    icon: FiDollarSign, color: '#6366f1' },
            { label: 'Working Hours',   value: `${workerProfile.avgHours} hrs/day`,             icon: FiActivity,   color: '#34d399' },
            { label: 'Coverage Status', value: policyActive ? '🛡 Protected' : '⚠ Unprotected', icon: FiShield,     color: policyActive ? '#34d399' : '#f87171' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              className="panel stat-card"
              style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon style={{ color: s.color, fontSize: 14 }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{s.value}</p>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
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
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}
