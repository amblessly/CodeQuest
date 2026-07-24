"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { SnakeIcon, GlobeIcon, DatabaseIcon, LightningIcon, RobotIcon, LaptopIcon, GameIcon, TargetIcon, RocketIcon, LockIcon } from "@/components/ui/Icons";
import styles from "./page.module.css";

const languages = [
  { id: "python", icon: SnakeIcon, label: "Python", desc: "Scripting, automation, AI", color: "var(--green)" },
  { id: "web", icon: GlobeIcon, label: "Web Dev", desc: "HTML, CSS, JavaScript, React", color: "var(--blue)" },
  { id: "databases", icon: DatabaseIcon, label: "Databases", desc: "SQL, NoSQL, data modeling", color: "var(--orange)" },
  { id: "algorithms", icon: LightningIcon, label: "Algorithms", desc: "Data structures, problem-solving", color: "var(--purple)" },
  { id: "security", icon: LockIcon, label: "Security", desc: "Cyber security fundamentals", color: "var(--red)" },
  { id: "ai", icon: RobotIcon, label: "AI & ML", desc: "Machine learning, neural networks", color: "var(--blue)" },
  { id: "mobile", icon: LaptopIcon, label: "Mobile Dev", desc: "iOS, Android, cross-platform", color: "var(--green)" },
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

const stepIcons = [GameIcon, LaptopIcon, LightningIcon, TargetIcon, RocketIcon];
const stepLabels = ["Learn", "Experience", "Goal", "Target", "Ready"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);

  function select(key, value) {
    setSelected(prev => ({ ...prev, [key]: value }));
  }

  async function handleContinue() {
    if (step < stepLabels.length - 1) {
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

  const StepIcon = stepIcons[step];

  function canContinue() {
    if (step === 4) return true;
    const keys = ["language", "experience", "goal", "target"];
    return !!selected[keys[step]];
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${((step + 1) / stepLabels.length) * 100}%` }} />
          </div>
          <div className={styles.stepLabels}>
            {stepLabels.map((label, i) => (
              <span key={i} className={`${styles.stepLabel} ${i <= step ? styles.stepLabelActive : ""}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIconWrap}><StepIcon /></div>
          <h1 className={styles.title}>
            {step === 0 && "What do you want to learn?"}
            {step === 1 && "What's your coding experience?"}
            {step === 2 && "Why are you learning to code?"}
            {step === 3 && "Set your daily target"}
            {step === 4 && "You're all set!"}
          </h1>
          <p className={styles.desc}>
            {step === 0 && "Pick a path to start your coding journey"}
            {step === 1 && "Be honest — this helps us tailor your lessons"}
            {step === 2 && "We'll personalize your experience"}
            {step === 3 && "How much time can you spare each day?"}
            {step === 4 && "Let's begin your coding adventure"}
          </p>
        </div>

        <div className={styles.stepContent}>
          {step === 0 && (
            <div className={styles.grid}>
              {languages.map(lang => {
                const active = selected.language === lang.id;
                return (
                  <button
                    key={lang.id}
                    className={`${styles.option} ${active ? styles.optionActive : ""}`}
                    onClick={() => select("language", lang.id)}
                    style={active ? { borderColor: lang.color } : {}}
                  >
                    <span className={styles.optionIcon} style={{ background: active ? lang.color : "var(--bg-card)" }}><lang.icon /></span>
                    <span className={styles.optionLabel}>{lang.label}</span>
                    <span className={styles.optionDesc}>{lang.desc}</span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className={styles.list}>
              {experienceLevels.map(level => {
                const active = selected.experience === level.id;
                return (
                  <button
                    key={level.id}
                    className={`${styles.rowOption} ${active ? styles.rowOptionActive : ""}`}
                    onClick={() => select("experience", level.id)}
                  >
                    <span className={styles.radio}>
                      {active && <span className={styles.radioDot} />}
                    </span>
                    <span>
                      <span className={styles.rowLabel}>{level.label}</span>
                      <span className={styles.rowDesc}>{level.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className={styles.list}>
              {goals.map(g => {
                const active = selected.goal === g.id;
                return (
                  <button
                    key={g.id}
                    className={`${styles.rowOption} ${active ? styles.rowOptionActive : ""}`}
                    onClick={() => select("goal", g.id)}
                  >
                    <span className={styles.radio}>
                      {active && <span className={styles.radioDot} />}
                    </span>
                    <span className={styles.rowLabel}>{g.icon} {g.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 3 && (
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
                    <span className={styles.targetUnit}>min / day</span>
                    <span className={styles.targetBadge}>
                      {t <= 5 ? "Casual" : t <= 10 ? "Regular" : t <= 15 ? "Dedicated" : "Hardcore"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 4 && (
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
          )}
        </div>

        <div className={styles.footer}>
          {step > 0 && (
            <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
          <button
            className={styles.continueBtn}
            onClick={handleContinue}
            disabled={loading || !canContinue()}
          >
            {loading ? "Loading..." : step === stepLabels.length - 1 ? "Begin My Journey →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
