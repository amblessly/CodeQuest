"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [notifOn, setNotifOn] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth");
        return;
      }
      setUser(data.session.user);
      const meta = data.session.user.user_metadata || {};
      setDisplayName(meta.display_name || meta.full_name || meta.name || "");
      setLoading(false);
    });
  }, [router]);

  const meta = user?.user_metadata || {};
  const avatar = meta.avatar_url || null;
  const initial = user?.email?.charAt(0).toUpperCase() || "?";

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      const supabase = createClient();
      await supabase.auth.updateUser({ data: { avatar_url: dataUrl } });
      setUser((prev) => ({
        ...prev,
        user_metadata: { ...prev.user_metadata, avatar_url: dataUrl },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDisplayName = async () => {
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { display_name: displayName } });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) return null;

  const xp = meta.xp || 2840;
  const streak = meta.streak || 7;
  const rank = meta.rank || "Bronze";

  return (
    <div className={styles.page}>
      {/* ── Avatar ── */}
      <div className={styles.avatarSection}>
        <button className={styles.avatarWrap} onClick={() => fileRef.current?.click()}>
          {avatar ? (
            <img src={avatar} alt="" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>{initial}</div>
          )}
          <div className={styles.avatarOverlay}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
        <h1 className={styles.name}>{meta.display_name || meta.full_name || meta.name || user?.email?.split("@")[0]}</h1>
        <p className={styles.email}>{user?.email}</p>
      </div>

      {/* ── Dashboard Stats ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><FireIcon /></span>
          <span className={styles.statValue}>{streak}</span>
          <span className={styles.statLabel}>Day Streak</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><XPIcon /></span>
          <span className={styles.statValue}>{xp.toLocaleString()}</span>
          <span className={styles.statLabel}>Total XP</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><RankIcon rank={rank} /></span>
          <span className={styles.statValue}>{rank}</span>
          <span className={styles.statLabel}>Rank</span>
        </div>
      </div>

      {/* ── App Settings ── */}
      <SectionTitle text="App Settings" />
      <div className={styles.card}>
        <ToggleRow label="Sound Effects" icon={<SoundIcon />} checked={soundOn} onChange={setSoundOn} />
        <div className={styles.divider} />
        <ToggleRow label="Notifications" icon={<NotifIcon />} checked={notifOn} onChange={setNotifOn} />
      </div>

      {/* ── Account ── */}
      <SectionTitle text="Account" />
      <div className={styles.card}>
        <div className={styles.row}>
          <span className={styles.label}>Display Name</span>
          <div className={styles.inputWrap}>
            <input className={styles.input} value={displayName} onChange={(e) => setDisplayName(e.target.value)} onBlur={handleSaveDisplayName} placeholder="Your name" />
          </div>
        </div>
      </div>

      {/* ── Preferences ── */}
      <SectionTitle text="Preferences" />
      <div className={styles.card}>
        <PrefRow label="Language" value={meta.language || "Security"} />
        <div className={styles.divider} />
        <PrefRow label="Experience" value={meta.experience || "Expert"} />
        <div className={styles.divider} />
        <PrefRow label="Goal" value={meta.goal || "Other"} />
        <div className={styles.divider} />
        <PrefRow label="Daily Target" value={meta.daily_target ? `${meta.daily_target} min` : "10 min"} />
      </div>

      {/* ── Support ── */}
      <SectionTitle text="Support" />
      <div className={styles.card}>
        <button className={styles.option} onClick={() => window.open("mailto:support@codequest.app")}>
          <span className={styles.optionText}>Contact Us</span>
          <span className={styles.chevron}>&rarr;</span>
        </button>
      </div>

      {/* ── About ── */}
      <SectionTitle text="About" />
      <div className={styles.card}>
        <button className={styles.option}>
          <span className={styles.optionText}>Terms of Use</span>
          <span className={styles.chevron}>&rarr;</span>
        </button>
        <div className={styles.divider} />
        <button className={styles.option}>
          <span className={styles.optionText}>Privacy Policy</span>
          <span className={styles.chevron}>&rarr;</span>
        </button>
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.label}>Version</span>
          <span className={styles.value}>1.0.0</span>
        </div>
      </div>

      {/* ── Log Out ── */}
      <button className={styles.logoutBtn} onClick={handleLogout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Log Out
      </button>
    </div>
  );
}

function SectionTitle({ text }) {
  return <h2 className={styles.sectionTitle}>{text}</h2>;
}

function PrefRow({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

function ToggleRow({ label, icon, checked, onChange }) {
  return (
    <div className={styles.row}>
      <div className={styles.toggleLabel}>
        <span className={styles.toggleIcon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <button
        className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}
        onClick={() => onChange(!checked)}
        aria-label={label}
      >
        <div className={styles.toggleKnob} />
      </button>
    </div>
  );
}

/* ── Icons ── */
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

function SoundIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>;
}

function NotifIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}