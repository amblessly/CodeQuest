"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./InstallPrompt.module.css";

export default function InstallPrompt() {
  const deferredRef = useRef(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [mode, setMode] = useState("install");

  useEffect(() => {
    try {
      if (window.matchMedia("(display-mode: standalone)").matches) return;
      if (localStorage.getItem("cqi_dismiss")) return;
    } catch {
      return;
    }

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    setIsIOS(iOS);

    if (iOS) {
      setMode("ios");
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }

    const handler = (e) => {
      e.preventDefault();
      deferredRef.current = e;
      setShow(true);
      setMode("install");
    };
    window.addEventListener("beforeinstallprompt", handler);

    const timer = setTimeout(() => {
      if (!deferredRef.current) {
        setShow(true);
        setMode("manual");
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  async function handleInstall() {
    if (!deferredRef.current) return;
    deferredRef.current.prompt();
    const { outcome } = await deferredRef.current.userChoice;
    if (outcome === "accepted") {
      try { localStorage.setItem("cqi_dismiss", "1"); } catch {}
    }
    deferredRef.current = null;
    setShow(false);
  }

  function handleDismiss() {
    try { localStorage.setItem("cqi_dismiss", "1"); } catch {}
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
          {isIOS ? (
            <span className={styles.iosSteps}>
              <span>1. Tap <ShareIcon /> → "Add to Home Screen"</span>
              <span>2. Tap "Add" (top right)</span>
            </span>
          ) : (
            <span className={styles.sub}>
              {mode === "manual"
                ? 'Open browser menu → "Install app" or "Add to Home screen"'
                : "Install for the best experience"}
            </span>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        {mode === "install" ? (
          <button className={styles.installBtn} onClick={handleInstall}>
            Install
          </button>
        ) : null}
        <button className={styles.closeBtn} onClick={handleDismiss}>
          ✕
        </button>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}