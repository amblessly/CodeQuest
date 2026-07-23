"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { GameIcon } from "@/components/ui/Icons";
import styles from "./page.module.css";

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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

const LockCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    <path d="m9 16 2 2 4-4" />
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

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
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
  const [mode, setMode] = useState("signup");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [verified, setVerified] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      setVerified(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleResend() {
    if (resendCooldown > 0) return;
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: signedUpEmail,
    });
    if (!error) {
      setResendCooldown(60);
    } else {
      setError(error.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");
    const username = form.get("username");
    const confirmPassword = form.get("confirmPassword");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username, display_name: username },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) {
          setError(signUpError.message || "Something went wrong");
          setLoading(false);
          return;
        }

        if (data?.user?.identities?.length === 0) {
          setError("This email is already registered");
          setLoading(false);
          return;
        }

        setSignedUpEmail(email);
        setLoading(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message || "Invalid credentials");
          setLoading(false);
          return;
        }

        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  if (signedUpEmail) {
    return (
      <div className={styles.page}>
        <div className={styles.bgCircle} style={{ width: 400, height: 400, top: "-10%", right: "-10%", opacity: 0.5 }} />
        <div className={styles.bgCircle} style={{ width: 250, height: 250, bottom: "10%", left: "-8%", opacity: 0.35 }} />
        <div className={styles.bgCircle} style={{ width: 180, height: 180, top: "40%", right: "15%", opacity: 0.25 }} />
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.logo}><GameIcon /></span>
            <h1 className={styles.title}>CodeQuest</h1>
          </div>
          <div className={styles.verifyCard}>
            <MailSentIcon />
            <h2 className={styles.verifyTitle}>Verify Your Email</h2>
            <p className={styles.verifyDesc}>
              We sent a verification link to<br />
              <strong>{signedUpEmail}</strong>
            </p>
            <p className={styles.verifyHint}>
              Click the link in the email to activate your account, then sign in.
            </p>
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.verifyBtn}
            >
              Open Gmail
            </a>
            <button
              className={styles.resendBtn}
              onClick={handleResend}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email"}
            </button>
            <button
              className={styles.switchLink}
              onClick={() => { setSignedUpEmail(""); setMode("login"); }}
              style={{ marginTop: 12, background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className={styles.page}>
        <div className={styles.bgCircle} style={{ width: 400, height: 400, top: "-10%", right: "-10%", opacity: 0.5 }} />
        <div className={styles.bgCircle} style={{ width: 250, height: 250, bottom: "10%", left: "-8%", opacity: 0.35 }} />
        <div className={styles.bgCircle} style={{ width: 180, height: 180, top: "40%", right: "15%", opacity: 0.25 }} />
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.logo}><GameIcon /></span>
            <h1 className={styles.title}>CodeQuest</h1>
          </div>
          <div className={styles.verifyCard}>
            <CheckCircleIcon />
            <h2 className={styles.verifyTitle}>Email Verified!</h2>
            <p className={styles.verifyDesc}>
              Your account is now active. You can sign in and start your quest!
            </p>
            <button
              className={styles.verifyBtn}
              onClick={() => { setVerified(false); setMode("login"); }}
              style={{ border: "none", cursor: "pointer" }}
            >
              Sign In Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgCircle} style={{ width: 400, height: 400, top: "-10%", right: "-10%", opacity: 0.5 }} />
      <div className={styles.bgCircle} style={{ width: 250, height: 250, bottom: "10%", left: "-8%", opacity: 0.35 }} />
      <div className={styles.bgCircle} style={{ width: 180, height: 180, top: "40%", right: "15%", opacity: 0.25 }} />
      <a href="/" className={styles.backLink}>← Back</a>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.logo}><GameIcon /></span>
          <h1 className={styles.title}>CodeQuest</h1>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
            onClick={() => { setMode("signup"); setError(""); }}
          >
            Sign Up
          </button>
          <button
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Sign In
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <div className={styles.inputWrap}>
                <UserIcon />
                <input className={styles.input} name="username" type="text" placeholder="Your hero name" required />
              </div>
            </div>
          )}

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
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrap}>
                <LockCheckIcon />
                <input className={styles.input} name="confirmPassword" type={showConfirmPw ? "text" : "password"} placeholder="••••••••" required />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirmPw(!showConfirmPw)} tabIndex={-1}>
                  {showConfirmPw ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>
            </div>
          )}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Loading..." : mode === "signup" ? "Start Quest →" : "Let's Go →"}
          </button>
        </form>

        <p className={styles.switchText}>
          {mode === "signup" ? (
            <>Already have an account? <button className={styles.switchLink} onClick={() => { setMode("login"); setError(""); }}>Sign In</button></>
          ) : (
            <>No account yet? <button className={styles.switchLink} onClick={() => { setMode("signup"); setError(""); }}>Sign Up</button></>
          )}
        </p>
      </div>

    </div>
  );
}
