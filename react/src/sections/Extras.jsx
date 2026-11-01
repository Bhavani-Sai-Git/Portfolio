import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
    Award, ArrowUpRight, Copy, Check, FileText, FileDown, X, Search, CornerDownLeft,
    Hash, Briefcase, Moon, Github, Linkedin, Mail, Zap,
} from "lucide-react";
import {
    PROFILE, NAV_LINKS, CERTIFICATIONS, OFF_THE_CLOCK, NOW, QUICK_FACTS,
} from "../data/content";
import { CASE_STUDIES } from "../data/caseStudies";
import { Link, navigate } from "../router";
import Reveal from "../components/Reveal";
import Todo from "../components/Todo";

const EASE = [0.16, 0.84, 0.44, 1];

/* -------------------------------------------------------------------------
   Tiny global event bus — lets the nav, footer, command menu and buttons
   anywhere open the resume viewer / command menu or show a toast.
   ------------------------------------------------------------------------- */
export const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
function useEvent(name, handler) {
    const ref = useRef(handler);
    ref.current = handler;
    useEffect(() => {
        const fn = (e) => ref.current(e.detail);
        window.addEventListener(name, fn);
        return () => window.removeEventListener(name, fn);
    }, [name]);
}

export async function copyEmail() {
    try {
        await navigator.clipboard.writeText(PROFILE.email);
        emit("rb:toast", "Email copied — " + PROFILE.email);
    } catch {
        emit("rb:toast", PROFILE.email);
    }
}

/* -------------------------------------------------------------------------
   Toast
   ------------------------------------------------------------------------- */
