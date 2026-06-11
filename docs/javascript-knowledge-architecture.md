# JavaScript Knowledge Architecture

Designed for an interview-preparation platform targeting Senior Frontend / Full-Stack developers.
This is a **knowledge map and dependency graph**, not explanatory content. Every concept has a
kebab-case slug intended for routes of the form `/javascript/<slug>`.

**Legend**
- Levels: `B` Beginner · `I` Intermediate · `A` Advanced · `S` Senior · `E` Expert
- Ratings: **Imp** = importance (1–5) · **Int** = interview frequency (1–5) · **RW** = real-world usage (1–5)
- Stars mark interview frequency: ⭐⭐⭐⭐⭐ must-know · ⭐⭐⭐⭐ frequently asked · ⭐⭐⭐ useful

---

## 1. Hierarchical Knowledge Tree

```
JavaScript
│
├── 1. Fundamentals & Engine
│   ├── what-is-javascript            [B] ⭐⭐
│   ├── ecmascript                    [B] ⭐⭐
│   ├── javascript-engines            [I] ⭐⭐⭐
│   ├── v8-architecture               [S] ⭐⭐⭐
│   ├── jit-compilation               [S] ⭐⭐⭐
│   ├── hidden-classes-inline-caches  [E] ⭐⭐        (overlooked)
│   └── strict-mode                   [I] ⭐⭐⭐
│
├── 2. Memory Model
│   ├── primitive-vs-reference        [B] ⭐⭐⭐⭐
│   ├── stack-vs-heap                 [I] ⭐⭐⭐⭐
│   ├── garbage-collection            [A] ⭐⭐⭐⭐
│   ├── memory-leaks                  [S] ⭐⭐⭐⭐
│   ├── weakmap-weakset               [A] ⭐⭐⭐
│   ├── weakref-finalizationregistry  [E] ⭐          (overlooked)
│   └── memory-profiling              [S] ⭐⭐        (overlooked)
│
├── 3. Variables, Types & Coercion
│   ├── var-let-const                 [B] ⭐⭐⭐⭐⭐
│   ├── data-types                    [B] ⭐⭐⭐
│   ├── null-vs-undefined             [B] ⭐⭐⭐⭐
│   ├── truthy-falsy                  [B] ⭐⭐⭐
│   ├── type-coercion                 [I] ⭐⭐⭐⭐
│   ├── equality-comparison           [B] ⭐⭐⭐⭐⭐
│   ├── typeof-instanceof             [B] ⭐⭐⭐
│   ├── ieee-754-floating-point       [A] ⭐⭐⭐⭐      (0.1 + 0.2)
│   ├── bigint                        [I] ⭐⭐
│   ├── symbol                        [A] ⭐⭐
│   ├── template-literals             [B] ⭐⭐
│   ├── tagged-templates              [A] ⭐          (overlooked)
│   └── optional-chaining-nullish     [B] ⭐⭐⭐
│
├── 4. Execution Model
│   ├── execution-context             [I] ⭐⭐⭐⭐⭐
│   ├── call-stack                    [I] ⭐⭐⭐⭐⭐
│   ├── scope                         [B] ⭐⭐⭐⭐
│   ├── scope-chain                   [I] ⭐⭐⭐⭐
│   ├── lexical-environment           [A] ⭐⭐⭐
│   ├── hoisting                      [B] ⭐⭐⭐⭐⭐
│   ├── temporal-dead-zone            [I] ⭐⭐⭐⭐
│   ├── closure                       [I] ⭐⭐⭐⭐⭐
│   ├── iife                          [I] ⭐⭐⭐
│   ├── this-keyword                  [I] ⭐⭐⭐⭐⭐
│   └── call-apply-bind               [I] ⭐⭐⭐⭐⭐
│
├── 5. Functions
│   ├── function-declaration-vs-expression [B] ⭐⭐⭐⭐
│   ├── arrow-functions               [B] ⭐⭐⭐⭐
│   ├── default-rest-spread           [B] ⭐⭐⭐
│   ├── callbacks                     [B] ⭐⭐⭐
│   ├── higher-order-functions        [I] ⭐⭐⭐⭐
│   ├── pure-functions                [I] ⭐⭐⭐
│   ├── recursion                     [I] ⭐⭐⭐⭐
│   ├── currying-partial-application  [A] ⭐⭐⭐⭐
│   ├── function-composition          [A] ⭐⭐
│   ├── memoization                   [A] ⭐⭐⭐⭐
│   └── generators                    [A] ⭐⭐
│
├── 6. Objects & Prototypes
│   ├── object-creation               [B] ⭐⭐⭐
│   ├── destructuring                 [B] ⭐⭐⭐
│   ├── property-descriptors          [A] ⭐⭐        (overlooked)
│   ├── prototype                     [I] ⭐⭐⭐⭐⭐
│   ├── prototype-chain               [I] ⭐⭐⭐⭐⭐
│   ├── constructor-functions-new     [I] ⭐⭐⭐⭐⭐
│   ├── es6-classes                   [I] ⭐⭐⭐⭐
│   ├── inheritance-patterns          [A] ⭐⭐⭐⭐
│   ├── object-immutability           [I] ⭐⭐⭐
│   ├── shallow-vs-deep-copy          [I] ⭐⭐⭐⭐⭐
│   └── proxy-reflect                 [E] ⭐⭐        (Vue 3 reactivity)
│
├── 7. Asynchronous JavaScript
│   ├── sync-vs-async                 [B] ⭐⭐⭐
│   ├── timers                        [B] ⭐⭐⭐⭐      (setTimeout/clamping)
│   ├── event-loop                    [A] ⭐⭐⭐⭐⭐
│   ├── macrotask-queue               [A] ⭐⭐⭐⭐⭐
│   ├── microtask-queue               [A] ⭐⭐⭐⭐⭐
│   ├── callback-hell                 [B] ⭐⭐⭐
│   ├── promises                      [I] ⭐⭐⭐⭐⭐
│   ├── promise-combinators           [A] ⭐⭐⭐⭐
│   ├── async-await                   [I] ⭐⭐⭐⭐⭐
│   ├── async-error-handling          [A] ⭐⭐⭐⭐
│   ├── fetch-api                     [B] ⭐⭐⭐⭐
│   ├── abortcontroller               [A] ⭐⭐⭐       (overlooked)
│   ├── concurrency-patterns          [S] ⭐⭐⭐       (pooling, retry, timeout)
│   └── event-loop-starvation         [S] ⭐⭐        (overlooked)
│
├── 8. Iteration & Collections
│   ├── array-methods                 [B] ⭐⭐⭐⭐⭐     (map/filter/reduce)
│   ├── map-vs-object                 [I] ⭐⭐⭐
│   ├── set-operations                [I] ⭐⭐⭐
│   ├── iterables-iterators           [A] ⭐⭐        (overlooked)
│   ├── json-serialization            [B] ⭐⭐⭐
│   └── typed-arrays                  [E] ⭐
│
├── 9. Modules
│   ├── commonjs                      [I] ⭐⭐⭐
│   ├── es-modules                    [I] ⭐⭐⭐⭐      (live bindings)
│   ├── esm-vs-cjs                    [A] ⭐⭐⭐⭐
│   ├── dynamic-imports               [A] ⭐⭐⭐
│   ├── top-level-await               [A] ⭐⭐
│   ├── tree-shaking                  [S] ⭐⭐⭐
│   ├── circular-dependencies         [S] ⭐⭐        (overlooked)
│   └── bundlers-module-resolution    [S] ⭐⭐
│
├── 10. Browser & DOM
│   ├── dom                           [B] ⭐⭐⭐
│   ├── bom                           [B] ⭐⭐
│   ├── event-system                  [I] ⭐⭐⭐⭐      (capture/bubble)
│   ├── event-delegation              [I] ⭐⭐⭐⭐⭐
│   ├── custom-events                 [I] ⭐⭐
│   ├── storage-apis                  [B] ⭐⭐⭐⭐
│   ├── script-loading                [I] ⭐⭐⭐⭐      (async/defer)
│   ├── browser-rendering-pipeline    [S] ⭐⭐⭐⭐      (reflow/repaint)
│   ├── observers                     [A] ⭐⭐⭐       (Intersection/Mutation/Resize)
│   ├── history-api                   [I] ⭐⭐⭐       (SPA routing)
│   ├── websocket-sse                 [A] ⭐⭐⭐
│   └── service-workers               [S] ⭐⭐
│
├── 11. Performance
│   ├── debounce                      [I] ⭐⭐⭐⭐⭐
│   ├── throttle                      [I] ⭐⭐⭐⭐⭐
│   ├── requestanimationframe         [A] ⭐⭐⭐
│   ├── web-workers                   [A] ⭐⭐⭐
│   ├── long-task-scheduling          [S] ⭐⭐        (rIC, scheduler.yield — overlooked)
│   ├── list-virtualization           [S] ⭐⭐⭐
│   ├── code-splitting-lazy-loading   [S] ⭐⭐⭐
│   └── core-web-vitals               [S] ⭐⭐⭐
│
├── 12. Error Handling & Debugging        (most-overlooked category)
│   ├── error-types-try-catch         [B] ⭐⭐⭐
│   ├── custom-errors-cause           [A] ⭐⭐
│   ├── global-error-handlers         [S] ⭐⭐        (unhandledrejection)
│   └── devtools-debugging            [I] ⭐⭐
│
├── 13. Security
│   ├── xss                           [A] ⭐⭐⭐⭐
│   ├── csrf                          [A] ⭐⭐⭐⭐
│   ├── cors                          [A] ⭐⭐⭐⭐⭐
│   ├── csp                           [S] ⭐⭐⭐
│   ├── secure-token-storage          [A] ⭐⭐⭐⭐
│   ├── prototype-pollution           [S] ⭐⭐        (overlooked)
│   ├── clickjacking                  [A] ⭐⭐
│   └── supply-chain-security         [S] ⭐⭐
│
└── 14. Design Patterns in JavaScript
    ├── module-pattern                [I] ⭐⭐⭐
    ├── factory-pattern               [I] ⭐⭐⭐
    ├── singleton-pattern             [I] ⭐⭐⭐⭐
    ├── observer-pattern              [A] ⭐⭐⭐⭐
    ├── event-emitter                 [A] ⭐⭐⭐⭐      (implement-it question)
    └── strategy-pattern              [A] ⭐⭐⭐
```

