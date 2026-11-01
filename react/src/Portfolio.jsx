import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    motion, useMotionValue, useMotionValueEvent, useSpring, useTransform,
    useReducedMotion, MotionConfig, AnimatePresence,
} from "motion/react";
import {
    ArrowUpRight, Github, Linkedin, Mail, MapPin, FileDown,
    Menu, X, Rocket, Lightbulb,
    ChevronRight, Sparkles,
    Sun, Moon, Lock, Check,
} from "lucide-react";
import { PROFILE, NAV_LINKS, CONTACT, ABOUT, PROJECTS, EXPERIENCE, SKILL_GROUPS, HERO_STATS, HERO_TAGLINE } from "./data/content";
import { getCaseStudy } from "./data/caseStudies";
import { useActiveSection } from "./hooks/useActiveSection";
import { useLenis, scrollToId, scrollToTop } from "./hooks/useLenis";
import { useMagnetic } from "./hooks/useMagnetic";
import { useFontReady } from "./hooks/useFontReady";
import { usePath, matchPath, navigate, Link } from "./router";
import CountUp from "./components/CountUp";
import Reveal from "./components/Reveal";
import { TODO_CSS } from "./components/Todo";
import { SCREEN_FRAME_CSS } from "./components/ScreenFrame";
import CaseStudy, { CASE_STUDY_CSS } from "./pages/CaseStudy";
import NotFound, { NOT_FOUND_CSS } from "./pages/NotFound";
import {
    Certifications, AboutExtras, SecretSmiley, QuickFacts,
    ResumeModal, CommandMenu, CommandHint, Toaster, EXTRAS_CSS,
} from "./sections/Extras";

/* =========================================================================
   STYLE — retro editorial / scrapbook portfolio system
   ========================================================================= */
// Vertical clearance reserved for the fixed navbar, shared between its CSS
// inset and the Work section's pinned-viewport math so neither covers the other.
const NAV_CLEARANCE = 96;

