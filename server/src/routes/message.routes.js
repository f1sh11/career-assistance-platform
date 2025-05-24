// src/routes/message.routes.js
import express from "express";
import {
  sendMessage,
  getMessages,
  markAsRead,
  getChatList,
  withdrawMessage
} from "../controllers/messageController.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, sendMessage);
router.get("/:targetId", authenticateToken, getMessages);
router.put("/read/:id", authenticateToken, markAsRead);
router.get("/chat/list", authenticateToken, getChatList);
router.put("/withdraw/:id", authenticateToken, withdrawMessage);

export default router;

