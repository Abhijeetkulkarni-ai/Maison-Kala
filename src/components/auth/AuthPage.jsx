
"use client";

import React, { useState } from "react";
import "./AuthPage.css";

const USERS_KEY = "mk-demo-users";
const SESSION_KEY = "mk-demo-session";

const readUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

const validEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function AuthPage({ onClose, onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    setShowPassword(false);

    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    // Validate email.
    if (!validEmail(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    // Validate signup fields.
    if (mode === "signup") {
      if (name.length < 2) {
        setMessage("Please enter your full name.");
        setMessageType("error");
        return;
      }

      if (password.length < 8) {
        setMessage("Password must contain at least 8 characters.");
        setMessageType("error");
        return;
      }

      if (password !== form.confirmPassword) {
        setMessage("Your passwords do not match.");
        setMessageType("error");
        return;
      }
    }

    // Validate login password.
    if (!password.trim()) {
      setMessage("Please enter your password.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const users = readUsers();

      if (mode === "signup") {
        const existingUser = users.some(
          (user) => user.email === email
        );

        if (existingUser) {
          setMessage(
            "An account with this email already exists. Please sign in."
          );
          setMessageType("error");
          return;
        }

        const newUser = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
        };

        // Save the demo account.
        localStorage.setItem(
          USERS_KEY,
          JSON.stringify([...users, newUser])
        );

        const session = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        };

        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify(session)
        );

        setMessage("Account created successfully!");
        setMessageType("success");

        onAuthenticated?.(session);
        return;
      }

      // Demo login: credentials must match a registered account.
      const matchedUser = users.find(
        (user) =>
          user.email === email && user.password === password
      );

      if (!matchedUser) {
        setMessage(
          "Invalid email or password. Please check your details or create an account."
        );
        setMessageType("error");
        return;
      }

      const session = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
      };

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
      );

      setMessage("Welcome back!");
      setMessageType("success");

      onAuthenticated?.(session);
    } catch {
      setMessage(
        "Unable to save your demo account. Please check your browser storage."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mk-auth">
      <header className="mk-auth-header">
        <button
          className="mk-auth-back"
          type="button"
          onClick={onClose}
        >
          ← Back to store
        </button>

        <a className="brand" href="/">
          Maison Kala
        </a>

        <span className="mk-auth-header-label">
          YOUR ACCOUNT
        </span>
      </header>

      <div className="mk-auth-layout">
        <section className="mk-auth-editorial">
          <span className="mk-auth-eyebrow">
            THOUGHTFULLY MADE IN INDIA
          </span>

          <h1>
            Make room
            <br />
            for <em>beautiful</em>
            <br />
            things.
          </h1>

          <p>
            Discover thoughtfully curated pieces for a home
            that feels uniquely yours.
          </p>

          <div className="mk-auth-editorial-bottom">
            <span>MAISON KALA</span>
            <span>Objects with a story.</span>
          </div>
        </section>

        <section className="mk-auth-content">
          <div className="mk-auth-form-wrap">
            <span className="mk-auth-eyebrow">
              {mode === "login"
                ? "WELCOME BACK"
                : "JOIN OUR COMMUNITY"}
            </span>

            <h2>
              {mode === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </h2>

            <p className="mk-auth-description">
              {mode === "login"
                ? "Access your orders, details, and shopping history."
                : "Create an account for a more personal shopping experience."}
            </p>

            <div className="mk-auth-tabs">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => switchMode("login")}
              >
                Sign in
              </button>

              <button
                type="button"
                className={mode === "signup" ? "active" : ""}
                onClick={() => switchMode("signup")}
              >
                Create account
              </button>
            </div>

            {message && (
              <div
                className="mk-auth-message"
                data-type={messageType}
                role="status"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <form
              className="mk-auth-form"
              onSubmit={handleSubmit}
            >
              {mode === "signup" && (
                <>
                  <label htmlFor="mk-name">Full name</label>

                  <input
                    id="mk-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={updateField}
                    minLength={2}
                    required
                  />
                </>
              )}

              <label htmlFor="mk-email">Email address</label>

              <input
                id="mk-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={updateField}
                required
              />

              <label htmlFor="mk-password">Password</label>

              <div className="mk-auth-password">
                <input
                  id="mk-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "signup"
                      ? "new-password"
                      : "current-password"
                  }
                  placeholder={
                    mode === "signup"
                      ? "At least 8 characters"
                      : "Enter your password"
                  }
                  minLength={mode === "signup" ? 8 : undefined}
                  value={form.password}
                  onChange={updateField}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {mode === "signup" && (
                <>
                  <label htmlFor="mk-confirm-password">
                    Confirm password
                  </label>

                  <input
                    id="mk-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    minLength={8}
                    value={form.confirmPassword}
                    onChange={updateField}
                    required
                  />
                </>
              )}

              {mode === "login" && (
                <div className="mk-auth-forgot">
                  <button
                    type="button"
                    onClick={() => {
                      setMessage(
                        "Password reset is unavailable in demo mode."
                      );
                      setMessageType("error");
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                className="mk-auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}

                {!loading && <span>→</span>}
              </button>
            </form>

            <p className="mk-auth-switch">
              {mode === "login"
                ? "New to Maison Kala?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() =>
                  switchMode(
                    mode === "login" ? "signup" : "login"
                  )
                }
              >
                {mode === "login"
                  ? "Create an account"
                  : "Sign in"}
              </button>
            </p>

            <p className="mk-auth-terms">
              Demo authentication: accounts are saved in this browser.
              Do not use a real password.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