const STYLE = `
/* Fonts (Anton, DM Sans, Caveat, Poppins) load from index.html so they're requested before the JS runs. */

:root{
  --paper:#FAF9F5; --warm:#F5F3EE; --card:#FFFFFF;
  --line:#E6E3DC; --ink:#171615; --ink-rgb:23,22,21; --ink-dim:#625F56; --ink-faint:#9B9789;
  --ink-on-accent:#171615;
  --yellow:#F6D35C; --yellow-soft:#FBE8A9;
  --pink:#F6AED0; --mint:#BFEFDD; --blue:#C9D3FC; --violet:#9D3EFC; --violet-soft:#ECD6FB;
  --gray:#D8D6D1; --green:#1F9D55;
  --curtain:#171615;
  --page-bg:#ECE9E1;
  --f-display:'Anton',sans-serif;
  --f-body:'DM Sans',-apple-system,sans-serif;
  --f-hand:'Caveat',cursive;
  --ease:cubic-bezier(.16,.84,.44,1);
  --radius-lg:22px; --radius-md:16px; --radius-sm:10px;
}

:root[data-theme="dark"]{
  --paper:#111113; --warm:#1A1A1E; --card:#1C1C21;
  --line:#2E2E35; --ink:#F8F7F3; --ink-rgb:248,247,243; --ink-dim:#C4C1B8; --ink-faint:#8D8A82;
  --page-bg:#07070A;
}

/* THEME CURTAIN — fixed colors so it reads the same from either theme and never flips mid-swap */
.rb-theme-curtain{position:fixed; inset:0; z-index:1200; display:flex; pointer-events:none; visibility:hidden;}
.rb-theme-curtain.is-active{visibility:visible; pointer-events:auto;}
.rb-theme-curtain-panel{display:block; width:50%; height:100%; background-color:var(--curtain); background-image:radial-gradient(rgba(246,211,92,.16) 1.3px, transparent 1.7px); background-size:18px 18px; border:0 solid var(--yellow);}
.rb-theme-curtain-panel.left{border-right-width:4px;}
.rb-theme-curtain-panel.right{border-left-width:4px;}
.rb-theme-curtain-center{position:absolute; left:50%; top:50%; translate:-50% -50%; z-index:2; display:flex; flex-direction:column; align-items:center; gap:22px;}
.rb-theme-curtain-badge{position:relative; display:grid; place-items:center; width:116px; height:116px; border-radius:50%; background:var(--curtain); border:3px solid var(--yellow); color:var(--yellow); font-family:var(--f-display); font-size:46px; line-height:1; letter-spacing:.02em; box-shadow:0 0 0 9px rgba(246,211,92,.16), 0 22px 60px -12px rgba(0,0,0,.7);}
.rb-theme-curtain-ring{position:absolute; inset:-18px; border:2px dashed rgba(246,211,92,.75); border-radius:50%; animation:rb-curtain-spin 5s linear infinite;}
@keyframes rb-curtain-spin{to{transform:rotate(360deg);}}
.rb-theme-curtain-caption{display:inline-flex; align-items:center; gap:8px; padding:8px 17px; border-radius:999px; border:2px solid var(--curtain); background:var(--yellow); color:var(--curtain); font-family:var(--f-body); font-weight:800; font-size:13px; letter-spacing:.1em; text-transform:uppercase; box-shadow:4px 4px 0 rgba(0,0,0,.45);}

html, body{margin:0; padding:0; background:var(--page-bg); transition:background-color .35s var(--ease);}
*{box-sizing:border-box;}
@media (prefers-reduced-motion: no-preference){ html{scroll-behavior:smooth;} }
html.lenis, html.lenis body{height:auto;}
.lenis.lenis-smooth{scroll-behavior:auto !important;}
.lenis.lenis-stopped{overflow:hidden;}
#root{background:var(--page-bg);}

.rb-frame{
  background:var(--paper); margin:0; min-height:100vh; overflow:hidden; position:relative;
  border:none;
  background-image:
    linear-gradient(to right, rgba(var(--ink-rgb),.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(var(--ink-rgb),.035) 1px, transparent 1px);
  background-size:28px 28px;
}

.rb-root{
  background-color:var(--paper);
  background-image:repeating-linear-gradient(to bottom, transparent, transparent 26px, var(--line) 26px, var(--line) 27px);
  color:var(--ink); font-family:var(--f-body); min-height:100%; overflow-x:hidden; line-height:1.55;
  -webkit-font-smoothing:antialiased; position:relative;
}
.rb-root *{box-sizing:border-box;}
.rb-root a{color:inherit; text-decoration:none;}
.rb-root button{font:inherit; background:none; border:none; color:inherit; cursor:pointer;}
.rb-root ul{list-style:none; margin:0; padding:0;}

.rb-wrap{max-width:1240px; margin:0 auto; padding:0 36px; position:relative; z-index:3;}
@media(max-width:767px){ .rb-wrap{padding:0 18px;} }

.rb-display-xl{margin:6px 0 0; font-family:var(--f-display); font-weight:400; text-transform:uppercase; letter-spacing:-.01em; line-height:.92; font-size:clamp(30px,9vw,78px);}

.rb-hand-label{display:inline-flex; align-items:center; gap:8px; font-family:var(--f-hand); font-weight:700; font-size:19px; color:var(--ink-dim); transform:rotate(-2deg);}


/* NAV */
.rb-nav{
  position:fixed; top:18px; left:50%; right:auto; translate:-50% 0; width:min(1240px,calc(100% - 36px)); z-index:500; padding:16px 0;
  background:var(--paper); border-radius:18px;
  transition:padding .3s var(--ease), box-shadow .3s var(--ease), background-color .3s var(--ease), backdrop-filter .3s var(--ease), border-radius .3s var(--ease);
}
/* Scrolled: bar fully transparent in both themes — the tabs pill, Resume and
   theme buttons carry their own solid fills, so they stay legible over content. */
.rb-nav.scrolled{
  padding:10px 0; border-radius:16px;
  background-color:transparent; backdrop-filter:none; -webkit-backdrop-filter:none; box-shadow:none;
}
@media(max-width:700px){ .rb-nav{top:8px; left:50%; right:auto; width:calc(100% - 16px);} }
.rb-nav-spacer{pointer-events:none;}
.rb-nav-row{display:flex; align-items:center; gap:18px;}
.rb-brand{display:flex; align-items:center; gap:8px; flex:none;}
.rb-brand-mark{width:28px; height:28px; border-radius:50%; border:1.6px solid var(--ink); display:flex; align-items:center; justify-content:center; font-family:var(--f-display); font-size:13px; background:var(--yellow); color:var(--ink-on-accent); flex:none;}
.rb-brand-text{font-family:var(--f-body); font-weight:800; font-size:13px; letter-spacing:.03em; text-transform:uppercase; white-space:nowrap;}
.rb-nav-tabs{display:flex; align-items:center; gap:4px; background:var(--warm); border:1.6px solid var(--ink); border-radius:999px; padding:5px; margin:0 auto;}
.rb-nav-tabs a{position:relative; overflow:hidden; font-family:var(--f-body); font-weight:600; font-size:13px; padding:9px 18px; border-radius:999px; color:var(--ink-dim); transition:color .25s var(--ease);}
.rb-nav-tabs a:hover{color:var(--ink);}
.rb-nav-tabs a.active{color:var(--ink); font-weight:700;}
.rb-nav-tabs a.has-pill{color:var(--ink-on-accent);}
.rb-nav-pill{position:absolute; inset:0; background:var(--yellow); border-radius:999px; z-index:0;}
.rb-nav-ripple{position:absolute; left:50%; top:50%; width:16px; height:16px; margin:-8px 0 0 -8px; border-radius:50%; background:var(--yellow); z-index:0; pointer-events:none;}
.rb-nav-tab-label{position:relative; z-index:1;}
.rb-nav-right{display:flex; align-items:center; gap:12px; flex:none;}
.rb-nav-dot{width:9px; height:9px; border-radius:50%; flex:none;}
a.rb-nav-cta{display:inline-flex; align-items:center; gap:8px; position:relative; font-family:var(--f-body); font-weight:700; font-size:13px; background:var(--ink); color:var(--paper); border:1.6px solid var(--ink); padding:10px 20px; border-radius:999px; box-shadow:0 3px 0 rgba(var(--ink-rgb),.18); transition:transform .2s var(--ease), box-shadow .2s var(--ease);}
a.rb-nav-cta:hover{transform:translateY(-2px); box-shadow:0 5px 0 var(--ink);}
.rb-nav-cta:focus-visible, .rb-nav-tabs a:focus-visible, .rb-menu-btn:focus-visible, .rb-theme-toggle:focus-visible{outline:2px solid var(--ink); outline-offset:3px;}
.rb-theme-toggle{
  display:flex; align-items:center; justify-content:center; flex:none; overflow:hidden;
  width:36px; height:36px; border-radius:50%; border:1.6px solid var(--ink); background:var(--card); color:var(--ink);
  transition:background-color .25s var(--ease), color .25s var(--ease), transform .2s var(--ease);
}
.rb-theme-toggle:hover{background:var(--yellow); color:var(--ink-on-accent); transform:translateY(-2px);}
.rb-nav-social-rail{position:fixed; right:16px; display:flex; flex-direction:column; gap:9px; z-index:499;}
.rb-nav-social-link{position:relative; width:36px; height:36px; border:1.6px solid var(--ink); border-radius:50%; background:var(--card); color:var(--ink); display:grid; place-items:center; box-shadow:3px 3px 0 var(--ink); transition:transform .22s var(--ease),box-shadow .22s var(--ease),background-color .22s var(--ease),color .22s var(--ease);}
.rb-nav-social-link:hover,.rb-nav-social-link:focus-visible{background:var(--yellow); color:var(--ink-on-accent); transform:translate(-2px,-2px); box-shadow:5px 5px 0 var(--ink); outline:none;}
.rb-social-tip{position:absolute; right:calc(100% + 10px); top:50%; transform:translate(-5px,-50%) scale(.96); width:max-content; max-width:min(300px,calc(100vw - 90px)); padding:7px 11px; border:1.5px solid var(--ink); border-radius:8px; background:var(--yellow); color:var(--ink-on-accent); box-shadow:3px 3px 0 var(--ink); font-family:var(--f-body); font-size:11px; font-weight:700; line-height:1.2; opacity:0; pointer-events:none; transition:opacity .2s var(--ease),transform .2s var(--ease);}
.rb-nav-social-link:hover .rb-social-tip,.rb-nav-social-link:focus-visible .rb-social-tip{opacity:1;transform:translate(0,-50%) scale(1);}

.rb-menu-btn{display:none; flex:none; align-items:center; justify-content:center;}
.rb-mobile-panel{position:fixed; inset:0; background:var(--paper); z-index:550; display:flex; flex-direction:column; justify-content:center; gap:20px; padding:32px; transform:translateY(-100%); transition:transform .45s var(--ease);}
.rb-mobile-panel.open{transform:translateY(0);}
.rb-mobile-panel a{font-family:var(--f-display); font-size:clamp(30px,9vw,42px); text-transform:uppercase;}
.rb-mobile-panel a.active{color:var(--ink); border-bottom:5px solid var(--yellow); display:inline-block;}
@media(max-width:860px){ .rb-nav-tabs, .rb-nav-right .rb-nav-dot, .rb-nav-cta{display:none;} .rb-menu-btn{display:flex;} .rb-nav-social-rail{right:8px;} }

/* BUTTONS */
a.rb-btn, button.rb-btn{display:inline-flex; align-items:center; justify-content:center; gap:10px; font-family:var(--f-body); font-weight:700; font-size:13.5px; letter-spacing:.01em; padding:13px 24px; border-radius:999px; transition:transform .2s var(--ease), box-shadow .2s var(--ease); border:1.6px solid var(--ink); text-decoration:none;}
a.rb-btn-dark, button.rb-btn-dark{background:var(--ink); color:var(--paper); box-shadow:0 4px 0 rgba(var(--ink-rgb),.18);}
a.rb-btn-dark:hover, button.rb-btn-dark:hover{transform:translateY(-3px); box-shadow:0 7px 0 var(--ink);}
button.rb-btn-dark:disabled{opacity:.6; cursor:wait; transform:none; box-shadow:0 4px 0 rgba(var(--ink-rgb),.18);}

/* HERO */
.rb-hero{padding:14px 0 0; position:relative; overflow:hidden;}
.rb-hero::before{content:'';position:absolute; inset:0; background-image:radial-gradient(rgba(var(--ink-rgb),.08) 1px, transparent 1px); background-size:22px 22px; -webkit-mask-image:radial-gradient(ellipse 85% 70% at 60% 20%, black, transparent 75%); mask-image:radial-gradient(ellipse 85% 70% at 60% 20%, black, transparent 75%); pointer-events:none;}
.rb-hero-layout{display:flex; gap:24px; position:relative; z-index:1;}
.rb-hero-left{flex:0 0 50%; max-width:50%; position:relative; padding:76px 16px 0 0;}
.rb-hero-tag{display:flex; align-items:center; gap:9px; font-family:var(--f-body); font-weight:700; font-size:12.5px; letter-spacing:.14em; text-transform:uppercase; margin-bottom:14px;}
.rb-hero-tag::before{content:''; width:8px; height:8px; border-radius:50%; background:var(--violet);}
.rb-hero-headline{position:relative; font-family:'Poppins',var(--f-body); font-weight:800; line-height:.88; letter-spacing:-.02em; font-size:clamp(60px,7.8vw,124px); margin:0 0 22px;}
.rb-hero-headline .l1{position:relative; display:block; z-index:1; width:max-content;}
.rb-hero-name{position:relative; z-index:1; display:inline-block;}
.rb-hero-letter{display:inline-block; transform-origin:50% 85%; cursor:default; will-change:transform;}
.rb-hero-l2{position:relative; display:block; width:max-content;}
.rb-hero-headline .rb-hero-l2 .l2{cursor:default; will-change:transform;}
.rb-hero-spark{position:absolute; z-index:2; display:block; pointer-events:none; font-family:var(--f-body); line-height:1; color:var(--yellow); -webkit-text-stroke:1.6px var(--ink); paint-order:stroke fill;}
.rb-hero-spark > span{display:block; animation:rb-spark-float 3.6s ease-in-out infinite;}
.rb-hero-spark.s1{top:-16%; right:-0.62em; font-size:.34em;}
.rb-hero-spark.s2{bottom:14%; right:-0.78em; font-size:.22em; color:var(--pink);}
.rb-hero-spark.s2 > span{animation-delay:-1.6s;}
@keyframes rb-spark-float{0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-8px) rotate(16deg);}}
.rb-sr-only{position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;}
.rb-hero-name-underline{position:absolute; left:2%; right:4%; bottom:6%; height:12%; background:var(--yellow); border-radius:6px; transform-origin:left center; z-index:0;}
.rb-hero-headline .l2{display:block; background:linear-gradient(100deg,#2f7dfd,var(--violet)); -webkit-background-clip:text; background-clip:text; color:transparent;}
.rb-hero-note{position:absolute; top:42%; left:64%; width:210px; display:flex; align-items:flex-start; gap:8px; font-family:var(--f-hand); font-weight:700; font-size:21px; line-height:1.2; color:var(--ink); transform:rotate(-2deg); pointer-events:none;}
.rb-hero-note svg{flex-shrink:0; margin-top:4px;}
.rb-hero-desc{font-family:var(--f-body); font-size:15px; line-height:1.7; color:var(--ink-dim); max-width:490px; padding-left:15px; border-left:3px solid var(--violet); margin-bottom:28px;}
.rb-hero-ctarow{display:flex; gap:14px; align-items:center; margin-bottom:34px; flex-wrap:wrap;}
a.rb-hero-btn-solid{display:inline-flex; align-items:center; gap:13px; background:var(--ink); color:var(--paper); padding:6px 6px 6px 24px; border-radius:999px; font-family:var(--f-body); font-weight:700; font-size:13.5px; text-decoration:none; transition:transform .2s var(--ease);}
a.rb-hero-btn-solid:hover{transform:translateY(-2px);}
.rb-hero-btn-solid .ico{position:relative; width:32px; height:32px; border-radius:50%; background:var(--violet); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:visible;}
.rb-hero-btn-label{display:inline-block;}
.rb-hero-btn-arrow{position:relative; z-index:1; display:flex; align-items:center; justify-content:center;}
.rb-hero-btn-flash{position:absolute; inset:0; border-radius:50%; background:var(--yellow); box-shadow:0 0 0 4px color-mix(in srgb, var(--yellow) 35%, transparent); z-index:0; pointer-events:none;}
.rb-hero-burst{position:absolute; left:50%; top:50%; width:7px; height:7px; margin:-3.5px 0 0 -3.5px; border-radius:50%; border:1.2px solid var(--ink); pointer-events:none; z-index:2;}
.rb-hero-burst.spark{width:auto; height:auto; margin:-9px 0 0 -6px; border:none; font-size:15px; line-height:1;}
.rb-hero-stats{display:flex; flex-wrap:wrap; gap:16px 22px; align-items:center;}
.rb-hero-stat{display:flex; align-items:center; gap:9px;}
.rb-hero-stat-text{font-family:var(--f-body); font-size:12px; font-weight:700; line-height:1.3; color:var(--ink);}
.rb-hero-stat-text span{display:block; font-weight:500; color:var(--ink-dim); font-size:11px;}
.rb-hero-stat-num{display:block; font-family:var(--f-display); font-weight:400; font-size:34px; line-height:1; color:var(--ink); min-width:1ch;}
.rb-hero-stat-div{width:1px; height:24px; background:var(--line);}
.rb-hero-art{--art-shift:clamp(0px, calc(50vw - 660px), 48px); flex:1.1; position:relative; min-width:0; aspect-ratio:871/675; margin:clamp(32px,5vw,80px) calc(-1 * var(--art-shift)) 0 var(--art-shift); isolation:isolate; transition:box-shadow .35s var(--ease);}
.rb-hero-art::before{content:''; position:absolute; left:-24px; top:12%; width:64px; height:66%; border:2px dashed var(--ink); border-right:0; border-radius:30px 0 0 30px; opacity:.3; transform:rotate(-3deg); z-index:0; pointer-events:none;}
.rb-hero-art::after{content:''; position:absolute; left:-37px; top:49%; width:58px; border-top:3px solid var(--violet); border-radius:100%; opacity:.78; transform:rotate(-10deg); z-index:2; pointer-events:none;}
.rb-hero-art picture, .rb-about-visual picture{display:block; width:100%; height:100%; position:relative; z-index:1;}
.rb-hero-art img{display:block; position:relative; z-index:1; width:100%; height:100%; object-fit:contain; object-position:top left; border-radius:14px; transition:filter .35s var(--ease), box-shadow .35s var(--ease);}
:root[data-theme="dark"] .rb-hero-art img{
  box-shadow:none;
  filter:brightness(1.06) contrast(1.1) saturate(1.18);
}
:root[data-theme="dark"] .rb-hero-art{box-shadow:0 22px 48px -20px rgba(0,0,0,.7);}
@media(max-width:1000px){
  .rb-hero-layout{flex-direction:column;}
  .rb-hero-left{max-width:100%; flex:none; padding-left:0;}
  .rb-hero-art{margin:40px 0 0;}
  .rb-hero-note{display:none;}
}
@media(max-width:760px){
  .rb-hero-headline{font-size:clamp(60px,19vw,96px);}
  .rb-hero-art::before,.rb-hero-art::after{display:none;}
  .rb-hero-left{padding:10px 0 0;}
  .rb-hero-desc{max-width:100%;}
  .rb-hero-stats{flex-direction:column; align-items:flex-start; gap:12px;}
  .rb-hero-stat-div{display:none;}
}

.rb-section{padding:56px 0;}

#top, #skills, #about, #experience, #work, #contact{ scroll-margin-top:88px; }

@keyframes rb-flash-pulse{
  0%{ box-shadow:inset 0 0 0 0 rgba(246,211,92,0); }
  28%{ box-shadow:inset 0 0 0 6px rgba(246,211,92,.45); }
  100%{ box-shadow:inset 0 0 0 0 rgba(246,211,92,0); }
}
.rb-section-flash{ animation:rb-flash-pulse .9s var(--ease); border-radius:22px; }

/* SHARED SECTION BITS */
.rb-section-note{display:inline-flex; align-items:center; gap:8px; font-family:var(--f-hand); font-weight:700; font-size:18px; color:var(--ink-dim); transform:rotate(-2deg);}
.rb-section-note svg{color:var(--ink);}
.pt-ico{width:17px; height:17px; border-radius:5px; background:var(--yellow); color:var(--ink-on-accent); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;}

/* ABOUT — single card (story | facts) with the laptop strip tucked under it */
.rb-about-card{margin-top:28px; background:var(--card); border:1.6px solid var(--ink); border-radius:var(--radius-lg); padding:34px 38px; position:relative; box-shadow:6px 6px 0 var(--ink); z-index:2; display:grid; grid-template-columns:minmax(0,1.25fr) minmax(0,1fr); gap:40px; align-items:center;}
.rb-about-card p{font-size:15.5px; line-height:1.75; color:var(--ink-dim); margin:14px 0 0;}
.rb-about-intro{display:flex; align-items:baseline; gap:10px; margin-bottom:4px; flex-wrap:wrap;}
.rb-about-intro .hey{font-family:var(--f-hand); font-weight:700; font-size:22px; color:var(--ink-dim); transform:rotate(-3deg); display:inline-block;}
.rb-about-intro .name{font-family:var(--f-display); font-size:24px; text-transform:uppercase; position:relative; display:inline-block; z-index:0;}
.rb-about-intro .name::after{content:''; position:absolute; left:-3%; right:-3%; bottom:1px; height:32%; background:var(--yellow); z-index:-1; transform:rotate(-1deg); border-radius:4px;}
.rb-about-facts{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px;}
.rb-about-facts li{border:1.6px solid var(--ink); border-radius:12px; padding:14px 16px; box-shadow:3px 3px 0 var(--ink); color:var(--ink-on-accent); transform:rotate(-1deg);}
.rb-about-facts li:nth-child(even){transform:rotate(1deg);}
.rb-about-facts strong{display:block; font-family:var(--f-display); font-weight:400; text-transform:uppercase; font-size:17px; line-height:1.05;}
.rb-about-facts span{display:block; margin-top:4px; font-family:var(--f-hand); font-weight:700; font-size:16px; line-height:1.15;}
.rb-about-visual{position:relative; z-index:1; max-width:600px; margin:-22px 0 0 36px;}
.rb-about-visual img{display:block; width:100%; height:auto; transition:filter .35s var(--ease), box-shadow .35s var(--ease);}
:root[data-theme="dark"] .rb-about-visual img{border-radius:16px; box-shadow:0 18px 38px -18px rgba(0,0,0,.65), 0 0 0 2px var(--line); filter:brightness(1.06) contrast(1.1) saturate(1.18);}
@media(max-width:960px){ .rb-about-card{grid-template-columns:1fr; gap:26px;} }
@media(max-width:700px){ .rb-about-card{padding:26px 22px;} .rb-about-visual{margin:-16px 0 0 12px; max-width:calc(100% - 12px);} }

/* EXPERIENCE — left-aligned timeline */
.rb-exp-head{display:flex; align-items:flex-end; justify-content:space-between; gap:24px;}
.rb-exp-sticky{display:flex; align-items:flex-start; gap:8px; background:var(--mint); border:1.6px solid var(--ink); border-radius:14px; padding:13px 18px; box-shadow:4px 4px 0 var(--ink); transform:rotate(4deg); font-family:var(--f-hand); font-weight:700; font-size:15.5px; line-height:1.25; max-width:180px; color:var(--ink-on-accent);}
@media(max-width:760px){ .rb-exp-sticky{display:none;} }
.rb-exp-list{position:relative; display:flex; flex-direction:column; gap:32px; margin-top:34px; padding-left:34px; max-width:820px;}
.rb-exp-line{position:absolute; left:8px; top:12px; bottom:12px; width:0; border-left:2.5px dashed var(--ink-faint); transform-origin:top;}
.rb-exp-item{position:relative;}
.rb-exp-dot{position:absolute; left:-34px; top:16px; width:18px; height:18px; border-radius:50%; border:2.2px solid var(--ink); z-index:2;}
.rb-exp-year-pill{position:relative; z-index:2; display:inline-flex; font-family:var(--f-body); font-weight:800; font-size:12px; letter-spacing:.04em; text-transform:uppercase; padding:7px 16px; border-radius:999px; border:1.6px solid var(--ink); color:var(--ink-on-accent); transform:rotate(-2deg); margin:0 0 -14px 6px; box-shadow:3px 3px 0 var(--ink);}
.rb-exp-card{background:var(--card); border:1.6px solid var(--ink); border-radius:var(--radius-md); padding:26px 26px 22px; display:flex; gap:18px; transition:transform .25s var(--ease); position:relative; z-index:1;}
.rb-exp-card:hover{transform:translate(-2px,-3px);}
.rb-exp-icon{width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--ink-on-accent); border:1.4px solid var(--ink);}
.rb-exp-body{flex:1; min-width:0;}
.rb-exp-title{font-family:var(--f-display); font-weight:400; font-size:19px; text-transform:uppercase;}
.rb-exp-org{font-size:13px; color:var(--ink-dim); margin-top:3px;}
ul.rb-exp-bullets{margin-top:10px; display:flex; flex-direction:column; gap:7px;}
.rb-exp-bullets li{font-size:13px; color:var(--ink-dim); display:flex; gap:9px; align-items:flex-start; line-height:1.5;}
@media(max-width:600px){ .rb-exp-card{padding:22px 18px 18px; gap:14px;} .rb-exp-icon{width:40px; height:40px;} }

/* SKILLS — grouped skill cards */
.rb-skills-grid{display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-top:32px;}
.rb-skill-group{position:relative; min-height:184px; padding:21px 22px 20px; border:1.8px solid var(--ink); border-radius:15px 15px 12px 13px; background:var(--card); box-shadow:5px 6px 0 var(--ink); overflow:hidden; transition:transform .24s var(--ease), box-shadow .24s var(--ease);}
.rb-skill-group:hover{transform:translate(-2px,-3px) rotate(-.3deg); box-shadow:8px 9px 0 var(--ink);}
.rb-skill-group.wide{grid-column:span 2;}
.rb-skill-group-index{position:absolute; top:14px; left:18px; font-family:var(--f-body); font-size:10px; font-weight:800; color:var(--ink-dim);}
.rb-skill-group-head{display:flex; align-items:center; gap:13px; margin:10px 0 17px;}
.rb-skill-group-icon{width:58px; height:58px; display:grid; place-items:center; border-radius:50%; color:var(--ink-on-accent); flex:none;}
.rb-skill-group-title{font-family:var(--f-display); font-weight:400; font-size:clamp(20px,2vw,28px); line-height:.98; text-transform:uppercase;}
.rb-skill-group-strokes{position:absolute; right:19px; top:43px; width:20px; height:20px; opacity:.8; transform:rotate(-18deg);}
.rb-skill-group-strokes::before,.rb-skill-group-strokes::after{content:''; position:absolute; right:0; width:17px; height:4px; border-radius:999px; background:var(--group-accent);}
.rb-skill-group-strokes::before{top:4px;} .rb-skill-group-strokes::after{top:12px; right:4px;}
.rb-skill-chips{display:flex; flex-wrap:wrap; gap:9px;}
.rb-skill-chip{display:inline-flex; align-items:center; min-height:31px; padding:5px 11px; border:1.4px solid var(--ink); border-radius:7px; background:var(--warm); box-shadow:2px 2px 0 rgba(var(--ink-rgb),.12); font-family:var(--f-body); font-size:12px; font-weight:700; color:var(--ink);}
.rb-skill-chip.accent{background:var(--yellow-soft); color:var(--ink-on-accent);}
/* re-declared on button.* so they beat the .rb-root button reset */
button.rb-skill-chip{gap:6px; cursor:pointer; background:var(--warm); color:var(--ink); border:1.4px solid var(--ink); font-family:var(--f-body); font-size:12px; font-weight:700; transition:transform .18s var(--ease), box-shadow .18s var(--ease), background-color .18s var(--ease);}
button.rb-skill-chip.accent{background:var(--yellow-soft); color:var(--ink-on-accent);}
button.rb-skill-chip:hover{transform:translate(-1px,-2px); box-shadow:3px 3px 0 var(--ink);}
button.rb-skill-chip.on{background:var(--ink); color:var(--paper); box-shadow:3px 3px 0 var(--group-accent);}
button.rb-skill-chip:focus-visible{outline:2px solid var(--violet); outline-offset:2px;}
.rb-skill-dot{display:inline-block; width:7px; height:7px; border-radius:50%; background:var(--violet); border:1px solid var(--ink); flex:none;}
button.rb-skill-chip.on .rb-skill-dot{background:var(--group-accent);}
.rb-skills-hint{display:flex; align-items:center; gap:8px; margin:14px 0 0; font-family:var(--f-hand); font-weight:700; font-size:19px; color:var(--ink-dim);}
.rb-skill-used{overflow:hidden;}
.rb-skill-used-inner{margin-top:14px; padding:12px 13px; border:1.6px dashed var(--ink); border-radius:12px; background:var(--warm);}
.rb-skill-used-label{display:block; margin-bottom:9px; font-family:var(--f-body); font-weight:800; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-dim);}
.rb-skill-used-list{display:flex; flex-wrap:wrap; gap:8px;}
.rb-skill-used-list button{display:inline-flex; align-items:center; gap:4px; padding:6px 12px; border:1.6px solid var(--ink); border-radius:999px; background:var(--p-accent); color:var(--ink-on-accent); font-family:var(--f-body); font-weight:800; font-size:12px; box-shadow:2px 2px 0 var(--ink); transition:translate .18s var(--ease), box-shadow .18s var(--ease);}
.rb-skill-used-list button:hover{translate:-1px -2px; box-shadow:4px 4px 0 var(--ink);}
.rb-skills-mantra-cell{display:flex; align-items:center; justify-content:center; min-height:184px;}
.rb-skills-mantra{display:flex; align-items:center; justify-content:center; width:150px; height:100px; border:2px solid var(--ink); border-radius:50%; background:var(--card); box-shadow:4px 4px 0 var(--ink); font-family:var(--f-hand); font-weight:700; font-size:20px; line-height:1.02; text-align:center; transform:rotate(-7deg);}
@media(max-width:900px){ .rb-skills-grid{grid-template-columns:repeat(2,minmax(0,1fr));} .rb-skill-group.wide,.rb-skills-mantra-cell{grid-column:1/-1;} }
@media(max-width:600px){ .rb-skills-grid{grid-template-columns:1fr; gap:14px;} .rb-skill-group{min-height:148px; padding:16px 17px;} .rb-skill-group-head{margin:8px 0 13px; gap:11px;} .rb-skill-group-icon{width:48px; height:48px;} .rb-skill-group-title{font-size:23px;} .rb-skill-group-strokes{right:16px; top:33px;} .rb-skill-chip{min-height:28px; padding:4px 9px; font-size:11px;} .rb-skills-mantra-cell{min-height:110px;} }

/* PROJECT CARDS — shelf gallery (pinned horizontal drag on desktop, stacked on mobile) */
.rb-work{position:relative;}
.rb-work-pin{
  height:calc(100vh - ${NAV_CLEARANCE}px); display:flex; flex-direction:column; overflow:hidden; padding-top:10px; z-index:50;
}
.rb-work-pin > .rb-wrap{width:100%;}
.rb-work-pin .rb-display-xl{font-size:clamp(30px, min(9vw, 7.4vh), 78px);}
.rb-work-hint{margin:14px 0 18px; font-family:var(--f-body); font-weight:600; font-size:12.5px; letter-spacing:.03em; text-transform:uppercase; color:var(--ink-faint); display:flex; align-items:center; gap:8px;}
.rb-work-hint-desktop{color:var(--ink-dim);}
@media(max-width:860px){ .rb-work-hint-desktop{display:none;} }

.rb-work-shelf{flex:1; min-height:0; display:flex; align-items:center; overflow:hidden;}
.rb-proj-track{display:flex; align-items:stretch; gap:28px; padding:6px 14px 14px max(36px, calc((100% - 1240px) / 2 + 36px)); will-change:transform;}

.rb-proj-card-wrap{flex:0 0 auto; width:min(80vw,470px); display:flex;}
.rb-proj-card{--proj-accent:var(--yellow); flex:1; display:flex; flex-direction:column; background:var(--card); border:2px solid var(--ink); border-radius:var(--radius-lg); box-shadow:6px 6px 0 var(--ink); overflow:hidden; transition:transform .28s var(--ease), box-shadow .28s var(--ease);}
.rb-proj-card:hover{transform:translate(-3px,-4px) rotate(-.4deg); box-shadow:10px 11px 0 var(--ink);}

.rb-proj-top{display:flex; align-items:center; gap:10px; padding:13px 18px; background:var(--proj-accent); border-bottom:2px solid var(--ink); color:var(--ink-on-accent);}
.rb-proj-num{width:38px; height:38px; display:grid; place-items:center; flex-shrink:0; border-radius:50%; border:1.6px solid var(--ink-on-accent); background:rgba(255,255,255,.72); font-family:var(--f-display); font-size:16px; line-height:1;}
.rb-proj-badge{font-family:var(--f-hand); font-weight:700; font-size:16px; line-height:1; padding:5px 12px; border:1.6px solid var(--ink-on-accent); border-radius:999px; background:rgba(255,255,255,.55); transform:rotate(-3deg);}
.rb-proj-year{margin-left:auto; font-family:var(--f-body); font-weight:800; font-size:12px; letter-spacing:.06em;}

.rb-proj-main{flex:1; padding:18px 20px 0;}
.rb-proj-kicker{margin:0; font-family:var(--f-body); font-weight:700; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint);}
.rb-proj-title{margin:6px 0 8px; font-family:var(--f-display); font-weight:400; text-transform:uppercase; font-size:clamp(24px,2.4vw,30px); line-height:.98;}
.rb-proj-desc{margin:0 0 14px; font-size:13.5px; line-height:1.55; color:var(--ink-dim);}
.rb-proj-points{display:flex; flex-direction:column; gap:8px;}
.rb-proj-points li{display:flex; gap:9px; align-items:flex-start; font-size:12.5px; line-height:1.45; color:var(--ink-dim);}

.rb-proj-foot{display:flex; align-items:flex-end; justify-content:space-between; gap:12px; margin-top:16px; padding:14px 20px 18px; border-top:1.6px dashed var(--line);}
.rb-proj-stack{display:flex; flex-wrap:wrap; gap:6px; min-width:0;}
.rb-proj-stack span{padding:4px 10px; border:1.4px solid var(--ink); border-radius:999px; background:var(--warm); font-family:var(--f-body); font-weight:700; font-size:10.5px;}
.rb-proj-link{flex-shrink:0; display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:999px; background:var(--ink); color:var(--paper) !important; font-family:var(--f-body); font-weight:800; font-size:12px; box-shadow:0 3px 0 rgba(var(--ink-rgb),.2); transition:transform .2s var(--ease), box-shadow .2s var(--ease);}
.rb-proj-link:hover{transform:translateY(-2px); box-shadow:0 5px 0 var(--ink);}
.rb-proj-private{flex-shrink:0; display:inline-flex; align-items:center; gap:5px; padding:7px 12px; border:1.4px dashed var(--ink-faint); border-radius:999px; font-family:var(--f-body); font-weight:700; font-size:11px; color:var(--ink-dim); white-space:nowrap;}
.rb-work-progress{display:flex; align-items:center; gap:12px; margin-left:auto; font-family:var(--f-display); font-size:15px; letter-spacing:.04em; color:var(--ink);}
.rb-work-progress-bar{position:relative; width:120px; height:10px; border:1.6px solid var(--ink); border-radius:999px; background:var(--card); overflow:hidden;}
.rb-work-progress-bar span{position:absolute; inset:0; background:var(--yellow); transform-origin:0 50%; border-right:1.6px solid var(--ink);}
@media(max-width:760px){ .rb-work-progress{display:none;} }

@media(max-width:760px){
  .rb-work{height:auto !important;}
  .rb-work-pin{position:static !important; height:auto; overflow:visible; padding-top:0; border:none; box-shadow:none; background:transparent; border-radius:0;}
  .rb-work-pin .rb-display-xl{font-size:clamp(30px,9vw,42px);}
  .rb-work-shelf{overflow:visible;}
  .rb-proj-track{flex-direction:column; gap:24px; padding:4px 18px 0; transform:none !important;}
  .rb-proj-card-wrap{width:100%;}
}

/* LET'S TALK */
.rb-talk{padding:80px 0 48px;}
.rb-talk-grid{display:grid; grid-template-columns:minmax(0,1fr) minmax(320px,440px); gap:56px; align-items:center;}
.rb-talk-status{display:inline-flex; align-items:center; gap:9px; padding:7px 14px 7px 12px; border:1.6px solid var(--ink); border-radius:999px; background:var(--mint); color:var(--ink-on-accent); font-family:var(--f-body); font-weight:800; font-size:12px; letter-spacing:.04em; text-transform:uppercase; box-shadow:3px 3px 0 var(--ink); transform:rotate(-1.5deg);}
.rb-talk-status .pulse{position:relative; width:9px; height:9px; border-radius:50%; background:var(--green); flex-shrink:0;}
.rb-talk-status .pulse::after{content:''; position:absolute; inset:0; border-radius:50%; background:var(--green); animation:rb-pulse 1.8s var(--ease) infinite;}
@keyframes rb-pulse{0%{transform:scale(1); opacity:.6;} 100%{transform:scale(2.6); opacity:0;}}
.rb-talk-heading{position:relative; display:inline-block; margin-top:22px;}
.rb-talk-heading h2{position:relative; z-index:1; margin:0; font-size:clamp(56px,10vw,132px); line-height:.9;}
.rb-float-sparkle{position:absolute; color:var(--ink); opacity:.7; pointer-events:none;}
.rb-talk-sparkle.s1{top:-16px; left:-34px;}
.rb-talk-sparkle.s2{bottom:-4px; right:-30px;}
.rb-talk-sparkle.s3{top:28%; right:-52px;}
.rb-talk-blurb{margin:18px 0 0; max-width:46ch; font-size:16px; line-height:1.7; color:var(--ink-dim);}
ul.rb-talk-contacts{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:28px;}
ul.rb-talk-contacts > li:first-child{grid-column:1/-1;}
.rb-talk-contact{display:flex; align-items:center; gap:12px; height:100%; padding:13px 14px; border:1.6px solid var(--ink); border-radius:14px; background:var(--card); color:var(--ink); box-shadow:3px 3px 0 var(--ink); transition:transform .22s var(--ease), box-shadow .22s var(--ease);}
a.rb-talk-contact:hover, a.rb-talk-contact:focus-visible{transform:translate(-2px,-2px); box-shadow:5px 5px 0 var(--ink); outline:none;}
.rb-talk-contact .ico{width:38px; height:38px; flex-shrink:0; display:grid; place-items:center; border-radius:11px; border:1.4px solid var(--ink); color:var(--ink-on-accent);}
.rb-talk-contact .txt{min-width:0; display:flex; flex-direction:column; gap:1px;}
.rb-talk-contact small{font-family:var(--f-body); font-weight:700; font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-faint);}
.rb-talk-contact strong{font-family:var(--f-body); font-weight:700; font-size:13.5px; line-height:1.3; overflow-wrap:break-word;}
.rb-talk-contact .go{margin-left:auto; flex-shrink:0; color:var(--ink-faint); transition:transform .2s var(--ease), color .2s var(--ease);}
a.rb-talk-contact:hover .go, a.rb-talk-contact:focus-visible .go{transform:translate(2px,-2px); color:var(--ink);}
.rb-talk-help{display:flex; align-items:center; flex-wrap:wrap; gap:10px 14px; margin-top:26px;}
.rb-talk-help .chips{display:flex; flex-wrap:wrap; gap:8px;}
.rb-talk-help .chips span{padding:6px 13px; border:1.4px solid var(--ink); border-radius:999px; background:var(--yellow-soft); color:var(--ink-on-accent); font-family:var(--f-body); font-weight:700; font-size:12px;}
@media(max-width:1060px){ .rb-talk-grid{grid-template-columns:minmax(0,1fr) minmax(300px,400px); gap:36px;} }
@media(max-width:600px){ .rb-talk-sparkle{display:none;} }
@media(max-width:520px){ ul.rb-talk-contacts{grid-template-columns:1fr;} }

/* ENQUIRY CARD */
.rb-enquiry-card{width:100%; max-width:440px; justify-self:end; background:var(--card); border:1.6px solid var(--ink); border-radius:var(--radius-lg); padding:28px; box-shadow:6px 6px 0 var(--ink);}
.rb-enquiry-card h3{font-family:var(--f-display); font-weight:400; text-transform:uppercase; font-size:clamp(20px,2.6vw,26px); margin:6px 0 16px;}
.rb-enquiry-form{display:flex; flex-direction:column; gap:12px;}
.rb-input{width:100%; font:inherit; font-family:var(--f-body); font-size:14px; padding:12px 14px; border:1.6px solid var(--ink); border-radius:var(--radius-sm); background:var(--paper); color:var(--ink); transition:box-shadow .2s var(--ease);}
.rb-input::placeholder{color:var(--ink-faint);}
.rb-input:focus{outline:none; box-shadow:3px 3px 0 var(--ink);}
.rb-textarea{resize:vertical; min-height:84px; font-family:var(--f-body);}
.rb-btn-full{width:100%; margin-top:4px;}
.rb-enquiry-status{font-family:var(--f-body); font-size:12.5px; color:var(--ink-dim); margin-top:10px; line-height:1.4;}
.rb-enquiry-status.ok, .rb-enquiry-status.err{display:flex; align-items:flex-start; gap:7px; padding:10px 12px; border:1.6px solid var(--ink); border-radius:10px; font-weight:700; color:var(--ink-on-accent);}
.rb-enquiry-status.ok{background:var(--mint);}
.rb-enquiry-status.err{background:var(--pink);}
.rb-enquiry-status.err a{text-decoration:underline;}
@media(max-width:860px){ .rb-talk-grid{grid-template-columns:1fr; gap:40px;} .rb-enquiry-card{max-width:none; justify-self:stretch;} }

/* CONTACT */
.rb-contact{padding:0;}

.rb-footer-bar{border-top:1px solid var(--line); margin-top:40px; padding:20px 0;}
.rb-footer-bar .rb-wrap{display:flex; justify-content:space-between; align-items:center; font-family:var(--f-body); font-weight:600; font-size:11.5px; letter-spacing:.03em; text-transform:uppercase; color:var(--ink-faint); flex-wrap:wrap; gap:12px;}
.rb-back-top{border:1.6px solid var(--ink); padding:8px 16px; border-radius:999px; color:var(--ink); font-weight:600; transition:background-color .2s var(--ease), transform .2s var(--ease), box-shadow .2s var(--ease);}
.rb-back-top:hover{background:var(--yellow); color:var(--ink-on-accent); transform:translateY(-2px); box-shadow:0 4px 0 var(--ink);}

@media (prefers-reduced-motion: reduce){ .rb-root *{animation-duration:.001ms !important; transition-duration:.001ms !important;} }
`;

