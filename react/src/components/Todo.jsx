/**
 * A dashed "add this" reminder for content only you can supply (screenshots,
 * real numbers, quotes). Renders in `npm run dev` only — production builds
 * drop it, so the live site never shows placeholder copy.
 */
export default function Todo({ children, className = "" }) {
    if (!import.meta.env.DEV || !children) return null;
    return (
        <p className={`rb-todo ${className}`} role="note">
            <strong>To add</strong>
            <span>{children}</span>
        </p>
    );
}

export const TODO_CSS = `
.rb-todo{display:flex; gap:10px; align-items:flex-start; margin:14px 0 0; padding:10px 14px; border:2px dashed #E0533D; border-radius:12px; background:rgba(224,83,61,.07); font-family:var(--f-body); font-size:12.5px; line-height:1.45; color:var(--ink);}
.rb-todo strong{flex:none; padding:2px 8px; border-radius:999px; background:#E0533D; color:#fff; font-size:10px; letter-spacing:.08em; text-transform:uppercase;}
`;
