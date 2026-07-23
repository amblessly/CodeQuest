"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [phase, setPhase] = useState("enter");
  const splashRef = useRef(null);

  useEffect(() => {
    const shown = sessionStorage.getItem("cq_splash");
    if (shown) {
      setPhase("gone");
      return;
    }

    const fadeTimer = setTimeout(() => {
      setPhase("exit");
    }, 5000);

    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    if (phase === "exit" && splashRef.current) {
      const el = splashRef.current;
      const onEnd = () => setPhase("gone");
      el.addEventListener("animationend", onEnd);
      sessionStorage.setItem("cq_splash", "1");
      return () => el.removeEventListener("animationend", onEnd);
    }
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div ref={splashRef} className={`${styles.splash} ${phase === "exit" ? styles.splashExit : ""}`}>
      <div className={styles.circles}>
        <span className={styles.ring} style={{ width: 300, height: 300, top: "5%", left: "-10%", animationDelay: "0s" }} />
        <span className={styles.ring} style={{ width: 200, height: 200, top: "60%", right: "-5%", animationDelay: "0.8s" }} />
        <span className={styles.ring} style={{ width: 150, height: 150, bottom: "10%", left: "15%", animationDelay: "1.6s" }} />
        <span className={styles.ring} style={{ width: 100, height: 100, top: "30%", right: "20%", animationDelay: "2.4s" }} />
        <span className={styles.ring} style={{ width: 80, height: 80, top: "10%", right: "35%", animationDelay: "0.4s" }} />
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
            <span key={i} className={styles.char} style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
              {ch}
            </span>
          ))}
        </div>
        <div className={styles.tagline} style={{ animationDelay: "1.8s" }}>
          Learn to Code Through Play
        </div>
      </div>
    </div>
  );
}
