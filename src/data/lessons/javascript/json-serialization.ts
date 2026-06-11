import type { ConceptLesson } from '../../../types/lesson'

const jsonSerialization: ConceptLesson = {
  // 1. Concept Summary
  slug: 'json-serialization',
  name: 'JSON & Serialization',
  category: 'iteration-collections',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'JSON is the universal data format of the web — every API request, response, config file, and localStorage value passes through JSON.stringify / JSON.parse.',
    'Serialization (object -> string) and deserialization (string -> object) are where subtle data-loss bugs hide: dates become strings, undefined/functions vanish, Map/Set turn into {}.',
    'Knowing the edge cases (circular references, NaN/Infinity, BigInt) prevents crashes and corrupted data in production.',
    'Interviewers ask it to test whether you understand what JSON can and cannot represent and how replacer/reviver and toJSON customize the process.',
    'It connects to security (never eval JSON, prototype pollution via __proto__) and performance (large payloads block the main thread).',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Serialization is flattening a Lego castle into a written list so you can mail it and rebuild it later.',
    story: [
      'Imagine you built an amazing Lego castle and want to send it to a friend far away.',
      'You cannot post the whole castle, so you write down a careful list: which bricks, what colours, how they connect.',
      'Your friend reads the list and rebuilds the exact same castle from your instructions.',
      'JSON.stringify is writing that list (turning your object into text to send), and JSON.parse is your friend rebuilding the castle (turning the text back into an object). But some special pieces — like a glued-on motor — cannot be written on paper, so they get lost in the mail.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A computer stores data as objects in memory, but to send it over the internet or save it to a file, it must become plain text.',
    'JSON is a simple text format made of objects, arrays, strings, numbers, true/false, and null — and almost every language understands it.',
    'JSON.stringify turns a JavaScript object into a JSON text string; JSON.parse turns a JSON string back into an object.',
    'Some JavaScript things have no JSON equivalent — like functions or undefined — so they are dropped or changed when converted, which can surprise you.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'JSON (JavaScript Object Notation) is a text-based data interchange format. Serialization is converting an in-memory value to a JSON string with JSON.stringify; deserialization is parsing a JSON string back to a value with JSON.parse.',
    how: 'JSON.stringify(value, replacer?, space?) walks the value and emits JSON, honoring any toJSON() methods and a replacer to filter/transform. JSON.parse(text, reviver?) builds the value, with an optional reviver to transform nodes (e.g. revive Date strings).',
    why: 'It is the lingua franca for APIs, storage, and config; understanding exactly how values map to JSON (and what is lost) prevents data corruption and runtime errors.',
    code: {
      label: 'Round-trip and what gets lost',
      lang: 'js',
      code: `const data = {\n  name: 'Sam',\n  age: 30,\n  joined: new Date('2024-01-01'),\n  greet: () => 'hi',     // function — dropped\n  nickname: undefined,   // undefined — dropped\n  scores: [1, 2, 3],\n}\n\nconst json = JSON.stringify(data)\n// {"name":"Sam","age":30,"joined":"2024-01-01T00:00:00.000Z","scores":[1,2,3]}\n\nconst back = JSON.parse(json)\nconsole.log(typeof back.joined) // 'string' — Date became a string!`,
      explanation: [
        'JSON.stringify keeps name, age, and scores faithfully.',
        'The function and the undefined property are silently DROPPED — JSON has no representation for them.',
        'The Date is serialized via its toJSON() into an ISO string, and JSON.parse does NOT turn it back into a Date.',
        'So a naive round-trip is lossy; you often need a reviver to restore types like dates.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'JSON is a language-independent text format derived from a subset of JavaScript object syntax, representing objects, arrays, strings, numbers, booleans, and null. JSON.stringify(value, replacer?, space?) serializes a value: it invokes any toJSON() method, applies the replacer (a function or allow-list array), drops functions, undefined, and symbols in objects (replacing them with null inside arrays), throws on circular references and BigInt, and converts NaN/Infinity to null. JSON.parse(text, reviver?) deserializes, optionally transforming each key/value bottom-up via the reviver. The mapping is lossy: Dates become ISO strings, Map/Set/typed-array/class identity are not preserved.',

  // 7. Internal Working
  internalWorking: [
    'JSON.stringify recursively walks the value; before serializing each value it calls that value\'s toJSON() method if present (Date defines one returning an ISO string).',
    'A replacer function, if provided, is invoked for each key/value (top-down) and its return value is serialized; an array replacer acts as an allow-list of keys.',
    'For objects, properties whose values are functions, undefined, or symbols are omitted; in arrays those slots become null to preserve positions.',
    'Special numbers NaN and Infinity serialize to null; BigInt and circular references throw TypeError.',
    'JSON.parse tokenizes and builds the structure, then if a reviver is given, walks the result bottom-up calling reviver(key, value) so children are transformed before parents (returning undefined deletes a key).',
    'The reviver is the hook to restore richer types — e.g. detecting an ISO date string and returning new Date(value).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   IN MEMORY (object)                JSON TEXT (string)
   ┌──────────────────┐  stringify   ┌────────────────────────┐
   │ { name:'Sam',     │ ───────────► │ {"name":"Sam",          │
   │   age:30,         │              │  "age":30,              │
   │   fn:()=>..,  ✗   │   (dropped)  │  ...                    │
   │   date:Date  ──┐  │   toJSON()   │  "date":"2024-..Z"} ◄─┐ │
   │ }              │  │              └────────────────────────┘ │
   └────────────────┼──┘                                          │
                    └─ becomes ISO string ────────────────────────┘
                    parse  ◄───────────────  (date stays a string
                                              unless a reviver fixes it)

   LOST IN TRANSLATION: functions, undefined, symbols, Map/Set, class type,
                        NaN/Infinity (->null); BigInt & cycles THROW.`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The in-memory object lives on the heap with references; stringify produces a brand-new string (also heap), so the two are independent.',
    'JSON.parse(JSON.stringify(obj)) is a common DEEP COPY trick: parse builds a fully new object graph with no shared references — but it is lossy and slow for large data.',
    'Circular references cannot be flattened to a finite string, so stringify throws rather than loop forever.',
    'Large payloads create large intermediate strings and parse trees, spiking memory and blocking the single thread during the synchronous operation.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — stringify with spacing and parse',
      lang: 'js',
      code: `const user = { name: 'Ada', roles: ['admin', 'editor'] }\n\nconst pretty = JSON.stringify(user, null, 2) // 2-space indent\nconsole.log(pretty)\n\nconst parsed = JSON.parse('{"name":"Ada","roles":["admin"]}')\nconsole.log(parsed.roles[0]) // 'admin'`,
      explanation: [
        'The third argument (space) pretty-prints with indentation — handy for logs and files.',
        'JSON.parse turns a JSON string back into a usable object.',
        'Arrays, strings, and nested structures round-trip faithfully.',
        'This is the everyday API/storage workflow.',
      ],
    },
    intermediate: {
      label: 'Intermediate — replacer (filter) and reviver (restore Date)',
      lang: 'js',
      code: `const data = { name: 'Sam', password: 'secret', joined: new Date() }\n\n// replacer as allow-list: drop sensitive fields\nconst safe = JSON.stringify(data, ['name', 'joined'])\n// {"name":"Sam","joined":"...Z"}  (password excluded)\n\n// reviver: turn ISO date strings back into Date objects\nconst reviver = (key, value) =>\n  key === 'joined' ? new Date(value) : value\nconst restored = JSON.parse(safe, reviver)\nconsole.log(restored.joined instanceof Date) // true`,
      explanation: [
        'An array replacer acts as an allow-list, omitting fields like password from the output.',
        'A function replacer could instead transform/redact values per key.',
        'The reviver runs on parse, converting the ISO string for joined back into a real Date.',
        'Replacer + reviver are the supported hooks to filter on the way out and restore types on the way in.',
      ],
    },
    advanced: {
      label: 'Advanced — custom toJSON and handling cycles',
      lang: 'js',
      code: `class Money {\n  constructor(cents) { this.cents = cents }\n  toJSON() { return { amount: this.cents / 100, currency: 'USD' } }\n}\nJSON.stringify({ price: new Money(1999) })\n// {"price":{"amount":19.99,"currency":"USD"}}\n\n// Cycles throw; use a replacer that tracks seen objects\nfunction safeStringify(obj) {\n  const seen = new WeakSet()\n  return JSON.stringify(obj, (k, v) => {\n    if (typeof v === 'object' && v !== null) {\n      if (seen.has(v)) return '[Circular]'\n      seen.add(v)\n    }\n    return v\n  })\n}`,
      explanation: [
        'Defining toJSON() lets a class control its own serialized shape — stringify calls it automatically.',
        'A circular structure normally throws TypeError.',
        'safeStringify uses a WeakSet to detect already-seen objects and replaces cycles with a marker.',
        'This pattern is how loggers serialize complex objects without crashing.',
      ],
    },
    realProject: {
      label: 'Real project — persisting state to localStorage in Vue/React',
      lang: 'js',
      code: `// Save and restore app state safely\nfunction saveState(key, state) {\n  try {\n    localStorage.setItem(key, JSON.stringify(state))\n  } catch (e) {\n    // QuotaExceeded or circular/BigInt error\n    console.warn('Could not persist state', e)\n  }\n}\n\nfunction loadState(key, fallback) {\n  const raw = localStorage.getItem(key)\n  if (!raw) return fallback\n  try {\n    return JSON.parse(raw)\n  } catch {\n    return fallback // corrupted JSON\n  }\n}\n// usage: const state = loadState('cart', { items: [] })`,
      explanation: [
        'localStorage stores only strings, so state must be serialized with JSON.stringify.',
        'stringify can throw (cycles, BigInt) and setItem can throw (quota) — wrap in try/catch.',
        'parse can throw on corrupted data — always guard and fall back to a default.',
        'This robust save/load is exactly how Pinia/Redux persistence plugins behave under the hood.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What do JSON.stringify and JSON.parse do?',
      answer: 'JSON.stringify converts a JavaScript value into a JSON string (serialization); JSON.parse converts a JSON string back into a JavaScript value (deserialization).',
      explanation: 'Foundational; mentioning serialization/deserialization terminology is a plus.',
    },
    {
      level: 'beginner',
      question: 'What happens to functions and undefined when you JSON.stringify an object?',
      answer: 'They are dropped entirely from object output (the key disappears). Inside an array, undefined/functions become null to keep positions.',
      explanation: 'A classic data-loss gotcha; the array-vs-object difference shows depth.',
    },
    {
      level: 'intermediate',
      question: 'Why does JSON.parse(JSON.stringify(obj)) not perfectly clone every object?',
      answer: 'It loses functions, undefined, symbols; converts Dates to strings; turns Map/Set into {}; drops class identity; converts NaN/Infinity to null; and throws on circular references or BigInt. It is a quick deep clone only for plain, JSON-safe data.',
      explanation: 'Tests whether the candidate knows the lossy mapping rather than treating it as a universal clone.',
    },
    {
      level: 'intermediate',
      question: 'What are the replacer and reviver parameters used for?',
      answer: 'The replacer (function or array allow-list) filters/transforms values during stringify — e.g. redacting secrets. The reviver transforms key/value pairs during parse — e.g. converting ISO strings back into Date objects.',
      explanation: 'Shows knowledge of the official customization hooks.',
    },
    {
      level: 'advanced',
      question: 'How do you serialize an object with circular references?',
      answer: 'Plain JSON.stringify throws on cycles. Use a replacer that tracks seen objects (WeakSet) and replaces repeats with a marker, or a library like flatted that encodes references, or restructure the data to remove the cycle.',
      explanation: 'Tests handling of a real production crash scenario.',
    },
    {
      level: 'senior',
      question: 'What are the security and performance concerns with JSON in production?',
      answer: 'Security: never use eval to parse JSON (use JSON.parse); guard against prototype pollution from __proto__ keys when building objects from untrusted JSON; validate schema. Performance: JSON.parse/stringify are synchronous and block the main thread on large payloads — stream-parse, chunk, offload to a worker, or paginate. BigInt cannot be represented, so design APIs to send big ids as strings.',
      explanation: 'Senior signal: connects JSON to injection, prototype pollution, event-loop blocking, and API design.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you deep-clone an object reliably? (structuredClone vs JSON trick)',
    'How would you serialize a Map or a Set?',
    'What is the toJSON method and when is it called?',
    'Why can BigInt not be JSON.stringified, and how do you work around it?',
    'How does the reviver traversal order work (bottom-up)?',
    'How would you stream-parse a huge JSON file in Node?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using JSON.parse(JSON.stringify(x)) as a universal deep clone.',
      why: 'It silently loses Dates (to strings), functions, undefined, Map/Set, and throws on cycles/BigInt.',
      fix: 'Use structuredClone for a faithful deep clone of structured data; reserve the JSON trick for plain JSON-safe objects.',
    },
    {
      mistake: 'Not wrapping JSON.parse in try/catch for external/stored data.',
      why: 'Malformed JSON throws SyntaxError and can crash the app.',
      fix: 'Wrap parse in try/catch and provide a sensible fallback; validate the shape afterward.',
    },
    {
      mistake: 'Assuming Dates survive a round-trip.',
      why: 'stringify turns Date into an ISO string; parse leaves it a string.',
      fix: 'Use a reviver to detect and rebuild Date objects, or store epoch numbers.',
    },
    {
      mistake: 'Trusting __proto__ / constructor keys when building objects from parsed JSON.',
      why: 'Untrusted keys can trigger prototype pollution in vulnerable merge code.',
      fix: 'Validate keys, use Map or Object.create(null), and reject dangerous keys.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Pinia persistence plugins serialize store state to localStorage with JSON.stringify and restore with JSON.parse; revivers rehydrate dates/typed data. Component props sent to SSR are JSON-serialized.' },
    { area: 'React', detail: 'Redux state, server-rendered initial state (window.__INITIAL_STATE__), and Next.js getServerSideProps all rely on JSON serialization; non-serializable values (Dates, functions) must be avoided or transformed.' },
    { area: 'Node.js', detail: 'res.json() serializes responses; express/body-parser deserializes requests. Large payloads block the event loop, so streaming JSON parsers and pagination are used for big data.' },
    { area: 'Backend', detail: 'APIs send big numeric ids as strings to survive JSON (no BigInt); schema validation (zod/ajv) runs after JSON.parse to guard against malformed or malicious input.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Native JSON.parse/stringify are highly optimized C++ and fast for typical payload sizes.',
      'A replacer allow-list reduces payload size by serializing only needed fields.',
    ],
    bad: [
      'Both are synchronous and block the single thread; multi-MB payloads cause visible jank or server latency.',
      'The JSON deep-clone trick re-serializes and re-parses, which is slow and allocates twice for large objects.',
    ],
    optimizations: [
      'Paginate or stream large responses; use streaming JSON parsers in Node for big files.',
      'Offload heavy parsing to a Web Worker (browser) or worker_threads (Node) to avoid event-loop starvation.',
      'Send only required fields (replacer/allow-list, GraphQL field selection) to shrink payloads.',
      'Prefer structuredClone over the JSON trick for cloning structured data.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Prototype pollution: merging untrusted parsed JSON with __proto__/constructor keys can corrupt Object.prototype.',
      'Using eval() to parse JSON executes arbitrary code (never do this).',
      'Trusting unvalidated parsed data leads to injection and logic bypasses downstream.',
    ],
    bestPractices: [
      'Always use JSON.parse, never eval; wrap in try/catch.',
      'Validate parsed data against a schema (zod, ajv) before use.',
      'Use Map or Object.create(null) and reject __proto__/constructor keys when building objects from untrusted JSON.',
      'Redact secrets with a replacer before logging or sending JSON.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'object-creation', 'array-methods', 'shallow-vs-deep-copy'],
    nextConcepts: ['map-vs-object', 'prototype-pollution', 'fetch-api', 'typed-arrays', 'storage-apis'],
    dependencyNote:
      'JSON serialization builds on data types and object structure and is the practical face of shallow-vs-deep copy; it connects forward to fetch/storage APIs, prototype pollution (a parse-time risk), and alternative binary formats (typed arrays).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw an object box on the left and a JSON string on the right with a "stringify" arrow between them and a "parse" arrow back.',
      'Annotate the stringify arrow: drops functions/undefined/symbols, Date -> ISO string, NaN/Infinity -> null.',
      'Mark cycles and BigInt with an X (they throw).',
      'On the parse side, note "string stays string" and draw a reviver hook to restore Dates.',
      'Add toJSON() on the object as a way it controls its own output.',
      'Conclude: round-trip is lossy; use structuredClone for cloning and revivers for type restoration.',
    ],
    diagram: `   { obj }  --stringify-->  "json text"  --parse-->  { obj' }
       │  toJSON() called          ▲                       ▲
       │  drop fn/undefined/sym    │ allow-list/transform  │ reviver
       │  Date->ISO, NaN/Inf->null │ (replacer)            │ (restore Date)
       └─ cycles & BigInt => THROW
   Clone faithfully: structuredClone(obj)  (not the JSON trick)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JSON is the web\'s text data format. JSON.stringify serializes a value to a JSON string; JSON.parse deserializes back. The mapping is lossy: functions, undefined, and symbols are dropped, Dates become ISO strings, Map/Set become {}, NaN/Infinity become null, and cycles or BigInt throw. Use a replacer to filter/redact on output and a reviver to restore types (like Dates) on input, and toJSON() to let a class control its shape. The JSON trick deep-clones only plain data — use structuredClone for fidelity. Watch security: never eval, guard __proto__, validate, and remember parse/stringify block the thread.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JSON is the standard text format for exchanging data, and JavaScript gives us two built-ins: JSON.stringify to serialize a value into a JSON string, and JSON.parse to deserialize a string back into a value. The crucial thing to understand is that the mapping is lossy because JSON only models objects, arrays, strings, numbers, booleans, and null. So when I stringify, functions, undefined, and symbols are dropped from objects — and turned into null inside arrays to keep positions. Dates are serialized via their toJSON method into ISO strings but do not come back as Dates on parse. Map and Set serialize to empty objects, NaN and Infinity become null, and circular references or BigInt values throw a TypeError. Two hooks let me customize this: a replacer during stringify, which can be a function to transform or redact values or an array acting as an allow-list, and a reviver during parse, which runs bottom-up and lets me rebuild richer types like turning an ISO string back into a Date. A class can also define toJSON to control its own serialized shape. People often use JSON.parse of JSON.stringify as a deep clone, but because it is lossy and throws on cycles, I prefer structuredClone for faithful cloning. Finally, in production I am careful: I never eval JSON, I wrap parse in try/catch and validate the result against a schema, I guard against prototype pollution from __proto__ keys, and I remember both operations are synchronous and can block the thread, so large payloads get paginated, streamed, or moved to a worker.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'JSON is human-readable and universal but verbose and lossy versus binary formats (MessagePack, Protobuf) that are compact and typed.',
      'The JSON clone trick is convenient but slow and lossy; structuredClone is faithful but cannot copy functions either.',
      'Revivers add type fidelity at the cost of parse-time CPU and coupling the consumer to the wire format.',
    ],
    edgeCases: [
      'Inside arrays, undefined/function/symbol become null; in objects they vanish — different behaviors.',
      'Reviver runs bottom-up; returning undefined deletes the key, which can surprise.',
      'toJSON is called before the replacer sees the value, so order matters when both are used.',
      'BigInt throws; large 64-bit ids lose precision if sent as numbers, so APIs send them as strings.',
    ],
    runtimeBehavior: [
      'stringify recursively calls toJSON, then applies the replacer, then emits text; parse builds then revives.',
      'Both are synchronous and CPU-bound, blocking the event loop proportional to payload size.',
      'Property order in output follows object key order (integer keys first), which can affect signature/hash stability.',
    ],
    scalability: [
      'Multi-MB JSON blocks the main thread; stream parsing, pagination, or worker offload is required at scale.',
      'For high-throughput services, consider binary protocols or partial/field-selective payloads to cut CPU and bandwidth.',
    ],
    productionConcerns: [
      'Validate and schema-check all untrusted JSON after parsing; never eval.',
      'Guard prototype pollution when constructing objects from parsed input.',
      'Be deliberate about types crossing the wire (Dates, BigInt) with revivers and string-encoded ids.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'stringify = serialize (obj -> string); parse = deserialize (string -> obj).',
    'Dropped in objects: functions, undefined, symbols; in arrays they become null.',
    'Date -> ISO string (via toJSON); parse leaves it a string.',
    'NaN/Infinity -> null; BigInt and cycles -> throw.',
    'Map/Set -> {} (no entries); class identity lost.',
    'replacer: filter/redact on stringify (fn or allow-list array).',
    'reviver: transform on parse (bottom-up); revive Dates here.',
    'toJSON(): a value customizes its own serialized form.',
    'Deep clone faithfully: structuredClone, not the JSON trick.',
    'Always try/catch JSON.parse on external data.',
    'Security: never eval, guard __proto__, validate schema.',
    'parse/stringify are sync and block the thread on big payloads.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Pretty-print { a: 1, b: [2, 3] } as JSON with 2-space indentation, then parse it back.',
      hint: 'Third arg of stringify is the spacing.',
      solution: {
        lang: 'js',
        code: `const obj = { a: 1, b: [2, 3] }\nconst json = JSON.stringify(obj, null, 2)\nconsole.log(json)\nconst back = JSON.parse(json)\nconsole.log(back.b[1]) // 3`,
        explanation: [
          'Passing 2 as the space argument indents the output for readability.',
          'null as the replacer means "serialize everything".',
          'JSON.parse reconstructs the object so back.b[1] is 3.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a reviver that converts any value matching an ISO date string into a Date object during parse.',
      hint: 'Test the string with a regex inside the reviver.',
      solution: {
        lang: 'js',
        code: `const isoRe = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/\nfunction parseWithDates(json) {\n  return JSON.parse(json, (key, value) =>\n    typeof value === 'string' && isoRe.test(value) ? new Date(value) : value\n  )\n}\nconst r = parseWithDates('{"joined":"2024-01-01T00:00:00.000Z"}')\nconsole.log(r.joined instanceof Date) // true`,
        explanation: [
          'The reviver inspects every parsed value.',
          'If a string matches the ISO date pattern, it returns a new Date instead of the string.',
          'This restores type fidelity that plain JSON.parse cannot.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement safeStringify(obj) that serializes objects containing circular references, replacing cycles with "[Circular]".',
      hint: 'Track visited objects in a WeakSet inside a replacer.',
      solution: {
        lang: 'js',
        code: `function safeStringify(obj, space) {\n  const seen = new WeakSet()\n  return JSON.stringify(obj, (key, value) => {\n    if (typeof value === 'object' && value !== null) {\n      if (seen.has(value)) return '[Circular]'\n      seen.add(value)\n    }\n    return value\n  }, space)\n}\n\nconst a = { name: 'a' }\na.self = a\nconsole.log(safeStringify(a)) // {"name":"a","self":"[Circular]"}`,
        explanation: [
          'A WeakSet records objects already visited during serialization.',
          'When stringify revisits a seen object (a cycle), the replacer returns a marker instead of recursing.',
          'This prevents the TypeError that plain JSON.stringify throws on circular structures.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Serialize a Map<string, number> to JSON and parse it back into a Map, preserving entries.',
      hint: 'Use a tagged structure or spread the entries to an array.',
      solution: {
        lang: 'js',
        code: `function serializeMap(map) {\n  return JSON.stringify({ __type: 'Map', value: [...map] })\n}\nfunction deserializeMap(json) {\n  const obj = JSON.parse(json)\n  return obj.__type === 'Map' ? new Map(obj.value) : obj\n}\n\nconst m = new Map([['a', 1], ['b', 2]])\nconst json = serializeMap(m)\nconst restored = deserializeMap(json)\nconsole.log(restored.get('b')) // 2`,
        explanation: [
          'JSON has no Map type, so we wrap the entries array with a type tag.',
          'Spreading the Map yields [key, value] pairs that JSON can represent.',
          'On parse we detect the tag and rebuild the Map from the entries — a common pattern for custom types over JSON.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Almost every app feature touches JSON — APIs, storage, config, SSR. Knowing precisely what survives serialization (and what does not) prevents a whole class of silent data-loss and crash bugs, which is exactly the practical competence interviewers want to see.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what stringify/parse do and what gets dropped. Product companies (Zoho, Flipkart, Razorpay) ask about deep cloning pitfalls, revivers, and circular references. FAANG-level interviews probe security (prototype pollution, never eval), BigInt/precision, and how to handle multi-MB payloads without blocking the event loop.',
    whatInterviewersExpect:
      'They expect you to explain serialization vs deserialization, enumerate the lossy cases accurately, use replacer/reviver/toJSON appropriately, handle cycles, prefer structuredClone for cloning, and speak to the security and performance implications in production.',
  },
}

export default jsonSerialization
