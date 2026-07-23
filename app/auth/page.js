"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import styles from "./page.module.css";

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LockCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    <path d="m9 16 2 2 4-4" />
  </svg>
);

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signup");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");
    const username = form.get("username");
    const name = form.get("name");

    try {
      if (mode === "signup") {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name: username,
        });
        if (signUpError) {
          setError(signUpError.message || signUpError.code || "Something went wrong");
          setLoading(false);
          return;
        }
        router.push("/dashboard");
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message || signInError.code || "Invalid credentials");
          setLoading(false);
          return;
        }
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <a href="/" className={styles.backLink}>← Back</a>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.logo}>⚔️</span>
          <h1 className={styles.title}>CodeQuest</h1>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
            onClick={() => { setMode("signup"); setError(""); }}
          >
            Sign Up
          </button>
          <button
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Sign In
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <div className={styles.inputWrap}>
                <UserIcon />
                <input className={styles.input} name="username" type="text" placeholder="Your hero name" required />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrap}>
              <MailIcon />
              <input className={styles.input} name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <LockIcon />
              <input className={styles.input} name="password" type="password" placeholder="••••••••" minLength={8} required />
            </div>
          </div>

          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrap}>
                <LockCheckIcon />
                <input className={styles.input} name="confirmPassword" type="password" placeholder="••••••••" required />
              </div>
            </div>
          )}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Loading..." : mode === "signup" ? "Start Quest →" : "Let's Go →"}
          </button>
        </form>

        <p className={styles.switchText}>
          {mode === "signup" ? (
            <>Already have an account? <button className={styles.switchLink} onClick={() => { setMode("login"); setError(""); }}>Sign In</button></>
          ) : (
            <>No account yet? <button className={styles.switchLink} onClick={() => { setMode("signup"); setError(""); }}>Sign Up</button></>
          )}
        </p>
      </div>

      <div className={styles.floatingEmojis}>
        <span>💻</span>
        <span>⚡</span>
        <span>🎮</span>
        <span>🏆</span>
        <span>✨</span>
        <span>🚀</span>
      </div>
    </div>
  );
}
