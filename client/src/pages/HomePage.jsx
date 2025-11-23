import { useAuth } from "../context/AuthContext.jsx";
import "../styles/home.css";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <main className="home-page">
      <section className="home-hero">
        <h1>Welcome, {user?.name || "there"} 👋</h1>
        <p>
          This is your Application Tracker home. Soon you&apos;ll see your
          application stats, recent updates, and quick actions here.
        </p>
      </section>

      <section className="home-grid">
        <div className="home-card">
          <h3>Next steps</h3>
          <p>
            We&apos;ll add features like:
          </p>
          <ul>
            <li>Add a new job application</li>
            <li>View all your applications in a table</li>
            <li>Filter by status (Applied, Interview, Offer, Rejected)</li>
          </ul>
        </div>

        <div className="home-card">
          <h3>Consistency matters</h3>
          <p>
            Each time you apply for a job, add it here. Over time you&apos;ll
            see patterns — which types of roles convert to interviews and where
            to focus.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
