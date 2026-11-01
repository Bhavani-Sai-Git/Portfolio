// ---------------------------------------------------------------------------
// content.js — SINGLE SOURCE OF TRUTH
// Profile, nav, about, experience, projects and skills copy for the site.
// Components read from here instead of hardcoding content inline.
// ---------------------------------------------------------------------------
import {
    Cloud, Database, Smartphone, Code2, Layers,
    Building2, Laptop2, GraduationCap, Brain, ClipboardCheck,
} from "lucide-react";

export const PROFILE = {
    name: "Bhavani Sai",
    role: "Software Engineer",
    location: "Hyderabad, India",
    email: "munaganti.bhavanisai@gmail.com",
    github: "https://github.com/Bhavani-Sai-Git",
    linkedin: "https://www.linkedin.com/in/munaganti-bhavani-sai",
    resume: "/Bhavani_Sai_Resume.pdf",
};

// Page order: Home → About → Experience → Work → Skills → Contact.
export const NAV_LINKS = [["#top", "Home"], ["#about", "About"], ["#experience", "Experience"], ["#work", "Work"], ["#skills", "Skills"], ["#contact", "Contact"]];

// Let's Talk section copy. `availability` drives the status pill — edit it to match what you're open to.
export const CONTACT = {
    availability: "Open to new opportunities",
    blurb: "Got a project, a hard problem, or just want to say hi? Send a message — I read every one.",
    helpWith: ["Mobile apps", "Web apps", "REST APIs"],
};

export const ABOUT = {
    paragraphs: [
        "I'm a Computer Science graduate and a software engineer with hands-on experience building mobile and web applications. I enjoy working with modern technologies, solving real-world problems, and creating user-friendly products.",
        "I care about the small details, the edge cases everyone forgets, and shipping work that genuinely makes someone's day easier.",
    ],
    facts: [
        { title: "Software Engineer", detail: "Mobile & web applications", color: "var(--mint)" },
        { title: "Builder", detail: "Clean, useful products", color: "var(--pink)" },
        { title: "Background", detail: "Computer Science graduate", color: "var(--yellow)" },
        { title: "Curious", detail: "Tech, travel & games", color: "var(--blue)" },
    ],
};

