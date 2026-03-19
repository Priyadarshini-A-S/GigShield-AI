export const mockEnvironmentalData = {
  rainfall: 15,
  aqi: 180,
  traffic: 65,
  temperature: 32
};

export const mockZones = [
  { id: 1, name: 'Zone A', lat: 28.6139, lng: 77.2090, risk: 'low', flood: 10, traffic: 30, pollution: 120 },
  { id: 2, name: 'Zone B', lat: 28.6239, lng: 77.2190, risk: 'medium', flood: 45, traffic: 70, pollution: 200 },
  { id: 3, name: 'Zone C', lat: 28.6039, lng: 77.1990, risk: 'high', flood: 80, traffic: 90, pollution: 320 },
  { id: 4, name: 'Zone D', lat: 28.6339, lng: 77.2290, risk: 'low', flood: 15, traffic: 40, pollution: 140 },
  { id: 5, name: 'Zone E', lat: 28.5939, lng: 77.2390, risk: 'medium', flood: 50, traffic: 65, pollution: 210 }
];

export const mockAlerts = [
  { id: 1, message: 'Heavy rainfall predicted in 2 hours', severity: 'critical', icon: '🌧️' },
  { id: 2, message: 'Extreme heat expected between 1PM-3PM', severity: 'moderate', icon: '🌡️' },
  { id: 3, message: 'Traffic congestion rising in Zone B', severity: 'low', icon: '🚗' }
];

export const mockPayoutData = [
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 1800 },
  { month: 'Mar', amount: 3200 },
  { month: 'Apr', amount: 2800 },
  { month: 'May', amount: 3600 },
  { month: 'Jun', amount: 4200 }
];

export const mockDisruptionTypes = [
  { name: 'Rainfall', value: 45 },
  { name: 'Pollution', value: 25 },
  { name: 'Traffic', value: 20 },
  { name: 'Heat', value: 10 }
];

export const platforms = ['Zomato', 'Swiggy', 'Zepto', 'Dunzo', 'Amazon'];
export const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];
