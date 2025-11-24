import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { fetchDashboardSummary } from "../services/dashboardService.js";
import { fetchApplications } from "../services/applicationService";
import DashboardCharts from "../components/DashboardCharts.jsx";
import "../styles/home.css";

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

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [goalData, setGoalData] = useState({
    weeklyApplied: 0,
    weeklyGoal: 5,
    streakDays: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Dashboard summary (existing)
        const data = await fetchDashboardSummary();
        setSummary(data);

        // All applications to compute goals/streak
        const apps = await fetchApplications({});

        const today = new Date();
        const dayOfWeek = today.getDay(); // 0=Sun
        const startOfWeek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - dayOfWeek
        );

        // count how many applications this week
        const weeklyApplied = apps.filter((app) => {
          if (!app.dateApplied) return false;
          const d = new Date(app.dateApplied);
          return d >= startOfWeek && d <= today;
        }).length;

        // streak - number of consecutive days (backwards) where at least 1 app exists
        const uniqueDays = new Set(
          apps
            .filter((a) => a.dateApplied)
            .map((a) => new Date(a.dateApplied).toDateString())
        );

        let streak = 0;
        let cursor = new Date(today);

        // we count today as well if there is at least 1 application
        while (uniqueDays.has(cursor.toDateString())) {
          streak += 1;
          cursor = new Date(
            cursor.getFullYear(),
            cursor.getMonth(),
            cursor.getDate() - 1
          );
        }

        setGoalData({
          weeklyApplied,
          weeklyGoal: 5,
          streakDays: streak,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading || !summary) {
    return (
      <main className="home-page centered-page">
        <div className="loader" />
        <p>Loading dashboard...</p>
      </main>
    );
  }

  const { weeklyApplied, weeklyGoal, streakDays } = goalData;
  const progress = Math.min(
    100,
    Math.round((weeklyApplied / weeklyGoal) * 100)
  );

  return (
    <main className="home-page">
      <h1 className="home-title">Welcome, {user?.name || "there"} 👋</h1>
      <p className="home-subtitle">Here&apos;s your job search snapshot.</p>

      {/* Goals & streak card */}
      <section className="home-goals-row">
        <div className="home-goal-card">
          <div className="goal-header">
            <h2>This week&apos;s goal</h2>
            <span className="goal-pill">
              {weeklyApplied}/{weeklyGoal} applications
            </span>
          </div>
          <p className="goal-text">
            Aim to apply to at least <strong>{weeklyGoal}</strong> roles this
            week. So far you&apos;ve logged{" "}
            <strong>{weeklyApplied}</strong>.
          </p>

          <div className="goal-progress-bar">
            <div
              className="goal-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="goal-progress-caption">
            {progress >= 100
              ? "Nice! You’ve hit this week’s target."
              : `You’re at ${progress}% of your weekly goal.`}
          </p>
        </div>

        <div className="home-streak-card">
          <h2>Consistency streak</h2>
          <p className="streak-number">
            {streakDays}
            <span>day{streakDays === 1 ? "" : "s"}</span>
          </p>
          <p className="streak-text">
            Number of days in a row where you&apos;ve added at least one
            application. Even 1 small update per day keeps your search active.
          </p>
        </div>
      </section>

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
