import type { ConceptLesson } from '../../../types/lesson'

const testingOverview: ConceptLesson = {
  // 1. Concept Summary
  slug: 'testing-overview',
  name: 'Testing Overview',
  category: 'testing',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Tests are how you change code with confidence — they catch regressions before users do, which is the entire point of moving fast without breaking things.',
    'The testing pyramid (lots of fast unit tests, fewer integration tests, very few end-to-end tests) is the mental model that keeps a test suite fast, reliable, and worth maintaining.',
    'Knowing WHICH kind of test to write for a given problem is a senior skill; juniors over-test trivial code and under-test the logic that actually breaks.',
    'Modern Vue tooling (Vitest + Vue Test Utils + Testing Library + Cypress/Playwright) is a near-universal stack, so interviewers expect familiarity.',
    'A flaky or slow test suite is a real productivity tax; understanding the pyramid and what to mock is how you keep it healthy.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Testing is checking your LEGO spaceship in stages: first each brick, then each section, then flying the whole thing.',
    story: [
      'Imagine you built a big LEGO spaceship. Before you show it off, you want to be sure it will not fall apart.',
      'First you check the tiny pieces: does each little brick click together properly? That is the fast, easy check you do a lot.',
      'Then you check the bigger sections: does the wing connect to the body and stay on? That takes more effort, so you do it less often.',
      'Finally you actually fly the whole spaceship around the room to see if everything works together. That is the most realistic test, but also the slowest, so you only do it a few times. Testing software works the same way: many small checks, some medium ones, and a few big ones.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A test is just code that runs your other code and automatically checks the result is what you expected, so a human does not have to click around manually every time.',
    'Unit tests check one small piece in isolation (a function, a composable) — they are fast and run constantly. Component tests check a Vue component renders and reacts correctly. End-to-end tests drive a real browser like a user would.',
    'The testing pyramid says: write MANY fast unit tests, FEWER component/integration tests, and only a FEW slow end-to-end tests, because the slow ones are expensive and brittle.',
    'In Vue we usually use Vitest as the test runner and Vue Test Utils or Testing Library to mount and interact with components.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Testing in Vue is the practice of writing automated checks at three levels — unit (functions/composables), component (rendered SFCs), and end-to-end (full app in a browser) — to verify behavior and prevent regressions.',
    how: 'You use a runner like Vitest to define test cases (describe/it), call your code or mount your component, and assert the outcome with expect(). Component tests use Vue Test Utils mount() to render and interact; E2E tests use Cypress or Playwright to script a real browser.',
    why: 'It lets a team refactor and ship continuously without manually re-checking everything, and it documents how each piece is supposed to behave.',
    code: {
      label: 'A unit test and a component test with Vitest',
      lang: 'js',
      code: 'import { describe, it, expect } from \'vitest\'\nimport { mount } from \'@vue/test-utils\'\nimport Counter from \'./Counter.vue\'\n\n// Unit test — a plain function\nfunction add(a, b) { return a + b }\ndescribe(\'add\', () => {\n  it(\'sums two numbers\', () => {\n    expect(add(2, 3)).toBe(5)\n  })\n})\n\n// Component test — a Vue SFC\ndescribe(\'Counter\', () => {\n  it(\'increments on click\', async () => {\n    const wrapper = mount(Counter)\n    await wrapper.find(\'button\').trigger(\'click\')\n    expect(wrapper.text()).toContain(\'1\')\n  })\n})',
      explanation: [
        'describe groups related tests; it (or test) defines a single case.',
        'expect(...).toBe(...) is an assertion — the test fails if it is false.',
        'mount() renders the component into a test DOM so you can query and interact with it.',
        'trigger(\'click\') simulates a user event; await is needed because Vue updates the DOM asynchronously.',
        'wrapper.text() reads the rendered output to assert the visible result.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A Vue testing strategy organizes automated checks along the testing pyramid: unit tests exercise pure functions and composables in isolation with mocked dependencies; component (integration) tests mount Single-File Components in a simulated DOM (jsdom/happy-dom) via Vue Test Utils or Testing Library, asserting on rendered output and emitted events; and end-to-end tests drive the fully built application in a real browser via Cypress or Playwright. Vitest, sharing Vite\'s transform pipeline, is the de-facto runner, providing describe/it, expect assertions, mocking (vi.fn/vi.mock), fake timers, and coverage. The strategy favors many cheap, deterministic low-level tests and few expensive, realistic high-level ones.',

  // 7. Internal Working
  internalWorking: [
    'Vitest reuses your Vite config and transform pipeline, so SFCs, TypeScript, and aliases work out of the box without a separate Babel/Jest setup; it runs tests in worker threads for parallelism.',
    'For component tests, a DOM is simulated in Node via jsdom or happy-dom; there is no real browser, which is why fast component tests cannot catch real layout/CSS issues.',
    'Vue Test Utils\' mount() creates a real Vue app instance, renders the component into that simulated DOM, and returns a wrapper exposing find/get, trigger, setProps, emitted(), and html()/text().',
    'Because Vue\'s DOM updates are batched and asynchronous (nextTick), interactions must be awaited so the DOM reflects the new state before you assert.',
    'Mocks (vi.mock / vi.fn) replace modules or functions so a unit/component test can isolate the subject from network, timers, or heavy dependencies and control their return values.',
    'E2E runners build and serve the real app, then automate a real browser (via CDP/WebDriver), executing user flows against the actual rendered application — slow but maximally realistic.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `                      ▲   slow, realistic, expensive, few
                     ╱ ╲
                    ╱E2E╲      Cypress / Playwright — real browser, user flows
                   ╱─────╲
                  ╱        ╲
                 ╱Component ╲   Vue Test Utils / Testing Library — mount SFC in jsdom
                ╱────────────╲
               ╱              ╲
              ╱     Unit       ╲  Vitest — functions, composables, isolated
             ╱──────────────────╲
            ╱____________________╲
                      ▼   fast, isolated, cheap, many
   write MANY at the bottom, FEW at the top`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Unit tests touch almost nothing: a function call and an assertion — microseconds, no DOM allocated.',
    'Component tests allocate a simulated DOM tree (jsdom) plus a Vue app instance per mount; this is heavier, so you tear down (wrapper.unmount()) to avoid leaking state and listeners between tests.',
    'Mocks live in memory as replacement functions/modules; vi.clearAllMocks/restoreAllMocks between tests prevents one test\'s recorded calls from polluting the next.',
    'E2E tests spin up a whole browser process and the built app — by far the largest footprint, which is why you run few of them and reserve them for critical journeys.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — unit test of a pure function',
      lang: 'js',
      code: 'import { describe, it, expect } from \'vitest\'\nimport { formatPrice } from \'./money\'\n\ndescribe(\'formatPrice\', () => {\n  it(\'formats cents to a currency string\', () => {\n    expect(formatPrice(1999)).toBe(\'$19.99\')\n  })\n  it(\'handles zero\', () => {\n    expect(formatPrice(0)).toBe(\'$0.00\')\n  })\n})',
      explanation: [
        'Pure functions are the easiest and most valuable thing to unit test — input in, output asserted.',
        'Each it() is one behavior; multiple cases document the edge handling (zero here).',
        'No DOM, no mocks needed — this is the fast bottom of the pyramid.',
        'These run in milliseconds and can be executed on every save.',
      ],
    },
    intermediate: {
      label: 'Intermediate — component test with props and events',
      lang: 'js',
      code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport TodoItem from \'./TodoItem.vue\'\n\ndescribe(\'TodoItem\', () => {\n  it(\'renders the label and emits on toggle\', async () => {\n    const wrapper = mount(TodoItem, {\n      props: { label: \'Buy milk\', done: false },\n    })\n    expect(wrapper.text()).toContain(\'Buy milk\')\n\n    await wrapper.find(\'input[type=checkbox]\').trigger(\'change\')\n    expect(wrapper.emitted(\'toggle\')).toBeTruthy()\n    expect(wrapper.emitted(\'toggle\')[0]).toEqual([true])\n  })\n})',
      explanation: [
        'Props are passed via the mount options; this tests the component\'s public input contract.',
        'wrapper.emitted() records events the component fired — here we assert it emitted toggle with payload true.',
        'Testing the props-in / events-out contract is the right altitude for component tests.',
        'await is required so Vue flushes the DOM/emit before the assertion runs.',
        'We avoid testing internal data — only observable behavior — so refactors do not break the test.',
      ],
    },
    advanced: {
      label: 'Advanced — mocking a dependency',
      lang: 'js',
      code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect, vi } from \'vitest\'\nimport UserCard from \'./UserCard.vue\'\nimport * as api from \'./api\'\n\ndescribe(\'UserCard\', () => {\n  it(\'shows the fetched user name\', async () => {\n    vi.spyOn(api, \'fetchUser\').mockResolvedValue({ name: \'Ada\' })\n\n    const wrapper = mount(UserCard, { props: { id: 1 } })\n    await new Promise((r) => setTimeout(r))   // let the promise resolve\n    await wrapper.vm.$nextTick()               // let Vue patch the DOM\n\n    expect(wrapper.text()).toContain(\'Ada\')\n    expect(api.fetchUser).toHaveBeenCalledWith(1)\n  })\n})',
      explanation: [
        'vi.spyOn replaces fetchUser so the test never hits a real network — fast and deterministic.',
        'mockResolvedValue makes the spy return a resolved promise with controlled data.',
        'We must flush both the pending promise AND Vue\'s nextTick before asserting the rendered text.',
        'toHaveBeenCalledWith verifies the component called the API with the right argument.',
        'Mocking the boundary (the API) lets us test the component in isolation from the server.',
      ],
    },
    realProject: {
      label: 'Real project — an end-to-end checkout flow',
      lang: 'js',
      code: '// e2e/checkout.cy.js (Cypress)\ndescribe(\'Checkout\', () => {\n  it(\'lets a user add an item and complete checkout\', () => {\n    cy.visit(\'/products\')\n    cy.contains(\'Add to cart\').click()\n    cy.get(\'[data-test=cart-count]\').should(\'have.text\', \'1\')\n    cy.visit(\'/checkout\')\n    cy.get(\'[data-test=email]\').type(\'user@example.com\')\n    cy.contains(\'Place order\').click()\n    cy.contains(\'Order confirmed\').should(\'be.visible\')\n  })\n})',
      explanation: [
        'This drives the real built app in a browser, exactly as a user would — the top of the pyramid.',
        'data-test attributes give stable selectors that survive markup/styling refactors.',
        'It covers the critical revenue path (add to cart → checkout → confirmation), which is what E2E should focus on.',
        'It is slow and broader, so a team keeps only a handful of these for the most important journeys.',
        'Unlike component tests, this exercises routing, real network (or stubs), and the full integration.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the testing pyramid?',
      answer: 'A guideline that you should have many fast, isolated unit tests at the base, fewer component/integration tests in the middle, and very few slow end-to-end tests at the top — because higher-level tests are slower and more brittle.',
      explanation: 'Naming the speed/cost/realism trade-off at each level shows you understand WHY the shape matters, not just the names.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between a unit test and an end-to-end test?',
      answer: 'A unit test checks one small piece (a function or composable) in isolation with dependencies mocked. An end-to-end test drives the whole running application in a real browser as a user would, exercising the full integration.',
      explanation: 'A good answer also notes unit tests are fast and deterministic while E2E are slow and realistic.',
    },
    {
      level: 'intermediate',
      question: 'What tools make up a typical Vue 3 testing stack?',
      answer: 'Vitest as the test runner (shares Vite config), Vue Test Utils or Testing Library to mount and interact with components, jsdom/happy-dom for the simulated DOM, and Cypress or Playwright for E2E.',
      explanation: 'Mentioning that Vitest reuses the Vite pipeline (so SFCs/TS just work) signals practical familiarity.',
    },
    {
      level: 'intermediate',
      question: 'When should you mock something in a test?',
      answer: 'Mock at the boundaries you do not own or that are slow/non-deterministic — network requests, timers, randomness, external modules — so the test stays fast and predictable. Do not mock the thing you are actually testing.',
      explanation: 'The senior nuance is "mock the boundary, not the subject", and that over-mocking makes tests assert implementation rather than behavior.',
    },
    {
      level: 'advanced',
      question: 'Why can component tests in jsdom give false confidence, and how do you compensate?',
      answer: 'jsdom is a JS simulation of the DOM with no real layout, CSS, or browser quirks, so visual and integration bugs slip through. You compensate with a small number of real-browser E2E or component tests (Cypress/Playwright component testing) for the critical, visually-dependent paths.',
      explanation: 'Demonstrates awareness of the limits of fast tests and the deliberate role of slow ones.',
    },
    {
      level: 'senior',
      question: 'How do you keep a large test suite fast and non-flaky?',
      answer: 'Keep most tests at the unit level, mock external boundaries, avoid testing implementation details, use stable data-test selectors instead of text/CSS, await async updates instead of arbitrary sleeps, isolate state (reset mocks/stores between tests), and parallelize. Reserve E2E for a few critical journeys and run them in CI rather than on every save.',
      explanation: 'Senior signal: treating the suite as a system with cost and reliability budgets, not just "more tests = better".',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between Vue Test Utils and Testing Library, and when would you pick each?',
    'How do you test that a component emitted an event with the right payload?',
    'What does code coverage tell you, and what does it NOT tell you?',
    'How do you handle Vue\'s async DOM updates (nextTick) in tests?',
    'What belongs in CI vs what you run locally on save?',
    'How do you test routing and navigation?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Writing too many E2E tests and too few unit tests (an inverted pyramid).',
      why: 'E2E tests are slow and flaky; a top-heavy suite becomes painful to run and unreliable, so people start ignoring failures.',
      fix: 'Push logic down into testable units/composables and keep E2E to a handful of critical user journeys.',
    },
    {
      mistake: 'Testing implementation details (internal data, private methods).',
      why: 'Such tests break on every refactor even when behavior is unchanged, so they punish good cleanups.',
      fix: 'Assert on observable behavior — rendered output, emitted events, the public contract — not internal state.',
    },
    {
      mistake: 'Forgetting to await Vue\'s async DOM updates.',
      why: 'Vue batches DOM updates, so the assertion runs before the DOM reflects the change and the test fails or is flaky.',
      fix: 'await the trigger/setProps or call await nextTick() before asserting.',
    },
    {
      mistake: 'Chasing 100% coverage as the goal.',
      why: 'Coverage measures lines executed, not behavior verified — you can have 100% coverage and still miss real bugs.',
      fix: 'Treat coverage as a hint to find untested logic, and prioritize tests for code that is risky and likely to break.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue Test Utils mount/shallowMount with Vitest is the standard for component and unit tests; teams assert props-in/events-out and rendered output.' },
    { area: 'Nuxt', detail: 'Nuxt provides @nuxt/test-utils to mount components and even run server routes inside Vitest, plus E2E helpers for full-app flows.' },
    { area: 'Pinia', detail: 'createTestingPinia stubs stores so component tests can control store state and spy on actions without real side effects.' },
    { area: 'Component library', detail: 'Libraries run unit + component tests in jsdom for fast feedback, plus a small real-browser suite (Playwright/Cypress component testing) for visual and accessibility-sensitive components.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'A unit-heavy suite runs in seconds, enabling test-on-save and fast CI feedback.',
      'Vitest\'s shared Vite pipeline and worker-thread parallelism keep large suites quick.',
    ],
    bad: [
      'Too many E2E tests make CI slow and flaky, eroding trust in the suite.',
      'Heavy mounting without teardown leaks DOM/listeners and slows the suite over time.',
    ],
    optimizations: [
      'Keep the pyramid shape: many unit, fewer component, few E2E.',
      'Mock slow boundaries (network, timers) and use fake timers for time-based logic.',
      'Parallelize tests and shard E2E across CI machines.',
      'Use stable data-test selectors and await async updates to eliminate flakiness rather than retrying.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'composables', 'vite-vue'],
    nextConcepts: ['component-testing', 'testing-composables', 'e2e-testing-vue'],
    dependencyNote:
      'Testing overview is the umbrella: you need to understand components and composables (the things under test) and Vite (which Vitest builds on). It branches into the specific disciplines — component testing, testing composables, and E2E — each going deeper into one layer of the pyramid.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a triangle and divide it into three bands: Unit (bottom), Component (middle), E2E (top).',
      'Label the bottom "many, fast, isolated" and the top "few, slow, realistic".',
      'Name the tools beside each band: Vitest, Vue Test Utils, Cypress/Playwright.',
      'Add an arrow on the side: cost and brittleness increase as you go up.',
      'Say the rule: push logic down so you can unit-test it; reserve E2E for critical journeys.',
      'Mention mocking boundaries (network/timers) to keep lower tests fast and deterministic.',
    ],
    diagram: `        /\\        E2E   ← few, slow, real browser
       /  \\
      /----\\      Component ← mount SFC in jsdom
     /      \\
    /--------\\    Unit  ← many, fast, isolated
   /__________\\
   cost/realism ↑   speed/quantity ↓`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Testing in Vue follows the pyramid: many fast unit tests of functions and composables, fewer component tests that mount SFCs in jsdom via Vue Test Utils, and a few slow end-to-end tests driving a real browser with Cypress or Playwright. Vitest is the runner and reuses your Vite config. Mock the boundaries (network, timers), test behavior not implementation, await Vue\'s async DOM updates, and use stable data-test selectors. Coverage is a hint, not a goal.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'My mental model for testing a Vue app is the testing pyramid. At the base I write many unit tests — pure functions, utilities, and composables — because they are fast, deterministic, and isolated; I can run them on every save. In the middle I write component tests using Vue Test Utils with Vitest: I mount the Single-File Component into a simulated DOM, pass props, trigger events, and assert on the rendered output and emitted events. The key discipline there is to test the component\'s public contract — props in, events and rendered output out — not its internal data, so that refactors do not break my tests. At the top I keep a small number of end-to-end tests with Cypress or Playwright that drive the real built app in a real browser through critical user journeys like login or checkout. The runner is Vitest because it shares the Vite pipeline, so SFCs and TypeScript just work, and it gives me mocking, fake timers, and coverage. A few practical rules keep the suite healthy: I mock the boundaries I do not own — network requests, timers, randomness — but never the thing I am actually testing; I await Vue\'s asynchronous DOM updates with nextTick or by awaiting the trigger, otherwise tests are flaky; and I use stable data-test attributes instead of text or CSS selectors. The reason for the pyramid shape is cost and reliability: higher-level tests are slower and more brittle, so I push logic down into units I can test cheaply and reserve E2E for the journeys that would lose money if they broke. Finally, I treat coverage as a hint to find untested logic, not as a target — a hundred percent coverage can still miss real bugs if the assertions are weak.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Vue Test Utils (lower-level, Vue-specific, lets you reach into the instance) vs Testing Library (user-centric, discourages implementation-detail testing) — the latter produces more refactor-resilient tests at the cost of less direct access.',
      'jsdom speed vs real-browser fidelity: fast component tests miss layout/CSS/visual bugs; real-browser component testing closes that gap but is slower.',
      'Mocking isolates and speeds tests but, taken too far, asserts implementation and gives false confidence — balance isolation against realism.',
    ],
    edgeCases: [
      'Async components and Suspense require flushing promises AND nextTick before assertions.',
      'Teleport/Transition render outside the wrapper or asynchronously, so queries must target the right container or await transitions.',
      'Global plugins (router, Pinia, i18n) must be installed via mount\'s global.plugins or components throw at mount.',
      'Time-dependent code needs fake timers; otherwise tests are non-deterministic.',
    ],
    runtimeBehavior: [
      'Vitest runs tests in worker threads with isolated module registries, so module-level state does not leak across files (but can within a file — reset it).',
      'Vue\'s batched updates mean the DOM is one tick behind state; awaiting the interaction or nextTick synchronizes them.',
      'shallowMount stubs child components, so a parent test does not depend on children rendering — faster but less integrated.',
    ],
    scalability: [
      'As the suite grows, keep it pyramid-shaped or CI time and flakiness explode; shard E2E across machines.',
      'Use createTestingPinia and shared mount factories to avoid duplicated setup that slows authoring and execution.',
      'Gate slow E2E to CI / pre-merge rather than every local save to preserve fast feedback.',
    ],
    productionConcerns: [
      'Flaky tests erode trust faster than missing tests — quarantine and fix flakes, do not just retry them.',
      'Test data and fixtures must be isolated per test to avoid order-dependence.',
      'Coverage gates can encourage low-value tests; pair them with review focus on risky logic.',
      'Keep tests close to behavior so a green suite genuinely means "safe to ship".',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Pyramid: many Unit, fewer Component, few E2E.',
    'Unit = functions/composables, isolated, fast.',
    'Component = mount SFC in jsdom via Vue Test Utils.',
    'E2E = real browser, real flows, Cypress/Playwright.',
    'Vitest = the runner; reuses Vite config; gives mocks, fake timers, coverage.',
    'Test behavior (rendered output, emitted events), not internal data.',
    'Mock the BOUNDARY (network/timers), never the subject under test.',
    'await Vue\'s async DOM updates (await trigger / nextTick) to avoid flakiness.',
    'Use data-test selectors, not text/CSS, for stability.',
    'Coverage is a hint, not a goal — 100% can still miss bugs.',
    'Install global plugins (router, Pinia) via mount global.plugins.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a Vitest unit test for a function isEven(n) that returns true for even numbers.',
      hint: 'Use describe/it/expect and a couple of cases.',
      solution: {
        lang: 'js',
        code: 'import { describe, it, expect } from \'vitest\'\nimport { isEven } from \'./isEven\'\n\ndescribe(\'isEven\', () => {\n  it(\'is true for even\', () => { expect(isEven(4)).toBe(true) })\n  it(\'is false for odd\', () => { expect(isEven(3)).toBe(false) })\n})',
        explanation: [
          'Two cases cover both branches of the function.',
          'Pure-function unit tests need no DOM or mocks.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a component test asserting that a Greeting component renders the name passed as a prop.',
      hint: 'mount with props, then assert wrapper.text().',
      solution: {
        lang: 'js',
        code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport Greeting from \'./Greeting.vue\'\n\ndescribe(\'Greeting\', () => {\n  it(\'renders the name prop\', () => {\n    const wrapper = mount(Greeting, { props: { name: \'Sam\' } })\n    expect(wrapper.text()).toContain(\'Hello, Sam\')\n  })\n})',
        explanation: [
          'Props are passed through mount options to exercise the input contract.',
          'wrapper.text() asserts the visible rendered output, not internals.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Test that clicking a button calls a mocked save() prop function exactly once.',
      hint: 'Pass a vi.fn() as the prop and assert toHaveBeenCalledTimes.',
      solution: {
        lang: 'js',
        code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect, vi } from \'vitest\'\nimport SaveButton from \'./SaveButton.vue\'\n\ndescribe(\'SaveButton\', () => {\n  it(\'calls save once on click\', async () => {\n    const save = vi.fn()\n    const wrapper = mount(SaveButton, { props: { save } })\n    await wrapper.find(\'button\').trigger(\'click\')\n    expect(save).toHaveBeenCalledTimes(1)\n  })\n})',
        explanation: [
          'vi.fn() creates a spy that records how it was called.',
          'await the trigger so the handler runs before the assertion.',
          'toHaveBeenCalledTimes(1) verifies the click wiring without testing internals.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'You inherit a suite that is 90% E2E and takes 40 minutes in CI. Explain your refactor plan with example tests.',
      hint: 'Invert toward the pyramid: extract logic into units, keep a few critical E2E.',
      solution: {
        lang: 'js',
        code: '// 1) Extract logic out of components into a composable so it can be unit-tested:\n// useCart.js  → addItem, total, etc.\nimport { describe, it, expect } from \'vitest\'\nimport { useCart } from \'./useCart\'\n\ndescribe(\'useCart\', () => {\n  it(\'totals items\', () => {\n    const cart = useCart()\n    cart.addItem({ price: 100, qty: 2 })\n    expect(cart.total.value).toBe(200)\n  })\n})\n\n// 2) Keep ONE E2E for the critical revenue journey (checkout), delete the rest.\n// 3) Convert the deleted E2E coverage into fast component tests in jsdom.',
        explanation: [
          'The core move is pushing logic down into composables/functions you can unit-test in milliseconds.',
          'Replace most E2E with component tests that cover the same behavior far faster.',
          'Keep only the few highest-value E2E (checkout, auth) so CI is fast and trustworthy.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Knowing how to structure tests separates engineers who can grow a codebase safely from those who fear changing it. The pyramid and "what to mock" decisions show judgment, which is exactly what senior interviews probe.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definitions and the pyramid. Product companies (Zoho, Flipkart, Razorpay) ask you to write a component test and decide what to mock. FAANG-level interviews probe suite health, flakiness, false confidence in jsdom, and trade-offs between test levels.',
    whatInterviewersExpect:
      'They expect you to explain the pyramid and why the shape matters, name the Vue stack (Vitest, Vue Test Utils, Cypress/Playwright), decide what to mock, test behavior over implementation, handle Vue\'s async updates, and treat coverage as a hint rather than a goal.',
  },
}

export default testingOverview
