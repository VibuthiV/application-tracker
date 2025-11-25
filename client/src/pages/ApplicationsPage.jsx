import { useEffect, useState, useMemo } from "react";
import "../styles/applications.css";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/applicationService";
import { useAuth } from "../context/AuthContext.jsx";

const STATUSES = [
  "All",
  "Applied",
  "Online Test",
  "Interview",
  "Offer",
  "Rejected",
  "On Hold",
];

const PRIORITIES = ["Low", "Medium", "High"];

// Default interview prep checklist labels
const PREP_DEFAULT_LABELS = [
  "Read the job description carefully",
  "Research the company (website, LinkedIn)",
  "Revise core subjects / tech stack",
  "Prepare self-introduction & strengths",
  "Prepare questions to ask interviewer",
];

const buildDefaultPrepChecklist = () =>
  PREP_DEFAULT_LABELS.map((label) => ({ label, done: false }));

const ApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const [selectedApp, setSelectedApp] = useState(null);

  // local form state for add/edit
  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    status: "Applied",
    jobLink: "",
    source: "",
    dateApplied: "",
    nextFollowUpDate: "",
    priority: "Medium",
    tags: "",
    notes: "",
  });

  // local state for interview prep (per selected app)
  const [prepNotes, setPrepNotes] = useState("");
  const [prepChecklist, setPrepChecklist] = useState(buildDefaultPrepChecklist());
  const [prepSaving, setPrepSaving] = useState(false);
  const [prepMessage, setPrepMessage] = useState("");

  const resetForm = () => {
    setForm({
      company: "",
      position: "",
      location: "",
      status: "Applied",
      jobLink: "",
      source: "",
      dateApplied: "",
      nextFollowUpDate: "",
      priority: "Medium",
      tags: "",
      notes: "",
    });
    setEditingApp(null);
  };

  const loadApplications = async (opts = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchApplications({
        status: statusFilter,
        search: search || undefined,
        ...opts,
      });
      setApplications(data);

      // if we already had a selectedApp, refresh it from new data
      if (selectedApp) {
        const refreshed = data.find((a) => a._id === selectedApp._id);
        if (refreshed) {
          hydrateSelectedApp(refreshed);
        } else {
          setSelectedApp(null);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadApplications();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setForm({
      company: app.company || "",
      position: app.position || "",
      location: app.location || "",
      status: app.status || "Applied",
      jobLink: app.jobLink || "",
      source: app.source || "",
      dateApplied: app.dateApplied ? app.dateApplied.slice(0, 10) : "",
      nextFollowUpDate: app.nextFollowUpDate
        ? app.nextFollowUpDate.slice(0, 10)
        : "",
      priority: app.priority || "Medium",
      tags: (app.tags || []).join(", "),
      notes: app.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      if (selectedApp?._id === id) {
        setSelectedApp(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      dateApplied: form.dateApplied || undefined,
      nextFollowUpDate: form.nextFollowUpDate || undefined,
    };

    try {
      if (editingApp) {
        const updated = await updateApplication(editingApp._id, payload);
        setApplications((prev) =>
          prev.map((a) => (a._id === updated._id ? updated : a))
        );
        // refresh selectedApp if same
        if (selectedApp?._id === updated._id) {
          hydrateSelectedApp(updated);
        }
      } else {
        const created = await createApplication(payload);
        setApplications((prev) => [created, ...prev]);
      }

      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to save application. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------- DETAILS + INTERVIEW PREP ----------

  // When user clicks a row, we show details + prep for that app
  const handleRowSelect = (app) => {
    hydrateSelectedApp(app);
  };

  const hydrateSelectedApp = (app) => {
    // Ensure we have sane defaults for prep
    const normalizedChecklist =
      app.prepChecklist && app.prepChecklist.length > 0
        ? app.prepChecklist
        : buildDefaultPrepChecklist();

    const normalizedNotes = app.prepNotes || "";

    setSelectedApp({
      ...app,
      prepChecklist: normalizedChecklist,
      prepNotes: normalizedNotes,
    });
    setPrepChecklist(normalizedChecklist);
    setPrepNotes(normalizedNotes);
    setPrepMessage("");
  };

  const handlePrepToggle = (index) => {
    setPrepChecklist((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    );
  };

  const handlePrepSave = async () => {
    if (!selectedApp) return;
    setPrepSaving(true);
    setPrepMessage("");

    try {
      const updated = await updateApplication(selectedApp._id, {
        prepNotes,
        prepChecklist,
      });

      // Update local list
      setApplications((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
      hydrateSelectedApp(updated);
      setPrepMessage("Interview prep saved.");
    } catch (err) {
      console.error(err);
      setPrepMessage("Failed to save prep. Please try again.");
    } finally {
      setPrepSaving(false);
      setTimeout(() => setPrepMessage(""), 2500);
    }
  };

  const selectedTags = useMemo(
    () =>
      selectedApp?.tags && selectedApp.tags.length
        ? selectedApp.tags.join(", ")
        : "",
    [selectedApp]
  );

  return (
    <main className="applications-page">
      <header className="applications-header">
        <div>
          <h1>Applications</h1>
          <p>
            Track every job you&apos;ve applied to and see where each one
            stands in your job search journey.
          </p>
          {user && (
            <p className="applications-subtext">
              Logged in as <span>{user.email}</span>
            </p>
          )}
          <h3>Select any application to open Activity Timeline</h3>
        </div>
        <div className="applications-header-actions">
          <form className="applications-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search by company or role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-ghost">
              Search
            </button>
          </form>

          <div className="applications-filter-row">
            <select
              className="apps-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button className="btn-primary" onClick={handleAddNew}>
              + Add application
            </button>
          </div>
        </div>
      </header>

      {showForm && (
        <section className="applications-form-card">
          <div className="form-card-header">
            <h2>{editingApp ? "Edit application" : "Add new application"}</h2>
            <button
              type="button"
              className="btn-outline small"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Close
            </button>
          </div>

          {error && <div className="apps-error">{error}</div>}

          <form className="applications-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="company">Company *</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="position">Position *</label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={form.position}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Chennai / Remote"
                />
              </div>
              <div className="form-field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {STATUSES.filter((s) => s !== "All").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="dateApplied">Date applied</label>
                <input
                  id="dateApplied"
                  name="dateApplied"
                  type="date"
                  value={form.dateApplied}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="nextFollowUpDate">Next follow-up</label>
                <input
                  id="nextFollowUpDate"
                  name="nextFollowUpDate"
                  type="date"
                  value={form.nextFollowUpDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="source">Source</label>
                <input
                  id="source"
                  name="source"
                  type="text"
                  value={form.source}
                  onChange={handleChange}
                  placeholder="LinkedIn, campus, referral..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="jobLink">Job link</label>
                <input
                  id="jobLink"
                  name="jobLink"
                  type="url"
                  value={form.jobLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <div className="form-field">
                <label htmlFor="tags">Tags</label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="frontend, remote, internship"
                />
                <span className="field-hint">
                  Separate tags with commas
                </span>
              </div>
            </div>

            <div className="form-row single">
              <div className="form-field">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Interview rounds, contact person, what to prepare..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving
                  ? editingApp
                    ? "Saving changes..."
                    : "Adding..."
                  : editingApp
                  ? "Save changes"
                  : "Add application"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Main layout: table + details panel */}
      <section className="applications-main-layout">
        <section className="applications-list-section">
          {loading ? (
            <div className="centered-page small">
              <div className="loader" />
              <p>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <h3>No applications yet</h3>
              <p>
                Start by adding your first job application. Every time you apply,
                log it here.
              </p>
              <button className="btn-primary" onClick={handleAddNew}>
                + Add your first application
              </button>
            </div>
          ) : (
            <div className="applications-table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Applied</th>
                    <th>Next follow-up</th>
                    <th>Source</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      onClick={() => handleRowSelect(app)}
                      className={
                        selectedApp?._id === app._id ? "apps-row selected" : ""
                      }
                    >
                      <td>{app.company}</td>
                      <td>{app.position}</td>
                      <td>
                        <span
                          className={`status-pill status-${app.status
                            .replace(" ", "-")
                            .toLowerCase()}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`priority-pill priority-${app.priority.toLowerCase()}`}
                        >
                          {app.priority}
                        </span>
                      </td>
                      <td>
                        {app.dateApplied ? app.dateApplied.slice(0, 10) : "-"}
                      </td>
                      <td>
                        {app.nextFollowUpDate
                          ? app.nextFollowUpDate.slice(0, 10)
                          : "-"}
                      </td>
                      <td>{app.source || "-"}</td>
                      <td className="apps-row-actions">
                        <button
                          type="button"
                          className="row-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(app);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="row-btn danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(app._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Details + Timeline + Interview prep */}
        {selectedApp && (
          <section className="application-details-panel">
            <div className="details-main">
              <div className="details-header">
                <div>
                  <h2>{selectedApp.company}</h2>
                  <p className="details-subtitle">
                    {selectedApp.position || "—"}
                  </p>
                </div>
                <div>
                  <span
                    className={`status-pill status-${selectedApp.status
                      .replace(" ", "-")
                      .toLowerCase()}`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
              </div>

              <div className="details-grid">
                <div className="details-item">
                  <span className="details-label">Priority</span>
                  <span className="details-value">
                    {selectedApp.priority || "Medium"}
                  </span>
                </div>
                <div className="details-item">
                  <span className="details-label">Applied</span>
                  <span className="details-value">
                    {selectedApp.dateApplied
                      ? selectedApp.dateApplied.slice(0, 10)
                      : "-"}
                  </span>
                </div>
                <div className="details-item">
                  <span className="details-label">Next follow-up</span>
                  <span className="details-value">
                    {selectedApp.nextFollowUpDate
                      ? selectedApp.nextFollowUpDate.slice(0, 10)
                      : "-"}
                  </span>
                </div>
                <div className="details-item">
                  <span className="details-label">Source</span>
                  <span className="details-value">
                    {selectedApp.source || "-"}
                  </span>
                </div>
                <div className="details-item">
                  <span className="details-label">Location</span>
                  <span className="details-value">
                    {selectedApp.location || "-"}
                  </span>
                </div>
                <div className="details-item">
                  <span className="details-label">Tags</span>
                  <span className="details-value">
                    {selectedTags || "—"}
                  </span>
                </div>
              </div>

              {selectedApp.jobLink && (
                <div className="details-notes">
                  <span className="details-label">Job link</span>
                  <p className="details-notes-text">
                    <a
                      href={selectedApp.jobLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open job posting
                    </a>
                  </p>
                </div>
              )}

              {selectedApp.notes && (
                <div className="details-notes">
                  <span className="details-label">Notes</span>
                  <p className="details-notes-text">{selectedApp.notes}</p>
                </div>
              )}

              {/* 🔥 Interview prep section */}
              <div className="details-prep">
                <div className="details-prep-header">
                  <h3>Interview prep</h3>
                  {prepMessage && (
                    <span className="prep-message">{prepMessage}</span>
                  )}
                </div>
                <p className="details-prep-subtitle">
                  Use this checklist to get ready for interviews for this
                  specific application.
                </p>

                <ul className="prep-checklist">
                  {prepChecklist.map((item, index) => (
                    <li key={index} className="prep-checklist-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={!!item.done}
                          onChange={() => handlePrepToggle(index)}
                        />
                        <span>{item.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                <div className="details-notes">
                  <span className="details-label">Prep notes</span>
                  <textarea
                    className="prep-notes-input"
                    rows={3}
                    value={prepNotes}
                    onChange={(e) => setPrepNotes(e.target.value)}
                    placeholder="Key topics to revise, questions they asked in previous round, things you want to highlight..."
                  />
                </div>

                <div className="prep-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handlePrepSave}
                    disabled={prepSaving}
                  >
                    {prepSaving ? "Saving..." : "Save prep"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: timeline area (you already have styles for this) */}
            <div className="details-timeline">
              <h3>Activity timeline</h3>
              <p className="details-empty">
                You can continue to use your existing timeline UI here as before
                (interview rounds, status changes, etc.).
              </p>
              {/* If you already implemented timeline items + form,
                  keep that code here, just below the heading. */}
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default ApplicationsPage;
