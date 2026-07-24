"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import styles from "./page.module.css";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyUserId, setVerifyUserId] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      router.push("/dashboard");
    }
  }, [router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const res = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      const data = await res.json();
      if (cancelled) return;

      if (data.verified) {
        router.push("/dashboard");
      } else {
        setVerifyUserId(session.user.id);
        setVerifyEmail(session.user.email || "");
        setShowVerify(true);
      }
    }

    checkSession();
    return () => { cancelled = true; };
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    const supabase = createClient();

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email, password,
      });

      if (signInError) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email, password,
          options: {
            data: {
              username: email.split("@")[0],
              display_name: email.split("@")[0],
            },
          },
        });

        if (signUpError) {
          setError(
            signUpError.message === "User already registered"
              ? "Invalid credentials"
              : signUpError.message || "Something went wrong"
          );
          setLoading(false);
          return;
        }

        setVerifyUserId(signUpData.user.id);
        setVerifyEmail(email);
        setShowVerify(true);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: signInData.user.id }),
      });
      const data = await res.json();

      if (data.verified) {
        router.push("/dashboard");
      } else {
        setVerifyUserId(signInData.user.id);
        setVerifyEmail(email);
        setShowVerify(true);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  async function handleVerify() {
    setVerifyLoading(true);

    try {
      const res = await fetch("/api/auth/complete-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: verifyUserId, email: verifyEmail }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError("Something went wrong. Please try again.");
        setShowVerify(false);
        setVerifyLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setShowVerify(false);
      setVerifyLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <a href="/" className={styles.back}>← Back</a>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.logo}>&lt;/&gt;</span>
          <h1 className={styles.title}>CodeQuest</h1>
        </div>

        {error ? <div className={styles.error}>{error}</div> : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrap}>
              <MailIcon />
              <input className={styles.input} name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <LockIcon />
              <input className={styles.input} name="password" type={showPw ? "text" : "password"} placeholder="••••••••" minLength={8} required />
              <button type="button" className={styles.eye} onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
          </div>

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? "Loading..." : "Let's Go →"}
          </button>
        </form>
      </div>

      {showVerify ? (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <MailSentIcon />
            </div>
            <h2 className={styles.modalTitle}>Welcome to CodeQuest!</h2>
            <p className={styles.modalDesc}>
              A welcome email has been sent to<br />
              <strong>{verifyEmail}</strong>
            </p>
            <p className={styles.modalHint}>
              Click Verify to start your coding adventure!
            </p>
            <button
              className={styles.submit}
              onClick={handleVerify}
              disabled={verifyLoading}
            >
              {verifyLoading ? "Please wait..." : "Verify →"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const MailSentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    <path d="M16 21l3-3 3 3" />
    <path d="M19 18v6" />
  </svg>
);