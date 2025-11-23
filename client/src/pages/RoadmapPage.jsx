import { useEffect } from "react";
import "../styles/roadmap.css";

const RoadmapPage = () => {
  useEffect(() => {
    const stages = document.querySelectorAll(".roadmap-stage");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    stages.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="roadmap-page">
      <header className="roadmap-header">
        <h1>Your Job Journey Roadmap</h1>
        <p>
          Follow this step–by–step road from{" "}
          <strong>student / fresher</strong> to{" "}
          <strong>job offer and first 3 months</strong>. Use this roadmap
          along with your JobTrackr applications and reminders.
        </p>
      </header>

      <section className="roadmap-legend">
        <span className="legend-dot legend-foundation" /> Foundation
        <span className="legend-separator">•</span>
        <span className="legend-dot legend-progress" /> In progress
        <span className="legend-separator">•</span>
        <span className="legend-dot legend-offer" /> Offer & beyond
      </section>

      <section className="roadmap-timeline">
        {/* The road itself */}
        <div className="road-path" />

        {/* Stage 1 */}
        <article className="roadmap-stage stage-left">
          <div className="stage-dot stage-dot--foundation">1</div>
          <div className="stage-card">
            <h2>Foundation: Resume, LinkedIn & Skills</h2>
            <p className="stage-intro">
              Before you start applying everywhere, make sure your basics are
              strong and clear.
            </p>
            <ul>
              <li>
                <strong>Resume:</strong> keep it one page, highlight projects,
                internships, and measurable outcomes.
              </li>
              <li>
                <strong>LinkedIn:</strong> add a clear headline (role + skills),
                short About, and your top projects.
              </li>
              <li>
                <strong>GitHub / Portfolio:</strong> pin 2–3 strong projects
                with a clean README and screenshots.
              </li>
              <li>
                <strong>Core skills:</strong> at least one language (C/Java/
                Python/JS) + basic DSA (arrays, strings, recursion).
              </li>
            </ul>
            <p className="stage-tip">
              Tip: store links to your resume, LinkedIn and GitHub in JobTrackr
              notes so they are easy to copy during applications.
            </p>
          </div>
        </article>

        {/* Stage 2 */}
        <article className="roadmap-stage stage-right">
          <div className="stage-dot stage-dot--foundation">2</div>
          <div className="stage-card">
            <h2>Discovering & Shortlisting Opportunities</h2>
            <p className="stage-intro">
              Instead of random mass applying, build a small but focused list
              of companies and roles.
            </p>
            <ul>
              <li>
                Look at <strong>campus drives</strong>, pooled drives and
                off–campus roles (LinkedIn, careers pages, job boards).
              </li>
              <li>
                Identify roles that really match your skills: Frontend,
                Full–stack, QA, Data, etc.
              </li>
              <li>
                For each role you like, create a new application in JobTrackr
                with company, position, link and notes.
              </li>
              <li>
                Set an initial status like <strong>“Planned”</strong> or{" "}
                <strong>“To Apply”</strong> before you actually submit.
              </li>
            </ul>
            <p className="stage-tip">
              Tip: you can tag applications with labels like
              &quot;product&quot;, &quot;service&quot;, &quot;dream company&quot;,
              &quot;backup&quot; using the tags field.
            </p>
          </div>
        </article>

        {/* Stage 3 */}
        <article className="roadmap-stage stage-left">
          <div className="stage-dot stage-dot--progress">3</div>
          <div className="stage-card">
            <h2>Application Routine & Consistency</h2>
            <p className="stage-intro">
              Treat your job search like a mini project with a weekly plan.
            </p>
            <ul>
              <li>
                Set a realistic weekly target (e.g.{" "}
                <strong>7–10 quality applications</strong>).
              </li>
              <li>
                After applying, update status to <strong>“Applied”</strong> and
                set a <strong>next follow–up date</strong>.
              </li>
              <li>
                Use the <strong>Applications</strong> page to filter by status
                and see where you are stuck.
              </li>
              <li>
                Use the board view to visually see how many are in “Applied /
                Online Test / Interview / Offer”.
              </li>
            </ul>
            <p className="stage-tip">
              Tip: your notification bell will remind you of follow–ups so you
              never forget to check on an application.
            </p>
          </div>
        </article>

        {/* Stage 4 */}
        <article className="roadmap-stage stage-right">
          <div className="stage-dot stage-dot--progress">4</div>
          <div className="stage-card">
            <h2>Online Tests & Technical Screening</h2>
            <p className="stage-intro">
              Most companies have at least one screening round – coding, MCQs
              or aptitude.
            </p>
            <ul>
              <li>
                Practice on platforms (LeetCode / HackerRank / CodeStudio) focusing on easy to medium problems.
              </li>
              <li>
                Track upcoming tests by updating status to{" "}
                <strong>“Online Test”</strong> and adding the test date in{" "}
                <strong>next follow–up</strong>.
              </li>
              <li>
                Use the timeline in each application to record how the test
                went and topics asked.
              </li>
              <li>
                Revise common CS subjects: OOPS, DBMS, OS, CN for core company
                tests.
              </li>
            </ul>
            <p className="stage-tip">
              Tip: after every test, write 3 things you did well and 3 things
              to improve in the application notes.
            </p>
          </div>
        </article>

        {/* Stage 5 */}
        <article className="roadmap-stage stage-left">
          <div className="stage-dot stage-dot--progress">5</div>
          <div className="stage-card">
            <h2>Interviews: Technical + HR</h2>
            <p className="stage-intro">
              This is where your communication and understanding are tested,
              not just memory.
            </p>
            <ul>
              <li>
                For every scheduled interview, update status to{" "}
                <strong>“Interview”</strong> and log the date/time.
              </li>
              <li>
                Be ready to deeply explain your projects – tech stack, problems
                solved, and your role.
              </li>
              <li>
                Prepare answers for common HR questions: &quot;Tell me about
                yourself&quot;, strengths, weaknesses, failures.
              </li>
              <li>
                After each round, add a timeline entry with questions asked and
                feedback so you learn faster.
              </li>
            </ul>
            <p className="stage-tip">
              Tip: review your last interview notes on JobTrackr before your
              next one – patterns will start to appear.
            </p>
          </div>
        </article>

        {/* Stage 6 */}
        <article className="roadmap-stage stage-right">
          <div className="stage-dot stage-dot--offer">6</div>
          <div className="stage-card">
            <h2>Offer, Decision & First 3 Months</h2>
            <p className="stage-intro">
              Once offers start coming, it’s about making a thoughtful choice
              and planning your early career.
            </p>
            <ul>
              <li>
                Update status to <strong>“Offer”</strong> and record CTC, role,
                location and joining date in notes.
              </li>
              <li>
                Compare offers based on learning, tech stack, team culture and
                stability – not only salary.
              </li>
              <li>
                If you accept, close other applications by marking them as{" "}
                <strong>“Rejected”</strong> or <strong>“On Hold”</strong> for
                clarity.
              </li>
              <li>
                Set a small roadmap for your first 3 months: what you want to
                learn, build and contribute.
              </li>
            </ul>
            <p className="stage-tip">
              Tip: even after you get an offer, keep a summary of your journey
              in JobTrackr – it becomes a reference for your next switch.
            </p>
          </div>
        </article>
      </section>

      <footer className="roadmap-footer">
        <h2>Use JobTrackr + this roadmap together</h2>
        <p>
          Keep logging your applications, interviews and follow–ups. Progress
          may look slow day to day, but over months it becomes a clear path
          from student to professional.
        </p>
      </footer>
    </main>
  );
};

export default RoadmapPage;
