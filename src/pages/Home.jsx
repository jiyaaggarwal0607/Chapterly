
import { useEffect, useState } from "react";
import "./Home.css";
import BrandLogo from "../components/BrandLogo";
const sections = [
  {
    id: "manga",
    number: "01",
    title: "Manga",
    japanese: "物語 · Stories",
    description: "Find a story that stays with you.",
    symbol: "冊",
    action: "Explore manga",
  },
  {
    id: "shop",
    number: "02",
    title: "Shop",
    japanese: "好き · Fandom",
    description: "Discover merchandise from your favourite worlds.",
    symbol: "買",
    action: "Explore the shop",
  },
  {
    id: "translator",
    number: "03",
    title: "Translator Hub",
    japanese: "言葉 · Language",
    description: "Help stories travel across languages.",
    symbol: "訳",
    action: "Join the hub",
  },

{
  id: "insights",
  number: "04",
  title: "AI Insights",
  japanese: "分析 · Analytics",
  description: "Understand what Indian fans love.",
  symbol: "統",
  action: "Explore insights",
},
];

export default function Home({ onOpenSection, onLogout }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeMessage, setActiveMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  function openSection(sectionId) {
    if (onOpenSection) {
      onOpenSection(sectionId);
    } else {
      setActiveMessage(
        `${sectionId === "translator" ? "Translator Hub" : sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} is ready to be connected.`
      );
    }
  }

  return (
    <main className="chapterly-home">
      <div className="home-atmosphere" aria-hidden="true" />

      <header className="home-header">
        <a className="home-brand" href="#home" aria-label="Chapterly home">
  <BrandLogo className="home-brand-logo" />
</a>

        <div className="header-right">
          <span className="header-note">YOUR NEXT CHAPTER AWAITS</span>
          <button
            className="profile-button"
            type="button"
            aria-label="Profile"
            onClick={() => setActiveMessage("Your profile will appear here.")}
          >
            <span>J</span>
          </button>
        </div>
      </header>

      <div className="home-layout" id="home">
        <aside className="home-sidebar" aria-label="Account menu">
          <div className="sidebar-top">
            <span className="sidebar-label">YOUR SPACE</span>

            <button
              className="sidebar-link"
              type="button"
              onClick={() => setActiveMessage("Your profile will appear here.")}
            >
              <span className="sidebar-icon">◎</span>
              <span>Profile</span>
            </button>

            <button
              className="sidebar-link"
              type="button"
              onClick={() => setActiveMessage("Your wallet will appear here.")}
            >
              <span className="sidebar-icon">◇</span>
              <span>Wallet</span>
            </button>

            <button
              className="sidebar-link"
              type="button"
              onClick={() => setActiveMessage("Your settings will appear here.")}
            >
              <span className="sidebar-icon">⚙</span>
              <span>Settings</span>
            </button>
          </div>

          <button
            className="sidebar-link logout-link"
            type="button"
            onClick={onLogout ?? (() => setActiveMessage("Connect this button to your logout flow."))}
          >
            <span className="sidebar-icon">↗</span>
            <span>Log out</span>
          </button>
        </aside>

        <section className="home-main">
          <div className="welcome-copy">
            <span className="eyebrow">
                ようこそ、Chapterlyへ。 — Welcome to Chapterly.
            </span>

            <h1>
              Every world
              <br />
              has a <span>chapter.</span>
            </h1>

            <p>
              Read a little. Discover a lot.
              <br />
              Find your place in the world of Japanese pop culture.
            </p>
          </div>

          <section className="destination-section" aria-labelledby="destination-title">
            <div className="section-heading">
              <div>
                <span className="section-kicker">BEGIN YOUR JOURNEY</span>
                <h2 id="destination-title">Where to today?</h2>
              </div>
              <span className="section-count">01 — 04</span>
            </div>

            <div className="destination-grid">
              {sections.map((section) => (
                <article className="destination-card" key={section.id}>
                  <div className="card-topline">
                    <span className="card-number">{section.number}</span>
                    <span className="card-japanese">{section.japanese}</span>
                  </div>

                  <div className={`card-symbol symbol-${section.id}`} aria-hidden="true">
                    {section.symbol}
                  </div>

                  <div className="card-copy">
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>

                  <button
                    className="card-action"
                    type="button"
                    onClick={() => openSection(section.id)}
                  >
                    {section.action}
                    <span aria-hidden="true">↗</span>
                  </button>
                </article>
              ))}
            </div>

            {activeMessage && (
              <div className="home-notice" role="status">
                <span>{activeMessage}</span>
                <button
                  type="button"
                  aria-label="Dismiss message"
                  onClick={() => setActiveMessage("")}
                >
                  ×
                </button>
              </div>
            )}
          </section>

          <footer className="home-footer">
            <span>物語は、ここから。 — Every story begins somewhere.</span>
            <span>MADE FOR THE LOVE OF STORIES <b>✦</b></span>
          </footer>
        </section>
      </div>

      {showWelcome && (
        <div className="welcome-toast" role="status">
          <div className="toast-symbol">章</div>
          <div className="toast-copy">
            <span className="toast-japanese">ようこそ、Chapterlyへ。</span>
            <strong>Welcome to your next chapter.</strong>
            <span>Your little world of stories awaits.</span>
          </div>
          <button
            className="toast-close"
            type="button"
            aria-label="Close welcome message"
            onClick={() => setShowWelcome(false)}
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}
