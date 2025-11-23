// server/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
// 🔹 use default import, not { protect }
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper to get logged-in user id safely
const getUserIdFromRequest = (req) => {
  if (!req.user) return null;
  return req.user._id || req.user.id;
};

// GET /api/user/me  – get current user's profile
router.get("/me", auth, async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

// PUT /api/user/me  – update profile + settings
router.put("/me", auth, async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const {
      name,
      headline,
      education,
      graduationYear,
      location,
      skills,
      linkedin,
      github,
      portfolio,
      emailNotifications,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (headline !== undefined) user.headline = headline;
    if (education !== undefined) user.education = education;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (location !== undefined) user.location = location;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;
    if (portfolio !== undefined) user.portfolio = portfolio;

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills.map((s) => s.trim()).filter(Boolean);
      } else if (typeof skills === "string") {
        user.skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    if (emailNotifications !== undefined) {
      user.emailNotifications = !!emailNotifications;
    }

    const saved = await user.save();
    const plain = saved.toObject();
    delete plain.password;

    res.json(plain);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
