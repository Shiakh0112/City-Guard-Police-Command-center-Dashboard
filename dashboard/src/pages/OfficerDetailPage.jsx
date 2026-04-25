import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { patchOfficerStatus, removeOfficer } from "../store/store";
import { MdArrowBack, MdLocationOn, MdShield, MdDelete, MdBadge, MdCalendarToday, MdWarning } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";

const avatarGradients = [
  "icon-red", "icon-blue", "icon-purple",
  "icon-green", "icon-orange", "icon-cyan", "icon-yellow",
];

const statusBadge = {
  "On Duty": "badge badge-onduty",
  "On Call": "badge badge-oncall",
  "Off Duty": "badge badge-offduty",
};

const severityBadge = {
  Critical: "badge badge-critical",
  High:     "badge badge-high",
  Medium:   "badge badge-medium",
  Low:      "badge badge-low",
};

const statusIncBadge = {
  Active:        "badge badge-active",
  Dispatched:    "badge badge-dispatched",
  Investigating: "badge badge-investigating",
  Resolved:      "badge badge-resolved",
};

export default function OfficerDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const officers    = useSelector((s) => s.officers.list);
  const incidents   = useSelector((s) => s.incidents.list);

  const officer = officers.find((o) => o._id === id || o.id === Number(id));

  if (!officer) {
    return (
      <div className="fade-up flex flex-col items-center justify-center py-24 gap-4">
        <FaUserTie size={48} className="text-gray-300 dark:text-gray-600" />
        <p className="text-gray-400 font-medium">Officer not found</p>
        <button onClick={() => navigate("/officers")} className="btn-red">
          <MdArrowBack size={16} /> Back to Officers
        </button>
      </div>
    );
  }

  const avatarColor   = avatarGradients[(officers.indexOf(officer)) % avatarGradients.length];
  const assignedInc   = incidents.filter((i) => i.officer === officer.name);
  const resolvedCount = assignedInc.filter((i) => i.status === "Resolved").length;
  const activeCount   = assignedInc.filter((i) => i.status === "Active").length;
  const resRate       = assignedInc.length ? Math.round((resolvedCount / assignedInc.length) * 100) : 0;

  const handleDelete = () => {
    dispatch(removeOfficer(officer._id || officer.id));
    navigate("/officers");
  };

  return (
    <div className="fade-up space-y-5 max-w-4xl">

      {/* Back button */}
      <button
        onClick={() => navigate("/officers")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors font-medium"
      >
        <MdArrowBack size={18} /> Back to Officers
      </button>

      {/* Header card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className={`w-16 h-16 rounded-2xl ${avatarColor} flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg`}>
            {officer.avatar}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{officer.name}</h1>
              <span className={statusBadge[officer.status]}>{officer.status}</span>
            </div>
            <p className="text-sm text-gray-400 mono">{officer.badge} · {officer.rank}</p>
            <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
              <MdLocationOn size={14} className="text-red-400" /> {officer.zone}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={officer.status}
              onChange={(e) => dispatch(patchOfficerStatus({ id: officer._id || officer.id, status: e.target.value }))}
              className="text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-300 outline-none cursor-pointer hover:border-red-400 transition-colors"
            >
              {["On Duty", "On Call", "Off Duty"].map((s) => (
                <option key={s} className="bg-gray-900 text-white">{s}</option>
              ))}
            </select>
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-gray-200 dark:border-white/10"
              title="Remove officer"
            >
              <MdDelete size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Incidents",  value: officer.incidents, color: "text-red-400"    },
          { label: "Assigned Cases",   value: assignedInc.length, color: "text-blue-400"  },
          { label: "Resolved",         value: resolvedCount,      color: "text-green-400" },
          { label: "Resolution Rate",  value: `${resRate}%`,      color: "text-purple-400"},
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center py-4">
            <p className={`text-2xl font-bold mono ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Officer details */}
        <div className="card space-y-0">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 pb-3 border-b border-gray-50 dark:border-white/5">
            Officer Details
          </h2>
          {[
            { icon: MdBadge,        label: "Badge No.",  value: officer.badge,  accent: "text-red-400"    },
            { icon: FaUserTie,      label: "Rank",       value: officer.rank,   accent: "text-blue-400"   },
            { icon: MdLocationOn,   label: "Zone",       value: officer.zone,   accent: "text-orange-400" },
            { icon: MdShield,       label: "Status",     value: officer.status, accent: "text-green-400"  },
            { icon: MdCalendarToday,label: "Incidents Handled", value: officer.incidents, accent: "text-purple-400" },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-white/[0.04] last:border-0">
              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                <Icon size={13} className={accent} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Assigned incidents */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Assigned Incidents</h2>
            {activeCount > 0 && (
              <span className="badge badge-active">{activeCount} active</span>
            )}
          </div>

          {assignedInc.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <MdWarning size={32} className="text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400">No incidents assigned</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-white/5">
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Location</th>
                    <th className="px-5 py-3 font-medium">Severity</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedInc.map((inc) => (
                    <tr key={inc._id || inc.id} className="table-row">
                      <td className="px-5 py-3 font-semibold text-gray-800 dark:text-gray-200">{inc.type}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{inc.location}</td>
                      <td className="px-5 py-3"><span className={severityBadge[inc.severity] || "badge"}>{inc.severity}</span></td>
                      <td className="px-5 py-3"><span className={statusIncBadge[inc.status] || "badge"}>{inc.status}</span></td>
                      <td className="px-5 py-3 text-gray-400 mono text-xs">{inc.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
