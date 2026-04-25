import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, fetchMe } from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";
import { CgSpinner } from "react-icons/cg";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Navbar";
import DashboardPage    from "./pages/DashboardPage";
import IncidentsPage    from "./pages/IncidentsPage";
import OfficersPage     from "./pages/OfficersPage";
import OfficerDetailPage from "./pages/OfficerDetailPage";
import AnalyticsPage    from "./pages/AnalyticsPage";
import HeatmapPage      from "./pages/HeatmapPage";
import ProfilePage       from "./pages/ProfilePage";
import SettingsPage      from "./pages/SettingsPage";
import LoginPage         from "./pages/LoginPage";
import AdminPage         from "./pages/AdminPage";

function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-[#060a14]">
          <Routes>
            <Route path="/"           element={<DashboardPage />} />
            <Route path="/incidents"  element={<IncidentsPage />} />
            <Route path="/officers"   element={<OfficersPage />} />
            <Route path="/officers/:id" element={<OfficerDetailPage />} />
            <Route path="/analytics"  element={<AnalyticsPage />} />
            <Route path="/heatmap"    element={<HeatmapPage />} />
            <Route path="/settings"   element={<SettingsPage />} />
            <Route path="/profile"    element={<ProfilePage />} />
            <Route path="/admin"      element={<AdminPage />} />
            <Route path="*"           element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchMe()).finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [dispatch]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#060a14] flex items-center justify-center">
        <CgSpinner size={36} className="animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/*"     element={user  ? <ProtectedLayout /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
