import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "../router";

/** Doodle 404: a confused smiley swaying next to a big "404", with a way home. */
export default function NotFound() {
    const reduceMotion = useReducedMotion();
    return (
        <main className="rb-404">
            <div className="rb-wrap rb-404-wrap">
                <div className="rb-404-art" aria-hidden="true">
                    <motion.span
                        className="rb-404-num"
                        initial={reduceMotion ? false : { scale: 2.2, rotate: -14, opacity: 0 }}
                        animate={{ scale: 1, rotate: -3, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 13 }}
                    >
                        4<motion.svg
                            className="rb-404-face"
                            viewBox="0 0 32 32"
                            animate={reduceMotion ? undefined : { rotate: [-10, 10, -10] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <circle cx="16" cy="16" r="14" stroke="var(--ink)" strokeWidth="2" fill="var(--yellow)" />
                            <circle cx="11" cy="13" r="1.8" fill="var(--ink-on-accent)" />
                            <circle cx="21" cy="13" r="1.8" fill="var(--ink-on-accent)" />
                            <path d="M10 22c2-2 4-2 6 0s4 2 6 0" stroke="var(--ink-on-accent)" strokeWidth="2" strokeLinecap="round" fill="none" />
                        </motion.svg>4
                    </motion.span>
                </div>
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 0.84, 0.44, 1] }}
                >
                    <p className="rb-404-note">this page wandered off…</p>
                    <h1 className="rb-404-title">Page not found</h1>
                    <p className="rb-404-text">The link might be old, or the page was moved. Everything else is right where I left it.</p>
                    <Link to="/" className="rb-cs-back rb-404-home"><ArrowLeft size={16} /> Back to the homepage</Link>
                </motion.div>
            </div>
        </main>
    );
}

export const NOT_FOUND_CSS = `
.rb-404{min-height:calc(100vh - 220px); display:flex; align-items:center; padding:40px 0 60px;}
.rb-404-wrap{display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px;}
.rb-404-num{display:inline-flex; align-items:center; font-family:var(--f-display); font-size:clamp(130px,26vw,280px); line-height:1; color:var(--yellow); -webkit-text-stroke:3px var(--ink); paint-order:stroke fill; text-shadow:8px 8px 0 var(--ink);}
.rb-404-face{width:.78em; height:.78em; margin:0 .04em; overflow:visible; filter:drop-shadow(6px 6px 0 var(--ink));}
.rb-404-note{margin:0; font-family:var(--f-hand); font-weight:700; font-size:24px; color:var(--ink-dim); transform:rotate(-2deg);}
.rb-404-title{margin:6px 0 0; font-family:var(--f-display); font-weight:400; text-transform:uppercase; font-size:clamp(34px,5vw,56px); line-height:1;}
.rb-404-text{max-width:440px; margin:14px auto 26px; font-size:15.5px; line-height:1.65; color:var(--ink-dim);}
`;
