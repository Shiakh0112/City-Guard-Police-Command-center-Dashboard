# 🛡️ City Guard — Police Command Dashboard

A full-stack **MERN** application — a real-time police command center with role-based access control, incident management, officer tracking, analytics, and a responsive dark/light UI.

---

## 🔑 Demo Credentials (Live App)

You can log in directly on the live site using these test accounts:

| Role | Email | Password |
|---|---|---|
|  Admin | khatikashfaq992@gmail.com | Shaikh0112 |
|  Viewer | khanashfaq9423@gmail.com | Shaikh0112 |
|  Viewer | hasan2323@gmail.com | hasan@2323 |

> **Admin account** has full access — create officers, manage users, delete incidents.
> **Viewer accounts** are read-only — can view dashboard and stats but cannot create or edit anything.

---

## 🔗 Links

| | |
|---|---|
| 🌐 Live Frontend | [city-guard-police-command-center-da.vercel.app](https://city-guard-police-command-center-da.vercel.app) |
| ⚙️ Live Backend API | [city-guard-police-command-center.onrender.com](https://city-guard-police-command-center.onrender.com) |
| 📁 GitHub Repo | [github.com/Shiakh0112/City-Guard-Police-Command-center-Dashboard](https://github.com/Shiakh0112/City-Guard-Police-Command-center-Dashboard) |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Redux Toolkit, React Router v7, Tailwind CSS v4, Recharts, Framer Motion |
| Backend | Node.js, Express.js, JWT, bcryptjs |
| Database | MongoDB + Mongoose ODM |
| State | Redux Toolkit (async thunks) |
| HTTP | Axios with JWT interceptor + auto-logout on 401 |
| Weather | Open-Meteo API (free, no key needed) |

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 JWT Auth | Register/Login, bcrypt hashed passwords, token in localStorage |
| 👥 Role-Based Access | 3 roles: **Admin**, **Officer**, **Viewer** — each sees different UI |
| 🛡️ Protected Routes | All pages redirect to `/login` if not authenticated |
| 📋 Incidents CRUD | Create, filter, update status inline, delete |
| 👮 Officers CRUD | Add officers (Admin only), update duty status, delete, detail page |
| 📊 Dashboard | Live stats from MongoDB + area chart + pie chart + recent incidents |
| 📈 Analytics | Monthly trend, zone bar chart, crime radar, 24h hourly chart |
| 🗺️ Zone Heatmap | Visual crime density grid per patrol zone (A/B/C/D) |
| 🌤️ Live Weather | Real-time temperature & wind from Open-Meteo API |
| 🔔 Notifications | Alert bell with unread count, mark read / mark all read |
| 🔍 Global Search | Search incidents & officers from navbar with live dropdown |
| 🌙 Dark / Light Mode | Toggle persisted in localStorage |
| 👤 Profile Management | Edit name, role, email, phone, city, badge, bio — saved to MongoDB |
| ⚙️ Settings Page | Sound alerts, email notify, auto-refresh toggle, system config |
| 📱 Responsive | Mobile sidebar with overlay, works on all screen sizes |
| 🕐 Live Clock | Real-time clock in navbar (updates every second) |
| 🔑 Admin Panel | Manage all users, change roles, create officer accounts |

---

## 👥 Role System — How It Works

This project has **3 user roles**, each with different permissions:

| Role | Who | Can Do |
|---|---|---|
| `admin` | Police Chief / Commander | Full access — create officers, manage users, change roles, delete anything |
| `officer` | Patrol Officer | View dashboard, update incident status, view own profile |
| `viewer` | Read-only user | View dashboard & stats only — no create/edit/delete |

**How roles are assigned:**
- When you **Register**, you choose `Admin` or `Viewer`
- **Officer accounts are created by Admin only** — via the Admin Panel (`/admin`)
- Admin fills in officer's name, badge, zone, rank, email, and password
- This creates both an `Officer` document AND a `User` account with `systemRole: "officer"`

---

## 📁 Project Structure

```
main dashboard/
├── backend/                    ← Node.js + Express API
│   ├── .env                    ← Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json
│   └── src/
│       ├── server.js           ← Express app entry, MongoDB connect, route mounting
│       ├── seed.js             ← Seeds 8 incidents + 6 officers into MongoDB
│       ├── models/
│       │   ├── User.js         ← name, email, password, systemRole, badge, officerId...
│       │   ├── Incident.js     ← type, location, zone, severity, status, officer...
│       │   └── Officer.js      ← name, badge, zone, rank, status, incidents count...
│       ├── controllers/
│       │   ├── authController.js     ← register, login, getMe, updateProfile
│       │   ├── incidentController.js ← getAll, create, updateStatus, remove, getStats
│       │   ├── officerController.js  ← getAll, create, updateStatus, remove
│       │   └── adminController.js    ← getAllUsers, changeRole, deleteUser, createOfficerWithAccount
│       ├── middleware/
│       │   ├── auth.js         ← Verifies JWT, attaches req.user
│       │   └── role.js         ← requireRole("admin") — blocks non-admin access
│       └── routes/
│           ├── auth.js         ← /api/auth/*
│           ├── incidents.js    ← /api/incidents/*
│           ├── officers.js     ← /api/officers/*
│           └── admin.js        ← /api/admin/* (admin only)
│
└── dashboard/                  ← React frontend (Vite)
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx            ← React entry point
        ├── App.jsx             ← Router + Auth guard + fetchMe on load
        ├── index.css           ← Global Tailwind styles
        ├── api/
        │   ├── axiosInstance.js ← Axios base URL + JWT header interceptor + 401 auto-logout
        │   └── cityApi.js       ← Open-Meteo weather API call
        ├── store/
        │   └── store.js         ← Redux slices: auth, incidents, officers, alerts
        ├── context/
        │   └── ThemeContext.jsx  ← Dark/light mode + localStorage persist
        ├── hooks/
        │   ├── useLocalStorage.js ← Custom hook for localStorage state
        │   └── useRole.js         ← Returns current user's systemRole
        ├── components/
        │   ├── Navbar.jsx    ← Search, clock, alerts bell, theme toggle, logout
        │   ├── Sidebar.jsx   ← Navigation with role-aware menu items
        │   └── StatCard.jsx  ← Reusable stat card with icon, value, trend
        └── pages/
            ├── LoginPage.jsx        ← Register (Admin/Viewer) + Login form
            ├── DashboardPage.jsx    ← Stats, charts, recent incidents table
            ├── IncidentsPage.jsx    ← Full CRUD with filters
            ├── OfficersPage.jsx     ← Officers grid + add modal (Admin only)
            ├── OfficerDetailPage.jsx ← Single officer + assigned incidents
            ├── AnalyticsPage.jsx    ← 4 charts: trend, zone, radar, hourly
            ├── HeatmapPage.jsx      ← Zone crime density heatmap
            ├── ProfilePage.jsx      ← View & edit user profile
            ├── SettingsPage.jsx     ← App preferences (localStorage)
            └── AdminPage.jsx        ← User management (Admin only)
```

---

## ⚙️ Local Setup — Step by Step

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **OR** [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repo

```bash
git clone https://github.com/Shiakh0112/City-Guard-Police-Command-center-Dashboard.git
cd City-Guard-Police-Command-center-Dashboard
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Open `backend/.env` and set your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cityguard
JWT_SECRET=any_long_random_secret_string_here
JWT_EXPIRE=7d
```

> **MongoDB Atlas users:** Replace `MONGO_URI` with your Atlas connection string:
> ```
> MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cityguard
> ```

Start the backend:

```bash
npm run dev
```

Expected output:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Seed Demo Data (Optional but Recommended)

Inserts 8 sample incidents + 6 sample officers so the dashboard looks populated.

```bash
# Stop the backend first, then run:
node src/seed.js
```

Expected output:
```
✅ Seed complete — 8 incidents, 6 officers inserted
```

---

### Step 4 — Frontend Setup

Open a **new terminal**:

```bash
cd dashboard
npm install
npm run dev
```

Expected output:
```
VITE v8.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

### Step 5 — Open the App

Go to: **http://localhost:5173**

You'll see the Login page. Click **Register**, create an **Admin** account, and you're in!

---

## 🔌 API Endpoints

All protected routes require header:
```
Authorization: Bearer <your_jwt_token>
```

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register (Admin or Viewer) |
| POST | `/login` | ❌ | Login, returns JWT token |
| GET | `/me` | ✅ | Get logged-in user data |
| PUT | `/profile` | ✅ | Update profile (name, phone, city, bio...) |

### Incidents — `/api/incidents`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get all incidents (filterable by status/severity/zone) |
| GET | `/stats` | ✅ | Get counts: total, active, resolved, critical |
| POST | `/` | ✅ Admin/Officer | Create new incident |
| PUT | `/:id` | ✅ Admin/Officer | Update incident status |
| DELETE | `/:id` | ✅ Admin | Delete incident |

### Officers — `/api/officers`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get all officers (filterable by zone/status) |
| POST | `/` | ✅ Admin | Add new officer (standalone, no user account) |
| PUT | `/:id` | ✅ Admin/Officer | Update officer duty status |
| DELETE | `/:id` | ✅ Admin | Remove officer |

### Admin — `/api/admin` (Admin role required for ALL)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all registered users |
| PUT | `/users/:id/role` | Change a user's role (admin/officer/viewer) |
| DELETE | `/users/:id` | Delete user (also deletes linked Officer doc) |
| POST | `/create-officer` | Create Officer doc + User account together |

---

## 🔐 How Authentication Works

```
1. Register → password hashed with bcrypt → saved to MongoDB
2. Login → bcrypt compares password → JWT token generated (7 day expiry)
3. Token stored in localStorage
4. Every API request → Axios interceptor adds "Authorization: Bearer <token>"
5. Backend auth.js middleware verifies token → attaches user to req.user
6. role.js middleware checks req.user.systemRole → blocks if insufficient role
7. If token expired/invalid → 401 → Axios interceptor clears token → redirects to /login
8. On page refresh → App.jsx calls GET /api/auth/me → restores user session
```

---

## 🗄️ MongoDB Data Models

### User
```js
{
  name, email, password,          // bcrypt hashed
  systemRole: "admin|officer|viewer",
  role,                           // display role e.g. "Chief of Operations"
  badge, phone, city, bio,
  joinDate, avatar,               // auto-generated initials e.g. "AC"
  officerId,                      // ref to Officer doc (if systemRole is officer)
}
```

### Incident
```js
{
  type,       // "Theft" | "Fire" | "Assault" | ...
  location,   // "Downtown" | "Highway 5" | ...
  zone,       // "Zone A" | "Zone B" | "Zone C" | "Zone D"
  severity,   // "Low" | "Medium" | "High" | "Critical"
  status,     // "Active" | "Dispatched" | "Investigating" | "Resolved"
  officer,    // officer name string or "Unassigned"
  time,       // "10:45 AM"
  createdBy,  // ref to User
}
```

### Officer
```js
{
  name, badge,    // badge is unique e.g. "PD-001"
  zone,           // "Zone A" | "Zone B" | "Zone C" | "Zone D"
  rank,           // "Officer" | "Sergeant" | "Detective" | "Captain"
  status,         // "On Duty" | "On Call" | "Off Duty"
  incidents,      // count of handled incidents
  avatar,         // "JS" (initials)
  createdBy,      // ref to User
}
```

---

## 🔄 Redux State Structure

```js
store = {
  auth: {
    user: { _id, name, email, role, systemRole, badge, avatar },
    loading: Boolean,
    error: String | null
  },
  incidents: {
    list: [ ...Incident objects ],
    stats: { total, active, resolved, critical },
    loading: Boolean,
    error: String | null
  },
  officers: {
    list: [ ...Officer objects ],
    loading: Boolean,
    error: String | null
  },
  alerts: [
    { id, message, type, time, read }   // local only, not in DB
  ]
}
```

---

## 🖥️ Pages — Quick Guide

| Page | Route | Who Can Access | What It Does |
|---|---|---|---|
| Login / Register | `/login` | Everyone | Sign in or create Admin/Viewer account |
| Dashboard | `/` | All | Live stats, charts, recent incidents |
| Incidents | `/incidents` | All (edit: Admin/Officer) | Full CRUD incident management |
| Officers | `/officers` | All (add/delete: Admin) | Officer grid with zone filter |
| Officer Detail | `/officers/:id` | All | Single officer info + assigned incidents |
| Analytics | `/analytics` | All | 4 charts: trend, zone, radar, hourly |
| Heatmap | `/heatmap` | All | Crime density grid per zone |
| Profile | `/profile` | All | View & edit own profile |
| Settings | `/settings` | All | App preferences (localStorage) |
| Admin Panel | `/admin` | Admin only | Manage users, roles, create officers |

---

## 🚀 Available Scripts

### Backend
```bash
npm run dev       # Start with nodemon (auto-restart)
npm start         # Start without nodemon (production)
node src/seed.js  # Seed demo data
```

### Frontend
```bash
npm run dev       # Vite dev server → http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

---

## 🐛 Common Issues & Fixes

| Problem | Fix |
|---|---|
| `connect ECONNREFUSED` | Start MongoDB: run `mongod` in terminal |
| `Invalid token` on every request | Clear localStorage: DevTools → Application → Local Storage → Clear All |
| Frontend shows no data | Make sure backend is running on port 5000 |
| `Badge already exists` | Use a unique badge like `PD-010` |
| CORS error | Confirm backend `.env` has `PORT=5000` and frontend calls `localhost:5000` |
| Seed script fails | Check `.env` MONGO_URI is correct and MongoDB is running |
| Admin page not visible | Make sure you registered as **Admin**, not Viewer |

---

## 📦 Key Dependencies

### Backend
```
express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, nodemon
```

### Frontend
```
react 19, react-router-dom v7, @reduxjs/toolkit, react-redux,
axios, recharts, tailwindcss v4, framer-motion, react-icons, lucide-react
```

---

## 👨‍💻 Author

**Your Name**
📧 your.email@example.com
🔗 [LinkedIn](https://www.linkedin.com/in/shaikh-ashfaq-shaikh-qayyum)
🐙 [GitHub](https://github.com/Shiakh0112)

---

## 📄 License

MIT — free to use for learning and portfolio purposes.
