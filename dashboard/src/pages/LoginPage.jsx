import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, clearError } from "../store/store";
import { MdShield, MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff, MdAdminPanelSettings, MdRemoveRedEye } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [mode, setMode]         = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm]         = useState({ name: "", email: "", password: "", systemRole: "viewer" });

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); dispatch(clearError()); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      dispatch(loginUser({ email: form.email, password: form.password }));
    } else {
      dispatch(registerUser({ name: form.name, email: form.email, password: form.password, systemRole: form.systemRole }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060a14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl icon-red flex items-center justify-center mx-auto shadow-lg shadow-red-500/30 mb-4">
            <MdShield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">City Guard</h1>
          <p className="text-sm text-gray-400 mt-1">Police Command Dashboard</p>
        </div>

        <div className="card shadow-xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-white/5 p-1 mb-6">
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => { setMode(m); dispatch(clearError()); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize
                  ${mode === m ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-400"}`}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name — register only */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <MdPerson size={13} className="text-gray-400" /> Full Name
                </label>
                <input className="input" placeholder="Your full name" value={form.name}
                  onChange={(e) => set("name", e.target.value)} required />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                <MdEmail size={13} className="text-gray-400" /> Email
              </label>
              <input type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                <MdLock size={13} className="text-gray-400" /> Password
              </label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} className="input pr-10"
                  placeholder="••••••••" value={form.password}
                  onChange={(e) => set("password", e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                </button>
              </div>
            </div>

            {/* Role selection — register only */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Register as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Admin */}
                  <button type="button" onClick={() => set("systemRole", "admin")}
                    className={`p-3 rounded-xl border-2 text-left transition-all
                      ${form.systemRole === "admin"
                        ? "border-red-500 bg-red-500/8"
                        : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"}`}>
                    <MdAdminPanelSettings size={20} className={form.systemRole === "admin" ? "text-red-400" : "text-gray-400"} />
                    <p className="text-xs font-bold text-gray-800 dark:text-white mt-1">Admin</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">Full access. Add officers, manage incidents.</p>
                    {form.systemRole === "admin" && <p className="text-[10px] text-red-400 font-bold mt-1">● Selected</p>}
                  </button>

                  {/* Viewer */}
                  <button type="button" onClick={() => set("systemRole", "viewer")}
                    className={`p-3 rounded-xl border-2 text-left transition-all
                      ${form.systemRole === "viewer"
                        ? "border-blue-500 bg-blue-500/8"
                        : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"}`}>
                    <MdRemoveRedEye size={20} className={form.systemRole === "viewer" ? "text-blue-400" : "text-gray-400"} />
                    <p className="text-xs font-bold text-gray-800 dark:text-white mt-1">Viewer</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">Read-only. View dashboard & stats only.</p>
                    {form.systemRole === "viewer" && <p className="text-[10px] text-blue-400 font-bold mt-1">● Selected</p>}
                  </button>
                </div>

                {/* Officer note */}
                <div className="mt-3 px-3 py-2.5 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
                  <p className="text-[11px] text-yellow-500 font-medium">
                    👮 Officer accounts are created by Admin — not self-registered.
                    Officers login with credentials given by Admin.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-red w-full justify-center py-3 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <CgSpinner size={18} className="animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
