import type { ConceptLesson } from '../../../types/lesson'

const clickjacking: ConceptLesson = {
  // 1. Concept Summary
  slug: 'clickjacking',
  name: 'Clickjacking',
  category: 'security',
  difficulty: 'advanced',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Clickjacking tricks users into clicking buttons they cannot see, turning a real, intended click into an action they never meant to perform.',
    'It bypasses CSRF tokens entirely, because the victim genuinely performs the action in their own authenticated session.',
    'A single missing frame-protection header can let attackers iframe your sensitive pages (transfer money, change settings) under a deceptive overlay.',
    'It is a great interview topic for testing whether you understand UI-layer attacks and the frame-ancestors / X-Frame-Options defenses.',
    'Real incidents include Likejacking on social networks and one-click purchase/follow exploits — small UX gaps with real impact.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Clickjacking is like a fake "Play Game" button taped over a real "Delete" button.',
    story: [
      'Imagine someone tapes a shiny sticker that says "Play Free Game!" right on top of a button that actually says "Delete my account".',
      'You see the fun sticker and press it, sure you are starting a game.',
      'But your finger really pressed the hidden button underneath — and it did the dangerous thing without you knowing.',
      'Clickjacking does this on websites: a tricky page puts an invisible copy of a real website on top of a fun-looking button, so your click lands on the real site and does something you never intended.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Websites can embed other websites inside a frame (an iframe), like a small window showing another page.',
    'An attacker loads YOUR real, logged-in website inside an invisible (transparent) iframe and places it exactly over a tempting button on their page.',
    'When you click what looks like "Win a prize", you are actually clicking a real button on your authenticated site underneath.',
    'Because the click is real and made by you while logged in, the site obeys it. The defense is to tell browsers "do not let other sites put me in a frame".',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Clickjacking (UI redress attack) is an attack where a malicious page loads a target site in a transparent/disguised iframe and overlays deceptive UI, so a victim\'s genuine click is hijacked to perform an unintended action on the framed site.',
    how: 'The attacker iframes the target, sets it to near-zero opacity, and positions a fake button under the cursor where the real target button sits. The victim clicks the visible decoy, but the click lands on the hidden real control.',
    why: 'Browsers let pages be framed by default, and a click inside an iframe is delivered to the framed page in its own session. The fix is for the target to forbid framing (frame-ancestors / X-Frame-Options) so it cannot be embedded by hostile origins.',
    code: {
      label: 'A clickjacking attacker page',
      lang: 'html',
      code: `<style>\n  iframe { opacity: 0.0; position: absolute; top: 0; left: 0; width: 500px; height: 400px; }\n  .decoy { position: absolute; top: 120px; left: 80px; z-index: -1; }\n</style>\n\n<button class="decoy">Click to win a prize!</button>\n<iframe src="https://bank.com/transfer-confirm"></iframe>`,
      explanation: [
        'The real bank.com page is loaded in an invisible iframe (opacity 0).',
        'A decoy button is positioned exactly under where the real "Confirm" button appears.',
        'The victim sees and clicks "Click to win a prize!" but the click passes to the framed Confirm button.',
        'Because the victim is logged into bank.com, the action executes in their session.',
        'No CSRF token helps here — the user really clicked, in their own session.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Clickjacking, also called a UI redress attack, is a class of attack in which an adversary embeds a target application within a framing context (iframe) rendered transparently or visually disguised, then overlays deceptive interface elements so that a user\'s legitimate pointer or keyboard input is redirected to controls on the framed page. Because the input occurs within the victim\'s authenticated session, server-side defenses like CSRF tokens are ineffective. Mitigation is achieved by preventing the page from being framed by untrusted origins via the Content-Security-Policy frame-ancestors directive (and the legacy X-Frame-Options header), and by frame-busting/SameSite hardening.',

  // 7. Internal Working
  internalWorking: [
    'The attacker page includes an iframe whose src is the target application; the browser loads the target in that frame with the victim\'s existing cookies/session.',
    'CSS makes the iframe transparent (opacity 0) or otherwise disguised, and absolutely positions it over the attacker\'s visible decoy UI.',
    'The attacker aligns a sensitive control of the target (a button/toggle) to sit precisely under the cursor where the decoy invites a click.',
    'The victim clicks the decoy; the browser routes the pointer event to whatever is topmost at that coordinate — the (invisible) target control.',
    'The target receives a genuine, user-initiated event within the authenticated session and performs the action.',
    'Defenses act at the browser BEFORE this: if the target sends frame-ancestors/X-Frame-Options forbidding the attacker origin, the browser refuses to render the framed target at all.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   attacker.com (what the victim SEES)
   ┌───────────────────────────────┐
   │   "Click to win a prize!"  ◄───┼── decoy button (visible)
   └───────────────────────────────┘
                 ▲ click
                 │  (lands on layer ABOVE)
   invisible overlay (opacity 0):
   ┌───────────────────────────────┐
   │  <iframe src=bank.com/confirm> │
   │        [ CONFIRM TRANSFER ] ◄──┼── real button under cursor
   └───────────────────────────────┘
   DEFENSE: bank.com sends frame-ancestors 'none'
            → browser refuses to frame it → attack fails`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — the modern defense header',
      lang: 'http',
      code: `# Tell the browser only same-origin pages may frame this page\nContent-Security-Policy: frame-ancestors 'self'\n\n# Or forbid framing entirely\nContent-Security-Policy: frame-ancestors 'none'`,
      explanation: [
        "frame-ancestors 'self' allows only your own origin to embed the page in a frame.",
        "frame-ancestors 'none' forbids ALL framing, ideal for sensitive pages like transfer confirmations.",
        'The browser enforces this at load time, refusing to render the page inside a disallowed frame.',
        'This is the modern, preferred defense and supersedes X-Frame-Options.',
      ],
    },
    intermediate: {
      label: 'Intermediate — legacy X-Frame-Options',
      lang: 'js',
      code: `// Express — set both for broad browser coverage\napp.use((req, res, next) => {\n  res.setHeader('X-Frame-Options', 'DENY') // legacy, no per-origin granularity\n  res.setHeader('Content-Security-Policy', \"frame-ancestors 'none'\")\n  next()\n})`,
      explanation: [
        'X-Frame-Options DENY blocks all framing; SAMEORIGIN allows only same-origin framing.',
        'It is the older header; it lacks the per-origin allowlist that frame-ancestors supports.',
        'Set both headers: frame-ancestors for modern browsers, X-Frame-Options for old ones.',
        'helmet sets sensible defaults for both in Node apps.',
      ],
    },
    advanced: {
      label: 'Advanced — allow specific trusted embedders only',
      lang: 'http',
      code: `# Allow only your app and a trusted partner portal to frame this page\nContent-Security-Policy: frame-ancestors 'self' https://partner.trusted.com\n\n# X-Frame-Options cannot express an allowlist of multiple origins,\n# so for multi-origin embedding you MUST use frame-ancestors.`,
      explanation: [
        'frame-ancestors accepts an allowlist of origins permitted to frame the page.',
        'This is essential when a legitimate partner needs to embed you but no one else should.',
        'X-Frame-Options only supports DENY or SAMEORIGIN (its ALLOW-FROM is deprecated/unsupported), so frame-ancestors is required for allowlists.',
        'Keep the allowlist minimal and exact — broad entries reopen the attack surface.',
      ],
    },
    realProject: {
      label: 'Real project — global frame protection via helmet in a Node API',
      lang: 'js',
      code: `import helmet from 'helmet'\n\napp.use(helmet.frameguard({ action: 'deny' })) // X-Frame-Options: DENY\napp.use(\n  helmet.contentSecurityPolicy({\n    directives: { frameAncestors: [\"'none'\"] },\n  })\n)\n\n// Sensitive flows (payment confirm, account settings) inherit this globally.`,
      explanation: [
        'helmet.frameguard sets X-Frame-Options for legacy coverage.',
        'The CSP frame-ancestors directive is the authoritative modern control.',
        'Applying it globally protects every route, including ones added later by other teams.',
        'For Vue/React SPAs the protection comes from the server/CDN headers, not the client bundle.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is clickjacking?',
      answer: 'An attack where a malicious page loads a target site in a transparent/disguised iframe and overlays fake UI, so a user\'s real click is hijacked to perform an unintended action on the framed site.',
      explanation: 'Naming the iframe overlay and "hijacked click" is the core idea.',
    },
    {
      level: 'beginner',
      question: 'How do you defend against clickjacking?',
      answer: 'Tell the browser the page may not be framed by untrusted origins, using the CSP frame-ancestors directive (and legacy X-Frame-Options). frame-ancestors \'none\' forbids all framing.',
      explanation: 'Both the modern (frame-ancestors) and legacy (X-Frame-Options) answers are expected.',
    },
    {
      level: 'intermediate',
      question: 'Why do CSRF tokens NOT protect against clickjacking?',
      answer: 'Because the victim genuinely performs the click in their own authenticated session — the request includes the legitimate token and session. The attack hijacks intent, not authentication, so token checks pass.',
      explanation: 'This distinction (intent vs authentication) is the key intermediate insight.',
    },
    {
      level: 'intermediate',
      question: 'Difference between frame-ancestors and X-Frame-Options?',
      answer: 'frame-ancestors (CSP) is modern, supports an allowlist of multiple origins, and is the authoritative control. X-Frame-Options is legacy with only DENY/SAMEORIGIN (ALLOW-FROM is deprecated/unsupported). Set both for coverage; frame-ancestors wins where supported.',
      explanation: 'Knowing X-Frame-Options can\'t express a multi-origin allowlist is the differentiating detail.',
    },
    {
      level: 'advanced',
      question: 'What is "frame busting" and why is it unreliable?',
      answer: 'Frame busting is JS that tries to break out of frames (e.g. if (top !== self) top.location = self.location). It is unreliable because attackers can use the sandbox attribute to disable navigation, double-framing, or onbeforeunload tricks to defeat it. Header-based frame-ancestors is the robust solution.',
      explanation: 'Recognizing that JS frame busting is bypassable and headers are authoritative is senior-leaning.',
    },
    {
      level: 'senior',
      question: 'Beyond classic clickjacking, what related UI-redress variants exist?',
      answer: 'Likejacking (hijacking social like/follow buttons), cursorjacking (faking the cursor position), drag-and-drop jacking (exfiltrating data via dragged content), and keystroke/tapjacking on mobile. All exploit misperceived UI; defenses are frame protection, SameSite cookies, and requiring unambiguous confirmation/re-auth for sensitive actions.',
      explanation: 'Breadth of UI-redress variants plus layered defenses signals senior depth.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is clickjacking different from CSRF and XSS?',
    'Can SameSite cookies help mitigate clickjacking?',
    'What does the iframe sandbox attribute do, and can it be used offensively?',
    'How would you protect a page that legitimately needs to be embedded by a partner?',
    'Why is X-Frame-Options ALLOW-FROM unreliable?',
    'How do you test whether your site is frameable?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Relying on JavaScript frame-busting instead of headers.',
      why: 'Frame busting is bypassable via sandbox, double-framing, and event tricks.',
      fix: 'Use the CSP frame-ancestors header (plus X-Frame-Options) as the authoritative defense.',
    },
    {
      mistake: 'Setting X-Frame-Options ALLOW-FROM to permit a partner.',
      why: 'ALLOW-FROM is deprecated and unsupported in modern browsers, so the protection silently fails or over-blocks.',
      fix: 'Use frame-ancestors with an explicit origin allowlist instead.',
    },
    {
      mistake: 'Assuming CSRF protection or HTTPS covers clickjacking.',
      why: 'The victim\'s click is legitimate and authenticated; tokens and TLS do nothing against hijacked intent.',
      fix: 'Add frame protection headers and require explicit re-confirmation for high-risk actions.',
    },
    {
      mistake: 'Protecting only the home page, not sensitive sub-pages.',
      why: 'Attackers frame the exact confirm/settings page, which may lack the header.',
      fix: 'Apply frame-ancestors globally via middleware/edge so every route is covered.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Backend', detail: 'Frame-protection headers are set globally at the app or edge/CDN layer; sensitive flows (payments, settings) additionally require explicit confirmation or re-auth.' },
    { area: 'Node.js', detail: 'Express apps use helmet.frameguard + CSP frame-ancestors; partner-embeddable pages use a narrow frame-ancestors allowlist.' },
    { area: 'React', detail: 'Next.js sets frame-ancestors via headers()/middleware; embeddable widgets are served from a separate origin with their own framing policy.' },
    { area: 'Vue', detail: 'Nuxt/Vite-served apps rely on server/CDN headers for frame protection; admin and checkout pages forbid framing entirely.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Frame-protection headers are essentially free — a few bytes and a browser load-time check.',
      'Blocking framing prevents wasteful rendering of your page inside hostile contexts.',
    ],
    bad: [
      'Overly strict frame-ancestors can break legitimate embeds (support widgets, dashboards), causing reload loops if combined with frame busting.',
      'Per-page divergent policies add maintenance overhead and risk gaps.',
    ],
    optimizations: [
      'Set frame protection once globally at the edge/CDN to avoid per-service drift.',
      'Use a tight frame-ancestors allowlist for genuinely embeddable pages, deny elsewhere.',
      'Avoid JS frame busting entirely (slower, bypassable) in favor of headers.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Unintended sensitive actions (transfer, follow, purchase, permission grant) performed via hijacked clicks.',
      'Likejacking/cursorjacking/drag-jacking variants exfiltrating engagement or data.',
      'Bypass of CSRF defenses since the request is legitimately authenticated.',
    ],
    bestPractices: [
      "Set Content-Security-Policy: frame-ancestors 'none' (or a tight allowlist) on all pages, especially sensitive ones.",
      'Add X-Frame-Options DENY/SAMEORIGIN for legacy browser coverage.',
      'Require explicit, unambiguous confirmation or re-authentication for high-risk actions.',
      'Use SameSite cookies and avoid relying on bypassable JS frame busting.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['dom', 'event-system', 'csrf'],
    nextConcepts: ['csp', 'cors', 'secure-token-storage'],
    dependencyNote:
      'Clickjacking is a UI-layer attack that builds on understanding the DOM, iframes, and events, and it contrasts with CSRF (which it can bypass). Its primary defense, frame-ancestors, lives in CSP, so learn CSP alongside it.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the attacker page with a visible "Win a prize" button.',
      'Draw an invisible iframe of the real target on top, aligning its Confirm button over the decoy.',
      'Show the victim\'s click passing through to the real button.',
      'Note CSRF tokens do not help — the click is genuine and authenticated.',
      "Add the defense: target sends frame-ancestors 'none' so the browser won't frame it.",
      'Say: "Clickjacking hijacks intent via an invisible overlay; the fix is to forbid framing with frame-ancestors plus X-Frame-Options."',
    ],
    diagram: `  SEEN:  [ Win a prize! ]        ← decoy on attacker.com
  REAL:  <iframe opacity:0 src=target/confirm>
              [ CONFIRM ] ← under the cursor
  click → hits CONFIRM in victim's session
  FIX:  Content-Security-Policy: frame-ancestors 'none'`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Clickjacking loads your real, logged-in page in an invisible iframe and overlays a decoy, so the victim\'s genuine click hits a hidden control in their own session. CSRF tokens do not help because the click is legitimate and authenticated. Defend by forbidding framing: Content-Security-Policy frame-ancestors \'none\' (or a tight allowlist) plus the legacy X-Frame-Options DENY. Avoid bypassable JS frame busting.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Clickjacking, or a UI redress attack, tricks a user into clicking something different from what they perceive. The attacker loads your real, authenticated page inside a transparent iframe on their malicious site, then positions a sensitive control — like a Confirm Transfer button — directly under a tempting decoy such as "Click to win a prize". The iframe is set to near-zero opacity, so the victim only sees the decoy, but their click is routed to the topmost element at that coordinate, which is the hidden real button. Because the click is genuine and happens inside the victim\'s own session, the action executes. Crucially, CSRF tokens provide no protection: the request carries the legitimate token and session, so server checks pass. The attack hijacks intent, not authentication. The robust defense is to tell the browser who may frame the page. The modern control is the Content-Security-Policy frame-ancestors directive — \'none\' to forbid all framing, \'self\' for same-origin only, or an explicit allowlist for trusted partners. For legacy browsers you also set X-Frame-Options to DENY or SAMEORIGIN, though it can\'t express a multi-origin allowlist, which is why frame-ancestors is authoritative. I avoid JavaScript frame busting because it\'s bypassable via the sandbox attribute and double-framing. For high-risk actions I also require explicit confirmation or re-authentication as defense in depth.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      "frame-ancestors 'none' is safest but breaks any legitimate embedding; an allowlist is more flexible but must be maintained carefully.",
      'Requiring re-auth/confirmation on sensitive actions adds friction but defeats hijacked single clicks.',
    ],
    edgeCases: [
      'X-Frame-Options ALLOW-FROM is deprecated/unsupported — multi-origin embedding requires frame-ancestors.',
      'Double-framing and the iframe sandbox attribute can defeat JS frame busting.',
      'Cursorjacking and drag-and-drop jacking are variants that frame protection alone may not fully address.',
      'Conflicting CSP and X-Frame-Options: where both exist, frame-ancestors takes precedence in modern browsers.',
    ],
    runtimeBehavior: [
      'The browser evaluates frame-ancestors at load and refuses to render the framed document if the embedder is disallowed.',
      'Pointer events are delivered to the topmost element at the coordinate, which is why a transparent overlay still receives the click.',
      'SameSite=Lax/Strict cookies may not be sent in some cross-site framed contexts, incidentally reducing some attacks.',
    ],
    scalability: [
      'Centralizing frame headers at the edge/CDN guarantees uniform coverage across many services and new routes.',
      'A documented, version-controlled embedding allowlist prevents ad-hoc widening over time.',
    ],
    productionConcerns: [
      'Audit that EVERY sensitive route emits the header, not just the landing page.',
      'Test embeddability regularly (try framing the page) as part of security CI.',
      'Coordinate with teams that legitimately embed content so allowlists stay accurate.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Clickjacking = invisible iframe overlay hijacks a real, authenticated click.',
    'Also called UI redress attack.',
    'CSRF tokens do NOT help (the click is genuine + authenticated).',
    "Primary defense: CSP frame-ancestors 'none' / 'self' / allowlist.",
    'Legacy defense: X-Frame-Options DENY / SAMEORIGIN.',
    'X-Frame-Options can\'t do multi-origin allowlists → use frame-ancestors.',
    'Avoid JS frame busting (bypassable via sandbox/double-framing).',
    'Apply protection globally, including sensitive sub-pages.',
    'Variants: likejacking, cursorjacking, drag-jacking, tapjacking.',
    'Add re-auth/confirmation for high-risk actions.',
    'Set headers at the edge/CDN for uniform coverage.',
    'frame-ancestors takes precedence over X-Frame-Options where both exist.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write the HTTP headers that forbid your page from being framed by any site.',
      hint: 'Use frame-ancestors plus the legacy header.',
      solution: {
        lang: 'http',
        code: `Content-Security-Policy: frame-ancestors 'none'\nX-Frame-Options: DENY`,
        explanation: [
          "frame-ancestors 'none' is the modern, authoritative control forbidding all framing.",
          'X-Frame-Options: DENY covers older browsers that lack CSP frame-ancestors support.',
          'Together they give broad coverage.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write Express middleware that denies framing globally and exposes a helper to allow a specific partner on one route.',
      hint: 'Default to none; override frame-ancestors for the partner route.',
      solution: {
        lang: 'js',
        code: `function frameGuard(allow = \"'none'\") {\n  return (req, res, next) => {\n    res.setHeader('Content-Security-Policy', 'frame-ancestors ' + allow)\n    if (allow === \"'none'\") res.setHeader('X-Frame-Options', 'DENY')\n    next()\n  }\n}\n\napp.use(frameGuard())                       // deny everywhere by default\napp.get('/embed', frameGuard(\"'self' https://partner.com\")) // allow partner here`,
        explanation: [
          'The default middleware denies framing and sets both headers.',
          'The /embed route overrides frame-ancestors with a tight allowlist for the partner.',
          'X-Frame-Options is only set for the deny case since it can\'t express the allowlist.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write defensive client-side frame-busting as a LAST resort, and explain why headers are still required.',
      hint: 'Compare top vs self; but note bypasses.',
      solution: {
        lang: 'js',
        code: `// Last-resort only; NOT a substitute for headers\nif (window.top !== window.self) {\n  try {\n    window.top.location = window.self.location // try to break out\n  } catch (e) {\n    document.body.style.display = 'none' // at least hide the content\n  }\n}`,
        explanation: [
          'This detects being framed and tries to navigate the top window out, hiding content if blocked.',
          'It is unreliable: an attacker can use the iframe sandbox attribute to block navigation, or double-frame to defeat it.',
          'Therefore frame-ancestors / X-Frame-Options headers remain the authoritative, non-bypassable defense.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A reviewer asks you to make a "buy now" confirmation page safe from clickjacking. Describe and implement the full defense.',
      hint: 'Headers + explicit confirmation.',
      solution: {
        lang: 'js',
        code: `// 1. Forbid framing of the sensitive page\napp.get('/checkout/confirm', (req, res, next) => {\n  res.setHeader('Content-Security-Policy', \"frame-ancestors 'none'\")\n  res.setHeader('X-Frame-Options', 'DENY')\n  next()\n}, renderConfirm)\n\n// 2. Require an explicit, fresh confirmation token submitted by the form\n//    (a single hijacked click can't supply a value it can't see)\n// 3. Optionally re-authenticate for high-value purchases\n// 4. Set the session cookie SameSite=Strict`,
        explanation: [
          'frame-ancestors none + X-Frame-Options DENY stop the page being framed at all — the root defense.',
          'Requiring a value the attacker cannot see/predict means a single blind click cannot complete the purchase.',
          'Re-auth and SameSite=Strict add defense-in-depth for high-value actions.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Clickjacking shows you think about attacks at the UI/perception layer, not just the network — and that you know CSRF tokens are not a universal shield. Articulating frame-ancestors vs X-Frame-Options is a clean, memorable answer.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and the defense header. Product companies (Zoho, Flipkart, Razorpay) ask why CSRF tokens fail and how to protect a checkout flow. FAANG-level interviews probe frame-busting bypasses, allowlisting partners, and UI-redress variants.',
    whatInterviewersExpect:
      'They expect you to describe the invisible-iframe overlay, explain that the click is genuine so CSRF tokens do not help, and give the header defenses (frame-ancestors + X-Frame-Options) plus defense-in-depth like re-confirmation.',
  },
}

export default clickjacking
