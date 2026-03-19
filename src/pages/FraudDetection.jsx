import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShieldOff, FiCheckCircle, FiAlertTriangle, FiMapPin, FiActivity, FiEye } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateFraudScore } from '../utils';

const checks = [
  { id: 'gps',      label: 'GPS Location Match', icon: FiMapPin,   desc: 'Worker confirmed in disruption zone' },
  { id: 'activity', label: 'Delivery Activity',   icon: FiActivity, desc: 'Delivery pattern analysis' },
  { id: 'anomaly',  label: 'Anomaly Detection',   icon: FiEye,      desc: 'Behavioral scoring model' },
];

export default function FraudDetection() {
  const [state, setState]   = useState('idle');
  const [result, setResult] = useState(null);
  const [step, setStep]     = useState(-1);

  const run = () => {
    setState('running'); setStep(0);
    setTimeout(() => setStep(1), 700);
    setTimeout(() => setStep(2), 1400);
    setTimeout(() => {
      const score = calculateFraudScore();
      setResult({ score, gps: Math.random() > 0.3, activity: Math.random() > 0.2, anomaly: score < 50, suspicious: score > 70 });
      setState('done');
    }, 2200);
  };

  const reset = () => { setState('idle'); setResult(null); setStep(-1); };

  const pieData = result ? [
    { name: 'Legitimate', value: 100 - result.score },
    { name: 'Suspicious', value: result.score },
  ] : [];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>AI Fraud Detection</h2>
        <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 3 }}>Automated claim verification using behavioral AI</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="panel" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShieldOff style={{ color: '#818cf8', fontSize: 24 }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>Run AI Fraud Check</h3>
            <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 20 }}>Verify claim authenticity in seconds using GPS, activity patterns, and anomaly detection.</p>
            <motion.button
              whileHover={{ scale: state === 'running' ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={state === 'done' ? reset : run}
              disabled={state === 'running'}
              style={{
                width: '100%', height: 44, borderRadius: 10, border: 'none',
                background: state === 'done' ? 'var(--bg-3)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: state === 'done' ? 'var(--text-4)' : 'white',
                fontWeight: 600, fontSize: 14, cursor: state === 'running' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              {state === 'running' ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />Analyzing...</>
              ) : state === 'done' ? 'Run Another Check' : 'Start Verification'}
            </motion.button>
          </div>

          <div className="panel" style={{ padding: 20 }}>
            <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 16 }}>VERIFICATION CHECKS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {checks.map((c, i) => {
                const active = state === 'running' && i <= step;
                const passed = result ? [result.gps, result.activity, result.anomaly][i] : null;
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: active ? 'rgba(99,102,241,0.08)' : 'var(--bg)', border: `1px solid ${active ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`, transition: 'all 0.2s' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: active || passed !== null ? 'rgba(99,102,241,0.15)' : 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <c.icon style={{ color: active || passed !== null ? '#818cf8' : 'var(--text-5)', fontSize: 14 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: active ? 'var(--text-1)' : 'var(--text-3)' }}>{c.label}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-5)' }}>{c.desc}</p>
                    </div>
                    {state === 'running' && i === step && (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{ width: 16, height: 16, border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', flexShrink: 0 }} />
                    )}
                    {state === 'done' && passed !== null && (
                      passed
                        ? <FiCheckCircle style={{ color: '#34d399', fontSize: 18, flexShrink: 0 }} />
                        : <FiAlertTriangle style={{ color: '#f87171', fontSize: 18, flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="panel" style={{ padding: 24 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 20 }}>ANALYSIS RESULT</p>
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <FiShieldOff style={{ fontSize: 48, color: 'var(--bg-3)' }} />
                <p style={{ color: 'var(--text-5)', fontSize: 14 }}>Run a check to see results</p>
              </motion.div>
            )}
            {state === 'running' && (
              <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -12, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: 10, height: 10, borderRadius: '50%', background: ['#6366f1', '#8b5cf6', '#a78bfa'][i] }} />
                  ))}
                </div>
                <p style={{ color: 'var(--text-4)', fontSize: 13 }}>Running AI analysis...</p>
              </motion.div>
            )}
            {state === 'done' && result && (
              <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ padding: '16px 20px', borderRadius: 12, background: result.suspicious ? 'rgba(239,68,68,0.08)' : 'rgba(52,211,153,0.08)', border: `1px solid ${result.suspicious ? 'rgba(239,68,68,0.3)' : 'rgba(52,211,153,0.3)'}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  {result.suspicious
                    ? <FiAlertTriangle style={{ color: '#f87171', fontSize: 28, flexShrink: 0 }} />
                    : <FiCheckCircle  style={{ color: '#34d399', fontSize: 28, flexShrink: 0 }} />}
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: result.suspicious ? '#f87171' : '#34d399' }}>
                      {result.suspicious ? '⚠ Suspicious Claim Detected' : '✔ Claim Verified Successfully'}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>
                      {result.suspicious ? 'Manual review required before payout' : 'All verification checks passed'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value">
                        <Cell fill={result.suspicious ? '#ef4444' : '#34d399'} />
                        <Cell fill="var(--bg-3)" />
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div>
                    <p style={{ fontSize: 36, fontWeight: 800, color: result.suspicious ? '#f87171' : '#34d399' }}>{result.score}%</p>
                    <p style={{ fontSize: 12, color: 'var(--text-4)' }}>Fraud Risk Score</p>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>
                        <span>Risk Level</span>
                        <span style={{ color: result.suspicious ? '#f87171' : '#34d399', fontWeight: 600 }}>
                          {result.score > 70 ? 'HIGH' : result.score > 40 ? 'MEDIUM' : 'LOW'}
                        </span>
                      </div>
                      <div className="bar-track" style={{ width: 160 }}>
                        <motion.div className="bar-fill" style={{ background: result.suspicious ? '#ef4444' : '#34d399' }}
                          initial={{ width: 0 }} animate={{ width: `${result.score}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {checks.map((c, i) => {
                    const passed = [result.gps, result.activity, result.anomaly][i];
                    return (
                      <div key={c.id} style={{ padding: 12, borderRadius: 10, background: 'var(--bg)', border: `1px solid ${passed ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`, textAlign: 'center' }}>
                        {passed
                          ? <FiCheckCircle  style={{ color: '#34d399', fontSize: 20, margin: '0 auto 6px' }} />
                          : <FiAlertTriangle style={{ color: '#f87171', fontSize: 20, margin: '0 auto 6px' }} />}
                        <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.label}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
