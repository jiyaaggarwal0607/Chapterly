
import "./CompanyDashboard.css";
import BrandLogo from "../components/BrandLogo";
const genres = [
  { name: "Fantasy", percent: 86 },
  { name: "Romance", percent: 74 },
  { name: "Action", percent: 68 },
  { name: "Slice of Life", percent: 52 },
];

const opportunities = [
  {
    number: "01",
    title: "Explore fantasy releases",
    description:
      "Test a fantasy title with a small group of readers before a wider launch.",
    tag: "CONTENT",
  },
  {
    number: "02",
    title: "Connect with translators",
    description:
      "Explore translation partnerships to make more stories accessible to Indian readers.",
    tag: "LOCALIZATION",
  },
  {
    number: "03",
    title: "Test merchandise interest",
    description:
      "Try a limited merchandise collection inspired by popular story genres.",
    tag: "COMMERCE",
  },
];

export default function CompanyDashboard({ onBack, onLogout }) {
  return (
    <main className="company-dashboard">
      <aside className="company-sidebar">
        <BrandLogo onClick={onBack} />

        <p className="sidebar-label">WORKSPACE</p>

        <button className="sidebar-link active">
          <span>◫</span> Overview
        </button>
        <button
          className="sidebar-link"
          onClick={() =>
            document
              .getElementById("company-genres")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span>◈</span> Audience insights
        </button>
        <button
          className="sidebar-link"
          onClick={() =>
            document
              .getElementById("company-opportunities")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span>✳</span> Opportunities
        </button>

        <div className="sidebar-bottom">
          <p>COMPANY PORTAL</p>
          <span>Demo workspace</span>
          <button className="sidebar-link" onClick={onLogout}>
            ↪ Sign out
          </button>
        </div>
      </aside>

      <section className="company-main">
        <header className="company-topbar">
          <button className="company-back" onClick={onBack}>
            ← Back to Chapterly
          </button>
          <span className="demo-badge">DEMO DATA</span>
        </header>

        <section className="company-welcome">
          <p className="eyebrow">COMPANY OVERVIEW / 01</p>
          <h1>Stories meet <span>strategy.</span></h1>
          <p>
            Explore audience trends and discover new opportunities in
            India's manga market.
          </p>
        </section>

        <div className="company-notice">
          <span>✦</span>
          These are illustrative sample figures for the hackathon demo,
          not real platform analytics.
        </div>

        <section className="company-metrics">
          <article className="metric-card">
            <span className="metric-label">Reader interest index</span>
            <strong>78<span>/100</span></strong>
            <p>Illustrative engagement score</p>
          </article>

          <article className="metric-card">
            <span className="metric-label">Genres analysed</span>
            <strong>04</strong>
            <p>Sample genre categories</p>
          </article>

          <article className="metric-card">
            <span className="metric-label">Growth opportunities</span>
            <strong>03</strong>
            <p>Suggested next steps</p>
          </article>
        </section>

        <section className="company-section" id="company-genres">
          <div className="section-heading">
            <div>
              <p className="eyebrow">AUDIENCE INTELLIGENCE</p>
              <h2>Genre interest</h2>
            </div>
            <span className="section-note">Sample index / 100</span>
          </div>

          <div className="genre-panel">
            {genres.map((genre) => (
              <div className="genre-row" key={genre.name}>
                <div className="genre-info">
                  <span>{genre.name}</span>
                  <strong>{genre.percent}</strong>
                </div>
                <div className="genre-track">
                  <div
                    className="genre-fill"
                    style={{ width: `${genre.percent}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="chart-caption">
              Fictional demo scores used to demonstrate how audience
              preferences could be compared.
            </p>
          </div>
        </section>

        <section
          className="company-section"
          id="company-opportunities"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">RECOMMENDED NEXT STEPS</p>
              <h2>Opportunities to explore</h2>
            </div>
          </div>

          <div className="opportunity-list">
            {opportunities.map((item) => (
              <article className="opportunity-card" key={item.number}>
                <span className="opportunity-number">{item.number}</span>
                <div className="opportunity-content">
                  <span className="opportunity-tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="opportunity-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <footer className="company-footer">
          CHAPTERLY❤️ TURNING FANDOM INTO OPPORTUNITY
        </footer>
      </section>
    </main>
  );
}
