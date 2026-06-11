import type { ConceptLesson } from '../../../types/lesson'

const eventEmitter: ConceptLesson = {
  // 1. Concept Summary
  slug: 'event-emitter',
  name: 'EventEmitter (implement)',
  category: 'design-patterns',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'EventEmitter is the concrete, named-event implementation of Pub/Sub — `on`, `off`, `once`, `emit` — and Node\'s entire ecosystem (streams, servers, sockets) is built on it.',
    'Implementing one from scratch is a top interview exercise because it tests Maps/Sets, closures, callback management, once-semantics, error handling, and clean teardown in one compact problem.',
    'Without an emitter (or its equivalent), modules must call each other directly, creating tight coupling; emitters let unrelated parts communicate through named events.',
    'It surfaces real bugs interviewers love: the MaxListenersExceededWarning leak, removing the right listener (especially a wrapped `once`), and mutating the listener list while emitting.',
    'Knowing the emitter API also unlocks Node streams, the DOM EventTarget, and browser event buses — the same model under different names.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An EventEmitter is like a school bell system: you tell it "ring for lunch" and everyone who agreed to listen for the lunch bell comes running.',
    story: [
      'In a school, different bells mean different things: one for lunch, one for the end of class, one for a fire drill.',
      'Teachers and students agree in advance which bell they care about — the lunch crowd listens for the lunch bell, the rest ignore it.',
      'When the office "emits" the lunch bell, only the people listening for lunch react; the office does not need to know their names.',
      'An EventEmitter is that bell system in code: you say emit("lunch") and every function that registered with on("lunch") runs — and you can stop listening with off("lunch").',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'An EventEmitter is an object that lets you give names to events and attach functions (listeners) to those names.',
    'You use on(name, fn) to start listening, emit(name, data) to fire all listeners for that name with some data, and off(name, fn) to stop listening.',
    'There is also once(name, fn), which listens just one time and then automatically removes itself — handy for one-off things like "when the connection opens".',
    'It keeps a little phone book inside: each event name maps to a list of functions to call, so emitting an event just means looking up that list and calling everyone on it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'An EventEmitter is an object implementing the publish/subscribe model with named events: `on` registers a listener for an event, `emit` synchronously invokes all listeners of that event with the emitted arguments, `off` removes a listener, and `once` registers a listener that auto-removes after its first call.',
    how: 'Internally it keeps a map from event name to a list of listener functions. on() pushes a listener; emit() looks up the list and calls each listener with the provided args; off() filters the listener out; once() wraps the listener so that after it runs it removes itself.',
    why: 'It decouples producers from consumers via event names, enabling event-driven code where many parts react to named happenings without referencing each other — the backbone of Node and many client architectures.',
    code: {
      label: 'A minimal EventEmitter',
      lang: 'js',
      code: `class EventEmitter {\n  #events = new Map()                  // name -> array of listeners\n  on(name, fn) {\n    if (!this.#events.has(name)) this.#events.set(name, [])\n    this.#events.get(name).push(fn)\n    return this                        // chainable\n  }\n  off(name, fn) {\n    const list = this.#events.get(name)\n    if (list) this.#events.set(name, list.filter((l) => l !== fn))\n    return this\n  }\n  emit(name, ...args) {\n    const list = this.#events.get(name)\n    if (!list) return false\n    ;[...list].forEach((fn) => fn(...args)) // snapshot for safety\n    return true\n  }\n}\n\nconst ee = new EventEmitter()\nconst greet = (n) => console.log('Hi', n)\nee.on('user', greet)\nee.emit('user', 'Sam') // Hi Sam\nee.off('user', greet)\nee.emit('user', 'Sam') // (nothing)`,
      explanation: [
        '`#events` is a private Map from event name to an array of listener functions.',
        'on() registers a listener under a name and returns `this` so calls can chain.',
        'emit() looks up the listeners for a name and calls each with the emitted args; it copies the list first so removals during emit are safe.',
        'off() removes a specific listener by identity (filter keeps everyone except it).',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'An EventEmitter is an object implementing topic-based publish/subscribe with named events, maintaining a registry mapping event names to ordered lists of listener callbacks. `on(name, fn)` appends a listener; `emit(name, ...args)` synchronously invokes each registered listener in insertion order with the supplied arguments; `off(name, fn)` removes a listener by reference; `once(name, fn)` registers a self-removing wrapper that detaches after a single invocation. It is the canonical concrete realization of the Observer/Pub-Sub pattern and underpins Node.js core (streams, net, http) and, in slightly different form, the DOM EventTarget.',

  // 7. Internal Working
  internalWorking: [
    'The emitter holds an internal map (object/Map) keyed by event name; each value is an ordered collection of listener functions.',
    'on(name, fn) ensures a bucket exists for the name and appends fn, preserving registration order (which dictates emit order).',
    'once(name, fn) creates a wrapper that calls fn once, then removes the wrapper from the bucket; off must remember the original fn so it can strip the matching wrapper.',
    'emit(name, ...args) reads the bucket, iterates a snapshot copy (so listeners added/removed during emit do not corrupt the loop), and calls each listener synchronously with the args.',
    'off(name, fn) finds and removes the listener (or its wrapper) by reference identity; an empty bucket may be deleted to reclaim memory.',
    'Because the emitter holds strong references to listeners, those listeners (and their captured closures) stay alive until removed — the source of the classic listener leak warning.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `             emit('data', payload)
                       │
                       ▼
           ┌──────────────────────────┐
           │   EventEmitter registry  │
           │  Map name -> [listeners] │
           │  'data'  -> [l1, l2, l3] │ ◄── on('data', lN) appends
           │  'error' -> [l4]         │
           │  'end'   -> [l5]         │
           └────────────┬─────────────┘
              lookup 'data', iterate snapshot
              ┌──────────┼──────────┐
              ▼          ▼          ▼
            l1(p)      l2(p)      l3(p)   (sync, in order)
        once wrapper removes itself after first emit`,

  // 9. Code Examples
  examples: {
    basic: {
      label: 'Basic — on / emit / off',
      lang: 'js',
      code: `const ee = new EventEmitter()\nconst log = (msg) => console.log('log:', msg)\nee.on('save', log)\nee.emit('save', 'doc1') // log: doc1\nee.emit('save', 'doc2') // log: doc2\nee.off('save', log)\nee.emit('save', 'doc3') // nothing`,
      explanation: [
        'on() subscribes the `log` listener to the "save" event.',
        'Each emit synchronously calls every listener for that event with the args.',
        'off() detaches the exact listener by identity, so later emits do nothing.',
      ],
    },
    intermediate: {
      label: 'Intermediate — once() with correct removal',
      lang: 'js',
      code: `class EventEmitter {\n  #events = new Map()\n  on(name, fn) {\n    (this.#events.get(name) ?? this.#events.set(name, []).get(name)).push(fn)\n    return this\n  }\n  off(name, fn) {\n    const list = this.#events.get(name)\n    if (list) this.#events.set(name, list.filter((l) => l !== fn && l.__orig !== fn))\n    return this\n  }\n  once(name, fn) {\n    const wrapper = (...args) => { this.off(name, wrapper); fn(...args) }\n    wrapper.__orig = fn            // remember original for off()\n    return this.on(name, wrapper)\n  }\n  emit(name, ...args) {\n    const list = this.#events.get(name)\n    if (!list) return false\n    ;[...list].forEach((fn) => fn(...args))\n    return true\n  }\n}\n\nconst ee = new EventEmitter()\nee.once('ready', () => console.log('ready fired'))\nee.emit('ready') // ready fired\nee.emit('ready') // nothing — auto-removed`,
      explanation: [
        'once() wraps the listener; the wrapper removes itself before calling fn, so it fires exactly once.',
        'Storing `__orig` lets off(name, originalFn) find and strip the wrapper too — a common interview gotcha.',
        'emit iterates a snapshot, so the wrapper removing itself mid-emit is safe.',
        'This matches Node EventEmitter\'s once + removeListener interplay.',
      ],
    },
    advanced: {
      label: 'Advanced — error isolation, error event, and max-listeners guard',
      lang: 'js',
      code: `class EventEmitter {\n  #events = new Map()\n  #max = 10\n  on(name, fn) {\n    const list = this.#events.get(name) ?? this.#events.set(name, []).get(name)\n    list.push(fn)\n    if (list.length > this.#max) console.warn('possible leak:', name, list.length)\n    return this\n  }\n  emit(name, ...args) {\n    const list = this.#events.get(name)\n    if (!list || list.length === 0) {\n      if (name === 'error') throw args[0] // Node convention: unhandled 'error' throws\n      return false\n    }\n    for (const fn of [...list]) {\n      try { fn(...args) } catch (e) {\n        if (name !== 'error') this.emit('error', e) // route listener failures\n      }\n    }\n    return true\n  }\n}`,
      explanation: [
        'A max-listeners threshold warns about probable leaks (Node throws MaxListenersExceededWarning) — a frequent production symptom.',
        'Following Node convention, emitting "error" with no listener throws, surfacing unhandled errors loudly.',
        'Each listener call is wrapped so one throwing listener does not abort the others; failures are routed to the "error" event.',
        'These are exactly the robustness details a senior is expected to add beyond on/emit.',
      ],
    },
    realProject: {
      label: 'Real project — Node stream + a Vue cross-component bus (mitt-style)',
      lang: 'js',
      code: `// Node: streams ARE EventEmitters\nimport { createReadStream } from 'node:fs'\nconst rs = createReadStream('big.log')\nrs.on('data', (chunk) => process.stdout.write(chunk.length + ' '))\nrs.once('end', () => console.log('done'))\nrs.on('error', (err) => console.error('stream failed', err))\n\n// Vue/React: a tiny event bus for cross-component messages\nconst bus = new EventEmitter()\n// component A\nbus.emit('cart:add', { id: 42 })\n// component B (subscribes on mount, off on unmount)\nconst handler = (item) => console.log('added', item)\nbus.on('cart:add', handler)\n// onUnmounted(() => bus.off('cart:add', handler))`,
      explanation: [
        'Node streams emit data/end/error events — consumers attach listeners exactly like our emitter.',
        '`once("end")` auto-detaches; an "error" listener is mandatory or an unhandled error crashes the process.',
        'In SPAs a shared emitter (like mitt) carries messages between unrelated components.',
        'The unmount cleanup (off) is essential — forgotten listeners on a global bus are a classic SPA memory leak.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is an EventEmitter and what are its core methods?',
      answer: 'It is an object implementing named-event pub/sub. Core methods: on(name, fn) to subscribe, emit(name, ...args) to fire all listeners of an event, off/removeListener(name, fn) to unsubscribe, and once(name, fn) to subscribe for a single invocation.',
      explanation: 'A strong answer lists the four methods and notes that emit is synchronous and calls listeners in registration order.',
    },
    {
      level: 'beginner',
      question: 'Is emit synchronous or asynchronous?',
      answer: 'Synchronous by default: emit calls every listener in order, one after another, before returning. Node\'s EventEmitter is synchronous; you must schedule (setImmediate/queueMicrotask) yourself if you want async dispatch.',
      explanation: 'Interviewers check that you know a slow listener blocks the emit call and all later listeners.',
    },
    {
      level: 'intermediate',
      question: 'How do you implement once() and why is removing it tricky?',
      answer: 'Wrap the listener: the wrapper removes itself then calls the original. The trick is off(): you must remove the wrapper, but the caller passes the ORIGINAL function. So store a reference from wrapper back to the original (e.g. wrapper.__orig = fn) and match on both in off().',
      explanation: 'This is the classic once/removeListener interaction bug — knowing the original-vs-wrapper identity issue is the differentiator.',
    },
    {
      level: 'intermediate',
      question: 'Why iterate a copy of the listeners array inside emit?',
      answer: 'Because a listener may add or remove listeners (including itself, as once does) during emit. Iterating the live array could skip or double-invoke listeners or throw; iterating a snapshot keeps the current emit stable and applies changes to the next emit.',
      explanation: 'Demonstrates awareness of reentrancy/mutation-during-iteration, a senior-level robustness concern.',
    },
    {
      level: 'advanced',
      question: 'How can EventEmitters cause memory leaks, and how does Node warn about it?',
      answer: 'The emitter holds strong references to listeners; if you keep adding without removing (e.g. re-subscribing on every render or never cleaning up on teardown), listeners and their captured closures pile up and never get GC\'d. Node emits a MaxListenersExceededWarning past the default 10 listeners per event to flag the likely leak.',
      explanation: 'Connects the pattern to a concrete production symptom and the fix: always off()/removeListener on cleanup, and bump max only when intentional.',
    },
    {
      level: 'senior',
      question: 'How is Node\'s EventEmitter different from the DOM EventTarget, and how do you handle errors?',
      answer: 'EventTarget uses addEventListener/dispatchEvent with Event objects, supports capture/bubble and AbortController-based removal, and does not have the special "error" event semantics. Node\'s EventEmitter is synchronous, uses arbitrary args, and treats "error" specially: emitting "error" with no listener throws. For robust emitters you isolate each listener in try/catch and route failures to an error channel.',
      explanation: 'Top-tier: distinguishing the two emitter families, the special error semantics, and AbortController-based cleanup shows broad, accurate platform knowledge.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you add prependListener or listener priority/ordering?',
    'How do you support wildcard or namespaced events (e.g. "user:*")?',
    'How does emitting "error" behave with no listeners in Node?',
    'How would you make emit asynchronous without losing ordering?',
    'How do you clean up all listeners at once (removeAllListeners / AbortController)?',
    'What is the difference between EventEmitter and an RxJS Subject?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Removing a once-listener by passing the original function but only matching the wrapper.',
      why: 'once wraps the listener, so the registered function is the wrapper, not the original — off() misses it.',
      fix: 'Store a back-reference (wrapper.__orig = fn) and match both the wrapper and the original in off().',
    },
    {
      mistake: 'Iterating the live listeners array during emit.',
      why: 'Listeners that subscribe/unsubscribe (or once removing itself) mutate the array mid-loop, skipping or double-calling listeners.',
      fix: 'Iterate over a snapshot copy ([...list]) so the in-progress emit is unaffected.',
    },
    {
      mistake: 'Never removing listeners (re-subscribing on every render or no teardown).',
      why: 'The emitter pins listeners and their closures alive, leaking memory; Node warns at >10 listeners.',
      fix: 'Always off()/removeListener on unmount/cleanup; use once for one-shot events; consider AbortController.',
    },
    {
      mistake: 'Letting one listener throw and break the rest, or ignoring the "error" event.',
      why: 'An unhandled throw aborts emit; an unhandled "error" event in Node throws and can crash the process.',
      fix: 'Wrap listener calls in try/catch, always attach an "error" listener, and route failures to an error channel.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'EventEmitter is foundational: streams (data/end/error), net/http servers (request/connection), child processes, and process (uncaughtException) all extend it. Stream backpressure and lifecycle are expressed via events.' },
    { area: 'Vue', detail: 'Cross-component buses (mitt is a tiny EventEmitter) carry app-wide messages; before Vue 3 removed it, $emit/$on was an emitter. Composables expose emitter-like on/off for custom events.' },
    { area: 'React', detail: 'Libraries use emitters for store change notifications and imperative events; the DOM EventTarget (addEventListener/dispatchEvent) is the browser\'s emitter, often paired with AbortController for cleanup.' },
    { area: 'Backend', detail: 'Domain-event buses inside services use emitters to decouple modules; WebSocket/Socket.IO servers expose on("connection")/socket.on(event) emitter APIs for real-time messaging.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'O(1) subscription and O(n) emit over only the listeners of one event — efficient targeted dispatch.',
      'Synchronous in-process dispatch has negligible overhead versus polling or direct coupling.',
    ],
    bad: [
      'Snapshotting the listener array on every emit allocates a temporary array — costly for very high-frequency events with many listeners.',
      'Many listeners on a hot event make each emit linear; a slow listener blocks all subsequent listeners synchronously.',
    ],
    optimizations: [
      'Avoid copying when no listener mutates during emit (e.g. iterate directly if you can guarantee stability), or reuse buffers in hot paths.',
      'Keep listener counts low; remove on cleanup to bound emit cost and prevent leaks.',
      'Offload heavy listener work to microtasks/queues so emit returns fast and slow consumers do not block others.',
      'Use namespaced/targeted events instead of one broad event with conditional listeners.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['observer-pattern', 'callbacks', 'higher-order-functions', 'closure'],
    nextConcepts: ['custom-events', 'event-system', 'event-delegation', 'websocket-sse', 'singleton-pattern'],
    dependencyNote:
      'EventEmitter is the concrete implementation of the Observer/Pub-Sub pattern, built from closures and stored callbacks. It precedes understanding the DOM event-system, custom events, and real-time transports (WebSocket/SSE); a shared emitter bus is frequently a singleton.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box "EventEmitter" containing a Map: name -> [listeners].',
      'Show on(name, fn) pushing fn into the bucket for that name.',
      'Show emit(name, ...args) looking up the bucket and calling each listener in order.',
      'Add once: draw a wrapper that calls fn then removes itself; note off must find the wrapper via __orig.',
      'Say: "emit is synchronous and ordered; I iterate a snapshot so once removing itself is safe, isolate listener errors, and always off on cleanup to avoid the listener leak."',
    ],
    diagram: `  EventEmitter
   #events: Map
     'data' -> [l1, l2]      on('data', l) → push
     'end'  -> [l3]
  emit('data', x):
     [...['data']].forEach(l => l(x))   ← snapshot, in order
  once(name, fn): wrapper = (...a)=>{off(name,wrapper); fn(...a)}
                  wrapper.__orig = fn   ← so off(name, fn) works`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'An EventEmitter is named-event pub/sub: a Map of event name to a list of listeners, with on to subscribe, emit to synchronously call all listeners in order, off to remove by identity, and once to subscribe for a single fire. Implementing it tests Maps/closures, the once-wrapper-vs-original removal gotcha, snapshot iteration during emit, and error isolation. It underlies Node streams/servers and SPA event buses. The classic production bug is leaking listeners (Node\'s MaxListenersExceededWarning) by never calling off on cleanup.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'An EventEmitter is the concrete, named-event form of the publish/subscribe pattern. Internally it keeps a map from event name to an ordered list of listener functions. on(name, fn) appends a listener; emit(name, ...args) looks up the listeners for that name and calls each one synchronously, in registration order, passing the arguments; off removes a listener by reference identity; and once registers a listener that auto-removes after its first call. When I implement it, a few details matter. once is implemented with a wrapper that removes itself before calling the original — and the subtle part is off: the caller passes the original function, but what is registered is the wrapper, so I store a back-reference from the wrapper to the original so off can find and strip it. Inside emit I iterate a snapshot copy of the listener array, because a listener — including a once wrapper removing itself — may mutate the list during emit, and iterating the live array would skip or double-call listeners. For robustness I wrap each listener call in try/catch so one throwing listener does not break the others, and I follow Node\'s convention that emitting an "error" event with no listener throws. The number-one production issue is leaks: the emitter holds strong references to listeners, so if you subscribe without ever removing — say on every render — listeners pile up; Node warns past ten listeners per event. The fix is always calling off on teardown, using once for one-shot events, or AbortController-style cleanup. This same model powers Node streams and servers and SPA event buses like mitt.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Synchronous emit gives deterministic ordering and easy debugging but lets a slow/throwing listener block everyone; async dispatch decouples but loses ordering and complicates error handling.',
      'Array (preserves order, simple) vs Set (auto-dedupes, O(1) removal but loses the once-wrapper identity trick) for storing listeners.',
      'A global emitter bus is convenient for cross-cutting events but reintroduces hidden coupling and leak risk — sometimes explicit props/DI is cleaner.',
    ],
    edgeCases: [
      'once + off identity: removing by original function requires mapping back from the wrapper.',
      'Reentrancy: a listener emitting the same event can recurse infinitely; guard or document.',
      'Unhandled "error" event throwing in Node — can crash the process if no listener is attached.',
      'Listener added during its own emit should NOT fire in that same emit (snapshot ensures this).',
    ],
    runtimeBehavior: [
      'emit blocks until all listeners complete; total emit time is the sum of listener times.',
      'Listeners and their closures are strongly referenced until removed — the GC retention/leak vector.',
      'Snapshot copying allocates per emit; in extreme hot paths this is measurable.',
    ],
    scalability: [
      'In-process emitters scale to high event rates if listener counts stay small and work stays light; offload heavy work to queues.',
      'For cross-service scale, replace the in-process emitter with a real broker (Kafka/Redis/NATS) and reason about delivery guarantees and backpressure.',
    ],
    productionConcerns: [
      'Audit every on() for a matching off() on teardown; treat the MaxListenersExceededWarning as a real leak signal, not noise.',
      'Always attach an "error" listener on Node emitters/streams to avoid process crashes.',
      'Prefer AbortController/removeAllListeners for bulk cleanup, and avoid re-subscribing inside render/effect bodies without cleanup.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'EventEmitter = named-event pub/sub: on, emit, off, once.',
    'Internals: Map(name -> [listeners]); emit looks up + calls each.',
    'emit is SYNCHRONOUS and runs listeners in registration order.',
    'once = self-removing wrapper; store wrapper.__orig so off(original) works.',
    'Iterate a SNAPSHOT in emit (safe sub/unsub during emit).',
    'Wrap listener calls in try/catch to isolate failures.',
    'Node convention: emit("error") with no listener THROWS.',
    'Leak source: never removing listeners → MaxListenersExceededWarning (>10).',
    'Always off()/removeListener on teardown; use AbortController for bulk.',
    'Node streams/servers ARE EventEmitters; DOM uses EventTarget instead.',
    'Return `this` from on/off/once for chaining.',
    'For cross-service scale, use a real broker (Kafka/Redis/NATS).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Implement on(name, fn), emit(name, ...args), and off(name, fn) on an EventEmitter class.',
      hint: 'Use a Map of name -> array of listeners.',
      solution: {
        lang: 'js',
        code: `class EventEmitter {\n  #e = new Map()\n  on(name, fn) { (this.#e.get(name) ?? this.#e.set(name, []).get(name)).push(fn); return this }\n  off(name, fn) { const l = this.#e.get(name); if (l) this.#e.set(name, l.filter((x) => x !== fn)); return this }\n  emit(name, ...args) { (this.#e.get(name) ?? []).slice().forEach((fn) => fn(...args)); return this }\n}\nconst ee = new EventEmitter()\nconst f = (x) => console.log(x)\nee.on('go', f); ee.emit('go', 1); ee.off('go', f); ee.emit('go', 2)`,
        explanation: [
          'A Map stores listener arrays per event name.',
          'emit slices (snapshots) the array before iterating for safety.',
          'off removes by reference identity using filter.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add once(name, fn) so the listener fires exactly once, and make off(name, originalFn) able to remove it before it fires.',
      hint: 'Wrap fn; store the original on the wrapper; match both in off.',
      solution: {
        lang: 'js',
        code: `class EventEmitter {\n  #e = new Map()\n  on(name, fn) { (this.#e.get(name) ?? this.#e.set(name, []).get(name)).push(fn); return this }\n  off(name, fn) {\n    const l = this.#e.get(name)\n    if (l) this.#e.set(name, l.filter((x) => x !== fn && x.__orig !== fn))\n    return this\n  }\n  once(name, fn) {\n    const w = (...a) => { this.off(name, w); fn(...a) }\n    w.__orig = fn\n    return this.on(name, w)\n  }\n  emit(name, ...args) { (this.#e.get(name) ?? []).slice().forEach((fn) => fn(...args)); return this }\n}\nconst ee = new EventEmitter()\nconst once = () => console.log('once!')\nee.once('ping', once)\nee.emit('ping') // once!\nee.emit('ping') // nothing`,
        explanation: [
          'The wrapper removes itself before calling the original, guaranteeing a single fire.',
          'w.__orig lets off(name, original) strip the wrapper even before it fires.',
          'This mirrors Node\'s once/removeListener relationship.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make emit robust: a listener throwing must not stop the others, and emitting "error" with no listener must throw.',
      hint: 'try/catch per listener; special-case the "error" event with empty list.',
      solution: {
        lang: 'js',
        code: `class EventEmitter {\n  #e = new Map()\n  on(name, fn) { (this.#e.get(name) ?? this.#e.set(name, []).get(name)).push(fn); return this }\n  emit(name, ...args) {\n    const l = this.#e.get(name)\n    if (!l || l.length === 0) {\n      if (name === 'error') throw args[0] ?? new Error('Unhandled error event')\n      return false\n    }\n    for (const fn of l.slice()) {\n      try { fn(...args) } catch (e) { if (name !== 'error') this.emit('error', e) }\n    }\n    return true\n  }\n}\nconst ee = new EventEmitter()\nee.on('error', (e) => console.log('caught:', e.message))\nee.on('go', () => { throw new Error('boom') })\nee.on('go', () => console.log('still runs'))\nee.emit('go') // caught: boom, then still runs`,
        explanation: [
          'Each listener runs in its own try/catch, so a throw is isolated.',
          'Listener failures are routed to the "error" event for centralized handling.',
          'An "error" emit with no listener throws, matching Node and surfacing bugs loudly.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a full EventEmitter with on/once/off/emit/removeAllListeners and a max-listeners leak warning, then demo a leak being caught.',
      hint: 'Track listener count per event; warn past a threshold; provide removeAllListeners(name?).',
      solution: {
        lang: 'js',
        code: `class EventEmitter {\n  #e = new Map()\n  #max = 10\n  setMaxListeners(n) { this.#max = n; return this }\n  on(name, fn) {\n    const l = this.#e.get(name) ?? this.#e.set(name, []).get(name)\n    l.push(fn)\n    if (l.length > this.#max) console.warn('possible leak on', name, '->', l.length)\n    return this\n  }\n  once(name, fn) {\n    const w = (...a) => { this.off(name, w); fn(...a) }\n    w.__orig = fn\n    return this.on(name, w)\n  }\n  off(name, fn) {\n    const l = this.#e.get(name)\n    if (l) this.#e.set(name, l.filter((x) => x !== fn && x.__orig !== fn))\n    return this\n  }\n  emit(name, ...args) {\n    const l = this.#e.get(name)\n    if (!l || !l.length) return false\n    for (const fn of l.slice()) { try { fn(...args) } catch (e) { console.error(e) } }\n    return true\n  }\n  removeAllListeners(name) {\n    if (name) this.#e.delete(name); else this.#e.clear()\n    return this\n  }\n}\n\nconst ee = new EventEmitter()\nfor (let i = 0; i < 12; i++) ee.on('tick', () => {}) // warns at 11\nee.removeAllListeners('tick') // cleanup`,
        explanation: [
          'A per-event count check warns past the threshold — the same leak signal Node gives.',
          'once/off cooperate via __orig; emit isolates listener errors.',
          'removeAllListeners gives bulk cleanup, the practical fix for accumulated listeners.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Implementing an EventEmitter is one of the most common "build this primitive" interview tasks because it compresses Maps, closures, callback management, once-semantics, and cleanup into one problem. Nail it and you demonstrate both pattern knowledge and careful, production-aware engineering.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) usually ask the API definition and a basic on/emit/off. Product companies (Zoho, Flipkart, Razorpay) ask you to implement once and off correctly and discuss leaks. FAANG-level interviews push on snapshot iteration, error isolation, the Node "error" semantics, max-listeners leaks, and contrasts with EventTarget/RxJS.',
    whatInterviewersExpect:
      'Build on/emit/off cleanly with a Map, implement once with the wrapper-plus-__orig removal trick, iterate a snapshot in emit, isolate listener errors, and proactively mention the listener-leak/cleanup story for senior credit.',
  },
}

export default eventEmitter
