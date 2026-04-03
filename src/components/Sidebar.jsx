import { motion } from 'framer-motion';
import {
  FiHome, FiShield, FiCpu, FiMap,
  FiAlertTriangle, FiDollarSign, FiShieldOff, FiBarChart2
} from 'react-icons/fi';

const nav = [
  { id: 'home',    label: 'My Dashboard',     icon: FiHome },
  { id: 'plan',    label: 'My Coverage',       icon: FiShield },
  { id: 'payouts', label: 'My Payouts',        icon: FiDollarSign },
  { id: 'alerts',  label: 'Disruption Alerts', icon: FiAlertTriangle },
  { id: 'map',     label: 'Risk Heatmap',      icon: FiMap },
  { id: 'twin',    label: 'Income Simulator',  icon: FiCpu },
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <FiShield style={{ color: 'white', fontSize: 16 }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-1)', lineHeight: 1.2 }}>GigShield</p>
            <p style={{ fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.05em' }}>PROTECT YOUR WORKER</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 12px', overflowY: 'auto' }}>
        <p style={{ fontSize: 10, color: 'var(--text-5)', fontWeight: 600, letterSpacing: '0.08em', padding: '0 6px', marginBottom: 8 }}>
          MENU
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
                  padding: '1px 6px', borderRadius: 10,
                }}>LIVE</span>
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Copyright */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: 10, color: 'var(--text-5)' }}>© GitTogether 2026</p>
      </div>

      {/* Worker profile */}
      {worker && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {worker.phone?.[worker.phone.length - 1] || '?'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {worker.platform} Partner
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{worker.city} · {worker.workerId}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
