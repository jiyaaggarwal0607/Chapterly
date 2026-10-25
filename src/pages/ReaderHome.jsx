
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

const LOCAL_STORIES = [
  { id: 1, title: "The House Husband", genre: "Slice of Life", status: "Ongoing", rating: 9.4, views: 24300, chapter: "Chapter 24", updatedDaysAgo: 0, cover: "ocean", image: "/covers/thehousehusband.jpeg" },
  { id: 2, title: "Steel Ball Run", genre: "Adventure", status: "Completed", rating: 9.7, views: 18600, chapter: "Chapter 18", updatedDaysAgo: 1, cover: "petals", image: "/covers/steelballrun.jpeg" },
  { id: 3, title: "Spy x Family", genre: "Mystery", status: "Ongoing", rating: 9.2, views: 32100, chapter: "Chapter 32", updatedDaysAgo: 0, cover: "shrine", image: "/covers/spyxfamily.jpeg" },
  { id: 4, title: "Sakamoto Days", genre: "Slice of Life", status: "Ongoing", rating: 9.5, views: 12800, chapter: "Chapter 12", updatedDaysAgo: 2, cover: "night", image: "/covers/sakamotodays.jpeg" },
  { id: 5, title: "Jujutsu Kaisen", genre: "Action", status: "Completed", rating: 8.9, views: 45200, chapter: "Chapter 20", updatedDaysAgo: 3, cover: "crimson", image: "/covers/jjk.jpeg" },
  { id: 6, title: "Retour Our Sources", genre: "Romance", status: "Ongoing", rating: 9.1, views: 9500, chapter: "Chapter 15", updatedDaysAgo: 0, cover: "days", image: "/covers/retouroursources.jpeg" },
  { id: 7, title: "Orange", genre: "Slice of Life", status: "Ongoing", rating: 8.6, views: 89000, chapter: "Chapter 27", updatedDaysAgo: 9, cover: "days", image: "/covers/orange.jpeg" },
  { id: 8, title: "Naruto", genre: "Adventure", status: "Completed", rating: 9.1, views: 76800, chapter: "Chapter 28", updatedDaysAgo: 28, cover: "days", image: "/covers/naruto.jpeg" },
  { id: 9, title: "Chainsaw Man", genre: "Action", status: "Ongoing", rating: 8.9, views: 8000, chapter: "Chapter 17", updatedDaysAgo: 3, cover: "days", image: "/covers/chainsawman.jpeg" },
  { id: 10, title: "Monster", genre: "Action", status: "Ongoing", rating: 8.4, views: 7600, chapter: "Chapter 10", updatedDaysAgo: 0, cover: "days", image: "/covers/monster.jpeg" },
  { id: 11, title: "Death Note", genre: "Mystery", status: "Completed", rating: 9.5, views: 1200, chapter: "Chapter 12", updatedDaysAgo: 9, cover: "days", image: "/covers/deathnote.jpeg" },
  { id: 12, title: "Love at First Sight", genre: "Romance", status: "Ongoing", rating: 7.9, views: 3000, chapter: "Chapter 8", updatedDaysAgo: 0, cover: "days", image: "/covers/loveatfirstsight.jpeg" },
  { id: 13, title: "One Punch Man", genre: "Action", status: "Completed", rating: 9.1, views: 8600, chapter: "Chapter 23", updatedDaysAgo: 7, cover: "days", image: "/covers/onepunchman.jpeg" },
  { id: 14, title: "Bungou Stray Dogs", genre: "Action", status: "Ongoing", rating: 8.7, views: 4800, chapter: "Chapter 3", updatedDaysAgo: 6, cover: "days", image: "/covers/bungoustraydogs.jpeg" },
  { id: 15, title: "Haikyuu", genre: "Slice of Life", status: "Ongoing", rating: 9.2, views: 8000, chapter: "Chapter 25", updatedDaysAgo: 0, cover: "days", image: "/covers/haikyuu.jpeg" },
];

const statuses = ["All", "Ongoing", "Completed"];
const sortOptions = ["Popular", "Top rated", "Title A–Z"];

const sortHeadings = {
  Popular: { eyebrow: "FAN FAVOURITES", title: "Most popular" },
  "Top rated": { eyebrow: "HIGHEST SCORES", title: "Top rated stories" },
  "Title A–Z": { eyebrow: "BROWSE ALL", title: "All stories" },
};

