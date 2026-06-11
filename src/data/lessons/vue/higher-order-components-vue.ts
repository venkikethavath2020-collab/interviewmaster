import type { ConceptLesson } from '../../../types/lesson'

const higherOrderComponentsVue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'higher-order-components-vue',
  name: 'Higher-Order Components',
  category: 'patterns',
  difficulty: 'advanced',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'A Higher-Order Component (HOC) is a function that takes a component and returns a new component with extra behaviour wrapped around it — the classic "decorator" for UI.',
    'It teaches you to think about components as values you can transform, which is the doorway to render functions, composition, and meta-programming in Vue.',
    'Knowing HOCs lets you read legacy Vue 2 code and many UI libraries that still ship withXxx() wrappers (withRouter-style helpers, analytics wrappers, permission gates).',
    'Interviewers use it to test whether you understand that in Vue 3 composables usually REPLACE the HOC pattern — being able to say why is a senior signal.',
    'When you genuinely need to inject props, wrap markup, or intercept lifecycle for an arbitrary child, the HOC is still the right tool — and doing it wrong leaks props and breaks refs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Higher-Order Component is like a gift-wrapping machine: you feed in any toy, and it hands you back the same toy inside a fancy box.',
    story: [
      'Imagine a machine at a shop. You put any toy into it — a car, a doll, a ball.',
      'The machine does not change the toy. Instead it wraps the toy in a nice box, adds a ribbon, and maybe slips a thank-you card inside.',
      'What comes out is still your toy, but now it has extra things around it that you did not have to add yourself.',
      'A Higher-Order Component is that machine for screens: you give it a component, and it gives you back the same component wrapped with extra powers like "show a loading spinner first" or "only show this if you are logged in".',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue, a component is just an object (or a function) that describes a piece of screen. Because it is a value, you can pass it into another function.',
    'A Higher-Order Component is a function whose input is a component and whose output is a brand-new component. The new one usually renders the original one inside it.',
    'The wrapper can add shared behaviour — fetching data, checking permissions, logging — so you do not repeat that code in every component.',
    'Think of it like a function that takes a recipe and returns a new recipe that is the same dish but always served with a side salad you did not have to cook.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A Higher-Order Component (HOC) is a function that accepts a Vue component and returns a new wrapper component which renders the original while adding props, state, or behaviour around it.',
    how: 'You define a function that returns a component (often via h() in a render/setup function). Inside, you render the wrapped component with extra props, and you forward the rest of the incoming props, slots, and attributes so the wrapper is transparent.',
    why: 'It centralises cross-cutting concerns (loading states, auth gates, analytics) so many components can share them without duplicating code. In Vue 3 you will often prefer a composable, but the HOC still fits when you must wrap arbitrary markup.',
    code: {
      label: 'A withLoading HOC',
      lang: 'js',
      code: 'import { h, ref } from \'vue\'\n\nfunction withLoading(WrappedComponent) {\n  return {\n    name: \'WithLoading\',\n    setup(props, { attrs, slots }) {\n      const isLoading = ref(false)\n      // ...toggle isLoading around some async work...\n      return () =>\n        isLoading.value\n          ? h(\'div\', \'Loading...\')\n          : h(WrappedComponent, { ...attrs }, slots)\n    },\n  }\n}\n\nconst UserCardWithLoading = withLoading(UserCard)',
      explanation: [
        'withLoading is a plain function: its argument is a component, its return value is a new component object.',
        'The wrapper owns isLoading state and decides whether to show a spinner or the real component.',
        'When ready it renders WrappedComponent via h(), forwarding attrs and slots so the wrapper stays transparent.',
        'UserCardWithLoading can now be used anywhere UserCard could, but it shows a spinner during loading.',
        'No UserCard code changed — the behaviour was added from the outside.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A Higher-Order Component is a higher-order function in the component domain: HOC(Component) -> Component. It returns a new component definition whose render output composes the wrapped component, injecting additional props or behaviour and forwarding the remaining props, slots, and fallthrough attributes. In Vue 3 the render typically uses the h() function inside setup() or a render function, and the pattern is largely superseded by composables for logic reuse, remaining useful only when you must wrap markup/structure rather than share logic.',

  // 7. Internal Working
  internalWorking: [
    'The HOC factory function runs at module/definition time and produces a new component options object (or functional component) — it does not run per render.',
    'When Vue mounts the wrapper, it instantiates the wrapper component; the wrapper\'s setup/render then calls h(WrappedComponent, props, slots), creating a vnode for the inner component as a child.',
    'Vue\'s renderer patches the wrapper vnode, sees the child component vnode, and mounts the wrapped component instance beneath it — so the DOM has the wrapped component nested inside whatever the wrapper renders.',
    'Props passed to the wrapper land in attrs unless declared; the HOC must spread {...attrs} onto the inner h() call to forward fallthrough attributes, otherwise they are dropped or land on the wrong element.',
    'Slots received by the wrapper must be explicitly passed as the third argument to h() so the inner component still receives default and named slots.',
    'Template refs and the inner instance are NOT automatically exposed through the wrapper — the wrapper instance is what a parent ref points to, so deep access requires expose() or forwarding a ref prop.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: 'withLogging(  UserCard  )  ──returns──►  WrappedComponent\n      │              │                              │\n      │ HOC factory  │ original component            │ new component\n      ▼              ▼                              ▼\n  ┌──────────────────────────────────────────────────────┐\n  │  <WithLogging>            (wrapper instance)           │\n  │    setup(): add logging / state                       │\n  │    render(): h(UserCard, { ...attrs }, slots) ───┐    │\n  │  ┌───────────────────────────────────────────┐   │    │\n  │  │   <UserCard>   (wrapped instance)           │◄──┘    │\n  │  │     receives forwarded props + slots        │        │\n  │  └───────────────────────────────────────────┘        │\n  └──────────────────────────────────────────────────────┘\n     props/attrs/slots flow DOWN, events bubble UP through forwarding',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — withDefaultProps',
      lang: 'js',
      code: 'import { h } from \'vue\'\n\nfunction withDefaultProps(Wrapped, defaults) {\n  return {\n    name: \'WithDefaults\',\n    setup(_, { attrs, slots }) {\n      return () => h(Wrapped, { ...defaults, ...attrs }, slots)\n    },\n  }\n}\n\nconst PrimaryButton = withDefaultProps(BaseButton, { variant: \'primary\' })',
      explanation: [
        'The HOC pre-fills a prop so callers do not have to repeat variant="primary".',
        'attrs is spread AFTER defaults so a caller can still override the default.',
        'slots is forwarded so button content (the label) still renders.',
        'PrimaryButton behaves like BaseButton but with a baked-in default.',
      ],
    },
    intermediate: {
      label: 'Intermediate — withAuthGuard',
      lang: 'js',
      code: 'import { h } from \'vue\'\nimport { useAuth } from \'@/composables/useAuth\'\n\nfunction withAuthGuard(Wrapped) {\n  return {\n    name: \'WithAuthGuard\',\n    setup(props, { attrs, slots }) {\n      const { isLoggedIn } = useAuth()\n      return () =>\n        isLoggedIn.value\n          ? h(Wrapped, { ...attrs }, slots)\n          : h(\'p\', \'Please log in to continue.\')\n    },\n  }\n}\n\nconst ProtectedDashboard = withAuthGuard(Dashboard)',
      explanation: [
        'The HOC reads auth state from a composable and decides whether to render the wrapped component.',
        'If logged out it short-circuits to a fallback message; the wrapped component never mounts.',
        'Notice the HOC itself uses a composable internally — composables and HOCs are not mutually exclusive.',
        'Any component can be protected by wrapping it, with zero changes to the component.',
      ],
    },
    advanced: {
      label: 'Advanced — forwarding refs through the wrapper',
      lang: 'js',
      code: 'import { h, ref } from \'vue\'\n\nfunction withTracking(Wrapped) {\n  return {\n    name: \'WithTracking\',\n    setup(props, { attrs, slots, expose }) {\n      const innerRef = ref(null)\n      // re-expose the inner instance so parent refs reach the real component\n      expose({ getInner: () => innerRef.value })\n      const onClickCapture = () => console.log(\'tracked click\')\n      return () =>\n        h(Wrapped, { ref: innerRef, onClickCapture, ...attrs }, slots)\n    },\n  }\n}',
      explanation: [
        'Because a parent ref points at the WRAPPER, the inner instance is hidden by default.',
        'The HOC keeps innerRef and uses expose() to re-publish access to the wrapped instance.',
        'It also injects a tracking handler while still forwarding attrs and slots.',
        'This solves the classic HOC pitfall: refs and methods silently breaking after wrapping.',
        'In Vue 3 you would usually prefer a composable to avoid this complexity entirely.',
      ],
    },
    realProject: {
      label: 'Real project — withErrorBoundary in an admin app',
      lang: 'js',
      code: 'import { h, ref, onErrorCaptured } from \'vue\'\n\nexport function withErrorBoundary(Wrapped, Fallback) {\n  return {\n    name: \'WithErrorBoundary\',\n    setup(_, { attrs, slots }) {\n      const error = ref(null)\n      onErrorCaptured((err) => {\n        error.value = err\n        return false // stop propagation\n      })\n      return () =>\n        error.value\n          ? h(Fallback, { error: error.value })\n          : h(Wrapped, { ...attrs }, slots)\n    },\n  }\n}\n\n// const SafeChart = withErrorBoundary(RevenueChart, ChartErrorFallback)',
      explanation: [
        'A real admin dashboard wraps risky widgets so one crashing chart does not blank the whole page.',
        'onErrorCaptured catches errors thrown by the wrapped subtree and stores them.',
        'Returning false stops the error from bubbling further up to global handlers.',
        'When an error exists the HOC renders a fallback widget instead of the broken one.',
        'This is one case where a wrapper component genuinely beats a composable, since error capture needs a component boundary.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a Higher-Order Component?',
      answer: 'A function that takes a component as input and returns a new component that wraps the original, adding extra props, state, or behaviour while forwarding the rest.',
      explanation: 'The key phrase is component-in, component-out. A good answer gives one example like withLoading or withAuthGuard.',
    },
    {
      level: 'beginner',
      question: 'How is a HOC different from a normal component?',
      answer: 'A normal component renders UI directly. A HOC is a factory function that returns a component; it is one level of abstraction higher because it operates on components rather than producing markup on its own.',
      explanation: 'Tests whether the candidate understands "higher-order" means operating on functions/components as values.',
    },
    {
      level: 'intermediate',
      question: 'In Vue 3, why do composables usually replace HOCs?',
      answer: 'Composables share stateful logic via plain function calls inside setup(), without adding wrapper components. That avoids wrapper-hell in the component tree, prop/attr forwarding bugs, and broken refs — the main HOC pain points.',
      explanation: 'A senior signal is naming the concrete costs HOCs introduce that composables avoid.',
    },
    {
      level: 'intermediate',
      question: 'What must a HOC do to stay "transparent" to its wrapped component?',
      answer: 'Forward fallthrough attributes (spread attrs), pass slots through as the third h() argument, and re-emit or forward events. Otherwise props land in the wrong place, content disappears, and listeners break.',
      explanation: 'Shows awareness of attribute fallthrough and slot forwarding mechanics.',
    },
    {
      level: 'advanced',
      question: 'Why do template refs break when you wrap a component in a HOC, and how do you fix it?',
      answer: 'A parent ref resolves to the wrapper instance, not the inner component, so methods/data the parent expected are missing. Fix by keeping an internal ref to the wrapped instance and using expose() to re-publish the needed API, or forward a ref prop.',
      explanation: 'This is the classic HOC bug and demonstrates understanding of how refs resolve to component instances.',
    },
    {
      level: 'senior',
      question: 'When would you still choose a HOC over a composable in a modern Vue 3 codebase?',
      answer: 'When the concern needs a component boundary or wraps markup/structure rather than logic — e.g. error boundaries (onErrorCaptured), Suspense-style fallbacks, layout wrappers, or integrating a third-party component you cannot edit.',
      explanation: 'Senior answers acknowledge composables are the default but identify the genuine remaining niches for wrapper components.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you compose two HOCs together (withAuth(withLoading(Comp)))?',
    'What is the difference between a HOC and a renderless/headless component?',
    'How do scoped slots overlap with HOCs for sharing behaviour?',
    'Why are functional components a natural fit for simple HOCs?',
    'How does provide/inject interact with a wrapper component in the tree?',
    'Can a composable fully replace withErrorBoundary? Why or why not?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting to forward attrs and slots to the wrapped component.',
      why: 'The wrapped component loses its content (slots) and fallthrough props (class, id, listeners) land on the wrong element or vanish.',
      fix: 'Always spread {...attrs} onto the inner h() call and pass slots as the third argument.',
    },
    {
      mistake: 'Expecting parent template refs to reach the wrapped component.',
      why: 'A ref resolves to the wrapper instance, hiding the inner component\'s methods and exposed data.',
      fix: 'Hold an internal ref to the wrapped instance and re-publish needed members with expose(), or forward a ref prop.',
    },
    {
      mistake: 'Reaching for a HOC when a composable would do.',
      why: 'It adds an extra wrapper component, deepens the tree, and reintroduces prop/ref forwarding problems for no benefit.',
      fix: 'For pure logic reuse use a composable; reserve HOCs for cases needing a real component boundary or markup wrapping.',
    },
    {
      mistake: 'Creating the HOC inside render/setup so it rebuilds on every render.',
      why: 'A fresh component identity each render forces full remounts, losing state and hurting performance.',
      fix: 'Call the HOC factory once at module scope (or computed/cached) so the wrapped component identity is stable.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Error boundaries and analytics wrappers are implemented as HOCs because they need a component boundary (onErrorCaptured) that a composable cannot provide.' },
    { area: 'Component library', detail: 'Libraries ship withXxx() helpers to pre-configure variants of base components, or to add theming/RTL wrappers around primitives without editing them.' },
    { area: 'Nuxt', detail: 'Layout and middleware-style wrappers historically used HOC patterns; modern Nuxt prefers composables (useFetch, useState) and layouts, illustrating the migration away from HOCs.' },
    { area: 'Pinia', detail: 'Rarely uses HOCs directly, but a withStore-style wrapper can inject a store into a third-party component you cannot modify to call useStore() itself.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'A HOC adds only one lightweight wrapper component; for occasional wrapping the overhead is negligible.',
      'Functional HOCs (stateless wrappers) have minimal instance overhead and patch quickly.',
    ],
    bad: [
      'Stacking many HOCs deepens the component tree, adding instances, patch work, and harder-to-read devtools output.',
      'Recreating the HOC per render causes remounts and destroys child state.',
    ],
    optimizations: [
      'Build the wrapped component once at module scope so its identity is stable across renders.',
      'Prefer composables for logic-only reuse to avoid extra component instances entirely.',
      'Use functional/stateless wrappers when the HOC holds no state of its own.',
      'Avoid HOC chains more than two deep; flatten by combining concerns into one wrapper or a composable.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['render-functions', 'components-basics', 'attribute-fallthrough', 'slots'],
    nextConcepts: ['headless-components', 'render-props-vue', 'composables', 'compound-components'],
    dependencyNote:
      'HOCs build on render functions and component fundamentals (props, slots, attribute fallthrough). They sit alongside headless and render-props patterns, and in Vue 3 they are largely replaced by composables for logic reuse — understanding both is what makes the comparison an interview favourite.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the signature on the board: HOC(Component) -> Component.',
      'Draw an arrow: feed UserCard into withLoading(), out comes UserCardWithLoading.',
      'Sketch the wrapper box containing the wrapped box, with props/slots arrows flowing down into it.',
      'Mark the two danger points: attrs/slots must be forwarded, and refs resolve to the wrapper.',
      'Conclude: "In Vue 3 I would reach for a composable first; I keep HOCs for things needing a real component boundary like error boundaries."',
    ],
    diagram: '   UserCard ──► [ withLoading() ] ──► UserCardWithLoading\n                                          │\n              ┌───────────────────────────┘\n              ▼\n        ┌───────────────┐\n        │  wrapper       │  (owns isLoading)\n        │  ┌──────────┐  │\n        │  │ UserCard │  │ ◄── forward attrs + slots\n        │  └──────────┘  │\n        └───────────────┘\n   parent ref → wrapper (NOT UserCard) → use expose()',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A Higher-Order Component is a function that takes a component and returns a new component wrapping it with extra props, state, or behaviour — component-in, component-out. You render the inner component with h() and must forward attrs and slots to stay transparent. The classic pitfalls are dropped slots/attrs and broken refs (a ref hits the wrapper, fix with expose). In Vue 3 composables replace HOCs for logic reuse; keep HOCs only when you need a real component boundary like an error boundary or to wrap markup.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A Higher-Order Component, or HOC, is a higher-order function in the component world: its input is a component and its output is a brand-new component that wraps the original. The wrapper renders the inner component, usually via the h() render function, and adds something around it — a loading spinner, an auth check, analytics, or an error boundary. The original component is never modified; the behaviour is added from the outside, which makes it great for cross-cutting concerns. To stay transparent, the HOC must forward fallthrough attributes by spreading attrs, pass slots through as the third h() argument, and forward events, otherwise content disappears and listeners break. A subtle pitfall is that a parent template ref resolves to the wrapper instance, not the wrapped component, so methods the parent expected go missing; you fix that by keeping an internal ref and re-publishing the API with expose(). In Vue 3, though, composables have largely replaced HOCs for sharing logic, because a composable is just a function you call in setup() — no extra wrapper components, no prop forwarding, no ref problems. So my default is a composable. I keep the HOC pattern for the cases that genuinely need a component boundary, like an error boundary using onErrorCaptured, or when I have to wrap a third-party component I cannot edit. That trade-off — composable by default, HOC for boundary cases — is the answer I give.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'HOC vs composable: HOCs add a component boundary (useful for error capture/layout) but cost wrapper depth and forwarding complexity; composables are lighter but cannot create a render boundary.',
      'Transparency vs explicitness: forwarding everything makes the wrapper invisible but hides where props actually go, complicating debugging in devtools.',
      'Reusability vs indirection: deep HOC chains maximise reuse but make the rendered tree hard to follow and slow to reason about.',
    ],
    edgeCases: [
      'Refs from a parent resolve to the wrapper, breaking method access unless expose() re-publishes the inner API.',
      'Named slots and scoped slots must be forwarded deliberately; default-only forwarding silently drops them.',
      'Provide/inject still works through wrappers, but a wrapper that itself provides can unexpectedly shadow ancestor values.',
      'v-model on the wrapper needs explicit modelValue/update:modelValue forwarding or it stops working.',
    ],
    runtimeBehavior: [
      'The HOC factory runs once at definition time; per-render it just produces vnodes for the wrapper and inner component.',
      'Each HOC layer is a real component instance with its own lifecycle, so onMounted fires per layer.',
      'Fallthrough attributes flow through attrs and require manual spreading because the wrapper declares no props.',
    ],
    scalability: [
      'Chaining HOCs scales poorly: each layer adds instances and patch work, and devtools/stack traces get noisy.',
      'For large apps, standardise on composables for logic and reserve a small set of named HOCs for boundaries to keep the tree shallow.',
    ],
    productionConcerns: [
      'Broken refs after wrapping cause subtle bugs where parent calls a method that no longer exists — guard with expose() and tests.',
      'displayName/name on the wrapper matters for devtools and error messages; always set a clear name.',
      'Re-creating HOCs per render is a real performance footgun that remounts subtrees and loses state.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'HOC = function(Component) -> Component.',
    'Wrapper renders the inner component via h() and adds behaviour around it.',
    'Always forward attrs: h(Wrapped, { ...attrs }, slots).',
    'Pass slots as the third h() argument or content disappears.',
    'Parent refs hit the WRAPPER — re-publish with expose().',
    'Build the HOC once at module scope, never inside render.',
    'Vue 3 default: use a composable for logic reuse instead.',
    'Keep HOCs for component boundaries: error boundary, layout, 3rd-party wrap.',
    'Set a clear name for devtools and error messages.',
    'Compose carefully: deep HOC chains hurt readability and perf.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a withDefaultClass(Comp, className) HOC that always adds a CSS class to the wrapped component.',
      hint: 'Spread attrs and add a class entry on the h() props object.',
      solution: {
        lang: 'js',
        code: 'import { h } from \'vue\'\n\nfunction withDefaultClass(Comp, className) {\n  return {\n    name: \'WithDefaultClass\',\n    setup(_, { attrs, slots }) {\n      return () => h(Comp, { class: className, ...attrs }, slots)\n    },\n  }\n}',
        explanation: [
          'The class entry is merged with any class the caller passes via attrs.',
          'slots are forwarded so the wrapped content still renders.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write withLoading(Comp) that shows a spinner while an injected `loading` prop is true.',
      hint: 'Declare a loading prop and branch in the render function.',
      solution: {
        lang: 'js',
        code: 'import { h } from \'vue\'\n\nfunction withLoading(Comp) {\n  return {\n    name: \'WithLoading\',\n    props: { loading: Boolean },\n    setup(props, { attrs, slots }) {\n      return () =>\n        props.loading\n          ? h(\'div\', { class: \'spinner\' }, \'Loading...\')\n          : h(Comp, { ...attrs }, slots)\n    },\n  }\n}',
        explanation: [
          'Declaring loading as a prop removes it from attrs so it is not forwarded by accident.',
          'When loading is false the wrapped component renders with forwarded attrs and slots.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write withRef(Comp) that lets a parent reach the wrapped instance through the wrapper using expose().',
      hint: 'Keep an internal ref on the inner component and expose a getter.',
      solution: {
        lang: 'js',
        code: 'import { h, ref } from \'vue\'\n\nfunction withRef(Comp) {\n  return {\n    name: \'WithRef\',\n    setup(_, { attrs, slots, expose }) {\n      const inner = ref(null)\n      expose({ inner })\n      return () => h(Comp, { ref: inner, ...attrs }, slots)\n    },\n  }\n}\n// parent: wrapperRef.value.inner -> the real Comp instance',
        explanation: [
          'A parent ref normally stops at the wrapper; expose re-publishes the inner ref.',
          'The parent reads wrapperRef.value.inner to call methods on the wrapped component.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Refactor a withMousePosition HOC into a useMousePosition composable, and explain when you would still keep the HOC.',
      hint: 'Move the state and event listeners into a function returning reactive refs.',
      solution: {
        lang: 'js',
        code: 'import { ref, onMounted, onUnmounted } from \'vue\'\n\nexport function useMousePosition() {\n  const x = ref(0)\n  const y = ref(0)\n  const update = (e) => { x.value = e.pageX; y.value = e.pageY }\n  onMounted(() => window.addEventListener(\'mousemove\', update))\n  onUnmounted(() => window.removeEventListener(\'mousemove\', update))\n  return { x, y }\n}\n// Usage in any setup(): const { x, y } = useMousePosition()',
        explanation: [
          'The composable shares the exact same logic with no wrapper component, no forwarding, no ref issues.',
          'You would keep a HOC only if you needed a component boundary (e.g. wrapping a third-party component that cannot call the composable itself, or adding an error boundary).',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'HOCs prove you can treat components as values and reason about composition — and explaining why Vue 3 prefers composables shows you understand the framework\'s evolution, not just its syntax. That contrast is exactly what separates a candidate who memorised patterns from one who understands trade-offs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely go past "what is a HOC". Product companies (Zoho, Flipkart, Razorpay) ask you to write withLoading/withAuth and to compare HOCs vs composables. FAANG-level rounds probe ref forwarding, slot/attr transparency, and when a component boundary is genuinely required.',
    whatInterviewersExpect:
      'They expect the component-in/component-out definition, a working example with attrs and slots forwarded, awareness of the ref pitfall and its expose() fix, and a clear statement that composables are the Vue 3 default with HOCs reserved for boundary cases.',
  },
}

export default higherOrderComponentsVue
