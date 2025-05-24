import express from "express";
import { getMyActivities } from "../controllers/activity.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, getMyActivities);

export default router;
