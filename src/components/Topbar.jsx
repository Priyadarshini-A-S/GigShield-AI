import { motion } from 'framer-motion';
import { FiBell, FiSun, FiMoon } from 'react-icons/fi';

const pageLabels = {
  home: 'Dashboard', plan: 'Buy Policy', twin: 'Digital Twin',
  map: 'Risk Heatmap', alerts: 'Disruption Alerts',
  payouts: 'Payouts', fraud: 'Fraud Detection', admin: 'Admin Analytics'
};

export default function Topbar({ page, env, worker, theme, onToggleTheme }) {
  const { rainfall, aqi, traffic } = env;
  const isAlert = rainfall > 30 || aqi > 200 || traffic > 75;
  const isDark = theme === 'dark';

  return (
    <header className="topbar">
      {/* Breadcrumb */}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 11, color: 'var(--text-5)', fontWeight: 500 }}>GigShield AI</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.2 }}>
          {pageLabels[page] || 'Dashboard'}
        </p>
      </div>

      {/* Live env pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Pill label={`Rain ${rainfall.toFixed(0)}mm`} color={rainfall > 30 ? '#f87171' : 'var(--text-4)'} />
        <Pill label={`AQI ${Math.round(aqi)}`}        color={aqi > 200     ? '#fbbf24' : 'var(--text-4)'} />
        <Pill label={`Traffic ${Math.round(traffic)}%`} color={traffic > 75 ? '#fb923c' : 'var(--text-4)'} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
        {/* Alert status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: isAlert ? '#ef4444' : '#22c55e',
            boxShadow: isAlert ? '0 0 8px #ef4444' : '0 0 8px #22c55e'
          }} />
          <span style={{ fontSize: 11, color: isAlert ? '#f87171' : '#34d399', fontWeight: 500 }}>
            {isAlert ? 'Alert Active' : 'All Clear'}
          </span>
        </div>

        {/* Bell */}
        <button style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'var(--bg-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative'
        }}>
          <FiBell style={{ color: 'var(--text-4)', fontSize: 15 }} />
          {isAlert && (
            <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
          )}
        </button>

        {/* ── Theme toggle ── */}
        <motion.button
          className="theme-btn"
          onClick={onToggleTheme}
          whileTap={{ scale: 0.9 }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -30, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
          >
            {isDark
              ? <FiSun  style={{ color: '#fbbf24', fontSize: 16 }} />
              : <FiMoon style={{ color: '#6366f1', fontSize: 16 }} />
            }
          </motion.div>
        </motion.button>

        {/* Worker avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', flexShrink: 0
        }}>
          {worker?.name?.[0] || 'U'}
        </div>
      </div>
    </header>
  );
}

function Pill({ label, color }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, color,
      background: `${color}15`,
      border: `1px solid ${color}30`,
      padding: '3px 10px', borderRadius: 20,
      transition: 'color 0.2s'
    }}>
      {label}
    </span>
  );
}
