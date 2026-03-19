import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCloud, FiThermometer, FiTrendingUp, FiWind, FiFilter } from 'react-icons/fi';

const templates = [
  { message: 'Heavy rainfall predicted in 2 hours',      severity: 'critical', icon: FiCloud,       zone: 'South Zone' },
  { message: 'Extreme heat expected between 1PM–3PM',    severity: 'moderate', icon: FiThermometer, zone: 'Central Zone' },
  { message: 'Traffic congestion rising in Zone B',      severity: 'low',      icon: FiTrendingUp,  zone: 'Zone B' },
  { message: 'Air quality deteriorating rapidly',        severity: 'critical', icon: FiWind,        zone: 'North Zone' },
  { message: 'Flash flood warning issued',               severity: 'critical', icon: FiCloud,       zone: 'East Zone' },
  { message: 'Peak hour traffic surge expected',         severity: 'moderate', icon: FiTrendingUp,  zone: 'West Zone' },
];

const sev = {
  critical: { bg: 'rgba(239,68,68,0.07)',  border: 'rgba(239,68,68,0.25)',  text: '#f87171', dot: '#ef4444', label: 'Critical' },
  moderate: { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', dot: '#f59e0b', label: 'Moderate' },
  low:      { bg: 'rgba(99,102,241,0.07)', border: 'rgba(99,102,241,0.25)', text: '#818cf8', dot: '#6366f1', label: 'Low' },
};

export default function DisruptionAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const push = () => {
      const t = templates[Math.floor(Math.random() * templates.length)];
      setAlerts(prev => [{ ...t, id: Date.now(), time: new Date().toLocaleTimeString() }, ...prev].slice(0, 20));
    };
    push();
    const id = setInterval(push, Math.random() * 10000 + 10000);
    return () => clearInterval(id);
  }, []);

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);
  const counts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    moderate: alerts.filter(a => a.severity === 'moderate').length,
    low:      alerts.filter(a => a.severity === 'low').length,
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>Disruption Alert Feed</h2>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 3 }}>AI-powered early warning system · Updates every 10–20s</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiFilter style={{ color: 'var(--text-4)', fontSize: 13 }} />
          {['all', 'critical', 'moderate', 'low'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: filter === f ? (f === 'all' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : `${sev[f]?.dot}20`) : 'var(--panel-bg)',
              color: filter === f ? (f === 'all' ? 'white' : sev[f]?.text) : 'var(--text-4)',
              border: `1px solid ${filter === f ? (f === 'all' ? '#6366f1' : sev[f]?.dot) : 'var(--border)'}`,
              transition: 'all 0.15s'
            }}>
              {f === 'all' ? `All (${alerts.length})` : `${sev[f].label} (${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {Object.entries(counts).map(([s, n]) => (
          <div key={s} className="panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: sev[s].dot, flexShrink: 0, boxShadow: `0 0 8px ${sev[s].dot}` }} />
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>{n}</p>
              <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{sev[s].label} alerts</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alert list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <AnimatePresence initial={false}>
          {filtered.map(a => {
            const s = sev[a.severity];
            return (
              <motion.div key={a.id}
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                style={{ borderRadius: 12, padding: '14px 18px', background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${s.dot}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <a.icon style={{ color: s.text, fontSize: 15 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: s.text, letterSpacing: '0.06em' }}>{s.label.toUpperCase()}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-5)' }}>· 📍 {a.zone}</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{a.message}</p>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-5)', flexShrink: 0 }}>{a.time}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="panel" style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: 'var(--text-5)' }}>No {filter} alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
