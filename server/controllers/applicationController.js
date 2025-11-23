import Application from "../models/Application.js";

// GET /api/applications
// Query params: status, search
export const getApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = { user: req.user.id };

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ company: regex }, { position: regex }];
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/applications
export const createApplication = async (req, res) => {
  try {
    const {
      company,
      position,
      location,
      status,
      jobLink,
      source,
      dateApplied,
      nextFollowUpDate,
      priority,
      tags,
      notes,
    } = req.body;

    if (!company || !position) {
      return res
        .status(400)
        .json({ message: "Company and position are required" });
    }

    const application = await Application.create({
      user: req.user.id,
      company,
      position,
      location,
      status,
      jobLink,
      source,
      dateApplied,
      nextFollowUpDate,
      priority,
      tags,
      notes,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Create application error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/applications/:id
export const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(app);
  } catch (error) {
    console.error("Get application by id error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/applications/:id
export const updateApplication = async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const updates = req.body;
    Object.assign(app, updates);

    const updated = await app.save();
    res.json(updated);
  } catch (error) {
    console.error("Update application error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    await app.deleteOne();
    res.json({ message: "Application deleted" });
  } catch (error) {
    console.error("Delete application error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
