// Run: node src/seed.js
// Seeds demo incidents and officers after you register an account

const mongoose = require("mongoose");
const dotenv   = require("dotenv");
dotenv.config();

const Incident = require("./models/Incident");
const Officer  = require("./models/Officer");

const incidents = [
  { type: "Theft",          location: "Downtown",     zone: "Zone A", severity: "High",     status: "Active",        officer: "John Smith",  time: "08:32 AM" },
  { type: "Accident",       location: "Highway 5",    zone: "Zone B", severity: "Critical", status: "Dispatched",    officer: "Sara Lee",    time: "09:15 AM" },
  { type: "Vandalism",      location: "Park Ave",     zone: "Zone C", severity: "Low",      status: "Resolved",      officer: "Mike Ray",    time: "07:50 AM" },
  { type: "Assault",        location: "Market St",    zone: "Zone A", severity: "High",     status: "Active",        officer: "Unassigned",  time: "10:02 AM" },
  { type: "Fire",           location: "Elm Road",     zone: "Zone D", severity: "Critical", status: "Dispatched",    officer: "Amy Chen",    time: "10:45 AM" },
  { type: "Robbery",        location: "Central Mall", zone: "Zone B", severity: "High",     status: "Active",        officer: "Tom Blake",   time: "11:20 AM" },
  { type: "Missing Person", location: "North Park",   zone: "Zone C", severity: "Medium",   status: "Investigating", officer: "Lisa Park",   time: "06:30 AM" },
  { type: "Drug Activity",  location: "South End",    zone: "Zone D", severity: "Medium",   status: "Resolved",      officer: "Dan Cruz",    time: "05:15 AM" },
];

const officers = [
  { name: "John Smith", badge: "PD-001", zone: "Zone A", status: "On Duty",  rank: "Sergeant",  incidents: 12, avatar: "JS" },
  { name: "Sara Lee",   badge: "PD-002", zone: "Zone B", status: "On Call",  rank: "Officer",   incidents: 8,  avatar: "SL" },
  { name: "Mike Ray",   badge: "PD-003", zone: "Zone C", status: "Off Duty", rank: "Officer",   incidents: 15, avatar: "MR" },
  { name: "Amy Chen",   badge: "PD-004", zone: "Zone D", status: "On Duty",  rank: "Detective", incidents: 21, avatar: "AC" },
  { name: "Tom Blake",  badge: "PD-005", zone: "Zone B", status: "On Duty",  rank: "Officer",   incidents: 6,  avatar: "TB" },
  { name: "Lisa Park",  badge: "PD-006", zone: "Zone C", status: "On Call",  rank: "Sergeant",  incidents: 18, avatar: "LP" },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Incident.deleteMany({});
  await Officer.deleteMany({});
  await Incident.insertMany(incidents);
  await Officer.insertMany(officers);
  console.log("✅ Seed complete — 8 incidents, 6 officers inserted");
  process.exit(0);
}).catch((e) => { console.error(e); process.exit(1); });
