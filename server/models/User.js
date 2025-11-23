import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🔹 Profile fields
    headline: { type: String, default: "" },
    education: { type: String, default: "" },
    graduationYear: { type: String, default: "" },
    location: { type: String, default: "" },
    skills: [{ type: String }],

    // 🔹 Links
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },

    // 🔹 Settings
    emailNotifications: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
