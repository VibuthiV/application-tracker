import mongoose from "mongoose";

const TimelineEntrySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Applied",
        "Online Test",
        "Interview",
        "HR Call",
        "Offer",
        "Rejected",
        "Follow-up",
        "Other",
      ],
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "Applied",
        "Online Test",
        "Interview",
        "Offer",
        "Rejected",
        "On Hold",
      ],
      default: "Applied",
    },
    jobLink: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    dateApplied: {
      type: Date,
    },
    nextFollowUpDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    prepNotes: {
      type: String,
      default: "",
    },
    prepChecklist: {
      type: [
        {
          label: { type: String, required: true },
          done: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    // 🌟 NEW: timeline events
    timeline: [TimelineEntrySchema],
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);

export default Application;
