// src/controllers/activity.controller.js
import Activity from "../models/Activity.js";

export const getMyActivities = async (req, res) => {
  try {
    const { search = "", date = "" } = req.query;

    const filter = {
      userId: req.user._id,
      ...(search && { message: { $regex: search, $options: "i" } }),
      ...(date && { date })
    };

    const activities = await Activity.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ activities });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity log", error: err.message });
  }
};
