import { useSelector } from "react-redux";

/**
 * useRole() — Role-based permission hook
 *
 * systemRole values:
 *   "admin"   → full access (add/delete incidents, add officers via admin panel, manage users)
 *   "officer" → created by admin, can update incident/officer status only
 *   "viewer"  → read-only, cannot add or delete anything
 */
export default function useRole() {
  const user = useSelector((s) => s.auth.user);
  const systemRole = user?.systemRole || "viewer";

  return {
    systemRole,
    isAdmin:         systemRole === "admin",
    isOfficer:       systemRole === "officer",
    isViewer:        systemRole === "viewer",
    canCreate:       systemRole === "admin",          // only admin adds incidents/officers
    canDelete:       systemRole === "admin",          // only admin deletes
    canUpdateStatus: systemRole === "admin" || systemRole === "officer", // both can update status
    canManageUsers:  systemRole === "admin",          // only admin sees /admin page
  };
}
