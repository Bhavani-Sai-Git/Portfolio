import { useEffect, useState } from "react";

/**
 * Tracks which of the given #section ids is currently in view (scroll-spy).
 * `resetKey` re-attaches the observer when the page underneath changes (route change).
 */
export function useActiveSection(hrefs, resetKey) {
    const ids = hrefs.map((h) => h.replace("#", ""));
    const idsKey = ids.join(",");
    const [active, setActive] = useState("");
    useEffect(() => {
        setActive("");
        const elements = idsKey.split(",").filter(Boolean).map((id) => document.getElementById(id)).filter(Boolean);
        if (!elements.length) return;
        const io = new IntersectionObserver(
            (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }); },
            { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
        );
        elements.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [idsKey, resetKey]);
    return active;
}
