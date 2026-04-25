import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOfficers, createOfficer, removeOfficer, patchOfficerStatus } from "../store/store";
import { MdShield, MdLocationOn, MdAdd, MdClose, MdDelete, MdPeople, MdPerson, MdBadge } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import useRole from "../hooks/useRole";

const statusBadge = {
  "On Duty": "badge badge-onduty",
  "On Call": "badge badge-oncall",
  "Off Duty": "badge badge-offduty",
};

const avatarGradients = ["icon-red", "icon-blue", "icon-purple", "icon-green", "icon-orange", "icon-cyan", "icon-yellow"];
const ZONES = ["All", "Zone A", "Zone B", "Zone C", "Zone D"];
const RANKS = ["Officer", "Senior Officer", "Sergeant", "Detective", "Lieutenant", "Captain"];
const BLANK = { name: "", badge: "", zone: "Zone A", rank: "Officer", status: "On Duty" };

function getInitials(name) {
  return name.trim().split(" ").map((w) => w[0]?.toUpperCase() || "").slice(0, 2).join("") || "??";
}

export default function OfficersPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { list: officers, loading } = useSelector((s) => s.officers);
  const { isAdmin, canAddOfficer, canDelete, canUpdateStatus } = useRole();

  const [zoneFilter, setZoneFilter] = useState("All");
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(BLANK);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(fetchOfficers()); }, [dispatch]);

  const onDuty  = officers.filter((o) => o.status === "On Duty").length;
  const onCall  = officers.filter((o) => o.status === "On Call").length;
  const offDuty = officers.filter((o) => o.status === "Off Duty").length;

  const filtered = zoneFilter === "All" ? officers : officers.filter((o) => o.zone === zoneFilter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = {};
    if (!form.name.trim())  e2.name  = "Name is required";
    if (!form.badge.trim()) e2.badge = "Badge number is required";
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setSubmitting(true);
    const result = await dispatch(createOfficer(form));
    if (result.error) {
      setErrors({ badge: result.payload || "Failed to add officer" });
    } else {
      setForm(BLANK); setErrors({}); setShowModal(false);
    }
    setSubmitting(false);
  };

  const handleClose = () => { setShowModal(false); setForm(BLANK); setErrors({}); };

  return (
    <div className="space-y-5 fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Officers</h1>
          <p className="text-sm text-gray-400">{officers.length} total personnel</p>
        </div>
        {canAddOfficer && (
          <button onClick={() => setShowModal(true)} className="btn-red">
            <MdAdd size={18} /> Add Officer
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "On Duty",  value: onDuty,  color: "text-green-400",  bg: "bg-green-500/8  border border-green-500/15"  },
          { label: "On Call",  value: onCall,  color: "text-yellow-400", bg: "bg-yellow-500/8 border border-yellow-500/15" },
          { label: "Off Duty", value: offDuty, color: "text-gray-400",   bg: "bg-gray-500/8   border border-gray-500/15"   },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl p-4 text-center ${bg}`}>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Zone filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 font-medium mr-1">Zone:</span>
        {ZONES.map((z) => (
          <button key={z} onClick={() => setZoneFilter(z)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
              ${zoneFilter === z ? "bg-red-500 text-white border-red-500 shadow-sm shadow-red-500/30" : "btn-ghost border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"}`}
          >
            {z}
            {z !== "All" && <span className="ml-1.5 opacity-70">({officers.filter((o) => o.zone === z).length})</span>}
          </button>
        ))}
      </div>

      {/* Officers grid */}
      {loading ? (
        <p className="text-center text-gray-400 py-10 text-sm">Loading officers...</p>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <MdPeople size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No officers in {zoneFilter}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((o, i) => (
            <div key={o._id} className="card group slide-in cursor-pointer" style={{ animationDelay: `${i * 0.04}s` }} onClick={() => navigate(`/officers/${o._id}`)}>
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}>
                  {o.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">{o.name}</h3>
                    <span className={`${statusBadge[o.status]} shrink-0`}>{o.status}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mono mt-0.5">{o.badge} · {o.rank}</p>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                    <MdLocationOn size={12} className="text-red-400 shrink-0" />{o.zone}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <MdShield size={13} className="text-red-400" />
                  <span>{o.incidents} handled</span>
                </div>
                <div className="flex items-center gap-2">
                  {canUpdateStatus && (
                  <select
                    value={o.status}
                    onChange={(e) => dispatch(patchOfficerStatus({ id: o._id, status: e.target.value }))}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 outline-none cursor-pointer transition-colors hover:border-red-400"
                  >
                    {["On Duty", "On Call", "Off Duty"].map((s) => <option key={s} className="bg-gray-900 text-white">{s}</option>)}
                  </select>
                  )}
                  {canDelete && (
                  <button
                    onClick={(e) => { e.stopPropagation(); dispatch(removeOfficer(o._id)); }}
                    className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <MdDelete size={15} />
                  </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Officer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1322] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/8 my-4">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl icon-blue flex items-center justify-center shadow-md shrink-0">
                  <FaUserTie size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-base leading-tight">Add New Officer</h2>
                  <p className="text-xs text-gray-400">Fill in the officer details below</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                <MdClose size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name + Badge side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <MdPerson size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        style={{ paddingLeft: "2.25rem" }}
                        className={`input ${errors.name ? "border-red-400" : ""}`}
                        placeholder="e.g. James Wilson"
                        value={form.name}
                        onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Badge No. <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <MdBadge size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        style={{ paddingLeft: "2.25rem" }}
                        className={`input mono ${errors.badge ? "border-red-400" : ""}`}
                        placeholder="e.g. PD-007"
                        value={form.badge}
                        onChange={(e) => { setForm({ ...form, badge: e.target.value }); setErrors({ ...errors, badge: "" }); }}
                      />
                    </div>
                    {errors.badge && <p className="text-xs text-red-400 mt-1">{errors.badge}</p>}
                  </div>
                </div>

                {/* Rank + Zone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Rank</label>
                    <select className="input" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })}>
                      {RANKS.map((r) => <option key={r} className="bg-gray-900 text-white">{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Zone</label>
                    <select className="input" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })}>
                      {["Zone A", "Zone B", "Zone C", "Zone D"].map((z) => <option key={z} className="bg-gray-900 text-white">{z}</option>)}
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Initial Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["On Duty", "On Call", "Off Duty"].map((s) => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all
                          ${form.status === s
                            ? s === "On Duty"  ? "bg-green-500/15 border-green-500/40 text-green-500"
                            : s === "On Call"  ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-500"
                            :                   "bg-gray-500/15 border-gray-500/40 text-gray-400"
                            : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-gray-300"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                {form.name && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                    <div className="w-10 h-10 rounded-xl icon-blue flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {getInitials(form.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{form.name}</p>
                      <p className="text-xs text-gray-400 mono truncate">{form.badge || "No badge"} · {form.rank} · {form.zone}</p>
                    </div>
                    <span className={`ml-auto shrink-0 text-xs font-semibold px-2 py-1 rounded-lg
                      ${ form.status === "On Duty" ? "bg-green-500/15 text-green-500"
                       : form.status === "On Call" ? "bg-yellow-500/15 text-yellow-500"
                       : "bg-gray-500/15 text-gray-400"}`}>
                      {form.status}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={handleClose} className="btn-ghost flex-1 justify-center">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-red flex-1 justify-center disabled:opacity-60">
                    <MdAdd size={16} /> {submitting ? "Adding..." : "Add Officer"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
