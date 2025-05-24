// utils/activityLogger.js
import Activity from "../models/Activity.js";

export const logActivity = async (userId, type, message) => {
  const date = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
  await Activity.create({ userId, type, message, date });
};
