import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Application from "../models/Application.js";

const router = express.Router();

/**
 * Local helper – no separate import needed
 */
const buildNotificationsFromApplications = (applications) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const addDays = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const threeDaysLater = addDays(todayStr, 3);

  const today = [];
  const overdue = [];
  const upcoming = [];

  applications.forEach((app) => {
    if (!app.nextFollowUpDate) return;

    const dateStr = new Date(app.nextFollowUpDate)
      .toISOString()
      .slice(0, 10);

    const base = {
      applicationId: app._id,
      company: app.company,
      position: app.position,
      status: app.status,
      nextFollowUpDate: dateStr,
    };

    if (dateStr < todayStr) {
      overdue.push({
        ...base,
        type: "followup-overdue",
        message: `Follow up with ${app.company} for ${app.position}`,
      });
    } else if (dateStr === todayStr) {
      today.push({
        ...base,
        type: "followup-today",
        message: `Follow up today with ${app.company} (${app.position})`,
      });
    } else if (dateStr > todayStr && dateStr <= threeDaysLater) {
      upcoming.push({
        ...base,
        type: "followup-upcoming",
        message: `Upcoming follow-up with ${app.company} on ${dateStr}`,
      });
    }
  });

  return { today, overdue, upcoming };
};

// GET /api/notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({
      nextFollowUpDate: 1,
    });

    const data = buildNotificationsFromApplications(applications);

    return res.json({
      ...data,
      total:
        data.today.length + data.overdue.length + data.upcoming.length,
    });
  } catch (err) {
    console.error("Notifications error:", err);
    res.status(500).json({ message: "Failed to load notifications" });
  }
});

export default router;
