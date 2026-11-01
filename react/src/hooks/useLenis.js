import { useEffect } from "react";
import Lenis from "lenis";

// Module-level so scrollToId() can reach the live instance from anywhere
// (nav links, the section legend, hero/footer CTAs) without prop-drilling.
let activeLenis = null;

/** Mounts Lenis smooth scrolling for the page. No-ops (and tears down) when `enabled` is false. */
export function useLenis(enabled = true) {
    useEffect(() => {
        if (!enabled) return undefined;
        const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        activeLenis = lenis;
        let frame;
        const raf = (time) => {
            lenis.raf(time);
            frame = requestAnimationFrame(raf);
        };
        frame = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(frame);
            lenis.destroy();
            if (activeLenis === lenis) activeLenis = null;
        };
    }, [enabled]);
}

/** Back to the top of the page — instantly by default (route changes), or smoothly. */
export function scrollToTop({ smooth = false } = {}) {
    if (activeLenis) {
        activeLenis.scrollTo(0, smooth ? { duration: 1.1 } : { immediate: true, force: true });
        if (smooth) return;
    }
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
}

/**
 * Smoothly scrolls to an element or #id, routed through Lenis when it's running
 * (nav clicks, hero/footer CTAs, the section legend) and falling back to native
 * scrollIntoView otherwise — e.g. reduced-motion, or before Lenis has mounted.
 */
export function scrollToId(target, { offset = 0, duration = 1.1, immediate = false } = {}) {
    const el = typeof target === "string" ? document.getElementById(target.replace(/^#/, "")) : target;
    if (!el) return;
    if (activeLenis) {
        activeLenis.scrollTo(el, { offset, duration: immediate ? 0 : duration });
    } else {
        el.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
    }
}
