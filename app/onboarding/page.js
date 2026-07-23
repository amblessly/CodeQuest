"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { SnakeIcon, GlobeIcon, DatabaseIcon, LightningIcon, RobotIcon, LaptopIcon, GameIcon, TargetIcon, RocketIcon } from "@/components/ui/Icons";
import styles from "./page.module.css";

const languages = [
  { id: "python", icon: SnakeIcon, label: "Python", desc: "Scripting, automation, AI" },
  { id: "web", icon: GlobeIcon, label: "Web Dev", desc: "HTML, CSS, JavaScript, React" },
  { id: "databases", icon: DatabaseIcon, label: "Databases", desc: "SQL, NoSQL, data modeling" },
  { id: "algorithms", icon: LightningIcon, label: "Algorithms", desc: "Data structures, problem-solving" },
  { id: "security", icon: LockIcon, label: "Security", desc: "Cyber security fundamentals" },
  { id: "ai", icon: RobotIcon, label: "AI & ML", desc: "Machine learning, neural networks" },
  { id: "mobile", icon: LaptopIcon, label: "Mobile Dev", desc: "iOS, Android, cross-platform" },
];

const experienceLevels = [
  { id: "new", label: "I'm new to coding", desc: "Never written a line of code before" },
  { id: "basics", label: "I know some basics", desc: "I understand variables, loops, functions" },
  { id: "small", label: "I can write small programs", desc: "I can build simple apps and scripts" },
  { id: "projects", label: "I can build various projects", desc: "I've built full applications before" },
  { id: "expert", label: "I can design complex systems", desc: "I can architect and optimize complex projects" },
];

const goals = [
  { id: "career", label: "Advance my career", icon: "💼" },
  { id: "switch", label: "Switch to tech", icon: "🔄" },
  { id: "projects", label: "Build personal projects", icon: "🚀" },
  { id: "academic", label: "Academic / School", icon: "📚" },
  { id: "fun", label: "Just for fun", icon: "🎮" },
  { id: "other", label: "Other", icon: "✨" },
];

const dailyTargets = [5, 10, 15, 20];

const steps = ["Learn", "Experience", "Goal", "Target", "Ready"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);

  function select(key, value) {
    setSelected(prev => ({ ...prev, [key]: value }));
  }

  async function handleContinue() {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: {
        onboarding_complete: true,
        language: selected.language,
        experience: selected.experience,
        goal: selected.goal,
        daily_target: selected.target,
      },
    });
    router.push("/levels");
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgCircle} style={{ width: 500, height: 500, top: "-20%", left: "-15%", opacity: 0.5 }} />
      <div className={styles.bgCircle} style={{ width: 350, height: 350, bottom: "-10%", right: "-10%", opacity: 0.35 }} />
      <div className={styles.bgCircle} style={{ width: 200, height: 200, top: "40%", right: "30%", opacity: 0.25 }} />

      <div className={styles.card}>
        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div key={i} className={`${styles.dot} ${i <= step ? styles.dotActive : ""} ${i === step ? styles.dotCurrent : ""}`}>
              {i < step ? "✓" : ""}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className={styles.stepContent}>
            <div className={styles.iconWrap}><GameIcon /></div>
            <h1 className={styles.title}>What do you want to learn?</h1>
            <p className={styles.desc}>Pick a path to start your coding journey</p>
            <div className={styles.grid}>
              {languages.map(lang => {
                const active = selected.language === lang.id;
                return (
                  <button
                    key={lang.id}
                    className={`${styles.option} ${active ? styles.optionActive : ""}`}
                    onClick={() => select("language", lang.id)}
                  >
                    <span className={styles.optionIcon}><lang.icon /></span>
                    <span className={styles.optionLabel}>{lang.label}</span>
                    <span className={styles.optionDesc}>{lang.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.iconWrap}><LaptopIcon /></div>
            <h1 className={styles.title}>What&apos;s your coding experience?</h1>
            <p className={styles.desc}>Be honest — this helps us tailor your lessons</p>
            <div className={styles.list}>
              {experienceLevels.map(level => {
                const active = selected.experience === level.id;
                return (
                  <button
                    key={level.id}
                    className={`${styles.rowOption} ${active ? styles.rowOptionActive : ""}`}
                    onClick={() => select("experience", level.id)}
                  >
                    <span className={styles.radio}>{active && <span className={styles.radioDot} />}</span>
                    <span>
                      <span className={styles.rowLabel}>{level.label}</span>
                      <span className={styles.rowDesc}>{level.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.iconWrap}><LightningIcon /></div>
            <h1 className={styles.title}>Why are you learning to code?</h1>
            <p className={styles.desc}>We&apos;ll personalize your experience</p>
            <div className={styles.list}>
              {goals.map(g => {
                const active = selected.goal === g.id;
                return (
                  <button
                    key={g.id}
                    className={`${styles.rowOption} ${active ? styles.rowOptionActive : ""}`}
                    onClick={() => select("goal", g.id)}
                  >
                    <span className={styles.radio}>{active && <span className={styles.radioDot} />}</span>
                    <span>
                      <span className={styles.rowLabel}>{g.icon} {g.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.iconWrap}><TargetIcon /></div>
            <h1 className={styles.title}>Set your daily learning target</h1>
            <p className={styles.desc}>How much time can you spare each day?</p>
            <div className={styles.targetGrid}>
              {dailyTargets.map(t => {
                const active = selected.target === t;
                return (
                  <button
                    key={t}
                    className={`${styles.targetOption} ${active ? styles.targetOptionActive : ""}`}
                    onClick={() => select("target", t)}
                  >
                    <span className={styles.targetNumber}>{t}</span>
                    <span className={styles.targetUnit}>min/day</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className={styles.stepContent}>
            <div className={styles.iconWrap}><RocketIcon /></div>
            <h1 className={styles.title}>You&apos;re all set!</h1>
            <p className={styles.desc}>Let&apos;s begin your coding adventure</p>
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Learning</span>
                <span className={styles.summaryValue}>{languages.find(l => l.id === selected.language)?.label}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Experience</span>
                <span className={styles.summaryValue}>{experienceLevels.find(e => e.id === selected.experience)?.label}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Goal</span>
                <span className={styles.summaryValue}>{goals.find(g => g.id === selected.goal)?.label}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Daily Target</span>
                <span className={styles.summaryValue}>{selected.target} min/day</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          {step > 0 && (
            <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          <button
            className={styles.continueBtn}
            onClick={handleContinue}
            disabled={loading || !getSelected(step, selected)}
          >
            {loading ? "Loading..." : step === steps.length - 1 ? "Begin My Journey →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getSelected(step, selected) {
  const keys = ["language", "experience", "goal", "target"];
  return selected[keys[step]];
}


