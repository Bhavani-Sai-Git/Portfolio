import { useEffect, useState } from "react";

/**
 * True once `font` (CSS font shorthand, e.g. "800 1em Poppins") has loaded for `text`,
 * or after `timeout` ms so content gated on it never stays hidden (offline, blocked CDN).
 */
export function useFontReady(font, text, timeout = 1500) {
    const [ready, setReady] = useState(() => typeof document === "undefined" || !document.fonts);

    useEffect(() => {
        if (ready) return undefined;
        let cancelled = false;
        const deadline = performance.now() + timeout;
        const finish = () => { if (!cancelled) setReady(true); };

        (async () => {
            while (!cancelled && performance.now() < deadline) {
                try {
                    // load() resolves [] until the @font-face rule is registered, so poll briefly until it is
                    if ((await document.fonts.load(font, text)).length) return finish();
                } catch {
                    return finish();
                }
                await new Promise((r) => setTimeout(r, 50));
            }
            finish();
        })();

        return () => { cancelled = true; };
    }, [font, text, timeout, ready]);

    return ready;
}
