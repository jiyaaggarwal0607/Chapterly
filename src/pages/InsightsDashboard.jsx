import { useEffect, useMemo, useState } from "react";
import "./InsightsDashboard.css";
import BrandLogo from "../components/BrandLogo";
import { api } from "../api";

const num = (n) => Number(n || 0).toLocaleString("en-IN");

const EMPTY = {
  audience: "-",
  engagement: "-",
  topGenre: "-",
  merchInterest: "-",
  genres: [],
  merch: [],
};

function toBars(rows, labelKey, valueKey) {
  const max = Math.max(1, ...rows.map((x) => x[valueKey] || 0));

  return rows.map((x) => ({
    name: x[labelKey],
    value: Math.round(((x[valueKey] || 0) / max) * 100),
  }));
}

function buildData(r) {
  const sum = (rows, key) =>
    (rows || []).reduce((total, item) => total + (item[key] || 0), 0);

  return {
    audience: num(sum(r.viewsByGenre, "views")),
    engagement: num(sum(r.favouritesByGenre, "favourites")),
    topGenre: (r.top && r.top.genreByViews) || "-",
    merchInterest: num(sum(r.wishlistByCategory, "count")),
    genres: toBars((r.viewsByGenre || []).slice(0, 5), "genre", "views"),
    merch: toBars(r.wishlistByCategory || [], "category", "count"),
  };
}

const genreDetails = {
  Fantasy: {
    title: "Build a fantasy-first catalogue",
    description:
      "Feature imaginative worlds, character-led stories and clear series discovery in promotional campaigns.",
  },
  Romance: {
    title: "Promote character-driven stories",
    description:
      "Test emotional storytelling, relationship-focused recommendations and new-chapter notifications.",
  },
  Action: {
    title: "Highlight action and adventure",
    description:
      "Test high-energy previews, adventure collections and character merchandise bundles.",
  },
  "Slice of Life": {
    title: "Localize everyday experiences",
    description:
      "Try relatable themes, accessible entry points and affordable merchandise for casual fans.",
  },
  Mystery: {
    title: "Create curiosity-led campaigns",
    description:
      "Experiment with mystery previews, episodic reveals and spoiler-safe promotional content.",
  },
};

