
import { useMemo, useState } from "react";
import "./InsightsDashboard.css";
import BrandLogo from "../components/BrandLogo";
const insightsData = {
  "7 days": {
    audience: "2,480",
    engagement: "68%",
    topGenre: "Fantasy",
    merchInterest: "74%",
    genres: [
      { name: "Fantasy", value: 86 },
      { name: "Romance", value: 72 },
      { name: "Action", value: 64 },
      { name: "Slice of Life", value: 49 },
      { name: "Mystery", value: 38 },
    ],
    merch: [
      { name: "Character figures", value: 82 },
      { name: "Apparel", value: 68 },
      { name: "Keychains", value: 61 },
      { name: "Art prints", value: 45 },
    ],
  },
  "30 days": {
    audience: "8,640",
    engagement: "72%",
    topGenre: "Fantasy",
    merchInterest: "79%",
    genres: [
      { name: "Fantasy", value: 91 },
      { name: "Romance", value: 78 },
      { name: "Action", value: 69 },
      { name: "Slice of Life", value: 55 },
      { name: "Mystery", value: 43 },
    ],
    merch: [
      { name: "Character figures", value: 85 },
      { name: "Apparel", value: 73 },
      { name: "Keychains", value: 66 },
      { name: "Art prints", value: 51 },
    ],
  },
  "90 days": {
    audience: "21,300",
    engagement: "75%",
    topGenre: "Fantasy",
    merchInterest: "81%",
    genres: [
      { name: "Fantasy", value: 94 },
      { name: "Romance", value: 81 },
      { name: "Action", value: 76 },
      { name: "Slice of Life", value: 60 },
      { name: "Mystery", value: 47 },
    ],
    merch: [
      { name: "Character figures", value: 88 },
      { name: "Apparel", value: 77 },
      { name: "Keychains", value: 70 },
      { name: "Art prints", value: 56 },
    ],
  },
};

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

const format = (value) => `${value}%`;

export default function InsightsDashboard({ onBack }) {
  const [period, setPeriod] = useState("30 days");
  const [selectedGenre, setSelectedGenre] = useState("Fantasy");
  const [activeTab, setActiveTab] = useState("audience");

  const data = insightsData[period];

  const recommendation = useMemo(
    () => genreDetails[selectedGenre],
    [selectedGenre]
  );

  return (
    <main className="insights-page">
      <header className="insights-navbar">
        <button
          className="insights-brand"
          type="button"
          onClick={onBack}
          aria-label="Return to home"
        >
          <BrandLogo className="insights-brand-logo" />
        </button>

        <div className="insights-nav-right">
          <span className="insights-japan-label">日本 × भारत</span>
        </div>
      </header>

      <div className="insights-content">
        <section className="insights-heading">
          <div>
            <p className="insights-eyebrow">CHAPTERLY / BUSINESS INTELLIGENCE</p>
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
            <strong>Prototype data</strong>
            <span>
              All metrics on this dashboard are illustrative sample data,
              not measured Indian audience statistics.
            </span>
          </p>
          <span className="insights-sample-tag">DEMO</span>
        </div>

        <nav className="insights-tabs" aria-label="Insight categories">
          <button
            className={activeTab === "audience" ? "active" : ""}
            onClick={() => setActiveTab("audience")}
          >
            Audience overview
          </button>
          <button
            className={activeTab === "content" ? "active" : ""}
            onClick={() => setActiveTab("content")}
          >
            Content trends
          </button>
          <button
            className={activeTab === "merch" ? "active" : ""}
            onClick={() => setActiveTab("merch")}
          >
            Merchandise
          </button>
        </nav>

        <section className="insights-metric-grid">
          <article className="insights-metric-card">
            <div className="insights-metric-top">
              <span>Audience sample</span>
              <span className="insights-metric-icon">◉</span>
            </div>
            <strong>{data.audience}</strong>
            <p>Illustrative audience records</p>
            <span className="insights-metric-foot">↗ Sample metric</span>
          </article>

          <article className="insights-metric-card">
            <div className="insights-metric-top">
              <span>Engagement rate</span>
              <span className="insights-metric-icon">↗</span>
            </div>
            <strong>{data.engagement}</strong>
            <p>Illustrative engagement metric</p>
            <span className="insights-metric-foot">◎ Sample metric</span>
          </article>

          <article className="insights-metric-card">
            <div className="insights-metric-top">
              <span>Leading genre</span>
              <span className="insights-metric-icon">✦</span>
            </div>
            <strong className="insights-metric-word">{data.topGenre}</strong>
            <p>Highest illustrative genre score</p>
            <span className="insights-metric-foot">✧ Content signal</span>
          </article>

          <article className="insights-metric-card">
            <div className="insights-metric-top">
              <span>Merch interest</span>
              <span className="insights-metric-icon">◇</span>
            </div>
            <strong>{data.merchInterest}</strong>
            <p>Illustrative interest score</p>
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
                  <p>Illustrative relative interest score</p>
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
                  <p>Illustrative product category scores</p>
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
