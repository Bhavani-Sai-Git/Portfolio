import { useEffect, useState } from "react";

// Tiny History-API router: the site only has a handful of routes ("/", "/work/:slug", 404),
// so this avoids pulling in react-router. Static hosts need an
// SPA fallback to index.html for deep links — see vercel.json and public/_redirects.

const listeners = new Set();

export function navigate(to, { replace = false } = {}) {
    const url = new URL(to, window.location.href);
    const current = window.location.pathname + window.location.search + window.location.hash;
    const next = url.pathname + url.search + url.hash;
    if (next !== current) history[replace ? "replaceState" : "pushState"](null, "", next);
    listeners.forEach((fn) => fn());
}

/** Current location.pathname, re-rendering on navigate() and browser back/forward. */
export function usePath() {
    const [path, setPath] = useState(() => window.location.pathname);
    useEffect(() => {
        const update = () => setPath(window.location.pathname);
        listeners.add(update);
        window.addEventListener("popstate", update);
        return () => {
            listeners.delete(update);
            window.removeEventListener("popstate", update);
        };
    }, []);
    return path;
}

/** Matches "/work/:slug"-style patterns; returns the params object or null. */
export function matchPath(pattern, path) {
    const p = pattern.split("/").filter(Boolean);
    const s = path.replace(/\/+$/, "").split("/").filter(Boolean);
    if (p.length !== s.length) return null;
    const params = {};
    for (let i = 0; i < p.length; i++) {
        if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(s[i]);
        else if (p[i] !== s[i]) return null;
    }
    return params;
}

/** In-app link: plain <a href> (so open-in-new-tab still works) that routes client-side on a normal click. */
export function Link({ to, onClick, children, ...rest }) {
    function handleClick(e) {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
    }
    return <a href={to} onClick={handleClick} {...rest}>{children}</a>;
}
