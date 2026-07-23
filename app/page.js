import Navbar from "@/components/ui/Navbar";
import Button from "@/components/ui/Button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <div className={`${styles.heroContent} animate-fadeInUp`}>
          <div className={styles.heroBadge}>🎮 Learn Through Play</div>
          <h1 className={styles.heroTitle}>
            Level Up Your<br />
            <span className={styles.heroHighlight}>Coding Skills</span>
          </h1>
          <p className={styles.heroSub}>
            CodeQuest turns coding into an adventure! Solve fun quizzes,
            earn XP, unlock levels, and become a coding hero. 🚀
          </p>
          <div className={styles.heroActions}>
            <Button href="/auth" variant="green">
              Get Started Free →
            </Button>
            <Button href="#about" variant="outline">
              Learn More
            </Button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Quizzes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>5</span>
              <span className={styles.statLabel}>Categories</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>Fun Guaranteed</span>
            </div>
          </div>
        </div>
        <div className={`${styles.heroVisual} animate-float`}>
          <div className={styles.heroArt}>
            <span className={styles.heroEmoji}>⚔️</span>
            <div className={styles.codeBubble}>
              <span className={styles.codeLine} style={{ "--i": 1 }}>def hello():</span>
              <span className={styles.codeLine} style={{ "--i": 2 }}>&nbsp;&nbsp;print("CodeQuest!")</span>
              <span className={styles.codeLine} style={{ "--i": 3 }}>🏆 → XP +100</span>
            </div>
            <div className={styles.floatingBadge} style={{ top: "10%", right: "-10%" }}>✨</div>
            <div className={styles.floatingBadge} style={{ bottom: "15%", left: "-8%" }}>💡</div>
            <div className={styles.floatingBadge} style={{ top: "50%", left: "-12%" }}>⭐</div>
          </div>
        </div>
      </div>
      <div className={styles.heroBgShape} />
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className={`container ${styles.sectionInner}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>📖</span>
          <h2 className={styles.sectionTitle}>What is CodeQuest?</h2>
          <p className={styles.sectionDesc}>
            CodeQuest is a gamified learning platform that makes coding fun and
            addictive — just like your favorite mobile games!
          </p>
        </div>
        <div className={styles.aboutCards}>
          <div className={`${styles.aboutCard} animate-fadeInUp`} style={{ animationDelay: "0.1s" }}>
            <div className={styles.aboutCardIcon}>🎯</div>
            <h3>Learn by Doing</h3>
            <p>Bite-sized quizzes that teach you real coding concepts through interactive challenges.</p>
          </div>
          <div className={`${styles.aboutCard} animate-fadeInUp`} style={{ animationDelay: "0.2s" }}>
            <div className={styles.aboutCardIcon}>🏅</div>
            <h3>Earn Rewards</h3>
            <p>Gain XP, level up, and unlock achievements as you progress through your coding journey.</p>
          </div>
          <div className={`${styles.aboutCard} animate-fadeInUp`} style={{ animationDelay: "0.3s" }}>
            <div className={styles.aboutCardIcon}>🗺️</div>
            <h3>Your Adventure</h3>
            <p>Follow a structured path from beginner to advanced, all at your own pace.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { emoji: "🐍", title: "Python", desc: "Master Python from basics to advanced", color: "var(--blue)" },
    { emoji: "🌐", title: "Web Dev", desc: "HTML, CSS, JavaScript & frameworks", color: "var(--orange)" },
    { emoji: "🗄️", title: "Databases", desc: "SQL, NoSQL & data modeling", color: "var(--purple)" },
    { emoji: "⚡", title: "Algorithms", desc: "Problem-solving & data structures", color: "var(--green)" },
    { emoji: "🔒", title: "Security", desc: "Cyber security fundamentals", color: "var(--red)" },
    { emoji: "🤖", title: "AI & ML", desc: "Intro to artificial intelligence", color: "var(--blue)" },
  ];

  return (
    <section id="features" className={styles.features}>
      <div className={`container ${styles.sectionInner}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>🚀</span>
          <h2 className={styles.sectionTitle}>Choose Your Path</h2>
          <p className={styles.sectionDesc}>
            Multiple categories to explore. Start anywhere, learn everything!
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <div
              key={i}
              className={`${styles.featureCard} animate-fadeInUp`}
              style={{ animationDelay: `${i * 0.1}s`, "--card-color": f.color }}
            >
              <div className={styles.featureIcon}>{f.emoji}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: "1", emoji: "📝", title: "Sign Up", desc: "Create your free account in seconds" },
    { num: "2", emoji: "🎯", title: "Pick a Category", desc: "Choose what you want to learn" },
    { num: "3", emoji: "🧩", title: "Solve Quizzes", desc: "Answer questions and earn XP" },
    { num: "4", emoji: "🏆", title: "Level Up", desc: "Unlock harder levels and track progress" },
  ];

  return (
    <section id="how" className={styles.how}>
      <div className={`container ${styles.sectionInner}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEmoji}>🕹️</span>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionDesc}>
            Four simple steps to start your coding adventure!
          </p>
        </div>
        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div key={i} className={`${styles.step} animate-fadeInUp`} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className={styles.stepNumber}>{s.num}</div>
              <div className={styles.stepEmoji}>{s.emoji}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
              {i < steps.length - 1 && <div className={styles.stepConnector} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className={`container ${styles.ctaInner}`}>
        <div className={styles.ctaArt}>
          <span className={styles.ctaEmoji}>🎮</span>
          <span className={styles.ctaEmoji}>💻</span>
          <span className={styles.ctaEmoji}>⚡</span>
        </div>
        <h2 className={styles.ctaTitle}>Ready to Start Your Quest?</h2>
        <p className={styles.ctaDesc}>
          Join thousands of learners and start coding today. <strong>It&apos;s free!</strong>
        </p>
        <Button href="/auth" variant="green">
          Get Started Now →
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerBrand}>
          <span className={styles.footerLogo}>⚔️ CodeQuest</span>
          <p>Making coding fun, one quiz at a time.</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="#about" className={styles.footerLink}>About</a>
          <a href="#features" className={styles.footerLink}>Features</a>
          <a href="#how" className={styles.footerLink}>How It Works</a>
        </div>
        <div className={styles.footerCopyright}>
          © 2026 CodeQuest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
