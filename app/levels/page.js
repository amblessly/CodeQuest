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

const nodes = Array.from({ length: totalLevels }, (_, i) => ({
  x: i % 2 === 0 ? cx - spread : cx + spread,
  y: 60 + i * yStep,
}));

function buildPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const dy = curr.y - prev.y;
    const dx = curr.x - prev.x;
    const c1x = prev.x + dx * 0.4 + (i % 2 === 0 ? -dx * 0.3 : dx * 0.3);
    const c1y = prev.y + dy * 0.4;
    const c2x = curr.x - dx * 0.4 + (i % 2 === 0 ? dx * 0.3 : -dx * 0.3);
    const c2y = curr.y - dy * 0.4;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${curr.x},${curr.y}`;
  }
  return d;
}

const pathD = buildPath(nodes);
const svgH = nodes[nodes.length - 1].y + 80;

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
      {/* ─── Background Scene ─── */}
      <div className={styles.bgWrap}>
        <svg className={styles.bgSvg} viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8f4f8" />
              <stop offset="40%" stopColor="#f5ece0" />
              <stop offset="100%" stopColor="#e8ddd0" />
            </linearGradient>
            <linearGradient id="lavaGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff7b24" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ff5500" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff7b24" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lavaGlowR" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#ff7b24" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ff5500" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff7b24" stopOpacity="0" />
            </linearGradient>
            <filter id="blurLava">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="blurFog">
              <feGaussianBlur stdDeviation="24" />
            </filter>
            <filter id="blurGlow">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <linearGradient id="mt1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8a99a" />
              <stop offset="100%" stopColor="#8e7e6e" />
            </linearGradient>
            <linearGradient id="mt2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a59686" />
              <stop offset="100%" stopColor="#7d6d5d" />
            </linearGradient>
            <linearGradient id="cliffL" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3d3530" />
              <stop offset="100%" stopColor="#5c4e46" />
            </linearGradient>
            <linearGradient id="cliffR" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5c4e46" />
              <stop offset="100%" stopColor="#3d3530" />
            </linearGradient>
            <linearGradient id="rock" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6b5b53" />
              <stop offset="100%" stopColor="#4a3d37" />
            </linearGradient>
            <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a9e5a" />
              <stop offset="100%" stopColor="#5c7a40" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="400" height="800" fill="url(#sky)" />

          {/* Distant mountains */}
          <path d="M0 520 Q60 440 120 490 T240 460 T360 480 L400 600 L0 600Z" fill="url(#mt1)" opacity="0.5" />
          <path d="M0 560 Q80 480 160 530 T280 500 T400 540 L400 600 L0 600Z" fill="url(#mt2)" opacity="0.4" />

          {/* Fog layers */}
          <ellipse cx="200" cy="480" rx="260" ry="40" fill="#f0eae0" opacity="0.25" filter="url(#blurFog)" />
          <ellipse cx="200" cy="560" rx="280" ry="50" fill="#e8ddd0" opacity="0.2" filter="url(#blurFog)" />

          {/* Left cliff edge */}
          <path d="M0 520 Q20 500 15 560 Q10 620 30 680 Q40 720 50 800 L0 800Z" fill="url(#cliffL)" />
          <path d="M0 560 Q25 540 20 600 Q15 660 40 720 L0 720Z" fill="#4a3d37" opacity="0.6" />

          {/* Right cliff edge */}
          <path d="M400 500 Q380 490 385 560 Q390 630 370 690 Q360 730 350 800 L400 800Z" fill="url(#cliffR)" />
          <path d="M400 540 Q375 530 380 600 Q385 670 360 730 L400 730Z" fill="#4a3d37" opacity="0.6" />

          {/* Left lava river */}
          <path d="M0 540 Q30 560 20 620 Q15 680 35 740 Q40 770 45 800 L0 800Z" fill="none" stroke="#ff7b24" strokeWidth="4" opacity="0.6" filter="url(#blurGlow)" />
          <path d="M0 540 Q30 560 20 620 Q15 680 35 740 Q40 770 45 800 L0 800Z" fill="none" stroke="#ff5500" strokeWidth="2" opacity="0.4" />
          <path d="M2 550 Q28 565 18 625 Q13 685 33 745 L0 745Z" fill="url(#lavaGlow)" opacity="0.3" />

          {/* Right lava river */}
          <path d="M400 520 Q370 540 380 610 Q385 670 365 730 Q360 760 355 800 L400 800Z" fill="none" stroke="#ff7b24" strokeWidth="4" opacity="0.6" filter="url(#blurGlow)" />
          <path d="M400 520 Q370 540 380 610 Q385 670 365 730 Q360 760 355 800 L400 800Z" fill="none" stroke="#ff5500" strokeWidth="2" opacity="0.4" />
          <path d="M398 530 Q372 545 382 615 Q387 675 367 735 L400 735Z" fill="url(#lavaGlowR)" opacity="0.3" />

          {/* Lava glow pools */}
          <ellipse cx="22" cy="630" rx="12" ry="20" fill="#ff5500" opacity="0.15" filter="url(#blurLava)" />
          <ellipse cx="378" cy="650" rx="12" ry="20" fill="#ff5500" opacity="0.15" filter="url(#blurLava)" />

          {/* Small rocks scattered */}
          <ellipse cx="50" cy="580" rx="6" ry="4" fill="url(#rock)" opacity="0.7" />
          <ellipse cx="70" cy="610" rx="5" ry="3" fill="url(#rock)" opacity="0.5" />
          <ellipse cx="340" cy="570" rx="7" ry="4" fill="url(#rock)" opacity="0.6" />
          <ellipse cx="320" cy="620" rx="4" ry="3" fill="url(#rock)" opacity="0.5" />
          <ellipse cx="55" cy="700" rx="8" ry="5" fill="url(#rock)" opacity="0.6" />
          <ellipse cx="345" cy="690" rx="6" ry="4" fill="url(#rock)" opacity="0.5" />
          <ellipse cx="100" cy="540" rx="5" ry="3" fill="url(#rock)" opacity="0.4" />
          <ellipse cx="310" cy="530" rx="4" ry="3" fill="url(#rock)" opacity="0.4" />

          {/* Grass / moss patches along edges */}
          <ellipse cx="30" cy="550" rx="15" ry="8" fill="url(#grass)" opacity="0.4" />
          <ellipse cx="18" cy="600" rx="12" ry="6" fill="url(#grass)" opacity="0.3" />
          <ellipse cx="370" cy="540" rx="14" ry="7" fill="url(#grass)" opacity="0.4" />
          <ellipse cx="382" cy="590" rx="10" ry="5" fill="url(#grass)" opacity="0.3" />
          <ellipse cx="42" cy="650" rx="10" ry="5" fill="url(#grass)" opacity="0.25" />
          <ellipse cx="358" cy="640" rx="8" ry="4" fill="url(#grass)" opacity="0.25" />

          {/* Tiny cliff details */}
          <path d="M10 580 L15 585 L12 590Z" fill="#4a3d37" opacity="0.5" />
          <path d="M390 570 L385 575 L388 580Z" fill="#4a3d37" opacity="0.5" />

          {/* Ambient light glint */}
          <ellipse cx="200" cy="300" rx="180" ry="60" fill="#fff" opacity="0.04" filter="url(#blurFog)" />
        </svg>
      </div>

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
        <svg className={styles.svg} viewBox={`0 0 ${cols} ${svgH}`} preserveAspectRatio="xMidYMax meet">
          <path d={pathD} fill="none" stroke="#e8e8e8" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
          <path d={buildPath(nodes.slice(0, currentLevel))} fill="none" stroke="#58CC02" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />

          {nodes.map((n, i) => {
            const level = i + 1;
            const unlocked = level <= currentLevel + 1;
            const done = level < currentLevel;
            const now = level === currentLevel;

            return (
              <g key={level} className={styles.nodeGroup} transform={`translate(${n.x},${n.y})`} style={{ cursor: unlocked ? "pointer" : "not-allowed" }} onClick={() => unlocked && router.push(`/level/${level}`)}>
                <polygon
                  points={hex}
                  fill={done ? "#58CC02" : now ? "white" : !unlocked ? "#f0f0f0" : "white"}
                  stroke={done ? "#58CC02" : now ? "#58CC02" : !unlocked ? "#ddd" : "#ddd"}
                  strokeWidth="4"
                  strokeLinejoin="round"
                  className={`${styles.hex} ${now ? styles.hexGlow : ""} ${!unlocked ? styles.hexLock : ""}`}
                />
                {done && (
                  <polyline points="-8,-3 -3,3 8,-7" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                )}
                {now && (
                  <text x="0" y="5" textAnchor="middle" fill="#58CC02" fontFamily="Fredoka, sans-serif" fontSize="15" fontWeight="700">{level}</text>
                )}
                {!unlocked && !done && (
                  <g>
                    <rect x="-7" y="-4" width="14" height="10" rx="2" fill="none" stroke="#bbb" strokeWidth="2.5" />
                    <path d="M-3-4V-7a3 3 0 0 1 6 0v3" fill="none" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}
                {now && (
                  <text x="0" y={r + 18} textAnchor="middle" fill="#58CC02" fontFamily="Fredoka, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.5">QUEST</text>
                )}
              </g>
            );
          })}

          <g transform={`translate(${cx},${nodes[nodes.length - 1].y + r + 30})`}>
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