---

## 2. Dependency Graph — The Eight Learning Spines

Concepts are not flat: interviews probe whether you can walk a chain. These spines define
prerequisite order; a page for any node should link back to its prerequisites and forward
to what it unlocks.

### Spine 1 — Memory
```
data-types
└── primitive-vs-reference
    └── stack-vs-heap
        └── garbage-collection
            ├── memory-leaks
            │   └── memory-profiling
            └── weakmap-weakset
                └── weakref-finalizationregistry
```

### Spine 2 — Execution (the core of every JS interview)
```
scope
├── Prerequisite: stack-vs-heap
└── execution-context
    ├── Leads To: call-stack
    ├── Leads To: hoisting
    │   └── temporal-dead-zone   (← var-let-const)
    ├── Leads To: scope-chain
    │   └── lexical-environment
    └── Leads To: closure
        ├── Leads To: iife / module-pattern
        ├── Leads To: memoization
        ├── Leads To: currying-partial-application
        └── Leads To: debounce / throttle
```

### Spine 3 — `this` & Invocation
```
function-declaration-vs-expression
└── this-keyword
    ├── Prerequisite: execution-context
    ├── Leads To: call-apply-bind
    ├── Leads To: arrow-functions (lexical this)
    └── Leads To: es6-classes (method binding, class fields)
```

### Spine 4 — Objects & Prototypes
```
object-creation
├── property-descriptors
└── prototype
    └── prototype-chain
        ├── constructor-functions-new
        │   └── es6-classes
        │       └── inheritance-patterns (composition vs inheritance)
        ├── typeof-instanceof
        └── prototype-pollution (security)
```

### Spine 5 — Asynchrony
```
call-stack
└── event-loop
    ├── macrotask-queue  (← timers)
    ├── microtask-queue
    │   └── event-loop-starvation
    └── promises  (← callbacks, callback-hell)
        ├── promise-combinators
        ├── async-await
        │   └── async-error-handling
        ├── fetch-api
        │   └── abortcontroller
        └── concurrency-patterns (pools, retry, timeout-race)
```

### Spine 6 — DOM & Events → Performance
```
dom
└── event-system (capture → target → bubble)
    ├── event-delegation
    ├── custom-events → observer-pattern / event-emitter
    └── browser-rendering-pipeline
        ├── debounce / throttle (← closure)
        ├── requestanimationframe
        ├── observers (Intersection/Mutation/Resize)
        ├── long-task-scheduling → web-workers
        └── list-virtualization
```

### Spine 7 — Modules & Delivery
```
commonjs ── esm-vs-cjs ── es-modules (live bindings, static analysis)
                              ├── dynamic-imports → code-splitting-lazy-loading
                              ├── top-level-await
                              ├── tree-shaking
                              └── circular-dependencies
```

### Spine 8 — Security
```
dom + storage-apis + fetch-api
├── xss ── csp ── (Trusted Types)
├── cookies → csrf ── (SameSite)
├── same-origin policy → cors
├── secure-token-storage (XSS × storage intersection)
└── prototype-chain → prototype-pollution
```

---

## 3. Concept Catalog

Format per concept:
**slug — Name [Level] · Imp/Int/RW** — one-line definition
Prereqs → what it needs first · Related → siblings/unlocks · Asked → representative interview questions.

### 1. Fundamentals & Engine

**what-is-javascript — What is JavaScript [B] · 3/2/5**
Single-threaded, garbage-collected, JIT-compiled, multi-paradigm dynamic language with an event-loop concurrency model.
Prereqs: none · Related: ecmascript, javascript-engines, event-loop
Asked: "How can a single-threaded language handle thousands of concurrent requests?" · "Interpreted or compiled?"

**ecmascript — ECMAScript & TC39 [B] · 3/2/4**
The language specification JS implements; versions (ES5/ES6/ES2020+) are yearly spec releases driven by the TC39 proposal process.
Prereqs: what-is-javascript · Related: javascript-engines
Asked: "Difference between JavaScript and ECMAScript?" · "What ES6+ features do you use daily?"

**javascript-engines — JavaScript Engines [I] · 3/3/3**
Programs (V8, SpiderMonkey, JavaScriptCore) that parse, compile and execute JS; each browser/runtime embeds one.
Prereqs: ecmascript · Related: v8-architecture, jit-compilation
Asked: "What happens between loading a script and it running?"

