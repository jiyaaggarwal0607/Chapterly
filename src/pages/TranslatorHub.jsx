
import { useEffect, useMemo, useState } from "react";
import "./TranslatorHub.css";
import BrandLogo from "../components/BrandLogo";
import { api } from "../api";
function toTask(p) {
  return {
    id: p._id,
    title: p.title,
    type: p.taskType,
    from: p.fromLanguage,
    to: p.toLanguage,
    level: p.level,
    payment: p.paid ? "Paid opportunity" : "Unpaid opportunity",
    description: p.description || "",
    tag: p.badge || "Open",
  };
}

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

function toApplication(a) {
  return {
    key: a._id,
    id: "APP-" + String(a._id).slice(-6).toUpperCase(),
    title: a.project ? a.project.title : "General Translator Application",
    languages: a.languagePair || "",
    level: a.experienceLevel || "",
    status: cap(a.status),
    submittedAt: new Date(a.createdAt).toLocaleDateString("en-IN"),
  };
}

export default function TranslatorHub({ onBack }) {
  const [language, setLanguage] = useState("All languages");
  const [taskType, setTaskType] = useState("All tasks");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  async function loadApplications() {
    try {
      const list = await api("/translation/applications");
      setApplications(list.map(toApplication));
    } catch (err) {
      setFormError(err.message);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await api("/translation/projects");
        if (!cancelled) {
          setOpportunities(list.map(toTask));
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
      loadApplications();
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  const [form, setForm] = useState({
    name: "",
    email: "",
    languages: "Japanese to English",
    level: "Beginner",
    portfolio: "",
    motivation: "",
  });

  const filteredTasks = useMemo(() => {
    return opportunities.filter((task) => {
      const matchesSearch =
        `${task.title} ${task.description} ${task.type}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesLanguage =
        language === "All languages" ||
        `${task.from} to ${task.to}` === language;

      const matchesType =
        taskType === "All tasks" || task.type === taskType;

      return matchesSearch && matchesLanguage && matchesType;
    });
  }, [opportunities, search, language, taskType]);

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleApply = async (event) => {
    event.preventDefault();
    setFormError("");
    setSending(true);
    try {
      if (selectedTask) {
        const created = await api("/translation/applications", {
          method: "POST",
          body: {
            projectId: selectedTask.id,
            fullName: form.name.trim(),
            email: form.email.trim(),
            languagePair: form.languages,
            experienceLevel: form.level,
            portfolioLink: form.portfolio.trim(),
            whyJoin: form.motivation.trim(),
          },
        });
        setLastResult({
          id: "APP-" + String(created._id).slice(-6).toUpperCase(),
          title: selectedTask.title,
          status: cap(created.status) || "Pending",
        });
      } else {
        await api("/translation/profile", {
          method: "PUT",
          body: {
            languagePairs: [form.languages],
            experienceLevel: form.level,
            bio: form.motivation.trim(),
            portfolioLink: form.portfolio.trim(),
          },
        });
        setLastResult({ id: "PROFILE", title: "Translator profile", status: "Saved" });
      }
      setSubmitted(true);
      await loadApplications();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  };
  const startApplication = (task) => {
    setSelectedTask(task);
    setSubmitted(false);
    setForm((current) => ({
      ...current,
      languages: `${task.from} to ${task.to}`,
    }));
    document
      .getElementById("translator-application")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="translator-page">
      <header className="translator-navbar">
        <button
          className="translator-brand"
          type="button"
          onClick={onBack}
          aria-label="Return to Chapterly home"
        >
          <BrandLogo className="translator-brand-logo" />
        </button>

        <nav className="translator-nav">
          <a href="#translator-home">Overview</a>
          <a href="#translator-tasks">Opportunities</a>
          <a href="#translator-how">How it works</a>
        </nav>

        <a className="translator-nav-cta" href="#translator-application">
          Join as translator ↗
        </a>
      </header>

      <section className="translator-hero" id="translator-home">
        <div className="translator-hero-copy">
          <p className="translator-eyebrow">
            CHAPTERLY · TRANSLATOR HUB
          </p>

          <h1>
            Every story
            <br />
            deserves to be <span>understood.</span>
          </h1>

          <p className="translator-hero-description">
            Bring Japanese stories closer to Indian readers.
            Explore localization opportunities, work with words
            and help fandom cross language barriers.
          </p>

          <div className="translator-hero-actions">
            <a className="translator-primary-button" href="#translator-tasks">
              Explore opportunities ↗
            </a>
            <a className="translator-secondary-button" href="#translator-how">
              How it works
            </a>
          </div>

          <div className="translator-hero-note">
            <span>日本語</span>
            <span>→</span>
            <span>English</span>
            <span>·</span>
            <span>Hindi</span>
          </div>
        </div>

        <div className="translator-hero-art" aria-hidden="true">
          <div className="translator-orbit orbit-one" />
          <div className="translator-orbit orbit-two" />

          <div className="translator-book">
            <span className="translator-book-jp">物語</span>
            <span className="translator-book-line" />
            <strong>STORIES</strong>
            <span className="translator-book-subtitle">
              LOST IN TRANSLATION?
            </span>
            <span className="translator-book-stamp">翻訳</span>
          </div>

          <span className="translator-floating floating-one">あ</span>
          <span className="translator-floating floating-two">A→あ</span>
          <span className="translator-floating floating-three">✦</span>
        </div>
      </section>

      <section className="translator-stats">
        <div>
          <span className="translator-stat-icon">文</span>
          <strong>Language first</strong>
          <p>Meaning beyond words</p>
        </div>
        <div>
          <span className="translator-stat-icon">漫</span>
          <strong>Fandom focused</strong>
          <p>Stories worth sharing</p>
        </div>
        <div>
          <span className="translator-stat-icon">✦</span>
          <strong>Build your skills</strong>
          <p>Grow through localization</p>
        </div>
      </section>

      <section className="translator-tasks" id="translator-tasks">
        <div className="translator-section-heading">
          <div>
            <p className="translator-eyebrow">FIND YOUR NEXT PROJECT</p>
            <h2>Translation opportunities<span>.</span></h2>
          </div>
          <p>Find a project that fits your language skills.</p>
        </div>

        <div className="translator-filters">
          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search translation opportunities"
          />

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Filter by language pair"
          >
            <option>All languages</option>
            <option>Japanese to English</option>
            <option>Japanese to Hindi</option>
            <option>English to Hindi</option>
          </select>

          <select
            value={taskType}
            onChange={(event) => setTaskType(event.target.value)}
            aria-label="Filter by task type"
          >
            <option>All tasks</option>
            <option>Manga</option>
            <option>Review</option>
            <option>Proofreading</option>
          </select>
        </div>

        <div className="translator-task-grid">
          {filteredTasks.map((task) => (
            <article className="translator-task-card" key={task.id}>
              <div className="translator-task-top">
                <span className="translator-task-symbol">文</span>
                <span className="translator-task-tag">{task.tag}</span>
              </div>

              <p className="translator-task-type">{task.type}</p>
              <h3>{task.title}</h3>
              <p className="translator-task-description">
                {task.description}
              </p>

              <div className="translator-language-pair">
                <span>{task.from}</span>
                <span className="translator-language-arrow">→</span>
                <span>{task.to}</span>
              </div>

              <div className="translator-task-meta">
                <span>◷ {task.level}</span>
                <span>◇ {task.payment}</span>
              </div>

              <button
                className="translator-apply-button"
                onClick={() => startApplication(task)}
              >
                Apply for this project ↗
              </button>
            </article>
          ))}
        </div>

        {loading && <p className="translator-demo-note">Loading opportunities...</p>}
        {error && <p className="translator-demo-note" role="alert">{error}</p>}
        {!loading && !error && filteredTasks.length === 0 && (
          <div className="translator-empty">
            <span>⌕</span>
            <h3>No matching opportunities</h3>
            <p>Try changing your search or filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setLanguage("All languages");
                setTaskType("All tasks");
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        <p className="translator-demo-note">
          Demo opportunities for the hackathon. Actual project availability
          and compensation would be confirmed by the platform.
        </p>
      </section>

        <section
  className="translator-tasks"
  id="translator-applications"
>
  <div className="translator-section-heading">
    <div>
      <p className="translator-eyebrow">
        YOUR ACTIVITY
      </p>

      <h2>My applications<span>.</span></h2>
    </div>

    <p>
      Track the demo applications submitted on this browser.
    </p>
  </div>

  {applications.length === 0 ? (
    <div className="translator-empty">
      <span>文</span>
      <h3>No applications yet</h3>
      <p>
        Explore opportunities and submit your first application.
      </p>

      <a
        className="translator-primary-button"
        href="#translator-tasks"
      >
        Browse opportunities ↗
      </a>
    </div>
  ) : (
    <div className="translator-task-grid">
      {applications.map((application) => (
        <article
          className="translator-task-card"
          key={application.key}
        >
          <div className="translator-task-top">
            <span className="translator-task-symbol">文</span>
            <span className="translator-task-tag">
              {application.status}
            </span>
          </div>

          <h3>{application.title}</h3>

          <p className="translator-task-description">
            Application ID: {application.id}
          </p>

          <div className="translator-language-pair">
            <span>{application.languages}</span>
          </div>

          <div className="translator-task-meta">
            <span>{application.level}</span>
            <span>{application.submittedAt}</span>
          </div>
        </article>
      ))}
    </div>
  )}

  <p className="translator-demo-note">
    Demo status only. Applications are not sent to a company
    or reviewed by a real recruiter.
  </p>
</section>
      <section className="translator-how" id="translator-how">
        <div className="translator-section-heading">
          <div>
            <p className="translator-eyebrow">YOUR JOURNEY STARTS HERE</p>
            <h2>How it works<span>.</span></h2>
          </div>
        </div>

        <div className="translator-steps">
          <article>
            <span>01</span>
            <h3>Find a project</h3>
            <p>Explore projects based on your language pair and skill level.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Share your profile</h3>
            <p>Tell us about your experience, language skills and interests.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Localize stories</h3>
            <p>Once approved, work on assigned content with the project team.</p>
          </article>
        </div>
      </section>

      <section
        className="translator-application-section"
        id="translator-application"
      >
        <div className="translator-application-intro">
          <p className="translator-eyebrow">JOIN THE COMMUNITY</p>
          <h2>
            Your words can
            <br />
            bring worlds <span>together.</span>
          </h2>
          <p>
            Interested in translation, proofreading or cultural
            localization? Introduce yourself to Chapterly.
          </p>
          <div className="translator-application-decoration">翻訳 · 物語 · 文化</div>
        </div>

        <form className="translator-form" onSubmit={handleApply}>
          <h3>{selectedTask ? "Apply for a project" : "Translator application"}</h3>
          <p className="translator-form-subtitle">
            {selectedTask
              ? selectedTask.title
              : "Tell us a little about yourself."}
          </p>

          {submitted ? (
            <div className="translator-success">
  <span>✓</span>

  <h3>Application submitted!</h3>

  <p>
    Your application has been saved.
  </p>

  <div className="translator-application-result">
    <p>
      <strong>Application ID:</strong>{" "}
      {lastResult?.id}
    </p>

    <p>
      <strong>Project:</strong>{" "}
      {lastResult?.title}
    </p>

    <p>
      <strong>Status:</strong>{" "}
      {lastResult?.status}
    </p>
  </div>

  <button
    type="button"
    className="translator-apply-button"
    onClick={() => {
      setSubmitted(false);
      setSelectedTask(null);
    }}
  >
    Apply for another project
  </button>
</div>
          ) : (
            <>
              <div className="translator-form-row">
                <label>
                  Full name
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateForm}
                    placeholder="Your name"
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateForm}
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </div>

              <label>
                Language pair
                <select
                  name="languages"
                  value={form.languages}
                  onChange={updateForm}
                >
                  <option>Japanese to English</option>
                  <option>Japanese to Hindi</option>
                  <option>English to Hindi</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Experience level
                <select
                  name="level"
                  value={form.level}
                  onChange={updateForm}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>

              <label>
                Portfolio or sample link (optional)
                <input
                  name="portfolio"
                  type="url"
                  value={form.portfolio}
                  onChange={updateForm}
                  placeholder="https://..."
                />
              </label>

              <label>
                Why would you like to join?
                <textarea
                  name="motivation"
                  value={form.motivation}
                  onChange={updateForm}
                  placeholder="Tell us about your interests..."
                  rows="4"
                  required
                />
              </label>

              {formError && <p className="translator-privacy-note" role="alert">{formError}</p>}
              <button className="translator-submit-button" type="submit" disabled={sending}>
                Submit application ↗
              </button>
              <p className="translator-privacy-note">
                Demo only. Do not enter sensitive personal information.
              </p>
            </>
          )}
        </form>
      </section>

      <footer className="translator-footer">
        
        <div className="translator-brand">
        <BrandLogo className="translator-brand-logo" />
        </div>

        <p>Stories travel further when languages connect.</p>
        <span>© 2026 Chapterly · Demo platform</span>
      </footer>
    </main>
  );
}

