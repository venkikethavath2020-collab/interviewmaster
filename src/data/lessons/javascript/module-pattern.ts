import type { ConceptLesson } from '../../../types/lesson'

const modulePattern: ConceptLesson = {
  // 1. Concept Summary
  slug: 'module-pattern',
  name: 'Module Pattern',
  category: 'design-patterns',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'The module pattern was JavaScript\'s original answer to "how do I get private state and avoid polluting the global namespace" — before ES modules and class # fields existed.',
    'It is the clearest practical demonstration of closures doing real work: an IIFE returns an object whose methods close over private variables.',
    'Understanding it explains how almost every library historically exposed a clean public API while hiding internals.',
    'Interviewers use it to test whether you can combine closures, IIFEs, and encapsulation into a real design, not just recite definitions.',
    'Its ideas live on in the singleton pattern, in factory functions, and in the public/private structure of modern ES modules and composables.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The module pattern is a vending machine: you can press the buttons, but you can\'t reach inside to grab the snacks directly.',
    story: [
      'Imagine a vending machine full of snacks. The snacks and the money box are locked inside where you cannot touch them.',
      'On the outside there are just a few buttons: put in money, pick a snack, get change.',
      'You use the machine through those buttons only — you never open it up and rearrange the snacks yourself.',
      'A module in code works the same way: it keeps its important stuff locked inside (private), and only gives you a few safe buttons (public functions) to use it. That keeps everything tidy and stops anyone from messing with the insides.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you write a lot of code, you do not want every variable to be visible everywhere — that gets messy and things clash.',
    'The module pattern wraps some code in a function that runs immediately, creating a private space inside it.',
    'Inside that space you keep your private variables and helper functions; then you RETURN an object with only the few functions you want others to use.',
    'Because of closures, those returned functions still remember and can use the private variables, even though nobody outside can see them directly. So you get a clean public "interface" hiding the private "implementation".',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The module pattern is a design pattern that uses an Immediately Invoked Function Expression (IIFE) to create a private scope and returns an object exposing only a controlled public API, while keeping internal state and helpers private via closures.',
    how: 'You wrap code in an IIFE. Variables declared inside are private (not on the global scope). The IIFE returns an object whose methods close over those private variables, so they can read/mutate them while outside code cannot.',
    why: 'Before ES modules, this was the way to get true privacy and avoid global-namespace pollution. It enforces encapsulation: callers depend only on the public API, and you can change internals freely without breaking them.',
    code: {
      label: 'A counter module',
      lang: 'js',
      code: `const counter = (function () {\n  let count = 0           // private — not accessible outside\n  function log() {        // private helper\n    console.log('count is', count)\n  }\n  return {                // public API\n    increment() { count++; log() },\n    decrement() { count--; log() },\n    value() { return count },\n  }\n})()\n\ncounter.increment()  // count is 1\ncounter.increment()  // count is 2\ncounter.value()      // 2\n// counter.count → undefined (private!)`,
      explanation: [
        'The IIFE runs once, creating a private scope holding count and the log helper.',
        'It returns an object with three methods — the only things the outside world can touch.',
        'Each returned method closes over count, so they share and persist the same private state.',
        'counter.count is undefined: count is not a property, it lives only in the closure.',
        'This gives a clean public API (increment/decrement/value) over a hidden implementation.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The module pattern is a structural design pattern that leverages an IIFE to establish a private lexical scope and returns a public interface object whose methods are closures over that scope. Private members (state and helper functions) remain inaccessible from outside, while the returned API provides controlled access, achieving encapsulation and avoiding global-namespace pollution. Variants include the Revealing Module Pattern (define everything privately, then return an object mapping public names to private references) and the augmenting/loose-augmentation forms used to extend a module across files. It is the closure-based precursor to ES modules and to class private (#) fields.',

  // 7. Internal Working
  internalWorking: [
    'The IIFE is a function expression invoked immediately; invoking it creates a new execution context with its own variable environment.',
    'Variables and functions declared inside that scope are local — they are never attached to the global object, so they do not pollute or collide.',
    'The IIFE constructs and returns an object literal whose method properties are functions defined inside the IIFE.',
    'Each returned method captures the IIFE\'s lexical environment via its [[Environment]] reference — a closure over the private members.',
    'After the IIFE returns, its execution context is popped, but because the returned object (and its methods) is still reachable, the private environment is kept alive on the heap.',
    'Subsequent calls to the public methods resolve private variables by walking the scope chain to that retained environment, so private state persists and is shared across all methods of the module.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   (function () {            ◄── IIFE: runs once, makes a private scope
        let count = 0        ◄── PRIVATE (heap, kept alive)
        function log() {...} ◄── PRIVATE helper
        return {             ┐
          increment, ───────┐│  PUBLIC API object (the only exit)
          value      ───────┼┘
        }                    ┘
   })()  ──► const counter ──► { increment, value }
                                   │  closures
                                   ▼
                         still reach count & log
   outside: counter.count === undefined  (no leak)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: the IIFE\'s frame exists only while it runs; once it returns, the frame is popped.',
    'HEAP: the returned API object and the private environment record (holding count, log) live on the heap.',
    'REFERENCES: the outer variable (counter) → API object → method closures → [[Environment]] → private record. Every link is reachable, so GC keeps the private state.',
    'If you drop the only reference to the module (counter = null) and nothing else holds it, the whole private environment becomes collectable.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — namespacing to avoid globals',
      lang: 'js',
      code: `const MathUtils = (function () {\n  const PI = 3.14159 // private constant\n  return {\n    circleArea(r) { return PI * r * r },\n    circleCircumference(r) { return 2 * PI * r },\n  }\n})()\n\nMathUtils.circleArea(2) // 12.56636\n// PI is not global and not accessible directly`,
      explanation: [
        'Everything is wrapped so only MathUtils enters the outer scope — one name instead of many.',
        'PI is private; callers use the public methods, not the constant.',
        'This was the classic way to ship a library as a single namespaced object.',
        'No global pollution means fewer naming collisions with other scripts.',
      ],
    },
    intermediate: {
      label: 'Intermediate — the Revealing Module Pattern',
      lang: 'js',
      code: `const userStore = (function () {\n  let users = []                       // private state\n  function add(user) { users.push(user) }\n  function remove(id) { users = users.filter((u) => u.id !== id) }\n  function count() { return users.length }\n  function privateValidate(u) { return !!u.id } // stays private\n\n  return {                             // reveal only chosen names\n    add,\n    remove,\n    count,\n  }\n})()`,
      explanation: [
        'You define ALL functions privately first, then return an object mapping public names to them.',
        'It reads cleanly: the return block is a clear table of contents of the public API.',
        'privateValidate is simply not included in the return, so it stays internal.',
        'A caveat: if a public method is reassigned, revealed references can get out of sync — a known nuance.',
      ],
    },
    advanced: {
      label: 'Advanced — parameterized module (factory-style) + augmentation',
      lang: 'js',
      code: `// Parameterized: pass config into the IIFE\nconst logger = (function (prefix) {\n  function stamp(msg) { return '[' + prefix + '] ' + msg }\n  return { info: (m) => console.log(stamp(m)) }\n})('APP')\n\n// Loose augmentation: extend an existing module across files\nconst App = (function (existing) {\n  existing.version = '1.0'\n  existing.start = () => console.log('starting', existing.version)\n  return existing\n})(window.App || {})`,
      explanation: [
        'Passing prefix into the IIFE lets you configure the private scope at creation time (a bridge to factory functions).',
        'stamp stays private; only info is exposed.',
        'Loose augmentation takes the existing module (or an empty object) and adds to it, so multiple files can extend one module.',
        'This is how large pre-ESM codebases split a single namespace across many files.',
      ],
    },
    realProject: {
      label: 'Real project — singleton API client (and its modern equivalent)',
      lang: 'js',
      code: `// Module pattern as a singleton service\nconst apiClient = (function () {\n  let token = null                      // private\n  const base = 'https://api.app.com'\n  async function request(path, opts = {}) {\n    return fetch(base + path, {\n      ...opts,\n      headers: { ...opts.headers, Authorization: token ? 'Bearer ' + token : '' },\n    })\n  }\n  return {\n    setToken(t) { token = t },\n    get: (p) => request(p),\n    post: (p, body) => request(p, { method: 'POST', body: JSON.stringify(body) }),\n  }\n})()\n\n// Modern equivalent: an ES module file IS a module pattern —\n// top-level consts are private, 'export' is the public API.`,
      explanation: [
        'token and base are private; the only way to set the token is the public setToken.',
        'The single returned object acts as an app-wide singleton API client.',
        'In Vue/React today you would write this as an ES module (private consts + exports) or a composable/store.',
        'The pattern lives on conceptually: ES modules give the same privacy with cleaner syntax.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the module pattern?',
      answer: 'A pattern using an IIFE to create a private scope and returning an object that exposes only a public API, keeping internal state/helpers private through closures.',
      explanation: 'Naming IIFE + closures + private/public split is the core.',
    },
    {
      level: 'beginner',
      question: 'What problems does the module pattern solve?',
      answer: 'It provides data privacy (true private members) and prevents global-namespace pollution by exposing a single namespaced object instead of many globals.',
      explanation: 'Privacy and namespace hygiene are the two headline benefits.',
    },
    {
      level: 'intermediate',
      question: 'How does the module pattern achieve privacy?',
      answer: 'Variables declared inside the IIFE are local to its scope. The returned methods are closures that retain access to those variables via the scope chain, but outside code has no reference to them, so they are effectively private.',
      explanation: 'The mechanism is closures over the IIFE scope — that is the key explanation.',
    },
    {
      level: 'intermediate',
      question: 'What is the Revealing Module Pattern and how does it differ?',
      answer: 'You define all members privately, then return an object that maps public names to the private functions. It improves readability (a clear API table at the bottom) but has a caveat: if a public function is reassigned, the revealed reference can become stale.',
      explanation: 'Mentioning the reassignment caveat shows depth beyond the happy path.',
    },
    {
      level: 'advanced',
      question: 'How does the module pattern relate to ES modules and class private fields?',
      answer: 'ES modules give the same encapsulation natively — top-level bindings are private to the file, exports are the public API — without an IIFE. Class # fields provide per-instance privacy. The module pattern was the closure-based way to get these before the language had them.',
      explanation: 'Connecting it to modern alternatives and explaining what they replaced is senior-leaning.',
    },
    {
      level: 'senior',
      question: 'When would you still reach for the module pattern today, and what are its downsides?',
      answer: 'Rarely as the default — ES modules are preferred. It is still useful for a quick inline singleton, augmenting a global in a constrained environment, or teaching closures. Downsides: private members are hard to test/mock, the pattern is not tree-shakeable, and memory is held for the module\'s lifetime.',
      explanation: 'Honest tradeoffs (testability, tree-shaking, memory) plus "prefer ES modules" is the mature answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is the module pattern different from a class?',
    'What is an IIFE and why is it needed here?',
    'How would you implement a singleton with the module pattern?',
    'Why are ES modules generally preferred over the module pattern now?',
    'What is the stale-reference caveat of the Revealing Module Pattern?',
    'How does the module pattern relate to the factory pattern?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Confusing the module pattern with ES modules (import/export).',
      why: 'They achieve similar encapsulation but are different mechanisms — one is an IIFE+closure idiom, the other a language feature.',
      fix: 'Explain the module pattern as the closure-based predecessor; ES modules give the same privacy natively.',
    },
    {
      mistake: 'Forgetting to invoke the IIFE (missing the trailing parentheses).',
      why: 'Without invocation you assign the function itself, not its returned API object.',
      fix: 'Ensure the function expression is immediately invoked: (function(){...})().',
    },
    {
      mistake: 'Exposing internal mutable state directly in the returned object.',
      why: 'Returning a reference to a private array/object lets callers mutate internals, breaking encapsulation.',
      fix: 'Return copies or read-only views, and expose mutations only through controlled methods.',
    },
    {
      mistake: 'Over-using the pattern where a simple ES module or function would do.',
      why: 'It hurts testability and tree-shaking and adds ceremony for no benefit in modern codebases.',
      fix: 'Default to ES modules; reserve the IIFE module pattern for the few cases that truly need it.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables (useXxx) are the spiritual successor: private refs/helpers in a function, returning a public object — the module pattern reborn with reactivity.' },
    { area: 'React', detail: 'Custom hooks and module-scoped singletons (a shared client/config in a file) use the same private-internals/public-API idea, now via ES modules.' },
    { area: 'Node.js', detail: 'Each CommonJS/ESM file is effectively a module: locals are private, module.exports/export is the public API; legacy code used IIFE modules before bundlers.' },
    { area: 'Backend', detail: 'Singleton services (DB clients, config) are exposed as a single module object with private connection state, mirroring the module-pattern singleton.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'The IIFE runs once at definition, so there is no per-call setup cost for using the module.',
      'A single namespaced object reduces global lookups and naming collisions.',
    ],
    bad: [
      'Private state is retained for the module\'s entire lifetime (closure keeps it alive), so large private data lingers.',
      'IIFE-based modules are not tree-shakeable — bundlers cannot drop unused methods inside the returned object.',
    ],
    optimizations: [
      'Prefer ES modules so bundlers can tree-shake unused exports.',
      'Avoid capturing large objects in module-private state if they are only needed briefly.',
      'Keep modules focused; split large modules so unused parts are not all loaded together.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['closure', 'iife', 'scope'],
    nextConcepts: ['es-modules', 'singleton-pattern', 'factory-pattern', 'es6-classes'],
    dependencyNote:
      'The module pattern is closures + IIFE applied to encapsulation, so master those first. It leads naturally into ES modules (its modern replacement), the singleton and factory patterns, and class-based encapsulation.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write an IIFE: (function(){ ... })().',
      'Inside, declare a private variable (count = 0) and a private helper.',
      'Return an object literal with two methods that use count.',
      'Assign the result to a const; show count is undefined from outside.',
      'Draw arrows from the returned methods back into the private scope (closures).',
      'Say: "The IIFE makes a private scope; the returned object is the public API; closures let the methods keep using the private state — encapsulation without classes."',
    ],
    diagram: `  const M = (function(){
     let count = 0;        // PRIVATE
     return {              // PUBLIC API
       inc(){ count++ },
       val(){ return count }
     };
  })();
  M.val()  // works    M.count // undefined (private)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The module pattern uses an IIFE to create a private scope and returns an object exposing only a public API; the returned methods are closures over the private state, giving encapsulation and avoiding global pollution. The Revealing variant defines everything privately then returns a name map. It was JavaScript\'s pre-ESM way to get privacy; today ES modules (private top-level bindings + exports) and class # fields are the modern equivalents.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The module pattern is how JavaScript got encapsulation before the language had modules or private class fields. You wrap code in an IIFE — an immediately invoked function expression — which creates a private lexical scope. Variables and helper functions declared inside that scope are local, so they never touch the global namespace and can\'t be accessed from outside. The IIFE then returns an object that is the public API, and crucially, the methods on that object are closures over the private scope, so they can still read and mutate the private state while callers only see the methods. A counter module is the canonical example: a private count variable, and public increment/value methods that close over it — counter.count is undefined, but counter.value() works. A popular variant is the Revealing Module Pattern, where you define everything privately and then return an object mapping public names to the private functions, which reads cleanly, though it has a caveat that reassigning a method can leave a stale revealed reference. The pattern solved two problems: true data privacy and avoiding global-namespace pollution by exposing a single namespaced object. Today I\'d usually reach for ES modules instead — a module file already gives private top-level bindings and an explicit export surface, plus it\'s tree-shakeable, whereas the IIFE form is not. But the idea is everywhere: Vue composables and React hooks are essentially the module pattern with reactivity, and module-scoped singletons follow the same private-internals, public-API shape.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Module pattern vs ES modules: the IIFE form is self-contained and needs no bundler, but ES modules are tree-shakeable, statically analyzable, and the standard.',
      'Closures vs classes for privacy: closures give true privacy and ergonomic singletons; classes give per-instance state, prototype method sharing, and instanceof.',
    ],
    edgeCases: [
      'Revealing Module Pattern stale references: if a public method is reassigned later, the returned reference may not update.',
      'Returning a private object/array by reference leaks mutability, breaking encapsulation.',
      'Augmentation across files relies on load order; with IIFEs that can be fragile.',
      'Private members are not accessible to unit tests, complicating coverage of internals.',
    ],
    runtimeBehavior: [
      'The IIFE executes once at evaluation; the returned closures keep the private environment alive for the module\'s lifetime.',
      'All public methods share ONE private environment (singleton state), unlike a factory that would create fresh state per call.',
      'Memory is released only when the module object becomes unreachable.',
    ],
    scalability: [
      'For large apps, ES modules scale far better — static imports enable bundler optimizations and clearer dependency graphs.',
      'Module-pattern singletons are convenient but make shared mutable state global, which can hurt testability and parallelism on the server.',
    ],
    productionConcerns: [
      'Hard-to-mock private internals push you toward dependency injection or ES modules for testability.',
      'Non-tree-shakeable IIFE modules can bloat bundles; migrate to named ES exports.',
      'Singleton mutable state in modules can cause cross-request leakage on the server if not handled carefully.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Module pattern = IIFE creates private scope + returns public API object.',
    'Privacy comes from closures over the IIFE scope.',
    'Solves: data privacy + global-namespace pollution.',
    'Returned methods share ONE private environment (singleton-like).',
    'Revealing Module Pattern: define privately, return a name map.',
    'Revealing caveat: reassigned methods can leave stale references.',
    'Pass args into the IIFE to parameterize the private scope.',
    'Augmentation extends one module across files (load-order sensitive).',
    'Modern replacement: ES modules (private top-level + exports).',
    'Class # fields give per-instance privacy.',
    'Downsides: not tree-shakeable, private internals hard to test.',
    'Vue composables / React hooks are its conceptual heirs.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a module with a private array and public add(item) and getAll() methods. getAll must not expose the internal array directly.',
      hint: 'Return a copy from getAll.',
      solution: {
        lang: 'js',
        code: `const list = (function () {\n  const items = []\n  return {\n    add(item) { items.push(item) },\n    getAll() { return [...items] }, // copy, not the private ref\n  }\n})()\nlist.add('a'); list.getAll() // ['a']`,
        explanation: [
          'items is private inside the IIFE; only add/getAll can touch it.',
          'getAll returns a shallow copy so callers cannot mutate the internal array.',
          'This preserves encapsulation — a common follow-up the interviewer checks for.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Convert this object into the Revealing Module Pattern: it should expose only increment and value, keeping a reset helper private.',
      hint: 'Define all functions privately, then return a name map.',
      solution: {
        lang: 'js',
        code: `const counter = (function () {\n  let count = 0\n  function increment() { count++ }\n  function value() { return count }\n  function reset() { count = 0 } // stays private\n  return { increment, value }     // reveal only these\n})()`,
        explanation: [
          'All functions are defined privately first, giving a clean structure.',
          'The return block reveals only increment and value; reset is omitted, so it is private.',
          'The return reads like a table of contents of the public API.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a configurable logger module via a parameterized IIFE that takes a prefix and exposes info/error, keeping the formatting helper private.',
      hint: 'Pass the prefix as an argument to the IIFE.',
      solution: {
        lang: 'js',
        code: `const logger = (function (prefix) {\n  function fmt(level, msg) { return '[' + prefix + ':' + level + '] ' + msg }\n  return {\n    info(msg) { console.log(fmt('INFO', msg)) },\n    error(msg) { console.error(fmt('ERROR', msg)) },\n  }\n})('APP')\n\nlogger.info('started') // [APP:INFO] started`,
        explanation: [
          'The prefix is captured into the private scope at creation time via the IIFE argument.',
          'fmt is a private helper closed over by both public methods.',
          'Only info and error are exposed, demonstrating parameterized encapsulation.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a singleton "configStore" using the module pattern: private settings, a get(key), a set(key,value), and the guarantee that there is only ever one instance.',
      hint: 'The IIFE runs once, so the returned object is naturally a singleton.',
      solution: {
        lang: 'js',
        code: `const configStore = (function () {\n  const settings = {}          // private, single instance\n  return {\n    get(key) { return settings[key] },\n    set(key, value) { settings[key] = value; return value },\n    has(key) { return Object.hasOwn(settings, key) },\n  }\n})()\n\nconfigStore.set('theme', 'dark')\nconfigStore.get('theme') // 'dark'\n// Importing/using configStore anywhere gives the SAME object.`,
        explanation: [
          'The IIFE executes exactly once, so settings exists only once — that is the singleton guarantee.',
          'All methods share the one private settings object via closure.',
          'Object.hasOwn avoids inherited-property pitfalls when checking keys.',
          'In a real app this would be an ES module, which gives the same single-instance behavior per import.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The module pattern is the cleanest way to PROVE you understand closures and encapsulation together. It also lets you trace the lineage from old-school JS to ES modules, composables, and hooks — showing you understand why the language evolved the way it did.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is the module pattern" and to write a counter. Product companies (Zoho, Flipkart, Razorpay) ask you to build a configurable module or singleton and contrast it with ES modules. FAANG-level interviews probe tradeoffs (tree-shaking, testability) and how it maps to modern patterns.',
    whatInterviewersExpect:
      'They expect you to build it from an IIFE with private state and a returned public API, explain that closures provide the privacy, name the Revealing variant, and articulate why ES modules are the modern replacement while acknowledging the downsides.',
  },
}

export default modulePattern
