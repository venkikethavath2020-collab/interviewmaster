import type { Technology } from '../../types/content'

const designPatterns: Technology = {
  id: 'design-patterns',
  name: 'Design Patterns',
  icon: 'DP',
  color: '#db2777',
  tagline: 'Reusable solution vocabulary — GoF classics, SOLID, and the patterns JavaScript actually uses daily.',
  category: 'design',

  overview: {
    what: 'Design patterns are named, reusable solutions to recurring structural problems in code: how objects get created (Factory, Builder, Singleton), how they compose (Adapter, Decorator, Facade, Proxy, Composite), and how they communicate (Observer, Strategy, Command, Iterator). In JavaScript many patterns are lighter than their classical forms — closures replace classes, functions replace strategy objects, and the language itself ships pattern implementations (Proxy, generators, modules).',
    why: 'Patterns are a compression format for design conversations: "make it a strategy" transmits a whole refactoring in three words. Interviews use them to test whether you recognize problems by shape, can implement the mechanics, and — the senior part — know when a pattern is overkill. Frameworks are pattern showcases: Vue reactivity IS Proxy + Observer; middleware IS Chain of Responsibility; hooks/composables ARE factory functions over closures.',
    problemsSolved: [
      'Shared vocabulary: teams debate "observer vs polling" instead of re-explaining mechanisms from scratch',
      'Proven shapes for change: patterns isolate what varies (strategies, decorators) so requirements changes touch one place',
      'Framework literacy: recognizing patterns inside Vue/React/Express turns magic into mechanics you can debug',
    ],
    whenToUse: [
      'When you can name the variability: multiple interchangeable algorithms (Strategy), incompatible interfaces (Adapter), behavior layering (Decorator)',
      'When refactoring duplication that differs only in one dimension — the pattern names the dimension',
      'In interviews: implementing emitters, memoize, middleware pipelines, and explaining framework internals all reduce to patterns',
    ],
    whenNotToUse: [
      'Before the second use case exists — premature abstraction is the most expensive anti-pattern; duplication is cheaper than the wrong abstraction',
      'When the language already does it: JS modules ARE singletons; first-class functions make many classical patterns one-liners — do not build class ceremonies around them',
      'As resume decoration: forcing AbstractFactoryBuilder into a 200-line app signals pattern fetishism, not seniority',
    ],
  },

  internals: [
    {
      id: 'pattern-taxonomy',
      title: 'The Pattern Taxonomy: Creational, Structural, Behavioral',
      summary: 'The GoF catalog groups patterns by the problem dimension they address: object creation, object composition, or object communication. Knowing the taxonomy lets you locate an unfamiliar problem on the map.',
      details: [
        'Creational patterns abstract the `new` away: Factory (one method decides the concrete type), Builder (step-by-step construction of complex objects), Singleton (exactly one instance), Prototype (clone an exemplar — JS literally has this built into its object model).',
        'Structural patterns compose objects into larger structures: Adapter (translate an interface), Decorator (layer behavior without subclassing), Facade (one simple API over a messy subsystem), Proxy (stand-in controlling access), Composite (tree where leaves and groups share an interface).',
        'Behavioral patterns organize communication and responsibility: Observer (notify subscribers of changes), Strategy (swap algorithms behind one interface), Command (reify an action as an object — enables undo/queueing), Iterator (sequential access without exposing internals), Chain of Responsibility (pass a request along handlers — middleware).',
        'JavaScript shifts the catalog: closures + first-class functions shrink Strategy/Command to "pass a function"; the module system makes Singleton a default; Proxy and generators (Iterator) are language features. The classical class diagrams are the explanation, not the implementation.',
        'Interview strategy: when asked "what patterns do you know", organize by category and immediately attach a real usage to each — "Observer: every event emitter and Vue\'s reactivity; Strategy: validation rules; Facade: every SDK wrapper I have written". Lists without usage read as memorization.',
        'The map also reveals gaps: state machines (State pattern) for UI flows, Mediator for decoupling chatty components — patterns most frontend codebases need but rarely name.',
      ],
      diagram: ['Problem appears', 'Creation problem? → Factory / Builder / Singleton', 'Composition problem? → Adapter / Decorator / Facade / Proxy / Composite', 'Communication problem? → Observer / Strategy / Command / Iterator / Chain', 'Always ask: does the language already solve this?'],
    },
    {
      id: 'observer-vs-pubsub',
      title: 'Observer vs Pub-Sub — the Distinction Interviewers Probe',
      summary: 'Observer: subjects know their observers and notify them directly (tight, synchronous, two roles). Pub-Sub: a broker sits between publishers and subscribers who never know each other (loose, often async, three roles).',
      details: [
        'Observer: the subject holds a list of observer references and calls them on change — subject.subscribe(observer); subject.notify(). Coupling is direct: the subject knows "someone is listening" and holds the references (which is also the memory-leak vector: forgotten observers keep objects alive).',
        'Pub-Sub: publishers emit named events to a broker (event bus/channel); subscribers register with the broker. Publisher and subscriber share only the event name + payload contract — they can live in different modules, processes, or machines (message queues are pub-sub at infrastructure scale).',
        'The practical consequences of the difference: Observer is synchronous and ordered by default (DOM events, Vue watchers), easy to trace but coupled; Pub-Sub decouples lifecycles and enables async/cross-boundary delivery, but flows become hard to trace — "who handles checkout:complete?" requires a global search.',
        'DOM addEventListener is observer-style (you subscribe to a specific element/subject); a global event bus or postMessage or Kafka is pub-sub (you subscribe to topics, not objects).',
        'Vue reactivity is observer at the property level: effects (computed, watchers, component renders) register as dependents of the specific reactive properties they read; mutating a property notifies exactly those dependents. Fine-grained observer is why Vue re-renders surgically.',
        'The unsubscribe discipline applies to both: every subscription needs a teardown path (unsubscribe function, AbortController, framework unmount hooks) or you leak — the most common production bug in event-heavy code.',
      ],
      diagram: ['Observer: Subject → holds refs → notifies Observers directly', 'Pub-Sub: Publisher → emits to Broker', 'Broker matches topic → delivers to Subscribers', 'Publisher and Subscriber never reference each other', 'Tradeoff: traceability (observer) vs decoupling (pub-sub)'],
    },
    {
      id: 'proxy-vue-reactivity',
      title: 'Proxy — and Vue Reactivity as the Real-World Example',
      summary: 'A Proxy wraps a target and intercepts operations on it (get, set, has, delete) through traps. Vue 3 reactivity is a production Proxy system: reads record dependencies, writes trigger the recorded effects.',
      details: [
        'new Proxy(target, handler): the handler\'s traps intercept fundamental operations — get(target, key), set(target, key, value), has (the `in` operator), deleteProperty, apply (function calls), construct (new). Anything not trapped passes through to the target (Reflect.* gives the default behavior inside traps).',
        'Classical proxy use cases: lazy initialization (virtual proxy — create the expensive object on first access), access control (protection proxy — validate or deny operations), remote proxy (local object forwarding to a remote service), logging/metrics instrumentation without touching the target.',
        'Vue 3\'s reactive(): wraps your object in a Proxy. The get trap calls track(target, key) — recording which effect (component render, computed, watcher) is currently running as a dependent of that exact property. The set trap calls trigger(target, key) — re-running exactly the effects that depend on that property. This is Observer implemented through Proxy traps.',
        'Why Vue 2 needed Object.defineProperty per-property (and could not detect added properties or index assignment) while Proxy traps the whole object including future keys, deletes, and `in` checks — the concrete reason Vue 3 rewrote reactivity.',
        'Proxy gotchas worth citing: identity (proxy !== target — Vue maintains a WeakMap of target → proxy so reactive() is idempotent), nested objects are wrapped lazily on access (performance), and traps add overhead — hot loops over reactive arrays can be measurably slower than raw data (toRaw exists for this).',
        'Other real proxies you already use: ORM lazy relations, API client SDKs that turn property access into HTTP calls, immer\'s draft objects (copy-on-write through traps), and module mocking in test frameworks.',
      ],
      diagram: ['const state = reactive({ count: 0 }) → Proxy created', 'Effect runs (component render) reads state.count', 'get trap → track(state, "count") records the effect', 'state.count++ → set trap fires', 'trigger(state, "count") → re-run exactly the tracked effects', 'Surgical re-render — no diffing of untouched state'],
      code: {
        lang: 'ts',
        code: `// Minimal reactivity core — the shape of Vue 3 in 25 lines
type Effect = () => void
let activeEffect: Effect | null = null
const deps = new WeakMap<object, Map<PropertyKey, Set<Effect>>>()

function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(t, key, receiver) {
      if (activeEffect) {
        if (!deps.has(t)) deps.set(t, new Map())
        const keyMap = deps.get(t)!
        if (!keyMap.has(key)) keyMap.set(key, new Set())
        keyMap.get(key)!.add(activeEffect) // track
      }
      return Reflect.get(t, key, receiver)
    },
    set(t, key, value, receiver) {
      const ok = Reflect.set(t, key, value, receiver)
      deps.get(t)?.get(key)?.forEach((fn) => fn()) // trigger
      return ok
    },
  })
}

function effect(fn: Effect): void {
  activeEffect = fn
  fn() // first run registers dependencies via the get trap
  activeEffect = null
}`,
        caption: 'Reads during an active effect register dependencies; writes re-run exactly those effects.',
      },
    },
    {
      id: 'module-pattern',
      title: 'Module & Revealing Module Pattern',
      summary: 'Closures as encapsulation: an IIFE (or today, an ES module) creates private state and returns a public API. The pattern that gave JavaScript privacy before classes had # fields — and still the shape of every composable.',
      details: [
        'Classic form: an IIFE declares private variables and functions in its scope, then returns an object exposing only the public surface. Nothing outside can touch the privates — the closure is the access control.',
        'Revealing module variant: define everything as named functions first, then return an object mapping public names to them — the return statement becomes a readable table of contents of the API.',
        'ES modules made the IIFE wrapper obsolete for files: top-level module scope is already private; export IS the public API. Every ES module is a singleton instance of the module pattern (evaluated once, cached by the module registry).',
        'But the pattern itself never died — it moved: every factory function returning an API over closed-over state is the module pattern. Vue composables (useCart() returning { items, add, remove } over private refs), React custom hooks, and store factories are all module pattern instances.',
        'Versus classes: closures give true privacy (pre-#-fields), no `this` binding hazards, and simple composition; classes give prototypes (memory sharing across many instances), instanceof, and clearer hierarchies. For one-off services and composables, closures win; for thousands of instances, prototype methods win on memory.',
        'Interview angle: implement a counter/store with private state, explain WHERE the privacy comes from (the closure keeps variables alive but unreachable), and connect it to module-singleton semantics — imports share one instance, which is both convenient and a hidden-global hazard for testability.',
      ],
      code: {
        lang: 'ts',
        code: `// Revealing module as a factory — the shape of every composable
function createCart() {
  const items: { sku: string; qty: number }[] = [] // private

  function add(sku: string, qty = 1): void {
    const existing = items.find((i) => i.sku === sku)
    existing ? (existing.qty += qty) : items.push({ sku, qty })
  }
  function total(): number {
    return items.reduce((sum, i) => sum + i.qty, 0)
  }

  return { add, total } // public surface — items is unreachable
}

const cart = createCart()
cart.add('A1')
cart.total() // 1
// cart.items → undefined: privacy via closure, no class needed`,
      },
    },
    {
      id: 'middleware-chain',
      title: 'Middleware / Chain of Responsibility',
      summary: 'A request flows through an ordered chain of handlers; each can act, short-circuit, or pass control onward. Express, Koa, Redux, axios interceptors, and fetch wrappers are all this one pattern.',
      details: [
        'Chain of Responsibility classically: handlers linked in sequence, each deciding "handle it, or pass to next". Middleware is its mainstream form: handler(context, next) where calling next() continues the chain and not calling it short-circuits (auth middleware rejecting a request).',
        'The onion model (Koa-style): code before await next() runs on the way IN, code after runs on the way OUT — giving every middleware a chance to wrap the entire downstream (timing middleware measures the full pipeline; error middleware try/catches everything below it).',
        'Composition mechanics: compose([f1, f2, f3]) builds a single function where each middleware receives a next that invokes the following one. Implemented with reduceRight or recursion — a favorite coding question because it tests closures + recursion + async at once.',
        'Where you already use it: Express/Koa request handling, Redux middleware (action pipeline), axios request/response interceptors, GraphQL resolver middleware, router navigation guards (Vue Router\'s beforeEach chain), and CI pipelines conceptually.',
        'Design properties: open/closed compliance (add cross-cutting behavior — logging, auth, retries — without touching handlers), explicit ordering (auth before rate limiting before business logic, and order bugs are real), and per-request context as the shared data channel.',
        'Failure modes: middleware that forgets to call next() (silent hangs), double-calling next (corrupted flow — production compose functions guard against it), and unbounded context mutation turning the context object into a god object.',
      ],
      diagram: ['Request enters pipeline', 'Middleware 1: before → next()', 'Middleware 2: auth — reject (short-circuit) or next()', 'Handler: business logic', 'Middleware 2: after (response path)', 'Middleware 1: after — timing/logging of full round trip'],
    },
    {
      id: 'solid-in-js',
      title: 'SOLID Principles in JavaScript Terms',
      summary: 'Five principles about managing change and dependencies. In JS they apply to modules and functions as much as classes — each has a concrete frontend translation.',
      details: [
        'S — Single Responsibility: one module, one reason to change. The 500-line component fetching, transforming, validating, and rendering has four reasons — split into API function, composable, validator, presentational component. Test smell: describing a module requires "and".',
        'O — Open/Closed: open for extension, closed for modification. Adding a new notification channel should mean ADDING a strategy/handler, not editing a growing switch statement. Plugin systems, strategy maps, and middleware exist to satisfy this.',
        'L — Liskov Substitution: a subtype must honor the contract of its base — anywhere the base works, the subtype works without surprises. JS translation: anything claiming to be array-like/thenable/iterable must actually behave like one. Classic violation: a ReadOnlyCollection extending Collection but throwing on add() — callers holding a Collection break.',
        'I — Interface Segregation: depend on narrow interfaces, not fat ones. A function needing a logger should accept { log }, not the entire application context. In TS: prefer small structural types and Pick<> over passing god objects; components should take the 3 props they use, not a 30-field entity.',
        'D — Dependency Inversion: high-level policy must not depend on low-level detail; both depend on abstractions. The composable depends on an ApiClient interface, not on axios; the service receives its repository. This is the principle DI (the mechanism) serves.',
        'Senior framing: SOLID is not class dogma — it is "isolate what changes, depend on contracts". Over-applying it (interfaces for everything, single-use abstractions) violates YAGNI; the judgment is applying each principle where change pressure is real.',
      ],
      diagram: ['S: one reason to change per module', 'O: extend by adding, not editing', 'L: subtypes honor the base contract', 'I: many narrow contracts > one fat one', 'D: depend on abstractions, wire details at the edge'],
    },
    {
      id: 'frontend-patterns',
      title: 'Frontend-Specific Patterns',
      summary: 'Container/presentational, slots/render props, plugin pattern, and provider/injection — the compositions modern frameworks are built from.',
      details: [
        'Container/presentational: containers fetch data and hold state; presentational components are pure props-in/events-out. Modern form: composables/hooks extract the container LOGIC, so the wrapper-component version is mostly legacy — but the underlying separation (logic vs rendering) remains the testability backbone.',
        'Render props / slots: inversion of rendering control — a component owns behavior (fetching, virtualization, dropdown state machine) but delegates what to RENDER to its consumer via scoped slots (Vue) or render props (React). This is Strategy applied to markup; it is how headless UI libraries deliver behavior without dictating appearance.',
        'Plugin pattern: a host exposes a registration contract and lifecycle hooks; plugins extend without modifying the host (Open/Closed at architecture scale). Vue plugins (app.use), Vite/Rollup plugins (named hook functions), ESLint rules — all the same shape: register, get called at hook points, contribute behavior.',
        'Provider/dependency injection: provide/inject (Vue) and context (React) implement DI through the component tree — ancestors provide implementations, descendants consume the contract without prop drilling. The same inversion as backend DI: the composition root is the app/plugin setup.',
        'Higher-order functions everywhere: debounce/throttle/memoize/once are Decorator applied to functions; withRetry(fetchFn) wraps behavior around a core — recognizing HOFs as decorators connects daily JS to the catalog.',
        'State machines for UI: explicit states (idle/loading/success/error) and transitions kill the boolean-soup bug class (isLoading && isError combinations that should be impossible). The State pattern formalized; XState industrializes it.',
      ],
    },
  ],

  keywords: [
    {
      id: 'singleton',
      term: 'Singleton',
      importance: 4,
      whyAsked: 'A classic with a twist interviewers love: implement it, then explain why globally shared instances are usually a design smell better served by DI.',
      explanation: 'Guarantee one instance with global access: a class caching its instance in a static field with a private constructor, or — idiomatically in JS — a module exporting an instance (modules are evaluated once and cached, so every importer shares it). The problems: it is a global (hidden coupling — nothing in a function\'s signature reveals it uses the singleton), it makes tests order-dependent (shared mutable state persists between tests), and it hard-codes the single-instance decision everywhere it is imported.',
      realWorldExample: 'Legitimate singletons: an app-wide config object, a connection pool, a Pinia store instance. The fix for testability is injection: construct once at the composition root and PASS it — the lifetime stays single, the coupling becomes explicit.',
      commonMistakes: [
        'Implementing the lazy-getInstance class in JS without mentioning that module scope already gives you singletons for free',
        'Defending singletons as "convenient" without acknowledging the test-isolation cost',
        'Missing the distinction: single INSTANCE is often right; global ACCESS is the problematic half',
      ],
      followUps: ['Why are singletons hard to test and how does DI fix it?', 'How do ES modules give singleton semantics?', 'When is a singleton genuinely correct?'],
    },
    {
      id: 'factory',
      term: 'Factory',
      importance: 4,
      whyAsked: 'Tests whether you can centralize creation logic so consumers depend on an interface, not concrete classes — the gateway drug to dependency inversion.',
      explanation: 'A function/method that decides which concrete object to create and returns it behind a common interface: createNotifier(channel) returns an EmailNotifier, SmsNotifier, or PushNotifier, all satisfying Notifier. Consumers call notifier.send() without knowing the concrete type. Adding a channel touches the factory only — Open/Closed for creation. In JS, factory functions also double as the class-free way to create objects with private state (closures).',
      realWorldExample: 'Vue\'s h() and defineComponent, axios.create(config) producing configured instances, test data builders (makeUser(overrides)), and per-environment client factories (mock API client in tests, real one in prod).',
      commonMistakes: ['Conflating simple factory (one function with a switch) with Abstract Factory (a family of related factories) — name which one you mean', 'Building factories for a single concrete type "for flexibility" — YAGNI', 'Returning different SHAPES from one factory (violates the common-interface point)'],
      followUps: ['Factory vs constructor — what does the indirection buy?', 'Show a factory closing over private state', 'Where does the switch-on-type live when you add channel #7?'],
    },
    {
      id: 'builder',
      term: 'Builder',
      importance: 3,
      whyAsked: 'The pattern behind every fluent API — interviewers check you know WHEN it beats an options object (rarely in JS) and can implement chainability.',
      explanation: 'Construct complex objects step by step via a fluent interface: new QueryBuilder().where(...).orderBy(...).limit(10).build(). Each method returns this (or a new immutable builder), and build() validates and produces the final object. Solves the telescoping-constructor problem (constructors with 8 positional args). In JS, a single options object with defaults covers most cases — Builder earns its place when construction is multi-step, order-sensitive, validated, or when intermediate states are reused (a base query forked into variants).',
      realWorldExample: 'Knex/Prisma query builders, fetch wrapper builders, test-data builders (aUser().admin().withOrders(3).build()) — the test-data use is the one most teams actually need.',
      commonMistakes: ['Using Builder where { ...defaults, ...options } suffices — ceremony without benefit', 'Mutable builders shared across tests causing cross-contamination (immutable forks fix it)', 'Forgetting validation in build() — the whole point is producing only valid objects'],
      followUps: ['Builder vs options object in JS — when each?', 'Make the builder immutable — what changes?', 'How do test-data builders reduce test brittleness?'],
    },
    {
      id: 'observer',
      term: 'Observer',
      importance: 5,
      whyAsked: 'The most load-bearing pattern in frontend: events, reactivity, watchers, stores. Implementing an emitter and distinguishing it from pub-sub is near-guaranteed in interviews.',
      explanation: 'A subject maintains a list of observers and notifies them on state change — one-to-many dependency without the subject knowing observer details beyond the callback contract. Push (subject sends the data) vs pull (observers query after notification) variants. The leak vector: the SUBJECT holds the references, so a long-lived subject keeps short-lived observers (and everything they capture) alive — unsubscribe is not optional.',
      realWorldExample: 'DOM events, Vue watchers and computed (property-level observers), store subscriptions, MutationObserver/IntersectionObserver/ResizeObserver (the platform names them honestly), RxJS Observables (observer pattern industrialized with operators).',
      commonMistakes: ['Using Observer and Pub-Sub as synonyms — the broker and the coupling differ (see the comparison)', 'No teardown story: every subscribe needs an unsubscribe path tied to lifecycle', 'Notifying synchronously during inconsistent intermediate state (batch/defer notifications — why frameworks flush watchers on microtasks)'],
      followUps: ['Observer vs pub-sub?', 'Implement on/off/once/emit', 'Why does Vue flush watcher callbacks asynchronously?'],
      diagram: ['Subject state changes', 'notify() iterates observer list', 'Each observer callback runs with new state', 'Observer unsubscribes → removed from list', 'Forgotten unsubscribe → leak (subject pins observer)'],
    },
    {
      id: 'strategy',
      term: 'Strategy',
      importance: 5,
      whyAsked: 'The pattern interviewers reach for when your code review sample has a growing if/else chain — can you isolate interchangeable algorithms behind one contract?',
      explanation: 'Define a family of interchangeable algorithms behind one interface and select at runtime: sorting comparators, pricing rules, validation rules, retry policies, payment providers. In JS the "interface" is usually just a function signature and the registry is an object map: strategies[type](input). Replaces switch/if-chains that would otherwise be edited for every new case (Open/Closed), and each strategy unit-tests in isolation.',
      realWorldExample: 'Array.prototype.sort(comparator) — the comparator IS a strategy; form validation maps field → rule functions; shipping cost calculators per carrier; auth providers (OAuth/SAML/password) behind one authenticate() contract.',
      commonMistakes: ['Strategy objects with one method in JS — just use functions', 'A "strategy" that still switches on type internally (the smell moved, not died)', 'Premature strategies for a single algorithm — wait for the second real case'],
      followUps: ['Refactor a shipping-cost switch into strategies', 'Strategy vs Command — what differs? (Strategy = how, chosen by caller; Command = what + when, often queued/undone)', 'Where does the strategy-selection mapping live?'],
    },
    {
      id: 'decorator',
      term: 'Decorator',
      importance: 4,
      whyAsked: 'Tests composition-over-inheritance instincts: layering behavior without subclass explosions — and in JS it explains every higher-order function you use.',
      explanation: 'Wrap an object/function with another exposing the SAME interface while adding behavior before/after delegating: withLogging(withRetry(withCache(fetchUser))). Because wrapper and wrapped share the interface, decorators stack in any combination — versus inheritance, where CachedRetryingLoggingFetcher × every combination explodes. In JS, higher-order functions are decorators: debounce, throttle, memoize, once all take a function and return an enhanced same-signature function.',
      realWorldExample: 'Axios interceptors decorating requests; connect/HOCs in React history; TS/ES decorators (@Cached) as syntax for the same idea; middleware is decorator applied in a chain.',
      commonMistakes: ['Confusing with Adapter: Decorator keeps the interface and adds behavior; Adapter CHANGES the interface', 'Breaking the contract in the wrapper (different return shape) — then it is not a decorator', 'Deep decorator stacks with hidden ordering dependencies (cache-then-retry ≠ retry-then-cache — be able to say why)'],
      followUps: ['Implement memoize/once as decorators', 'Decorator vs inheritance for cross-cutting behavior?', 'Does order matter in withCache(withRetry(fn)) vs withRetry(withCache(fn))?'],
    },
    {
      id: 'adapter-facade',
      term: 'Adapter & Facade',
      importance: 4,
      whyAsked: 'The two patterns every integration task uses; interviewers check you can articulate the difference (translate an interface vs simplify a subsystem) and the anti-corruption payoff.',
      explanation: 'Adapter: translate one interface into another a client expects — wrap the new analytics SDK so it exposes the same track(event) your 200 call sites already use. Facade: one simplified API over a complex subsystem — a payments facade hiding tokenization + 3DS + retries behind pay(order). Both isolate change: third-party APIs, SDK migrations, and legacy systems get wrapped once, and churn stays inside the wrapper (anti-corruption layer in DDD terms).',
      realWorldExample: 'A storage adapter exposing get/set over localStorage today and IndexedDB tomorrow; fetch wrapped to present an axios-like API during a migration; every SDK wrapper module your team writes around Stripe/analytics IS a facade.',
      commonMistakes: ['Calling any wrapper an adapter — adapter matches an EXISTING expected interface; facade DESIGNS a new simpler one', 'Letting vendor types leak through the wrapper (the isolation evaporates)', 'Facades that grow business logic — they should simplify access, not own rules'],
      followUps: ['Adapter vs Facade vs Proxy in one sentence each', 'Design the adapter strategy for swapping analytics vendors with zero call-site changes', 'What is an anti-corruption layer?'],
    },
    {
      id: 'proxy-pattern',
      term: 'Proxy',
      importance: 4,
      whyAsked: 'Doubly valuable: a GoF pattern AND a JS language feature powering Vue reactivity — explaining track/trigger through Proxy traps is a high-signal frontend answer.',
      explanation: 'A stand-in with the same interface that controls access to the target: lazy initialization (virtual proxy), permissions (protection proxy), remote access, caching, instrumentation. JS reifies it: new Proxy(target, { get, set, has, deleteProperty, apply }) intercepts fundamental operations. Vue 3\'s reactive() is a Proxy whose get trap tracks the running effect as a dependent and whose set trap triggers exactly those effects — fine-grained Observer wired through language-level interception.',
      realWorldExample: 'Vue reactivity; immer drafts (copy-on-write via traps); ORM lazy-loading relations; test mocks intercepting any method; API objects where client.users.get(1) builds an HTTP call from the property path.',
      commonMistakes: ['Forgetting proxy !== target identity (and why Vue keeps a target→proxy WeakMap)', 'Not knowing why Proxy beats Object.defineProperty (whole-object traps: added keys, deletes, indices — the Vue 2 → 3 reason)', 'Ignoring trap overhead in hot paths (toRaw escape hatch)'],
      followUps: ['Sketch reactive() with track/trigger', 'Proxy vs Decorator — both wrap; what differs? (proxy controls ACCESS, same behavior; decorator ADDS behavior)', 'What can a Proxy intercept that defineProperty cannot?'],
    },
    {
      id: 'command-iterator',
      term: 'Command & Iterator/Generators',
      importance: 3,
      whyAsked: 'Command is THE undo/redo answer; generators are the JS-native Iterator — both come up in editor-like UI questions and lazy-data questions.',
      explanation: 'Command: reify an action as an object carrying execute() and undo() — enabling history stacks (undo/redo), queueing, batching, and replay. The requester is decoupled from the executor. Iterator: sequential access without exposing the container; JS builds it in — Symbol.iterator powers for...of/spread, and generators (function*) write iterators as resumable functions, including lazy/infinite sequences and async iteration (for await...of) for paginated APIs.',
      realWorldExample: 'Every editor\'s undo stack is Command; transactional UI batches commands. Generators: paging through an API as one clean async iterable, lazy processing of large datasets, and (historically) the mechanism behind async/await transpilation.',
      commonMistakes: ['Undo as state snapshots when memory matters — command-based inverse operations scale better (and know when snapshots ARE fine)', 'Forgetting generators are lazy — nothing runs until .next()', 'Writing manual iterator objects where a generator is three lines'],
      followUps: ['Implement undo/redo with command stacks', 'Write an async generator that pages an API', 'Command vs Strategy?'],
    },
    {
      id: 'composite',
      term: 'Composite',
      importance: 3,
      whyAsked: 'The tree pattern — interviewers use it to test uniform treatment of leaves and groups, and it secretly describes the component tree you work in daily.',
      explanation: 'Compose objects into trees where individual items (leaves) and groups (composites) share one interface, so clients treat them uniformly: folder.getSize() recursing over files and subfolders identically. The component tree IS a composite (render() on a leaf button or a page subtree — same contract); so are menu trees, comment threads, org charts, and form groups validating their children recursively.',
      realWorldExample: 'A nested checklist where complete() on a group completes descendants; drag-and-drop canvases grouping shapes (move a group = move all children); rule engines with AND/OR composite conditions over leaf predicates.',
      commonMistakes: ['Different interfaces for leaf vs group, forcing instanceof checks everywhere (the pattern\'s whole point is avoiding that)', 'Unbounded recursion without cycle guards when the "tree" can contain references', 'Reaching for Composite when a flat array + parentId does the job'],
      followUps: ['Model a file system with shared getSize()', 'Where is Composite in a UI framework?', 'Iterative vs recursive traversal tradeoffs?'],
    },
    {
      id: 'solid-keyword',
      term: 'SOLID',
      importance: 5,
      whyAsked: 'The standard senior screen: not whether you can recite five names, but whether each maps to a concrete refactoring you have actually done.',
      explanation: 'Single Responsibility (one reason to change — split the do-everything component), Open/Closed (add strategies/plugins instead of editing switches), Liskov (subtypes honor base contracts — no read-only collection that throws on add), Interface Segregation (narrow contracts — take { log }, not the app context; 3 props, not a 30-field object), Dependency Inversion (logic depends on abstractions; concrete I/O wired at the composition root). Unifying thread: isolate what changes, depend on contracts.',
      realWorldExample: 'A notification module: each channel a strategy (O), each channel module single-purpose (S), all satisfying one Notifier contract honestly (L), consumers depending on send() only (I), with channels injected at setup (D) — one feature exercising all five.',
      commonMistakes: ['Reciting definitions with no JS example — instant mid-level signal', 'Treating SOLID as class-only (modules and functions obey the same forces)', 'Over-applying: interfaces and abstractions for code with zero change pressure violates YAGNI — say so'],
      followUps: ['Give a Liskov violation you have seen in real code', 'Which SOLID principle does DI serve?', 'When is violating SRP fine?'],
    },
    {
      id: 'dry-kiss-yagni',
      term: 'DRY / KISS / YAGNI',
      importance: 4,
      whyAsked: 'These resolve the pattern-overuse tension — interviewers probe whether you know DRY\'s limits and can defend deleting speculative flexibility.',
      explanation: 'DRY: every piece of KNOWLEDGE has one authoritative home — about meaning, not text; two identical-looking snippets serving different business rules are NOT duplication, and merging them couples things that change independently. KISS: the simplest design meeting actual requirements wins — complexity must be paid for by need. YAGNI: do not build for hypothetical futures; speculative generality is debt with no interest payments coming. Together they gate patterns: abstract on the second or third real occurrence, not the first imagined one.',
      realWorldExample: 'The "wrong abstraction" arc: two similar functions get merged, then a third case adds a flag, then a fourth adds two more — the shared function becomes a config-driven monster. Sandi Metz\'s rule: prefer duplication over the wrong abstraction; inline it back and let the real shape emerge.',
      commonMistakes: ['DRYing coincidental similarity (same shape, different reasons to change)', 'Using YAGNI to dodge legitimate design (error handling and a11y are not speculative)', 'KISS as an excuse for no structure in code with real, present complexity'],
      followUps: ['When is duplication the right call?', 'Tell me about an abstraction you removed', 'How do you decide the moment to abstract?'],
    },
    {
      id: 'anti-patterns',
      term: 'Anti-Patterns (God Object, Spaghetti, Premature Abstraction)',
      importance: 4,
      whyAsked: 'Recognizing decay by name — and knowing the incremental cure — is more useful day-to-day than reciting GoF; interviewers probe it through "what is wrong with this code" prompts.',
      explanation: 'God object: one class/store/component that knows and does everything — every change routes through it, merge conflicts concentrate, tests need the world; cure by extracting responsibilities behind interfaces, strangler-style. Spaghetti: control flow with no layering — everything calls everything, effects at a distance; cure with boundaries and one-way dependencies. Premature abstraction: generic frameworks built before two real use cases exist — the flexibility never fits the future that actually arrives; cure by inlining back (Metz: duplication beats the wrong abstraction). Honorable mentions: golden hammer (one tool for everything), lava flow (dead code nobody dares delete), cargo culting (big-tech patterns without big-tech problems).',
      realWorldExample: 'The 3,000-line "AppStore" holding auth+cart+UI flags imported by 200 files (god object); a "flexible" form framework with 40 config options used by exactly one form (premature abstraction).',
      commonMistakes: ['Naming anti-patterns without the incremental cure (rewrites are usually the wrong answer)', 'Calling all big files god objects — size is a smell, centralized UNRELATED responsibility is the disease', 'Forgetting the social layer: god objects grow because they are the path of least resistance — fix the incentive (ownership, lint ratchets), not just the file'],
      followUps: ['How do you dismantle a god store without a freeze?', 'What makes an abstraction "wrong"?', 'Which anti-pattern have you caused yourself?'],
    },
  ],

  cheatSheets: [
    {
      id: 'pattern-map',
      title: 'Pattern quick map (problem → pattern)',
      rows: [
        { concept: 'Hide which concrete type is created', description: 'Factory — consumers get an interface; the switch lives in one place.' },
        { concept: 'Complex/validated multi-step construction', description: 'Builder — fluent steps, build() validates. In JS often an options object suffices.' },
        { concept: 'Exactly one shared instance', description: 'Singleton — in JS, module scope already does this; prefer DI for testability.' },
        { concept: 'Incompatible interface', description: 'Adapter — translate to what callers expect; isolate vendor churn.' },
        { concept: 'Complex subsystem, simple use cases', description: 'Facade — one honest API over the mess; anti-corruption layer.' },
        { concept: 'Add behavior, keep interface', description: 'Decorator — stack wrappers: withRetry(withCache(fn)); HOFs are decorators.' },
        { concept: 'Control access to an object', description: 'Proxy — lazy init, permissions, tracking. Vue reactivity = Proxy + Observer.' },
        { concept: 'Tree where group and leaf act alike', description: 'Composite — component trees, folders, comment threads.' },
        { concept: 'Notify many on change', description: 'Observer — emitters, watchers, reactivity. Always pair with unsubscribe.' },
        { concept: 'Swap algorithms at runtime', description: 'Strategy — function map replaces switch; sort comparators, validators.' },
        { concept: 'Actions with undo/queue/replay', description: 'Command — execute()/undo() objects on a history stack.' },
        { concept: 'Pipeline of handlers', description: 'Chain of Responsibility / middleware — handler(ctx, next), onion model.' },
      ],
    },
    {
      id: 'solid-cheat',
      title: 'SOLID one-liners with JS anchors',
      rows: [
        { concept: 'S — Single Responsibility', description: 'One reason to change. Split the fetch+transform+render component into api/composable/component.' },
        { concept: 'O — Open/Closed', description: 'New behavior = new code, not edits. Strategy maps and plugins instead of growing switches.' },
        { concept: 'L — Liskov Substitution', description: 'Subtypes keep the base\'s promises. No "Collection" that throws on add().' },
        { concept: 'I — Interface Segregation', description: 'Take { log }, not the app context; 3 props, not the 30-field entity. Pick<> is your friend.' },
        { concept: 'D — Dependency Inversion', description: 'Logic depends on contracts; axios/Postgres wired at the composition root.' },
        { concept: 'The thread', description: 'Isolate what changes; depend on contracts. Apply where change pressure is REAL (else YAGNI).' },
      ],
    },
    {
      id: 'lookalikes',
      title: 'Commonly confused pairs',
      rows: [
        { concept: 'Observer vs Pub-Sub', description: 'Observer: subject holds refs, notifies directly (2 roles, sync). Pub-Sub: broker between strangers (3 roles, often async).' },
        { concept: 'Decorator vs Adapter', description: 'Decorator: same interface + added behavior. Adapter: changed interface, same behavior.' },
        { concept: 'Decorator vs Proxy', description: 'Decorator adds behavior; Proxy controls access (lazy, guarded, tracked). Same wrapping shape, different intent.' },
        { concept: 'Facade vs Adapter', description: 'Facade designs a NEW simpler API over a subsystem; Adapter matches an EXISTING expected API.' },
        { concept: 'Strategy vs Command', description: 'Strategy: HOW to do one job, chosen by caller. Command: a queued/undoable WHAT, carrying its own context.' },
        { concept: 'Factory vs Builder', description: 'Factory picks WHICH object in one call; Builder assembles ONE complex object across steps.' },
        { concept: 'Module vs Singleton', description: 'ES module = singleton instance by the registry. Same semantics, language-provided.' },
      ],
    },
    {
      id: 'frontend-pattern-cheat',
      title: 'Frontend pattern cheat sheet',
      rows: [
        { concept: 'Container / presentational', description: 'Logic vs rendering split; modern form: composables/hooks hold the logic, components stay dumb.' },
        { concept: 'Scoped slots / render props', description: 'Behavior owner delegates markup to consumer — Strategy for rendering; headless UI libraries.' },
        { concept: 'Plugin pattern', description: 'Host exposes hooks; plugins register and extend without host edits. app.use(), Vite plugins, ESLint rules.' },
        { concept: 'Provider / inject', description: 'DI through the component tree — provide/inject, context. Kills prop drilling, keeps contracts.' },
        { concept: 'Middleware', description: 'Router guards, axios interceptors, store plugins — handler(ctx, next) chains.' },
        { concept: 'HOF decorators', description: 'debounce / throttle / memoize / once / withRetry — function-level Decorator.' },
        { concept: 'State machine', description: 'Explicit states + transitions replace boolean soup (isLoading && !isError && ...).' },
        { concept: 'Anti-patterns to name', description: 'God store/component, prop drilling 6 levels, premature generic form framework, effect spaghetti.' },
      ],
    },
  ],

  questions: [
    {
      id: 'q-which-patterns-daily',
      level: 'beginner',
      question: 'Which design patterns do you actually use in frontend work — without realizing it half the time?',
      answer: 'Observer (every event listener, watcher, store subscription), Strategy (sort comparators, validation rule maps), Decorator (debounce/throttle/memoize — HOFs wrapping functions), Facade (every SDK/API wrapper module), Adapter (storage or vendor wrappers during migrations), Singleton (every ES module export of an instance), Proxy (Vue reactivity), Composite (the component tree itself), middleware/Chain (router guards, interceptors), and module pattern (every composable returning an API over closed-over state).',
      deepDive: 'The point that elevates the answer: in JS most patterns are structurally INVISIBLE because the language absorbs them — first-class functions eat Strategy/Command ceremony, modules eat Singleton, generators eat Iterator. Naming the pattern inside the idiom shows you understand mechanics, not vocabulary.',
      followUps: ['Pick one and walk through its mechanics', 'Which GoF pattern do you almost never need in JS, and why?'],
    },
    {
      id: 'q-singleton-di',
      level: 'intermediate',
      question: 'Implement a singleton in TypeScript — then argue why dependency injection is usually the better design.',
      answer: 'Class version: private constructor + static getInstance() caching the instance. Idiomatic JS version: export an instance from a module — the module registry guarantees one evaluation, so every importer shares it. Why DI usually wins: singletons are hidden globals — function signatures lie about their dependencies, tests share mutable state across cases (order-dependent failures), and you cannot substitute a fake without module-mocking gymnastics. DI keeps the single LIFETIME (construct once at the composition root) but makes the dependency explicit and replaceable: same instance count, none of the coupling.',
      deepDive: 'The precise framing interviewers reward: Singleton conflates two decisions — single instance (often correct: pools, config, stores) and global access point (the harmful half). DI separates them. Mention real-world frameworks doing exactly this: Pinia stores are singletons per app instance but injected via the app context, which is why they are testable with createTestingPinia.',
      followUps: ['How do you test code that imports a singleton directly?', 'What is a composition root?', 'When would you still hard-import a singleton without guilt? (config, pure constants)'],
    },
    {
      id: 'q-observer-implement',
      level: 'intermediate',
      question: 'What is the Observer pattern, where does Vue use it, and what is its classic production bug?',
      answer: 'A subject keeps a list of observer callbacks and invokes them on state change — one-to-many notification. Vue uses fine-grained observers everywhere: each reactive property tracks the effects (renders, computeds, watchers) that read it and triggers exactly those on write; that is why Vue re-renders surgically without VDOM-diffing untouched components into the picture. The classic bug: leaks via forgotten unsubscribe — the subject holds the observer reference, so a long-lived subject (global store, window) pins dead components and everything their closures capture.',
      deepDive: 'Production hygiene to mention: every subscribe returns an unsubscribe (or accepts an AbortSignal), teardown ties to lifecycle (Vue does this automatically for watchers created in setup — explain WHY: the effect scope collects them), and notification timing is batched/deferred (Vue flushes on microtasks) so observers never see half-updated state.',
      followUps: ['Why does Vue auto-stop watchers created in setup()?', 'Push vs pull observer variants?', 'How would you find an observer leak in DevTools?'],
    },
    {
      id: 'q-strategy-refactor',
      level: 'beginner',
      question: 'This function has a growing if/else on shipping carrier ("fedex", "ups", "dhl"...) to compute cost. Refactor it and name the pattern.',
      answer: 'Strategy. Extract each branch into a function with one shared signature, register them in a map, and select by key: const calculators = { fedex: (pkg) => ..., ups: (pkg) => ... }; cost = calculators[carrier](pkg). Adding a carrier becomes adding an entry — no edits to existing logic (Open/Closed), each calculator tests in isolation, and an unknown carrier is handled once at the lookup (explicit error or default strategy) instead of falling through an else.',
      deepDive: 'Follow-through details that score: in TS, type the map as Record<Carrier, (pkg: Package) => number> so adding a Carrier union member without a calculator is a compile error — the type system enforces the pattern\'s completeness. And the judgment caveat: two stable branches do not need this; reach for it when the axis of change is proven.',
      followUps: ['How does TS make the strategy map exhaustive?', 'Where do strategies get their dependencies (rates API)?', 'When would you keep the if/else?'],
    },
    {
      id: 'q-decorator-vs-adapter',
      level: 'intermediate',
      question: 'Decorator, Adapter, Facade, Proxy — all of them "wrap something". Distinguish them sharply.',
      answer: 'The intent and the interface tell them apart. Decorator: SAME interface, ADDED behavior — withRetry(fetchFn) is still callable like fetchFn. Adapter: DIFFERENT interface, same behavior — make the new SDK answer to the old method names your call sites expect. Facade: a NEW, simpler interface you design over a complex subsystem — pay(order) hiding tokenization, 3DS, and retries. Proxy: SAME interface, controlled ACCESS — lazy creation, permission checks, dependency tracking; behavior is nominally unchanged, the gatekeeping is the point.',
      deepDive: 'A single example run through all four lands this perfectly: an HTTP client. withLogging(client) = decorator. Wrapping it to match a legacy client\'s method names = adapter. A domain-specific api.getUserDashboard() over five endpoints = facade. An object that defers creating the client until first call and blocks calls without an auth token = proxy.',
      followUps: ['Why does the distinction matter practically? (search/replace cost when intent is misnamed)', 'Which of the four is Vue\'s reactive()?'],
    },
    {
      id: 'q-liskov-violation',
      level: 'advanced',
      question: 'Give a realistic Liskov Substitution violation in TypeScript and explain the damage.',
      answer: 'A ReadOnlyList extending List but throwing in add(): every function typed to accept List now has a landmine — it compiles, passes review, and explodes at runtime for one subtype. The contract of List ("add appends") is violated, so the subtype is not substitutable. Other live examples: a caching repository whose findById sometimes returns stale deleted entities (base promises "current or null"); an event emitter subclass that swallows errors its base propagates; a component accepting the props of its "base" but ignoring half of them. Damage: callers must start instanceof-checking, which destroys polymorphism — the entire reason the hierarchy existed.',
      deepDive: 'The structural fix: model capabilities, not hierarchies — ReadableList and WritableList interfaces, with List implementing both and ReadOnlyList only the first; functions then declare exactly the capability they need (which is also Interface Segregation — the principles interlock). In TS, structural typing makes this natural: small interfaces, compose by intersection. Behavioral contracts (timing, errors, side effects) are not expressible in types — that is what makes LSP a design principle rather than a compiler feature.',
      followUps: ['How do LSP and ISP interact in that fix?', 'Why can\'t the type system catch most LSP violations?', 'Rectangle/Square — why is the classic example actually about mutability?'],
    },
    {
      id: 'q-premature-abstraction',
      level: 'advanced',
      question: 'Tell me about the "wrong abstraction". How does it happen and what do you do once you have one?',
      answer: 'The lifecycle: two similar code paths get merged into a shared helper (feels like good DRY); a third case almost fits, so a boolean parameter appears; the fourth adds two more flags; soon the helper is a config-interpreting monster where every caller exercises a different path and no one can change it safely. It happens because the original similarity was coincidental — same shape, different reasons to change. The cure is Sandi Metz\'s prescription: inline the abstraction back into its callers (accept the duplication), delete the dead flexibility, and let each call site evolve independently until a REAL shared shape emerges — duplication is cheaper than the wrong abstraction because it can still become anything.',
      deepDive: 'The senior judgment layer: the prevention is abstracting on demonstrated repetition (rule of three) and abstracting the STABLE part only — extract the genuinely identical core, leave the divergent edges at the call sites. Flags accumulating in a shared function are the canonical smell to name in code review before the monster matures.',
      followUps: ['Concretely, how do you "inline it back" without breaking callers?', 'How does this reconcile with DRY?', 'What is the rule of three?'],
    },
    {
      id: 'q-vue-proxy-deep',
      level: 'advanced',
      question: 'Explain how Vue 3 reactivity uses Proxy, and why the Vue 2 approach (Object.defineProperty) was replaced.',
      answer: 'reactive(obj) returns a Proxy. The get trap runs track(target, key): if an effect (component render, computed, watcher) is currently executing, it is recorded in a dependency map (target → key → Set of effects). The set trap runs trigger(target, key): the effects recorded for that exact key re-run. Result: fine-grained, property-level Observer — mutating state.count re-renders only what read count. Vue 2 used Object.defineProperty, which can only redefine EXISTING properties one by one: added properties were invisible (Vue.set existed for this), array index writes and deletes were not interceptable, and the whole object graph had to be walked eagerly at setup. Proxy traps the whole object — including future keys, deletes, has checks — and wraps nested objects lazily on first access.',
      deepDive: 'Depth markers: ref exists because primitives cannot be proxied (a wrapper object with .value); reactive proxies are cached in a WeakMap so reactive(obj) twice returns the same proxy (and WeakMap keeps it GC-friendly); effects are batched and flushed on the microtask queue so multiple synchronous mutations cause one re-render; toRaw/markRaw are the escape hatches when trap overhead matters (large lists, third-party class instances).',
      followUps: ['Why does destructuring a reactive object lose reactivity? (values escape the proxy — the traps live on the object)', 'What does shallowReactive skip?', 'How do computed properties fit this model? (effects that are also tracked dependencies)'],
    },
    {
      id: 'q-pubsub-tradeoff',
      level: 'intermediate',
      question: 'Your team wants a global event bus so any component can talk to any other. Argue both sides.',
      answer: 'For: pub-sub decouples components that have no natural parent-child path (toast notifications, analytics events, cross-cutting "logout happened" broadcasts) — no prop drilling, no store ceremony for fire-and-forget signals. Against: the bus makes data flow invisible — "who reacts to cart:updated?" becomes a global text search; ordering and timing are implicit; forgotten unsubscribes leak; and overuse turns explicit architecture into effects-at-a-distance spaghetti. The balanced position: a bus is right for broadcast-style, fire-and-forget cross-cutting events; STATE should live in stores/query caches where consumers are discoverable and DevTools can inspect it. If a bus event carries data a component must hold, it probably wanted to be store state.',
      deepDive: 'This question tests whether you evaluate patterns by failure modes, not fashion. Mention the mitigations if a bus is adopted: typed event maps (compile-time payload contracts), namespaced event names, unsubscribe tied to lifecycle, and a hard rule against request/response conversations over the bus (that is RPC pretending to be events).',
      followUps: ['When did an event bus burn you or a team you know?', 'What does a typed event map look like in TS?'],
    },
    {
      id: 'q-middleware-mechanics',
      level: 'advanced',
      question: 'How does Express/Koa-style middleware composition actually work under the hood?',
      answer: 'compose(middlewares) returns one function that threads a context through the chain: each middleware receives (ctx, next) where next is a closure invoking the NEXT middleware; calling it continues inward, not calling it short-circuits, and in the async/onion model, code after await next() runs on the way back OUT. Mechanically, dispatch(i) returns middlewares[i](ctx, () => dispatch(i + 1)) — recursion building a nested call stack where the innermost handler sits at the center of the onion. Errors propagate naturally: a try/catch in the OUTERMOST middleware catches anything thrown anywhere downstream, which is exactly how error-handling middleware works.',
      deepDive: 'Implementation fine points: guard against next() being called twice per middleware (corrupts the dispatch index — Koa\'s compose throws); the context object is the shared data channel and needs discipline to avoid god-objecting; and the same compose powers Redux middleware and router guards — recognizing one mechanism across three frameworks is the senior tell.',
      followUps: ['Implement compose in front of me', 'Why does error middleware go first (outermost) in Koa but last in Express?', 'How do you type ctx mutations across middlewares in TS?'],
    },
    {
      id: 'q-composite-ui',
      level: 'beginner',
      question: 'Where does the Composite pattern appear in UI development?',
      answer: 'The component tree itself: a leaf (Button) and a subtree (whole page) satisfy the same contract — mount, render, unmount — so the framework treats them uniformly. Same with nested menus (item vs submenu sharing an interface), comment threads, form groups (validate() on a group recursively validates children and aggregates errors), and canvas/drawing tools (move a group = move all children). The defining trait: operations recurse through the tree while clients call one method on the root without caring whether they hold a leaf or a forest.',
      followUps: ['Design validate() for nested form groups', 'How does this relate to recursion in algorithms questions?'],
    },
    {
      id: 'q-god-component',
      level: 'expert',
      question: 'You inherit a 1,800-line component that fetches, transforms, validates, renders, and tracks analytics. Walk me through dismantling it — and the patterns you apply at each step.',
      answer: 'First stabilize: characterization tests (or at minimum snapshot + interaction tests) so refactoring has a safety net. Then extract along responsibility seams, lowest-risk first: (1) API calls → typed API-layer functions (Facade over the endpoints); (2) data transformation/business logic → pure functions (instantly unit-testable); (3) stateful orchestration → composables (module pattern — useOrders() owning fetch state and exposing a narrow API); (4) the render → smaller presentational components receiving props (SRP + Interface Segregation: each gets the 4 props it needs); (5) analytics → a decorator/middleware around the actions or an event subscription, not inline calls. Each extraction is independently shippable — no freeze, no big bang.',
      deepDive: 'The expert layer is sequencing by risk and proving each step: pure-function extractions first (zero behavioral risk, immediate test coverage), template decomposition last (highest regression surface). Name the forces that built the monster — every feature was cheapest to add "right here" — and the ratchet that prevents recurrence: lint max-lines warnings, review norms, and the composable-first convention making the RIGHT place the easy place.',
      realWorldExample: 'The order-details screen in most grown codebases: starts as 200 honest lines, accretes payments, returns, tracking, and promotions until no one dares touch it. The seams above are nearly always present.',
      followUps: ['What are characterization tests?', 'Which extraction do you do first and why?', 'How do you stop it growing back?'],
    },
    {
      id: 'q-open-closed-flags',
      level: 'intermediate',
      question: 'Show Open/Closed in practice: your notification feature must support email today, and "more channels soon".',
      answer: 'Define the contract once — interface Notifier { send(msg: Message): Promise<void> } — implement EmailNotifier against it, and register implementations in a map or array consulted by the dispatch code. When SMS and push arrive, they are NEW modules implementing Notifier plus a registry entry: zero edits to dispatch or to the email code (closed for modification, open for extension). Selection logic (user preferences, fallbacks) operates on the abstract list. With TS, Record<Channel, Notifier> makes a missing implementation a compile error.',
      deepDive: 'The honest YAGNI counterweight: do NOT build the registry before the second channel is real — a direct sendEmail call is correct code for one channel. Open/Closed is the answer to PROVEN extension pressure ("more channels soon" being on the roadmap is exactly that proof). This calibration — pattern when the axis of change is demonstrated — is what separates senior answers from pattern recitation.',
      followUps: ['Where do per-channel configs live?', 'How would retry policy differ per channel without breaking the contract? (decorate individual notifiers)'],
    },
    {
      id: 'q-patterns-overuse',
      level: 'expert',
      question: 'A mid-level engineer on your team applies patterns everywhere — AbstractFactories for two types, interfaces on everything. How do you coach them in review without crushing the enthusiasm?',
      answer: 'Acknowledge the instinct is right (isolating change IS the goal) and redirect the calibration: ask "what change does this abstraction protect us from, and is that change on any roadmap?" — making YAGNI a question, not a verdict. Establish the team heuristic together: abstract on the second or third real occurrence; one concrete implementation gets concrete code. Show the cost side they have not felt yet: every layer of indirection taxes every future reader, and the wrong abstraction (built before the real shape is known) is more expensive than duplication. Pair on simplifying ONE of their PRs — deleting an interface and watching nothing break teaches more than ten comments. Then give them a legitimate outlet: a place where the pattern IS warranted (the strategy map for the genuinely multi-variant feature).',
      deepDive: 'The meta-skill being interviewed: feedback that names criteria (rule of three, demonstrated change pressure, reader cost) rather than taste, preserves motivation by validating the underlying value, and changes behavior through pairing rather than comment volume. The strongest close: admit when you over-abstracted yourself and what it cost — calibration stories beat authority.',
      followUps: ['What if they push back with "but SOLID says..."?', 'How do you encode this calibration in team conventions rather than re-litigating per PR?'],
    },
  ],

  codingQuestions: [
    {
      id: 'code-typed-emitter',
      title: 'Typed event emitter (Observer)',
      level: 'intermediate',
      problem: 'Implement an event emitter with on/off/once/emit where event names and payload types are checked at compile time via a generic event map.',
      solution: {
        lang: 'ts',
        code: `type EventMap = Record<string, unknown>
type Listener<T> = (payload: T) => void

class Emitter<E extends EventMap> {
  private listeners = new Map<keyof E, Set<Listener<never>>>()

  on<K extends keyof E>(event: K, fn: Listener<E[K]>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(fn as Listener<never>)
    return () => this.off(event, fn) // return unsubscribe — leak prevention
  }

  off<K extends keyof E>(event: K, fn: Listener<E[K]>): void {
    this.listeners.get(event)?.delete(fn as Listener<never>)
  }

  once<K extends keyof E>(event: K, fn: Listener<E[K]>): () => void {
    const wrapper: Listener<E[K]> = (payload) => {
      this.off(event, wrapper) // unsubscribe BEFORE running
      fn(payload)
    }
    return this.on(event, wrapper)
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    // snapshot tolerates listeners that unsubscribe during dispatch
    const subs = this.listeners.get(event)
    if (subs) [...subs].forEach((fn) => (fn as Listener<E[K]>)(payload))
  }
}

// compile-time safety:
interface AppEvents extends EventMap {
  'cart:add': { sku: string; qty: number }
  'auth:logout': undefined
}
const bus = new Emitter<AppEvents>()
const stop = bus.on('cart:add', ({ sku }) => console.log(sku))
bus.emit('cart:add', { sku: 'A1', qty: 2 })
// bus.emit('cart:add', { sku: 1 })  ← type error
stop()`,
      },
      explanation: 'The generic event map turns runtime stringly-typed events into compile-time contracts — wrong payloads and unknown events fail the build. Three production details interviewers look for: on returns an unsubscribe closure (the leak-prevention idiom), once registers a self-removing WRAPPER (the wrapper must be what off finds, and removal happens before invocation so a re-emitting handler cannot double-fire), and emit snapshots the set so mid-dispatch unsubscribes do not skip listeners.',
      timeComplexity: 'on/off O(1); emit O(listeners)',
      spaceComplexity: 'O(events × listeners)',
      alternatives: ['AbortSignal-based unsubscription (on(event, fn, { signal }))', 'Async dispatch with Promise.allSettled to isolate failing handlers', 'Wildcard listeners for logging/devtools'],
    },
    {
      id: 'code-strategy-validation',
      title: 'Validation engine with Strategy',
      level: 'intermediate',
      problem: 'Build a form validator where rules are interchangeable strategies: a typed registry of rule functions, per-field rule lists, and a validate(values, schema) that returns all errors. Adding a rule must require zero changes to the engine.',
      solution: {
        lang: 'ts',
        code: `type Rule = (value: unknown, ...args: never[]) => string | null

// the strategy registry — each rule is one interchangeable algorithm
const rules = {
  required: (v: unknown) =>
    v === undefined || v === null || v === '' ? 'Required' : null,
  minLength: (v: unknown, min: number) =>
    typeof v === 'string' && v.length < min
      ? 'Must be at least ' + min + ' characters'
      : null,
  pattern: (v: unknown, re: RegExp, message: string) =>
    typeof v === 'string' && !re.test(v) ? message : null,
} satisfies Record<string, Rule>

// a bound rule = strategy + its configuration (partial application)
type BoundRule = (value: unknown) => string | null
const required: BoundRule = (v) => rules.required(v)
const minLength = (min: number): BoundRule => (v) => rules.minLength(v, min)
const pattern = (re: RegExp, msg: string): BoundRule => (v) =>
  rules.pattern(v, re, msg)

type Schema<T> = { [K in keyof T]?: BoundRule[] }

function validate<T extends Record<string, unknown>>(
  values: T,
  schema: Schema<T>,
): Partial<Record<keyof T, string[]>> {
  const errors: Partial<Record<keyof T, string[]>> = {}
  for (const field of Object.keys(schema) as (keyof T)[]) {
    const fieldErrors = (schema[field] ?? [])
      .map((rule) => rule(values[field]))
      .filter((e): e is string => e !== null)
    if (fieldErrors.length) errors[field] = fieldErrors
  }
  return errors
}

// usage — engine never changes when rules are added:
const errors = validate(
  { email: 'x', password: 'hunter2' },
  {
    email: [required, pattern(/@/, 'Invalid email')],
    password: [required, minLength(8)],
  },
)
// → { email: ['Invalid email'], password: ['Must be at least 8 characters'] }`,
      },
      explanation: 'Strategy in its JS-native form: rules are plain functions sharing one signature, and configured rules are built by partial application (minLength(8) closes over its argument and returns the uniform BoundRule shape — currying serving the pattern). The engine iterates whatever strategies the schema lists, so new rules are pure additions: Open/Closed demonstrated concretely. Each rule unit-tests in isolation; the satisfies clause keeps the registry honest without widening its types.',
      timeComplexity: 'O(fields × rules)',
      spaceComplexity: 'O(errors)',
      alternatives: ['Async rules (username availability) — engine maps to Promise.all', 'Stop-on-first-error mode per field', 'Cross-field rules receiving the whole values object'],
    },
    {
      id: 'code-query-builder',
      title: 'Immutable fluent query builder (Builder)',
      level: 'intermediate',
      problem: 'Implement a QueryBuilder with where/orderBy/limit returning a chainable builder, where each call returns a NEW builder (immutable forks), and build() produces the final query object — validating it.',
      solution: {
        lang: 'ts',
        code: `interface Query {
  table: string
  conditions: { field: string; op: '=' | '>' | '<'; value: unknown }[]
  sort?: { field: string; dir: 'asc' | 'desc' }
  limit?: number
}

class QueryBuilder {
  // all state private and readonly — mutation is impossible
  private constructor(private readonly query: Query) {}

  static from(table: string): QueryBuilder {
    return new QueryBuilder({ table, conditions: [] })
  }

  where(field: string, op: '=' | '>' | '<', value: unknown): QueryBuilder {
    return new QueryBuilder({
      ...this.query,
      conditions: [...this.query.conditions, { field, op, value }],
    })
  }

  orderBy(field: string, dir: 'asc' | 'desc' = 'asc'): QueryBuilder {
    return new QueryBuilder({ ...this.query, sort: { field, dir } })
  }

  limit(n: number): QueryBuilder {
    return new QueryBuilder({ ...this.query, limit: n })
  }

  build(): Query {
    if (this.query.limit !== undefined && this.query.limit <= 0) {
      throw new Error('limit must be positive')
    }
    return this.query // already valid by construction
  }
}

// immutability enables safe forking — the Builder payoff:
const base = QueryBuilder.from('orders').where('status', '=', 'paid')
const recent = base.orderBy('createdAt', 'desc').limit(10).build()
const biggest = base.orderBy('total', 'desc').limit(5).build()
// base is untouched: both variants share it without interference`,
      },
      explanation: 'Builder solves multi-step construction with validation; the immutable variant (each method spreads into a NEW builder) adds the forking superpower shown at the bottom — a shared base query producing independent variants, impossible with a mutable builder where the second fork would inherit the first\'s mutations. This is the exact design of test-data builders and the reason production query builders document whether they mutate. build() is the single validation gate: only valid Query objects ever escape.',
      timeComplexity: 'O(conditions) per fork (spread copy)',
      spaceComplexity: 'O(chain length) intermediate builders',
      alternatives: ['Mutable builder (cheaper, no forking safety) — name the tradeoff', 'Plain options object when construction is single-step', 'Phantom-type state machines in TS enforcing call order (cannot limit() before from()) as the expert extension'],
    },
    {
      id: 'code-compose-middleware',
      title: 'Koa-style middleware compose (Chain of Responsibility)',
      level: 'advanced',
      problem: 'Implement compose(middlewares): combine an array of async (ctx, next) middlewares into one function with onion semantics — code after await next() runs on the way out — and guard against next() being called twice.',
      solution: {
        lang: 'ts',
        code: `type Next = () => Promise<void>
type Middleware<C> = (ctx: C, next: Next) => Promise<void> | void

function compose<C>(middlewares: Middleware<C>[]) {
  return function run(ctx: C, final?: Next): Promise<void> {
    let lastCalled = -1 // guards double next() per middleware

    function dispatch(i: number): Promise<void> {
      if (i <= lastCalled) {
        return Promise.reject(new Error('next() called multiple times'))
      }
      lastCalled = i
      const fn = i === middlewares.length ? final : middlewares[i]
      if (!fn) return Promise.resolve()
      try {
        // next for middleware i is a closure dispatching i + 1
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}

// onion semantics demo:
interface Ctx { logs: string[] }
const handler = compose<Ctx>([
  async (ctx, next) => {
    ctx.logs.push('timing: start')
    await next() // everything below runs inside this await
    ctx.logs.push('timing: end') // way OUT
  },
  async (ctx, next) => {
    if (ctx.logs.includes('blocked')) return // short-circuit: no next()
    await next()
  },
  async (ctx) => {
    ctx.logs.push('handler')
  },
])

const ctx: Ctx = { logs: [] }
await handler(ctx)
// ctx.logs → ['timing: start', 'handler', 'timing: end']`,
      },
      explanation: 'dispatch(i) hands middleware i a next that is literally dispatch(i+1) — recursion builds the onion, and because each layer AWAITS its next, the call stack unwinds back out through the layers in reverse, which is why the timing middleware brackets everything downstream. The lastCalled guard is Koa\'s actual protection: calling next() twice would re-enter dispatch with a stale index and run downstream middleware twice. Error semantics fall out free: a rejection anywhere propagates up the awaits to the outermost try/catch — exactly how error-handling middleware wraps a whole app.',
      timeComplexity: 'O(n) middlewares per request',
      spaceComplexity: 'O(n) stack depth (one frame per layer)',
      alternatives: ['reduceRight building the chain right-to-left (no index state)', 'Express-style (no onion: next is fire-and-continue, error via next(err))', 'Typed context evolution: each middleware refining the ctx type for downstream'],
    },
    {
      id: 'code-command-undo',
      title: 'Undo/redo with the Command pattern',
      level: 'advanced',
      problem: 'Implement a command-based history for a tiny editor: each command carries execute() and undo(); a CommandHistory supports do/undo/redo, and a new command after undos truncates the redo branch (standard editor behavior).',
      solution: {
        lang: 'ts',
        code: `interface Command {
  execute(): void
  undo(): void
  readonly label: string
}

class CommandHistory {
  private done: Command[] = []
  private undone: Command[] = []

  do(command: Command): void {
    command.execute()
    this.done.push(command)
    this.undone = [] // a new action invalidates the redo branch
  }

  undo(): boolean {
    const command = this.done.pop()
    if (!command) return false
    command.undo()
    this.undone.push(command)
    return true
  }

  redo(): boolean {
    const command = this.undone.pop()
    if (!command) return false
    command.execute()
    this.done.push(command)
    return true
  }
}

// concrete commands over a document
class Doc {
  text = ''
}

class InsertText implements Command {
  readonly label: string
  constructor(private doc: Doc, private at: number, private chunk: string) {
    this.label = 'insert ' + chunk
  }
  execute(): void {
    this.doc.text =
      this.doc.text.slice(0, this.at) + this.chunk + this.doc.text.slice(this.at)
  }
  undo(): void {
    // the command KNOWS its inverse — no snapshots needed
    this.doc.text =
      this.doc.text.slice(0, this.at) +
      this.doc.text.slice(this.at + this.chunk.length)
  }
}

const doc = new Doc()
const history = new CommandHistory()
history.do(new InsertText(doc, 0, 'Hello'))
history.do(new InsertText(doc, 5, ' world'))
history.undo() // doc.text === 'Hello'
history.redo() // doc.text === 'Hello world'
history.undo()
history.do(new InsertText(doc, 5, '!')) // redo branch gone — standard behavior`,
      },
      explanation: 'Command reifies actions as objects carrying their own inverse, so undo is command.undo() — no full-document snapshots, which matters when state is large (memory: a 5-char insert stores 5 chars, not the whole document). Two stacks implement the history; the subtle rule interviewers check is the redo truncation: doing anything new after undos clears the undone stack, because redoing onto a diverged state would corrupt it. The label field hints at real-world needs (undo menus, devtools).',
      timeComplexity: 'do/undo/redo O(command cost)',
      spaceComplexity: 'O(history length × command size) — vs O(history × document size) for snapshots',
      alternatives: ['Snapshot/memento approach — simpler, fine for small state; know the tradeoff', 'Command merging (consecutive single-char inserts coalesce into one undo step)', 'Collaborative editing caveat: undo only YOUR OWN ops — commands make that selectable, snapshots cannot'],
    },
    {
      id: 'code-lazy-proxy',
      title: 'Virtual proxy: lazy initialization + access logging',
      level: 'advanced',
      problem: 'Using the JS Proxy object, implement lazyService(factory): an object that defers constructing an expensive service until the first property access, then transparently forwards everything — and counts method calls for instrumentation (Proxy pattern, twice).',
      solution: {
        lang: 'ts',
        code: `function lazyService<T extends object>(
  factory: () => T,
): { service: T; stats: () => Record<string, number> } {
  let instance: T | null = null
  const callCounts: Record<string, number> = {}

  const ensure = (): T => {
    if (!instance) instance = factory() // built on FIRST access, not at wiring
    return instance
  }

  const service = new Proxy({} as T, {
    get(_target, key, receiver) {
      const real = ensure()
      const value = Reflect.get(real, key, receiver)
      if (typeof value === 'function') {
        // wrap methods to instrument; apply with the real instance as this
        return (...args: unknown[]) => {
          const name = String(key)
          callCounts[name] = (callCounts[name] ?? 0) + 1
          return (value as (...a: unknown[]) => unknown).apply(real, args)
        }
      }
      return value
    },
    set(_target, key, value) {
      return Reflect.set(ensure(), key, value)
    },
    has(_target, key) {
      return Reflect.has(ensure(), key)
    },
  })

  return { service, stats: () => ({ ...callCounts }) }
}

// usage: nothing expensive happens at wiring time
const { service: search, stats } = lazyService(() => {
  console.log('building heavy search index...') // runs once, on first use
  return {
    index: new Map<string, string[]>(),
    query(term: string): string[] {
      return this.index.get(term) ?? []
    },
  }
})

search.query('vue') // logs 'building...' THEN queries
search.query('proxy')
stats() // { query: 2 }`,
      },
      explanation: 'Two classical proxy roles in one object: virtual proxy (the expensive factory runs on first trap hit — wiring an app with dozens of services costs nothing until each is touched) and instrumentation proxy (methods are wrapped to count calls without the service knowing). The traps forward through Reflect so untouched behavior stays default, and apply-ing with the real instance preserves `this` — the bug most candidates hit when the proxied method reads its own fields. This is the same machinery as Vue\'s reactive(), pointed at a different goal: there the get trap tracks effects; here it defers construction and counts.',
      timeComplexity: 'O(1) trap overhead per access',
      spaceComplexity: 'O(1) + the instance once built',
      alternatives: ['Protection proxy variant: throw on access without a permission check', 'Revocable proxy (Proxy.revocable) to hard-disable a service after teardown', 'Getter-based lazy init (no Proxy) when only one known property gates construction'],
    },
  ],

  scenarios: [
    {
      id: 'sc-refactor-channel-soup',
      title: 'A notification module drowning in if/else — refactor under deadline',
      situation: 'A sendNotification(user, type, message, options) function has grown to 400 lines of nested conditionals over channels (email/SMS/push), user preferences, quiet hours, and per-channel formatting. Marketing wants WhatsApp added this sprint; the last two channel additions each caused regressions in OTHER channels.',
      approach: [
        'Diagnose by pattern: edits for new channels breaking old ones is the Open/Closed violation signature — the change axis (channel) is buried inside shared conditionals instead of isolated behind a contract.',
        'Define the seam: interface Notifier { supports(user): boolean; send(msg): Promise<void> } and extract ONE existing channel (email) into it, routed by a registry map. Ship that alone — proving the seam without touching SMS/push behavior.',
        'Move the orthogonal concerns out of the channel code: quiet hours and preference checks become middleware/decorators wrapping any Notifier (they were duplicated per-branch before) — Decorator handling cross-cutting policy.',
        'Now WhatsApp is a NEW module implementing Notifier plus one registry entry — the sprint deliverable lands without touching existing channels, which is the proof the refactor paid for itself immediately.',
        'Migrate the remaining channels opportunistically (next time each is touched), with characterization tests pinned on the old function until it is empty and deleted.',
      ],
      keyTakeaways: ['Name the violated principle to justify the refactor: regressions-on-extension = Open/Closed violation, Strategy is the cure', 'Extract one strategy first and ship — refactors that pay rent each step survive deadlines', 'Cross-cutting policy (quiet hours) belongs in decorators around strategies, not duplicated inside each one'],
    },
    {
      id: 'sc-plugin-dashboard',
      title: 'Design a dashboard where other teams add their own widgets',
      situation: 'Your platform team owns an analytics dashboard. Five product teams want to add custom widgets; the current process — they send requirements, you implement — has a six-week backlog and makes you the bottleneck.',
      approach: [
        'Recognize the shape: a host that others extend without modifying it is the Plugin pattern — Open/Closed at architecture scale, and the Conway fix for the bottleneck (teams ship their own widgets).',
        'Design the contract first, minimal: a widget registers { id, title, component, dataSource?, permissions?, refreshInterval? }. The host owns layout, lifecycle (mount/unmount/refresh), error isolation, and theming tokens — plugins own only their content.',
        'Error isolation is non-negotiable: each widget renders inside an error boundary with a fallback card — one team\'s crash must not take the dashboard down. Same for performance: lazy-load widget code per dashboard view, budget each widget\'s bundle.',
        'Provide the paved road: a widget template repo, typed SDK (the registration contract published as a package), local dev harness rendering a widget standalone, and CI checks (bundle size, contract version) gating registration.',
        'Version the contract from day one (a widgets/v1 namespace) — you WILL need breaking changes, and versioning turns them from coordinated migrations into gradual ones. Review the first two widgets from each team, then trust the gates.',
      ],
      keyTakeaways: ['Plugin = inverted dependency: the host defines the contract, extensions conform — the host never imports a plugin', 'Isolation (errors, performance, permissions) is what makes third-party extension safe; design it before the first plugin', 'The paved road (SDK, template, harness, CI gates) is what actually removes the bottleneck — a contract alone just moves the queue'],
    },
    {
      id: 'sc-wrong-abstraction-unwind',
      title: 'The shared "DataTable" component everyone fears — unwinding a wrong abstraction',
      situation: 'Three years ago two similar tables were merged into a shared DataTable. It now has 47 props, renders 23 product surfaces, and every change breaks someone — the last "small fix" caused regressions in four screens. Two teams have started building competing replacements in secret.',
      approach: [
        'Call the pattern by name to align everyone: this is the wrong abstraction — coincidental similarity merged early, then flag-patched per divergent need. The fix is Metz\'s prescription: inline back, then re-extract only what is genuinely shared.',
        'Map the usage matrix first: which of the 47 props does each of the 23 call sites actually use? Typically it reveals 3–4 distinct table SPECIES (simple list, selectable grid, editable matrix...) plus a small truly-common core (column defs, sorting).',
        'Re-architect as headless core + composed species: extract the genuinely shared behavior (sorting, selection state, keyboard nav) into composables — behavior without markup (the headless pattern) — and build 3–4 thin, honest table components per species, each taking only its needed props (Interface Segregation).',
        'Migrate by species, not big bang: the simplest species first, call sites moved one PR at a time, old DataTable shrinking behind a deprecation lint rule banning NEW usage (the ratchet).',
        'Absorb the secret replacements: evaluate them as species candidates — teams built them because the abstraction taxed them; the unwind should give them an officially supported home, ending the fragmentation.',
      ],
      keyTakeaways: ['47 props on a shared component = several components wearing a trench coat; usage-matrix analysis reveals the real species', 'Headless composables (behavior) + thin per-species components (markup) re-split the abstraction along its true joints', 'Duplication during migration is the medicine, not the disease — the wrong abstraction was the expensive thing'],
    },
    {
      id: 'sc-undo-feature',
      title: 'Product asks for undo across a settings-heavy editor — pattern selection under constraints',
      situation: 'Your design-tool-like editor (canvas objects + nested settings panels) needs undo/redo. State lives in a few Pinia stores; some operations are local (move shape), others hit APIs (rename project). The team\'s first instinct is "snapshot the store on every change".',
      approach: [
        'Frame the two candidate patterns with their cost curves: Memento (snapshots — trivial to implement, memory O(history × state size), undo of API-backed ops impossible by replay) vs Command (execute/undo pairs — more design work, memory O(history × delta), API ops get explicit inverse calls).',
        'Segment the operations: high-frequency local mutations (drag = hundreds of micro-moves) need command MERGING (coalesce a drag into one command) regardless of pattern; API-backed operations need Command because their undo is a compensating call (rename back), not a state restore.',
        'Recommend the hybrid honestly: Command as the architecture (a history of { execute, undo, label } objects, two stacks, redo-branch truncation), with snapshot-based commands as an implementation shortcut for cheap local state (the command\'s undo restores a small captured slice — memento INSIDE command).',
        'Define the boundaries: not everything is undoable — destructive shared actions (delete project) get confirmation instead; the history is bounded (memory) and cleared on context switches; multiplayer is explicitly out of scope v1 (collaborative undo means undoing only YOUR ops — note it in the ADR as a known future constraint that Command supports and snapshots would not).',
        'Prototype the riskiest slice first: drag-coalescing + one API-backed command, measuring memory and dev ergonomics before committing the team.',
      ],
      keyTakeaways: ['Snapshot vs Command is a cost-curve decision: state size, operation frequency, and API-backed inverses decide it — not pattern preference', 'Hybrids are legitimate: Command architecture with memento-style small snapshots inside cheap commands', 'Scoping what is NOT undoable (and writing it down) is as much the senior contribution as the pattern choice'],
    },
  ],

  mentalModels: [
    {
      id: 'mm-patterns-vocabulary',
      title: 'Patterns as Compression, Not Recipes',
      flow: ['Recurring problem shape', 'Named solution shape', 'Team says the name', 'Whole design transfers in one word', 'Code may not even look "classical"'],
      explanation: [
        'A pattern\'s primary value is communication bandwidth: "make notification channels strategies" transfers a refactoring plan, its tests, and its extension story in five words.',
        'The implementation is incidental and language-shaped: in JS, Strategy is an object of functions, Singleton is a module, Iterator is a generator. Judging pattern knowledge by class-diagram fidelity misses the point entirely.',
        'This is why interviewers ask "where have you used X" rather than "define X" — usage proves you recognize the SHAPE in the wild, which is the actual skill.',
      ],
      whatBreaksWithoutIt: 'Without shared names, every design discussion rebuilds from first principles, code reviews argue mechanisms instead of intent, and juniors cannot search for the solution class their problem belongs to.',
      interviewTip: 'For every pattern you claim, carry a one-line real usage ("Decorator — our withRetry wrapper around the API client"). Pattern + sighting beats pattern + definition every time.',
    },
    {
      id: 'mm-isolate-what-varies',
      title: 'Isolate What Varies (the meta-pattern)',
      flow: ['Requirement changes arrive', 'Notice WHERE they keep landing', 'Draw a contract around that axis', 'Variations become plugins/strategies behind it', 'Stable code stops being edited'],
      explanation: [
        'Nearly every GoF pattern is this single move aimed at a different axis: creation varies → Factory; algorithm varies → Strategy; behavior layering varies → Decorator; interface varies → Adapter; notification targets vary → Observer.',
        'The skill is identifying the REAL axis of change from evidence (which PRs keep touching which code) rather than imagined flexibility — abstracting an axis that never moves is premature abstraction.',
        'Corollary: SOLID is this model formalized — SRP says one axis per module, OCP says extend along the axis without editing, DIP says the stable side owns the contract.',
      ],
      whatBreaksWithoutIt: 'Without it, changes shotgun across the codebase (the axis is smeared through conditionals), or the codebase drowns in speculative interfaces protecting against changes that never come.',
      interviewTip: 'When given refactoring prompts, narrate the axis first: "the thing that keeps changing here is the carrier — so I isolate carrier behind a contract". Deriving the pattern from the axis impresses more than naming it.',
    },
    {
      id: 'mm-composition-inheritance',
      title: 'Composition over Inheritance',
      flow: ['Need: combine behaviors', 'Inheritance: combinations explode (Base × A × B × ...)', 'Composition: wrap/inject small behaviors', 'Any combination at runtime', 'Test each piece alone'],
      explanation: [
        'Inheritance binds behavior combinations at class-definition time: a cached+retrying+logging fetcher needs a class per combination. Composition (Decorator stacks, Strategy injection, mixins-as-functions) assembles them at runtime: withCache(withRetry(withLogging(fetchFn))).',
        'JS is composition-native: first-class functions and closures make wrapping trivial, and the ecosystem reflects it — hooks/composables over class hierarchies, HOFs over subclassing.',
        'Inheritance still earns its place for genuine is-a hierarchies with stable contracts (Error subclasses, AST nodes) — the model is a default, not a ban.',
      ],
      whatBreaksWithoutIt: 'Inheritance-first designs produce fragile base classes (every base change reverberates), combinatorial subclass explosions, and Liskov violations as subclasses bend contracts to fit.',
      interviewTip: 'When asked to add behavior to existing functionality, reach for a wrapper and SAY the principle: "I\'d compose rather than subclass — decorator keeps the interface and lets behaviors stack". It frames the whole answer.',
    },
    {
      id: 'mm-rule-of-three',
      title: 'The Rule of Three (when to abstract)',
      flow: ['First occurrence: write it concrete', 'Second: copy it, note the similarity', 'Third: the real shared shape is now visible', 'Abstract THE PROVEN CORE only', 'Edges stay at call sites'],
      explanation: [
        'Two occurrences show coincidence; three show a pattern — and only by the third do you know which parts are genuinely shared versus accidentally similar. Abstracting at one is speculation; at two, a gamble.',
        'Abstract the stable core and leave divergent edges concrete at call sites — abstractions that swallow the edges grow the flag-parameters that define the wrong abstraction.',
        'The model also runs in reverse: an abstraction accumulating boolean parameters is telling you its occurrences were never the same thing — inline it back.',
      ],
      whatBreaksWithoutIt: 'Abstract-on-first-sight produces frameworks for futures that never arrive; never-abstract produces 14 divergent copies of pagination logic with 14 distinct bugs.',
      interviewTip: 'Citing the rule of three when asked "would you extract this?" — and adding "duplication is cheaper than the wrong abstraction" — signals calibration, the thing senior interviews actually measure about patterns.',
    },
  ],

  revision: [
    { id: 'r-creational', topic: 'Creational: Factory, Builder, Singleton', importance: 4, thirtySecond: 'Factory centralizes which-type decisions behind an interface; Builder assembles complex objects stepwise with validation at build(); Singleton guarantees one instance — in JS, modules already are singletons, and DI beats global access for testability.', twoMinute: 'Factory: consumers depend on the contract; adding a type touches only the factory (plus it doubles as closure-based private state in JS). Builder: fluent chaining, immutable forks for test-data builders; usually an options object suffices in JS — know when not. Singleton: separate the two decisions — single lifetime (often right) vs global access (the harmful half); construct once at the composition root and inject.', deepDive: 'Abstract Factory = families of related products (theme → all themed components). Builder with phantom types can enforce call order at compile time. Module-as-singleton implications: import caching means shared mutable state across the app and ACROSS TESTS — the reason test runners isolate module registries. Prototype pattern is native: Object.create and structuredClone.', followUps: ['Singleton vs DI argument', 'Builder vs options object?'] },
    { id: 'r-structural', topic: 'Structural: Adapter, Facade, Decorator, Proxy, Composite', importance: 5, thirtySecond: 'Adapter changes an interface to match expectations; Facade designs a simpler one over a subsystem; Decorator keeps the interface and adds behavior; Proxy keeps it and controls access; Composite makes trees where leaf and group share a contract.', twoMinute: 'Distinguish by intent: adapter = translation (vendor migrations, zero call-site churn), facade = simplification (SDK wrappers, anti-corruption layers), decorator = layering (withRetry(withCache(fn)) — HOFs are decorators), proxy = gatekeeping (lazy init, permissions, tracking — Vue reactivity), composite = uniform trees (component tree, form groups, comment threads). All isolate change behind a wrap; the named intent is what code reviewers and interviewers check.', deepDive: 'Decorator ordering is semantic: cache-then-retry caches failures\' absence differently than retry-then-cache — be able to reason about an ordering. Proxy traps (get/set/has/deleteProperty/apply) + Reflect defaults; revocable proxies for teardown. Composite needs cycle guards when "trees" carry references. Facades drift toward god objects if they accrete business rules — keep them thin.', followUps: ['Four wraps, one HTTP client example — go', 'Why did Vue 3 need Proxy over defineProperty?'] },
    { id: 'r-behavioral', topic: 'Behavioral: Observer, Strategy, Command, Iterator, Chain', importance: 5, thirtySecond: 'Observer: subjects notify subscribed callbacks (events, watchers, reactivity — always pair with unsubscribe). Strategy: interchangeable algorithms behind one signature (function maps). Command: undoable/queueable action objects. Iterator: generators. Chain: middleware with (ctx, next).', twoMinute: 'Observer leak vector: the subject pins observers — teardown ties to lifecycle. Strategy in TS: Record<Key, Fn> with exhaustiveness from the union type. Command: execute/undo pairs, two-stack history, redo truncation on new actions; inverse ops beat snapshots when state is large. Generators: lazy, resumable, async iteration for paged APIs. Middleware: onion semantics — after-await-next runs on the way out; guard double next().', deepDive: 'Observer vs pub-sub precision: broker, role count, coupling, traceability. Strategy vs Command: how-chosen-by-caller vs what-with-lifecycle. State pattern (explicit state machines) kills boolean soup in UI — closest practical kin of these five. RxJS = observer + iterator fused (push streams with operators). Mediator appears when components over-chat: centralize the conversation.', followUps: ['Implement once() semantics safely', 'Undo in collaborative contexts — why Command wins'] },
    { id: 'r-observer-pubsub', topic: 'Observer vs Pub-Sub', importance: 4, thirtySecond: 'Observer: 2 roles, subject holds refs and notifies directly — synchronous, traceable, coupled. Pub-Sub: 3 roles, broker between publishers and subscribers who never meet — decoupled, often async, harder to trace.', twoMinute: 'DOM events/Vue watchers = observer (subscribe to a specific subject). Event bus/postMessage/queues = pub-sub (subscribe to topics). Consequences: observer flows read linearly in code; pub-sub flows need global search ("who handles cart:updated?"). Both demand teardown discipline. Bus guidance: fire-and-forget broadcasts yes, state transport no — state belongs where consumers are discoverable (stores/query cache).', deepDive: 'Vue reactivity is property-grained observer: deps map target → key → effects; get tracks, set triggers; flushing batches on microtasks so observers never see torn state. Pub-sub at infra scale (queues) adds delivery semantics: at-least-once forces idempotent handlers — the same pattern carries different contracts at different scales.', followUps: ['Which is addEventListener? Which is Kafka?', 'Defend/attack a global event bus'] },
    { id: 'r-vue-proxy', topic: 'Vue reactivity as Proxy + Observer', importance: 5, thirtySecond: 'reactive() wraps state in a Proxy: get trap tracks the running effect per property; set trap triggers exactly those effects. Fine-grained observer through language-level interception — the reason Vue re-renders surgically.', twoMinute: 'Deps structure: WeakMap(target) → Map(key) → Set(effects). Effects = renders, computeds, watchers. Vue 2\'s defineProperty couldn\'t see added keys, deletes, or index writes and walked objects eagerly; Proxy traps everything and wraps nested objects lazily. ref wraps primitives (unproxyable) in .value. Proxies cached per target (idempotent reactive()); flush batched on microtasks.', deepDive: 'Destructuring breaks reactivity because values escape the traps (toRefs preserves the link). computed = effect + dependency: tracked and tracking. shallowReactive/shallowRef skip deep wrapping for perf; toRaw/markRaw escape hatches for hot paths and foreign class instances. Same trap machinery implements immer drafts and mock libraries — one feature, many patterns.', followUps: ['Why does destructuring lose reactivity?', 'Build mini-reactive in 20 lines'] },
    { id: 'r-module-pattern', topic: 'Module / Revealing Module', importance: 4, thirtySecond: 'Closure-based encapsulation: private state in function scope, returned object is the public API. ES modules made files singletons of this pattern; factory functions and composables are its living form.', twoMinute: 'Classic IIFE form → modern factory: createCart() closes over private items, returns { add, total }. Privacy is real (unreachable, not convention). Every composable/hook is this pattern. Module-level singleton semantics: one evaluation, cached — convenient, but module-level mutable state is a hidden global with test-isolation costs.', deepDive: 'Closures vs classes: true privacy + no this hazards vs prototype memory sharing for many instances (per-instance closures duplicate functions). Revealing variant: return statement as API table of contents. The composition-root antidote to module singletons: export the FACTORY, construct at setup, inject — testability restored while keeping single lifetime.', followUps: ['Where exactly does the privacy come from?', 'Composable = module pattern — defend that claim'] },
    { id: 'r-solid', topic: 'SOLID with JS anchors', importance: 5, thirtySecond: 'S: one reason to change (split the god component). O: extend by adding strategies/plugins, not editing switches. L: subtypes keep base promises. I: narrow contracts — { log }, not appContext. D: logic depends on abstractions, concretes wired at the root. Thread: isolate change, depend on contracts.', twoMinute: 'Each with a sighting: S — api/composable/component split; O — notification channel registry; L — no ReadOnlyList throwing on add (model capabilities as separate interfaces instead); I — components taking 3 props not 30-field entities, Pick<> in TS; D — composable depends on ApiClient interface, axios injected. Calibration: apply where change pressure is real; speculative interfaces violate YAGNI.', deepDive: 'LSP is behavioral, beyond type systems: timing, errors, side-effect contracts. ISP + LSP interlock: narrow capability interfaces prevent substitution violations by construction. DIP is the principle; DI the mechanism; composition root the location. SOLID applies to modules and functions, not just classes — JS makes that obvious.', followUps: ['A real LSP violation you have seen', 'Which principle does a plugin system express?'] },
    { id: 'r-dry-yagni', topic: 'DRY / KISS / YAGNI & the wrong abstraction', importance: 4, thirtySecond: 'DRY is about knowledge, not text — merge only what changes for the same reason. KISS: complexity must be paid for by need. YAGNI: no speculative generality. Rule of three gates abstraction; duplication beats the wrong abstraction.', twoMinute: 'Wrong-abstraction lifecycle: coincidental merge → flag parameter → config monster nobody can change. Cure: inline back to call sites, let the real shape emerge, re-extract the proven core only. DRY misfires on coincidental similarity (two same-shaped functions, different business rules). YAGNI does not excuse skipping error handling/a11y — those are present requirements.', deepDive: 'Sandi Metz\'s formulation and the economics: a wrong abstraction taxes every future reader and resists removal (sunk-cost defenders); duplication stays malleable. Detection heuristics in review: boolean params steering big branches, config objects interpreting behavior, "almost fits" PRs adding flags. The senior skill is naming the inflection point where the third occurrence justifies extraction of the stable core.', followUps: ['Tell me about an abstraction you deleted', 'When is duplication correct?'] },
    { id: 'r-frontend-patterns', topic: 'Frontend patterns: container/presentational, slots, plugins, provider', importance: 4, thirtySecond: 'Container/presentational splits logic from rendering (modern form: composables hold the logic). Scoped slots/render props delegate markup to consumers — Strategy for rendering, the headless-UI mechanism. Plugins extend hosts through registered hooks. Provide/inject is DI through the tree.', twoMinute: 'Presentational components: props in, events out — pure, testable, design-system material. Headless libraries ship behavior (dropdown state machine, table sorting) and zero markup via slots — maximal reuse across designs. Plugin contract: register + lifecycle hooks + isolation (error boundaries, budgets) for third-party safety. Provider pattern kills prop drilling while keeping the contract explicit; the app setup is the frontend composition root.', deepDive: 'HOFs as decorators unify the utility belt: debounce/throttle/memoize/once/withRetry. State machines (State pattern) eliminate impossible boolean combinations — idle/loading/success/error as explicit states. Middleware in router guards and interceptors. Anti-patterns localized: god store (split by domain + kind), prop drilling (provider), effect spaghetti (derived state over imperative sync).', followUps: ['Design a headless autocomplete contract', 'Where is the composition root in a Vue app?'] },
    { id: 'r-middleware', topic: 'Middleware / Chain of Responsibility', importance: 4, thirtySecond: 'Handlers chained as (ctx, next): call next() to continue, skip it to short-circuit; async onion — code after await next() runs on the way out. Express, Koa, Redux, interceptors, router guards: one pattern.', twoMinute: 'compose mechanics: dispatch(i) gives middleware i a next that is dispatch(i+1); recursion builds the onion; awaits unwind it outward — outermost middleware brackets everything (timing, error catching). Guard double-next (index check). Ordering is semantic: auth before rate limit before handler. Context object is the data channel — keep it disciplined.', deepDive: 'Error middleware = outermost try/catch around the whole chain (Koa) vs error-signature handlers (Express next(err)). Typed context evolution in TS: middlewares refining ctx for downstream consumers. The pattern\'s value proposition is Open/Closed for cross-cutting concerns: add logging/auth/retry to a pipeline without touching handlers.', followUps: ['Implement compose with the double-next guard', 'Why does after-next code run in reverse order?'] },
    { id: 'r-command-undo', topic: 'Command & undo/redo', importance: 3, thirtySecond: 'Reify actions as { execute, undo } objects; history = two stacks (done/undone); new action truncates the redo branch. Inverse operations scale where snapshots cannot (large state, API-backed ops, collaborative selective undo).', twoMinute: 'Snapshot (memento) vs command cost curves: snapshots O(history × state) memory and cannot "undo" an API call; commands store deltas and encode compensating calls. Production needs: command merging (coalesce drags/keystrokes into one undo step), bounded history, labels for undo menus. Hybrid is legitimate: command architecture with small captured slices inside cheap commands.', deepDive: 'Collaborative undo: only YOUR operations — commands make ops attributable and selectively invertible; snapshots cannot express it (you would revert others\' work). Command also enables queues, macros, replay, and audit logs — the same reification serving different features. Relation to event sourcing: an event log is a command/event history made the source of truth.', followUps: ['Drag = 300 mutations: one undo step how?', 'Why do collaborative editors require command-style undo?'] },
    { id: 'r-anti-patterns', topic: 'Anti-patterns & cures', importance: 4, thirtySecond: 'God object: everything routes through one module — extract responsibilities behind interfaces, ratchet against regrowth. Spaghetti: no layering, effects at a distance — impose one-way dependencies. Premature abstraction: generic before two real cases — inline back. Cures are incremental, never rewrites.', twoMinute: 'Detection: god objects concentrate merge conflicts and test pain; spaghetti shows as "change here breaks there"; premature abstraction shows as flag-steered shared functions and 40-option frameworks with one consumer. Social root cause: god objects grow because they are the cheapest place to add code — fix incentives (ownership, lint max-lines, boundary rules) alongside the code. Also name: golden hammer, lava flow, cargo culting.', deepDive: 'Dismantling sequence for a god store: classify state by kind (most is server cache → query library), split client state per domain, ban new imports via lint allowlist, migrate consumers opportunistically with a visible metric. Characterization tests as the safety net for untestable monsters. The interview frame: anti-patterns are systems failures with social components — the cure includes the ratchet that prevents recurrence.', followUps: ['Dismantle a 3,000-line store without a freeze', 'Why do rewrites usually lose to ratchets?'] },
  ],
}

export default designPatterns
