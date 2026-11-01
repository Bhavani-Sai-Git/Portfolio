/**
 * Doodle-style device frame: `kind="phone"` or `kind="browser"`.
 * Shows `src` when there's a real screenshot, otherwise a neutral wireframe
 * sketch of the screen type (`sketch`: form | dashboard | list | pos) so the
 * layout still reads as "an app" without inventing any real data.
 */
export default function ScreenFrame({ kind = "phone", src, alt = "", sketch = "list", label, accent = "var(--yellow)", style, className = "" }) {
    return (
        <figure className={`rb-frame-fig ${className}`} style={{ "--frame-accent": accent, ...style }}>
            <div className={`rb-device rb-device-${kind}`}>
                {kind === "phone" ? <span className="rb-device-notch" aria-hidden="true" /> : (
                    <span className="rb-device-bar" aria-hidden="true"><i /><i /><i /><b /></span>
                )}
                <div className="rb-device-screen">
                    {src ? <img src={src} alt={alt || label} loading="lazy" /> : <Sketch type={sketch} />}
                </div>
            </div>
            {label && <figcaption>{label}</figcaption>}
        </figure>
    );
}

function Sketch({ type }) {
    if (type === "form") {
        return (
            <div className="rb-sk" aria-hidden="true">
                <span className="rb-sk-title" />
                {[0, 1, 2].map((i) => <span key={i} className="rb-sk-field"><i /></span>)}
                <span className="rb-sk-chips"><i /><i /><i /></span>
                <span className="rb-sk-btn" />
            </div>
        );
    }
    if (type === "dashboard") {
        return (
            <div className="rb-sk" aria-hidden="true">
                <span className="rb-sk-title" />
                <span className="rb-sk-stats"><i /><i /></span>
                <span className="rb-sk-chart">{[40, 70, 52, 88, 64, 76].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</span>
                {[0, 1].map((i) => <span key={i} className="rb-sk-row"><i /><b /></span>)}
            </div>
        );
    }
    if (type === "pos") {
        return (
            <div className="rb-sk" aria-hidden="true">
                <span className="rb-sk-title" />
                <span className="rb-sk-grid">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} />)}</span>
                <span className="rb-sk-total"><i /><b /></span>
                <span className="rb-sk-btn" />
            </div>
        );
    }
    return (
        <div className="rb-sk" aria-hidden="true">
            <span className="rb-sk-title" />
            {[0, 1, 2, 3, 4].map((i) => <span key={i} className="rb-sk-row"><em /><i /><b /></span>)}
        </div>
    );
}

export const SCREEN_FRAME_CSS = `
.rb-frame-fig{margin:0; display:flex; flex-direction:column; align-items:center; gap:14px;}
.rb-frame-fig figcaption{font-family:var(--f-hand); font-weight:700; font-size:19px; line-height:1; color:var(--ink); transform:rotate(-2deg);}
.rb-device{position:relative; background:var(--card); border:2.2px solid var(--ink); box-shadow:7px 7px 0 var(--ink); overflow:hidden;}
.rb-device-phone{width:var(--phone-w,210px); aspect-ratio:9/18.5; border-radius:30px; padding:26px 9px 12px;}
.rb-device-notch{position:absolute; top:9px; left:50%; translate:-50% 0; width:58px; height:9px; border-radius:999px; background:var(--ink);}
.rb-device-browser{width:var(--browser-w,460px); max-width:100%; aspect-ratio:16/10.5; border-radius:16px; padding:38px 10px 10px;}
.rb-device-bar{position:absolute; top:0; left:0; right:0; height:30px; display:flex; align-items:center; gap:6px; padding:0 12px; border-bottom:2px solid var(--ink); background:var(--frame-accent);}
.rb-device-bar i{width:9px; height:9px; border-radius:50%; border:1.5px solid var(--ink-on-accent); background:rgba(255,255,255,.6);}
.rb-device-bar b{flex:1; height:12px; margin-left:8px; border-radius:999px; border:1.5px solid var(--ink-on-accent); background:rgba(255,255,255,.55);}
.rb-device-screen{width:100%; height:100%; border-radius:18px; overflow:hidden; border:1.6px solid var(--ink); background:var(--warm);}
.rb-device-browser .rb-device-screen{border-radius:8px;}
.rb-device-screen img{display:block; width:100%; height:100%; object-fit:cover; object-position:top;}

/* wireframe sketch */
.rb-sk{display:flex; flex-direction:column; gap:9px; height:100%; padding:14px 12px; background-image:radial-gradient(rgba(var(--ink-rgb),.09) 1px, transparent 1.2px); background-size:12px 12px;}
.rb-sk span{display:block;}
.rb-sk i, .rb-sk b, .rb-sk em{display:block;}
.rb-sk-title{height:12px; width:58%; border-radius:6px; background:var(--ink); opacity:.85; margin-bottom:4px;}
.rb-sk-field{height:30px; border:1.6px solid var(--ink); border-radius:8px; background:var(--card); padding:9px 10px;}
.rb-sk-field i{height:7px; width:52%; border-radius:4px; background:var(--line);}
.rb-sk-chips{display:flex !important; gap:6px;}
.rb-sk-chips i{flex:1; height:22px; border:1.4px solid var(--ink); border-radius:999px; background:var(--frame-accent);}
.rb-sk-chips i:nth-child(2){background:var(--card);}
.rb-sk-btn{margin-top:auto; height:32px; border-radius:999px; background:var(--ink);}
.rb-sk-stats{display:grid !important; grid-template-columns:1fr 1fr; gap:8px;}
.rb-sk-stats i{height:46px; border:1.6px solid var(--ink); border-radius:10px; background:var(--frame-accent);}
.rb-sk-stats i:nth-child(2){background:var(--card);}
.rb-sk-chart{display:flex !important; align-items:flex-end; gap:6px; height:84px; padding:8px; border:1.6px solid var(--ink); border-radius:10px; background:var(--card);}
.rb-sk-chart i{flex:1; border-radius:3px 3px 0 0; background:var(--frame-accent); border:1.3px solid var(--ink);}
.rb-sk-row{display:flex !important; align-items:center; gap:8px; padding:8px; border:1.4px solid var(--line); border-radius:9px; background:var(--card);}
.rb-sk-row em{flex:none; width:20px; height:20px; border-radius:50%; background:var(--frame-accent); border:1.3px solid var(--ink);}
.rb-sk-row i{flex:1; height:7px; border-radius:4px; background:var(--line);}
.rb-sk-row b{flex:none; width:26px; height:12px; border-radius:999px; background:var(--ink); opacity:.75;}
.rb-sk-grid{display:grid !important; grid-template-columns:repeat(3,1fr); gap:7px;}
.rb-sk-grid i{aspect-ratio:1; border:1.4px solid var(--ink); border-radius:9px; background:var(--card);}
.rb-sk-grid i:nth-child(3n+1){background:var(--frame-accent);}
.rb-sk-total{display:flex !important; justify-content:space-between; align-items:center; padding:9px; border:1.6px dashed var(--ink); border-radius:9px;}
.rb-sk-total i{width:40%; height:8px; border-radius:4px; background:var(--line);}
.rb-sk-total b{width:28%; height:12px; border-radius:4px; background:var(--ink);}
`;
