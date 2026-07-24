"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

const totalLevels = 20;
const R = 38;
const cx = 80, cy = 90;
const H = (() => {
  let pts = [];
  for (let i = 0; i < 7; i++) {
    const a = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    pts.push(`${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`);
  }
  return pts.join(" ");
})();

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
          const active = i <= currentLevel;

          const prevHept = getHeptEdge(isLeft ? "bottom-right" : "bottom-left");
          const currHept = getHeptEdge(isLeft ? "top-left" : "top-right");

          return (
            <div key={level} className={`${styles.step} ${isLeft ? styles.left : styles.right}`}>
              <svg className={styles.group} viewBox="0 0 160 145" preserveAspectRatio="xMidYMax meet">
                {i > 0 && (
                  <line
                    x1={prevHept.x}
                    y1="0"
                    x2={currHept.x}
                    y2={currHept.y}
                    strokeWidth="5"
                    strokeLinecap="round"
                    className={`${styles.tunnel} ${active ? styles.tunnelOn : ""}`}
                  />
                )}
                <polygon
                  points={H}
                  fill={done ? "#58CC02" : now ? "white" : !unlocked ? "#f5f5f5" : "white"}
                  stroke={done ? "#58CC02" : now ? "#58CC02" : !unlocked ? "#ddd" : "#ddd"}
                  strokeWidth="6"
                  strokeLinejoin="round"
                  className={now ? styles.heptGlow : ""}
                />
                {done && (
                  <g transform={`translate(${cx},${cy})`}>
                    <polyline points="-12,-4 -4,4 12,-10" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
                {now && (
                  <text x={cx} y={cy + 6} textAnchor="middle" fill="#58CC02" fontFamily="Fredoka, sans-serif" fontSize={R > 35 ? 24 : 20} fontWeight="700">{level}</text>
                )}
                {!unlocked && !done && (
                  <g transform={`translate(${cx},${cy})`}>
                    <rect x="-8" y="-5" width="16" height="11" rx="2" fill="none" stroke="#bbb" strokeWidth="2.5" />
                    <path d="M-4-5V-8a4 4 0 0 1 8 0v3" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}
              </svg>
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

function getHeptEdge(pos) {
  const edges = {
    "top": { x: cx, y: cy - R },
    "bottom": { x: cx, y: cy + R },
    "top-right": { x: cx + R * Math.cos(-Math.PI / 2 + (Math.PI * 2) / 7), y: cy + R * Math.sin(-Math.PI / 2 + (Math.PI * 2) / 7) },
    "top-left": { x: cx + R * Math.cos(-Math.PI / 2 - (Math.PI * 2) / 7), y: cy + R * Math.sin(-Math.PI / 2 - (Math.PI * 2) / 7) },
    "bottom-right": { x: cx + R * Math.cos(Math.PI / 2 - (Math.PI * 2) / 7 * 2), y: cy + R * Math.sin(Math.PI / 2 - (Math.PI * 2) / 7 * 2) },
    "bottom-left": { x: cx + R * Math.cos(Math.PI / 2 + (Math.PI * 2) / 7 * 2), y: cy + R * Math.sin(Math.PI / 2 + (Math.PI * 2) / 7 * 2) },
  };
  return edges[pos] || edges.top;
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