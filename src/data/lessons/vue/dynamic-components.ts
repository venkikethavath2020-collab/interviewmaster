import type { ConceptLesson } from '../../../types/lesson'

const dynamicComponents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'dynamic-components',
  name: 'Dynamic Components',
  category: 'components',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Dynamic components let you swap which component renders at a single mount point at runtime — the backbone of tabs, wizards, dashboards, and CMS-driven layouts.',
    'Without them you would write long chains of v-if/v-else-if to pick a component, which is brittle and does not scale as variants grow.',
    'They pair with <KeepAlive> to preserve the state of inactive views (a half-filled form, scroll position) — a feature interviewers love to probe.',
    'Server-driven UI (render whatever component the backend names) is impossible to do cleanly without the <component :is> mechanism.',
    'Knowing when :is takes a component object vs a string vs an HTML tag separates people who copied a snippet from people who understand the render system.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A dynamic component is a picture frame where you can slide in a different photo whenever you like.',
    story: [
      'Imagine a single empty picture frame hanging on your wall. The frame never moves — it stays in exactly the same spot.',
      'But the photo inside it can change. In the morning you slide in a beach photo, in the afternoon a mountain photo, at night a photo of your dog.',
      'The wall and the frame stay the same; only what is shown inside changes depending on what you choose.',
      'Vue has a special frame called <component>. You tell it "is" — meaning "right now, be the beach photo" — and it shows that. Change your mind, say a different name, and the same frame instantly shows something else.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally in Vue you write a component by its tag, like <UserCard />, and that is fixed — it is always a UserCard.',
    'A dynamic component uses the built-in <component> element with an :is attribute, like <component :is="current" />, where current is a variable.',
    'When you change the value of current, Vue tears down the old component and builds the one you named instead, all at the same place in the page.',
    'It is the difference between a sign that always says "OPEN" and a digital screen that can show any message you send it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A dynamic component is rendered through Vue\'s built-in <component :is="..."> element, where the :is value decides which component (or HTML element) appears at that spot, and can change at runtime.',
    how: 'You bind :is to a variable holding either a registered component name (string), an imported component object, or an HTML tag name. When that variable changes, Vue swaps the rendered component, unmounting the old one and mounting the new one.',
    why: 'It lets you choose a component at runtime instead of hardcoding it — perfect for tabs, step wizards, and rendering different widgets from data without a giant v-if ladder.',
    code: {
      label: 'A simple tab switcher',
      lang: 'vue',
      code: '<script setup>\nimport { shallowRef } from \'vue\'\nimport Home from \'./Home.vue\'\nimport Profile from \'./Profile.vue\'\n\nconst tabs = { Home, Profile }\nconst current = shallowRef(Home)\n</script>\n\n<template>\n  <button @click="current = tabs.Home">Home</button>\n  <button @click="current = tabs.Profile">Profile</button>\n\n  <!-- The same mount point renders whichever component current holds -->\n  <component :is="current" />\n</template>',
      explanation: [
        '<component :is="current" /> is the single mount point that swaps its content.',
        'current holds an imported component object; clicking a button reassigns it.',
        'shallowRef is used (not ref) because we store a component object — we do not want Vue to deeply make it reactive.',
        'When current changes, Vue unmounts the previous component and mounts the new one in place.',
        'No v-if ladder needed — adding a third tab is just one more entry in the map.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A dynamic component is rendered via Vue\'s built-in <component> element bound with :is, whose value resolves to a component definition (an imported options/SFC object or a registered name string) or a native element tag. At runtime, Vue resolves :is to a vnode type; when the value changes, the diffing algorithm sees a different vnode type at that position and performs a full unmount of the old subtree and mount of the new one rather than an in-place patch. Wrapping it in <KeepAlive> caches deactivated instances instead of destroying them.',

  // 7. Internal Working
  internalWorking: [
    'During template compilation, <component :is="x" /> compiles to a createVNode call where the type argument is the dynamic expression x rather than a static component reference.',
    'On render, Vue evaluates :is. If it is a string, resolveDynamicComponent looks it up among registered components/directives or treats it as a native tag; if it is an object/function, it is used directly as the vnode type.',
    'A vnode is created with that resolved type. The patch algorithm compares the new vnode at this position with the previous one.',
    'Because vnodes are matched by type (and key), a changed :is produces a vnode of a different type, so isSameVNodeType returns false and Vue cannot patch in place.',
    'Vue therefore unmounts the old component instance (running its onBeforeUnmount/onUnmounted hooks and releasing its reactive effects) and mounts a fresh instance of the new component (running setup, onMounted, etc.).',
    'If a <KeepAlive> wraps the dynamic component, the deactivated instance is moved into a cache container instead of being unmounted, and onDeactivated/onActivated fire instead of unmount/mount on subsequent switches.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        current = Home                 current = Profile
        ───────────────                 ──────────────────
   <component :is="current" />      <component :is="current" />
            │                                  │
            ▼                                  ▼
   ┌──────────────────┐  reassign  ┌──────────────────┐
   │  <Home> instance │  ───────►  │ <Profile> instance│
   │  setup + mounted │  unmount   │  setup + mounted  │
   └──────────────────┘  old one   └──────────────────┘
        (destroyed)                    (freshly created)

   With <KeepAlive>: old instance is CACHED, not destroyed →
   onDeactivated instead of onUnmounted, state preserved.`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Without KeepAlive: each switch destroys the previous component instance — its reactive effects, watchers, and DOM are released and become eligible for GC. Only one instance exists at a time.',
    'With KeepAlive: deactivated instances are retained in an internal cache Map keyed by vnode key/type. They keep their reactive state and (detached) DOM in memory, so switching back is instant.',
    'KeepAlive\'s max prop bounds the cache using an LRU policy — the least recently used cached instance is evicted (truly unmounted) when the limit is exceeded, preventing unbounded memory growth.',
    'Storing the component object in a plain ref would make Vue try to deeply observe the component definition; shallowRef/markRaw keeps it as a raw reference, avoiding wasted memory and warnings.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — :is with a string name',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\n// Components registered globally or locally by name\nconst view = ref(\'h1\') // even a native tag works\n</script>\n\n<template>\n  <component :is="view">Hello dynamic world</component>\n  <button @click="view = view === \'h1\' ? \'h2\' : \'h1\'">Toggle heading</button>\n</template>',
      explanation: [
        ':is can be a plain string naming a registered component or a native HTML tag.',
        'Here it toggles between rendering an <h1> and an <h2> wrapper.',
        'String resolution goes through resolveDynamicComponent at render time.',
        'Slot content ("Hello dynamic world") is passed to whatever element/component is current.',
      ],
    },
    intermediate: {
      label: 'Intermediate — tabs driven by a map + KeepAlive',
      lang: 'vue',
      code: '<script setup>\nimport { shallowRef } from \'vue\'\nimport Overview from \'./Overview.vue\'\nimport Settings from \'./Settings.vue\'\nimport Billing from \'./Billing.vue\'\n\nconst tabs = { Overview, Settings, Billing }\nconst currentName = shallowRef(\'Overview\')\n</script>\n\n<template>\n  <nav>\n    <button v-for="(comp, name) in tabs" :key="name" @click="currentName = name">\n      {{ name }}\n    </button>\n  </nav>\n\n  <KeepAlive>\n    <component :is="tabs[currentName]" />\n  </KeepAlive>\n</template>',
      explanation: [
        'A tabs object maps names to component objects, so adding a tab is one entry.',
        'currentName drives which component tabs[currentName] resolves to.',
        '<KeepAlive> caches each tab so an in-progress form in Settings survives a trip to Billing.',
        'Buttons iterate the map with v-for, keeping markup DRY.',
        'shallowRef holds the active name (a string); the component objects themselves stay raw.',
      ],
    },
    advanced: {
      label: 'Advanced — server-driven widget renderer',
      lang: 'vue',
      code: '<script setup>\nimport { computed } from \'vue\'\nimport ChartWidget from \'./widgets/ChartWidget.vue\'\nimport TableWidget from \'./widgets/TableWidget.vue\'\nimport TextWidget from \'./widgets/TextWidget.vue\'\n\nconst registry = { chart: ChartWidget, table: TableWidget, text: TextWidget }\n\nconst props = defineProps({ block: { type: Object, required: true } })\n// block = { type: \'chart\', props: {...} } from an API\nconst resolved = computed(() => registry[props.block.type] ?? TextWidget)\n</script>\n\n<template>\n  <component :is="resolved" v-bind="block.props" />\n</template>',
      explanation: [
        'A registry maps backend "type" strings to real components — classic server-driven UI.',
        'computed resolves the component and falls back to TextWidget for unknown types (defensive).',
        'v-bind="block.props" forwards the backend-supplied props onto whichever component renders.',
        'This pattern powers CMS page builders and dashboard layouts defined entirely by data.',
        'Unknown types degrade gracefully instead of throwing, important for resilient SSR.',
      ],
    },
    realProject: {
      label: 'Real project — a multi-step checkout wizard',
      lang: 'vue',
      code: '<script setup>\nimport { shallowRef, computed } from \'vue\'\nimport CartStep from \'./steps/CartStep.vue\'\nimport ShippingStep from \'./steps/ShippingStep.vue\'\nimport PaymentStep from \'./steps/PaymentStep.vue\'\n\nconst steps = [CartStep, ShippingStep, PaymentStep]\nconst index = shallowRef(0)\nconst currentStep = computed(() => steps[index.value])\n\nfunction next() { if (index.value < steps.length - 1) index.value++ }\nfunction back() { if (index.value > 0) index.value-- }\n</script>\n\n<template>\n  <KeepAlive>\n    <component :is="currentStep" @next="next" @back="back" />\n  </KeepAlive>\n</template>',
      explanation: [
        'Each wizard step is its own component; an index selects the active one.',
        'KeepAlive preserves what the user typed in earlier steps when they go back and forth.',
        'Events emitted by the active step (@next/@back) drive navigation in the parent.',
        'This is the canonical real-world use: tabs and wizards share the exact same shape.',
        'A computed derives the current component, keeping the template clean and reactive.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the <component> element and what does :is do?',
      answer: '<component> is a built-in placeholder element; its :is attribute decides which component (or native element) renders there. Changing :is swaps the rendered component at the same spot in the DOM.',
      explanation: 'A solid answer notes that :is can take a component object, a registered name string, or an HTML tag, and that it is the standard alternative to a v-if ladder.',
    },
    {
      level: 'beginner',
      question: 'Why store the component in shallowRef or use markRaw instead of ref?',
      answer: 'Component definitions are plain objects/functions you never mutate. ref would deeply convert them to reactive proxies, wasting work and triggering a dev warning. shallowRef or markRaw keeps them as raw references.',
      explanation: 'Shows understanding that reactivity is for state, not for the component definition itself.',
    },
    {
      level: 'intermediate',
      question: 'What happens to the previous component when :is changes?',
      answer: 'Vue sees a vnode of a different type at that position, so it cannot patch in place — it fully unmounts the old instance (running unmount hooks, disposing effects) and mounts a fresh new instance.',
      explanation: 'The key concept is vnode type matching; a different type forces unmount + mount rather than a patch.',
    },
    {
      level: 'intermediate',
      question: 'How do you preserve the state of an inactive dynamic component?',
      answer: 'Wrap <component :is> in <KeepAlive>. Deactivated instances are cached instead of destroyed; onDeactivated/onActivated fire instead of unmount/mount, so state and DOM are preserved.',
      explanation: 'Mentioning include/exclude/max props and the LRU eviction shows depth.',
    },
    {
      level: 'advanced',
      question: 'How would you build a server-driven UI where the backend chooses the component?',
      answer: 'Keep a registry mapping type strings to imported components, resolve registry[type] (with a fallback for unknowns), and render <component :is="resolved" v-bind="props" />. Validate types and never feed untrusted strings as raw HTML.',
      explanation: 'Senior signal: a fallback for unknown types and awareness that arbitrary :is values are a controlled allowlist, not free-form.',
    },
    {
      level: 'senior',
      question: 'Why does using :key on a dynamic component sometimes matter?',
      answer: 'If two states resolve to the same component type but should be treated as distinct instances (e.g. editing different records), Vue would patch in place and reuse state. Adding a :key forces a fresh instance on key change, guaranteeing clean state.',
      explanation: 'Demonstrates understanding that vnode identity = type + key, and that reuse is sometimes a bug, not a feature.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does <component :is> differ from a chain of v-if/v-else-if?',
    'What does resolveDynamicComponent do when :is is a string?',
    'How do KeepAlive include/exclude/max props work, and what eviction policy is used?',
    'Can :is render a native HTML tag, and when is that useful?',
    'How do you pass props and listen to events on a dynamic component?',
    'When would you add a :key to <component :is> and why?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Storing the active component in a deep ref() instead of shallowRef/markRaw.',
      why: 'Vue tries to deeply proxy the component definition, wasting work and emitting a "reactive component" dev warning.',
      fix: 'Use shallowRef for the component object, or wrap it with markRaw; store only the selector (name/index) in a normal ref.',
    },
    {
      mistake: 'Expecting state to survive when switching dynamic components.',
      why: 'By default the old instance is unmounted and destroyed, so its local state is gone.',
      fix: 'Wrap with <KeepAlive> to cache deactivated instances and preserve their state.',
    },
    {
      mistake: 'Passing an unregistered string name to :is and getting a blank render.',
      why: 'String resolution only finds globally/locally registered components; an unknown name silently fails or renders a native tag.',
      fix: 'Bind to an imported component object via a registry map, or ensure the component is registered.',
    },
    {
      mistake: 'Feeding untrusted backend strings directly to :is for HTML tags.',
      why: 'It can resolve to unexpected elements and is fragile, and conflating it with rendering raw HTML invites XSS.',
      fix: 'Use an allowlist registry of known components; never derive raw markup from user input.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Tabbed interfaces, step wizards, and modal bodies all swap content with <component :is>, usually paired with <KeepAlive> to keep inactive views warm.' },
    { area: 'Component library', detail: 'Headless table/cell renderers accept a component per column and render it dynamically, letting consumers inject custom cell components by data type.' },
    { area: 'Nuxt', detail: 'CMS-driven pages map block "type" fields from the API to local components via a registry and render them with <component :is>, the foundation of page builders.' },
    { area: 'SSR', detail: 'Server-driven UI resolves component types on the server during render; a fallback component for unknown types keeps hydration safe and avoids mismatches.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Replaces deep v-if/v-else-if ladders with one mount point, reducing template complexity and compiled render size.',
      'With KeepAlive, switching back to a cached view is near-instant because no remount or re-fetch occurs.',
    ],
    bad: [
      'Without KeepAlive, every switch fully unmounts and remounts — re-running setup, re-fetching data, losing scroll/state.',
      'KeepAlive caches keep instances and their DOM in memory; an unbounded cache can grow large.',
    ],
    optimizations: [
      'Set <KeepAlive :max="n"> to bound the LRU cache and prevent unbounded memory use.',
      'Use include/exclude to cache only the heavy views worth keeping warm.',
      'Combine with async components (defineAsyncComponent) so each variant is code-split and loaded on demand.',
      'Add a :key only when you intentionally need a fresh instance, otherwise let Vue reuse where types match.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'component-registration', 'template-syntax'],
    nextConcepts: ['keepalive', 'async-components', 'slots', 'render-functions'],
    dependencyNote:
      'Dynamic components build directly on component basics and registration. They are the natural lead-in to <KeepAlive> (state preservation) and async components (code-split variants), and under the hood they are best understood through the virtual DOM and render functions.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw one fixed box on the page labelled <component :is="current" />.',
      'To the side, draw two component definitions: Home and Profile.',
      'Show a variable "current" with an arrow pointing to Home; the box renders Home.',
      'Reassign current to Profile (redraw the arrow); show the box now renders Profile, and the old Home instance crossed out (destroyed).',
      'Wrap the box in a dashed <KeepAlive> border and note: now the crossed-out instance is instead moved to a cache, state preserved.',
    ],
    diagram: `   current ──► Home          (reassign) current ──► Profile
        ┌───────────────┐                ┌───────────────┐
        │ <component    │   swap type    │ <component    │
        │   :is=current>│  ───────────►  │   :is=current>│
        └──────┬────────┘                └──────┬────────┘
               ▼                                ▼
          [Home inst]  ──unmount──►       [Profile inst] (new)
        (KeepAlive ⇒ cached, not destroyed)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Dynamic components use Vue\'s built-in <component :is="x"> to render whichever component x names — an imported object, a registered string, or a native tag. Changing x swaps the rendered component at the same spot: because the vnode type differs, Vue unmounts the old instance and mounts a new one. Store the component in shallowRef/markRaw, not a deep ref. Wrap in <KeepAlive> to cache inactive instances and preserve their state. It is the clean alternative to v-if ladders and the foundation of tabs, wizards, and server-driven UI.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A dynamic component is rendered through Vue\'s built-in <component> element with an :is binding. Instead of hardcoding a tag like <UserCard />, you write <component :is="current" /> where current is a value that decides what renders there. That value can be an imported component object, the string name of a registered component, or even a native HTML tag. When current changes, Vue evaluates :is, builds a vnode whose type is the resolved component, and compares it to the previous vnode at that position. Because the type is different, Vue can\'t patch in place — it fully unmounts the old instance, running its unmount hooks and disposing its effects, then mounts a fresh instance of the new one. That destroy-and-recreate is important: by default, local state of the previous view is lost. If you need to keep it — say a half-filled form in a tab — you wrap the dynamic component in <KeepAlive>, which caches deactivated instances instead of destroying them, firing onDeactivated and onActivated, and you can bound that cache with max plus include/exclude. One practical detail: store the component definition in shallowRef or markRaw, never a deep ref, because Vue would otherwise try to make the component object itself reactive. The big real-world uses are tabs, multi-step wizards, and server-driven UI where a backend names which widget to render through a registry map — always with a fallback for unknown types.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Dynamic <component :is> vs explicit v-if/v-else-if: :is scales better and is data-driven, but v-if can be clearer for two or three fixed branches and allows different prop shapes more explicitly.',
      'KeepAlive trades memory for speed and state preservation: great for heavy or stateful views, wasteful for trivial ones that are cheap to recreate.',
    ],
    edgeCases: [
      'Two states resolving to the same component type are patched in place (state reused) unless you add a :key to force a fresh instance.',
      'A string :is naming an unregistered component silently fails or falls back to a native tag, producing a confusing blank render.',
      'KeepAlive only caches direct children; conditional wrappers between KeepAlive and the dynamic component can break caching.',
      'Transitions around a dynamic component require <Transition mode="out-in"> to avoid both components animating simultaneously.',
    ],
    runtimeBehavior: [
      'resolveDynamicComponent runs each render for string :is; binding a component object skips resolution and is marginally faster.',
      'Switching without KeepAlive re-runs setup and lifecycle, re-triggering data fetches and resetting reactive state.',
      'With KeepAlive, the cache is an LRU keyed by vnode key/type; exceeding max evicts and truly unmounts the least recently used entry.',
    ],
    scalability: [
      'Registry-based rendering scales to dozens of widget types with one mount point; pair with defineAsyncComponent so each type is code-split.',
      'For large dashboards, bound KeepAlive caches and lazy-load rarely used variants to keep the initial bundle and memory footprint small.',
    ],
    productionConcerns: [
      'Server-driven :is must use an allowlist registry with a safe fallback; never derive components or HTML from raw user input.',
      'Watch memory when KeepAlive is unbounded — set max and exclude views holding large datasets.',
      'Coordinate dynamic components with transitions (out-in mode) and with router-view, which itself is a specialized dynamic component.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '<component :is="x" /> renders whatever x resolves to.',
    ':is accepts a component object, a registered name string, or a native tag.',
    'Changing :is => different vnode type => unmount old + mount new.',
    'Store component objects in shallowRef or markRaw, never deep ref().',
    'Wrap in <KeepAlive> to cache inactive instances and keep their state.',
    'KeepAlive props: include / exclude / max (LRU eviction).',
    'onDeactivated / onActivated fire under KeepAlive instead of unmount/mount.',
    'Add :key when same type must be a fresh instance.',
    'Registry map + :is = server-driven / CMS UI (with a fallback).',
    'Use <Transition mode="out-in"> when animating swaps.',
    'router-view is essentially a built-in dynamic component.',
    'Never feed untrusted strings as :is or as raw HTML.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Render an <h1> or a <p> dynamically based on a boolean, using <component :is>.',
      hint: ':is can be a native tag string; compute it from the boolean.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst big = ref(true)\nconst tag = computed(() => (big.value ? \'h1\' : \'p\'))\n</script>\n\n<template>\n  <component :is="tag">Resizable text</component>\n  <button @click="big = !big">Toggle</button>\n</template>',
        explanation: [
          ':is bound to a computed tag name switches between native elements.',
          'No component imports needed — native tags resolve directly.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a two-tab switcher from a {name: component} map without a v-if ladder.',
      hint: 'Iterate the map for buttons and bind :is to the selected component.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { shallowRef } from \'vue\'\nimport TabA from \'./TabA.vue\'\nimport TabB from \'./TabB.vue\'\nconst tabs = { TabA, TabB }\nconst active = shallowRef(\'TabA\')\n</script>\n\n<template>\n  <button v-for="(c, name) in tabs" :key="name" @click="active = name">{{ name }}</button>\n  <component :is="tabs[active]" />\n</template>',
        explanation: [
          'tabs maps names to component objects; active selects one.',
          'Buttons are generated by iterating the same map, keeping it DRY.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Preserve form state across tab switches and animate the swap.',
      hint: 'Combine <Transition mode="out-in"> with <KeepAlive>.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { shallowRef } from \'vue\'\nimport FormA from \'./FormA.vue\'\nimport FormB from \'./FormB.vue\'\nconst tabs = { FormA, FormB }\nconst active = shallowRef(\'FormA\')\n</script>\n\n<template>\n  <button v-for="(c, n) in tabs" :key="n" @click="active = n">{{ n }}</button>\n  <Transition mode="out-in" name="fade">\n    <KeepAlive>\n      <component :is="tabs[active]" />\n    </KeepAlive>\n  </Transition>\n</template>',
        explanation: [
          'KeepAlive caches each form so typed values survive a tab switch.',
          'Transition mode="out-in" animates the old out before the new in, avoiding overlap.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a server-driven block renderer: given { type, props } from an API, render the matching component with a safe fallback.',
      hint: 'Use a registry map and computed resolution; fall back when type is unknown.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { computed } from \'vue\'\nimport Chart from \'./Chart.vue\'\nimport Table from \'./Table.vue\'\nimport Unknown from \'./Unknown.vue\'\n\nconst registry = { chart: Chart, table: Table }\nconst props = defineProps({ block: { type: Object, required: true } })\nconst comp = computed(() => registry[props.block.type] ?? Unknown)\n</script>\n\n<template>\n  <component :is="comp" v-bind="block.props" />\n</template>',
        explanation: [
          'registry is an allowlist mapping API type strings to real components.',
          'Unknown types resolve to a safe fallback instead of crashing.',
          'v-bind forwards the API-provided props to whichever component renders.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Dynamic components are how real Vue apps build tabs, wizards, dashboards, and CMS-driven pages without unmaintainable v-if ladders. Mastering :is plus KeepAlive shows you understand Vue\'s render and lifecycle model, not just templates.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what does <component :is> do" and "how do tabs work." Product companies (Zoho, Flipkart, Razorpay) ask you to build a wizard that preserves state and to explain KeepAlive. FAANG-level interviews probe vnode type matching, why state is lost on swap, when a :key is needed, and how server-driven UI stays safe.',
    whatInterviewersExpect:
      'Define :is and the three value kinds it accepts, explain the unmount/mount-on-type-change behavior, reach for KeepAlive to preserve state (with max/include/exclude), use shallowRef/markRaw for component objects, and describe a real registry-driven use case with a safe fallback.',
  },
}

export default dynamicComponents
