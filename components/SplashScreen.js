"use client";

import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const shown = sessionStorage.getItem("cq_splash");
    if (shown) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("cq_splash", "1");
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.splash}>
      <div className={styles.inner}>
        <div className={styles.icon}><span className={styles.iconInner} /></div>
        <div className={styles.text}>
          {"CodeQuest".split("").map((ch, i) => (
            <span key={i} className={styles.char} style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
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
