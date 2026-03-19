import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import BuyPolicy from './pages/BuyPolicy';
import RiskHeatmap from './pages/RiskHeatmap';
import Payouts from './pages/Payouts';
import DigitalTwin from './pages/DigitalTwin';
import DisruptionAlerts from './pages/DisruptionAlerts';
import FraudDetection from './pages/FraudDetection';
import AdminAnalytics from './pages/AdminAnalytics';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { mockEnvironmentalData } from './mockData';

export default function App() {
  const [worker, setWorker]             = useState(null);
  const [page, setPage]                 = useState('home');
  const [env, setEnv]                   = useState(mockEnvironmentalData);
  const [policyActive, setPolicyActive] = useState(false);
  const [payouts, setPayouts]           = useState([]);
  const [theme, setTheme]               = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!worker) return;
    const id = setInterval(() => {
      setEnv(p => ({
        rainfall:    Math.max(0,   p.rainfall    + (Math.random() - 0.5) * 10),
        aqi:         Math.max(0,   Math.min(500, p.aqi         + (Math.random() - 0.5) * 30)),
        traffic:     Math.max(0,   Math.min(100, p.traffic     + (Math.random() - 0.5) * 15)),
        temperature: Math.max(20,  Math.min(45,  p.temperature + (Math.random() - 0.5) * 2)),
      }));
    }, 5000);
    return () => clearInterval(id);
  }, [worker]);

  if (!worker) {
    return <Onboarding onComplete={w => { setWorker(w); setPage('home'); }} theme={theme} />;
  }

  const isMapPage = page === 'map';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar page={page} onNavigate={setPage} worker={worker} theme={theme} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar page={page} env={env} worker={worker} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />

        <main style={{
          flex: 1,
          overflowY: isMapPage ? 'hidden' : 'auto',
          padding: isMapPage ? '16px' : '24px 28px',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ height: isMapPage ? '100%' : 'auto' }}
            >
              {page === 'home'    && <Dashboard workerProfile={worker} environmentalData={env} policyActive={policyActive} onTogglePolicy={() => setPolicyActive(p => !p)} />}
              {page === 'plan'    && <BuyPolicy environmentalData={env} onActivate={() => setPolicyActive(true)} policyActive={policyActive} />}
              {page === 'twin'    && <DigitalTwin workerProfile={worker} />}
              {page === 'map'     && <RiskHeatmap />}
              {page === 'alerts'  && <DisruptionAlerts environmentalData={env} />}
              {page === 'payouts' && <Payouts payouts={payouts} environmentalData={env} workerProfile={worker} onNewPayout={p => setPayouts(prev => [p, ...prev])} />}
              {page === 'fraud'   && <FraudDetection />}
              {page === 'admin'   && <AdminAnalytics payouts={payouts} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
