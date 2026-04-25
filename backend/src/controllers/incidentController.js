const Incident = require("../models/Incident");

exports.getAll = async (req, res) => {
  try {
    const { status, severity, zone } = req.query;
    const filter = { createdBy: req.user._id };
    if (status && status !== "All")     filter.status   = status;
    if (severity && severity !== "All") filter.severity = severity;
    if (zone && zone !== "All")         filter.zone     = zone;

    const incidents = await Incident.find(filter).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { type, location, zone, severity, status, officer } = req.body;
    if (!type || !location) return res.status(400).json({ message: "Type and location required" });

    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const incident = await Incident.create({ type, location, zone, severity, status, officer, time: now, createdBy: req.user._id });
    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const uid = req.user._id;
    const total    = await Incident.countDocuments({ createdBy: uid });
    const active   = await Incident.countDocuments({ createdBy: uid, status: "Active" });
    const resolved = await Incident.countDocuments({ createdBy: uid, status: "Resolved" });
    const critical = await Incident.countDocuments({ createdBy: uid, severity: "Critical" });
    res.json({ total, active, resolved, critical });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
