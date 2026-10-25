import { useState } from "react";
import "./landing.css";
import BrandLogo from "../components/BrandLogo";
import { api } from "../api";

export default function Landing({ onReaderEnter, onCompanyEnter }) {
  const [role, setRole] = useState("");
  const [mode, setMode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (mode === "signup" && !name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const backendRole = role === "user" ? "reader" : "company";
    const body =
      mode === "signup"
        ? { name: name.trim(), email: email.trim(), password, role: backendRole }
        : { email: email.trim(), password, role: backendRole };

    setLoading(true);
    try {
      const data = await api(
        mode === "signup" ? "/auth/register" : "/auth/login",
        { method: "POST", body }
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "company") {
        onCompanyEnter();
      } else {
        onReaderEnter();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (role && mode) {
    return (
      <main className="auth-page">
        <button
          className="back-btn"
          onClick={() => {
            setMode("");
            setRole("");
          }}
        >
          ← Back
        </button>

        <div className="auth-card">
          <div className="auth-logo">
            <BrandLogo className="auth-brand-logo" />
          </div>

          <h2>{mode === "signup" ? "Join Chapterly" : "Welcome back"}</h2>
          <p>
            {role === "user" ? "Reader account" : "Company account"}
          </p>

          {mode === "signup" && (
            <input
              type="text"
              placeholder={role === "user" ? "Full name" : "Company name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="primary-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Create account"
              : "Sign in"}
          </button>

          <p className="switch-mode">
            {mode === "signup"
              ? "Already have an account?"
              : "New to Chapterly?"}
            <button
              onClick={() =>
                setMode(mode === "signup" ? "signin" : "signup")
              }
            >
              {mode === "signup" ? " Sign in" : " Sign up"}
            </button>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="landing">
      <div className="background-art" />
      <div className="background-shade" />

      <header className="navbar">
        <BrandLogo />
        <span className="tagline">A WORLD BETWEEN THE PAGES</span>
      </header>

      <section className="hero">

        <h1>
          Every world
          <br />
          has a <span>chapter.</span>
        </h1>

        <p className="subtitle">
          Discover stories. Connect with fandom.
          <br />
          Find your place in the world of manga.
        </p>

        <div className="role-options">
          <div className="role-card">
            <span className="role-icon">読</span>
            <h2>I'm a Reader</h2>
            <p>Discover manga and find your next obsession.</p>

            <button
              className="primary-btn"
              onClick={() => {
                setRole("user");
                setMode("signin");
              }}
            >
              Start Reading
            </button>

            <button
              className="text-btn"
              onClick={() => {
                setRole("user");
                setMode("signup");
              }}
            >
              New here? Sign up →
            </button>
          </div>

          <div className="role-card">
            <span className="role-icon">企</span>
            <h2>I'm a Company</h2>
            <p>Reach fans and explore India's manga market.</p>

            <button
              className="primary-btn"
              onClick={() => {
                setRole("company");
                setMode("signin");
              }}
            >
              Partner With Us
            </button>

            <button
              className="text-btn"
              onClick={() => {
                setRole("company");
                setMode("signup");
              }}
            >
              Join Chapterly →
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        MADE FOR THE LOVE OF STORIES <span>✦</span> CHAPTERLY
      </footer>
    </main>
  );
}
