import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  animate,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles.css';

/* ==========================================================================
   CONTENT
   Documents live in public/projects and public/research.
   ========================================================================== */

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Activities', href: '#activities' },
  { label: 'Skills', href: '#skills' },
];

const DISCIPLINES = [
  { n: '01', name: 'Software Engineering', role: 'Foundation' },
  { n: '02', name: 'Artificial Intelligence', role: 'Intelligence' },
  { n: '03', name: 'Research', role: 'Evidence' },
  { n: '04', name: 'Internet of Things', role: 'Physical systems' },
];

const PAPER = {
  pdf: 'research/IoTutorMine_ASE_2026.pdf',
  tool: 'https://ahmedbahaj.github.io/IoTutorMine/',
  replication: 'https://doi.org/10.5281/zenodo.20135165',
  source: 'https://doi.org/10.5281/zenodo.20134482',
  // Table 1, corpus-level (micro) F1 on the 20-tutorial benchmark
  results: [
    { model: 'Gemini 3 Flash', f1: 0.933 },
    { model: 'GPT-5.5', f1: 0.887 },
    { model: 'Claude Opus 4.7', f1: 0.868 },
  ],
};

const PROJECTS = [
  {
    name: 'Think-Up',
    category: 'AI-assisted study platform',
    description: 'A collaborative study platform for university students that matches peers by courses and complementary strengths, hosts live study sessions, and produces AI summaries from transcribed sessions.',
    tech: 'HTML · CSS · JavaScript · Firebase (Firestore, Auth, Cloud Functions) · Daily.co · Deepgram · Claude API',
    file: 'projects/Think_Up.pdf',
    cta: 'View Project Case Study',
  },
  {
    name: 'Masadir',
    category: 'Academic support · Project management',
    description: 'An AI-assisted academic support concept for resources, writing and study planning, delivered with a full project management plan: work breakdown structure, cost estimation, SWOT and financial analysis, and a high-fidelity prototype.',
    tech: 'Software Project Management · UI/UX · Prototyping',
    file: 'projects/masadir.pdf',
    cta: 'View Project Slides',
  },
];

const ACTIVITIES = [
  {
    type: 'Research presentation',
    title: 'Scientific e-poster at ATTD',
    detail: 'Presented “Comparative Analysis: ChatGPT vs. Healthcare Professionals in Addressing Type-1 Diabetes FAQs in English and Arabic” at Advanced Technologies & Treatments for Diabetes, an international scientific conference.',
  },
  {
    type: 'Hackathon',
    title: 'Riyadh Air Hackathon',
    detail: 'An AI-assisted lost-item recovery concept that compares passenger reports with crew-submitted images of found items, using image analysis and item characteristics.',
  },
  {
    type: 'Community',
    title: 'Member — Automation, IoT & Robotics',
    detail: 'Member of a Google-related university community group focused on automation, the Internet of Things and robotics.',
  },
];

const SKILLS = [
  { group: 'Engineering', items: ['Requirements Engineering', 'System Analysis', 'Software Architecture', 'Software Design', 'UML', 'Project Management', 'Git & GitHub'] },
  { group: 'Backend & Data', items: ['Spring Boot', 'REST APIs', 'Firebase', 'Firestore', 'SQL', 'Database Systems'] },
  { group: 'Mobile', items: ['Android', 'Android Studio', 'Java', 'XML'] },
  { group: 'AI & Research', items: ['Large Language Models', 'Prompt Engineering', 'RAG', 'LLM Evaluation', 'Benchmark Development', 'Dataset Preparation', 'Scientific Writing', 'Overleaf'] },
  { group: 'IoT & Hardware', items: ['Bluetooth Low Energy', 'Wearable Sensors', 'Sensor Integration', 'Arduino', 'Raspberry Pi', 'Automation', 'Robotics'] },
  { group: 'Languages & Design', items: ['Java', 'Python', 'JavaScript', 'HTML', 'CSS', 'Figma', 'Prototyping', 'Google Stitch'] },
];