**v8-architecture — V8 Architecture [S] · 3/3/3**
Parser → AST → Ignition (bytecode interpreter) → Maglev/TurboFan (optimizing JIT), plus Orinoco GC.
Prereqs: javascript-engines · Related: jit-compilation, hidden-classes-inline-caches, garbage-collection
Asked: "Walk through what V8 does with your code." · "What is bytecode vs machine code here?"

**jit-compilation — JIT Compilation & Deoptimization [S] · 3/3/3**
Hot functions are optimized with assumptions (types, shapes); violated assumptions trigger deoptimization back to bytecode.
Prereqs: v8-architecture · Related: hidden-classes-inline-caches
Asked: "Why can adding a property in different orders slow code down?" · "What is a deopt?"

**hidden-classes-inline-caches — Hidden Classes & Inline Caches [E] · 3/2/3**
Engines assign shared "shapes" to objects with identical layouts; call sites cache lookups per shape (monomorphic → megamorphic).
Prereqs: jit-compilation, prototype · Related: memory-profiling
Asked: "Why is `delete obj.x` a performance smell?" · "Monomorphic vs megamorphic call site?"

**strict-mode — Strict Mode [I] · 3/3/4**
`'use strict'` opt-in (automatic in modules/classes): undeclared-assignment throws, `this` is undefined in plain calls, bans `with`, duplicate params.
Prereqs: this-keyword · Related: es-modules
Asked: "What does strict mode change about `this`?" · "Why do modules not need the directive?"

### 2. Memory Model

**primitive-vs-reference — Primitives vs References [B] · 5/4/5**
Primitives copy by value; objects copy by reference — two variables can point at one heap object.
Prereqs: data-types · Related: stack-vs-heap, shallow-vs-deep-copy
Asked: "Why did mutating `b` change `a`?" · "Is JS pass-by-value or pass-by-reference?"

**stack-vs-heap — Stack vs Heap [I] · 4/4/3**
Call frames and primitives live on the stack (LIFO, fixed-size); objects, arrays, functions, closures live on the heap (GC-managed).
Prereqs: primitive-vs-reference · Related: call-stack, garbage-collection
Asked: "Where does a closure's captured variable live and why?"

**garbage-collection — Garbage Collection [A] · 4/4/3**
Reachability-based reclamation: generational scavenging for young objects, mark-sweep-compact for old; roots are globals, stack, active closures.
Prereqs: stack-vs-heap · Related: memory-leaks, weakmap-weakset
Asked: "How does GC decide what to free?" · "Can you force GC?" · "What is the cost of promotion?"

**memory-leaks — Memory Leaks [S] · 4/4/5**
Unintended reachability: forgotten timers/listeners, detached DOM nodes, unbounded caches, closures pinning large objects.
Prereqs: garbage-collection, closure · Related: memory-profiling, weakmap-weakset
Asked: "App slows down after hours of use — debug it." · "Name three leak sources and their fixes."

**weakmap-weakset — WeakMap & WeakSet [A] · 3/3/3**
Collections whose keys are weakly held — entries don't prevent GC; ideal for object-keyed metadata and caches.
Prereqs: garbage-collection · Related: memoization, weakref-finalizationregistry
Asked: "Map vs WeakMap for a cache?" · "Why can't you iterate a WeakMap?"

**weakref-finalizationregistry — WeakRef & FinalizationRegistry [E] · 2/1/2**
Explicit weak references and post-GC callbacks; last-resort tools for caches interacting with GC.
Prereqs: weakmap-weakset · Related: memory-leaks
Asked: "When would you ever need a WeakRef?"

**memory-profiling — Memory Profiling [S] · 3/2/4**
Heap snapshots, allocation timelines, retainer chains in DevTools to locate leaks and churn.
Prereqs: memory-leaks · Related: devtools-debugging
Asked: "Walk me through finding a leak with heap snapshots." · "What is a retainer chain?"

### 3. Variables, Types & Coercion

**var-let-const — var vs let vs const [B] · 5/5/5**
Function-scoped, hoisted-to-undefined `var` vs block-scoped, TDZ-guarded `let`/`const`; const = binding immutability, not value.
Prereqs: scope · Related: hoisting, temporal-dead-zone
Asked: "Output of var vs let in a loop with setTimeout?" · "Is a const object frozen?"

**data-types — Data Types [B] · 4/3/5**
Seven primitives (string, number, boolean, null, undefined, symbol, bigint) plus object; dynamic typing per value, not per variable.
Prereqs: none · Related: primitive-vs-reference, typeof-instanceof
Asked: "List the primitive types." · "Why is `typeof null` 'object'?"

**null-vs-undefined — null vs undefined [B] · 3/4/5**
undefined = not assigned (the default state); null = intentional absence assigned by code; `null == undefined` only loosely.
Prereqs: data-types · Related: optional-chaining-nullish, equality-comparison
Asked: "When would you assign null on purpose?" · "`null == undefined` vs `===`?"

**truthy-falsy — Truthy & Falsy [B] · 3/3/5**
Eight falsy values (false, 0, -0, 0n, '', null, undefined, NaN); everything else is truthy, including [] and {}.
Prereqs: data-types · Related: type-coercion
Asked: "Is an empty array truthy? Then why is `[] == false` true?"

**type-coercion — Type Coercion [I] · 4/4/4**
Implicit conversion rules: ToPrimitive (valueOf/toString), numeric conversion in comparisons, string conversion with `+`.
Prereqs: truthy-falsy · Related: equality-comparison
Asked: "Explain `[] + {}` vs `{} + []`." · "What does `'5' - 1` evaluate to and why?"

**equality-comparison — == vs === vs Object.is [B] · 4/5/5**
`===` no coercion; `==` coerces (only idiomatic use: `x == null`); Object.is differs on NaN and ±0.
Prereqs: type-coercion · Related: null-vs-undefined
Asked: "Walk through `[] == ![]`." · "How do you reliably check for NaN?"

**typeof-instanceof — typeof & instanceof [B] · 3/3/4**
typeof returns a primitive-type string (with the null quirk); instanceof walks the prototype chain against a constructor's prototype.
Prereqs: data-types, prototype-chain · Related: es6-classes
Asked: "Why is `typeof null` 'object'?" · "How does instanceof actually work?"

**ieee-754-floating-point — Floating Point & Safe Integers [A] · 3/4/3**
All numbers are 64-bit IEEE-754 doubles: 0.1 + 0.2 !== 0.3; integers safe only to 2^53−1.
Prereqs: data-types · Related: bigint
Asked: "Why doesn't 0.1 + 0.2 equal 0.3, and how do you compare?" · "What is Number.MAX_SAFE_INTEGER?"

**bigint — BigInt [I] · 2/2/2**
Arbitrary-precision integers (`10n`); cannot mix with Number in arithmetic; not JSON-serializable.
Prereqs: ieee-754-floating-point · Related: json-serialization
Asked: "When do you need BigInt in a frontend app?" (IDs from APIs)

**symbol — Symbol [A] · 3/2/3**
Unique, non-enumerable-by-default property keys; well-known symbols (Symbol.iterator) customize language behavior.
Prereqs: data-types · Related: iterables-iterators, property-descriptors
Asked: "What problem do Symbols solve?" · "Name a well-known symbol and its effect."

**template-literals — Template Literals [B] · 3/2/5**
Backtick strings with interpolation and multi-line support.
Prereqs: data-types · Related: tagged-templates
Asked: "Beyond interpolation, what can template literals do?"

