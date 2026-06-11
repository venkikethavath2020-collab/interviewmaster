import type { ConceptLesson } from '../../../types/lesson'

const xss: ConceptLesson = {
  // 1. Concept Summary
  slug: 'xss',
  name: 'Cross-Site Scripting',
  category: 'security',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'XSS is one of the most common and damaging web vulnerabilities: attacker-controlled JavaScript runs in your users\' browsers, with full access to their session, cookies, and the DOM.',
    'A single XSS hole can steal auth tokens, perform actions as the victim, deface pages, keylog, or pivot into account takeover — it defeats most client-side trust.',
    'It exists because browsers cannot tell your trusted markup from data an attacker injected; if you render untrusted input as HTML/JS, the browser executes it.',
    'Interviewers ask it because it tests whether you understand the browser security model, output encoding, the difference between stored/reflected/DOM XSS, and defenses like CSP and sanitization.',
    'Frameworks auto-escape by default, but every escape hatch (v-html, dangerouslySetInnerHTML, innerHTML, eval) re-opens the door — knowing where the danger is keeps real apps safe.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'XSS is like sneaking a fake note into the school announcement box so the principal reads YOUR secret message to the whole school as if it were official.',
    story: [
      'Imagine every morning the principal reads out announcements that students drop in a box, trusting they are all polite and real.',
      'A sneaky kid writes a note that says "everyone hand your lunch money to me" and drops it in the box.',
      'The principal, trusting the box, reads it out loud over the speakers — and because it came from the official speakers, everyone believes it and obeys.',
      'XSS is the same trick on a website: an attacker slips in a sneaky message (code), and because the website shows it as if it were its own, the browser "reads it out" and does whatever the attacker wrote.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Websites often show things that users typed — comments, names, search terms. Normally that is just text.',
    'But if the website is careless and puts that text directly into the page as code, an attacker can type in actual JavaScript instead of a normal comment.',
    'The browser cannot tell the difference, so it runs the attacker\'s code as if the website wrote it — that is Cross-Site Scripting (XSS).',
    'Once attacker code runs in your browser, it can steal your login session or do things pretending to be you. The fix is to treat user input as plain text, not as code, and to limit what scripts are allowed to run.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'XSS (Cross-Site Scripting) is an injection vulnerability where attacker-supplied data is rendered as executable script/markup in a victim\'s browser, running in the site\'s origin. Main types: stored (persisted, e.g. in a comment), reflected (echoed from the request, e.g. a search query), and DOM-based (client-side code writes untrusted data into the DOM).',
    how: 'It happens when untrusted input is placed into HTML, attributes, JS, URLs, or CSS without proper context-aware encoding/sanitization — e.g. element.innerHTML = userInput, or v-html with raw user content. The browser then parses and executes the injected <script>, event handler, or javascript: URL.',
    why: 'The fix is to never treat untrusted data as code: render it as text (auto-escaping), sanitize any HTML you must allow with a vetted library, avoid dangerous sinks (innerHTML, eval), and add defense-in-depth like a Content Security Policy and httpOnly cookies.',
    code: {
      label: 'Vulnerable vs safe rendering',
      lang: 'js',
      code: `// VULNERABLE: untrusted input becomes live HTML/JS\nconst comment = location.hash.slice(1)            // attacker-controlled\nel.innerHTML = comment // <img src=x onerror=alert(document.cookie)> runs!\n\n// SAFE: render as text — the browser never parses it as HTML\nel.textContent = comment\n\n// SAFE: if you MUST allow some HTML, sanitize first\nimport DOMPurify from 'dompurify'\nel.innerHTML = DOMPurify.sanitize(comment) // strips scripts/handlers`,
      explanation: [
        'innerHTML parses the string as HTML, so an <img onerror> or <script> executes attacker code.',
        'The payload here reads document.cookie — in a real attack it would exfiltrate the session token.',
        'textContent inserts the string as literal text, so tags are shown, not executed.',
        'When rich HTML is genuinely required, a sanitizer like DOMPurify removes scripts and event handlers while keeping safe markup.',
        'Rule: choose the safe sink (textContent) by default; sanitize only when HTML is truly needed.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Cross-Site Scripting is a client-side code-injection vulnerability in which untrusted data is incorporated into a page in an executable context, causing the browser to run attacker-controlled script within the application\'s origin and same-origin trust boundary. It is classified as stored (server-persisted payload), reflected (payload echoed from the request), or DOM-based (payload flows through a client-side sink like innerHTML, document.write, eval, or location). The root cause is missing context-aware output encoding/sanitization; defenses include contextual escaping, vetted HTML sanitization, avoiding dangerous sinks, Trusted Types, a restrictive Content-Security-Policy, and httpOnly/SameSite cookies to limit token theft.',

  // 7. Internal Working
  internalWorking: [
    'Untrusted data enters the system (form field, URL, query param, header, or stored record) and is later included in a response or written to the DOM by client code.',
    'If that data lands in an executable context — inside HTML markup, an attribute, a <script> block, a javascript: URL, or a CSS expression — without context-appropriate encoding, the browser\'s HTML/JS parser treats it as code, not data.',
    'The parser instantiates the injected nodes; inline event handlers (onerror, onload), <script> tags, or javascript: URLs then execute in the page\'s origin during parsing/load.',
    'Because the script runs same-origin, it has full access to the DOM, document.cookie (unless httpOnly), localStorage, and can issue authenticated requests with the user\'s cookies.',
    'Stored XSS persists the payload server-side so it executes for every viewer; reflected XSS requires luring the victim to a crafted URL; DOM XSS never touches the server — a client-side sink does the injection.',
    'Defenses interrupt this chain: output encoding/sanitization stops the data from being parsed as code, and CSP/Trusted Types restrict what scripts may run even if injection occurs.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   STORED XSS FLOW
   attacker ──posts──► [ comment: <img src=x onerror=steal()> ]
                              │ saved to DB
                              ▼
   victim opens page ──► server renders comment INTO HTML (no encoding)
                              │
                              ▼
   browser parses ──► <img onerror> FIRES ──► steal() runs same-origin
                              │
                              ▼
            document.cookie / fetch('/transfer') as the victim

   DEFENSES that break the chain:
   [encode/sanitize on output] [CSP blocks inline/eval] [httpOnly cookie]`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — reflected XSS via a search query',
      lang: 'js',
      code: `// VULNERABLE server template (pseudo):\n//   <p>Results for: \${req.query.q}</p>\n// Attacker URL:  /search?q=<script>steal(document.cookie)</script>\n\n// SAFE: encode for HTML context before inserting\nfunction escapeHtml(s) {\n  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')\n          .replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;')\n}\n// <p>Results for: \${escapeHtml(req.query.q)}</p>`,
      explanation: [
        'Reflected XSS echoes part of the request straight back into the HTML response.',
        'The attacker crafts a URL containing a script and tricks the victim into opening it.',
        'escapeHtml converts the dangerous characters so <script> becomes harmless text.',
        'Most template engines/frameworks do this automatically — the danger is manual string concatenation.',
      ],
    },
    intermediate: {
      label: 'Intermediate — DOM-based XSS through a client sink',
      lang: 'js',
      code: `// VULNERABLE: untrusted location data → innerHTML sink\nconst name = new URLSearchParams(location.search).get('name')\ndocument.getElementById('hi').innerHTML = 'Hello ' + name\n// ?name=<img src=x onerror=alert(1)>  → executes\n\n// SAFE: use a text sink\ndocument.getElementById('hi').textContent = 'Hello ' + name\n// or build nodes explicitly: el.append(document.createTextNode(name))`,
      explanation: [
        'DOM XSS never involves the server — purely client-side code moves untrusted data into a dangerous sink.',
        'innerHTML parses the concatenated string as HTML, executing the onerror payload.',
        'textContent (or createTextNode/append) treats it as text, neutralizing the attack.',
        'Dangerous sinks to watch: innerHTML, outerHTML, document.write, insertAdjacentHTML, eval, setTimeout(string), location.',
      ],
    },
    advanced: {
      label: 'Advanced — defense in depth with sanitization + CSP',
      lang: 'js',
      code: `// 1) Sanitize HTML you must render rich\nimport DOMPurify from 'dompurify'\nconst clean = DOMPurify.sanitize(userHtml, { ALLOWED_TAGS: ['b','i','a','p'], ALLOWED_ATTR: ['href'] })\nel.innerHTML = clean\n\n// 2) Content-Security-Policy header (server) blocks inline/eval even if injected\n//    Content-Security-Policy: default-src 'self';\n//      script-src 'self' 'nonce-r4nd0m';\n//      object-src 'none'; base-uri 'none'\n\n// 3) Trusted Types (Chrome): force all sink writes through a policy\n// Content-Security-Policy: require-trusted-types-for 'script'`,
      explanation: [
        'DOMPurify strips scripts, event handlers, and javascript: URLs while keeping an allowlist of safe tags/attrs.',
        'A strict CSP with nonces blocks inline scripts and eval, so even a successful injection often cannot execute.',
        'object-src none and base-uri none close common bypass vectors.',
        'Trusted Types make it a runtime error to assign a raw string to a dangerous sink, forcing sanitization at the source.',
      ],
    },
    realProject: {
      label: 'Real project — Vue/React escape hatches done safely',
      lang: 'js',
      code: `// Vue auto-escapes {{ text }} — SAFE by default.\n// v-html is the escape hatch: ALWAYS sanitize first.\n//   <div v-html=\"safeHtml\"></div>\nimport DOMPurify from 'dompurify'\nconst safeHtml = computed(() => DOMPurify.sanitize(props.markdownHtml))\n\n// React: {value} auto-escapes; dangerouslySetInnerHTML is the escape hatch.\n//   <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />\n\n// NEVER build markup by string concat from user input, and avoid eval/new Function.`,
      explanation: [
        'Vue {{ }} and React {value} escape by default, which is why most app code is safe automatically.',
        'v-html and dangerouslySetInnerHTML bypass escaping — they must receive sanitized HTML only.',
        'Sanitizing in a computed/derived value keeps the dangerous boundary explicit and centralized.',
        'The name dangerouslySetInnerHTML is deliberately scary; treat every such sink as a security decision.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is XSS in simple terms?',
      answer: 'Cross-Site Scripting is when an attacker gets their JavaScript to run in another user\'s browser within your site, by injecting it through unescaped user input. The script then runs with the site\'s privileges and can steal sessions or act as the user.',
      explanation: 'A clean answer names the cause (unescaped input rendered as code) and the impact (script runs in the victim\'s session).',
    },
    {
      level: 'intermediate',
      question: 'What are the three types of XSS and how do they differ?',
      answer: 'Stored XSS persists the payload on the server (e.g. a comment) so it runs for everyone who views it. Reflected XSS echoes the payload from the request back in the response, requiring the victim to open a crafted URL. DOM-based XSS happens entirely client-side when JS writes untrusted data into a dangerous DOM sink, never touching the server.',
      explanation: 'Distinguishing where the payload lives and how it reaches the victim shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'Why is output encoding context-dependent?',
      answer: 'The same data is dangerous differently depending on where it lands: HTML body, HTML attribute, JavaScript, URL, and CSS each need different escaping. HTML-encoding is wrong inside a JS string or a URL, so you must encode for the specific context where the data is inserted.',
      explanation: 'Context-aware encoding is the core defense; knowing one-size-fits-all encoding fails is a strong signal.',
    },
    {
      level: 'advanced',
      question: 'How does a Content Security Policy mitigate XSS, and what are its limits?',
      answer: 'A strict CSP restricts which scripts can run — e.g. script-src self plus nonces/hashes blocks inline scripts and eval, so even injected script often cannot execute. Limits: it is defense-in-depth, not a fix for the injection itself; misconfigured allowlists (unsafe-inline, wildcard CDNs) gut it, and DOM XSS that reuses allowed scripts can sometimes bypass it. Trusted Types complement CSP by guarding DOM sinks.',
      explanation: 'Senior signal: CSP is layered defense with real bypasses, not a silver bullet; mentioning Trusted Types adds depth.',
    },
    {
      level: 'advanced',
      question: 'Why are httpOnly and SameSite cookies relevant to XSS?',
      answer: 'httpOnly cookies are not readable by JavaScript, so XSS cannot directly exfiltrate the session token via document.cookie — it limits the blast radius. SameSite reduces cross-site request abuse. They do not prevent XSS (the script can still make same-origin authenticated requests), but they raise the cost and protect the token itself.',
      explanation: 'Shows understanding that defenses limit impact even when prevention fails, and the nuance that XSS can still act in-session.',
    },
    {
      level: 'senior',
      question: 'How would you systematically prevent XSS across a large application?',
      answer: 'Default to auto-escaping frameworks and ban string-built markup; centralize and audit every dangerous sink (v-html, dangerouslySetInnerHTML, innerHTML, eval) and require sanitization (DOMPurify) through a single utility; adopt Trusted Types to make raw sink writes a runtime error; deploy a strict nonce-based CSP; set httpOnly/SameSite cookies; validate/encode on output per context; and add lint rules, code review, and automated scanning to enforce it.',
      explanation: 'Senior signal: a layered, enforceable program (defaults + sinks + Trusted Types + CSP + cookies + tooling), not a single trick.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between sanitization and output encoding?',
    'Why is DOMPurify preferred over a hand-written regex sanitizer?',
    'What are Trusted Types and how do they help?',
    'How does XSS relate to CSRF, and can one enable the other?',
    'What are common dangerous DOM sinks to audit?',
    'How would you safely render user-provided Markdown?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Building HTML by string concatenation with user input.',
      why: 'Any unescaped character can break out of the intended context and inject script — the classic XSS source.',
      fix: 'Use framework templating (auto-escaped) or create DOM nodes / textContent; never concatenate untrusted data into markup.',
    },
    {
      mistake: 'Using v-html / dangerouslySetInnerHTML / innerHTML with raw user content.',
      why: 'These bypass auto-escaping and execute any markup, including scripts and event handlers.',
      fix: 'Sanitize with DOMPurify (allowlist tags/attrs) before assigning, and avoid these sinks unless rich HTML is truly required.',
    },
    {
      mistake: 'Trying to block XSS with a custom regex or simple blacklist.',
      why: 'HTML parsing has countless bypasses (encoded entities, malformed tags, weird attributes); blacklists are always incomplete.',
      fix: 'Use context-aware encoding and a vetted sanitizer (allowlist-based), not homemade regex.',
    },
    {
      mistake: 'Storing auth tokens in localStorage and relying only on input validation.',
      why: 'localStorage is readable by any script, so a single XSS exfiltrates the token; input validation alone misses many vectors.',
      fix: 'Use httpOnly cookies for tokens and layer defenses (CSP, sanitization, Trusted Types) — defense in depth.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: '{{ }} interpolation auto-escapes; the audited risk surface is v-html, which must always receive DOMPurify-sanitized HTML, plus any direct innerHTML in custom directives.' },
    { area: 'React', detail: 'JSX {value} auto-escapes; dangerouslySetInnerHTML is the guarded escape hatch (sanitize first), and href={userUrl} must be checked for javascript: URLs.' },
    { area: 'Node.js', detail: 'Server templates must escape per context; APIs validate/encode output, set httpOnly/SameSite cookies, and emit a strict CSP header (helmet) as defense in depth.' },
    { area: 'Backend', detail: 'Stored XSS is prevented by encoding on output (not just input), sanitizing rich content before persistence, and serving security headers (CSP, X-Content-Type-Options) at the edge.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Auto-escaping and output encoding are extremely cheap relative to rendering — negligible overhead for large security gains.',
      'A well-tuned CSP adds no runtime cost to legitimate scripts and can be cached as a header.',
    ],
    bad: [
      'Sanitizing very large HTML blobs on every render (e.g. unmemoized) can add measurable CPU cost.',
      'Overly complex CSP reporting or report-only modes can generate large volumes of report traffic.',
    ],
    optimizations: [
      'Sanitize once and memoize/derive the result rather than per render (e.g. a computed in Vue).',
      'Prefer text sinks (textContent) which are both safer and cheaper than parsing HTML.',
      'Sanitize on write/ingest where possible so reads do not repeat the work.',
      'Use nonce-based CSP (set per response) rather than expensive runtime hashing of large inline scripts.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Session/cookie theft and full account takeover when the token is JS-readable.',
      'Performing authenticated actions as the victim (same-origin requests with their cookies).',
      'Keylogging, phishing overlays, defacement, and worm-like propagation (stored XSS spreading between users).',
      'Bypassing CSRF protections, since the malicious script runs in-origin and can read CSRF tokens.',
    ],
    bestPractices: [
      'Encode output context-appropriately and rely on framework auto-escaping by default.',
      'Sanitize any allowed HTML with a vetted allowlist sanitizer (DOMPurify); never use blacklists/regex.',
      'Deploy a strict nonce/hash-based CSP and adopt Trusted Types to guard DOM sinks.',
      'Store tokens in httpOnly, Secure, SameSite cookies; avoid localStorage for secrets.',
      'Audit and centralize dangerous sinks; add lint rules (no v-html on raw input, no eval) and security scanning.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['dom', 'event-system', 'secure-token-storage'],
    nextConcepts: ['csrf', 'csp', 'prototype-pollution', 'clickjacking', 'supply-chain-security'],
    dependencyNote:
      'XSS builds on how the DOM and event system work (the sinks attackers abuse) and on secure token storage (what gets stolen). It sits in the security cluster alongside CSRF, CSP (a primary mitigation), clickjacking, prototype pollution, and supply-chain security — understanding all of them gives the layered defense XSS requires.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw an attacker dropping a payload into an input/URL/comment.',
      'Arrow to the server/DB (stored) or straight back in the response (reflected) or to a client sink (DOM).',
      'Show the victim\'s browser parsing it and a <script>/onerror firing.',
      'Label the consequence: "runs same-origin → reads cookie / acts as victim".',
      'Across the flow draw three shields: "encode/sanitize output", "CSP blocks inline/eval", "httpOnly cookie".',
      'Say: "XSS is untrusted data executed as code in the victim\'s origin; you stop it by never rendering input as code, and layer CSP and httpOnly to limit blast radius."',
    ],
    diagram: `  attacker payload
    │ stored / reflected / DOM-sink
    ▼
  victim browser parses untrusted data AS CODE
    │  <script> / <img onerror> fires (same origin)
    ▼
  reads cookie / fetch() as victim
  ── shields ──► [encode/sanitize] [CSP] [httpOnly cookie]`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'XSS is when attacker data is rendered as executable code in a victim\'s browser, running same-origin to steal sessions or act as the user. Types: stored (persisted), reflected (echoed from the request), DOM-based (client sink like innerHTML). The cause is missing context-aware output encoding/sanitization. Prevent it by defaulting to auto-escaping, sanitizing any allowed HTML with DOMPurify, avoiding dangerous sinks (innerHTML, eval, v-html, dangerouslySetInnerHTML), and layering a strict CSP, Trusted Types, and httpOnly/SameSite cookies.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Cross-Site Scripting is a client-side injection vulnerability where attacker-controlled data ends up being executed as script in a victim\'s browser, within your site\'s origin. Because it runs same-origin, that script can read the DOM, read the cookie unless it is httpOnly, hit your APIs with the victim\'s session, and effectively take over the account. There are three flavors: stored, where the payload is persisted on the server like in a comment and runs for everyone who views it; reflected, where the payload is echoed straight back from the request so the attacker has to lure the victim to a crafted URL; and DOM-based, which never touches the server — purely client-side code moves untrusted data into a dangerous sink like innerHTML or eval. The root cause is always the same: untrusted data placed into an executable context without proper context-aware encoding, so the browser parses it as code instead of data. The primary defense is output encoding and sanitization: modern frameworks auto-escape interpolation, which is why most app code is safe by default, and the danger is the escape hatches — v-html, dangerouslySetInnerHTML, innerHTML, document.write, eval — which must either be avoided or fed only HTML sanitized by a vetted allowlist library like DOMPurify, never a homemade regex. On top of that I add defense in depth: a strict nonce-based Content Security Policy that blocks inline scripts and eval even if injection slips through, Trusted Types to make raw writes to DOM sinks a runtime error, and httpOnly, Secure, SameSite cookies so the token cannot be stolen via document.cookie. And I enforce it with lint rules, centralized sink utilities, and scanning, because it is a program, not a one-line fix.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Rich HTML features vs attack surface: allowing user HTML (markdown, WYSIWYG) is powerful but every allowed tag/attr is risk — minimize the allowlist.',
      'Strict CSP vs developer convenience: nonce-based CSP is strong but breaks inline scripts/styles and some third-party widgets, requiring refactoring.',
      'Sanitize on input vs output: input sanitization is convenient but loses original data and can be bypassed if the consuming context differs — output encoding per context is the more robust default.',
    ],
    edgeCases: [
      'Attribute and javascript: URL contexts (href, src) need different handling than HTML body — a same string can be safe in one and lethal in another.',
      'Mutation XSS (mXSS): the browser re-parses sanitized HTML and resurrects a payload — why you use a maintained sanitizer, not regex.',
      'SVG/MathML and data: URIs are common bypass vectors.',
      'DOM XSS via client routers/templating that re-inject location/hash data into sinks.',
    ],
    runtimeBehavior: [
      'Injected inline event handlers (onerror/onload) execute during HTML parsing, before your scripts may finish — timing makes them hard to intercept after the fact.',
      'CSP evaluation happens at script execution; nonces must be unguessable and regenerated per response.',
      'Trusted Types intercept at the sink assignment, throwing TypeError for non-policy strings.',
    ],
    scalability: [
      'Centralize sanitization and sink access behind a single audited utility so thousands of components inherit safety and reviews focus on one place.',
      'Roll out CSP in report-only mode first, collect violations, then enforce — at scale you cannot flip strict CSP blindly.',
    ],
    productionConcerns: [
      'Keep the sanitizer and dependencies patched (sanitizer bypasses are disclosed regularly) and watch supply-chain risk.',
      'Monitor CSP violation reports for real injection attempts and misconfigurations.',
      'Treat any new dangerous-sink usage as a security review item; enforce via lint/CI.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'XSS = untrusted data executed as code in the victim\'s origin.',
    'Types: stored (persisted), reflected (echoed from request), DOM-based (client sink).',
    'Root cause: missing context-aware output encoding/sanitization.',
    'Dangerous sinks: innerHTML, outerHTML, document.write, insertAdjacentHTML, eval, setTimeout(string), location, v-html, dangerouslySetInnerHTML.',
    'Default to auto-escaping; render untrusted data with textContent / {{ }} / {value}.',
    'Need HTML? Sanitize with DOMPurify (allowlist) — never regex/blacklist.',
    'Encoding is context-dependent (HTML body vs attribute vs JS vs URL vs CSS).',
    'CSP (nonce/hash, no unsafe-inline, object-src none) blocks inline/eval — defense in depth.',
    'Trusted Types make raw sink writes a runtime error.',
    'httpOnly + Secure + SameSite cookies → token not JS-readable; limit blast radius.',
    'Don\'t store secrets in localStorage.',
    'mXSS exists → use maintained sanitizers; enforce with lint/CI/scanning.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Rewrite this vulnerable line to be XSS-safe: el.innerHTML = userInput (you only need to display text).',
      hint: 'Use a text sink instead of an HTML sink.',
      solution: {
        lang: 'js',
        code: `el.textContent = userInput`,
        explanation: [
          'textContent inserts the value as literal text, so any tags are displayed, not parsed.',
          'No HTML parsing means no script/onerror execution.',
          'This is the correct default whenever you only need to show text.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write an escapeHtml(str) that safely encodes a string for insertion into an HTML body context.',
      hint: 'Replace &, <, >, ", and \' with entities.',
      solution: {
        lang: 'js',
        code: `function escapeHtml(str) {\n  return String(str)\n    .replace(/&/g, '&amp;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;')\n    .replace(/\"/g, '&quot;')\n    .replace(/'/g, '&#39;')\n}\nescapeHtml('<script>x</script>') // '&lt;script&gt;x&lt;/script&gt;'`,
        explanation: [
          'Encoding & first prevents double-encoding issues.',
          'Encoding <, >, ", and \' neutralizes tag and attribute breakouts in the HTML body context.',
          'Note this is for the HTML body context only — attribute, JS, and URL contexts need different handling, which is why frameworks/sanitizers are preferred.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A feature must render user-provided rich HTML (bold, links). Show how to allow it safely while blocking scripts and event handlers.',
      hint: 'Use DOMPurify with an allowlist.',
      solution: {
        lang: 'js',
        code: `import DOMPurify from 'dompurify'\nfunction renderRichHtml(el, dirtyHtml) {\n  const clean = DOMPurify.sanitize(dirtyHtml, {\n    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li'],\n    ALLOWED_ATTR: ['href', 'title'],\n    ALLOWED_URI_REGEXP: /^(https?|mailto):/i, // block javascript: URLs\n  })\n  el.innerHTML = clean\n}`,
        explanation: [
          'An allowlist of tags/attrs strips everything else, including <script> and on* handlers.',
          'Restricting allowed URI schemes blocks javascript: links that would otherwise execute.',
          'DOMPurify is a maintained sanitizer that handles mutation-XSS and parser quirks a regex never could.',
          'Only after sanitization is innerHTML acceptable here.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and implement a layered defense for displaying a user comment that may include limited HTML, covering sanitization plus a CSP and cookie strategy (describe the headers).',
      hint: 'Sanitize on render, set a strict CSP header, use httpOnly cookies.',
      solution: {
        lang: 'js',
        code: `// 1) Render layer: sanitize allowed HTML\nimport DOMPurify from 'dompurify'\nconst safe = DOMPurify.sanitize(comment, { ALLOWED_TAGS: ['b','i','a'], ALLOWED_ATTR: ['href'] })\nel.innerHTML = safe\n\n// 2) Transport/headers (server) — defense in depth:\n//   Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<rand>';\n//     object-src 'none'; base-uri 'none'; require-trusted-types-for 'script'\n//   Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax\n//   X-Content-Type-Options: nosniff`,
        explanation: [
          'Sanitization stops the comment from being parsed as script in the first place (primary defense).',
          'A strict nonce-based CSP means even a missed injection usually cannot execute inline script or eval.',
          'require-trusted-types-for script forces DOM sink writes through a policy, catching unsafe code at runtime.',
          'httpOnly+Secure+SameSite cookies ensure that even if script runs, it cannot read or easily abuse the session token — layered defense limits both likelihood and blast radius.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'XSS is the most-asked web security topic and a constant real-world threat, so demonstrating you understand the browser trust model, the three types, output encoding, and layered defenses immediately marks you as a security-aware engineer.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what XSS is and how to prevent it broadly. Product companies (Zoho, Flipkart, Razorpay) ask about stored vs reflected vs DOM, sanitization, framework escape hatches, and CSP. FAANG-level interviews probe context-aware encoding, mutation XSS, Trusted Types, nonce-based CSP rollout, and designing org-wide enforcement.',
    whatInterviewersExpect:
      'They expect a clear definition tied to same-origin execution, the three types with how each reaches the victim, output encoding/sanitization as the primary fix (with DOMPurify over regex), awareness of dangerous sinks and framework escape hatches, and layered defenses — CSP, Trusted Types, and httpOnly/SameSite cookies — as defense in depth.',
  },
}

export default xss
