import type { ConceptLesson } from '../../../types/lesson'

const iife: ConceptLesson = {
  // 1. Concept Summary
  slug: 'iife',
  name: 'IIFE & Module Pattern Roots',
  category: 'execution-model',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'The IIFE (Immediately Invoked Function Expression) was the original way to create private scope and avoid polluting the global namespace — the foundation of the classic module pattern before ES modules existed.',
    'Understanding IIFEs explains how legacy libraries (jQuery plugins, UMD bundles) encapsulate state and expose a clean public API.',
    'It is the canonical fix for the var-in-loop closure bug, so interviewers use it to test your grasp of scope and closures together.',
    'Bundlers and transpilers still emit IIFEs (and the IIFE-like UMD wrapper) under the hood, so you will read them even if you rarely write them.',
    'It teaches you why a function expression can be invoked immediately while a function declaration cannot — a precise parsing detail interviewers like.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An IIFE is like a magician\'s curtain that goes up, the trick happens once, and the curtain comes down — and you only ever see the final result, never the messy setup behind it.',
    story: [
      'A magician sets up a trick behind a curtain: ropes, mirrors, hidden boxes — lots of secret stuff.',
      'The curtain rises, the trick runs ONE time, and you see only the amazing result.',
      'When the curtain drops, all the secret setup is hidden away — you can never touch the ropes or mirrors.',
      'An IIFE is a little function that runs itself immediately, does its setup in private, and only hands you the finished result. All the helper variables stay hidden behind the "curtain" so nothing leaks out into the rest of your program.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally you create a function and then call it later by name. An IIFE skips the wait: you define it and run it right away, in the same breath.',
    'You do this by wrapping the function in parentheses to make it an expression, then adding () to call it immediately.',
    'Everything inside runs once, and any variables created inside stay private — they do not appear in the outside world.',
    'Before modern import/export existed, programmers used this trick to keep their code organized and avoid two scripts accidentally overwriting each other\'s variables.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'An IIFE is a function expression that is invoked the moment it is defined. By wrapping a function in parentheses (or another expression-forcing operator) and immediately calling it with (), you run it once and create a fresh private scope whose internal variables never touch the surrounding/global scope.',
    how: 'The wrapping parentheses force the parser to treat `function(){}` as an expression rather than a declaration, which makes it legal to follow with `()` to invoke it. The function body executes immediately, can return a value, and its locals stay encapsulated by the closure it forms.',
    why: 'It provides isolation (no global pollution), one-time initialization, and a way to expose only a chosen public API while keeping helpers private — the root of the module pattern.',
    code: {
      label: 'A counter module via IIFE with private state',
      lang: 'js',
      code: `const counter = (function () {\n  let count = 0            // private — not visible outside\n  return {\n    increment() { return ++count },\n    value() { return count },\n  }\n})()\n\ncounter.increment() // 1\ncounter.increment() // 2\ncounter.value()     // 2\n// count is unreachable from here`,
      explanation: [
        'The function is wrapped in parentheses to make it an expression, then `()` invokes it immediately.',
        '`count` is a private variable held in the closure of the returned methods.',
        'Only the returned object (increment, value) is the public API — `count` cannot be touched directly.',
        'This runs exactly once and produces a single encapsulated module — the classic module pattern.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'An Immediately Invoked Function Expression is a function expression that is executed immediately after its definition. Surrounding the function with grouping parentheses (or prefixing a unary operator) coerces the parser out of statement context into expression context, permitting the trailing call operator (). It establishes a new lexical scope/execution context that runs once; combined with a returned value, it forms a closure that encapsulates private state and exposes only a deliberately chosen public interface — the structural basis of the pre-ESM module pattern and UMD wrappers.',

  // 7. Internal Working
  internalWorking: [
    'The parser, seeing `function` at the start of a statement, would treat it as a function declaration (which cannot be immediately invoked).',
    'Wrapping in `( ... )` puts the parser in expression context, so the `function` keyword produces a function expression — a value.',
    'The trailing `()` is the call operator applied to that expression value, so the function is invoked right away.',
    'A new execution context is pushed: its variable/lexical environment holds the IIFE\'s locals, isolated from the enclosing scope.',
    'If the IIFE returns an object/function, those returned members close over the locals, keeping selected state alive (a closure) while the rest is encapsulated.',
    'When the IIFE finishes, its stack frame is popped; any non-returned, non-referenced locals become unreachable and are eligible for garbage collection.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `      ( function () {            ┌─────────────────────────┐
          let secret = 1   ───►   │  PRIVATE SCOPE (one shot)│
          return {                │   secret  (hidden)       │
            get() {...}    ───►   │   get()  closes over it  │
          }                       └───────────┬─────────────┘
      } )()  ◄── invoked now                  │ returns
        │                                      ▼
        ▼                              ┌───────────────┐
     const api = ...                   │ PUBLIC API only│  ← outside world
                                       └───────────────┘`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — run once, leak nothing',
      lang: 'js',
      code: `(function () {\n  const msg = 'setup done'\n  console.log(msg)\n})() // logs "setup done"\n// msg is NOT visible here`,
      explanation: [
        'The parentheses make it an expression; the trailing () runs it immediately.',
        '`msg` lives only inside the IIFE scope and never leaks to the outside.',
        'Useful for one-time setup code that should not add globals.',
      ],
    },
    intermediate: {
      label: 'Intermediate — IIFE fixing the var loop bug',
      lang: 'js',
      code: `for (var i = 0; i < 3; i++) {\n  (function (j) {\n    setTimeout(() => console.log(j), j * 100)\n  })(i)\n}\n// logs 0, 1, 2 (not 3, 3, 3)`,
      explanation: [
        'With plain `var`, all timeout callbacks would share one `i` and print 3, 3, 3.',
        'The IIFE creates a new scope each iteration and binds the current `i` to parameter `j`.',
        'Each callback closes over its own `j`, so the values are preserved: 0, 1, 2.',
        'This was the standard pre-`let` fix and is a classic interview demonstration.',
      ],
    },
    advanced: {
      label: 'Advanced — module pattern with public/private members',
      lang: 'js',
      code: `const store = (function () {\n  const data = new Map()          // private\n  function set(k, v) { data.set(k, v) }\n  function get(k) { return data.get(k) }\n  function size() { return data.size }\n  return { set, get, size }       // public API\n})()\n\nstore.set('a', 1)\nstore.get('a')  // 1\nstore.size()    // 1\n// store.data is undefined — fully private`,
      explanation: [
        'The IIFE returns an object exposing only set/get/size.',
        '`data` is private closure state — there is no way to access the Map directly from outside.',
        'This is the revealing module pattern: choose what to reveal, hide the rest.',
        'It predates ES modules but expresses the same encapsulation goal.',
      ],
    },
    realProject: {
      label: 'Real project — UMD wrapper a bundler emits',
      lang: 'js',
      code: `(function (root, factory) {\n  if (typeof module === 'object' && module.exports) {\n    module.exports = factory()        // CommonJS / Node\n  } else {\n    root.MyLib = factory()            // browser global\n  }\n})(typeof self !== 'undefined' ? self : this, function () {\n  function greet(name) { return 'Hi ' + name }\n  return { greet }\n})`,
      explanation: [
        'The outer IIFE runs immediately, deciding how to expose the library based on the environment.',
        'The inner factory returns the public API; helpers stay private inside it.',
        'This UMD pattern lets one file work in Node, AMD, and the browser — emitted by bundlers like Rollup/webpack.',
        'You read IIFEs like this constantly in dist/ build output even if you author ES modules.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is an IIFE and how do you write one?',
      answer: 'An Immediately Invoked Function Expression is a function that runs as soon as it is defined. You wrap a function in parentheses to make it an expression, then call it with (): (function(){ ... })().',
      explanation: 'A good answer states both the syntax and the purpose (immediate execution + private scope).',
    },
    {
      level: 'beginner',
      question: 'Why do you need the wrapping parentheses?',
      answer: 'Without them, the parser reads `function` at statement start as a function DECLARATION, which cannot be immediately invoked. The parentheses force expression context so the trailing () is a valid call.',
      explanation: 'Tests understanding of the parser distinction between declarations and expressions.',
    },
    {
      level: 'intermediate',
      question: 'What problem did IIFEs solve before ES modules?',
      answer: 'They created private scope to avoid polluting the global namespace and to encapsulate state, exposing only a chosen public API. This is the basis of the module pattern that organized large pre-ESM codebases.',
      explanation: 'Connects IIFE to its historical and architectural motivation.',
    },
    {
      level: 'intermediate',
      question: 'How does an IIFE fix the var-in-loop closure bug?',
      answer: 'By wrapping the loop body in an IIFE that takes the loop variable as a parameter, each iteration gets a fresh scope binding the current value, so each callback closes over its own copy instead of the shared var.',
      explanation: 'Shows combined understanding of scope, closures, and the IIFE fix.',
    },
    {
      level: 'advanced',
      question: 'Are IIFEs still relevant now that we have ES modules and block scope?',
      answer: 'Less so for new code — ES modules give file-level private scope and `let`/`const` give block scope. But IIFEs still appear in bundler output (UMD), in script-tag code that cannot use modules, for top-level async work (async IIFE), and for one-shot initialization.',
      explanation: 'Demonstrates current judgment: knows when the pattern is obsolete vs still useful.',
    },
    {
      level: 'senior',
      question: 'How would you run top-level await before it was supported, and how does that relate to IIFEs?',
      answer: 'You wrap awaited code in an async IIFE: (async () => { await something() })(). The IIFE provides an async function scope to await inside, executed immediately. With top-level await in modules this is now often unnecessary, but it remains a common pattern in scripts and CommonJS.',
      explanation: 'Senior signal: knowing the async IIFE idiom and how module-level features superseded it.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What are the different ways to force a function into expression context? (parentheses, unary !, +, void)',
    'How is the module pattern built on an IIFE plus a closure?',
    'What is an async IIFE and when would you use one?',
    'Do ES modules make IIFEs obsolete? In what cases are they still used?',
    'What is the difference between (function(){})() and (function(){}())?',
    'How does a UMD wrapper use an IIFE to support multiple environments?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting the wrapping parentheses and writing function(){}() at statement start.',
      why: 'The parser treats it as a declaration and throws a syntax error (declarations cannot be invoked).',
      fix: 'Wrap in parentheses: (function(){})() — or use a leading operator like !function(){}().',
    },
    {
      mistake: 'Omitting a semicolon before an IIFE on the next line.',
      why: 'ASI may join it to the previous line, causing the previous value to be called as a function.',
      fix: 'Prefix with a semicolon: ;(function(){})() — common in concatenated scripts.',
    },
    {
      mistake: 'Reaching for an IIFE in modern code where a block + let or a module would do.',
      why: 'It adds noise; ES modules and block scope already provide isolation.',
      fix: 'Use ES modules for file scope and { let } for block scope; reserve IIFEs for legacy/UMD/async-init needs.',
    },
    {
      mistake: 'Assuming IIFE state is truly secure/private.',
      why: 'It is encapsulation, not security — anything in JS memory is inspectable in the browser.',
      fix: 'Treat closure/IIFE privacy as code organization, never as a place for real secrets.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Backend', detail: 'Async IIFEs run top-level await-style initialization (DB connect, config load) in CommonJS entrypoints where top-level await is unavailable.' },
    { area: 'Node.js', detail: 'Bundled libraries ship UMD/IIFE wrappers so one file works in CommonJS, AMD, and as a browser global.' },
    { area: 'Vue', detail: 'Composables superseded the IIFE module pattern for encapsulated state, but legacy global plugins and CDN script builds still use IIFE wrappers.' },
    { area: 'React', detail: 'Bundler output (webpack/Rollup) wraps modules in IIFE/function scopes; understanding them helps when debugging minified production bundles.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'An IIFE runs once and adds negligible overhead while preventing global-namespace collisions.',
      'Encapsulating setup in an IIFE can let unused internals be garbage collected after initialization.',
    ],
    bad: [
      'Overusing IIFEs creates extra function allocations and nesting that hurt readability with little benefit in modern code.',
      'Returning large objects/closures keeps captured state alive, the same leak risk as any closure.',
    ],
    optimizations: [
      'Prefer ES modules and block scope in new code; reserve IIFEs for legacy/UMD/async-init scenarios.',
      'Capture only what the public API needs so non-returned internals can be collected.',
      'Let the bundler emit module wrappers rather than hand-writing IIFEs everywhere.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'IIFE/module-pattern privacy is encapsulation, not security; in the browser DevTools can inspect any in-memory value, so secrets stored in IIFE closures are not safe.',
    ],
    bestPractices: [
      'Never store real secrets (tokens, keys) in client-side IIFE closures expecting them to be hidden.',
      'Keep secrets server-side; on the client use httpOnly cookies for tokens rather than closure state.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['function-declaration-vs-expression', 'scope', 'closure'],
    nextConcepts: ['module-pattern', 'es-modules', 'commonjs', 'top-level-await'],
    dependencyNote:
      'IIFEs build directly on the declaration-vs-expression distinction and closures; they are the historical root of the module pattern, which ES modules and block scope have largely superseded for new code.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write `function(){}` and say "at statement start this is a declaration — cannot be invoked".',
      'Wrap it in parentheses: `(function(){})` and say "now it is an expression — a value".',
      'Append `()` and say "the call operator runs it immediately".',
      'Inside, draw a private variable and a returned object pointing into it.',
      'Conclude: "private scope, one-shot execution, expose only the returned API — that is the module pattern\'s root."',
    ],
    diagram: `  ( function () { ... } )()
    │                      └─ call operator: invoke NOW
    └─ parens: force EXPRESSION context

  inside:  [ private vars ] --returns--> { public API }
                  (hidden)                  (exposed)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'An IIFE is a function expression invoked immediately: (function(){ ... })(). The parentheses force expression context so the trailing () can call it. It creates a private one-shot scope, avoiding global pollution and enabling the classic module pattern — return an object to expose a public API while keeping helpers private. It also fixes the var-in-loop bug and powers UMD wrappers and async-init via async IIFEs, though ES modules and block scope have largely replaced it.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'An IIFE, or Immediately Invoked Function Expression, is a function that runs the moment it is defined. The trick is in the syntax: if you start a statement with the word function, the parser reads it as a function declaration, and you cannot put parentheses after a declaration to call it. So you wrap the function in parentheses to force expression context, which turns it into a value, and then the trailing parentheses are the call operator that invokes it right away. Why would you do this? It creates a brand-new private scope that runs once. Before ES modules existed, this was the main way to avoid polluting the global namespace — you would run your setup inside an IIFE so its variables stayed local, and if you returned an object you exposed a clean public API while keeping helpers private. That is the module pattern, and it is the structural ancestor of today\'s import/export. IIFEs also historically fixed the var-in-loop closure bug, by giving each iteration its own scope through a parameter. In modern code, ES modules give file-level privacy and let/const give block scope, so you rarely write IIFEs by hand. But you still read them constantly: bundlers emit UMD wrappers built on IIFEs, and the async IIFE — an async arrow invoked immediately — was the standard way to use await at the top level before top-level await landed.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Encapsulation without a build step (IIFE) vs first-class modules: IIFEs work in any script context but lack static analysis, tree-shaking, and named imports that ESM provides.',
      'Readability: IIFEs add nesting and parsing quirks; in modern code modules/blocks are clearer, so IIFE use should be deliberate (UMD, async init).',
    ],
    edgeCases: [
      'ASI hazards: a missing semicolon before an IIFE can make the previous expression be invoked; the leading-semicolon idiom guards against this in concatenated files.',
      'Named IIFEs allow self-reference/recursion and better stack traces but the name is scoped only inside the function.',
      'Async IIFEs swallow rejections unless you attach a catch — unhandled promise rejections can crash Node.',
      'Different invocation styles (function(){}()) vs (function(){})() are equivalent but tooling/linters may prefer one.',
    ],
    runtimeBehavior: [
      'The IIFE pushes one execution context that is popped when it returns; non-returned locals become collectible.',
      'Returned closures keep referenced locals alive on the heap, identical to any closure.',
      'Forcing expression context can also be done with unary operators (!, +, void), which some minifiers prefer for byte savings.',
    ],
    scalability: [
      'For large legacy codebases, the module pattern (IIFE + closures) scaled organization before bundlers; today ESM + bundlers scale far better with static deps and tree-shaking.',
      'UMD/IIFE wrappers remain important for shipping libraries consumable across many environments.',
    ],
    productionConcerns: [
      'Minified bundles are full of IIFEs/function scopes; debugging them requires source maps and understanding the wrapper shape.',
      'Async IIFE error handling must be explicit to avoid unhandled rejections in production.',
      'Migrating from IIFE module pattern to ESM should preserve the same public surface to avoid breaking consumers.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'IIFE = function expression invoked immediately: (function(){})().',
    'Parens force EXPRESSION context so the trailing () can call it.',
    'Creates a private, one-shot scope -> no global pollution.',
    'Return an object to expose a public API -> module pattern.',
    'Private members stay in the closure, hidden from outside.',
    'Classic fix for the var-in-loop bug (param captures the value).',
    'Async IIFE: (async () => { await ... })() for top-level await (pre-TLA).',
    'UMD wrappers are IIFEs that adapt to CJS/AMD/global.',
    'Alternatives to parens: !, +, void operators force expression context.',
    'Modern code: prefer ES modules + block scope; IIFE for legacy/UMD/async-init.',
    'Privacy is encapsulation, not security.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write an IIFE that logs "ready" once and leaks no variables.',
      hint: 'Wrap a function in parentheses and call it.',
      solution: {
        lang: 'js',
        code: `(function () {\n  const status = 'ready'\n  console.log(status)\n})()\n// status is not accessible here`,
        explanation: [
          'The parentheses make it an expression; the trailing () runs it immediately.',
          '`status` is scoped to the IIFE and never reaches the outer scope.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Use an IIFE to build a module exposing only `add` and `total`, keeping the running sum private.',
      hint: 'Return an object closing over a private variable.',
      solution: {
        lang: 'js',
        code: `const calc = (function () {\n  let sum = 0\n  return {\n    add(n) { sum += n; return sum },\n    total() { return sum },\n  }\n})()\ncalc.add(5)   // 5\ncalc.add(3)   // 8\ncalc.total()  // 8`,
        explanation: [
          '`sum` is private closure state held by the returned methods.',
          'Only add and total are exposed; sum cannot be read or written directly.',
          'This is the revealing module pattern built on an IIFE.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Fix the var-loop bug using an IIFE so it logs 0,1,2: for (var i=0;i<3;i++){ setTimeout(()=>console.log(i),0); }',
      hint: 'Pass i into an IIFE parameter to capture it per iteration.',
      solution: {
        lang: 'js',
        code: `for (var i = 0; i < 3; i++) {\n  (function (j) {\n    setTimeout(() => console.log(j), 0)\n  })(i)\n}`,
        explanation: [
          'Each iteration invokes an IIFE that receives the current `i` as parameter `j`.',
          'The timeout callback closes over its own `j`, not the shared `i`.',
          'So the outputs are 0, 1, 2 instead of 3, 3, 3.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write an async IIFE that awaits a fetch and logs the result, with error handling.',
      hint: 'Use (async () => { ... })() and a try/catch.',
      solution: {
        lang: 'js',
        code: `(async () => {\n  try {\n    const res = await fetch('/api/data')\n    const data = await res.json()\n    console.log(data)\n  } catch (err) {\n    console.error('failed', err)\n  }\n})()`,
        explanation: [
          'The async arrow IIFE provides an async scope so await works immediately at the top level.',
          'try/catch handles rejections; without it an async IIFE could produce an unhandled rejection.',
          'This was the standard pre-top-level-await idiom and is still common in CommonJS scripts.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'IIFEs tie together scope, closures, and the declaration-vs-expression distinction in one tiny pattern — and they are the historical root of the module pattern you still see in bundler output. Explaining one well signals you understand JavaScript\'s execution model, not just modern syntax sugar.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is an IIFE and why the parentheses". Product companies (Zoho, Flipkart, Razorpay) ask you to build the module pattern or fix the var-loop bug with one. FAANG interviews probe async IIFEs, UMD wrappers, and when ES modules make IIFEs obsolete.',
    whatInterviewersExpect:
      'They expect the syntax, the parser reason for the parentheses, the private-scope/module-pattern purpose, the var-loop fix, and modern judgment about when to use modules/blocks instead.',
  },
}

export default iife
