import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, changeUserRole, deleteUser, adminCreateOfficer, fetchOfficers } from "../store/store";
import useRole from "../hooks/useRole";
import { useNavigate } from "react-router-dom";
import {
  MdAdminPanelSettings, MdAdd, MdDelete, MdClose,
  MdEmail, MdLock, MdBadge, MdLocationOn, MdCheck,
  MdPerson, MdShield, MdVisibility, MdVisibilityOff,
} from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

const ROLE_STYLE = {
  admin:   { cls: "bg-red-500/15 text-red-400 border border-red-500/30",    dot: "bg-red-400"  },
  officer: { cls: "bg-blue-500/15 text-blue-400 border border-blue-500/30",  dot: "bg-blue-400" },
  viewer:  { cls: "bg-gray-500/15 text-gray-400 border border-gray-500/30",  dot: "bg-gray-400" },
};

const RANKS  = ["Officer", "Senior Officer", "Sergeant", "Detective", "Lieutenant", "Captain"];
const ZONES  = ["Zone A", "Zone B", "Zone C", "Zone D"];
const BLANK  = { name: "", badge: "", zone: "Zone A", rank: "Officer", status: "On Duty", email: "", password: "" };

function Field({ label, error, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-gray-400" />}
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">⚠ {error}</p>}
    </div>
  );
}

