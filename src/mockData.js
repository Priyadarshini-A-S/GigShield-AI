export const mockEnvironmentalData = {
  rainfall: 15,
  aqi: 180,
  traffic: 65,
  temperature: 32,
  floodAlert: false,
  curfew: false,
};

export const mockZones = [
  { id: 1, name: 'Connaught Place',  lat: 28.6315, lng: 77.2167, risk: 'low',    flood: 10, traffic: 30, pollution: 120 },
  { id: 2, name: 'Lajpat Nagar',    lat: 28.5677, lng: 77.2433, risk: 'medium', flood: 45, traffic: 70, pollution: 200 },
  { id: 3, name: 'Dwarka Sector 6', lat: 28.5921, lng: 77.0460, risk: 'high',   flood: 80, traffic: 90, pollution: 320 },
  { id: 4, name: 'Rohini Sector 3', lat: 28.7041, lng: 77.1025, risk: 'low',    flood: 15, traffic: 40, pollution: 140 },
  { id: 5, name: 'Saket',           lat: 28.5244, lng: 77.2066, risk: 'medium', flood: 50, traffic: 65, pollution: 210 },
];

export const mockPayoutData = [
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 1800 },
  { month: 'Mar', amount: 3200 },
  { month: 'Apr', amount: 2800 },
  { month: 'May', amount: 3600 },
  { month: 'Jun', amount: 4200 },
];

export const mockDisruptionTypes = [
  { name: 'Rainfall',  value: 45 },
  { name: 'Pollution', value: 25 },
  { name: 'Traffic',   value: 20 },
  { name: 'Heat',      value: 10 },
];

// 5 parametric triggers
export const TRIGGERS = {
  RAIN:    { id: 'rain',    label: 'Heavy Rain',       icon: '🌧️', threshold: 'Rainfall > 50 mm/hr',  hoursLost: 4, color: '#60a5fa' },
  HEAT:    { id: 'heat',    label: 'Extreme Heat',     icon: '🌡️', threshold: 'Temp > 42°C',           hoursLost: 3, color: '#f87171' },
  FLOOD:   { id: 'flood',   label: 'Flood Alert',      icon: '🌊', threshold: 'Govt flood warning',    hoursLost: 6, color: '#818cf8' },
  POLL:    { id: 'poll',    label: 'Severe Pollution',  icon: '😷', threshold: 'AQI > 300',             hoursLost: 2, color: '#a78bfa' },
  TRAFFIC: { id: 'traffic', label: 'Road Closure',     icon: '🚧', threshold: 'Traffic > 90% / Curfew', hoursLost: 3, color: '#fbbf24' },
};

// City-level base risk multipliers
export const CITY_RISK = {
  Delhi:     { mult: 1.4, reason: 'high pollution & monsoon flooding' },
  Mumbai:    { mult: 1.5, reason: 'coastal flooding & heavy monsoon' },
  Bangalore: { mult: 1.1, reason: 'moderate rain & traffic' },
  Hyderabad: { mult: 1.2, reason: 'flash floods & heat waves' },
  Pune:      { mult: 1.0, reason: 'moderate risk zone' },
  Chennai:   { mult: 1.3, reason: 'cyclone risk & heat' },
};

export const platforms = ['Zomato', 'Swiggy', 'Zepto', 'Dunzo', 'Amazon', 'Blinkit'];
export const cities    = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];
