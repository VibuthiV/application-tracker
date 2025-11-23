import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/landing.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      navigate("/signup");
    }
  };

  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="hero-content">
          <h1>
            Track every application.
            <span className="accent"> Own your job search.</span>
          </h1>
          <p className="hero-subtitle">
            JobTrackr keeps all your job applications in one clean, organized
            place — deadlines, statuses, interviews, and outcomes. Stay focused,
            stay consistent, and never lose track again.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={handleGetStarted}>
              Get Started
            </button>
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              I already have an account
            </button>
          </div>

          <div className="hero-highlights">
            <div className="highlight-pill">📊 Status at a glance</div>
            <div className="highlight-pill">🗂 All applications in one place</div>
            <div className="highlight-pill">⏰ Never miss a follow-up</div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="mock-dashboard">
            <h3>Your Job Search Snapshot</h3>
            <div className="mock-stats-row">
              <div className="mock-stat-card">
                <span className="mock-stat-label">Total Applications</span>
                <span className="mock-stat-value">24</span>
              </div>
              <div className="mock-stat-card">
                <span className="mock-stat-label">In Progress</span>
                <span className="mock-stat-value">8</span>
              </div>
              <div className="mock-stat-card">
                <span className="mock-stat-label">Offers</span>
                <span className="mock-stat-value success">2</span>
              </div>
            </div>
            <div className="mock-list">
              <div className="mock-list-row header">
                <span>Company</span>
                <span>Role</span>
                <span>Status</span>
              </div>
              <div className="mock-list-row">
                <span>Grootan Technologies</span>
                <span>Full Stack Developer</span>
                <span className="badge badge-progress">Online Test</span>
              </div>
              <div className="mock-list-row">
                <span>ABC Corp</span>
                <span>Frontend Engineer</span>
                <span className="badge badge-applied">Applied</span>
              </div>
              <div className="mock-list-row">
                <span>StartupX</span>
                <span>Backend Developer</span>
                <span className="badge badge-interview">Interview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing features section */}
      <section className="landing-features">
        <h2>Why use JobTrackr?</h2>
        <p className="features-intro">
          Treat your job hunt like a real project. Plan, track, and review every
          step so you can improve with each application.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Centralized Tracking</h3>
            <p>
              Store company name, role, links, dates, and notes for every job
              you apply to — all in one place.
            </p>
          </div>
          <div className="feature-card">
            <h3>Status Timeline</h3>
            <p>
              Move applications from Applied to Interview to Offer and see your
              pipeline clearly at any moment.
            </p>
          </div>
          <div className="feature-card">
            <h3>Motivating Overview</h3>
            <p>
              A quick glance at your home page shows progress, not chaos. It
              keeps you consistent when job searching feels heavy.
            </p>
          </div>
        </div>
        <button className="btn-primary secondary-cta" onClick={handleGetStarted}>
          Start tracking my job search
        </button>
      </section>

      {/* NEW: How it works section */}
      <section className="landing-how">
        <div className="how-header">
          <h2>How JobTrackr fits into your job hunt</h2>
          <p>
            Use it every time you apply, follow up, or hear back. JobTrackr
            becomes your single source of truth for everything related to your
            applications.
          </p>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <span className="how-step">Step 1</span>
            <h3>Add your applications</h3>
            <p>
              For each job, quickly log the company, role, job link, date
              applied, and a short note about the position or referral.
            </p>
          </div>
          <div className="how-card">
            <span className="how-step">Step 2</span>
            <h3>Update the status as you progress</h3>
            <p>
              Move items from Applied to Online Test, Interview, Offer, or
              Rejected so you always know where things stand.
            </p>
          </div>
          <div className="how-card">
            <span className="how-step">Step 3</span>
            <h3>Review and improve</h3>
            <p>
              Look back at your history, see what&apos;s working, and plan your
              next week of applications with intention instead of guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* NEW: Who is it for section */}
      <section className="landing-audience">
        <div className="audience-card">
          <h3>Built for students & early professionals</h3>
          <p>
            Whether you&apos;re applying for internships, your first full-time
            role, or switching careers, JobTrackr gives structure to a messy,
            stressful process.
          </p>
          <p>
            Start now and build a clear record of every opportunity you&apos;ve
            chased — and the ones that worked.
          </p>
          <button className="btn-primary" onClick={handleGetStarted}>
            Create my free workspace
          </button>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
