// ---------------------------------------------------------------------------
// caseStudies.js — long-form project pages served at /work/:slug
// Every fact here comes from the resume or PROJECTS in content.js. Anything
// still needed from you is a `todo` string: it renders as a dashed reminder
// box in `npm run dev` only and is left out of production builds.
//
// Screens: drop real screenshots into public/work/<slug>/ and set `src`
// (e.g. src: "/work/parking-operations/entry.webp"). Remove identifying details first.
// Until then each frame shows a neutral wireframe sketch.
// ---------------------------------------------------------------------------

export const CASE_STUDIES = [
    {
        slug: "parking-operations",
        project: "Parking Operations App",
        accent: "var(--blue)",
        kicker: "Mobile · Enterprise SaaS",
        title: "Parking Operations App",
        summary: "An Android app for vehicle entry and exit, monthly passes, dashboards and reports, built in React Native alongside an existing web platform.",
        meta: [
            { label: "Role", value: "Mobile developer" },
            { label: "Company", value: "Enterprise software company" },
            { label: "Year", value: "2026" },
            { label: "Platform", value: "Android · React Native 0.87" },
        ],
        screens: [
            { kind: "phone", label: "Vehicle entry", sketch: "form", src: null },
            { kind: "phone", label: "Dashboard", sketch: "dashboard", src: null },
            { kind: "phone", label: "Monthly passes", sketch: "list", src: null },
        ],
        screensTodo: "Add 3 screenshots (entry, dashboard, passes) to public/work/parking-operations/ — remove identifying information.",
        numbers: [
            { value: "5", label: "vehicle intake modes", detail: "manual · kiosk · QR · RFID · ANPR" },
            { value: "2", label: "server-enforced checks", detail: "entry and exit validation" },
            { value: "1", label: "typed API layer", detail: "every backend response in one shape" },
        ],
        numbersTodo: "Add a real-usage number if you can share one (branches live, vehicles per day).",
        problem: [
            "Parking operators already ran their business on a web app. Gate staff needed the same rules on a handheld Android device — quick entry and exit at the barrier, vehicle security checks and monthly passes.",
            "The hard part wasn't the screens. It was keeping the mobile app's behaviour identical to the web's while talking to a backend that wasn't always consistent.",
        ],
        constraints: [
            "Feature and business-logic parity with an existing web frontend",
            "Backend responses with inconsistent envelopes — and errors returned as HTTP 200",
            "Security-sensitive flows with supervisor overrides",
            "Dates slipping by a day between UTC and local time",
        ],
        decisions: [
            {
                title: "One typed API layer that absorbs backend quirks",
                body: "A typed Axios + TypeScript layer normalises the different response envelopes and treats HTTP-200 error payloads as real errors, so every screen deals with a single shape. React Query handles server-state caching and invalidation.",
            },
            {
                title: "The server owns the security rules",
                body: "Vehicle lookups are debounced and the server makes the access decision. A supervisor can override with a short-lived, scoped token — the app never holds the rule itself.",
            },
            {
                title: "Tokens in the OS Keychain, automatic logout",
                body: "JWTs live in the OS Keychain, access is channel-based, and an interceptor logs the operator out the moment the server signals an invalid session.",
            },
            {
                title: "A token queue with priority tiers",
                body: "A branch-level queue with priority tiers and manual, kiosk, QR, RFID and ANPR intake, covering the full operator lifecycle.",
            },
        ],
        shipped: [
            "Android client with UI and business-logic parity with the web frontend",
            "Real-time vehicle-security checks with supervisor override",
            "Custom tab bar and a stack-reset helper for predictable navigation",
            "Fixed UTC off-by-one-day date bugs with local-timezone handling",
        ],
        learned: "When the backend is inconsistent, fix it once at the edge. A single normalising API layer made every later screen simpler to build and to test.",
        stack: ["React Native 0.87", "Hermes", "TypeScript", "Axios", "React Query", "React Navigation", "Node.js / Express", "MySQL"],
    },
    {
        slug: "billing-pos",
        project: "Billing & POS Platform",
        accent: "var(--yellow)",
        kicker: "Full-stack · Multi-tenant SaaS",
        title: "Billing & POS Platform",
        summary: "A multi-tenant billing and POS platform for retail, restaurants and service businesses — Node.js APIs on AWS Lambda, a React web app and a React Native client.",
        meta: [
            { label: "Role", value: "Full-stack developer" },
            { label: "Company", value: "Enterprise software company" },
            { label: "Year", value: "2025 – 26" },
            { label: "Platform", value: "Web · Android · AWS" },
        ],
        screens: [
            { kind: "browser", label: "Billing counter (web)", sketch: "dashboard", src: null },
            { kind: "phone", label: "POS (mobile)", sketch: "pos", src: null },
        ],
        screensTodo: "Add a web screenshot and a mobile POS screenshot to public/work/billing-pos/ — remove identifying information.",
        numbers: [
            { value: "3", label: "payment channels", detail: "SMS · QR · UPI" },
            { value: "3", label: "levels of access control", detail: "tenants · branches · locations" },
            { value: "0", label: "legacy modules deleted", detail: "switched off by config instead" },
        ],
        numbersTodo: "Add a real-usage number if you can share one (tenants, bills per day).",
        problem: [
            "One platform had to serve many different businesses, each with its own branches, locations, staff roles and payment channels.",
            "At the same time, legacy modules had to be switched off for live tenants — without a risky big-bang deletion.",
        ],
        constraints: [
            "Strict tenant isolation across tenants, branches and locations",
            "Several payment channels: SMS, QR and UPI",
            "Serverless deployment on AWS Lambda behind API Gateway",
            "Legacy modules still in the codebase while customers were live",
        ],
        decisions: [
            {
                title: "Stored-procedure data access behind REST APIs",
                body: "Node.js / Express REST APIs with stored-procedure data access, deployed as an AWS Lambda function behind API Gateway via AWS SAM and CodeBuild.",
            },
            {
                title: "Single-device sessions and menu-driven access",
                body: "JWT auth enforces one active device per session, and role-based, menu-driven access control scopes every user to their tenant, branch and location.",
            },
            {
                title: "Switch modules off, don't delete them",
                body: "Led an in-place migration that disabled legacy modules through config-driven route and menu guards — no code deleted, easy to roll back. Feature-flag navigation allowed a phased rollout.",
            },
            {
                title: "Files through S3 presigned URLs",
                body: "Uploads and downloads go straight to S3 with presigned URLs, keeping large files out of the Lambda function.",
            },
        ],
        shipped: [
            "React SPA with a centralised API service layer",
            "SMS / QR / UPI payment integrations",
            "Printer and barcode-scanner support at the counter",
            "Screen-by-screen React Native redesign, using the web app as the feature blueprint",
        ],
        learned: "Config-driven guards turned a scary migration into a reversible switch. Removing a feature and deleting its code are two separate decisions.",
        stack: ["React", "React Native", "Node.js / Express", "MySQL", "AWS Lambda", "API Gateway", "AWS SAM", "CodeBuild", "S3"],
    },
    {
        slug: "weighment-integration",
        project: "Weighment Integration App",
        accent: "var(--violet-soft)",
        kicker: "Mobile · Government integration",
        title: "Weighment Integration App",
        summary: "Connecting a Java Android weighment app at agricultural market locations to an external trading platform, and diagnosing a TLS issue that blocked API calls.",
        meta: [
            { label: "Role", value: "Android developer" },
            { label: "Company", value: "Enterprise software company" },
            { label: "Year", value: "2025" },
            { label: "Platform", value: "Android · Java" },
        ],
        screens: [
            { kind: "phone", label: "Weighment entry", sketch: "form", src: null },
            { kind: "phone", label: "Upload status", sketch: "list", src: null },
        ],
        screensTodo: "Add 2 screenshots to public/work/weighment-integration/ — remove identifying information.",
        numbers: [
            { value: "9", label: "file integration module", detail: "designed end-to-end" },
            { value: "1", label: "critical SSL bug found", detail: "SNI in Apache HttpClient" },
            { value: "1", label: "integration guide", detail: "documented the setup flow" },
        ],
        problem: [
            "Weighment readings recorded at market locations had to be uploaded to an external trading platform.",
            "The integration couldn't move forward: API calls from the app were failing before any request reached the service.",
        ],
        constraints: [
            "Government APIs — no control over the server side",
            "A legacy Java Android codebase using Apache HttpClient",
            "External device credentials required a documented setup flow",
        ],
        decisions: [
            {
                title: "Debug the handshake, not the payload",
                body: "Traced the failure to an SNI SSL issue in the app's Apache HttpClient — the TLS handshake failed, so no API call could succeed regardless of what was sent.",
            },
            {
                title: "A self-contained integration module",
                body: "Designed a nine-file integration module with an upload pipeline, response model and settings layer, kept separate from the rest of the app.",
            },
            {
                title: "Write it down",
                body: "Authored the setup guide used to obtain device credentials and documented the integration for new team members.",
            },
        ],
        shipped: [
            "Working weighment upload to the external platform",
            "Root cause and fix for the SNI SSL failure",
            "Integration documentation for the team and external service",
        ],
        learned: "If every call fails the same way, look underneath the request. The bug was in the connection, not the code that built the payload.",
        stack: ["Java", "Android", "Apache HttpClient", "External APIs"],
    },
];

export function getCaseStudy(slug) {
    return CASE_STUDIES.find((c) => c.slug === slug) || null;
}
