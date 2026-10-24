
import { useEffect, useState } from "react";
import "./Home.css";
import BrandLogo from "../components/BrandLogo";
import { api } from "../api";

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
  const [activePanel, setActivePanel] = useState("");

  const [showSettings, setShowSettings] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const [walletData, setWalletData] = useState(null);
  const [walletStatus, setWalletStatus] = useState("");
  const [topUp, setTopUp] = useState("");
  const [walletBusy, setWalletBusy] = useState(false);

  const [settingsName, setSettingsName] = useState("");
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsStatus, setSettingsStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const initial = (storedUser?.name || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  async function loadWallet() {
    setWalletStatus("Loading wallet...");

    try {
      const data = await api("/wallet");
      setWalletData(data);
      setWalletStatus("");
    } catch (err) {
      setWalletStatus(err.message || "Unable to load wallet.");
    }
  }

  function openWallet() {
    setActiveMessage("");
    setActivePanel("");
    setShowSettings(false);
    setShowWallet(true);
    setTopUp("");
    loadWallet();
  }

  async function addMoney() {
    const amount = Number(topUp);

    if (!Number.isFinite(amount) || amount < 1 || amount > 50000) {
      setWalletStatus("Enter an amount between 1 and 50000.");
      return;
    }

    setWalletBusy(true);
    setWalletStatus("Adding money...");

    try {
      await api("/wallet/add", {
        method: "POST",
        body: { amount },
      });

      setTopUp("");
      await loadWallet();
    } catch (err) {
      setWalletStatus(err.message || "Unable to add money.");
    } finally {
      setWalletBusy(false);
    }
  }

  function openSettings() {
    setActiveMessage("");
    setActivePanel("");
    setSettingsName(storedUser?.name || "");
    setSettingsPassword("");
    setSettingsStatus("");
    setShowSettings(true);
    setShowWallet(false);
  }

  async function saveSettings() {
    const body = {};

    if (settingsName.trim()) {
      body.name = settingsName.trim();
    }

    if (settingsPassword) {
      if (settingsPassword.length < 6) {
        setSettingsStatus("Password must be at least 6 characters.");
        return;
      }

      body.password = settingsPassword;
    }

    if (!Object.keys(body).length) {
      setSettingsStatus("Nothing to save.");
      return;
    }

    setSaving(true);
    setSettingsStatus("Saving...");

    try {
      const updated = await api("/users/me", {
        method: "PUT",
        body,
      });

      const newName =
        updated?.name || body.name || storedUser?.name;

      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, name: newName })
      );

      setSettingsPassword("");
      setSettingsStatus("Saved.");
    } catch (err) {
      setSettingsStatus(err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function showProfile() {
    setShowWallet(false);
    setShowSettings(false);
    setActivePanel("");
    setActiveMessage("Loading your profile...");

    try {
      const me = await api("/users/me");
      setActiveMessage(`${me.name} · ${me.email} · ${me.role}`);
    } catch (err) {
      setActiveMessage(err.message || "Unable to load profile.");
    }
  }

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
      const sectionName =
        sectionId === "translator"
          ? "Translator Hub"
          : sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

      setActiveMessage(`${sectionName} is ready to be connected.`);
    }
  }

  function closePanel() {
    setActivePanel("");
  }

  return (
    <main className="chapterly-home">
      <div className="home-atmosphere" aria-hidden="true" />

      <header className="home-header">
        <a
          className="home-brand"
          href="#home"
          aria-label="Chapterly home"
        >
          <BrandLogo className="home-brand-logo" />
        </a>

        <div className="header-right">
          <span className="header-note">
            YOUR NEXT CHAPTER AWAITS
          </span>

          <button
            className="profile-button"
            type="button"
            aria-label="Profile"
            onClick={showProfile}
          >
            <span>{initial}</span>
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
              onClick={showProfile}
            >
              <span className="sidebar-icon">◎</span>
              <span>Profile</span>
            </button>

            <button
              className="sidebar-link"
              type="button"
              onClick={openWallet}
            >
              <span className="sidebar-icon">◇</span>
              <span>Wallet</span>
            </button>

            <button
              className="sidebar-link"
              type="button"
              onClick={openSettings}
            >
              <span className="sidebar-icon">⚙</span>
              <span>Settings</span>
            </button>
          </div>

          <button
            className="sidebar-link logout-link"
            type="button"
            onClick={
              onLogout ??
              (() =>
                setActiveMessage(
                  "Connect this button to your logout flow."
                ))
            }
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

          <section
            className="destination-section"
            aria-labelledby="destination-title"
          >
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  BEGIN YOUR JOURNEY
                </span>
                <h2 id="destination-title">Where to today?</h2>
              </div>

              <span className="section-count">01 — 04</span>
            </div>

            <div className="destination-grid">
              {sections.map((section) => (
                <article
                  className="destination-card"
                  key={section.id}
                >
                  <div className="card-topline">
                    <span className="card-number">
                      {section.number}
                    </span>
                    <span className="card-japanese">
                      {section.japanese}
                    </span>
                  </div>

                  <div
                    className={`card-symbol symbol-${section.id}`}
                    aria-hidden="true"
                  >
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

            {showWallet && (
              <div
                className="home-notice"
                role="status"
                style={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: "10px",
                }}
              >
                <strong>
                  Wallet balance: ₹
                  {walletData ? walletData.balance : "..."}
                </strong>

                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="number"
                    min="1"
                    max="50000"
                    placeholder="Amount to add (₹)"
                    value={topUp}
                    onChange={(e) => setTopUp(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={addMoney}
                    disabled={walletBusy}
                  >
                    Add money
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowWallet(false)}
                  >
                    Close
                  </button>
                </div>

                {walletStatus && <span>{walletStatus}</span>}

                {walletData &&
                  walletData.transactions?.length === 0 && (
                    <span>No transactions yet.</span>
                  )}

                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {walletData?.transactions?.map((t) => (
                    <div
                      key={t._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 0",
                      }}
                    >
                      <span>
                        {t.note || t.type} ·{" "}
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>

                      <span>
                        {t.type === "credit" ? "+" : "-"}₹{t.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showSettings && (
              <div
                className="home-notice"
                role="status"
                style={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="New password (leave empty to keep it)"
                  value={settingsPassword}
                  onChange={(e) => setSettingsPassword(e.target.value)}
                />

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={saveSettings}
                    disabled={saving}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                  >
                    Close
                  </button>
                </div>

                {settingsStatus && <span>{settingsStatus}</span>}
              </div>
            )}

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
            <span>
              物語は、ここから。 — Every story begins somewhere.
            </span>

            <span>
              MADE FOR THE LOVE OF STORIES <b>✦</b>
            </span>
          </footer>
        </section>
      </div>

      {showWelcome && (
        <div className="welcome-toast" role="status">
          <div className="toast-symbol">章</div>

          <div className="toast-copy">
            <span className="toast-japanese">
              ようこそ、Chapterlyへ。
            </span>
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

      {activePanel && (
        <div
          className="home-modal-overlay"
          onClick={closePanel}
        >
          <section
            className="home-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="home-modal-close"
              type="button"
              aria-label="Close panel"
              onClick={closePanel}
            >
              ×
            </button>

            {activePanel === "profile" && (
              <>
                <span className="modal-eyebrow">YOUR ACCOUNT</span>
                <h2 id="home-modal-title">Your Profile</h2>
                <div className="profile-avatar">{initial}</div>
                <h3>{storedUser?.name || "Chapterly Reader"}</h3>
                <p className="modal-description">
                  Your personal space in the world of stories.
                </p>
                <div className="modal-info-row">
                  <span>Account type</span>
                  <strong>{storedUser?.role || "Reader"}</strong>
                </div>
                <div className="modal-info-row">
                  <span>Membership</span>
                  <strong>Chapterly member</strong>
                </div>
                <p className="modal-footnote">
                  Your account details are shown using the locally stored
                  account information.
                </p>
              </>
            )}

            {activePanel === "wallet" && (
              <>
                <span className="modal-eyebrow">YOUR COLLECTION</span>
                <h2 id="home-modal-title">My Wallet</h2>
                <div className="wallet-balance">
                  <span>CHAPTERLY CREDITS</span>
                  <strong>
                    0 <small>credits</small>
                  </strong>
                  <p>Demo balance</p>
                </div>
                <div className="modal-info-row">
                  <span>Recent transactions</span>
                  <strong>None yet</strong>
                </div>
                <p className="modal-footnote">
                  This is a demo wallet. No real payments are involved.
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
