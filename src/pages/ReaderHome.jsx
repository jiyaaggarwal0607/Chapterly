import { useEffect, useMemo, useRef, useState } from "react";
import "./ReaderHome.css";
import BrandLogo from "../components/BrandLogo";
const stories = [
  {
    id: 1,
    title: "The House Husband",
    genre: "Slice of Life",
    status: "Ongoing",
    rating: 9.4,
    views: 24300,
    chapter: "Chapter 24",
    updatedDaysAgo: 0,
    cover: "ocean",
    image: "/covers/thehousehusband.jpeg",
   
  },
  {
    id: 2,
    title: "Steel Ball Run",
    genre: "Adventure",
    status: "Completed",
    rating: 9.7,
    views: 18600,
    chapter: "Chapter 18",
    updatedDaysAgo: 1,
    cover: "petals",
    image: "/covers/steelballrun.jpeg",
    
  },
  {
    id: 3,
    title: "Spy x Family",
    genre: "Mystery",
    status: "Ongoing",
    rating: 9.2,
    views: 32100,
    chapter: "Chapter 32",
    updatedDaysAgo: 0,
    cover: "shrine",
    image: "/covers/spyxfamily.jpeg",
    
  },
  {
    id: 4,
    title: "Sakamoto Days",
    genre: "Slice of Life",
    status: "Ongoing",
    rating: 9.5,
    views: 12800,
    chapter: "Chapter 12",
    updatedDaysAgo: 2,
    cover: "night",
    image: "/covers/sakamotodays.jpeg",
    
  },
  {
    id: 5,
    title: "Jujutsu Kaisen",
    genre: "Action", 
    status: "Completed",
    rating: 8.9,
    views: 45200,
    chapter: "Chapter 20",
    updatedDaysAgo: 3,
    cover: "crimson",
    image: "/covers/jjk.jpeg",
    
  },
  {
    id: 6,
    title: "Retour Our Sources",
    genre: "Romance",
    status: "Ongoing",
    rating: 9.1,
    views: 9500,
    chapter: "Chapter 15",
    updatedDaysAgo: 0,
    cover: "days",
    image: "/covers/retouroursources.jpeg",
    
  },
  {
    id: 7,
    title: "Orange",
    genre: "Slice of Life",
    status: "Ongoing",
    rating: 8.6,
    views: 89000,
    chapter: "Chapter 27",
    updatedDaysAgo: 9,
    cover: "days",
    image: "/covers/orange.jpeg",
    
  },
  {
    id: 8,
    title: "Naruto",
    genre: "Adventure",
    status: "Completed",
    rating: 9.1,
    views: 76800,
    chapter: "Chapter 28",
    updatedDaysAgo: 28,
    cover: "days",
    image: "/covers/naruto.jpeg",
    
  },
  {
    id: 9,
    title: "Chainsaw Man",
    genre: "Action",
    status: "Ongoing",
    rating: 8.9,
    views: 8000,
    chapter: "Chapter 17",
    updatedDaysAgo: 3,
    cover: "days",
    image: "/covers/chainsawman.jpeg",
    
  },
  {
    id: 10,
    title: "Monster",
    genre: "Action",
    status: "Ongoing",
    rating: 8.4,
    views: 7600,
    chapter: "Chapter 10",
    updatedDaysAgo: 0,
    cover: "days",
    image: "/covers/monster.jpeg",
    
  },
  {
    id: 11,
    title: "Death Note",
    genre: "Mystery",
    status: "Completed",
    rating: 9.5,
    views: 1200,
    chapter: "Chapter 12",
    updatedDaysAgo: 9,
    cover: "days",
    image: "/covers/deathnote.jpeg",
    
  },
  {
    id: 12,
    title: "Love at First Sight",
    genre: "Romance",
    status: "Ongoing",
    rating: 7.9,
    views: 3000,
    chapter: "Chapter 8",
    updatedDaysAgo: 0,
    cover: "days",
    image: "/covers/loveatfirstsight.jpeg",
    
  },
  {
    id: 13,
    title: "One Punch Man",
    genre: "Action",
    status: "Completed",
    rating: 9.1,
    views: 8600,
    chapter: "Chapter 23",
    updatedDaysAgo: 7,
    cover: "days",
    image: "/covers/onepunchman.jpeg",
    
  },
  {
    id: 14,
    title: "Bungou Stray Dogs",
    genre: "Action",
    status: "Ongoing",
    rating: 8.7,
    views: 4800,
    chapter: "Chapter 3",
    updatedDaysAgo: 6,
    cover: "days",
    image: "/covers/bungoustraydogs.jpeg",
    
  },
  {
    id: 15,
    title: "Haikyuu",
    genre: "Slice of Life",
    status: "Ongoing",
    rating: 9.2,
    views: 8000,
    chapter: "Chapter 25",
    updatedDaysAgo: 0,
    cover: "days",
    image: "/covers/haikyuu.jpeg",
    
  },
];

const genres = [
  "All genres",
  "Action",
  "Adventure",
  "Romance",
  "Fantasy",
  "Mystery",
  "Slice of Life",
];

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
        style={
  story.image
    ? {
        backgroundImage: `url(${story.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined
}
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

  const filteredStories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stories.filter((story) => {
      const matchesSearch =
        !q ||
        story.title.toLowerCase().includes(q) ||
        story.genre.toLowerCase().includes(q);
      const matchesGenre = genre === "All genres" || story.genre === genre;
      const matchesStatus = status === "All" || story.status === status;
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [search, genre, status]);

  /* "Order by" controls the first section */
  const browseStories = useMemo(
    () => sortStories(filteredStories, sort),
    [filteredStories, sort]
  );

  const featuredStory = stories.find((s) => s.id === 12);
const editorsPick = stories.find((s) => s.id === 2);
  const latestStories = useMemo(
    () =>
      [...filteredStories].sort(
        (a, b) => a.updatedDaysAgo - b.updatedDaysAgo || b.id - a.id
      ),
    [filteredStories]
  );

  const topRatedStories = useMemo(
    () => [...stories].sort((a, b) => b.rating - a.rating).slice(0, 5),
    []
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
          <div className="featured-grid">
            <button
  type="button"
  className="featured-card featured-large"
  onClick={() => setActiveStory(featuredStory)}
  style={
    featuredStory.image
      ? {
          backgroundImage: `url(${featuredStory.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : undefined
  }
>
  <span className="featured-decoration" aria-hidden="true">海</span>
  <span className="featured-copy">
    <span className="featured-label">FEATURED STORY</span>
    <strong>{featuredStory.title}</strong>
    <span>{featuredStory.genre}</span>
    <span className="featured-link">Explore story ↗</span>
  </span>
</button>

            <button
  type="button"
  className="featured-card featured-small"
  onClick={() => setActiveStory(editorsPick)}
  style={
    editorsPick.image
      ? {
          backgroundImage: `url(${editorsPick.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : undefined
  }
>
  <span className="featured-decoration" aria-hidden="true">花</span>
  <span className="featured-copy">
    <span className="featured-label">EDITOR'S PICK</span>
    <strong>{editorsPick.title}</strong>
    <span>{editorsPick.genre}</span>
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
                {browseStories.map((story) => (
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
                {latestStories.map((story) => (
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
                <span
  className={`rated-cover art-${story.cover}`}
  style={
    story.image
      ? {
          backgroundImage: `url(${story.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : undefined
  }
>
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