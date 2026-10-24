import { useEffect, useMemo, useRef, useState } from "react";
import "./ReaderHome.css";
import BrandLogo from "../components/BrandLogo";
import { api } from "../api";
const COVER_ARTS = ["ocean", "petals", "shrine", "night", "crimson", "days"];

function toStory(m) {
  const genres = m.genres && m.genres.length ? m.genres : ["Other"];
  const days = Math.max(0, Math.floor((Date.now() - new Date(m.updatedAt).getTime()) / 86400000));
  return {
    id: m._id,
    title: m.title,
    genres,
    genre: genres.join(" \u00b7 "),
    status: m.status ? m.status.charAt(0).toUpperCase() + m.status.slice(1) : "Ongoing",
    rating: Number(m.rating) || 0,
    views: Number(m.views) || 0,
    chapter: "Chapter " + (m.latestChapter ?? 0),
    updatedDaysAgo: days,
    cover: COVER_ARTS[parseInt(String(m._id).slice(-2), 16) % COVER_ARTS.length],
    description: m.description || "",
  };
}



const statuses = ["All", "Ongoing", "Completed"];
const sortOptions = ["Popular", "Top rated", "Title A–Z"];

const sortHeadings = {
  Popular: { eyebrow: "FAN FAVOURITES", title: "Most popular" },
  "Top rated": { eyebrow: "HIGHEST SCORES", title: "Top rated stories" },
  "Title A–Z": { eyebrow: "BROWSE ALL", title: "All stories" },
};

function formatViews(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}

function formatUpdated(days) {
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  return `Updated ${days} days ago`;
}

function sortStories(list, sort) {
  const copy = [...list];
  if (sort === "Top rated") return copy.sort((a, b) => b.rating - a.rating);
  if (sort === "Title A–Z") return copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy.sort((a, b) => b.views - a.views); // Popular
}

function StoryCard({ story, onSelect }) {
  return (
    <article className="catalog-card">
      {/* Cover is decorative for keyboard/screen readers: the title button below is the real control */}
      <button
        type="button"
        className={`catalog-cover art-${story.cover}`}
        onClick={() => onSelect(story)}
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className="cover-edition">CHAPTERLY</span>
        <span className="cover-kanji" aria-hidden="true">物語</span>
        <span className="cover-name">{story.title}</span>
        <span className="cover-genre">{story.genre}</span>
      </button>

      <button
        type="button"
        className="catalog-title"
        onClick={() => onSelect(story)}
      >
        {story.title}
      </button>

      <p className="catalog-subtitle">
        {story.chapter} · {formatViews(story.views)} views
      </p>
    </article>
  );
}

