import type { ConceptLesson } from '../../../types/lesson'

const csp: ConceptLesson = {
  // 1. Concept Summary
  slug: 'csp',
  name: 'Content Security Policy',
  category: 'security',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'CSP is the browser\'s last line of defense against XSS — even if an injection slips through, a good policy can stop the injected script from executing.',
    'It lets you declare exactly which sources of scripts, styles, images, and connections are allowed, turning "trust everything" into "trust this list".',
    'A well-crafted CSP neutralizes inline-script attacks, the most common XSS payload vector.',
    'Interviewers use CSP to gauge whether you think in defense-in-depth layers rather than relying on a single mitigation.',
    'It also enables reporting: you get telemetry on attempted injections via report-uri/report-to before they cause harm.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'CSP is a strict list on the fridge of which shops the family is allowed to order food from.',
    story: [
      'Imagine your family only trusts a few specific shops for food, and the rule is taped to the fridge.',
      'If a stranger slips a flyer under the door saying "order from this random kitchen", everyone ignores it — that kitchen is not on the list.',
      'Even if the flyer looks very convincing, the rule wins: no order goes to a place that is not approved.',
      'A web page works the same way with CSP: the page declares which websites it is allowed to load scripts and content from, so even if a sneaky script gets injected, the browser refuses to run anything from an unapproved source.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A web page loads scripts, images, and styles from various places. Attackers try to sneak in their own malicious script.',
    'Content Security Policy is a rule the server sends in a header telling the browser exactly which sources are allowed for each kind of resource.',
    'If something tries to load from a source not on the list — or runs inline script when inline is disallowed — the browser blocks it.',
    'So even if an attacker manages to inject a script tag, CSP can prevent it from actually running, acting as a safety net behind your other protections.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Content Security Policy (CSP) is a browser security layer, delivered via the Content-Security-Policy HTTP header (or a meta tag), that whitelists the origins and conditions under which a page may load and execute resources like scripts, styles, images, fonts, and network connections.',
    how: 'The server sends a header listing directives such as script-src and style-src with allowed sources. The browser enforces them: any resource or inline code violating the policy is blocked and (optionally) reported.',
    why: 'Browsers trust by default — a page will run any script tag it finds. CSP flips that to deny-by-default for the sources you specify, so injected or third-party code cannot execute unless explicitly allowed, sharply limiting XSS impact.',
    code: {
      label: 'A basic CSP header',
      lang: 'http',
      code: `Content-Security-Policy:\n  default-src 'self';\n  script-src 'self' https://cdn.trusted.com;\n  style-src 'self' 'unsafe-inline';\n  img-src 'self' data:;\n  connect-src 'self' https://api.myapp.com;\n  object-src 'none';\n  base-uri 'self'`,
      explanation: [
        "default-src 'self' is the fallback: only same-origin resources unless a more specific directive overrides it.",
        'script-src allows scripts only from your own origin and one trusted CDN — inline scripts are blocked because they are not listed.',
        "img-src 'self' data: permits same-origin images plus inline data: URIs.",
        'connect-src restricts where fetch/XHR/WebSocket can talk, limiting exfiltration channels.',
        "object-src 'none' disables plugins (Flash/embeds), and base-uri 'self' blocks <base> tag hijacking.",
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Content Security Policy is a declarative, browser-enforced security mechanism delivered via the Content-Security-Policy response header (or a <meta http-equiv> tag) that constrains the resources a document may fetch and execute through a set of directives (script-src, style-src, img-src, connect-src, frame-ancestors, etc.). It implements deny-by-default for inline code and arbitrary sources, supports cryptographic nonces and hashes to allow specific inline scripts, and offers a report-only mode plus reporting endpoints. As a defense-in-depth control it primarily mitigates XSS and data-injection by preventing unauthorized script execution and connections, and mitigates clickjacking via frame-ancestors.',

  // 7. Internal Working
  internalWorking: [
    'On receiving a document, the browser parses the Content-Security-Policy header(s) into a set of directives and their allowed source lists.',
    'As the parser encounters each resource (script, style, image, fetch, frame), it checks the request against the relevant directive (falling back to default-src if no specific one exists).',
    'For inline scripts/styles, the browser blocks them unless the policy contains a matching nonce, a matching hash, or the (discouraged) unsafe-inline keyword.',
    'Any resource or execution that violates the policy is blocked before it runs, and the browser may dispatch a securitypolicyviolation event and POST a report to report-to/report-uri.',
    'In report-only mode the browser does NOT block — it only reports — letting teams tune a policy on real traffic before enforcing it.',
    'Multiple CSP headers are combined as an intersection: a resource must satisfy ALL policies, so adding a second header can only tighten, never loosen.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  Server ──► Content-Security-Policy: script-src 'self' cdn.ok.com
                          │
                          ▼
              ┌───────────────────────┐
   Page loads │  browser CSP engine    │
   resources  │  checks each request   │
   ───────────►                        │
   self.js    │  'self' allowed   ✔ run │
   cdn.ok.com │  listed           ✔ run │
   evil.com   │  NOT listed       ✘ block + report
   inline <s> │  no nonce/hash    ✘ block + report
              └───────────────────────┘`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — blocking inline script with nonces',
      lang: 'html',
      code: `<!-- Server sends: Content-Security-Policy: script-src 'nonce-abc123' -->\n<script nonce="abc123">\n  console.log('this runs — nonce matches')\n</script>\n\n<script>\n  console.log('this is BLOCKED — no nonce')\n</script>`,
      explanation: [
        'The server generates a fresh random nonce per response and puts it in both the header and the trusted <script>.',
        'Only scripts whose nonce attribute matches the header nonce execute.',
        'An attacker who injects a script tag cannot guess the per-request nonce, so their inline script is blocked.',
        'Nonces are the modern, safe alternative to unsafe-inline.',
      ],
    },
    intermediate: {
      label: 'Intermediate — report-only mode for safe rollout',
      lang: 'js',
      code: `// Express: ship a policy in report-only first to find violations\napp.use((req, res, next) => {\n  res.setHeader(\n    'Content-Security-Policy-Report-Only',\n    \"default-src 'self'; script-src 'self'; report-uri /csp-report\"\n  )\n  next()\n})\n\napp.post('/csp-report', express.json({ type: '*/*' }), (req, res) => {\n  console.warn('CSP violation:', req.body)\n  res.sendStatus(204)\n})`,
      explanation: [
        'Report-Only enforces nothing but logs every would-be violation, so you can audit real traffic.',
        'The /csp-report endpoint receives JSON reports describing the blocked resource and directive.',
        'Once the reports are clean (no legitimate resources flagged), you switch the header to the enforcing Content-Security-Policy.',
        'This staged rollout avoids breaking production with an over-strict policy.',
      ],
    },
    advanced: {
      label: 'Advanced — strict CSP with nonces + strict-dynamic',
      lang: 'js',
      code: `import crypto from 'node:crypto'\n\napp.use((req, res, next) => {\n  const nonce = crypto.randomBytes(16).toString('base64')\n  res.locals.nonce = nonce\n  res.setHeader(\n    'Content-Security-Policy',\n    [\n      \"default-src 'self'\",\n      \"script-src 'nonce-\" + nonce + \"' 'strict-dynamic' https:\",\n      \"object-src 'none'\",\n      \"base-uri 'none'\",\n      \"frame-ancestors 'none'\",\n    ].join('; ')\n  )\n  next()\n})`,
      explanation: [
        'A fresh nonce per request is exposed via res.locals for templates to stamp on trusted scripts.',
        "'strict-dynamic' lets a nonce-trusted script load further scripts it creates, so you do not have to allowlist every CDN.",
        "object-src 'none' and base-uri 'none' close common bypass vectors.",
        "frame-ancestors 'none' also gives clickjacking protection, replacing X-Frame-Options.",
        'This nonce + strict-dynamic shape is the OWASP-recommended modern strict CSP.',
      ],
    },
    realProject: {
      label: 'Real project — CSP for a Vue SPA via helmet',
      lang: 'js',
      code: `import helmet from 'helmet'\n\napp.use(\n  helmet.contentSecurityPolicy({\n    directives: {\n      defaultSrc: [\"'self'\"],\n      scriptSrc: [\"'self'\"],\n      styleSrc: [\"'self'\", \"'unsafe-inline'\"], // Vue injects some styles\n      imgSrc: [\"'self'\", 'data:', 'https://cdn.shop.com'],\n      connectSrc: [\"'self'\", 'https://api.shop.com', 'wss://realtime.shop.com'],\n      objectSrc: [\"'none'\"],\n      frameAncestors: [\"'none'\"],\n    },\n  })\n)`,
      explanation: [
        'helmet generates the header from a readable config, the de-facto Node.js standard.',
        "Vue/React often need 'unsafe-inline' for styles unless you adopt nonces for styles too — a known SPA tradeoff.",
        'connect-src must include your API and any WebSocket endpoints or the app breaks.',
        "frameAncestors 'none' protects against clickjacking in the same policy.",
        'Bundled JS served from your own origin satisfies script-src \"self\" without inline code.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is Content Security Policy and what attack does it primarily defend against?',
      answer: 'CSP is a browser-enforced policy, sent via an HTTP header, that whitelists which sources of scripts and other resources a page may load and execute. It primarily mitigates XSS by blocking unauthorized and inline scripts.',
      explanation: 'Tying CSP to XSS mitigation and "browser-enforced whitelist" is the core expected answer.',
    },
    {
      level: 'beginner',
      question: 'How does CSP relate to other XSS defenses?',
      answer: 'It is defense-in-depth — a safety net. You still sanitize/encode output and avoid dangerous sinks; CSP catches what slips through by preventing injected script from executing.',
      explanation: 'Good answers stress CSP is a second layer, not a replacement for proper output handling.',
    },
    {
      level: 'intermediate',
      question: 'Why are nonces or hashes preferred over unsafe-inline?',
      answer: 'unsafe-inline allows ALL inline scripts, including injected ones, defeating the purpose. A nonce (random per-response token) or a hash allows only the specific inline scripts you trust, which an attacker cannot reproduce or predict.',
      explanation: 'Explaining that unsafe-inline reopens the XSS hole is the key insight.',
    },
    {
      level: 'intermediate',
      question: 'What is CSP report-only mode used for?',
      answer: 'It enforces nothing but reports violations, letting you deploy a candidate policy against real traffic, see what would break, and tune it before flipping to enforcement.',
      explanation: 'Mentioning staged rollout shows production maturity.',
    },
    {
      level: 'advanced',
      question: 'What does strict-dynamic do and why is it useful?',
      answer: 'strict-dynamic propagates trust: a script loaded via a valid nonce/hash can load further scripts it creates, ignoring host allowlists. This frees you from maintaining brittle CDN allowlists while keeping inline injection blocked.',
      explanation: 'This is the modern OWASP strict-CSP recommendation; knowing it signals current best practice.',
    },
    {
      level: 'senior',
      question: 'How can a CSP be bypassed and how do you harden against it?',
      answer: 'Common bypasses: allowlisting a CDN that hosts JSONP or Angular/AngularJS gadget scripts, an open redirect on an allowlisted origin, dangling base-uri, or unsafe-eval enabling string-to-code. Harden with nonce + strict-dynamic (drop host allowlists), object-src none, base-uri none, and avoid unsafe-eval; verify with the CSP Evaluator.',
      explanation: 'Senior signal: naming concrete gadget/JSONP/base-uri bypasses, not just "use CSP".',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between CSP and CORS?',
    'How do nonces get generated and matched per request?',
    'What does frame-ancestors do and how does it relate to X-Frame-Options?',
    'Why is allowlisting a popular CDN sometimes dangerous?',
    'How would you roll out a strict CSP to a large legacy app without breaking it?',
    'What does the connect-src directive restrict and why does it matter for data exfiltration?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using script-src with unsafe-inline to make the app "just work".',
      why: 'It allows every inline script, including injected ones, so the CSP no longer mitigates XSS.',
      fix: 'Use per-request nonces (or hashes) for the inline scripts you trust, and prefer strict-dynamic.',
    },
    {
      mistake: 'Allowlisting a broad CDN or "https:" for script-src.',
      why: 'CDNs may host JSONP endpoints or framework "gadgets" attackers can abuse to execute code within your allowlist.',
      fix: 'Use nonce + strict-dynamic so trust flows from your scripts, not from host allowlists.',
    },
    {
      mistake: 'Forgetting connect-src, so the policy looks strict but data can still be exfiltrated.',
      why: 'Without connect-src, injected code (if it runs) can POST stolen data anywhere.',
      fix: 'Restrict connect-src to your known API/WebSocket origins.',
    },
    {
      mistake: 'Deploying a strict policy straight to production.',
      why: 'Legitimate resources get blocked, breaking the app for users.',
      fix: 'Roll out in Content-Security-Policy-Report-Only first, analyze reports, then enforce.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'helmet.contentSecurityPolicy generates the header from a config object; teams pair it with a nonce middleware injected into templates.' },
    { area: 'Vue', detail: 'Nuxt has a security module / runtime hook to set CSP; bundled JS served from same origin satisfies script-src "self", with nonces for any inline boot script.' },
    { area: 'React', detail: 'Next.js sets CSP via headers() in next.config or middleware, often using nonces passed through to inline scripts and strict-dynamic for chunk loading.' },
    { area: 'Backend', detail: 'Edge/CDN platforms (Cloudflare, Fastly) and reverse proxies (NGINX) commonly inject CSP headers centrally, with report-to endpoints feeding a monitoring pipeline.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'CSP enforcement is essentially free at runtime — it is a header parse plus per-request checks the browser already performs.',
      'Blocking unauthorized third-party/connect requests can incidentally reduce wasted network calls.',
    ],
    bad: [
      'Per-request nonce generation adds a tiny CPU cost and forces dynamic (uncacheable) HTML for nonce-bearing pages.',
      'Overly strict connect-src/img-src can break lazy-loaded resources, causing failed loads and retries.',
    ],
    optimizations: [
      'Cache static assets separately from nonce-bearing HTML so only the small HTML doc is uncacheable.',
      'Use report-to with sampling to avoid flooding your endpoint under attack or heavy traffic.',
      'Prefer hashes for fixed inline scripts so the HTML can stay cacheable (no per-request nonce).',
      'Consolidate the policy at the edge to avoid recomputing it per service.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'unsafe-inline / unsafe-eval re-enable the very injection vectors CSP exists to stop.',
      'Allowlisted CDNs with JSONP or framework gadgets, and open redirects on trusted origins, provide CSP bypasses.',
      'A missing base-uri or object-src directive leaves classic bypass vectors open.',
    ],
    bestPractices: [
      'Adopt a strict nonce + strict-dynamic policy; set object-src "none" and base-uri "none".',
      'Roll out via report-only, monitor violations, then enforce.',
      'Use frame-ancestors "none"/allowlist for clickjacking protection and connect-src to limit exfiltration.',
      'Validate the policy with tools like Google\'s CSP Evaluator and treat CSP as one layer alongside output encoding.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['xss', 'cors', 'dom'],
    nextConcepts: ['clickjacking', 'secure-token-storage', 'supply-chain-security'],
    dependencyNote:
      'CSP is the browser-side capstone of XSS defense and pairs with clickjacking (frame-ancestors) and supply-chain protections. Understand XSS and how the browser loads resources (DOM, CORS) first; CSP then constrains all of it.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the header: script-src \'self\' \'nonce-abc\'.',
      'Draw the page loading several scripts: self.js, cdn.evil.com, an inline tag with the right nonce, and one without.',
      'Check each: self ✔, evil ✘ (not listed), inline-with-nonce ✔, inline-without ✘.',
      'Point out the blocked ones also fire a violation report.',
      'Add strict-dynamic and explain trust propagation from the nonce\'d script.',
      'Say: "CSP is deny-by-default for sources and inline code — even if XSS injects a tag, no matching nonce means it never runs."',
    ],
    diagram: `  script-src 'self' 'nonce-abc' 'strict-dynamic'
     self.js          ✔
     cdn.evil.com     ✘ block + report
     <script nonce=abc> ✔
     <script>(injected)</script> ✘ block + report`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'CSP is a browser-enforced, deny-by-default allowlist sent via the Content-Security-Policy header. Directives like script-src and connect-src say which sources may load/execute; inline scripts are blocked unless they carry a matching per-request nonce or hash. It is defense-in-depth for XSS — even an injected tag will not run without the nonce. Modern best practice is nonce + strict-dynamic, object-src none, base-uri none, rolled out via report-only first.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Content Security Policy is a browser-enforced security layer delivered through the Content-Security-Policy header. It flips the browser\'s default-trust model to deny-by-default for the resources you specify. You declare directives — script-src, style-src, img-src, connect-src, frame-ancestors, and so on — each with an allowlist of sources, and the browser blocks anything that does not match. Its primary value is mitigating XSS: even if an attacker injects a script tag, CSP can stop it from executing. The key to making that work is handling inline scripts. unsafe-inline is dangerous because it allows every inline script, including injected ones, so the modern approach is a per-request nonce or a hash: only scripts carrying the matching random nonce run, and an attacker cannot guess it. With strict-dynamic, trust propagates from a nonce-trusted script to scripts it loads, so you can drop brittle host allowlists, which themselves are bypass vectors via JSONP or framework gadgets. I treat CSP as defense-in-depth, never a replacement for output encoding. Operationally I roll it out in report-only mode, collect violation reports against real traffic, fix the noise, then switch to enforcing. I also set object-src none, base-uri none to close common bypasses, frame-ancestors for clickjacking, and connect-src to limit where data can be exfiltrated.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Strict nonce-based CSP is the strongest but forces dynamic, less-cacheable HTML and template plumbing; hash-based policies keep HTML cacheable but are rigid.',
      'Host allowlists are easy to author but fragile and bypassable; strict-dynamic is safer but requires understanding trust propagation.',
    ],
    edgeCases: [
      'Multiple CSP headers intersect — a second policy can only tighten, useful for layered ownership.',
      'strict-dynamic ignores host-source allowlists in supporting browsers, but older browsers fall back to the allowlist, so you keep both.',
      'Inline event handlers (onclick=) and javascript: URLs are blocked by a nonce policy — legacy code must be refactored.',
      'data: and blob: in script-src can be abused; avoid them.',
    ],
    runtimeBehavior: [
      'Violations fire a securitypolicyviolation DOM event and optionally POST a report, enabling attack telemetry.',
      'Report-only never blocks, so a misconfigured report-only policy gives a false sense of protection.',
      'CSP is parsed and applied at document load; meta-tag CSP cannot use some directives (e.g. frame-ancestors, report-uri).',
    ],
    scalability: [
      'Centralizing CSP at the edge avoids per-service drift, but per-request nonces still require origin-level cooperation.',
      'High-traffic sites should sample CSP reports to avoid overwhelming the reporting endpoint, especially during an attack.',
    ],
    productionConcerns: [
      'Run the policy through CSP Evaluator and monitor reports; a single unsafe-inline or broad CDN can silently neuter it.',
      'Coordinate CSP with third-party widgets/analytics that inject scripts — they often force unsafe relaxations.',
      'Document and version the policy; ad-hoc relaxations to "fix" a broken feature erode security over time.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'CSP = browser-enforced deny-by-default allowlist via Content-Security-Policy header.',
    'Primary purpose: mitigate XSS (defense-in-depth, not a replacement for encoding).',
    'Key directives: default-src, script-src, style-src, img-src, connect-src, frame-ancestors, object-src, base-uri.',
    'default-src is the fallback for unspecified resource types.',
    "Avoid 'unsafe-inline'/'unsafe-eval' — they reopen XSS.",
    'Use per-request nonces or hashes for trusted inline scripts.',
    "'strict-dynamic' propagates trust and lets you drop host allowlists.",
    'frame-ancestors → clickjacking protection (replaces X-Frame-Options).',
    'connect-src limits fetch/XHR/WebSocket exfiltration targets.',
    'Roll out with Content-Security-Policy-Report-Only first, then enforce.',
    'Multiple CSP headers intersect (can only tighten).',
    "Set object-src 'none' and base-uri 'none' to close bypasses.",
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a CSP header string that allows scripts/styles/images only from the same origin and disables plugins.',
      hint: "Use default-src 'self' and object-src 'none'.",
      solution: {
        lang: 'http',
        code: `Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'`,
        explanation: [
          "default-src 'self' covers script/style/img/connect with same-origin only.",
          "object-src 'none' disables plugins/embeds, base-uri 'self' blocks <base> hijacking.",
          'This is a sensible minimal locked-down baseline.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write Express middleware that generates a per-request nonce and emits a script-src policy using it.',
      hint: 'crypto.randomBytes, store on res.locals, interpolate into the header.',
      solution: {
        lang: 'js',
        code: `import crypto from 'node:crypto'\nfunction csp(req, res, next) {\n  const nonce = crypto.randomBytes(16).toString('base64')\n  res.locals.nonce = nonce\n  res.setHeader(\n    'Content-Security-Policy',\n    \"default-src 'self'; script-src 'self' 'nonce-\" + nonce + \"'; object-src 'none'\"\n  )\n  next()\n}`,
        explanation: [
          'A fresh nonce per request means an attacker cannot predict it for the next response.',
          'Templates read res.locals.nonce and stamp it onto trusted <script nonce> tags.',
          'Only those scripts execute; injected inline scripts without the nonce are blocked.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Set up a report-only CSP plus an endpoint that logs violations as JSON.',
      hint: 'Use Content-Security-Policy-Report-Only and report-uri.',
      solution: {
        lang: 'js',
        code: `app.use((req, res, next) => {\n  res.setHeader(\n    'Content-Security-Policy-Report-Only',\n    \"default-src 'self'; script-src 'self'; report-uri /csp-report\"\n  )\n  next()\n})\napp.post('/csp-report', express.json({ type: ['application/csp-report', 'application/json'] }), (req, res) => {\n  console.warn('CSP violation', JSON.stringify(req.body))\n  res.sendStatus(204)\n})`,
        explanation: [
          'Report-Only enforces nothing, so production keeps working while you collect data.',
          'The endpoint parses the CSP report body (a specific content type) and logs it.',
          'After violations are clean, swap the header to the enforcing Content-Security-Policy.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A reviewer flags a policy "script-src \'self\' https: \'unsafe-inline\'". Explain what is wrong and rewrite it as a strict modern policy.',
      hint: "unsafe-inline + broad https: are both bypassable.",
      solution: {
        lang: 'http',
        code: `# WEAK: 'unsafe-inline' allows injected inline scripts; 'https:' trusts any HTTPS host\n# script-src 'self' https: 'unsafe-inline'\n\n# STRICT (per request nonce):\nContent-Security-Policy:\n  default-src 'self';\n  script-src 'nonce-RANDOM' 'strict-dynamic' https:;\n  object-src 'none';\n  base-uri 'none';\n  frame-ancestors 'none'`,
        explanation: [
          "'unsafe-inline' defeats CSP's main job because injected inline scripts would run.",
          "'https:' trusts every HTTPS origin, including ones hosting JSONP/gadgets — effectively no allowlist.",
          'The strict version uses a per-request nonce with strict-dynamic (the https: there is only a fallback for old browsers) plus object-src/base-uri/frame-ancestors hardening.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'CSP shows you think in layers: even after sanitization, you assume something will slip through and you have a net to catch it. That defense-in-depth mindset is exactly what senior security-aware engineers demonstrate.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) may just ask "what is CSP and what does it protect against". Product companies (Zoho, Flipkart, Razorpay) ask about nonces vs unsafe-inline and rollout strategy. FAANG-level interviews probe strict-dynamic, allowlist bypasses, and how to migrate a large app safely.',
    whatInterviewersExpect:
      'They expect you to frame CSP as deny-by-default defense-in-depth against XSS, explain nonces/hashes vs unsafe-inline, describe report-only rollout, and ideally name modern strict-CSP (nonce + strict-dynamic) and a real bypass.',
  },
}

export default csp
