import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FiShield, FiAlertTriangle, FiDollarSign, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { mockPayoutData, mockDisruptionTypes } from '../mockData';

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px' }}>
      <p style={{ color: 'var(--text-4)', fontSize: 11, marginBottom: 4 }}>{label}</p>
      <p style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: 13 }}>
        {typeof payload[0].value === 'number' && payload[0].name !== 'workers' ? `₹${payload[0].value}` : payload[0].value}
      </p>
    </div>
  );
};

const workerActivity = [
  { hour: '6AM', workers: 120 }, { hour: '8AM', workers: 340 },
  { hour: '10AM', workers: 520 }, { hour: '12PM', workers: 680 },
  { hour: '2PM', workers: 590 }, { hour: '4PM', workers: 620 },
  { hour: '6PM', workers: 780 }, { hour: '8PM', workers: 510 },
  { hour: '10PM', workers: 280 },
];

const riskDist = [
  { name: 'Low Risk',  value: 45, color: '#34d399' },
  { name: 'Medium',    value: 35, color: '#fbbf24' },
  { name: 'High Risk', value: 20, color: '#f87171' },
];

export default function AdminAnalytics({ payouts }) {
  const total = payouts.reduce((s, p) => s + p.amount, 0);
  const disruptionColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

  const metrics = [
    { label: 'Active Policies',   value: '1,247', icon: FiShield,       color: '#6366f1', change: '+12% this week' },
    { label: 'Disruptions Today', value: '23',    icon: FiAlertTriangle, color: '#fbbf24', change: '+5 from yesterday' },
    { label: 'Total Payouts',     value: `₹${(total + 45600).toLocaleString()}`, icon: FiDollarSign, color: '#34d399', change: 'This month' },
    { label: 'Fraud Alerts',      value: '3',     icon: FiUsers,         color: '#f87171', change: 'Pending review' },
    { label: 'Avg Payout',        value: '₹480',  icon: FiTrendingUp,    color: '#818cf8', change: 'Per disruption' },
  ];

  const recentActivity = [
    { text: 'New policy activated',  sub: 'Worker #GW12847', icon: FiShield,        color: '#6366f1', time: '2m ago' },
    { text: 'Payout processed',      sub: 'Worker #GW45621', icon: FiDollarSign,    color: '#34d399', time: '5m ago' },
    { text: 'Fraud alert triggered', sub: 'Worker #GW78934', icon: FiAlertTriangle, color: '#ef4444', time: '12m ago' },
    { text: 'New worker registered', sub: 'Worker #GW23456', icon: FiUsers,         color: '#a78bfa', time: '18m ago' },
    { text: 'Policy auto-renewed',   sub: 'Worker #GW56789', icon: FiShield,        color: '#6366f1', time: '25m ago' },
  ];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>Admin Analytics</h2>
        <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 3 }}>Platform-wide metrics and insights</p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="panel stat-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon style={{ color: m.color, fontSize: 15 }} />
              </div>
            </div>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>{m.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 5 }}>{m.label}</p>
            <p style={{ fontSize: 10, color: m.color, marginTop: 4 }}>{m.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="panel" style={{ padding: 22 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: 16 }}>PAYOUT TRENDS (₹)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockPayoutData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#818cf8', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel" style={{ padding: 22 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: 16 }}>WORKER ACTIVITY (HOURLY)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={workerActivity} barSize={20}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Bar dataKey="workers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: 16 }}>
        <div className="panel" style={{ padding: 22 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: 16 }}>DISRUPTION TYPES</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mockDisruptionTypes} barSize={32}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {mockDisruptionTypes.map((_, i) => <Cell key={i} fill={disruptionColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel" style={{ padding: 22 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: 16 }}>RISK DISTRIBUTION</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={riskDist} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
                  {riskDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {riskDist.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginLeft: 'auto' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="panel" style={{ padding: 20, overflow: 'hidden' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', marginBottom: 14 }}>RECENT ACTIVITY</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentActivity.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <a.icon style={{ color: a.color, fontSize: 13 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.text}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-5)' }}>{a.sub}</p>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-5)', flexShrink: 0 }}>{a.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
