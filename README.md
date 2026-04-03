# 🌦️ Atmosphera

> A cinematic, immersive weather experience for the atmosphere-obsessed.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)

---

## Overview

**Atmosphera** redefines how weather is experienced — not just checked.
A full-screen, living interface where the entire UI breathes, shifts, and
transforms based on real-time conditions. Animated particle systems, cinematic
transitions, and an editorial-grade design language make every weather check
feel intentional and immersive.

Built for people who believe even a weather app deserves to be beautiful.

**Live Demo →** [Atmosphera](https://atmospheraweatherapp.netlify.app/)

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React 18 + TypeScript | Type-safe component model |
| Build Tool | Vite 5 | Fast HMR, zero-config build |
| Styling | Tailwind CSS | Utility-first responsive design |
| Animation | Framer Motion | Smooth, orchestrated transitions |
| Canvas | HTML5 Canvas API | Real-time weather particle systems |
| Weather Data | Open-Meteo API | Free, accurate, no API key needed |
| Geocoding | Open-Meteo Geocoding API | City search with live suggestions |
| Package Manager | Bun | Ultra-fast installs and scripts |

---

## Features

- **Living Canvas Background** — Particle systems for rain, snow, fog, thunderstorms, and sun rays rendered in real-time
- **Cinematic Weather Transitions** — Crossfade dissolve when switching cities, accent color shifts per condition
- **Editorial Hero Display** — Enormous temperature typography that IS the visual centerpiece
- **Glassmorphism Panels** — Frosted-glass stat cards with mouse-tracked parallax movement
- **Hourly Timeline** — Scrollable 24-hour strip with a live SVG temperature curve
- **7-Day Forecast** — Daily min/max, weather icons, precipitation probability
- **UV Arc Gauge** — Custom SVG arc that visualizes UV index in real time
- **Auto Geolocation** — Detects your city on first load if permission is granted
- **°C / °F Toggle** — Instant unit switching with animated number transition
- **Live Local Clock** — Displays time in the searched city's timezone, updates every second
- **Skeleton Loading States** — Shimmer placeholders on all panels while data fetches
- **Fully Responsive** — Panels stack gracefully on mobile

---

## Dynamic Accent System

Atmosphera's entire color palette shifts based on current weather conditions:

| Condition | Accent Color |
|---|---|
| Clear / Sunny | `#f59e0b` Amber |
| Cloudy | `#94a3b8` Slate |
| Rain | `#38bdf8` Sky Blue |
| Snow | `#e0f2fe` Ice White |
| Thunderstorm | `#a78bfa` Violet |
| Fog | `#9ca3af` Gray |

---

## Project Structure
```
atmosphera/
├── public/                    # Static assets
├── src/
│   ├── hooks/
│   │   ├── useWeather.ts      # API fetching + state
│   │   └── useParticles.ts    # Canvas animation loop
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── HeroTemp.tsx
│   │   ├── StatsPanel.tsx     # Left glass panel
│   │   ├── ForecastDay.tsx    # Right 7-day panel
│   │   ├── HourlyTimeline.tsx # Bottom scrollable strip
│   │   ├── WeatherCanvas.tsx  # Full-screen canvas layer
│   │   └── UVGauge.tsx        # SVG arc gauge
│   ├── lib/
│   │   └── weatherUtils.ts    # Condition codes, color maps
│   ├── types/
│   │   └── weather.ts         # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## APIs Used
```
# Weather Data (no key required)
https://api.open-meteo.com/v1/forecast
  ?latitude=&longitude=
  &current=temperature_2m,weathercode,windspeed_10m,
           relativehumidity_2m,apparent_temperature,
           precipitation,uv_index
  &hourly=temperature_2m,weathercode,precipitation_probability
  &daily=weathercode,temperature_2m_max,temperature_2m_min,
         sunrise,sunset,uv_index_max
  &timezone=auto

# Geocoding / City Search (no key required)
https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0 or Node.js >= 18
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/atmosphera.git
cd atmosphera

# Install dependencies
bun install

# Start development server
bun dev
```

### Available Scripts
```bash
bun dev        # Start dev server → localhost:5173
bun build      # Production build
bun preview    # Preview production build
bun lint       # Run ESLint
```

---

## Design System

**Fonts** (Google Fonts)
- `Cormorant Garant` — Hero temperature display
- `DM Mono` — All data labels, stats, and UI chrome

**Base Palette**
```css
--bg:           #080c12
--glass:        rgba(255, 255, 255, 0.04)
--border:       rgba(255, 255, 255, 0.08)
--text-primary: #f0eeea
--text-muted:   #6b7280
--accent:       dynamic — shifts per weather condition
```

---

## Deployment

### Deploy to Netlify
```bash
bun build
# Deploy the /dist folder to Netlify
```

[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

---

## License

This project is **private and proprietary**. All rights reserved.

---

## Author

**Bhavesh Ghatode** — Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bhavesh-kumar-4466a3276/?skipRedirect=true)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bhavesh310)

---

<p align="center">
  <i>Weather is not just data. It's atmosphere.</i>
</p>
