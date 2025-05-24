// src/routes/security.routes.js
import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { changePassword, getLoginHistory } from "../controllers/security.controller.js";

const router = express.Router();

router.post("/change-password", authenticateToken, changePassword);
router.get("/logins", authenticateToken, getLoginHistory);

export default router;
