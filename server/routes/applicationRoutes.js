import express from "express";
import auth from "../middleware/authMiddleware.js";
import Application from "../models/Application.js";
import {
  getApplications,
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

// All routes here are protected
router.use(auth);

router.route("/")
  .get(getApplications)
  .post(createApplication);

router.route("/:id")
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

// 🌟 Add a timeline entry to an application
router.post("/:id/timeline", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, type, note } = req.body;

    if (!date || !type) {
      return res.status(400).json({ message: "Date and type are required" });
    }

    const app = await Application.findOne({ _id: id, user: req.user.id });
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const entry = {
      date,
      type,
      note: note || "",
    };

    app.timeline.push(entry);
    await app.save();

    // return updated app
    res.json(app);
  } catch (err) {
    console.error("Add timeline error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// 🌟 Delete a timeline entry
router.delete("/:id/timeline/:eventId", auth, async (req, res) => {
  try {
    const { id, eventId } = req.params;

    const app = await Application.findOne({ _id: id, user: req.user.id });
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const index = app.timeline.findIndex(
      (entry) => entry._id.toString() === eventId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Timeline entry not found" });
    }

    app.timeline.splice(index, 1);
    await app.save();

    // return updated app
    res.json(app);
  } catch (err) {
    console.error("Delete timeline error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