**tagged-templates — Tagged Templates [A] · 2/1/2**
A function receiving the string parts and values of a template literal — powers styled-components, sql`` sanitizers, i18n.
Prereqs: template-literals, higher-order-functions · Related: xss
Asked: "How does styled-components use the language itself?"

**optional-chaining-nullish — Optional Chaining & Nullish Coalescing [B] · 3/3/5**
`?.` short-circuits on null/undefined; `??` defaults only on null/undefined (unlike `||` which trips on all falsy).
Prereqs: null-vs-undefined · Related: truthy-falsy
Asked: "`??` vs `||` — when does it matter?" · "When does `?.` hide real bugs?"

### 4. Execution Model

**execution-context — Execution Context [I] · 5/5/4**
The environment a piece of code runs in — variable environment, scope-chain reference, `this` — created in two phases: memory allocation, then execution.
Prereqs: scope, stack-vs-heap · Related → leads to: call-stack, hoisting, closure
Asked: "What happens when a JS file starts executing?" · "Explain the two phases." · "What lives inside a context?"

**call-stack — Call Stack [I] · 5/5/4**
LIFO stack of execution contexts; only the top runs; overflow = unbounded recursion; async callbacks always run on an empty stack.
Prereqs: execution-context · Related: event-loop, recursion, stack-vs-heap
Asked: "Why can't try/catch catch a setTimeout error?" · "What is a stack trace?"

**scope — Scope [B] · 5/4/5**
Where a binding is visible: global, function, block. Determined by code position (lexical), not call site.
Prereqs: var-let-const · Related: scope-chain, closure
Asked: "Function scope vs block scope?" · "What is the scope of a loop variable?"

**scope-chain — Scope Chain [I] · 4/4/4**
Lookup path through nested lexical environments, fixed at definition time; ends at global; miss = ReferenceError.
Prereqs: scope, execution-context · Related: lexical-environment, closure
Asked: "How is a variable resolved when not found locally?"

**lexical-environment — Lexical Environment [A] · 4/3/3**
Spec structure: environment record (bindings) + reference to outer environment — the machinery behind scope and closures.
Prereqs: scope-chain · Related: closure
Asked: "What exactly does a closure capture — values or the environment?"

**hoisting — Hoisting [B] · 4/5/3**
Declarations are registered during context creation: var → undefined, function declarations → fully usable, let/const → uninitialized.
Prereqs: execution-context · Related: temporal-dead-zone, var-let-const, function-declaration-vs-expression
Asked: "Output prediction with calls above declarations." · "Are let/const hoisted?" (yes — TDZ)

**temporal-dead-zone — Temporal Dead Zone [I] · 4/4/3**
The region from scope entry to a let/const declaration where access throws ReferenceError — hoisted but uninitialized.
Prereqs: hoisting · Related: var-let-const
Asked: "Why does `typeof x` throw here but not for undeclared variables?"

**closure — Closure [I] · 5/5/5**
A function retaining access to its defining scope after that scope's execution ends; captured variables live on the heap as long as the function is reachable.
Prereqs: scope-chain, garbage-collection · Leads to: memoization, debounce, throttle, currying, module-pattern, iife
Asked: "Define closure + a real use from your code." · "var-in-loop bug and fixes." · "Closure-caused memory leak?"

**iife — IIFE & Module Pattern Roots [I] · 3/3/2**
Immediately-invoked function expression: pre-ESM scope isolation and private state via closures.
Prereqs: closure · Related: module-pattern, es-modules
Asked: "Why were IIFEs everywhere before 2015?" · "What replaced them?"

**this-keyword — this [I] · 5/5/5**
Call-site-determined binding: new > bind > implicit (obj.method) > default (undefined in strict); arrows capture lexically instead.
Prereqs: execution-context, function-declaration-vs-expression · Related: call-apply-bind, arrow-functions, es6-classes
Asked: "Four binding rules + precedence." · "Why does passing obj.method as callback break?" · "this in arrow class field vs method?"

**call-apply-bind — call / apply / bind [I] · 4/5/4**
Explicit this-binding: call (args list) and apply (args array) invoke now; bind returns a permanently bound function.
Prereqs: this-keyword · Related: currying-partial-application
Asked: "Implement bind from scratch." · "Can you rebind a bound function?" (no)

### 5. Functions

**function-declaration-vs-expression — Declarations vs Expressions [B] · 3/4/5**
Declarations hoist fully; expressions (incl. arrows) follow their variable's hoisting rules; named expressions aid stack traces.
Prereqs: hoisting · Related: arrow-functions
Asked: "Which can you call before its definition, and why?"

**arrow-functions — Arrow Functions [B] · 4/4/5**
Compact functions with no own this/arguments/prototype; this is captured lexically at definition — cannot be a constructor.
Prereqs: this-keyword · Related: es6-classes
Asked: "When should you NOT use an arrow?" (methods, dynamic this) · "arguments object in arrows?"

**default-rest-spread — Default, Rest & Spread [B] · 3/3/5**
Defaults evaluate per-call; rest collects trailing args; spread expands iterables/objects (shallow).
Prereqs: data-types · Related: shallow-vs-deep-copy, destructuring
Asked: "Spread vs rest — same syntax, what's the difference?" · "Is object spread deep?"

**callbacks — Callback Functions [B] · 4/3/5**
Functions passed as arguments to be invoked later — the primitive under events, timers, and array methods.
Prereqs: function-declaration-vs-expression · Related: higher-order-functions, callback-hell
Asked: "What is inversion of control in callbacks?"

**higher-order-functions — Higher-Order Functions [I] · 4/4/5**
Functions taking or returning functions — the basis of array methods, decorators, middleware, hooks.
Prereqs: callbacks, closure · Related: currying-partial-application, function-composition
Asked: "Write a function that wraps another with logging/timing."

**pure-functions — Pure Functions & Side Effects [I] · 3/3/5**
Same inputs → same output, no observable side effects; enables memoization, testability, predictable state management.
Prereqs: higher-order-functions · Related: memoization, object-immutability
Asked: "Why do React/Redux insist on purity?"

**recursion — Recursion [I] · 4/4/3**
Function calling itself with a base case; each call adds a stack frame — depth limits and iterative/stack conversions matter.
Prereqs: call-stack · Related: generators
Asked: "Flatten a nested structure recursively, then iteratively." · "What limits recursion depth?"

**currying-partial-application — Currying & Partial Application [A] · 3/4/3**
Transforming f(a,b,c) into f(a)(b)(c) via closures accumulating arguments; partial application fixes some args.
Prereqs: closure, higher-order-functions · Related: call-apply-bind, function-composition
Asked: "Implement generic curry(fn)." · "sum(1)(2)(3)() chains."

**function-composition — Function Composition [A] · 3/2/3**
Combining small functions into pipelines (compose/pipe); data flows through transformations.
Prereqs: higher-order-functions · Related: pure-functions
Asked: "Implement pipe(...fns)."

**memoization — Memoization [A] · 4/4/4**
Caching results by arguments in a closure-held Map; trades memory for repeat-call speed; eviction and key strategy are the senior follow-ups.
Prereqs: closure, pure-functions · Related: weakmap-weakset, performance
Asked: "Implement memoize." · "What are the cache-key pitfalls?" · "When is it harmful?"

**generators — Generators [A] · 3/2/2**
Pausable functions (function*/yield) producing iterators; foundation for lazy sequences and (historically) async flows.
Prereqs: iterables-iterators · Related: async-await
Asked: "What does yield actually pause?" · "Implement an infinite ID generator."

