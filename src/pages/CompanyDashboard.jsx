
import { useEffect, useState } from "react";
import "./CompanyDashboard.css";
import BrandLogo from "../components/BrandLogo";
import { api } from "../api";


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
  const [genres, setGenres] = useState([]);
  const [genreCount, setGenreCount] = useState(0);
  const [favourites, setFavourites] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api("/insights")
      .then((r) => {
        if (cancelled) return;
        const rows = r.viewsByGenre || [];
        const max = Math.max(1, ...rows.map((g) => g.views || 0));
        setGenres(
          rows.slice(0, 4).map((g) => ({
            name: g.genre,
            percent: Math.round(((g.views || 0) / max) * 100),
          }))
        );
        setGenreCount(rows.length);
        setFavourites((r.favouritesByGenre || []).reduce((t, g) => t + (g.favourites || 0), 0));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
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
          <span className="demo-badge">LIVE DATA</span>
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
          These figures come from Chapterly platform data.
        </div>

        <section className="company-metrics">
          <article className="metric-card">
            <span className="metric-label">Reader favourites</span>
            <strong>{favourites}</strong>
            <p>Favourites saved by readers</p>
          </article>

          <article className="metric-card">
            <span className="metric-label">Genres analysed</span>
            <strong>{String(genreCount).padStart(2, "0")}</strong>
            <p>Genres with reader views</p>
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
            <span className="section-note">Index / 100</span>
          </div>

          <div className="genre-panel">
            {loading && <p className="chart-caption">Loading insights...</p>}
            {error && <p className="chart-caption" role="alert">{error}</p>}
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
              Relative views per genre (top genre = 100).
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

