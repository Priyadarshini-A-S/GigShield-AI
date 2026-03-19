import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FiCpu, FiUser, FiZap } from 'react-icons/fi';
import { calculateIncomeLoss } from '../utils';

export default function DigitalTwin({ workerProfile }) {
  const [hours, setHours]   = useState(4);
  const [peak, setPeak]     = useState(1.5);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const hourly = workerProfile.avgEarnings / workerProfile.avgHours;

  const simulate = () => {
    setRunning(true);
    setTimeout(() => { setResult(calculateIncomeLoss(hourly, hours, peak)); setRunning(false); }, 1200);
  };

  const chartData = result ? [
    { name: 'Expected', value: result.expectedIncome, color: '#6366f1' },
    { name: 'Actual',   value: result.actualIncome,   color: '#fbbf24' },
    { name: 'Loss',     value: result.incomeLoss,      color: '#f87171' },
  ] : [];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>Digital Twin Income Simulator</h2>
        <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 3 }}>Model your earnings during disruptions using AI simulation</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16 }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <FiUser style={{ color: '#818cf8', fontSize: 16 }} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 4 }}>You</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>₹{workerProfile.avgEarnings}</p>
              <p style={{ fontSize: 10, color: 'var(--text-5)' }}>avg daily</p>
            </div>
            <div className="panel" style={{ padding: 16, textAlign: 'center', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <FiCpu style={{ color: '#818cf8', fontSize: 16 }} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 4 }}>Digital Twin</p>
              <p style={{ fontSize: 20, fontWeight: 800 }} className="g-text">AI Model</p>
              <p style={{ fontSize: 10, color: 'var(--text-5)' }}>simulated</p>
            </div>
          </div>

          <div className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SliderRow label="Disruption Duration" value={hours} onChange={setHours} min={1} max={12} step={1} display={`${hours} hrs`} color="#6366f1" />
            <SliderRow label="Peak Hour Multiplier" value={peak} onChange={setPeak} min={1} max={2} step={0.1} display={`${peak.toFixed(1)}×`} color="#8b5cf6" />
            <SliderRow label="Hourly Income" value={hourly} display={`₹${hourly.toFixed(0)}/hr`} color="#34d399" readOnly />
          </div>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={simulate} disabled={running}
            style={{ height: 46, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {running ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />Simulating...</>
            ) : <><FiZap /> Simulate Disruption</>}
          </motion.button>
        </div>

        {/* Results */}
        <div className="panel" style={{ padding: 24 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 20 }}>SIMULATION RESULTS</p>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Expected Income', value: `₹${result.expectedIncome}`, color: '#6366f1' },
                    { label: 'Actual Income',   value: `₹${result.actualIncome}`,   color: '#fbbf24' },
                    { label: 'Estimated Loss',  value: `₹${result.incomeLoss}`,     color: '#f87171' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
                      <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={48}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', borderRadius: 8 }}
                      labelStyle={{ color: 'var(--text-3)', fontSize: 12 }}
                      itemStyle={{ color: 'var(--text-1)', fontSize: 13 }}
                      formatter={v => [`₹${v}`, '']}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22 }}>💸</span>
                  <div>
                    <p style={{ fontSize: 12, color: '#34d399', fontWeight: 600 }}>Estimated Payout if Policy Active</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', marginTop: 2 }}>₹{result.incomeLoss}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <FiCpu style={{ fontSize: 40, color: 'var(--bg-3)' }} />
                <p style={{ color: 'var(--text-5)', fontSize: 14 }}>Configure parameters and run simulation</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, value, onChange, min, max, step, display, color, readOnly }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{display}</span>
      </div>
      {!readOnly && (
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: color, cursor: 'pointer' }} />
      )}
    </div>
  );
}
