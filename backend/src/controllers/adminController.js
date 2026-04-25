const User    = require("../models/User");
const Officer = require("../models/Officer");

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/users/:id/role  — change role (admin cannot change own role)
exports.changeRole = async (req, res) => {
  try {
    const { systemRole } = req.body;
    if (!["admin", "officer", "viewer"].includes(systemRole))
      return res.status(400).json({ message: "Invalid role" });

    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: "Cannot change your own role" });

    const user = await User.findByIdAndUpdate(
      req.params.id, { systemRole }, { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/create-officer
// Admin fills: name, badge, zone, rank, status, email, password
// This creates BOTH an Officer document AND a User account (systemRole: "officer")
exports.createOfficerWithAccount = async (req, res) => {
  try {
    const { name, badge, zone, rank, status, email, password } = req.body;

    if (!name || !badge || !email || !password)
      return res.status(400).json({ message: "Name, badge, email and password are required" });

    // Check badge uniqueness
    const badgeExists = await Officer.findOne({ badge: badge.toUpperCase() });
    if (badgeExists) return res.status(400).json({ message: "Badge number already exists" });

    // Check email uniqueness
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) return res.status(400).json({ message: "Email already registered" });

    const avatar = name.trim().split(" ").map((w) => w[0]?.toUpperCase() || "").slice(0, 2).join("");

    // 1. Create Officer document
    const officer = await Officer.create({
      name, badge: badge.toUpperCase(), zone, rank, status, avatar,
      createdBy: req.user._id,
    });

    // 2. Create User account linked to this officer
    const user = await User.create({
      name, email: email.toLowerCase(), password,
      systemRole: "officer",
      role: rank,
      badge: badge.toUpperCase(),
      avatar,
      officerId: officer._id,
    });

    res.status(201).json({
      officer,
      user: {
        _id: user._id, name: user.name, email: user.email,
        systemRole: user.systemRole, badge: user.badge, avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id  — remove user (and their officer doc if officer)
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: "Cannot delete yourself" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If officer, also delete their Officer document
    if (user.officerId) await Officer.findByIdAndDelete(user.officerId);

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
