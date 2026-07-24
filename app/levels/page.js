"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

const totalLevels = 20;
const cols = 160;
const cx = cols / 2;
const spread = 36;
const yStep = 130;
const r = 28;

// Generate node positions: alternating left/right
const nodes = Array.from({ length: totalLevels }, (_, i) => ({
  x: i % 2 === 0 ? cx - spread : cx + spread,
  y: 60 + i * yStep,
}));

// Build ONE continuous smooth path through all nodes
function buildPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const dy = curr.y - prev.y;
    const dx = curr.x - prev.x;
    // Control points: push out horizontally from each end
    const c1x = prev.x + dx * 0.4 + (i % 2 === 0 ? -dx * 0.3 : dx * 0.3);
    const c1y = prev.y + dy * 0.4;
    const c2x = curr.x - dx * 0.4 + (i % 2 === 0 ? dx * 0.3 : -dx * 0.3);
    const c2y = curr.y - dy * 0.4;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${curr.x},${curr.y}`;
  }
  return d;
}

const pathD = buildPath(nodes);
const svgH = nodes[nodes.length - 1].y + 100;

// Hexagon points centered at 0,0 with radius r
function hexPts(r) {
  let pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 6;
    pts.push(`${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}
const hex = hexPts(r);

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

      <div className={styles.map}>
        {/* Background path shadow */}
        <svg className={styles.svg} viewBox={`0 0 ${cols} ${svgH}`} preserveAspectRatio="xMidYMax meet">
          <path d={pathD} fill="none" stroke="#e8e8e8" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
          {/* Active path segment */}
          <path d={buildPath(nodes.slice(0, currentLevel))} fill="none" stroke="#58CC02" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />

          {nodes.map((n, i) => {
            const level = i + 1;
            const unlocked = level <= currentLevel + 1;
            const done = level < currentLevel;
            const now = level === currentLevel;

            return (
              <g key={level}>
                {/* Clickable hexagon */}
                <polygon
                  points={hex}
                  transform={`translate(${n.x},${n.y})`}
                  fill={done ? "#58CC02" : now ? "white" : !unlocked ? "#f0f0f0" : "white"}
                  stroke={done ? "#58CC02" : now ? "#58CC02" : !unlocked ? "#ddd" : "#ddd"}
                  strokeWidth="4"
                  strokeLinejoin="round"
                  className={`${styles.hex} ${now ? styles.hexGlow : ""} ${!unlocked ? styles.hexLock : ""}`}
                  onClick={() => unlocked && router.push(`/level/${level}`)}
                  style={{ cursor: unlocked ? "pointer" : "not-allowed" }}
                />
                {done && (
                  <g transform={`translate(${n.x},${n.y})`}>
                    <polyline points="-8,-3 -3,3 8,-7" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
                {now && (
                  <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#58CC02" fontFamily="Fredoka, sans-serif" fontSize="15" fontWeight="700">{level}</text>
                )}
                {!unlocked && !done && (
                  <g transform={`translate(${n.x},${n.y})`}>
                    <rect x="-7" y="-4" width="14" height="10" rx="2" fill="none" stroke="#bbb" strokeWidth="2.5" />
                    <path d="M-3-4V-7a3 3 0 0 1 6 0v3" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}
                {/* "QUEST" label for current level */}
                {now && (
                  <text x={n.x} y={n.y + r + 18} textAnchor="middle" fill="#58CC02" fontFamily="Fredoka, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.5">QUEST</text>
                )}
              </g>
            );
          })}

          {/* Crown at bottom */}
          <g transform={`translate(${cx},${nodes[nodes.length - 1].y + r + 40})`}>
            <path d="M2 14l3-10 4 5 3-6 3 6 4-5 3 10H2z" fill="var(--yellow)" stroke="none" />
          </g>
        </svg>
      </div>
    </div>
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