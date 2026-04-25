# 🛡️ CityGuard — Smart City Crime & Emergency Management Dashboard

A fully functional, real-time **Smart City Command Center Dashboard** built with React. Designed to manage city-wide incidents, officers, analytics, and emergency operations — all from a single, beautiful interface.

---

## 🚀 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-red?style=for-the-badge&logo=vercel)](https://your-project.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/your-username/your-repo)

| | Link |
|--|------|
| 🌐 **Live Site** | [https://your-project.vercel.app](https://your-project.vercel.app) |
| 📁 **GitHub Repo** | [https://github.com/your-username/your-repo](https://github.com/your-username/your-repo) |

> ⚠️ Replace the above links with your actual Vercel deploy URL and GitHub repo URL.

---

## 📸 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Overview | `/` | Live stats, charts, recent incidents |
| Incidents | `/incidents` | Full incident management with filters |
| Officers | `/officers` | Officer list with zone filter & add/delete |
| Officer Detail | `/officers/:id` | Individual officer profile & assigned cases |
| Analytics | `/analytics` | Charts — monthly trend, zone bars, radar, hourly |
| Zone Map | `/heatmap` | Crime density heatmap per patrol zone |
| Profile | `/profile` | Commander profile — view & edit |
| Settings | `/settings` | Dashboard preferences saved to localStorage |

---

## ✨ Features

### 🔴 Incidents Management
- View all incidents in a filterable table
- Filter by **Status** (Active, Dispatched, Investigating, Resolved)
- Filter by **Severity** (Critical, High, Medium, Low)
- **Add new incident** with type, location, officer, severity, zone
- **Update status** inline via dropdown
- **Delete** any incident
- New incident auto-creates a notification alert

### 👮 Officers Management
- View all officers in a responsive card grid
- Filter by **Zone** (A, B, C, D) with live count
- **Add new officer** via modal with:
  - Full name, badge number (unique validation)
  - Rank, zone, initial status selection
  - Live preview card before submitting
- **Delete** officer (hover to reveal delete button)
- **Update status** (On Duty / On Call / Off Duty) inline
- Click any officer card → opens **Officer Detail Page**

### 👤 Officer Detail Page
- Full officer info (badge, rank, zone, status)
- 4 stat cards: total incidents, assigned cases, resolved, resolution rate
- Table of all **assigned incidents** (matched by officer name)
- Status update & delete directly from detail page
- Back button to return to officers list

### 📊 Analytics
- **Monthly Trend** — Line chart (incidents vs resolved)
- **Incidents by Zone** — Bar chart with colored bars (thin `barSize`)
- **Crime Type Radar** — Radar chart for 6 crime categories
- **Hourly Distribution** — 24-hour bar chart
- 4 KPI cards: resolution rate, avg response time, monthly total, repeat locations

### 🗺️ Zone Map (Heatmap)
- Visual **crime density grid** (10×10 cells) per zone
- Color-coded: red = high, orange = medium, yellow = low
- Active incidents listed per zone
- Risk level badge (High / Medium / Low)
- Zone coordinates displayed

### 👤 Commander Profile
- View mode: personal info, command stats, recent activity feed
- Edit mode: full form (name, role, email, phone, city, badge, join date, bio)
- Stats are **live from Redux** (incidents count, resolution rate, officers on duty)
- Avatar auto-generates initials from name
- Save updates Redux store instantly

### ⚙️ Settings
- **Dark / Light mode** toggle with visual theme preview cards
- Toggle switches for: Sound Alerts, Email Notifications, Auto Refresh
- **Refresh interval** slider (10–300 seconds)
- System config: Commander name, city, timezone
- Version / build / status info row
- All preferences **saved to localStorage** via custom hook

### 🔔 Notifications
- Bell icon with unread count badge
- Dropdown with gradient header, type icons (critical/warning/info)
- Click alert to mark as read
- "Mark all read" button
- Unread alerts highlighted with red dot

### 🔍 Live Search
- Search bar in topbar
- Searches across: incident type, location, officer, zone, status, severity
- Also searches: officer name, badge, rank, zone
- Results grouped by **Incidents** and **Officers**
- Click incident → navigates to `/incidents`
- Click officer → navigates directly to `/officers/:id`
- Outside click closes dropdown
- Clear (X) button

### 🕐 Live Clock
- Real-time clock updates every second in topbar
- Shows time + date (weekday, month, day)
- Styled as a bordered pill

### 🌙 Dark / Light Mode
- Persisted in `localStorage`
- Smooth transition on all components
- Custom CSS variables for both themes

---

## 🛠️ Tech Stack

| Technology | Version | Usage |
|------------|---------|-------|
| **React** | 19.2 | UI framework |
| **Vite** | 8.0 | Build tool & dev server |
| **Redux Toolkit** | 2.11 | Global state management |
| **React Redux** | 9.2 | Redux bindings |
| **React Router DOM** | 7.13 | Client-side routing |
| **Recharts** | 3.8 | Charts (Area, Bar, Line, Radar, Pie) |
| **Tailwind CSS** | 4.2 | Utility-first styling |
| **Axios** | 1.14 | API calls (weather data) |
| **React Icons** | 5.6 | Icon library (MD + FA sets) |
| **Context API** | built-in | Theme management |
| **localStorage** | built-in | Settings persistence |

---

## 📁 Folder Structure

```
dashboard/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── cityApi.js          # Axios — Open-Meteo weather API
│   ├── components/
│   │   ├── Navbar.jsx           # Topbar: search, clock, alerts, theme
│   │   ├── Sidebar.jsx          # Navigation sidebar with live badges
│   │   └── StatCard.jsx         # Reusable stat card component
│   ├── context/
│   │   ├── ThemeContext.jsx      # Dark/light mode context + localStorage
│   │   └── SearchContext.jsx     # Search query context
│   ├── hooks/
│   │   └── useLocalStorage.js   # Custom hook for localStorage sync
│   ├── pages/
│   │   ├── DashboardPage.jsx    # Overview: stats, charts, recent incidents
│   │   ├── IncidentsPage.jsx    # Incidents CRUD with filters
│   │   ├── OfficersPage.jsx     # Officers grid + add modal
│   │   ├── OfficerDetailPage.jsx# Individual officer detail + incidents
│   │   ├── AnalyticsPage.jsx    # All analytics charts
│   │   ├── HeatmapPage.jsx      # Zone crime density map
│   │   ├── ProfilePage.jsx      # Commander profile view/edit
│   │   └── SettingsPage.jsx     # Dashboard preferences
│   ├── store/
│   │   └── store.js             # Redux store: incidents, officers, alerts, profile
│   ├── App.jsx                  # Root layout + all routes
│   ├── main.jsx                 # React DOM entry point
│   └── index.css                # Global styles, custom classes, animations
├── vercel.json                  # Vercel SPA routing fix
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── eslint.config.js
└── package.json
```

---

## 🗃️ Redux Store Slices

### `incidents` slice
| Action | Description |
|--------|-------------|
| `addIncident` | Add new incident to top of list |
| `updateStatus` | Update incident status by ID |
| `deleteIncident` | Remove incident by ID |

### `officers` slice
| Action | Description |
|--------|-------------|
| `addOfficer` | Add new officer with auto ID |
| `deleteOfficer` | Remove officer by ID |
| `updateOfficerStatus` | Change officer duty status |

### `alerts` slice
| Action | Description |
|--------|-------------|
| `addAlert` | Add new notification alert |
| `markRead` | Mark single alert as read |
| `markAllRead` | Mark all alerts as read |

### `profile` slice
| Action | Description |
|--------|-------------|
| `updateProfile` | Update commander profile fields |

---

## 🌐 API Integration

**Open-Meteo Weather API** (free, no key required)
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Fetches: current temperature & wind speed for New York
- Displayed in Dashboard overview header
- Falls back to default values if API fails

---

## ⚙️ Getting Started

### Prerequisites
- Node.js `>= 18`
- npm or yarn

### Installation

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Framework: **Vite** (auto-detected)
5. Click **Deploy**

> `vercel.json` is already configured — all routes will work correctly after deployment.

---

## 🎨 Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Red | `#ef4444` | Primary accent, critical alerts |
| Orange | `#f97316` | High severity, warnings |
| Blue | `#3b82f6` | Info, officers |
| Green | `#22c55e` | Resolved, on duty |
| Purple | `#a855f7` | Analytics, profile |
| Cyan | `#06b6d4` | Secondary charts |

### Custom CSS Classes
| Class | Description |
|-------|-------------|
| `.card` | White/dark card with hover lift effect |
| `.badge` | Pill-shaped status/severity label |
| `.btn-red` | Primary gradient red button |
| `.btn-ghost` | Outlined ghost button |
| `.input` | Styled form input |
| `.search-bar` | Topbar-specific search input |
| `.nav-item` | Sidebar navigation link |
| `.mono` | JetBrains Mono font |
| `.fade-up` | Page entry animation |
| `.slide-in` | Card slide-in animation |
| `.live-blink` | Blinking animation for live indicators |
| `.pulse-dot` | Animated pulse dot |
| `.icon-red/blue/...` | Gradient icon backgrounds |

### Fonts
- **Inter** — main UI font
- **JetBrains Mono** — code, badges, clock, IDs

---

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Mobile (`< lg`) | Sidebar hidden, hamburger menu |
| Desktop (`>= lg`) | Sidebar always visible (fixed, 240px) |

---

## 🔒 Data Persistence

| Data | Storage |
|------|---------|
| Theme (dark/light) | `localStorage` key: `city-theme` |
| Settings preferences | `localStorage` key: `city-prefs` |
| Incidents, Officers, Alerts, Profile | Redux (in-memory, resets on refresh) |

---

## 📦 Key Dependencies Explained

- **`@reduxjs/toolkit`** — simplified Redux with `createSlice` and `configureStore`
- **`react-router-dom`** — `BrowserRouter`, `Routes`, `Route`, `NavLink`, `useNavigate`, `useParams`
- **`recharts`** — `AreaChart`, `BarChart`, `LineChart`, `RadarChart`, `PieChart`
- **`axios`** — HTTP client for weather API with fallback
- **`react-icons`** — Material Design (`Md*`) and Font Awesome (`Fa*`) icons
- **`tailwindcss v4`** — utility classes + `@custom-variant dark`

---

## 👨‍💻 Author

Built as a **frontend assignment project** demonstrating:
- React 19 + Vite 8
- Redux Toolkit state management
- React Router v7 with dynamic routes
- Context API for theme
- Custom hooks
- Recharts data visualization
- Responsive dashboard UI
- Axios API integration
- localStorage persistence

---

## 📄 License

This project is for educational purposes.
