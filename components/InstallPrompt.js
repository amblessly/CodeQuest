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
    const android = /Android/.test(navigator.userAgent);

    setIsIOS(iOS);

    if (!iOS) {
      setMode("install");
    } else {
      setMode("ios");
    }

    const handler = (e) => {
      e.preventDefault();
      deferredRef.current = e;
      setShow(true);
      setMode("install");
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (iOS) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

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
          <span className={styles.sub}>
            {mode === "ios"
              ? "Tap Share then Add to Home Screen"
              : mode === "manual"
              ? 'Open browser menu and tap "Install app" or "Add to Home screen"'
              : "Install for the best experience"}
          </span>
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