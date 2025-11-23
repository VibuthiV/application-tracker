import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/applications.css";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  addTimelineEntry,
  deleteTimelineEntry,
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

const TIMELINE_TYPES = [
  "Applied",
  "Online Test",
  "Interview",
  "HR Call",
  "Offer",
  "Rejected",
  "Follow-up",
  "Other",
];

const ApplicationsPage = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // 🌟 always-visible details for selected application
  const [selectedApp, setSelectedApp] = useState(null);

  const [timelineForm, setTimelineForm] = useState({
    date: "",
    type: "Interview",
    note: "",
  });

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

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchApplications({
        status: statusFilter,
        search: search || undefined,
      });
      setApplications(data);

      // if nothing selected yet, preselect first one
      if (!selectedApp && data.length > 0) {
        setSelectedApp(data[0]);
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

  // Keep selected application in sync when list changes
  useEffect(() => {
    if (!selectedApp && applications.length > 0) {
      setSelectedApp(applications[0]);
    } else if (selectedApp && applications.length > 0) {
      const updated = applications.find((a) => a._id === selectedApp._id);
      if (updated) {
        setSelectedApp(updated);
      } else if (applications.length > 0) {
        setSelectedApp(applications[0]);
      } else {
        setSelectedApp(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications]);

  // When coming from dashboard with ?edit=<id>, auto-open form
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");

    if (!editId || applications.length === 0) return;

    const app = applications.find((a) => a._id === editId);
    if (app) {
      handleEdit(app);
      setSelectedApp(app);
      setShowForm(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, applications]);

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
      if (selectedApp && selectedApp._id === id) {
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
      } else {
        const created = await createApplication(payload);
        setApplications((prev) => [created, ...prev]);
        setSelectedApp(created);
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

  // Timeline form change
  const handleTimelineChange = (e) => {
    const { name, value } = e.target;
    setTimelineForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTimeline = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    if (!timelineForm.date || !timelineForm.type) return;

    try {
      const payload = {
        date: timelineForm.date,
        type: timelineForm.type,
        note: timelineForm.note || "",
      };
      const updated = await addTimelineEntry(selectedApp._id, payload);

      setApplications((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
      setSelectedApp(updated);
      setTimelineForm({
        date: "",
        type: "Interview",
        note: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add timeline entry. Please try again.");
    }
  };

  const handleDeleteTimeline = async (eventId) => {
    if (!selectedApp) return;
    if (!window.confirm("Delete this timeline entry?")) return;

    try {
      const updated = await deleteTimelineEntry(selectedApp._id, eventId);
      setApplications((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
      setSelectedApp(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to delete timeline entry. Please try again.");
    }
  };

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString() : "-";

  const sortedTimeline =
    selectedApp?.timeline
      ?.slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

  return (
    <main className="applications-page">
      <header className="applications-header">
        <div>
          <h1>Applications</h1>
          <p>
            This is your main workspace. View your job applications, edit them,
            and see detailed activity for each one.
          </p>
          {user && (
            <p className="applications-subtext">
              Logged in as <span>{user.email}</span>
            </p>
          )}
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

      {/* 🌟 Two-column layout: table + details */}
      <section className="applications-main-layout">
        <div className="applications-table-column">
          <h2 className="section-title">Your applications</h2>
          {loading ? (
            <div className="centered-page small">
              <div className="loader" />
              <p>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <h3>No applications yet</h3>
              <p>
                Start by adding your first job application. Every time you
                apply, log it here.
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
                      className={
                        selectedApp && selectedApp._id === app._id
                          ? "selected-row"
                          : ""
                      }
                      onClick={() => setSelectedApp(app)}
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
                          className={`priority-pill priority-${(
                            app.priority || "Medium"
                          ).toLowerCase()}`}
                        >
                          {app.priority || "Medium"}
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
        </div>

        <div className="applications-details-column">
          <h2 className="section-title">Application details & activity</h2>

          {!selectedApp ? (
            <p className="details-empty">
              Select an application from the table to see its details.
            </p>
          ) : (
            <div className="application-details-panel">
              <div className="details-main">
                <div className="details-header">
                  <div>
                    <h2>
                      {selectedApp.company} · {selectedApp.position}
                    </h2>
                    <p className="details-subtitle">
                      {selectedApp.location || "Location not specified"}
                    </p>
                  </div>
                </div>

                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Status</span>
                    <span className="details-value">
                      {selectedApp.status}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Priority</span>
                    <span className="details-value">
                      {selectedApp.priority || "Medium"}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Applied on</span>
                    <span className="details-value">
                      {formatDate(selectedApp.dateApplied)}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Next follow-up</span>
                    <span className="details-value">
                      {formatDate(selectedApp.nextFollowUpDate)}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Source</span>
                    <span className="details-value">
                      {selectedApp.source || "-"}
                    </span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Tags</span>
                    <span className="details-value">
                      {selectedApp.tags?.length
                        ? selectedApp.tags.join(", ")
                        : "-"}
                    </span>
                  </div>
                </div>

                <div className="details-notes">
                  <span className="details-label">Notes</span>
                  <p className="details-notes-text">
                    {selectedApp.notes?.trim()
                      ? selectedApp.notes
                      : "No notes added yet."}
                  </p>
                </div>
              </div>

              <div className="details-timeline">
                <h3>Activity timeline</h3>

                {sortedTimeline.length === 0 ? (
                  <p className="details-empty">
                    No activity logged yet. Add your first event below.
                  </p>
                ) : (
                  <ul className="timeline-list">
                    {sortedTimeline.map((event) => (
                      <li key={event._id} className="timeline-item">
                        <div className="timeline-main">
                          <span className="timeline-date">
                            {formatDate(event.date)}
                          </span>
                          <span className="timeline-type">{event.type}</span>
                          {event.note && (
                            <p className="timeline-note">{event.note}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          className="timeline-delete"
                          onClick={() => handleDeleteTimeline(event._id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <form className="timeline-form" onSubmit={handleAddTimeline}>
                  <h4>Add activity</h4>
                  <div className="timeline-form-row">
                    <div className="form-field">
                      <label htmlFor="timeline-date">Date</label>
                      <input
                        id="timeline-date"
                        name="date"
                        type="date"
                        value={timelineForm.date}
                        onChange={handleTimelineChange}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="timeline-type">Type</label>
                      <select
                        id="timeline-type"
                        name="type"
                        value={timelineForm.type}
                        onChange={handleTimelineChange}
                        required
                      >
                        {TIMELINE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="timeline-note">Notes</label>
                    <textarea
                      id="timeline-note"
                      name="note"
                      rows={2}
                      value={timelineForm.note}
                      onChange={handleTimelineChange}
                      placeholder="e.g. HR call, online test link received, technical round details..."
                    />
                  </div>

                  <div className="timeline-actions">
                    <button className="btn-primary" type="submit">
                      Add activity
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ApplicationsPage;
