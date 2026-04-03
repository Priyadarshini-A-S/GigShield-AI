import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter } from 'react-icons/fi';
import { checkAllTriggers } from '../utils';
import { TRIGGERS } from '../mockData';

const templates = [
  { message: 'Heavy rainfall exceeding 50mm/hr detected',    severity: 'critical', triggerId: 'rain',    zone: 'South Zone' },
  { message: 'Extreme heat alert — temperature above 42°C',  severity: 'critical', triggerId: 'heat',    zone: 'Central Zone' },
  { message: 'Government flood warning issued',              severity: 'critical', triggerId: 'flood',   zone: 'East Zone' },
  { message: 'AQI crossed 300 — severe pollution',           severity: 'critical', triggerId: 'poll',    zone: 'North Zone' },
  { message: 'Road closure / curfew in effect',              severity: 'critical', triggerId: 'traffic', zone: 'West Zone' },
  { message: 'Moderate rainfall — delivery slowdown likely', severity: 'moderate', triggerId: 'rain',    zone: 'Zone B' },
  { message: 'Traffic congestion rising above 85%',          severity: 'moderate', triggerId: 'traffic', zone: 'Zone C' },
  { message: 'Air quality deteriorating — AQI 250+',         severity: 'moderate', triggerId: 'poll',    zone: 'Zone A' },
  { message: 'Heat advisory — stay hydrated',                severity: 'low',      triggerId: 'heat',    zone: 'Zone D' },
  { message: 'Minor traffic delays on main routes',          severity: 'low',      triggerId: 'traffic', zone: 'Zone E' },
];

const sev = {
  critical: { bg: 'rgba(239,68,68,0.07)',  border: 'rgba(239,68,68,0.25)',  text: '#f87171', dot: '#ef4444', label: 'Critical' },
  moderate: { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', dot: '#f59e0b', label: 'Moderate' },
  low:      { bg: 'rgba(99,102,241,0.07)', border: 'rgba(99,102,241,0.25)', text: '#818cf8', dot: '#6366f1', label: 'Low' },
};

export default function DisruptionAlerts({ environmentalData }) {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');

  const activeTriggers = checkAllTriggers(environmentalData);

  useEffect(() => {
    const push = () => {
      const t = templates[Math.floor(Math.random() * templates.length)];
      const trigger = TRIGGERS[t.triggerId.toUpperCase()] || Object.values(TRIGGERS).find(tr => tr.id === t.triggerId);
      setAlerts(prev => [{
        ...t, id: Date.now(),
        time: new Date().toLocaleTimeString(),
        icon: trigger?.icon || '⚠️',
        hoursLost: trigger?.hoursLost || 2,
        color: trigger?.color || '#818cf8',
      }, ...prev].slice(0, 25));
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
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 3 }}>
            AI-powered early warning · Triggers auto-payout when threshold crossed
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiFilter style={{ color: 'var(--text-4)', fontSize: 13 }} />
          {['all', 'critical', 'moderate', 'low'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: filter === f ? (f === 'all' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : `${sev[f]?.dot}20`) : 'var(--panel-bg)',
              color: filter === f ? (f === 'all' ? 'white' : sev[f]?.text) : 'var(--text-4)',
              border: `1px solid ${filter === f ? (f === 'all' ? '#6366f1' : sev[f]?.dot) : 'var(--border)'}`,
              transition: 'all 0.15s',
            }}>
              {f === 'all' ? `All (${alerts.length})` : `${sev[f].label} (${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Live trigger status */}
      <div className="panel" style={{ padding: '16px 20px' }}>
        <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 14 }}>
          LIVE PARAMETRIC TRIGGER STATUS
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
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
                    background: isActive ? `${t.color}20` : 'var(--bg-3)',
                    color: isActive ? t.color : 'var(--text-5)',
                  }}>
                    {isActive ? 'ACTIVE' : 'CLEAR'}
                  </span>
                </div>
                <p style={{ fontSize: 11, fontWeight: 600, color: isActive ? t.color : 'var(--text-4)' }}>{t.label}</p>
                <p style={{ fontSize: 10, color: 'var(--text-5)', marginTop: 2 }}>{t.threshold}</p>
                <p style={{ fontSize: 10, color: t.color, marginTop: 4, fontWeight: 600 }}>
                  {isActive ? `⚡ Pays ${t.hoursLost}h income` : `${t.hoursLost}h if triggered`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
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
                <span style={{ fontSize: 24, flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: s.text, letterSpacing: '0.06em' }}>{s.label.toUpperCase()}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-5)' }}>· 📍 {a.zone}</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{a.message}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 11, color: a.color, fontWeight: 600 }}>
                    {a.severity === 'critical' ? `⚡ ${a.hoursLost}h payout` : `${a.hoursLost}h if escalates`}
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--text-5)', marginTop: 2 }}>{a.time}</p>
                </div>
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
