// models/AuditLog.js
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
  action: { type: String, enum: ["approve", "reject"], required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("AuditLog", auditLogSchema);
