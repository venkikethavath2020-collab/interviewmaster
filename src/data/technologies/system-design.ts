import type { Technology } from '../../types/content'

const systemDesign: Technology = {
  id: 'system-design',
  name: 'System Design',
  icon: 'SD',
  color: '#7c3aed',
  tagline: 'Structured thinking about scale, latency, and tradeoffs — from the browser to the database.',
  category: 'design',

  overview: {
    what: 'System design is the discipline of decomposing a product requirement into components — clients, CDNs, load balancers, services, caches, queues, databases — and reasoning about how they behave under scale, failure, and change. For frontend-leaning engineers, the interview adds rendering strategy, client caching, state architecture, and Core Web Vitals to the classic backend topics.',
    why: 'Past a certain seniority, companies hire for judgment, not syntax. The system design round tests whether you can scope an ambiguous problem, estimate magnitudes, choose components deliberately, and articulate what you traded away. It is the round that most strongly determines leveling at product companies.',
    problemsSolved: [
      'Turns ambiguous one-line prompts ("design a news feed") into scoped, buildable architectures',
      'Gives a shared vocabulary (CDN, shard, queue, SLO) so teams can debate designs instead of re-deriving fundamentals',
      'Forces failure-mode thinking before production teaches it the expensive way',
    ],
    whenToUse: [
      'Any feature touching scale: more users, more data, more regions, more teams',
      'Before committing to architecture-shaped decisions that are expensive to reverse (database choice, sync vs async, SSR vs SPA)',
      'In interviews: every senior+ loop at product companies includes at least one design round',
    ],
    whenNotToUse: [
      'Do not design for hypothetical scale — a CRUD app for 200 internal users does not need sharding or Kafka',
      'Do not let high-level boxes substitute for depth: interviewers probe one component deeply, and hand-waving there fails the round',
      'Avoid resume-driven architecture: picking components because they are fashionable, not because the requirements demand them',
    ],
  },

  internals: [
    {
      id: 'interview-framework',
      title: 'Running the Design Interview',
      summary: 'A 45-minute design round has a predictable shape: requirements → estimates → high-level design → deep dive → tradeoffs. Owning this structure is half the evaluation.',
      details: [
        'Requirements (5–10 min): split functional ("users post, follow, see a feed") from non-functional (latency targets, availability, consistency needs, read/write ratio). Ask who the users are and what scale to design for — interviewers reward scoping questions and penalize assuming.',
        'Estimates (3–5 min): back-of-envelope math. 10M DAU × 10 reads/day ≈ 100M reads/day ≈ ~1,200 QPS average, ×3–5 for peak. Storage: items/day × size × retention. The point is magnitude, not precision — it justifies later choices like "this fits in one Postgres" vs "this needs sharding".',
        'High-level design (10–15 min): draw the request path — client → CDN → load balancer → API → cache → database, plus async paths through queues. Name each arrow (protocol, payload) and say what data lives where.',
        'Deep dive (10–15 min): the interviewer picks (or you propose) one component — feed generation, the WebSocket fan-out, the upload pipeline — and you go to schema/algorithm depth. Frontend-leaning candidates should steer toward client architecture, caching, or real-time delivery where they can show depth.',
        'Tradeoffs and wrap-up (5 min): state what breaks first at 10× load, what you would monitor, and what you deliberately did NOT build. Saying "I chose eventual consistency for the feed because a 5-second-stale post is fine, but the like-count must not double-count" is the senior signal.',
        'Anti-patterns: jumping to boxes before requirements; monologuing without checking in ("does this match what you wanted to focus on?"); naming technologies (Kafka, Cassandra) without saying what property you need from them.',
      ],
      diagram: ['Clarify functional + non-functional requirements', 'Back-of-envelope estimates (QPS, storage, bandwidth)', 'High-level design: client → edge → services → data', 'Deep dive one component to schema/algorithm depth', 'Tradeoffs, failure modes, monitoring, future scaling'],
    },
    {
      id: 'rendering-strategies',
      title: 'CSR vs SSR vs SSG vs ISR & Hydration',
      summary: 'Where HTML is produced — client, server at request time, or build time — drives TTFB, LCP, SEO, infra cost, and personalization. Hydration is the tax SSR pays to become interactive.',
      details: [
        'CSR (client-side rendering): server ships a near-empty shell + JS bundle; the client fetches data and renders. Cheap to host (static files), great for authenticated dashboards, but first paint waits on download → parse → execute → fetch → render. SEO needs extra work.',
        'SSR (server-side rendering): HTML is produced per request with data already in it. Fast first contentful paint and SEO-friendly, but every request costs server CPU, and TTFB now includes data fetching. Caching SSR output is hard when pages are personalized.',
        'SSG (static site generation): HTML built at deploy time, served from a CDN. Unbeatable latency and cost for content that changes rarely (docs, marketing, blogs). Rebuild-on-change does not scale to millions of pages or minute-level freshness.',
        'ISR (incremental static regeneration): static pages with a revalidate window — serve the cached page, regenerate in the background after it goes stale. It is stale-while-revalidate applied to HTML, blending SSG economics with near-fresh content.',
        'Hydration: after SSR/SSG HTML arrives, the framework downloads JS, rebuilds the component tree, and attaches listeners. Until then the page looks interactive but is not — the "uncanny valley". Heavy hydration shows up as poor TBT/INP. Mitigations: code splitting, lazy/partial hydration, islands architecture (hydrate only interactive widgets), and server components (ship zero JS for static parts).',
        'Choosing: public + content-heavy → SSG/ISR; public + dynamic/personalized → SSR (with edge caching of fragments); behind login + app-like → CSR or SSR-shell + CSR. Most real products mix strategies per route.',
      ],
      diagram: ['Request arrives', 'SSG/ISR: CDN serves prebuilt HTML', 'SSR: server renders HTML with data per request', 'CSR: server serves empty shell + JS', 'Browser paints HTML (fast for SSR/SSG)', 'JS downloads → hydration attaches interactivity', 'Page fully interactive'],
    },
    {
      id: 'caching-layers',
      title: 'Caching Layers & Invalidation',
      summary: 'A request can be served from the browser, the CDN, an API gateway cache, or Redis before touching the database. Each layer trades freshness for latency — invalidation strategy is the real design decision.',
      details: [
        'Browser cache: controlled by Cache-Control. Immutable fingerprinted assets (app.3f9a.js) get max-age=31536000, immutable — invalidation happens by changing the URL. HTML gets no-cache (revalidate every time) or short max-age. ETag/Last-Modified enable 304 revalidation: full round trip, but no body transfer.',
        'CDN/edge cache: caches responses geographically close to users. Cache key design matters — vary on the right headers/query params or you leak one user\'s data to another. Purge APIs or surrogate keys (tag-based invalidation) handle updates.',
        'Application cache (Redis/Memcached): caches expensive computations and hot DB reads. Patterns: cache-aside (app reads cache, on miss reads DB and fills — most common), write-through (write to cache+DB together), write-behind (write to cache, flush to DB async — fast but risks loss).',
        'stale-while-revalidate: serve the stale cached value instantly AND refresh in the background. Users almost never wait; data is at most one revalidation window old. This is the model behind ISR, HTTP s-w-r directives, and client libraries like TanStack Query / SWR.',
        'Invalidation strategies: TTL (simple, bounded staleness), explicit purge on write (precise, but you must know every key a write affects), versioned keys (user:42:v7 — bump the version, old entries age out). The classic failure is the thundering herd: a hot key expires and thousands of requests stampede the DB — fix with request coalescing (single flight), jittered TTLs, or s-w-r.',
        'Cache stampedes, stale reads after writes (read-your-own-writes violations), and double caching (CDN + Redis disagreeing) are the production bugs to mention. Quote the cliché knowingly: "there are only two hard things — cache invalidation and naming things".',
      ],
      diagram: ['Browser cache (Cache-Control / ETag)', 'CDN / edge cache (geo-distributed)', 'API gateway / response cache', 'Redis / Memcached (cache-aside)', 'Database (source of truth)', 'On miss: fill caches on the way back'],
    },
    {
      id: 'micro-frontends',
      title: 'Micro Frontends, Module Federation & Monorepos',
      summary: 'Micro frontends apply service-style team autonomy to the UI: independently built and deployed slices composed into one app. Powerful for org scaling, expensive in payload and consistency.',
      details: [
        'The problem they solve is organizational, not technical: 10 teams blocked on one release train, one giant build, merge conflicts in shared app shell code. Micro frontends let each team own a vertical slice (search, checkout, account) end to end with independent deploys.',
        'Composition options: build-time (npm packages — simplest, but redeploys couple teams again), server-side composition (edge includes / fragments stitched per request), client-side runtime composition (each MFE loads as a remote module into a shell).',
        'Module Federation (webpack 5 / Vite plugins): a runtime mechanism where a "host" loads "remotes" deployed independently, sharing singleton dependencies (one React/Vue instance) by version negotiation. Remotes update without redeploying the host — true independent deployment.',
        'Real costs: duplicated dependencies bloat payloads if sharing is misconfigured; cross-MFE routing, auth, and design-system consistency need contracts; local development of one slice against deployed others requires tooling; one team\'s error monitoring noise pollutes the shared page.',
        'Monorepo (Nx, Turborepo, pnpm workspaces) is the alternative most teams should reach for first: many packages/apps in one repo with shared tooling, atomic cross-cutting changes, and task caching/affected-only CI. A monorepo with enforced module boundaries gives 80% of the autonomy with none of the runtime complexity.',
        'Interview framing: lead with "micro frontends solve a team-scaling problem; below ~5 independent teams a modular monolith in a monorepo is usually better". That ordering shows judgment.',
      ],
      diagram: ['App shell (host) loads', 'Remote entry manifests fetched per MFE', 'Module Federation negotiates shared deps (one framework copy)', 'Each MFE mounts in its slot', 'Teams deploy remotes independently'],
    },
    {
      id: 'database-scaling',
      title: 'Database Scaling: Replication, Sharding, CAP',
      summary: 'Scale reads with replicas, scale writes with shards, and accept that a network partition forces you to choose consistency or availability — that is CAP in one sentence.',
      details: [
        'Vertical scaling (bigger machine) is step zero — simple, no code changes, but has a ceiling and a single point of failure.',
        'Read replication: one primary takes writes and streams its log to replicas serving reads. Most web workloads are read-heavy (often 10:1+), so this goes far. The catch is replication lag: a user writes to the primary, immediately reads from a replica, and sees old data. Fixes: read-your-own-writes routing (pin the user to the primary briefly), sticky sessions, or monotonic-read tokens.',
        'Sharding (horizontal partitioning): split data across nodes by a shard key (user_id hash, region, tenant). Each shard holds a subset; writes scale linearly. Costs: cross-shard queries and joins become scatter-gather, transactions across shards need 2PC or sagas, hot shards (one celebrity user) skew load, and resharding live data is genuinely hard. Consistent hashing minimizes data movement when nodes change.',
        'CAP theorem: under a network Partition you must choose — refuse requests to stay Consistent (CP), or answer with possibly-stale data to stay Available (AP). Without a partition you can have both; the theorem only bites during failures. PACELC extends it: Else (no partition), you still trade Latency vs Consistency.',
        'Mapping to products: bank balance/inventory → CP-leaning (better to error than oversell); feed, likes, presence → AP-leaning (stale is fine, unavailable is not). Saying which of YOUR data needs which guarantee is the senior move.',
        'SQL vs NoSQL is downstream of this: relational DBs give transactions and joins but shard awkwardly; key-value/wide-column stores (Dynamo-style) shard natively and offer tunable consistency at the cost of query flexibility.',
      ],
      diagram: ['All writes → Primary', 'WAL/binlog streams to replicas', 'Reads load-balanced across replicas', 'Replication lag window (stale reads possible)', 'Write volume exceeds one node → shard by key', 'Shard key routes each request to its node'],
    },
    {
      id: 'realtime-delivery',
      title: 'Real-Time Delivery: WebSockets, SSE, Polling',
      summary: 'Real-time = the server tells the client something changed. The transport choice (WebSocket, SSE, long polling) and the fan-out design (who pushes to whom) define the system.',
      details: [
        'Short polling: client asks every N seconds. Trivial, cache-friendly, but latency = N/2 average and wasteful at scale. Fine for slow-changing data (dashboard refreshing every 30s).',
        'Long polling: server holds the request open until data exists or a timeout. Near-real-time over plain HTTP, works through every proxy; the cost is held connections and reconnect churn. The classic pre-WebSocket fallback.',
        'SSE (Server-Sent Events): one long-lived HTTP response streaming text events server→client. Auto-reconnect with Last-Event-ID built in, works with HTTP/2 multiplexing. One-directional — perfect for notifications, feeds, tickers, LLM token streams. Simpler ops than WebSockets.',
        'WebSockets: a persistent full-duplex TCP connection upgraded from HTTP. Bidirectional with minimal per-message overhead — the answer for chat, multiplayer, collaborative editing. Costs: stateful connections break naive load balancing (need sticky routing or a connection-gateway tier), heartbeats to detect dead peers, and reconnect-with-resume logic on the client.',
        'Fan-out architecture: clients connect to a gateway tier; backend services publish events to a pub/sub broker (Redis pub/sub, Kafka, NATS); each gateway subscribes and pushes to its connected sockets. This decouples "who produces events" from "who holds connections" and lets each tier scale independently.',
        'Connection math matters in interviews: 1M concurrent users ≈ 1M open sockets; at ~50k–100k sockets per gateway node you need 10–20 gateways plus a presence/routing layer to find which gateway holds a given user.',
      ],
      diagram: ['Client opens WebSocket/SSE to gateway tier', 'Gateway registers connection (user → gateway mapping)', 'Service emits event → pub/sub broker', 'Broker fans out to subscribed gateways', 'Gateway pushes to the right sockets', 'Client reconnects with backoff + resume cursor on drop'],
    },
    {
      id: 'api-design',
      title: 'API Design: REST, GraphQL, and Pagination',
      summary: 'REST models resources over HTTP semantics; GraphQL lets clients declare data shape in one round trip. Pagination strategy (offset vs cursor) is a small choice with large consequences at scale.',
      details: [
        'REST: nouns as URLs, verbs as methods, status codes as outcomes. Strengths: HTTP caching works natively (GET + Cache-Control + ETags), simple mental model, easy CDN integration. Weaknesses: over-fetching (fixed response shapes) and under-fetching (N+1 round trips for nested data — the mobile-app killer).',
        'GraphQL: a typed schema; clients send queries describing exactly the shape they need; one round trip resolves nested data. Strengths: no over/under-fetching, schema as a typed contract, great for many client types with different needs. Costs: HTTP caching is mostly lost (POST + per-query shapes), N+1 moves server-side (solved with DataLoader batching), query cost analysis needed to prevent abusive deep queries, and a heavier server.',
        'Honest guidance: REST for public APIs and resource-shaped domains; GraphQL when many differently-shaped clients aggregate many backend sources (and you have the platform investment); tRPC/RPC styles when one team owns both ends in TypeScript.',
        'Offset pagination (?page=3&limit=20 → OFFSET 40): simple, supports "jump to page N", but the DB must scan and discard offset rows (slow on deep pages), and concurrent inserts/deletes shift rows — users see duplicates or gaps while scrolling.',
        'Cursor (keyset) pagination: return an opaque cursor encoding the last item\'s sort key (e.g., created_at + id); next page is WHERE (created_at, id) < cursor ORDER BY ... LIMIT 20 — an index seek, O(page size) regardless of depth, and stable under inserts. The cost: no random page access, and the cursor must encode a unique, ordered key.',
        'Infinite-scroll feeds should always be cursor-based. Also mention API versioning (URL vs header), idempotent retries for unsafe methods, and consistent error envelopes — small things that signal production experience.',
      ],
    },
    {
      id: 'observability-flags',
      title: 'Observability, Feature Flags & Error Monitoring',
      summary: 'You cannot operate what you cannot see. Logs, metrics, and traces answer different questions; feature flags decouple deploy from release; error monitoring closes the loop from user pain to fix.',
      details: [
        'The three pillars: logs (discrete events with context — "what happened in this request"), metrics (cheap aggregated numbers over time — "how many, how fast, error rate" → dashboards and alerts), traces (one request\'s journey across services with per-hop timing — "where did the latency go"). A trace ID stitched into logs connects all three.',
        'Frontend observability is its own layer: Core Web Vitals from real users (RUM) via the web-vitals library, JS error capture with sourcemap-decoded stacks, and user-session breadcrumbs. Lab data (Lighthouse) catches regressions pre-merge; field data (RUM) tells the truth about real devices and networks.',
        'Error monitoring (Sentry-style): capture exceptions with release version, user context, and breadcrumbs; group by stack fingerprint; alert on new or spiking issues. Wire releases so you can answer "did deploy X cause this?" in one click.',
        'Feature flags decouple deploy from release: ship dark, enable per cohort (internal → 1% → 10% → 100%), kill instantly without a deploy. They enable trunk-based development and A/B experiments. Costs: flag debt (stale flags = dead branches in code — schedule removal), combinatorial testing surface, and flag-evaluation consistency across server and client renders (SSR hydration mismatch risk).',
        'SLI/SLO vocabulary: an SLI is a measured indicator (p99 latency, availability); an SLO is the target (99.9% of requests < 400ms); the error budget is the allowed shortfall — when it is spent, you stop shipping features and fix reliability. Mentioning error budgets in the wrap-up of a design answer lands well.',
        'Alert design: alert on user-facing symptoms (error rate, latency SLO burn), not causes (CPU%). Page humans only for actionable things; everything else goes to dashboards.',
      ],
    },
  ],

  keywords: [
    {
      id: 'cdn',
      term: 'CDN (Content Delivery Network)',
      importance: 5,
      whyAsked: 'Almost every design touches a CDN, and frontend candidates are expected to know exactly what is cacheable at the edge and how invalidation works.',
      explanation: 'A geographically distributed cache of servers. Users hit the nearest edge node (point of presence); on a miss the edge fetches from origin and caches per Cache-Control/surrogate headers. Cuts latency (physics: shorter distance), offloads origin, and absorbs traffic spikes and many DDoS patterns.',
      realWorldExample: 'Fingerprinted JS/CSS bundles cached for a year at the edge; product images served via CDN with on-the-fly resizing; even API GETs cached for 30s during a traffic spike.',
      commonMistakes: [
        'Treating the CDN as static-files-only — modern CDNs cache API responses, run edge functions, and do SSR at the edge',
        'Ignoring cache-key design: forgetting to vary on Accept-Language or auth state can serve one user\'s page to another',
        'No purge story: "we cache for a day" with no answer for "what happens when legal needs it gone now"',
      ],
      followUps: ['How do you invalidate a CDN-cached page after a content update?', 'What headers control edge caching vs browser caching? (s-maxage vs max-age)', 'When would you NOT cache at the CDN?'],
      diagram: ['User request', 'Nearest edge PoP', 'Cache hit → respond in ~10–50ms', 'Miss → fetch origin → cache per headers', 'Subsequent users in region served from edge'],
    },
    {
      id: 'stale-while-revalidate',
      term: 'Stale-While-Revalidate',
      importance: 4,
      whyAsked: 'It is the single pattern unifying HTTP caching, ISR, and client data libraries — knowing it shows you understand modern caching end to end.',
      explanation: 'Serve the cached (possibly stale) value immediately, then refresh it in the background so the NEXT request is fresh. Users get cache-hit latency virtually always; staleness is bounded by the revalidation window. Exists as an HTTP directive (Cache-Control: max-age=60, stale-while-revalidate=600), as ISR for HTML, and as the core strategy of TanStack Query/SWR on the client.',
      realWorldExample: 'A product page rendered via ISR: visitors always get a cached page instantly; after the 60s window, the first visitor still gets the cached page while regeneration happens behind the scenes.',
      commonMistakes: ['Using it for data where stale reads are harmful (account balance, inventory at checkout)', 'Unbounded stale windows — pair s-w-r with a hard stale-if-error/max staleness limit'],
      followUps: ['How does ISR implement this for HTML?', 'How does TanStack Query decide when data is stale?', 'What is the thundering-herd connection?'],
    },
    {
      id: 'cap-theorem',
      term: 'CAP Theorem',
      importance: 5,
      whyAsked: 'The canonical distributed-systems litmus test. Interviewers check you know it only applies under partition and can map C-vs-A to concrete product features.',
      explanation: 'In a distributed store, when a network partition occurs you must pick: Consistency (every read sees the latest write — so some nodes refuse requests) or Availability (every request gets a response — possibly stale). It is a forced choice only DURING partitions; PACELC adds that even without partitions you trade latency vs consistency.',
      realWorldExample: 'Payment ledger: CP — reject writes rather than double-spend. Like counts and presence indicators: AP — show a slightly old number rather than an error.',
      commonMistakes: [
        '"Pick two of three" framing — P is not optional; networks WILL partition',
        'Labeling whole databases as CP or AP when many (Dynamo-style, Cosmos) offer per-request tunable consistency',
        'Not connecting it to the product: the useful answer is which of YOUR features needs which guarantee',
      ],
      followUps: ['What is PACELC?', 'What consistency does a read replica give you?', 'Design a like counter — C or A, and why?'],
    },
    {
      id: 'token-bucket',
      term: 'Rate Limiting (Token Bucket & friends)',
      importance: 4,
      whyAsked: 'A compact algorithm question with real production stakes: protecting APIs from abuse and overload. Often doubles as a coding exercise.',
      explanation: 'Token bucket: a bucket holds up to N tokens, refilled at R tokens/sec; each request spends one; empty bucket → reject or queue. Allows short bursts (bucket depth) while enforcing average rate R. Alternatives: leaky bucket (constant outflow, smooths bursts), fixed window counter (simple, but bursts at window edges allow 2× rate), sliding window log/counter (accurate, more state). Distributed enforcement typically lives in Redis with atomic Lua scripts.',
      realWorldExample: 'Public API: 100 requests/min per API key with burst of 20. Login endpoint: aggressive per-IP + per-account limits as brute-force defense. Return 429 with Retry-After.',
      commonMistakes: ['Fixed window without acknowledging the boundary-burst flaw', 'Per-instance in-memory counters behind a load balancer — limits become per-node, not global', 'Forgetting the client side: honor Retry-After and back off, do not hammer'],
      followUps: ['Implement a token bucket', 'How do you rate limit across 20 API servers?', 'How do limits interact with retries and exponential backoff?'],
      diagram: ['Bucket capacity N, refill R/sec', 'Request arrives', 'Token available? → take token, allow', 'Empty? → 429 + Retry-After', 'Tokens refill continuously up to N'],
    },
    {
      id: 'message-queue',
      term: 'Message Queue',
      importance: 4,
      whyAsked: 'Queues are the standard answer for "this work does not need to happen in the request path" — interviewers test whether you know the delivery-semantics fine print.',
      explanation: 'A buffer decoupling producers from consumers: the API enqueues a job (send email, resize image, fan out a post) and responds immediately; workers consume at their own pace. Benefits: spike absorption, retry with backoff, independent scaling of consumers. Semantics to know: at-least-once delivery is the norm → consumers must be idempotent; ordering is usually per-partition/per-key only; failed messages go to a dead-letter queue after N attempts.',
      realWorldExample: 'Image upload: API stores the original and enqueues "generate thumbnails" — the user is not blocked on resizing. Order placed → events consumed independently by email, analytics, and inventory services.',
      commonMistakes: ['Assuming exactly-once delivery — design consumers idempotent instead', 'No dead-letter strategy: one poison message blocks or loops forever', 'Queueing things the user must see synchronously (their own profile edit)'],
      followUps: ['Queue (one consumer per message) vs pub/sub (every subscriber gets a copy)?', 'How do you handle a poison message?', 'Why must consumers be idempotent?'],
    },
    {
      id: 'pagination',
      term: 'Cursor vs Offset Pagination',
      importance: 4,
      whyAsked: 'A deceptively small topic that exposes whether a candidate has run list endpoints at real data sizes.',
      explanation: 'Offset (OFFSET 5000 LIMIT 20) scans and discards 5000 rows — deep pages get slower linearly, and concurrent writes shift items between pages (duplicates/gaps). Cursor/keyset pagination encodes the last item\'s unique sort key into an opaque token; the next page is an index seek (WHERE key < cursor LIMIT 20) — constant cost at any depth and stable under inserts. Tradeoff: no jump-to-page-N, requires a unique orderable key.',
      realWorldExample: 'Every infinite-scroll feed (social timelines, chat history) is cursor-based. Admin tables with explicit page numbers are the legitimate offset use case.',
      commonMistakes: ['Cursoring on a non-unique column (created_at alone) — ties skip or duplicate rows; add id as tiebreaker', 'Exposing raw SQL values as the cursor instead of an opaque encoded token'],
      followUps: ['Why does OFFSET get slow?', 'Design the cursor for a feed sorted by relevance score', 'How does GraphQL\'s connection spec model this?'],
    },
    {
      id: 'core-web-vitals',
      term: 'Core Web Vitals & Performance Budgets',
      importance: 5,
      whyAsked: 'For frontend-leaning design rounds this IS the non-functional requirements section: you are expected to name the metrics, thresholds, and the CI guardrails.',
      explanation: 'Google\'s user-centric field metrics: LCP (Largest Contentful Paint, loading — good < 2.5s), INP (Interaction to Next Paint, responsiveness — good < 200ms), CLS (Cumulative Layout Shift, visual stability — good < 0.1). Measured at the 75th percentile of real users. A performance budget makes targets enforceable: limits on bundle size, LCP, or request count checked in CI (Lighthouse CI, bundlesize) so regressions fail the PR instead of reaching users.',
      realWorldExample: 'Budget: ≤ 200KB gzipped JS on the landing route, LCP < 2.5s on emulated mid-range mobile. A PR adding a 90KB charting library to the landing page fails CI and gets lazy-loaded instead.',
      commonMistakes: ['Only quoting lab (Lighthouse) numbers — field/RUM data at p75 is what ranking and users experience', 'Still citing FID — INP replaced it in 2024', 'Setting budgets without CI enforcement (they decay immediately)'],
      followUps: ['How do you improve LCP specifically? (preload hero image, server-render, cut TTFB)', 'What causes poor INP and how does long-task chunking help?', 'Lab vs field data?'],
    },
    {
      id: 'websocket-vs-sse',
      term: 'WebSocket vs SSE vs Long Polling',
      importance: 4,
      whyAsked: 'Choosing the right real-time transport — and knowing the operational cost of stateful connections — separates candidates who have shipped real-time features from those who have read about them.',
      explanation: 'WebSocket: full-duplex persistent connection — needed when the CLIENT also pushes frequently (chat typing, games, collab editing). SSE: server→client streaming over plain HTTP with built-in auto-reconnect and event IDs — ideal for notifications, feeds, token streams, and simpler to operate (works with HTTP/2, normal proxies). Long polling: hold the HTTP request until data arrives — the universal fallback. Rule of thumb: if data flows one way, SSE; two ways at high frequency, WebSocket.',
      realWorldExample: 'LLM chat UIs stream tokens over SSE; the collaborative cursor positions in a Figma-like tool ride WebSockets; a legacy-proxy-constrained enterprise app falls back to long polling.',
      commonMistakes: ['Defaulting to WebSockets for one-directional data and inheriting sticky-routing, heartbeat, and reconnect complexity for nothing', 'Forgetting reconnect + missed-message recovery (resume cursors / Last-Event-ID)'],
      followUps: ['How do you load-balance a million WebSocket connections?', 'How does the client recover messages missed while disconnected?', 'Why is SSE easier behind HTTP/2?'],
    },
    {
      id: 'sharding',
      term: 'Sharding & Consistent Hashing',
      importance: 4,
      whyAsked: 'The standard "writes do not fit one node" answer; interviewers probe shard-key choice and the resharding pain to see real understanding.',
      explanation: 'Partition data across nodes by a shard key so each node owns a subset of writes. Key choice drives everything: hash(user_id) spreads load evenly but kills range queries; range keys keep scans local but risk hotspots. Consistent hashing maps keys and nodes onto a ring so adding/removing a node moves only ~1/N of keys (vs naive mod-N rehashing everything) — virtual nodes smooth the distribution.',
      realWorldExample: 'Chat system sharded by conversation_id: all messages of a conversation co-locate, so loading a thread is single-shard. A celebrity user is the classic hot-shard problem (mitigate by splitting hot entities or caching in front).',
      commonMistakes: ['Choosing a shard key that the main query pattern cannot use (every read becomes scatter-gather)', 'Ignoring cross-shard transactions and joins', 'Treating resharding as free — live migration is one of the hardest ops tasks'],
      followUps: ['How does consistent hashing reduce data movement?', 'What would you shard a Twitter-like system by?', 'How do you handle a hot shard?'],
    },
    {
      id: 'hydration',
      term: 'Hydration',
      importance: 4,
      whyAsked: 'The frontend-specific internals question inside SSR discussions — it explains why server rendering alone does not make apps feel fast.',
      explanation: 'After SSR/SSG HTML paints, the framework downloads the JS bundle, re-creates the component tree (re-running component code against serialized state), and attaches event listeners to the existing DOM. Until complete, the page looks ready but ignores interaction. Hydration mismatches (server HTML ≠ client render — e.g., timestamps, random IDs, locale) cause warnings, flicker, or full client re-renders.',
      realWorldExample: 'A server-rendered storefront where the "Add to cart" button does nothing for 2 seconds on a mid-range phone — visible-but-dead UI is a hydration cost, measured by TBT/INP.',
      commonMistakes: ['Thinking SSR removes the JS cost — you pay render twice (server + client) unless you use partial hydration/islands/server components', 'Causing mismatches with Date.now()/Math.random() in render paths'],
      followUps: ['What are islands architecture and partial hydration?', 'How do server components change the hydration story?', 'How do you debug a hydration mismatch?'],
    },
    {
      id: 'load-balancing',
      term: 'Load Balancing',
      importance: 3,
      whyAsked: 'Baseline horizontal-scaling vocabulary; the interesting follow-ups are health checks, session state, and L4 vs L7.',
      explanation: 'A load balancer distributes requests across identical stateless servers. Algorithms: round robin (default), least connections (better under uneven request cost), IP/cookie hash (sticky sessions for stateful protocols). L4 balances on TCP (fast, opaque); L7 understands HTTP (path routing, header-based routing, TLS termination). Health checks eject failing nodes; the LB itself is made redundant via DNS/anycast pairs.',
      realWorldExample: 'L7 LB routing /api/* to the API pool and /* to SSR nodes, terminating TLS once, with least-connections to handle slow SSR renders without piling up.',
      commonMistakes: ['Needing sticky sessions because servers hold session state — externalize sessions to Redis/JWT and stay stateless instead', 'Forgetting WebSockets need connection-aware (sticky or gateway-tier) routing'],
      followUps: ['L4 vs L7 — when does each matter?', 'How do health checks avoid flapping?', 'Where does the LB itself fail over?'],
    },
    {
      id: 'horizontal-vertical',
      term: 'Horizontal vs Vertical Scaling',
      importance: 3,
      whyAsked: 'A warm-up that reveals whether the candidate knows statelessness is the prerequisite for scaling out.',
      explanation: 'Vertical: bigger machine — zero code change, preserves single-node simplicity (transactions, in-memory state), but has a hard ceiling, downtime to resize, and one blast radius. Horizontal: more machines behind a balancer — near-unlimited and fault-tolerant, but requires stateless services (no local sessions/files), externalized state (Redis, object storage), and distributed-systems problems arrive (consistency, partial failure).',
      realWorldExample: 'Scale the database vertically as long as you can (simplest), scale stateless API/SSR nodes horizontally from day one behind a balancer.',
      commonMistakes: ['Reciting "horizontal is better" — for databases especially, vertical-first is often the pragmatic call', 'Scaling out an app that writes to local disk or memory sessions and breaking it'],
      followUps: ['What state must move out of the app servers before scaling out?', 'Why is the database usually the last thing scaled horizontally?'],
    },
    {
      id: 'observability-pillars',
      term: 'Logs, Metrics & Traces',
      importance: 4,
      whyAsked: 'The "how do you know it works in production" wrap-up question — seniors are expected to volunteer it without prompting.',
      explanation: 'Metrics: cheap pre-aggregated numbers (request rate, error rate, p99 latency) → dashboards + alerting; you cannot ask new questions of them after the fact. Logs: rich per-event records, searchable, expensive at volume — sample or tier them. Traces: a request\'s tree of spans across services with timing — the tool for "which hop added 800ms". Correlate all three via a propagated trace/request ID, including from the browser (traceparent header).',
      realWorldExample: 'Alert fires on p99 latency (metric) → trace shows 90% of time in the recommendations service → its logs (filtered by trace ID) show cache-miss storms after a deploy.',
      commonMistakes: ['Logging everything at INFO and discovering the bill later', 'Alerting on causes (CPU) instead of symptoms (SLO burn)', 'No frontend telemetry — the user\'s device is where latency actually happens'],
      followUps: ['What is distributed tracing context propagation?', 'What would you put on the dashboard for the system you just designed?', 'SLI vs SLO vs error budget?'],
    },
  ],

  cheatSheets: [
    {
      id: 'rendering-comparison',
      title: 'Rendering strategies compared',
      rows: [
        { concept: 'CSR', description: 'HTML built in browser. Cheap hosting, app-like; slow first paint, SEO work needed. Use: authenticated dashboards.' },
        { concept: 'SSR', description: 'HTML per request on server. Fast FCP, SEO-friendly, personalizable; server cost, TTFB includes data fetch. Use: dynamic public pages.' },
        { concept: 'SSG', description: 'HTML at build time, served by CDN. Fastest + cheapest; content frozen until rebuild. Use: docs, marketing, blogs.' },
        { concept: 'ISR', description: 'SSG + background regeneration after a staleness window (s-w-r for HTML). Use: large catalogs, CMS content.' },
        { concept: 'Hydration', description: 'JS re-attaches interactivity to server HTML. The visible-but-dead gap; hurts TBT/INP. Mitigate: islands, partial hydration, server components.' },
        { concept: 'Edge SSR', description: 'Render at CDN PoPs: SSR personalization with CDN latency. Constraint: limited runtime APIs at the edge.' },
      ],
    },
    {
      id: 'pagination-cheat',
      title: 'Pagination strategies',
      rows: [
        { concept: 'Offset/limit', description: 'OFFSET n LIMIT m. Jump-to-page works; deep pages slow (scan+discard), unstable under writes.', code: 'GET /items?page=5&limit=20' },
        { concept: 'Cursor/keyset', description: 'Opaque token of last sort key; index seek, O(page) at any depth, stable. No random access.', code: 'GET /items?cursor=eyJpZCI6OTh9&limit=20' },
        { concept: 'Cursor key rule', description: 'Cursor column(s) must be unique + orderable — add id as tiebreaker to timestamps.', code: 'WHERE (created_at, id) < ($1, $2) ORDER BY created_at DESC, id DESC' },
        { concept: 'Infinite scroll', description: 'Always cursor-based + intersection observer trigger + virtualized list for DOM cost.' },
        { concept: 'Total counts', description: 'COUNT(*) on big tables is expensive — return hasMore/estimates instead of exact totals.' },
      ],
    },
    {
      id: 'rate-limit-cheat',
      title: 'Rate limiting algorithms',
      rows: [
        { concept: 'Token bucket', description: 'Capacity N, refill R/s; allows bursts up to N at average rate R. The default choice.' },
        { concept: 'Leaky bucket', description: 'Queue drained at constant rate — smooths output, adds queuing delay. Traffic shaping.' },
        { concept: 'Fixed window', description: 'Counter per window. Simplest; boundary burst allows ~2× limit across the edge.' },
        { concept: 'Sliding window log', description: 'Timestamp per request — exact, O(rate) memory per key. High-value keys only.' },
        { concept: 'Sliding window counter', description: 'Weighted blend of current+previous window — near-exact, O(1) memory. Common in practice.' },
        { concept: 'Distributed', description: 'Counters in Redis with atomic Lua/INCR+EXPIRE; accept slight overshoot for availability.' },
        { concept: 'Response contract', description: '429 + Retry-After + X-RateLimit-Remaining headers; clients back off exponentially with jitter.' },
      ],
    },
    {
      id: 'caching-cheat',
      title: 'Caching quick reference',
      rows: [
        { concept: 'Immutable assets', description: 'Fingerprinted filenames, cache forever; invalidate by URL change.', code: 'Cache-Control: public, max-age=31536000, immutable' },
        { concept: 'HTML', description: 'Always revalidate (or short TTL) so deploys propagate.', code: 'Cache-Control: no-cache' },
        { concept: 'Shared vs browser TTL', description: 's-maxage controls CDN; max-age controls browser.', code: 'Cache-Control: max-age=0, s-maxage=300' },
        { concept: 'ETag / 304', description: 'Conditional revalidation: round trip yes, body transfer no.', code: 'If-None-Match: "abc" → 304 Not Modified' },
        { concept: 'stale-while-revalidate', description: 'Serve stale instantly, refresh in background.', code: 'Cache-Control: max-age=60, stale-while-revalidate=600' },
        { concept: 'Cache-aside (Redis)', description: 'Read cache → miss → read DB → fill with TTL. Invalidate or version keys on write.' },
        { concept: 'Thundering herd', description: 'Hot key expires → stampede. Fix: single-flight coalescing, jittered TTLs, s-w-r.' },
      ],
    },
    {
      id: 'realtime-cheat',
      title: 'Real-time transport comparison',
      rows: [
        { concept: 'Short polling', description: 'Request every N sec. Simple, cacheable; latency + waste. Slow dashboards.' },
        { concept: 'Long polling', description: 'Hold request until data/timeout. Near-real-time, proxy-safe; reconnect churn. Universal fallback.' },
        { concept: 'SSE', description: 'One-way server→client stream over HTTP; auto-reconnect + Last-Event-ID. Notifications, feeds, LLM tokens.' },
        { concept: 'WebSocket', description: 'Full-duplex persistent socket. Chat, games, collab editing; needs sticky routing, heartbeats, resume logic.' },
        { concept: 'Fan-out shape', description: 'Clients → gateway tier (holds sockets) ← pub/sub broker ← services. Scale tiers independently.' },
        { concept: 'Push vs pull feeds', description: 'Push (fan-out-on-write) = fast reads, celebrity write amplification. Pull (fan-out-on-read) = cheap writes, slow reads. Hybrid wins.' },
      ],
    },
  ],

  questions: [
    {
      id: 'q-run-interview',
      level: 'beginner',
      question: 'How do you structure a 45-minute system design interview?',
      answer: 'Five phases: (1) requirements — functional and non-functional, ask scoping questions; (2) back-of-envelope estimates — QPS, storage, bandwidth to justify later choices; (3) high-level design — draw the request path client → edge → services → data and name every arrow; (4) deep dive — go to schema/algorithm depth on one or two components; (5) tradeoffs — failure modes, what breaks at 10×, what you would monitor. Check in with the interviewer between phases.',
      deepDive: 'The most common failure is skipping phase 1 and designing the wrong system. The second most common is breadth-only: ten boxes, no depth anywhere. As a frontend-leaning candidate, proactively steer the deep dive toward client architecture, caching, or real-time delivery where your depth is real.',
      followUps: ['What non-functional requirements do you always ask about?', 'How do you handle an interviewer who keeps redirecting you?'],
    },
    {
      id: 'q-estimates',
      level: 'beginner',
      question: 'Estimate the QPS and storage for a photo-sharing app with 10M DAU.',
      answer: 'Assume each user views 50 photos and uploads 0.5/day. Reads: 10M × 50 = 500M/day ≈ 500M / 86,400 ≈ ~6,000 QPS average, ~20k peak (×3). Writes: 5M/day ≈ 60 QPS — heavily read-dominated. Storage: 5M photos/day × 2MB ≈ 10TB/day, ~3.6PB/year before replication — so object storage + CDN, with only metadata (~few hundred bytes/photo) in the database.',
      deepDive: 'The skill being tested is deriving design decisions from numbers: 6k read QPS with a 100:1 read ratio says "cache aggressively, replicate reads"; 10TB/day says "blobs never go in the database". Round aggressively — 86,400 seconds/day ≈ 10^5 keeps mental math honest.',
      followUps: ['How much bandwidth does serving those reads take?', 'What changes if it is video?'],
    },
    {
      id: 'q-ssr-vs-csr',
      level: 'intermediate',
      question: 'You are building a public e-commerce product page. SSR, CSR, SSG, or ISR — and why?',
      answer: 'ISR (or SSR with edge caching). The page must be SEO-indexable and paint fast (LCP is conversion money), ruling out pure CSR. Pure SSG breaks at catalog scale — millions of SKUs and hourly price changes make full rebuilds impractical. ISR pre-renders popular pages, regenerates on a staleness window, and renders rare pages on first request. Personalized parts (cart count, recommendations) hydrate client-side on top of the cached shell.',
      deepDive: 'This split — cacheable shell server-rendered, personalized islands client-fetched — is the standard production answer. Mention that price/stock accuracy at checkout must come from a fresh API call regardless of what the cached page shows, which neatly demonstrates consistency-requirements thinking.',
      realWorldExample: 'Large storefronts render product detail pages statically with revalidation, while cart, inventory badges, and recommendations are client-side fetches.',
      followUps: ['Where does the inventory count come from if the page is cached?', 'How would you measure whether this improved conversion?'],
    },
    {
      id: 'q-design-autocomplete',
      level: 'intermediate',
      question: 'Design a search autocomplete (typeahead) system.',
      answer: 'Client: debounce input (~200ms), cancel in-flight requests with AbortController (stale-response race), cache prefix→results in memory, require min 2 chars, highlight matches, full keyboard/a11y support. API: GET /suggest?q=prefix returning top-10, cacheable at the CDN for popular prefixes with short TTL. Server: a trie or precomputed top-K per prefix kept in memory/Redis — suggestions are computed offline from query logs (batch job ranks by frequency/recency), so the read path is a pure lookup at <10ms.',
      deepDive: 'The insight interviewers want: do not rank at query time. Precompute top-K suggestions per prefix offline; the online path is a hash/trie lookup. Popular prefixes are few — they fit in memory and CDN-cache beautifully. Personalized suggestions blend a small per-user history layer client-side over the global results.',
      followUps: ['How do trending queries enter suggestions quickly?', 'How do you filter offensive suggestions?', 'Why AbortController and not just debounce?'],
    },
    {
      id: 'q-design-feed',
      level: 'advanced',
      question: 'Design a news feed (Twitter/Instagram style). Focus on fan-out.',
      answer: 'Write path: post → store → enqueue fan-out. Fan-out-on-write (push): insert the post ID into each follower\'s precomputed feed list (Redis) — reads become a cheap list fetch, but a 50M-follower celebrity means 50M writes per post. Fan-out-on-read (pull): compute the feed at request time by merging recent posts of all followees — cheap writes, expensive reads. Production answer: hybrid — push for normal users, pull-and-merge for celebrity authors at read time. Client: cursor-paginated infinite scroll, virtualized list, optimistic like updates.',
      deepDive: 'Discuss feed storage as capped per-user lists of post IDs (hydrate post content from a cache at read), ranking as a separate scoring service over the candidate IDs, and eventual consistency: a post appearing in followers\' feeds seconds late is fine — say that explicitly. New-user cold start and deleted-post tombstones are good volunteer details.',
      followUps: ['Where do ads/ranking fit in this flow?', 'How do you handle a deleted post already fanned out?', 'What is the cursor for a ranked (non-chronological) feed?'],
    },
    {
      id: 'q-design-upload',
      level: 'advanced',
      question: 'Design an image upload service (client to CDN).',
      answer: 'Client requests a presigned upload URL from the API, then uploads the file directly to object storage — bytes never transit your API servers. Client-side: validate type/size, compress/resize before upload when possible, show progress, support retry (chunked/multipart for large files). On upload completion an event triggers a worker queue: virus scan, generate size variants (thumb/medium/large) and modern formats (WebP/AVIF), strip EXIF (privacy: GPS data), then mark the record ready. Serving: CDN in front of object storage, srcset for responsive variants, lazy loading below the fold.',
      deepDive: 'Presigned URLs are the headline pattern: the API authorizes (signs constraints: content-type, max size, key, expiry) without proxying bytes. Processing is async because users should not wait on transcoding — the UI shows the optimistic original with a "processing" state. Mention idempotency: retried uploads with the same upload ID must not duplicate records.',
      followUps: ['Why presigned URLs instead of uploading through the API?', 'How does the client know processing finished? (poll vs SSE/webhook)', 'How do you deduplicate identical uploads? (content hash)'],
    },
    {
      id: 'q-design-chat',
      level: 'advanced',
      question: 'Design a real-time chat system (1:1 and small groups).',
      answer: 'Clients hold WebSockets to a gateway tier; a session/presence service maps user → gateway. Send flow: message → gateway → chat service → persist (DB sharded by conversation_id, messages ordered by a per-conversation sequence) → publish to broker → recipient\'s gateway pushes it; offline recipients get a push notification instead. Delivery states (sent/delivered/read) are receipt events flowing back the same path. Client keeps a local store for instant rendering, sends with optimistic UI + client-generated message IDs for dedupe, and on reconnect syncs everything after its last sequence number.',
      deepDive: 'The senior details: at-least-once delivery + client-side dedupe by message ID (exactly-once is a myth across this many hops); per-conversation ordering via sequence numbers rather than timestamps (clock skew); reconnect-with-cursor as the recovery mechanism; heartbeats for presence with a grace period to avoid flapping. Group chat fan-out happens server-side per recipient.',
      followUps: ['How does typing indicator traffic differ from messages? (ephemeral, no persistence, throttled)', 'End-to-end encryption — what does the server lose?', 'How would you support 100k-member channels? (that becomes feed-style pull, not push)'],
    },
    {
      id: 'q-collab-editor',
      level: 'expert',
      question: 'Two users edit the same document simultaneously. How do you keep them consistent (Google-Docs-lite)?',
      answer: 'Concurrent edits to shared text need a convergence algorithm — naive last-write-wins loses keystrokes. Two families: OT (Operational Transformation) — operations like insert(5, "a") are transformed against concurrent ops, usually via a central server that orders them (Google Docs lineage); and CRDTs — data structures (e.g., Yjs) where each character has a unique stable ID and concurrent operations merge commutatively on every replica, no central ordering required. Transport is WebSockets; clients apply local edits optimistically and exchange ops/updates; presence (cursors, selections) is broadcast as ephemeral state.',
      deepDive: 'For an interview build, the pragmatic answer is "use Yjs (CRDT) + y-websocket": CRDTs trade some memory/metadata overhead for offline support and serverless-friendly merging, while OT is leaner but the transformation logic is notoriously hard to get right. Snapshots + op-log compaction keep history bounded; persistence stores periodic snapshots plus recent updates.',
      followUps: ['Why does last-write-wins fail for text specifically?', 'How do CRDTs handle two inserts at the same position? (ID ordering tiebreak)', 'How do you implement undo in a collaborative context? (undo your own ops only)'],
    },
    {
      id: 'q-cache-invalidation',
      level: 'intermediate',
      question: 'A user updates their profile name but still sees the old name after refresh. Walk through where the stale data could live and how you would fix it.',
      answer: 'Audit every cache layer in the read path: (1) client state/query cache — invalidate or optimistically update the query after mutation; (2) browser HTTP cache — the profile API response may have a max-age; should be no-cache or mutation should bust it; (3) CDN — if profile responses are edge-cached, purge by surrogate key on write; (4) Redis — delete or version the user:42 key in the same transaction/outbox as the DB write; (5) read replicas — replication lag; route the user\'s own reads to the primary briefly after a write (read-your-own-writes).',
      deepDive: 'This question tests systematic layer-by-layer reasoning. The strongest answers also name the general principle: a user must read their own writes even when everyone else can tolerate staleness — different consistency requirements for the same data depending on who is asking.',
      followUps: ['What is a surrogate key purge?', 'How do versioned cache keys avoid explicit invalidation?'],
    },
    {
      id: 'q-rate-limit-design',
      level: 'intermediate',
      question: 'Design rate limiting for a public API served by 20 stateless servers.',
      answer: 'Per-key (API key/user, fall back to IP) token bucket: capacity for bursts, refill rate for sustained throughput. State must be shared — Redis with an atomic Lua script that reads the bucket, refills based on elapsed time, and decides in one round trip. Return 429 with Retry-After and X-RateLimit-* headers. Place the check at the gateway/middleware layer before expensive work. Tiered limits per plan; separate stricter limits for expensive endpoints and auth endpoints.',
      deepDive: 'Tradeoffs to volunteer: strict global accuracy vs availability — if Redis is down, fail open (allow) for most APIs, fail closed for abuse-sensitive endpoints like login. Local in-memory pre-limits in each node can shed egregious abuse before touching Redis. Mention that retries with exponential backoff + jitter on the client side prevent synchronized retry storms.',
      followUps: ['Why must the Redis operations be atomic?', 'Fail open or fail closed when the limiter is unreachable?', 'How would you rate limit by cost rather than count (GraphQL)?'],
    },
    {
      id: 'q-state-at-scale',
      level: 'advanced',
      question: 'How do you architect client state management for a large app (50+ engineers, hundreds of routes)?',
      answer: 'First, split state by kind: server cache (API data — belongs in TanStack Query/SWR-style libraries with s-w-r, dedupe, and invalidation, NOT in a global store), global client state (auth session, theme, feature flags — small, in Pinia/Redux/Zustand), local UI state (component-level), and URL state (filters, pagination — shareable/bookmarkable, belongs in the router). Most "state management problems" come from putting server data in a global store and hand-rolling caching. Organize stores per feature/domain, not one god store; define ownership boundaries so teams do not write to each other\'s state.',
      deepDive: 'At org scale the design questions are about boundaries: which module owns a piece of state, what is its public interface, and how cross-feature communication happens (events/composables vs direct store imports). Mention normalization for entity-heavy domains (one source of truth per entity ID), and optimistic updates with rollback as the UX-vs-consistency tradeoff.',
      followUps: ['Why is server state different from client state?', 'How do you prevent two micro frontends from both owning the auth state?'],
    },
    {
      id: 'q-cwv-regression',
      level: 'intermediate',
      question: 'Your LCP regressed from 2.1s to 3.8s at p75 after a release. How do you diagnose and prevent recurrence?',
      answer: 'Diagnose: compare RUM data segmented by page/device/geo to localize it; reproduce in Lighthouse/WebPageTest against the previous release; inspect what the LCP element is and its dependency chain — common causes: hero image no longer preloaded or now lazy-loaded, render-blocking script added, fonts blocking, TTFB regression from an API/SSR change, or a client-side data fetch newly gating the hero. Fix accordingly (preload, priority hints, defer scripts, cache TTFB path). Prevent: Lighthouse CI with budget assertions on key routes so the regression fails the PR, plus RUM alerting on p75 thresholds.',
      deepDive: 'Strong answers distinguish lab vs field: the regression is real in field data; the lab is where you bisect it. Knowing that LCP is element-specific — find the element, walk its request chain — turns a vague "performance issue" into a 20-minute diagnosis.',
      followUps: ['What is fetchpriority="high" and when does it help LCP?', 'Why might lab data not show a field regression? (device/network distribution)'],
    },
    {
      id: 'q-microfrontends-when',
      level: 'expert',
      question: 'Your company is considering micro frontends. As the senior engineer, how do you evaluate the decision?',
      answer: 'Start from the problem, not the pattern: micro frontends solve independent deployment for many teams on one surface — they are an organizational tool with a technical cost. Evaluate: team count and coupling pain (below ~5 teams, a modular monolith in a monorepo with enforced boundaries and good CI caching usually solves the real pain), payload budget (shared dependency discipline or users pay twice), consistency requirements (design system, auth, routing contracts must be owned by someone), and operational maturity (independent deploys need independent monitoring and versioned contracts). If adopted: module federation with strict shared-singleton config, a thin shell owning routing/auth, and contract tests between shell and remotes.',
      deepDive: 'The expected senior behavior is articulating the reversal cost asymmetry: adopting MFEs is hard to undo; staying modular-monolith and extracting one slice later (strangler-style) is cheap. Recommend the smallest reversible step — e.g., extract just the highest-friction team\'s area as the first remote and measure.',
      followUps: ['How do remotes share the design system without version drift?', 'How does module federation handle two remotes wanting different versions of the framework?'],
    },
    {
      id: 'q-notification-system',
      level: 'advanced',
      question: 'Design a notification system (in-app + push + email) for a product.',
      answer: 'Producers emit domain events (order_shipped, comment_added) to a queue — they never call channels directly. A notification service consumes events, applies user preferences and rate limits/digesting (no 50 emails for 50 likes — batch into one), renders templates, and routes to channel workers: in-app (write to notifications table + push over SSE/WebSocket to online users), mobile push (APNs/FCM with device-token management), email (provider with bounce handling). Each channel worker retries with backoff and DLQs failures. In-app client: unread badge from a count endpoint, list with cursor pagination, real-time increments via the socket, mark-read syncing across devices.',
      deepDive: 'The differentiating details: idempotency keys per (event, user, channel) so retries never double-notify; preference/quiet-hours evaluation as a separate decision step; digesting/collapsing as both a UX and cost feature; and observability — per-channel delivery rates and end-to-end latency from event to device.',
      followUps: ['How do you avoid duplicate push when a retried event is reprocessed?', 'Where do read/unread states live with multiple devices?'],
    },
    {
      id: 'q-cap-applied',
      level: 'expert',
      question: 'In the systems you have designed, give concrete examples of choosing consistency vs availability.',
      answer: 'Consistency-leaning: checkout inventory decrement (reject the order rather than oversell — synchronous, single-writer, transactional), payment ledger entries, permission revocation (a fired employee must lose access NOW, so auth checks read strongly). Availability-leaning: feed contents and like counts (stale beats error page), presence indicators, analytics, profile views by others (while the user\'s own view requires read-your-writes). The framing: per-feature consistency requirements, often differing for the same data depending on the reader, with the write path getting stronger guarantees than the read path.',
      deepDive: 'Interviewers at this level want PACELC-style nuance: most "choices" are actually latency-vs-consistency decisions during normal operation (do I read from the replica or the primary?), not just partition behavior. Bringing up read-your-own-writes, monotonic reads, and bounded staleness as intermediate consistency levels — rather than a strong/eventual binary — is the expert signal.',
      followUps: ['What is bounded staleness?', 'How does an outbox pattern keep the cache and DB consistent?'],
    },
  ],

  codingQuestions: [
    {
      id: 'code-lru-cache',
      title: 'Implement an LRU cache',
      level: 'intermediate',
      problem: 'Build an LRU (least-recently-used) cache with get/set in O(1) and a max capacity — the eviction policy behind browser caches, Redis (approximated), and client-side memoization.',
      solution: {
        lang: 'ts',
        code: `class LRUCache<K, V> {
  private map = new Map<K, V>()
  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined
    const value = this.map.get(key)!
    // re-insert to mark as most recently used
    this.map.delete(key)
    this.map.set(key, value)
    return value
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key)
    this.map.set(key, value)
    if (this.map.size > this.capacity) {
      // Map preserves insertion order: first key = least recently used
      const oldest = this.map.keys().next().value as K
      this.map.delete(oldest)
    }
  }
}`,
      },
      explanation: 'JS Map preserves insertion order, so delete+set moves a key to the "most recent" end and the first key is always the LRU victim — replacing the classic doubly-linked-list + hashmap implementation with far less code. Mention the textbook structure anyway: hashmap for O(1) lookup, linked list for O(1) reordering.',
      timeComplexity: 'O(1) get/set',
      spaceComplexity: 'O(capacity)',
      alternatives: ['Classic doubly-linked list + hashmap (language-agnostic answer)', 'Add TTL per entry for a cache that is both bounded and time-expiring', 'LFU as the follow-up eviction policy'],
    },
    {
      id: 'code-token-bucket',
      title: 'Implement a token bucket rate limiter',
      level: 'intermediate',
      problem: 'Write a token bucket: capacity N, refill rate R tokens/sec. tryRemove() returns whether a request is allowed. Use lazy refill (no timers).',
      solution: {
        lang: 'ts',
        code: `class TokenBucket {
  private tokens: number
  private lastRefill: number

  constructor(private capacity: number, private refillPerSec: number) {
    this.tokens = capacity
    this.lastRefill = Date.now()
  }

  private refill(): void {
    const now = Date.now()
    const elapsedSec = (now - this.lastRefill) / 1000
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillPerSec)
    this.lastRefill = now
  }

  tryRemove(cost = 1): boolean {
    this.refill()
    if (this.tokens >= cost) {
      this.tokens -= cost
      return true
    }
    return false
  }

  /** ms until the next request of this cost would succeed (for Retry-After) */
  retryAfterMs(cost = 1): number {
    this.refill()
    const deficit = cost - this.tokens
    return deficit <= 0 ? 0 : Math.ceil((deficit / this.refillPerSec) * 1000)
  }
}`,
      },
      explanation: 'Lazy refill computes tokens from elapsed time on each call instead of running a timer per bucket — essential when you have millions of keys. Fractional tokens make the refill math smooth. The retryAfterMs helper shows production awareness (the 429 Retry-After header). In a distributed setup, the same logic runs as an atomic Redis Lua script with the bucket state stored per key.',
      timeComplexity: 'O(1) per call',
      spaceComplexity: 'O(1) per key',
      alternatives: ['Sliding window counter (weighted two-window blend)', 'Redis Lua version for cross-server enforcement', 'Cost-based variant where expensive endpoints consume multiple tokens'],
    },
    {
      id: 'code-swr-fetch',
      title: 'Stale-while-revalidate fetch wrapper',
      level: 'advanced',
      problem: 'Implement swrFetch(key, fetcher, ttlMs): return cached data immediately if present; if the entry is older than ttlMs, kick off a background refresh (deduplicated — only one in-flight refresh per key).',
      solution: {
        lang: 'ts',
        code: `interface Entry<T> {
  data: T
  updatedAt: number
}

const cache = new Map<string, Entry<unknown>>()
const inflight = new Map<string, Promise<unknown>>()

async function swrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
): Promise<T> {
  const entry = cache.get(key) as Entry<T> | undefined

  const revalidate = (): Promise<T> => {
    // single-flight: reuse the in-flight promise to prevent stampedes
    if (!inflight.has(key)) {
      const p = fetcher()
        .then((data) => {
          cache.set(key, { data, updatedAt: Date.now() })
          return data
        })
        .finally(() => inflight.delete(key))
      inflight.set(key, p)
    }
    return inflight.get(key) as Promise<T>
  }

  if (!entry) return revalidate()            // cold: must wait
  const isStale = Date.now() - entry.updatedAt > ttlMs
  if (isStale) void revalidate()             // stale: refresh in background
  return entry.data                          // always answer from cache when warm
}`,
      },
      explanation: 'Three behaviors in one function: cold miss awaits the fetch; warm hit returns instantly; stale hit returns the old value AND triggers a background revalidation. The inflight map is the single-flight pattern — concurrent callers share one promise, which is exactly how request deduplication prevents thundering herds in TanStack Query/SWR and server-side caches alike.',
      timeComplexity: 'O(1) per call (plus the fetch itself)',
      spaceComplexity: 'O(cached keys)',
      alternatives: ['Add error handling: keep serving stale on refresh failure (stale-if-error)', 'Subscriber notifications so UI re-renders when background data lands', 'LRU-bound the cache to cap memory'],
    },
    {
      id: 'code-concurrency-pool',
      title: 'Concurrency-limited request pool',
      level: 'advanced',
      problem: 'Write pool(tasks, limit): run an array of async task functions with at most `limit` in flight at once, returning results in input order. The backbone of bulk uploads, crawler politeness, and API-quota-respecting batch jobs.',
      solution: {
        lang: 'ts',
        code: `async function pool<T>(
  tasks: Array<() => Promise<T>>,
  limit: number,
): Promise<T[]> {
  const results = new Array<T>(tasks.length)
  let cursor = 0

  async function worker(): Promise<void> {
    while (cursor < tasks.length) {
      const index = cursor++          // claim the next task (sync, no race in JS)
      results[index] = await tasks[index]()
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker(),
  )
  await Promise.all(workers)
  return results
}`,
      },
      explanation: 'Spawn `limit` workers that pull tasks from a shared cursor until exhausted — a work-stealing queue in 15 lines. The cursor increment is safe without locks because JS is single-threaded: no await sits between read and increment. Results are stored by claimed index, so completion order never scrambles output order.',
      timeComplexity: 'O(n) tasks, wall time ≈ n/limit × avg task time',
      spaceComplexity: 'O(n) results',
      alternatives: ['Fail-fast vs collect-errors variants (wrap each task in try/catch and return Settled-style results)', 'Priority queue instead of FIFO cursor', 'Per-second rate limiting combined with concurrency limiting (token bucket inside the worker)'],
    },
    {
      id: 'code-autocomplete-client',
      title: 'Race-safe autocomplete client',
      level: 'intermediate',
      problem: 'Implement the client side of autocomplete: debounce keystrokes, abort stale requests, cache by prefix — so fast typists never see out-of-order results.',
      solution: {
        lang: 'ts',
        code: `function createAutocomplete(
  search: (q: string, signal: AbortSignal) => Promise<string[]>,
  onResults: (q: string, results: string[]) => void,
  delay = 200,
) {
  const cache = new Map<string, string[]>()
  let timer: ReturnType<typeof setTimeout> | undefined
  let controller: AbortController | undefined

  return function onInput(query: string): void {
    clearTimeout(timer)
    controller?.abort()                      // kill the in-flight stale request

    if (query.length < 2) return onResults(query, [])
    const cached = cache.get(query)
    if (cached) return onResults(query, cached)

    timer = setTimeout(async () => {
      controller = new AbortController()
      try {
        const results = await search(query, controller.signal)
        cache.set(query, results)
        onResults(query, results)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') throw err
        // aborted = superseded by newer input: intentionally ignore
      }
    }, delay)
  }
}`,
      },
      explanation: 'Three defenses layered: debounce reduces request count; AbortController guarantees a stale response can never invoke onResults (the fetch rejects with AbortError instead); the prefix cache makes backspacing instant. Abort is stronger than token-comparison because it also frees network/server resources, though a sequence-token check is the framework-agnostic fallback.',
      timeComplexity: 'O(1) per keystroke',
      spaceComplexity: 'O(cached prefixes)',
      alternatives: ['Sequence-token guard instead of abort', 'LRU-bound the cache', 'Serve cached results instantly AND revalidate in background (s-w-r for prefixes)'],
    },
  ],

  scenarios: [
    {
      id: 'sc-frontend-deep-dive',
      title: 'Interviewer says: "Design Twitter" — and you are a frontend-leaning candidate',
      situation: 'A classic full-stack prompt where you must cover the whole system credibly but demonstrate depth where your experience actually is.',
      approach: [
        'Run the standard framework: requirements (post, follow, feed; 10M DAU, read-heavy ~100:1), estimates, then the high-level diagram covering client → CDN → LB → API → cache → DB + queue for fan-out. Cover the backend competently at box level: hybrid push/pull fan-out, sharded storage, Redis feed lists.',
        'Then steer: "I can go deeper on the feed delivery and client architecture — that is where I have production depth. Sound good?" Interviewers consistently reward candidates who direct the deep dive honestly.',
        'Deep dive frontend: cursor-paginated feed API and why offset breaks under inserts; virtualized infinite scroll; optimistic likes with rollback; image strategy (CDN, srcset, lazy); SSR for the logged-out/SEO surface vs CSR app shell when logged in; client cache with s-w-r and scroll restoration.',
        'Close with cross-cutting concerns that bridge both worlds: real-time new-post indicator via SSE, Core Web Vitals budget, error monitoring and RUM.',
      ],
      keyTakeaways: ['Cover the whole system at box level — never skip the backend — but negotiate the deep dive toward your strength', 'Frontend depth (pagination, virtualization, optimistic UI, rendering strategy) is legitimate senior system design, not a consolation prize', 'Explicitly stating read ratio and consistency choices keeps you credible on the backend half'],
    },
    {
      id: 'sc-traffic-spike',
      title: 'Your product is about to get a 50× traffic spike (TV ad / launch)',
      situation: 'Marketing announces a campaign in three weeks. Current peak is 400 QPS on a standard three-tier app. You own readiness.',
      approach: [
        'Load test FIRST to find the actual bottleneck — do not guess. Replay-style tests against staging sized like production; find what falls over at 5×, 20×, 50×.',
        'Push everything possible to the edge: the landing/campaign pages become fully static (SSG) on the CDN — that absorbs most of the 50× before it touches origin. Verify cache-hit ratios, not just configs.',
        'Protect the origin: autoscale stateless tiers ahead of time (pre-warm, do not rely on reactive scaling for a vertical spike), add Redis caching on the hottest reads, and enable request coalescing on hot keys.',
        'Add graceful degradation: feature-flag heavy components (recommendations, personalization) so they can be switched off under load; queue writes that tolerate delay; rate limit per-IP to shed abusive traffic.',
        'Rehearse failure: game-day the database falling behind, define the dashboard everyone watches (p99, error rate, cache hit ratio, queue depth) and the rollback/degrade runbook.',
      ],
      keyTakeaways: ['Static + CDN absorbs spikes orders of magnitude more cheaply than scaling origin', 'Pre-warmed capacity beats reactive autoscaling for known sharp spikes', 'Degradation switches (feature flags) turn "down" into "slightly worse" — design them before the spike'],
    },
    {
      id: 'sc-realtime-dashboard',
      title: 'Product wants "live" data on a dashboard polled by 30k concurrent users',
      situation: 'An analytics dashboard currently polls a heavy aggregate API every 5s per widget. The database is melting and product wants updates to feel instant.',
      approach: [
        'Separate the two problems: query cost (every poll recomputes aggregates) and delivery latency (5s polling). Fix the first or real-time will just melt things faster.',
        'Precompute: move aggregation to an incremental pipeline — events stream into a consumer that maintains materialized aggregates in Redis; reads become O(1) lookups. The dashboards all read the same few keys, so 30k users now share one computation.',
        'Delivery: replace per-widget polling with one SSE stream per client; the server pushes diffs when aggregates change, throttled to e.g. 1 update/sec per metric (users cannot perceive faster, and it caps fan-out cost). SSE over WebSocket because data flows one way.',
        'Client: a single connection multiplexing all widgets, patching a local store; reconnect with Last-Event-ID; fall back to slow polling if the stream fails.',
        'Validate the win with numbers: from 30k users × 6 widgets × 12 polls/min ≈ 36k QPS of heavy queries down to one consumer maintaining aggregates + cheap fan-out of small diffs.',
      ],
      keyTakeaways: ['"Real-time" problems are usually a compute problem wearing a transport costume — precompute first', 'Shared aggregates mean fan-out of identical small messages, which is cheap; per-user queries are what kill you', 'Throttle update frequency to human perception — 1Hz feels live'],
    },
    {
      id: 'sc-image-heavy-perf',
      title: 'Image-heavy marketplace has 6s LCP on mobile — fix it end to end',
      situation: 'A listings marketplace with 20 images above the fold scores LCP 6.2s / CLS 0.4 on mid-range Android in field data. Conversion is suffering.',
      approach: [
        'Find the LCP element (usually the hero/first listing image) and walk its chain: is it discoverable in initial HTML (server-rendered img, not injected by JS)? Preloaded? Correctly sized?',
        'Image pipeline: serve AVIF/WebP with format negotiation, generate responsive variants and use srcset/sizes so a 360px phone never downloads a 1600px image, compress at quality ~70–80, serve from CDN.',
        'Loading discipline: fetchpriority="high" + preload on the LCP image; loading="lazy" strictly below the fold (lazy-loading the LCP image is the classic self-inflicted wound); explicit width/height or aspect-ratio on every image to kill CLS.',
        'Page architecture: SSR/SSG the listing grid so images are in the initial HTML; defer non-critical JS so it stops competing for bandwidth; check TTFB (edge-cache the listings page with s-w-r).',
        'Lock it in: Lighthouse CI budgets (LCP, image weight per route) and RUM dashboards segmented by device class to confirm field improvement.',
      ],
      keyTakeaways: ['LCP optimization is supply-chain analysis on one element: discover early, fetch with priority, ship fewer bytes', 'srcset + modern formats commonly cut image bytes 60–80% — the largest single win on image-heavy sites', 'CLS is almost always missing dimensions — mechanical to fix, huge UX impact'],
    },
  ],

  mentalModels: [
    {
      id: 'mm-design-funnel',
      title: 'The Design Interview Funnel',
      flow: ['Ambiguous prompt', 'Requirements: shrink the problem', 'Estimates: size the problem', 'High level: shape the solution', 'Deep dive: prove depth in one spot', 'Tradeoffs: show judgment'],
      explanation: [
        'Each phase narrows scope and earns the right to the next: estimates only make sense against requirements; the deep dive only lands if the high level frames it.',
        'Think of the diagram as collateral for a conversation, not the deliverable — the evaluation is your reasoning out loud and how you respond to pushback.',
        'Time-box mentally: if you are still drawing boxes at minute 30, you will never show depth, and depth is what levels you.',
      ],
      whatBreaksWithoutIt: 'Without the funnel you either design the wrong system (skipped requirements), make arbitrary choices (skipped estimates), or finish with breadth and no depth — the most common senior-loop rejection.',
      interviewTip: 'Narrate the funnel explicitly at the start ("I\'ll clarify requirements, do quick math, sketch the high level, then we pick a deep dive"). Interviewers relax when they see you have a process.',
    },
    {
      id: 'mm-request-journey',
      title: 'The Request Journey (layered caches)',
      flow: ['Browser cache', 'CDN edge', 'Load balancer', 'API + Redis', 'Database', 'Each layer: serve from here? or pass down'],
      explanation: [
        'Picture every GET as descending a staircase where each step asks "can I answer this?" The deeper it goes, the more it costs — browser is free, CDN ~10ms, Redis ~1ms but in your region, DB the most expensive and the only true source of truth.',
        'Design = deciding for each data type how far down its requests are allowed to go, and how stale each step may be.',
        'Writes climb the opposite direction: they must reach the bottom (truth), then decide which upper layers to invalidate.',
      ],
      whatBreaksWithoutIt: 'Without the layered picture you cache ad hoc, miss whole layers in staleness bugs ("we purged Redis but the CDN still has it"), and cannot explain where a millisecond budget goes.',
      interviewTip: 'Draw the staircase early in any design and annotate TTLs per layer — it preempts the inevitable "how do you make this fast?" and the "user sees stale data" follow-ups in one diagram.',
    },
    {
      id: 'mm-read-write-paths',
      title: 'Read Path vs Write Path',
      flow: ['Identify read:write ratio', 'Read-heavy? → cache, replicate, precompute', 'Write-heavy? → queue, partition, batch', 'Design each path separately', 'Reconcile: how fresh must reads be after writes?'],
      explanation: [
        'Almost every system is asymmetric — feeds are 100:1 reads, analytics ingestion is 1000:1 writes. Designing one pipeline for both wastes effort on the easy side.',
        'Read-heavy playbook: replicas, cache layers, precomputed views (fan-out-on-write is precisely "move work from read path to write path").',
        'Write-heavy playbook: absorb with queues, partition by key, batch inserts. The reconciliation question — how quickly must a write be visible to reads — is your consistency requirement, stated naturally.',
      ],
      whatBreaksWithoutIt: 'Without splitting the paths you get designs like "just add Redis" for a write-heavy ingest, or synchronous fan-out that dies on the first celebrity post.',
      interviewTip: 'Saying "let me design the write path and read path separately, they have different shapes" within the first ten minutes is one of the strongest structural signals you can send.',
    },
    {
      id: 'mm-envelope-math',
      title: 'Back-of-Envelope Calibration',
      flow: ['DAU × actions/day', '÷ ~10^5 sec/day → avg QPS', '× 3–5 → peak QPS', 'items × size → storage/day', 'Compare against known single-node limits'],
      explanation: [
        'The math exists to trigger comparisons against memorized anchors: one Postgres handles thousands of QPS comfortably; Redis ~100k ops/s; one gateway holds ~50k WebSockets; a region-local round trip ~1ms, cross-continent ~80ms; 1M small records ≈ a few hundred MB (fits in memory).',
        'The conclusion is always one of: "fits on one node — keep it simple" or "exceeds X by 10× — now sharding/queueing is justified".',
        'Round everything to powers of ten; precision theater wastes minutes and signals inexperience.',
      ],
      whatBreaksWithoutIt: 'Without calibration anchors you either over-design (Kafka for 50 QPS) or under-design (one Postgres for 1M writes/sec) and cannot defend either when challenged.',
      interviewTip: 'Memorize five anchors (QPS per DB node, sockets per gateway, Redis throughput, seconds/day ≈ 10^5, network RTTs) — they convert estimates into decisions on the spot.',
    },
    {
      id: 'mm-push-vs-pull',
      title: 'Push vs Pull',
      flow: ['Data changes at source', 'Push: precompute/deliver to consumers at write time', 'Pull: consumers compute/fetch on demand', 'Hybrid: push for the many, pull for the heavy', 'Decide per producer-consumer pair'],
      explanation: [
        'The same dichotomy recurs everywhere: feed fan-out (push to follower lists vs pull-merge at read), real-time transports (server push vs client poll), cache freshness (invalidate-on-write vs TTL-on-read), CI (webhooks vs polling).',
        'Push optimizes the reader at the writer\'s expense — great when reads vastly outnumber writes and consumers are known. Pull optimizes the writer — great when consumers are many/unknown or data changes faster than it is read.',
        'Hybrids dominate production: push for normal users, pull for celebrities; SSE push for online users, pull-on-open for returning ones.',
      ],
      whatBreaksWithoutIt: 'Pure push melts on write amplification (celebrity problem); pure pull melts on read amplification (recompute per request). Not naming the dichotomy means rediscovering it mid-interview under pressure.',
      interviewTip: 'When asked "how does X get to Y", answer with the framework: "push, pull, or hybrid — given the ratio here, I\'d…". It upgrades a guess into a derivation.',
    },
  ],

  revision: [
    { id: 'r-framework', topic: 'Interview framework', importance: 5, thirtySecond: 'Requirements → estimates → high-level diagram → deep dive → tradeoffs. Ask scoping questions first; check in between phases; finish with failure modes and monitoring.', twoMinute: 'Functional vs non-functional requirements (latency, availability, consistency, read:write ratio). Estimates: DAU × actions ÷ 10^5 ≈ QPS, ×3–5 peak; storage = items × size. High level: full request path with named arrows. Deep dive one component to schema/algorithm level — steer toward your strength. Tradeoffs: what breaks at 10×, what you monitor, what you deliberately skipped.', deepDive: 'Leveling happens in the deep dive and tradeoffs, not the boxes. Senior signals: stating consistency requirements per feature, naming the reversal cost of decisions, volunteering observability, and disagreeing gracefully when the interviewer pushes an alternative — defend with reasons or update with grace.', followUps: ['What do you ask before drawing anything?', 'How do you recover if the interviewer says your approach won\'t work?'] },
    { id: 'r-rendering', topic: 'CSR / SSR / SSG / ISR', importance: 5, thirtySecond: 'Where HTML is made: client (CSR), server per request (SSR), build time (SSG), build + background refresh (ISR). Choose per route by SEO need, freshness, and personalization.', twoMinute: 'CSR: cheap, app-like, slow first paint — dashboards. SSR: fast FCP + SEO, server cost, hard to cache when personalized. SSG: CDN-speed, frozen content. ISR: SSG + revalidation window = s-w-r for HTML. Hydration is SSR\'s tax: visible-but-dead UI until JS attaches; hurts INP/TBT. Real apps mix per route: static marketing, ISR catalog, CSR app shell.', deepDive: 'Mitigation ladder for hydration cost: code-split → lazy-hydrate below fold → islands (hydrate only interactive widgets) → server components (zero JS for static parts). Edge SSR moves per-request rendering to PoPs for personalization at CDN latency. Mismatch causes: Date.now(), random IDs, locale differences between server and client render.', followUps: ['Why can ISR serve a stale page after a deploy?', 'What is islands architecture?'], whiteboard: ['Route: marketing → SSG', 'Route: product/:id → ISR 60s', 'Route: /app/** → CSR shell', 'Personalized bits → client islands'] },
    { id: 'r-caching', topic: 'Caching layers & invalidation', importance: 5, thirtySecond: 'Browser → CDN → API cache → Redis → DB. Each layer trades freshness for latency. Invalidate by TTL, explicit purge, or versioned keys; s-w-r serves stale while refreshing.', twoMinute: 'Fingerprinted assets: cache forever, invalidate by URL. HTML: no-cache or short TTL. s-maxage for CDN vs max-age for browser; ETag → 304. Redis cache-aside: read → miss → DB → fill. Write invalidation must hit every layer or users see ghosts. Thundering herd on hot-key expiry → single-flight coalescing + jittered TTLs.', deepDive: 'Read-your-own-writes is the consistency floor users notice: after a mutation, update the client cache optimistically and bypass/purge intermediate layers for that user. Versioned keys (user:42:v7) sidestep purge precision. Double-caching bugs (CDN + Redis with different TTLs) cause "fixed but still broken" tickets — draw all layers when debugging staleness.', followUps: ['Walk every layer stale profile data could hide in', 'TTL vs purge vs versioned keys — when each?'] },
    { id: 'r-cdn', topic: 'CDN & edge', importance: 4, thirtySecond: 'Geo-distributed cache: users hit the nearest PoP; misses go to origin. Caches static assets, increasingly API responses and edge-rendered HTML. Invalidate via purge APIs or surrogate keys.', twoMinute: 'Latency is physics — shorter distance wins. Cache-key design (which headers/params vary the response) is correctness-critical: get it wrong and users see each other\'s data. s-maxage + stale-while-revalidate is the workhorse header combo. Edge functions run logic (auth checks, AB bucketing, rewrites) at the PoP.', deepDive: 'Measure cache-hit ratio, not config intent. Spiky launches: pre-warm popular URLs. Private data at the edge requires Cache-Control: private or careful keying on auth. Surrogate-key (tag) purges let one content update invalidate all pages embedding it.', followUps: ['What can go wrong with Vary headers?', 'When is edge SSR worth it?'] },
    { id: 'r-api-design', topic: 'REST vs GraphQL vs real-time APIs', importance: 4, thirtySecond: 'REST: resources + HTTP semantics + native caching; risks over/under-fetching. GraphQL: client-shaped queries, one round trip; loses HTTP caching, needs DataLoader and query-cost limits. WebSocket/SSE when the server must push.', twoMinute: 'REST wins for public APIs and CDN-cacheable reads. GraphQL wins when many client shapes aggregate many sources — at platform cost. Versioning, idempotent retries, consistent error envelopes signal production maturity. Real-time: SSE for one-way push (simpler ops), WebSocket for duplex; both need reconnect + resume design.', deepDive: 'GraphQL N+1 moves server-side — DataLoader batches per-request. Persisted queries restore some cacheability. For pagination GraphQL standardizes cursors via the connection spec. tRPC-style RPC is the pragmatic third option when one TS team owns both ends.', followUps: ['How do you cache GraphQL?', 'Design the error envelope for a public REST API'] },
    { id: 'r-pagination', topic: 'Pagination', importance: 4, thirtySecond: 'Offset: simple, jump-to-page, but slow when deep and unstable under writes. Cursor/keyset: opaque token of last sort key, index seek, constant cost, stable — the answer for feeds.', twoMinute: 'OFFSET scans and discards — page 500 reads 10,020 rows. Cursor: WHERE (created_at, id) < (cursor) LIMIT n — needs a unique orderable key (timestamp + id tiebreaker). No random access with cursors; counts via estimates or hasMore. Infinite scroll = cursor + intersection observer + virtualized list.', deepDive: 'Ranked feeds complicate cursors: the sort key (score) changes between requests, so cursors snapshot a feed generation or carry (score, id) accepting drift. GraphQL connections formalize edges/pageInfo. Bi-directional cursors (before/after) support chat-history style scrollback.', followUps: ['Why is created_at alone an invalid cursor key?', 'Design pagination for a relevance-ranked search'] },
    { id: 'r-db-scaling', topic: 'Replication, sharding, CAP', importance: 5, thirtySecond: 'Reads scale with replicas (mind replication lag); writes scale with shards (mind key choice and cross-shard queries). Under partition: consistency or availability — choose per feature, not per system.', twoMinute: 'Primary-replica: writes → primary, reads → replicas; lag breaks read-your-own-writes — pin users to primary post-write. Sharding: hash key spreads load but kills ranges; co-locate by access pattern (conversation_id for chat). Consistent hashing moves ~1/N keys on topology change. CAP only bites during partitions; PACELC covers the everyday latency-consistency trade.', deepDive: 'Hot shards (celebrities, big tenants): split hot entities, cache in front, or dedicated shards. Cross-shard transactions → sagas/outbox rather than 2PC where possible. Map features: balance/inventory CP-ish; feeds/likes AP-ish; permission revocation strongly consistent. Vertical-first for the DB is legitimate senior advice.', followUps: ['What shard key for a multi-tenant SaaS?', 'How do you reshard without downtime?'] },
    { id: 'r-queues', topic: 'Message queues & async work', importance: 4, thirtySecond: 'Move non-urgent work out of the request path: enqueue, respond, let workers process with retries. At-least-once delivery → idempotent consumers; failures → dead-letter queue.', twoMinute: 'Benefits: spike absorption, decoupling, independent scaling, retry with backoff. Semantics: ordering only per partition/key; exactly-once is effectively idempotency + dedupe keys. Queue (work distribution) vs pub/sub (event broadcast to all subscribers). Watch queue depth — a growing queue is a silent outage.', deepDive: 'Outbox pattern: write DB row + event in one transaction, relay publishes — fixes the dual-write inconsistency. Poison messages: cap retries, DLQ, alert. Backpressure: bounded queues + producer throttling beat unbounded memory. For the frontend: job-status UX via polling a status endpoint or SSE push on completion.', followUps: ['Why must consumers be idempotent?', 'What is the outbox pattern?'] },
    { id: 'r-rate-limiting', topic: 'Rate limiting', importance: 4, thirtySecond: 'Token bucket (capacity = burst, refill = sustained rate) is the default. Enforce in shared state (Redis, atomic) across servers; respond 429 + Retry-After.', twoMinute: 'Fixed window: boundary bursts allow 2×. Sliding window counter: weighted blend, O(1), near-exact. Leaky bucket: constant outflow for smoothing. Lazy refill (compute from elapsed time) avoids timers per key. Per-key choice: user/API key primary, IP fallback; stricter tiers for auth and expensive endpoints. Fail open vs closed is a per-endpoint risk decision.', deepDive: 'Distributed: Redis Lua for atomicity; accept slight overshoot for availability; local pre-limits shed floods cheaply. Client etiquette: exponential backoff with jitter prevents synchronized retry storms (retry amplification can DOS yourself). GraphQL/cost-based: charge tokens by query complexity, not request count.', followUps: ['Implement a token bucket on the whiteboard', 'Why jitter in backoff?'], whiteboard: ['bucket(capacity, refill/sec)', 'tokens = min(cap, tokens + elapsed×rate)', 'tokens ≥ 1 ? allow, tokens-- : 429'] },
    { id: 'r-realtime', topic: 'Real-time systems', importance: 4, thirtySecond: 'SSE for one-way push (notifications, streams); WebSocket for duplex (chat, collab). Gateways hold connections; services publish to a broker that fans out to gateways. Reconnect + resume cursor is mandatory.', twoMinute: 'Connection math: ~50–100k sockets per gateway node; presence service maps user → gateway. At-least-once + client dedupe by message ID. Ordering: per-conversation sequence numbers, not timestamps. Heartbeats detect dead peers; reconnect with exponential backoff + Last-Event-ID/cursor replays missed events. Offline users divert to push notifications.', deepDive: 'Hot rooms (100k-member channels) flip from push-per-member to feed-style pull. Typing indicators/presence are ephemeral — throttle, never persist. Collaborative editing layers OT (central transform ordering) or CRDTs (commutative merge, offline-friendly — Yjs) over the socket. Backpressure on slow clients: drop/coalesce updates rather than buffering unboundedly.', followUps: ['Recover messages missed during a 30s disconnect', 'OT vs CRDT in one minute'] },
    { id: 'r-cwv', topic: 'Core Web Vitals & budgets', importance: 5, thirtySecond: 'LCP < 2.5s (loading), INP < 200ms (responsiveness), CLS < 0.1 (stability) at p75 field data. Performance budgets in CI make them enforceable.', twoMinute: 'LCP: find the element, server-render it, preload/fetchpriority the image, cut TTFB, ship fewer render-blocking bytes. INP: break long tasks (>50ms), defer non-critical JS, avoid hydration storms. CLS: dimensions on media, reserve space for dynamic content, no layout-shifting ads/banners. Lab (Lighthouse) bisects; field (RUM via web-vitals lib) is the truth.', deepDive: 'Budgets: per-route JS byte caps + metric assertions in Lighthouse CI failing PRs. INP replaced FID (2024) — it measures all interactions, worst-case-ish, so one slow handler tanks it. Attribution APIs (LoAF, event timing) localize the offending script. Segmented RUM (device class, geo, connection) finds where the p75 actually lives.', followUps: ['Your INP is 450ms — diagnosis path?', 'Why p75 and not average?'] },
    { id: 'r-scaling-shapes', topic: 'Load balancing & scaling out', importance: 3, thirtySecond: 'Horizontal scaling needs stateless services — sessions to Redis/JWT, files to object storage. L7 LB routes by path/header and terminates TLS; health checks eject bad nodes.', twoMinute: 'Vertical first for simplicity (esp. databases); horizontal for fault tolerance and elasticity. Algorithms: round robin, least connections (uneven request costs), hash (stickiness). WebSockets need connection-aware routing. The LB is redundant via DNS/anycast. Autoscaling reacts in minutes — pre-warm for known spikes.', deepDive: 'Statelessness is the architectural prerequisite, not an afterthought: local caches become inconsistency bugs, in-memory sessions become login storms on deploy. Graceful deploys: connection draining + health-check-aware rollout. Cell-based architecture (independent stacks per user partition) caps blast radius at large scale.', followUps: ['What state hides in "stateless" apps?', 'How do zero-downtime deploys interact with the LB?'] },
    { id: 'r-observability', topic: 'Observability & error monitoring', importance: 4, thirtySecond: 'Metrics for "is it broken" (dashboards/alerts), logs for "what exactly happened", traces for "where did latency go" — correlated by trace ID, including from the browser. Alert on symptoms (SLO burn), not causes.', twoMinute: 'SLI = measurement, SLO = target, error budget = allowed failure — spend it on velocity, stop shipping when burned. Frontend layer: RUM Web Vitals, JS errors with sourcemaps + release tagging, session breadcrumbs. Structured logs with request/trace IDs; sample noisy paths. The wrap-up of every design answer: name the 4–5 numbers on your dashboard.', deepDive: 'Distributed tracing: traceparent propagation from browser through every hop; spans with attributes; tail-based sampling keeps the interesting traces. Golden signals: latency, traffic, errors, saturation. Deploy markers on dashboards turn "what changed?" into a glance. Alert fatigue is a design failure — page only on actionable user-facing symptoms.', followUps: ['Design the dashboard for the system you just drew', 'What is an error budget policy?'] },
    { id: 'r-feature-flags', topic: 'Feature flags & progressive delivery', importance: 3, thirtySecond: 'Flags decouple deploy from release: ship dark, roll out by cohort (1% → 100%), kill instantly without deploying. Also the mechanism for A/B tests and load-shedding switches.', twoMinute: 'Enables trunk-based development (merge incomplete work safely) and canary-style rollouts with metric gates. Costs: flag debt (stale flags = dead code — schedule deletion), combinatorial test surface, and SSR/client evaluation consistency (mismatched flag values cause hydration errors). Targeting: user/cohort/percentage with sticky bucketing.', deepDive: 'Architecture: flag service with SDKs, local evaluation + streamed rule updates for latency; defaults baked in for when the service is down. Kill switches for dependencies (turn off recommendations under load) are operational gold. Experimentation rigor: one metric owner, predefined success criteria, guardrail metrics.', followUps: ['How do flags cause hydration mismatches?', 'Flag lifecycle — who deletes them and when?'] },
  ],
}

export default systemDesign