export const PROJECTS = [
    {
        n: "01", tag: "COMPANY PROJECT · FULL-STACK SAAS", year: "2025 – 26",
        title: "Billing & POS Platform",
        badge: "Mobile App", accent: "var(--yellow)",
        cardDesc: "Billing and POS application with printer integration and barcode scanner support.",
        points: ["Node.js/Express REST APIs on AWS Lambda + API Gateway (SAM/CodeBuild), with JWT auth and role-based access control", "Integrated SMS/QR/UPI payment channels and S3 presigned-URL file storage", "Led an in-place migration disabling legacy modules via config-driven route/menu guards", "Screen-by-screen React Native UI redesign using the web app as a feature blueprint, with keyboard-handling fixes"],
        stack: ["React", "React Native", "Node.js/Express", "AWS Lambda", "MySQL"],
        caseStudy: "billing-pos",
        skills: ["React.js", "React Native", "JavaScript", "Node.js", "Express", "MySQL", "Stored Procedures", "REST APIs", "JWT Auth", "AWS Lambda", "API Gateway", "S3", "AWS SAM", "CodeBuild", "Payment Integrations (UPI / QR)", "Secure Auth & Access Control", "Release & Version Management"],
    },
    {
        n: "02", tag: "COMPANY PROJECT · MOBILE SAAS", year: "2026",
        title: "Parking Operations App",
        badge: "Mobile App", accent: "var(--blue)",
        cardDesc: "React Native mobile app for vehicle entry/exit, monthly passes, dashboards and reports.",
        points: ["Real-time vehicle-security checks with server-enforced entry/exit rules", "Branch-level token-queue system with priority tiers (kiosk/QR/RFID/ANPR)", "Secure JWT auth with tokens stored in the OS Keychain", "Custom tab/stack navigation with interceptor-driven automatic logout"],
        stack: ["React Native", "TypeScript", "React Query", "Axios"],
        caseStudy: "parking-operations",
        skills: ["React Native", "TypeScript", "Axios", "React Query", "React Navigation", "Node.js", "Express", "MySQL", "REST APIs", "JWT Auth", "Secure Auth & Access Control"],
    },
    {
        n: "03", tag: "COMPANY PROJECT · MOBILE", year: "2026",
        title: "Online Gate Entry App",
        badge: "Mobile App", accent: "var(--mint)",
        cardDesc: "React Native rewrite of a legacy entry system, with offline-first data capture and sync.",
        points: ["Rebuilt a legacy Android app in React Native", "Connected REST endpoints end-to-end", "SQLite for offline-first data capture", "Rolled out across multiple operating locations"],
        stack: ["React Native", "SQLite", "REST API"],
        skills: ["React Native", "Android (Java)", "SQLite", "REST APIs", "Offline-First Sync"],
    },
    {
        n: "04", tag: "COMPANY PROJECT · MOBILE", year: "2026",
        title: "Weighment Integration App",
        badge: "Mobile App", accent: "var(--violet-soft)",
        cardDesc: "Market yard weighment app with device integration and real-time data.",
        points: ["Built a reliable data-upload pipeline", "Added response models and integration settings", "Diagnosed a TLS/SNI issue in the HTTP client", "Documented the integration for the team"],
        stack: ["Java", "Android", "Apache HttpClient"],
        caseStudy: "weighment-integration",
        skills: ["Java", "Android (Java)", "REST APIs", "Root-Cause Analysis", "Technical Documentation"],
    },
    {
        n: "05", tag: "PERSONAL PROJECT · FULL-STACK", year: "Academic",
        title: "Food Frenzy",
        badge: "Full Stack", accent: "var(--yellow)",
        cardDesc: "Food delivery platform built during training — Spring Boot backend, React.js front end.",
        points: ["Spring Boot / Spring MVC REST APIs for users, menus and orders", "Cut manual data handling by ~40%", "React.js front end with MySQL CRUD"],
        stack: ["Spring Boot", "React.js", "MySQL"],
        code: true,
        skills: ["Java", "Spring Boot", "Spring MVC", "React.js", "MySQL", "REST APIs"],
    },
    {
        n: "06", tag: "PERSONAL PROJECT · MACHINE LEARNING", year: "Academic",
        title: "Railway Object Detection",
        badge: "ML / Vision", accent: "var(--blue)",
        cardDesc: "Real-time railway safety detection using an improved YOLOv8 model with knowledge distillation.",
        points: ["Improved YOLOv8 model for real-time railway monitoring", "Cut the false detection rate by ~18%", "Knowledge distillation for faster inference"],
        stack: ["YOLOv8", "Python", "Computer Vision"],
        code: true,
        skills: ["Python", "YOLOv8", "OpenCV", "Computer Vision", "Knowledge Distillation"],
    },
];

export const EXPERIENCE = [
    {
        period: "2026 — Present", title: "Software Engineer Trainee",
        org: "Enterprise software company, Hyderabad",
        icon: Building2, color: "var(--yellow)",
        bullets: [
            "Worked on billing, parking and market-operations applications.",
            "Built mobile apps using React Native with device integrations.",
            "Implemented real-world features and solved production issues.",
        ],
    },
    {
        period: "2025", title: "Full Stack Java Developer Trainee",
        org: "Codegnan · Intensive Program",
        icon: Laptop2, color: "var(--mint)",
        bullets: [
            "Hands-on training in Java, REST APIs and modern web technologies.",
            "Built multiple full-stack mini-projects strengthening backend & frontend skills.",
        ],
    },
    {
        period: "2021 — 2025", title: "B.Tech — Computer Science & Engineering",
        org: "Guru Nanak Institute of Technology, Hyderabad",
        icon: GraduationCap, color: "var(--pink)",
        bullets: ["Specialized in software engineering, web technologies and machine learning."],
    },
];

