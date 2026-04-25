import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdDashboard, MdWarning, MdPeople, MdBarChart,
  MdMap, MdSettings, MdClose, MdShield, MdPerson, MdAdminPanelSettings,
} from "react-icons/md";
import { FaBolt } from "react-icons/fa";
import useRole from "../hooks/useRole";

const ALL_LINKS = [
  { to: "/",          icon: MdDashboard,         label: "Overview"  },
  { to: "/incidents", icon: MdWarning,            label: "Incidents" },
  { to: "/officers",  icon: MdPeople,             label: "Officers",  adminOnly: true },
  { to: "/analytics", icon: MdBarChart,           label: "Analytics" },
  { to: "/heatmap",   icon: MdMap,                label: "Zone Map"  },
  { to: "/settings",  icon: MdSettings,           label: "Settings"  },
  { to: "/profile",   icon: MdPerson,             label: "Profile"   },
  { to: "/admin",     icon: MdAdminPanelSettings, label: "Users",    adminOnly: true },
];

export default function Sidebar({ open, onClose }) {
  const incidents    = useSelector((s) => s.incidents.list);
  const alerts       = useSelector((s) => s.alerts);
  const currentUser  = useSelector((s) => s.auth.user);
  const { isAdmin }  = useRole();

  const activeCount  = incidents.filter((i) => i.status === "Active").length;
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  const links = ALL_LINKS.filter((l) => !l.adminOnly || isAdmin);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside className={`sidebar fixed top-0 left-0 h-full w-60 z-30 flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl icon-red flex items-center justify-center shadow-lg shadow-red-500/30">
              <MdShield size={19} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">CityGuard</p>
              <p className="text-[10px] text-gray-400 mono tracking-widest">COMMAND CENTER</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
            <MdClose size={18} />
          </button>
        </div>

        {/* Live status pill */}
        <div className="mx-3 mb-5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/5 border border-red-500/20 flex items-center gap-2.5">
          <span className="pulse-dot bg-red-500 live-blink shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-red-400 tracking-wider">LIVE MONITORING</p>
            <p className="text-[10px] text-gray-400 mono">{activeCount} active · {unreadAlerts} alerts</p>
          </div>
          <FaBolt size={11} className="text-orange-400 live-blink shrink-0" />
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 px-2">
          {links.map(({ to, icon: Icon, label, adminOnly }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={17} />
              <span>{label}</span>
              {/* Badge: active incidents count on Incidents link */}
              {label === "Incidents" && activeCount > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {activeCount}
                </span>
              )}
              {/* Badge: unread alerts on Overview link */}
              {label === "Overview" && unreadAlerts > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
              {/* Admin-only badge */}
              {adminOnly && (
                <span className="ml-auto text-[9px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                  ADMIN
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer — user info + role badge */}
        <NavLink to="/profile" onClick={onClose} className="px-4 py-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
          <div className="w-7 h-7 rounded-lg icon-red flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {currentUser?.avatar || "CM"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
              {currentUser?.name || "Commander"}
            </p>
            <p className="text-[10px] text-gray-400 mono capitalize">
              {currentUser?.systemRole || "viewer"} · View Profile →
            </p>
          </div>
        </NavLink>
      </aside>
    </>
  );
}
