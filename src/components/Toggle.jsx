import { motion } from 'framer-motion';

export default function Toggle({ checked, onChange, label, size = 'md' }) {
  const w = size === 'sm' ? 36 : 44;
  const h = size === 'sm' ? 20 : 24;
  const thumb = size === 'sm' ? 14 : 18;
  const top = size === 'sm' ? 3 : 3;

  return (
    <div className="toggle-wrap" onClick={() => onChange(!checked)}>
      {label && (
        <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{label}</span>
      )}
      <div
        className="toggle-track"
        style={{
          width: w, height: h,
          background: checked ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#1e1e35',
          border: `1px solid ${checked ? '#6366f1' : '#2a2a45'}`
        }}
      >
        <motion.div
          className="toggle-thumb"
          style={{ width: thumb, height: thumb, top }}
          animate={{ x: checked ? w - thumb - top - 1 : top - 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
}
