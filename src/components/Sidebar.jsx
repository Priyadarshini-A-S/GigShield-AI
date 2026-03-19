import { motion } from 'framer-motion';
import {
  FiHome, FiShield, FiCpu, FiMap,
  FiAlertTriangle, FiDollarSign, FiShieldOff, FiBarChart2, FiZap
} from 'react-icons/fi';

const nav = [
  { id: 'home',    label: 'Dashboard',        icon: FiHome },
  { id: 'plan',    label: 'Buy Policy',        icon: FiShield },
  { id: 'twin',    label: 'Digital Twin',      icon: FiCpu },
  { id: 'map',     label: 'Risk Heatmap',      icon: FiMap },
  { id: 'alerts',  label: 'Disruption Alerts', icon: FiAlertTriangle },
  { id: 'payouts', label: 'Payouts',           icon: FiDollarSign },
  { id: 'fraud',   label: 'Fraud Detection',   icon: FiShieldOff },
  { id: 'admin',   label: 'Admin Analytics',   icon: FiBarChart2 },
];

export default function Sidebar({ page, onNavigate, worker }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <FiZap style={{ color: 'white', fontSize: 16 }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-1)', lineHeight: 1.2 }}>GigShield</p>
            <p style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.05em' }}>AI INSURANCE</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 12px', overflowY: 'auto' }}>
        <p style={{ fontSize: 10, color: 'var(--text-5)', fontWeight: 600, letterSpacing: '0.08em', padding: '0 6px', marginBottom: 8 }}>
          MAIN MENU
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map(item => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
            >
              <item.icon style={{ fontSize: 15, flexShrink: 0 }} />
              {item.label}
              {item.id === 'alerts' && (
                <span style={{
                  marginLeft: 'auto', background: '#ef4444',
                  color: 'white', fontSize: 9, fontWeight: 700,
                  padding: '1px 6px', borderRadius: 10
                }}>LIVE</span>
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Worker profile */}
      {worker && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0
            }}>
              {worker.name[0]}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {worker.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{worker.platform} · {worker.city}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
