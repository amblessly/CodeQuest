"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setUser(data.session.user);
      setLoading(false);
    });
  }, [router]);

  if (loading) return null;

  const meta = user?.user_metadata || {};
  const displayName = meta.display_name || meta.full_name || meta.name || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const xp = meta.xp || 2840;
  const streak = meta.streak || 7;
  const rank = meta.rank || "Bronze";

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <span />
        <Link href="/profile/settings" className={styles.gearBtn}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </div>

      <div className={styles.profileHead}>
        <div className={styles.avatarCircle}>{initial}</div>
        <h1 className={styles.name}>{displayName}</h1>
        <p className={styles.email}>{user?.email}</p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <FireIcon />
          <span className={styles.statValue}>{streak}</span>
          <span className={styles.statLabel}>Day Streak</span>
        </div>
        <div className={styles.statCard}>
          <XPIcon />
          <span className={styles.statValue}>{xp.toLocaleString()}</span>
          <span className={styles.statLabel}>Total XP</span>
        </div>
        <div className={styles.statCard}>
          <RankIcon rank={rank} />
          <span className={styles.statValue}>{rank}</span>
          <span className={styles.statLabel}>Rank</span>
        </div>
      </div>
    </div>
  );
}

function FireIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF9600" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
}

function XPIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="#CE82FF" stroke="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>;
}

function RankIcon({ rank }) {
  const color = rank === "Bronze" ? "#CD7F32" : rank === "Silver" ? "#C0C0C0" : rank === "Gold" ? "#FFD700" : "#999";
  return <svg width="20" height="20" viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}