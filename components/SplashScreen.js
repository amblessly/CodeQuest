"use client";

import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const shown = sessionStorage.getItem("cq_splash");
    if (shown) {
      return;
    }

    const fadeTimer = setTimeout(() => {
      setPhase("exit");
    }, 2800);

    const removeTimer = setTimeout(() => {
      sessionStorage.setItem("cq_splash", "1");
    }, 3300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`${styles.splash} ${phase === "exit" ? styles.splashExit : ""}`}
      onAnimationEnd={() => {
        if (phase === "exit") setPhase("gone");
      }}
    >
      <div className={styles.bgShapes}>
        <span className={styles.shape} style={{ top: "15%", left: "10%", width: 60, height: 60, background: "rgba(255,255,255,0.08)", borderRadius: 12, animationDelay: "0.5s" }} />
        <span className={styles.shape} style={{ top: "60%", right: "15%", width: 40, height: 40, background: "rgba(255,255,255,0.06)", borderRadius: "50%", animationDelay: "1s" }} />
        <span className={styles.shape} style={{ bottom: "20%", left: "20%", width: 50, height: 50, background: "rgba(255,255,255,0.07)", borderRadius: 8, animationDelay: "1.5s" }} />
        <span className={styles.shape} style={{ top: "25%", right: "25%", width: 30, height: 30, background: "rgba(255,255,255,0.05)", borderRadius: "50%", animationDelay: "0.8s" }} />
      </div>
      <div className={styles.inner}>
        <div className={styles.icon}>
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 12h4M8 10v4" />
            <circle cx="16" cy="11" r="2" />
            <circle cx="18" cy="9" r="2" />
            <rect x="2" y="6" width="20" height="12" rx="3" />
          </svg>
        </div>
        <div className={styles.text}>
          {"CodeQuest".split("").map((ch, i) => (
            <span key={i} className={styles.char} style={{ animationDelay: `${0.4 + i * 0.08}s` }}>
              {ch}
            </span>
          ))}
        </div>
        <div className={styles.tagline} style={{ animationDelay: "1.6s" }}>
          Learn to Code Through Play
        </div>
      </div>
    </div>
  );
}