export default function InsightsDashboard({ onBack }) {
  const [period, setPeriod] = useState("30 days");
  const [selectedGenre, setSelectedGenre] = useState("Fantasy");
  const [activeTab, setActiveTab] = useState("audience");

  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api("/insights")
      .then((response) => {
        if (cancelled) return;

        setRaw(response);

        if (response.viewsByGenre?.[0]) {
          setSelectedGenre(response.viewsByGenre[0].genre);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Unable to load insights.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => (raw ? buildData(raw) : EMPTY), [raw]);

  const recommendation = useMemo(
    () =>
      genreDetails[selectedGenre] || {
        title: `Explore ${selectedGenre}`,
        description:
          "Test a small campaign around this genre and compare reader response before investing further.",
      },
    [selectedGenre]
  );

  return (
    <main className="insights-page">
      <header className="insights-navbar">
        <div className="insights-nav-left">
          <button
            className="insights-back-button"
            type="button"
            onClick={onBack}
            aria-label="Go back to home"
          >
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </button>

          <button
            className="insights-brand"
            type="button"
            onClick={onBack}
            aria-label="Return to home"
          >
            <BrandLogo className="insights-brand-logo" />
          </button>
        </div>

        <div className="insights-nav-right">
          <span className="insights-japan-label">日本 × भारत</span>
        </div>
      </header>

      <div className="insights-content">
        {loading && (
          <p className="insights-chart-hint">Loading insights...</p>
        )}

        {error && (
          <p className="insights-chart-hint" role="alert">
            {error}
          </p>
        )}

        <section className="insights-heading">
          <div>
            <p className="insights-eyebrow">
              CHAPTERLY / BUSINESS INTELLIGENCE
            </p>

            <h1>
              India audience <span>insights.</span>
            </h1>

            <p className="insights-subtitle">
              Understand fandom preferences and explore opportunities
              for Japanese content and merchandise in India.
            </p>
          </div>

          <label className="insights-period-control">
            <span>Reporting period</span>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
            </select>
          </label>
        </section>

        <div className="insights-demo-banner">
          <span className="insights-demo-icon">i</span>

          <p>
            <strong>Live platform data</strong>
            <span>
              These figures come from Chapterly platform data, not market-wide statistics.
            </span>
          </p>

          <span className="insights-sample-tag">LIVE</span>
        </div>

        <nav className="insights-tabs" aria-label="Insight categories">
          <button
            type="button"
            className={activeTab === "audience" ? "active" : ""}
            onClick={() => setActiveTab("audience")}
          >
            Audience overview
          </button>

          <button
            type="button"
            className={activeTab === "content" ? "active" : ""}
            onClick={() => setActiveTab("content")}
          >
            Content trends
          </button>

          <button
            type="button"
            className={activeTab === "merch" ? "active" : ""}
            onClick={() => setActiveTab("merch")}
          >
            Merchandise
          </button>
        </nav>

        <section className="insights-metric-grid">
          <article className="insights-metric-card">
            <div className="insights-metric-top">
              <span>Total views</span>
              <span className="insights-metric-icon">◉</span>
            </div>
            <strong>{data.audience}</strong>
            <p>Across all genres</p>
            <span className="insights-metric-foot">↗ Live metric</span>
          </article>

          <article className="insights-metric-card">
            <div className="insights-metric-top">
              <span>Reader favourites</span>
              <span className="insights-metric-icon">↗</span>
            </div>
            <strong>{data.engagement}</strong>
            <p>Favourites saved by readers</p>
            <span className="insights-metric-foot">◎ Live metric</span>
          </article>

          <article className="insights-metric-card">
            <div className="insights-metric-top">
              <span>Leading genre</span>
              <span className="insights-metric-icon">✦</span>
            </div>
            <strong className="insights-metric-word">{data.topGenre}</strong>
            <p>Most viewed genre</p>
            <span className="insights-metric-foot">✧ Content signal</span>
          </article>

          <article className="insights-metric-card">
            <div className="insights-metric-top">
              <span>Wishlist saves</span>
              <span className="insights-metric-icon">◇</span>
            </div>
            <strong>{data.merchInterest}</strong>
            <p>Products saved by readers</p>
            <span className="insights-metric-foot">◎ Commerce signal</span>
          </article>
        </section>

        {activeTab === "audience" && (
          <section className="insights-chart-grid">
            <article className="insights-panel">
              <div className="insights-panel-heading">
                <div>
                  <p className="insights-eyebrow">01 / AUDIENCE</p>
                  <h2>Genre popularity</h2>
                  <p>Relative views (top genre = 100)</p>
                </div>
                <span className="insights-panel-badge">Top 5</span>
              </div>

              <div className="insights-bars">
                {data.genres.map((genre, index) => (
                  <button
                    type="button"
                    className={`insights-bar-row ${
                      selectedGenre === genre.name ? "selected" : ""
                    }`}
                    key={genre.name}
                    onClick={() => setSelectedGenre(genre.name)}
                    aria-pressed={selectedGenre === genre.name}
                  >
                    <span className="insights-bar-label">
                      <span className="insights-bar-rank">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {genre.name}
                    </span>

                    <span className="insights-bar-track">
                      <span
                        className="insights-bar-fill"
                        style={{ width: `${genre.value}%` }}
                      />
                    </span>

                    <strong>{genre.value}</strong>
                  </button>
                ))}
              </div>

              <p className="insights-chart-hint">
                Select a genre to explore a suggested strategy.
              </p>
            </article>

            <article className="insights-panel insights-recommendation-panel">
              <p className="insights-eyebrow">02 / STRATEGY SUGGESTION</p>
              <div className="insights-recommendation-symbol">✳</div>
              <p className="insights-selected-label">SELECTED GENRE</p>
              <h2>{selectedGenre}</h2>
              <h3>{recommendation.title}</h3>

              <p className="insights-recommendation-copy">
                {recommendation.description}
              </p>

              <div className="insights-strategy-note">
                <span>↗</span>
                <p>
                  <strong>Suggested experiment</strong>
                  <br />
                  Test this idea with a small campaign before making
                  a wider investment.
                </p>
              </div>
            </article>
          </section>
        )}

        {activeTab === "content" && (
          <section className="insights-panel insights-full-panel">
            <div className="insights-panel-heading">
              <div>
                <p className="insights-eyebrow">CONTENT DISCOVERY</p>
                <h2>What stories could connect?</h2>
                <p>Compare the illustrative interest scores below.</p>
              </div>
            </div>

            <div className="insights-content-trends">
              {data.genres.map((genre) => (
                <button
                  type="button"
                  key={genre.name}
                  className="insights-trend-card"
                  onClick={() => setSelectedGenre(genre.name)}
                >
                  <span className="insights-trend-jp">物語</span>
                  <span>{genre.name}</span>
                  <strong>{genre.value}/100</strong>

                  <span className="insights-mini-track">
                    <span style={{ width: `${genre.value}%` }} />
                  </span>
                </button>
              ))}
            </div>

            <p className="insights-chart-hint">
              Genre scores are illustrative and intended to demonstrate
              how the dashboard could compare audience preferences.
            </p>
          </section>
        )}

        {activeTab === "merch" && (
          <section className="insights-chart-grid">
            <article className="insights-panel">
              <div className="insights-panel-heading">
                <div>
                  <p className="insights-eyebrow">COMMERCE / PRODUCT SIGNALS</p>
                  <h2>Merchandise interest</h2>
                  <p>Relative wishlist saves (top category = 100)</p>
                </div>
              </div>

              <div className="insights-bars">
                {data.merch.map((item, index) => (
                  <div className="insights-bar-row" key={item.name}>
                    <span className="insights-bar-label">
                      <span className="insights-bar-rank">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.name}
                    </span>

                    <span className="insights-bar-track">
                      <span
                        className="insights-bar-fill"
                        style={{ width: `${item.value}%` }}
                      />
                    </span>

                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="insights-panel insights-recommendation-panel">
              <p className="insights-eyebrow">MARKET OPPORTUNITY</p>
              <div className="insights-recommendation-symbol">◇</div>
              <h2>Test before scaling.</h2>

              <p className="insights-recommendation-copy">
                Consider a limited product drop, a small fan survey and
                a price-preference test before expanding merchandise
                distribution in India.
              </p>

              <div className="insights-strategy-note">
                <span>↗</span>
                <p>
                  <strong>Suggested next step</strong>
                  <br />
                  Compare category interest with actual purchase intent
                  and price feedback.
                </p>
              </div>
            </article>
          </section>
        )}

        <section className="insights-bottom-grid">
          <article className="insights-panel">
            <p className="insights-eyebrow">03 / MARKET NOTES</p>
            <h2>Opportunities to explore</h2>

            <div className="insights-opportunity">
              <span>01</span>
              <div>
                <strong>Localized discovery</strong>
                <p>Test English and Hindi discovery experiences.</p>
              </div>
            </div>

            <div className="insights-opportunity">
              <span>02</span>
              <div>
                <strong>Accessible merchandise</strong>
                <p>Research preferred products and comfortable price ranges.</p>
              </div>
            </div>

            <div className="insights-opportunity">
              <span>03</span>
              <div>
                <strong>Community-led launches</strong>
                <p>Gather fan feedback before launching new content.</p>
              </div>
            </div>
          </article>

          <article className="insights-panel insights-export-panel">
            <div className="insights-export-icon">↗</div>
            <p className="insights-eyebrow">FOR JAPANESE PUBLISHERS</p>
            <h2>From fandom to strategy.</h2>

            <p>
              Use audience signals to form hypotheses for localization,
              product planning and future market research.
            </p>

            <div className="insights-export-tags">
              <span>Localization</span>
              <span>Merchandising</span>
              <span>Audience research</span>
            </div>
          </article>
        </section>

        <footer className="insights-footer">
          <div className="insights-footer-brand">
            <BrandLogo className="insights-footer-logo" />
          </div>

          <p>Connecting Japanese stories with Indian fandom.</p>
          <span>Prototype dashboard · Sample data only</span>
        </footer>
      </div>
    </main>
  );
}