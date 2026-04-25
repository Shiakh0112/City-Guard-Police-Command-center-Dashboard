const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    type:     { type: String, required: true },
    location: { type: String, required: true },
    zone:     { type: String, enum: ["Zone A", "Zone B", "Zone C", "Zone D"], default: "Zone A" },
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    status:   { type: String, enum: ["Active", "Dispatched", "Investigating", "Resolved"], default: "Active" },
    officer:  { type: String, default: "Unassigned" },
    time:     { type: String, default: "" },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);
