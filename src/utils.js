import { CITY_RISK, TRIGGERS } from './mockData';

export const calculateWorkabilityScore = (rainfall, aqi, traffic, temperature, floodAlert, curfew) => {
  if (floodAlert || curfew) return Math.max(0, 10 + Math.floor(Math.random() * 15));
  const rainImpact  = Math.min((rainfall / 100) * 40, 40);
  const pollImpact  = Math.min((aqi / 500) * 30, 30);
  const traffImpact = Math.min((traffic / 100) * 20, 20);
  const tempImpact  = temperature > 40 ? 10 : 0;
  return Math.max(0, Math.round(100 - rainImpact - pollImpact - traffImpact - tempImpact));
};

// AI premium: base ₹50 × city multiplier × risk factor
export const calculatePremium = (riskScore, city = 'Delhi') => {
  const cityMult = CITY_RISK[city]?.mult ?? 1.0;
  const base = Math.round((riskScore / 100) * 50 * cityMult);
  return Math.max(30, base); // floor ₹30/week
};

// Returns { premium, breakdown } for "Why this price?" transparency
export const getPremiumBreakdown = (rainfall, aqi, traffic, temperature, city = 'Delhi') => {
  const cityData  = CITY_RISK[city] ?? { mult: 1.0, reason: 'standard zone' };
  const rainComp  = Math.round((rainfall / 100) * 20);
  const pollComp  = Math.round((aqi / 500) * 15);
  const traffComp = Math.round((traffic / 100) * 10);
  const cityComp  = Math.round(20 * (cityData.mult - 1));
  const total     = Math.max(30, 30 + rainComp + pollComp + traffComp + cityComp);
  return {
    premium: total,
    breakdown: [
      { label: 'Base premium',       amount: 30,        color: '#6366f1' },
      { label: 'Rain risk',          amount: rainComp,  color: '#60a5fa' },
      { label: 'Pollution risk',     amount: pollComp,  color: '#a78bfa' },
      { label: 'Traffic risk',       amount: traffComp, color: '#fbbf24' },
      { label: `City risk (${city})`,amount: cityComp,  color: '#f87171' },
    ],
    reason: `Your area has ${cityData.reason}`,
  };
};

export const calculateIncomeLoss = (hourlyIncome, disruptionHours, peakMultiplier = 1.5) => {
  const expectedIncome = hourlyIncome * disruptionHours * peakMultiplier;
  const actualIncome   = expectedIncome * (Math.random() * 0.3 + 0.1);
  const incomeLoss     = expectedIncome - actualIncome;
  return {
    expectedIncome: Math.round(expectedIncome),
    actualIncome:   Math.round(actualIncome),
    incomeLoss:     Math.round(incomeLoss),
  };
};

// Returns which triggers are active and payout amount
export const checkAllTriggers = (env) => {
  const { rainfall, aqi, traffic, temperature, floodAlert, curfew } = env;
  const active = [];
  if (rainfall > 50)              active.push(TRIGGERS.RAIN);
  if (temperature > 42)           active.push(TRIGGERS.HEAT);
  if (floodAlert)                 active.push(TRIGGERS.FLOOD);
  if (aqi > 300)                  active.push(TRIGGERS.POLL);
  if (traffic > 90 || curfew)     active.push(TRIGGERS.TRAFFIC);
  return active;
};

export const checkDisruptionTrigger = (rainfall, aqi, traffic) =>
  rainfall > 50 || aqi > 250 || traffic > 85;

export const calculateFraudScore = () => Math.floor(Math.random() * 100);

export const generateWorkerId = () => 'GW' + Date.now().toString().slice(-8);

export const getScoreColor = (score) =>
  score > 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';

export const getScoreExplanation = (rainfall, aqi, traffic, temperature, floodAlert, curfew) => {
  if (curfew)          return 'Curfew / road closure in your area';
  if (floodAlert)      return 'Flood alert issued by authorities';
  if (rainfall > 50)   return 'Heavy rainfall disrupting deliveries';
  if (temperature > 42)return 'Extreme heat — unsafe working conditions';
  if (aqi > 300)       return 'Severe air pollution detected';
  if (traffic > 85)    return 'Severe traffic congestion';
  if (rainfall > 30)   return 'Moderate rainfall expected';
  return 'Good working conditions today';
};
