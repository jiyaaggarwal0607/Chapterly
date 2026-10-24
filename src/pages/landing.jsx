
import { useState } from "react";
import "./Landing.css";
import BrandLogo from "../components/BrandLogo";  
export default function Landing({ onReaderEnter, onCompanyEnter }) {
  const [role, setRole] = useState("");
  const [mode, setMode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          <h1 className="auth-logo">
            chapterly<span>.</span>
          </h1>

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
        onClick={() => {
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

            if (role === "user") {
            onReaderEnter();
            } else {
            onCompanyEnter();
            }
        }}
        >
        {mode === "signup" ? "Create account" : "Sign in"}
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
