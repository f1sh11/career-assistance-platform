// models/Connection.js
import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now }
});

// 保证 user1 + user2 唯一（顺序无关）
connectionSchema.index({ user1: 1, user2: 1 }, { unique: true });

export default mongoose.model("Connection", connectionSchema);
