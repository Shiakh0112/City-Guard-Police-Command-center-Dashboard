import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { MdWarning, MdPeople, MdCheckCircle, MdLocalFireDepartment, MdSpeed } from "react-icons/md";
import { FaThermometerHalf } from "react-icons/fa";
import StatCard from "../components/StatCard";
import { useTheme } from "../context/ThemeContext";
import { fetchCityWeather } from "../api/cityApi";
import { fetchIncidents, fetchIncidentStats, fetchOfficers } from "../store/store";
import { useState } from "react";

const weeklyData = [
  { day: "Mon", incidents: 14, resolved: 10 },
  { day: "Tue", incidents: 22, resolved: 18 },
  { day: "Wed", incidents: 18, resolved: 15 },
  { day: "Thu", incidents: 30, resolved: 22 },
  { day: "Fri", incidents: 27, resolved: 20 },
  { day: "Sat", incidents: 35, resolved: 28 },
  { day: "Sun", incidents: 19, resolved: 17 },
];

const typeData = [
  { name: "Theft", value: 28 },
  { name: "Assault", value: 18 },
  { name: "Accident", value: 22 },
  { name: "Fire", value: 10 },
  { name: "Other", value: 22 },
];
const PIE_COLORS = ["#ef4444", "#f97316", "#3b82f6", "#a855f7", "#64748b"];

const severityBadge = {
  Critical: "badge badge-critical",
  High: "badge badge-high",
  Medium: "badge badge-medium",
  Low: "badge badge-low",
};
const statusBadge = {
  Active: "badge badge-active",
  Dispatched: "badge badge-dispatched",
  Investigating: "badge badge-investigating",
  Resolved: "badge badge-resolved",
};

export default function DashboardPage() {
  const dispatch  = useDispatch();
  const incidents = useSelector((s) => s.incidents.list);
  const stats     = useSelector((s) => s.incidents.stats);
  const officers  = useSelector((s) => s.officers.list);
  const { theme } = useTheme();
  const isDark    = theme === "dark";
  const [weather, setWeather] = useState(null);

  const tc = isDark ? "#475569" : "#94a3b8";
  const gc = isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9";

  useEffect(() => {
    dispatch(fetchIncidents());
    dispatch(fetchIncidentStats());
    dispatch(fetchOfficers());
    fetchCityWeather().then(setWeather);
  }, [dispatch]);

  const active   = stats.active   ?? incidents.filter((i) => i.status === "Active").length;
  const critical = stats.critical ?? incidents.filter((i) => i.severity === "Critical").length;
  const resolved = stats.resolved ?? incidents.filter((i) => i.status === "Resolved").length;
  const onDuty   = officers.filter((o) => o.status === "On Duty").length;

  return (
    <div className="space-y-6 fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Command Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mono">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        {weather && (
          <div className="card py-2 px-4 flex items-center gap-2 text-sm">
            <FaThermometerHalf className="text-orange-400" />
            <span className="font-semibold text-gray-900 dark:text-white">{weather.temperature}°C</span>
            <span className="text-gray-400">·</span>
            <MdSpeed className="text-blue-400" />
            <span className="text-gray-500 dark:text-gray-400">{weather.windspeed} km/h</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MdWarning}           label="Active Incidents" value={active}   accent="stat-red"    trend={12} />
        <StatCard icon={MdLocalFireDepartment} label="Critical Alerts" value={critical} accent="stat-orange" trend={5} />
        <StatCard icon={MdPeople}            label="Officers On Duty"  value={onDuty}   accent="stat-blue" />
        <StatCard icon={MdCheckCircle}       label="Resolved Today"    value={resolved} accent="stat-green"  trend={-8} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm">Weekly Incident Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gc} />
              <XAxis dataKey="day" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: isDark ? "#0d1526" : "#fff", border: "1px solid #ef4444", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: isDark ? "#e2e8f0" : "#111" }} />
              <Area type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} fill="url(#incGrad)" name="Incidents" />
              <Area type="monotone" dataKey="resolved"  stroke="#22c55e" strokeWidth={2} fill="url(#resGrad)" name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm">Incident Types</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: tc }} />
              <Tooltip contentStyle={{ background: isDark ? "#0d1526" : "#fff", border: "1px solid #ef4444", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 dark:text-white text-sm">Recent Incidents</h2>
          <span className="badge badge-active">{active} Active</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-white/5">
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Officer</th>
                <th className="px-5 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {incidents.slice(0, 6).map((inc) => (
                <tr key={inc._id} className="table-row">
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{inc.type}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{inc.location}</td>
                  <td className="px-5 py-3"><span className={severityBadge[inc.severity] || "badge"}>{inc.severity}</span></td>
                  <td className="px-5 py-3"><span className={statusBadge[inc.status] || "badge"}>{inc.status}</span></td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400 mono text-xs">{inc.officer}</td>
                  <td className="px-5 py-3 text-gray-400 mono text-xs">{inc.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {incidents.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">No incidents yet. Add one from the Incidents page.</p>
          )}
        </div>
      </div>
    </div>
  );
}
