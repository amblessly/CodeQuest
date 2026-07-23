"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function AuthPage() {
  const [mode, setMode] = useState("signup");

  return (
    <div className={styles.page}>
      <a href="/" className={styles.backLink}>← Back to Home</a>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.logo}>⚔️</span>
          <h1 className={styles.title}>CodeQuest</h1>
          <p className={styles.subtitle}>
            {mode === "signup" ? "Start your coding adventure!" : "Welcome back, hero!"}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
          <button
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => setMode("login")}
          >
            Sign In
          </button>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>👤</span>
                <input className={styles.input} type="text" placeholder="Your hero name" />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>📧</span>
              <input className={styles.input} type="email" placeholder="you@example.com" />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>🔒</span>
              <input className={styles.input} type="password" placeholder="••••••••" />
            </div>
          </div>

          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔐</span>
                <input className={styles.input} type="password" placeholder="••••••••" />
              </div>
            </div>
          )}

          <button className={styles.submitBtn} type="submit">
            {mode === "signup" ? "Start Quest →" : "Let's Go →"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <div className={styles.socialButtons}>
          <button className={styles.socialBtn}>
            <span>G</span> Google
          </button>
          <button className={styles.socialBtn}>
            <span>GH</span> GitHub
          </button>
        </div>

        <p className={styles.switchText}>
          {mode === "signup" ? (
            <>Already have an account? <button className={styles.switchLink} onClick={() => setMode("login")}>Sign In</button></>
          ) : (
            <>No account yet? <button className={styles.switchLink} onClick={() => setMode("signup")}>Sign Up</button></>
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
