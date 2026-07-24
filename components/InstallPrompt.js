"use client";

import { useState, useEffect } from "react";
import styles from "./InstallPrompt.module.css";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    const dismissed = localStorage.getItem("cqi_dismiss");
    if (dismissed) return;

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (iOS) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem("cqi_dismiss", "1");
    }
    setDeferredPrompt(null);
    setShow(false);
  }

  function handleDismiss() {
    localStorage.setItem("cqi_dismiss", "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>&lt;/&gt;</span>
        </div>
        <div className={styles.text}>
          <strong className={styles.title}>Install CodeQuest</strong>
          <span className={styles.sub}>
            {isIOS
              ? "Tap Share then Add to Home Screen"
              : "Add to your home screen for the best experience"}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        {!isIOS ? (
          <button className={styles.installBtn} onClick={handleInstall}>
            Install
          </button>
        ) : (
          <button className={styles.installBtn} disabled>
            Install
          </button>
        )}
        <button className={styles.closeBtn} onClick={handleDismiss}>
          ✕
        </button>
      </div>
    </div>
  );
}