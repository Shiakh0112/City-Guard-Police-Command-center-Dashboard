import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveProfile } from "../store/store";
import {
  MdEdit, MdSave, MdClose, MdEmail, MdPhone,
  MdLocationOn, MdBadge, MdCalendarToday, MdCheck,
} from "react-icons/md";

const AVATAR_COLORS = ["icon-red", "icon-blue", "icon-purple", "icon-green", "icon-orange", "icon-cyan"];

function InfoRow({ icon: Icon, label, value, accent = "text-red-400" }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-white/[0.04] last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
        <Icon size={15} className={accent} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const dispatch  = useDispatch();
  const user      = useSelector((s) => s.auth.user);
  const incidents = useSelector((s) => s.incidents.list);
  const officers  = useSelector((s) => s.officers.list);

  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saved, setSaved]     = useState(false);
  const [saving, setSaving]   = useState(false);

  if (!user) return null;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleEdit = () => { setForm({ name: user.name, role: user.role, email: user.email, phone: user.phone || "", city: user.city || "", badge: user.badge || "", bio: user.bio || "", joinDate: user.joinDate ? user.joinDate.slice(0, 10) : "" }); setEditing(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await dispatch(saveProfile(form));
    setSaved(true);
    setEditing(false);
    setSaving(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => setEditing(false);

  const totalIncidents = incidents.length;
  const resolved       = incidents.filter((i) => i.status === "Resolved").length;
  const totalOfficers  = officers.length;
  const onDuty         = officers.filter((o) => o.status === "On Duty").length;
  const resolutionRate = totalIncidents ? Math.round((resolved / totalIncidents) * 100) : 0;

  const joinYear    = user.joinDate ? new Date(user.joinDate).getFullYear() : new Date().getFullYear();
  const yearsServed = new Date().getFullYear() - joinYear;
  const avatarColor = AVATAR_COLORS[(user.name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

  return (
    <div className="fade-up space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-sm text-gray-400">Commander account & information</p>
        </div>
        {!editing ? (
          <button onClick={handleEdit} className="btn-red"><MdEdit size={16} /> Edit Profile</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="btn-ghost"><MdClose size={16} /> Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-red disabled:opacity-60"><MdSave size={16} /> {saving ? "Saving..." : "Save"}</button>
          </div>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 slide-in">
          <MdCheck size={16} className="text-green-500" />
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Profile updated successfully</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="space-y-4">
          <div className="card text-center">
            <div className={`w-20 h-20 rounded-2xl ${avatarColor} flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg`}>
              {user.avatar || user.name?.slice(0, 2).toUpperCase()}
            </div>
            <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{user.role}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="badge badge-onduty">● Active</span>
              <span className="badge badge-low mono">{user.badge}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 text-xs text-gray-400">
              <span className="mono">{yearsServed} years</span> of service
            </div>
          </div>

          <div className="card space-y-0 p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 dark:border-white/5">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Command Stats</p>
            </div>
            {[
              { label: "Total Incidents",  value: totalIncidents, color: "text-red-400"    },
              { label: "Resolved",         value: resolved,       color: "text-green-400"  },
              { label: "Resolution Rate",  value: `${resolutionRate}%`, color: "text-blue-400" },
              { label: "Officers Managed", value: totalOfficers,  color: "text-purple-400" },
              { label: "On Duty Now",      value: onDuty,         color: "text-yellow-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 dark:border-white/[0.03] last:border-0">
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                <span className={`text-sm font-bold mono ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">
          {!editing ? (
            <>
              <div className="card">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Personal Information</h3>
                <InfoRow icon={MdEmail}         label="Email"     value={user.email}   accent="text-blue-400"   />
                <InfoRow icon={MdPhone}         label="Phone"     value={user.phone}   accent="text-green-400"  />
                <InfoRow icon={MdLocationOn}    label="City"      value={user.city}    accent="text-orange-400" />
                <InfoRow icon={MdBadge}         label="Badge No." value={user.badge}   accent="text-red-400"    />
                <InfoRow icon={MdCalendarToday} label="Joined"    value={user.joinDate ? new Date(user.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"} accent="text-purple-400" />
              </div>
              <div className="card">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">About</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{user.bio || "No bio added yet."}</p>
              </div>
              <div className="card p-0 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-50 dark:border-white/5">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">Recent Activity</p>
                </div>
                {incidents.slice(0, 5).map((inc) => (
                  <div key={inc._id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 dark:border-white/[0.03] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${inc.severity === "Critical" ? "bg-red-500" : inc.severity === "High" ? "bg-orange-400" : inc.severity === "Medium" ? "bg-yellow-400" : "bg-green-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{inc.type} — {inc.location}</p>
                      <p className="text-[10px] text-gray-400 mono">{inc.zone} · {inc.time}</p>
                    </div>
                    <span className={`badge text-[10px] ${inc.status === "Resolved" ? "badge-resolved" : inc.status === "Active" ? "badge-active" : "badge-dispatched"}`}>{inc.status}</span>
                  </div>
                ))}
                {incidents.length === 0 && <p className="text-center text-gray-400 py-6 text-sm">No incidents yet.</p>}
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="card space-y-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 pb-3 border-b border-gray-50 dark:border-white/5">Edit Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "name",  label: "Full Name",   placeholder: "Commander name" },
                  { key: "role",  label: "Role / Title", placeholder: "e.g. Chief of Operations" },
                  { key: "email", label: "Email",        placeholder: "email@cityguard.gov" },
                  { key: "phone", label: "Phone",        placeholder: "+1 (555) 000-000" },
                  { key: "city",  label: "City",         placeholder: "e.g. New York" },
                  { key: "badge", label: "Badge No.",    placeholder: "e.g. CMD-001" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
                    <input className="input" placeholder={placeholder} value={form[key] || ""} onChange={(e) => set(key, e.target.value)} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Join Date</label>
                <input type="date" className="input w-48" value={form.joinDate || ""} onChange={(e) => set("joinDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Bio</label>
                <textarea rows={3} className="input resize-none" placeholder="Brief description..." value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={handleCancel} className="btn-ghost flex-1 justify-center"><MdClose size={15} /> Cancel</button>
                <button type="submit" disabled={saving} className="btn-red flex-1 justify-center disabled:opacity-60"><MdSave size={15} /> {saving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
