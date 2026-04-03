GigShield AI

Protect Your Worker — AI-Powered Parametric Insurance for Gig Workers

**Overview**

GigShield AI is a simple, intelligent insurance platform designed for gig economy workers such as delivery partners from platforms like Zomato, Swiggy, and others.
These workers often lose income due to external disruptions like heavy rain, extreme heat, floods, or pollution. Today, they have no protection against these losses.
GigShield AI solves this by offering:
Weekly micro-insurance
AI-based dynamic pricing
Automatic (zero-touch) claim payouts

No paperwork. No manual claims. Just protection when it actually matters.

**Problem**

Gig workers can lose 20–30% of their weekly income due to:
- Heavy rain / flooding
- Extreme heat
- High pollution
- Sudden curfews or zone closures
Current insurance solutions don’t cover income loss, and even when they do, the process is slow and manual.

**Solution**

GigShield AI uses parametric insurance:
Instead of waiting for users to file claims, the system:
- Monitors real-world conditions (weather, AQI, etc.)
- Detects disruptions automatically
- Calculates income loss
- Instantly credits payout

**Features**

_1. Quick Registration_

  Basic inputs:
    city
    average earnings
    working hours
AI generates a risk profile instantly

_2. Policy Management_

  Weekly subscription model
  View:
    premium
    coverage
    payout history
    Pause / resume policy anytime
    
_3. Dynamic Premium (AI-Based)_

  Weekly premium is calculated using:
    weather risk
    location (hyperlocal zone risk)
    historical disruption data
    user earnings

  Example:
  - Lower premium in low-risk areas, higher during monsoon weeks.

_4. Zero-Touch Claims_

No manual claim filing.
When disruption is detected:
- Claim is triggered automatically
- Income loss is calculated
- Payout is credited instantly

_5. Parametric Triggers_

  The system uses APIs (real or mock) to detect disruptions:
    Heavy Rain Trigger
    Extreme Heat Trigger
    Flood Alerts
    Pollution (AQI) Trigger
    Traffic / Zone Closure

_6. AI Components_

  Risk prediction model
  Dynamic pricing engine
  Income estimation model
  Basic fraud detection
  Weekly Pricing Model

Premium is calculated as:
```Weekly Premium = (Expected Income Loss × Risk Probability) + Platform Fee```

Example:
- Weekly Income	Risk Level	Premium
- ₹6000	Medium	₹120
- ₹6000	High	₹200
  Payout Logic
    ```Income Loss = Hourly Earnings × Disruption Hours```

Example:
- Hourly earnings: ₹120
- Rain disruption: 4 hours
- Payout = ₹480 (credited instantly)

**User Experience (UX Focus)**

GigShield AI is designed to feel:
1. simple
2. automatic
3. trustworthy
Key UX Principles:

  No insurance jargon
  No forms for claims
  Clear explanations for pricing
  Instant notifications

Example:
“Heavy rain detected in your area. ₹420 has been credited.”

**Tech Stack**

- Frontend: React / Next.js
- Backend: Node.js / FastAPI
- Database: PostgreSQL / Firebase
- AI/ML: Python (Scikit-learn)
- APIs: Weather API (OpenWeather / mock)
- AQI API: Traffic data (mock)
- Payments: UPI (mock/sandbox)

**System Flow**

```
        User registers
              ↓
  AI calculates risk & premium
              ↓
    User subscribes weekly
              ↓
APIs monitor real-world conditions
              ↓
      Disruption detected
              ↓
      Claim auto-triggered
              ↓
        Payout credited
```
