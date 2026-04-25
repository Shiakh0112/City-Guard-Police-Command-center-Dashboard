const mongoose = require("mongoose");

const officerSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    badge:     { type: String, required: true, unique: true },
    zone:      { type: String, enum: ["Zone A", "Zone B", "Zone C", "Zone D"], default: "Zone A" },
    rank:      { type: String, default: "Officer" },
    status:    { type: String, enum: ["On Duty", "On Call", "Off Duty"], default: "On Duty" },
    incidents: { type: Number, default: 0 },
    avatar:    { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Officer", officerSchema);
