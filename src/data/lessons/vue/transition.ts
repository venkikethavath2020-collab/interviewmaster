import type { ConceptLesson } from '../../../types/lesson'

const transition: ConceptLesson = {
  // 1. Concept Summary
  slug: 'transition',
  name: 'Transition',
  category: 'built-in',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    '<Transition> is Vue\'s built-in answer to "how do I animate an element appearing or disappearing" without hand-writing JS animation loops.',
    'It is the single most common animation tool in real Vue apps: modals, dropdowns, toasts, route fades, and accordions all lean on it.',
    'It bridges Vue\'s reactivity (an element enters/leaves the DOM when state changes) with CSS transitions/animations by injecting the right classes at the right moments.',
    'Interviewers use it to check whether you understand the difference between conditionally rendering an element and animating that change — and whether you know enter/leave hook timing.',
    'Done wrong it causes janky, half-finished animations, layout shifts, and elements that flash before they fade — done right it is declarative and almost free.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: '<Transition> is like a stage curtain that smoothly opens when an actor walks on and closes when they walk off.',
    story: [
      'Imagine a toy that pops out of a box. If it just appears instantly, it feels boring and a little jarring.',
      'Now imagine the toy slides up slowly and gently when you open the box, and slides back down when you close it. Much nicer!',
      'In a web page, things like pop-up messages can appear and disappear. If they just blink in and out, it looks rough.',
      '<Transition> is a special wrapper you put around something. When that thing is about to appear or disappear, Vue smoothly slides or fades it instead of blinking it. You just describe how the slide-in and slide-out should look, and Vue handles the timing.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue you can show or hide an element using a condition (like v-if). Normally the element just pops into existence or vanishes.',
    'If you wrap that element in a <Transition> component, Vue notices when it is about to enter or leave and adds special CSS classes during those moments.',
    'You write CSS rules for those classes (for example, fade from invisible to visible), and the browser plays the animation.',
    'So <Transition> is a coordinator: it does not draw the animation itself, it just tells your CSS exactly when the "entering" and "leaving" phases happen so your CSS can do the visual work.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: '<Transition> is a built-in Vue component that applies enter/leave transition classes (and optional JS hooks) to a single element or component when it is inserted into or removed from the DOM by v-if, v-show, dynamic components, or a changing :key.',
    how: 'You wrap exactly one element/component in <Transition>. When that element enters or leaves, Vue adds classes like v-enter-from, v-enter-active, v-enter-to (and the v-leave-* counterparts) across animation frames. Your CSS transitions/animations on those classes produce the visual effect, and Vue waits for them to finish before removing the element.',
    why: 'It lets you express animation declaratively, tied to reactive state, instead of imperatively measuring timeouts and toggling classes by hand. Vue automatically detects the transition duration from the CSS so removal is correctly delayed.',
    code: {
      label: 'A simple fade on toggle',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst show = ref(true)\n</script>\n\n<template>\n  <button @click="show = !show">Toggle</button>\n  <Transition name="fade">\n    <p v-if="show">Hello Vue</p>\n  </Transition>\n</template>\n\n<style>\n.fade-enter-active,\n.fade-leave-active {\n  transition: opacity 0.3s ease;\n}\n.fade-enter-from,\n.fade-leave-to {\n  opacity: 0;\n}\n</style>',
      explanation: [
        'The name="fade" prop turns the default v-* class prefix into fade-*.',
        'When show flips to true, Vue adds fade-enter-from (opacity 0), then on the next frame fade-enter-to, animating to opacity 1.',
        'When show flips to false, Vue adds fade-leave-active and animates to fade-leave-to (opacity 0) before removing the <p>.',
        'There must be exactly ONE root element inside <Transition>; here v-if guards a single <p>.',
        'Vue reads the 0.3s from the CSS to know when the leave animation is done and the node can be removed.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    '<Transition> is a built-in renderless-style wrapper component that orchestrates enter and leave transitions for a single element or component triggered by v-if, v-show, dynamic <component :is>, or a changing key. During an enter it sequentially applies the *-enter-from, *-enter-active, and *-enter-to classes across animation frames; during a leave it applies *-leave-from, *-leave-active, and *-leave-to, then removes (or hides) the node once the CSS transition/animation completes or the JS done callback fires. It supports custom class names, JavaScript hooks, appear-on-mount, and enter/leave modes to coordinate overlapping elements.',

  // 7. Internal Working
  internalWorking: [
    'At compile time, the child of <Transition> is wrapped so the runtime can intercept its mount and unmount; <Transition> is a special component the renderer knows about.',
    'On enter, before insertion Vue adds the *-enter-from and *-enter-active classes, inserts the element, then on the next requestAnimationFrame (a double-rAF/nextFrame) swaps *-enter-from for *-enter-to so the browser sees a class change and starts the CSS transition.',
    'Vue determines the transition end time by reading the computed transition-duration / animation-duration of the active class (or you can pass an explicit :duration), then listens for the transitionend/animationend event with that timeout as a fallback.',
    'On leave, Vue adds *-leave-from + *-leave-active, then on the next frame *-leave-to, and crucially DELAYS the actual DOM removal (for v-if) or the display:none (for v-show) until the transition finishes.',
    'If JavaScript hooks are provided (@enter, @leave, etc.) they receive the DOM el and a done callback; when you supply hooks Vue can skip CSS detection and rely on you calling done.',
    'Enter/leave modes (in-out / out-in) sequence two simultaneous transitions: out-in fully finishes the leaving element\'s transition and removes it before starting the entering element\'s enter, avoiding overlap.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  state change (v-if true)  ─────────────► ENTER sequence
      │
      ▼
  ┌──────────────────────────────────────────────────────────┐
  │ frame 0:  add  .v-enter-from  +  .v-enter-active           │
  │ insert element into DOM                                    │
  │ next frame: remove .v-enter-from, add .v-enter-to          │
  │           → browser animates (transition-active)           │
  │ transitionend / duration → remove .v-enter-active/.to      │
  └──────────────────────────────────────────────────────────┘

  state change (v-if false) ─────────────► LEAVE sequence
      │
      ▼
  ┌──────────────────────────────────────────────────────────┐
  │ frame 0:  add  .v-leave-from  +  .v-leave-active           │
  │ next frame: remove .v-leave-from, add .v-leave-to          │
  │           → browser animates out                           │
  │ transitionend / duration → REMOVE element from DOM         │
  └──────────────────────────────────────────────────────────┘`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — named fade transition',
      lang: 'vue',
      code: '<template>\n  <Transition name="fade">\n    <div v-if="open" class="panel">Panel content</div>\n  </Transition>\n</template>\n\n<style>\n.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }\n.fade-enter-from, .fade-leave-to { opacity: 0; }\n</style>',
      explanation: [
        'name="fade" prefixes all six transition classes with fade-.',
        'Only opacity is animated; enter-from and leave-to both set opacity:0 for a symmetric fade.',
        'enter-active and leave-active hold the transition property so the browser knows what to animate.',
        'The single child is guarded by v-if — that conditional is what triggers the transition.',
      ],
    },
    intermediate: {
      label: 'Intermediate — slide with appear and JS hook',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst visible = ref(true)\nfunction onAfterLeave(el) {\n  console.log(\'fully removed\', el)\n}\n</script>\n\n<template>\n  <Transition name="slide" appear @after-leave="onAfterLeave">\n    <aside v-if="visible" class="drawer">Menu</aside>\n  </Transition>\n</template>\n\n<style>\n.slide-enter-active, .slide-leave-active { transition: transform .3s ease, opacity .3s ease; }\n.slide-enter-from, .slide-leave-to { transform: translateX(-100%); opacity: 0; }\n</style>',
      explanation: [
        'appear runs the enter transition on initial render/mount, not just on later toggles.',
        '@after-leave is a JS hook fired once the leave transition fully completes — ideal for cleanup or logging.',
        'transform is animated alongside opacity for a slide-and-fade drawer effect.',
        'JS hooks and CSS classes can coexist; the hook here only observes, it does not control timing.',
      ],
    },
    advanced: {
      label: 'Advanced — out-in mode between two views',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst tab = ref(\'a\')\n</script>\n\n<template>\n  <button @click="tab = tab === \'a\' ? \'b\' : \'a\'">Swap</button>\n  <Transition name="cross" mode="out-in">\n    <section :key="tab">{{ tab === \'a\' ? \'View A\' : \'View B\' }}</section>\n  </Transition>\n</template>\n\n<style>\n.cross-enter-active, .cross-leave-active { transition: opacity .2s; }\n.cross-enter-from, .cross-leave-to { opacity: 0; }\n</style>',
      explanation: [
        'A changing :key makes Vue treat each tab as a new element, triggering leave + enter.',
        'mode="out-in" makes the old view finish leaving and unmount BEFORE the new view enters, so they never overlap.',
        'Without out-in the two sections would animate simultaneously and visually stack.',
        'This is the canonical pattern for animated tab/route content swaps.',
      ],
    },
    realProject: {
      label: 'Real project — a reusable modal with backdrop transition',
      lang: 'vue',
      code: '<script setup>\ndefineProps<{ open: boolean }>()\ndefineEmits<{ close: [] }>()\n</script>\n\n<template>\n  <Transition name="modal">\n    <div v-if="open" class="backdrop" @click.self="$emit(\'close\')">\n      <div class="modal-card" role="dialog">\n        <slot />\n      </div>\n    </div>\n  </Transition>\n</template>\n\n<style>\n.modal-enter-active, .modal-leave-active { transition: opacity .25s ease; }\n.modal-enter-from, .modal-leave-to { opacity: 0; }\n.modal-enter-active .modal-card { transition: transform .25s ease; }\n.modal-enter-from .modal-card { transform: scale(.95); }\n</style>',
      explanation: [
        'A single root .backdrop is the transition target; the card is a nested child so the backdrop fade and card scale are coordinated.',
        'The parent owns the open prop and emits close; the modal stays a dumb, reusable component.',
        '@click.self closes only when the backdrop itself (not the card) is clicked.',
        'Nesting selectors like .modal-enter-active .modal-card let one transition animate multiple inner elements.',
        'This exact shape — Transition + v-if + backdrop + slot — is how most production modal/dialog components are built.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does the <Transition> component do, and what triggers it?',
      answer: 'It applies enter/leave CSS classes (and optional JS hooks) to a single element or component when it enters or leaves the DOM. It is triggered by v-if, v-show, a dynamic <component :is>, or a changing :key on the wrapped element.',
      explanation: 'A strong answer names the trigger sources AND clarifies that <Transition> wraps exactly one element — it does not animate by itself, it coordinates CSS.',
    },
    {
      level: 'beginner',
      question: 'What are the six transition classes Vue applies?',
      answer: 'For enter: v-enter-from, v-enter-active, v-enter-to. For leave: v-leave-from, v-leave-active, v-leave-to. With a name prop the v- prefix is replaced (e.g. fade-enter-from).',
      explanation: 'Knowing *-from is the starting state, *-to is the ending state, and *-active holds the transition property is the core of using <Transition> correctly.',
    },
    {
      level: 'intermediate',
      question: 'How does Vue know when to actually remove an element that is leaving?',
      answer: 'Vue reads the CSS transition-duration / animation-duration of the *-leave-active class to compute when the animation ends, listens for the transitionend/animationend event, and only then removes the node. You can override with :duration.',
      explanation: 'This explains why a v-if element does not vanish instantly — Vue delays removal until the transition completes, using duration detection plus the end event.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between in-out and out-in transition modes?',
      answer: 'out-in: the current element transitions out and is removed first, then the new one transitions in. in-out: the new element transitions in first, then the old one leaves. out-in is by far the most common, preventing overlap during swaps.',
      explanation: 'Modes exist because by default enter and leave happen simultaneously; senior candidates know out-in is the fix for "both views visible at once".',
    },
    {
      level: 'advanced',
      question: 'When would you use JavaScript hooks instead of CSS classes, and how do you avoid Vue waiting on CSS?',
      answer: 'Use JS hooks (@enter, @leave, etc.) for physics/spring libraries (GSAP, Motion) or DOM measurement-based animations. Set :css="false" so Vue skips class application and CSS-duration detection and relies entirely on you calling the done callback to signal completion.',
      explanation: 'Senior signal: knowing :css="false" turns off CSS detection so the animation is fully JS-driven, and that done must be called or the element never finishes its transition.',
    },
    {
      level: 'senior',
      question: 'Why might a Transition appear to "not work" or skip its animation, and how do you debug it?',
      answer: 'Common causes: more than one root element inside <Transition> (it only animates a single node), no v-if/v-show/key actually changing, the *-active class missing the transition property, display:none being toggled outside Vue, or the element entering without appear on first render. Debug by inspecting the DOM during the toggle to confirm the classes are being added and the CSS rule matches.',
      explanation: 'This tests whether the candidate understands the single-child rule, the trigger requirement, and the active-class transition property — the three things that silently break transitions.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is <Transition> different from <TransitionGroup>?',
    'How do you animate the very first render of an element? (the appear prop)',
    'Can you transition between two different elements? (v-if/v-else with distinct keys, or dynamic component)',
    'How do you provide custom transition class names (e.g. when using Animate.css)?',
    'How does <Transition> interact with <Suspense> and route transitions?',
    'What happens if the wrapped child has no CSS transition and no JS hook? (it enters/leaves instantly)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Putting multiple sibling elements directly inside <Transition>.',
      why: '<Transition> can only animate a single element/component; multiple roots are ignored or error. It needs one node to track.',
      fix: 'Wrap siblings in a single root element, or use v-if/v-else so only one is present, or switch to <TransitionGroup> for lists.',
    },
    {
      mistake: 'Forgetting the transition property on the *-active class.',
      why: 'The *-from/*-to classes only set start/end values; without transition on the active class the browser jumps instantly with no animation.',
      fix: 'Always define transition (or animation) on *-enter-active and *-leave-active.',
    },
    {
      mistake: 'Expecting the enter animation to run on the initial page load.',
      why: 'By default <Transition> only animates subsequent enters/leaves, not the first mount.',
      fix: 'Add the appear prop (and optionally appear-* classes) to animate the initial render.',
    },
    {
      mistake: 'Toggling display:none yourself or using v-show with a transform that has no transition while expecting v-if behavior.',
      why: 'v-show keeps the element in the DOM and only toggles display, so leave does not remove it — and any out-of-band display changes bypass Vue\'s class timing.',
      fix: 'Use v-if when you want enter/leave with DOM removal, and let <Transition> own the display toggle for v-show.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Core building block for modals, drawers, dropdowns, toasts, and tooltips — wrap the conditionally-rendered element and animate opacity/transform.' },
    { area: 'Component library', detail: 'Libraries like Vuetify, PrimeVue, and Headless UI port their overlay components on <Transition>, often exposing transition name/class props so consumers can theme the animation.' },
    { area: 'Vue Router', detail: 'Animated page/route changes wrap <RouterView> in <Transition> (usually mode="out-in") so leaving and entering pages fade/slide cleanly without overlap.' },
    { area: 'Nuxt', detail: 'Nuxt exposes pageTransition / layoutTransition config that compiles down to <Transition> wrappers around the page and layout, giving app-wide route animations declaratively.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Animating opacity and transform is GPU-compositable and cheap — <Transition> encourages exactly these properties.',
      'No JS animation loop is needed; the browser drives the CSS transition, so the main thread stays free.',
    ],
    bad: [
      'Animating layout properties (width, height, top, margin) inside transition classes triggers reflow on every frame and causes jank.',
      'Many simultaneous transitions (e.g. dozens of toasts) each add a node and listener, increasing work.',
    ],
    optimizations: [
      'Prefer transform/opacity over width/height/top; use will-change sparingly for heavy transitions.',
      'Use :duration or transitionend rather than overlong durations so nodes are removed promptly.',
      'For lists, use <TransitionGroup> with FLIP (it animates moves with transform) instead of per-item <Transition>.',
      'Drop :css="false" + JS hooks only when you truly need physics; otherwise CSS transitions are lighter.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['v-if-v-show', 'class-style-bindings', 'components-basics'],
    nextConcepts: ['transition-group', 'teleport', 'dynamic-components', 'keepalive'],
    dependencyNote:
      'Transition builds directly on conditional rendering (v-if/v-show) and class bindings — you must understand when an element enters/leaves the DOM before you can animate it. It leads naturally to TransitionGroup for lists and pairs with Teleport for modals/overlays.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box labelled <Transition> with a single child element guarded by v-if inside it.',
      'Below, draw a timeline with two phases: ENTER and LEAVE.',
      'For ENTER, write three stops: enter-from (start), enter-active (transition rule), enter-to (end).',
      'For LEAVE, write leave-from, leave-active, leave-to, and add a note "node removed only after transitionend".',
      'Say: "Vue swaps -from for -to on the next frame so the browser sees a change and animates; it reads the CSS duration to know when to remove the node."',
    ],
    diagram: `  <Transition name="fade">  ──► single child via v-if
      │
   ENTER:  fade-enter-from ─► (next frame) ─► fade-enter-to
              (opacity 0)      fade-enter-active     (opacity 1)
                                 transition:opacity .3s
   LEAVE:  fade-leave-from ─► (next frame) ─► fade-leave-to ─► REMOVE
              (opacity 1)      fade-leave-active     (opacity 0)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    '<Transition> wraps a single element and animates it entering or leaving the DOM via v-if, v-show, dynamic component, or a changing key. It applies six classes — enter-from/active/to and leave-from/active/to — and your CSS on those classes does the visual work. Vue reads the CSS duration to delay removal until the leave animation finishes. Use the appear prop for first-render animation and mode="out-in" to swap views without overlap. The single-child rule and a transition property on the *-active class are the two things people forget.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    '<Transition> is Vue\'s built-in component for animating a single element or component as it enters or leaves the DOM. The trigger is some reactive change — v-if, v-show, a dynamic <component :is>, or a changing :key. When the element enters, Vue applies three classes in sequence across animation frames: enter-from is the starting style, it inserts the element, then on the next frame it swaps enter-from for enter-to while enter-active holds the transition rule, so the browser animates from start to end. Leaving mirrors this with leave-from, leave-active, and leave-to, and crucially Vue delays removing the node until the transition finishes — it figures out the duration by reading the CSS transition-duration or by listening for transitionend, with the duration as a fallback. You can name your transition to change the class prefix, add appear to animate the first render, and use mode out-in or in-out to coordinate two transitioning elements so they don\'t overlap. For fully custom animations you pass JavaScript hooks like enter and leave plus :css="false", and you must call the done callback yourself. The classic mistakes are putting more than one root element inside it — it only animates a single node — and forgetting the transition property on the active class, which makes the animation silently jump. In production it underpins modals, drawers, toasts, and route transitions.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'CSS-driven transitions are cheap and declarative but limited to keyframe/timing-function curves; JS hooks with :css="false" unlock spring physics at the cost of more code and main-thread work.',
      'v-if (animate + remove from DOM) vs v-show (animate + display:none) is a memory/perf tradeoff: v-show keeps the node mounted (faster re-show, more DOM) while v-if frees it.',
    ],
    edgeCases: [
      'Transitioning between two elements requires distinct keys or v-if/v-else; same-tag elements without keys may be reused and skip the transition.',
      'Nested transitions and explicit :duration={ enter, leave } let you set different enter/leave timings or wait on inner elements.',
      'Interrupting a transition mid-flight (rapid toggling) cancels and reverses — Vue handles class cleanup but your CSS must be reversible to look right.',
      'appear has its own appear-from/active/to classes and hooks if you want the first render to differ from later enters.',
    ],
    runtimeBehavior: [
      'Vue uses a double-requestAnimationFrame (nextFrame) so the browser registers enter-from before enter-to is applied — without it the transition would not start.',
      'Duration detection parses computed transition/animation durations and takes the longest; an explicit :duration short-circuits this.',
      'With JS hooks and :css="false", the done callback is the sole completion signal — forgetting to call it leaves the element stuck mid-transition.',
    ],
    scalability: [
      'For many elements, a single <Transition> per item is fine but <TransitionGroup> with FLIP is better for lists where items also move.',
      'Route-level transitions wrap <RouterView>; with KeepAlive plus Transition, cached components re-enter without re-mounting, changing the timing model.',
    ],
    productionConcerns: [
      'Reduced-motion accessibility: gate or shorten transitions behind prefers-reduced-motion so animations do not harm users with vestibular sensitivity.',
      'SSR: transitions are client-only effects; ensure initial markup matches to avoid hydration mismatches, and use appear deliberately.',
      'Layout-shifting transitions (animating height/width) hurt CLS and perceived performance — prefer transform.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '<Transition> animates a SINGLE element entering/leaving the DOM.',
    'Triggers: v-if, v-show, dynamic <component :is>, changing :key.',
    'Six classes: *-enter-from/active/to, *-leave-from/active/to.',
    'name prop changes the v- prefix (name="fade" → fade-*).',
    '*-from = start style, *-to = end style, *-active = transition rule.',
    'Put transition/animation on the *-active class or nothing animates.',
    'appear → animate the first render too.',
    'mode="out-in" → old leaves & removes before new enters (no overlap).',
    'Vue reads CSS duration / transitionend to delay removal; override with :duration.',
    'JS hooks (@enter/@leave) + :css="false" + done() for custom/physics animations.',
    'Prefer animating opacity/transform (cheap) over width/height (reflow).',
    'For lists that reorder, use <TransitionGroup>, not <Transition>.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Wrap a paragraph toggled by a boolean ref in a <Transition> named "fade" so it fades over 200ms.',
      hint: 'name="fade" → fade-enter-active/fade-leave-active for the transition, fade-enter-from/fade-leave-to for opacity 0.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst show = ref(true)\n</script>\n<template>\n  <button @click="show = !show">Toggle</button>\n  <Transition name="fade">\n    <p v-if="show">Hi</p>\n  </Transition>\n</template>\n<style>\n.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }\n.fade-enter-from, .fade-leave-to { opacity: 0; }\n</style>',
        explanation: [
          'The boolean ref drives v-if which triggers the transition.',
          'The active classes hold the 0.2s opacity transition; the from/to classes set opacity 0.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make a transition that animates the first render (initial mount) as well as subsequent toggles.',
      hint: 'There is a single prop for this.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <Transition name="fade" appear>\n    <div v-if="visible">Animated on mount too</div>\n  </Transition>\n</template>\n<style>\n.fade-enter-active, .fade-leave-active { transition: opacity .3s; }\n.fade-enter-from, .fade-leave-to { opacity: 0; }\n</style>',
        explanation: [
          'The appear prop runs the enter transition on initial render.',
          'Without appear, the element would just be present on first paint with no animation.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Drive a transition entirely with JavaScript hooks (no CSS) using a done callback, fading opacity from 0 to 1 over 300ms on enter.',
      hint: 'Use :css="false" and call done() when finished.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nfunction onEnter(el, done) {\n  el.style.opacity = \'0\'\n  el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 })\n    .onfinish = () => { el.style.opacity = \'1\'; done() }\n}\nfunction onLeave(el, done) {\n  el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).onfinish = done\n}\n</script>\n<template>\n  <Transition :css="false" @enter="onEnter" @leave="onLeave">\n    <div v-if="show">JS-driven</div>\n  </Transition>\n</template>',
        explanation: [
          ':css="false" tells Vue to skip class application and CSS duration detection.',
          'The done callback is the only completion signal — Vue waits for it before finishing enter/leave.',
          'The Web Animations API drives the visual change here instead of CSS.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build an animated tab swap where switching tabs cross-fades the content with no overlap between the leaving and entering view.',
      hint: 'Changing :key triggers leave+enter; mode="out-in" prevents overlap.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst tab = ref(\'home\')\n</script>\n<template>\n  <nav>\n    <button @click="tab = \'home\'">Home</button>\n    <button @click="tab = \'about\'">About</button>\n  </nav>\n  <Transition name="fade" mode="out-in">\n    <section :key="tab">{{ tab === \'home\' ? \'Home content\' : \'About content\' }}</section>\n  </Transition>\n</template>\n<style>\n.fade-enter-active, .fade-leave-active { transition: opacity .2s; }\n.fade-enter-from, .fade-leave-to { opacity: 0; }\n</style>',
        explanation: [
          'A changing :key makes Vue unmount the old section and mount a new one, firing leave then enter.',
          'mode="out-in" ensures the leaving section fully fades out and is removed before the new one fades in.',
          'This is the standard pattern for animated tabbed/routed content.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Animation polish separates a "works" app from a "feels great" app, and <Transition> is how Vue developers add that polish without reaching for heavy libraries. Knowing it well signals you can build production overlays, modals, and route transitions that feel native.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) typically ask you to name the transition classes and add a fade to a toggle. Product companies (Zoho, Flipkart, Razorpay) ask you to build an animated modal or tab swap and explain out-in mode. FAANG-level interviews probe the double-rAF timing, duration detection, :css="false" + done semantics, and accessibility (prefers-reduced-motion).',
    whatInterviewersExpect:
      'They expect you to know the single-child rule, the six classes and what each does, what triggers a transition, how Vue delays removal, and when to reach for JS hooks vs CSS — plus the appear prop and out-in mode for real scenarios.',
  },
}

export default transition
