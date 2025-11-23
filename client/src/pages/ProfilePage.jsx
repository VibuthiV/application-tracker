import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getProfile, updateProfile } from "../services/userService";
import "../styles/profile.css";

const ProfilePage = () => {
  const { user, setUser } = useAuth?.() || { user: null, setUser: () => {} }; // in case context doesn't expose setUser yet
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    headline: "",
    education: "",
    graduationYear: "",
    location: "",
    skills: "",
    linkedin: "",
    github: "",
    portfolio: "",
    emailNotifications: true,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await getProfile();

        setForm({
          name: profile.name || "",
          email: profile.email || "",
          headline: profile.headline || "",
          education: profile.education || "",
          graduationYear: profile.graduationYear || "",
          location: profile.location || "",
          skills: (profile.skills || []).join(", "),
          linkedin: profile.linkedin || "",
          github: profile.github || "",
          portfolio: profile.portfolio || "",
          emailNotifications:
            profile.emailNotifications === undefined
              ? true
              : profile.emailNotifications,
        });
        setError(""); // clear old error if any
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.message ||
          "Failed to load profile. Please try again.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const updated = await updateProfile(payload);

      // If AuthContext exposes setUser, update it here (optional)
      if (setUser) {
        setUser((prev) => ({ ...(prev || {}), ...updated }));
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="centered-page">
        <div className="loader" />
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <header className="profile-header">
        <div>
          <h1>Your profile</h1>
          <p>
            Keep your basic details, skills and links up to date. This doesn&apos;t
            affect your login, but makes your JobTrackr space feel personal.
          </p>
        </div>
      </header>

      <section className="profile-layout">
        {/* Left summary card */}
        <aside className="profile-summary-card">
          <div className="profile-avatar">
            <span>
              {form.name
                ? form.name.charAt(0).toUpperCase()
                : (form.email || "?").charAt(0).toUpperCase()}
            </span>
          </div>
          <h2>{form.name || "Your name"}</h2>
          <p className="profile-email">{form.email}</p>
          {form.headline && <p className="profile-headline">{form.headline}</p>}

          <div className="profile-summary-detail">
            {form.education && <p>{form.education}</p>}
            {form.graduationYear && <p>Batch: {form.graduationYear}</p>}
            {form.location && <p>{form.location}</p>}
          </div>

          <div className="profile-links">
            {form.linkedin && (
              <a href={form.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            {form.github && (
              <a href={form.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {form.portfolio && (
              <a href={form.portfolio} target="_blank" rel="noreferrer">
                Portfolio
              </a>
            )}
          </div>

          <div className="profile-settings-mini">
            <span className="settings-label">Email reminders:</span>
            <span className={form.emailNotifications ? "settings-pill on" : "settings-pill off"}>
              {form.emailNotifications ? "On" : "Off"}
            </span>
          </div>
        </aside>

        {/* Right edit form */}
        <section className="profile-form-card">
          <form onSubmit={handleSubmit} className="profile-form">
            {error && <div className="profile-error">{error}</div>}
            {success && <div className="profile-success">{success}</div>}

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              <div className="profile-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  disabled
                />
                <span className="field-hint">Email is used for login and notifications.</span>
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="headline">Headline</label>
                <input
                  id="headline"
                  name="headline"
                  type="text"
                  value={form.headline}
                  onChange={handleChange}
                  placeholder="e.g. Final-year CSE student | Interested in Full Stack"
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="education">Education</label>
                <input
                  id="education"
                  name="education"
                  type="text"
                  value={form.education}
                  onChange={handleChange}
                  placeholder="e.g. B.E. CSE, XYZ College"
                />
              </div>
              <div className="profile-field">
                <label htmlFor="graduationYear">Graduation year</label>
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="text"
                  value={form.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2025"
                />
              </div>
              <div className="profile-field">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City / Country"
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="skills">Skills (comma separated)</label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js, DBMS..."
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="profile-field">
                <label htmlFor="github">GitHub</label>
                <input
                  id="github"
                  name="github"
                  type="url"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="profile-field">
                <label htmlFor="portfolio">Portfolio</label>
                <input
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  value={form.portfolio}
                  onChange={handleChange}
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>

            <div className="profile-settings-block">
              <h3>Settings</h3>
              <label className="toggle-row">
                <span>
                  Email notifications
                  <span className="toggle-sub">
                    Use your follow-up dates to send gentle reminder emails.
                  </span>
                </span>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={form.emailNotifications}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="profile-actions">
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
};

export default ProfilePage;
