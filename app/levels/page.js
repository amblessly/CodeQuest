"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { MapIcon, LockIcon, TrophyIcon, StarIcon } from "@/components/ui/Icons";
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

  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  function getLevelPosition(index) {
    const row = Math.floor(index / 5);
    const col = index % 5;
    return {
      x: row % 2 === 0 ? col : 4 - col,
      y: row,
    };
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgCircle} style={{ width: 400, height: 400, top: "-10%", right: "-10%", opacity: 0.4 }} />
      <div className={styles.bgCircle} style={{ width: 300, height: 300, bottom: "10%", left: "-8%", opacity: 0.3 }} />

      <div className={styles.header}>
        <h1 className={styles.title}>
          <MapIcon /> Level Map
        </h1>
        <p className={styles.subtitle}>
          Current Level: <strong>{currentLevel}</strong> / {totalLevels}
        </p>
      </div>

      <div className={styles.mapContainer}>
        <div className={styles.map}>
          {levels.map((level, i) => {
            const pos = getLevelPosition(i);
            const unlocked = level <= currentLevel + 1;
            const completed = level < currentLevel;
            const isCurrent = level === currentLevel;

            return (
              <div
                key={level}
                className={styles.levelNode}
                style={{
                  gridRow: pos.y + 1,
                  gridColumn: pos.x + 1,
                }}
              >
                {level > 1 && (
                  <div className={`${styles.pathLine} ${level <= currentLevel ? styles.pathActive : ""}`} />
                )}
                <button
                  className={`${styles.nodeBtn} ${completed ? styles.completed : ""} ${isCurrent ? styles.current : ""} ${!unlocked ? styles.locked : ""}`}
                  disabled={!unlocked}
                >
                  {completed ? (
                    <span className={styles.nodeIcon}><TrophyIcon /></span>
                  ) : isCurrent ? (
                    <span className={styles.nodeLevel}>{level}</span>
                  ) : (
                    <span className={styles.nodeIcon}><LockIcon /></span>
                  )}
                </button>
                <span className={`${styles.nodeLabel} ${unlocked ? styles.nodeLabelActive : ""}`}>
                  Level {level}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{currentLevel - 1}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}><StarIcon /></span>
          <span className={styles.statLabel}>Stars</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{totalLevels - currentLevel + 1}</span>
          <span className={styles.statLabel}>Remaining</span>
        </div>
      </div>
    </div>
  );
}
