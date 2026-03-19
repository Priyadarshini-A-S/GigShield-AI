# GigShield AI - Parametric Insurance Platform

A fully functional frontend-only prototype of an AI-Powered Parametric Insurance Platform for Gig Workers.

## 🚀 Features

### Core Functionality
- **Worker Onboarding** - Register gig workers with profile information
- **AI Workability Score** - Real-time AI-generated risk assessment (0-100)
- **Live Environmental Monitoring** - Simulated real-time data updates every 5 seconds
- **Weekly Micro-Insurance** - Dynamic premium calculation based on risk
- **Digital Twin Simulator** - Income loss estimation during disruptions
- **Early Disruption Detection** - Predictive alerts with severity levels
- **Interactive Risk Heatmap** - Leaflet-based city zone risk visualization
- **Automated Parametric Payouts** - Trigger-based automatic compensation
- **AI Fraud Detection** - Simulated fraud risk scoring and verification
- **Admin Analytics Dashboard** - Comprehensive platform metrics and charts

### Technical Features
- ✅ Pure frontend implementation (no backend required)
- ✅ Mock data and simulated AI logic
- ✅ Real-time data simulation with setInterval
- ✅ Smooth animations with Framer Motion
- ✅ Interactive charts with Recharts
- ✅ Interactive maps with Leaflet
- ✅ Dark theme with neon highlights
- ✅ Fully responsive layout
- ✅ Collapsible sidebar navigation

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Analytics charts
- **Leaflet** - Interactive maps
- **React Icons** - UI icons

## 📦 Installation

```bash
cd gig-insurance
npm install
npm run dev
```

The application will start at `http://localhost:5173`

## 🎯 Usage Flow

1. **Onboarding** - Fill in worker details and register
2. **Dashboard** - View AI workability score and live environmental data
3. **Buy Policy** - Subscribe to weekly micro-insurance
4. **Digital Twin** - Simulate income loss scenarios
5. **Risk Heatmap** - Explore city zones and risk levels
6. **Disruption Alerts** - Monitor predictive alerts
7. **Payouts** - Watch automated payout triggers
8. **Fraud Detection** - Run AI fraud checks
9. **Admin Analytics** - View platform-wide metrics

## 🎨 Key Components

### Simulation Engine
- Environmental data updates every 5 seconds
- Random disruption triggers every 15 seconds
- Alert generation every 10-20 seconds
- Dynamic risk score recalculation

### AI Logic
- **Workability Score**: `100 - (rainImpact + pollutionImpact + trafficImpact)`
- **Premium Calculation**: `(riskScore / 100) × 50`
- **Income Loss**: `expectedIncome - (expectedIncome × random(0.1-0.4))`
- **Disruption Trigger**: `rainfall > 50 || aqi > 250 || traffic > 85`
- **Fraud Score**: Random 0-100 with verification checks

## 📊 Mock Data

All data is simulated using:
- Environmental metrics (rainfall, AQI, traffic, temperature)
- City zones with risk levels
- Payout history
- Disruption types
- Worker activity patterns

## 🎭 Demo Features

Perfect for hackathon demonstrations:
- Visually impressive animations
- Real-time data updates
- Interactive elements
- Professional SaaS design
- Comprehensive feature set

## 📝 Project Structure

```
gig-insurance/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   └── TopNav.jsx
│   ├── pages/
│   │   ├── Onboarding.jsx
│   │   ├── Dashboard.jsx
│   │   ├── BuyPolicy.jsx
│   │   ├── DigitalTwin.jsx
│   │   ├── RiskHeatmap.jsx
│   │   ├── DisruptionAlerts.jsx
│   │   ├── Payouts.jsx
│   │   ├── FraudDetection.jsx
│   │   └── AdminAnalytics.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── mockData.js
│   ├── utils.js
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🌟 Highlights

- **No Backend Required** - Runs entirely in the browser
- **Realistic Simulations** - Feels like a real AI platform
- **Production-Ready UI** - Professional design and UX
- **Hackathon Ready** - Impressive demo capabilities

## 📄 License

MIT License - Free to use for hackathons and demos
