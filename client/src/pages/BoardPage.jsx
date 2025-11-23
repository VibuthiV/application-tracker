import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/board.css";
import {
  fetchApplications,
  updateApplication,
} from "../services/applicationService";
import { useAuth } from "../context/AuthContext.jsx";

const STATUS_COLUMNS = [
  "Applied",
  "Online Test",
  "Interview",
  "Offer",
  "Rejected",
  "On Hold",
];

const BoardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchApplications({ status: "All" });
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (app, newStatus) => {
    if (app.status === newStatus) return;

    try {
      setUpdatingId(app._id);
      const updated = await updateApplication(app._id, {
        ...app,
        status: newStatus,
      });

      setApplications((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const groupByStatus = (status) =>
    applications.filter((app) => app.status === status);

  if (loading) {
    return (
      <main className="board-page centered-page">
        <div className="loader" />
        <p>Loading board...</p>
      </main>
    );
  }

  return (
    <main className="board-page">
      <header className="board-header">
        <div>
          <h1>Board view</h1>
          <p>
            Visualize your job search pipeline by status. Drag and drop will
            come later — for now, update status directly from each card.
          </p>
          {user && (
            <p className="board-subtext">
              Logged in as <span>{user.email}</span>
            </p>
          )}
        </div>
        <button
          className="btn-ghost"
          onClick={() => navigate("/applications")}
        >
          Go to applications table
        </button>
      </header>

      {error && <div className="board-error">{error}</div>}

      <section className="board-columns">
        {STATUS_COLUMNS.map((status) => {
          const columnApps = groupByStatus(status);
          return (
            <div key={status} className="board-column">
              <div className="board-column-header">
                <h2>{status}</h2>
                <span className="column-count">{columnApps.length}</span>
              </div>

              {columnApps.length === 0 ? (
                <p className="column-empty">No applications</p>
              ) : (
                <div className="board-column-body">
                  {columnApps.map((app) => (
                    <div
                      key={app._id}
                      className="board-card"
                      onClick={() =>
                        navigate(`/applications?edit=${app._id}`)
                      }
                    >
                      <div className="board-card-main">
                        <h3>{app.company}</h3>
                        <p className="board-role">{app.position}</p>
                        <p className="board-meta">
                          Applied:{" "}
                          {app.dateApplied
                            ? app.dateApplied.slice(0, 10)
                            : "-"}
                        </p>
                      </div>

                      <div className="board-card-footer">
                        <span
                          className={`priority-pill priority-${(
                            app.priority || "Medium"
                          ).toLowerCase()}`}
                        >
                          {app.priority || "Medium"}
                        </span>

                        <select
                          className="board-status-select"
                          value={app.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(app, e.target.value)
                          }
                          disabled={updatingId === app._id}
                        >
                          {STATUS_COLUMNS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default BoardPage;