export function Toaster() {
    const [toast, setToast] = useState(null);
    const timer = useRef(null);
    useEvent("rb:toast", (text) => {
        setToast({ text, key: Date.now() });
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setToast(null), 2600);
    });
    return (
        <div className="rb-toast-wrap" aria-live="polite">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        key={toast.key}
                        className="rb-toast"
                        initial={{ opacity: 0, y: 30, rotate: -4, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    >
                        <Check size={15} /> {toast.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* -------------------------------------------------------------------------
   Certifications strip
   ------------------------------------------------------------------------- */
export function Certifications() {
    const reduceMotion = useReducedMotion();
    return (
        <section className="rb-section rb-certs" aria-labelledby="rb-certs-title">
            <div className="rb-wrap">
                <Reveal className="rb-certs-head">
                    <span className="rb-section-note">proof of learning</span>
                    <h2 id="rb-certs-title" className="rb-certs-title">Certifications</h2>
                </Reveal>
                <ul className="rb-certs-list">
                    {CERTIFICATIONS.map((c, i) => {
                        const Tag = c.href ? "a" : "div";
                        const linkProps = c.href ? { href: c.href, target: "_blank", rel: "noopener noreferrer" } : {};
                        return (
                            <motion.li
                                key={c.title}
                                initial={reduceMotion ? false : { opacity: 0, y: 40, rotate: i % 2 ? 10 : -10, scale: 0.8 }}
                                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.5 : -1.5, scale: 1 }}
                                whileHover={reduceMotion ? undefined : { rotate: 0, y: -6 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.07 }}
                            >
                                <Tag className="rb-cert" style={{ "--cert-accent": c.color }} {...linkProps}>
                                    <span className="rb-cert-seal"><Award size={20} aria-hidden="true" /></span>
                                    <span className="rb-cert-text">
                                        <strong>{c.title}</strong>
                                        <small>{c.issuer}</small>
                                    </span>
                                    {c.href && <ArrowUpRight size={14} className="rb-cert-go" aria-hidden="true" />}
                                </Tag>
                            </motion.li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------
   About extras — "Now" card + "Off the clock" tiles
   ------------------------------------------------------------------------- */
export function AboutExtras() {
    const reduceMotion = useReducedMotion();
    const currentWork = NOW.find((n) => n.label === "Building" && n.value);
    return (
        <div className="rb-about-extras">
            <Reveal className="rb-now">
                <span className="rb-now-badge"><span className="pulse" aria-hidden="true" />Now</span>
                {currentWork && (
                    <div className="rb-now-content">
                        <small>Currently building</small>
                        <strong>{currentWork.value}</strong>
                    </div>
                )}
            </Reveal>
            <div className="rb-offclock">
                <Reveal as="span" className="rb-section-note">off the clock</Reveal>
                <ul>
                    {OFF_THE_CLOCK.map((o, i) => (
                        <motion.li
                            key={o.title}
                            style={{ background: o.color }}
                            initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: i % 2 ? 14 : -14 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: i % 2 ? 2 : -2 }}
                            whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.05 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ type: "spring", stiffness: 320, damping: 14, delay: i * 0.08 }}
                        >
                            <span className="rb-offclock-emoji" aria-hidden="true">{o.emoji}</span>
                            <strong>{o.title}</strong>
                            <span>{o.detail}</span>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------
   Secret smiley — click it 5 times for confetti
   ------------------------------------------------------------------------- */
const CONFETTI_COLORS = ["var(--yellow)", "var(--pink)", "var(--mint)", "var(--blue)", "var(--violet)"];
export function SecretSmiley({ size = 22 }) {
    const [clicks, setClicks] = useState(0);
    const [burst, setBurst] = useState(0);
    const reduceMotion = useReducedMotion();
    const pieces = useMemo(() => Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2 + (i % 3) * 0.2;
        const dist = 90 + (i % 5) * 34;
        return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 40, r: (i % 2 ? 1 : -1) * (180 + i * 12), color: CONFETTI_COLORS[i % 5], sq: i % 3 === 0 };
    }), []);

    function handleClick() {
        const next = clicks + 1;
        if (next >= 5) {
            setClicks(0);
            setBurst((b) => b + 1);
            emit("rb:toast", "You found the secret smiley ✦ thanks for being curious!");
        } else {
            setClicks(next);
        }
    }

    return (
        <motion.button
            type="button"
            className="rb-secret-smiley"
            onClick={handleClick}
            aria-label="Smiley"
            animate={reduceMotion ? undefined : { rotate: clicks * 18, scale: 1 + clicks * 0.08 }}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 12 }}
        >
            <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="14" stroke="var(--ink)" strokeWidth="2" fill="var(--yellow)" />
                <circle cx="11" cy="13" r="1.8" fill="var(--ink-on-accent)" />
                <circle cx="21" cy="13" r="1.8" fill="var(--ink-on-accent)" />
                <path d="M9 19C11.5 23 20.5 23 23 19" stroke="var(--ink-on-accent)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {burst > 0 && !reduceMotion && pieces.map((p, i) => (
                <motion.span
                    key={`${burst}-${i}`}
                    className={`rb-confetti${p.sq ? " sq" : ""}`}
                    style={{ background: p.color }}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
                    animate={{ x: p.x, y: [0, p.y, p.y + 120], opacity: [1, 1, 0], rotate: p.r, scale: 1 }}
                    transition={{ duration: 1.4, ease: "easeOut", times: [0, 0.45, 1] }}
                    aria-hidden="true"
                />
            ))}
        </motion.button>
    );
}

/* -------------------------------------------------------------------------
   Recruiter quick facts (Let's Talk)
   ------------------------------------------------------------------------- */
export function QuickFacts() {
    const facts = QUICK_FACTS.filter((f) => f.value || import.meta.env.DEV);
    return (
        <Reveal delay={0.12} className="rb-facts">
            <div className="rb-facts-head">
                <span className="rb-facts-title"><Zap size={15} aria-hidden="true" /> Quick facts</span>
                <span className="rb-facts-actions">
                    <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={copyEmail}><Copy size={13} /> Copy email</motion.button>
                    <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={() => emit("rb:resume")}><FileText size={13} /> View resume</motion.button>
                </span>
            </div>
            <dl>
                {facts.map((f) => (
                    <div key={f.label}>
                        <dt>{f.label}</dt>
                        <dd>{f.value || <Todo>{f.todo}</Todo>}</dd>
                    </div>
                ))}
            </dl>
        </Reveal>
    );
}

/* -------------------------------------------------------------------------
   Resume viewer (modal with the PDF inline + download)
   ------------------------------------------------------------------------- */
function useModalBehaviour(open, close) {
    const lastFocus = useRef(null);
    useEffect(() => {
        if (!open) return undefined;
        lastFocus.current = document.activeElement;
        const onKey = (e) => { if (e.key === "Escape") close(); };
        document.addEventListener("keydown", onKey);
        document.documentElement.classList.add("rb-modal-open");
        return () => {
            document.removeEventListener("keydown", onKey);
            document.documentElement.classList.remove("rb-modal-open");
            lastFocus.current?.focus?.();
        };
    }, [open, close]);
}

export function ResumeModal() {
    const [open, setOpen] = useState(false);
    const close = React.useCallback(() => setOpen(false), []);
    useEvent("rb:resume", () => setOpen(true));
    useModalBehaviour(open, close);
    return (
        <AnimatePresence>
            {open && (
                <motion.div className="rb-modal-backdrop" data-lenis-prevent onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div
                        className="rb-resume"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Resume"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 60, rotate: -3, scale: 0.92, opacity: 0 }}
                        animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 40, scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    >
                        <div className="rb-resume-bar">
                            <strong><FileText size={16} /> Resume — {PROFILE.name}</strong>
                            <a href={PROFILE.resume} download="Bhavani_Sai_Resume.pdf" className="rb-resume-dl"><FileDown size={14} /> Download</a>
                            <button type="button" className="rb-resume-close" onClick={close} aria-label="Close resume" autoFocus><X size={18} /></button>
                        </div>
                        <iframe src={`${PROFILE.resume}#view=FitH`} title="Resume PDF" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* -------------------------------------------------------------------------
   Command menu (Ctrl/⌘ + K)
   ------------------------------------------------------------------------- */
export function CommandMenu({ goToSection }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [index, setIndex] = useState(0);
    const listRef = useRef(null);
    const close = React.useCallback(() => setOpen(false), []);
    useModalBehaviour(open, close);
    useEvent("rb:command", () => setOpen(true));

    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);
    useEffect(() => { if (open) { setQuery(""); setIndex(0); } }, [open]);

    const items = useMemo(() => [
        ...NAV_LINKS.map(([href, label]) => ({ group: "Jump to", label, Icon: Hash, run: () => goToSection(href) })),
        ...CASE_STUDIES.map((c) => ({ group: "Case studies", label: c.title, hint: c.kicker, Icon: Briefcase, run: () => navigate(`/work/${c.slug}`) })),
        { group: "Actions", label: "View resume", Icon: FileText, run: () => emit("rb:resume") },
        { group: "Actions", label: "Download resume", Icon: FileDown, run: () => { const a = document.createElement("a"); a.href = PROFILE.resume; a.download = "Bhavani_Sai_Resume.pdf"; a.click(); } },
        { group: "Actions", label: "Copy email address", hint: PROFILE.email, Icon: Mail, run: copyEmail },
        { group: "Actions", label: "Toggle dark / light theme", Icon: Moon, run: () => emit("rb:toggle-theme") },
        { group: "Elsewhere", label: "GitHub", hint: "opens in a new tab", Icon: Github, run: () => window.open(PROFILE.github, "_blank", "noopener") },
        { group: "Elsewhere", label: "LinkedIn", hint: "opens in a new tab", Icon: Linkedin, run: () => window.open(PROFILE.linkedin, "_blank", "noopener") },
    ], [goToSection]);

    const q = query.trim().toLowerCase();
    const filtered = q ? items.filter((it) => `${it.label} ${it.hint || ""} ${it.group}`.toLowerCase().includes(q)) : items;
    const safeIndex = Math.min(index, Math.max(0, filtered.length - 1));

    function run(item) {
        close();
        // let the menu close (and focus restore) before scrolling/navigating
        window.setTimeout(item.run, 60);
    }
    function onKeyDown(e) {
        if (e.key === "ArrowDown") { e.preventDefault(); setIndex((safeIndex + 1) % Math.max(1, filtered.length)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setIndex((safeIndex - 1 + filtered.length) % Math.max(1, filtered.length)); }
        else if (e.key === "Enter" && filtered[safeIndex]) { e.preventDefault(); run(filtered[safeIndex]); }
    }
    useEffect(() => {
        listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
    }, [safeIndex]);

    let lastGroup = null;
    return (
        <AnimatePresence>
            {open && (
                <motion.div className="rb-modal-backdrop rb-cmd-backdrop" data-lenis-prevent onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div
                        className="rb-cmd"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Command menu"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: -30, scale: 0.94, rotate: -1.5, opacity: 0 }}
                        animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ y: -16, scale: 0.97, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    >
                        <label className="rb-cmd-search">
                            <Search size={17} aria-hidden="true" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
                                onKeyDown={onKeyDown}
                                placeholder="Where to? Try “parking”, “resume”, “dark”…"
                                aria-label="Search commands"
                                aria-controls="rb-cmd-list"
                                aria-activedescendant={filtered[safeIndex] ? `rb-cmd-${safeIndex}` : undefined}
                                role="combobox"
                                aria-expanded="true"
                            />
                            <kbd>Esc</kbd>
                        </label>
                        <ul className="rb-cmd-list" id="rb-cmd-list" role="listbox" ref={listRef}>
                            {filtered.length === 0 && <li className="rb-cmd-empty">Nothing matches “{query}”.</li>}
                            {filtered.map((it, i) => {
                                const header = it.group !== lastGroup ? it.group : null;
                                lastGroup = it.group;
                                const active = i === safeIndex;
                                return (
                                    <React.Fragment key={`${it.group}-${it.label}`}>
                                        {header && <li className="rb-cmd-group" role="presentation">{header}</li>}
                                        <li
                                            id={`rb-cmd-${i}`}
                                            role="option"
                                            aria-selected={active}
                                            data-active={active}
                                            className={`rb-cmd-item${active ? " active" : ""}`}
                                            onMouseMove={() => setIndex(i)}
                                            onClick={() => run(it)}
                                        >
                                            <span className="rb-cmd-ico"><it.Icon size={15} aria-hidden="true" /></span>
                                            <span className="rb-cmd-label">{it.label}</span>
                                            {it.hint && <span className="rb-cmd-hint">{it.hint}</span>}
                                            {active && <CornerDownLeft size={14} className="rb-cmd-enter" aria-hidden="true" />}
                                        </li>
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                        <div className="rb-cmd-foot"><kbd>↑</kbd><kbd>↓</kbd> move <kbd>Enter</kbd> open <kbd>Ctrl</kbd>+<kbd>K</kbd> toggle</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/** Small "Ctrl K" pill for the nav. */
export function CommandHint() {
    return (
        <motion.button type="button" className="rb-cmd-hint-btn" onClick={() => emit("rb:command")} whileTap={{ scale: 0.9 }} aria-label="Open command menu (Ctrl+K)">
            <Search size={13} aria-hidden="true" /><kbd>Ctrl K</kbd>
        </motion.button>
    );
}

export const EXTRAS_CSS = `
/* global focus ring — anything focusable via keyboard gets a clear violet outline */
.rb-root :focus-visible{outline:2.5px solid var(--violet); outline-offset:3px; border-radius:6px;}
html.rb-modal-open, html.rb-modal-open body{overflow:hidden;}

/* toast */
.rb-toast-wrap{position:fixed; left:50%; bottom:26px; translate:-50% 0; z-index:1300; pointer-events:none;}
.rb-toast{display:flex; align-items:center; gap:8px; padding:11px 18px; border:2px solid var(--ink); border-radius:999px; background:var(--yellow); color:var(--ink-on-accent); font-family:var(--f-body); font-weight:800; font-size:13.5px; box-shadow:4px 4px 0 var(--ink); white-space:nowrap;}

/* certifications */
.rb-certs{padding-top:8px;}
.rb-certs-title{margin:4px 0 0; font-family:var(--f-display); font-weight:400; text-transform:uppercase; font-size:clamp(28px,4vw,44px); line-height:1;}
ul.rb-certs-list{display:flex; flex-wrap:wrap; gap:16px; margin-top:24px;}
.rb-root .rb-cert{display:flex; color:var(--ink); align-items:center; gap:12px; padding:12px 18px 12px 12px; border:1.8px solid var(--ink); border-radius:16px; background:var(--card); box-shadow:4px 4px 0 var(--ink); transition:box-shadow .2s var(--ease);}
a.rb-cert:hover{box-shadow:6px 6px 0 var(--ink);}
.rb-cert-seal{display:grid; place-items:center; width:42px; height:42px; flex:none; border-radius:50%; border:1.6px dashed var(--ink); background:var(--cert-accent); color:var(--ink-on-accent); outline:3px solid var(--cert-accent); outline-offset:-7px;}
.rb-cert-text{display:flex; flex-direction:column;}
.rb-cert-text strong{font-family:var(--f-body); font-weight:800; font-size:13.5px; line-height:1.25;}
.rb-cert-text small{font-family:var(--f-hand); font-weight:700; font-size:16px; color:var(--ink-dim); line-height:1.1;}
.rb-cert-go{color:var(--ink-faint);}

/* about extras */
.rb-about-extras{display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.35fr); gap:28px; align-items:start; margin-top:30px;}
.rb-now{position:relative; padding:28px 22px 22px; border:1.8px solid var(--ink); border-radius:18px; background:var(--card); box-shadow:5px 5px 0 var(--ink);}
.rb-now-badge{position:absolute; top:-15px; left:18px; display:inline-flex; align-items:center; gap:8px; padding:5px 13px; border:1.6px solid var(--ink); border-radius:999px; background:var(--mint); color:var(--ink-on-accent); font-family:var(--f-display); font-size:15px; letter-spacing:.06em; text-transform:uppercase; transform:rotate(-3deg);}
.rb-now-badge .pulse{position:relative; width:8px; height:8px; border-radius:50%; background:var(--green);}
.rb-now-badge .pulse::after{content:''; position:absolute; inset:0; border-radius:50%; background:var(--green); animation:rb-pulse 1.8s var(--ease) infinite;}
.rb-now-content small{display:block; font-family:var(--f-body); font-weight:800; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint);}
.rb-now-content strong{display:block; margin-top:5px; font-family:var(--f-body); font-size:16px; font-weight:700; line-height:1.45;}
.rb-offclock > ul{display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-top:12px;}
.rb-offclock li{display:flex; flex-direction:column; gap:3px; padding:13px 12px 14px; border:1.6px solid var(--ink); border-radius:14px; color:var(--ink-on-accent); box-shadow:3px 3px 0 var(--ink); cursor:default;}
.rb-offclock-emoji{font-size:26px; line-height:1; margin-bottom:4px;}
.rb-offclock strong{font-family:var(--f-display); font-weight:400; text-transform:uppercase; font-size:15px; line-height:1.05;}
.rb-offclock li > span:last-child{font-family:var(--f-hand); font-weight:700; font-size:15.5px; line-height:1.1;}
@media(max-width:960px){ .rb-about-extras{grid-template-columns:1fr; gap:34px;} }
@media(max-width:600px){ .rb-offclock > ul{grid-template-columns:repeat(2,minmax(0,1fr));} }

/* secret smiley */
button.rb-secret-smiley{position:relative; display:inline-grid; place-items:center; padding:0; background:none; border:0; cursor:pointer; align-self:center;}
.rb-confetti{position:absolute; left:50%; top:50%; width:8px; height:12px; margin:-6px 0 0 -4px; border:1px solid var(--ink); border-radius:2px; pointer-events:none; z-index:30;}
.rb-confetti.sq{width:9px; height:9px; border-radius:50%;}

/* quick facts */
.rb-facts{margin-top:26px; padding:18px 20px; border:1.8px solid var(--ink); border-radius:16px; background:var(--card); box-shadow:4px 4px 0 var(--ink);}
.rb-facts-head{display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding-bottom:12px; margin-bottom:6px; border-bottom:1.6px dashed var(--line);}
.rb-facts-title{display:inline-flex; align-items:center; gap:7px; font-family:var(--f-display); font-size:18px; text-transform:uppercase;}
.rb-facts-actions{display:flex; gap:8px; flex-wrap:wrap;}
.rb-root .rb-facts-actions button{display:inline-flex; align-items:center; gap:6px; padding:7px 12px; border:1.6px solid var(--ink); border-radius:999px; background:var(--warm); font-family:var(--f-body); font-weight:800; font-size:12px; transition:background-color .2s var(--ease), transform .2s var(--ease), box-shadow .2s var(--ease);}
.rb-root .rb-facts-actions button:hover{background:var(--yellow); color:var(--ink-on-accent); transform:translateY(-2px); box-shadow:0 3px 0 var(--ink);}
.rb-facts dl{margin:0; display:flex; flex-direction:column;}
.rb-facts dl > div{display:grid; grid-template-columns:130px minmax(0,1fr); gap:12px; padding:8px 0; border-bottom:1px solid var(--line);}
.rb-facts dl > div:last-child{border-bottom:0;}
.rb-facts dt{font-family:var(--f-body); font-weight:800; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-faint); padding-top:2px;}
.rb-facts dd{margin:0; font-weight:600; font-size:14px;}
.rb-facts dd .rb-todo{margin:0;}
@media(max-width:520px){ .rb-facts dl > div{grid-template-columns:1fr; gap:2px;} }

/* modals */
.rb-modal-backdrop{position:fixed; inset:0; z-index:1100; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(10,10,12,.55); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px);}
.rb-resume{display:flex; flex-direction:column; width:min(900px,100%); height:min(88vh,1100px); border:2px solid var(--ink); border-radius:20px; background:var(--paper); box-shadow:10px 10px 0 var(--ink); overflow:hidden;}
.rb-resume-bar{display:flex; align-items:center; gap:12px; padding:12px 14px 12px 18px; border-bottom:2px solid var(--ink); background:var(--yellow); color:var(--ink-on-accent);}
.rb-resume-bar strong{flex:1; display:flex; align-items:center; gap:8px; font-family:var(--f-body); font-weight:800; font-size:14px; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
.rb-resume-dl{display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:999px; background:#171615; color:#F8F7F3 !important; font-weight:800; font-size:12.5px;}
.rb-root button.rb-resume-close, button.rb-resume-close{display:grid; place-items:center; width:34px; height:34px; border:1.6px solid #171615; border-radius:50%; background:#fff; color:#171615; cursor:pointer;}
.rb-resume iframe{flex:1; width:100%; border:0; background:#fff;}

/* command menu */
.rb-cmd-backdrop{align-items:flex-start; padding-top:12vh;}
.rb-cmd{width:min(600px,100%); border:2px solid var(--ink); border-radius:20px; background:var(--paper); color:var(--ink); box-shadow:10px 10px 0 var(--ink); overflow:hidden; font-family:var(--f-body);}
.rb-cmd-search{display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:2px solid var(--ink); background:var(--card);}
.rb-cmd-search input{flex:1; min-width:0; border:0; outline:0; background:transparent; color:var(--ink); font:inherit; font-size:16px; font-weight:600;}
.rb-root .rb-cmd-search input:focus-visible{outline:none;}
.rb-cmd-search input::placeholder{color:var(--ink-faint); font-weight:500;}
.rb-cmd kbd, .rb-cmd-hint-btn kbd{display:inline-block; padding:2px 7px; border:1.4px solid var(--ink); border-radius:6px; background:var(--warm); font-family:var(--f-body); font-weight:800; font-size:11px; line-height:1.4; box-shadow:0 2px 0 var(--ink); color:var(--ink);}
.rb-cmd-list{max-height:min(52vh,420px); overflow-y:auto; overscroll-behavior:contain; padding:8px; margin:0; list-style:none;}
.rb-cmd-group{padding:10px 10px 4px; font-family:var(--f-hand); font-weight:700; font-size:17px; color:var(--ink-dim);}
.rb-cmd-item{display:flex; align-items:center; gap:12px; padding:10px 12px; border:1.6px solid transparent; border-radius:12px; cursor:pointer; font-weight:700; font-size:14.5px;}
.rb-cmd-item.active{background:var(--yellow); color:var(--ink-on-accent); border-color:var(--ink); box-shadow:3px 3px 0 var(--ink);}
.rb-cmd-ico{display:grid; place-items:center; width:30px; height:30px; flex:none; border:1.4px solid var(--ink); border-radius:9px; background:var(--card); color:var(--ink);}
.rb-cmd-label{flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
.rb-cmd-hint{flex:none; max-width:40%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:600; font-size:12px; color:var(--ink-faint);}
.rb-cmd-item.active .rb-cmd-hint{color:var(--ink-on-accent); opacity:.7;}
.rb-cmd-empty{padding:24px; text-align:center; color:var(--ink-dim); font-weight:600;}
.rb-cmd-foot{display:flex; align-items:center; gap:6px; flex-wrap:wrap; padding:10px 16px; border-top:1.6px dashed var(--line); font-size:12px; font-weight:600; color:var(--ink-dim);}
.rb-cmd-foot kbd + kbd{margin-left:-2px;}
.rb-root button.rb-cmd-hint-btn, button.rb-cmd-hint-btn{display:inline-flex; align-items:center; gap:7px; height:36px; padding:0 8px 0 11px; border:1.6px solid var(--ink); border-radius:999px; background:var(--card); color:var(--ink); transition:transform .2s var(--ease), background-color .2s var(--ease);}
.rb-root button.rb-cmd-hint-btn:hover{background:var(--yellow); color:var(--ink-on-accent); transform:translateY(-2px);}
@media(max-width:860px){ .rb-root button.rb-cmd-hint-btn{display:none;} }
@media(max-width:600px){ .rb-root button.rb-skill-chip{min-height:28px; padding:4px 9px; font-size:11px;} .rb-cmd-backdrop{padding-top:8vh;} .rb-cmd-foot{display:none;} }
`;