/* =========================================================================
   DOODLES
   ========================================================================= */
/** A small floating/bobbing decorative sparkle. */
function FloatSparkle({ className, size = 16, delay = 0, duration = 3.6 }) {
    const reduceMotion = useReducedMotion();
    return (
        <motion.span
            className={`rb-float-sparkle ${className || ""}`}
            animate={reduceMotion ? {} : { y: [0, -9, 0], rotate: [0, 14, 0], opacity: [0.6, 1, 0.6] }}
            transition={reduceMotion ? {} : { duration, delay, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
        >
            <Sparkles size={size} />
        </motion.span>
    );
}

/* =========================================================================
   NAV
   ========================================================================= */
function scrollToSection(href, reduceMotion, { push = true } = {}) {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    scrollToId(el, { offset: -NAV_CLEARANCE, immediate: reduceMotion });
    if (push && history.pushState) history.pushState(null, "", href);
    el.classList.remove("rb-section-flash");
    if (reduceMotion) return;
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    el.classList.add("rb-section-flash");
                    setTimeout(() => el.classList.remove("rb-section-flash"), 900);
                    io.disconnect();
                }
            });
        },
        { threshold: 0.35 }
    );
    io.observe(el);
}

const THEME_KEY = "rb-theme";
function getInitialTheme() {
    try {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === "light" || stored === "dark") return stored;
    } catch { /* localStorage unavailable (private mode, etc) */ }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Curtain timeline: panels close → hold (BS badge pops in, theme swaps while the screen is covered) → panels open.
