const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true },
    password:   { type: String, required: true, minlength: 6 },
    // systemRole controls permissions:
    // "admin"   → full access, can add/delete incidents, officers, manage users
    // "officer" → created by admin only, can update incident status
    // "viewer"  → read-only, can only see dashboard/stats
    systemRole: { type: String, enum: ["admin", "officer", "viewer"], default: "viewer" },
    role:       { type: String, default: "" },       // display title e.g. "Sergeant"
    badge:      { type: String, default: "" },
    phone:      { type: String, default: "" },
    city:       { type: String, default: "" },
    bio:        { type: String, default: "" },
    joinDate:   { type: Date, default: Date.now },
    avatar:     { type: String, default: "" },
    // Link officer user to their Officer document
    officerId:  { type: mongoose.Schema.Types.ObjectId, ref: "Officer", default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);
