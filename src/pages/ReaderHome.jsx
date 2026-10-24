
import { useEffect, useMemo, useRef, useState } from "react";
import "./ReaderHome.css";
import BrandLogo from "../components/BrandLogo";
import { api } from "../api";

const COVER_ARTS = ["ocean", "petals", "shrine", "night", "crimson", "days"];

const MANGA_COVERS = {
  thehousehusband: "thehousehusband.jpeg",
  steelballrun: "steelballrun.jpeg",
  spyxfamily: "spyxfamily.jpeg",
  sakamotodays: "sakamotodays.jpeg",
  jujutsukaisen: "jjk.jpeg",
  jjk: "jjk.jpeg",
  retouroursources: "retouroursources.jpeg",
  orange: "orange.jpeg",
  naruto: "naruto.jpeg",
  chainsawman: "chainsawman.jpeg",
  monster: "monster.jpeg",
  deathnote: "deathnote.jpeg",
  loveatfirstsight: "loveatfirstsight.jpeg",
  onepunchman: "onepunchman.jpeg",
  bungoustraydogs: "bungoustraydogs.jpeg",
  haikyuu: "haikyuu.jpeg",
  beastars: "beastars.jpeg",
  aoharuride: "aoharuride.jpeg",
  crushofalifetime: "crushofalifetime.jpeg",
  fruitsbasket: "fruitsbasket.jpeg",
  horimiya: "horimiya.jpeg",
  ihateyoutoo: "ihateyoutoo.jpeg",
  myheroacademia: "myheroacademia.jpeg",
  onepiece: "onepiece.jpeg",
  demonslayer: "demonslayer.jpeg",
  jojos: "jojos.jpeg",
  jojosbizarreadventure: "jojos.jpeg",
  mynewboyfriend: "mynewboyfriend.jpeg",
};

