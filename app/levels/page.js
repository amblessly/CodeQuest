"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

const totalLevels = 20;

// Heptagon points for a 7-sided polygon (centered, radius ~50)
const H = "50,2 88,20 99,59 76,93 24,93 1,59 12,20";

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
        <div className={styles.row}>
          <h1 className={styles.title}>CodeQuest</h1>
          <div className={styles.badges}>
            <span className={styles.badge}><StreakIcon /> 0</span>
            <span className={styles.badge}><GemIcon /> 0</span>
            <span className={styles.badge}><HeartIcon /> 5</span>
          </div>
        </div>
        <div className={styles.progressRow}>
          <span className={styles.levelTag}>Level {currentLevel}</span>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${((currentLevel - 1) / totalLevels) * 100}%` }} />
          </div>
          <span className={styles.count}>{currentLevel - 1}/{totalLevels}</span>
        </div>
      </header>

      <div className={styles.path}>
        {Array.from({ length: totalLevels }, (_, i) => {
          const level = i + 1;
          const isLeft = i % 2 === 0;
          const unlocked = level <= currentLevel + 1;
          const done = level < currentLevel;
          const now = level === currentLevel;

          return (
            <div key={level} className={`${styles.step} ${isLeft ? styles.left : styles.right}`}>
              {i > 0 && (
                <svg className={styles.line} viewBox="0 0 100 50" preserveAspectRatio="none">
                  <line
                    x1={isLeft ? "72" : "28"}
                    y1="0"
                    x2={isLeft ? "28" : "72"}
                    y2="50"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className={`${styles.pathLine} ${i <= currentLevel ? styles.pathOn : ""}`}
                  />
                </svg>
              )}
              <button
                className={`${styles.node} ${done ? styles.done : ""} ${now ? styles.now : ""} ${!unlocked ? styles.locked : ""}`}
                disabled={!unlocked}
                onClick={() => unlocked && router.push(`/level/${level}`)}
              >
                <svg className={styles.hept} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon
                    points={H}
                    fill={done ? "#58CC02" : now ? "white" : !unlocked ? "#f5f5f5" : "white"}
                    stroke={done ? "#58CC02" : now ? "#58CC02" : !unlocked ? "#ddd" : "#ddd"}
                    strokeWidth={done ? "6" : now ? "6" : "6"}
                  />
                </svg>
                <span className={styles.content}>
                  {done ? <CheckIcon /> : now ? level : <LockIcon />}
                </span>
              </button>
              {now && <span className={styles.flag}>QUEST</span>}
            </div>
          );
        })}
        <div className={styles.crown}>
          <CrownIcon />
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function StreakIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--orange)" stroke="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function GemIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--purple)" stroke="none">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--red)" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="var(--yellow)" stroke="none">
      <path d="M2 19l3-14 4 7 3-9 3 9 4-7 3 14H2z" />
    </svg>
  );
}