### 6. Objects & Prototypes

**object-creation — Object Creation Patterns [B] · 3/3/5**
Literals, Object.create, constructors, classes, factories — and when each fits.
Prereqs: data-types · Related: factory-pattern, constructor-functions-new
Asked: "Object.create(null) — why would you?"

**destructuring — Destructuring [B] · 3/3/5**
Pattern-based extraction from objects/arrays with renaming, defaults, nesting, and rest.
Prereqs: object-creation · Related: default-rest-spread
Asked: "Destructure a nested API response with defaults."

**property-descriptors — Property Descriptors & Accessors [A] · 3/2/3**
writable/enumerable/configurable flags plus get/set accessors; Object.defineProperty — the mechanism behind Vue 2 reactivity and freeze.
Prereqs: object-creation · Related: proxy-reflect, object-immutability
Asked: "How did Vue 2 detect changes?" · "Why doesn't for...in show some keys?"

**prototype — Prototype [I] · 5/5/3**
Every object has an internal [[Prototype]] link used for delegation; functions carry a .prototype object used by `new`.
Prereqs: object-creation · Related: prototype-chain
Asked: "`__proto__` vs `.prototype`?"

**prototype-chain — Prototype Chain [I] · 5/5/3**
Property reads delegate up the chain until found or null; writes shadow locally; methods are shared, not copied.
Prereqs: prototype · Leads to: constructor-functions-new, instanceof, prototype-pollution
Asked: "Walk through obj.foo resolution." · "hasOwnProperty vs in?"

**constructor-functions-new — Constructors & new [I] · 4/5/3**
`new` creates an object linked to Fn.prototype, binds this, runs the body, returns the object (unless an object is returned explicitly).
Prereqs: prototype-chain, this-keyword · Related: es6-classes
Asked: "What exactly does new do? Implement it as a function."

**es6-classes — Classes [I] · 4/4/5**
Syntax over prototypes: constructor, methods on the prototype, static members, #private fields, super dispatch.
Prereqs: constructor-functions-new · Related: inheritance-patterns
Asked: "Are JS classes real classes?" · "Class field arrow vs prototype method for handlers?"

**inheritance-patterns — Inheritance & Composition [A] · 4/4/3**
extends wires prototype chains; composition (mixins, delegation, functions) usually beats deep hierarchies.
Prereqs: es6-classes · Related: factory-pattern
Asked: "Composition over inheritance — defend it with a JS example."

**object-immutability — Immutability [I] · 3/3/4**
const vs freeze vs structural sharing; shallow freeze caveat; immutable updates power change detection.
Prereqs: primitive-vs-reference · Related: shallow-vs-deep-copy, pure-functions
Asked: "Does Object.freeze deep-freeze?" · "Why do stores want immutable updates?"

**shallow-vs-deep-copy — Shallow vs Deep Copy [I] · 4/5/5**
Spread/assign copy one level; structuredClone handles depth, cycles, Dates; JSON round-trip loses functions/undefined/Dates.
Prereqs: primitive-vs-reference · Related: object-immutability
Asked: "Pitfalls of JSON.parse(JSON.stringify())?" · "Implement deepClone with cycle handling."

**proxy-reflect — Proxy & Reflect [E] · 3/2/3**
Traps for fundamental operations (get/set/has/deleteProperty); Reflect provides the default behaviors — the engine of Vue 3 reactivity.
Prereqs: property-descriptors · Related: observer-pattern
Asked: "How does Vue 3 know you changed state?" · "Build a validation proxy."

### 7. Asynchronous JavaScript

**sync-vs-async — Synchronous vs Asynchronous [B] · 4/3/5**
Sync blocks the single thread; async hands waiting to the host and resumes via queued callbacks.
Prereqs: call-stack · Related: event-loop
Asked: "Why does a heavy loop freeze the page?"

**timers — setTimeout / setInterval [B] · 4/4/5**
Host-scheduled macrotasks; delay is a minimum, not a guarantee (clamping, throttled background tabs); setTimeout(0) ≠ immediate.
Prereqs: sync-vs-async · Related: macrotask-queue, event-loop
Asked: "Why is setTimeout(fn, 0) not immediate?" · "Drift in setInterval — fix it."

**event-loop — Event Loop [A] · 5/5/5**
The coordinator: when the stack empties, drain all microtasks, run one macrotask, render (browser), repeat.
Prereqs: call-stack, timers · Leads to: microtask-queue, macrotask-queue, promises ordering
Asked: "Output prediction: setTimeout + promise + sync." · "Browser loop vs Node loop?"

**macrotask-queue — Macrotask (Task) Queue [A] · 5/5/4**
Queue for timers, I/O, UI events; ONE task per loop turn, with microtask drain and possible render between.
Prereqs: event-loop · Related: microtask-queue
Asked: "How many macrotasks run before the next paint?"

**microtask-queue — Microtask Queue [A] · 5/5/4**
Promise callbacks and queueMicrotask; drained COMPLETELY after each stack run — including microtasks queued during the drain.
Prereqs: event-loop, promises · Related: event-loop-starvation
Asked: "Why does .then beat setTimeout(0) always?" · "queueMicrotask vs setTimeout vs rAF?"

**callback-hell — Callback Hell → Promises [B] · 3/3/3**
Nested error-first callbacks: rightward drift, manual error propagation, inversion of control — the motivation for promises.
Prereqs: callbacks · Related: promises
Asked: "What problems did promises actually solve over callbacks?"

**promises — Promises [I] · 5/5/5**
One-way state machine (pending → fulfilled/rejected); .then returns a new promise; callbacks always run as microtasks; errors propagate to the nearest catch.
Prereqs: callback-hell, microtask-queue · Leads to: async-await, promise-combinators
Asked: "Is the executor sync or async?" · "Implement Promise.all / a retry helper." · "Chaining vs nesting?"

**promise-combinators — Promise Combinators [A] · 4/4/4**
all (fail-fast), allSettled (never rejects), race (first settle), any (first fulfill, AggregateError).
Prereqs: promises · Related: concurrency-patterns
Asked: "Which combinator for a dashboard tolerating partial failure?" · "Implement allSettled."

**async-await — async / await [I] · 5/5/5**
Syntax over promises: async fn returns a promise; await suspends and resumes as a microtask; try/catch spans awaits.
Prereqs: promises · Related: async-error-handling, generators
Asked: "What does await do to execution?" · "Make 3 sequential awaits parallel." · "forEach(async) — why broken?"

**async-error-handling — Async Error Handling [A] · 4/4/5**
try/catch around await, .catch placement semantics, unhandledrejection, AggregateError, error-cause chains.
Prereqs: async-await · Related: global-error-handlers
Asked: "Where do errors go in a promise chain?" · "Why did your catch not fire?"

**fetch-api — Fetch API [B] · 4/4/5**
Promise-based HTTP: response.ok semantics (no reject on 4xx/5xx), body streams read once, credentials modes.
Prereqs: promises · Related: abortcontroller, cors
Asked: "Why doesn't fetch reject on a 404?" · "Read a response body twice — what happens?"

**abortcontroller — AbortController & Cancellation [A] · 4/3/4**
Signal-based cancellation for fetch, listeners, and custom async work; the fix for stale-response races and unmount leaks.
Prereqs: fetch-api · Related: concurrency-patterns, memory-leaks
Asked: "Cancel the previous search request on each keystroke." · "Remove 10 listeners with one signal."