export default function ReaderHome({ onBack, onRead }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All genres");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [activeStory, setActiveStory] = useState(null);
  const closeButtonRef = useRef(null);

  const [stories, setStories] = useState([]);
  const [featuredData, setFeaturedData] = useState({ featured: null, editorsPick: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favIds, setFavIds] = useState([]);
  const [favMessage, setFavMessage] = useState("");

  const genres = useMemo(
    () => ["All genres", ...Array.from(new Set(stories.flatMap((s) => s.genres))).sort()],
    [stories]
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [list, feat] = await Promise.all([api("/manga"), api("/manga/featured")]);
        if (cancelled) return;
        setStories(list.map(toStory));
        setFeaturedData({
          featured: feat.featured ? toStory(feat.featured) : null,
          editorsPick: feat.editorsPick ? toStory(feat.editorsPick) : null,
        });
        setError("");
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
      try {
        const favs = await api("/favourites");
        if (!cancelled) setFavIds(favs.map((x) => x._id));
      } catch (err) {
        if (!cancelled) setFavMessage(err.message);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleFavourite(story) {
    const isFav = favIds.includes(story.id);
    setFavMessage("Saving...");
    try {
      await api("/favourites/" + story.id, { method: isFav ? "DELETE" : "POST" });
      setFavIds(isFav ? favIds.filter((i) => i !== story.id) : [...favIds, story.id]);
      setFavMessage(isFav ? "Removed from favourites." : "Added to favourites.");
    } catch (err) {
      setFavMessage(err.message);
    }
  }

  const filteredStories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stories.filter((story) => {
      const matchesSearch =
        !q ||
        story.title.toLowerCase().includes(q) ||
        story.genres.join(" ").toLowerCase().includes(q);
      const matchesGenre = genre === "All genres" || story.genres.includes(genre);
      const matchesStatus = status === "All" || story.status === status;
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [stories, search, genre, status]);

  /* "Order by" controls the first section */
  const browseStories = useMemo(
    () => sortStories(filteredStories, sort),
    [filteredStories, sort]
  );

  const latestStories = useMemo(
    () =>
      [...filteredStories].sort(
        (a, b) => a.updatedDaysAgo - b.updatedDaysAgo || String(b.id).localeCompare(String(a.id))
      ),
    [filteredStories]
  );

  const topRatedStories = useMemo(
    () => [...stories].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [stories]
  );

  useEffect(() => {
    if (!activeStory) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveStory(null);
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    setFavMessage("");

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeStory]);

  function resetFilters() {
    setSearch("");
    setGenre("All genres");
    setStatus("All");
    setSort("Popular");
  }

  function scrollToSection(id) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showOngoing() {
    setStatus("Ongoing");
    scrollToSection("popular");
  }

  function handleRead(story) {
    if (onRead) onRead(story);
    setActiveStory(null);
  }

  const heading = sortHeadings[sort];

  return (
    <main className="catalog-page">
      <header className="catalog-navbar">
        <button
            type="button"
            className="catalog-brand"
            onClick={onBack}
            aria-label="Back to Chapterly home"
            >
            <BrandLogo className="catalog-brand-logo" />
         </button>

        <nav className="catalog-nav" aria-label="Main">
          <button type="button" onClick={() => scrollToSection("home")}>
            Home
          </button>
          <button type="button" onClick={() => scrollToSection("popular")}>
            Popular
          </button>
          <button type="button" onClick={() => scrollToSection("latest")}>
            Latest
          </button>
          <button type="button" onClick={showOngoing}>
            Ongoing
          </button>
          <button type="button" onClick={() => scrollToSection("filters")}>
            Filters
          </button>
          <button type="button" onClick={() => scrollToSection("top-rated")}>
            Top rated
          </button>
        </nav>

        <label className="navbar-search">
          <input
            type="search"
            placeholder="Search stories..."
            aria-label="Search stories"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span aria-hidden="true">⌕</span>
        </label>
      </header>

      <div className="catalog-layout" id="home">
        <section className="catalog-main">
          {loading && <p className="sidebar-caption">Loading stories...</p>}
          {error && (
            <div className="no-results">
              <p>{error}</p>
            </div>
          )}
          <div className="featured-grid">
            <button
              type="button"
              className="featured-card featured-large"
              onClick={() => featuredData.featured && setActiveStory(featuredData.featured)}
            >
              <span className="featured-decoration" aria-hidden="true">海</span>
              <span className="featured-copy">
                <span className="featured-label">FEATURED STORY</span>
                <strong>{featuredData.featured ? featuredData.featured.title : "Coming soon"}</strong>
                <span>{featuredData.featured ? featuredData.featured.genre : ""}</span>
                <span className="featured-link">Explore story ↗</span>
              </span>
            </button>

            <button
              type="button"
              className="featured-card featured-small"
              onClick={() => featuredData.editorsPick && setActiveStory(featuredData.editorsPick)}
            >
              <span className="featured-decoration" aria-hidden="true">花</span>
              <span className="featured-copy">
                <span className="featured-label">EDITOR'S PICK</span>
                <strong>{featuredData.editorsPick ? featuredData.editorsPick.title : "Coming soon"}</strong>
                <span>{featuredData.editorsPick ? featuredData.editorsPick.genre : ""}</span>
              </span>
            </button>
          </div>

          {/* Genre chips: one-tap filtering */}
          <div className="genre-chips" role="group" aria-label="Filter by genre">
            {genres.map((item) => (
              <button
                type="button"
                key={item}
                className={`genre-chip${genre === item ? " is-active" : ""}`}
                aria-pressed={genre === item}
                onClick={() => setGenre(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <section className="catalog-section" id="popular">
            <div className="catalog-section-heading">
              <div>
                <span className="section-eyebrow">{heading.eyebrow}</span>
                <h2>
                  {heading.title}
                  <span>.</span>
                </h2>
              </div>
              <span className="section-count">
                {browseStories.length}{" "}
                {browseStories.length === 1 ? "STORY" : "STORIES"}
              </span>
            </div>

            {browseStories.length ? (
              <div className="catalog-grid">
                {browseStories.slice(0, 6).map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onSelect={setActiveStory}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No stories match your filters.</p>
                <button
                  type="button"
                  className="filter-button no-results-button"
                  onClick={resetFilters}
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>

          <section className="catalog-section" id="latest">
            <div className="catalog-section-heading">
              <div>
                <span className="section-eyebrow">FRESH FROM THE PAGE</span>
                <h2>
                  Latest updates<span>.</span>
                </h2>
              </div>
              <span className="section-count">RECENT CHAPTERS</span>
            </div>

            {latestStories.length ? (
              <div className="catalog-grid">
                {latestStories.slice(0, 6).map((story) => (
                  <div key={story.id} className="latest-item">
                    <StoryCard story={story} onSelect={setActiveStory} />
                    <p className="latest-updated">
                      {formatUpdated(story.updatedDaysAgo)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>Try changing your filters.</p>
                <button
                  type="button"
                  className="filter-button no-results-button"
                  onClick={resetFilters}
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>
        </section>

        <aside className="catalog-sidebar">
          <section className="filter-panel" id="filters">
            <div className="sidebar-heading">
              <h3>Filter search</h3>
              <span aria-hidden="true">✳</span>
            </div>

            <label className="filter-label">
              Genre
              <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                {genres.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="filter-label">
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="filter-label">
              Order by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {sortOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="filter-button"
              onClick={resetFilters}
            >
              Reset filters ↺
            </button>
          </section>

          <section className="top-rated-panel" id="top-rated">
            <div className="sidebar-heading">
              <h3>Top rated</h3>
              <span aria-hidden="true">★</span>
            </div>
            <p className="sidebar-caption">COMMUNITY FAVOURITES</p>

            {topRatedStories.map((story, index) => (
              <button
                type="button"
                className="rated-story"
                key={story.id}
                onClick={() => setActiveStory(story)}
              >
                <span className={`rated-cover art-${story.cover}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rated-details">
                  <strong>{story.title}</strong>
                  <span>{story.genre}</span>
                  <span className="rated-score">
                    ★ {story.rating.toFixed(1)}
                  </span>
                </span>
              </button>
            ))}
          </section>
        </aside>
      </div>

      <footer className="catalog-footer">
        <span>
          chapterly<span className="brand-dot">.</span>
        </span>
        <p>READ · DISCOVER · REPEAT</p>
        <p>MADE FOR THE LOVE OF STORIES ✦</p>
      </footer>

      {activeStory && (
        <div className="story-overlay" onClick={() => setActiveStory(null)}>
          <section
            className="story-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={activeStory.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              ref={closeButtonRef}
              className="story-close"
              onClick={() => setActiveStory(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>{activeStory.title}</h2>
            <p>{activeStory.description}</p>
            <p className="dialog-meta">
              {activeStory.status} · {activeStory.chapter} · ★{" "}
              {activeStory.rating.toFixed(1)} · {formatViews(activeStory.views)}{" "}
              views
            </p>

            <button
              type="button"
              className="filter-button dialog-read"
              onClick={() => handleRead(activeStory)}
            >
              Read now
            </button>

            <button
              type="button"
              className="filter-button dialog-read"
              onClick={() => toggleFavourite(activeStory)}
            >
              {favIds.includes(activeStory.id) ? "Remove from favourites" : "Add to favourites"}
            </button>
            {favMessage && <p className="dialog-note">{favMessage}</p>}

            <p className="dialog-note">
              Sample story for the hackathon prototype. The reading page will
              be connected separately.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
