import type { ConceptLesson } from '../../../types/lesson'

const observerPattern: ConceptLesson = {
  // 1. Concept Summary
  slug: 'observer-pattern',
  name: 'Observer vs Pub/Sub',
  category: 'design-patterns',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'The Observer pattern is how one object tells many others "something changed" without knowing who they are — the foundation of reactivity, events, and decoupled architecture.',
    'It powers the things you use constantly: DOM events, Vue/React reactivity, RxJS, Redux/Pinia subscriptions, WebSocket clients, and EventEmitter — all are observer variants.',
    'Without it, components would have to poll each other or hold hard references, producing tight coupling and brittle, untestable code.',
    'Interviewers ask it to test whether you understand decoupling, the subtle difference between Observer and Pub/Sub, and the #1 real bug it causes: memory leaks from forgotten unsubscribes.',
    'Knowing Observer vs Pub/Sub (direct subject-to-observer vs a broker/event bus in the middle) signals you can reason about coupling and message flow at an architectural level.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Observer is like subscribing to a YouTube channel: when the creator posts a video, everyone who subscribed gets a notification — the creator does not call each fan personally.',
    story: [
      'Imagine your favourite YouTuber. You click "Subscribe" so you get told whenever they post something new.',
      'When they upload a video, YouTube sends a "ding!" to every subscriber at once. The creator does not need your phone number — they just post, and all subscribers find out.',
      'If you stop caring, you click "Unsubscribe" and the dings stop coming to you, but everyone else still gets them.',
      'In code, the "creator" is a subject and the "subscribers" are observers. When the subject changes, it notifies every observer that signed up — and any observer can unsubscribe to stop hearing about it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes one thing changes and several other things need to know about it — like a scoreboard that many displays should update from.',
    'The Observer pattern lets interested objects "subscribe" to a subject. When the subject changes, it loops through its list of subscribers and calls each one to say "hey, I changed".',
    'This keeps the subject from needing to know exactly who is listening; it just keeps a list and notifies everyone on it.',
    'Pub/Sub is a close cousin: instead of subscribing directly to the subject, you subscribe to a middle-man (an event channel), and publishers send messages there — so publishers and subscribers never even know about each other.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The Observer Pattern is a behavioral pattern where a subject maintains a list of dependents (observers) and notifies them automatically when its state changes, usually by calling a method/callback they registered. Pub/Sub is a related pattern that inserts a broker (event bus) between publishers and subscribers so the two sides are fully decoupled.',
    how: 'Observers register via a subscribe method that stores their callback; when something changes, the subject iterates its subscribers and invokes each callback with the new data. Subscribe returns an unsubscribe function so observers can detach. In Pub/Sub, publishers emit to a named topic on the broker and the broker fans the message out to that topic\'s subscribers.',
    why: 'It decouples the producer of a change from its consumers, enabling one-to-many updates, reactive UIs, and event-driven systems where new listeners can be added or removed without touching the subject.',
    code: {
      label: 'A minimal Subject (Observer)',
      lang: 'js',
      code: `class Subject {\n  constructor() { this.observers = new Set() }\n  subscribe(fn) {\n    this.observers.add(fn)\n    return () => this.observers.delete(fn) // unsubscribe\n  }\n  notify(data) {\n    this.observers.forEach((fn) => fn(data))\n  }\n}\n\nconst news = new Subject()\nconst off = news.subscribe((headline) => console.log('A:', headline))\nnews.subscribe((headline) => console.log('B:', headline))\nnews.notify('JS is fun') // A: JS is fun  B: JS is fun\noff()                    // A unsubscribes\nnews.notify('Round 2')   // B: Round 2`,
      explanation: [
        '`observers` is the subject\'s list of registered callbacks (a Set avoids duplicates).',
        'subscribe() stores the callback and returns a function to remove it — clean teardown.',
        'notify() loops over all observers and calls each with the new data (one-to-many).',
        'After `off()`, observer A is removed, so only B hears the next notification.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Observer Pattern is a behavioral design pattern establishing a one-to-many dependency: a subject holds a collection of observers and, on state change, invokes a known notification interface on each so they update themselves. It decouples the subject from concrete observer types — the subject knows only that observers conform to an update contract. Publish/Subscribe is a variant that introduces an intermediary message broker keyed by topics/channels: publishers emit events to topics without references to subscribers, and the broker dispatches to subscribers of that topic, achieving complete spatial decoupling between producers and consumers.',

  // 7. Internal Working
  internalWorking: [
    'The subject maintains an internal collection (array/Set/Map) of registered observers or callbacks.',
    'An observer registers via subscribe/addEventListener/on; the subject stores the reference and typically returns or supports an unsubscribe handle.',
    'When the subject\'s state changes, it enters a notification phase and iterates its collection, invoking each observer\'s update callback synchronously (by default) with the relevant payload.',
    'Each observer runs its own logic in response; the subject does not depend on what any observer does, only that it can be called.',
    'Unsubscribing removes the reference from the collection so the observer is skipped on future notifications and becomes eligible for garbage collection once otherwise unreachable.',
    'In Pub/Sub, the broker keeps a map of topic -> subscriber list; publish() looks up the topic and fans the message to its subscribers, so neither side holds a reference to the other.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  OBSERVER (direct)                  PUB/SUB (via broker)

    ┌─────────┐                        ┌───────────┐
    │ Subject │                        │ Publisher │
    └────┬────┘                        └─────┬─────┘
   notify│ knows its observers           emit│ (knows only topic)
    ┌────┼────┐                              ▼
    ▼    ▼    ▼                        ┌────────────┐
  Obs1  Obs2  Obs3                     │   BROKER   │  topic map
  (subject holds refs)                 │ 'news'->[] │
                                       └─────┬──────┘
                                    fan-out  │ (knows subscribers)
                                       ┌─────┼─────┐
                                       ▼     ▼     ▼
                                     Sub1   Sub2   Sub3
                              publisher & subscribers never meet`,

  // 9. Code Examples
  examples: {
    basic: {
      label: 'Basic — observer with unsubscribe',
      lang: 'js',
      code: `function createObservable(initial) {\n  let value = initial\n  const subs = new Set()\n  return {\n    get: () => value,\n    set(next) { value = next; subs.forEach((fn) => fn(next)) },\n    subscribe(fn) { subs.add(fn); return () => subs.delete(fn) },\n  }\n}\n\nconst temp = createObservable(20)\nconst stop = temp.subscribe((t) => console.log('Temp is', t))\ntemp.set(25) // Temp is 25\nstop()\ntemp.set(30) // (silent)`,
      explanation: [
        'The observable holds a value plus a set of subscriber callbacks.',
        'set() updates the value and notifies every subscriber (one-to-many).',
        'subscribe() returns a teardown function — calling it stops notifications.',
        'This is the core shape of Vue refs, RxJS BehaviorSubject, and store subscriptions.',
      ],
    },
    intermediate: {
      label: 'Intermediate — Pub/Sub event bus with topics',
      lang: 'js',
      code: `function createEventBus() {\n  const topics = new Map()\n  return {\n    subscribe(topic, fn) {\n      if (!topics.has(topic)) topics.set(topic, new Set())\n      topics.get(topic).add(fn)\n      return () => topics.get(topic)?.delete(fn)\n    },\n    publish(topic, payload) {\n      topics.get(topic)?.forEach((fn) => fn(payload))\n    },\n  }\n}\n\nconst bus = createEventBus()\nbus.subscribe('user:login', (u) => console.log('analytics', u))\nbus.subscribe('user:login', (u) => console.log('welcome', u))\nbus.publish('user:login', { id: 1 }) // both fire`,
      explanation: [
        'The broker keys subscribers by topic, so publishers only need the topic name.',
        'Publishers and subscribers never reference each other — full decoupling.',
        'publish() fans the payload out only to subscribers of that exact topic.',
        'This is the classic event-bus / mediator used to wire unrelated modules.',
      ],
    },
    advanced: {
      label: 'Advanced — safe notify (error isolation + snapshot iteration)',
      lang: 'js',
      code: `class SafeSubject {\n  #observers = new Set()\n  subscribe(fn) {\n    this.#observers.add(fn)\n    return () => this.#observers.delete(fn)\n  }\n  notify(data) {\n    // iterate a snapshot so unsubscribing during notify is safe\n    for (const fn of [...this.#observers]) {\n      try {\n        fn(data)\n      } catch (err) {\n        console.error('observer threw, others continue:', err)\n      }\n    }\n  }\n}\n\nconst s = new SafeSubject()\ns.subscribe(() => { throw new Error('boom') })\nconst off = s.subscribe(() => console.log('still runs'))\ns.notify('x') // logs the error, then "still runs"`,
      explanation: [
        'Iterating a copied snapshot (`[...]`) prevents bugs when an observer unsubscribes during notification.',
        'Wrapping each call in try/catch isolates a faulty observer so one failure does not break the rest.',
        'Private #observers hides the list so no one can corrupt the subscription set.',
        'These are the exact robustness concerns a senior is expected to raise.',
      ],
    },
    realProject: {
      label: 'Real project — store subscription in Vue/Redux style',
      lang: 'js',
      code: `// a tiny reactive store (Observer under the hood)\nfunction createStore(reducer, initial) {\n  let state = initial\n  const listeners = new Set()\n  return {\n    getState: () => state,\n    dispatch(action) {\n      state = reducer(state, action)\n      listeners.forEach((l) => l(state)) // notify subscribers\n    },\n    subscribe(l) { listeners.add(l); return () => listeners.delete(l) },\n  }\n}\n\nconst store = createStore((s, a) => a.type === 'inc' ? { n: s.n + 1 } : s, { n: 0 })\n// in a component\nconst unsubscribe = store.subscribe((s) => render(s.n))\nstore.dispatch({ type: 'inc' })\n// on unmount\nunsubscribe()`,
      explanation: [
        'Redux/Vuex/Pinia store subscriptions are the Observer pattern: dispatch changes state and notifies listeners.',
        'Components subscribe to re-render on change and MUST unsubscribe on unmount to avoid leaks.',
        'The store does not know about components — only that listeners are callable (decoupling).',
        'This is how reactive UIs propagate state changes to many views from one source.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the Observer Pattern?',
      answer: 'A behavioral pattern where a subject keeps a list of observers and notifies them automatically whenever its state changes, creating a one-to-many dependency. Observers subscribe to be notified and can unsubscribe to stop.',
      explanation: 'A strong answer mentions one-to-many, automatic notification, and subscribe/unsubscribe, with an example like DOM events or a store subscription.',
    },
    {
      level: 'beginner',
      question: 'Give real-world examples of the Observer pattern in JavaScript.',
      answer: 'DOM addEventListener, Vue/React reactivity, RxJS Observables, Redux/Pinia store subscriptions, Node EventEmitter, and WebSocket onmessage handlers.',
      explanation: 'Interviewers want recognition that most "event" and "reactive" APIs are observer variants, not just a textbook class.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between Observer and Pub/Sub?',
      answer: 'In Observer, the subject holds direct references to its observers and notifies them itself — they are coupled by reference. In Pub/Sub, a broker/event bus sits in the middle keyed by topics; publishers emit to topics and the broker dispatches to subscribers, so publishers and subscribers never reference each other.',
      explanation: 'The key distinction is the broker and the resulting degree of decoupling. Mentioning topics and that Pub/Sub is usually more loosely coupled (and often async) is the differentiator.',
    },
    {
      level: 'intermediate',
      question: 'Why must observers be able to unsubscribe?',
      answer: 'Because the subject holds references to observer callbacks; if you never unsubscribe, those callbacks (and everything they capture) stay reachable and cannot be garbage collected, causing memory leaks, and they keep firing after the observer is logically gone.',
      explanation: 'This is the #1 real production bug with the pattern — forgotten listeners. A good answer ties it to component unmount cleanup.',
    },
    {
      level: 'advanced',
      question: 'What problems arise if an observer unsubscribes or throws during notification?',
      answer: 'Mutating the observer collection while iterating it can skip or double-invoke observers; iterate a snapshot copy to be safe. A thrown error in one observer can abort the loop and prevent later observers from being notified; wrap each call in try/catch to isolate failures.',
      explanation: 'Senior signal: anticipating reentrancy and error-isolation issues, not just the happy path.',
    },
    {
      level: 'senior',
      question: 'How do reactive systems (Vue, RxJS) build on the Observer pattern, and what do they add?',
      answer: 'Vue tracks dependencies automatically: reading a reactive value during a computation registers the current effect as an observer, and writing notifies those effects — push-based fine-grained reactivity. RxJS adds composable streams with operators, lazy cold/hot observables, scheduling, error/completion channels, and backpressure-like control. Both extend the bare subject-observer link with dependency tracking, lifecycle, and composition.',
      explanation: 'Top-tier answer: connects the primitive pattern to production reactivity engines and names the value-adds (auto dependency tracking, operators, lifecycle, error channels).',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you prevent memory leaks from forgotten subscriptions?',
    'Is notification synchronous or asynchronous, and why does it matter?',
    'How do you make notification order deterministic?',
    'What happens if an observer subscribes/unsubscribes during a notify loop?',
    'How is Pub/Sub different from the Mediator pattern?',
    'How does Vue\'s reactivity automatically track which effects observe a value?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Never unsubscribing observers (especially on component unmount).',
      why: 'The subject keeps the callback reference alive, leaking memory and firing stale handlers on dead components.',
      fix: 'Always store and call the unsubscribe handle in cleanup (onUnmounted / useEffect return / AbortController).',
    },
    {
      mistake: 'Mutating the observer list while iterating during notify.',
      why: 'Adding/removing observers mid-loop can skip observers or throw, depending on the collection type.',
      fix: 'Iterate over a snapshot copy (`[...observers]`) so mid-notify changes apply to the next notification.',
    },
    {
      mistake: 'Letting one observer throw and break the whole notification.',
      why: 'An unhandled error in the loop aborts notification for all remaining observers.',
      fix: 'Wrap each observer call in try/catch (or queue microtasks) to isolate failures.',
    },
    {
      mistake: 'Confusing Observer with Pub/Sub in design discussions.',
      why: 'They differ in coupling: Observer is direct subject-to-observer; Pub/Sub routes through a broker by topic.',
      fix: 'Use Pub/Sub when producers and consumers should not know each other; use Observer for direct, typed one-to-many updates.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'The reactivity system is observer-based: effects/watchers subscribe to reactive deps and re-run on change; `watch`/`watchEffect` register observers and return stop handles; a global event bus (mitt) is Pub/Sub.' },
    { area: 'React', detail: 'Redux store.subscribe, Zustand/Jotai subscriptions, and useSyncExternalStore are Observer; React Query notifies subscribed components on cache updates. Cleanup functions unsubscribe to avoid leaks.' },
    { area: 'Node.js', detail: 'EventEmitter is the canonical Observer/Pub/Sub: streams, HTTP servers, and process events emit to registered listeners; message brokers (Redis pub/sub, Kafka) are distributed Pub/Sub.' },
    { area: 'Backend', detail: 'Event-driven architectures use Pub/Sub brokers (Kafka, RabbitMQ, SNS/SQS) so services emit domain events without knowing consumers, enabling decoupled, scalable systems.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Push-based notification is efficient: observers update only when something actually changes, avoiding polling.',
      'Decoupling lets you add/remove consumers without touching producers, keeping hot paths lean.',
    ],
    bad: [
      'A subject with thousands of observers makes every notify O(n); a chatty subject can dominate CPU.',
      'Synchronous notification means a slow observer blocks all others and the emitter — cascading jank.',
    ],
    optimizations: [
      'Batch or debounce notifications so rapid changes coalesce into one update (Vue batches in a microtask).',
      'Unsubscribe aggressively to keep the observer list small and prevent leaks.',
      'Use microtask/async dispatch for heavy observers so one slow listener does not block the emit loop.',
      'For very large fan-out, partition observers by topic so each publish touches only relevant subscribers.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['closure', 'callbacks', 'higher-order-functions', 'event-system'],
    nextConcepts: ['event-emitter', 'custom-events', 'event-delegation', 'strategy-pattern', 'singleton-pattern'],
    dependencyNote:
      'Observer builds on callbacks/higher-order functions (observers are stored callbacks) and underlies the DOM event-system. It leads directly to implementing an EventEmitter (a Pub/Sub broker), custom events, and reactive stores; event buses are often singletons.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a Subject box on the left with a list inside labeled "observers".',
      'Draw three observer boxes on the right and arrows from the subject to each labeled "notify(data)".',
      'Show subscribe() adding to the list and unsubscribe() removing from it.',
      'For Pub/Sub, draw a Broker box in the middle with a topic map; publisher -> broker -> subscribers.',
      'Say: "Observer = subject knows its observers and notifies them directly; Pub/Sub adds a broker keyed by topic so publishers and subscribers never reference each other. The critical detail is unsubscribe, or you leak memory."',
    ],
    diagram: `  ┌─────────┐ subscribe  ┌──────────┐
  │ Subject │◄───────────│ Observer │
  │ [o1,o2] │ notify(d)  └──────────┘
  └────┬────┘──────────► Observer1, Observer2 ...
       │ unsubscribe removes from list
  PUB/SUB:  Publisher ─emit('t')─► [BROKER topic 't'] ─► Sub1, Sub2`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The Observer Pattern is a one-to-many dependency: a subject keeps a list of observers and notifies them automatically when its state changes; observers subscribe and get an unsubscribe handle. Pub/Sub is the same idea but adds a broker keyed by topics, so publishers and subscribers never reference each other — looser coupling. It powers DOM events, Vue/React reactivity, RxJS, store subscriptions, and EventEmitter. The classic bug is forgetting to unsubscribe, which leaks memory and fires stale handlers; the senior concerns are snapshot iteration during notify and isolating observer errors.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Observer Pattern is a behavioral pattern that creates a one-to-many relationship: a subject maintains a list of observers and, whenever its state changes, automatically notifies each one by invoking a callback they registered. Observers subscribe to express interest and, crucially, get back an unsubscribe handle so they can detach. The point is decoupling — the subject does not know the concrete types of its observers, only that it can call them, so you can add or remove consumers without touching the producer. Pub/Sub is a closely related variant that inserts a broker, or event bus, between the two sides: publishers emit to a named topic and the broker fans the message out to that topic\'s subscribers, so publishers and subscribers never even hold references to each other — that is maximum decoupling, and it is often asynchronous. This pattern is everywhere: DOM addEventListener, Vue and React reactivity, RxJS observables, Redux and Pinia store subscriptions, and Node\'s EventEmitter are all observer variants. The number one real-world bug is forgetting to unsubscribe — because the subject holds the callback reference, the observer and everything it captures stay alive, leaking memory and firing on dead components, which is why frameworks tie cleanup to unmount. At a senior level I also iterate over a snapshot of the observer list so subscribing or unsubscribing mid-notify is safe, and wrap each observer call in try/catch so one faulty observer does not break notification for the rest.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Decoupling vs traceability: observers make flow flexible but the implicit "who reacts to what" is hard to follow and debug compared to direct calls.',
      'Observer (direct refs) vs Pub/Sub (broker): direct is simpler and typed but couples by reference; broker is looser and scalable but adds indirection and weaker typing.',
      'Sync notification is predictable and ordered but lets one observer block all; async decouples timing but loses ordering guarantees and complicates error handling.',
    ],
    edgeCases: [
      'Reentrancy: an observer that subscribes/unsubscribes or triggers another notify during notification — iterate a snapshot and guard against infinite loops.',
      'Ordering: Set/array iteration order vs priority requirements; some systems need deterministic or prioritized dispatch.',
      'Error in one observer aborting the loop — must isolate per-observer.',
      'Duplicate subscriptions: subscribing the same callback twice fires it twice unless deduped (use a Set).',
    ],
    runtimeBehavior: [
      'Notification is synchronous by default, so the emit call does not return until all observers have run.',
      'The subject pins observer callbacks (and their captured closures) in memory until unsubscribed — the leak vector.',
      'Frameworks like Vue batch notifications into a microtask to coalesce multiple synchronous mutations into one update.',
    ],
    scalability: [
      'Fan-out cost grows linearly with observer count; very large fan-out benefits from topic partitioning or batching.',
      'Distributed Pub/Sub (Kafka, Redis, SNS/SQS) scales the pattern across services with at-least-once/at-most-once delivery semantics to reason about.',
    ],
    productionConcerns: [
      'Leak audits: ensure every subscribe has a matching unsubscribe on teardown (AbortController, onUnmounted, effect cleanup).',
      'Observability: log/trace event flow since implicit wiring is hard to debug; name topics clearly.',
      'Backpressure and slow consumers in async/distributed Pub/Sub must be handled to avoid unbounded queues.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Observer = one-to-many: subject notifies its registered observers on change.',
    'subscribe() stores a callback and returns an unsubscribe handle.',
    'Pub/Sub = Observer + a broker keyed by topics → publishers & subscribers never meet.',
    'Powers: DOM events, Vue/React reactivity, RxJS, store subscriptions, EventEmitter.',
    'Default notification is SYNCHRONOUS and runs in subscription order.',
    'Biggest bug: forgetting to unsubscribe → memory leak + stale handlers.',
    'Iterate a SNAPSHOT during notify (sub/unsub mid-loop is safe).',
    'Wrap each observer call in try/catch to isolate failures.',
    'Use a Set to dedupe and to cheaply add/remove observers.',
    'Batch/debounce notifications to coalesce rapid changes.',
    'Observer = coupled by reference; Pub/Sub = decoupled via topic.',
    'Distributed Pub/Sub: Kafka, Redis pub/sub, SNS/SQS.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a Subject with subscribe(fn) returning an unsubscribe function, and notify(data) that calls all subscribers.',
      hint: 'Store callbacks in a Set; return () => set.delete(fn).',
      solution: {
        lang: 'js',
        code: `class Subject {\n  constructor() { this.subs = new Set() }\n  subscribe(fn) { this.subs.add(fn); return () => this.subs.delete(fn) }\n  notify(data) { this.subs.forEach((fn) => fn(data)) }\n}\nconst s = new Subject()\nconst off = s.subscribe((d) => console.log(d))\ns.notify('hi') // hi\noff()\ns.notify('bye') // silent`,
        explanation: [
          'A Set holds subscribers and avoids duplicates.',
          'subscribe returns a teardown closure so observers can detach.',
          'notify fans the data out to every current subscriber.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a Pub/Sub bus with subscribe(topic, fn), unsubscribe via returned handle, and publish(topic, payload).',
      hint: 'Use a Map of topic -> Set of callbacks.',
      solution: {
        lang: 'js',
        code: `function createBus() {\n  const topics = new Map()\n  return {\n    subscribe(topic, fn) {\n      const set = topics.get(topic) ?? topics.set(topic, new Set()).get(topic)\n      set.add(fn)\n      return () => set.delete(fn)\n    },\n    publish(topic, payload) {\n      topics.get(topic)?.forEach((fn) => fn(payload))\n    },\n  }\n}\nconst bus = createBus()\nconst off = bus.subscribe('ping', (n) => console.log('got', n))\nbus.publish('ping', 1) // got 1\noff()\nbus.publish('ping', 2) // silent`,
        explanation: [
          'Topics map each channel name to its own subscriber Set.',
          'publish only touches subscribers of that exact topic.',
          'Publishers and subscribers are fully decoupled via the topic name.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make notify() safe: it must not break if an observer unsubscribes during notification, and one observer throwing must not stop the others.',
      hint: 'Iterate a snapshot copy and wrap each call in try/catch.',
      solution: {
        lang: 'js',
        code: `class SafeSubject {\n  #subs = new Set()\n  subscribe(fn) { this.#subs.add(fn); return () => this.#subs.delete(fn) }\n  notify(data) {\n    for (const fn of [...this.#subs]) {        // snapshot\n      try { fn(data) } catch (e) { console.error('observer failed', e) }\n    }\n  }\n}\nconst s = new SafeSubject()\nlet off2\nconst off1 = s.subscribe(() => { off2() })   // unsubscribes another mid-notify\noff2 = s.subscribe(() => { throw new Error('x') })\ns.subscribe(() => console.log('safe'))\ns.notify(1) // no crash; logs error then "safe"`,
        explanation: [
          'Copying to an array means mid-notify unsubscribes do not corrupt the current loop.',
          'try/catch isolates the throwing observer so later observers still run.',
          'These two guards make a production-grade subject.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement an observable counter store with getState/increment/subscribe, used by two "views" that both update, then unsubscribe one and show only the other updates.',
      hint: 'Keep state + a Set of listeners; notify on every state change.',
      solution: {
        lang: 'js',
        code: `function createCounterStore() {\n  let state = { count: 0 }\n  const listeners = new Set()\n  return {\n    getState: () => state,\n    increment() { state = { count: state.count + 1 }; listeners.forEach((l) => l(state)) },\n    subscribe(l) { listeners.add(l); return () => listeners.delete(l) },\n  }\n}\n\nconst store = createCounterStore()\nconst offA = store.subscribe((s) => console.log('View A:', s.count))\nstore.subscribe((s) => console.log('View B:', s.count))\nstore.increment() // View A: 1  View B: 1\noffA()            // View A unmounts\nstore.increment() // View B: 2`,
        explanation: [
          'increment() updates immutable state and notifies all listeners — the Observer core of Redux/Pinia.',
          'Both views react to the first change; this is one-to-many propagation.',
          'After offA(), only View B is notified — exactly how unsubscribe-on-unmount prevents stale updates and leaks.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Observer/Pub-Sub is the mental model behind every reactive framework and event-driven system you will ever work in. Understanding it — and the Observer-vs-Pub/Sub coupling distinction — lets you reason about Vue/React internals, message brokers, and decoupled architecture with confidence.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and a basic subject/observer implementation. Product companies (Zoho, Flipkart, Razorpay) ask you to build a Pub/Sub event bus or a store with subscribe/unsubscribe and discuss leaks. FAANG-level interviews probe reentrancy/error isolation, sync-vs-async notification, batching, and how reactive engines (Vue, RxJS) and distributed brokers (Kafka) extend the pattern.',
    whatInterviewersExpect:
      'Define one-to-many with subscribe/unsubscribe, distinguish Observer from Pub/Sub (broker + topics), implement a clean subject and event bus, and proactively raise the leak/unsubscribe issue plus snapshot-iteration and error-isolation for senior credit.',
  },
}

export default observerPattern
