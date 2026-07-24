"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

const totalLevels = 20;

export default function LevelsPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setSession(data.session);
      if (!data.session.user.user_metadata?.onboarding_complete) {
        router.push("/onboarding");
      }
    });
  }, [router]);

  if (!session) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>CodeQuest</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statIcon}><StreakIcon /></span>
              <span className={styles.statValue}>0</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}><GemIcon /></span>
              <span className={styles.statValue}>0</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statIcon}><HeartIcon /></span>
              <span className={styles.statValue}>5</span>
            </div>
          </div>
        </div>
        <div className={styles.levelInfo}>
          <span className={styles.levelBadge}>Level {currentLevel}</span>
          <div className={styles.levelProgress}>
            <div className={styles.levelProgressTrack}>
              <div className={styles.levelProgressFill} style={{ width: `${((currentLevel - 1) / totalLevels) * 100}%` }} />
            </div>
            <span className={styles.levelProgressText}>{currentLevel - 1}/{totalLevels}</span>
          </div>
        </div>
      </header>

      <div className={styles.path}>
        {Array.from({ length: totalLevels }, (_, i) => {
          const level = i + 1;
          const unlocked = level <= currentLevel + 1;
          const completed = level < currentLevel;
          const isCurrent = level === currentLevel;

          return (
            <div key={level} className={styles.nodeWrapper}>
              {i > 0 && (
                <div className={`${styles.connector} ${completed || isCurrent ? styles.connectorActive : ""}`} />
              )}
              <button
                className={`${styles.node}
                  ${completed ? styles.nodeCompleted : ""}
                  ${isCurrent ? styles.nodeCurrent : ""}
                  ${!unlocked ? styles.nodeLocked : ""}`}
                disabled={!unlocked}
                onClick={() => unlocked && router.push(`/level/${level}`)}
              >
                {completed ? (
                  <CheckIcon />
                ) : isCurrent ? (
                  <span className={styles.nodeNum}>{level}</span>
                ) : (
                  <LockIcon />
                )}
              </button>
              {isCurrent && <div className={styles.currentLabel}>START</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function StreakIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--orange)" stroke="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function GemIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--purple)" stroke="none">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--red)" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
