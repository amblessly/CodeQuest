"use client";

import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoIcon}>&lt;/&gt;</span>
          <span className={styles.logoText}>CodeQuest</span>
        </a>

        <div className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
          <a href="#features" className={styles.link} onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how" className={styles.link} onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="/auth" className={styles.cta}>
            Start Learning
          </a>
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`${styles.line} ${menuOpen ? styles.lineOpen : ""}`} />
          <span className={`${styles.line} ${menuOpen ? styles.lineOpen : ""}`} />
          <span className={`${styles.line} ${menuOpen ? styles.lineOpen : ""}`} />
        </button>
      </div>
    </nav>
  );
}
