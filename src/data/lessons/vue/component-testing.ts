import type { ConceptLesson } from '../../../types/lesson'

const componentTesting: ConceptLesson = {
  // 1. Concept Summary
  slug: 'component-testing',
  name: 'Component Testing',
  category: 'testing',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Components are the unit of reuse in Vue, so testing them is where most of your behavioral confidence comes from — more than unit tests of pure functions and far cheaper than E2E.',
    'A good component test verifies the public contract (props in, events/rendered output out) so you can refactor internals freely without breaking tests.',
    'Mounting a component exercises the template, reactivity, lifecycle, and event wiring together — catching integration bugs a pure unit test never would.',
    'This is the single most likely "write a test" task in a Vue interview, so fluency with mount/find/trigger/emitted is expected.',
    'Knowing how to handle props, slots, emitted events, async updates, and plugin injection is the practical skill that makes a component test suite reliable instead of flaky.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Testing a component is like testing a vending machine: put money in, press a button, and check the right snack comes out.',
    story: [
      'Imagine a vending machine. You do not need to open it up and look at all the gears inside to know if it works.',
      'You just put in a coin (that is like giving the component a prop), press the button you want (that is like clicking), and then check what drops out the bottom.',
      'If you ask for chips and chips come out, the machine works — you tested it from the outside, like a real customer.',
      'Testing a Vue component is the same: you give it inputs, you poke its buttons, and you check what it shows or sends back — without caring about the gears (the internal code) inside.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Vue component takes inputs (props and slots) and produces outputs (rendered HTML and emitted events). A component test checks that for given inputs you get the right outputs.',
    'To do this you "mount" the component, which renders it into a fake browser DOM (jsdom) so you can read its text and click its buttons in code.',
    'Vue Test Utils gives you a wrapper with helpers: find() to grab an element, trigger() to fire an event, setProps() to change inputs, and emitted() to see what events the component fired.',
    'Because Vue updates the DOM asynchronously, you must await your interactions before checking the result, or the test reads the old DOM.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Component testing mounts a Vue Single-File Component into a simulated DOM and verifies its behavior through its public interface: pass props and slots, trigger user interactions, and assert on rendered output and emitted events.',
    how: 'You use Vue Test Utils\' mount() (or Testing Library\'s render()) inside Vitest. mount returns a wrapper; you query with find/get, interact with trigger/setProps, await Vue\'s update, then assert with expect on text(), html(), or emitted().',
    why: 'It gives high-confidence, refactor-resilient coverage at moderate cost — you test what the user/parent observes, not how the component is written internally.',
    code: {
      label: 'Mount, interact, assert',
      lang: 'js',
      code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport Counter from \'./Counter.vue\'\n\ndescribe(\'Counter\', () => {\n  it(\'starts at the initial prop and increments on click\', async () => {\n    const wrapper = mount(Counter, { props: { start: 5 } })\n    expect(wrapper.text()).toContain(\'5\')\n\n    await wrapper.find(\'[data-test=inc]\').trigger(\'click\')\n    expect(wrapper.text()).toContain(\'6\')\n  })\n})',
      explanation: [
        'mount renders Counter into jsdom with the start prop set to 5.',
        'wrapper.text() reads the rendered output to confirm the initial value.',
        'find with a data-test selector grabs the increment button reliably.',
        'await trigger fires the click AND waits for Vue to flush the DOM update.',
        'The second assertion checks observable output (6), not internal count state.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Component testing renders a Vue component into a simulated DOM (jsdom or happy-dom) via a mounting utility — Vue Test Utils\' mount/shallowMount or Testing Library\'s render — instantiating a real Vue app so the template compiles, reactivity runs, and lifecycle hooks fire. Tests assert against the component\'s observable contract: props and slots as inputs; rendered DOM (text/html), DOM attributes/classes, and emitted custom events as outputs. Interactions are driven via trigger/setProps and must be awaited because Vue batches DOM updates on the next microtask (nextTick). Dependencies are isolated by stubbing child components (shallowMount), mocking modules (vi.mock), or injecting test doubles for plugins (router, Pinia) through the global mount option.',

  // 7. Internal Working
  internalWorking: [
    'mount() compiles the component\'s template to a render function (or uses the precompiled one), creates a Vue app instance, and renders it into a detached container in the jsdom document.',
    'The returned wrapper holds a reference to the component instance (vm) and the root DOM node, exposing query (find/get/findAll), interaction (trigger/setValue/setProps), and inspection (text/html/attributes/classes/emitted) helpers.',
    'When you call trigger(\'click\'), VTU dispatches a real DOM event on the node; Vue\'s event listener runs the handler, which mutates reactive state and schedules a render-effect re-run.',
    'Vue batches that re-run into the next microtask, so VTU\'s trigger/setProps return a promise you must await (or call nextTick) before the DOM reflects the change.',
    'shallowMount replaces child components with stub elements, so the parent renders without its children\'s real logic — isolating the unit and speeding the test.',
    'global.plugins / global.provide / global.stubs let you install router, Pinia, i18n, or directives so the component\'s injected dependencies resolve during the test instead of throwing.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        INPUTS                  COMPONENT UNDER TEST            OUTPUTS
   ┌──────────────┐          ┌────────────────────────┐     ┌─────────────────┐
   │ props        │ ───────► │  mount() into jsdom     │ ──► │ rendered DOM    │
   │ slots        │          │  template + reactivity  │     │ (text/html/attr)│
   └──────────────┘          │  + lifecycle hooks      │     └─────────────────┘
   ┌──────────────┐          │                         │     ┌─────────────────┐
   │ user events  │ ─trigger►│  handlers mutate state  │ ──► │ emitted() events│
   │ (click/input)│          │  → re-render (nextTick) │     └─────────────────┘
   └──────────────┘          └────────────────────────┘
        test only touches the OUTSIDE — never internal data
        (await interactions so the DOM is up to date before asserting)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each mount() allocates a jsdom container, a Vue app instance, and the reactive effect graph for that component — heavier than a unit test but isolated per test.',
    'The wrapper retains references to the vm and DOM; failing to unmount() (or relying on auto-cleanup) across many tests can leak listeners and inflate memory in large suites.',
    'shallowMount avoids allocating the children\'s subtrees and effects, so it has a smaller footprint and runs faster than a full mount.',
    'Mocks/stubs and any provided plugins live alongside the instance; reset them (vi.clearAllMocks, fresh Pinia) between tests so recorded calls and state do not bleed across cases.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — assert rendered output from a prop',
      lang: 'js',
      code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport Badge from \'./Badge.vue\'\n\ndescribe(\'Badge\', () => {\n  it(\'renders the label and applies the variant class\', () => {\n    const wrapper = mount(Badge, { props: { label: \'New\', variant: \'success\' } })\n    expect(wrapper.text()).toContain(\'New\')\n    expect(wrapper.classes()).toContain(\'badge--success\')\n  })\n})',
      explanation: [
        'Props drive both the text and the conditional class.',
        'wrapper.text() and wrapper.classes() inspect observable output.',
        'No interaction needed — this verifies the pure render contract.',
        'Asserting the class (not internal computed) keeps the test refactor-safe.',
      ],
    },
    intermediate: {
      label: 'Intermediate — emitted events and v-model',
      lang: 'js',
      code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport SearchInput from \'./SearchInput.vue\'\n\ndescribe(\'SearchInput\', () => {\n  it(\'emits update:modelValue when typing\', async () => {\n    const wrapper = mount(SearchInput, { props: { modelValue: \'\' } })\n    await wrapper.find(\'input\').setValue(\'vue\')\n\n    expect(wrapper.emitted(\'update:modelValue\')).toBeTruthy()\n    expect(wrapper.emitted(\'update:modelValue\')[0]).toEqual([\'vue\'])\n  })\n})',
      explanation: [
        'setValue sets the input value AND triggers the input event in one call.',
        'emitted() returns an array of all emissions for the named event.',
        '[0] is the first emission; its payload array is [\'vue\'] for the v-model update.',
        'This verifies the v-model contract (update:modelValue) without inspecting internals.',
        'await is required so the emission is recorded before we assert.',
      ],
    },
    advanced: {
      label: 'Advanced — slots, stubs, and a provided store',
      lang: 'js',
      code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport { createTestingPinia } from \'@pinia/testing\'\nimport ProductPage from \'./ProductPage.vue\'\n\ndescribe(\'ProductPage\', () => {\n  it(\'renders slot content and stubs the heavy chart\', () => {\n    const wrapper = mount(ProductPage, {\n      global: {\n        plugins: [createTestingPinia()],\n        stubs: { SalesChart: true },     // skip the expensive child\n      },\n      slots: { actions: \'<button>Buy</button>\' },\n      props: { id: 42 },\n    })\n    expect(wrapper.html()).toContain(\'Buy\')\n    expect(wrapper.findComponent({ name: \'SalesChart\' }).exists()).toBe(true)\n  })\n})',
      explanation: [
        'createTestingPinia installs a stubbed store so the component\'s store usage resolves.',
        'stubs replaces SalesChart with a placeholder, isolating the page from a heavy child.',
        'The actions slot is provided as markup and asserted in the rendered html.',
        'findComponent confirms the stubbed child is present without running its real logic.',
        'global options are how you satisfy a component\'s injected dependencies in tests.',
      ],
    },
    realProject: {
      label: 'Real project — testing an async data component',
      lang: 'js',
      code: 'import { mount, flushPromises } from \'@vue/test-utils\'\nimport { describe, it, expect, vi } from \'vitest\'\nimport UserProfile from \'./UserProfile.vue\'\nimport * as api from \'./api\'\n\ndescribe(\'UserProfile\', () => {\n  it(\'shows a loader then the user once data resolves\', async () => {\n    vi.spyOn(api, \'getUser\').mockResolvedValue({ name: \'Ada\' })\n    const wrapper = mount(UserProfile, { props: { id: 1 } })\n\n    expect(wrapper.text()).toContain(\'Loading\')   // before resolve\n    await flushPromises()                          // resolve fetch + render\n    expect(wrapper.text()).toContain(\'Ada\')\n    expect(api.getUser).toHaveBeenCalledWith(1)\n  })\n})',
      explanation: [
        'The loader is asserted before the promise resolves — testing the loading state.',
        'flushPromises() resolves pending microtasks (the fetch) and lets Vue re-render.',
        'After flushing, the resolved name appears — testing the success state.',
        'Mocking the API keeps the test fast, offline, and deterministic.',
        'This mirrors a real list/detail page that fetches on mount.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does mount() return and what can you do with it?',
      answer: 'It returns a wrapper around the rendered component, exposing helpers to query the DOM (find/get/findAll), interact (trigger/setValue/setProps), inspect (text/html/classes/attributes), and read emitted events (emitted()).',
      explanation: 'A solid answer names at least one helper from each category and notes the wrapper wraps both DOM and the component instance.',
    },
    {
      level: 'beginner',
      question: 'Why do you need to await trigger() in a component test?',
      answer: 'Because Vue batches DOM updates to the next microtask (nextTick). trigger returns a promise that resolves after the update, so awaiting it ensures the DOM reflects the change before you assert.',
      explanation: 'Mentioning nextTick and the batching model shows you understand the cause, not just the ritual.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between mount and shallowMount?',
      answer: 'mount renders the component and all its children fully; shallowMount stubs the child components so only the component under test renders. shallowMount is faster and more isolated but less integrated.',
      explanation: 'The nuance: shallowMount tests the component in isolation; mount catches parent-child integration bugs.',
    },
    {
      level: 'intermediate',
      question: 'How do you test that a component emitted an event with the right payload?',
      answer: 'Trigger the interaction, await it, then read wrapper.emitted(\'eventName\'); it returns an array of emissions where each entry is the arguments array, so emitted(\'eventName\')[0] is the first call\'s payload.',
      explanation: 'Testing emitted events is testing the component\'s output contract — exactly the right altitude.',
    },
    {
      level: 'advanced',
      question: 'How do you handle a component that uses the router or a Pinia store in a test?',
      answer: 'Install the dependencies via the global mount option: global.plugins with a test router (createRouter/memory history) and createTestingPinia, or stub them. createTestingPinia also lets you preset state and spy on actions.',
      explanation: 'Demonstrates knowledge of dependency injection in tests and the ecosystem testing helpers.',
    },
    {
      level: 'senior',
      question: 'Why prefer asserting on rendered output over component internals, and when might you reach inside?',
      answer: 'Asserting on output (DOM, emitted events) tests the contract the user/parent depends on, so internal refactors do not break tests. Reaching into vm/internal state couples the test to implementation and is brittle; you only do it pragmatically when behavior is otherwise unobservable, and even then prefer exposing it via the contract.',
      explanation: 'Senior signal: framing tests as a contract and weighing brittleness, citing Testing Library\'s philosophy.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you test slots and scoped slots?',
    'What is flushPromises and when do you need it?',
    'How do you test a component that depends on a custom directive?',
    'When would you use Testing Library\'s render() instead of mount()?',
    'How do you test conditional rendering driven by props?',
    'How do you assert a component did NOT emit an event?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Asserting before awaiting the async DOM update.',
      why: 'Vue updates the DOM on the next tick, so the assertion reads stale output and the test fails or flakes.',
      fix: 'await the trigger/setValue/setProps, or await nextTick()/flushPromises() before asserting.',
    },
    {
      mistake: 'Querying by brittle CSS classes or text that changes with styling/i18n.',
      why: 'Refactors and copy changes break tests that should still pass, eroding trust in the suite.',
      fix: 'Use stable data-test attributes for selectors.',
    },
    {
      mistake: 'Testing internal data (wrapper.vm.someState) instead of behavior.',
      why: 'It couples the test to implementation, so harmless refactors break it.',
      fix: 'Assert on rendered output and emitted events — the public contract.',
    },
    {
      mistake: 'Forgetting to provide plugins (router/Pinia) the component needs.',
      why: 'inject/useStore/useRoute throw at mount, failing the test for the wrong reason.',
      fix: 'Install them via global.plugins (createTestingPinia, a test router) or stub them.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue Test Utils mount/shallowMount with Vitest is the standard way teams test SFC behavior — props, events, slots, and conditional rendering.' },
    { area: 'Pinia', detail: 'createTestingPinia stubs stores, presets state, and auto-spies actions so component tests control store behavior without real side effects.' },
    { area: 'Component library', detail: 'Library authors test every public prop/slot/event combination, often pairing jsdom tests with real-browser component testing for visual/a11y-sensitive components.' },
    { area: 'Nuxt', detail: '@nuxt/test-utils provides mountSuspended and auto-imports so components using Nuxt composables (useRoute, useAsyncData) can be component-tested.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Component tests run in jsdom in milliseconds, giving fast feedback on most behavior.',
      'shallowMount and stubbing children keep heavy subtrees out of the test, speeding execution.',
    ],
    bad: [
      'Full mount of deep trees with real children is slower and can pull in unwanted dependencies.',
      'Leaking mounts (no teardown) accumulate listeners/state and slow large suites.',
    ],
    optimizations: [
      'Use shallowMount when you only care about the component itself.',
      'Stub heavy children (charts, maps) and mock network/timers.',
      'Share a mount factory to avoid repeated boilerplate setup.',
      'Reset mocks and create a fresh store/router per test to avoid cross-test cost and flakiness.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['testing-overview', 'components-basics', 'props', 'component-events'],
    nextConcepts: ['testing-composables', 'e2e-testing-vue', 'slots'],
    dependencyNote:
      'Component testing builds on the testing overview (the pyramid) and on understanding components, props, and events (the contract you assert). It leads into testing composables (logic extracted out of components) and E2E (the full-app layer above it).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box for the component with arrows in (props, slots, user events) and out (rendered DOM, emitted events).',
      'Write mount(Component, { props }) producing a wrapper.',
      'Show three wrapper calls: find(\'[data-test=...]\'), trigger(\'click\'), emitted().',
      'Put a clock symbol on trigger and write "await — Vue updates on nextTick".',
      'Underline "assert OUTPUT, not internals" so refactors do not break tests.',
      'Note global.plugins for router/Pinia and stubs for heavy children.',
    ],
    diagram: `  props/slots ─┐                      ┌─► text()/html()/classes()
   user event ─┼─► mount() → wrapper ─┤
               │   (jsdom + reactivity)│─► emitted('evt')[0]
               └── await trigger ──────┘
        assert OUTPUT only • install plugins via global`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Component testing mounts an SFC into jsdom with Vue Test Utils and checks its public contract: pass props and slots, trigger interactions, and assert on rendered output and emitted events. Always await interactions because Vue updates the DOM on nextTick. Use shallowMount or stubs to isolate, mock network/timers, and install router/Pinia via global.plugins. Select with data-test attributes and assert behavior, not internal state, so refactors do not break tests.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Component testing is where I get most of my confidence in a Vue app, because it sits in the sweet spot of the pyramid: it exercises the template, reactivity, lifecycle, and event wiring together, but it is still fast and cheap compared to end-to-end. I use Vue Test Utils with Vitest. I mount the Single-File Component into a simulated DOM, which gives me a wrapper. The principle I follow is to test the component\'s public contract: the inputs are props and slots, and the outputs are the rendered DOM and the emitted events. So I pass props through the mount options, trigger user interactions like clicks and input with trigger and setValue, and then assert on wrapper.text() or html() and on wrapper.emitted(). I deliberately avoid asserting on internal data like wrapper.vm.someState, because that couples the test to the implementation and breaks on harmless refactors. A crucial detail is that Vue batches DOM updates to the next microtask, so trigger and setProps return promises I must await — otherwise I read stale DOM and the test flakes; for async data I use flushPromises to resolve pending fetches and re-render. To isolate the component I use shallowMount or stub heavy children like charts, and I mock the network and timers so tests are deterministic. When a component depends on the router or a Pinia store, I install them through the global mount option — a test router and createTestingPinia, which also lets me preset store state and spy on actions. Finally I select elements with stable data-test attributes rather than CSS classes or text, so styling and copy changes do not break the suite. That combination — assert output, await updates, isolate dependencies, stable selectors — is what makes a component test suite both trustworthy and fast.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'mount (integrated, catches parent-child bugs) vs shallowMount (isolated, fast) — choose based on whether you are testing the unit or its integration.',
      'Vue Test Utils (Vue-aware, can reach internals) vs Testing Library (user-centric, discourages implementation testing) — the latter yields more resilient tests with less direct access.',
      'jsdom speed vs real-browser fidelity: component tests miss layout/CSS/visual regressions, so a few real-browser component tests complement them for visual components.',
    ],
    edgeCases: [
      'Teleport renders content outside the wrapper root, so queries must target document.body or the teleport target.',
      'Transition/TransitionGroup delay DOM changes; you may need to await transitions or stub them.',
      'Scoped slots require passing a function/template via slots and asserting the rendered result.',
      'Components using provide/inject need matching global.provide or a wrapper that provides the value.',
    ],
    runtimeBehavior: [
      'trigger dispatches real DOM events; the handler runs synchronously but the re-render is deferred to nextTick — hence the awaited promise.',
      'setProps replaces props reactively and triggers a re-render you must await.',
      'shallowMount stubs render as <child-stub> elements, so findComponent still finds them but their logic does not run.',
      'emitted() accumulates across the test; assert the specific index/payload rather than just truthiness when ordering matters.',
    ],
    scalability: [
      'Mount factories and shared global options reduce boilerplate and keep large suites maintainable.',
      'Prefer shallowMount and stubbing in deep trees to avoid pulling in unrelated dependencies and slowing CI.',
      'Reset Pinia/router and clear mocks per test to prevent order-dependent flakiness as the suite grows.',
    ],
    productionConcerns: [
      'Brittle selectors and internal-state assertions are the top causes of suites people stop trusting — standardize on data-test and contract assertions.',
      'Async timing (missing await/flushPromises) is the top flakiness source — lint for unawaited triggers.',
      'Provide a consistent test harness (helper that installs plugins) so every test mounts components the same way.',
      'Pair fast jsdom tests with a thin real-browser layer for visual/a11y coverage that jsdom cannot provide.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'mount(Component, { props, slots, global }) → wrapper.',
    'Query: find/get/findAll/findComponent; inspect: text/html/classes/attributes.',
    'Interact: trigger(\'click\'), setValue(...), setProps(...) — all return promises.',
    'await every interaction (Vue updates on nextTick) or use flushPromises for async data.',
    'Read events with emitted(\'evt\')[i] → payload array.',
    'shallowMount stubs children for isolation/speed; mount tests integration.',
    'Install router/Pinia via global.plugins (createTestingPinia presets state + spies).',
    'Stub heavy children via global.stubs; mock network/timers with vi.',
    'Select with data-test attributes, not CSS/text.',
    'Assert OUTPUT (DOM + emitted), not internal vm state.',
    'Teleport renders outside the wrapper — query the target.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Mount a Button component with a label prop and assert the rendered text.',
      hint: 'Pass props via mount options and use wrapper.text().',
      solution: {
        lang: 'js',
        code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport Button from \'./Button.vue\'\n\ndescribe(\'Button\', () => {\n  it(\'renders its label\', () => {\n    const wrapper = mount(Button, { props: { label: \'Save\' } })\n    expect(wrapper.text()).toContain(\'Save\')\n  })\n})',
        explanation: [
          'The prop drives the rendered output.',
          'wrapper.text() asserts the visible contract, no interaction needed.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Test that clicking a delete button emits a "remove" event with the item id passed as a prop.',
      hint: 'await trigger, then read emitted(\'remove\').',
      solution: {
        lang: 'js',
        code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport ListItem from \'./ListItem.vue\'\n\ndescribe(\'ListItem\', () => {\n  it(\'emits remove with the id\', async () => {\n    const wrapper = mount(ListItem, { props: { id: 7 } })\n    await wrapper.find(\'[data-test=delete]\').trigger(\'click\')\n    expect(wrapper.emitted(\'remove\')[0]).toEqual([7])\n  })\n})',
        explanation: [
          'await trigger fires the click and waits for Vue to process it.',
          'emitted(\'remove\')[0] is the first emission; its payload array is [7].',
          'This verifies the event output contract.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Test a component that fetches data on mount: assert it shows a loader, then the data after the request resolves (mock the API).',
      hint: 'Use vi.spyOn + mockResolvedValue and flushPromises.',
      solution: {
        lang: 'js',
        code: 'import { mount, flushPromises } from \'@vue/test-utils\'\nimport { describe, it, expect, vi } from \'vitest\'\nimport Widget from \'./Widget.vue\'\nimport * as api from \'./api\'\n\ndescribe(\'Widget\', () => {\n  it(\'loads then renders\', async () => {\n    vi.spyOn(api, \'load\').mockResolvedValue([\'a\', \'b\'])\n    const wrapper = mount(Widget)\n    expect(wrapper.text()).toContain(\'Loading\')\n    await flushPromises()\n    expect(wrapper.text()).toContain(\'a\')\n  })\n})',
        explanation: [
          'The loader is asserted in the initial pending state.',
          'flushPromises resolves the mocked fetch and lets Vue re-render.',
          'The post-resolution assertion checks the success state output.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A component uses a Pinia store and the router. Write a test that mounts it with both installed and a preset store state.',
      hint: 'Use global.plugins with createTestingPinia({ initialState }) and a memory router.',
      solution: {
        lang: 'js',
        code: 'import { mount } from \'@vue/test-utils\'\nimport { describe, it, expect } from \'vitest\'\nimport { createTestingPinia } from \'@pinia/testing\'\nimport { createRouter, createMemoryHistory } from \'vue-router\'\nimport Dashboard from \'./Dashboard.vue\'\n\nconst router = createRouter({ history: createMemoryHistory(), routes: [{ path: \'/\', component: {} }] })\n\ndescribe(\'Dashboard\', () => {\n  it(\'renders the username from store state\', async () => {\n    await router.push(\'/\')\n    const wrapper = mount(Dashboard, {\n      global: {\n        plugins: [\n          createTestingPinia({ initialState: { user: { name: \'Ada\' } } }),\n          router,\n        ],\n      },\n    })\n    expect(wrapper.text()).toContain(\'Ada\')\n  })\n})',
        explanation: [
          'createTestingPinia seeds the store so useStore resolves with controlled state.',
          'A memory-history router satisfies useRoute/useRouter without a browser.',
          'Both are installed through global.plugins, the standard dependency-injection point for tests.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Component testing is the most practical, most-asked testing skill in Vue interviews and the one that delivers the most day-to-day confidence. Fluency with mount/trigger/emitted and dependency injection signals you can ship and refactor safely.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "how do you test a component" conceptually. Product companies (Zoho, Flipkart, Razorpay) hand you a component and ask you to write tests for its props, events, and async behavior. FAANG-level interviews probe isolation strategy, async timing, and why you assert output over internals.',
    whatInterviewersExpect:
      'They expect you to mount a component, drive it through props and interactions, await Vue\'s async updates, assert on rendered output and emitted events, inject router/Pinia via global, isolate with stubs/mocks, and explain why testing the contract beats testing internals.',
  },
}

export default componentTesting
