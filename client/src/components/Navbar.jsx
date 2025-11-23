import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unread, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const onBrandClick = () => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  const toggleNotifications = () => {
    setIsNotifOpen((prev) => !prev);
    if (!isNotifOpen) {
      markAllRead();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left" onClick={onBrandClick}>
          <span className="brand-logo">💼</span>
          <span className="brand-name">JobTrackr</span>
        </div>

        <nav className="navbar-links">
          {/* Public links (not logged in) */}
          {!isAuthenticated && (
            <>
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === "/" ? "nav-link-active" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/login"
                className={`nav-link ${
                  location.pathname === "/login" ? "nav-link-active" : ""
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`nav-link ${
                  location.pathname === "/signup" ? "nav-link-active" : ""
                }`}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Private links (logged in) */}
          {isAuthenticated && (
            <>
              <Link
                to="/home"
                className={`nav-link ${
                  location.pathname === "/home" ? "nav-link-active" : ""
                }`}
              >
                Home
              </Link>

              <Link
                to="/applications"
                className={`nav-link ${
                  location.pathname === "/applications" ? "nav-link-active" : ""
                }`}
              >
                Applications
              </Link>

              <Link
                to="/board"
                className={`nav-link ${
                  location.pathname === "/board" ? "nav-link-active" : ""
                }`}
              >
                Board
              </Link>

              <Link
                to="/roadmap"
                className={`nav-link ${
                  location.pathname === "/roadmap" ? "nav-link-active" : ""
                }`}
              >
                Roadmap
              </Link>

              {/* Notification bell */}
              <div className="nav-bell-wrapper">
                <button
                  type="button"
                  className="nav-bell"
                  onClick={toggleNotifications}
                >
                  🔔
                  {unread > 0 && (
                    <span className="nav-bell-badge">{unread}</span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="nav-bell-dropdown">
                    <h4>Notifications</h4>

                    {notifications.overdue.length === 0 &&
                    notifications.today.length === 0 &&
                    notifications.upcoming.length === 0 ? (
                      <p className="nav-bell-empty">No reminders right now.</p>
                    ) : (
                      <>
                        {notifications.overdue.length > 0 && (
                          <>
                            <p className="nav-bell-section-title">Overdue</p>
                            {notifications.overdue.map((n) => (
                              <div
                                key={n.applicationId + "-over"}
                                className="nav-bell-item overdue"
                              >
                                <div>
                                  <strong>{n.company}</strong> – {n.position}
                                </div>
                                <span>{n.nextFollowUpDate}</span>
                              </div>
                            ))}
                          </>
                        )}

                        {notifications.today.length > 0 && (
                          <>
                            <p className="nav-bell-section-title">Today</p>
                            {notifications.today.map((n) => (
                              <div
                                key={n.applicationId + "-today"}
                                className="nav-bell-item today"
                              >
                                <div>
                                  <strong>{n.company}</strong> – {n.position}
                                </div>
                                <span>Today</span>
                              </div>
                            ))}
                          </>
                        )}

                        {notifications.upcoming.length > 0 && (
                          <>
                            <p className="nav-bell-section-title">
                              Upcoming (next 3 days)
                            </p>
                            {notifications.upcoming.map((n) => (
                              <div
                                key={n.applicationId + "-up"}
                                className="nav-bell-item upcoming"
                              >
                                <div>
                                  <strong>{n.company}</strong> – {n.position}
                                </div>
                                <span>{n.nextFollowUpDate}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* User / logout */}
              <div className="nav-user">
                <span className="nav-user-name">
                  {user?.name ? `Hi, ${user.name}` : "Account"}
                </span>
                <button className="btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </div>
                <Link
                to="/profile"
                className={`nav-link ${
                    location.pathname === "/profile" ? "nav-link-active" : ""
                }`}
                >
                Profile
                </Link>

            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
