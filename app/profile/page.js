"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) return null;

  const meta = user?.user_metadata || {};
  const avatar = meta.avatar_url || user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          {meta.avatar_url ? (
            <img src={meta.avatar_url} alt="" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>{avatar}</div>
          )}
          <div className={styles.avatarRing} />
        </div>
        <h1 className={styles.name}>{meta.full_name || meta.name || user?.email?.split("@")[0] || "User"}</h1>
        <p className={styles.email}>{user?.email}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Preferences</h2>
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.label}>Language</span>
            <span className={styles.value}>{meta.language || "Not set"}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.row}>
            <span className={styles.label}>Experience</span>
            <span className={styles.value}>{meta.experience || "Not set"}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.row}>
            <span className={styles.label}>Goal</span>
            <span className={styles.value}>{meta.goal || "Not set"}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.row}>
            <span className={styles.label}>Daily Target</span>
            <span className={styles.value}>{meta.daily_target || "Not set"}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Account</h2>
        <div className={styles.card}>
          <button className={styles.option} onClick={() => router.push("/onboarding")}>
            <span className={styles.optionText}>Edit Preferences</span>
            <span className={styles.chevron}>&rarr;</span>
          </button>
          <div className={styles.divider} />
          <button className={styles.option}>
            <span className={styles.optionText}>App Settings</span>
            <span className={styles.chevron}>&rarr;</span>
          </button>
          <div className={styles.divider} />
          <button className={styles.option} onClick={handleLogout}>
            <span className={`${styles.optionText} ${styles.danger}`}>Log Out</span>
            <span className={styles.chevron}>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}