function normalizeTitle(title = "") {
  return String(title).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getMangaCover(title = "") {
  const filename = MANGA_COVERS[normalizeTitle(title)];
  return filename ? `/covers/${filename}` : "";
}

function toStory(m) {
  const genres = m.genres?.length ? m.genres : ["Other"];
  const updatedAt = new Date(m.updatedAt).getTime();
  const days = Number.isFinite(updatedAt)
    ? Math.max(0, Math.floor((Date.now() - updatedAt) / 86400000))
    : 0;

  return {
    id: m._id,
    title: m.title || "Untitled",
    genres,
    genre: genres.join(" · "),
    status: m.status
      ? m.status.charAt(0).toUpperCase() + m.status.slice(1)
      : "Ongoing",
    rating: Number(m.rating) || 0,
    views: Number(m.views) || 0,
    chapter: "Chapter " + (m.latestChapter ?? 0),
    updatedDaysAgo: days,
    cover:
      COVER_ARTS[
        (parseInt(String(m._id).slice(-2), 16) || 0) %
          COVER_ARTS.length
      ],
    image: getMangaCover(m.title),
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
  return n >= 1000
    ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : String(n);
}

function formatUpdated(days) {
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  return `Updated ${days} days ago`;
}

function sortStories(list, sort) {
  const copy = [...list];

  if (sort === "Top rated") {
    return copy.sort((a, b) => b.rating - a.rating);
  }

  if (sort === "Title A–Z") {
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  }

  return copy.sort((a, b) => b.views - a.views);
}

function coverStyle(story) {
  if (!story?.image) return undefined;

  return {
    backgroundImage: `url("${story.image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

function StoryCard({ story, onSelect }) {
  return (
    <article className="catalog-card">
      <button
        type="button"
        className={`catalog-cover art-${story.cover}`}
        style={coverStyle(story)}
        onClick={() => onSelect(story)}
        aria-label={`View ${story.title}`}
      >
        {!story.image && (
          <>
            <span className="cover-edition">CHAPTERLY</span>
            <span className="cover-kanji" aria-hidden="true">
              物語
            </span>
            <span className="cover-name">{story.title}</span>
            <span className="cover-genre">{story.genre}</span>
          </>
        )}
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
  const [featuredData, setFeaturedData] = useState({
    featured: null,
    editorsPick: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favIds, setFavIds] = useState([]);
  const [favMessage, setFavMessage] = useState("");

  // Return to the parent page; fall back to the root URL.
  function handleBack() {
    if (typeof onBack === "function") {
      onBack();
    } else {
      window.location.assign("/");
    }
  }

  const genres = useMemo(
    () => [
      "All genres",
      ...Array.from(new Set(stories.flatMap((s) => s.genres))).sort(),
    ],
    [stories]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [list, feat] = await Promise.all([
          api("/manga"),
          api("/manga/featured"),
        ]);

        if (cancelled) return;

        setStories(list.map(toStory));

        setFeaturedData({
          featured: feat.featured ? toStory(feat.featured) : null,
          editorsPick: feat.editorsPick
            ? toStory(feat.editorsPick)
            : null,
        });

        setError("");
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load manga.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }

      try {
        const favs = await api("/favourites");
        if (!cancelled) {
          setFavIds(favs.map((x) => x._id));
        }
      } catch (err) {
        if (!cancelled) {
          setFavMessage(err.message || "Unable to load favourites.");
        }
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
      await api("/favourites/" + story.id, {
        method: isFav ? "DELETE" : "POST",
      });

      setFavIds((previous) =>
        isFav
          ? previous.filter((id) => id !== story.id)
          : [...previous, story.id]
      );

      setFavMessage(
        isFav ? "Removed from favourites." : "Added to favourites."
      );
    } catch (err) {
      setFavMessage(err.message || "Could not update favourites.");
    }
  }

  const filteredStories = useMemo(() => {
    const q = search.trim().toLowerCase();

    return stories.filter((story) => {
      const matchesSearch =
        !q ||
        story.title.toLowerCase().includes(q) ||
        story.genres.join(" ").toLowerCase().includes(q);

      const matchesGenre =
        genre === "All genres" || story.genres.includes(genre);

      const matchesStatus = status === "All" || story.status === status;

      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [stories, search, genre, status]);

  const browseStories = useMemo(
    () => sortStories(filteredStories, sort),
    [filteredStories, sort]
  );

  const latestStories = useMemo(
    () =>
      [...filteredStories].sort(
        (a, b) =>
          a.updatedDaysAgo - b.updatedDaysAgo ||
          String(b.id).localeCompare(String(a.id))
      ),
    [filteredStories]
  );

  const topRatedStories = useMemo(
    () => [...stories].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [stories]
  );

  useEffect(() => {
    if (!activeStory) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveStory(null);
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
          className="catalog-back-button"
          onClick={handleBack}
        >
          ← Back
        </button>

        <button
          type="button"
          className="catalog-brand"
          onClick={handleBack}
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
            onChange={(event) => setSearch(event.target.value)}
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
              onClick={() =>
                featuredData.featured &&
                setActiveStory(featuredData.featured)
              }
              style={coverStyle(featuredData.featured)}
              disabled={!featuredData.featured}
            >
              {!featuredData.featured?.image && (
                <span className="featured-decoration" aria-hidden="true">
                  海
                </span>
              )}
              <span className="featured-copy">
                <span className="featured-label">FEATURED STORY</span>
                <strong>
                  {featuredData.featured
                    ? featuredData.featured.title
                    : "Coming soon"}
                </strong>
                <span>{featuredData.featured?.genre || ""}</span>
                <span className="featured-link">Explore story ↗</span>
              </span>
            </button>

            <button
              type="button"
              className="featured-card featured-small"
              onClick={() =>
                featuredData.editorsPick &&
                setActiveStory(featuredData.editorsPick)
              }
              style={coverStyle(featuredData.editorsPick)}
              disabled={!featuredData.editorsPick}
            >
              {!featuredData.editorsPick?.image && (
                <span className="featured-decoration" aria-hidden="true">
                  花
                </span>
              )}
              <span className="featured-copy">
                <span className="featured-label">EDITOR'S PICK</span>
                <strong>
                  {featuredData.editorsPick
                    ? featuredData.editorsPick.title
                    : "Coming soon"}
                </strong>
                <span>{featuredData.editorsPick?.genre || ""}</span>
              </span>
            </button>
          </div>

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
              !loading && (
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
              )
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
              !loading && (
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
              )
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
              <select
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
              >
                {genres.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="filter-label">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="filter-label">
              Order by
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
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
                <span
                  className={`rated-cover art-${story.cover}`}
                  style={coverStyle(story)}
                >
                  {!story.image && String(index + 1).padStart(2, "0")}
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
            onClick={(event) => event.stopPropagation()}
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

            {activeStory.image && (
              <img
                className="story-dialog-cover"
                src={activeStory.image}
                alt={`${activeStory.title} manga cover`}
              />
            )}

            <h2>{activeStory.title}</h2>
            <p>
              {activeStory.description || "Discover this story on Chapterly."}
            </p>
            <p className="dialog-meta">
              {activeStory.status} · {activeStory.chapter} · ★{" "}
              {activeStory.rating.toFixed(1)} · {formatViews(activeStory.views)} views
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
              {favIds.includes(activeStory.id)
                ? "Remove from favourites"
                : "Add to favourites"}
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
