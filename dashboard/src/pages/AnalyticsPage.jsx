import { useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

const monthlyData = [
  { month: "Jan", incidents: 45, resolved: 38 },
  { month: "Feb", incidents: 52, resolved: 44 },
  { month: "Mar", incidents: 38, resolved: 35 },
  { month: "Apr", incidents: 61, resolved: 50 },
  { month: "May", incidents: 55, resolved: 48 },
  { month: "Jun", incidents: 70, resolved: 58 },
  { month: "Jul", incidents: 48, resolved: 42 },
  { month: "Aug", incidents: 63, resolved: 55 },
];

const zoneData = [
  { zone: "Zone A", incidents: 32, officers: 8 },
  { zone: "Zone B", incidents: 24, officers: 6 },
  { zone: "Zone C", incidents: 18, officers: 5 },
  { zone: "Zone D", incidents: 28, officers: 7 },
];

const radarData = [
  { subject: "Theft", value: 85 },
  { subject: "Assault", value: 60 },
  { subject: "Accident", value: 72 },
  { subject: "Fire", value: 40 },
  { subject: "Vandalism", value: 55 },
  { subject: "Drug", value: 48 },
];

const hourlyData = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  incidents: Math.floor(Math.random() * 8 + (h >= 20 || h <= 4 ? 5 : 1)),
}));

const BAR_COLORS = ["#ef4444", "#f97316", "#3b82f6", "#22c55e"];

export default function AnalyticsPage() {
  const incidents = useSelector((s) => s.incidents.list);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tc = isDark ? "#475569" : "#94a3b8";
  const gc = isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9";

  const resolvedRate = incidents.length ? Math.round((incidents.filter((i) => i.status === "Resolved").length / incidents.length) * 100) : 0;

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Crime patterns & performance metrics</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Resolution Rate", value: `${resolvedRate}%`, color: "text-green-400" },
          { label: "Avg Response Time", value: "8.4 min", color: "text-blue-400" },
          { label: "Total This Month", value: "63", color: "text-red-400" },
          { label: "Repeat Locations", value: "7", color: "text-orange-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Monthly Trend */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm">Monthly Trend — Incidents vs Resolved</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gc} />
            <XAxis dataKey="month" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: isDark ? "#0d1526" : "#fff", border: "1px solid #ef4444", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: tc }} />
            <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444" }} name="Incidents" />
            <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: "#22c55e" }} name="Resolved" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Bar Chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm">Incidents by Zone</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={zoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gc} />
              <XAxis dataKey="zone" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? "#0d1526" : "#fff", border: "1px solid #ef4444", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="incidents" radius={[6, 6, 0, 0]} barSize={28}>
                {zoneData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm">Crime Type Radar</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={gc} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: tc, fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: tc, fontSize: 10 }} />
              <Radar dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Heatbar */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm">Incidents by Hour (24h)</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gc} />
            <XAxis dataKey="hour" tick={{ fill: tc, fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: isDark ? "#0d1526" : "#fff", border: "1px solid #ef4444", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="incidents" fill="#ef4444" radius={[3, 3, 0, 0]} opacity={0.8} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
