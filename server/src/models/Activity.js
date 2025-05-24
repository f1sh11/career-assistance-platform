// models/Activity.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., comment, request, view
  message: { type: String, required: true },
  date: { type: String, required: true }, // e.g., '2024-05-06'
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Activity", activitySchema);