const CURTAIN_CLOSE_MS = 420;
const CURTAIN_HOLD_MS = 620;
const CURTAIN_OPEN_MS = 440;
const CURTAIN_EASE = [0.76, 0, 0.24, 1];

function ThemeCurtain({ phase, target }) {
    const active = phase !== "idle";
    const closed = phase === "closing" || phase === "hold";
    const panelTransition = { duration: (closed ? CURTAIN_CLOSE_MS : CURTAIN_OPEN_MS) / 1000, ease: CURTAIN_EASE };
    return (
        <div className={`rb-theme-curtain${active ? " is-active" : ""}`} aria-hidden="true">
            <motion.span className="rb-theme-curtain-panel left" initial={false} animate={{ x: closed ? 0 : "-101%" }} transition={panelTransition} />
            <motion.span className="rb-theme-curtain-panel right" initial={false} animate={{ x: closed ? 0 : "101%" }} transition={panelTransition} />
            <AnimatePresence>
                {phase === "hold" && (
                    <motion.div
                        key="mark"
                        className="rb-theme-curtain-center"
                        initial={{ scale: 0.2, rotate: -140, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 16 } }}
                        exit={{ scale: 0.55, opacity: 0, transition: { duration: 0.18, ease: "easeIn" } }}
                    >
                        <span className="rb-theme-curtain-badge">
                            <span className="rb-theme-curtain-ring" />
                            BS
                        </span>
                        <motion.span
                            className="rb-theme-curtain-caption"
                            initial={{ y: 14, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, transition: { delay: 0.14, duration: 0.3, ease: [0.16, 0.84, 0.44, 1] } }}
                        >
                            {target === "dark" ? <Moon size={14} /> : <Sun size={14} />}
                            {target === "dark" ? "Dark mode" : "Light mode"}
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Nav({ path }) {
    const navRef = useRef(null);
    const [navHeight, setNavHeight] = useState(0);
    const [navBottom, setNavBottom] = useState(94);
    const [theme, setTheme] = useState(getInitialTheme);
    const [curtainPhase, setCurtainPhase] = useState("idle"); // idle | closing | hold | opening
    const [curtainTarget, setCurtainTarget] = useState(null);
    const curtainTimers = useRef([]);
    useEffect(() => () => curtainTimers.current.forEach((t) => window.clearTimeout(t)), []);
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
    }, [theme]);
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const [ripple, setRipple] = useState(null); // { href, key }
    const active = useActiveSection(NAV_LINKS.map(([h]) => h), path);
    const magnetic = useMagnetic(0.3);
    const reduceMotion = useReducedMotion();
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        document.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => document.removeEventListener("scroll", onScroll);
    }, []);
    useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

    // Nav is position:fixed so it stays pinned at the top across every section;
    // this reserves its real height in normal flow so content below doesn't jump.
    useEffect(() => {
        function measure() {
            if (navRef.current) {
                setNavHeight(navRef.current.offsetHeight);
                setNavBottom(navRef.current.getBoundingClientRect().bottom);
            }
        }
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [scrolled, open]);

    function handleTabClick(e, href) {
        e.preventDefault();
        setRipple({ href, key: Date.now() });
        // Off the homepage, go home first; Home scrolls to the hash once its sections exist.
        if (path !== "/") navigate(`/${href}`);
        else scrollToSection(href, reduceMotion);
    }

    // The command menu asks for a theme switch via a window event.
    const toggleRef = useRef(null);
    toggleRef.current = toggleTheme;
    useEffect(() => {
        const onToggle = () => toggleRef.current();
        window.addEventListener("rb:toggle-theme", onToggle);
        return () => window.removeEventListener("rb:toggle-theme", onToggle);
    }, []);

    function toggleTheme() {
        if (curtainPhase !== "idle") return;
        const next = theme === "dark" ? "light" : "dark";
        if (reduceMotion) {
            setTheme(next);
            return;
        }
        const at = (ms, fn) => curtainTimers.current.push(window.setTimeout(fn, ms));
        setCurtainTarget(next);
        setCurtainPhase("closing");
        at(CURTAIN_CLOSE_MS, () => setCurtainPhase("hold"));
        at(CURTAIN_CLOSE_MS + CURTAIN_HOLD_MS / 2, () => setTheme(next));
        at(CURTAIN_CLOSE_MS + CURTAIN_HOLD_MS, () => setCurtainPhase("opening"));
        at(CURTAIN_CLOSE_MS + CURTAIN_HOLD_MS + CURTAIN_OPEN_MS, () => {
            setCurtainPhase("idle");
            curtainTimers.current = [];
        });
    }

    return (
        <>
            <ThemeCurtain phase={curtainPhase} target={curtainTarget} />
            <div className="rb-nav-spacer" style={{ height: navHeight || undefined }} aria-hidden="true" />
            <motion.nav
                ref={navRef}
                className={`rb-nav${scrolled ? " scrolled" : ""}`}
                initial={reduceMotion ? false : { y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
            >
                <div className="rb-wrap rb-nav-row">
                    <a href="#top" className="rb-brand" onClick={(e) => handleTabClick(e, "#top")}>
                        <span className="rb-brand-mark" aria-hidden="true">BS</span>
                        <span className="rb-brand-text">Bhavani Sai</span>
                    </a>
                    <div className="rb-nav-tabs" onMouseLeave={() => setHovered(null)}>
                        {NAV_LINKS.map(([h, l]) => {
                            const isActive = active === h.slice(1);
                            const pillHref = hovered || (active ? `#${active}` : null);
                            const showPill = pillHref === h;
                            return (
                                <a
                                    key={h}
                                    href={h}
                                    className={[isActive && "active", showPill && "has-pill"].filter(Boolean).join(" ") || undefined}
                                    aria-current={isActive ? "page" : undefined}
                                    onMouseEnter={() => setHovered(h)}
                                    onFocus={() => setHovered(h)}
                                    onClick={(e) => handleTabClick(e, h)}
                                >
                                    {showPill && (reduceMotion ? (
                                        <span className="rb-nav-pill" />
                                    ) : (
                                        <motion.span
                                            layoutId="rb-nav-pill"
                                            className="rb-nav-pill"
                                            transition={{ type: "spring", visualDuration: 0.35, bounce: 0.2 }}
                                        />
                                    ))}
                                    {ripple && ripple.href === h && (
                                        <motion.span
                                            key={ripple.key}
                                            className="rb-nav-ripple"
                                            initial={{ scale: 0, opacity: 0.55 }}
                                            animate={{ scale: 2.6, opacity: 0 }}
                                            transition={{ duration: 0.55, ease: "easeOut" }}
                                            onAnimationComplete={() => setRipple((r) => (r && r.key === ripple.key ? null : r))}
                                        />
                                    )}
                                    <span className="rb-nav-tab-label">{l}</span>
                                </a>
                            );
                        })}
                    </div>
                    <div className="rb-nav-right">
                        <span className="rb-nav-dot" style={{ background: "var(--pink)" }} aria-hidden="true" />
                        <span className="rb-nav-dot" style={{ background: "var(--mint)" }} aria-hidden="true" />
                        <span className="rb-nav-dot" style={{ background: "var(--blue)" }} aria-hidden="true" />
                        <CommandHint />
                        <motion.a
                            ref={magnetic.ref}
                            style={magnetic.style}
                            href={PROFILE.resume}
                            download="Bhavani_Sai_Resume.pdf"
                            className="rb-nav-cta"
                            whileTap={{ scale: 0.94 }}
                            aria-label="Download resume"
                        >
                            <FileDown size={14} /> Resume
                        </motion.a>
                    </div>
                    <motion.button
                        className="rb-theme-toggle"
                        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                        aria-busy={curtainPhase !== "idle"}
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.85 }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {theme === "dark" ? (
                                <motion.span
                                    key="sun"
                                    initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
                                    transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
                                    style={{ display: "flex" }}
                                >
                                    <Sun size={16} />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="moon"
                                    initial={{ rotate: 90, opacity: 0, scale: 0.4 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: -90, opacity: 0, scale: 0.4 }}
                                    transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
                                    style={{ display: "flex" }}
                                >
                                    <Moon size={16} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                    <button className="rb-menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>
            <div className="rb-nav-social-rail" aria-label="Social links" style={{ top: navBottom + 13 }}>
                <a className="rb-nav-social-link" href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={16} /><span className="rb-social-tip" role="tooltip">GitHub</span></a>
                <a className="rb-nav-social-link" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={16} /><span className="rb-social-tip" role="tooltip">LinkedIn</span></a>
                <a className="rb-nav-social-link" href={`mailto:${PROFILE.email}`} aria-label={`Email ${PROFILE.email}`}><Mail size={16} /><span className="rb-social-tip" role="tooltip">{PROFILE.email}</span></a>
            </div>
            <div className={`rb-mobile-panel${open ? " open" : ""}`}>
                {NAV_LINKS.map(([h, l], i) => (
                    <motion.a
                        key={h}
                        href={h}
                        className={active === h.slice(1) ? "active" : undefined}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            setOpen(false);
                            handleTabClick(e, h);
                        }}
                        initial={false}
                        animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                        transition={{ duration: 0.3, delay: open ? i * 0.05 : 0, ease: [0.16, 0.84, 0.44, 1] }}
                    >
                        {l}
                    </motion.a>
                ))}
            </div>
        </>
    );
}

/* =========================================================================
   HERO
   ========================================================================= */
/* Hero intro timeline (s): first-name letters bounce in one by one → underline draws → last name stamps down →
   sparkles pop → the rest of the hero follows. Each item's `custom` is its start delay, so nothing competes with the name. */
const HERO_EASE = [0.16, 0.84, 0.44, 1];
const HERO_AFTER_NAME = 1.1;
const heroIntroVariants = { hidden: {}, show: {} };
const heroItemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: HERO_EASE } }),
};
const heroLetterVariants = {
    hidden: (i) => ({ opacity: 0, y: 90, rotate: i % 2 ? 26 : -26, scale: 0.35 }),
    show: (i) => ({ opacity: 1, y: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 480, damping: 15, mass: 0.9, delay: 0.12 + i * 0.07 } }),
};
const heroUnderlineVariants = {
    hidden: { opacity: 0, scaleX: 0 },
    show: { opacity: 1, scaleX: 1, transition: { delay: 0.7, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] } },
};
const heroLastNameVariants = {
    hidden: { opacity: 0, scale: 2.3, rotate: -12, y: -14 },
    show: { opacity: 1, scale: 1, rotate: 0, y: 0, transition: { type: "spring", stiffness: 340, damping: 14, delay: 0.78 } },
};
const heroSparkVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -120 },
    show: (delay) => ({ opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 420, damping: 11, delay } }),
};
const heroArtVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 24 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: HERO_EASE } },
};
const letterHover = (i) => ({ y: -14, rotate: i % 2 ? 8 : -8, transition: { type: "spring", stiffness: 500, damping: 12 } });

