import type { ConceptLesson } from '../../../types/lesson'

const whatIsJavascript: ConceptLesson = {
  // 1. Concept Summary
  slug: 'what-is-javascript',
  name: 'What is JavaScript',
  category: 'fundamentals-engine',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'JavaScript is the only language that runs natively in every web browser — if you build for the web, you cannot avoid it.',
    'It now runs everywhere: browsers, servers (Node.js), mobile apps, desktop apps (Electron), and even embedded devices, so one language unlocks the whole stack.',
    'Knowing what JavaScript actually IS (a high-level, dynamically typed, single-threaded, interpreted-then-JIT-compiled language) prevents whole categories of confusion about types, async, and performance.',
    'Interviewers open with this to calibrate you: a precise answer signals you understand the language as a system, not just syntax you memorized.',
    'Misunderstanding its nature (e.g. thinking it is multithreaded, or the same as Java) leads to broken mental models that cause real bugs later.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'JavaScript is the set of instructions that makes a web page come alive, like the strings that make a puppet move.',
    story: [
      'Imagine a picture of a puppet pinned to a wall. It looks nice but it cannot do anything — it just hangs there.',
      'HTML is the puppet itself (its body and clothes), and CSS is the paint and decoration that makes it pretty.',
      'JavaScript is the invisible hand and strings: when you click a button, JavaScript pulls a string and the puppet waves, or a hidden box pops open, or the colours change.',
      'So a web page made only of HTML and CSS is a still puppet; JavaScript is what makes it react to you and move. The browser is the puppet theatre that already knows how to read JavaScript and follow its instructions.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript is a programming language that web browsers can read and run all by themselves, without you installing anything extra.',
    'You write instructions like "when the user clicks this button, show that message," and the browser carries them out instantly.',
    'It is called a "high-level" language because it is close to human language and hides the messy hardware details, and "dynamic" because a variable can hold a number now and text later.',
    'Originally it only ran inside browsers, but today special programs like Node.js let the same language run on servers and computers too.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'JavaScript is a high-level, dynamically typed, single-threaded, multi-paradigm programming language standardized as ECMAScript. It is the language of the web, executed by an engine (such as V8) embedded in browsers and runtimes like Node.js.',
    how: 'You write source text; an engine parses it, interprets it, and just-in-time compiles hot paths to machine code. The host environment (browser or Node) provides extra APIs (DOM, fetch, fs) on top of the core language.',
    why: 'It exists to make web pages interactive and, more broadly, to give one portable language for client and server. Its dynamic, forgiving nature makes it fast to prototype with.',
    code: {
      label: 'JavaScript reacting to a user',
      lang: 'js',
      code: `// core language: variables, functions, types\nlet clicks = 0\n\nfunction handleClick() {\n  clicks++                       // a number, no type declared\n  return 'Clicked ' + clicks + ' times'  // dynamic: number becomes string\n}\n\n// host API (browser) wired to the language\nconsole.log(handleClick()) // "Clicked 1 times"\nconsole.log(handleClick()) // "Clicked 2 times"`,
      explanation: [
        '`let clicks = 0` declares a variable with no type — JavaScript infers it is a number.',
        'The function uses `clicks` and increments it; nothing forced us to declare a return type.',
        'The `+` operator coerces the number into a string automatically — a hallmark of the dynamic, loosely typed nature.',
        '`console.log` is not part of the core language — it is provided by the host (browser/Node), showing the split between language and environment.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'JavaScript is a high-level, multi-paradigm (imperative, functional, object-oriented via prototypes), dynamically and weakly typed, single-threaded programming language conforming to the ECMAScript specification (ECMA-262). It uses prototype-based inheritance and first-class functions, runs on an event-loop concurrency model, and is executed by an engine that parses source to an AST, interprets bytecode, and JIT-compiles hot code to native machine code. The language core is small; capabilities like the DOM, timers, and I/O come from the host environment, not the language itself.',

  // 7. Internal Working
  internalWorking: [
    'The host environment (browser or Node.js) loads the JavaScript source text and hands it to the embedded engine (e.g. V8 in Chrome/Node, SpiderMonkey in Firefox).',
    'The engine tokenizes (lexes) and parses the source into an Abstract Syntax Tree (AST) representing the program structure.',
    'An interpreter (Ignition in V8) walks the AST and produces bytecode, which it executes immediately so the program starts running fast.',
    'A profiler watches which functions run often ("hot"); those are sent to an optimizing JIT compiler (TurboFan) that emits highly optimized machine code.',
    'Code runs on a single main thread driven by an event loop: synchronous code runs to completion, then queued callbacks (timers, promises, events) run, giving the illusion of concurrency.',
    'The host injects extra objects and APIs (window, document, fetch, process, fs) into the global scope so the language can interact with the outside world.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        YOUR SOURCE CODE (.js text)
                  │
                  ▼
        ┌───────────────────────┐
        │   JavaScript ENGINE   │   (V8, SpiderMonkey, JSC)
        │  parse → AST          │
        │  interpret → bytecode │
        │  JIT hot code → native│
        └───────────┬───────────┘
                    │ runs on
                    ▼
        ┌───────────────────────┐
        │   SINGLE MAIN THREAD  │  ←─ event loop pulls callbacks
        └───────────┬───────────┘
                    │ talks to
                    ▼
        ┌───────────────────────┐
        │   HOST ENVIRONMENT    │  Browser: DOM, fetch, timers
        │  (provides Web/Node   │  Node:    fs, http, process
        │   APIs)               │
        └───────────────────────┘`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — dynamic typing in action',
      lang: 'js',
      code: `let value = 42        // number\nvalue = 'forty-two'   // now a string — totally legal\nvalue = true          // now a boolean\nconsole.log(typeof value) // "boolean"`,
      explanation: [
        'A single variable holds different types over time — JavaScript is dynamically typed.',
        'No compiler complains about changing the type of `value`.',
        '`typeof` reports the current runtime type, which is `boolean` at the end.',
        'This flexibility is convenient but is also why type bugs slip through without TypeScript or tests.',
      ],
    },
    intermediate: {
      label: 'Intermediate — same language, two environments',
      lang: 'js',
      code: `// Browser-only: relies on host DOM API\ndocument.querySelector('#title').textContent = 'Hello'\n\n// Node-only: relies on host fs API\n// const fs = require('fs')\n// fs.writeFileSync('out.txt', 'Hello')\n\n// Core language: works EVERYWHERE\nconst greet = (name) => 'Hello, ' + name\nconsole.log(greet('world'))`,
      explanation: [
        '`document` exists only in browsers; it is a host API, not part of JavaScript.',
        '`fs` exists only in Node.js; it is that runtime\'s host API.',
        'The arrow function and string concatenation are pure language features and run in any engine.',
        'This split is the single most important thing beginners miss: the language is small, the environment adds the rest.',
      ],
    },
    advanced: {
      label: 'Advanced — single-threaded but non-blocking',
      lang: 'js',
      code: `console.log('1: start')\n\nsetTimeout(() => console.log('3: timer'), 0)\n\nPromise.resolve().then(() => console.log('2: microtask'))\n\nconsole.log('1.5: end of sync')`,
      explanation: [
        'All synchronous lines run first on the single thread: "1: start" then "1.5: end of sync".',
        'The promise callback (a microtask) runs next, before the timer: "2: microtask".',
        'The timer callback (a macrotask) runs last: "3: timer", even though its delay is 0.',
        'This proves JavaScript is single-threaded with an event loop — concurrency comes from scheduling, not from multiple threads.',
      ],
    },
    realProject: {
      label: 'Real project — language vs framework in Vue/Node',
      lang: 'js',
      code: `// Vue component method — plain JS functions + reactivity from the framework\nexport default {\n  data: () => ({ count: 0 }),\n  methods: {\n    increment() { this.count++ }   // core JS: object method, this, ++\n  }\n}\n\n// Node API route — plain JS async + host http/server provided by Node/Express\n// app.get('/health', (req, res) => res.json({ ok: true }))`,
      explanation: [
        'Vue\'s reactivity is a framework layer, but `increment` is just an ordinary JavaScript method using `this` and `++`.',
        'The Node route handler is a normal JS arrow function; `req`/`res` and the server come from the host runtime and framework.',
        'Understanding what is "the language" versus "the platform" lets you reason about portability and debug across environments.',
        'In interviews this distinction shows maturity: you know `fetch` and `setTimeout` are host features, not JavaScript itself.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is JavaScript?',
      answer: 'JavaScript is a high-level, dynamically typed, single-threaded programming language that conforms to the ECMAScript standard. It is the language of the web, running in browsers and in server runtimes like Node.js to make applications interactive.',
      explanation: 'A strong answer names a few defining traits (high-level, dynamic, single-threaded, ECMAScript) rather than just saying "it makes websites work."',
    },
    {
      level: 'beginner',
      question: 'Is JavaScript the same as Java?',
      answer: 'No. Despite the similar name (a marketing decision in 1995), they are unrelated languages. Java is statically typed, class-based, and compiled to bytecode for the JVM; JavaScript is dynamically typed, prototype-based, and runs in a JS engine.',
      explanation: 'A classic warm-up. The interviewer is checking you are not confused by the name and know the basic typing/inheritance differences.',
    },
    {
      level: 'intermediate',
      question: 'Is JavaScript interpreted or compiled?',
      answer: 'Both, in practice. Modern engines first interpret bytecode for a fast start, then just-in-time (JIT) compile frequently executed "hot" code to optimized machine code. So it behaves like an interpreted language but achieves near-native speed on hot paths.',
      explanation: 'The mature answer rejects the false binary and explains the interpret-then-JIT pipeline used by V8 and others.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between JavaScript the language and the browser/Node APIs?',
      answer: 'The language (ECMAScript) gives you syntax, types, functions, objects, and the event loop semantics. APIs like the DOM, fetch, localStorage, setTimeout, or Node\'s fs and http are provided by the host environment, not the language core.',
      explanation: 'This shows you understand portability: code using only the language runs anywhere; code using host APIs only runs where those APIs exist.',
    },
    {
      level: 'advanced',
      question: 'JavaScript is single-threaded — how does it handle concurrency?',
      answer: 'Through an event loop and asynchronous, non-blocking APIs. The single thread runs synchronous code to completion, then processes queued callbacks (microtasks like promises first, then macrotasks like timers/events). Long-running work can be offloaded to Web Workers or the host\'s thread pool.',
      explanation: 'Senior signal: connecting "single-threaded" to the event loop, the microtask/macrotask split, and offloading strategies.',
    },
    {
      level: 'senior',
      question: 'Why does the same JavaScript code sometimes behave or perform differently across browsers?',
      answer: 'Each browser ships a different engine (V8, SpiderMonkey, JavaScriptCore) and a different version of the host APIs. Engines implement the same ECMAScript spec but differ in optimization heuristics, supported newer features, and bug edge cases; host APIs differ in availability and behavior. Hence feature detection, polyfills, and transpilation (Babel) are used.',
      explanation: 'Demonstrates awareness of the spec-vs-implementation gap and the real-world tooling that bridges it.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What does ECMAScript have to do with JavaScript?',
    'What is a JavaScript engine and can you name a few?',
    'What is the difference between JavaScript and TypeScript?',
    'What does "dynamically typed" mean and what are its downsides?',
    'How does JavaScript run on a server if it started as a browser language?',
    'What is the difference between client-side and server-side JavaScript?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Confusing JavaScript with Java.',
      why: 'The names are similar by historical accident, leading people to assume shared design, typing, or syntax.',
      fix: 'Remember: different creators, different paradigms (prototype vs class), different typing (dynamic vs static). The name was marketing.',
    },
    {
      mistake: 'Assuming JavaScript is multithreaded because async exists.',
      why: 'Async code feels parallel, so people think multiple JS threads run at once.',
      fix: 'JavaScript runs on a single main thread; concurrency comes from the event loop scheduling callbacks. True parallelism needs Web Workers or separate processes.',
    },
    {
      mistake: 'Treating DOM/fetch/setTimeout as part of the JavaScript language.',
      why: 'They are always available in browsers, so they feel built in.',
      fix: 'These are host APIs. Knowing the boundary explains why such code fails or differs in Node, Workers, or other environments.',
    },
    {
      mistake: 'Calling JavaScript "just an interpreted/slow language".',
      why: 'It is an outdated view from before modern JIT engines.',
      fix: 'Explain interpret-then-JIT compilation; hot code reaches near-native performance.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue single-file components are compiled to render functions that are ultimately plain JavaScript; the framework adds reactivity but everything runs as JS in the browser engine.' },
    { area: 'React', detail: 'JSX is transpiled (by Babel/SWC) to JavaScript function calls (createElement / jsx); the resulting JS runs in the browser, demonstrating the language-vs-syntax-sugar distinction.' },
    { area: 'Node.js', detail: 'The same language powers backends: HTTP servers, CLIs, and build tools all run on V8 via Node, with host APIs (fs, http, streams) replacing browser APIs.' },
    { area: 'Backend', detail: 'Edge runtimes (Cloudflare Workers, Deno, Bun) run JavaScript/TypeScript with their own host APIs, so teams reuse one language across client, server, and edge.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Modern JIT engines compile hot code to optimized machine code, so well-written JavaScript is fast enough for most application work.',
      'Non-blocking async I/O lets a single thread handle many concurrent requests efficiently (the Node.js model).',
    ],
    bad: [
      'Long synchronous tasks block the single main thread, freezing the UI or stalling the server event loop.',
      'Dynamic typing and frequent type changes (megamorphic code) can defeat engine optimizations and slow hot paths.',
    ],
    optimizations: [
      'Keep main-thread tasks short; offload CPU-heavy work to Web Workers or background processes.',
      'Write monomorphic, predictable code (consistent object shapes and argument types) so the JIT can optimize.',
      'Use async APIs for I/O so the thread stays free, and batch DOM work to avoid layout thrashing.',
      'Profile with DevTools/Node profilers before optimizing — measure, do not guess.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Client-side JavaScript is fully visible and modifiable by users, so it can never be trusted for security decisions (validation, authorization).',
      'Because it can manipulate the DOM and make network requests, malicious JS injected via XSS can steal data or impersonate users.',
    ],
    bestPractices: [
      'Always re-validate and authorize on the server; treat the client as untrusted.',
      'Prevent XSS by escaping output and using a Content Security Policy; never put secrets in client-side JavaScript.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: [],
    nextConcepts: ['ecmascript', 'javascript-engines', 'data-types', 'event-loop', 'var-let-const'],
    dependencyNote:
      'This is the entry point of the whole map. From here you branch into the standard (ecmascript), the runtime (javascript-engines, event-loop), and the basic building blocks (data-types, var-let-const).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write three boxes: HTML (structure), CSS (style), JavaScript (behavior).',
      'Draw an arrow from JS into the page saying "makes it interactive / reacts to events".',
      'Below JS, draw the ENGINE box: parse → interpret → JIT compile.',
      'Draw a single thread line with an event loop circling it, queuing callbacks.',
      'Say: "JavaScript is a high-level, dynamic, single-threaded language run by an engine; the browser or Node adds APIs on top."',
    ],
    diagram: `  HTML(structure) + CSS(style) + JS(behavior)
                                  │
                                  ▼
                    ENGINE: parse→interpret→JIT
                                  │
                          single thread + event loop
                                  │
                      host APIs (DOM/fetch  or  fs/http)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JavaScript is a high-level, dynamically typed, single-threaded programming language defined by the ECMAScript standard. An engine like V8 parses it, interprets bytecode, and JIT-compiles hot code to native speed. It runs on one main thread with an event loop for concurrency. The language core is small; the DOM, fetch, timers, and Node\'s fs/http are host APIs added by the environment. The same language now runs in browsers, servers, and the edge.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript is a high-level, dynamically typed, multi-paradigm programming language that conforms to the ECMAScript specification. It started in 1995 as the scripting language for browsers, to make pages interactive — responding to clicks, updating the DOM, talking to servers. A JavaScript engine such as V8 runs it: it parses the source into an AST, interprets it as bytecode for a fast start, and just-in-time compiles frequently run code into optimized machine code, so it is neither purely interpreted nor purely compiled. It is single-threaded, but it feels concurrent because of the event loop, which runs synchronous code to completion and then drains queued callbacks — microtasks like promises before macrotasks like timers. An important distinction is between the language and the host: things like the DOM, fetch, localStorage, and setTimeout are provided by the browser, while fs and http are provided by Node — they are not part of the language itself. That is why pure language code is portable but host-dependent code is not. Today the same language runs in browsers, on servers via Node, and at the edge via Deno, Bun, and Workers, which is a big reason it is so widely used. It is forgiving and quick to prototype with, but its dynamic typing means type errors surface at runtime unless you add TypeScript or tests.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Dynamic typing speeds prototyping but pushes type errors to runtime; teams adopt TypeScript to claw back static guarantees.',
      'Single-threaded model simplifies reasoning (no data races on shared memory by default) but means one heavy task blocks everything, forcing offloading patterns.',
    ],
    edgeCases: [
      'Same code can use newer syntax unsupported by an older engine, requiring transpilation/polyfills.',
      'Floating-point math and loose equality produce surprising results (0.1 + 0.2, == coercion) rooted in language design.',
      'Host API differences (e.g. cookie behavior, timer clamping) cause environment-specific bugs.',
    ],
    runtimeBehavior: [
      'Interpret-then-JIT means the first runs of a function are slower; steady-state is much faster after optimization.',
      'The engine can deoptimize hot code if assumptions (object shapes, argument types) change, causing performance cliffs.',
      'Concurrency is cooperative: nothing preempts a running synchronous task, so long tasks delay all pending work.',
    ],
    scalability: [
      'Node scales I/O-bound workloads well on one thread via async; CPU-bound work needs worker threads or clustering across cores.',
      'In the browser, keeping main-thread tasks under ~50ms protects responsiveness (ties into Core Web Vitals / INP).',
    ],
    productionConcerns: [
      'Cross-engine and cross-version compatibility drives build pipelines (Babel, browserslist, polyfills).',
      'Client code is untrusted and inspectable, so security and validation must live on the server.',
      'Bundle size and parse/compile cost of JavaScript directly affect page load; ship less JS and split it.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'JavaScript = high-level, dynamic, weakly typed, single-threaded language.',
    'Standardized as ECMAScript (ECMA-262), maintained by TC39.',
    'NOT Java — similar name, unrelated languages.',
    'Run by an engine: parse → AST → interpret bytecode → JIT compile hot code.',
    'Single main thread + event loop = concurrency without parallelism.',
    'Microtasks (promises) run before macrotasks (timers/events).',
    'Language core is small; DOM/fetch/timers (browser) and fs/http (Node) are host APIs.',
    'Runs everywhere: browser, Node, Deno, Bun, edge workers.',
    'Multi-paradigm: imperative, functional, prototype-based OO.',
    'Client-side JS is visible/untrusted — never trust it for security.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function `describe(value)` that returns a string like "number: 42" using the value\'s runtime type.',
      hint: 'Use typeof to read the dynamic type.',
      solution: {
        lang: 'js',
        code: `function describe(value) {\n  return typeof value + ': ' + value\n}\ndescribe(42)      // "number: 42"\ndescribe('hi')    // "string: hi"\ndescribe(true)    // "boolean: true"`,
        explanation: [
          '`typeof` returns the current runtime type as a string.',
          'String concatenation coerces the value into text — pure dynamic-language behavior.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Predict and then verify the console output order of a sync log, a setTimeout(…,0), and a Promise.resolve().then.',
      hint: 'Sync first, then microtasks, then macrotasks.',
      solution: {
        lang: 'js',
        code: `console.log('A')\nsetTimeout(() => console.log('C'), 0)\nPromise.resolve().then(() => console.log('B'))\nconsole.log('A2')\n// Output: A, A2, B, C`,
        explanation: [
          'Synchronous logs run first in order: A, A2.',
          'The promise callback is a microtask and runs before timers: B.',
          'The timer callback is a macrotask and runs last: C — demonstrating the single-threaded event loop.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write code that runs unchanged in both a browser and Node by avoiding host-specific APIs, and explain why it is portable.',
      hint: 'Stick to the language core: variables, functions, math, console.',
      solution: {
        lang: 'js',
        code: `// Portable: uses only language features (and console, which both provide)\nfunction sumRange(n) {\n  let total = 0\n  for (let i = 1; i <= n; i++) total += i\n  return total\n}\nconsole.log(sumRange(100)) // 5050 in browser AND Node`,
        explanation: [
          'No DOM, no fetch, no fs — only language constructs (let, for, arithmetic, function).',
          'Because the code touches only ECMAScript features, any compliant engine runs it identically.',
          '`console.log` happens to exist in both environments, so the example stays runnable everywhere.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain in code why blocking the main thread is dangerous, then show a non-blocking alternative.',
      hint: 'A long synchronous loop freezes everything; async/scheduling frees the thread.',
      solution: {
        lang: 'js',
        code: `// BAD: blocks the single thread — UI/server frozen for the whole loop\nfunction blockingCount() {\n  const end = Date.now() + 2000\n  while (Date.now() < end) {}   // busy-wait, nothing else can run\n  return 'done'\n}\n\n// BETTER: yield back to the event loop\nfunction nonBlockingCount() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve('done'), 2000) // thread stays free meanwhile\n  })\n}`,
        explanation: [
          'The busy-wait loop monopolizes the only thread, so no clicks, renders, or other callbacks run for 2 seconds.',
          'The async version schedules work via the event loop and immediately frees the thread for other tasks.',
          'This is the practical consequence of JavaScript being single-threaded — never block the loop.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This is the foundation everything else builds on. A crisp, system-level answer (language vs engine vs host, single-threaded event loop, interpret-then-JIT) immediately signals you understand JavaScript as a platform, not just syntax — and it frames every later topic.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the plain "What is JavaScript?" and "Is it the same as Java?" as warm-ups. Product companies (Zoho, Flipkart, Razorpay) probe interpreted-vs-compiled and the single-threaded model. FAANG-level interviews expect spec-vs-engine nuance, the event loop, and cross-engine compatibility concerns.',
    whatInterviewersExpect:
      'They expect more than "it makes websites interactive": name a few defining traits, distinguish the language from host APIs, explain interpret-then-JIT and the single-threaded event loop, and avoid the Java confusion.',
  },
}

export default whatIsJavascript