const CONTACT_LINKS = [
  { label: 'LinkedIn', value: 'abdullah-alahmadi', href: 'https://www.linkedin.com/in/abdullah-alahmadi-2b4958350' },
  { label: 'GitHub', value: 'abdullah-t1d', href: 'https://github.com/abdullah-t1d' },
  { label: 'Phone', value: '058 255 9616', href: 'tel:+966582559616' },
];

/* ==========================================================================
   MOTION HELPERS
   ========================================================================== */

const ease = [0.22, 1, 0.36, 1];
const once = { once: true, margin: '0px 0px -12% 0px' };

// Fade + rise when scrolled into view. Appears instantly for reduced-motion users.
function Reveal({ as = 'div', delay = 0, x = 0, y = 20, ...props }) {
  const Tag = motion[as];
  const reduce = useReducedMotion();
  return (
    <Tag
      initial={reduce ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={once}
      transition={{ duration: 0.9, ease, delay }}
      {...props}
    />
  );
}

// Section heading: eyebrow + title that slides up from behind a mask.
function Heading({ eyebrow, title, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <div className={`heading ${className}`}>
      <Reveal as="p" className="eyebrow" y={8}>{eyebrow}</Reveal>
      <motion.h2 className="heading__title" initial={reduce ? false : 'hidden'} whileInView="shown" viewport={once}>
        <motion.span
          className="heading__mask"
          variants={{ hidden: { y: '105%' }, shown: { y: '0%' } }}
          transition={{ duration: 1, ease, delay: 0.08 }}
        >
          {title}
        </motion.span>
      </motion.h2>
    </div>
  );
}

// Counts up to a number the first time it's visible.
function Count({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, once);
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.4, ease, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return <span ref={ref}>{value}</span>;
}

const ExternalLink = ({ href, className = 'link', children }) => (
  <a className={className} href={href} target="_blank" rel="noopener noreferrer">
    {children} <span className="link__arrow" aria-hidden="true">↗</span>
  </a>
);

/* ==========================================================================
   SECTIONS
   ========================================================================== */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    document.querySelectorAll('main section[id], footer[id]').forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener('keydown', onKey);
      observer.disconnect();
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="nav-wrap">
      <motion.nav
        className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}
        aria-label="Primary"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="nav__bar">
          <a href="#top" className="nav__name" onClick={close}>Abdullah Alahmadi</a>

          <ul className="nav__links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} aria-current={active === l.href ? 'true' : undefined}>
                  {active === l.href && <motion.span layoutId="nav-active" className="nav__active" transition={{ duration: 0.45, ease }} />}
                  <span className="nav__label">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <a href="#contact" className="nav__cta">Contact</a>

          <button className="nav__menu" type="button" aria-expanded={open} aria-controls="nav-drawer" onClick={() => setOpen(!open)}>
            <span>{open ? 'Close' : 'Menu'}</span>
            <span className="nav__menu-icon" aria-hidden="true"><i /><i /></span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="nav-drawer"
              className="nav__drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease }}
            >
              <ul>
                {[...NAV_LINKS, { label: 'Contact', href: '#contact' }].map((l, i) => (
                  <motion.li key={l.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.04, duration: 0.4, ease }}>
                    <a href={l.href} onClick={close} aria-current={active === l.href ? 'true' : undefined}>{l.label}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const enter = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease, delay: 0.2 + i * 0.1 },
  });

  return (
    <section id="top" className="hero">
      <div className="container">
        <motion.a href="#research" className="hero__news" {...enter(0)}>
          <span className="hero__news-tag">ASE '26</span>
          IoTutorMine paper in the ASE 2026 proceedings
          <span className="link__arrow" aria-hidden="true">→</span>
        </motion.a>

        <motion.h1 className="hero__name" {...enter(1)}>
          Abdullah{' '}<br />Alahmadi
        </motion.h1>

        <motion.p className="hero__statement" {...enter(2)}>
          Software engineering at the core, extended into <em>AI</em>, <em>research</em> and <em>IoT</em>.
        </motion.p>

        <div className="hero__path">
          <motion.span
            className="hero__line"
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease, delay: 0.6 }}
          />
          <ol>
            {DISCIPLINES.map((d, i) => (
              <motion.li key={d.n} className={i === 0 ? 'is-primary' : undefined} {...enter(4 + i * 0.8)}>
                <span className="hero__node" aria-hidden="true" />
                <span className="mono">{d.n} · {d.role}</span>
                <span className="hero__discipline">{d.name}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about">
          <Heading eyebrow="About" title="Engineering first. Then the questions worth building for." />
          <Reveal className="about__text" delay={0.15}>
            <p>I'm a fourth-year Software Engineering student at the University of Jeddah. My foundation is software engineering: requirements, architecture and building real systems, which I extend into artificial intelligence, large language models and the Internet of Things.</p>
            <p>I'm drawn to systems for healthcare and education, and to research that measures how well AI systems actually work.</p>
            <p className="mono about__place">Jeddah, Saudi Arabia</p>
          </Reveal>
        </div>

        <Reveal className="education" id="education">
          <p className="eyebrow">Education</p>
          <div className="education__row">
            <div>
              <h3 className="education__degree">Bachelor of Software Engineering</h3>
              <p className="education__school">University of Jeddah · College of Computer Science &amp; Engineering</p>
              <p className="education__areas">Requirements Engineering · Software Project Management · Mobile Programming · Web Development · Database Systems · System Analysis · UX Design</p>
            </div>
            <dl className="education__stats">
              <div><dt className="mono">Period</dt><dd>2023–27</dd><dd className="mono">Expected</dd></div>
              <div><dt className="mono">GPA</dt><dd>4.82</dd><dd className="mono">out of 5.00</dd></div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Research() {
  const reduce = useReducedMotion();
  return (
    <section id="research" className="section band band--research">
      <div className="container">
        <Heading eyebrow="Research" title="Research" className="heading--quiet" />

        <article className="paper">
          <div className="paper__main">
            <Reveal as="p" className="mono paper__venue">
              ASE '26 · Munich, Germany · October 12–16, 2026
            </Reveal>
            <Reveal as="h3" className="paper__title" delay={0.05}>IoTutorMine</Reveal>
            <Reveal as="p" className="paper__subtitle" delay={0.1}>
              A Tool for Mining Hardware Bills of Materials from IoT Tutorial Videos
            </Reveal>
            <Reveal as="p" className="paper__desc" delay={0.15}>
              IoT tutorials name the parts a learner needs out loud rather than on screen. IoTutorMine recovers a structured hardware Bill of Materials from a video's YouTube transcript using zero-shot LLM extraction, and exposes it as IoTutorMine-Web, a public, searchable tutorial catalog.
            </Reveal>

            <Reveal className="paper__pipeline" delay={0.2}>
              {['YouTube tutorial', 'Transcript', 'Zero-shot LLM', 'Bill of Materials'].map((s, i) => (
                <span key={s} className={i === 3 ? 'is-out' : undefined}>{s}</span>
              ))}
            </Reveal>

            <Reveal className="paper__actions" delay={0.25}>
              <ExternalLink href={PAPER.pdf} className="btn btn--primary">View Paper</ExternalLink>
              <ExternalLink href={PAPER.tool} className="btn btn--ghost">Live Tool</ExternalLink>
            </Reveal>
            <Reveal as="p" className="paper__more" delay={0.3}>
              <ExternalLink href={PAPER.replication}>Replication package</ExternalLink>
              <ExternalLink href={PAPER.source}>Tool source</ExternalLink>
              <span className="mono">First author · Proceedings of the 41st IEEE/ACM International Conference on Automated Software Engineering</span>
            </Reveal>
          </div>

          <aside className="paper__side">
            <dl className="paper__numbers">
              {[
                { n: 20, label: 'annotated tutorials' },
                { n: 131, label: 'ground-truth components' },
                { n: 16, label: 'distinct creators' },
              ].map((s, i) => (
                <Reveal key={s.label} delay={0.1 + i * 0.1}>
                  <dt>{s.label}</dt>
                  <dd><Count to={s.n} /></dd>
                </Reveal>
              ))}
            </dl>

            <Reveal className="results" delay={0.2}>
              <p className="mono">Corpus-level F1 · zero-shot, same prompt</p>
              <ul>
                {PAPER.results.map((r, i) => (
                  <motion.li key={r.model} initial={reduce ? false : 'hidden'} whileInView="shown" viewport={once}>
                    <span className="results__model">{r.model}</span>
                    <span className="results__track">
                      <motion.span
                        className={`results__bar ${i === 0 ? 'is-best' : ''}`}
                        style={{ scaleX: r.f1 }}
                        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: r.f1 } }}
                        transition={{ duration: 1.2, ease, delay: 0.3 + i * 0.12 }}
                      />
                    </span>
                    <span className="results__value">{r.f1.toFixed(3)}</span>
                  </motion.li>
                ))}
              </ul>
              <p className="results__note">Arduino and Raspberry Pi, beginner and intermediate levels. No fine-tuning, no in-context examples.</p>
            </Reveal>
          </aside>
        </article>

        <Reveal as="article" className="study">
          <div className="study__meta">
            <p className="mono">Healthcare AI · English &amp; Arabic</p>
            <p className="study__venue">Scientific e-poster · ATTD</p>
          </div>
          <div>
            <h3 className="study__title">Comparative Analysis: ChatGPT vs. Healthcare Professionals in Addressing Type-1 Diabetes FAQs in English and Arabic</h3>
            <p className="study__desc">
              66 frequently asked questions about Type-1 Diabetes, 33 in English and 33 in Arabic across seven themes, were answered by healthcare professionals and by ChatGPT-3.5 using zero-shot prompting. Specialists and individuals with Type-1 Diabetes rated the responses for accuracy and empathy. Presented at Advanced Technologies &amp; Treatments for Diabetes.
            </p>
            <ExternalLink href="research/T1D_ChatGPT_vs_Healthcare_Professionals_ATTD.pdf" className="btn btn--ghost study__action">View Poster</ExternalLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Projects() {
  const reduce = useReducedMotion();
  const draw = (delay) => ({
    initial: reduce ? false : { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: once,
    transition: { duration: 0.9, ease, delay },
  });

  return (
    <section id="projects" className="section">
      <div className="container">
        <Heading eyebrow="Projects" title="Selected Projects" className="heading--quiet" />

        <article className="flagship">
          <div className="flagship__head">
            <Reveal as="p" className="mono flagship__kind">01 · Capstone · Graduation Project</Reveal>
            <Reveal as="h3" className="flagship__name" delay={0.05}>repoCare</Reveal>
            <Reveal className="flagship__intro" delay={0.12}>
              <p className="flagship__sub">Health Insight Platform</p>
              <p>An AI-assisted personal health platform that brings medical reports, wearable sensor data and personal health context into one organized, non-diagnostic health profile.</p>
            </Reveal>
          </div>

          <div className="system" aria-label="repoCare system flow">
            <div className="system__inputs">
              <Reveal className="system__input" x={-16} y={0} delay={0.1}>
                <span className="mono">Input</span>
                <strong>Medical reports</strong>
                <span>PDF / image → OCR → biomarkers</span>
              </Reveal>
              <Reveal className="system__input" x={-16} y={0} delay={0.2}>
                <span className="mono">Input</span>
                <strong>Wearable sensors</strong>
                <span>BLE → Android app → backend / cloud</span>
              </Reveal>
            </div>
            <motion.span className="system__join" aria-hidden="true" {...draw(0.35)} />
            <Reveal className="system__hub" delay={0.5} y={0}>
              <span className="mono">Unified</span>
              <strong>Health profile</strong>
            </Reveal>
            <motion.span className="system__arrow" aria-hidden="true" {...draw(0.7)} />
            <Reveal className="system__output" x={16} y={0} delay={0.85}>
              <span className="mono">Output</span>
              <strong>Personal insights</strong>
              <span>RAG-grounded AI assistant</span>
            </Reveal>
          </div>

          <Reveal className="flagship__role" delay={0.1}>
            <p className="mono">My responsibility</p>
            <p><strong>Hardware &amp; Wearable Integration</strong> — the wearable hardware, sensor integration and Bluetooth Low Energy communication, integrated end to end with the Android application and the backend.</p>
          </Reveal>

          <Reveal className="flagship__foot" delay={0.1}>
            <p className="mono">Android · Java · Spring Boot · Firebase · Google OCR · BLE · RAG</p>
            <p className="flagship__note">Informational by design. It does not diagnose, prescribe or replace healthcare professionals.</p>
          </Reveal>
        </article>

        <ol className="project-list">
          {PROJECTS.map((p, i) => (
            <Reveal as="li" key={p.name} className="project" delay={i * 0.08}>
              <span className="project__num">{String(i + 2).padStart(2, '0')}</span>
              <div className="project__head">
                <h3 className="project__name">{p.name}</h3>
                <p className="mono">{p.category}</p>
              </div>
              <div className="project__body">
                <p>{p.description}</p>
                <p className="mono project__tech">{p.tech}</p>
                <a className="project__link" href={p.file} target="_blank" rel="noopener noreferrer">
                  {p.cta} <span className="link__arrow" aria-hidden="true">→</span>
                  <span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Activities() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] });

  return (
    <section id="activities" className="section band band--warm">
      <div className="container activities">
        <Heading eyebrow="Activities" title="Beyond the classroom." />
        <ol className="timeline" ref={ref}>
          <span className="timeline__rail" aria-hidden="true">
            <motion.span className="timeline__fill" style={{ scaleY: reduce ? 1 : scrollYProgress }} />
          </span>
          {ACTIVITIES.map((a, i) => (
            <Reveal as="li" key={a.title} className="timeline__item" x={24} y={0} delay={0.05}>
              <span className="timeline__dot" aria-hidden="true" />
              <span className="timeline__num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="mono">{a.type}</p>
                <h3 className="timeline__title">{a.title}</h3>
                <p className="timeline__detail">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <Heading eyebrow="Skills" title="Tools and methods." className="heading--quiet" />
        <div className="skills">
          {SKILLS.map((s, i) => (
            <Reveal key={s.group} className="skills__group" delay={(i % 3) * 0.08}>
              <h3>{s.group}</h3>
              <p>{s.items.join(' · ')}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="section band band--contact">
      <div className="container">
        <Reveal as="p" className="eyebrow" y={8}>Contact</Reveal>
        <Reveal as="h2" className="contact__title" delay={0.05}>
          Open to research, software engineering and meaningful technical collaborations.
        </Reveal>
        <Reveal delay={0.15}>
          <a className="contact__email" href="mailto:alahmadia313@gmail.com">
            alahmadia313@gmail.com <span className="link__arrow" aria-hidden="true">→</span>
          </a>
        </Reveal>
        <Reveal as="ul" className="contact__links" delay={0.2}>
          {CONTACT_LINKS.map((l) => (
            <li key={l.label}>
              <span className="mono">{l.label}</span>
              <a href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.value}</a>
            </li>
          ))}
          <li><span className="mono">Location</span><span>Jeddah, Saudi Arabia</span></li>
        </Reveal>
        <div className="contact__base">
          <span>© {new Date().getFullYear()} Abdullah Ahmed Alahmadi</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Research />
        <Projects />
        <Activities />
        <Skills />
      </main>
      <Contact />
    </MotionConfig>
  );
}

createRoot(document.getElementById('root')).render(<App />);
