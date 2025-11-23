import "../styles/roadmap.css";

const RoadmapPage = () => {
  return (
    <main className="roadmap-page">
      <header className="roadmap-header">
        <h1>Your Interview Roadmap</h1>
        <p>
          A simple, practical path to go from <strong>student / fresher</strong> to
          <strong> job offer</strong>. Use this roadmap along with your JobTrackr
          applications and reminders.
        </p>
      </header>

      {/* Overview timeline */}
      <section className="roadmap-overview">
        <h2>Big picture</h2>
        <div className="roadmap-steps">
          <div className="roadmap-step">
            <span className="step-index">1</span>
            <h3>Foundation</h3>
            <p>Resume, LinkedIn, skills, and basic portfolio setup.</p>
          </div>
          <div className="roadmap-step">
            <span className="step-index">2</span>
            <h3>Applications</h3>
            <p>Targeted job search, tracking opportunities, and consistent apply routine.</p>
          </div>
          <div className="roadmap-step">
            <span className="step-index">3</span>
            <h3>Online Assessments</h3>
            <p>Coding tests, aptitude, and company-specific rounds.</p>
          </div>
          <div className="roadmap-step">
            <span className="step-index">4</span>
            <h3>Interviews</h3>
            <p>Technical + HR interviews, communication, and follow-ups.</p>
          </div>
          <div className="roadmap-step">
            <span className="step-index">5</span>
            <h3>Offer & Joining</h3>
            <p>Evaluating offers, negotiation basics, and onboarding preparation.</p>
          </div>
        </div>
      </section>

      {/* Phase 1 */}
      <section className="roadmap-section">
        <h2>1. Foundation – Get ready before you apply</h2>
        <div className="roadmap-grid">
          <div className="roadmap-card">
            <h3>Resume essentials</h3>
            <ul>
              <li>Keep it <strong>one page</strong> for fresher / student profiles.</li>
              <li>Highlight projects, internships, hackathons, and online courses.</li>
              <li>Use clear bullet points with action verbs (Built, Implemented, Designed).</li>
              <li>Remove unnecessary details (photo, too many personal details).</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>LinkedIn & GitHub</h3>
            <ul>
              <li>Set a clear headline: <em>“Final-year CSE student | Interested in Web / AI”</em>.</li>
              <li>Write a short About section: who you are, what you are learning, what you want.</li>
              <li>Pin 2–3 strongest projects on GitHub with proper README.</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>Skill checklist</h3>
            <ul>
              <li>Comfortable with at least one programming language (C / Java / Python / JS).</li>
              <li>Basic DSA: arrays, strings, recursion, sorting, searching.</li>
              <li>Basics of DBMS, OS, CN for core CS interviews.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Phase 2 */}
      <section className="roadmap-section">
        <h2>2. Applications – Build a healthy pipeline</h2>
        <div className="roadmap-grid">
          <div className="roadmap-card">
            <h3>Weekly routine</h3>
            <ul>
              <li>Set a target: e.g. <strong>7–10 quality applications per week</strong>.</li>
              <li>Use JobTrackr to log every application with status + next follow-up date.</li>
              <li>Prefer roles that match your skills instead of random mass applications.</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>Types of opportunities</h3>
            <ul>
              <li>Campus placements & pooled drives.</li>
              <li>Off-campus: LinkedIn, company career pages, referrals, job boards.</li>
              <li>Internships and trainee roles – great entry points for freshers.</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>Follow-up strategy</h3>
            <ul>
              <li>After applying, set a follow-up date in JobTrackr (e.g. 5–7 days).</li>
              <li>Send a polite reminder email or LinkedIn message after the follow-up date.</li>
              <li>Use the notification bell to never miss these follow-ups.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Phase 3 */}
      <section className="roadmap-section">
        <h2>3. Online tests – Coding & aptitude rounds</h2>
        <div className="roadmap-grid">
          <div className="roadmap-card">
            <h3>Coding platforms</h3>
            <ul>
              <li>Practice on LeetCode / HackerRank / CodeStudio (easy to medium level).</li>
              <li>Focus on patterns: arrays, strings, hashing, two pointers, basic DP.</li>
              <li>Time-box: even 3–4 focused problems per day is enough if consistent.</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>Aptitude & reasoning</h3>
            <ul>
              <li>Work through topics: percentages, ratios, time & work, number systems.</li>
              <li>Practice from previous placement papers if available.</li>
              <li>Note your weak areas and revisit them weekly.</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>Tracking tests with JobTrackr</h3>
            <ul>
              <li>Use status like <strong>“Online Test”</strong> or <strong>“In Progress”</strong> for such rounds.</li>
              <li>Store test dates + links in the application notes.</li>
              <li>Set follow-up dates for result updates after the test.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Phase 4 */}
      <section className="roadmap-section">
        <h2>4. Interviews – Technical + HR</h2>
        <div className="roadmap-grid">
          <div className="roadmap-card">
            <h3>Technical interview prep</h3>
            <ul>
              <li>Be ready to explain your projects: tech stack, challenges, your contribution.</li>
              <li>Revise OOPS, DBMS, OS, CN basics with simple explanations.</li>
              <li>Practice “whiteboard” style: explain how you think before coding.</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>HR & communication</h3>
            <ul>
              <li>Prepare answers for: “Tell me about yourself”, strengths, weaknesses, failures.</li>
              <li>Keep answers honest, simple, and structured (past → present → future).</li>
              <li>Maintain eye contact, stay calm, and don’t rush answers.</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>Using JobTrackr during interviews</h3>
            <ul>
              <li>Add each interview as an activity in the timeline for that application.</li>
              <li>Note: questions asked, areas you struggled, feedback received.</li>
              <li>Before your next interview, quickly review these notes.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Phase 5 */}
      <section className="roadmap-section">
        <h2>5. Offer, decision & joining</h2>
        <div className="roadmap-grid">
          <div className="roadmap-card">
            <h3>When an offer comes</h3>
            <ul>
              <li>Update status to <strong>“Offer”</strong> in JobTrackr.</li>
              <li>Record CTC, role, location, and joining date in notes.</li>
              <li>Compare offers based on growth, learning, and stability, not just salary.</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>Basic negotiation</h3>
            <ul>
              <li>As a fresher, negotiation room is limited, but you can ask politely.</li>
              <li>Mention other offers only if they are confirmed and relevant.</li>
              <li>Be respectful – you are building a long-term relationship.</li>
            </ul>
          </div>
          <div className="roadmap-card">
            <h3>Before joining</h3>
            <ul>
              <li>Revise key skills required for the role.</li>
              <li>Complete pending documentation early.</li>
              <li>Set new goals: what you want to learn in the first 3–6 months.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="roadmap-footer">
        <h2>Use this roadmap + JobTrackr together</h2>
        <p>
          Keep applying, keep tracking, and keep learning from every test and interview.
          Consistency matters more than perfection.
        </p>
      </section>
    </main>
  );
};

export default RoadmapPage;
