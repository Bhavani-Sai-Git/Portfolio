import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Quote } from "lucide-react";
import { CASE_STUDIES } from "../data/caseStudies";
import { Link } from "../router";
import { useActiveSection } from "../hooks/useActiveSection";
import { scrollToId } from "../hooks/useLenis";
import Reveal from "../components/Reveal";
import ScreenFrame from "../components/ScreenFrame";
import Todo from "../components/Todo";
import CountUp from "../components/CountUp";

const EASE = [0.16, 0.84, 0.44, 1];

const TOC = [
    ["cs-problem", "The problem"],
    ["cs-constraints", "Constraints"],
    ["cs-decisions", "Key decisions"],
    ["cs-shipped", "What shipped"],
    ["cs-stack", "Stack"],
];

// Fan the screens out like photos on a desk: outer ones tilt away and sit lower.
// On phones the frames wrap onto two rows, so they just tilt slightly instead.
function fanPose(i, n) {
    if (window.innerWidth <= 760) return { rotate: i % 2 ? 3 : -3, y: 0 };
    const mid = (n - 1) / 2;
    const off = i - mid;
    return { rotate: off * 7, y: Math.abs(off) * 26 };
}

export default function CaseStudy({ study }) {
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 });
    const active = useActiveSection(TOC.map(([id]) => `#${id}`), study.slug);
    const index = CASE_STUDIES.indexOf(study);
    const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];

    return (
        <main className="rb-cs" style={{ "--cs-accent": study.accent }}>
            <motion.div className="rb-cs-progress" style={{ scaleX: progress }} aria-hidden="true" />

            <header className="rb-wrap rb-cs-head">
                <Link to="/#work" className="rb-cs-back"><ArrowLeft size={16} /> All projects</Link>
                <motion.p
                    className="rb-cs-kicker"
                    initial={reduceMotion ? false : { opacity: 0, y: 12, rotate: -6 }}
                    animate={{ opacity: 1, y: 0, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.05 }}
                >
                    Case study · {study.kicker}
                </motion.p>
                <h1 className="rb-cs-title">
                    <span className="rb-sr-only">{study.title}</span>
                    <span aria-hidden="true">
                        {study.title.split(" ").map((word, w) => (
                            <span className="rb-cs-word" key={w}>
                                <motion.span
                                    initial={reduceMotion ? false : { y: "105%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.12 + w * 0.09, ease: EASE }}
                                >
                                    {word}
                                </motion.span>
                            </span>
                        ))}
                    </span>
                    <motion.span
                        className="rb-cs-swash"
                        aria-hidden="true"
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                </h1>
                <motion.p
                    className="rb-cs-summary"
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                >
                    {study.summary}
                </motion.p>
                <ul className="rb-cs-meta">
                    {study.meta.map(({ label, value }, i) => (
                        <motion.li
                            key={label}
                            initial={reduceMotion ? false : { opacity: 0, y: 22, rotate: i % 2 ? 4 : -4 }}
                            animate={{ opacity: 1, y: 0, rotate: i % 2 ? 1 : -1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.45 + i * 0.07 }}
                        >
                            <small>{label}</small>
                            <strong>{value}</strong>
                        </motion.li>
                    ))}
                </ul>
            </header>

            <section className="rb-cs-showcase" aria-label="Screens">
                <div className="rb-cs-screens">
                    {study.screens.map((s, i) => {
                        const pose = fanPose(i, study.screens.length);
                        return (
                            <motion.div
                                key={s.label}
                                className={`rb-cs-screen ${s.kind}`}
                                initial={reduceMotion ? false : { opacity: 0, y: 140, rotate: pose.rotate * 3, scale: 0.85 }}
                                whileInView={{ opacity: 1, y: pose.y, rotate: pose.rotate, scale: 1 }}
                                whileHover={reduceMotion ? undefined : { y: pose.y - 14, rotate: 0, scale: 1.03, zIndex: 5 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ type: "spring", stiffness: 160, damping: 17, delay: i * 0.12 }}
                            >
                                <ScreenFrame {...s} accent={study.accent} />
                            </motion.div>
                        );
                    })}
                </div>
                <div className="rb-wrap"><Todo>{!study.screens.some((s) => s.src) && study.screensTodo}</Todo></div>
            </section>

            <section className="rb-wrap rb-cs-numbers" aria-label="In numbers">
                {study.numbers.map((n, i) => (
                    <Reveal as="div" key={n.label} delay={i * 0.08} className="rb-cs-number">
                        <CountUp value={n.value} className="rb-cs-number-value" />
                        <span className="rb-cs-number-label">{n.label}</span>
                        <span className="rb-cs-number-detail">{n.detail}</span>
                    </Reveal>
                ))}
                <Todo className="rb-cs-numbers-todo">{study.numbersTodo}</Todo>
            </section>

            <div className="rb-wrap rb-cs-body">
                <nav className="rb-cs-toc" aria-label="On this page">
                    <span className="rb-cs-toc-label">On this page</span>
                    <ol>
                        {TOC.map(([id, label], i) => (
                            <li key={id}>
                                <a
                                    href={`#${id}`}
                                    className={active === id ? "active" : undefined}
                                    onClick={(e) => { e.preventDefault(); scrollToId(id, { offset: -110, immediate: reduceMotion }); }}
                                >
                                    <span>{String(i + 1).padStart(2, "0")}</span>{label}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <article className="rb-cs-article">
                    <Section id="cs-problem" n={1} title="The problem">
                        {study.problem.map((p) => <p key={p} className="rb-cs-lead">{p}</p>)}
                    </Section>

                    <Section id="cs-constraints" n={2} title="Constraints">
                        <ul className="rb-cs-constraints">
                            {study.constraints.map((c, i) => (
                                <Reveal as="li" key={c} delay={i * 0.06}>{c}</Reveal>
                            ))}
                        </ul>
                    </Section>

                    <Section id="cs-decisions" n={3} title="Key decisions">
                        <ol className="rb-cs-decisions">
                            {study.decisions.map((d, i) => (
                                <motion.li
                                    key={d.title}
                                    initial={reduceMotion ? false : { opacity: 0, x: i % 2 ? 40 : -40, rotate: i % 2 ? 2 : -2 }}
                                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                                    viewport={{ once: true, amount: 0.35 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <span className="rb-cs-decision-n">{String(i + 1).padStart(2, "0")}</span>
                                    <div>
                                        <h3>{d.title}</h3>
                                        <p>{d.body}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </ol>
                    </Section>

                    <Section id="cs-shipped" n={4} title="What shipped">
                        <ul className="rb-cs-shipped">
                            {study.shipped.map((s, i) => (
                                <Reveal as="li" key={s} delay={i * 0.06}>
                                    <motion.span
                                        className="rb-cs-check"
                                        initial={reduceMotion ? false : { scale: 0, rotate: -90 }}
                                        whileInView={{ scale: 1, rotate: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 500, damping: 14, delay: 0.15 + i * 0.08 }}
                                    >
                                        <Check size={14} strokeWidth={3} />
                                    </motion.span>
                                    {s}
                                </Reveal>
                            ))}
                        </ul>
                        <Reveal className="rb-cs-learned">
                            <Quote size={22} aria-hidden="true" />
                            <span className="rb-cs-learned-label">What I took away</span>
                            <p>{study.learned}</p>
                        </Reveal>
                    </Section>

                    <Section id="cs-stack" n={5} title="Stack">
                        <div className="rb-cs-stack">
                            {study.stack.map((s, i) => (
                                <motion.span
                                    key={s}
                                    initial={reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: i % 2 ? 8 : -8 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: i % 3 === 0 ? -2 : i % 3 === 1 ? 1.5 : 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 420, damping: 15, delay: i * 0.04 }}
                                >
                                    {s}
                                </motion.span>
                            ))}
                        </div>
                    </Section>
                </article>
            </div>

            <section className="rb-wrap rb-cs-next">
                <Reveal>
                    <Link to={`/work/${next.slug}`} className="rb-cs-next-card" style={{ "--next-accent": next.accent }}>
                        <span className="rb-cs-next-label">Next case study</span>
                        <span className="rb-cs-next-title">{next.title}</span>
                        <span className="rb-cs-next-sub">{next.kicker}</span>
                        <span className="rb-cs-next-arrow"><ArrowRight size={26} /></span>
                    </Link>
                </Reveal>
            </section>
        </main>
    );
}

function Section({ id, n, title, children }) {
    return (
        <section id={id} className="rb-cs-section">
            <Reveal className="rb-cs-section-head">
                <span className="rb-cs-section-n">{String(n).padStart(2, "0")}</span>
                <h2>{title}</h2>
            </Reveal>
            {children}
        </section>
    );
}

export const CASE_STUDY_CSS = `
.rb-cs{position:relative; padding-bottom:30px;}
.rb-cs-progress{position:fixed; left:0; right:0; top:0; height:5px; background:var(--cs-accent); border-bottom:1.5px solid var(--ink); transform-origin:0 50%; z-index:600;}

.rb-cs-head{padding-top:34px;}
.rb-cs-back{display:inline-flex; align-items:center; gap:8px; padding:8px 16px 8px 12px; border:1.6px solid var(--ink); border-radius:999px; background:var(--card); font-family:var(--f-body); font-weight:700; font-size:13px; box-shadow:3px 3px 0 var(--ink); transition:transform .2s var(--ease), box-shadow .2s var(--ease);}
.rb-cs-back:hover{transform:translate(-2px,-2px); box-shadow:5px 5px 0 var(--ink);}
.rb-cs-back:hover svg{animation:rb-cs-nudge .6s var(--ease);}
@keyframes rb-cs-nudge{40%{transform:translateX(-5px);}}
.rb-cs-kicker{display:block; width:max-content; max-width:100%; margin:28px 0 0; padding:6px 14px; border:1.6px solid var(--ink); border-radius:999px; background:var(--cs-accent); color:var(--ink-on-accent); font-family:var(--f-body); font-weight:800; font-size:12px; letter-spacing:.1em; text-transform:uppercase; box-shadow:3px 3px 0 var(--ink);}
.rb-cs-title{position:relative; display:inline-block; margin:18px 0 0; font-family:var(--f-display); font-weight:400; text-transform:uppercase; line-height:.9; letter-spacing:-.01em; font-size:clamp(58px,12vw,168px);}
.rb-cs-word{display:inline-block; overflow:hidden; vertical-align:top; padding-bottom:.04em; margin-right:.22em;}
.rb-cs-word:last-child{margin-right:0;}
.rb-cs-word > span{display:inline-block;}
.rb-cs-swash{position:absolute; left:-1%; right:-2%; bottom:.06em; height:.16em; background:var(--cs-accent); border:2px solid var(--ink); border-radius:999px; transform-origin:left center; z-index:-1; rotate:-1deg;}
.rb-cs-summary{max-width:640px; margin:26px 0 0; font-size:clamp(16px,1.6vw,19px); line-height:1.65; color:var(--ink-dim);}
ul.rb-cs-meta{display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; margin-top:34px;}
.rb-cs-meta li{padding:14px 16px; border:1.6px solid var(--ink); border-radius:14px; background:var(--card); box-shadow:4px 4px 0 var(--ink);}
.rb-cs-meta small{display:block; font-family:var(--f-body); font-weight:800; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint);}
.rb-cs-meta strong{display:block; margin-top:4px; font-family:var(--f-body); font-weight:700; font-size:14.5px; line-height:1.3;}

.rb-cs-showcase{position:relative; margin-top:56px; padding:56px 0 76px; border-block:2px solid var(--ink); background-color:var(--cs-accent); background-image:radial-gradient(rgba(23,22,21,.16) 1.3px, transparent 1.7px); background-size:20px 20px; overflow:hidden;}
.rb-cs-showcase .rb-todo{background:var(--card); margin-top:56px;}
.rb-cs-screens{display:flex; justify-content:center; align-items:flex-start; gap:clamp(14px,3vw,46px); padding:0 18px;}
.rb-cs-screen{position:relative;}
.rb-cs-screen .rb-frame-fig figcaption{color:var(--ink-on-accent); background:var(--card); color:var(--ink); padding:4px 12px; border:1.6px solid var(--ink); border-radius:999px; font-size:17px;}

.rb-cs-numbers{display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-top:56px;}
.rb-cs-numbers-todo{grid-column:1/-1;}
.rb-cs-number{position:relative; padding:20px 22px 22px; border:1.8px solid var(--ink); border-radius:16px; background:var(--card); box-shadow:5px 5px 0 var(--ink);}
.rb-cs-number:nth-child(2){transform:rotate(.8deg);}
.rb-cs-number:nth-child(3){transform:rotate(-.6deg);}
.rb-cs-number-value{display:block; font-family:var(--f-display); font-size:clamp(56px,6vw,84px); line-height:.95;}
.rb-cs-number-value{background:linear-gradient(transparent 62%, var(--cs-accent) 62%, var(--cs-accent) 90%, transparent 90%); width:max-content; padding:0 4px;}
.rb-cs-number-label{display:block; margin-top:8px; font-family:var(--f-body); font-weight:800; font-size:14px; text-transform:uppercase; letter-spacing:.04em;}
.rb-cs-number-detail{display:block; margin-top:4px; font-family:var(--f-hand); font-weight:700; font-size:18px; color:var(--ink-dim); line-height:1.1;}

.rb-cs-body{display:grid; grid-template-columns:210px minmax(0,1fr); gap:56px; margin-top:76px;}
.rb-cs-toc{position:sticky; top:120px; align-self:start;}
.rb-cs-toc-label{display:block; margin-bottom:12px; font-family:var(--f-hand); font-weight:700; font-size:19px; color:var(--ink-dim); transform:rotate(-2deg);}
.rb-cs-toc ol{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:4px; border-left:2px dashed var(--line);}
.rb-cs-toc a{display:flex; gap:10px; align-items:baseline; margin-left:-2px; padding:7px 12px; border-left:3px solid transparent; font-family:var(--f-body); font-weight:600; font-size:13.5px; color:var(--ink-dim); transition:color .2s var(--ease), border-color .2s var(--ease), background-color .2s var(--ease), padding .2s var(--ease);}
.rb-cs-toc a span{font-family:var(--f-display); font-size:12px; color:var(--ink-faint);}
.rb-cs-toc a:hover{color:var(--ink);}
.rb-cs-toc a.active{color:var(--ink-on-accent); font-weight:800; border-left-color:var(--ink); background:var(--cs-accent); padding-left:16px; border-radius:0 999px 999px 0;}
.rb-cs-toc a.active span{color:var(--ink-on-accent);}

.rb-cs-article{max-width:760px;}
.rb-cs-section{scroll-margin-top:110px; padding-bottom:62px;}
.rb-cs-section-head{display:flex; align-items:center; gap:14px; margin-bottom:22px;}
.rb-cs-section-n{display:grid; place-items:center; width:46px; height:46px; flex:none; border-radius:50%; border:1.8px solid var(--ink); background:var(--cs-accent); color:var(--ink-on-accent); font-family:var(--f-display); font-size:18px; box-shadow:3px 3px 0 var(--ink); transform:rotate(-6deg);}
.rb-cs-section-head h2{margin:0; font-family:var(--f-display); font-weight:400; text-transform:uppercase; font-size:clamp(30px,4vw,46px); line-height:1;}
.rb-cs-lead{margin:0 0 16px; font-size:17px; line-height:1.75; color:var(--ink-dim);}
.rb-cs-lead:first-of-type{font-size:19px; color:var(--ink);}

.rb-cs-constraints{list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px;}
.rb-cs-constraints li{position:relative; padding:14px 16px 14px 42px; border:1.6px solid var(--ink); border-radius:12px; background:var(--card); font-size:14px; line-height:1.5; font-weight:500;}
.rb-cs-constraints li::before{content:'!'; position:absolute; left:13px; top:13px; width:20px; height:20px; display:grid; place-items:center; border-radius:50%; background:var(--yellow); color:var(--ink-on-accent); border:1.4px solid var(--ink); font-family:var(--f-display); font-size:12px;}

.rb-cs-decisions{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:16px;}
.rb-cs-decisions li{display:flex; gap:18px; padding:20px 22px; border:1.8px solid var(--ink); border-radius:16px; background:var(--card); box-shadow:5px 5px 0 var(--ink); transition:box-shadow .25s var(--ease), translate .25s var(--ease);}
.rb-cs-decisions li:hover{translate:-2px -3px; box-shadow:8px 8px 0 var(--cs-accent), 8px 8px 0 1.8px var(--ink);}
.rb-cs-decision-n{flex:none; font-family:var(--f-display); font-size:34px; line-height:1; -webkit-text-stroke:1.6px var(--ink); color:var(--cs-accent);}
.rb-cs-decisions h3{margin:2px 0 6px; font-family:var(--f-body); font-weight:800; font-size:17px; line-height:1.3;}
.rb-cs-decisions p{margin:0; font-size:14.5px; line-height:1.65; color:var(--ink-dim);}

.rb-cs-shipped{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:12px;}
.rb-cs-shipped li{display:flex; align-items:flex-start; gap:12px; font-size:15.5px; line-height:1.55;}
.rb-cs-check{flex:none; display:grid; place-items:center; width:24px; height:24px; margin-top:1px; border-radius:7px; background:var(--mint); color:var(--ink-on-accent); border:1.5px solid var(--ink);}
.rb-cs-learned{position:relative; margin-top:30px; padding:26px 28px 24px; border:1.8px solid var(--ink); border-radius:6px 18px 18px 18px; background:var(--yellow); color:var(--ink-on-accent); box-shadow:6px 6px 0 var(--ink); transform:rotate(-1deg);}
.rb-cs-learned svg{position:absolute; right:18px; top:16px; opacity:.5;}
.rb-cs-learned-label{display:block; font-family:var(--f-body); font-weight:800; font-size:11px; letter-spacing:.12em; text-transform:uppercase;}
.rb-cs-learned p{margin:8px 0 0; font-family:var(--f-hand); font-weight:700; font-size:clamp(22px,2.4vw,27px); line-height:1.2;}
.rb-cs-note-link{display:flex; align-items:center; gap:14px; margin-top:26px; padding:14px 18px; border:1.6px dashed var(--ink); border-radius:14px; transition:background-color .2s var(--ease), border-style .2s;}
.rb-cs-note-link:hover{background:var(--card); border-style:solid;}
.rb-cs-note-link span{flex:1; font-weight:700; font-size:15px;}
.rb-cs-note-link small{display:block; font-family:var(--f-body); font-weight:800; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint);}

.rb-cs-stack{display:flex; flex-wrap:wrap; gap:10px;}
.rb-cs-stack span{padding:8px 15px; border:1.6px solid var(--ink); border-radius:999px; background:var(--card); font-weight:700; font-size:13.5px; box-shadow:3px 3px 0 var(--ink);}
.rb-cs-stack span:nth-child(3n+1){background:var(--cs-accent); color:var(--ink-on-accent);}

.rb-cs-next{margin-top:10px;}
.rb-root a.rb-cs-next-card{position:relative; display:block; padding:34px 120px 34px 36px; border:2px solid var(--ink); border-radius:var(--radius-lg); background:var(--next-accent); color:var(--ink-on-accent); box-shadow:8px 8px 0 var(--ink); overflow:hidden; transition:transform .3s var(--ease), box-shadow .3s var(--ease);}
.rb-root a.rb-cs-next-card:hover{transform:translate(-3px,-4px); box-shadow:12px 12px 0 var(--ink);}
.rb-cs-next-label{display:block; font-family:var(--f-hand); font-weight:700; font-size:22px; transform:rotate(-2deg); transform-origin:left;}
.rb-cs-next-title{display:block; margin-top:6px; font-family:var(--f-display); text-transform:uppercase; font-size:clamp(42px,7vw,96px); line-height:.9;}
.rb-cs-next-sub{display:block; margin-top:10px; font-family:var(--f-body); font-weight:800; font-size:12px; letter-spacing:.1em; text-transform:uppercase;}
.rb-cs-next-arrow{position:absolute; right:34px; top:50%; translate:0 -50%; display:grid; place-items:center; width:70px; height:70px; border-radius:50%; border:2px solid var(--ink-on-accent); background:var(--card); color:var(--ink); transition:transform .35s var(--ease);}
.rb-cs-next-card:hover .rb-cs-next-arrow{transform:translateX(8px) rotate(-12deg);}

@media(max-width:960px){
  .rb-cs-body{grid-template-columns:1fr; gap:0; margin-top:56px;}
  .rb-cs-toc{display:none;}
  .rb-cs-meta{grid-template-columns:repeat(2,minmax(0,1fr));}
}
@media(max-width:760px){
  .rb-cs-screens{flex-wrap:wrap; --phone-w:150px; --browser-w:330px; row-gap:30px;}
  .rb-cs-numbers{grid-template-columns:1fr; gap:14px;}
  .rb-cs-number:nth-child(n){transform:none;}
  .rb-cs-constraints{grid-template-columns:1fr;}
  .rb-cs-next-card{padding:26px 22px 96px;}
  .rb-cs-next-arrow{top:auto; bottom:20px; right:22px; translate:none; width:56px; height:56px;}
  .rb-cs-decisions li{flex-direction:column; gap:8px; padding:18px;}
}
@media(max-width:420px){
  .rb-cs-screens{--phone-w:128px;}
  .rb-cs-meta{grid-template-columns:1fr 1fr; gap:10px;}
  .rb-cs-meta li{padding:11px 12px;}
}
`;