export default function AdminPage() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { isAdmin } = useRole();
  const { users, loading } = useSelector((s) => s.admin);
  const currentUser = useSelector((s) => s.auth.user);

  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(BLANK);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(null);
  const [showPass, setShowPass]     = useState(false);
  const [step, setStep]             = useState(1); // 2-step form

  useEffect(() => {
    if (!isAdmin) { navigate("/"); return; }
    dispatch(fetchAllUsers());
  }, [isAdmin, dispatch, navigate]);

  if (!isAdmin) return null;

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(BLANK);
    setErrors({});
    setStep(1);
    setShowPass(false);
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Full name is required";
    if (!form.badge.trim()) e.badge = "Badge number is required";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.email.trim())       e.email    = "Email is required";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleNext = () => {
    const e = validateStep1();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validateStep2();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setSubmitting(true);
    const result = await dispatch(adminCreateOfficer(form));
    if (result.error) {
      setErrors({ email: result.payload || "Failed to create officer" });
    } else {
      dispatch(fetchOfficers());
      setSuccess({ name: form.name, email: form.email, password: form.password, badge: form.badge });
      closeModal();
    }
    setSubmitting(false);
  };

  const handleDeleteUser = (id, name) => {
    if (!window.confirm(`Remove "${name}"? This cannot be undone.`)) return;
    dispatch(deleteUser(id));
  };

  const initials = form.name.trim().split(" ").map((w) => w[0]?.toUpperCase() || "").slice(0, 2).join("") || "?";

  return (
    <div className="fade-up space-y-6 max-w-5xl">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MdAdminPanelSettings size={24} className="text-red-400" />
            User Management
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Add officers & manage user access roles</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-red">
          <MdAdd size={18} /> Add Officer
        </button>
      </div>

      {/* ── Success Banner ── */}
      {success && (
        <div className="relative rounded-2xl overflow-hidden border border-green-500/25 bg-green-500/8 slide-in">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-2xl" />
          <div className="px-5 py-4 flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
              <MdCheck size={18} className="text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-green-500">Officer account created!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Share these login credentials with <span className="font-semibold text-gray-700 dark:text-gray-200">{success.name}</span>
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: "Badge",    value: success.badge    },
                  { label: "Email",    value: success.email    },
                  { label: "Password", value: success.password },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white dark:bg-white/5 rounded-xl px-3 py-2 border border-gray-100 dark:border-white/8">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-bold text-gray-800 dark:text-white mono mt-0.5 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setSuccess(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0">
              <MdClose size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Role Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { role: "admin",   icon: MdAdminPanelSettings, desc: "Full access — add/delete incidents, officers, manage all users" },
          { role: "officer", icon: FaUserTie,             desc: "Created by admin — can update incident & officer status" },
          { role: "viewer",  icon: MdShield,              desc: "Read-only — view dashboard & stats, cannot modify anything" },
        ].map(({ role, icon: Icon, desc }) => (
          <div key={role} className="card py-4 border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg capitalize ${ROLE_STYLE[role].cls}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${ROLE_STYLE[role].dot} mr-1.5`} />
                {role}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── Users Table ── */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white text-sm">All Users</h2>
            <p className="text-xs text-gray-400 mt-0.5">{users.length} registered accounts</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <CgSpinner size={24} className="animate-spin text-red-400" />
            <span className="text-sm text-gray-400">Loading users...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Change Role</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="table-row">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl icon-red flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                          {u.avatar || u.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{u.name}</p>
                          {u._id === currentUser?._id && (
                            <p className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> You
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs mono">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize inline-flex items-center gap-1.5 ${ROLE_STYLE[u.systemRole]?.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ROLE_STYLE[u.systemRole]?.dot}`} />
                        {u.systemRole}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {u._id === currentUser?._id ? (
                        <span className="text-xs text-gray-400 italic">Your account</span>
                      ) : (
                        <select
                          value={u.systemRole}
                          onChange={(e) => dispatch(changeUserRole({ id: u._id, systemRole: e.target.value }))}
                          className="text-xs bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-gray-700 dark:text-gray-300 outline-none cursor-pointer hover:border-red-400 transition-colors"
                        >
                          <option value="admin"   className="bg-gray-900 text-white">admin</option>
                          <option value="officer" className="bg-gray-900 text-white">officer</option>
                          <option value="viewer"  className="bg-gray-900 text-white">viewer</option>
                        </select>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {u._id !== currentUser?._id && (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Remove user"
                        >
                          <MdDelete size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          ADD OFFICER MODAL — 2 Step
      ══════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1322] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/8 slide-in overflow-hidden">

            {/* ── Modal Top Bar ── */}
            <div className="bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent border-b border-gray-100 dark:border-white/8 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl icon-blue flex items-center justify-center shadow-lg">
                    <FaUserTie size={17} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-base">Add New Officer</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Creates profile + login account</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <MdClose size={18} />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mt-4">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                      ${step >= s ? "bg-red-500 text-white shadow-md shadow-red-500/30" : "bg-gray-100 dark:bg-white/8 text-gray-400"}`}>
                      {step > s ? <MdCheck size={14} /> : s}
                    </div>
                    <span className={`text-xs font-medium ${step >= s ? "text-gray-700 dark:text-gray-300" : "text-gray-400"}`}>
                      {s === 1 ? "Officer Info" : "Login Credentials"}
                    </span>
                    {s < 2 && <div className={`w-8 h-0.5 rounded-full ${step > s ? "bg-red-500" : "bg-gray-200 dark:bg-white/10"}`} />}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Step 1: Officer Details ── */}
            {step === 1 && (
              <div className="px-6 py-5 space-y-4">

                {/* Name */}
                <Field label="Full Name *" icon={MdPerson} error={errors.name}>
                  <input
                    className={`input ${errors.name ? "border-red-400 focus:border-red-400" : ""}`}
                    placeholder="e.g. John Smith"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    autoFocus
                  />
                </Field>

                {/* Badge */}
                <Field label="Badge Number *" icon={MdBadge} error={errors.badge}>
                  <input
                    className={`input mono ${errors.badge ? "border-red-400 focus:border-red-400" : ""}`}
                    placeholder="e.g. PD-007"
                    value={form.badge}
                    onChange={(e) => set("badge", e.target.value.toUpperCase())}
                  />
                </Field>

                {/* Rank + Zone */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Rank" icon={FaUserTie}>
                    <select className="input" value={form.rank} onChange={(e) => set("rank", e.target.value)}>
                      {RANKS.map((r) => <option key={r} className="bg-gray-900 text-white">{r}</option>)}
                    </select>
                  </Field>
                  <Field label="Zone" icon={MdLocationOn}>
                    <select className="input" value={form.zone} onChange={(e) => set("zone", e.target.value)}>
                      {ZONES.map((z) => <option key={z} className="bg-gray-900 text-white">{z}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Status */}
                <Field label="Initial Status" icon={MdShield}>
                  <div className="grid grid-cols-3 gap-2">
                    {["On Duty", "On Call", "Off Duty"].map((s) => (
                      <button key={s} type="button" onClick={() => set("status", s)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all
                          ${form.status === s
                            ? s === "On Duty"  ? "border-green-500 bg-green-500/12 text-green-500"
                            : s === "On Call"  ? "border-yellow-500 bg-yellow-500/12 text-yellow-500"
                            :                   "border-gray-400 bg-gray-500/12 text-gray-400"
                            : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
                          }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Live Preview */}
                {form.name && (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/8">
                    <div className="w-10 h-10 rounded-xl icon-blue flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{form.name}</p>
                      <p className="text-xs text-gray-400 mono mt-0.5">
                        {form.badge || "No badge"} · {form.rank} · {form.zone}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg
                      ${form.status === "On Duty" ? "bg-green-500/12 text-green-500"
                      : form.status === "On Call" ? "bg-yellow-500/12 text-yellow-500"
                      : "bg-gray-500/12 text-gray-400"}`}>
                      {form.status}
                    </span>
                  </div>
                )}

                {/* Next Button */}
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={closeModal} className="btn-ghost flex-1 justify-center">Cancel</button>
                  <button type="button" onClick={handleNext} className="btn-red flex-1 justify-center">
                    Next — Set Credentials →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Login Credentials ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                {/* Officer summary */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-500/6 border border-blue-500/15">
                  <div className="w-10 h-10 rounded-xl icon-blue flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{form.name}</p>
                    <p className="text-xs text-gray-400 mono">{form.badge} · {form.rank} · {form.zone}</p>
                  </div>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
                  <span className="text-base shrink-0">🔑</span>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 leading-relaxed">
                    Set the email & password for this officer. They will use these credentials to login to the dashboard.
                  </p>
                </div>

                {/* Email */}
                <Field label="Login Email *" icon={MdEmail} error={errors.email}>
                  <input
                    type="email"
                    className={`input ${errors.email ? "border-red-400 focus:border-red-400" : ""}`}
                    placeholder="officer@cityguard.gov"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    autoFocus
                  />
                </Field>

                {/* Password */}
                <Field label="Password *" icon={MdLock} error={errors.password}>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className={`input pr-10 mono ${errors.password ? "border-red-400 focus:border-red-400" : ""}`}
                      placeholder="min 6 characters"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      {showPass ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                    </button>
                  </div>
                </Field>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1 justify-center">
                    ← Back
                  </button>
                  <button type="submit" disabled={submitting} className="btn-red flex-1 justify-center disabled:opacity-60">
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <CgSpinner size={16} className="animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      <><MdAdd size={16} /> Create Officer</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
