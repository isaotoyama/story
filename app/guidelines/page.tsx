export default function GuidelinesPage() {
  return (
    <main className="page">
      <section className="card">
        <span className="badge">Community Guidelines</span>
        <h1 className="section-title">Keep stories creative, safe, and collaborative.</h1>

        <p className="muted">
          StoryFlow is for collaborative fiction and creative storytelling.
          Content may be flagged, hidden, edited, or deleted when it violates these guidelines.
        </p>

        <h2>Not allowed</h2>

        <ul className="guideline-list">
          <li>Political persuasion, campaigning, propaganda, or election influence.</li>
          <li>Religious persuasion, recruitment, or attacks on religious groups.</li>
          <li>Abuse, harassment, threats, hate, sexual exploitation, or violent intimidation.</li>
          <li>Advertising, spam, affiliate links, lead generation, or commercial promotion.</li>
          <li>Redirecting users to external websites for profit, scams, or influence.</li>
          <li>Impersonation, deceptive content, bot-generated spam, or coordinated manipulation.</li>
          <li>Content that breaks the story experience or intentionally derails collaboration.</li>
        </ul>

        <h2>Moderation process</h2>

        <p className="muted">
          Flagged content remains visible with a warning notice. The author may edit it.
          If it is not corrected, it may be deleted after 14 days.
        </p>
      </section>
    </main>
  );
}
