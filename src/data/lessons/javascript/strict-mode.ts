import type { ConceptLesson } from '../../../types/lesson'

const strictMode: ConceptLesson = {
  // 1. Concept Summary
  slug: 'strict-mode',
  name: 'Strict Mode',
  category: 'fundamentals-engine',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Strict mode turns silent, dangerous mistakes (like typos creating accidental globals) into loud errors you can fix immediately.',
    'It is implicitly on inside ES modules and class bodies, so understanding it explains behavior you already rely on in modern code.',
    'It changes the value of `this` in plain function calls (undefined instead of the global object), which affects real bugs and interview questions.',
    'It bans error-prone or hard-to-optimize legacy features (with, octal literals, duplicate params), making code safer and engine-friendlier.',
    'Interviewers ask it to check whether you understand JavaScript\'s sloppy/strict duality and how it affects scope, this, and errors.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Strict mode is like turning on the "no mistakes allowed" rule in a game so cheating beeps loudly instead of being silently ignored.',
    story: [
      'Imagine playing a board game where normally, if you break a small rule, nobody notices and you quietly keep an unfair advantage.',
      'Now you flip a switch that says "strict rules": the moment anyone breaks a rule, a loud buzzer goes off so you fix it right away.',
      'The game still plays the same when you follow the rules — but mistakes can no longer hide.',
      'Strict mode in JavaScript is that switch: it does not change correct code, but it makes sloppy mistakes throw errors instead of silently doing something weird.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript has two ways to run code: a relaxed "sloppy" mode that forgives mistakes, and a "strict" mode that is more careful.',
    'You turn on strict mode by writing "use strict" at the top of a file or function (and it is automatic inside modules and classes).',
    'In strict mode, mistakes like forgetting to declare a variable cause an error instead of secretly creating a global variable.',
    'It also bans some old, confusing features so your code is cleaner and safer.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Strict mode is an opt-in variant of JavaScript (enabled with the "use strict" directive) that makes the language stricter: it converts certain silent failures into thrown errors, eliminates some unsafe features, and changes a few semantics like the value of `this` in plain function calls.',
    how: 'Add "use strict" as the first statement of a script or function body. In ES modules and class bodies it is always on automatically — no directive needed.',
    why: 'It catches bugs early (accidental globals, bad assignments), removes footguns (with, duplicate params), and produces more predictable, optimizable code.',
    code: {
      label: 'Strict mode catching an accidental global',
      lang: 'js',
      code: `'use strict'\nfunction setName() {\n  nam = 'Ada'   // typo: meant "name". Throws ReferenceError in strict mode\n}\n// In sloppy mode this would SILENTLY create a global "nam".\ntry { setName() } catch (e) { console.log(e.name) } // "ReferenceError"`,
      explanation: [
        '`"use strict"` enables strict mode for this script.',
        'Assigning to an undeclared variable `nam` is a typo for `name`.',
        'In sloppy mode this silently creates a global `nam`, hiding the bug.',
        'In strict mode it throws a ReferenceError, surfacing the mistake immediately.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Strict mode is a restricted execution context for ECMAScript, enabled by the "use strict" directive prologue (per script or per function) and applied implicitly within ES modules and class bodies. It changes semantics to improve safety and analyzability: assignments to undeclared variables, read-only properties, and non-writable globals throw; `this` is undefined in ordinary function calls (no global-object substitution); duplicate parameter names, octal literals, and the with statement are syntax errors; eval gets its own scope and cannot leak bindings; and deleting non-configurable properties throws. These changes also remove patterns that hinder engine optimization.',

  // 7. Internal Working
  internalWorking: [
    'Parsing: when the parser sees a "use strict" directive at the start of a script or function (or compiles a module/class), it marks that code unit as strict, affecting how subsequent statements are parsed and executed.',
    'Variable resolution: assignments to identifiers that are not declared no longer create implicit global properties; instead the engine throws a ReferenceError.',
    '`this` binding: for a normal function called without a receiver, the engine sets `this` to undefined rather than coercing it to the global object.',
    'Property semantics: writes to non-writable properties, additions to non-extensible objects, and deletes of non-configurable properties throw TypeErrors instead of failing silently.',
    'Forbidden constructs: with statements, octal literals (0123), duplicate parameter names, and assigning to reserved words become early (syntax) errors.',
    'eval/arguments isolation: eval runs in its own scope and cannot introduce bindings into the surrounding scope; arguments does not alias named parameters, making behavior predictable and optimizable.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   "use strict"  (or ES module / class body)
            │
            ▼
   ┌──────────────── STRICT SCOPE ─────────────────┐
   │  x = 1   (undeclared)  ──► ReferenceError       │
   │  this    (plain call)  ──► undefined            │
   │  obj.readOnly = 2      ──► TypeError            │
   │  with (o) {}           ──► SyntaxError          │
   │  function f(a, a) {}   ──► SyntaxError (dup)    │
   │  delete nonConfigurable──► TypeError            │
   └────────────────────────────────────────────────┘
        vs SLOPPY: same mistakes fail SILENTLY / create globals`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — this in a plain function call',
      lang: 'js',
      code: `'use strict'\nfunction whoAmI() { return this }\nconsole.log(whoAmI()) // undefined (strict)\n// In sloppy mode this would be the global object (window/global).`,
      explanation: [
        'Under strict mode, calling a plain function with no receiver sets `this` to undefined.',
        'In sloppy mode the engine would substitute the global object, hiding accidental global access.',
        'This difference is a frequent source of "Cannot read properties of undefined" when methods are detached.',
        'Knowing this explains many real-world `this` bugs.',
      ],
    },
    intermediate: {
      label: 'Intermediate — function-scoped strictness',
      lang: 'js',
      code: `function strictFn() {\n  'use strict'\n  return undeclared = 5 // ReferenceError here only\n}\nfunction sloppyFn() {\n  return leaked = 10    // creates a global in sloppy mode\n}\ntry { strictFn() } catch (e) { console.log('strict:', e.name) } // ReferenceError\nsloppyFn(); console.log(typeof leaked) // "number" (leaked global)`,
      explanation: [
        'A "use strict" directive can apply to a single function body, not just the whole file.',
        '`strictFn` throws on the undeclared assignment.',
        '`sloppyFn`, lacking the directive, silently creates a global `leaked`.',
        'This shows strict mode can be scoped per function for incremental adoption.',
      ],
    },
    advanced: {
      label: 'Advanced — silent failures become errors',
      lang: 'js',
      code: `'use strict'\nconst frozen = Object.freeze({ a: 1 })\ntry {\n  frozen.a = 2          // TypeError in strict mode\n} catch (e) { console.log(e.name) } // "TypeError"\n\nconst obj = {}\nObject.defineProperty(obj, 'x', { value: 1, writable: false })\ntry { obj.x = 2 } catch (e) { console.log(e.name) } // "TypeError"`,
      explanation: [
        'Writing to a frozen object\'s property throws in strict mode (it fails silently in sloppy mode).',
        'Writing to a non-writable property defined via defineProperty also throws.',
        'These loud failures catch real bugs where code assumes a write succeeded.',
        'Strict mode therefore makes immutability guarantees enforceable rather than advisory.',
      ],
    },
    realProject: {
      label: 'Real project — modules are strict by default in Vue/Node',
      lang: 'js',
      code: `// In an ES module (Vue SFC <script>, or a .mjs / type:module file)\n// "use strict" is implicit — no directive needed.\nexport function init() {\n  // accidental global assignment still throws here\n  // count = 0  // ReferenceError\n  let count = 0\n  return () => ++count\n}`,
      explanation: [
        'Every ES module runs in strict mode automatically, so Vue SFC scripts and Node ESM are already strict.',
        'You get the safety (no accidental globals, predictable `this`) without writing the directive.',
        'This is why modern codebases rarely write "use strict" explicitly — modules cover it.',
        'Understanding this prevents confusion about why some files behave strictly without the directive.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is strict mode and how do you enable it?',
      answer: 'Strict mode is a stricter variant of JavaScript that turns silent errors into thrown errors and removes unsafe features. Enable it with the "use strict" directive at the top of a script or function; it is also implicit in ES modules and class bodies.',
      explanation: 'Mentions the directive, the per-script/per-function scope, and the automatic cases (modules/classes).',
    },
    {
      level: 'beginner',
      question: 'Give an example of something strict mode changes.',
      answer: 'Assigning to an undeclared variable throws a ReferenceError instead of silently creating a global. Also, `this` in a plain function call is undefined instead of the global object.',
      explanation: 'Two concrete, commonly-cited differences demonstrate practical understanding.',
    },
    {
      level: 'intermediate',
      question: 'How does strict mode affect the value of `this`?',
      answer: 'In strict mode, calling an ordinary function without a receiver sets `this` to undefined. In sloppy mode the engine substitutes the global object, which masks bugs and can leak globals.',
      explanation: 'A focused answer on the `this` semantics, including why the strict behavior is safer.',
    },
    {
      level: 'intermediate',
      question: 'Where is strict mode applied automatically?',
      answer: 'Inside ES modules (any import/export file, .mjs, or type:module) and inside class bodies. So modern code is largely strict without writing the directive.',
      explanation: 'Knowing the implicit cases is key to understanding modern codebases.',
    },
    {
      level: 'advanced',
      question: 'What features does strict mode forbid or change for safety/optimization?',
      answer: 'It bans the with statement, octal literals, duplicate parameter names, and assigning to reserved words; eval cannot leak bindings into the enclosing scope; arguments no longer aliases named parameters; and writes/deletes that would silently fail (read-only properties, non-configurable deletes) throw. These removals also help engines optimize.',
      explanation: 'A thorough list connects the safety rationale to engine optimizability.',
    },
    {
      level: 'senior',
      question: 'Can you mix strict and sloppy code, and what are the gotchas?',
      answer: 'Yes — strict applies per script or per function, so a sloppy script can contain a strict function and vice versa. Gotchas: a function-level directive must be the first statement; concatenating files can accidentally apply or drop strictness; and module code is always strict regardless. Eval strictness depends on the calling context.',
      explanation: 'Senior signal: awareness of granularity, concatenation hazards, and eval/module nuances.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why are ES modules strict by default?',
    'What happens to `this` in an arrow function under strict mode?',
    'Does strict mode affect performance, and how?',
    'What error do you get when assigning to a read-only property in strict mode?',
    'Why can concatenating JavaScript files break strict mode?',
    'How is eval different in strict vs sloppy mode?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Placing "use strict" after other statements.',
      why: 'The directive only works as the first statement of a script or function; otherwise it is treated as a no-op string and strict mode is not enabled.',
      fix: 'Put "use strict" as the very first line of the file or function body.',
    },
    {
      mistake: 'Assuming `this` in a detached method is the global object.',
      why: 'In strict mode (and modules) `this` is undefined, so accessing properties on it throws.',
      fix: 'Bind the method, use an arrow function, or call it with the intended receiver.',
    },
    {
      mistake: 'Relying on accidental globals created by undeclared assignments.',
      why: 'These throw in strict mode, breaking code that depended on the sloppy behavior.',
      fix: 'Always declare variables with let/const; treat the strict error as a real bug to fix.',
    },
    {
      mistake: 'Concatenating a strict file and a sloppy file naively.',
      why: 'A leading "use strict" can make the whole bundle strict, or a non-strict file can swallow the directive, causing surprising behavior.',
      fix: 'Wrap files in their own function/module scopes (bundlers do this) so strictness stays per-unit.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue single-file component <script> blocks are ES modules, so they run in strict mode automatically — accidental globals and unexpected `this` are caught.' },
    { area: 'React', detail: 'React components live in ES modules and are strict by default; combined with React.StrictMode (a separate dev-only tool), this surfaces unsafe patterns early.' },
    { area: 'Node.js', detail: 'ESM (.mjs / type:module) files are strict automatically; CommonJS files are sloppy unless they include "use strict", which many style guides require.' },
    { area: 'Backend', detail: 'Bundlers and transpilers (Babel/TypeScript targeting modules) emit strict code, so production server and client bundles enforce strict semantics throughout.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Eliminating with and arguments-aliasing lets engines resolve variables and parameters more predictably, aiding optimization.',
      'Forbidding implicit globals reduces accidental global lookups and surprising side effects in hot code.',
    ],
    bad: [
      'Strict semantics add a few extra runtime checks (e.g. throwing on read-only writes), though the cost is negligible in practice.',
      'Migrating a large sloppy codebase can surface latent errors that must be fixed, a one-time cost.',
    ],
    optimizations: [
      'Use ES modules so strict mode is on everywhere without per-file directives.',
      'Avoid with and arguments-mutation patterns so engines can optimize variable/parameter access.',
      'Treat strict-mode errors during migration as a checklist of real bugs to fix, improving overall code health.',
      'Lean on the predictable `this` semantics to write methods that fail fast rather than silently misbehaving.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Sloppy-mode accidental globals can pollute the global namespace, enabling collisions or unexpected access to shared state.',
      'with and unrestricted eval (sloppy) make code harder to audit and can obscure where bindings come from.',
    ],
    bestPractices: [
      'Use strict mode (via modules) so undeclared assignments throw, preventing accidental global pollution.',
      'Avoid eval and with entirely; if eval is unavoidable, strict mode at least prevents it from leaking bindings into the caller scope.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-javascript', 'var-let-const', 'this-keyword'],
    nextConcepts: ['es-modules', 'scope', 'hoisting', 'es6-classes'],
    dependencyNote:
      'Builds on var-let-const (declaration discipline) and this-keyword (the changed binding). It is foundational to es-modules and es6-classes, which are strict by default, and clarifies scope and hoisting behavior.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write two columns: SLOPPY and STRICT.',
      'In SLOPPY: undeclared assignment → global; plain-call this → global object; bad writes → silent.',
      'In STRICT: undeclared assignment → ReferenceError; plain-call this → undefined; bad writes → TypeError.',
      'Note "auto-on in ES modules and class bodies".',
      'Say: "Strict mode does not change correct code; it turns silent footguns into errors and is implicit in modern modules."',
    ],
    diagram: `  SLOPPY                    |  STRICT ("use strict" / modules)
  --------------------------+----------------------------------
  x = 1 (undeclared)→global |  x = 1 → ReferenceError
  this (plain call)→global  |  this → undefined
  write read-only → silent  |  write read-only → TypeError
  with / dup params → ok    |  with / dup params → SyntaxError`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Strict mode is an opt-in stricter JavaScript, enabled with "use strict" and implicit in ES modules and class bodies. It turns silent failures into errors: undeclared assignments throw, writes to read-only properties throw, and `this` in a plain function call is undefined instead of the global object. It bans footguns like with, octal literals, and duplicate parameters, and isolates eval. It does not change correct code — it just makes mistakes loud and the code more optimizable.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Strict mode is an opt-in, stricter variant of JavaScript designed to catch bugs and remove dangerous legacy behavior. You enable it by putting the string "use strict" as the first statement of a script or a function, and importantly it is on automatically inside ES modules and class bodies — which is most modern code — so you rarely need to write the directive yourself. What does it change? The headline ones: assigning to an undeclared variable throws a ReferenceError instead of silently creating a global, which catches typos immediately. In a plain function call with no receiver, `this` is undefined rather than the global object, so detached methods fail fast instead of leaking globals. Operations that used to fail silently now throw — writing to a read-only or frozen property, adding to a non-extensible object, or deleting a non-configurable property all throw TypeErrors. It also bans error-prone constructs at parse time: the with statement, octal literals, duplicate parameter names, and assigning to reserved words become syntax errors. And it isolates eval so it cannot inject variables into the surrounding scope, and stops arguments from aliasing named parameters. The benefits are twofold: safer, more predictable code, and code that engines can optimize more easily because some of the banned features defeat optimization. The main thing to remember is that strict mode does not change the behavior of correct code — it only makes mistakes loud — and since modules are strict by default, modern apps are largely strict already.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Strictness improves safety and optimizability at the cost of a one-time migration effort surfacing latent bugs in legacy code.',
      'Per-function vs per-file granularity enables incremental adoption but creates mixed-mode codebases that can confuse readers.',
    ],
    edgeCases: [
      'A "use strict" directive that is not the first statement is silently ignored, so strict mode is not actually enabled.',
      'Concatenating scripts can apply or drop strictness depending on order; bundlers avoid this by scoping each module.',
      'Eval strictness depends on context — strict eval cannot leak bindings, sloppy eval can.',
    ],
    runtimeBehavior: [
      'Plain-call `this` is undefined under strict mode; arrow functions ignore this and use lexical `this` regardless.',
      'Read-only/non-extensible/non-configurable violations throw rather than no-op, so immutability becomes enforceable.',
      'arguments no longer tracks reassigned parameters, making argument handling deterministic.',
    ],
    scalability: [
      'Codebase-wide strictness (via modules) prevents accidental global pollution that otherwise grows into hard-to-trace cross-module coupling.',
      'Predictable variable/parameter semantics reduce the surface area for subtle, scale-dependent bugs.',
    ],
    productionConcerns: [
      'When migrating large sloppy codebases, expect newly-thrown errors that represent real pre-existing bugs; fix them rather than reverting.',
      'Ensure your build pipeline scopes modules so strictness stays per-unit and concatenation cannot alter it.',
      'Document that detached methods throw on `this` access under strict mode to guide debugging.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Enable: "use strict" as the FIRST statement (script or function).',
    'Auto-on in ES modules and class bodies.',
    'Undeclared assignment → ReferenceError (no accidental globals).',
    'Plain-call this → undefined (not the global object).',
    'Write read-only / freeze → TypeError (no silent failure).',
    'Banned: with, octal literals, duplicate params, reserved-word assignment.',
    'eval cannot leak bindings into the enclosing scope.',
    'arguments no longer aliases named parameters.',
    'Does NOT change correct code — only makes mistakes loud.',
    'Directive must be first, or it is silently ignored.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a strict-mode function and show that assigning to an undeclared variable throws.',
      hint: 'Add "use strict" first, then assign without declaring.',
      solution: {
        lang: 'js',
        code: `function f() {\n  'use strict'\n  return (oops = 1) // ReferenceError: oops is not defined\n}\ntry { f() } catch (e) { console.log(e.name) } // "ReferenceError"`,
        explanation: [
          'The directive enables strict mode for this function only.',
          'Assigning to the undeclared `oops` throws instead of creating a global.',
          'Catching it confirms the error name is ReferenceError.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Demonstrate the difference in `this` between strict and sloppy plain function calls.',
      hint: 'Compare a function with and without the directive.',
      solution: {
        lang: 'js',
        code: `function strictThis() { 'use strict'; return this }\nconsole.log(strictThis()) // undefined\n\n// (In a sloppy script) function sloppyThis() { return this }\n// sloppyThis() would return the global object.`,
        explanation: [
          'Strict mode sets `this` to undefined for a plain call.',
          'Sloppy mode would substitute the global object instead.',
          'This explains why detached methods throw under strict mode.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show two strict-mode operations on a frozen object: a silent-in-sloppy write and a delete, both throwing.',
      hint: 'Object.freeze then write and delete inside try/catch.',
      solution: {
        lang: 'js',
        code: `'use strict'\nconst o = Object.freeze({ a: 1 })\ntry { o.a = 2 } catch (e) { console.log('write:', e.name) }   // TypeError\ntry { delete o.a } catch (e) { console.log('delete:', e.name) } // TypeError`,
        explanation: [
          'Object.freeze makes properties non-writable and non-configurable.',
          'Writing to `a` throws a TypeError in strict mode (silent no-op in sloppy mode).',
          'Deleting the non-configurable `a` also throws a TypeError.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A teammate added "use strict" mid-file and says it "did nothing". Explain why and fix it.',
      hint: 'The directive must be the first statement.',
      solution: {
        lang: 'js',
        code: `// BROKEN: directive is not first -> ignored, strict mode NOT enabled\n// const x = 1\n// 'use strict'\n\n// FIXED: directive must be the very first statement\nfunction unit() {\n  'use strict'\n  const x = 1\n  return x\n}`,
        explanation: [
          'A "use strict" directive only takes effect as the first statement of a script or function body.',
          'Placed after other code, it is parsed as a harmless string expression and ignored.',
          'Moving it to the top (or relying on ES modules) correctly enables strict mode.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Strict mode underlies all modern JavaScript because modules are strict by default. Understanding it explains real behaviors — undefined `this`, thrown errors on bad writes, no accidental globals — that show up in everyday debugging and in interviews.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is strict mode and how do you enable it" and one or two differences. Product companies (Zoho, Flipkart, Razorpay) probe the `this` change and which features it forbids. FAANG-level interviews discuss mixed-mode codebases, module-default strictness, eval isolation, and optimization implications.',
    whatInterviewersExpect:
      'They expect you to know how to enable it (directive first; implicit in modules/classes), name several concrete changes (undeclared-assignment errors, undefined `this`, thrown writes, banned constructs), and explain that it makes mistakes loud and code more optimizable without changing correct behavior.',
  },
}

export default strictMode
