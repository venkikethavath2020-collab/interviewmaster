import type { ConceptLesson } from '../../../types/lesson'

const prototypePollution: ConceptLesson = {
  // 1. Concept Summary
  slug: 'prototype-pollution',
  name: 'Prototype Pollution',
  category: 'security',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Prototype pollution lets an attacker inject properties onto Object.prototype, silently changing the behavior of EVERY object in the app — a uniquely JavaScript class of bug.',
    'It powers real CVEs in popular libraries (lodash, jQuery, minimist) and can escalate to denial of service, property tampering, and even remote code execution on the server.',
    'It teaches you a deep truth about JS: objects inherit from a shared prototype, so polluting the shared parent is a global mutation.',
    'Interviewers (especially security-minded ones) use it to test whether you really understand the prototype chain, not just classes.',
    'It hides in innocent-looking code — a recursive merge or deep-set from user JSON — so recognizing the pattern prevents a whole bug family.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Prototype pollution is like sneaking a rule into the school\'s master rulebook that every classroom secretly copies.',
    story: [
      'Imagine every classroom in a school automatically follows a single master rulebook kept in the principal\'s office.',
      'Normally only the principal edits it. But suppose a student finds a sneaky way to write into that master book.',
      'They scribble "everyone gets an automatic A" into the master rulebook — and now EVERY classroom suddenly behaves by that fake rule, because they all copy from the same book.',
      'In JavaScript, all objects quietly share one "master rulebook" called the prototype. If an attacker can sneak a property into it, every object in the program suddenly inherits that property — and that can break or hijack the whole app.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In JavaScript, objects do not stand alone — they inherit shared properties from a common parent object called the prototype.',
    'If you can change that shared prototype, every object that inherits from it sees the change, because they all look up missing properties on the same parent.',
    'Prototype pollution is an attack where untrusted input (like JSON from a user) is used to write a property onto that shared prototype, often through a special key like "__proto__".',
    'After that, code elsewhere that reads a property assumes it is safe, but actually gets the attacker\'s injected value — which can change logic, crash the app, or open a security hole.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Prototype pollution is a vulnerability where an attacker injects or modifies properties on Object.prototype (or another shared prototype) by abusing keys like "__proto__", "constructor", or "prototype" in untrusted input, causing those properties to appear on all objects via inheritance.',
    how: 'Vulnerable code recursively merges or deep-sets attacker-controlled keys into an object without filtering dangerous keys. When the path includes "__proto__", the write lands on the shared prototype instead of the target object.',
    why: 'Because JavaScript resolves a missing property by walking up the prototype chain, an injected property on Object.prototype is inherited by every plain object. Code that later reads that property trusts a value the attacker controls.',
    code: {
      label: 'A vulnerable deep-merge',
      lang: 'js',
      code: `function merge(target, source) {\n  for (const key in source) {\n    if (typeof source[key] === 'object') {\n      target[key] = target[key] || {}\n      merge(target[key], source[key]) // recurses into __proto__ too!\n    } else {\n      target[key] = source[key]\n    }\n  }\n  return target\n}\n\nconst userInput = JSON.parse('{\"__proto__\": {\"isAdmin\": true}}')\nmerge({}, userInput)\n\nconst anyObject = {}\nconsole.log(anyObject.isAdmin) // true  ← polluted!`,
      explanation: [
        'merge walks keys from attacker-controlled JSON, including the special "__proto__" key.',
        'When key is "__proto__", target.__proto__ refers to the shared prototype, so the recursion writes onto it.',
        'isAdmin: true is now set on Object.prototype.',
        'Every plain object — including ones created elsewhere — now inherits isAdmin === true.',
        'Code that checks user.isAdmin without owning the property is silently fooled.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Prototype pollution is an injection vulnerability specific to prototype-based languages in which untrusted input is used to assign properties along an object path that traverses inheritance-controlling keys ("__proto__", "constructor", "prototype"), causing writes to land on a shared prototype object (commonly Object.prototype). Because property resolution walks the prototype chain, the injected members are inherited by all objects sharing that prototype, enabling property tampering, logic subversion, denial of service, and—when polluted properties flow into sensitive sinks like template engines, child_process options, or option objects—potentially remote code execution.',

  // 7. Internal Working
  internalWorking: [
    'A plain object\'s [[Prototype]] points to Object.prototype; reading a missing property walks this chain until found or null.',
    'Accessing obj["__proto__"] is a special accessor that reads/writes the object\'s [[Prototype]] (the shared parent), not an own property named __proto__.',
    'Vulnerable recursive merge/set code follows the attacker-provided key path; when it reaches "__proto__", further assignment targets the shared prototype object.',
    'The assignment mutates Object.prototype, adding an enumerable own property there (or modifying constructor.prototype via the "constructor"/"prototype" path).',
    'From then on, any object lacking its own copy of that property inherits the polluted value during the chain walk.',
    'Downstream code that reads the property — for access control, configuration, or to pass into a sink — receives attacker-controlled data, which is where impact (DoS/tamper/RCE) materializes.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  attacker JSON: { "__proto__": { "isAdmin": true } }
                         │  vulnerable merge / deep-set
                         ▼
              ┌────────────────────────┐
              │   Object.prototype      │  ← polluted: isAdmin = true
              │   (shared by ALL)       │
              └───────────┬────────────┘
            inherits      │      inherits
        ┌─────────────────┼──────────────────┐
        ▼                 ▼                   ▼
   {} userObj        {} configObj        {} sessionObj
   .isAdmin → true   .isAdmin → true     .isAdmin → true
   (none own it, all read the polluted parent)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Object.prototype is a single object on the heap, referenced by the [[Prototype]] slot of every plain object — one shared parent, many children.',
    'Pollution adds an own property to that single shared heap object, so the change is global by construction, not copied per object.',
    'Each child object still has its own properties on the heap; the polluted value is only seen when a property is MISSING locally and the chain walk reaches the parent.',
    'Defining an own property on a child (or freezing the prototype) shadows/prevents the inherited polluted value.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — demonstrating the pollution',
      lang: 'js',
      code: `const obj = {}\nobj.__proto__.polluted = 'yes' // writes to Object.prototype\n\nconst fresh = {}\nconsole.log(fresh.polluted) // 'yes' — inherited\nconsole.log({}.polluted)    // 'yes' — every object affected`,
      explanation: [
        'obj.__proto__ is the shared Object.prototype, not an own property.',
        'Assigning to it mutates the global parent of all plain objects.',
        'A brand-new object fresh inherits "polluted" even though we never touched it.',
        'This shows why pollution is global: there is one shared prototype.',
      ],
    },
    intermediate: {
      label: 'Intermediate — exploiting a default-merge config',
      lang: 'js',
      code: `function applyDefaults(opts) {\n  const config = {}\n  for (const k in opts) config[k] = opts[k] // naive copy via deep paths elsewhere\n  return config\n}\n\n// Attacker sends crafted JSON to an endpoint that deep-merges it\nconst malicious = JSON.parse('{\"__proto__\":{\"admin\":true,\"shell\":\"/bin/sh\"}}')\nunsafeDeepMerge({}, malicious)\n\n// Unrelated code later:\nfunction checkAccess(user) {\n  if (user.admin) grantAdmin() // user never had admin... now inherits it\n}`,
      explanation: [
        'The danger is the deep-merge that recurses into __proto__, not the shallow copy shown here.',
        'Once Object.prototype.admin is true, an access check reading user.admin is fooled.',
        'The injected "shell" could flow into a sink (e.g. child_process options) for RCE.',
        'The vulnerability and the impact are in DIFFERENT parts of the code — what makes it sneaky.',
      ],
    },
    advanced: {
      label: 'Advanced — safe deep merge that blocks pollution',
      lang: 'js',
      code: `const DANGEROUS = new Set(['__proto__', 'constructor', 'prototype'])\n\nfunction safeMerge(target, source) {\n  for (const key of Object.keys(source)) {\n    if (DANGEROUS.has(key)) continue // skip pollution keys\n    const val = source[key]\n    if (val && typeof val === 'object' && !Array.isArray(val)) {\n      target[key] = safeMerge(target[key] ?? Object.create(null), val)\n    } else {\n      target[key] = val\n    }\n  }\n  return target\n}`,
      explanation: [
        'An explicit denylist skips __proto__, constructor, and prototype keys entirely.',
        'Object.keys only returns OWN enumerable keys (and __proto__ from JSON.parse is an own key, so we still must check it).',
        'Object.create(null) makes prototype-less objects so even nested writes have no chain to pollute.',
        'This is the defensive shape real libraries adopted after their CVEs.',
      ],
    },
    realProject: {
      label: 'Real project — hardening an Express JSON API',
      lang: 'js',
      code: `// Reject pollution keys before they reach business logic\nfunction rejectProtoKeys(req, res, next) {\n  const bad = (obj) => {\n    if (obj && typeof obj === 'object') {\n      for (const k of Object.keys(obj)) {\n        if (k === '__proto__' || k === 'constructor' || k === 'prototype') return true\n        if (bad(obj[k])) return true\n      }\n    }\n    return false\n  }\n  if (bad(req.body)) return res.status(400).json({ error: 'invalid keys' })\n  next()\n}\n\napp.use(express.json())\napp.use(rejectProtoKeys)`,
      explanation: [
        'A middleware recursively scans the parsed JSON body for dangerous keys and rejects them outright.',
        'This stops pollution at the boundary before any merge/set runs on the data.',
        'In production you would also use Map / Object.create(null) for config and freeze Object.prototype where feasible.',
        'Modern Node and libraries also strip __proto__ during parsing, but defense-in-depth at the API edge is prudent.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'intermediate',
      question: 'What is prototype pollution?',
      answer: 'A vulnerability where untrusted input writes a property onto a shared prototype (usually Object.prototype) via keys like __proto__, so every object inheriting from it is affected.',
      explanation: 'Naming the shared-prototype mechanism and the __proto__ vector is the core.',
    },
    {
      level: 'intermediate',
      question: 'Why does writing to __proto__ affect other objects?',
      answer: 'Because __proto__ accesses the object\'s [[Prototype]] — the shared parent. Property lookups walk the prototype chain, so a property added to the shared parent is inherited by all objects that lack their own copy.',
      explanation: 'This tests genuine understanding of the prototype chain, not just memorized syntax.',
    },
    {
      level: 'advanced',
      question: 'What kinds of code are typically vulnerable?',
      answer: 'Recursive deep-merge, deep-clone, deep-set/lodash.set-style functions, query-string/JSON parsers, and config mergers that copy attacker-controlled keys without filtering __proto__/constructor/prototype.',
      explanation: 'Recognizing the recursive-write pattern is what prevents the whole bug class.',
    },
    {
      level: 'advanced',
      question: 'How can prototype pollution escalate to RCE?',
      answer: 'If a polluted property flows into a dangerous sink — e.g. a template engine option, child_process spawn options, or a property used to build a command — the attacker-controlled value can lead to code execution. Pollution + gadget chain = RCE.',
      explanation: 'Mentioning the "gadget" concept (pollution sets the stage, a sink completes the exploit) is senior-level.',
    },
    {
      level: 'senior',
      question: 'How do you defend against prototype pollution?',
      answer: 'Denylist/skip __proto__, constructor, prototype in merges; use Object.create(null) or Map for untrusted key-value data; validate input with schemas; freeze Object.prototype (Object.freeze) where feasible; use Node\'s --disable-proto flag and updated libraries; and prefer structuredClone over hand-rolled deep clones.',
      explanation: 'A layered answer (input validation + safe data structures + runtime hardening) signals maturity.',
    },
    {
      level: 'senior',
      question: 'Why does Object.create(null) help?',
      answer: 'It creates an object with NO prototype, so there is no chain to walk and no shared parent to pollute. Lookups of __proto__ are just normal keys with no special meaning, and inherited pollution cannot reach it.',
      explanation: 'Connecting the fix to the absence of a prototype chain shows deep understanding.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is prototype pollution different from XSS or injection?',
    'What is the difference between __proto__, prototype, and constructor?',
    'Why can JSON.parse produce a __proto__ key, and is it dangerous on its own?',
    'How would you safely deep-clone untrusted data?',
    'What is a "gadget" in the context of prototype pollution?',
    'Does using a Map instead of an object eliminate the risk?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Writing recursive merge/set/clone that copies arbitrary keys from untrusted input.',
      why: 'It will happily recurse into __proto__/constructor and write to the shared prototype.',
      fix: 'Skip dangerous keys, use Object.create(null) for accumulators, or use vetted library versions / structuredClone.',
    },
    {
      mistake: 'Assuming "it is just JSON, JSON is safe".',
      why: 'JSON can contain a "__proto__" key, and code that deep-merges it triggers pollution.',
      fix: 'Validate against a schema and strip/reject prototype-related keys at the input boundary.',
    },
    {
      mistake: 'Checking inherited properties with the in operator or dot access for security decisions.',
      why: 'Polluted properties are inherited, so user.isAdmin or "isAdmin" in user can be true even without an own property.',
      fix: 'Use Object.hasOwn(obj, key) / hasOwnProperty for security-relevant checks, and prototype-less objects.',
    },
    {
      mistake: 'Believing one fix in one library is enough.',
      why: 'Pollution can be introduced by any vulnerable dependency in the tree, and gadgets can live elsewhere.',
      fix: 'Patch dependencies, run npm audit, validate input, and harden the runtime (freeze prototype / --disable-proto).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Config mergers, query/body parsers, and ORM filter builders are classic sinks; teams use --disable-proto, Object.create(null) for option maps, and schema validation (zod/ajv) at the edge.' },
    { area: 'Backend', detail: 'API request bodies are validated against strict schemas; lodash.merge/set were patched after CVEs, and reject-proto middleware blocks dangerous keys before business logic.' },
    { area: 'React', detail: 'Apps that deep-merge server-driven config or theme objects from untrusted sources can be polluted; safe merge utilities and frozen defaults mitigate it.' },
    { area: 'Vue', detail: 'Plugin/option merging and store hydration from untrusted JSON should avoid hand-rolled deep merge; use validated payloads and prototype-less accumulators.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Safe-merge guards add only a cheap key check per property, negligible at normal payload sizes.',
      'Object.create(null) maps can be marginally faster for pure key-value lookups (no prototype chain to consider).',
    ],
    bad: [
      'Naive recursive merges over deeply nested untrusted input can be a DoS vector (CPU/stack), independent of pollution.',
      'Recursive input scanning for dangerous keys adds overhead on very large payloads.',
    ],
    optimizations: [
      'Cap recursion depth and payload size to prevent algorithmic DoS during merges.',
      'Validate with compiled schemas (ajv) so rejection happens fast and once.',
      'Prefer structuredClone (native, C++-backed) over hand-rolled deep clone for both safety and speed.',
      'Use Map for large dynamic key sets to avoid prototype concerns entirely.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Global property tampering subverting access-control flags (e.g. inherited isAdmin/role).',
      'Denial of service by overriding methods like toString or hasOwnProperty on the prototype.',
      'Escalation to RCE when a polluted property reaches a sink (template engine, child_process options, eval-like paths).',
      'Silent, hard-to-trace bugs because the vulnerable write and the exploited read are far apart.',
    ],
    bestPractices: [
      'Reject/strip __proto__, constructor, prototype from untrusted input at the boundary.',
      'Use Object.create(null) or Map for untrusted key-value data; validate with schemas.',
      'Freeze Object.prototype where feasible and run Node with --disable-proto=throw.',
      'Keep dependencies patched (npm audit) and prefer structuredClone/vetted merge utilities.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['prototype', 'prototype-chain', 'object-creation'],
    nextConcepts: ['object-immutability', 'shallow-vs-deep-copy', 'supply-chain-security', 'xss'],
    dependencyNote:
      'Prototype pollution is a direct consequence of the prototype chain and object creation, so master those first. It connects to object immutability (freezing as defense), deep-copy safety, and supply-chain security (vulnerable deps introduce it).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw Object.prototype as one box with arrows up from several plain objects.',
      'Show attacker JSON {"__proto__":{"isAdmin":true}} feeding a recursive merge.',
      'Draw the write landing on the shared Object.prototype box, not the target.',
      'Now show every object reading .isAdmin and getting true via inheritance.',
      'Add the fix: skip __proto__ key, or use Object.create(null) so there is no shared parent.',
      'Say: "One shared prototype means one malicious write becomes a global change — defend at input and use prototype-less data."',
    ],
    diagram: `  {"__proto__":{"isAdmin":true}} ─merge─► Object.prototype.isAdmin = true
        {} ─┐
        {} ─┼─► all inherit .isAdmin === true
        {} ─┘
   FIX: skip __proto__ / Object.create(null) / freeze prototype`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Prototype pollution is when untrusted input writes onto a shared prototype (usually Object.prototype) via keys like __proto__, so every object inherits the injected property. It hides in recursive merge/set/clone code that copies attacker keys. Impact ranges from access-control tampering to DoS to RCE when a polluted value reaches a sink. Defend by stripping __proto__/constructor/prototype, using Object.create(null)/Map, validating input, freezing the prototype, and patching deps.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Prototype pollution is a JavaScript-specific injection vulnerability rooted in the prototype chain. Every plain object inherits from a shared parent, Object.prototype, and property lookups walk up that chain. The special key __proto__ accesses an object\'s prototype rather than an own property, so if attacker-controlled input flows into code that recursively merges, deep-sets, or clones keys without filtering, a path through __proto__ writes onto the shared prototype. From that point on, every object that lacks its own copy of the property inherits the attacker\'s value. The dangerous part is that the vulnerable write and the eventual exploit are usually in different places: pollution might set Object.prototype.isAdmin to true, and unrelated access-control code reading user.isAdmin is silently fooled. It can also cause denial of service by overriding methods like toString, and it can escalate to remote code execution when a polluted property becomes a "gadget" feeding a sink like a template engine or child_process options. Typical culprits are deep-merge utilities, config mergers, and query parsers — lodash, minimist, and jQuery all had CVEs here. To defend, I reject or strip __proto__, constructor, and prototype at the input boundary, use Object.create(null) or Map for untrusted key-value data, validate with a schema, freeze Object.prototype where feasible, run Node with --disable-proto, and keep dependencies patched. For deep cloning I prefer the native structuredClone over hand-rolled recursion.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Freezing Object.prototype is strong defense but can break libraries that monkey-patch it; test thoroughly.',
      'Object.create(null) maps remove the chain but lose convenient Object methods and toString, complicating debugging/logging.',
    ],
    edgeCases: [
      'JSON.parse legitimately produces an own "__proto__" key (not the accessor), which is harmless until a merge interprets it as the accessor.',
      'The "constructor.prototype" path bypasses naive __proto__-only filters.',
      'Arrays and class instances also have prototypes that can be polluted.',
      'Pollution can be transient or persistent depending on whether the write hits Object.prototype or a per-instance prototype.',
    ],
    runtimeBehavior: [
      'Only property READS that miss locally consult the chain, so an own property shadows the polluted one.',
      'Object.defineProperty with enumerable:false on the prototype can make pollution stealthier but is still inherited.',
      'Node\'s --disable-proto=throw turns __proto__ access into a thrown error, neutralizing the common vector.',
    ],
    scalability: [
      'A single polluted prototype affects the entire process, so in shared/long-lived servers one request can taint all subsequent requests.',
      'Worker isolation/per-request contexts limit blast radius; schema validation at the edge scales the defense uniformly.',
    ],
    productionConcerns: [
      'Audit transitive dependencies — pollution often enters via a deep dep, not your code.',
      'Add tests that assert Object.prototype is untouched after handling crafted payloads.',
      'Log and alert on rejected __proto__/constructor keys as a potential attack signal.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Prototype pollution = untrusted input writes to a shared prototype (Object.prototype).',
    'Vector keys: __proto__, constructor, prototype.',
    'Mechanism: prototype chain — all objects inherit the injected property.',
    'Common sinks: deep-merge, deep-set, deep-clone, query/body parsers.',
    'Impact: access-control tampering, DoS, RCE (via gadget → sink).',
    'Vulnerable write and exploited read are often far apart.',
    'Fix 1: skip/strip __proto__/constructor/prototype keys.',
    'Fix 2: Object.create(null) or Map for untrusted data.',
    'Fix 3: schema validation at the boundary.',
    'Fix 4: freeze Object.prototype / Node --disable-proto.',
    'Use Object.hasOwn for security checks (not inherited reads).',
    'Prefer native structuredClone over hand-rolled deep clone.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function isDangerousKey(key) that returns true for __proto__, constructor, or prototype.',
      hint: 'A simple set membership check.',
      solution: {
        lang: 'js',
        code: `const BAD = new Set(['__proto__', 'constructor', 'prototype'])\nfunction isDangerousKey(key) {\n  return BAD.has(key)\n}`,
        explanation: [
          'These three keys are the standard prototype-pollution vectors.',
          'A set lookup is O(1) and easy to reuse in merge/validation code.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a safeSet(obj, path, value) that sets a nested value but refuses to traverse dangerous keys.',
      hint: 'Split the path and bail if any segment is dangerous; use Object.create(null) for new nodes.',
      solution: {
        lang: 'js',
        code: `const BAD = new Set(['__proto__', 'constructor', 'prototype'])\nfunction safeSet(obj, path, value) {\n  const parts = path.split('.')\n  let cur = obj\n  for (let i = 0; i < parts.length - 1; i++) {\n    const k = parts[i]\n    if (BAD.has(k)) throw new Error('blocked: ' + k)\n    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = Object.create(null)\n    cur = cur[k]\n  }\n  const last = parts[parts.length - 1]\n  if (BAD.has(last)) throw new Error('blocked: ' + last)\n  cur[last] = value\n  return obj\n}`,
        explanation: [
          'Every path segment is checked against the denylist before traversal/assignment.',
          'New intermediate nodes use Object.create(null) so they have no prototype to pollute.',
          'Throwing on dangerous keys turns a silent exploit into a loud, testable failure.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a safeDeepMerge that merges untrusted source into target without pollution and without prototype-bearing accumulators.',
      hint: 'Recurse only over Object.keys, skip dangerous keys, build with Object.create(null).',
      solution: {
        lang: 'js',
        code: `const BAD = new Set(['__proto__', 'constructor', 'prototype'])\nfunction safeDeepMerge(target, source) {\n  for (const key of Object.keys(source)) {\n    if (BAD.has(key)) continue\n    const val = source[key]\n    if (val && typeof val === 'object' && !Array.isArray(val)) {\n      const next = (target[key] && typeof target[key] === 'object')\n        ? target[key]\n        : Object.create(null)\n      target[key] = safeDeepMerge(next, val)\n    } else {\n      target[key] = val\n    }\n  }\n  return target\n}`,
        explanation: [
          'Object.keys returns own enumerable keys; we still skip the dangerous ones explicitly.',
          'Nested accumulators are Object.create(null), so even a missed key cannot reach a real prototype.',
          'Arrays are treated as leaf values to avoid index-merge surprises.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Given the vulnerable merge from the lesson, write a test that proves Object.prototype is NOT polluted after merging a malicious payload, then show the safe merge passing it.',
      hint: 'Assert that a fresh {} does not inherit the injected key.',
      solution: {
        lang: 'js',
        code: `function assertNoPollution() {\n  const malicious = JSON.parse('{\"__proto__\":{\"hacked\":true}}')\n  safeDeepMerge(Object.create(null), malicious)\n  const probe = {}\n  if (probe.hacked !== undefined) throw new Error('POLLUTED!')\n  console.log('clean: Object.prototype untouched')\n}\nassertNoPollution()`,
        explanation: [
          'After running the safe merge with a crafted payload, a brand-new object must NOT inherit "hacked".',
          'If it did, probe.hacked would be defined via the polluted prototype — the test catches that.',
          'This kind of regression test belongs in your suite for any merge/clone utility handling untrusted data.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Prototype pollution proves you understand the prototype chain at a level beyond classes and syntax — and that you can spot a dangerous pattern (recursive merge of untrusted keys) that has caused real CVEs in lodash and jQuery.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely ask it directly. Product companies (Zoho, Flipkart, Razorpay) and security-focused teams ask you to spot/fix a vulnerable merge. FAANG-level interviews probe gadget chains, RCE escalation, and runtime hardening like --disable-proto and freezing.',
    whatInterviewersExpect:
      'They expect you to explain the shared-prototype mechanism, identify the __proto__/constructor/prototype vectors, recognize vulnerable merge/set/clone code, and give layered defenses: input validation, prototype-less data structures, and runtime hardening.',
  },
}

export default prototypePollution
