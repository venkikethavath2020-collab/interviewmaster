import type { ConceptLesson } from '../../../types/lesson'

const headlessComponents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'headless-components',
  name: 'Headless Components',
  category: 'patterns',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Headless (renderless) components separate behaviour from markup, so the same logic powers wildly different designs — the secret behind libraries like Headless UI, TanStack, and VueUse.',
    'They are the cleanest answer to "how do I reuse complex stateful logic AND let the consumer fully control the UI?" — combining slots/composables with zero opinion on styling.',
    'They future-proof your code: when the design system changes, the behaviour component stays untouched and only the template the consumer supplies changes.',
    'Interviewers use them to test whether you understand scoped slots, composables, and the trade-off between flexibility and convenience.',
    'In Vue 3 the line blurs: a composable is often a better "headless" tool than a renderless component — knowing when to use which is a senior-level distinction.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A headless component is like the engine of a car sold without a body — you bolt on whatever shape of car you want around it.',
    story: [
      'Imagine a company that builds only car engines. The engine makes the wheels turn, but it has no doors, no seats, no paint.',
      'Different car makers buy the same engine and build totally different cars around it — a sports car, a truck, a tiny city car.',
      'The engine does not care what the car looks like; it just provides the power. The makers decide the appearance.',
      'A headless component is that engine for screens: it provides all the "how it works" — like opening, closing, picking an item — but no looks. You wrap your own design around it and it just works.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A headless (or renderless) component contains the logic and state for a feature but does not draw any specific UI itself.',
    'Instead of rendering its own buttons and boxes, it hands its state and actions to you — usually through a scoped slot — and lets you decide exactly what to render.',
    'This means one behaviour component (say, a toggle or a dropdown) can look completely different in every app while behaving identically.',
    'In modern Vue you can also get the same separation by putting the logic in a composable function and calling it from your own component — that is the "logic without UI" idea in its purest form.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A headless component packages behaviour and state without dictating markup. It exposes its internals — state and methods — to the consumer (via a scoped slot in the renderless style, or via a composable) so the consumer renders any UI they like.',
    how: 'In the renderless style the component does its work in setup() and renders a scoped slot, passing { state, actions } as slot props. The consumer writes the template and wires those slot props to their own elements.',
    why: 'It maximises reuse and flexibility: the hard logic (accessibility, keyboard handling, async state) is written once, while every consumer controls the look. It cleanly separates concerns of behaviour and presentation.',
    code: {
      label: 'A renderless Toggle',
      lang: 'js',
      code: '// Toggle.vue (renderless)\n// <script setup>\nimport { ref } from \'vue\'\nconst on = ref(false)\nconst toggle = () => (on.value = !on.value)\ndefineExpose({ on, toggle })\n// </script>\n// <template>\n//   <slot :on="on" :toggle="toggle" />\n// </template>\n\n// Usage — consumer controls ALL markup:\n// <Toggle v-slot="{ on, toggle }">\n//   <button @click="toggle">{{ on ? \'ON\' : \'OFF\' }}</button>\n// </Toggle>',
      explanation: [
        'Toggle owns the on state and toggle action but renders no UI of its own.',
        'It renders a single default slot and passes on and toggle as scoped-slot props.',
        'The consumer destructures { on, toggle } and renders any markup they want.',
        'Swap the button for a switch, an icon, or a checkbox — the logic is unchanged.',
        'That is headless: behaviour shared, presentation free.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A headless (renderless) component encapsulates stateful behaviour without prescribing markup, exposing its state and actions to consumers — classically via a scoped slot that receives slot props ({ state, actions }), or in Vue 3 increasingly via a composable that returns reactive state and methods. The consumer supplies the entire template, achieving complete presentational freedom while reusing the behavioural core (state machines, accessibility, async handling). The renderless component itself typically renders only its default slot (or nothing), acting as a logic provider rather than a UI element.',

  // 7. Internal Working
  internalWorking: [
    'The headless component\'s setup() builds reactive state (refs/reactive), event handlers, and any lifecycle/listeners (keyboard, focus, fetch), exactly like a normal component.',
    'Instead of a markup template, its render returns the default scoped slot invoked with an object of state and actions: slots.default({ ...api }).',
    'Vue treats the scoped slot as a function; calling it produces the consumer-supplied vnodes, so the rendered DOM is entirely the consumer\'s, parented under the headless component instance.',
    'Because the passed values are reactive (refs/computed), the consumer\'s template re-renders automatically when state changes, via the normal effect/track/trigger cycle.',
    'A purely renderless component may render no wrapper element (returning the slot vnodes directly), so it adds an instance but no extra DOM node.',
    'The composable-based variant skips the component entirely: the logic lives in a function returning reactive values, and the consumer calls it in their own setup() — no slot indirection, but no shared template boundary either.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '  RENDERLESS COMPONENT                COMPOSABLE (Vue 3 alt)\n  ┌────────────────────────┐         function useToggle() {\n  │ <Toggle> setup():       │           const on = ref(false)\n  │   on=ref, toggle()      │           const toggle = ...\n  │   render:               │           return { on, toggle }\n  │   slots.default({on,    │         }\n  │                 toggle})│\n  └──────────┬─────────────┘         // consumer setup():\n             │ slot props            // const { on, toggle } = useToggle()\n             ▼\n   consumer template (ANY markup)\n   <button @click="toggle">{{on}}</button>\n\n  logic written ONCE ─────► many different LOOKS',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — renderless counter',
      lang: 'js',
      code: '// Counter.vue (renderless)\n// <script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\nconst inc = () => count.value++\nconst dec = () => count.value--\n// </script>\n// <template>\n//   <slot :count="count" :inc="inc" :dec="dec" />\n// </template>\n\n// Usage:\n// <Counter v-slot="{ count, inc, dec }">\n//   <button @click="dec">-</button>{{ count }}<button @click="inc">+</button>\n// </Counter>',
      explanation: [
        'Counter owns count and the inc/dec actions but renders no buttons itself.',
        'It exposes them through a scoped slot the consumer fills in.',
        'Two different apps can render totally different counter UIs from the same component.',
        'The reactive count flows into the slot so the consumer template updates automatically.',
      ],
    },
    intermediate: {
      label: 'Intermediate — renderless data fetcher',
      lang: 'js',
      code: '// Fetcher.vue (renderless)\n// <script setup>\nimport { ref, watchEffect } from \'vue\'\nconst props = defineProps({ url: String })\nconst data = ref(null), error = ref(null), loading = ref(false)\nwatchEffect(async () => {\n  loading.value = true; error.value = null\n  try { data.value = await (await fetch(props.url)).json() }\n  catch (e) { error.value = e } finally { loading.value = false }\n})\n// </script>\n// <template>\n//   <slot :data="data" :error="error" :loading="loading" />\n// </template>',
      explanation: [
        'Fetcher encapsulates the loading/error/data state machine for any URL.',
        'It re-fetches whenever url changes via watchEffect.',
        'The consumer decides whether to show a spinner, a table, or a chart from the slot props.',
        'The same fetcher powers a user list and a product grid with different markup.',
        'Note: in Vue 3 a useFetch composable usually expresses this more cleanly.',
      ],
    },
    advanced: {
      label: 'Advanced — headless dropdown with keyboard/accessibility',
      lang: 'js',
      code: '// useDropdown.js (composable-style headless)\nimport { ref, onMounted, onUnmounted } from \'vue\'\nexport function useDropdown() {\n  const open = ref(false)\n  const toggle = () => (open.value = !open.value)\n  const close = () => (open.value = false)\n  const onKey = (e) => { if (e.key === \'Escape\') close() }\n  onMounted(() => document.addEventListener(\'keydown\', onKey))\n  onUnmounted(() => document.removeEventListener(\'keydown\', onKey))\n  const triggerProps = () => ({ \'aria-expanded\': open.value, onClick: toggle })\n  return { open, toggle, close, triggerProps }\n}',
      explanation: [
        'The hard parts — Escape-to-close, aria-expanded, listener cleanup — live in the composable.',
        'triggerProps() returns a prop bag the consumer spreads onto their own button (v-bind).',
        'The consumer controls every pixel of the menu while behaviour and a11y are reused.',
        'This is the Headless UI philosophy: ship behaviour and accessibility, not styles.',
        'Returning prop bags is how libraries keep markup in the consumer\'s hands.',
      ],
    },
    realProject: {
      label: 'Real project — a reusable form-field controller',
      lang: 'js',
      code: '// useField.js\nimport { ref, computed } from \'vue\'\nexport function useField(rules = []) {\n  const value = ref(\'\')\n  const touched = ref(false)\n  const error = computed(() => {\n    for (const rule of rules) {\n      const msg = rule(value.value)\n      if (msg !== true) return msg\n    }\n    return null\n  })\n  const fieldProps = computed(() => ({\n    value: value.value,\n    onInput: (e) => (value.value = e.target.value),\n    onBlur: () => (touched.value = true),\n  }))\n  return { value, touched, error, fieldProps }\n}',
      explanation: [
        'A real form library exposes validation/state logic without forcing any input markup.',
        'fieldProps is a computed prop bag the consumer binds to their own <input> via v-bind.',
        'error recomputes from the rules whenever value changes — pure behaviour, no UI.',
        'The same useField drives a text input, a textarea, or a custom widget.',
        'This is the production shape of headless logic: composables returning reactive state plus bindable prop bags.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a headless (renderless) component?',
      answer: 'A component that owns behaviour and state but renders no specific UI, exposing its state and actions to the consumer (via a scoped slot or composable) so the consumer controls all markup.',
      explanation: 'A good answer stresses "logic, not looks" and names scoped slots or composables as the delivery mechanism.',
    },
    {
      level: 'beginner',
      question: 'How does a renderless component pass its state to the consumer?',
      answer: 'Through a scoped slot: it renders <slot :state="..." :action="..."/> and the consumer destructures those slot props in v-slot to wire up their own template.',
      explanation: 'Tests understanding that scoped slots are how parent state reaches consumer markup.',
    },
    {
      level: 'intermediate',
      question: 'When would you use a composable instead of a renderless component?',
      answer: 'When you only need to share logic and do not need a component/render boundary. A composable is lighter, has no slot indirection, and composes freely. Use a renderless component when you specifically want a template-level boundary or to ship behaviour to non-setup consumers.',
      explanation: 'A senior signal is recognising that in Vue 3 composables are usually the better headless tool.',
    },
    {
      level: 'intermediate',
      question: 'What does it mean to "return prop bags" from a headless utility?',
      answer: 'The utility returns objects of attributes and handlers (e.g. triggerProps with aria-expanded and onClick) that the consumer spreads onto their own elements with v-bind, so accessibility and behaviour are reused without dictating markup.',
      explanation: 'Shows familiarity with the Headless UI / downshift-style API for keeping markup in the consumer\'s hands.',
    },
    {
      level: 'advanced',
      question: 'What are the downsides of headless components?',
      answer: 'More boilerplate for consumers (they must write all markup and bindings), a steeper learning curve, easy to misuse accessibility bindings, and scoped-slot indirection that can hurt readability. They trade convenience for flexibility.',
      explanation: 'Senior answers weigh the cost: power and reuse versus consumer effort and potential a11y mistakes.',
    },
    {
      level: 'senior',
      question: 'How do headless components achieve reusable accessibility, and why is that valuable?',
      answer: 'By centralising aria attributes, roles, keyboard handlers, and focus management in the behaviour layer and exposing them as prop bags or slot props. Consumers spread these onto their markup, so every styling variant inherits correct, tested accessibility — a huge win because a11y is hard and error-prone to reimplement.',
      explanation: 'Demonstrates understanding that the real value of headless libraries is reusable, correct accessibility, not just state.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is a renderless component different from a compound component?',
    'Can a renderless component render zero wrapper elements? How?',
    'How do scoped slots and prop bags compare for exposing behaviour?',
    'Why might VueUse prefer composables over renderless components?',
    'How would you add keyboard navigation to a headless listbox?',
    'How do you test a headless component or composable in isolation?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Putting any styling or fixed markup inside the headless component.',
      why: 'It defeats the purpose — consumers can no longer fully control the look, breaking the headless contract.',
      fix: 'Render only the scoped slot (or nothing) and expose state/actions; keep all visuals in the consumer.',
    },
    {
      mistake: 'Forgetting to expose accessibility bindings, leaving each consumer to reinvent a11y.',
      why: 'The biggest value of headless is reusable, correct accessibility; omitting it pushes hard, error-prone work to every consumer.',
      fix: 'Return prop bags (aria-*, role, keyboard handlers) the consumer spreads onto elements.',
    },
    {
      mistake: 'Building a renderless component when a composable would be simpler.',
      why: 'The scoped-slot indirection adds a component instance and template noise for pure logic reuse.',
      fix: 'Default to a composable for logic-only sharing; use renderless when you genuinely need a template boundary.',
    },
    {
      mistake: 'Passing non-reactive snapshots through slot props.',
      why: 'The consumer template will not update when internal state changes.',
      fix: 'Pass refs/computed (reactive values) so the consumer\'s markup stays live.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Headless UI for Vue ships fully unstyled, accessible Menu/Listbox/Dialog/Combobox primitives so teams apply their own design system.' },
    { area: 'Vue', detail: 'VueUse exposes hundreds of behaviours (useMouse, useDraggable, useIntersectionObserver) as composables — the composable form of headless logic.' },
    { area: 'Nuxt', detail: 'useFetch/useAsyncData are headless data-fetching composables: they manage loading/error/data state while you render whatever you want.' },
    { area: 'SSR', detail: 'Composable-based headless logic is SSR-friendly; just guard browser-only APIs (document, window) behind onMounted or import.meta.client checks.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Composable-based headless logic adds no extra component instance or DOM node.',
      'Logic is written once and reused, avoiding duplicated reactive effects across the app.',
    ],
    bad: [
      'Renderless components add a component instance and scoped-slot function call per use.',
      'Passing a large reactive object through slot props can over-trigger consumer re-renders.',
    ],
    optimizations: [
      'Prefer composables over renderless components when no render boundary is needed.',
      'Expose focused refs/computed instead of one big reactive blob to limit re-render scope.',
      'Use computed for derived slot props/prop bags so they recompute only when inputs change.',
      'Clean up listeners and observers in onUnmounted to avoid leaks in long-lived apps.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['scoped-slots', 'composables', 'slots', 'render-functions'],
    nextConcepts: ['compound-components', 'render-props-vue', 'higher-order-components-vue', 'component-design-patterns'],
    dependencyNote:
      'Headless components are built on scoped slots and composables. They are the logic-vs-presentation sibling of compound components and the Vue analogue of render props. Understand scoped slots and composables first, then compare all three patterns.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the goal: separate BEHAVIOUR from MARKUP so one logic powers many looks.',
      'Draw the renderless component as a box containing state + actions, rendering only <slot :state :action/>.',
      'Draw an arrow from the slot to the consumer template, which renders any markup using the slot props.',
      'Beside it, draw the composable alternative: useToggle() returning { on, toggle }, called in the consumer\'s own setup.',
      'Conclude: "Composable is my default in Vue 3; renderless when I need a template boundary. The real prize is reusable accessibility via prop bags."',
    ],
    diagram: '  ┌─ <Toggle> renderless ─┐\n  │ on=ref, toggle()       │\n  │ render: slot({on,      │\n  │              toggle})  │\n  └──────────┬────────────┘\n             │ slot props (reactive)\n             ▼\n   consumer markup (free)\n   <button @click=toggle>{{on}}</button>\n\n   OR: const {on,toggle}=useToggle()  ← composable, no slot\n   logic ONCE ─► many designs + shared a11y prop bags',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A headless (renderless) component owns behaviour and state but renders no specific UI — it hands its state and actions to the consumer via a scoped slot (or via a composable) so the consumer builds any markup. One behaviour, many looks. The big payoff is reusable, correct accessibility shipped as prop bags the consumer spreads onto their elements. In Vue 3 a composable is usually the lighter headless tool; use a renderless component only when you need a template boundary. Keep zero styling inside, expose reactive values, and clean up listeners.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A headless, or renderless, component separates behaviour from presentation. It contains the logic and state for a feature — like a toggle, a dropdown, or a data fetcher — but it renders no opinionated UI of its own. Instead it exposes its state and actions to the consumer, classically through a scoped slot: the component renders <slot :state="..." :action="..."/> and the consumer destructures those slot props and writes whatever markup they want. So the same behaviour can power completely different designs across apps, because only the consumer\'s template changes. In Vue 3 there is a second, often better way to be headless: put the logic in a composable that returns reactive state and methods, and call it from the consumer\'s own setup. That avoids the scoped-slot indirection and the extra component instance, which is why VueUse and Nuxt\'s useFetch are essentially headless logic delivered as composables. The single most valuable thing headless components give you is reusable accessibility. Things like aria-expanded, roles, keyboard handling, and focus management are hard and error-prone, so libraries like Headless UI centralise them and expose prop bags — objects of attributes and handlers — that you spread onto your own elements with v-bind. Every styling variant then inherits correct, tested a11y for free. The trade-off is consumer effort: headless puts all the markup and bindings on the consumer, which is more boilerplate and a steeper learning curve than a ready-made styled component. So my rule is: composable by default for logic reuse, renderless component when I need a template boundary, and a styled component when convenience matters more than flexibility.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Flexibility vs convenience: headless gives total presentational control but demands more consumer code than a ready-styled component.',
      'Composable vs renderless: composables are lighter and compose freely; renderless components give a template boundary and work for slot-based composition.',
      'Prop bags vs slot props: prop bags (v-bind spreads) keep markup minimal and a11y reusable; slot props are more explicit but verbose.',
    ],
    edgeCases: [
      'A purely renderless component may render no wrapper DOM node by returning slot vnodes directly — but then it cannot host fallthrough attributes.',
      'Browser-only logic (focus, document listeners) must be guarded for SSR.',
      'Multiple consumers of one renderless instance via multiple named slots complicate the API.',
      'Keyboard navigation and focus trapping are subtle and must live in the behaviour layer to stay correct.',
    ],
    runtimeBehavior: [
      'Scoped slots are functions; the renderless component invokes them with its reactive API to produce the consumer\'s vnodes.',
      'Reactive slot props/prop bags drive normal track/trigger re-rendering in the consumer template.',
      'Composable logic runs inside the consumer\'s setup, sharing that instance\'s lifecycle and reactivity scope.',
    ],
    scalability: [
      'Composables scale best for large apps: no per-use instance overhead and trivial composition.',
      'Renderless components multiply instances if used heavily in lists — measure and prefer composables in hot paths.',
    ],
    productionConcerns: [
      'Accessibility correctness is the core deliverable — ship and test aria/keyboard/focus, do not leave it to consumers.',
      'Document the exposed API (slot props / returned values / prop bags) clearly, since consumers depend on it as a contract.',
      'Listener and observer cleanup in onUnmounted is essential to avoid leaks in long-lived SPAs.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Headless/renderless = behaviour + state, NO opinionated UI.',
    'Expose state/actions via scoped slot OR via a composable.',
    'One logic core powers many different designs.',
    'Real prize: reusable, correct accessibility (aria, keyboard, focus).',
    'Ship prop bags the consumer spreads with v-bind.',
    'Vue 3 default: composable for logic; renderless for a template boundary.',
    'Keep ZERO styling inside the headless layer.',
    'Pass reactive values (refs/computed), not snapshots.',
    'Headless UI = unstyled a11y primitives; VueUse = composable behaviours.',
    'Clean up listeners/observers in onUnmounted.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a renderless Toggle that exposes on and toggle via a scoped slot.',
      hint: 'Render a default slot passing the state and action as slot props.',
      solution: {
        lang: 'js',
        code: '// <script setup>\nimport { ref } from \'vue\'\nconst on = ref(false)\nconst toggle = () => (on.value = !on.value)\n// </script>\n// <template><slot :on="on" :toggle="toggle" /></template>',
        explanation: [
          'The component owns the state and action but renders no buttons.',
          'Consumers destructure { on, toggle } in v-slot and render any markup.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Convert that Toggle into a useToggle() composable.',
      hint: 'Return the reactive state and the action from a function.',
      solution: {
        lang: 'js',
        code: 'import { ref } from \'vue\'\nexport function useToggle(initial = false) {\n  const on = ref(initial)\n  const toggle = () => (on.value = !on.value)\n  return { on, toggle }\n}\n// usage: const { on, toggle } = useToggle()',
        explanation: [
          'Same behaviour with no component instance or slot indirection.',
          'The consumer calls it in setup and renders whatever they want.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a useDisclosure() that exposes open state plus a triggerProps bag with aria-expanded and an onClick handler.',
      hint: 'Return a computed prop bag the consumer spreads with v-bind.',
      solution: {
        lang: 'js',
        code: 'import { ref, computed } from \'vue\'\nexport function useDisclosure() {\n  const open = ref(false)\n  const toggle = () => (open.value = !open.value)\n  const triggerProps = computed(() => ({\n    \'aria-expanded\': open.value,\n    onClick: toggle,\n  }))\n  return { open, toggle, triggerProps }\n}\n// <button v-bind="triggerProps">Menu</button>',
        explanation: [
          'triggerProps is a reactive prop bag bound to the consumer\'s own button.',
          'Accessibility (aria-expanded) and behaviour (onClick) are reused without dictating markup.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and implement how a headless listbox would reuse keyboard navigation. Show the core composable skeleton.',
      hint: 'Track active index and handle ArrowUp/ArrowDown/Enter in a keydown handler returned as a prop bag.',
      solution: {
        lang: 'js',
        code: 'import { ref, computed } from \'vue\'\nexport function useListbox(items) {\n  const active = ref(0)\n  const selected = ref(null)\n  const onKeydown = (e) => {\n    if (e.key === \'ArrowDown\') active.value = (active.value + 1) % items.length\n    else if (e.key === \'ArrowUp\') active.value = (active.value - 1 + items.length) % items.length\n    else if (e.key === \'Enter\') selected.value = items[active.value]\n  }\n  const listProps = computed(() => ({ role: \'listbox\', tabindex: 0, onKeydown }))\n  return { active, selected, listProps }\n}',
        explanation: [
          'Keyboard navigation lives once in the composable and is reused by every consumer.',
          'listProps carries role and the keydown handler; the consumer spreads it and renders any option markup, inheriting correct a11y.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Headless components are the cutting edge of Vue API design and the foundation of modern libraries like Headless UI and VueUse. Discussing them well shows you understand scoped slots, composables, accessibility reuse, and the flexibility-versus-convenience trade-off — strong senior signals.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely ask this directly. Product companies (Zoho, Flipkart, Razorpay) ask you to design a reusable, unstyled behaviour like a dropdown or fetcher and to compare renderless vs composable. FAANG-level rounds probe reusable accessibility, prop bags, keyboard navigation, and SSR considerations.',
    whatInterviewersExpect:
      'They expect the behaviour-without-markup definition, a scoped-slot or composable implementation, the insight that composables are often the better headless tool in Vue 3, and recognition that reusable accessibility is the pattern\'s biggest payoff.',
  },
}

export default headlessComponents
