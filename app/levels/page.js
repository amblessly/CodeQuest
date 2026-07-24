"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

const totalLevels = 20;
const cols = 5;

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

  function getGridPos(level) {
    const i = level - 1;
    const row = Math.floor(i / cols);
    const col = row % 2 === 0 ? i % cols : cols - 1 - (i % cols);
    return { row, col };
  }

  function hasConnectorRight(level) {
    const i = level - 1;
    const row = Math.floor(i / cols);
    const col = i % cols;
    if (level === totalLevels) return false;
    if (row % 2 === 0) return col < cols - 1;
    return col > 0;
  }

  function getConnectorType(level) {
    const i = level - 1;
    const row = Math.floor(i / cols);
    const col = i % cols;
    const nextRow = Math.floor(i / cols);
    const nextCol = col + 1;

    if (hasConnectorRight(level)) {
      const isLastInRow = row % 2 === 0 ? col === cols - 1 : col === 0;
      if (isLastInRow) return null;
      return "horizontal";
    }
    return null;
  }

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

      <div className={styles.mapWrap}>
        <div className={styles.map}>
          {Array.from({ length: totalLevels }, (_, i) => {
            const level = i + 1;
            const pos = getGridPos(level);
            const unlocked = level <= currentLevel + 1;
            const completed = level < currentLevel;
            const isCurrent = level === currentLevel;

            const isLastInRow = (pos.row % 2 === 0 && pos.col === cols - 1) || (pos.row % 2 === 1 && pos.col === 0);
            const isLastLevel = level === totalLevels;

            return (
              <div
                key={level}
                className={styles.nodeWrap}
                style={{ gridRow: pos.row + 1, gridColumn: pos.col + 1 }}
              >
                {(i > 0 && pos.col === (pos.row % 2 === 0 ? 0 : cols - 1)) && (
                  <div className={`${styles.connectorV} ${completed || isCurrent ? styles.connectorActive : ""}`} />
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
                {isCurrent && <span className={styles.youAreHere}>YOU ARE HERE</span>}
              </div>
            );
          })}

          {Array.from({ length: totalLevels }, (_, i) => {
            const level = i + 1;
            const pos = getGridPos(level);
            if (level === totalLevels) return null;
            const nextPos = getGridPos(level + 1);
            const completed = level < currentLevel;
            const isCurrent = level === currentLevel;

            if (pos.row === nextPos.row) {
              const dir = pos.row % 2 === 0 ? 1 : -1;
              return (
                <div
                  key={`h-${level}`}
                  className={`${styles.connectorH} ${completed || isCurrent ? styles.connectorActive : ""}`}
                  style={{
                    gridRow: pos.row + 1,
                    gridColumn: dir === 1 ? pos.col + 1 : nextPos.col + 1,
                  }}
                />
              );
            }
            return null;
          })}

          {Array.from({ length: totalLevels }, (_, i) => {
            const level = i + 1;
            const pos = getGridPos(level);
            if (level === totalLevels) return null;
            const nextPos = getGridPos(level + 1);

            if (pos.row !== nextPos.row) {
              const edgeCol = pos.row % 2 === 0 ? cols : 1;
              const completed = level < currentLevel;
              const isCurrent = level === currentLevel;

              return (
                <div
                  key={`v-${level}`}
                  className={`${styles.connectorVLong} ${completed || isCurrent ? styles.connectorActive : ""}`}
                  style={{
                    gridRowStart: pos.row + 1,
                    gridRowEnd: nextPos.row + 2,
                    gridColumn: edgeCol,
                  }}
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerStat}>
          <span className={styles.footerStatValue}>{currentLevel - 1}</span>
          <span className={styles.footerStatLabel}>Completed</span>
        </div>
        <div className={styles.footerStat}>
          <span className={styles.footerStatValue}>{totalLevels - currentLevel + 1}</span>
          <span className={styles.footerStatLabel}>Remaining</span>
        </div>
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
