"use client";

import { useState } from "react";
import { GameIcon } from "@/components/ui/Icons";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.navInner}`}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoIcon}><GameIcon /></span>
          <span className={styles.logoText}>CodeQuest</span>
        </a>

        <div className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ""}`}>
          <a href="#about" className={styles.navLink} onClick={() => setMenuOpen(false)}>About</a>
          <a href="#features" className={styles.navLink} onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how" className={styles.navLink} onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="/auth" className={`${styles.navLink} ${styles.navCta}`}>
            Get Started
          </a>
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ""}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ""}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ""}`} />
        </button>
      </div>
    </nav>
  );
}
