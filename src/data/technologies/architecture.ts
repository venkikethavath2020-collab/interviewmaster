import type { Technology } from '../../types/content'

const architecture: Technology = {
  id: 'architecture',
  name: 'Architecture',
  icon: 'Ar',
  color: '#0891b2',
  tagline: 'Structure, boundaries, and tradeoffs — how senior engineers organize code, systems, and teams.',
  category: 'design',

  overview: {
    what: 'Software architecture is the set of decisions that are expensive to change: how code is layered, where boundaries sit, how services communicate, how failures are contained, and how teams ship safely. It spans code-level structure (layers, dependency direction), system-level topology (monolith vs services, sync vs async), and engineering practice (CI/CD, reviews, ADRs, debt management).',
    why: 'Senior interviews probe architecture because it predicts on-the-job impact better than algorithms: can you structure a codebase that survives 50 engineers, choose boundaries that match the team, articulate tradeoffs to non-engineers, and own decisions through their consequences? "Senior Engineer Mode" rounds — behavioral-technical hybrids — live entirely in this territory.',
    problemsSolved: [
      'Keeps change cheap: good boundaries localize modifications instead of rippling them across the codebase',
      'Lets teams work in parallel without stepping on each other (Conway\'s law, applied deliberately)',
      'Contains failure: retries, circuit breakers, and async boundaries turn outages into degradations',
    ],
    whenToUse: [
      'Before decisions with high reversal cost: service splits, database choices, framework commitments, public API contracts',
      'When symptoms appear: every change touches five modules, deploys are scary, onboarding takes months',
      'In interviews: any "how would you structure / how did you decide / tell me about a tradeoff" question',
    ],
    whenNotToUse: [
      'Do not architect speculatively — YAGNI applies to layers and services as much as to features; add structure when pain is real or clearly imminent',
      'Avoid cargo-culting big-tech patterns (microservices, event sourcing) into small-team contexts where they multiply costs',
      'Architecture astronautics: if your diagram has more boxes than your team has engineers, simplify',
    ],
  },

  internals: [
    {
      id: 'layered-architecture',
      title: 'Layered Architecture (Controller → Service → Repository)',
      summary: 'The default backend structure: each layer has one responsibility and depends only on the layer below. Its value is testability and localized change; its failure mode is anemic layers that just pass calls through.',
      details: [
        'Controller (or route handler): translates HTTP into domain calls — parses/validates input, invokes a service, maps results and errors to status codes. No business logic; a controller you cannot read in 20 seconds is doing too much.',
        'Service: the business logic layer — rules, orchestration across repositories, transaction boundaries. This is where "a user cannot book overlapping appointments" lives. Services know nothing about HTTP.',
        'Repository: data access abstraction — queries, ORM calls, cache interaction. Returns domain objects, not raw rows. Swapping Postgres for another store (or mocking for tests) only touches this layer.',
        'The dependency rule: dependencies point downward only (controller → service → repository), and ideally each layer depends on an interface of the next, not the concrete class — enabling unit tests with in-memory fakes.',
        'Cross-cutting concerns (auth, logging, validation) go in middleware/decorators, not copy-pasted into every controller.',
        'Failure modes interviewers probe: business logic leaking into controllers (untestable) or into repositories (hidden in queries); the pass-through service that adds nothing (fine — collapse it until logic exists); fat "utils" that become a shadow layer.',
      ],
      diagram: ['HTTP request', 'Middleware: auth, validation, logging', 'Controller: parse → call service → map response', 'Service: business rules, orchestration, transactions', 'Repository: queries, cache, ORM', 'Database / external stores'],
    },
    {
      id: 'clean-hexagonal',
      title: 'Clean / Hexagonal Architecture',
      summary: 'Both say the same core thing: business logic at the center, infrastructure at the edges, dependencies pointing inward through interfaces (ports). The framework and database become replaceable details.',
      details: [
        'Hexagonal (ports & adapters): the domain core defines ports — interfaces it needs (UserRepository) or offers (BookAppointment use case). Adapters implement them: an HTTP adapter drives the core; a Postgres adapter is driven by it. The core compiles without knowing HTTP or SQL exist.',
        'Clean architecture concentric rings: entities (enterprise rules) → use cases (application rules) → interface adapters (controllers, presenters, gateways) → frameworks & drivers. The Dependency Rule: source code dependencies only point inward. Inner rings never import outer rings.',
        'The mechanism that makes it work is dependency inversion: the core defines the interface; infrastructure implements it; wiring happens at the composition root (DI container or plain factory functions).',
        'Payoff: unit tests run the entire business logic with in-memory adapters in milliseconds; infrastructure migrations (ORM swap, queue swap) touch only adapters; the domain model stays legible.',
        'Cost — be honest in interviews: more files, more indirection, mapping between layer-specific models. For a CRUD app the ceremony exceeds the benefit; the pragmatic version is "keep domain logic framework-free and inject I/O", not forty interfaces.',
        'Frontend translation: components are adapters; composables/hooks holding logic are use cases; the API client is a driven adapter behind an interface. "Could I test this composable without mounting a component or hitting the network?" is the hexagonal question in frontend clothing.',
      ],
      diagram: ['Frameworks & drivers (DB, HTTP, UI)', 'Interface adapters (controllers, gateways)', 'Use cases (application rules)', 'Entities (domain rules)', 'All dependencies point INWARD via interfaces'],
    },
    {
      id: 'monolith-microservices',
      title: 'Monolith vs Microservices — the Real Tradeoffs',
      summary: 'Microservices trade development simplicity for organizational scalability. The honest framing: a modular monolith wins for most teams; services win when team count, not traffic, demands them.',
      details: [
        'What the monolith gives you for free: in-process calls (no network failure modes), ACID transactions across the whole domain, one deploy, one debugging surface, trivial refactoring across boundaries, one test suite. These are enormous and routinely undervalued.',
        'What microservices actually buy: independent deployment cadence per team, independent scaling of hot components, technology heterogeneity, and fault isolation IF designed for it. The driver is almost always teams blocking each other, not traffic.',
        'What microservices cost: every call can fail/timeout/duplicate (resilience patterns become mandatory), no cross-service transactions (sagas, eventual consistency), distributed debugging (tracing infrastructure required), contract versioning between services, infra multiplication (per-service CI, monitoring, on-call), and the worst failure mode — the distributed monolith: services so coupled they must deploy together, giving you all costs and no benefits.',
        'The modular monolith: one deployable, strictly enforced internal module boundaries (separate packages, lint-enforced import rules, per-module schemas). It captures most team-parallelism benefits and leaves an extraction path: a well-bounded module becomes a service by replacing function calls with API calls.',
        'When monolith wins: < ~20–30 engineers, early product (domain boundaries still shifting — wrong service boundaries are far more expensive than wrong module boundaries), latency-sensitive flows, small ops capacity.',
        'When to extract a service: a component with genuinely different scaling/runtime needs (image processing, ML inference), a team consistently blocked by the release train, or a bounded context that is stable and well understood. Extract one, learn, repeat — never big-bang.',
      ],
      diagram: ['Start: modular monolith with enforced boundaries', 'Pain signal: team blocked / component needs independent scale', 'Extract ONE well-bounded module as a service', 'Add contracts, tracing, resilience around the seam', 'Repeat only when the next pain is real'],
    },
    {
      id: 'event-driven-cqrs',
      title: 'Event-Driven Architecture & CQRS',
      summary: 'Events invert dependencies: producers announce facts, consumers decide what to do. CQRS splits the write model from the read model so each can be shaped for its job.',
      details: [
        'Event-driven: instead of OrderService calling EmailService, InventoryService, and AnalyticsService (knowing all of them, coupled to their availability), it publishes OrderPlaced. Consumers subscribe independently. Adding a consumer touches zero producer code.',
        'Events are immutable past-tense facts ("OrderPlaced"), not commands ("SendEmail"). Commands have one intended handler and expect an outcome; events have any number of subscribers and no expectations — confusing them re-couples your system through the back door.',
        'Costs: eventual consistency between producer and consumers, harder end-to-end reasoning ("what happens after checkout?" is now distributed across subscribers), duplicate delivery (consumers must be idempotent), and schema evolution of event payloads (additive changes only, version when breaking).',
        'The dual-write trap: writing the DB and publishing the event as two operations means one can fail. The outbox pattern fixes it: write the state change and the event row in ONE transaction; a relay publishes from the outbox table. This is a favorite senior interview probe.',
        'CQRS: separate the write model (normalized, invariant-enforcing) from the read model (denormalized projections shaped per screen/query). Consumers of events maintain the projections. Justified when reads and writes have very different shapes or scale; unjustified for plain CRUD — say so.',
        'Event sourcing (often conflated with CQRS): store the events themselves as the source of truth and derive state by replay. Powerful audit/time-travel; significant complexity (versioning, snapshots, rebuild tooling). Most systems need CQRS-lite (projections) and not full event sourcing.',
      ],
      diagram: ['Command: PlaceOrder', 'Write model validates invariants → state change + event in one tx (outbox)', 'Relay publishes OrderPlaced to broker', 'Consumers: email, inventory, analytics — each independent', 'Projection consumer updates read model', 'Queries hit the denormalized read model'],
    },
    {
      id: 'frontend-architecture',
      title: 'Frontend Project Architecture',
      summary: 'Feature-based folders, a thin API layer, a composables/logic layer, and a smart/dumb component split — the structure that keeps a 100-component app navigable.',
      details: [
        'Feature-based over type-based: group by domain (features/checkout/{components,composables,api,types}) instead of global /components, /utils buckets. Code that changes together lives together; deleting a feature is deleting a folder; ownership maps to teams.',
        'Layered inside the app: UI components → composables/hooks (stateful logic) → API layer (typed client functions, one per endpoint) → transport (fetch/axios instance with interceptors). Components never call fetch directly; swapping REST for GraphQL or adding auth headers touches one layer.',
        'Smart/container vs dumb/presentational: containers know about stores, routing, and data fetching; presentational components receive props and emit events — pure, reusable, trivially testable, and what your design system is made of. Modern nuance: composables/hooks let you extract the "smart" part into reusable logic instead of wrapper components.',
        'Shared kernel discipline: a /shared (or /ui + /lib) layer for the design system and generic utilities, with an enforced rule that features may import from shared, never from each other — cross-feature imports are how the big ball of mud begins. Lint rules (e.g., dependency-cruiser, eslint import boundaries) make this real.',
        'State placement follows the layering: server cache in a query library, global client state in small per-domain stores, local state in components, shareable state in the URL. A store imported by everything is the frontend god object.',
        'Composition root: app setup (router, store registration, API client config, plugin installation) lives in one place — mirrors backend DI thinking and keeps features mountable in isolation (useful for tests and Storybook).',
      ],
      diagram: ['app/ — composition root: router, stores, providers', 'features/* — components + composables + api per domain', 'shared/ui — design system (dumb components)', 'shared/lib — generic utilities', 'api/client — typed transport with interceptors', 'Rule: features → shared, never feature → feature'],
    },
    {
      id: 'resilience-patterns',
      title: 'Distributed Resilience: Retries, Backoff, Circuit Breakers',
      summary: 'In distributed systems the question is never if a dependency fails but how your service behaves when it does. Timeouts, retries with jittered backoff, circuit breakers, and idempotency form the standard kit.',
      details: [
        'Timeouts first: a call without a timeout is a thread/connection leak waiting for an outage. Budget them end-to-end — if the user-facing SLA is 1s, an inner call cannot have a 5s timeout.',
        'Retries handle transient failure, but naive retries amplify outages: 3 retries at 3 fan-out layers = 27× load on a struggling service. Rules: retry only idempotent operations, cap attempts, use exponential backoff WITH jitter (randomization prevents synchronized retry storms), and respect Retry-After.',
        'Circuit breaker: a state machine wrapping a dependency. Closed: calls flow, failures counted. Open (failure threshold tripped): calls fail fast immediately — no waiting on timeouts, no load on the sick dependency. Half-open (after a cooldown): a few probe calls test recovery; success closes, failure re-opens. Fail-fast + a fallback (cached data, default response, degraded feature) turns outages into degradations.',
        'Idempotency makes retries safe: an idempotency key (client-generated UUID per logical operation) lets the server detect "I already processed this" and return the stored result instead of charging the card twice. GET/PUT/DELETE are idempotent by HTTP contract; POST needs the key.',
        'Eventual consistency: after a write, replicas/consumers converge over time. Design the UX for it: optimistic updates with reconciliation, "processing" states, read-your-own-writes for the author. The interview trap is pretending strong consistency everywhere — call out where staleness is acceptable.',
        'Bulkheads and load shedding round out the kit: isolate resource pools per dependency so one slow downstream cannot exhaust all connections; reject excess load early (429) rather than degrading everyone.',
      ],
      diagram: ['Call dependency with timeout', 'Transient failure? → retry with exponential backoff + jitter (idempotent only)', 'Failure rate trips threshold → circuit OPENS', 'Open: fail fast, serve fallback/cached', 'Cooldown → HALF-OPEN probe calls', 'Healthy again → circuit closes'],
    },
    {
      id: 'gateway-bff',
      title: 'API Gateway & BFF Pattern',
      summary: 'The gateway centralizes cross-cutting edge concerns; the Backend-for-Frontend gives each client type its own aggregation layer owned by the frontend team.',
      details: [
        'API gateway: single entry point in front of services handling auth/token validation, rate limiting, TLS termination, routing, request/response transformation, and coarse caching — so twenty services do not implement these twenty times. Risk: business logic creeping into the gateway makes it a fragile choke point; keep it policy, not domain.',
        'BFF (Backend-for-Frontend): one aggregation API per client experience (web BFF, mobile BFF). Each composes/joins downstream services into exactly the shape its client needs — fewer round trips (critical on mobile), client-specific payload trimming, and a place for web-specific concerns (session cookie handling, SSR data endpoints).',
        'The organizational point is the one interviewers want: the BFF is owned by the frontend team. It ends the negotiation bottleneck with a backend platform team over response shapes — the consumers own their own aggregation.',
        'BFF vs GraphQL: overlapping problems (client-shaped data, aggregation). GraphQL is one flexible endpoint with platform investment; BFFs are N simple services with possible duplication. A GraphQL server per client type is a legitimate hybrid.',
        'Failure modes: BFFs duplicating business logic that belongs in domain services (BFF = aggregation + shaping only); a shared "general purpose BFF" that recreates the one-size-fits-none API the pattern was meant to kill.',
        'Auth shape commonly paired with BFFs: the browser holds an httpOnly session cookie with the BFF; the BFF holds/exchanges tokens for downstream services — keeping tokens out of JS reach entirely.',
      ],
    },
    {
      id: 'cicd-twelve-factor',
      title: 'CI/CD Pipeline Design & 12-Factor Apps',
      summary: 'A pipeline is a series of progressively more expensive quality gates between a commit and production. 12-factor is the checklist that makes an app deployable that way.',
      details: [
        'Pipeline shape: fast checks first (lint, typecheck, unit tests — minutes, on every push), then integration/component tests, then build once and promote the SAME artifact through staging → production (never rebuild per environment — you would test one artifact and ship another).',
        'Deployment strategies: rolling (replace instances gradually), blue-green (two environments, switch traffic atomically, instant rollback), canary (route 1–5% of real traffic to the new version, compare error/latency metrics, promote or roll back automatically). Feature flags add release control independent of deploys.',
        'Speed is a feature: a 40-minute pipeline halves merge frequency. Parallelize suites, cache dependencies and build outputs, run affected-only tests in monorepos, keep flaky tests at zero tolerance (quarantine + fix, or they erode trust in the whole gate).',
        '12-factor highlights that interviews actually touch: config in environment variables (same artifact, per-env config — never bake secrets into builds); stateless processes (state to backing services — enables horizontal scaling and safe restarts); dev/prod parity (containers shrink "works on my machine"); logs as event streams to stdout (aggregation is the platform\'s job); fast startup & graceful shutdown (finish in-flight requests on SIGTERM — required for rolling deploys).',
        'Frontend CI specifics: typecheck + lint + unit (Vitest) + component tests, bundle-size budget assertions, Lighthouse CI on key routes, visual regression on the design system, preview deployments per PR for review.',
        'The senior point: every gate exists to make a class of bug impossible to ship. If a gate catches nothing for a year, question it; if a prod incident had no gate, add one — pipelines are living risk documents.',
      ],
      diagram: ['Push → lint + typecheck + unit (fast, every commit)', 'Integration + component tests', 'Build artifact ONCE (immutable, versioned)', 'Deploy to staging → smoke tests', 'Canary 5% → automated metric comparison', 'Promote to 100% / auto-rollback', 'Post-deploy: monitors + deploy marker on dashboards'],
    },
  ],

  keywords: [
    {
      id: 'dependency-injection',
      term: 'Dependency Injection',
      importance: 4,
      whyAsked: 'DI is the mechanism behind testability and layer decoupling; interviewers use it to check you understand inversion of control rather than just naming a framework.',
      explanation: 'A component receives its dependencies (passed via constructor/parameters) instead of creating them internally with `new` or imports of singletons. The component depends on an interface; the composition root decides the concrete implementation. Result: swap real implementations for fakes in tests, change infrastructure without touching logic, and make dependencies explicit in signatures.',
      realWorldExample: 'A service taking a PaymentGateway interface: production wires Stripe, tests wire an in-memory fake. Frontend equivalent: a composable receiving its API client (or reading it from provide/inject) instead of importing a global axios instance.',
      commonMistakes: [
        'Equating DI with a DI container/framework — plain constructor parameters ARE dependency injection; containers just automate wiring',
        'Injecting everything: pure utilities and stable stdlib-like deps do not need injection; inject things you will swap (I/O, time, randomness)',
        'Service-locator pattern (component reaches into a global registry) — hides dependencies instead of declaring them',
      ],
      followUps: ['DI vs service locator?', 'How do you do DI in a frontend app without a framework? (provide/inject, props, factory functions)', 'Why are time and randomness classic injection candidates?'],
    },
    {
      id: 'idempotency',
      term: 'Idempotency',
      importance: 5,
      whyAsked: 'It is the lynchpin of safe retries and at-least-once delivery — a one-word probe that separates engineers who have handled payments/queues from those who have not.',
      explanation: 'An operation is idempotent if performing it N times has the same effect as once. Retries (network blips, queue redelivery) then become safe. HTTP: GET/PUT/DELETE are contractually idempotent; POST is not — fix with an idempotency key: client sends a unique key per logical operation; the server stores key → result and returns the stored result on duplicates instead of re-executing.',
      realWorldExample: 'Stripe\'s Idempotency-Key header: a payment retried after a timeout charges once. Queue consumer: "set status=shipped" (idempotent) vs "increment shipped_count" (not — must dedupe by event ID).',
      commonMistakes: ['Confusing idempotent with side-effect-free — DELETE has effects, repeating it just changes nothing further', 'Implementing the key check without atomicity (check-then-insert race) — use a unique constraint on the key', 'Forgetting the response must also be replayed, not just the write skipped'],
      followUps: ['Design idempotent order creation end to end', 'Why must queue consumers be idempotent even with "exactly-once" brokers?', 'Where do you store idempotency keys and for how long?'],
    },
    {
      id: 'circuit-breaker',
      term: 'Circuit Breaker',
      importance: 4,
      whyAsked: 'The canonical resilience pattern; interviewers check you know the three states and—more importantly—why failing fast beats waiting.',
      explanation: 'A wrapper around a dependency that trips after a failure threshold. Closed: normal operation, counting failures. Open: requests fail immediately without calling the dependency — protecting your threads/latency AND giving the sick dependency room to recover. Half-open: after a cooldown, limited probes test recovery. Pair with a fallback (cache, default, degraded UI) so "open" means degraded, not down.',
      realWorldExample: 'Recommendations service starts timing out: without a breaker, every product page waits 5s and your connection pool drains — cascading failure. With one, pages render instantly with a "popular items" fallback.',
      commonMistakes: ['Confusing it with retries — retries handle transient blips; breakers handle sustained failure (and stop retries from making it worse)', 'No fallback, so open = error page anyway', 'Tripping on total failure count rather than failure RATE within a window'],
      followUps: ['What metrics decide open → half-open?', 'Circuit breaker vs bulkhead?', 'Where does this pattern apply client-side? (failing third-party widget/SDK)'],
      diagram: ['CLOSED: calls flow, count failures', 'Failure rate > threshold → OPEN', 'OPEN: fail fast + fallback', 'Cooldown elapsed → HALF-OPEN', 'Probes succeed → CLOSED / fail → OPEN'],
    },
    {
      id: 'eventual-consistency',
      term: 'Eventual Consistency',
      importance: 4,
      whyAsked: 'Every async boundary creates it; interviewers test whether you design UX and invariants around it instead of pretending it away.',
      explanation: 'After a write, different parts of the system (replicas, projections, caches, consumers) may briefly disagree, converging "eventually". The engineering work is bounding the window, deciding per-feature whether staleness is acceptable, and protecting the cases where it is not (read-your-own-writes for the author, strong reads for permissions/money).',
      realWorldExample: 'You post a comment: it appears instantly for you (optimistic + read-your-writes) but may take seconds to reach other users\' feeds — totally fine. Revoking an API key, by contrast, must propagate fast and verifiably.',
      commonMistakes: ['Treating it as a defect rather than a deliberate trade for availability/decoupling', 'No UX design for the window (missing "processing" states, lists that lose just-created items)', 'Allowing invariant-critical decisions (double-spend checks) to read eventually-consistent data'],
      followUps: ['How do you give a user read-your-own-writes over an eventually consistent store?', 'What bounds the staleness window in your design?', 'Saga vs distributed transaction?'],
    },
    {
      id: 'bff',
      term: 'BFF (Backend-for-Frontend)',
      importance: 4,
      whyAsked: 'The pattern at the exact seam frontend-leaning candidates own; expect "how would you fix a chatty mobile app" style questions resolved by it.',
      explanation: 'A per-client-type aggregation API owned by the frontend team: it fans out to domain services, joins and trims data into exactly the shape one screen needs, and hosts client-specific concerns (web sessions, SSR data, mobile payload slimming). Solves both a technical problem (round trips, over-fetching) and an organizational one (frontend velocity no longer gated on a backend platform team).',
      realWorldExample: 'A mobile home screen needing user + orders + recommendations: instead of 3 sequential client calls over a high-latency network, one BFF endpoint returns a single composed payload.',
      commonMistakes: ['Letting business rules migrate into the BFF (it aggregates and shapes — domain logic stays in domain services)', 'One shared BFF for all clients — that is just another general-purpose API', 'Skipping resilience: a BFF fanning out to 5 services needs timeouts, partial-response handling, and breakers'],
      followUps: ['BFF vs GraphQL — when each?', 'How does a BFF handle one downstream being slow? (partial data + degraded sections)', 'Who owns and on-calls the BFF?'],
    },
    {
      id: 'twelve-factor',
      term: '12-Factor App',
      importance: 3,
      whyAsked: 'Shorthand for "do you know how to build cloud-deployable services"; interviewers rarely want all twelve — they want the load-bearing ones with reasons.',
      explanation: 'A methodology for SaaS apps. The factors that carry interviews: config in env vars (one artifact, many environments; no secrets in code); stateless processes (state in backing services → horizontal scaling, safe restarts); backing services as attached resources (swap by config); build/release/run separation (immutable artifacts); logs to stdout as event streams; disposability (fast start, graceful SIGTERM shutdown — prerequisite for rolling deploys); dev/prod parity.',
      realWorldExample: 'The same container image promoted dev → staging → prod with only env config changing; instances added/removed freely because sessions live in Redis, files in object storage.',
      commonMistakes: ['Reciting the list without the why', 'Claiming full compliance while sessions sit in process memory (the most common violation)', 'Treating it as dogma — some factors bend for serverless/edge runtimes'],
      followUps: ['Which factor do teams violate most? (state in processes / config in code)', 'How does graceful shutdown interact with rolling deploys?'],
    },
    {
      id: 'adr',
      term: 'ADR (Architecture Decision Record)',
      importance: 3,
      whyAsked: 'A senior-behavior probe: do you make decisions reviewable and survivable, or do they live in your head and in Slack scrollback?',
      explanation: 'A short, immutable document per significant decision: context (forces, constraints), the decision, alternatives considered, and consequences (including the negative ones — an ADR without downsides is advocacy, not a record). Stored in the repo, numbered, never edited after acceptance — superseded by a new ADR when the decision changes. Six months later, "why GraphQL?" has an answer with its original context attached.',
      realWorldExample: '"ADR-014: Adopt module federation for the checkout MFE" — capturing the team-autonomy driver, the rejected monorepo alternative and why, and the accepted payload-size consequence with its mitigation.',
      commonMistakes: ['Writing them only for huge decisions — medium, contested decisions benefit most', 'Editing old ADRs instead of superseding (destroys the historical record)', 'Novel-length ADRs nobody reads — one page is the discipline'],
      followUps: ['What goes in the consequences section?', 'How do ADRs change team disagreements? (decide-and-commit with a record, relitigating has a cost)'],
    },
    {
      id: 'tech-debt',
      term: 'Technical Debt Management',
      importance: 4,
      whyAsked: 'The most realistic senior scenario there is: every interviewer has watched debt kill velocity, and they want evidence you can manage it without either ignoring it or demanding a rewrite.',
      explanation: 'Debt is deferred work that taxes every future change. Managing it like an adult: make it visible (debt register, flagged in estimates), classify by interest rate (code you touch weekly vs a crusty corner nobody enters), pay it down continuously (boy-scout rule, a standing capacity slice ~10–20%, debt paydown attached to feature work in the same area) and argue for it in product language — "this slows every checkout change by 2 days and caused 3 of our last 5 incidents", never "the code is ugly".',
      realWorldExample: 'Tagging incident postmortems and slow estimates with the debt items that caused them — after a quarter you have an evidence-backed, prioritized paydown list that survives roadmap negotiations.',
      commonMistakes: ['Framing debt morally ("bad code") instead of economically (interest paid per change)', 'The big-bang rewrite reflex — strangler-style incremental replacement nearly always beats it', 'Treating all debt as bad: deliberate, documented shortcuts to hit a market window are legitimate — the sin is the undocumented accidental kind'],
      followUps: ['How do you convince a PM to fund debt work?', 'Deliberate vs accidental debt?', 'When IS a rewrite justified?'],
    },
    {
      id: 'strangler-fig',
      term: 'Strangler Fig Migration',
      importance: 4,
      whyAsked: 'The standard answer to "how do you modernize a legacy system without stopping the world" — interviewers want incremental, reversible migration thinking.',
      explanation: 'Put a routing facade in front of the legacy system; build replacement functionality alongside; route traffic slice by slice (per route, per feature, per cohort) to the new system; retire legacy pieces as they go dark. Each slice ships value, is independently reversible, and avoids the years-long parallel rewrite that delivers nothing until a terrifying big-bang cutover.',
      realWorldExample: 'Migrating a legacy server-rendered app to a modern stack route by route behind a reverse proxy/edge router: /account on the new app this sprint, everything else still legacy, session shared via cookie domain.',
      commonMistakes: ['Running both systems writing to separate stores without a sync/cutover plan for shared data', 'No retirement discipline — the legacy system lives forever at 20% traffic, doubling maintenance', 'Choosing the hardest domain first instead of a low-risk, high-learning slice'],
      followUps: ['How do you handle shared data during the migration?', 'What slice do you migrate first and why?', 'How do you know when to delete the old system?'],
    },
    {
      id: 'conways-law',
      term: 'Conway\'s Law',
      importance: 3,
      whyAsked: 'Staff-level signal: recognizing that architecture and org structure constrain each other, and that you can use this deliberately.',
      explanation: 'Systems mirror the communication structure of the organizations that build them. Practical consequences: service/module boundaries that cut across team boundaries generate constant friction (shared ownership = no ownership); the "inverse Conway maneuver" designs the org to induce the architecture you want — create a platform team to get a platform, give one team the checkout slice to get a clean checkout boundary.',
      realWorldExample: 'A frontend monolith shared by four teams develops merge-conflict gridlock; restructuring into feature-owned folders with CODEOWNERS (and later, MFE extraction for one team) follows the law instead of fighting it.',
      commonMistakes: ['Quoting it as trivia without an applied consequence', 'Designing "ideal" architecture that requires cross-team coordination your org cannot sustain'],
      followUps: ['What is the inverse Conway maneuver?', 'How does this inform monolith-vs-services decisions?'],
    },
    {
      id: 'cqrs-keyword',
      term: 'CQRS',
      importance: 3,
      whyAsked: 'Tests whether you can name when a fashionable pattern is justified — and when it is ceremony.',
      explanation: 'Command Query Responsibility Segregation: separate models for writes (normalized, invariant-enforcing) and reads (denormalized projections shaped per query), usually connected by events updating the projections. Justified when read and write shapes/scale diverge hard (write-normalized order data vs read-optimized seller dashboards). Unjustified for symmetric CRUD — the two-model overhead and eventual consistency buy nothing.',
      realWorldExample: 'E-commerce: orders written normalized for integrity; an order-events consumer maintains a flattened per-seller dashboard table that answers in one indexed query what would otherwise be a 6-way join.',
      commonMistakes: ['Conflating CQRS with event sourcing (independent: you can project from change events without event-sourced storage)', 'Full CQRS for a settings page', 'Forgetting the projections are eventually consistent and surface that to the UX'],
      followUps: ['CQRS without event sourcing — how?', 'How stale can the read model be and who decides?'],
    },
    {
      id: 'api-gateway-kw',
      term: 'API Gateway',
      importance: 3,
      whyAsked: 'Baseline microservices vocabulary; the probe is what belongs in it and what must not.',
      explanation: 'The single entry point in front of services: TLS termination, authn/z enforcement, rate limiting, routing, retries/timeouts policy, coarse response caching, request shaping. Centralizes edge policy so each service does not reimplement it. The discipline: policy yes, business logic no — a gateway with domain rules becomes an unowned, fragile choke point everyone fears deploying.',
      realWorldExample: 'Gateway validates the JWT once and forwards a trusted identity header; services behind it skip token parsing entirely.',
      commonMistakes: ['Business logic creep into gateway config/plugins', 'Single point of failure treated casually — gateways need HA more than anything behind them', 'Confusing gateway (edge policy) with BFF (client-shaped aggregation) — they compose, not compete'],
      followUps: ['Gateway vs BFF vs service mesh?', 'What happens when the gateway is down?'],
    },
    {
      id: 'code-review-culture',
      term: 'Code Review Culture',
      importance: 4,
      whyAsked: 'A direct window into how you collaborate at senior level: review quality, feedback delivery, and what you escalate vs let go.',
      explanation: 'Reviews exist for correctness, knowledge sharing, and design coherence — in that order of contention. Healthy culture: small PRs (<~400 lines reviewable; beyond that defect detection collapses), fast turnaround (review latency is the #1 cycle-time killer), comments distinguish blocking from nit (prefix conventions), automation handles style entirely (formatters/linters — humans never argue about commas), and authors write descriptions that frontload context and risk.',
      realWorldExample: 'Adopting "nit:" prefixes plus an auto-merge-on-approve policy cut a team\'s PR cycle time from 2 days to 4 hours without quality loss — the senior move is fixing the SYSTEM of review, not reviewing harder.',
      commonMistakes: ['Reviewing for personal style preference instead of correctness/design', 'Rubber-stamping big PRs because thorough review feels impossible (fix: demand smaller PRs)', 'Treating review comments as verdicts rather than conversation openers — tone determines whether juniors grow or hide'],
      followUps: ['How do you review a 2,000-line PR? (you don\'t — split it; pair on it if unsplittable)', 'A senior keeps approving without reading — what do you do?', 'What belongs in CI vs human review?'],
    },
  ],

  cheatSheets: [
    {
      id: 'monolith-vs-services',
      title: 'Monolith vs microservices tradeoffs',
      rows: [
        { concept: 'Transactions', description: 'Monolith: ACID across whole domain free. Services: sagas + eventual consistency, design work per flow.' },
        { concept: 'Failure modes', description: 'Monolith: in-process calls cannot timeout. Services: every call can fail/duplicate — timeouts, retries, breakers mandatory.' },
        { concept: 'Deploys', description: 'Monolith: one release train (coupling teams). Services: independent cadence per team (the real driver for splitting).' },
        { concept: 'Debugging', description: 'Monolith: one stack trace. Services: distributed tracing infra required before, not after.' },
        { concept: 'Refactoring', description: 'Monolith: IDE-assisted across boundaries. Services: API contract changes need versioning + coordination.' },
        { concept: 'When monolith wins', description: '< ~20–30 engineers, shifting domain boundaries, latency-critical flows, small ops capacity.' },
        { concept: 'The middle path', description: 'Modular monolith: one deployable, lint-enforced module boundaries, extraction path kept open.' },
      ],
    },
    {
      id: 'resilience-cheat',
      title: 'Resilience patterns quick reference',
      rows: [
        { concept: 'Timeout', description: 'Always set; budget end-to-end (outer SLA caps inner timeouts). The pattern everything else builds on.' },
        { concept: 'Retry + backoff + jitter', description: 'Idempotent ops only; cap attempts; exponential delay; jitter prevents synchronized storms.', code: 'delay = base * 2^attempt * random(0.5, 1.5)' },
        { concept: 'Circuit breaker', description: 'Closed → Open (fail fast + fallback) → Half-open (probes) → Closed. For sustained failure, not blips.' },
        { concept: 'Idempotency key', description: 'Client UUID per logical op; server dedupes and replays stored response.', code: 'Idempotency-Key: 7f9c...' },
        { concept: 'Bulkhead', description: 'Separate connection/thread pools per dependency — one slow downstream cannot drain everything.' },
        { concept: 'Load shedding', description: 'Reject excess early (429) to protect everyone, instead of degrading uniformly.' },
        { concept: 'Fallback', description: 'Cached/default/degraded response when the dependency is unavailable — design it per feature.' },
      ],
    },
    {
      id: 'twelve-factor-cheat',
      title: '12-factor — the load-bearing factors',
      rows: [
        { concept: 'Config', description: 'Env vars, not code; one artifact across environments; secrets in a secret manager.' },
        { concept: 'Processes', description: 'Stateless — sessions in Redis, files in object storage. Prerequisite for scaling out.' },
        { concept: 'Build/release/run', description: 'Build once, promote the same immutable artifact; release = artifact + config.' },
        { concept: 'Backing services', description: 'DB/queue/cache as attached resources, swappable by config.' },
        { concept: 'Disposability', description: 'Fast startup, graceful SIGTERM shutdown (drain in-flight) — enables rolling deploys.' },
        { concept: 'Logs', description: 'Write event streams to stdout; aggregation/routing is the platform\'s concern.' },
        { concept: 'Dev/prod parity', description: 'Same services, versions, containers locally and in prod — shrink "works on my machine".' },
      ],
    },
    {
      id: 'layer-responsibilities',
      title: 'Who does what — layered + frontend mapping',
      rows: [
        { concept: 'Controller / route', description: 'Parse, validate, call service, map result→status. No business rules.' },
        { concept: 'Service / use case', description: 'Business rules, orchestration, transaction boundaries. No HTTP, no SQL.' },
        { concept: 'Repository', description: 'Queries, ORM, cache. Returns domain objects, not rows.' },
        { concept: 'Frontend: component', description: 'Render + emit. Presentational components are pure props-in/events-out.' },
        { concept: 'Frontend: composable/hook', description: 'Stateful logic, orchestration — the frontend "service" layer. Testable without mounting.' },
        { concept: 'Frontend: API layer', description: 'Typed client functions per endpoint; the only place fetch/axios appears.' },
        { concept: 'Dependency rule', description: 'Dependencies point inward/downward only; cross-feature imports forbidden — enforce with lint.' },
      ],
    },
    {
      id: 'deploy-strategies',
      title: 'Deployment strategies',
      rows: [
        { concept: 'Rolling', description: 'Replace instances gradually. Cheap; rollback = roll forward through versions; brief version mixing.' },
        { concept: 'Blue-green', description: 'Two full environments, atomic traffic switch, instant rollback. Costs 2× capacity at deploy time.' },
        { concept: 'Canary', description: '1–5% real traffic on new version, automated metric comparison, promote/rollback. Best risk profile, needs metrics maturity.' },
        { concept: 'Feature flags', description: 'Release control decoupled from deploy entirely; per-cohort rollout; instant kill switch.' },
        { concept: 'Migrations rule', description: 'Expand → migrate → contract: schema changes backward-compatible with the previous app version (rollback safety).' },
      ],
    },
  ],

  questions: [
    {
      id: 'q-layers-why',
      level: 'beginner',
      question: 'Why split a backend into controller, service, and repository layers at all?',
      answer: 'Each layer isolates one kind of change and one kind of test. Controllers isolate the transport (HTTP today, queue consumer tomorrow — same service). Services hold business rules testable without HTTP or a database. Repositories isolate persistence so schema/ORM changes do not ripple upward and tests can use in-memory fakes. The dependency rule (downward only, ideally via interfaces) is what makes each layer replaceable.',
      deepDive: 'The mature caveat: layers are a means, not a ritual. A pass-through service that adds nothing is fine to collapse until logic exists — premature layering is its own debt. The senior framing: "I add a layer when I can name the change it isolates."',
      followUps: ['Where do transactions belong and why? (service — it owns the business operation\'s atomicity)', 'Where does validation go — controller or service? (shape at the edge, business rules in the service)'],
    },
    {
      id: 'q-hexagonal',
      level: 'intermediate',
      question: 'Explain hexagonal architecture in plain terms. What problem does it solve over plain layering?',
      answer: 'Business logic sits at the center, defining interfaces (ports) for everything it needs from the outside world; infrastructure implements those interfaces as adapters. The core never imports the framework, the ORM, or HTTP. Versus plain layering, it inverts the persistence dependency: instead of services depending on a concrete repository, the core OWNS the repository interface and infrastructure depends on the core. Tests run all business logic with in-memory adapters; infrastructure swaps touch only adapters.',
      deepDive: 'Plain layering often still leaks: services import ORM entities, framework decorators wrap domain classes. Hexagonal makes the leak structurally impossible (the core package literally has no infrastructure dependencies to import). Honest cost: mapping between domain models and persistence/transport models. For CRUD-heavy apps say the pragmatic version: framework-free domain logic + injected I/O, not forty interfaces.',
      followUps: ['Driving vs driven adapters?', 'How does this map to a frontend app?', 'When is this over-engineering?'],
    },
    {
      id: 'q-monolith-defense',
      level: 'advanced',
      question: 'Your team of 12 wants to split the monolith into microservices because "it doesn\'t scale". How do you respond?',
      answer: 'First separate the claims: traffic scaling almost never requires services — a monolith scales horizontally behind a load balancer, and the database is usually the real bottleneck either way. What microservices actually buy is independent team deployment — and with 12 engineers, the release train is rarely the constraint. Diagnose the real pain (slow builds? scary deploys? tangled modules?) and fix it directly: modular monolith with enforced boundaries, faster CI, feature flags + canary deploys. If one component genuinely has different scaling/runtime needs, extract that ONE service and learn from the seam.',
      deepDive: 'Name the costs they would buy: distributed transactions become sagas, debugging needs tracing infra, every call gains failure modes, infra and on-call multiply — at 12 engineers that overhead is paid by the same people building features. The distributed monolith (coupled services that deploy together) is the most likely outcome of splitting along unclear boundaries. This question is really testing whether you can disagree with a popular idea using evidence and offer a cheaper path to the same goal.',
      realWorldExample: 'Well-known counter-examples to cite carefully: Shopify and Stack Overflow scaled monoliths to enormous traffic; conversely Amazon/Netflix split because of THOUSANDS of engineers, not QPS.',
      followUps: ['What pain signals WOULD justify extraction?', 'What is a modular monolith concretely — how do you enforce boundaries?', 'How would you extract the first service safely?'],
    },
    {
      id: 'q-event-driven-tradeoffs',
      level: 'intermediate',
      question: 'When would you choose event-driven communication over direct service calls, and what does it cost?',
      answer: 'Choose events when: the producer should not know or care who reacts (order placed → email, analytics, inventory all subscribe independently), consumers can lag without harming the user-facing flow, or you need to absorb spikes. Stay synchronous when the caller needs the result to proceed (checkout needs the payment outcome NOW). Costs: eventual consistency, at-least-once delivery forcing idempotent consumers, harder end-to-end reasoning, event schema evolution, and the dual-write problem requiring the outbox pattern.',
      deepDive: 'The dual-write probe is where this question usually goes: writing the DB and publishing to the broker are two operations — crash between them and your system lies to itself. Outbox: state change + event row in one transaction, a relay publishes. Knowing this unprompted is a strong senior signal.',
      followUps: ['Event vs command — why does the distinction matter?', 'Explain the outbox pattern', 'How do you debug "the email never sent" across an event-driven flow? (correlation IDs + tracing through the broker)'],
    },
    {
      id: 'q-frontend-structure',
      level: 'intermediate',
      question: 'How do you structure a frontend codebase that 30 engineers will work in for years?',
      answer: 'Feature-based folders (features/checkout, features/search) each containing their components, composables, API functions, and types — code that changes together lives together, ownership maps to teams via CODEOWNERS. A shared layer for the design system and generic utilities, with the iron rule enforced by lint tooling: features import from shared, never from each other. Inside each feature: presentational components (props in, events out) + composables holding stateful logic + an API layer as the only place network calls live. State placement by kind: server cache in a query library, small per-domain global stores, URL for shareable state.',
      deepDive: 'The deeper point is that the structure is a dependency-management tool: the feature-isolation rule is what keeps refactors local, enables Storybook/test mounting of features in isolation, and makes the eventual "extract this team\'s area" conversation (MFE or package) tractable. Mention the composition root (app setup in one place) and that the structure should be boring — discoverability beats cleverness for 30 engineers.',
      followUps: ['Two features need the same logic — where does it go and who decides?', 'How do you enforce "no cross-feature imports" mechanically?', 'When would you promote this to a monorepo of packages?'],
    },
    {
      id: 'q-di-testing',
      level: 'beginner',
      question: 'What is dependency injection and why does it matter for testing?',
      answer: 'Instead of a component constructing its own dependencies (new StripeClient() inside the service), they are passed in — constructor parameters, function arguments, or a framework container. The component depends on an interface; the caller chooses the implementation. For testing this is everything: inject an in-memory fake repository and a fake payment gateway, and your business-logic tests run in milliseconds with no network, no DB, and full control over failure scenarios ("what if the gateway times out?" is one fake away).',
      deepDive: 'The non-obvious candidates seniors mention: time (inject a clock — testing "trial expires after 14 days" must not require waiting) and randomness/IDs (deterministic tests). Also the boundary: do not inject pure utilities; inject the things you will swap — I/O, time, randomness, config.',
      followUps: ['DI without a framework — show me', 'What is a composition root?', 'Service locator vs DI?'],
    },
    {
      id: 'q-retry-storm',
      level: 'advanced',
      question: 'A downstream service degrades, and your retries make the outage worse. What happened and how do you fix the design?',
      answer: 'Retry amplification: if each of three layers retries 3×, the bottom service sees up to 27× load exactly when it is least able to serve it — retries turned a degradation into an outage. Fixes: exponential backoff with jitter (spreads retries instead of synchronized waves), retry budgets (cap retries as a fraction of requests, e.g. max 10% extra load), retry at ONE layer only (usually the edge), circuit breakers to stop calling a sick dependency entirely and serve fallbacks, and load shedding at the struggling service (fast 429s beat slow timeouts).',
      deepDive: 'The compounding subtlety: timeouts that are longer than the caller\'s own timeout mean work continues for abandoned requests — wasted capacity during the worst moment. Budget timeouts end-to-end. This question evaluates whether you think in system dynamics (feedback loops) rather than per-component correctness.',
      followUps: ['Why jitter specifically?', 'Where should the retry live when three layers could do it?', 'What is a retry budget?'],
    },
    {
      id: 'q-idempotent-checkout',
      level: 'advanced',
      question: 'Design order creation so a user double-clicking "Place order" (or a retried request) never creates two orders.',
      answer: 'Client generates an idempotency key (UUID) when the checkout view loads (not per click) and sends it with the POST; double-clicks and network retries reuse the same key. Server: atomically claim the key (INSERT into an idempotency table with a unique constraint — the constraint is the race protection), process the order, store the response against the key. A duplicate request hits the constraint, waits for/fetches the stored result, and returns the SAME response — the client cannot tell it was a duplicate. Frontend also disables the button optimistically, but that is UX polish, not the correctness mechanism.',
      deepDive: 'Edge cases that show depth: a duplicate arriving while the first is still processing (return 409/Retry or block on the in-flight result), key TTL (keep at least as long as clients retry — typically 24h), and scoping keys per user+endpoint so keys cannot collide across operations. The principle generalizes: client-supplied operation identity is how distributed systems get effective exactly-once.',
      followUps: ['Why is button-disabling alone insufficient?', 'What does the unique constraint protect against exactly?', 'How does this interact with the payment provider\'s own idempotency keys?'],
    },
    {
      id: 'q-cicd-design',
      level: 'intermediate',
      question: 'Design the CI/CD pipeline for a production web app. What gates, in what order, and why?',
      answer: 'Order by cost and feedback speed: (1) on every push — lint, typecheck, unit tests, in parallel, minutes; (2) integration/component tests; (3) build the artifact ONCE, immutable and versioned; (4) deploy to staging, run smoke tests; (5) canary to ~5% production traffic with automated comparison of error rate/latency against baseline; (6) progressive promotion or automatic rollback; (7) post-deploy monitors and a deploy marker on dashboards. Frontend additions: bundle-size budget assertions, Lighthouse CI on key routes, preview deployments per PR.',
      deepDive: 'Two principles carry the answer: build-once-promote (testing one artifact and shipping another invalidates the testing) and progressively expensive gates (cheap checks fail fast, expensive checks run on survivors). Add the operational truths: pipeline speed is a feature (slow CI halves merge frequency), flaky tests get zero tolerance, and schema migrations follow expand-migrate-contract so rollback is always safe.',
      followUps: ['Why never rebuild per environment?', 'How does the canary decide pass/fail automatically?', 'How do DB migrations stay rollback-safe?'],
    },
    {
      id: 'q-tradeoff-articulation',
      level: 'expert',
      question: 'Tell me about a technical decision where you were torn. How did you decide, and what would change your mind?',
      answer: 'The structure interviewers want: (1) the genuine tension — two options each with real merits ("SSR for performance/SEO vs staying SPA for team velocity and infra simplicity"); (2) the forces — constraints, team skills, deadlines, reversal cost; (3) the deciding criterion made explicit ("conversion impact of LCP outweighed the infra cost; we measured a prototype first"); (4) risk mitigation for the road not taken; (5) the falsifier — what evidence would flip the decision, and ideally that you wrote it down (ADR). The content matters less than demonstrating decision hygiene: explicit criteria, smallest reversible step, measured validation, documented context.',
      deepDive: 'Weak answers present one option as obviously right (no tension = no judgment shown) or decide by authority/fashion. Strong answers quantify ("prototype showed 1.1s LCP improvement on mobile"), acknowledge the cost they accepted, and show the decision being revisited when evidence arrived. Senior-engineer-mode rounds score the meta-skill: can this person make contested decisions legible to others?',
      followUps: ['What did the decision cost you that you predicted? That you didn\'t?', 'How did you bring the disagreeing engineer along?'],
    },
    {
      id: 'q-mentoring',
      level: 'expert',
      question: 'A mid-level engineer on your team writes working but poorly structured code and resists review feedback. How do you handle it?',
      answer: 'Diagnose before prescribing: resistance usually means the feedback feels arbitrary, late, or status-threatening. Moves: shift design feedback earlier (a 15-minute design chat before they write 800 lines beats 40 review comments after), make feedback criteria-based not taste-based (link the team\'s agreed conventions/ADRs; if no agreement exists, that is the real gap — drive one), pair on a refactor so reasoning transfers in context rather than in comment threads, give them ownership of something structural (the person who owns the module\'s health starts caring about structure), and deliver the pattern-level feedback privately, not PR-by-PR.',
      deepDive: 'The senior signal is treating it as a systems problem (feedback timing, missing shared standards, motivation) rather than a person problem ("they just don\'t listen"). Also the honest boundary: if agreed standards exist and are repeatedly ignored after real support, it becomes a performance conversation with their manager — seniors escalate cleanly rather than silently rewriting the person\'s code, which helps nobody.',
      followUps: ['How do you give critical feedback on code you would have written completely differently?', 'What if the resistant engineer is more senior than you?'],
    },
    {
      id: 'q-ownership-incident',
      level: 'expert',
      question: 'Walk me through an incident you owned end to end. What did you change afterward?',
      answer: 'The expected arc: detection (how you knew — ideally an alert, not a customer), triage (impact assessment, communication cadence to stakeholders, deciding mitigate-first vs diagnose-first — mitigation almost always wins: roll back, flag off, shed load), diagnosis (the trail: deploy markers, traces, logs), resolution, then the part that actually scores points — the follow-through: a blameless postmortem focused on systemic causes ("the deploy had no canary" not "Dave didn\'t test"), and concrete prevention shipped: a new alert, a CI gate, a runbook, an architectural fix. Ownership means the class of incident dies, not just the instance.',
      deepDive: 'Senior differentiators: communicating early and predictably during the incident (stakeholder updates every 30 min beat heroic silence), resisting the urge to debug before mitigating, and the postmortem question "why was this possible?" asked five times. If your example includes changing something organizational (on-call rotation, deploy policy) and not just code, it reads staff-level.',
      followUps: ['Mitigate vs diagnose first — how do you decide in the moment?', 'What makes a postmortem blameless in practice, not just in name?'],
    },
    {
      id: 'q-debt-negotiation',
      level: 'advanced',
      question: 'Product wants features every sprint; the codebase is slowing you down. How do you make the case for paying down debt?',
      answer: 'Translate debt into product language with evidence: "changes in checkout take 3× longer than a year ago — here are the cycle-time numbers", "4 of our last 6 incidents trace to this module", "this quarter we spent 30% of capacity on workarounds". Then propose options with costs, not an ultimatum: a standing 15% capacity slice, debt paydown bundled into feature work touching the same area (cheapest — context is already loaded), or a scoped one-sprint investment with a named payoff ("after this, A/B tests on pricing ship in days not weeks"). Track and report the result so the next negotiation starts from credibility.',
      deepDive: 'What fails: moral framing ("the code is bad"), open-ended asks ("we need a refactoring quarter"), and all-or-nothing rewrites. What works is treating the PM as an investor: interest rate, principal, payoff timeline. The strongest senior move is making debt visible continuously (estimates that name the debt tax, postmortems that tag debt causes) so the case builds itself instead of being relitigated each sprint.',
      followUps: ['When do you just fix it without asking? (boy-scout-rule scale changes)', 'How do you stop the paid-down area from re-accumulating debt?'],
    },
    {
      id: 'q-adr-disagree',
      level: 'advanced',
      question: 'Your team made an architecture decision you disagree with. What do you do?',
      answer: 'Disagree-and-commit, executed honestly: argue the position fully BEFORE the decision (with evidence, in the ADR discussion — not hallway lobbying after), make sure the record captures your concern and the conditions under which it matters ("if event volume exceeds X, this design degrades"), then commit genuinely — building it half-heartedly to be proven right is the senior anti-pattern. Set up the falsifier: the metrics that would show your concern materializing, agreed in advance. If evidence arrives, reopen with data via a superseding ADR, not "I told you so".',
      deepDive: 'This question screens for two failure modes: the engineer who relitigates forever (team velocity dies) and the one who silently disengages (concerns lost, resentment grows). The ADR mechanism is the answer to both — dissent is recorded and decision-reopening has a defined, evidence-based path. Mentioning that you have been on the WRONG side of such a disagreement and what it taught you reads as genuine seniority.',
      followUps: ['What if the decision is actively dangerous, not just suboptimal?', 'How do you record dissent without undermining the decision?'],
    },
    {
      id: 'q-bff-question',
      level: 'intermediate',
      question: 'Your mobile app makes 6 sequential API calls to render the home screen. The backend team says the APIs are "correct as designed". Options?',
      answer: 'The APIs are resource-correct but experience-wrong — this is the BFF\'s exact use case. Options by cost: (1) parallelize the 6 calls client-side if dependencies allow (cheap, helps immediately, still 6× connection overhead on mobile); (2) a batch endpoint on the existing API; (3) a BFF owned by the app team: one endpoint per screen, fanning out to services server-side over fast datacenter links, returning one composed, trimmed payload; (4) GraphQL if many screens across many clients need this flexibility and the org will fund the platform. For one team and a handful of screens, the BFF is usually the right size.',
      deepDive: 'The organizational reading matters as much as the technical one: "correct as designed" signals the backend team optimizes for resource purity, not client experience — the BFF resolves the standoff by giving the experience team ownership of aggregation without asking the platform team to special-case mobile. Mention BFF resilience (timeouts per downstream, partial responses for non-critical sections) to show production thinking.',
      followUps: ['What stops the BFF from becoming a junk drawer of business logic?', 'How does the BFF respond when 1 of its 5 downstreams is down?'],
    },
    {
      id: 'q-12factor-violation',
      level: 'beginner',
      question: 'A teammate stores user sessions in the Node process memory and uploaded files on the local disk. What breaks and what is the fix?',
      answer: 'Both violate stateless processes (12-factor): with two instances behind a load balancer, requests hit different nodes — users randomly lose their session; files uploaded to one node 404 on the other. Deploys/restarts log everyone out and delete files. Fix: sessions to Redis (or stateless JWTs with the tradeoffs acknowledged), files to object storage with a CDN in front. The instance must be disposable: kill any node at any time with zero user-visible effect — that property is what enables horizontal scaling, autoscaling, and rolling deploys.',
      followUps: ['Sticky sessions could "fix" it — why is that the wrong fix? (pins load, breaks on node death, blocks scaling down)', 'What other hidden state lurks in apps? (local caches, in-memory rate limit counters, cron in-process)'],
    },
  ],

  codingQuestions: [
    {
      id: 'code-retry-backoff',
      title: 'Retry with exponential backoff and jitter',
      level: 'intermediate',
      problem: 'Implement retry(fn, options): retry a failing async operation with exponential backoff + full jitter, a max attempt cap, and an isRetryable predicate so non-transient errors (400s) fail immediately.',
      solution: {
        lang: 'ts',
        code: `interface RetryOptions {
  maxAttempts?: number
  baseDelayMs?: number
  maxDelayMs?: number
  isRetryable?: (error: unknown) => boolean
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

async function retry<T>(
  fn: () => Promise<T>,
  {
    maxAttempts = 3,
    baseDelayMs = 200,
    maxDelayMs = 10_000,
    isRetryable = () => true,
  }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const isLastAttempt = attempt === maxAttempts - 1
      if (isLastAttempt || !isRetryable(error)) throw error
      // exponential backoff with FULL jitter: random(0, cappedExponential)
      const exponential = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt)
      await sleep(Math.random() * exponential)
    }
  }
  throw lastError // unreachable, satisfies the compiler
}`,
      },
      explanation: 'Three production essentials in one function: exponential growth backs off a struggling dependency; full jitter (random between 0 and the exponential cap) prevents thousands of clients retrying in synchronized waves; the isRetryable predicate stops pointless retries of deterministic failures — a 400 will fail identically forever, while 429/503/timeouts are worth retrying. The cap keeps worst-case delay bounded.',
      timeComplexity: 'O(maxAttempts) calls; wall time bounded by sum of capped delays',
      spaceComplexity: 'O(1)',
      alternatives: ['Decorrelated jitter (AWS variant): delay = random(base, prev*3)', 'Respect Retry-After header when present', 'Retry budget: cap total retries as a fraction of all calls across the client'],
    },
    {
      id: 'code-circuit-breaker',
      title: 'Implement a circuit breaker',
      level: 'advanced',
      problem: 'Build a CircuitBreaker class wrapping an async function: opens after N consecutive failures, fails fast while open, transitions to half-open after a cooldown, and closes again on a successful probe.',
      solution: {
        lang: 'ts',
        code: `type State = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

class CircuitBreaker<Args extends unknown[], R> {
  private state: State = 'CLOSED'
  private failures = 0
  private openedAt = 0

  constructor(
    private fn: (...args: Args) => Promise<R>,
    private failureThreshold = 5,
    private cooldownMs = 30_000,
  ) {}

  getState(): State {
    return this.state
  }

  async call(...args: Args): Promise<R> {
    if (this.state === 'OPEN') {
      const cooledDown = Date.now() - this.openedAt >= this.cooldownMs
      if (!cooledDown) throw new Error('CircuitOpenError: failing fast')
      this.state = 'HALF_OPEN' // allow one probe through
    }

    try {
      const result = await this.fn(...args)
      // success: probe passed or normal call — reset
      this.state = 'CLOSED'
      this.failures = 0
      return result
    } catch (error) {
      this.failures++
      const probeFailed = this.state === 'HALF_OPEN'
      if (probeFailed || this.failures >= this.failureThreshold) {
        this.state = 'OPEN'
        this.openedAt = Date.now()
      }
      throw error
    }
  }
}

// usage: const guarded = new CircuitBreaker(fetchRecommendations)
// try { items = await guarded.call(userId) } catch { items = popularFallback }`,
      },
      explanation: 'The state machine in ~40 lines: CLOSED counts failures; hitting the threshold records openedAt and trips OPEN; while open, calls throw immediately — no waiting on timeouts, no load on the sick dependency; after the cooldown the next call becomes the HALF_OPEN probe — its success closes the circuit, its failure re-opens with a fresh cooldown. Callers pair it with a fallback so open means degraded, not broken.',
      timeComplexity: 'O(1) overhead per call',
      spaceComplexity: 'O(1)',
      alternatives: ['Failure RATE over a sliding window instead of consecutive count (production-grade)', 'Limited concurrent probes in half-open rather than one', 'Emit state-change events for monitoring/alerting'],
    },
    {
      id: 'code-di-container',
      title: 'Minimal dependency injection container',
      level: 'advanced',
      problem: 'Implement a typed DI container: register(token, factory) with lazy singleton resolution, where factories can resolve their own dependencies — then show why constructor injection makes a service testable.',
      solution: {
        lang: 'ts',
        code: `class Container {
  private factories = new Map<string, (c: Container) => unknown>()
  private singletons = new Map<string, unknown>()

  register<T>(token: string, factory: (c: Container) => T): void {
    this.factories.set(token, factory)
  }

  resolve<T>(token: string): T {
    if (this.singletons.has(token)) return this.singletons.get(token) as T
    const factory = this.factories.get(token)
    if (!factory) throw new Error('No provider for ' + token)
    const instance = factory(this) // factory may resolve its own deps
    this.singletons.set(token, instance) // lazy singleton
    return instance as T
  }
}

// --- the point of all this: depend on interfaces, wire at the root ---
interface UserRepo {
  findById(id: string): Promise<{ id: string; email: string } | null>
}
interface Mailer {
  send(to: string, subject: string): Promise<void>
}

class WelcomeService {
  constructor(private repo: UserRepo, private mailer: Mailer) {}
  async welcome(userId: string): Promise<boolean> {
    const user = await this.repo.findById(userId)
    if (!user) return false
    await this.mailer.send(user.email, 'Welcome!')
    return true
  }
}

// composition root (production wiring)
const container = new Container()
container.register<UserRepo>('UserRepo', () => new PostgresUserRepo())
container.register<Mailer>('Mailer', () => new SmtpMailer())
container.register('WelcomeService', (c) =>
  new WelcomeService(c.resolve<UserRepo>('UserRepo'), c.resolve<Mailer>('Mailer')))

// test wiring: no container even needed — constructor injection IS the seam
// const svc = new WelcomeService(fakeRepo, fakeMailer)

declare class PostgresUserRepo implements UserRepo {
  findById(id: string): Promise<{ id: string; email: string } | null>
}
declare class SmtpMailer implements Mailer {
  send(to: string, subject: string): Promise<void>
}`,
      },
      explanation: 'The container is deliberately tiny — a Map of factories with lazy singleton caching — because the insight is not the container, it is the last comment: WelcomeService is testable by plain construction with fakes; the container only automates production wiring at the composition root. Factories receiving the container lets dependencies resolve transitively. Real frameworks add scopes, decorators, and cycle detection on top of exactly this core.',
      timeComplexity: 'O(1) resolve after first construction',
      spaceComplexity: 'O(registered services)',
      alternatives: ['Symbol/branded tokens instead of strings for type-safe resolution', 'Transient scope (skip the singleton cache) per registration', 'Frontend equivalent: provide/inject in Vue, context in React — same inversion, framework-native'],
    },
    {
      id: 'code-event-bus',
      title: 'Typed event bus with delivery-failure isolation',
      level: 'intermediate',
      problem: 'Build a typed in-process event bus: subscribe/unsubscribe per event, publish delivers to all handlers, and — the production detail — one throwing handler must not prevent delivery to the others.',
      solution: {
        lang: 'ts',
        code: `interface Events {
  'order:placed': { orderId: string; total: number }
  'user:registered': { userId: string }
}

type Handler<T> = (payload: T) => void | Promise<void>

class EventBus<E extends Record<string, unknown>> {
  private handlers = new Map<keyof E, Set<Handler<never>>>()

  subscribe<K extends keyof E>(event: K, handler: Handler<E[K]>): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set())
    this.handlers.get(event)!.add(handler as Handler<never>)
    return () => this.handlers.get(event)?.delete(handler as Handler<never>)
  }

  async publish<K extends keyof E>(event: K, payload: E[K]): Promise<void> {
    const subs = this.handlers.get(event)
    if (!subs) return
    // snapshot: handlers that unsubscribe during dispatch don't skip others
    const results = await Promise.allSettled(
      [...subs].map((h) => (h as Handler<E[K]>)(payload)),
    )
    for (const r of results) {
      if (r.status === 'rejected') {
        console.error('handler failed for', String(event), r.reason)
        // production: report to error monitoring; NEVER rethrow into publisher
      }
    }
  }
}

const bus = new EventBus<Events>()
const unsubscribe = bus.subscribe('order:placed', ({ orderId }) => {
  console.log('send confirmation for', orderId)
})
void bus.publish('order:placed', { orderId: 'o-1', total: 49.9 })
unsubscribe()`,
      },
      explanation: 'The Events interface gives compile-time payload safety — publishing a wrong shape or subscribing to an unknown event is a type error. Promise.allSettled is the load-bearing choice: it embodies the event-driven principle that the producer must not couple to consumer outcomes — one failing email handler cannot block the analytics handler or bubble into the order flow. The snapshot ([...subs]) tolerates handlers unsubscribing mid-dispatch; returning an unsubscribe closure prevents the leak of forgotten listeners.',
      timeComplexity: 'publish O(handlers); subscribe/unsubscribe O(1)',
      spaceComplexity: 'O(events × handlers)',
      alternatives: ['Sequential dispatch when handler order matters', 'once() helper via self-removing wrapper', 'Cross-component frontend usage — and why a query library or store often beats a raw bus (discoverability of data flow)'],
    },
  ],

  scenarios: [
    {
      id: 'sc-microservices-pushback',
      title: 'Leadership wants microservices; you think it will hurt — navigate the disagreement',
      situation: 'A new CTO mandates "microservices by Q4" for your 15-engineer team\'s working monolith, citing scalability. You believe it will slow the team for a year and add outage risk. Senior Engineer Mode: this is a tradeoff-articulation and influence scenario.',
      approach: [
        'Steelman first, in writing: list what services would genuinely buy here (deploy independence if teams are blocked, isolation for the one CPU-heavy component). Credibility to push back comes from demonstrating you understand the upside.',
        'Replace the ideological debate with a diagnostic one: gather the actual pain data — deploy frequency, build times, incident causes, cross-team blocking instances. Usually the data shows a deployment/modularity problem, not a service-count problem.',
        'Propose the cheaper path to the SAME goals, with a scoreboard: modular monolith with enforced boundaries + CI speedup + canary deploys, measured by deploy frequency and lead time over one quarter. Frame it as de-risking the CTO\'s goal, not opposing it.',
        'Concede a concrete pilot: extract the single best-bounded, lowest-risk component as one service to build the operational muscle (contracts, tracing, on-call) — evidence for both sides of the argument.',
        'Write the ADR capturing the decision, your concerns, and the agreed falsifiers ("if cross-team blocking persists after modularization, we extract further"). Then commit fully to whatever is decided.',
      ],
      keyTakeaways: ['Disagree with data and a cheaper alternative, never with taste — and steelman before you counter', 'Convert "whether" arguments into "measure what" experiments with agreed success criteria', 'Disagree-and-commit needs a written record and falsifiers, or it becomes relitigation or resentment'],
    },
    {
      id: 'sc-legacy-migration',
      title: 'Migrate a legacy jQuery app to a modern framework without stopping feature delivery',
      situation: 'A revenue-critical 10-year-old jQuery app needs modernization. A previous "big rewrite" attempt was cancelled after 8 months with nothing shipped. You own the second attempt.',
      approach: [
        'Name why the rewrite failed and design against it: parallel rewrites deliver zero value until a big-bang cutover, while the legacy target keeps moving. The strangler fig approach inverts this — every increment ships to production.',
        'Establish the facade: a reverse proxy / edge router in front, routing per-path between legacy and new app. Solve the shared-session problem first (cookie domain or token bridge) — it gates everything.',
        'Pick the first slice for learning, not impact: a low-risk, self-contained route (e.g., account settings). Prove the full pipeline: routing, session sharing, design consistency, analytics continuity, rollback by route flip.',
        'Then sequence by value: migrate routes where new features are planned anyway (you pay the migration once and the feature builds on the new stack), keep frozen routes on legacy indefinitely — migrating dead code is pure waste.',
        'Enforce the ratchet: no new features on legacy routes without explicit exception; a visible burn-down of routes migrated; delete legacy code as routes go dark (the retirement is the point — two systems forever is the failure mode).',
        'Report progress in business terms each month: routes migrated, incidents avoided, feature lead time on new vs old stack.',
      ],
      keyTakeaways: ['Strangler fig beats rewrite because every step ships value and is independently reversible', 'First slice optimizes for learning the seams (auth, routing, analytics) — not for impact', 'The discipline that makes it work is retirement: legacy code must actually die, tracked visibly'],
    },
    {
      id: 'sc-god-store-refactor',
      title: 'The frontend has one 3,000-line global store imported by everything — fix it without a freeze',
      situation: 'A 4-year-old Vue app has a single store holding auth, cart, products, UI flags, and server data. Every change risks distant breakage; tests are impossible; two teams keep colliding in it. You have no mandate for a feature freeze.',
      approach: [
        'Map before moving: inventory the store\'s state by kind (server cache vs client state vs UI state) and by domain (auth, cart, catalog), plus who reads/writes each slice. The map usually shows ~60% is server data that should not be in a store at all.',
        'Stop the bleeding first: lint rule forbidding NEW imports of the god store outside an allowlist; new features use the new pattern from day one. The ratchet matters more than the cleanup speed.',
        'Move server data out first — biggest win, most mechanical: each API-derived slice migrates to a query library (caching, deduplication, s-w-r replace the hand-rolled fetch+store logic). Delete the corresponding actions/mutations as each migrates.',
        'Split remaining client state into per-domain stores (auth, cart, UI) behind their existing read interfaces where possible, so consumers migrate gradually; CODEOWNERS aligns each store with its owning team — that ends the cross-team collisions.',
        'Migrate consumers opportunistically: any PR touching a component also moves its store usage (boy-scout ratchet), tracked by a simple count-of-imports metric on the dashboard until it reaches zero.',
      ],
      keyTakeaways: ['Classify state by kind first — most god-store weight is server cache that belongs in a query library', 'Ratchets (lint bans on new usage) beat cleanups: stop growth first, shrink opportunistically second', 'Aligning store ownership with team ownership is what removes the collisions — Conway applied to state'],
    },
    {
      id: 'sc-deploy-fear',
      title: 'Deploys happen monthly and everyone is afraid of them — build the path to daily releases',
      situation: 'Releases are monthly, manual, after-hours events with a war room; two of the last six caused outages. Engineers batch changes to avoid the pain, making each release bigger and riskier. Leadership asks you to fix "release quality".',
      approach: [
        'Reframe the diagnosis: the problem is batch size, not care. Monthly releases mean ~80 changes per deploy — any failure is unattributable and rollback reverts everyone. Smaller, more frequent deploys are SAFER; this counterintuitive point is the whole case.',
        'Build the safety floor before the frequency: real health checks, one-command rollback, deploy markers on dashboards, alerting on error-rate/latency deltas post-deploy. Practice a rollback in a game day so it is boring.',
        'Decouple deploy from release with feature flags: incomplete work merges and deploys dark. This removes the "wait for the feature to finish" pressure that creates batching, and gives instant kill switches instead of rollbacks for feature issues.',
        'Automate the pipeline to a single promote action: build-once artifacts, staging smoke tests, then canary (5% + automated metric comparison) — the canary replaces the war room: machines watch the metrics, not ten people on a call.',
        'Ratchet the cadence with the team, not by decree: weekly → twice weekly → daily, retroing each step. Track DORA metrics (deploy frequency, lead time, change-failure rate, MTTR) to show risk DROPPING as frequency rises — the data converts the skeptics.',
      ],
      keyTakeaways: ['Deploy pain is a batch-size problem: frequency is the cure, not the risk — argue it with change-failure-rate data', 'Flags decouple deploy from release, removing the root cause of batching', 'Invest in rollback/canary safety BEFORE raising cadence; confidence is built on rehearsed recovery, not hope'],
    },
  ],

  mentalModels: [
    {
      id: 'mm-dependency-rule',
      title: 'The Dependency Rule (arrows point inward)',
      flow: ['UI / HTTP / DB drivers (volatile)', 'Adapters / controllers', 'Use cases / services', 'Domain rules (stable)', 'Rule: arrows only point toward stability'],
      explanation: [
        'Picture every import as an arrow. Healthy architectures point arrows from volatile things (frameworks, transports, storage) toward stable things (business rules) — never the reverse. The thing that changes most often must depend on the thing that changes least.',
        'Every named architecture — layered, hexagonal, clean — is a restatement of this one rule with different packaging. Internalize the rule and you can derive the architectures instead of memorizing them.',
        'When the core must use something volatile (a database), it defines an interface and the volatile side implements it — dependency inversion is the tool that flips an arrow without removing the capability.',
      ],
      whatBreaksWithoutIt: 'Arrows pointing outward mean framework upgrades, ORM swaps, and transport changes ripple into business logic; tests need real infrastructure; the domain becomes untestable and eventually unreadable.',
      interviewTip: 'Whatever architecture question you get, draw the arrows and say "dependencies point toward stability". You can then explain hexagonal, clean, and DI as corollaries — one model, three buzzwords covered.',
    },
    {
      id: 'mm-everything-fails',
      title: 'Everything Fails (design for partial failure)',
      flow: ['Assume: every call can fail, hang, or duplicate', 'Timeout: bound the wait', 'Retry + jitter: survive blips (idempotent only)', 'Circuit breaker: stop calling the sick', 'Fallback: degrade, don\'t die', 'Blast radius: contain, observe, recover'],
      explanation: [
        'The monolith-to-distributed mindset shift in one sentence: in-process calls succeed or throw; network calls succeed, fail, hang, OR succeed-without-you-knowing (duplicates on retry). Every pattern in the resilience kit handles one of these.',
        'Order matters: timeouts make failure detectable, idempotency makes retries safe, retries handle blips, breakers handle sustained failure, fallbacks convert failure into degradation. Each layer assumes the previous exists.',
        'Think in blast radius: the question is never "will the recommendations service fail" (it will) but "when it does, does the product page still render?"',
      ],
      whatBreaksWithoutIt: 'Without it you get cascading failures: one slow dependency drains connection pools, retries amplify load 27×, and a minor degradation becomes a full outage — the signature incident of teams that distributed without the mindset.',
      interviewTip: 'When any design includes a network arrow, touch the arrow and say "this can fail, hang, or duplicate — here is the handling". Doing it unprompted for every arrow is one of the most reliable senior signals.',
    },
    {
      id: 'mm-reversal-cost',
      title: 'One-Way vs Two-Way Doors (decision sizing)',
      flow: ['Decision arrives', 'Estimate reversal cost honestly', 'Two-way door? → decide fast, try it, learn', 'One-way door? → slow down: spike, ADR, seek dissent', 'Re-classify as information arrives'],
      explanation: [
        'Most architecture mistakes are process mistakes: agonizing over reversible choices (linter config, a library you can swap) while sleepwalking through irreversible ones (public API contracts, database choice, service boundaries, data models).',
        'Reversal cost — not importance — should set the decision\'s ceremony. Cheap-to-reverse: bias to action, smallest experiment. Expensive-to-reverse: prototype, write the ADR, actively recruit disagreement.',
        'Many one-way doors can be re-engineered into two-way doors: a facade in front of the new database, a versioned API, a feature flag — buying reversibility is often the highest-leverage architectural move available.',
      ],
      whatBreaksWithoutIt: 'Uniform decision-making: either everything gets a committee (velocity dies) or everything gets YOLO\'d (the irreversible mistakes compound for years).',
      interviewTip: 'Classify out loud: "this is a two-way door, I\'d just try it" vs "this is one-way, I\'d spike both options first". Interviewers hear calibrated judgment — the thing senior loops are designed to detect.',
    },
    {
      id: 'mm-conway-mirror',
      title: 'Conway\'s Mirror (architecture ↔ org structure)',
      flow: ['Team boundaries', 'Communication paths', 'System boundaries mirror them', 'Friction where boundaries disagree', 'Fix: move the boundary — in code OR in the org'],
      explanation: [
        'Architecture diagrams are org charts in disguise: modules owned by one team get clean interfaces; modules shared by three teams get merge conflicts, no owner, and decaying quality.',
        'Diagnose friction by overlaying the two maps: persistent integration pain usually means a system boundary crosses a team boundary. The fix is moving one of them — restructure the code (split the module along team lines) or the org (give it one owner).',
        'The inverse Conway maneuver designs the org to induce the architecture: want a design system? Fund a design-system team. Want independent checkout deploys? Give checkout to exactly one team first — the architecture follows.',
      ],
      whatBreaksWithoutIt: 'Architectures designed in a vacuum: technically elegant boundaries that require coordination patterns the org cannot sustain, shared-ownership zones rotting into no-ownership zones.',
      interviewTip: 'In any "how would you structure X" question, ask how many teams will work on it before answering. Tying structure to team topology — and citing Conway by name — reads staff-level.',
    },
    {
      id: 'mm-pipeline-gates',
      title: 'Pipeline as Progressive Risk Filters',
      flow: ['Commit: cheap fast checks (lint, types, unit)', 'Merge: integration + contracts', 'Artifact: build once, immutable', 'Staging: smoke the real thing', 'Canary: 5% of real traffic judges', 'Production: monitors keep judging forever'],
      explanation: [
        'Each gate is a filter sized to the risk it catches: cheap filters run constantly and catch most defects; expensive filters (canary on real traffic) run on survivors and catch what only production can reveal.',
        'The artifact is the invariant flowing through: built once, promoted unchanged — every gate accumulates evidence about the SAME bytes that will serve users.',
        'Production is just the last gate, not the finish line: monitors, alerts, and rollback are the pipeline continuing to run after deploy. "Done" means observed-healthy, not merged.',
      ],
      whatBreaksWithoutIt: 'Gates in the wrong order (slow E2E on every push) make CI a bottleneck; rebuilding per environment ships untested bytes; no canary means users are the canary.',
      interviewTip: 'Narrate pipelines in risk language ("this gate makes that class of bug unshippable") rather than tool names — tool lists read mid-level, risk reasoning reads senior.',
    },
  ],

  revision: [
    { id: 'r-layers', topic: 'Layered architecture', importance: 5, thirtySecond: 'Controller parses and maps HTTP; service holds business rules and transactions; repository owns data access. Dependencies point downward only, ideally through interfaces — that is what makes each layer testable and swappable.', twoMinute: 'Controllers: validation of shape, no business rules. Services: invariants, orchestration, transaction boundaries — know nothing of HTTP. Repositories: queries returning domain objects, not rows. Cross-cutting (auth, logging) in middleware. Failure modes: logic leaking into controllers or queries; pass-through layers that add nothing (collapse them until needed). Test story: service tests use fake repositories, fast and deterministic.', deepDive: 'The layer boundaries are change-isolation contracts: transport swap touches controllers, ORM swap touches repositories, rule changes touch services. Interfaces at the seams enable dependency inversion (service owns the repo interface in hexagonal style). Discuss where DTOs map to domain objects and why letting ORM entities flood upward couples everything to the schema.', followUps: ['Where do transactions live?', 'When is a service layer overkill?'] },
    { id: 'r-hexagonal', topic: 'Clean / hexagonal architecture', importance: 4, thirtySecond: 'Business logic at the center defines ports (interfaces); infrastructure implements them as adapters at the edges. Dependencies point inward only — the core compiles without framework, DB, or HTTP.', twoMinute: 'Hexagonal: driving adapters (HTTP, CLI) call the core; driven adapters (DB, queue) are called via core-owned interfaces. Clean architecture rings say the same: entities → use cases → adapters → frameworks, dependencies inward. Payoff: millisecond unit tests of all business logic with in-memory adapters; infrastructure swaps localized. Cost: mapping ceremony between models — for CRUD apps, do the pragmatic version (framework-free logic + injected I/O).', deepDive: 'The enabling mechanism is dependency inversion at the composition root. Frontend mapping: components = adapters, composables = use cases, API client behind an interface = driven adapter; the test "can I run this logic without mounting or network?" is the hexagonal question. Be ready to argue when it is over-engineering — that judgment is the senior part.', followUps: ['How does the core call the DB if it cannot import it?', 'Apply this to a Vue feature'] },
    { id: 'r-mono-micro', topic: 'Monolith vs microservices', importance: 5, thirtySecond: 'Microservices buy independent team deploys at the price of distributed-systems complexity (sagas, tracing, contract versioning, infra multiplication). Driver is team count, not traffic. Modular monolith is the default; extract one service when pain is real.', twoMinute: 'Monolith free wins: ACID everywhere, in-process calls, one deploy/debug surface, easy refactors. Services: per-team cadence, independent scaling, fault isolation IF designed. Worst outcome: distributed monolith — coupled services that deploy together. Heuristics: < ~20–30 engineers stay monolithic; extract for genuinely different runtime needs or chronic team blocking; never big-bang.', deepDive: 'Extraction sequence: enforce module boundaries first (the module IS the service candidate), add contract + tracing at the seam, strangler-style traffic shift. Data is the hard part: shared tables must split or get an owning service. Cite real-world monolith successes (Shopify, Stack Overflow) and that Amazon-scale splits were org-driven. PACELC of org design: you trade coordination cost vs autonomy cost.', followUps: ['What makes a distributed monolith?', 'First service to extract and why?'] },
    { id: 'r-event-driven', topic: 'Event-driven architecture', importance: 4, thirtySecond: 'Producers publish immutable facts ("OrderPlaced"); consumers subscribe independently — adding one touches no producer code. Costs: eventual consistency, idempotent consumers (at-least-once), and the outbox pattern for the dual-write problem.', twoMinute: 'Events vs commands: events = past facts, many subscribers, no expectations; commands = one handler, expected outcome. Decoupling is availability decoupling too — email service down does not block checkout. Dual-write trap: DB write + publish are two ops; outbox makes them one transaction with a relay. Schema evolution: additive only, version on breaking change. Correlation IDs for cross-consumer debugging.', deepDive: 'Choreography (services react to events) vs orchestration (a saga coordinator drives steps): choreography decouples but obscures the flow; orchestration centralizes visibility for complex multi-step business transactions with compensations. Replay/poison handling: DLQs, consumer offsets, idempotency by event ID. Know when sync is right: caller needs the answer to proceed.', followUps: ['Outbox pattern mechanics?', 'Choreography vs orchestration for checkout?'] },
    { id: 'r-cqrs', topic: 'CQRS', importance: 3, thirtySecond: 'Separate write model (normalized, enforces invariants) from read model (denormalized per-query projections), connected by events. Justified when read/write shapes or scale diverge hard; overkill for CRUD.', twoMinute: 'Writes go through command handlers enforcing business rules; events update projections that answer queries in one indexed read instead of N joins. Projections are eventually consistent — surface that to UX. CQRS ≠ event sourcing: you can project without storing events as truth. The interview skill is naming when NOT to use it.', deepDive: 'Projection rebuild is the operational superpower (new screen = new projection from the same events) and burden (versioning, backfill tooling). Read-your-own-writes over projections: synchronous projection for the author, or client-side optimistic merge. Event sourcing adds replayable truth + audit at the cost of schema-evolution discipline and snapshotting.', followUps: ['CQRS without event sourcing?', 'How stale may a projection be?'] },
    { id: 'r-frontend-arch', topic: 'Frontend project architecture', importance: 5, thirtySecond: 'Feature folders (components + composables + api + types per domain), shared design-system layer, lint-enforced rule: features never import each other. Components render; composables hold logic; the API layer is the only place fetch lives.', twoMinute: 'Smart/dumb split: containers wire stores/routing/data; presentational components are props-in/events-out — pure, reusable, testable, design-system material. Composables extract stateful logic reusably (the modern container). State by kind: server cache → query library; global client state → small per-domain stores; shareable → URL. Composition root wires router/stores/API client in one place.', deepDive: 'The structure is dependency management: feature isolation keeps refactors local, enables isolated mounting (tests, Storybook), maps ownership via CODEOWNERS, and keeps extraction (package/MFE) possible. Enforce with dependency-cruiser/eslint boundaries. God-store decomposition: classify state by kind first — most of it is server cache that should leave the store entirely.', followUps: ['Where does logic shared by two features live?', 'Defend smart/dumb in a hooks/composables world'] },
    { id: 'r-di', topic: 'Dependency injection & composition root', importance: 4, thirtySecond: 'Components receive dependencies instead of constructing them; they depend on interfaces, wiring happens once at the composition root. The payoff is testability (inject fakes) and swappable infrastructure.', twoMinute: 'Constructor injection is DI — containers just automate wiring. Inject what you will swap: I/O, time, randomness, config; not pure utilities. Service locator (reaching into a global registry) hides dependencies — avoid. Frontend: provide/inject, context, or factory functions serve the same inversion. Test story: new Service(fakeRepo, fakeClock) — no framework needed.', deepDive: 'The composition root is the one place allowed to know concrete types; everything else stays abstract. Lazy singletons vs transient scopes; cycle detection as the container failure mode. Injecting the clock is the classic interview example: "trial expires in 14 days" testable without time travel. Relate to hexagonal: ports are the interfaces DI fills.', followUps: ['DI vs service locator?', 'Why inject time?'] },
    { id: 'r-resilience', topic: 'Retries, backoff, circuit breakers', importance: 5, thirtySecond: 'Timeout every call; retry only idempotent ops with exponential backoff + jitter; circuit breakers fail fast on sustained failure and serve fallbacks; bulkheads isolate pools. Goal: degradation, never cascade.', twoMinute: 'Retry amplification: 3 retries × 3 layers = 27× load on the sick service — retry at one layer, cap with budgets. Jitter desynchronizes retry waves. Breaker states: closed (count failures) → open (fail fast + fallback) → half-open (probes) → closed. Timeouts budgeted end-to-end so inner calls cannot outlive the outer SLA. Load shedding: fast 429 beats slow timeout.', deepDive: 'Idempotency is the precondition making retries safe — keys for POSTs, natural idempotency for PUT/DELETE. Production breakers trip on failure rate over sliding windows, not consecutive counts, and emit state-change metrics. Client-side application: failing third-party SDKs get the same treatment (timeout, breaker, facade fallback). Game-day these paths; untested fallbacks fail when needed.', followUps: ['Why jitter?', 'Walk the breaker state machine'] },
    { id: 'r-idempotency', topic: 'Idempotency', importance: 5, thirtySecond: 'Same operation N times = same effect as once, making retries and at-least-once delivery safe. POSTs get client-generated idempotency keys; the server dedupes via unique constraint and replays the stored response.', twoMinute: 'HTTP contract: GET/PUT/DELETE idempotent, POST not. Key flow: client UUID per logical operation (generated at form load, not per click) → server atomically claims key → processes → stores response → duplicates get the stored response. Queue consumers: dedupe by event ID or design naturally idempotent updates (set vs increment).', deepDive: 'Races: unique constraint is the atomic claim; in-flight duplicates wait or 409. Key TTL ≥ client retry horizon. Scope keys per user+endpoint. "Exactly-once delivery" marketing = at-least-once + idempotent processing. Payments: pass your key through to the provider\'s idempotency mechanism so the whole chain dedupes.', followUps: ['Design double-click-safe order creation', 'Why is increment dangerous in consumers?'] },
    { id: 'r-gateway-bff', topic: 'API gateway & BFF', importance: 4, thirtySecond: 'Gateway = single entry point for edge policy (auth, rate limits, routing, TLS) — policy, never business logic. BFF = per-client aggregation API owned by the frontend team: one composed payload per screen instead of six chatty calls.', twoMinute: 'Gateway centralizes what every service would otherwise duplicate; it validates tokens once and forwards trusted identity. BFF solves over-fetching and round trips AND the org bottleneck (frontend owns its aggregation). One BFF per client type — a shared one recreates the general-purpose API. BFF needs resilience: per-downstream timeouts, partial responses, breakers.', deepDive: 'BFF vs GraphQL: same problem, different cost shape — N simple services vs one flexible platform. Auth pattern: browser ↔ BFF via httpOnly session cookie; BFF holds downstream tokens — JS never sees them. Gateway failure domain: it needs HA more than anything behind it. Service mesh handles service-to-service concerns; gateway handles edge.', followUps: ['BFF vs GraphQL decision factors?', 'What must NOT go in the gateway?'] },
    { id: 'r-twelve-factor', topic: '12-factor & deployability', importance: 3, thirtySecond: 'The factors that matter: config in env vars, stateless processes, build-once artifacts, logs to stdout, fast startup + graceful shutdown. Together they make instances disposable — the prerequisite for scaling and rolling deploys.', twoMinute: 'One artifact promoted across environments, config injected per env, secrets in a manager. State to backing services (sessions → Redis, files → object storage) so any node can die anytime. Graceful SIGTERM: stop accepting, drain in-flight, exit — rolling deploys depend on it. Dev/prod parity via containers. Most-violated factor: hidden process state.', deepDive: 'Modern extensions: health endpoints (liveness vs readiness — readiness gates traffic during startup/drain), migrations as release steps with expand-migrate-contract, immutable infrastructure. Serverless/edge bends some factors (no long-lived processes) while sharpening others (statelessness is enforced). Use it as a deployability checklist, not scripture.', followUps: ['Liveness vs readiness?', 'What breaks with in-process sessions?'] },
    { id: 'r-cicd', topic: 'CI/CD pipeline design', importance: 4, thirtySecond: 'Progressively expensive gates: lint/types/unit → integration → build once → staging smoke → canary with automated metric judgment → promote/rollback. Pipeline speed is a feature; flaky tests get zero tolerance.', twoMinute: 'Build-once-promote: the artifact you tested is the artifact you ship. Canary: 5% real traffic, compare error/latency to baseline, auto-rollback on regression — machines replace the war room. Feature flags decouple release from deploy. Frontend gates: bundle budgets, Lighthouse CI, preview deploys per PR. Migrations: expand-migrate-contract keeps rollback safe.', deepDive: 'DORA metrics frame maturity: deploy frequency, lead time, change-failure rate, MTTR — and the counterintuitive sell: smaller more frequent deploys LOWER failure rates (batch size is the risk). Monorepo CI: affected-only test selection + remote caching. Every gate should map to a bug class it makes unshippable; audit gates that never fire.', followUps: ['Why does deploy frequency reduce risk?', 'Design the rollback story for a schema change'] },
    { id: 'r-debt-adr', topic: 'Tech debt & ADRs', importance: 4, thirtySecond: 'Manage debt economically: make the interest visible (cycle time, incident causes), pay continuously (boy-scout + capacity slice), argue in product language. Record contested decisions as ADRs: context, decision, alternatives, consequences — superseded, never edited.', twoMinute: 'Debt classes: deliberate (documented shortcut for a window — legitimate) vs accidental (entropy). Prioritize by interest rate: debt in weekly-touched code first. Negotiation: evidence ("3 of 5 incidents, 3× cycle time") + scoped options, never "rewrite quarter". ADRs make decisions reviewable years later and convert relitigation into "supersede with new evidence".', deepDive: 'Debt register tagged from postmortems and estimates builds the case passively. Rewrites are justified ~when the platform itself is EOL or the domain changed beyond the model — otherwise strangler. ADR discipline: one page, honest consequences section, dissent recorded with falsifiers — this is what makes disagree-and-commit real rather than rhetorical.', followUps: ['Convince a PM to fund paydown', 'What goes in an ADR consequences section?'] },
    { id: 'r-senior-mode', topic: 'Senior engineer behaviors (tradeoffs, ownership, mentoring)', importance: 5, thirtySecond: 'Senior = judgment made legible: explicit tradeoff criteria, reversal-cost-sized decisions, disagree-and-commit with recorded falsifiers, incidents owned through prevention, juniors grown through early design feedback and pairing — not review-comment volume.', twoMinute: 'Tradeoff articulation: name the tension, the deciding criterion, the cost accepted, and what would change your mind. Ownership: the class of problem dies, not the instance — postmortems end in shipped prevention. Mentoring: move feedback earlier (design chat beats 40 comments), criteria over taste, pair to transfer reasoning, escalate cleanly when support fails. Influence: steelman first, bring data, propose the cheaper experiment.', deepDive: 'Interview scoring rubrics for senior loops look for: calibrated confidence (saying "I don\'t know, here\'s how I\'d find out"), systems framing of people problems (feedback timing, missing standards — not "bad engineer"), decision hygiene under ambiguity, and evidence of changing your own mind. Prepare 3–4 stories covering: a contested decision, an incident, a mentoring arc, a debt negotiation — each with measured outcomes.', followUps: ['Tell me about being wrong', 'How do you raise the bar on a team without authority?'] },
  ],
}

export default architecture
