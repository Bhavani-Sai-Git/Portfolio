import { motion, useReducedMotion } from "motion/react";

/** Fades + lifts its children in the first time they scroll into view. */
export default function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
    const reduceMotion = useReducedMotion();
    const MotionTag = motion[Tag] || motion.div;
    return (
        <MotionTag
            className={className}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.65, delay, ease: [0.16, 0.84, 0.44, 1] }}
            {...rest}
        >
            {children}
        </MotionTag>
    );
}
