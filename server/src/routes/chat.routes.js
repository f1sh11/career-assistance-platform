// src/routes/chat.routes.js
import express from "express";
import { getChatList } from "../controllers/chat.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/list", authenticateToken, getChatList);

export default router;
