import { useState, useEffect } from "react";
import { fetchApplications } from "../services/applicationService";
import "../styles/calendar.css";

const getFollowupState = (dateStr) => {
  if (!dateStr) return "upcoming";
  const today = new Date();
  const d = new Date(dateStr);

  const todayStr = today.toDateString();
  const dStr = d.toDateString();

  if (d < today && dStr !== todayStr) return "overdue";
  if (dStr === todayStr) return "today";
  return "upcoming";
};

const CalendarPage = () => {
  const [appsByDate, setAppsByDate] = useState({});
  const [current, setCurrent] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    overdue: 0,
    today: 0,
    upcoming: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const apps = await fetchApplications({}); // uses your existing service

        const map = {};
        const stats = { total: 0, overdue: 0, today: 0, upcoming: 0 };

        apps.forEach((app) => {
          if (!app.nextFollowUpDate) return;

          const dateStr = app.nextFollowUpDate.slice(0, 10);
          if (!map[dateStr]) map[dateStr] = [];
          map[dateStr].push(app);

          const state = getFollowupState(dateStr);
          stats.total += 1;
          if (state === "overdue") stats.overdue += 1;
          if (state === "today") stats.today += 1;
          if (state === "upcoming") stats.upcoming += 1;
        });

        setAppsByDate(map);
        setSummary(stats);
      } catch (err) {
        console.error("Calendar load error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load applications for calendar."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = new Date().toISOString().slice(0, 10);

  const changeMonth = (offset) => {
    setCurrent(new Date(year, month + offset, 1));
    setSelectedDate(null);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const selectedApps =
    selectedDate && appsByDate[selectedDate] ? appsByDate[selectedDate] : [];

  if (loading) {
    return (
      <main className="calendar-page centered-page">
        <div className="loader" />
        <p>Loading calendar...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="calendar-page centered-page">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="calendar-page">
      <header className="calendar-header">
        <div>
          <h1>Calendar</h1>
          <p className="calendar-subtitle">
            This calendar uses the <strong>“Next follow-up”</strong> date from
            your applications. Each highlighted day tells you which company
            you&apos;re supposed to follow up with.
          </p>
        </div>
        <div className="calendar-nav">
          <button className="btn-outline" onClick={() => changeMonth(-1)}>
            ←
          </button>
          <span className="calendar-month">
            {current.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button className="btn-outline" onClick={() => changeMonth(1)}>
            →
          </button>
        </div>
      </header>

      {/* Top summary cards */}
      <section className="calendar-summary-row">
        <div className="calendar-summary-card">
          <span className="summary-label">Total follow-ups</span>
          <span className="summary-value">{summary.total}</span>
        </div>
        <div className="calendar-summary-card summary-overdue">
          <span className="summary-label">Overdue</span>
          <span className="summary-value">{summary.overdue}</span>
        </div>
        <div className="calendar-summary-card summary-today">
          <span className="summary-label">Today</span>
          <span className="summary-value">{summary.today}</span>
        </div>
        <div className="calendar-summary-card summary-upcoming">
          <span className="summary-label">Upcoming</span>
          <span className="summary-value">{summary.upcoming}</span>
        </div>
      </section>

      <section className="calendar-layout">
        {/* Main calendar */}
        <div className="calendar-main">
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="calendar-day-label">
                {d}
              </div>
            ))}

            {cells.map((date, i) => {
              if (!date) {
                return <div key={i} className="calendar-cell empty" />;
              }

              const dateStr = date.toISOString().slice(0, 10);
              const apps = appsByDate[dateStr] || [];
              const followState = getFollowupState(dateStr);

              let cls = "calendar-cell";
              if (dateStr === todayStr) cls += " today";
              if (apps.length > 0) cls += " has-events";
              if (selectedDate === dateStr) cls += " selected";

              const firstApp = apps[0];
              const remaining = apps.length > 1 ? apps.length - 1 : 0;

              return (
                <button
                  type="button"
                  key={i}
                  className={cls}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <span className="cell-date">{date.getDate()}</span>

                  {apps.length > 0 && (
                    <div className="cell-meta">
                      <span
                        className={`cell-pill cell-pill-${followState}`}
                      >
                        {apps.length} follow-up
                        {apps.length > 1 ? "s" : ""}
                      </span>
                      {firstApp && (
                        <span className="cell-preview">
                          {firstApp.company}
                          {remaining > 0 ? ` + ${remaining} more` : ""}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span className="legend-title">Legend</span>
            <span className="legend-item">
              <span className="dot overdue" /> Overdue follow-ups
            </span>
            <span className="legend-item">
              <span className="dot today" /> Due today
            </span>
            <span className="legend-item">
              <span className="dot upcoming" /> Upcoming (future)
            </span>
          </div>
        </div>

        {/* Side panel */}
        <aside className="calendar-side-panel">
          <h2>Day details</h2>
          <p className="calendar-side-subtitle">
            {selectedDate
              ? `These applications have a follow-up on ${selectedDate}:`
              : "Click a highlighted day to see which company you need to follow up with."}
          </p>

          {selectedDate && selectedApps.length === 0 && (
            <p className="calendar-empty">No follow-ups on this day.</p>
          )}

          {selectedApps.length > 0 && (
            <ul className="calendar-app-list">
              {selectedApps.map((app) => {
                const state = getFollowupState(
                  app.nextFollowUpDate?.slice(0, 10)
                );
                return (
                  <li key={app._id} className="calendar-app-item">
                    <div className="calendar-app-main">
                      <strong>{app.company}</strong>
                      <span className="calendar-app-position">
                        {app.position}
                      </span>
                    </div>
                    <div className="calendar-app-meta">
                      <span className="calendar-app-status">
                        Status: {app.status || "Applied"}
                      </span>
                      <span className={`calendar-app-chip ${state}`}>
                        {state === "overdue"
                          ? "Overdue"
                          : state === "today"
                          ? "Today"
                          : "Upcoming"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </section>
    </main>
  );
};

export default CalendarPage;
