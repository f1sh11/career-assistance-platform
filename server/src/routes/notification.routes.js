// src/routes/notification.routes.js
import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  getMyNotifications,
  deleteNotification,
  clearNotifications
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authenticateToken, getMyNotifications);
router.delete("/:id", authenticateToken, deleteNotification);
router.delete("/", authenticateToken, clearNotifications);

export default router;
    