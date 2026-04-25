import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchIncidents, createIncident, patchIncidentStatus, removeIncident, addAlert } from "../store/store";
import { MdAdd, MdDelete, MdFilterList } from "react-icons/md";
import useRole from "../hooks/useRole";

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

const STATUSES   = ["All", "Active", "Dispatched", "Investigating", "Resolved"];
const SEVERITIES = ["All", "Critical", "High", "Medium", "Low"];
const blank = { type: "", location: "", severity: "Medium", status: "Active", officer: "Unassigned", zone: "Zone A" };

export default function IncidentsPage() {
  const dispatch  = useDispatch();
  const { list: incidents, loading } = useSelector((s) => s.incidents);
  const { canCreate, canDelete, canUpdateStatus } = useRole();

  const [statusFilter,   setStatusFilter]   = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(blank);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  const filtered = incidents.filter((i) =>
    (statusFilter === "All"   || i.status   === statusFilter) &&
    (severityFilter === "All" || i.severity === severityFilter)
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.type || !form.location) return;
    setSubmitting(true);
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    await dispatch(createIncident({ ...form, time: now }));
    dispatch(addAlert({ message: `New ${form.severity} incident: ${form.type} at ${form.location}`, type: form.severity === "Critical" ? "critical" : "warning", time: now }));
    setForm(blank);
    setShowForm(false);
    setSubmitting(false);
  };

  return (
    <div className="space-y-5 fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Incidents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} records</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="btn-red">
            <MdAdd size={18} /> Report Incident
          </button>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card grid grid-cols-2 md:grid-cols-3 gap-3 slide-in">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Incident Type *</label>
            <input className="input" placeholder="e.g. Theft, Fire" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Location *</label>
            <input className="input" placeholder="e.g. Main Street" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Officer</label>
            <input className="input" placeholder="Officer name" value={form.officer} onChange={(e) => setForm({ ...form, officer: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Severity</label>
            <select className="input" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
              {["Low", "Medium", "High", "Critical"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Zone</label>
            <select className="input" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })}>
              {["Zone A", "Zone B", "Zone C", "Zone D"].map((z) => <option key={z}>{z}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" disabled={submitting} className="btn-red flex-1 disabled:opacity-60">
              {submitting ? "Saving..." : "Submit"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <MdFilterList className="text-gray-400" size={18} />
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                ${statusFilter === s ? "bg-red-500 text-white border-red-500" : "btn-ghost border-gray-200 dark:border-white/10"}`}
            >{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 ml-2">
          {SEVERITIES.map((s) => (
            <button key={s} onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                ${severityFilter === s ? "bg-orange-500 text-white border-orange-500" : "btn-ghost border-gray-200 dark:border-white/10"}`}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-400 py-10 text-sm">Loading incidents...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-white/5">
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Zone</th>
                  <th className="px-5 py-3 font-medium">Severity</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Officer</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inc) => (
                  <tr key={inc._id} className="table-row">
                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">{inc.type}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{inc.location}</td>
                    <td className="px-5 py-3 text-gray-400 mono text-xs">{inc.zone}</td>
                    <td className="px-5 py-3"><span className={severityBadge[inc.severity] || "badge"}>{inc.severity}</span></td>
                    <td className="px-5 py-3">
                      {canUpdateStatus ? (
                        <select
                          value={inc.status}
                          onChange={(e) => dispatch(patchIncidentStatus({ id: inc._id, status: e.target.value }))}
                          className="text-xs bg-transparent border-none outline-none cursor-pointer"
                        >
                          {["Active", "Dispatched", "Investigating", "Resolved"].map((s) => (
                            <option key={s} className="bg-gray-800">{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={statusBadge[inc.status] || "badge"}>{inc.status}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 mono text-xs">{inc.officer}</td>
                    <td className="px-5 py-3 text-gray-400 mono text-xs">{inc.time}</td>
                    <td className="px-5 py-3">
                      {canDelete && (
                        <button onClick={() => dispatch(removeIncident(inc._id))} className="text-gray-400 hover:text-red-400 transition-colors">
                          <MdDelete size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">No incidents match the filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
