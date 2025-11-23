import express from "express";
import auth from "../middleware/authMiddleware.js";
import Application from "../models/Application.js";

const router = express.Router();

// GET /api/dashboard/summary
router.get("/summary", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ user: userId });

    const total = applications.length;

    const byStatus = {
      Applied: 0,
      "Online Test": 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      "On Hold": 0,
    };

    applications.forEach((a) => {
      if (byStatus[a.status] !== undefined) {
        byStatus[a.status]++;
      }
    });

    const upcoming = applications
      .filter(
        (a) =>
          a.nextFollowUpDate &&
          new Date(a.nextFollowUpDate) >= new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.nextFollowUpDate) - new Date(b.nextFollowUpDate)
      )
      .slice(0, 5);

    const recent = applications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      total,
      byStatus,
      upcoming,
      recent,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
