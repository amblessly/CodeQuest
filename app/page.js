import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/ui/Navbar";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  BookIcon, TargetIcon, MedalIcon, MapIcon,
  SnakeIcon, GlobeIcon, DatabaseIcon, LightningIcon,
  LockIcon, RobotIcon, JoystickIcon, PencilIcon, PuzzleIcon,
  TrophyIcon, LaptopIcon, StarIcon, LightbulbIcon, SparkleIcon,
  SwordIcon,
} from "@/components/ui/Icons";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
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
      <div className={styles.heroBg}>
        <div className={styles.heroShape} style={{ top: "-20%", left: "-10%", width: 500, height: 500, opacity: 0.12 }} />
        <div className={styles.heroShape} style={{ bottom: "-30%", right: "-15%", width: 600, height: 600, opacity: 0.08 }} />
      </div>
      <div className={`container ${styles.heroInner}`}>
        <div className={`${styles.heroContent} animate-fadeInUp`}>
          <div className={styles.badge}>
            <SparkleIcon /> Learn Through Play
          </div>
          <h1 className={styles.title}>
            Level Up Your<br />
            <span className={styles.highlight}>Coding Skills</span>
          </h1>
          <p className={styles.sub}>
            CodeQuest turns coding into an epic adventure. Solve bite-sized quizzes,
            earn XP, unlock levels, and become a coding hero.
          </p>
          <div className={styles.actions}>
            <Button href="/auth" variant="green">
              Get Started Free →
            </Button>
            <Button href="#features" variant="outline">
              Explore
            </Button>
          </div>
        </div>
        <div className={`${styles.heroVisual} animate-float`}>
          <div className={styles.heroArt}>
            <div className={styles.heroIcon}>&lt;/&gt;</div>
            <div className={styles.codeCard}>
              <div className={styles.codeDot} style={{ background: "var(--red)" }} />
              <div className={styles.codeDot} style={{ background: "var(--orange)" }} />
              <div className={styles.codeDot} style={{ background: "var(--green)" }} />
              <div className={styles.codeLine} style={{ "--i": 1 }}><span className={styles.kw}>def</span> <span className={styles.fn}>quest</span>():</div>
              <div className={styles.codeLine} style={{ "--i": 2 }}>&nbsp;&nbsp;<span className={styles.kw}>return</span> <span className={styles.str}>"CodeQuest!"</span></div>
              <div className={styles.codeLineResult} style={{ "--i": 3 }}><TrophyIcon /> XP +100</div>
            </div>
            <div className={styles.floatIcon} style={{ top: "5%", right: "-5%" }}><StarIcon /></div>
            <div className={styles.floatIcon} style={{ bottom: "20%", left: "-8%" }}><LightbulbIcon /></div>
            <div className={styles.floatIcon} style={{ top: "45%", left: "-15%" }}><SwordIcon /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <div className={styles.statsBar}>
      <div className={`container ${styles.statsInner}`}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>50+</span>
          <span className={styles.statLbl}>Interactive Quizzes</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>7</span>
          <span className={styles.statLbl}>Learning Paths</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>∞</span>
          <span className={styles.statLbl}>Fun Guaranteed</span>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    { icon: GlobeIcon, title: "Frontend Development", desc: "Build beautiful UIs with HTML, CSS, JavaScript, and modern frameworks", color: "var(--blue)" },
    { icon: DatabaseIcon, title: "Backend Development", desc: "Learn servers, APIs, databases, authentication, and application logic", color: "var(--green)" },
    { icon: LaptopIcon, title: "Mobile Development", desc: "Create mobile apps for Android, iOS, and cross-platform devices", color: "var(--orange)" },
    { icon: LightningIcon, title: "Programming Fundamentals", desc: "Variables, loops, functions, OOP, and problem-solving", color: "var(--purple)" },
    { icon: DatabaseIcon, title: "Databases", desc: "Practice data modeling, SQL, NoSQL, optimization, and database design", color: "var(--blue)" },
    { icon: SnakeIcon, title: "Algorithms & Data Structures", desc: "Improve logical thinking and solve increasingly challenging problems", color: "var(--green)" },
    { icon: LockIcon, title: "Cloud & DevOps", desc: "Explore deployment, containers, CI/CD, Linux, and cloud platforms", color: "var(--red)" },
    { icon: RobotIcon, title: "Cybersecurity", desc: "Learn secure coding, networking, ethical hacking, and digital security", color: "var(--purple)" },
    { icon: LightbulbIcon, title: "Artificial Intelligence", desc: "Understand AI, ML, prompt engineering, and modern intelligent systems", color: "var(--orange)" },
  ];

  return (
    <section id="features" className={styles.features}>
      <RevealOnScroll>
      <div className={`container ${styles.sectionInner}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}><TrophyIcon /></span>
          <h2 className={styles.sectionTitle}>Explore Coding Worlds</h2>
          <p className={styles.sectionDesc}>
            Discover different areas of software development. Master each world by completing quizzes, earning XP, and unlocking new challenges.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={styles.featureIcon} style={{ background: f.color }}><f.icon /></div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: "1", icon: PencilIcon, title: "Sign Up Free", desc: "Create your account in seconds" },
    { num: "2", icon: TargetIcon, title: "Pick a Path", desc: "Choose what you want to learn" },
    { num: "3", icon: PuzzleIcon, title: "Solve Quizzes", desc: "Answer questions and earn XP" },
    { num: "4", icon: TrophyIcon, title: "Level Up", desc: "Unlock harder levels and rank up" },
  ];

  return (
    <section id="how" className={styles.how}>
      <RevealOnScroll>
      <div className={`container ${styles.sectionInner}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}><JoystickIcon /></span>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionDesc}>
            Four simple steps to start your coding adventure!
          </p>
        </div>
        <div className={styles.stepsRow}>
          {steps.map((s, i) => (
            <div key={i} className={styles.stepCard} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepIcon}><s.icon /></div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <RevealOnScroll>
      <div className={`container ${styles.ctaInner}`}>
        <div className={styles.ctaIcons}>
          <span className={styles.ctaIcon}>&lt;/&gt;</span>
          <span className={styles.ctaIcon}><LaptopIcon /></span>
          <span className={styles.ctaIcon}><LightningIcon /></span>
        </div>
        <h2 className={styles.ctaTitle}>Ready to Start Your Quest?</h2>
        <p className={styles.ctaDesc}>
          Join thousands of learners and start coding today. <strong>It&apos;s free!</strong>
        </p>
        <Button href="/auth" variant="green">
          Get Started Now →
        </Button>
      </div>
      </RevealOnScroll>
    </section>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>&lt;/&gt; CodeQuest</span>
            <p>Making coding fun, one quiz at a time.</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#features" className={styles.footerLink}>Features</a>
            <a href="#how" className={styles.footerLink}>How It Works</a>
            <a href="/auth" className={styles.footerLink}>Get Started</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          &copy; 2026 CodeQuest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
