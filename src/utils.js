export const calculateWorkabilityScore = (rainfall, aqi, traffic, temperature) => {
  const rainImpact = Math.min((rainfall / 100) * 40, 40);
  const pollutionImpact = Math.min((aqi / 500) * 30, 30);
  const trafficImpact = Math.min((traffic / 100) * 20, 20);
  const tempImpact = temperature > 40 ? 10 : 0;
  
  return Math.max(0, Math.round(100 - rainImpact - pollutionImpact - trafficImpact - tempImpact));
};

export const calculatePremium = (riskScore) => {
  return Math.round((riskScore / 100) * 50);
};

export const calculateIncomeLoss = (hourlyIncome, disruptionHours, peakMultiplier = 1.5) => {
  const expectedIncome = hourlyIncome * disruptionHours * peakMultiplier;
  const actualIncome = expectedIncome * (Math.random() * 0.3 + 0.1);
  const incomeLoss = expectedIncome - actualIncome;
  
  return {
    expectedIncome: Math.round(expectedIncome),
    actualIncome: Math.round(actualIncome),
    incomeLoss: Math.round(incomeLoss)
  };
};

export const checkDisruptionTrigger = (rainfall, aqi, traffic) => {
  return rainfall > 50 || aqi > 250 || traffic > 85;
};

export const calculateFraudScore = () => {
  return Math.floor(Math.random() * 100);
};

export const generateWorkerId = () => {
  return 'GW' + Date.now().toString().slice(-8);
};

export const getScoreColor = (score) => {
  if (score > 70) return 'text-green-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
};

export const getScoreExplanation = (rainfall, aqi, traffic) => {
  if (rainfall > 50) return 'High disruption risk due to heavy rainfall';
  if (aqi > 250) return 'Poor air quality affecting deliveries';
  if (traffic > 85) return 'Severe traffic congestion detected';
  if (rainfall > 30) return 'Moderate rainfall expected';
  return 'Good working conditions';
};
