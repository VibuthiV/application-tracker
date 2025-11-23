import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { fetchDashboardSummary } from "../services/dashboardService.js";
import DashboardCharts from "../components/DashboardCharts.jsx";
import "../styles/home.css";

// helper for follow-up styling
const getFollowupClass = (dateStr) => {
  if (!dateStr) return "followup upcoming";

  const today = new Date();
  const d = new Date(dateStr);

  const todayStr = today.toDateString();
  const dStr = d.toDateString();

  if (d < today && dStr !== todayStr) return "followup overdue";
  if (dStr === todayStr) return "followup today";
  return "followup upcoming";
};

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <main className="home-page centered-page">
        <div className="loader" />
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="home-page">
      <h1 className="home-title">Welcome, {user?.name || "there"} 👋</h1>
      <p className="home-subtitle">Here&apos;s your job search snapshot.</p>

      {/* Stats cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <p className="stat-number">{summary.total}</p>
        </div>
        <div className="stat-card">
          <h3>Applied</h3>
          <p className="stat-number">{summary.byStatus.Applied}</p>
        </div>
        <div className="stat-card">
          <h3>Interview</h3>
          <p className="stat-number">{summary.byStatus.Interview}</p>
        </div>
        <div className="stat-card">
          <h3>Offer</h3>
          <p className="stat-number">{summary.byStatus.Offer}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <p className="stat-number">{summary.byStatus.Rejected}</p>
        </div>
      </section>

      {/* Recent applications */}
      <section className="home-section">
        <div className="section-header">
          <h2>Recent applications</h2>
          <button
            className="btn-ghost"
            onClick={() => navigate("/applications")}
          >
            View all
          </button>
        </div>

        {summary.recent.length === 0 ? (
          <p className="muted">No applications yet.</p>
        ) : (
          <table className="home-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {summary.recent.map((app) => (
                <tr
                  key={app._id}
                  className="clickable-row"
                  onClick={() => navigate(`/applications?edit=${app._id}`)}
                >
                  <td>{app.company}</td>
                  <td>{app.position}</td>
                  <td>{app.status}</td>
                  <td>{app.dateApplied?.slice(0, 10) || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Upcoming follow-ups */}
      <section className="home-section">
        <div className="section-header">
          <h2>Upcoming follow-ups</h2>
        </div>

        {summary.upcoming.length === 0 ? (
          <p className="muted">No upcoming follow-ups.</p>
        ) : (
          <ul className="followup-list">
            {summary.upcoming.map((app) => (
              <li
                key={app._id}
                className={getFollowupClass(app.nextFollowUpDate)}
                onClick={() => navigate(`/applications?edit=${app._id}`)}
              >
                <span>
                  <strong>{app.company}</strong> – {app.position}
                </span>
                <span>{app.nextFollowUpDate?.slice(0, 10)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Analytics chart */}
      <section className="home-charts">
        <DashboardCharts byStatus={summary.byStatus} />
      </section>
    </main>
  );
};

export default HomePage;
