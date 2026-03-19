import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockZones } from '../mockData';

const filters = ['All', 'Weather', 'Traffic', 'Pollution'];

export default function RiskHeatmap() {
  const [zones, setZones] = useState(mockZones);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const id = setInterval(() => {
      setZones(prev => prev.map(z => {
        const flood      = Math.max(0, Math.min(100, z.flood      + (Math.random() - 0.5) * 20));
        const traffic    = Math.max(0, Math.min(100, z.traffic    + (Math.random() - 0.5) * 15));
        const pollution  = Math.max(0, Math.min(500, z.pollution  + (Math.random() - 0.5) * 40));
        const risk = flood > 60 || traffic > 80 || pollution > 300 ? 'high'
          : flood > 30 || traffic > 50 || pollution > 200 ? 'medium' : 'low';
        return { ...z, flood, traffic, pollution, risk };
      }));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const riskColor = r => r === 'high' ? '#ef4444' : r === 'medium' ? '#f59e0b' : '#22c55e';
  const highRisk  = zones.filter(z => z.risk === 'high');

  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 60px - 56px)' }}>
      {/* Map */}
      <div style={{ flex: 1, borderRadius: 16, overflow: 'hidden', border: '1px solid #1a1a2e', position: 'relative' }}>
        {/* Filter bar overlay */}
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, display: 'flex', gap: 6, padding: '5px 6px',
          background: 'rgba(10,10,18,0.92)', backdropFilter: 'blur(12px)',
          border: '1px solid #1a1a2e', borderRadius: 12
        }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', border: 'none', transition: 'all 0.15s',
              background: filter === f ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
              color: filter === f ? 'white' : '#475569'
            }}>{f}</button>
          ))}
        </div>

        {/* High risk alert overlay */}
        {highRisk.length > 0 && !selected && (
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            style={{
              position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 1000,
              background: 'rgba(10,10,18,0.92)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12,
              padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10
            }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>
                High risk detected in {highRisk.map(z => z.name).join(', ')}
              </p>
              <p style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Click a zone for detailed breakdown</p>
            </div>
          </motion.div>
        )}

        <MapContainer
          center={[28.6139, 77.2090]} zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; CartoDB"
          />
          {zones.map(zone => (
            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={30}
              fillColor={riskColor(zone.risk)}
              color={riskColor(zone.risk)}
              fillOpacity={0.3}
              weight={2}
              eventHandlers={{ click: () => setSelected(zone) }}
            >
              <Popup>
                <div style={{ fontWeight: 600, color: '#111' }}>{zone.name} — {zone.risk.toUpperCase()}</div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Side panel */}
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
        {/* Legend */}
        <div className="panel" style={{ padding: 18 }}>
          <p style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.07em', marginBottom: 14 }}>RISK LEGEND</p>
          {[
            { label: 'High Risk',   color: '#ef4444', count: zones.filter(z => z.risk === 'high').length },
            { label: 'Medium Risk', color: '#f59e0b', count: zones.filter(z => z.risk === 'medium').length },
            { label: 'Low Risk',    color: '#22c55e', count: zones.filter(z => z.risk === 'low').length },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{r.label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{r.count} zones</span>
            </div>
          ))}
        </div>

        {/* Zone list */}
        <div className="panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: '0.07em', padding: '16px 18px 12px', borderBottom: '1px solid #1a1a2e' }}>ALL ZONES</p>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {zones.map(zone => (
              <button key={zone.id} onClick={() => setSelected(zone)}
                style={{
                  width: '100%', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10,
                  background: selected?.id === zone.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                  border: 'none', borderBottom: '1px solid #0f0f1a', cursor: 'pointer',
                  transition: 'background 0.15s', textAlign: 'left'
                }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: riskColor(zone.risk), flexShrink: 0, boxShadow: `0 0 6px ${riskColor(zone.risk)}` }} />
                <span style={{ fontSize: 13, color: 'white', flex: 1 }}>{zone.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: `${riskColor(zone.risk)}15`, color: riskColor(zone.risk) }}>
                  {zone.risk.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected zone detail */}
        <AnimatePresence>
          {selected && (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="panel" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: riskColor(selected.risk) }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{selected.name}</span>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
              {[
                { label: 'Flood Probability', value: `${Math.round(selected.flood)}%`, color: '#60a5fa', pct: selected.flood },
                { label: 'Traffic Congestion', value: `${Math.round(selected.traffic)}%`, color: '#fbbf24', pct: selected.traffic },
                { label: 'Pollution (AQI)', value: Math.round(selected.pollution), color: '#a78bfa', pct: (selected.pollution / 500) * 100 },
              ].map(m => (
                <div key={m.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginBottom: 5 }}>
                    <span>{m.label}</span>
                    <span style={{ color: m.color, fontWeight: 600 }}>{m.value}</span>
                  </div>
                  <div className="bar-track">
                    <motion.div className="bar-fill" style={{ background: m.color }}
                      initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 0.6 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: `${riskColor(selected.risk)}10`, border: `1px solid ${riskColor(selected.risk)}30`, textAlign: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: riskColor(selected.risk) }}>
                  Disruption Likelihood: {selected.risk.toUpperCase()}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
