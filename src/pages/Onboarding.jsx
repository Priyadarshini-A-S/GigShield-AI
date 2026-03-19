import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck, FiZap } from 'react-icons/fi';
import { platforms, cities } from '../mockData';
import { generateWorkerId } from '../utils';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', platform: '', city: '', avgEarnings: '', avgHours: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext = [form.name && form.phone, form.platform && form.city, form.avgEarnings && form.avgHours][step];

  const next = () => {
    if (step < 2) { setStep(s => s + 1); return; }
    setDone(true);
    setTimeout(() => onComplete({
      ...form, workerId: generateWorkerId(),
      avgEarnings: parseFloat(form.avgEarnings),
      avgHours: parseFloat(form.avgHours)
    }), 1600);
  };

  if (done) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg,#6366f1,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <FiCheck style={{ color: 'white', fontSize: 36 }} />
        </motion.div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-1)' }}>Welcome, {form.name.split(' ')[0]}!</h2>
        <p style={{ color: 'var(--text-4)', marginTop: 8 }}>Setting up your dashboard...</p>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 1 }}
          style={{ width: 160, height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#6366f1,#10b981)', margin: '20px auto 0', transformOrigin: 'left' }} />
      </motion.div>
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{ width: 420, flexShrink: 0, background: 'var(--bg-2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '48px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 60 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiZap style={{ color: 'white', fontSize: 16 }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)' }}>GigShield AI</span>
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1.2, marginBottom: 16 }}>
            Parametric Insurance<br />
            <span className="g-text">for Gig Workers</span>
          </h1>
          <p style={{ color: 'var(--text-4)', fontSize: 14, lineHeight: 1.7, marginBottom: 40 }}>
            AI-powered coverage that pays out automatically when disruptions affect your earnings.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {['Your Identity', 'Work Details', 'Earnings Info'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: i < step ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : i === step ? 'rgba(99,102,241,0.2)' : 'var(--bg-3)',
                  border: i === step ? '1px solid #6366f1' : '1px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: i < step ? 'white' : i === step ? '#818cf8' : 'var(--text-5)'
                }}>
                  {i < step ? <FiCheck style={{ fontSize: 12 }} /> : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: i === step ? 'var(--text-1)' : 'var(--text-5)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <p style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>STEP {step + 1} OF 3</p>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>
                {['Who are you?', 'Where do you work?', 'Your earnings'][step]}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-4)', marginBottom: 32 }}>
                {['Basic details to personalize your coverage.', 'Tell us about your platform and city.', 'Helps us calculate your risk and premium.'][step]}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {step === 0 && <>
                  <Field label="Full Name" value={form.name} onChange={v => set('name', v)} placeholder="Rahul Kumar" />
                  <Field label="Phone Number" value={form.phone} onChange={v => set('phone', v)} placeholder="+91 98765 43210" type="tel" />
                </>}
                {step === 1 && <>
                  <ChipField label="Delivery Platform" value={form.platform} onChange={v => set('platform', v)} options={platforms} />
                  <ChipField label="City" value={form.city} onChange={v => set('city', v)} options={cities} />
                </>}
                {step === 2 && <>
                  <Field label="Average Daily Earnings (₹)" value={form.avgEarnings} onChange={v => set('avgEarnings', v)} placeholder="800" type="number" />
                  <Field label="Average Working Hours / Day" value={form.avgHours} onChange={v => set('avgHours', v)} placeholder="8" type="number" />
                </>}
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={next} disabled={!canNext}
                style={{
                  marginTop: 32, width: '100%', height: 50, borderRadius: 12,
                  background: canNext ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-3)',
                  color: canNext ? 'white' : 'var(--text-5)',
                  fontWeight: 600, fontSize: 14, border: 'none', cursor: canNext ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s'
                }}>
                {step < 2 ? 'Continue' : 'Create Account'} <FiArrowRight />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: 8 }}>
        {label.toUpperCase()}
      </label>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', height: 46, padding: '0 16px', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-1)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
        onFocus={e => e.target.style.borderColor = '#6366f1'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'} />
    </div>
  );
}

function ChipField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: 10 }}>
        {label.toUpperCase()}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
              background: value === opt ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg)',
              color: value === opt ? 'white' : 'var(--text-3)',
              border: `1px solid ${value === opt ? '#6366f1' : 'var(--border)'}`
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