const BURST_COLORS = ["var(--yellow)", "var(--pink)", "var(--mint)", "var(--blue)", "var(--violet)"];
const BURST = Array.from({ length: 12 }, (_, i) => {
    // fan out mostly up-and-right, in the direction the arrow launches
    const angle = (-150 + i * (210 / 11)) * (Math.PI / 180);
    const dist = 38 + (i % 3) * 14;
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, color: BURST_COLORS[i % BURST_COLORS.length], spark: i % 4 === 0 };
});
const LAUNCH_SCROLL_DELAY = 450;

/** Hero CTA: on tap the pill squashes, the arrow launches out of its circle, confetti bursts, then the page scrolls to Projects. */
function WorkButton({ magnetic, reduceMotion }) {
    const [launch, setLaunch] = useState(0);
    const timer = useRef(null);
    useEffect(() => () => window.clearTimeout(timer.current), []);

    function handleClick(e) {
        e.preventDefault();
        if (reduceMotion) {
            scrollToSection("#work", true);
            return;
        }
        setLaunch((n) => n + 1);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => scrollToSection("#work", false), LAUNCH_SCROLL_DELAY);
    }

    const played = launch > 0;
    return (
        <motion.a
            ref={magnetic.ref}
            style={magnetic.style}
            href="#work"
            className="rb-hero-btn-solid"
            onClick={handleClick}
            whileTap={{ scale: 0.94 }}
        >
            <motion.span
                key={`label-${launch}`}
                className="rb-hero-btn-label"
                initial={false}
                animate={played ? { scale: [1, 0.9, 1.06, 1], x: [0, -2, 1, 0] } : undefined}
                transition={{ duration: 0.45, ease: "easeOut" }}
            >
                View My Work
            </motion.span>
            <motion.span
                key={`ico-${launch}`}
                className="ico"
                initial={false}
                animate={played ? { scale: [1, 1.28, 0.92, 1], rotate: [0, -14, 6, 0] } : undefined}
                transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
            >
                {played && (
                    <motion.span
                        className="rb-hero-btn-flash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 0.6, times: [0, 0.15, 0.6, 1] }}
                        aria-hidden="true"
                    />
                )}
                <motion.span
                    className="rb-hero-btn-arrow"
                    initial={false}
                    animate={played ? { x: [0, 18, -18, 0], y: [0, -18, 18, 0], opacity: [1, 0, 0, 1] } : undefined}
                    transition={{ duration: 0.55, times: [0, 0.38, 0.4, 1], ease: "easeOut" }}
                >
                    <ArrowUpRight size={15} />
                </motion.span>
                {played && BURST.map((p, i) => (
                    <motion.span
                        key={`${launch}-${i}`}
                        className={`rb-hero-burst${p.spark ? " spark" : ""}`}
                        style={{ color: p.color, background: p.spark ? "transparent" : p.color }}
                        initial={{ x: 0, y: 0, scale: 0.3, opacity: 1 }}
                        animate={{ x: p.x, y: p.y, scale: [0.3, 1.15, 0], opacity: [1, 1, 0], rotate: p.spark ? 90 : 0 }}
                        transition={{ duration: 0.65, ease: [0.16, 0.84, 0.44, 1] }}
                        aria-hidden="true"
                    >
                        {p.spark && "✦"}
                    </motion.span>
                ))}
            </motion.span>
        </motion.a>
    );
}

