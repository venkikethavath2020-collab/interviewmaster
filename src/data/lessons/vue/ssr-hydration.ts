import type { ConceptLesson } from '../../../types/lesson'

const ssrHydration: ConceptLesson = {
  // 1. Concept Summary
  slug: 'ssr-hydration',
  name: 'SSR & Hydration',
  category: 'forms-async',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Server-Side Rendering sends fully-formed HTML to the browser, so users see content instantly and search engines can index your pages — critical for marketing sites, e-commerce, and content apps.',
    'Hydration is the bridge between that static HTML and a live Vue app; understanding it is the difference between an app that "just works" and one plagued by flicker, mismatch warnings, and broken interactivity.',
    'Hydration mismatches are one of the most common production SSR bugs — interviewers love them because they test whether you really understand the SSR lifecycle.',
    'Nuxt, the dominant Vue meta-framework, is built entirely on SSR + hydration; if you work with Nuxt you are working with these concepts every day.',
    'Performance metrics that businesses care about — First Contentful Paint, Largest Contentful Paint, Time to Interactive — are directly shaped by your SSR and hydration strategy.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'SSR is getting a finished coloring page in the mail; hydration is the crayons arriving so you can actually color on it.',
    story: [
      'Imagine you order a poster online. Normally the company would mail you a blank sheet, a box of paint, and instructions, and you would have to paint the whole picture yourself before you could even see it.',
      'With Server-Side Rendering, the company paints the poster for you FIRST and mails you the finished picture. The moment you open the envelope you can see the whole thing — no waiting.',
      'But a printed poster cannot do anything when you poke it. So the company also sends a little kit afterward that quietly attaches buttons and switches behind the picture.',
      'That second step is called hydration: the picture was already there, and now Vue carefully wires up all the interactive parts so clicking and typing actually work — without redrawing the whole poster.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A normal Vue app ships an almost-empty HTML page plus JavaScript; the browser must download and run that JavaScript before anything appears. This is Client-Side Rendering.',
    'Server-Side Rendering runs Vue on the server (in Node.js), turns your components into a finished HTML string, and sends that to the browser so the page is visible immediately.',
    'That delivered HTML is static — buttons do not respond yet. Hydration is the process where Vue runs again in the browser, walks over the existing HTML, and attaches its reactivity and event listeners to the nodes that are already there instead of recreating them.',
    'The catch: the HTML the server produced and the virtual DOM the client expects must match exactly, or Vue warns about a "hydration mismatch" and may discard the server HTML.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'SSR renders your Vue components to an HTML string on the server for fast first paint and SEO; hydration is the client-side step that makes that already-rendered HTML interactive by attaching Vue\'s runtime to the existing DOM.',
    how: 'You create the app with createSSRApp, use renderToString on the server to get HTML, send it down, and on the client you call app.mount() on the same root element — Vue detects the existing markup and hydrates it instead of building from scratch.',
    why: 'It combines the best of both worlds: the instant, indexable content of a static page, plus the rich interactivity of a single-page app, without the blank-screen delay of pure client rendering.',
    code: {
      label: 'Minimal SSR + hydration setup',
      lang: 'js',
      code: '// app.js (shared)\nimport { createSSRApp } from \'vue\'\nimport App from \'./App.vue\'\nexport function createApp() {\n  return createSSRApp(App)\n}\n\n// server.js\nimport { renderToString } from \'vue/server-renderer\'\nimport { createApp } from \'./app.js\'\nconst app = createApp()\nconst html = await renderToString(app)\n// send: <div id="app">${html}</div> + the client bundle\n\n// client.js (runs in browser)\nimport { createApp } from \'./app.js\'\ncreateApp().mount(\'#app\') // hydrates the server HTML',
      explanation: [
        'createSSRApp (not createApp) tells Vue this app may be hydrated rather than freshly mounted.',
        'renderToString runs the components on the server and returns a finished HTML string.',
        'The server embeds that HTML inside the mount element so the user sees content immediately.',
        'On the client, mounting on the SAME element makes Vue hydrate: it reuses existing nodes and only attaches listeners and reactivity.',
        'The component code is shared (isomorphic) so server and client produce identical markup.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Server-Side Rendering (SSR) executes a Vue application within a server runtime, traversing the component tree synchronously (with async data resolved beforehand) to serialize the rendered virtual DOM into an HTML string via renderToString. Hydration is the client-side reconciliation pass in which a createSSRApp instance, mounted on the server-generated DOM, walks its virtual DOM tree in lockstep with the existing real DOM, adopting matching nodes, attaching event listeners and reactive effects, and reusing rather than recreating elements. The server and client must produce structurally identical trees; divergence triggers a hydration mismatch, after which Vue may fall back to client-side rendering of the affected subtree.',

  // 7. Internal Working
  internalWorking: [
    'On the server, createSSRApp builds the app in SSR mode; renderToString synchronously renders the component tree, awaiting any serverPrefetch/async setup, and emits an HTML string plus optionally a serialized state payload (e.g. window.__INITIAL_STATE__) for stores.',
    'The HTML is injected into the page shell and shipped to the browser, which paints it immediately even before any Vue JavaScript executes.',
    'On the client, the same app is created and app.mount() is called; because it is an SSR app, Vue enters hydration mode instead of fresh-mount mode.',
    'During hydration, Vue\'s hydrate function walks the new vnode tree alongside the existing DOM node-by-node, claiming each real node for its corresponding vnode, binding refs, and attaching event listeners — but it does NOT set textContent or recreate elements that already match.',
    'Reactive effects (render effects, watchers, computed) are set up so that future state changes patch the now-live DOM as usual.',
    'If a vnode does not line up with the DOM it expects (wrong tag, extra/missing node, different text), Vue logs a hydration mismatch in development and, for the affected node, discards the server markup and client-renders it to recover, which can cause a visible flicker.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        SERVER (Node.js)                          CLIENT (Browser)
   ┌───────────────────────────┐            ┌────────────────────────────┐
   │ createSSRApp(App)         │            │ 1. receives finished HTML  │
   │ renderToString(app)       │            │    → paints instantly      │
   │        │                  │            │                            │
   │        ▼                  │  HTML +    │ 2. createSSRApp(App)       │
   │  "<div>...finished..."    │  state     │    .mount('#app')          │
   │        │                  │ ─────────► │        │                   │
   │        ▼                  │  payload   │        ▼                   │
   │  + window.__STATE__       │            │   HYDRATE: walk vdom over  │
   └───────────────────────────┘            │   existing DOM, attach     │
                                            │   listeners + reactivity   │
                                            │        │                   │
                                            │        ▼                   │
                                            │   fully interactive app    │
                                            └────────────────────────────┘
        (markup must match exactly, or → hydration mismatch)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'SERVER: each request builds a fresh app instance and component tree on the heap, renders to a string, then the whole tree becomes garbage — never share a single app instance across requests or you leak state between users.',
    'WIRE: the response carries two things — the HTML (the painted DOM) and a serialized JSON state payload so the client can rebuild stores/refs without re-fetching.',
    'CLIENT before hydration: the DOM exists but there are NO Vue effects, no listeners, no reactive proxies — the page is "frozen" markup.',
    'CLIENT after hydration: Vue allocates the vnode tree and reactive effect graph in memory and points its vnodes at the EXISTING DOM nodes (reuse), so no second set of elements is created — that reuse is the whole performance win of hydration over re-rendering.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — renderToString on the server',
      lang: 'js',
      code: 'import { createSSRApp } from \'vue\'\nimport { renderToString } from \'vue/server-renderer\'\n\nconst app = createSSRApp({\n  data: () => ({ msg: \'Hello from the server\' }),\n  template: \'<h1>{{ msg }}</h1>\',\n})\n\nconst html = await renderToString(app)\nconsole.log(html) // <h1>Hello from the server</h1>',
      explanation: [
        'createSSRApp marks the app as hydratable; renderToString produces the HTML string.',
        'No browser, no DOM — this runs in Node and just builds a string.',
        'The interpolation {{ msg }} is resolved on the server, so the value ships pre-rendered.',
        'This string is what gets injected into the page shell and sent to the browser.',
      ],
    },
    intermediate: {
      label: 'Intermediate — fixing a hydration mismatch',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\n\n// BAD: Date.now() differs between server render and client render → mismatch\n// const now = ref(Date.now())\n\n// GOOD: render a stable placeholder on the server,\n// then fill the client-only value AFTER mount\nconst now = ref(null)\nonMounted(() => {\n  now.value = Date.now()\n})\n</script>\n\n<template>\n  <p>Rendered at: {{ now ?? \'…\' }}</p>\n</template>',
      explanation: [
        'Anything non-deterministic (Date.now(), Math.random(), window access) produces different HTML on server vs client → a hydration mismatch.',
        'The fix is to render a stable value during SSR and set the dynamic value in onMounted, which only runs on the client.',
        'onMounted never fires on the server, making it the canonical place for browser-only logic.',
        'After hydration, the ref update patches the DOM normally — no mismatch because the initial render matched.',
        'In dev, Vue logs the exact node where the mismatch happened, which is your debugging starting point.',
      ],
    },
    advanced: {
      label: 'Advanced — client-only content with a wrapper',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst mounted = ref(false)\nonMounted(() => { mounted.value = true })\n</script>\n\n<template>\n  <!-- Server renders the fallback; client swaps in after hydration -->\n  <div>\n    <template v-if="mounted">\n      <ThirdPartyWidget />  <!-- touches window/localStorage -->\n    </template>\n    <template v-else>\n      <div class="skeleton" />\n    </template>\n  </div>\n</template>',
      explanation: [
        'Some components (charts, maps, anything reading window/localStorage) cannot run on the server.',
        'Gating them behind a `mounted` flag means the server renders only the skeleton, avoiding both crashes and mismatches.',
        'Because the server and client both render the skeleton initially, hydration matches; the widget appears only after mount.',
        'Nuxt formalizes this with a built-in <ClientOnly> component that does exactly this pattern.',
        'This trades a small post-hydration shift for correctness and SSR safety.',
      ],
    },
    realProject: {
      label: 'Real project — Nuxt page with server-fetched data',
      lang: 'vue',
      code: '<script setup>\n// Nuxt: useAsyncData runs on the server during SSR, serializes the\n// result into the payload, and reuses it on the client without refetching.\nconst { data: product, pending } = await useAsyncData(\n  \'product\',\n  () => $fetch(`/api/products/${useRoute().params.id}`)\n)\n</script>\n\n<template>\n  <article v-if="product">\n    <h1>{{ product.name }}</h1>\n    <p>{{ product.price }}</p>\n  </article>\n  <p v-else-if="pending">Loading…</p>\n</template>',
      explanation: [
        'useAsyncData fetches on the server so the HTML ships fully populated — great for SEO product pages.',
        'The fetched data is serialized into the hydration payload, so the client does NOT re-request it, avoiding a flash and a duplicate network call.',
        'Because both sides render from the same data, the markup matches and hydration is clean.',
        'This is the bread-and-butter pattern for content and e-commerce pages in a real Nuxt app.',
        'The unique key (\'product\') lets Nuxt dedupe and cache the payload across navigation.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between SSR and CSR?',
      answer: 'Client-Side Rendering ships an empty shell plus JavaScript and builds the page in the browser, so users wait for JS before seeing content. Server-Side Rendering builds the HTML on the server and sends it ready-to-view, then hydrates it for interactivity.',
      explanation: 'A good answer names the trade-off: SSR wins on first paint and SEO; CSR is simpler and offloads work to the client.',
    },
    {
      level: 'beginner',
      question: 'What is hydration in Vue?',
      answer: 'Hydration is the client-side process where Vue mounts onto server-rendered HTML, reusing the existing DOM nodes and attaching event listeners and reactivity instead of recreating the elements.',
      explanation: 'The key word is "reuse" — hydration adopts existing nodes; it does not re-render from scratch, which is what makes it fast.',
    },
    {
      level: 'intermediate',
      question: 'What causes a hydration mismatch and how do you fix it?',
      answer: 'It happens when the server-rendered HTML differs from what the client renders — caused by non-deterministic values (Date.now, Math.random), browser-only APIs (window), or invalid HTML nesting. Fix by rendering stable output during SSR and moving dynamic/browser logic into onMounted or a client-only wrapper.',
      explanation: 'Interviewers want the root cause (determinism) plus a concrete fix, not just "Vue logs a warning".',
    },
    {
      level: 'intermediate',
      question: 'Why must you use createSSRApp instead of createApp for SSR?',
      answer: 'createSSRApp puts Vue into hydration mode on the client so app.mount() adopts the existing server HTML; createApp would discard the server markup and render fresh, defeating the purpose and causing a flash.',
      explanation: 'Shows you understand that the same code runs in two modes and the constructor selects the behavior.',
    },
    {
      level: 'advanced',
      question: 'How does Vue avoid re-fetching data that was already loaded on the server?',
      answer: 'During SSR, fetched state is serialized into a payload (e.g. window.__INITIAL_STATE__ or Nuxt\'s payload). On the client, the store/composable rehydrates from that payload instead of making the request again, so there is no duplicate fetch and no content flash.',
      explanation: 'Demonstrates understanding of state transfer, the often-missed half of SSR.',
    },
    {
      level: 'senior',
      question: 'What are the performance and architecture trade-offs of SSR, and what alternatives exist?',
      answer: 'SSR improves FCP/LCP and SEO but adds server CPU cost per request, increases TTFB, and complicates deployment (you need a Node runtime, careful per-request isolation, and no shared mutable state). Alternatives include Static Site Generation (pre-render at build time), Incremental Static Regeneration, and streaming SSR / Islands architecture to reduce hydration cost.',
      explanation: 'Senior signal: weighing server cost vs UX, mentioning SSG/ISR/streaming/islands as the spectrum rather than treating SSR as binary.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between SSR and SSG (Static Site Generation)?',
    'How does streaming SSR (renderToNodeStream) improve perceived performance?',
    'What is the "Islands architecture" and how does partial hydration reduce JS cost?',
    'How do you handle authentication and cookies in an SSR request?',
    'Why must app state be created per-request on the server?',
    'How does Suspense interact with SSR and async setup?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Accessing window, document, or localStorage during setup/render.',
      why: 'Those globals do not exist on the server, so SSR crashes or produces markup that cannot match the client.',
      fix: 'Move browser-only access into onMounted, guard with typeof window !== \'undefined\', or use a client-only wrapper.',
    },
    {
      mistake: 'Sharing a single app/store instance across requests on the server.',
      why: 'It leaks one user\'s state into another\'s response — a serious security and correctness bug.',
      fix: 'Create a fresh app and store per request (a factory function) so each request is isolated.',
    },
    {
      mistake: 'Using non-deterministic values (Date.now, Math.random) in the initial render.',
      why: 'The server value and the client value differ, triggering a hydration mismatch and a flicker.',
      fix: 'Render a stable placeholder during SSR and set the dynamic value in onMounted.',
    },
    {
      mistake: 'Re-fetching data on the client that was already fetched on the server.',
      why: 'It wastes a network round-trip and can cause a visible content flash as data reloads.',
      fix: 'Serialize server state into the payload and rehydrate from it (useAsyncData/useFetch in Nuxt do this automatically).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Nuxt', detail: 'Nuxt is the production SSR framework for Vue — it wires up createSSRApp, renderToString, payload serialization, and per-request isolation for you, and adds <ClientOnly>, useAsyncData, and route-level rendering modes (SSR/SSG/ISR/SPA).' },
    { area: 'SSR', detail: 'E-commerce and content sites use SSR for SEO and fast first paint; the server resolves data and ships ready HTML so crawlers and users both get content without waiting for JS.' },
    { area: 'Pinia', detail: 'Pinia supports SSR by creating a store per request and serializing state into the payload (pinia.state.value) so the client rehydrates without refetching.' },
    { area: 'Component library', detail: 'Library authors must ensure components are SSR-safe — no direct DOM access in setup, deterministic render output — so they hydrate cleanly inside Nuxt apps.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Faster First Contentful Paint and Largest Contentful Paint because usable HTML arrives immediately.',
      'Better SEO and social sharing because crawlers receive fully-rendered content.',
    ],
    bad: [
      'Higher server CPU and memory per request, since each request renders the whole tree.',
      'Time To Interactive can lag First Paint — the page looks ready but is not interactive until hydration finishes (the "uncanny valley" of SSR).',
    ],
    optimizations: [
      'Use streaming SSR to flush HTML in chunks and start the browser parsing sooner.',
      'Adopt partial/lazy hydration or an Islands architecture so only interactive parts ship and hydrate JS.',
      'Prefer SSG or ISR for pages that rarely change, eliminating per-request render cost entirely.',
      'Cache rendered HTML (CDN/edge) and use cache-aware data fetching to cut repeated server work.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Per-request state leakage: a shared server-side app/store can serve one user\'s data to another.',
      'Serialized payloads can leak sensitive data — anything you put in the hydration state is visible in the page source.',
      'Injecting unsanitized data into the SSR HTML string opens XSS, since it bypasses Vue\'s template escaping if done manually.',
    ],
    bestPractices: [
      'Always create app and store instances per request; never use module-level mutable singletons on the server.',
      'Only serialize data the client actually needs and never secrets, tokens, or internal fields.',
      'Let Vue render and escape content; never string-concatenate untrusted data into the HTML shell.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['virtual-dom', 'lifecycle-hooks-composition', 'data-fetching-patterns', 'mounting-process'],
    nextConcepts: ['nuxt-overview', 'suspense', 'pinia-basics', 'bundle-optimization'],
    dependencyNote:
      'SSR builds on the virtual DOM (which is what gets serialized) and the mounting/lifecycle model (onMounted is the client-only escape hatch). It leads directly into Nuxt, which productionizes it, and into Suspense and state management for handling async data across the server/client boundary.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two boxes: SERVER on the left, BROWSER on the right.',
      'In SERVER, write createSSRApp → renderToString → an HTML string; note "data resolved here".',
      'Draw an arrow carrying "HTML + state payload" from server to browser; label it "instant paint".',
      'In BROWSER, write createSSRApp → mount → HYDRATE; explain "reuse existing DOM, attach listeners".',
      'Underline that server markup and client vdom must MATCH, or you get a mismatch and a flicker.',
      'Finish by naming onMounted / ClientOnly as the escape hatch for browser-only code.',
    ],
    diagram: `  SERVER                         BROWSER
  renderToString ──HTML+state──► paint (visible, not interactive)
                                       │
                                       ▼
                                 mount() → HYDRATE
                                 (reuse DOM + attach listeners)
                                       │
                                       ▼
                                 interactive  ✓
        MATCH required ↑  else → mismatch / flicker`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'SSR runs Vue on the server with renderToString to ship finished HTML, giving fast first paint and SEO. Hydration is the client step where createSSRApp mounts onto that existing HTML, reusing the DOM and attaching listeners and reactivity instead of re-rendering. The server and client markup must match exactly; non-deterministic or browser-only code causes hydration mismatches, fixed with onMounted or a client-only wrapper. Server data is serialized into a payload so the client does not refetch. Nuxt productionizes all of this.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Server-Side Rendering means we run our Vue app on the server, render the component tree to an HTML string with renderToString, and send that finished HTML to the browser. The user sees real content immediately, and search engine crawlers get a fully populated page — so SSR wins on First Contentful Paint and on SEO compared to client-side rendering, which ships a blank shell and makes the browser build everything. But static HTML is not interactive; clicking a button does nothing. That is where hydration comes in. On the client we create the app with createSSRApp and call mount on the same root element. Because it is an SSR app, Vue enters hydration mode: it walks its virtual DOM in lockstep with the existing real DOM, adopts each matching node, and attaches event listeners and reactive effects — without recreating elements. That reuse is the performance win. The crucial rule is that the server and client must produce identical markup. If you use Date.now, Math.random, or read window during the initial render, the two sides diverge and Vue throws a hydration mismatch, which can flicker as it falls back to client rendering. The fix is to render a stable placeholder on the server and set the dynamic value in onMounted, which only runs on the client, or wrap browser-only components in a client-only block. We also serialize the data fetched on the server into a payload so the client rehydrates from it instead of refetching. In practice almost nobody wires this by hand — Nuxt does it for us, and it adds rendering modes like SSG, ISR, and streaming, plus per-request state isolation, which is essential so one user\'s data never leaks into another\'s response.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'SSR vs CSR vs SSG: SSR gives fresh, personalized HTML at the cost of per-request CPU and higher TTFB; SSG is cheapest and fastest but stale; ISR sits in between. Choose per route, not per app.',
      'Full hydration vs partial/island hydration: full hydration is simple but ships and executes JS for the whole tree; islands cut JS dramatically but add framework complexity and constrain interactivity boundaries.',
      'Streaming SSR improves perceived latency but complicates error handling, since headers are already sent when a later chunk fails.',
    ],
    edgeCases: [
      'Hydration mismatches from whitespace-sensitive or invalid HTML nesting (e.g. a <div> inside a <p>) — the browser auto-corrects the DOM and Vue then disagrees.',
      'Third-party scripts mutating the DOM before hydration can desync Vue from the real DOM.',
      'Async setup + Suspense: the server must await it before serializing, and the client must reach the same resolved state to match.',
      'Locale/timezone differences between server and client formatting numbers or dates inconsistently.',
    ],
    runtimeBehavior: [
      'renderToString is synchronous over the tree but awaits serverPrefetch/Suspense; it has no scheduler/nextTick semantics like the client.',
      'Hydration is a single non-patching walk: it does not diff/patch, it only adopts and attaches, so it is cheaper than a full render but still O(nodes).',
      'After hydration, reactivity behaves exactly as in a CSR app — subsequent updates are normal patches.',
    ],
    scalability: [
      'Each request allocates and renders a full tree, so SSR throughput is CPU-bound; put a CDN/edge cache in front and cache rendered output where possible.',
      'Memory pressure rises with concurrency since per-request trees are live until the response flushes — watch for leaks from accidental module-level state.',
      'Move read-heavy, rarely-changing routes to SSG/ISR to remove them from the hot SSR path entirely.',
    ],
    productionConcerns: [
      'Per-request isolation is non-negotiable: create app, router, and store via factories so no state crosses requests.',
      'Monitor hydration mismatch warnings in staging — they are silent-ish in prod but degrade UX and indicate real bugs.',
      'Track FCP, LCP, and TTI separately; SSR can make a page look ready long before it is interactive, frustrating users.',
      'Ensure error boundaries and graceful fallbacks so a failed server render degrades to client rendering rather than a 500.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'SSR = render Vue to HTML on the server (renderToString) for fast paint + SEO.',
    'Hydration = client mounts onto server HTML, reusing DOM + attaching listeners.',
    'Use createSSRApp (not createApp) so the client hydrates instead of re-rendering.',
    'Server markup MUST match client vdom, or → hydration mismatch.',
    'Mismatch causes: Date.now/Math.random, window/document, invalid HTML nesting.',
    'Fix: render stable placeholder, set dynamic value in onMounted (client-only).',
    'Serialize server state into a payload so the client does not refetch.',
    'Create app/store PER REQUEST on the server — never share singletons.',
    'onMounted never runs on the server — it is the browser-only escape hatch.',
    'Nuxt productionizes SSR; adds SSG, ISR, streaming, <ClientOnly>, useAsyncData.',
    'Trade-off: better FCP/LCP/SEO vs more server CPU and a TTI gap.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write the server code that renders a createSSRApp to an HTML string and logs it.',
      hint: 'You need createSSRApp from vue and renderToString from vue/server-renderer.',
      solution: {
        lang: 'js',
        code: 'import { createSSRApp } from \'vue\'\nimport { renderToString } from \'vue/server-renderer\'\n\nconst app = createSSRApp({\n  data: () => ({ title: \'Hi\' }),\n  template: \'<h1>{{ title }}</h1>\',\n})\n\nconst html = await renderToString(app)\nconsole.log(html) // <h1>Hi</h1>',
        explanation: [
          'createSSRApp builds a hydratable app; renderToString serializes it.',
          'The result is a plain HTML string ready to embed in a page shell.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'A component shows the current time and throws a hydration mismatch. Rewrite it so it is SSR-safe.',
      hint: 'Move Date.now into onMounted and render a placeholder until then.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst time = ref(null)\nonMounted(() => { time.value = new Date().toLocaleTimeString() })\n</script>\n\n<template>\n  <p>Time: {{ time ?? \'—\' }}</p>\n</template>',
        explanation: [
          'Server and client both render the "—" placeholder, so hydration matches.',
          'onMounted runs only in the browser, so the real time appears after hydration without a mismatch.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a reusable <ClientOnly> component that renders its default slot only after mount, with a fallback slot during SSR.',
      hint: 'Track a mounted ref toggled in onMounted.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst mounted = ref(false)\nonMounted(() => { mounted.value = true })\n</script>\n\n<template>\n  <slot v-if="mounted" />\n  <slot v-else name="fallback" />\n</template>',
        explanation: [
          'On the server mounted is false, so only the fallback slot renders — safe for browser-only children.',
          'After mount, mounted flips true and the default slot renders the real content.',
          'Because both sides initially render the fallback, hydration is clean.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain, with code, how you would transfer server-fetched data to the client to avoid refetching during hydration (vanilla SSR, not Nuxt).',
      hint: 'Serialize state into window.__INITIAL_STATE__ on the server; read it on the client.',
      solution: {
        lang: 'js',
        code: '// server: after renderToString\nconst state = { product: await fetchProduct(id) }\nconst page = `<div id="app">${html}</div>\n<script>window.__INITIAL_STATE__ = ${JSON.stringify(state)}</scr` + `ipt>\n<script type="module" src="/client.js"></scr` + `ipt>`\n\n// client.js\nconst initial = window.__INITIAL_STATE__\nconst app = createSSRApp(App, { initialState: initial })\napp.mount(\'#app\') // store hydrates from initial, no refetch',
        explanation: [
          'The server embeds the fetched data as a global JSON blob in the page.',
          'The client reads that blob and seeds the app/store from it before mounting.',
          'Because the client renders from the same data, the markup matches and there is no second network call or flash.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'SSR and hydration are the backbone of every serious Vue/Nuxt production app that cares about SEO and load performance. Understanding them signals that you grasp the full request lifecycle, the server/client boundary, and the performance metrics businesses actually measure.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) tend to ask the SSR-vs-CSR definition and "what is hydration". Product companies (Zoho, Flipkart, Razorpay) ask you to debug a hydration mismatch and explain data transfer. FAANG-level interviews probe streaming, islands/partial hydration, per-request isolation, and the FCP/TTI trade-offs.',
    whatInterviewersExpect:
      'They expect you to define SSR and hydration precisely, explain why createSSRApp matters, diagnose and fix a mismatch (determinism + onMounted), describe state transfer to avoid refetching, and discuss the server-cost vs UX trade-off including SSG/ISR alternatives.',
  },
}

export default ssrHydration
