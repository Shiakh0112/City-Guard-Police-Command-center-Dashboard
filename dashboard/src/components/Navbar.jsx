import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { markAllRead, markRead, logout } from "../store/store";
import { MdMenu, MdLightMode, MdDarkMode, MdNotifications, MdSearch, MdClose, MdWarning, MdPeople, MdLogout } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

const typeStyle = {
  critical: { color: "text-red-400",    dot: "bg-red-500"    },
  warning:  { color: "text-orange-400", dot: "bg-orange-500" },
  info:     { color: "text-blue-400",   dot: "bg-blue-500"   },
};

const severityColor = { Critical: "text-red-400", High: "text-orange-400", Medium: "text-yellow-400", Low: "text-green-400" };
const statusColor   = { Active: "text-red-400", Dispatched: "text-orange-400", Investigating: "text-blue-400", Resolved: "text-green-400" };

export default function Topbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const alerts    = useSelector((s) => s.alerts);
  const user      = useSelector((s) => s.auth.user);
  const incidents = useSelector((s) => s.incidents.list);
  const officers  = useSelector((s) => s.officers.list);
  const unread    = alerts.filter((a) => !a.read).length;
  const [showAlerts, setShowAlerts] = useState(false);
  const [time, setTime]             = useState(new Date());
  const [query, setQuery]           = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount   = incidents.filter((i) => i.status === "Active").length;
  const criticalCount = incidents.filter((i) => i.severity === "Critical").length;


  // Search logic
  const q = query.trim().toLowerCase();
  const matchedIncidents = q
    ? incidents.filter((i) =>
        i.type.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.officer.toLowerCase().includes(q) ||
        i.zone.toLowerCase().includes(q) ||
        i.status.toLowerCase().includes(q) ||
        i.severity.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];
  const matchedOfficers = q
    ? officers.filter((o) =>
        o.name.toLowerCase().includes(q) ||
        o.badge.toLowerCase().includes(q) ||
        o.zone.toLowerCase().includes(q) ||
        o.rank.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];
  const hasResults = matchedIncidents.length > 0 || matchedOfficers.length > 0;

  return (
    <header className="topbar sticky top-0 z-10 px-5 py-3 flex items-center gap-3">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors">
        <MdMenu size={21} />
      </button>

      {/* Search */}
      <div className="relative hidden sm:block w-64" ref={searchRef}>
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search incidents, officers..."
          className="search-bar"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => query && setShowResults(true)}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setShowResults(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MdClose size={14} />
          </button>
        )}

        {/* Results dropdown */}
        {showResults && query && (
          <div className="absolute top-11 left-0 w-80 card shadow-2xl z-50 p-0 overflow-hidden">
            {!hasResults ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-400">No results for <span className="font-semibold text-gray-600 dark:text-gray-300">"{query}"</span></p>
              </div>
            ) : (
              <>
                {matchedIncidents.length > 0 && (
                  <div>
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
                      <MdWarning size={13} className="text-red-400" />
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider">INCIDENTS ({matchedIncidents.length})</span>
                    </div>
                    {matchedIncidents.map((inc) => (
                      <button
                        key={inc._id || inc.id}
                        onClick={() => { navigate("/incidents"); setShowResults(false); setQuery(""); }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors border-b border-gray-50 dark:border-white/[0.03] last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{inc.type}</span>
                          <span className={`text-[10px] font-bold ${severityColor[inc.severity]}`}>{inc.severity}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{inc.location}</span>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span className={`text-[10px] font-medium ${statusColor[inc.status]}`}>{inc.status}</span>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span className="text-[10px] text-gray-400 mono">{inc.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {matchedOfficers.length > 0 && (
                  <div>
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
                      <MdPeople size={13} className="text-blue-400" />
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider">OFFICERS ({matchedOfficers.length})</span>
                    </div>
                    {matchedOfficers.map((o) => (
                      <button
                        key={o._id || o.id}
                        onClick={() => { navigate(`/officers/${o._id || o.id}`); setShowResults(false); setQuery(""); }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors border-b border-gray-50 dark:border-white/[0.03] last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{o.name}</span>
                          <span className="text-[10px] text-gray-400 mono">{o.badge}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{o.rank}</span>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <span className="text-xs text-gray-400">{o.zone}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="px-4 py-2 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-400 text-center">
                    {matchedIncidents.length + matchedOfficers.length} result(s) found
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Live status pills */}
      <div className="hidden md:flex items-center gap-2 ml-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
          <FaCircle size={6} className="text-red-400 live-blink" />
          <span className="text-xs font-semibold text-red-400">{activeCount} Active</span>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <FaCircle size={6} className="text-orange-400 live-blink" />
            <span className="text-xs font-semibold text-orange-400">{criticalCount} Critical</span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Live clock pill */}
        <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/[0.04]">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100 mono leading-none tracking-wide">
              {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5 leading-none">
              {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/[0.04] hover:border-red-400/50 text-gray-500 dark:text-gray-400 transition-all"
        >
          {theme === "dark"
            ? <MdLightMode size={18} className="text-yellow-400" />
            : <MdDarkMode  size={18} className="text-indigo-500" />}
        </button>

        {/* Alerts bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`p-2 rounded-xl border transition-all relative
              ${ showAlerts
                ? "border-red-400/50 bg-red-500/8 text-red-400"
                : "border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-gray-400 hover:border-red-400/50"
              }`}
          >
            <MdNotifications size={18} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-red-500/50">
                {unread}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 top-11 w-84 shadow-2xl z-50 overflow-hidden rounded-2xl border border-gray-200 dark:border-white/8 bg-white dark:bg-[#0c1322]" style={{width: "340px"}}>

              {/* Dropdown header */}
              <div className="px-4 py-3.5 flex items-center justify-between bg-gradient-to-r from-red-500/5 to-orange-500/5 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg icon-red flex items-center justify-center">
                    <MdNotifications size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">Notifications</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{unread} unread · {alerts.length} total</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {unread > 0 && (
                    <button
                      onClick={() => dispatch(markAllRead())}
                      className="text-[11px] font-semibold text-red-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-500/8 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowAlerts(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <MdClose size={15} />
                  </button>
                </div>
              </div>

              {/* Alert items */}
              <div className="max-h-72 overflow-y-auto">
                {alerts.map((a) => {
                  const s = typeStyle[a.type] || typeStyle.info;
                  return (
                    <div
                      key={a.id}
                      onClick={() => dispatch(markRead(a.id))}
                      className={`px-4 py-3 border-b border-gray-50 dark:border-white/[0.03] cursor-pointer transition-colors last:border-0
                        ${ !a.read
                          ? "bg-red-500/[0.04] hover:bg-red-500/[0.07]"
                          : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Type dot */}
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5
                          ${ a.type === "critical" ? "bg-red-500/15"
                           : a.type === "warning"  ? "bg-orange-500/15"
                           : "bg-blue-500/15" }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className={`text-[10px] font-bold tracking-wider ${s.color}`}>
                              {a.type.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400 mono shrink-0">{a.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{a.message}</p>
                        </div>
                        {!a.read && (
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 text-center">
                <p className="text-[10px] text-gray-400">
                  Click an alert to mark as read
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => { dispatch(logout()); navigate("/login"); }}
          title="Logout"
          className="p-2 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/[0.04] hover:border-red-400/50 text-gray-500 dark:text-gray-400 hover:text-red-400 transition-all"
        >
          <MdLogout size={18} />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl icon-red flex items-center justify-center text-white text-[11px] font-bold shadow-md shadow-red-500/30" title={user?.name}>
          {user?.avatar || "CM"}
        </div>
      </div>
    </header>
  );
}
