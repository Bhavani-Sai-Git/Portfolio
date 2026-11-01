import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Counts a stat up from 0 when it scrolls into view (after an optional
 * `delay` in seconds), preserving any trailing suffix ("7+", "3+").
 * Falls back to the plain static value under prefers-reduced-motion.
 */
export default function CountUp({ value, delay = 0, className }) {
    const ref = useRef(null);
    const reduceMotion = useReducedMotion();
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const match = String(value).match(/^(\d+)(.*)$/);
    const isNumeric = match !== null;
    const target = isNumeric ? parseInt(match[1], 10) : 0;
    const suffix = isNumeric ? match[2] : "";

    const mv = useMotionValue(0);
    const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.6 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!isNumeric || reduceMotion || !inView) return undefined;
        const t = window.setTimeout(() => mv.set(target), delay * 1000);
        return () => window.clearTimeout(t);
    }, [inView, target, delay, reduceMotion, isNumeric, mv]);

    useEffect(() => {
        if (!isNumeric || reduceMotion) return undefined;
        return spring.on("change", (v) => setDisplay(Math.round(v)));
    }, [spring, reduceMotion, isNumeric]);

    if (!isNumeric || reduceMotion) return <span ref={ref} className={className}>{value}</span>;

    return (
        <span ref={ref} className={className}>
            {display}{suffix}
        </span>
    );
}