**concurrency-patterns — Concurrency Patterns [S] · 4/3/4**
Pools (N at a time), timeout via race, retry with exponential backoff + jitter, sequential-vs-parallel composition.
Prereqs: promise-combinators · Related: abortcontroller
Asked: "Run 100 requests max 5 at a time — implement it." · "Add a timeout to any promise."

**event-loop-starvation — Event-Loop Starvation [S] · 3/2/3**
Infinite/heavy microtask chains or long tasks block rendering and input; chunking and yielding restore responsiveness.
Prereqs: microtask-queue · Related: long-task-scheduling
Asked: "A recursive promise chain froze the UI but setTimeout recursion didn't — why?"

### 8. Iteration & Collections

**array-methods — Array Methods [B] · 5/5/5**
map/filter/reduce/find/some/every/flat + mutating vs non-mutating (sort vs toSorted); reduce builds anything.
Prereqs: callbacks · Related: higher-order-functions
Asked: "groupBy with reduce." · "Implement map using reduce." · "Which methods mutate?"

**map-vs-object — Map vs Object [I] · 3/3/4**
Map: any key type, insertion order, .size, no prototype risk, faster churn; Object: literals, JSON.
Prereqs: object-creation · Related: weakmap-weakset, json-serialization
Asked: "When is Map clearly better?" · "What's the prototype-pollution angle?"

**set-operations — Set [I] · 3/3/4**
Unique-value collection; O(1) has; dedupe idiom [...new Set(arr)]; union/intersection patterns.
Prereqs: array-methods · Related: map-vs-object
Asked: "Dedupe objects by a key — why is Set alone not enough?"

**iterables-iterators — Iteration Protocols [A] · 3/2/3**
Symbol.iterator returning {next()} powers for...of, spread, destructuring; any object can opt in.
Prereqs: symbol · Related: generators
Asked: "Make a custom object work with for...of." · "Why isn't a plain object iterable?"

**json-serialization — JSON & Serialization [B] · 3/3/5**
stringify/parse with replacer/reviver; loses functions, undefined, symbols; Dates become strings; cycles throw.
Prereqs: object-creation · Related: shallow-vs-deep-copy, bigint
Asked: "What survives a JSON round-trip?" · "Serialize a Map."

**typed-arrays — TypedArrays & ArrayBuffer [E] · 2/1/2**
Binary data views (Uint8Array etc.) over raw buffers — files, WebGL, WASM, crypto.
Prereqs: array-methods · Related: web-workers
Asked: "When have you needed raw bytes in the browser?"

### 9. Modules

**commonjs — CommonJS [I] · 3/3/4**
Synchronous runtime require(), module.exports value snapshots; Node's original system.
Prereqs: iife · Related: esm-vs-cjs
Asked: "Why can't CJS be statically tree-shaken?"

**es-modules — ES Modules [I] · 4/4/5**
Static, hoisted imports with LIVE bindings; strict mode by default; async loading in browsers; one evaluation per module (singleton).
Prereqs: commonjs · Related: dynamic-imports, tree-shaking
Asked: "What is a live binding?" · "Why are modules singletons?"

**esm-vs-cjs — ESM vs CJS [A] · 4/4/4**
Static vs dynamic, live bindings vs copies, async vs sync, interop pitfalls (default exports, __dirname).
Prereqs: es-modules · Related: bundlers-module-resolution
Asked: "Key behavioral differences, not just syntax?" · "Interop traps you've hit?"

**dynamic-imports — Dynamic import() [A] · 3/3/4**
Promise-returning runtime import — the primitive behind route-level code splitting and conditional loading.
Prereqs: es-modules, promises · Related: code-splitting-lazy-loading
Asked: "How does your router lazy-load pages under the hood?"

**top-level-await — Top-Level await [A] · 2/2/2**
await at module scope; blocks dependent module evaluation — convenient and dangerous.
Prereqs: es-modules, async-await · Related: circular-dependencies
Asked: "What does TLA do to the module graph's load order?"

**tree-shaking — Tree Shaking [S] · 3/3/4**
Dead-export elimination enabled by ESM's static structure; defeated by side effects and namespace re-export patterns.
Prereqs: es-modules · Related: bundlers-module-resolution
Asked: "Why did importing one icon pull in 2MB?" · "What is sideEffects: false?"

**circular-dependencies — Circular Dependencies [S] · 3/2/3**
ESM resolves cycles via hoisted live bindings (possibly TDZ at access); CJS returns partial exports; both cause subtle undefineds.
Prereqs: esm-vs-cjs · Related: top-level-await
Asked: "Import is undefined only sometimes — what's going on?"

**bundlers-module-resolution — Bundlers & Resolution [S] · 3/2/4**
How Vite/webpack resolve specifiers, transform, split chunks, and dev-serve (native ESM vs bundle).
Prereqs: tree-shaking, dynamic-imports · Related: code-splitting-lazy-loading
Asked: "What does Vite actually do differently in dev?"

### 10. Browser & DOM

**dom — DOM [B] · 4/3/5**
Tree representation of HTML exposed as live objects; querying, traversal, mutation; live vs static NodeLists.
Prereqs: what-is-javascript · Related: event-system, browser-rendering-pipeline
Asked: "innerHTML vs textContent vs createElement — tradeoffs (incl. security)?"

**bom — BOM [B] · 2/2/3**
Browser objects outside the document: window, location, navigator, history, screen.
Prereqs: dom · Related: history-api
Asked: "Difference between window and document?"

**event-system — Event Propagation [I] · 4/4/5**
Capture → target → bubble; listener options (capture, once, passive); preventDefault vs stopPropagation.
Prereqs: dom, callbacks · Related: event-delegation, custom-events
Asked: "Three phases of an event?" · "What does passive: true unlock?"

**event-delegation — Event Delegation [I] · 4/5/4**
One ancestor listener + event.target dispatch — fewer listeners, works for dynamic children.
Prereqs: event-system · Related: list-virtualization
Asked: "10,000 rows each need a click handler — design it." · "Which events don't bubble?"

**custom-events — Custom Events & EventTarget [I] · 2/2/3**
CustomEvent with detail payloads; any object can extend EventTarget — native pub/sub.
Prereqs: event-system · Related: observer-pattern, event-emitter
Asked: "Decouple two widgets without a framework."

**storage-apis — Storage APIs [B] · 3/4/5**
localStorage (sync, ~5MB, persistent) vs sessionStorage (per-tab) vs cookies (sent per-request, httpOnly) vs IndexedDB (async, structured).
Prereqs: bom · Related: secure-token-storage
Asked: "Where do you store a JWT and why?" · "What's wrong with big localStorage reads?"

**script-loading — Script Loading [I] · 3/4/4**
Parser-blocking default vs async (load+run when ready) vs defer (ordered, after parse) vs type=module (deferred).
Prereqs: dom · Related: browser-rendering-pipeline
Asked: "async vs defer — and which for analytics vs app code?"

**browser-rendering-pipeline — Rendering Pipeline [S] · 4/4/4**
HTML→DOM, CSS→CSSOM → render tree → layout → paint → composite; reflow vs repaint vs composite-only; layout thrashing.
Prereqs: dom · Related: requestanimationframe, debounce, core-web-vitals
Asked: "Why animate transform instead of top?" · "What is layout thrashing — show the fix."

**observers — Intersection / Mutation / Resize Observers [A] · 3/3/4**
Async, batched observation APIs replacing scroll polling and DOM diff hacks; lazy loading, infinite scroll, element queries.
Prereqs: dom, callbacks · Related: list-virtualization
Asked: "Implement lazy-loaded images without scroll listeners."