function Hero() {
    const reduceMotion = useReducedMotion();
    const magnetic = useMagnetic(0.3);
    const [firstName, lastName] = PROFILE.name.split(" ");
    // Hold the intro until the headline font is in, so the letters animate in Poppins rather than the fallback font.
    const fontReady = useFontReady("800 1em Poppins", PROFILE.name);
    const intro = reduceMotion || fontReady ? "show" : "hidden";
    return (
        <header className="rb-hero" id="top">
            <div className="rb-wrap rb-hero-layout">
                <motion.div
                    className="rb-hero-left"
                    variants={heroIntroVariants}
                    initial={reduceMotion ? false : "hidden"}
                    animate={intro}
                >
                    <motion.div variants={heroItemVariants} custom={0} className="rb-hero-tag">{PROFILE.role}</motion.div>
                    <motion.h1 variants={reduceMotion ? heroItemVariants : heroIntroVariants} custom={0.1} className="rb-hero-headline">
                        <span className="rb-sr-only">{PROFILE.name}</span>
                        <span className="l1" aria-hidden="true">
                            <span className="rb-hero-name">
                                {firstName.split("").map((ch, i) => (
                                    <motion.span
                                        key={i}
                                        className="rb-hero-letter"
                                        custom={i}
                                        variants={reduceMotion ? undefined : heroLetterVariants}
                                        whileHover={reduceMotion ? undefined : letterHover(i)}
                                    >
                                        {ch}
                                    </motion.span>
                                ))}
                            </span>
                            <motion.span className="rb-hero-name-underline" variants={reduceMotion ? undefined : heroUnderlineVariants} style={{ rotate: -1.2 }} />
                        </span>
                        <span className="rb-hero-l2" aria-hidden="true">
                            <motion.span
                                className="l2"
                                variants={reduceMotion ? undefined : heroLastNameVariants}
                                whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: -3, transition: { type: "spring", stiffness: 420, damping: 12 } }}
                            >
                                {lastName}
                            </motion.span>
                            <motion.span className="rb-hero-spark s1" custom={1.02} variants={reduceMotion ? undefined : heroSparkVariants}><span>✦</span></motion.span>
                            <motion.span className="rb-hero-spark s2" custom={1.16} variants={reduceMotion ? undefined : heroSparkVariants}><span>✦</span></motion.span>
                        </span>
                    </motion.h1>

                    <motion.div variants={heroItemVariants} custom={HERO_AFTER_NAME} className="rb-hero-note">
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                            <path d="M5 10c0 14 10 18 28 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M27 21l6 5-7 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Turn ideas into real products</span>
                    </motion.div>

                    <motion.p variants={heroItemVariants} custom={HERO_AFTER_NAME + 0.05} className="rb-hero-desc">{HERO_TAGLINE}</motion.p>

                    <motion.div variants={heroItemVariants} custom={HERO_AFTER_NAME + 0.15} className="rb-hero-ctarow">
                        <WorkButton magnetic={magnetic} reduceMotion={reduceMotion} />
                    </motion.div>

                    <motion.div variants={heroItemVariants} custom={HERO_AFTER_NAME + 0.25} className="rb-hero-stats">
                        {HERO_STATS.map(({ value, title, sub }, i) => (
                            <React.Fragment key={title + sub}>
                                {i > 0 && <div className="rb-hero-stat-div" />}
                                <div className="rb-hero-stat">
                                    {value && <CountUp value={value} delay={HERO_AFTER_NAME + 0.3} className="rb-hero-stat-num" />}
                                    <span className="rb-hero-stat-text">{title}<span>{sub}</span></span>
                                </div>
                            </React.Fragment>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div
                    className="rb-hero-art"
                    variants={heroArtVariants}
                    initial={reduceMotion ? false : "hidden"}
                    animate={intro}
                >
                    <picture>
                        <img
                            src="/hero-illustration-icons.png"
                            alt="Full Stack Development, Web Development and React Native Apps badges above an illustration of a desk with a laptop, potted plant, desk lamp, coffee mug and a stack of books"
                            loading="eager"
                            fetchpriority="high"
                            width="1425"
                            height="1104"
                        />
                    </picture>
                </motion.div>
            </div>

        </header>
    );
}

/* =========================================================================
   ABOUT — one card: intro, story, quick facts
   ========================================================================= */
function About() {
    return (
        <section id="about" className="rb-section rb-about">
            <div className="rb-wrap">
                <Reveal>
                    <span className="rb-section-note">
                        <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                            <path d="M8 6c0 14 8 20 24 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M28 18l5 6-7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        who's this?
                    </span>
                    <h2 className="rb-display-xl">About Me</h2>
                </Reveal>
                <Reveal delay={0.06} className="rb-about-card">
                    <div className="rb-about-story">
                        <div className="rb-about-intro">
                            <span className="hey">Hey,</span>
                            <span className="name">I'm {PROFILE.name}</span>
                            <SecretSmiley size={22} />
                        </div>
                        {ABOUT.paragraphs.map((text) => <p key={text}>{text}</p>)}
                    </div>
                    <ul className="rb-about-facts">
                        {ABOUT.facts.map(({ title, detail, color }) => (
                            <li key={title} style={{ background: color }}>
                                <strong>{title}</strong>
                                <span>{detail}</span>
                            </li>
                        ))}
                    </ul>
                </Reveal>
                <Reveal delay={0.12} className="rb-about-visual" aria-hidden="true">
                    <picture>
                        <source srcSet="/about-laptop.webp" type="image/webp" />
                        <img src="/about-laptop.png" alt="" loading="lazy" width="920" height="164" />
                    </picture>
                </Reveal>
                <AboutExtras />
            </div>
        </section>
    );
}

/* =========================================================================
   EXPERIENCE — left-aligned timeline
   ========================================================================= */
function Experience() {
    const reduceMotion = useReducedMotion();
    return (
        <section id="experience" className="rb-section rb-experience">
            <div className="rb-wrap">
                <div className="rb-exp-head">
                    <Reveal>
                        <span className="rb-section-note">my journey</span>
                        <h2 className="rb-display-xl">Experience</h2>
                    </Reveal>
                    <Reveal
                        as="div"
                        delay={0.15}
                        className="rb-exp-sticky"
                        aria-hidden="true"
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.7, rotate: 4 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 4 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ type: "spring", visualDuration: 0.4, bounce: 0.3 }}
                    >
                        <Lightbulb size={18} />
                        Turning ideas into real products
                    </Reveal>
                </div>
                <div className="rb-exp-list">
                    <motion.div
                        className="rb-exp-line"
                        aria-hidden="true"
                        initial={reduceMotion ? false : { scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.9, ease: [0.16, 0.84, 0.44, 1] }}
                    />
                    {EXPERIENCE.map((x, i) => {
                        const Icon = x.icon;
                        return (
                            <Reveal as="div" key={x.title} delay={i * 0.06} className="rb-exp-item">
                                <span className="rb-exp-dot" style={{ background: x.color }} />
                                <span className="rb-exp-year-pill" style={{ background: x.color }}>{x.period}</span>
                                <div className="rb-exp-card" style={{ boxShadow: `4px 4px 0 ${x.color}` }}>
                                    <div className="rb-exp-icon" style={{ background: x.color }}><Icon size={22} /></div>
                                    <div className="rb-exp-body">
                                        <div className="rb-exp-title">{x.title}</div>
                                        <div className="rb-exp-org">{x.org}</div>
                                        <ul className="rb-exp-bullets">
                                            {x.bullets.map((b) => (
                                                <li key={b}><span className="pt-ico"><ChevronRight size={11} /></span>{b}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   SKILLS — grouped skill cards
   ========================================================================= */
// skill name → projects whose `skills` list it (drives "where I used it").
const SKILL_USAGE = PROJECTS.reduce((map, p) => {
    (p.skills || []).forEach((s) => { (map[s] ||= []).push(p); });
    return map;
}, {});

function Skills() {
    const [picked, setPicked] = useState(null);
    const reduceMotion = useReducedMotion();

    function openProject(p) {
        if (p.caseStudy) navigate(`/work/${p.caseStudy}`);
        else scrollToSection("#work", reduceMotion);
    }

    return (
        <section id="skills" className="rb-section rb-skills">
            <div className="rb-wrap">
                <Reveal>
                    <span className="rb-section-note">what I work with</span>
                    <h2 className="rb-display-xl">Skills</h2>
                    <p className="rb-skills-hint"><span className="rb-skill-dot" aria-hidden="true" /> Tap a skill with a dot to see which projects I used it in.</p>
                </Reveal>
                <div className="rb-skills-grid">
                    {SKILL_GROUPS.map(({ number, title, Icon, accent, skills, wide }, i) => {
                        const pickedHere = picked && skills.includes(picked) ? picked : null;
                        return (
                            <Reveal as="article" key={title} delay={i * 0.06} className={`rb-skill-group${wide ? " wide" : ""}`} style={{ "--group-accent": accent }}>
                                <span className="rb-skill-group-index">{number}</span>
                                <span className="rb-skill-group-strokes" aria-hidden="true" />
                                <div className="rb-skill-group-head">
                                    <span className="rb-skill-group-icon" style={{ background: accent }}><Icon size={28} aria-hidden="true" /></span>
                                    <h3 className="rb-skill-group-title">{title}</h3>
                                </div>
                                <div className="rb-skill-chips">
                                    {skills.map((skill, index) => {
                                        const cls = `rb-skill-chip${index % 2 === 0 ? " accent" : ""}`;
                                        if (!SKILL_USAGE[skill]) return <span className={cls} key={skill}>{skill}</span>;
                                        const on = picked === skill;
                                        return (
                                            <motion.button
                                                type="button"
                                                key={skill}
                                                className={`${cls} used${on ? " on" : ""}`}
                                                aria-pressed={on}
                                                onClick={() => setPicked(on ? null : skill)}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {skill}<span className="rb-skill-dot" aria-hidden="true" />
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                <AnimatePresence initial={false}>
                                    {pickedHere && (
                                        <motion.div
                                            key={pickedHere}
                                            className="rb-skill-used"
                                            initial={{ opacity: 0, height: 0, y: -8 }}
                                            animate={{ opacity: 1, height: "auto", y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -8 }}
                                            transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
                                            aria-live="polite"
                                        >
                                            <div className="rb-skill-used-inner">
                                                <span className="rb-skill-used-label">{pickedHere} — used in</span>
                                                <div className="rb-skill-used-list">
                                                    {SKILL_USAGE[pickedHere].map((p, k) => (
                                                        <motion.button
                                                            type="button"
                                                            key={p.n}
                                                            onClick={() => openProject(p)}
                                                            style={{ "--p-accent": p.accent }}
                                                            initial={reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: k % 2 ? 6 : -6 }}
                                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                            transition={{ type: "spring", stiffness: 480, damping: 16, delay: 0.05 + k * 0.05 }}
                                                        >
                                                            {p.title}{p.caseStudy && <ArrowUpRight size={13} aria-hidden="true" />}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Reveal>
                        );
                    })}
                    <Reveal as="div" delay={SKILL_GROUPS.length * 0.06} className="rb-skills-mantra-cell" aria-hidden="true">
                        <div className="rb-skills-mantra">Build<br />Learn<br />Explore</div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   PROJECTS — editorial shelf gallery (pinned horizontal drag on desktop)
   ========================================================================= */
function ProjectCard({ p }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 48, scale: 0.94, rotate: 1.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="rb-proj-card-wrap"
        >
            <div className="rb-proj-card" style={{ "--proj-accent": p.accent }}>
                <header className="rb-proj-top">
                    <span className="rb-proj-num">{p.n}</span>
                    <span className="rb-proj-badge">{p.badge}</span>
                    <span className="rb-proj-year">{p.year}</span>
                </header>

                <div className="rb-proj-main">
                    <p className="rb-proj-kicker">{p.tag}</p>
                    <h3 className="rb-proj-title">{p.title}</h3>
                    <p className="rb-proj-desc">{p.cardDesc}</p>
                    <ul className="rb-proj-points">
                        {p.points.map((pt) => (
                            <li key={pt}><span className="pt-ico"><ChevronRight size={11} /></span>{pt}</li>
                        ))}
                    </ul>
                </div>

                <footer className="rb-proj-foot">
                    <div className="rb-proj-stack">
                        {p.stack.map((s) => <span key={s}>{s}</span>)}
                    </div>
                    {p.caseStudy ? (
                        <Link to={`/work/${p.caseStudy}`} className="rb-proj-link">
                            Case study <ArrowUpRight size={14} />
                        </Link>
                    ) : p.code ? (
                        <a href={PROFILE.github} target="_blank" rel="noreferrer noopener" className="rb-proj-link">
                            GitHub <ArrowUpRight size={14} />
                        </a>
                    ) : (
                        <span className="rb-proj-private"><Lock size={12} aria-hidden="true" /> Company project</span>
                    )}
                </footer>
            </div>
        </motion.article>
    );
}

const DESKTOP_BREAKPOINT = 760;
const SHELF_END_PAD = 160; // extra px of drag room after the last card

function Work() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const progress = useMotionValue(0);
    const reduceMotion = useReducedMotion();
    const springProgress = useSpring(progress, { stiffness: 140, damping: 24, mass: 0.6 });
    const activeProgress = reduceMotion ? progress : springProgress;
    const [pinState, setPinState] = useState("start"); // "start" | "pinned" | "end"
    const [desktop, setDesktop] = useState(true);
    const [extra, setExtra] = useState(0); // px the shelf overflows the viewport by

    useLayoutEffect(() => {
        function measureTrack() {
            const isDesktop = window.innerWidth > DESKTOP_BREAKPOINT;
            setDesktop(isDesktop);
            if (!isDesktop || !trackRef.current) {
                setExtra(0);
                return;
            }
            const trackWidth = trackRef.current.scrollWidth;
            setExtra(Math.max(0, trackWidth - window.innerWidth + SHELF_END_PAD));
        }
        measureTrack();
        window.addEventListener("resize", measureTrack);
        return () => window.removeEventListener("resize", measureTrack);
    }, []);

    useEffect(() => {
        function measure() {
            const el = sectionRef.current;
            if (!el) return;
            const isDesktop = window.innerWidth > DESKTOP_BREAKPOINT;
            if (!isDesktop) {
                setPinState("start");
                progress.set(0);
                return;
            }
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrollable = rect.height - vh + NAV_CLEARANCE;
            if (scrollable <= 0) {
                setPinState("start");
                progress.set(0);
                return;
            }
            if (rect.top > NAV_CLEARANCE) {
                setPinState("start");
                progress.set(0);
            } else if (rect.bottom <= vh) {
                setPinState("end");
                progress.set(1);
            } else {
                setPinState("pinned");
                progress.set(Math.min(1, Math.max(0, (NAV_CLEARANCE - rect.top) / scrollable)));
            }
        }
        window.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("resize", measure);
        measure();
        return () => {
            window.removeEventListener("scroll", measure);
            window.removeEventListener("resize", measure);
        };
    }, [progress, extra]);

    const trackX = useTransform(() => (desktop ? -activeProgress.get() * extra : 0));

    // Shelf counter follows the same (sprung) progress as the track.
    const [shelfIndex, setShelfIndex] = useState(1);
    useMotionValueEvent(activeProgress, "change", (v) => {
        setShelfIndex(Math.min(PROJECTS.length, Math.max(1, Math.round(v * (PROJECTS.length - 1)) + 1)));
    });

    const pinStyle =
        pinState === "pinned"
            ? { position: "fixed", top: NAV_CLEARANCE, left: 0, right: 0 }
            : pinState === "end"
                ? { position: "absolute", bottom: 0, left: 0, right: 0 }
                : { position: "absolute", top: 0, left: 0, right: 0 };

    return (
        <section id="work" className="rb-work" ref={sectionRef} style={{ height: `calc(100vh + ${extra}px)` }}>
            <div className="rb-work-pin" style={pinStyle}>
                <div className="rb-wrap">
                    <Reveal>
                        <span className="rb-section-note">selected work</span>
                        <h2 className="rb-display-xl">Projects</h2>
                    </Reveal>
                    <p className="rb-work-hint">
                        <Rocket size={14} aria-hidden="true" />
                        Six builds — mobile, full-stack and ML
                        <span className="rb-work-hint-desktop">— scroll to drag the shelf →</span>
                        <span className="rb-work-progress" aria-hidden="true">
                            {String(shelfIndex).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                            <span className="rb-work-progress-bar"><motion.span style={{ scaleX: activeProgress }} /></span>
                        </span>
                    </p>
                </div>
                <div className="rb-work-shelf">
                    <motion.div ref={trackRef} className="rb-proj-track" style={{ x: trackX }}>
                        {PROJECTS.map((p) => <ProjectCard key={p.n} p={p} />)}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   LET'S TALK — enquiry card
   ========================================================================= */
function EnquiryCard() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("idle");
    const magnetic = useMagnetic(0.15);

    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    // With VITE_FORMSPREE_ID set (see .env.example) the form posts straight to
    // Formspree and lands in your inbox; without it, it falls back to opening
    // the visitor's email app pre-filled, as before.
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("sending");
        if (!FORMSPREE_ID) {
            const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
            const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
            window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
            setStatus("mailto");
            return;
        }
        try {
            const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ ...form, _subject: `Portfolio enquiry from ${form.name}` }),
            });
            if (!res.ok) throw new Error(String(res.status));
            setStatus("sent");
            setForm({ name: "", email: "", message: "" });
        } catch {
            setStatus("error");
        }
    }

    return (
        <Reveal delay={0.1} className="rb-enquiry-card">
            <span className="rb-hand-label">drop a line</span>
            <h3>Quick Enquiry</h3>
            <form onSubmit={handleSubmit} className="rb-enquiry-form">
                <input
                    name="name" type="text" placeholder="Your name" required
                    value={form.name} onChange={handleChange} className="rb-input"
                />
                <input
                    name="email" type="email" placeholder="Your email" required
                    value={form.email} onChange={handleChange} className="rb-input"
                />
                <textarea
                    name="message" placeholder="What are you looking to build?" required rows={3}
                    value={form.message} onChange={handleChange} className="rb-input rb-textarea"
                />
                <motion.button
                    ref={magnetic.ref}
                    style={magnetic.style}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={status === "sending"}
                    className="rb-btn rb-btn-dark rb-btn-full"
                >
                    {status === "sending" ? "Sending…" : "Send Enquiry"} <ArrowUpRight size={15} />
                </motion.button>
                <AnimatePresence mode="wait">
                    {status === "mailto" && (
                        <motion.p key="mailto" className="rb-enquiry-status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            Opening your email app to send this to {PROFILE.email}…
                        </motion.p>
                    )}
                    {status === "sent" && (
                        <motion.p key="sent" className="rb-enquiry-status ok" initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>
                            <Check size={14} /> Thanks — your message is on its way. I'll reply to your email soon.
                        </motion.p>
                    )}
                    {status === "error" && (
                        <motion.p key="error" className="rb-enquiry-status err" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            That didn't send. Please email me directly at <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>.
                        </motion.p>
                    )}
                </AnimatePresence>
            </form>
        </Reveal>
    );
}

function LetsTalk() {
    const [emailUser, emailDomain] = PROFILE.email.split("@");
    const contacts = [
        // <wbr> lets the long address wrap at the "@" instead of mid-word
        { Icon: Mail, label: "Email", value: <>{emailUser}<wbr />@{emailDomain}</>, href: `mailto:${PROFILE.email}`, color: "var(--yellow)" },
        { Icon: Linkedin, label: "LinkedIn", value: PROFILE.linkedin.split("/in/")[1], href: PROFILE.linkedin, external: true, color: "var(--blue)" },
        { Icon: MapPin, label: "Based in", value: PROFILE.location, color: "var(--pink)" },
    ];
    return (
        <section id="contact" className="rb-section rb-talk">
            <div className="rb-wrap rb-talk-grid">
                <div className="rb-talk-info">
                    <Reveal>
                        <span className="rb-talk-status"><span className="pulse" aria-hidden="true" />{CONTACT.availability}</span>
                        <div className="rb-talk-heading">
                            <FloatSparkle className="rb-talk-sparkle s1" size={22} delay={0} duration={3.6} />
                            <FloatSparkle className="rb-talk-sparkle s2" size={15} delay={0.7} duration={4.2} />
                            <FloatSparkle className="rb-talk-sparkle s3" size={18} delay={1.3} duration={3.9} />
                            <h2 className="rb-display-xl">Let's Talk</h2>
                        </div>
                        <p className="rb-talk-blurb">{CONTACT.blurb}</p>
                    </Reveal>
                    <Reveal as="ul" delay={0.08} className="rb-talk-contacts">
                        {contacts.map(({ Icon, label, value, href, external, color }) => {
                            const Tag = href ? "a" : "div";
                            const linkProps = href ? { href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : {};
                            return (
                                <li key={label}>
                                    <Tag className="rb-talk-contact" {...linkProps}>
                                        <span className="ico" style={{ background: color }}><Icon size={17} aria-hidden="true" /></span>
                                        <span className="txt"><small>{label}</small><strong>{value}</strong></span>
                                        {href && <ArrowUpRight className="go" size={15} aria-hidden="true" />}
                                    </Tag>
                                </li>
                            );
                        })}
                    </Reveal>
                    <QuickFacts />
                    <Reveal delay={0.14} className="rb-talk-help">
                        <span className="rb-section-note">I can help with</span>
                        <div className="chips">{CONTACT.helpWith.map((h) => <span key={h}>{h}</span>)}</div>
                    </Reveal>
                </div>
                <EnquiryCard />
            </div>
        </section>
    );
}

/* =========================================================================
   CONTACT + FOOTER
   ========================================================================= */
function Contact() {
    const reduceMotion = useReducedMotion();
    return (
        <section className="rb-contact">
            <div className="rb-footer-bar">
                <div className="rb-wrap">
                    <span>© {new Date().getFullYear()} Bhavani Sai — Hyderabad, India</span>
                    <motion.a whileTap={{ scale: 0.95 }} href="#top" className="rb-back-top" onClick={(e) => { e.preventDefault(); if (document.getElementById("top")) scrollToSection("#top", reduceMotion); else scrollToTop({ smooth: !reduceMotion }); }}>Back to top ↑</motion.a>
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   APP
   ========================================================================= */
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
const ALL_CSS = STYLE + TODO_CSS + SCREEN_FRAME_CSS + CASE_STUDY_CSS + NOT_FOUND_CSS + EXTRAS_CSS;
const HOME_TITLE = "Bhavani Sai — Software Engineer";

function Home() {
    // Arriving from another page via "/#section": jump there once the sections exist.
    useEffect(() => {
        const { hash } = window.location;
        if (!hash || hash === "#top") return undefined;
        const t = window.setTimeout(() => scrollToSection(hash, true, { push: false }), 80);
        return () => window.clearTimeout(t);
    }, []);
    return (
        <>
            <Hero />
            <About />
            <Experience />
            <Certifications />
            <Work />
            <Skills />
            <LetsTalk />
        </>
    );
}

/** Picks the page for the current path and keeps the tab title in sync. */
function resolveRoute(path) {
    if (path === "/" || path === "/index.html") return { key: "home", title: HOME_TITLE, el: <Home /> };
    const work = matchPath("/work/:slug", path);
    const study = work && getCaseStudy(work.slug);
    if (study) return { key: path, title: `${study.title} — Case study · Bhavani Sai`, el: <CaseStudy study={study} /> };
    return { key: "404", title: "Page not found — Bhavani Sai", el: <NotFound /> };
}

export default function Portfolio() {
    const reduceMotion = useReducedMotion();
    useLenis(!reduceMotion);
    const path = usePath();
    const route = resolveRoute(path);

    useEffect(() => { document.title = route.title; }, [route.title]);
    // New page → start at the top (Home handles its own "/#section" scroll).
    useLayoutEffect(() => { if (route.key !== "home" || !window.location.hash) scrollToTop(); }, [route.key]);

    const goToSection = React.useCallback((href) => {
        if (window.location.pathname !== "/") navigate(`/${href}`);
        else scrollToSection(href, reduceMotion);
    }, [reduceMotion]);

    return (
        <MotionConfig reducedMotion="user">
            <div className="rb-root">
                <style>{ALL_CSS}</style>
                <div className="rb-frame">
                    <Nav path={path} />
                    {/* Opacity only: a transform here would break the Work shelf's position:fixed pin. */}
                    <motion.div
                        key={route.key}
                        initial={reduceMotion || route.key === "home" ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {route.el}
                    </motion.div>
                    <Contact />
                </div>
                <CommandMenu goToSection={goToSection} />
                <ResumeModal />
                <Toaster />
            </div>
        </MotionConfig>
    );
}