function normalizeTitle(title = "") {
  return String(title).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getMangaCover(title = "") {
  const filename = MANGA_COVERS[normalizeTitle(title)];
  return filename ? `/covers/${filename}` : "";
}

function toStory(m) {
  const title = m.title || "Untitled";
  const fallback = LOCAL_STORIES.find(
    (story) => normalizeTitle(story.title) === normalizeTitle(title)
  );

  const genres =
    Array.isArray(m.genres) && m.genres.length
      ? m.genres
      : [m.genre || fallback?.genre || "Other"];

  const updatedAt = new Date(m.updatedAt).getTime();
  const days = Number.isFinite(updatedAt)
    ? Math.max(0, Math.floor((Date.now() - updatedAt) / 86400000))
    : fallback?.updatedDaysAgo ?? 0;

  const statusValue = String(m.status || fallback?.status || "Ongoing");
  const status =
    statusValue.charAt(0).toUpperCase() +
    statusValue.slice(1).toLowerCase();

  return {
    id: m._id || fallback?.id || normalizeTitle(title),
    title,
    genres,
    genre: genres.join(" · "),
    status,
    rating: Number(m.rating ?? fallback?.rating) || 0,
    views: Number(m.views ?? fallback?.views) || 0,
    chapter: `Chapter ${
      m.latestChapter ??
      fallback?.chapter?.replace("Chapter ", "") ??
      0
    }`,
    updatedDaysAgo: m.updatedAt ? days : fallback?.updatedDaysAgo ?? 0,
    cover:
      fallback?.cover ||
      COVER_ARTS[
        (parseInt(String(m._id || "").slice(-2), 16) || 0) %
          COVER_ARTS.length
      ],
    // Prefer the known local cover. Unknown titles retain their API cover if provided.
    image:
      getMangaCover(title) ||
      fallback?.image ||
      m.coverImage ||
      m.cover ||
      "",
    description: m.description || "",
  };
}

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
  if (sort === "Top rated") return copy.sort((a, b) => b.rating - a.rating);
  if (sort === "Title A–Z") return copy.sort((a, b) => a.title.localeCompare(b.title));
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
            <span className="cover-kanji" aria-hidden="true">物語</span>
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

  const [stories, setStories] = useState(LOCAL_STORIES);
  const [useLocalCoversOnly] = useState(true);
  const [featuredData, setFeaturedData] = useState({
    featured: LOCAL_STORIES.find((s) => s.id === 12),
    editorsPick: LOCAL_STORIES.find((s) => s.id === 2),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favIds, setFavIds] = useState([]);
  const [favMessage, setFavMessage] = useState("");

  function handleBack() {
    if (typeof onBack === "function") onBack();
    else window.location.assign("/");
  }

  const genres = useMemo(
    () => [
      "All genres",
      ...Array.from(
        new Set(stories.flatMap((s) => s.genres || [s.genre]))
      ).sort(),
    ],
    [stories]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadManga() {
      try {
        const [list, feat] = await Promise.all([
          api("/manga"),
          api("/manga/featured"),
        ]);

        if (cancelled) return;

        // Only replace the sample catalogue when the API returns usable manga.
        if (!useLocalCoversOnly && Array.isArray(list) && list.length > 0) {
            setStories(list.map(toStory));
        }

        if (feat?.featured || feat?.editorsPick) {
          setFeaturedData((previous) => ({
            featured: feat.featured
              ? toStory(feat.featured)
              : previous.featured,
            editorsPick: feat.editorsPick
              ? toStory(feat.editorsPick)
              : previous.editorsPick,
          }));
        }
      } catch {
        if (!cancelled) {
          setError(
            "Showing the sample catalogue. Live manga data is unavailable right now."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadFavourites() {
      try {
        const favs = await api("/favourites");
        if (!cancelled && Array.isArray(favs)) {
          setFavIds(favs.map((x) => x._id));
        }
      } catch {
        // Browsing still works if favourites are unavailable.
      }
    }

    loadManga();
    loadFavourites();

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
      setFavMessage(err.message || "Favourites need a working backend.");
    }
  }

  const filteredStories = useMemo(() => {
    const q = search.trim().toLowerCase();

    return stories.filter((story) => {
      const storyGenres = story.genres || [story.genre];

      const matchesSearch =
        !q ||
        story.title.toLowerCase().includes(q) ||
        storyGenres.join(" ").toLowerCase().includes(q);

      const matchesGenre =
        genre === "All genres" || storyGenres.includes(genre);

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
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
          <button type="button" onClick={() => scrollToSection("home")}>Home</button>
          <button type="button" onClick={() => scrollToSection("popular")}>Popular</button>
          <button type="button" onClick={() => scrollToSection("latest")}>Latest</button>
          <button type="button" onClick={showOngoing}>Ongoing</button>
          <button type="button" onClick={() => scrollToSection("filters")}>Filters</button>
          <button type="button" onClick={() => scrollToSection("top-rated")}>Top rated</button>
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
          {loading && <p className="sidebar-caption">Refreshing stories...</p>}
          {error && <p className="sidebar-caption">{error}</p>}

          <div className="featured-grid">
            {[
              {
                story: featuredData.featured,
                className: "featured-large",
                label: "FEATURED STORY",
                symbol: "海",
              },
              {
                story: featuredData.editorsPick,
                className: "featured-small",
                label: "EDITOR'S PICK",
                symbol: "花",
              },
            ].map(({ story, className, label, symbol }) => (
              <button
                key={label}
                type="button"
                className={`featured-card ${className}`}
                onClick={() => story && setActiveStory(story)}
                style={coverStyle(story)}
                disabled={!story}
              >
                {!story?.image && (
                  <span className="featured-decoration" aria-hidden="true">
                    {symbol}
                  </span>
                )}

                <span className="featured-copy">
                  <span className="featured-label">{label}</span>
                  <strong>{story?.title || "Coming soon"}</strong>
                  <span>{story?.genre || ""}</span>
                  {label === "FEATURED STORY" && (
                    <span className="featured-link">Explore story ↗</span>
                  )}
                </span>
              </button>
            ))}
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
                <h2>{heading.title}<span>.</span></h2>
              </div>
              <span className="section-count">
                {browseStories.length} {browseStories.length === 1 ? "STORY" : "STORIES"}
              </span>
            </div>

            {browseStories.length ? (
              <div className="catalog-grid">
                {browseStories.slice(0, 6).map((story) => (
                  <StoryCard key={story.id} story={story} onSelect={setActiveStory} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No stories match your filters.</p>
                <button type="button" className="filter-button no-results-button" onClick={resetFilters}>
                  Reset filters
                </button>
              </div>
            )}
          </section>

          <section className="catalog-section" id="latest">
            <div className="catalog-section-heading">
              <div>
                <span className="section-eyebrow">FRESH FROM THE PAGE</span>
                <h2>Latest updates<span>.</span></h2>
              </div>
              <span className="section-count">RECENT CHAPTERS</span>
            </div>

            {latestStories.length ? (
              <div className="catalog-grid">
                {latestStories.slice(0, 6).map((story) => (
                  <div key={story.id} className="latest-item">
                    <StoryCard story={story} onSelect={setActiveStory} />
                    <p className="latest-updated">{formatUpdated(story.updatedDaysAgo)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>Try changing your filters.</p>
                <button type="button" className="filter-button no-results-button" onClick={resetFilters}>
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
              <select value={genre} onChange={(event) => setGenre(event.target.value)}>
                {genres.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>

            <label className="filter-label">
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                {statuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>

            <label className="filter-label">
              Order by
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                {sortOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>

            <button type="button" className="filter-button" onClick={resetFilters}>
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
                <span className={`rated-cover art-${story.cover}`} style={coverStyle(story)}>
                  {!story.image && String(index + 1).padStart(2, "0")}
                </span>
                <span className="rated-details">
                  <strong>{story.title}</strong>
                  <span>{story.genre}</span>
                  <span className="rated-score">★ {story.rating.toFixed(1)}</span>
                </span>
              </button>
            ))}
          </section>
        </aside>
      </div>

      <footer className="catalog-footer">
        <span>chapterly<span className="brand-dot">.</span></span>
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
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}

            <h2>{activeStory.title}</h2>
            <p>{activeStory.description || "Discover this story on Chapterly."}</p>
            <p className="dialog-meta">
              {activeStory.status} · {activeStory.chapter} · ★{" "}
              {activeStory.rating.toFixed(1)} · {formatViews(activeStory.views)} views
            </p>

            <button type="button" className="filter-button dialog-read" onClick={() => handleRead(activeStory)}>
              Read now
            </button>

            <button type="button" className="filter-button dialog-read" onClick={() => toggleFavourite(activeStory)}>
              {favIds.includes(activeStory.id) ? "Remove from favourites" : "Add to favourites"}
            </button>

            {favMessage && <p className="dialog-note">{favMessage}</p>}
            <p className="dialog-note">
              Sample story for the hackathon prototype. The reading page will be connected separately.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
