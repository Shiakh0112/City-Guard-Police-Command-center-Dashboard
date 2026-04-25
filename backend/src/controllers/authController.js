const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const userPayload = (user) => ({
  _id: user._id, name: user.name, email: user.email,
  systemRole: user.systemRole, role: user.role,
  badge: user.badge, avatar: user.avatar, officerId: user.officerId,
});

// POST /api/auth/register  — only admin or viewer can self-register
exports.register = async (req, res) => {
  try {
    const { name, email, password, systemRole } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Only allow admin or viewer to self-register
    const allowedSelfRoles = ["admin", "viewer"];
    const assignedRole = allowedSelfRoles.includes(systemRole) ? systemRole : "viewer";

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const avatar = name.trim().split(" ").map((w) => w[0]?.toUpperCase() || "").slice(0, 2).join("");
    const user   = await User.create({ name, email, password, systemRole: assignedRole, avatar });
    const token  = signToken(user._id);

    res.status(201).json({ token, user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user._id);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(userPayload(req.user));
};

// PUT /api/auth/profile  — update own profile
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "role", "phone", "city", "bio", "badge", "joinDate"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    if (updates.name)
      updates.avatar = updates.name.trim().split(" ").map((w) => w[0]?.toUpperCase() || "").slice(0, 2).join("");

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(userPayload(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
