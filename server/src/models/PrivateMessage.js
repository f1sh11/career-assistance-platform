// models/PrivateMessage.js
import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, default: "" },
  fileUrl: { type: String, default: "" },
  fileType: { type: String, default: "" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);

export default PrivateMessage;

