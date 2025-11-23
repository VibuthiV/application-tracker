import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left" onClick={onBrandClick}>
          <span className="brand-logo">💼</span>
          <span className="brand-name">JobTrackr</span>
        </div>

        <nav className="navbar-links">
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
              <div className="nav-user">
                <span className="nav-user-name">
                  {user?.name ? `Hi, ${user.name}` : "Account"}
                </span>
                <button className="btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
