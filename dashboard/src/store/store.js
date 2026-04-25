import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", creds);
    localStorage.setItem("token", data.token);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", creds);
    localStorage.setItem("token", data.token);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Register failed");
  }
});

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const saveProfile = createAsyncThunk("auth/updateProfile", async (updates, { rejectWithValue }) => {
  try {
    const { data } = await api.put("/auth/profile", updates);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logout: (state) => { state.user = null; localStorage.removeItem("token"); },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (b) => {
    const pending  = (s) => { s.loading = true; s.error = null; };
    const rejected = (s, a) => { s.loading = false; s.error = a.payload; };
    b.addCase(loginUser.pending,    pending)
     .addCase(loginUser.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload; })
     .addCase(loginUser.rejected,   rejected)
     .addCase(registerUser.pending,   pending)
     .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
     .addCase(registerUser.rejected,  rejected)
     .addCase(fetchMe.fulfilled,    (s, a) => { s.user = a.payload; })
     .addCase(saveProfile.fulfilled,(s, a) => { s.user = a.payload; });
  },
});

// ─── INCIDENTS ───────────────────────────────────────────────────────────────
export const fetchIncidents = createAsyncThunk("incidents/fetchAll", async (params = {}) => {
  const { data } = await api.get("/incidents", { params });
  return data;
});

export const createIncident = createAsyncThunk("incidents/create", async (body, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/incidents", body);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const patchIncidentStatus = createAsyncThunk("incidents/updateStatus", async ({ id, status }) => {
  const { data } = await api.put(`/incidents/${id}`, { status });
  return data;
});

export const removeIncident = createAsyncThunk("incidents/delete", async (id) => {
  await api.delete(`/incidents/${id}`);
  return id;
});

export const fetchIncidentStats = createAsyncThunk("incidents/stats", async () => {
  const { data } = await api.get("/incidents/stats");
  return data;
});

const incidentsSlice = createSlice({
  name: "incidents",
  initialState: { list: [], stats: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchIncidents.pending,  (s) => { s.loading = true; })
     .addCase(fetchIncidents.fulfilled,(s, a) => { s.loading = false; s.list = a.payload; })
     .addCase(fetchIncidents.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
     .addCase(createIncident.fulfilled,(s, a) => { s.list.unshift(a.payload); })
     .addCase(patchIncidentStatus.fulfilled, (s, a) => {
       const i = s.list.findIndex((x) => x._id === a.payload._id);
       if (i !== -1) s.list[i] = a.payload;
     })
     .addCase(removeIncident.fulfilled,(s, a) => { s.list = s.list.filter((x) => x._id !== a.payload); })
     .addCase(fetchIncidentStats.fulfilled, (s, a) => { s.stats = a.payload; });
  },
});

// ─── OFFICERS ────────────────────────────────────────────────────────────────
export const fetchOfficers = createAsyncThunk("officers/fetchAll", async (params = {}) => {
  const { data } = await api.get("/officers", { params });
  return data;
});

export const createOfficer = createAsyncThunk("officers/create", async (body, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/officers", body);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const patchOfficerStatus = createAsyncThunk("officers/updateStatus", async ({ id, status }) => {
  const { data } = await api.put(`/officers/${id}`, { status });
  return data;
});

export const removeOfficer = createAsyncThunk("officers/delete", async (id) => {
  await api.delete(`/officers/${id}`);
  return id;
});

const officersSlice = createSlice({
  name: "officers",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchOfficers.pending,  (s) => { s.loading = true; })
     .addCase(fetchOfficers.fulfilled,(s, a) => { s.loading = false; s.list = a.payload; })
     .addCase(fetchOfficers.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
     .addCase(createOfficer.fulfilled,(s, a) => { s.list.unshift(a.payload); })
     .addCase(patchOfficerStatus.fulfilled, (s, a) => {
       const i = s.list.findIndex((x) => x._id === a.payload._id);
       if (i !== -1) s.list[i] = a.payload;
     })
     .addCase(removeOfficer.fulfilled,(s, a) => { s.list = s.list.filter((x) => x._id !== a.payload); });
  },
});

// ─── ALERTS (local only) ─────────────────────────────────────────────────────
const alertsSlice = createSlice({
  name: "alerts",
  initialState: [
    { id: 1, message: "Critical incident reported at Elm Road — Fire unit dispatched", type: "critical", time: "10:45 AM", read: false },
    { id: 2, message: "Officer Sara Lee responding to Highway 5 accident", type: "info", time: "09:15 AM", read: false },
    { id: 3, message: "Zone A patrol shift change at 12:00 PM", type: "warning", time: "08:00 AM", read: true },
  ],
  reducers: {
    markRead:    (s, { payload }) => { const a = s.find((x) => x.id === payload); if (a) a.read = true; },
    markAllRead: (s) => { s.forEach((a) => { a.read = true; }); },
    addAlert:    (s, { payload }) => { s.unshift({ ...payload, id: Date.now(), read: false }); },
  },
});

export const logout = authSlice.actions.logout;
export const clearError = authSlice.actions.clearError;

// ─── ADMIN ───────────────────────────────────────────────────────────────────
export const fetchAllUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const { data } = await api.get("/admin/users");
  return data;
});

export const changeUserRole = createAsyncThunk("admin/changeRole", async ({ id, systemRole }) => {
  const { data } = await api.put(`/admin/users/${id}/role`, { systemRole });
  return data;
});

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
  await api.delete(`/admin/users/${id}`);
  return id;
});

// Admin creates officer — also creates login account for that officer
export const adminCreateOfficer = createAsyncThunk("admin/createOfficer", async (body, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/admin/create-officer", body);
    return data; // { officer, user }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: { users: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAllUsers.pending,      (s) => { s.loading = true; })
     .addCase(fetchAllUsers.fulfilled,    (s, a) => { s.loading = false; s.users = a.payload; })
     .addCase(changeUserRole.fulfilled,   (s, a) => {
       const i = s.users.findIndex((u) => u._id === a.payload._id);
       if (i !== -1) s.users[i] = a.payload;
     })
     .addCase(deleteUser.fulfilled,       (s, a) => { s.users = s.users.filter((u) => u._id !== a.payload); })
     .addCase(adminCreateOfficer.fulfilled,(s, a) => { s.users.unshift(a.payload.user); });
  },
});
export const { markRead, markAllRead, addAlert } = alertsSlice.actions;

export const store = configureStore({
  reducer: {
    auth:      authSlice.reducer,
    incidents: incidentsSlice.reducer,
    officers:  officersSlice.reducer,
    alerts:    alertsSlice.reducer,
    admin:     adminSlice.reducer,
  },
});
