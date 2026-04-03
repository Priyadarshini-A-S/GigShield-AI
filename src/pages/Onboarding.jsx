import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck, FiShield } from 'react-icons/fi';
import { platforms, cities } from '../mockData';
import { generateWorkerId } from '../utils';

const STEPS = ['Phone Number', 'Your Platform', 'Earnings'];

export default function Onboarding({ onComplete }) {
  const [step, setStep]   = useState(0);
  const [done, setDone]   = useState(false);
  const [form, setForm]   = useState({ phone: '', otp: '', platform: '', city: '', avgEarnings: '', avgHours: '' });


  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext = [
    form.phone.replace(/\D/g, '').length >= 10,
    form.platform && form.city,
    form.avgEarnings && form.avgHours,
  ][step];

  const next = () => {
    if (step < 2) { setStep(s => s + 1); return; }
    setDone(true);
    setTimeout(() => onComplete({
      name: `Worker ${form.phone.replace(/\D/g,'').slice(-4)}`,
      phone: form.phone,
      platform: form.platform,
      city: form.city,
      avgEarnings: parseFloat(form.avgEarnings),
      avgHours: parseFloat(form.avgHours),
      workerId: generateWorkerId(),
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
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-1)' }}>You're protected! 🎉</h2>
        <p style={{ color: 'var(--text-4)', marginTop: 8 }}>Setting up your coverage dashboard...</p>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 1 }}
          style={{ width: 160, height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#6366f1,#10b981)', margin: '20px auto 0', transformOrigin: 'left' }} />
      </motion.div>
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{ width: 400, flexShrink: 0, background: 'var(--bg-2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '48px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiShield style={{ color: 'white', fontSize: 16 }} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)' }}>GigShield</span>
            <p style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.05em' }}>PROTECT YOUR WORKER</p>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1.25, marginBottom: 14 }}>
            Income protection<br /><span className="g-text">for delivery partners</span>
          </h1>
          <p style={{ color: 'var(--text-4)', fontSize: 13.5, lineHeight: 1.75, marginBottom: 40 }}>
            When rain, heat, or floods stop you from working — we pay you instantly. No forms. No waiting.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: i < step ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : i === step ? 'rgba(99,102,241,0.2)' : 'var(--bg-3)',
                  border: i === step ? '1px solid #6366f1' : '1px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: i < step ? 'white' : i === step ? '#818cf8' : 'var(--text-5)',
                }}>
                  {i < step ? <FiCheck style={{ fontSize: 12 }} /> : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: i === step ? 'var(--text-1)' : 'var(--text-5)' }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, padding: '16px 18px', borderRadius: 12, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)' }}>
            <p style={{ fontSize: 12, color: '#34d399', fontWeight: 600, marginBottom: 4 }}>⚡ Takes under 2 minutes</p>
            <p style={{ fontSize: 12, color: 'var(--text-4)' }}>No documents. No paperwork. Just your phone number.</p>
          </div>

          <p style={{ marginTop: 'auto', paddingTop: 32, fontSize: 11, color: 'var(--text-5)' }}>© GitTogether 2026</p>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <p style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>STEP {step + 1} OF 3</p>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>
                {['Enter your number', 'Where do you deliver?', 'Your daily earnings'][step]}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-4)', marginBottom: 32 }}>
                {[
                  'We use this to send you payout alerts.',
                  'Select your platform and city.',
                  'Helps us calculate your coverage amount.',
                ][step]}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {step === 0 && (
                  <Field label="MOBILE NUMBER" value={form.phone} onChange={v => set('phone', v)} placeholder="+91 98765 43210" type="tel" />
                )}

                {step === 1 && (
                  <>
                    <ChipField label="DELIVERY PLATFORM" value={form.platform} onChange={v => set('platform', v)} options={platforms} />
                    <ChipField label="YOUR CITY" value={form.city} onChange={v => set('city', v)} options={cities} />
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field label="AVERAGE DAILY EARNINGS (₹)" value={form.avgEarnings} onChange={v => set('avgEarnings', v)} placeholder="e.g. 800" type="number" hint="Your typical earnings on a normal day" />
                    <Field label="WORKING HOURS PER DAY" value={form.avgHours} onChange={v => set('avgHours', v)} placeholder="e.g. 8" type="number" hint="How many hours you usually work" />
                  </>
                )}
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={next} disabled={!canNext}
                style={{
                  marginTop: 32, width: '100%', height: 50, borderRadius: 12,
                  background: canNext ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-3)',
                  color: canNext ? 'white' : 'var(--text-5)',
                  fontWeight: 600, fontSize: 14, border: 'none', cursor: canNext ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s',
                }}>
                {step < 2 ? 'Continue' : 'Activate My Coverage'} <FiArrowRight />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-4)', letterSpacing: '0.07em', marginBottom: 8 };
const inputStyle = { flex: 1, height: 46, padding: '0 16px', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-1)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' };

function Field({ label, value, onChange, placeholder, type = 'text', hint }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, flex: 'unset', width: '100%' }}
        onFocus={e => e.target.style.borderColor = '#6366f1'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'} />
      {hint && <p style={{ fontSize: 11, color: 'var(--text-5)', marginTop: 6 }}>{hint}</p>}
    </div>
  );
}

function ChipField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
              background: value === opt ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg)',
              color: value === opt ? 'white' : 'var(--text-3)',
              border: `1px solid ${value === opt ? '#6366f1' : 'var(--border)'}`,
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
