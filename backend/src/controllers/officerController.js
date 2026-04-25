const Officer = require("../models/Officer");

exports.getAll = async (req, res) => {
  try {
    const { zone, status } = req.query;
    const filter = { createdBy: req.user._id };
    if (zone && zone !== "All")     filter.zone   = zone;
    if (status && status !== "All") filter.status = status;

    const officers = await Officer.find(filter).sort({ createdAt: -1 });
    res.json(officers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, badge, zone, rank, status } = req.body;
    if (!name || !badge) return res.status(400).json({ message: "Name and badge required" });

    const exists = await Officer.findOne({ badge: badge.toUpperCase() });
    if (exists) return res.status(400).json({ message: "Badge number already exists" });

    const avatar = name.trim().split(" ").map((w) => w[0]?.toUpperCase() || "").slice(0, 2).join("");
    const officer = await Officer.create({ name, badge: badge.toUpperCase(), zone, rank, status, avatar, createdBy: req.user._id });
    res.status(201).json(officer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const officer = await Officer.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!officer) return res.status(404).json({ message: "Officer not found" });
    res.json(officer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Officer.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
