import { motion } from 'framer-motion';

export default function ScoreArc({ score, size = 140 }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score > 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} className="score-arc" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a2e" strokeWidth={stroke} />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          style={{ fontSize: size * 0.25, fontWeight: 800, color, lineHeight: 1 }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>/100</span>
      </div>
    </div>
  );
}
