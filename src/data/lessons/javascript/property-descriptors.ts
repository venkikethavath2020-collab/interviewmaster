import type { ConceptLesson } from '../../../types/lesson'

const propertyDescriptors: ConceptLesson = {
  // 1. Concept Summary
  slug: 'property-descriptors',
  name: 'Property Descriptors & Accessors',
  category: 'objects-prototypes',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Every property has hidden attributes (writable, enumerable, configurable) that control whether it can be changed, looped over, or deleted — and they silently shape your objects.',
    'Getters and setters (accessor properties) let you compute values on access and intercept assignment — the foundation of computed props, validation, and Vue 2 reactivity.',
    'Misunderstanding enumerable causes bugs where for...in or JSON.stringify unexpectedly include or skip properties.',
    'Object.freeze, Object.defineProperty, and immutability all work by manipulating descriptors — you cannot reason about them without this concept.',
    'Senior interviews use descriptors to test whether you understand the difference between data and accessor properties and how libraries define safe, non-enumerable APIs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A property descriptor is the set of rules on a toy box: can you change what is inside, can people see it on the shelf, can you throw the box away.',
    story: [
      'Imagine each toy box in your room has three little switches taped to it.',
      'One switch says "can the toy inside be swapped" (writable), one says "does this box show up when someone lists your toys" (enumerable), and one says "is the box allowed to be removed or have its switches changed" (configurable).',
      'Some boxes have a magic lid: when you open it, a toy is built right then (a getter), and when you put something in, a little helper checks it first (a setter).',
      'A property descriptor is just that little card of switches and magic-lid rules attached to every box — it decides how the box behaves even though you only ever see the toy.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'An object property is not just a name and value — it also carries hidden settings that decide how it behaves.',
    'These settings include: can the value be changed (writable), does it appear when you list the object’s keys (enumerable), and can the property be deleted or reconfigured (configurable).',
    'Some properties are not stored values at all — they are functions in disguise: a getter runs when you read the property and a setter runs when you assign to it.',
    'You inspect these settings with Object.getOwnPropertyDescriptor and set them with Object.defineProperty.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A property descriptor is an object describing how a property behaves. Data descriptors have value + writable; accessor descriptors have get + set. Both share enumerable and configurable.',
    how: 'You read a descriptor with Object.getOwnPropertyDescriptor(obj, key) and define/modify one with Object.defineProperty(obj, key, descriptor). Normal assignment (`obj.x = 1`) creates a data property with all flags true.',
    why: 'Descriptors let you make read-only or hidden properties, define computed getters/setters for validation and derived values, and build immutable or safe APIs.',
    code: {
      label: 'Inspecting and defining descriptors',
      lang: 'js',
      code: `const obj = {}
Object.defineProperty(obj, 'id', {
  value: 42,
  writable: false,      // cannot reassign
  enumerable: false,    // hidden from for...in / JSON
  configurable: false,  // cannot delete or redefine
})
obj.id = 99             // ignored (throws in strict mode)
console.log(obj.id)     // 42
console.log(Object.keys(obj)) // [] — non-enumerable
console.log(Object.getOwnPropertyDescriptor(obj, 'id'))
// { value: 42, writable: false, enumerable: false, configurable: false }`,
      explanation: [
        'Object.defineProperty creates `id` with explicit attributes — note defaults are false when defined this way.',
        '`writable: false` makes the value read-only; assignment is silently ignored (or throws in strict mode).',
        '`enumerable: false` hides it from Object.keys, for...in, and JSON.stringify.',
        '`configurable: false` locks the descriptor so it cannot be deleted or redefined.',
        'A normal `obj.x = 1` instead gives all three flags `true`.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A property descriptor is the meta-object describing a single object property. There are two mutually exclusive kinds: a data descriptor with `value` and `writable`, and an accessor descriptor with `get` and `set` functions. Both share `enumerable` (whether the key appears in for...in, Object.keys, and JSON serialization) and `configurable` (whether the descriptor may be changed or the property deleted). Properties created via literal/assignment are data properties with all attributes true; those created via Object.defineProperty default the unspecified boolean attributes to false. Accessor properties intercept reads (get) and writes (set), enabling computed values, validation, and reactivity, and they cannot also have value/writable.',

  // 7. Internal Working
  internalWorking: [
    'Internally, an object stores each own property as a slot containing either a data descriptor ([[Value]], [[Writable]]) or an accessor descriptor ([[Get]], [[Set]]), plus [[Enumerable]] and [[Configurable]].',
    'On a read (`obj.x`), if the property is a data property the engine returns [[Value]]; if it is an accessor it invokes [[Get]] with `this` bound to the receiver and returns the result.',
    'On a write (`obj.x = v`), a data property checks [[Writable]] (no-op or throw if false); an accessor invokes [[Set]](v) — or fails if no setter exists.',
    'Object.defineProperty validates the descriptor, then sets the internal attributes; if [[Configurable]] is false, most subsequent redefinitions throw a TypeError.',
    'Enumeration operations (for...in, Object.keys, JSON.stringify, spread) skip properties whose [[Enumerable]] is false; Reflect.ownKeys and getOwnPropertyNames still see them.',
    'Object.freeze sets every own property to writable:false, configurable:false and seals the object (no new properties), which is how immutability is implemented at the descriptor level.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  PROPERTY  obj.x
  ┌───────────────────────────────────────────┐
  │ DATA descriptor        ACCESSOR descriptor │
  │ ┌──────────────┐       ┌──────────────┐    │
  │ │ value: 42    │       │ get: fn ()   │    │
  │ │ writable: T/F│  OR   │ set: fn (v)  │    │
  │ └──────────────┘       └──────────────┘    │
  │ shared:  enumerable: T/F   configurable:T/F│
  └───────────────────────────────────────────┘
   read  obj.x ──► value   |  get()  → computed
   write obj.x=v ─► writable|  set(v) → intercept`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each own property is a descriptor record attached to the object’s shape; the data value (if primitive) is stored inline, while object values are references onto the heap.',
    'Accessor properties store function references (get/set) rather than a value slot, so reading them runs code instead of returning stored memory.',
    'Non-enumerable and non-configurable flags are bits in the descriptor — they cost nothing extra but change which operations may touch the slot.',
    'Object.freeze does not deep-freeze: nested object references still point to mutable heap objects unless you freeze them too.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — getter and setter',
      lang: 'js',
      code: `const temp = {
  celsius: 0,
  get fahrenheit() { return this.celsius * 9 / 5 + 32 },
  set fahrenheit(f) { this.celsius = (f - 32) * 5 / 9 },
}
temp.celsius = 100
console.log(temp.fahrenheit) // 212 (computed on read)
temp.fahrenheit = 32
console.log(temp.celsius)    // 0 (set intercepts the write)`,
      explanation: [
        '`get fahrenheit` runs on read and computes from celsius — no stored value.',
        '`set fahrenheit` runs on assignment and updates celsius instead.',
        'Callers use it like a normal property; the computation is hidden.',
        'This is the everyday use of accessor descriptors.',
      ],
    },
    intermediate: {
      label: 'Intermediate — non-enumerable internal field',
      lang: 'js',
      code: `function makeModel(data) {
  const model = { ...data }
  Object.defineProperty(model, '_dirty', {
    value: false,
    writable: true,
    enumerable: false,   // hidden from JSON & loops
    configurable: false,
  })
  return model
}
const m = makeModel({ name: 'Sam' })
m._dirty = true
console.log(JSON.stringify(m))  // {"name":"Sam"} — _dirty hidden
console.log(Object.keys(m))     // ['name']`,
      explanation: [
        '`_dirty` is defined as non-enumerable so it never leaks into serialization or for...in.',
        'It is still writable so the app can flip it.',
        'This is how libraries attach internal bookkeeping without polluting the public shape.',
        'JSON.stringify and Object.keys both skip non-enumerable properties.',
      ],
    },
    advanced: {
      label: 'Advanced — validation via setter + freeze',
      lang: 'js',
      code: `function createAccount() {
  let _balance = 0
  const acct = {
    get balance() { return _balance },
    set balance(v) {
      if (typeof v !== 'number' || v < 0) throw new Error('Invalid balance')
      _balance = v
    },
  }
  return Object.freeze(acct) // can't add/replace the accessors
}
const a = createAccount()
a.balance = 100
console.log(a.balance)  // 100
try { a.balance = -5 } catch (e) { console.log(e.message) } // Invalid balance`,
      explanation: [
        'The setter validates every assignment, rejecting invalid values.',
        '`_balance` is private via closure; only the accessor can touch it.',
        'Object.freeze locks the accessor descriptors so the API cannot be tampered with.',
        'freeze on accessor properties prevents redefinition but the getter/setter still run.',
      ],
    },
    realProject: {
      label: 'Real project — computed properties (Vue) and read-only config (Node)',
      lang: 'js',
      code: `// Vue 2 reactivity is built on Object.defineProperty getters/setters:
// it converts each data key into an accessor that tracks deps on get
// and triggers re-render on set (conceptually):
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true, configurable: true,
    get() { /* track dependency */ return val },
    set(newVal) { if (newVal !== val) { val = newVal; /* notify */ } },
  })
}

// Node: expose a read-only, non-enumerable version string on exports
Object.defineProperty(module.exports, 'VERSION', {
  value: '1.2.3', writable: false, enumerable: false,
})`,
      explanation: [
        'Vue 2 famously used Object.defineProperty to turn data keys into accessors that track dependencies and trigger updates.',
        'The getter records who read the value; the setter notifies watchers — the heart of its reactivity.',
        'In Node, defining a read-only non-enumerable VERSION keeps it stable and out of enumeration.',
        'Vue 3 moved to Proxy, but the descriptor-based model is still the canonical example of accessors in production.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a property descriptor and what attributes does it have?',
      answer: 'A meta-object describing a property. A data descriptor has value and writable; an accessor descriptor has get and set. Both share enumerable and configurable.',
      explanation: 'Naming the two kinds and the four attributes is the baseline expected answer.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between a data property and an accessor property?',
      answer: 'A data property stores a value and is controlled by writable. An accessor property has no stored value — it runs a getter on read and a setter on write. A property cannot be both.',
      explanation: 'Emphasizing that accessors run functions (not return stored memory) shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'What does enumerable control, and what is affected by it?',
      answer: 'Whether the property shows up in for...in, Object.keys, Object.entries, spread, and JSON.stringify. Non-enumerable properties are hidden from those but visible to Object.getOwnPropertyNames and Reflect.ownKeys.',
      explanation: 'Listing the operations affected demonstrates practical knowledge of where it matters.',
    },
    {
      level: 'advanced',
      question: 'What is the difference between Object.defineProperty defaults and assignment defaults?',
      answer: 'Assignment (`obj.x = 1`) creates a data property with writable, enumerable, configurable all true. Object.defineProperty defaults any unspecified boolean attribute to false — so a defined property is read-only, hidden, and locked unless you opt in.',
      explanation: 'This default difference is a classic gotcha that trips up people who only use assignment.',
    },
    {
      level: 'advanced',
      question: 'How does Object.freeze use descriptors, and is it deep?',
      answer: 'Freeze sets every own property to writable:false and configurable:false and prevents adding new properties. It is shallow — nested object references remain mutable unless individually frozen.',
      explanation: 'Connecting freeze to descriptor flags and noting shallowness is the expected senior detail.',
    },
    {
      level: 'senior',
      question: 'How did Vue 2 use property descriptors for reactivity, and why did Vue 3 switch to Proxy?',
      answer: 'Vue 2 walked each data object and replaced keys with accessor descriptors that tracked dependencies on get and notified watchers on set. Limitations: it could not detect added/deleted keys or array index changes without special APIs, and it had to recurse the whole object up front. Proxy intercepts all operations including new keys and deletions, so Vue 3 adopted it.',
      explanation: 'Senior signal: tying descriptors to a real framework, and articulating the precise limitations Proxy solved.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you make a property read-only after creation?',
    'What is the difference between Object.freeze, Object.seal, and Object.preventExtensions?',
    'How do getters/setters defined in a class differ from defineProperty? (they sit on the prototype, non-enumerable)',
    'Why might JSON.stringify skip a property you defined?',
    'How does Object.defineProperties differ from defineProperty?',
    'Can you redefine a non-configurable property? (no, with narrow exceptions)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming Object.defineProperty leaves a property writable/enumerable by default.',
      why: 'Unspecified attributes default to false, so the property becomes read-only, hidden, and locked unexpectedly.',
      fix: 'Explicitly set writable, enumerable, and configurable to the values you intend.',
    },
    {
      mistake: 'Treating Object.freeze as a deep freeze.',
      why: 'Freeze only locks the top-level own properties; nested objects stay mutable.',
      fix: 'Recursively freeze nested objects, or use structuredClone before freezing each level.',
    },
    {
      mistake: 'Defining both value/writable and get/set on one descriptor.',
      why: 'Data and accessor descriptors are mutually exclusive; mixing them throws a TypeError.',
      fix: 'Choose one kind — either a value+writable data property or a get/set accessor.',
    },
    {
      mistake: 'Putting heavy logic or side effects in a getter.',
      why: 'Getters look like cheap property reads but run code every access, surprising callers and serializers.',
      fix: 'Keep getters cheap/idempotent; memoize expensive computation or expose an explicit method.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue 2’s reactivity converted data keys into accessor descriptors that tracked dependencies and triggered updates; computed properties are getters with caching.' },
    { area: 'React', detail: 'Less common directly, but libraries define non-enumerable internal fields on objects/elements and use getters for lazy/derived values; immutability helpers rely on freeze.' },
    { area: 'Node.js', detail: 'Modules expose read-only, non-enumerable constants (versions, symbols) via defineProperty; many built-ins use accessors for lazily computed properties.' },
    { area: 'Backend', detail: 'ORMs define non-enumerable internal state on entities so it does not leak into JSON, and use setters for validation on assignment.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Non-enumerable internal fields keep serialization and iteration fast by excluding bookkeeping data.',
      'Getters enable lazy computation, deferring work until a value is actually read.',
    ],
    bad: [
      'Accessor properties run a function on every read/write, which is slower than reading a stored value and can deoptimize hot paths.',
      'Object.defineProperty on hot objects can trigger hidden-class transitions and slow property access.',
    ],
    optimizations: [
      'Prefer plain data properties in hot paths; reserve accessors for genuinely computed or validated values.',
      'Memoize expensive getters (compute once, cache) like Vue’s computed.',
      'Batch property definitions with Object.defineProperties to avoid repeated shape changes.',
      'Avoid toggling configurability/enumerability repeatedly at runtime; set them once at creation.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Defining configurable/writable getters on shared objects (or the prototype) can be abused to intercept reads or inject behavior — a vector in some prototype-pollution and gadget chains.',
      'Non-enumerable properties can hide sensitive data that still leaks via Reflect.ownKeys or getOwnPropertyNames, giving a false sense of privacy.',
    ],
    bestPractices: [
      'Freeze critical objects (writable:false, configurable:false) to prevent tampering with their descriptors.',
      'Do not rely on non-enumerable for secrecy; keep real secrets out of client-side objects entirely.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['object-creation', 'prototype', 'this-keyword'],
    nextConcepts: ['object-immutability', 'proxy-reflect', 'es6-classes', 'prototype-chain'],
    dependencyNote:
      'Property descriptors underpin object-immutability (freeze/seal) and are the descriptor-level counterpart to Proxy/Reflect; understanding them requires object creation and prototypes first.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a property as a card with four slots: value/writable on the left, get/set on the right, enumerable + configurable across the bottom.',
      'Cross out one side: a property is EITHER data (value/writable) OR accessor (get/set), never both.',
      'Show a read arrow: data → returns value; accessor → runs get().',
      'Show a write arrow: data → checks writable; accessor → runs set(v).',
      'Say: "Assignment makes all flags true; defineProperty defaults them to false — and freeze just sets writable and configurable to false everywhere."',
    ],
    diagram: `  PROPERTY CARD
  ┌── DATA ───────┐  ┌── ACCESSOR ──┐
  │ value         │  │ get()        │   (pick ONE side)
  │ writable      │  │ set(v)       │
  └───────────────┘  └──────────────┘
  shared: enumerable  configurable
  assign → all true   defineProperty → default false`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Every property has a descriptor. Data descriptors have value + writable; accessor descriptors have get + set; both share enumerable and configurable. Assignment makes all flags true; Object.defineProperty defaults unspecified flags to false. Getters run on read and setters on write, powering computed values, validation, and Vue 2 reactivity. Enumerable controls visibility in for...in/keys/JSON. Object.freeze sets writable and configurable to false (shallow). Inspect with getOwnPropertyDescriptor.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Behind every property is a descriptor — a small meta-object that controls how the property behaves. There are two kinds. A data descriptor has a value and a writable flag. An accessor descriptor has get and set functions and no stored value, so reading runs the getter and assigning runs the setter; the two kinds are mutually exclusive. Both share two flags: enumerable, which decides whether the property shows up in for...in, Object.keys, spread, and JSON.stringify; and configurable, which decides whether the property can be deleted or its descriptor changed. A subtle but important detail is the defaults: a normal assignment creates a data property with all three booleans true, but Object.defineProperty defaults any flag you omit to false, so a defined property is read-only, hidden, and locked unless you opt in. Object.freeze is built on this — it sets writable and configurable to false on every own property and blocks new ones, though it is shallow. The most famous production use is Vue 2’s reactivity, which replaced data keys with accessors that tracked dependencies on get and notified watchers on set; Vue 3 switched to Proxy because descriptors couldn’t catch newly added or deleted keys. I inspect descriptors with Object.getOwnPropertyDescriptor and define them with Object.defineProperty or defineProperties.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Accessors give encapsulation and computed/validated values but cost a function call per access and can deoptimize hot reads versus plain data properties.',
      'Non-enumerable internal fields keep public shapes clean but hide data from serialization, which can surprise debugging and tooling.',
    ],
    edgeCases: [
      'Object.defineProperty defaults omitted flags to false — a frequent source of "why is my property read-only/hidden".',
      'A non-configurable data property can still flip writable from true to false, but not the reverse.',
      'Getters/setters on a class prototype are non-enumerable by default, unlike object-literal data properties.',
      'Freeze is shallow; sealed objects allow value changes to existing writable properties but no add/delete.',
    ],
    runtimeBehavior: [
      'Reading an accessor invokes [[Get]] with `this` as the receiver, so getters on prototypes see the instance.',
      'Defining properties dynamically can transition an object off its optimized hidden class.',
      'Enumeration operations consult [[Enumerable]]; Reflect.ownKeys ignores it and also returns symbols.',
    ],
    scalability: [
      'Vue 2’s up-front recursive defineProperty had startup and memory cost for large reactive trees, which Proxy-based laziness improved.',
      'In high-throughput code, prefer monomorphic data properties; reserve accessors for boundaries where the cost is justified.',
    ],
    productionConcerns: [
      'JSON.stringify silently dropping non-enumerable or accessor-derived fields causes data-loss bugs at API boundaries.',
      'Configurable getters on shared/prototype objects are a tampering and gadget-chain vector; freeze sensitive objects.',
      'Deep immutability requires recursive freezing; relying on a single Object.freeze gives a false safety guarantee.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Data descriptor: value + writable. Accessor: get + set. Never both.',
    'Shared flags: enumerable, configurable.',
    'Assignment → all flags true.',
    'Object.defineProperty → omitted flags default to FALSE.',
    'enumerable: false → hidden from for...in / Object.keys / JSON / spread.',
    'configurable: false → cannot delete or redefine.',
    'writable: false → assignment ignored (throws in strict mode).',
    'Getter runs on read; setter runs on write; no stored value.',
    'Object.freeze = writable:false + configurable:false + no new keys (shallow).',
    'Object.seal = no add/delete but existing writable values changeable.',
    'Inspect: Object.getOwnPropertyDescriptor / descriptors.',
    'Vue 2 reactivity = defineProperty accessors; Vue 3 = Proxy.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Add a read-only `id` property with value 1 to an empty object such that reassigning it does nothing.',
      hint: 'Use Object.defineProperty with writable:false.',
      solution: {
        lang: 'js',
        code: `const obj = {}
Object.defineProperty(obj, 'id', { value: 1, writable: false })
obj.id = 99
console.log(obj.id)  // 1`,
        explanation: [
          'writable:false makes the value read-only.',
          'The assignment is silently ignored in non-strict mode (throws in strict mode).',
          'enumerable/configurable default to false here too.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Create a `circle` object with a `radius` and a computed, read-only `area` getter. Changing radius must change area.',
      hint: 'Use a getter that computes from radius.',
      solution: {
        lang: 'js',
        code: `const circle = {
  radius: 2,
  get area() { return Math.PI * this.radius ** 2 },
}
console.log(circle.area.toFixed(2)) // 12.57
circle.radius = 3
console.log(circle.area.toFixed(2)) // 28.27`,
        explanation: [
          '`area` is an accessor that recomputes from radius on every read.',
          'There is no stored area value, so it always reflects the current radius.',
          'It is read-only because no setter is defined.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write `defineHidden(obj, key, value)` that adds a writable but non-enumerable property, and prove it is excluded from JSON.stringify.',
      hint: 'Set enumerable:false, writable:true explicitly.',
      solution: {
        lang: 'js',
        code: `function defineHidden(obj, key, value) {
  Object.defineProperty(obj, key, {
    value, writable: true, enumerable: false, configurable: true,
  })
  return obj
}
const o = defineHidden({ name: 'Sam' }, '_meta', { ts: 1 })
console.log(JSON.stringify(o))   // {"name":"Sam"}
console.log(o._meta)             // { ts: 1 } — still readable`,
        explanation: [
          'enumerable:false hides the key from JSON.stringify and Object.keys.',
          'writable:true keeps it mutable for internal use.',
          'The value is still directly accessible by name.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement `observable(obj)` that returns a copy where each original key becomes a getter/setter logging reads and writes (a tiny reactivity core).',
      hint: 'Loop keys, keep the value in a closure, define accessors with Object.defineProperty.',
      solution: {
        lang: 'js',
        code: `function observable(obj) {
  const result = {}
  for (const key of Object.keys(obj)) {
    let val = obj[key]               // private backing value
    Object.defineProperty(result, key, {
      enumerable: true, configurable: true,
      get() { console.log('get', key); return val },
      set(v) { console.log('set', key, v); val = v },
    })
  }
  return result
}
const state = observable({ count: 0 })
state.count        // logs: get count
state.count = 5    // logs: set count 5`,
        explanation: [
          'Each key is replaced by an accessor descriptor; the value lives in a closure variable `val`.',
          'The getter logs and returns; the setter logs and updates — exactly Vue 2’s core idea.',
          'enumerable:true keeps the keys visible like normal data properties.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Property descriptors are where "advanced JavaScript" begins. They explain immutability, computed values, and framework reactivity in one model. Demonstrating fluency here marks you as someone who understands objects beyond surface syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely go this deep — at most asking about getters/setters. Product companies (Zoho, Flipkart, Razorpay) ask the data-vs-accessor distinction, enumerable’s effect on JSON, and freeze vs seal. FAANG-level interviews probe how Vue 2 reactivity worked, the defineProperty default-false trap, and writing a tiny observable.',
    whatInterviewersExpect:
      'They expect you to name the two descriptor kinds and four attributes, explain enumerable’s effect on iteration/JSON, recall the defineProperty default-false gotcha, and connect descriptors to freeze and framework reactivity.',
  },
}

export default propertyDescriptors
