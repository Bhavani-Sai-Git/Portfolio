import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Magnetic pull: while hovered, the element eases toward the cursor; on
 * leave it springs back past center and settles — an elastic snap-back.
 * Mouse-only (pointer: fine) and disabled under prefers-reduced-motion.
 * Usage: const magnetic = useMagnetic(); <motion.a ref={magnetic.ref} style={magnetic.style} />
 */
export function useMagnetic(strength = 0.3) {
    const ref = useRef(null);
    const reduceMotion = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 220, damping: 14, mass: 0.4 });
    const springY = useSpring(y, { stiffness: 220, damping: 14, mass: 0.4 });

    useEffect(() => {
        const el = ref.current;
        if (!el || reduceMotion) return undefined;
        const fine = window.matchMedia("(pointer: fine)").matches;
        if (!fine) return undefined;

        function handleMove(e) {
            const r = el.getBoundingClientRect();
            x.set((e.clientX - (r.left + r.width / 2)) * strength);
            y.set((e.clientY - (r.top + r.height / 2)) * strength);
        }
        function handleLeave() {
            x.set(0);
            y.set(0);
        }
        el.addEventListener("mousemove", handleMove);
        el.addEventListener("mouseleave", handleLeave);
        return () => {
            el.removeEventListener("mousemove", handleMove);
            el.removeEventListener("mouseleave", handleLeave);
        };
    }, [strength, reduceMotion, x, y]);

    return { ref, style: reduceMotion ? undefined : { x: springX, y: springY } };
}
