"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [notifOn, setNotifOn] = useState(true);
  const [displayName, setDisplayName] = useState("");

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

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/profile" className={styles.backBtn}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
        <h1 className={styles.topTitle}>Settings</h1>
        <span />
      </div>

      {/* ── App Settings ── */}
      <SectionTitle text="App Settings" />
      <div className={styles.card}>
        <ToggleRow label="Sound Effects" checked={soundOn} onChange={setSoundOn} />
        <div className={styles.divider} />
        <ToggleRow label="Notifications" checked={notifOn} onChange={setNotifOn} />
      </div>

      {/* ── Account ── */}
      <SectionTitle text="Account" />
      <div className={styles.card}>
        <div className={styles.row}>
          <span className={styles.label}>Display Name</span>
          <div className={styles.inputWrap}>
            <input className={styles.input} value={displayName} onChange={(e) => setDisplayName(e.target.value)} onBlur={handleSaveDisplayName} />
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

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <button className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`} onClick={() => onChange(!checked)} aria-label={label}>
        <div className={styles.toggleKnob} />
      </button>
    </div>
  );
}