// Mirrors the resume's Technical Skills block plus tools used in PROJECTS.
// `wide` groups span the full grid row (see .rb-skill-group.wide).
export const SKILL_GROUPS = [
    { number: "01", title: "Languages", Icon: Code2, accent: "var(--yellow)", skills: ["Java", "JavaScript", "TypeScript", "Python", "SQL", "C"] },
    { number: "02", title: "Mobile / Frontend", Icon: Smartphone, accent: "var(--pink)", skills: ["React Native", "React.js", "Android (Java)", "React Query", "React Navigation", "Axios", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"] },
    { number: "03", title: "Backend", Icon: Layers, accent: "var(--mint)", skills: ["Node.js", "Express", "Spring Boot", "Spring MVC", "Hibernate", "JDBC", "REST APIs", "JWT Auth", "Maven"] },
    { number: "04", title: "Database", Icon: Database, accent: "var(--blue)", skills: ["MySQL", "SQLite", "Stored Procedures", "Query Design"] },
    { number: "05", title: "Cloud & DevOps", Icon: Cloud, accent: "var(--violet-soft)", skills: ["AWS Lambda", "API Gateway", "S3", "AWS SAM", "CodeBuild", "Firebase", "Docker", "Git", "GitHub", "Postman"] },
    { number: "06", title: "AI / ML", Icon: Brain, accent: "var(--yellow)", skills: ["YOLOv8", "OpenCV", "Computer Vision", "Knowledge Distillation", "Claude Code"] },
    { number: "07", title: "Engineering Practices", Icon: ClipboardCheck, accent: "var(--mint)", wide: true, skills: ["Functional & Regression Testing", "Defect Triage", "Root-Cause Analysis", "Code Review", "Technical Documentation", "Release & Version Management", "Secure Auth & Access Control", "Payment Integrations (UPI / QR)", "Offline-First Sync"] },
];

// Hero positioning line (under the name). Written by Claude from the resume — edit freely.
export const HERO_TAGLINE = "I build React Native apps and Node.js / Java backends for real businesses — billing, parking and market-yard systems with payments, secure auth and AWS behind them.";

// Hero stat row — outcomes, not counts. All three come from the resume.
// `value` drives the scroll-triggered CountUp (a trailing suffix like "%" is kept).
export const HERO_STATS = [
    { color: "var(--mint)", value: "6", title: "Business apps", sub: "across company projects" },
    { color: "var(--violet-soft)", value: "4", title: "Payment channels", sub: "SMS · QR · UPI · EDC" },
    { color: "var(--yellow)", value: "18%", title: "Fewer false detections", sub: "YOLOv8 model (approx.)" },
];

// Certifications strip — from the resume's "Certifications & Leadership" block.
// Add a `href` to any of them to make the badge link to the certificate.
export const CERTIFICATIONS = [
    { title: "Claude Code in Action", issuer: "Anthropic", color: "var(--pink)" },
    { title: "AI Fluency: Framework & Foundations", issuer: "Anthropic", color: "var(--yellow)" },
    { title: "Salesforce Developer — Superbadges", issuer: "Trailhead", color: "var(--blue)" },
    { title: "The Complete ReactJS Course", issuer: "Udemy · 2026", color: "var(--mint)" },
    { title: "Full Stack Java Developer", issuer: "Codegnan · 2025", color: "var(--violet-soft)" },
];

// "Off the clock" — the person behind the code. From the resume + About facts.
export const OFF_THE_CLOCK = [
    { emoji: "🏐", title: "State-level volleyball", detail: "team sport, real pressure", color: "var(--yellow)" },
    { emoji: "🤝", title: "NGO volunteer", detail: "Smile For All · Street Cause", color: "var(--mint)" },
    { emoji: "🎤", title: "HR Conclave 2024", detail: "participant", color: "var(--pink)" },
    { emoji: "🎮", title: "Travel & games", detail: "how I recharge", color: "var(--blue)" },
];

// Current work shown in the About card.
export const NOW = [
    { label: "Building", value: "React Native 0.87 Android app for parking operations" },
];

// Recruiter quick-facts card in Let's Talk. Empty values with a `todo` show
// only in `npm run dev`, so the live site never displays a blank or guessed fact.
export const QUICK_FACTS = [
    { label: "Looking for", value: "Software Engineer — mobile / full-stack" },
    { label: "Based in", value: "Hyderabad, India" },
    { label: "Experience", value: "Enterprise software company, June 2026 – present" },
    { label: "Work mode", value: "Open to any" },
    { label: "Notice period", value: "1 week" },
];