**history-api — History API & SPA Routing [I] · 3/3/4**
pushState/replaceState/popstate — URL changes without navigation; the foundation of client-side routers.
Prereqs: bom · Related: dynamic-imports
Asked: "How does vue-router/react-router change the URL without reloading?"

**websocket-sse — WebSocket & SSE [A] · 3/3/4**
Full-duplex socket vs one-way server push over HTTP; reconnection, heartbeats, fallbacks.
Prereqs: fetch-api · Related: concurrency-patterns
Asked: "Chat app: WebSocket or SSE or polling — decide and defend."

**service-workers — Service Workers [S] · 3/2/3**
Programmable network proxy: offline caching strategies, background sync, push — lifecycle gotchas (waiting/activate).
Prereqs: promises, web-workers · Related: storage-apis
Asked: "Cache-first vs network-first — when?" · "Why is my deploy not visible? (waiting SW)"

### 11. Performance

**debounce — Debounce [I] · 4/5/5**
Delay execution until input stops for N ms (closure-held timer) — search-as-you-type, resize handlers.
Prereqs: closure, timers · Related: throttle
Asked: "Implement debounce (with this/args)." · "Leading vs trailing edge?"

**throttle — Throttle [I] · 4/5/5**
At most one execution per window — scroll/mousemove sampling.
Prereqs: closure, timers · Related: debounce, requestanimationframe
Asked: "Implement throttle." · "Debounce or throttle for infinite scroll — why?"

**requestanimationframe — requestAnimationFrame [A] · 3/3/4**
Pre-paint callback synced to the display — the correct place for visual updates; pauses in background tabs.
Prereqs: event-loop, browser-rendering-pipeline · Related: long-task-scheduling
Asked: "Where does rAF fit in the event loop?" · "rAF-based throttle for scroll?"

**web-workers — Web Workers [A] · 3/3/3**
Real threads without shared memory (message passing, structured clone); for CPU work — parsing, search indexing, image processing.
Prereqs: event-loop · Related: typed-arrays, service-workers
Asked: "What can't a worker access?" · "When is postMessage cost worth it?"

**long-task-scheduling — Long Tasks & Scheduling [S] · 3/2/4**
Tasks >50ms hurt INP; chunk with setTimeout/scheduler.yield/requestIdleCallback; isInputPending.
Prereqs: event-loop-starvation · Related: web-workers, core-web-vitals
Asked: "Process 100k rows without freezing input — three strategies."

**list-virtualization — List Virtualization [S] · 4/3/4**
Render only viewport rows inside a full-height spacer; constant DOM size for unbounded data.
Prereqs: browser-rendering-pipeline, observers · Related: event-delegation
Asked: "Design a 50k-row table — walk through the windowing math."

**code-splitting-lazy-loading — Code Splitting & Lazy Loading [S] · 4/3/5**
Route/component-level chunks via dynamic import; preload/prefetch hints; loading states and error boundaries for chunks.
Prereqs: dynamic-imports · Related: bundlers-module-resolution
Asked: "Your bundle is 3MB — splitting strategy?" · "prefetch vs preload?"

**core-web-vitals — Core Web Vitals [S] · 3/3/5**
LCP, CLS, INP — what each measures, JS's role in each, and the measurement APIs (PerformanceObserver).
Prereqs: browser-rendering-pipeline · Related: long-task-scheduling, script-loading
Asked: "INP regressed after a release — investigate."

### 12. Error Handling & Debugging

**error-types-try-catch — Errors & try/catch [B] · 3/3/5**
Error hierarchy (TypeError, RangeError…), throw semantics, finally, catch binding; try/catch only catches same-stack throws.
Prereqs: call-stack · Related: async-error-handling
Asked: "Why doesn't try/catch catch errors in setTimeout callbacks?"

**custom-errors-cause — Custom Errors & cause [A] · 3/2/4**
Extending Error with names/fields, error.cause chains, AggregateError — designing error taxonomies for APIs.
Prereqs: es6-classes, error-types-try-catch · Related: global-error-handlers
Asked: "Design errors for an API client that callers can branch on."

**global-error-handlers — Global Error Handlers [S] · 3/2/4**
window.onerror / error event / unhandledrejection — last-resort capture feeding monitoring (Sentry-style).
Prereqs: async-error-handling · Related: custom-errors-cause
Asked: "How do error-monitoring SDKs catch everything?"

**devtools-debugging — DevTools Debugging [I] · 3/2/5**
Breakpoints (conditional, DOM, XHR), watch, console utilities, source maps, performance/memory panels.
Prereqs: none · Related: memory-profiling
Asked: "Debug a bug you can't reproduce locally — what's your toolkit?"

### 13. Security

**xss — Cross-Site Scripting [A] · 4/4/5**
Injected script executing in users' sessions (stored/reflected/DOM-based); escape output, sanitize HTML, avoid dangerous sinks.
Prereqs: dom · Related: csp, secure-token-storage
Asked: "innerHTML with user data — exploit it, then fix it." · "Stored vs reflected vs DOM XSS?"

**csrf — Cross-Site Request Forgery [A] · 4/4/4**
Browser auto-attaches cookies to cross-site requests; forged state-changing requests; SameSite, CSRF tokens, origin checks.
Prereqs: storage-apis · Related: cors
Asked: "Why does CSRF target cookies but not Authorization headers?"

**cors — CORS [A] · 4/5/5**
Server-side relaxation of the same-origin policy: preflights, allowed origins/headers, credentials mode.
Prereqs: fetch-api · Related: csrf
Asked: "What triggers a preflight?" · "Why can't the frontend fix a CORS error?"

**csp — Content Security Policy [S] · 3/3/4**
Header whitelisting script/style/connect sources; nonces/hashes; defense-in-depth against XSS.
Prereqs: xss · Related: supply-chain-security
Asked: "Roll out CSP on a legacy app with inline scripts — plan it."

**secure-token-storage — Token Storage [A] · 4/4/5**
localStorage readable by any XSS vs httpOnly cookies (CSRF-protected via SameSite) — the canonical tradeoff question.
Prereqs: storage-apis, xss, csrf · Related: cors
Asked: "Where do you put the JWT? Defend against both attack classes."

**prototype-pollution — Prototype Pollution [S] · 3/2/3**
Attacker-controlled keys (__proto__, constructor.prototype) in merges/parsers poisoning all objects.
Prereqs: prototype-chain · Related: supply-chain-security
Asked: "Why is a recursive merge of user JSON dangerous?" · "Mitigations? (null-prototype, key denylist, Map)"

**clickjacking — Clickjacking [A] · 2/2/3**
Invisible iframes capturing clicks; frame-ancestors / X-Frame-Options.
Prereqs: dom · Related: csp
Asked: "How do you stop your app being framed?"

**supply-chain-security — Supply-Chain Security [S] · 3/2/4**
Compromised npm packages, typosquatting, install scripts; lockfiles, audit, provenance, minimal deps.
Prereqs: bundlers-module-resolution · Related: csp
Asked: "A transitive dep got hijacked — blast radius and defenses?"

### 14. Design Patterns in JavaScript

**module-pattern — Module Pattern [I] · 3/3/3**
Closure-based encapsulation exposing a public API over private state — the ancestor of ESM.
Prereqs: iife, closure · Related: singleton-pattern
Asked: "Private state without classes or # fields?"

