import { useTheme } from "../context/ThemeContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { MdSave, MdNotifications, MdSecurity, MdPalette, MdCheck } from "react-icons/md";
import { FaBell, FaShieldAlt, FaPaintBrush } from "react-icons/fa";
import { useState } from "react";

function SectionHeader({ icon: Icon, label, accent }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/5">
      <div className={`w-8 h-8 rounded-lg ${accent} flex items-center justify-center shrink-0`}>
        <Icon size={15} className="text-white" />
      </div>
      <h2 className="font-semibold text-gray-800 dark:text-white text-sm">{label}</h2>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 focus:outline-none
        ${value
          ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-md shadow-red-500/30"
          : "bg-gray-200 dark:bg-gray-700"
        }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300
          ${value ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 dark:border-white/[0.04] last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [prefs, setPrefs] = useLocalStorage("city-prefs", {
    autoRefresh: true,
    refreshInterval: 30,
    soundAlerts: false,
    emailNotify: true,
    commanderName: "Commander",
    city: "New York",
    timezone: "EST",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (key, val) => setPrefs({ ...prefs, [key]: val });

  return (
    <div className="fade-up space-y-5 max-w-3xl">

      {/* Page header */}
      <div className="mb-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Preferences are auto-saved to localStorage</p>
      </div>

      {/* ── Appearance ── */}
      <div className="card">
        <SectionHeader icon={FaPaintBrush} label="Appearance" accent="icon-purple" />

        <ToggleRow
          label="Dark Mode"
          desc="Switch between light and dark interface theme"
          value={theme === "dark"}
          onChange={toggleTheme}
        />

        {/* Theme preview */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => theme === "dark" && toggleTheme()}
            className={`p-3 rounded-xl border-2 transition-all text-left ${
              theme === "light"
                ? "border-red-500 bg-red-500/5"
                : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
            }`}
          >
            <div className="w-full h-10 rounded-lg bg-gray-100 mb-2 flex items-end px-2 pb-1.5 gap-1">
              <div className="w-2 h-4 rounded-sm bg-gray-300" />
              <div className="w-2 h-6 rounded-sm bg-gray-300" />
              <div className="w-2 h-3 rounded-sm bg-gray-300" />
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Light Mode</p>
            {theme === "light" && <p className="text-[10px] text-red-500 font-medium mt-0.5">● Active</p>}
          </button>

          <button
            onClick={() => theme === "light" && toggleTheme()}
            className={`p-3 rounded-xl border-2 transition-all text-left ${
              theme === "dark"
                ? "border-red-500 bg-red-500/5"
                : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
            }`}
          >
            <div className="w-full h-10 rounded-lg bg-gray-800 mb-2 flex items-end px-2 pb-1.5 gap-1">
              <div className="w-2 h-4 rounded-sm bg-gray-600" />
              <div className="w-2 h-6 rounded-sm bg-red-500/60" />
              <div className="w-2 h-3 rounded-sm bg-gray-600" />
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Dark Mode</p>
            {theme === "dark" && <p className="text-[10px] text-red-500 font-medium mt-0.5">● Active</p>}
          </button>
        </div>
      </div>

      {/* ── Notifications ── */}
      <div className="card">
        <SectionHeader icon={FaBell} label="Notifications" accent="icon-orange" />

        <ToggleRow
          label="Sound Alerts"
          desc="Play audio on critical incident reports"
          value={prefs.soundAlerts}
          onChange={() => set("soundAlerts", !prefs.soundAlerts)}
        />
        <ToggleRow
          label="Email Notifications"
          desc="Receive daily incident summary via email"
          value={prefs.emailNotify}
          onChange={() => set("emailNotify", !prefs.emailNotify)}
        />
        <ToggleRow
          label="Auto Refresh"
          desc="Automatically sync incident data in background"
          value={prefs.autoRefresh}
          onChange={() => set("autoRefresh", !prefs.autoRefresh)}
        />

        {/* Refresh interval */}
        <div className={`mt-4 pt-4 border-t border-gray-50 dark:border-white/[0.04] transition-opacity ${!prefs.autoRefresh ? "opacity-40 pointer-events-none" : ""}`}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Refresh Interval
          </label>
          <p className="text-xs text-gray-400 mb-3">How often to sync data (10–300 seconds)</p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={10} max={300} step={10}
              value={prefs.refreshInterval}
              onChange={(e) => set("refreshInterval", Number(e.target.value))}
              className="flex-1 accent-red-500 h-1.5 rounded-full cursor-pointer"
            />
            <div className="w-16 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
              <span className="text-sm font-bold text-gray-800 dark:text-white mono">{prefs.refreshInterval}</span>
              <span className="text-[10px] text-gray-400 block">sec</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── System Info ── */}
      <div className="card">
        <SectionHeader icon={FaShieldAlt} label="System Configuration" accent="icon-blue" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "commanderName", label: "Commander Name", placeholder: "e.g. John Doe", icon: "👤" },
            { key: "city",          label: "City",            placeholder: "e.g. New York",  icon: "🏙️" },
            { key: "timezone",      label: "Timezone",        placeholder: "e.g. EST",        icon: "🕐" },
          ].map(({ key, label, placeholder, icon }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                {icon} {label}
              </label>
              <input
                className="input"
                placeholder={placeholder}
                value={prefs[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Info row */}
        <div className="mt-5 pt-4 border-t border-gray-50 dark:border-white/[0.04] grid grid-cols-3 gap-3">
          {[
            { label: "Version",  value: "v2.0.0" },
            { label: "Build",    value: "2025.07" },
            { label: "Status",   value: "Online" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-sm font-bold mono ${value === "Online" ? "text-green-500" : "text-gray-700 dark:text-gray-300"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3 pb-4">
        <button
          onClick={handleSave}
          className={`btn-red transition-all ${saved ? "bg-green-500 shadow-green-500/30" : ""}`}
          style={saved ? { background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 4px 14px rgba(34,197,94,0.35)" } : {}}
        >
          {saved ? <MdCheck size={16} /> : <MdSave size={16} />}
          {saved ? "Saved Successfully!" : "Save Settings"}
        </button>
        {saved && (
          <p className="text-xs text-green-500 font-medium slide-in">
            ✓ Changes saved to localStorage
          </p>
        )}
      </div>
    </div>
  );
}
