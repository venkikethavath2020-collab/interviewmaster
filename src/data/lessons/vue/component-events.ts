import type { ConceptLesson } from '../../../types/lesson'

const componentEvents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'component-events',
  name: 'Component Events',
  category: 'components',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Events are how a child communicates back UP to its parent — the other half of Vue\'s data-flow loop (props down, events up).',
    'Without events, a child could never notify its parent of clicks, input, or state changes, and apps could not respond to user actions across components.',
    'Knowing emit, defineEmits, and the one-way-flow rationale is a guaranteed interview topic.',
    'Custom events are the foundation of v-model on components and of reusable, decoupled component design.',
    'Mishandling events (mutating props instead, wrong naming, payload mistakes) is a common source of bugs and tight coupling.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Emitting an event is like ringing a doorbell — you announce something happened, and whoever is listening decides what to do.',
    story: [
      'Imagine you are inside a house and you press the doorbell button. You do not open the door yourself — you just make the bell ring.',
      'The person inside hears the bell and decides whether to answer, ignore, or call out "coming!". You announced; they reacted.',
      'You can even leave a note with the bell, like "package delivered", so the listener knows extra details.',
      'A child component works the same way: it rings a bell (emits an event), maybe attaches a note (a payload), and the parent who is listening decides how to respond.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Props let a parent send data down to a child, but sometimes the child needs to tell the parent that something happened — a button was clicked, a value changed.',
    'The child does this by emitting a named event, optionally with extra data attached. It does not reach up and change the parent itself; it just announces.',
    'The parent listens for that event using @event-name and runs a handler. The parent decides what to do with the news.',
    'This keeps responsibility clear: the child announces, the parent owns the data and updates it. Data flows down, events flow up.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Component events are custom messages a child emits to notify its parent that something happened, optionally carrying a payload. The parent listens with v-on (@).',
    how: 'Declare events with defineEmits, then call the returned emit function with the event name and any arguments. The parent binds a handler with @event-name="handler".',
    why: 'Events complete unidirectional data flow: the child never mutates parent state directly; it emits, and the parent updates its own data. This keeps components decoupled and predictable.',
    code: {
      label: 'Emitting and listening to a custom event',
      lang: 'vue',
      code: '<!-- LikeButton.vue (child) -->\n<script setup>\nconst emit = defineEmits([\'like\'])\nfunction onClick() {\n  emit(\'like\', { at: Date.now() })\n}\n</script>\n<template>\n  <button @click="onClick">👍 Like</button>\n</template>\n\n<!-- Parent -->\n<script setup>\nimport LikeButton from \'./LikeButton.vue\'\nfunction handleLike(payload) {\n  console.log(\'liked at\', payload.at)\n}\n</script>\n<template>\n  <LikeButton @like="handleLike" />\n</template>',
      explanation: [
        'defineEmits([\'like\']) declares the events this component can emit.',
        'emit(\'like\', payload) fires the event with data attached.',
        'The parent listens with @like and receives the payload in its handler.',
        'The child never changes parent state — it just announces.',
        'This is "events up" completing the props-down/events-up loop.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Component events are a custom, one-way child-to-parent communication channel. A child declares its emittable events with defineEmits and dispatches them via the returned emit function, passing an event name and optional arguments (the payload). The parent subscribes with v-on (@) on the component tag; Vue maps the listener to the child instance so that emit invokes the parent\'s handler with the payload. Events do not bubble through the component tree by default and are the basis for v-model on components.',

  // 7. Internal Working
  internalWorking: [
    'defineEmits declares the events; in development Vue uses this to validate emitted names and (with the object/typed form) their payloads, warning on undeclared events.',
    'A parent listener like @like="handleLike" is compiled into an onLike prop passed to the child component vnode.',
    'When the child calls emit(\'like\', payload), Vue looks up the corresponding onLike handler in the instance\'s props and invokes it with the payload arguments.',
    'Because the listener is just a function prop, the call is a direct synchronous function invocation — there is no DOM-style bubbling through ancestor components.',
    'Event name casing is normalised: emit(\'updateValue\') maps to @update-value in templates, so the compiler matches the listener name accordingly.',
    'v-model on a component is sugar built on this: it passes a value prop plus an @update:modelValue listener that the child triggers via emit.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Parent (owns data, has handler)
   ┌──────────────────────────────┐
   │ @like="handleLike"           │  ← compiles to onLike prop
   └───────────────▲──────────────┘
                   │ invoke handler(payload)
                   │
   ┌───────────────┴──────────────┐
   │ Child                        │
   │  defineEmits(['like'])       │
   │  emit('like', payload) ──────┘  rings the bell UP
   └──────────────────────────────┘
   (no bubbling — direct handler call)`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — event with no payload',
      lang: 'vue',
      code: '<!-- CloseBtn.vue -->\n<script setup>\nconst emit = defineEmits([\'close\'])\n</script>\n<template>\n  <button @click="emit(\'close\')">×</button>\n</template>\n\n<!-- parent -->\n<CloseBtn @close="isOpen = false" />',
      explanation: [
        'The child declares and emits a `close` event with no data.',
        'emit can be called directly in the template handler.',
        'The parent listens with @close and runs an inline expression.',
        'No payload is needed — the event itself is the message.',
      ],
    },
    intermediate: {
      label: 'Intermediate — event with a payload',
      lang: 'vue',
      code: '<!-- SearchBox.vue -->\n<script setup>\nimport { ref } from \'vue\'\nconst query = ref(\'\')\nconst emit = defineEmits([\'search\'])\nfunction submit() {\n  emit(\'search\', query.value.trim())\n}\n</script>\n<template>\n  <form @submit.prevent="submit">\n    <input v-model="query" />\n    <button>Search</button>\n  </form>\n</template>\n\n<!-- parent -->\n<SearchBox @search="runSearch" />',
      explanation: [
        'The child collects input locally then emits `search` with the query string.',
        '@submit.prevent stops the native form reload before emitting.',
        'The parent receives the trimmed query in its runSearch handler.',
        'Child owns its input state; parent owns what to do with the result.',
      ],
    },
    advanced: {
      label: 'Advanced — typed events with validation (TypeScript)',
      lang: 'vue',
      code: '<script setup lang="ts">\nconst emit = defineEmits<{\n  submit: [payload: { email: string; remember: boolean }]\n  cancel: []\n}>()\nfunction onSubmit() {\n  emit(\'submit\', { email: \'a@b.com\', remember: true })\n}\n</script>\n<template>\n  <button @click="onSubmit">Submit</button>\n  <button @click="emit(\'cancel\')">Cancel</button>\n</template>',
      explanation: [
        'The type-only defineEmits declares each event and its tuple payload type.',
        '`submit` carries a typed object; `cancel` carries nothing.',
        'TypeScript flags any emit call with the wrong name or payload shape.',
        'Listeners in the parent are type-checked too.',
        'This is the modern, safest way to declare component events.',
      ],
    },
    realProject: {
      label: 'Real project — editable list row emitting update and delete',
      lang: 'vue',
      code: '<!-- TodoRow.vue -->\n<script setup lang="ts">\nconst props = defineProps<{ id: number; text: string; done: boolean }>()\nconst emit = defineEmits<{\n  toggle: [id: number]\n  remove: [id: number]\n}>()\n</script>\n<template>\n  <li :class="{ done: props.done }">\n    <input type="checkbox" :checked="props.done" @change="emit(\'toggle\', props.id)" />\n    {{ props.text }}\n    <button @click="emit(\'remove\', props.id)">Delete</button>\n  </li>\n</template>\n\n<!-- TodoList.vue (parent owns the array) -->\n<!-- @toggle="toggle" @remove="remove" -->',
      explanation: [
        'The row receives data via props and reports actions via typed events.',
        'It emits toggle and remove with the id — never mutating the parent\'s array.',
        'The parent (TodoList) owns the data and updates it on those events.',
        'This keeps the row reusable and fully decoupled from storage details.',
        'Standard real-world pattern: dumb row, smart list, events up.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How does a child component communicate with its parent?',
      answer: 'By emitting custom events with emit (declared via defineEmits); the parent listens with @event-name and runs a handler, optionally receiving a payload.',
      explanation: 'The phrase "events up" plus mentioning defineEmits/emit is the complete answer.',
    },
    {
      level: 'beginner',
      question: 'How does the parent listen for a custom event?',
      answer: 'With v-on or its @ shorthand on the component tag: @search="handler". The handler receives whatever the child passed to emit.',
      explanation: 'Tests the basic listener syntax and payload passing.',
    },
    {
      level: 'intermediate',
      question: 'Why emit an event instead of mutating a prop to update the parent?',
      answer: 'Props are one-way and read-only; mutating them breaks data flow and warns. Emitting lets the parent — the data owner — decide how to update its own state, keeping flow predictable and components decoupled.',
      explanation: 'The ownership/predictability reasoning is the key signal here.',
    },
    {
      level: 'intermediate',
      question: 'Do Vue component events bubble up through the tree like DOM events?',
      answer: 'No. Custom component events do not bubble; emit directly invokes the parent\'s listener (compiled to an on-prop). To pass an event further up you must re-emit at each level or use provide/inject or a store.',
      explanation: 'The no-bubbling fact distinguishes component events from native DOM events.',
    },
    {
      level: 'advanced',
      question: 'How do you type component events, and why does it help?',
      answer: 'Use type-only defineEmits with an object type mapping event names to payload tuples. It gives compile-time checking of both emit calls in the child and listeners in the parent, catching wrong names/payloads early.',
      explanation: 'Shows fluency with the modern typed emits API and its safety benefits.',
    },
    {
      level: 'senior',
      question: 'How does v-model on a component build on the events mechanism?',
      answer: 'v-model is sugar: it passes a modelValue prop and listens for an update:modelValue event. The child emits update:modelValue with the new value, and Vue assigns it back to the bound parent variable — a controlled prop+event pair.',
      explanation: 'Connecting v-model to the underlying prop/event pair is a senior-level insight.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between native DOM events and custom component events?',
    'How do you forward a native event from a component? (attribute fallthrough / explicit)',
    'How do you pass multiple arguments in an emit?',
    'How does event name casing map between emit and template listeners?',
    'How would you bubble an event multiple levels up? (re-emit / provide-inject / store)',
    'How does defineEmits validate events in development?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mutating a prop in the child to "tell" the parent about a change.',
      why: 'Props are read-only; this breaks one-way flow and the change may be overwritten on re-render.',
      fix: 'Emit an event with the new value and let the parent update its own state (or use v-model).',
    },
    {
      mistake: 'Expecting a custom event to bubble up multiple component levels automatically.',
      why: 'Component events do not bubble — emit only reaches the direct parent\'s listener.',
      fix: 'Re-emit at each level, or use provide/inject or a store for cross-level communication.',
    },
    {
      mistake: 'Not declaring events with defineEmits.',
      why: 'Undeclared events lose documentation and validation, and may collide with fallthrough attributes.',
      fix: 'Always declare emitted events; prefer the typed form in TypeScript.',
    },
    {
      mistake: 'Confusing event name casing (emitting updateValue but listening for @updateValue).',
      why: 'In DOM templates, emit(\'updateValue\') is listened to as @update-value (kebab-case).',
      fix: 'Use consistent casing; kebab-case listeners in templates map to camelCase emit names.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every interactive component (buttons, inputs, modals, list rows) reports user actions to parents via custom events.' },
    { area: 'Component library', detail: 'Library components expose a documented, typed event API (change, input, close, update:modelValue) as part of their contract.' },
    { area: 'Pinia', detail: 'Components often emit events that a parent handles by calling store actions, keeping the child decoupled from the store.' },
    { area: 'Nuxt', detail: 'Form and UI components emit events that pages handle to trigger navigation, fetches, or state updates.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Events are direct synchronous function calls — extremely cheap with no bubbling overhead.',
      'Decoupling via events lets Vue re-render only the component whose state actually changed.',
    ],
    bad: [
      'Emitting high-frequency events (e.g. on every mousemove) without throttling floods parent handlers.',
      'Re-emitting through many layers (event chains) adds boilerplate and indirection.',
    ],
    optimizations: [
      'Throttle/debounce high-frequency emits (scroll, resize, mousemove, input).',
      'Avoid emitting large objects repeatedly; emit ids or minimal payloads.',
      'For deep trees, prefer provide/inject or a store over long re-emit chains.',
      'Keep handlers light; defer heavy work or batch updates.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'props', 'v-on-events'],
    nextConcepts: ['v-model-components', 'attribute-fallthrough', 'provide-inject'],
    dependencyNote:
      'Component events are the "events up" counterpart to props and build on v-on. They are the foundation of v-model-components and an alternative to provide-inject for shallow communication.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a parent box and a child box.',
      'Draw a downward arrow labelled "props" and an upward arrow labelled "emit(event, payload)".',
      'Note next to the child: defineEmits([\'like\']); emit(\'like\', data).',
      'Note next to the parent: @like="handler".',
      'Say: "The child announces with emit; the parent listens with @ and decides what to do. Events do not bubble — emit calls the direct parent\'s handler. This completes one-way flow."',
    ],
    diagram: `   ┌── Parent ── @like="handle" ─┐
   │            ▲                 │
   │            │ handler(payload)│
   └────────────┼─────────────────┘
                │
   ┌── Child ───┴─────────────────┐
   │ emit('like', payload) ───────┘
   └──────────────────────────────┘`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Component events are how a child talks back to its parent. The child declares events with defineEmits and fires them with emit(name, payload); the parent listens with @event-name. This is "events up", the complement to props-down, and it keeps data flow one-way: the child announces, the parent owns and updates the data. Events do not bubble — emit calls the direct parent\'s handler. v-model on components is just a value prop plus an update:modelValue event built on this mechanism.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Component events are Vue\'s mechanism for a child to communicate upward to its parent — the other half of the data-flow loop where props go down and events go up. A child declares the events it can emit with defineEmits, then fires one by calling the returned emit function with an event name and an optional payload, for example emit("search", query). The parent subscribes using v-on, or the @ shorthand, on the component tag: @search="handler", and its handler receives the payload. The reason this exists rather than letting the child mutate a prop is ownership and predictability: props are read-only and one-way, so the child must not change parent state directly. Instead it announces what happened, and the parent — which owns the data — decides how to update its own state. Under the hood there is no DOM-style bubbling: a listener like @search compiles into an onSearch function prop on the child, and emit simply looks that handler up and calls it synchronously. That also means to send an event several levels up you re-emit at each layer, or you switch to provide/inject or a store. In TypeScript you can use the type-only form of defineEmits to declare each event name and its payload tuple, which type-checks both the emit calls in the child and the listeners in the parent. Finally, this is the foundation of v-model on a component: v-model is sugar for passing a modelValue prop plus an update:modelValue listener, so two-way binding is really just a controlled prop-and-event pair built on this same events mechanism.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Events keep components decoupled but deep re-emit chains add boilerplate; at some depth provide/inject or a store is cleaner.',
      'Fine-grained events give precise control; a single generic event with a discriminated payload is terser but loses per-event typing clarity.',
    ],
    edgeCases: [
      'No bubbling — events only reach the direct parent.',
      'Event name casing mapping (camelCase emit ↔ kebab-case template listener).',
      'Undeclared events can clash with attribute fallthrough/native listeners.',
      'Emitting synchronously during render or in setup can cause ordering surprises.',
    ],
    runtimeBehavior: [
      'A listener compiles to an on-prefixed function prop; emit invokes it directly and synchronously.',
      'defineEmits validates event names (and payloads with the typed form) in development.',
      'v-model expands to modelValue prop + update:modelValue listener.',
    ],
    scalability: [
      'Shallow parent-child communication scales well with events; cross-cutting state should move to a store.',
      'High-frequency events need throttling to avoid overwhelming parent handlers and re-renders.',
    ],
    productionConcerns: [
      'Untyped events lead to silent listener mismatches; adopt typed defineEmits in shared components.',
      'Event chains across many layers are hard to trace — document the event API or refactor to a store.',
      'Unthrottled high-frequency emits cause jank; profile and throttle.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Events = child → parent communication.',
    'Declare with defineEmits; fire with emit(name, payload).',
    'Listen with @event-name on the component tag.',
    'Props DOWN, events UP — one-way flow.',
    'No bubbling: emit reaches only the direct parent.',
    'Typed: defineEmits<{ submit: [Payload]; cancel: [] }>().',
    'Casing: emit(\'updateValue\') ↔ @update-value in DOM templates.',
    'Never mutate a prop to signal the parent — emit instead.',
    'v-model = modelValue prop + update:modelValue event.',
    'Throttle high-frequency emits (scroll/mousemove/input).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a CancelButton that emits a `cancel` event with no payload when clicked.',
      hint: 'defineEmits and call emit in the click handler.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nconst emit = defineEmits([\'cancel\'])\n</script>\n<template>\n  <button @click="emit(\'cancel\')">Cancel</button>\n</template>',
        explanation: [
          'defineEmits declares the cancel event.',
          'emit(\'cancel\') fires it directly from the template handler.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Create a QuantityInput that emits a `change` event with the new numeric value whenever the input changes.',
      hint: 'Read the input value and emit it as a number.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nconst emit = defineEmits([\'change\'])\nfunction onInput(e) {\n  emit(\'change\', Number(e.target.value))\n}\n</script>\n<template>\n  <input type="number" @input="onInput" />\n</template>',
        explanation: [
          'The handler reads the input and converts it to a Number.',
          'emit(\'change\', value) sends the new value to the parent.',
          'The parent owns whatever state the value updates.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Forward an event two levels up: a Leaf emits `select`, a Middle wrapper must pass it to the Root.',
      hint: 'Events do not bubble — re-emit in Middle.',
      solution: {
        lang: 'vue',
        code: '<!-- Leaf.vue -->\n<script setup>\nconst emit = defineEmits([\'select\'])\n</script>\n<template>\n  <button @click="emit(\'select\', \'leaf\')">pick</button>\n</template>\n\n<!-- Middle.vue -->\n<script setup>\nimport Leaf from \'./Leaf.vue\'\nconst emit = defineEmits([\'select\'])\n</script>\n<template>\n  <Leaf @select="(v) => emit(\'select\', v)" />\n</template>\n\n<!-- Root listens: <Middle @select="handle" /> -->',
        explanation: [
          'Leaf emits select to its direct parent, Middle.',
          'Middle re-emits select so Root can hear it, since events do not bubble.',
          'For deeper trees this gets verbose — prefer provide/inject or a store.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a typed (TS) Rating component that emits `update:rating` with a number 1-5 when a star is clicked.',
      hint: 'Type-only defineEmits with a tuple payload.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nconst emit = defineEmits<{ \'update:rating\': [value: number] }>()\nconst stars = [1, 2, 3, 4, 5]\n</script>\n<template>\n  <span>\n    <button\n      v-for="s in stars"\n      :key="s"\n      @click="emit(\'update:rating\', s)"\n    >★</button>\n  </span>\n</template>',
        explanation: [
          'The typed defineEmits declares update:rating with a number payload.',
          'TypeScript enforces the correct event name and payload type.',
          'Clicking a star emits its value; using the update: prefix makes it v-model-compatible.',
          'The parent can bind v-model:rating to receive updates.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Component events complete your understanding of Vue\'s data flow. Together with props they form the props-down/events-up loop that every Vue app relies on, and they are the basis for v-model and decoupled component design — core, daily knowledge.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "how does a child talk to its parent?". Product companies (Zoho, Flipkart, Razorpay) ask why you emit instead of mutating props and how to forward events. FAANG-level interviews probe the no-bubbling model, typed emits, and how v-model decomposes into a prop and an event.',
    whatInterviewersExpect:
      'They expect you to declare and emit events correctly, explain one-way flow and why mutation is wrong, know that events do not bubble, and connect events to v-model.',
  },
}

export default componentEvents