**factory-pattern — Factory Pattern [I] · 3/3/4**
Functions returning configured objects — no new, easy composition, natural closures for privacy.
Prereqs: object-creation, closure · Related: inheritance-patterns
Asked: "Factory vs constructor vs class in JS — when each?"

**singleton-pattern — Singleton [I] · 3/4/3**
One shared instance (module-level instance, lazy init); note ES modules are singletons by design.
Prereqs: module-pattern · Related: es-modules
Asked: "Implement a lazy singleton; why are modules already singletons?"

**observer-pattern — Observer vs Pub/Sub [A] · 4/4/4**
Subjects notifying subscribers directly vs decoupled via a broker/event channel — the spine of reactivity and event systems.
Prereqs: callbacks, custom-events · Related: event-emitter, proxy-reflect
Asked: "Observer vs pub/sub — difference and an example of each in tools you use."

**event-emitter — EventEmitter (implement) [A] · 4/4/4**
on/off/once/emit over a Map of listener sets — the most common "implement a pattern" coding question.
Prereqs: observer-pattern, map-vs-object · Related: custom-events
Asked: "Implement EventEmitter with once()." · "What goes wrong if a listener unsubscribes during emit?"

**strategy-pattern — Strategy Pattern [A] · 3/3/4**
Interchangeable algorithms behind one interface (object map of functions) — kills if/else ladders; validation, pricing, sorting.
Prereqs: higher-order-functions · Related: factory-pattern
Asked: "Refactor a 6-branch if/else into strategies."

---

## 4. Top 50 Concepts for Senior Frontend Developers (priority order)

1. closure · 2. event-loop · 3. promises · 4. async-await · 5. this-keyword ·
6. prototype-chain · 7. microtask-queue · 8. macrotask-queue · 9. var-let-const · 10. hoisting ·
11. temporal-dead-zone · 12. call-apply-bind · 13. equality-comparison · 14. type-coercion · 15. array-methods ·
16. shallow-vs-deep-copy · 17. debounce · 18. throttle · 19. event-delegation · 20. execution-context ·
21. call-stack · 22. scope-chain · 23. arrow-functions · 24. constructor-functions-new · 25. es6-classes ·
26. promise-combinators · 27. async-error-handling · 28. memoization · 29. currying-partial-application · 30. higher-order-functions ·
31. memory-leaks · 32. garbage-collection · 33. es-modules · 34. esm-vs-cjs · 35. dynamic-imports ·
36. browser-rendering-pipeline · 37. event-system · 38. storage-apis · 39. fetch-api · 40. abortcontroller ·
41. cors · 42. xss · 43. csrf · 44. secure-token-storage · 45. concurrency-patterns ·
46. list-virtualization · 47. code-splitting-lazy-loading · 48. observers · 49. event-emitter · 50. inheritance-patterns

## 5. Top 20 Most Commonly Asked in Interviews

| # | Concept | Typical phrasing |
|---|---------|------------------|
| 1 | closure | "What is a closure? Where have you used one?" + loop-variable bug |
| 2 | event-loop (+ micro/macro) | Output prediction: sync vs promise vs setTimeout |
| 3 | promises | States, chaining, "implement Promise.all" |
| 4 | async-await | "What does await do?" + parallelize sequential awaits |
| 5 | var-let-const + hoisting + TDZ | Output prediction, loop + setTimeout |
| 6 | this-keyword + call-apply-bind | Four rules, lost-this callback, "implement bind" |
| 7 | prototype & prototype-chain | "How does property lookup work?" "__proto__ vs prototype" |
| 8 | equality-comparison + coercion | "== vs ===", "[] == ![]" walkthrough |
| 9 | debounce vs throttle | Define both, implement one, pick for a use case |
| 10 | array-methods | "map vs filter vs reduce", groupBy with reduce |
| 11 | shallow-vs-deep-copy | JSON round-trip pitfalls, structuredClone |
| 12 | arrow-functions | vs regular: this, arguments, constructor |
| 13 | event-delegation + propagation | 10k rows handler design, bubbling phases |
| 14 | promise-combinators | all vs allSettled vs race vs any |
| 15 | timers + event loop ordering | "Why isn't setTimeout(0) immediate?" |
| 16 | currying-partial-application | "Implement curry", sum(1)(2)(3) |
| 17 | memoization | "Implement memoize", cache-key pitfalls |
| 18 | esm-vs-cjs | Live bindings, tree-shaking implications |
| 19 | storage-apis + secure-token-storage | "Where do you store a JWT?" |
| 20 | constructor-functions-new | "What does new do? Implement it." |

## 6. Overlooked Concepts (high senior-signal, low candidate-coverage)

Most candidates can recite closures; almost none can discuss these. Each is a differentiator:

1. **abortcontroller** — cancellation is the fix for stale-response races; rarely known well
2. **event-loop-starvation** — microtask chains freezing UI; separates "knows the loop" from "understands it"
3. **property-descriptors** — the mechanism under Vue 2, freeze, enumerability quirks
4. **proxy-reflect** — what Vue 3 / state libraries are actually built on
5. **weakmap-weakset / weakref-finalizationregistry** — GC-aware caching
6. **structuredClone** (in shallow-vs-deep-copy) — most still answer "JSON.parse(JSON.stringify())" with no caveats
7. **ieee-754-floating-point** — 0.1+0.2, safe integers, money handling
8. **es-modules live bindings & circular-dependencies** — "import is undefined sometimes" bugs
9. **hidden-classes-inline-caches** — why shape stability matters; staff-level signal
10. **timer clamping & drift** — setTimeout minimums, background-tab throttling
11. **microtask scheduling tools** — queueMicrotask vs MessageChannel vs rAF placement
12. **tagged-templates** — how styled-components/sql-tags actually work
13. **iterables-iterators & generator delegation** — protocol-level understanding
14. **custom-errors-cause + global-error-handlers** — error taxonomy design; unhandledrejection
15. **prototype-pollution** — security consequence of the prototype chain
16. **long-task-scheduling** — scheduler.yield, requestIdleCallback, isInputPending
17. **sendBeacon / fetch keepalive** (within fetch-api page) — analytics on unload
18. **script-loading semantics** — async vs defer vs module is asked more than candidates expect
19. **service-worker lifecycle** — the "why isn't my deploy live" class of bugs
20. **top-level-await** — module-graph blocking behavior

## 7. Route Map

All 100+ slugs above map directly to routes: `/javascript/<slug>`, e.g.

```
/javascript/execution-context     /javascript/call-stack        /javascript/closure
/javascript/event-loop            /javascript/microtask-queue   /javascript/promise s→ promises
/javascript/this-keyword          /javascript/prototype-chain   /javascript/debounce
/javascript/abortcontroller       /javascript/proxy-reflect     /javascript/secure-token-storage
```

Category index routes: `/javascript/category/<category-slug>` for the 14 categories
(fundamentals-engine, memory-model, types-coercion, execution-model, functions, objects-prototypes,
async, iteration-collections, modules, browser-dom, performance, errors-debugging, security, design-patterns).

Suggested page frontmatter per concept (drives generation):

```yaml
slug: closure
title: Closure
category: execution-model
level: intermediate          # beginner | intermediate | advanced | senior | expert
importance: 5
interviewFrequency: 5
realWorldUsage: 5
prerequisites: [scope-chain, garbage-collection]
leadsTo: [memoization, debounce, throttle, currying-partial-application, module-pattern]
```
