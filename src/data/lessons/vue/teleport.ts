import type { ConceptLesson } from '../../../types/lesson'

const teleport: ConceptLesson = {
  // 1. Concept Summary
  slug: 'teleport',
  name: 'Teleport',
  category: 'built-in',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Teleport solves the #1 modal/overlay problem: rendering an element somewhere else in the DOM (like document.body) while keeping it logically inside your component.',
    'It fixes z-index, overflow:hidden clipping, and stacking-context bugs that plague modals, tooltips, dropdowns, and toasts.',
    'You keep the component\'s reactivity, props, events, and provide/inject intact even though the DOM node lives elsewhere — a subtle but powerful idea interviewers probe.',
    'It is the idiomatic Vue 3 replacement for portal libraries and manual appendChild hacks.',
    'Understanding it shows you grasp the difference between the component tree and the DOM tree.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Teleport is like mailing a letter to a friend in another city — you wrote it at home, but it appears in their mailbox.',
    story: [
      'Imagine you write a note at your desk in your bedroom, but you want it to show up on the fridge in the kitchen.',
      'Instead of getting up and walking it over, you have a magic tube: you drop the note in, and it instantly appears taped to the fridge.',
      'The note still belongs to you — you wrote it, you can change it — but it physically lives on the fridge where everyone can see it.',
      'Teleport does this for parts of your webpage: you write a popup inside your component, but tell Vue to actually show it at the top of the page so nothing covers it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes a popup or tooltip you write deep inside a component gets cut off or hidden because of the styles of the boxes around it.',
    'Teleport is a built-in Vue tool that lets you say: render this content over here in the DOM (usually at the end of the page body) instead of right where I wrote it.',
    'Even though the popup\'s HTML now lives somewhere else on the page, it still belongs to your component — your data and click handlers still work.',
    'This avoids problems where parent boxes with hidden overflow or low z-index would otherwise hide your popup.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Teleport is a built-in component that renders its slot content into a different place in the real DOM (a target element you specify), while the content remains logically part of the component tree where it is written.',
    how: 'You wrap content in <Teleport to="selector">. At render time, Vue mounts that content into the target element (e.g. body) instead of the current location, but keeps it connected to the component for reactivity, props, events, and provide/inject.',
    why: 'Overlays like modals need to escape parent containers that clip (overflow:hidden) or create stacking contexts (transform, z-index) that would hide them. Teleport moves the DOM out while keeping the developer experience of writing it in place.',
    code: {
      label: 'A modal teleported to body',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst open = ref(false)\n</script>\n\n<template>\n  <button @click="open = true">Open</button>\n\n  <!-- written here, but rendered as a child of <body> -->\n  <Teleport to="body">\n    <div v-if="open" class="modal-backdrop">\n      <div class="modal">\n        <p>Hello from a modal</p>\n        <button @click="open = false">Close</button>\n      </div>\n    </div>\n  </Teleport>\n</template>',
      explanation: [
        'The modal markup is authored inside this component for readability.',
        '<Teleport to="body"> renders the actual DOM at the end of <body>, escaping any clipping parents.',
        'The reactive `open` ref and the close handler still work — the content stays logically owned by this component.',
        'This avoids z-index/overflow bugs that occur when the modal is nested deep in the layout.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Teleport is a built-in component that decouples a piece of a component\'s rendered DOM from its position in the DOM tree without decoupling it from its position in the component tree. Its slot content is mounted into a specified target container (resolved from a CSS selector or element reference) while remaining a logical child of the declaring component, so reactivity, event listeners, slots, and provide/inject continue to flow through the component hierarchy. It supports a `disabled` prop to render in place and `to` retargeting; multiple teleports to the same target append in order.',

  // 7. Internal Working
  internalWorking: [
    'During render, Teleport resolves its `to` target (CSS selector or DOM element) to a container element in the live document.',
    'Instead of inserting its child vnodes at the Teleport\'s own location in the DOM, the patch process mounts those child nodes into the resolved target container.',
    'Crucially, the children are still part of the component\'s vnode tree, so the render effect, props, emitted events, slots, and provide/inject resolve through the normal component hierarchy — only the physical DOM insertion point differs.',
    'On updates, Teleport patches its children in place within the target; if `to` changes, it moves the rendered DOM to the new target.',
    'The `disabled` prop toggles between teleporting and rendering inline; switching it moves the existing DOM nodes accordingly rather than recreating them.',
    'On unmount, Teleport removes its teleported nodes from the target container, so there is no orphaned DOM left behind.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  COMPONENT TREE (logical)          DOM TREE (physical)
  <App>                              <body>
    └─ <Card>                          ├─ <div id="app"> ... <Card> ... </div>
         └─ <Teleport to="body">       └─ <div class="modal"> ... </div>  ◄── teleported here
              <div class="modal"/>          (escapes Card's overflow/z-index)
                  │
   reactivity / props / events / provide-inject
   STILL flow through the component tree (dashed link), not the DOM position`,

  // 9. Memory Visualization — omitted

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — teleport to body',
      lang: 'vue',
      code: '<template>\n  <Teleport to="body">\n    <div class="toast">Saved!</div>\n  </Teleport>\n</template>',
      explanation: [
        'The toast renders as a direct child of <body>, above all page content.',
        'It escapes any parent overflow:hidden or transformed ancestor.',
        'No manual appendChild or portal library needed.',
        'When this component unmounts, the toast is removed from body automatically.',
      ],
    },
    intermediate: {
      label: 'Intermediate — disabled to render inline conditionally',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst isMobile = ref(window.innerWidth < 768)\n</script>\n\n<template>\n  <!-- on mobile, keep it inline; on desktop, teleport to body -->\n  <Teleport to="body" :disabled="isMobile">\n    <div class="panel">Responsive panel</div>\n  </Teleport>\n</template>',
      explanation: [
        'The `disabled` prop toggles teleporting on or off reactively.',
        'When disabled is true, the content renders at its original location inline.',
        'Switching disabled moves the same DOM nodes rather than recreating them.',
        'Useful for responsive behavior where a panel should be a sheet inline on mobile.',
      ],
    },
    advanced: {
      label: 'Advanced — provide/inject still works across the teleport',
      lang: 'vue',
      code: '<script setup>\n// Parent provides a theme; teleported child injects it even though its DOM is in body\nimport { provide, ref } from \'vue\'\nimport ThemedModal from \'./ThemedModal.vue\'\nprovide(\'theme\', ref(\'dark\'))\n</script>\n\n<template>\n  <Teleport to="body">\n    <ThemedModal /> <!-- inject(\'theme\') resolves through component tree, not DOM tree -->\n  </Teleport>\n</template>',
      explanation: [
        'provide/inject follows the COMPONENT tree, not the DOM tree.',
        'Even though ThemedModal\'s DOM lives in body, it injects the theme from its logical parent.',
        'The same holds for props, emitted events, and slot content.',
        'This is the key insight that distinguishes Teleport from a raw DOM appendChild.',
      ],
    },
    realProject: {
      label: 'Real project — a reusable modal component',
      lang: 'vue',
      code: '<!-- Modal.vue -->\n<script setup>\ndefineProps<{ open: boolean }>()\nconst emit = defineEmits([\'close\'])\n</script>\n\n<template>\n  <Teleport to="body">\n    <div v-if="open" class="overlay" @click.self="emit(\'close\')">\n      <div class="dialog">\n        <slot />\n        <button @click="emit(\'close\')">×</button>\n      </div>\n    </div>\n  </Teleport>\n</template>\n\n<!-- Usage anywhere, however deeply nested -->\n<!-- <Modal :open="show" @close="show = false"><p>Body</p></Modal> -->',
      explanation: [
        'The modal always renders into body, so it works regardless of where <Modal> is used.',
        'Slot content and the close event flow through the component tree as normal.',
        '@click.self on the overlay closes only when the backdrop itself is clicked.',
        'This is the production pattern most modal/dialog components use in Vue 3.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What problem does Teleport solve?',
      answer: 'It renders a component\'s content elsewhere in the DOM (typically body) so overlays like modals, tooltips, and toasts escape parent overflow:hidden, z-index, and stacking-context issues — while keeping the content logically part of the component.',
      explanation: 'A good answer names both the DOM-escape benefit and the preserved component connection.',
    },
    {
      level: 'beginner',
      question: 'Does teleporting break reactivity or events?',
      answer: 'No. The content stays in the component tree, so reactive data, props, emitted events, slots, and provide/inject all continue to work; only the physical DOM insertion point changes.',
      explanation: 'This tests the core distinction between the component tree and the DOM tree.',
    },
    {
      level: 'intermediate',
      question: 'What does the `disabled` prop do?',
      answer: 'It conditionally turns teleporting off so the content renders inline at its original location. Toggling it moves the existing DOM nodes rather than recreating them, useful for responsive behavior.',
      explanation: 'Mentioning that nodes move (not recreate) shows deeper understanding.',
    },
    {
      level: 'intermediate',
      question: 'How does provide/inject behave across a Teleport?',
      answer: 'It follows the component tree, not the DOM tree. A teleported child still injects values provided by its logical ancestors even though its DOM lives elsewhere.',
      explanation: 'This is the canonical "why is Teleport better than appendChild" point.',
    },
    {
      level: 'advanced',
      question: 'What happens to teleported DOM when the component unmounts, and with multiple teleports to the same target?',
      answer: 'On unmount, Teleport removes its nodes from the target, so no orphaned DOM remains. Multiple teleports to the same target append their content in mount order.',
      explanation: 'Cleanup and ordering are real concerns when stacking multiple overlays.',
    },
    {
      level: 'senior',
      question: 'How does Teleport interact with SSR and hydration?',
      answer: 'During SSR, teleported content is rendered with markers so the client can find and hydrate it into the correct target. The target must exist on the client; teleporting to body is safe, but a custom target must be present before hydration or you get a mismatch/warning.',
      explanation: 'SSR target-availability is the senior-level gotcha.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why do modals commonly need to escape their parent container?',
    'How is Teleport different from manually using appendChild?',
    'What happens if the `to` target does not exist?',
    'How do you stack multiple modals correctly?',
    'How does Teleport behave with <Transition> for enter/leave animations?',
    'What are the SSR considerations for Teleport targets?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Teleporting to a target that does not exist yet.',
      why: 'If the selector resolves to null, Vue warns and the content has nowhere to mount.',
      fix: 'Teleport to body (always present) or ensure a custom target element exists before this component renders.',
    },
    {
      mistake: 'Assuming styles scoped to the parent still apply to teleported content.',
      why: 'The DOM moves outside the parent, so descendant selectors and some scoped styles may no longer match.',
      fix: 'Use self-contained classes or global styles for teleported overlays, or :deep where appropriate.',
    },
    {
      mistake: 'Thinking Teleport detaches the content from the component.',
      why: 'Only the DOM position changes; reactivity, events, and provide/inject still flow through the component tree.',
      fix: 'Treat it as a DOM-only move — author and reason about the content normally.',
    },
    {
      mistake: 'Forgetting click-outside / focus management on teleported overlays.',
      why: 'Because the DOM is at body level, parent click handlers won\'t catch outside clicks automatically.',
      fix: 'Implement @click.self on the backdrop and manage focus trapping explicitly.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Modals, dialogs, drawers, tooltips, popovers, and toast notifications teleport to body to escape clipping and stacking contexts.' },
    { area: 'Component library', detail: 'UI libraries (Element Plus, Naive UI, PrimeVue) use Teleport internally for overlay components so consumers never hit z-index/overflow issues.' },
    { area: 'Nuxt', detail: 'SSR-rendered overlays use Teleport with hydration markers; teleporting to body keeps the target reliably available on the client.' },
    { area: 'Vue', detail: 'Notification/toast systems teleport a single container to body and render queued toasts into it from anywhere in the app.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Avoids expensive workarounds (manual portals, wrapper re-parenting) and keeps overlay rendering on Vue\'s normal patch path.',
      'Toggling `disabled` moves existing nodes instead of recreating them, which is cheap.',
    ],
    bad: [
      'Many simultaneous teleported overlays appended to body can create deep stacking and reflow churn.',
      'Frequent target changes force DOM moves on each change.',
    ],
    optimizations: [
      'Use a single teleported container for systems like toasts rather than one teleport per item.',
      'Render overlay content only when open (v-if inside Teleport) to avoid keeping hidden DOM in body.',
      'Reuse `disabled` toggling for responsive cases instead of conditional mounting/unmounting.',
      'Keep overlay subtrees small and self-contained to limit reflow when they appear.',
    ],
  },

  // 16. Security — omitted (overlay content follows normal Vue escaping; no Teleport-specific angle)

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'template-syntax', 'provide-inject'],
    nextConcepts: ['transition', 'suspense', 'component-design-patterns', 'ssr-hydration'],
    dependencyNote:
      'Teleport builds on component basics and the provide/inject mental model (component tree vs DOM tree). It commonly pairs with Transition for animated overlays and with component design patterns for reusable modals, and it has SSR/hydration considerations.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the component tree: App → Card → Teleport → modal vnode.',
      'Beside it draw the DOM tree: body containing #app AND a separate .modal node at the end.',
      'Draw a dashed line from the modal in the DOM back to Teleport in the component tree labeled "still logically owned".',
      'Annotate "reactivity / props / events / inject flow through component tree".',
      'Say: "Teleport moves only the DOM position to escape overflow/z-index; the content stays part of the component, so everything still works."',
    ],
    diagram: `  COMPONENT TREE            DOM TREE
  App                       <body>
   └ Card                     <div id=app>...Card...</div>
      └ Teleport(to=body)     <div class=modal/>  ◄─ rendered here
           └ modal  ─ ─ ─ ─ ─ ─ ─ (dashed: still owned by Teleport)
  inject/props/events follow the LEFT tree, DOM sits on the RIGHT`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Teleport is a built-in component that renders its content into a different DOM location (usually body) while keeping it logically inside the component tree. This lets modals, tooltips, and toasts escape parent overflow:hidden and z-index/stacking-context bugs. Crucially, reactivity, props, events, and provide/inject still flow through the component tree — only the DOM insertion point moves. Use `to` for the target, `disabled` to render inline conditionally; teleport to body so the target always exists, and clean-up is automatic on unmount.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Teleport solves a classic CSS-meets-component problem. When you build something like a modal deep inside your component tree, it often gets clipped by a parent\'s overflow:hidden or hidden behind something because a parent created a stacking context with transform or z-index. The traditional fix was to manually appendChild the element to the body, but then you lose Vue\'s reactivity, events, and provide/inject. Teleport gives you the best of both. You write <Teleport to="body"> around your content; Vue resolves that target and physically mounts the content there in the DOM, but the content remains a logical child of your component. That distinction is the whole point: the component tree and the DOM tree are different things. Because the content stays in the component tree, reactive data, props, emitted events, slots, and provide/inject all keep working exactly as if it were rendered in place — a teleported child can still inject a theme its logical ancestor provided, even though its DOM lives in body. There are a couple of useful props: `to` accepts a CSS selector or element, and `disabled` lets you turn teleporting off conditionally, which moves the existing DOM nodes inline rather than recreating them — handy for responsive designs. On unmount, Teleport cleans up its nodes from the target so there\'s no orphaned DOM, and multiple teleports to the same target append in order. The main gotchas: the target must exist (teleport to body to be safe), scoped parent styles may not reach the moved DOM so overlays should be self-contained, and for SSR the target must be present on the client to hydrate correctly.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Escapes layout/stacking constraints cleanly vs the content no longer inheriting parent layout/scoped styles.',
      'Centralizing overlays in body simplifies z-index but can make focus management and accessibility (aria) the developer\'s responsibility.',
    ],
    edgeCases: [
      'Target must exist when Teleport renders; missing targets warn and fail to mount.',
      'Scoped styles and descendant selectors from the parent may not apply to moved DOM.',
      'Multiple teleports to one target stack in mount order — important for nested modals.',
      'SSR requires the target to be available on the client for correct hydration.',
    ],
    runtimeBehavior: [
      'Children patch within the target on update; changing `to` moves the existing DOM to the new container.',
      '`disabled` toggling relocates existing nodes rather than recreating them.',
      'Provide/inject, events, and slots resolve via the component hierarchy regardless of DOM position.',
    ],
    scalability: [
      'For notification/toast systems use a single teleported host and render items into it, not one Teleport per item.',
      'Keep overlay subtrees small and gate them behind v-if so body isn\'t filled with hidden DOM.',
    ],
    productionConcerns: [
      'Accessibility: focus trapping, aria-modal, and restoring focus on close must be handled explicitly.',
      'Click-outside and escape-to-close logic must be wired since parent handlers won\'t catch body-level clicks.',
      'SSR hydration mismatches if the target differs between server and client.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Teleport renders content to a different DOM location while keeping it in the component tree.',
    'Solves modal/tooltip overflow:hidden, z-index, and stacking-context bugs.',
    'Reactivity, props, events, slots, provide/inject all still work (component tree, not DOM tree).',
    '`to` = CSS selector or element target; teleport to "body" so it always exists.',
    '`disabled` renders inline instead; toggling moves existing nodes (no recreate).',
    'Cleanup on unmount is automatic — no orphaned DOM.',
    'Multiple teleports to one target append in mount order.',
    'Scoped parent styles may not reach moved DOM — keep overlays self-contained.',
    'Handle focus trap + click-outside + escape yourself.',
    'SSR: target must exist on the client to hydrate.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Render a toast notification at the end of <body>.',
      hint: 'Wrap it in Teleport with to="body".',
      solution: {
        lang: 'vue',
        code: '<template>\n  <Teleport to="body">\n    <div class="toast">Done!</div>\n  </Teleport>\n</template>',
        explanation: [
          'The toast mounts as a child of body, above all content.',
          'It escapes any clipping or stacking-context ancestors.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Conditionally teleport only on desktop using the disabled prop.',
      hint: 'Bind :disabled to a mobile check.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst isMobile = ref(window.innerWidth < 768)\n</script>\n<template>\n  <Teleport to="body" :disabled="isMobile">\n    <div class="panel">Panel</div>\n  </Teleport>\n</template>',
        explanation: [
          'When isMobile is true the panel renders inline; otherwise it teleports to body.',
          'Toggling disabled relocates the same nodes rather than recreating them.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a reusable Modal that teleports to body, emits close, and closes on backdrop click.',
      hint: 'Use @click.self on the overlay.',
      solution: {
        lang: 'vue',
        code: '<script setup>\ndefineProps<{ open: boolean }>()\nconst emit = defineEmits([\'close\'])\n</script>\n<template>\n  <Teleport to="body">\n    <div v-if="open" class="overlay" @click.self="emit(\'close\')">\n      <div class="dialog"><slot /></div>\n    </div>\n  </Teleport>\n</template>',
        explanation: [
          'Teleport puts the overlay in body so it always sits on top.',
          '@click.self fires close only when the backdrop itself is clicked, not the dialog.',
          'Slot content and the close event flow through the component tree.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain why a teleported child can still inject a value provided by its parent, with code.',
      hint: 'provide/inject follows the component tree.',
      solution: {
        lang: 'vue',
        code: '<!-- Parent.vue -->\n<script setup>\nimport { provide, ref } from \'vue\'\nimport Child from \'./Child.vue\'\nprovide(\'lang\', ref(\'en\'))\n</script>\n<template>\n  <Teleport to="body"><Child /></Teleport>\n</template>\n\n<!-- Child.vue -->\n<script setup>\nimport { inject } from \'vue\'\nconst lang = inject(\'lang\') // resolves \'en\' even though DOM is in body\n</script>',
        explanation: [
          'inject walks the COMPONENT tree, where Child is still a logical descendant of Parent.',
          'Teleport only changed the DOM insertion point, not the component hierarchy.',
          'So the provided value resolves normally regardless of DOM position.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Teleport is the idiomatic Vue 3 answer to overlay rendering, and it crystallizes a deep concept: the component tree is not the DOM tree. Mastering it means you can build robust modals, tooltips, and notification systems and explain exactly why they work.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what Teleport is for. Product companies (Zoho, Flipkart, Razorpay) ask how reactivity/inject survive the move and how to build a reusable modal. FAANG-level interviews probe SSR hydration, stacking-context internals, and accessibility/focus management of teleported overlays.',
    whatInterviewersExpect:
      'They expect you to explain the overflow/z-index problem it solves, the component-tree-vs-DOM-tree distinction (so events/inject still work), the `to`/`disabled` props, automatic cleanup, and the SSR/accessibility caveats.',
  },
}

export default teleport
