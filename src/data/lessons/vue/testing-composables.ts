import type { ConceptLesson } from '../../../types/lesson'

const testingComposables: ConceptLesson = {
  // 1. Concept Summary
  slug: 'testing-composables',
  name: 'Testing Composables',
  category: 'testing',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Composables hold the reusable logic of a Composition-API app, so testing them directly gives high-value coverage without mounting a whole component.',
    'A composable that only uses reactivity (ref/computed/watch) can be tested as a plain function — fast and simple — but one that uses lifecycle hooks or inject needs a host component, and knowing the difference is the crux of the topic.',
    'Pushing logic into well-tested composables is the refactor that turns a fat, hard-to-test component into thin, testable pieces — a senior code-health move.',
    'Interviewers use this to check whether you understand the boundary between Vue\'s reactivity (works anywhere) and its component instance context (needs setup).',
    'Getting async, watchers, and cleanup right in composable tests is exactly where flakiness hides, so the skill is directly tied to suite reliability.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A composable is a recipe; testing it is cooking the recipe by itself to check it tastes right before putting it in a big meal.',
    story: [
      'Imagine you have a recipe for a special sauce. You use this sauce in many different dishes.',
      'Instead of cooking a whole giant dinner every time just to check the sauce, you can make a tiny batch of just the sauce and taste it.',
      'If the sauce is good on its own, you know it will be good in every dish that uses it.',
      'A composable is that reusable recipe of logic. Testing it means running just the composable and checking its result, instead of building a whole component around it every time.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A composable is a function (usually named useSomething) that bundles reactive state and logic so multiple components can share it.',
    'Because it returns refs and functions, you can often just call it in a test and check the returned values — no component, no DOM.',
    'But some composables use things that only exist inside a component, like onMounted (a lifecycle hook) or inject (reading provided data). Those need to run inside a tiny host component for the test.',
    'When reactive state changes, Vue updates dependent values on the next tick, so async tests must await nextTick before checking computed/watched results.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Testing composables means verifying the reactive state and behavior a useXxx function returns. Pure-reactivity composables are tested by calling them directly; composables that rely on the component instance (lifecycle hooks, inject, provide) are tested by mounting a minimal host component that calls them.',
    how: 'For simple ones, call the composable, mutate its returned refs, await nextTick, and assert. For instance-dependent ones, create a tiny test component whose setup runs the composable, mount it, and assert via the wrapper (or expose the returned values).',
    why: 'It isolates business logic from the view so you get fast, focused tests and can refactor components without retesting all their UI.',
    code: {
      label: 'Testing a pure-reactivity composable directly',
      lang: 'js',
      code: 'import { describe, it, expect } from \'vitest\'\nimport { nextTick } from \'vue\'\nimport { useCounter } from \'./useCounter\'\n\ndescribe(\'useCounter\', () => {\n  it(\'increments and exposes a doubled computed\', async () => {\n    const { count, doubled, increment } = useCounter(0)\n    expect(count.value).toBe(0)\n\n    increment()\n    await nextTick()\n    expect(count.value).toBe(1)\n    expect(doubled.value).toBe(2)\n  })\n})',
      explanation: [
        'useCounter uses only ref/computed, so it can be called directly in the test — no component needed.',
        'We read .value because the returned state is refs.',
        'After calling increment we await nextTick so reactivity (the computed) is up to date.',
        'We assert both the source ref and the derived computed, covering the reactive contract.',
        'This runs in milliseconds with no DOM allocated.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Testing a composable verifies the reactive API it returns — refs, computeds, methods, and side effects. A composable that depends only on Vue\'s reactivity system (ref, reactive, computed, watch, watchEffect) can be invoked directly in a test because reactivity works without an active component instance. A composable that calls instance-coupled APIs — lifecycle hooks (onMounted/onUnmounted), inject, getCurrentInstance, or provide — must run inside an active setup() context, so it is tested by mounting a minimal host component whose setup invokes the composable and exposes its return value. Because effects (computed/watch) are scheduled asynchronously, assertions on derived state require awaiting nextTick or flushPromises, and watchers/effects created in tests should be stopped to avoid leakage.',

  // 7. Internal Working
  internalWorking: [
    'Vue\'s reactivity primitives (ref/reactive/computed/watch) operate on a global effect/dependency system that does not require a mounted component, which is why a pure composable returns working reactive state when called from a test.',
    'Lifecycle hooks (onMounted etc.) and inject register against the "current instance" — a value set only while a component\'s setup() runs; calling them outside setup is a no-op or warns, so those composables must be hosted.',
    'To host one, you create a tiny component whose setup() calls the composable and returns (or assigns to vm) its results, then mount it with Vue Test Utils so a real instance context exists when the composable runs.',
    'When you mutate a returned ref, Vue marks dependent effects (computeds/watchers) dirty and schedules them; they re-run on the next microtask, so assertions must await nextTick.',
    'watch with default (post) flush runs after the DOM update tick; immediate watchers run synchronously on setup — timing differences you must account for in assertions.',
    'Effects created during the test stay active until their scope is stopped; mounting/unmounting the host component (or using effectScope) provides cleanup so watchers do not leak across tests.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Is the composable instance-coupled? (uses onMounted / inject / provide?)
                         │
            ┌────────────┴─────────────┐
           NO                         YES
            │                          │
            ▼                          ▼
   call it directly             mount a tiny HOST component:
   const { state } = useX()     ┌────────────────────────────┐
   mutate → await nextTick      │ setup() { return useX() }   │
   assert state.value           └────────────────────────────┘
                                 mount(Host) → assert via wrapper.vm
                                 (now onMounted/inject have a context)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'A directly-called composable allocates only its refs/computeds and any watcher effects — no DOM, tiny footprint.',
    'Watchers and watchEffect create live effects that subscribe to their deps; if you never stop them they linger in memory and can fire across tests, so wrap them in an effectScope or unmount the host to dispose them.',
    'Hosting a composable allocates a minimal Vue instance plus jsdom container; that is what provides the current-instance slot lifecycle hooks and inject read from.',
    'Provided/injected values live on the host instance\'s provides record; the host supplies them so the injecting composable resolves instead of returning the default.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — assert returned reactive state',
      lang: 'js',
      code: 'import { describe, it, expect } from \'vitest\'\nimport { useToggle } from \'./useToggle\'\n\ndescribe(\'useToggle\', () => {\n  it(\'flips a boolean\', () => {\n    const { on, toggle } = useToggle(false)\n    expect(on.value).toBe(false)\n    toggle()\n    expect(on.value).toBe(true)\n  })\n})',
      explanation: [
        'useToggle is pure reactivity, so it is called directly.',
        'on is a ref; we read and assert via .value.',
        'toggle mutates the ref synchronously, so no nextTick is needed for a direct ref read.',
        'No DOM, no mount — the fastest kind of composable test.',
      ],
    },
    intermediate: {
      label: 'Intermediate — a watcher and async update',
      lang: 'js',
      code: 'import { describe, it, expect } from \'vitest\'\nimport { nextTick, ref } from \'vue\'\nimport { useDoubleWhenEven } from \'./useDoubleWhenEven\'\n\ndescribe(\'useDoubleWhenEven\', () => {\n  it(\'updates output when input changes\', async () => {\n    const input = ref(2)\n    const { output } = useDoubleWhenEven(input)\n    await nextTick()\n    expect(output.value).toBe(4)\n\n    input.value = 3        // odd → unchanged by spec\n    await nextTick()\n    expect(output.value).toBe(4)\n  })\n})',
      explanation: [
        'The composable accepts a ref input and watches it — a common composable shape.',
        'We mutate the source ref and await nextTick so the watcher/computed re-runs.',
        'Asserting after each await verifies the reactive relationship across changes.',
        'Passing a ref in lets the test drive the composable\'s dependency directly.',
        'Skipping the await would read stale derived state and flake.',
      ],
    },
    advanced: {
      label: 'Advanced — hosting a composable that uses onMounted/inject',
      lang: 'js',
      code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport { useTheme } from \'./useTheme\' // uses inject(\'theme\') + onMounted\n\nfunction withSetup(composable, providers = {}) {\n  let result\n  const Host = {\n    setup() { result = composable(); return () => {} },\n  }\n  const wrapper = mount(Host, { global: { provide: providers } })\n  return { result, wrapper }\n}\n\ndescribe(\'useTheme\', () => {\n  it(\'reads the injected theme\', () => {\n    const { result } = withSetup(() => useTheme(), { theme: \'dark\' })\n    expect(result.theme.value).toBe(\'dark\')\n  })\n})',
      explanation: [
        'useTheme calls inject and onMounted, so it needs an active setup context.',
        'withSetup is a reusable helper that hosts any composable in a throwaway component.',
        'global.provide supplies the injected value the composable expects.',
        'Because setup runs during mount, onMounted fires and inject resolves.',
        'We capture the composable\'s return value into result to assert on it.',
      ],
    },
    realProject: {
      label: 'Real project — testing a data-fetching composable',
      lang: 'js',
      code: 'import { describe, it, expect, vi } from \'vitest\'\nimport { flushPromises } from \'@vue/test-utils\'\nimport { useUsers } from \'./useUsers\'\nimport * as api from \'./api\'\n\ndescribe(\'useUsers\', () => {\n  it(\'exposes loading, then data\', async () => {\n    vi.spyOn(api, \'getUsers\').mockResolvedValue([{ id: 1 }])\n    const { users, loading } = useUsers()\n\n    expect(loading.value).toBe(true)\n    await flushPromises()\n    expect(loading.value).toBe(false)\n    expect(users.value).toHaveLength(1)\n  })\n})',
      explanation: [
        'useUsers fetches on creation and exposes loading/users refs — a real composable pattern.',
        'We mock the API so the test is fast, offline, and deterministic.',
        'The loading flag is asserted before the promise resolves.',
        'flushPromises resolves the fetch and lets reactivity settle.',
        'After flushing, loading is false and the data ref is populated — the full async contract.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Why can some composables be tested without mounting a component?',
      answer: 'Because Vue\'s reactivity system (ref/reactive/computed/watch) works independently of any component instance, so a composable that only uses reactivity returns working state when you call it directly.',
      explanation: 'Naming that reactivity is decoupled from the instance is the core insight.',
    },
    {
      level: 'beginner',
      question: 'When must you mount a host component to test a composable?',
      answer: 'When the composable uses APIs that require an active component instance: lifecycle hooks (onMounted/onUnmounted), inject, provide, or getCurrentInstance. Those only work inside setup().',
      explanation: 'The dividing line is "does it touch the current instance" — that determines the test strategy.',
    },
    {
      level: 'intermediate',
      question: 'How do you test a composable that uses inject?',
      answer: 'Mount a minimal host component whose setup calls the composable, and supply the dependency via global.provide (or a parent provide). A reusable withSetup helper captures the composable\'s return value for assertions.',
      explanation: 'Shows you know how to supply provide context and capture results without a real component.',
    },
    {
      level: 'intermediate',
      question: 'Why do you await nextTick when testing computed/watch in a composable?',
      answer: 'Because Vue schedules computed re-evaluation and watcher callbacks asynchronously; after mutating a source ref the derived value updates on the next tick, so you must await nextTick (or flushPromises for async) before asserting.',
      explanation: 'Connecting the assertion timing to Vue\'s scheduler shows real understanding, not ritual.',
    },
    {
      level: 'advanced',
      question: 'How do you prevent watchers created in a composable test from leaking across tests?',
      answer: 'Wrap the composable in an effectScope and stop it after the test, or host it in a component and unmount the host, which disposes the setup scope and its effects. Otherwise live watchers can fire on later tests.',
      explanation: 'Demonstrates awareness of effect lifecycle/cleanup — a senior correctness concern.',
    },
    {
      level: 'senior',
      question: 'What is your strategy for making components testable via composables?',
      answer: 'Extract business logic, async fetching, and derived state into composables so they can be unit-tested directly and fast, leaving components thin and mostly presentational. Keep instance-coupled bits minimal so most logic is testable without mounting, and inject dependencies (APIs, clocks) so they can be mocked.',
      explanation: 'Senior signal: treating composables as the testability seam and designing for dependency injection.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you supply provide/inject context in a composable test?',
    'What is effectScope and how does it help with cleanup?',
    'How do you test a composable that registers and removes event listeners?',
    'What is the difference between awaiting nextTick and flushPromises?',
    'How do you mock dependencies a composable uses (API, timers)?',
    'Why keep components thin and push logic into composables?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Calling a composable that uses onMounted/inject directly in a test.',
      why: 'There is no active component instance, so the hook is a no-op (warns) and inject returns the default — the test does not exercise real behavior.',
      fix: 'Host the composable in a minimal mounted component (a withSetup helper) so a setup context exists.',
    },
    {
      mistake: 'Asserting derived state without awaiting the update.',
      why: 'Computed/watch re-run asynchronously, so the assertion reads stale values and the test flakes.',
      fix: 'await nextTick() after mutating refs (or flushPromises for async work) before asserting.',
    },
    {
      mistake: 'Leaving watchers/effects running between tests.',
      why: 'They stay subscribed and can fire on later state changes, causing cross-test interference.',
      fix: 'Use effectScope().stop() or unmount the host component to dispose the effects.',
    },
    {
      mistake: 'Not injecting external dependencies (API, time) into the composable.',
      why: 'Hard-coded imports are difficult to mock and make tests slow or non-deterministic.',
      fix: 'Accept dependencies as arguments or mock the module with vi.spyOn/vi.mock so they are controllable.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Teams extract data fetching, form state, and feature logic into composables specifically so they can be unit-tested directly, keeping components thin.' },
    { area: 'VueUse', detail: 'The VueUse library tests dozens of composables this way — pure ones called directly, instance-coupled ones hosted — a reference pattern for the ecosystem.' },
    { area: 'Pinia', detail: 'Pinia stores are setup-style composables; tested by creating the store (createPinia/setActivePinia) and asserting state/getters/actions without a component.' },
    { area: 'Component library', detail: 'Headless component logic shipped as composables is tested independently of any markup, then thin presentational components are component-tested separately.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Directly-called composable tests run in milliseconds with no DOM, the fastest meaningful coverage you can get.',
      'Testing logic at the composable level avoids re-testing the same logic through every component that uses it.',
    ],
    bad: [
      'Hosting composables that need an instance adds Vue + jsdom allocation per test.',
      'Un-stopped watchers leak and can slow or destabilize a growing suite.',
    ],
    optimizations: [
      'Prefer direct invocation for pure-reactivity composables.',
      'Use a shared withSetup/effectScope helper to host and dispose instance-coupled ones cleanly.',
      'Mock external boundaries (API/timers) and use fake timers for time-based composables.',
      'Stop effects/unmount hosts after each test to keep memory and timing stable.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['composables', 'reactivity-fundamentals', 'testing-overview', 'lifecycle-hooks-composition'],
    nextConcepts: ['component-testing', 'dependency-injection-composition', 'pinia-basics'],
    dependencyNote:
      'Testing composables sits on top of understanding composables and reactivity (what you are asserting) and the testing overview (the runner/strategy). It complements component testing — composables hold the logic, components hold the view — and connects to provide/inject and Pinia, which are composable-shaped.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the decision question: "Does the composable use onMounted / inject / provide?"',
      'Branch NO → call it directly: const { state } = useX(); mutate; await nextTick; assert.',
      'Branch YES → draw a tiny Host component with setup() { return useX() } and mount it.',
      'Note that global.provide supplies injected dependencies in the hosted case.',
      'Add "await nextTick / flushPromises" before assertions because effects are async.',
      'Mention stopping effects (effectScope/unmount) so watchers do not leak.',
    ],
    diagram: `  uses instance API? ──NO──► useX() directly → mutate → await nextTick → assert
        │
        └────────YES──► Host { setup(){ return useX() } } + global.provide
                         mount(Host) → assert via wrapper.vm
                         (onMounted fires, inject resolves)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Composables holding pure reactivity (ref/computed/watch) are tested by calling them directly: mutate the returned refs, await nextTick, assert. Composables that use lifecycle hooks, inject, or provide need an active instance, so you host them in a minimal component (a withSetup helper) and supply dependencies via global.provide. Await nextTick or flushPromises before asserting derived/async state, mock external boundaries, and stop effects (effectScope/unmount) so watchers do not leak.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The first thing I decide when testing a composable is whether it depends on the component instance. Vue\'s reactivity system — ref, reactive, computed, watch — works on its own without a mounted component, so a composable that only uses those I can test as a plain function: I call it, read or mutate the refs it returns, await nextTick so any computed or watcher re-runs, and assert on the returned values. That gives me fast, DOM-free coverage of the actual business logic. The other category is composables that call instance-coupled APIs — lifecycle hooks like onMounted, or inject and provide, or getCurrentInstance. Those only work while a component\'s setup is running, so I host the composable inside a minimal throwaway component whose setup calls it and exposes the result, then mount that with Vue Test Utils. I usually keep a small withSetup helper for this, and I supply any injected dependencies through the global.provide mount option so inject resolves to my test value. A couple of correctness details matter a lot here. First, effects are asynchronous, so after mutating a source ref I await nextTick, or flushPromises if there is async work like a fetch, before asserting derived state — skipping that is the main source of flaky composable tests. Second, watchers and watchEffect create live effects that, if I never stop them, can fire during later tests; I dispose them by wrapping in an effectScope and calling stop, or by unmounting the host so its setup scope is torn down. I also inject external dependencies like the API client or a clock so I can mock them with vi and keep the test deterministic. The broader point I make in interviews is that testing composables is a design lever: by pushing fetching, form logic, and derived state into composables, I make the bulk of the app testable as fast unit tests and keep components thin and mostly presentational.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Direct invocation (fast, simple) vs hosting (needed for instance APIs, but slower and more setup) — design composables to minimize instance coupling so most can be tested directly.',
      'Injecting dependencies as arguments (max testability) vs importing them internally (simpler call site, harder to mock) — favor injection for anything external.',
      'Testing composables in isolation vs through the component — isolation is faster and clearer, but a few integration tests confirm the wiring actually holds.',
    ],
    edgeCases: [
      'Composables using getCurrentInstance return null outside setup, so they must be hosted.',
      'watch with flush: \'post\' runs after DOM updates; immediate watchers run synchronously on setup — assertion timing differs.',
      'Composables that register window/document listeners need jsdom and explicit cleanup assertions (listener removed on unmount).',
      'Async composables that start work in setup may resolve after unmount; guard against setting state on a disposed scope.',
    ],
    runtimeBehavior: [
      'Reactivity effects are scheduled on the microtask queue; nextTick flushes pending render/effect jobs.',
      'effectScope groups effects so a single stop() disposes all watchers/computeds created within it.',
      'Hosting via mount creates the currentInstance the composable reads; unmount clears it and runs onUnmounted hooks (good for testing cleanup).',
    ],
    scalability: [
      'A shared withSetup/effectScope harness keeps hosted-composable tests consistent and disposable as the suite grows.',
      'Pushing logic into composables concentrates coverage in fast tests, keeping CI fast even as the app grows.',
      'Dependency injection lets you reuse one set of mocks across many composable tests.',
    ],
    productionConcerns: [
      'Leaked watchers/listeners are the top flakiness/leak source — standardize disposal in the test harness.',
      'Async timing bugs (missing await) hide until CI is under load; lint or review for unawaited mutations.',
      'Test cleanup behavior explicitly (onUnmounted removes listeners) since that is a common production bug.',
      'Keep composables side-effect-injectable so tests never hit the real network or wall clock.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Pure reactivity composable → call it directly, no mount.',
    'Uses onMounted/inject/provide/getCurrentInstance → host in a tiny component.',
    'withSetup helper: setup(){ return useX() } + mount → capture return value.',
    'Supply injected deps via global.provide.',
    'Read returned refs with .value.',
    'await nextTick after mutating refs (computed/watch are async).',
    'await flushPromises for async fetches inside composables.',
    'Mock external deps (API/timers) with vi.spyOn/vi.mock; use fake timers for time logic.',
    'Stop effects with effectScope().stop() or unmount the host to avoid leaks.',
    'Inject dependencies as arguments to keep composables testable.',
    'Pinia stores are composables: setActivePinia(createPinia()) then test directly.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Test a useToggle(initial) composable: assert the initial value and that toggle() flips it.',
      hint: 'Call it directly and read the ref via .value.',
      solution: {
        lang: 'js',
        code: 'import { describe, it, expect } from \'vitest\'\nimport { useToggle } from \'./useToggle\'\n\ndescribe(\'useToggle\', () => {\n  it(\'starts true and toggles to false\', () => {\n    const { value, toggle } = useToggle(true)\n    expect(value.value).toBe(true)\n    toggle()\n    expect(value.value).toBe(false)\n  })\n})',
        explanation: [
          'Pure reactivity, so no mount is needed.',
          'toggle mutates the ref synchronously; the direct ref read needs no nextTick.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Test a composable that exposes a computed total from a reactive items array; assert it updates when you push an item.',
      hint: 'Mutate the reactive source, await nextTick, then assert the computed.',
      solution: {
        lang: 'js',
        code: 'import { describe, it, expect } from \'vitest\'\nimport { nextTick } from \'vue\'\nimport { useCart } from \'./useCart\'\n\ndescribe(\'useCart\', () => {\n  it(\'recomputes total when an item is added\', async () => {\n    const { items, total, add } = useCart()\n    add({ price: 100 })\n    await nextTick()\n    expect(total.value).toBe(100)\n    add({ price: 50 })\n    await nextTick()\n    expect(total.value).toBe(150)\n  })\n})',
        explanation: [
          'add mutates the reactive items; total is a computed depending on it.',
          'await nextTick lets the computed re-evaluate before asserting.',
          'Asserting after each change verifies the reactive relationship.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a withSetup helper and use it to test a composable useUser() that calls inject(\'apiKey\') and onMounted.',
      hint: 'Host it in a component and supply apiKey via global.provide.',
      solution: {
        lang: 'js',
        code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport { useUser } from \'./useUser\'\n\nfunction withSetup(composable, provide = {}) {\n  let result\n  const Host = { setup() { result = composable(); return () => {} } }\n  const wrapper = mount(Host, { global: { provide } })\n  return { result, wrapper }\n}\n\ndescribe(\'useUser\', () => {\n  it(\'reads the injected apiKey\', () => {\n    const { result } = withSetup(() => useUser(), { apiKey: \'abc\' })\n    expect(result.apiKey.value).toBe(\'abc\')\n  })\n})',
        explanation: [
          'The Host component creates a setup context so onMounted runs and inject resolves.',
          'global.provide supplies the injected apiKey.',
          'Capturing the composable return into result lets us assert on it.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Test that a useEventListener composable adds a listener on mount and removes it on unmount.',
      hint: 'Spy on add/removeEventListener, host it, then unmount and assert removal.',
      solution: {
        lang: 'js',
        code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect, vi } from \'vitest\'\nimport { useEventListener } from \'./useEventListener\'\n\ndescribe(\'useEventListener\', () => {\n  it(\'adds on mount and removes on unmount\', () => {\n    const add = vi.spyOn(window, \'addEventListener\')\n    const remove = vi.spyOn(window, \'removeEventListener\')\n    const Host = { setup() { useEventListener(window, \'resize\', () => {}); return () => {} } }\n\n    const wrapper = mount(Host)\n    expect(add).toHaveBeenCalledWith(\'resize\', expect.any(Function))\n\n    wrapper.unmount()\n    expect(remove).toHaveBeenCalledWith(\'resize\', expect.any(Function))\n  })\n})',
        explanation: [
          'The composable uses onMounted/onUnmounted, so it must be hosted.',
          'Spies on add/removeEventListener verify the listener lifecycle.',
          'Unmounting the host triggers onUnmounted, which should remove the listener — the cleanup contract.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Composables are where Composition-API logic lives, so testing them well is how you keep an app refactorable. Articulating the direct-vs-hosted decision and effect cleanup signals genuine Composition-API depth.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what a composable is and how you might test it. Product companies (Zoho, Flipkart, Razorpay) ask you to test a stateful or fetching composable, including inject. FAANG-level interviews probe effect leakage, async timing, and designing for dependency injection and testability.',
    whatInterviewersExpect:
      'They expect you to decide direct invocation vs hosting based on instance-coupled APIs, supply provide context, await nextTick/flushPromises for derived/async state, dispose effects to avoid leaks, mock external boundaries, and explain composables as the testability seam.',
  },
}

export default testingComposables
