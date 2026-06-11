# Vue.js Knowledge Architecture

> Designed as a Staff Engineer + Interviewer + Curriculum Designer would: a complete concept map for
> **Vue.js (Vue 3, Composition API first)** from beginner to senior/expert. Mirrors the structure of
> `docs/javascript-knowledge-architecture.md`. Slugs are kebab-case and route-ready (`/vue/<slug>`).
>
> Scope note: Vue 3 is the default. Vue 2 / Options API appears where it carries real interview signal
> (migration, `<script setup>` vs Options, reactivity rewrite). Router and Pinia are first-class because
> real Vue interviews always cover them; deep build-tool internals stay light (covered by the JS hub).

---

## 1. Hierarchical Knowledge Tree

```
Vue.js
├── 1. Fundamentals & Mental Model
│   ├── what-is-vue
│   ├── progressive-framework
│   ├── vue-instance-app
│   ├── declarative-rendering
│   ├── vue2-vs-vue3
│   └── options-vs-composition-api
│
├── 2. Reactivity System
│   ├── reactivity-fundamentals
│   ├── ref
│   ├── reactive
│   ├── ref-vs-reactive
│   ├── proxy-reactivity
│   ├── computed
│   ├── watch
│   ├── watcheffect
│   ├── watch-vs-watcheffect
│   ├── shallowref-shallowreactive
│   ├── toref-torefs
│   ├── readonly-reactivity
│   ├── reactivity-caveats
│   └── reactivity-transform
│
├── 3. Templates & Directives
│   ├── template-syntax
│   ├── interpolation-expressions
│   ├── v-bind
│   ├── v-if-v-show
│   ├── v-for
│   ├── v-for-key
│   ├── v-on-events
│   ├── event-modifiers
│   ├── v-model
│   ├── class-style-bindings
│   ├── custom-directives
│   └── template-refs
│
├── 4. Components
│   ├── components-basics
│   ├── single-file-components
│   ├── props
│   ├── prop-validation
│   ├── component-events
│   ├── v-model-components
│   ├── slots
│   ├── scoped-slots
│   ├── dynamic-components
│   ├── async-components
│   ├── provide-inject
│   ├── component-registration
│   ├── attribute-fallthrough
│   └── recursive-components
│
├── 5. Composition API
│   ├── setup-function
│   ├── script-setup
│   ├── composables
│   ├── lifecycle-hooks-composition
│   ├── dependency-injection-composition
│   ├── composition-reuse-patterns
│   └── composition-vs-mixins
│
├── 6. Lifecycle & Rendering
│   ├── lifecycle-hooks
│   ├── mounting-process
│   ├── virtual-dom
│   ├── render-functions
│   ├── jsx-in-vue
│   ├── nexttick
│   ├── template-compilation
│   └── reactivity-render-link
│
├── 7. Built-in Components & Features
│   ├── keepalive
│   ├── teleport
│   ├── suspense
│   ├── transition
│   ├── transition-group
│   └── built-in-special-attributes
│
├── 8. Routing (Vue Router)
│   ├── vue-router-basics
│   ├── dynamic-routes
│   ├── nested-routes
│   ├── navigation-guards
│   ├── programmatic-navigation
│   ├── route-meta-lazy-loading
│   └── route-params-query
│
├── 9. State Management
│   ├── state-management-overview
│   ├── pinia-basics
│   ├── pinia-vs-vuex
│   ├── pinia-stores-actions
│   ├── provide-inject-state
│   └── state-sharing-composables
│
├── 10. Performance & Optimization
│   ├── vue-performance-overview
│   ├── lazy-loading-components
│   ├── v-once-v-memo
│   ├── computed-caching
│   ├── list-rendering-performance
│   ├── reactivity-performance
│   └── bundle-optimization
│
├── 11. Forms, Async & Data
│   ├── form-handling
│   ├── data-fetching-patterns
│   ├── error-handling-vue
│   └── ssr-hydration
│
├── 12. Testing
│   ├── testing-overview
│   ├── component-testing
│   ├── testing-composables
│   └── e2e-testing-vue
│
├── 13. Patterns & Architecture
│   ├── component-design-patterns
│   ├── smart-dumb-components
│   ├── render-props-vue
│   ├── higher-order-components-vue
│   ├── compound-components
│   ├── headless-components
│   └── project-structure
│
└── 14. Ecosystem & Tooling
    ├── vite-vue
    ├── vue-devtools
    ├── typescript-with-vue
    ├── nuxt-overview
    └── vue-style-options
```

---

## 2. Dependency Graph — The Learning Spines

A few prerequisite "spines" carry most interview weight. Learn along these before branching.

### Spine 1 — Reactivity (the heart of every Vue interview)
`reactivity-fundamentals` → `ref` / `reactive` → `ref-vs-reactive` → `proxy-reactivity` → `computed` →
`watch` / `watcheffect` → `reactivity-caveats` → `reactivity-render-link`.
Everything Vue does visually is downstream of reactivity. If a candidate can explain *why* `reactive` loses
reactivity on destructure and how `ref` + Proxy track dependencies, they understand Vue.

### Spine 2 — Components & Data Flow
`components-basics` → `props` → `component-events` → `v-model-components` → `slots` → `scoped-slots` →
`provide-inject`. The "props down, events up" model plus slots is the backbone of every component question.

### Spine 3 — Composition API & Reuse
`setup-function` → `script-setup` → `composables` → `composition-reuse-patterns` → `composition-vs-mixins`.
The modern idiom. Composables are *the* senior topic — closures + reactivity + lifecycle in one pattern.

### Spine 4 — Rendering & the Virtual DOM
`declarative-rendering` → `template-compilation` → `virtual-dom` → `render-functions` → `nexttick` →
`reactivity-render-link`. Explains how a `ref` change becomes a DOM patch, and why updates are async/batched.

### Spine 5 — Lifecycle
`vue-instance-app` → `lifecycle-hooks` → `mounting-process` → `lifecycle-hooks-composition` → `keepalive`.
Where to fetch data, set up/tear down side effects, and avoid leaks.

### Spine 6 — Routing & State
`vue-router-basics` → `dynamic-routes` → `nested-routes` → `navigation-guards` → `pinia-basics` →
`pinia-stores-actions`. The app-architecture layer every real project needs.

### Spine 7 — Performance
`vue-performance-overview` → `computed-caching` → `v-once-v-memo` → `lazy-loading-components` →
`list-rendering-performance` → `reactivity-performance`. The senior differentiator.

---

## 3. Concept Catalog

Per concept: slug · level · importance/interviewFrequency/realWorldUsage (1–5) · one-line definition ·
prerequisites → leadsTo. The Phase-B `ConceptNode[]` data carries the full `explanation[]` and `questions[]`.

### 1. Fundamentals & Mental Model  (category: `fundamentals`)
- **what-is-vue** — beginner — 4/3/5 — Progressive, reactive, component-based framework for building UIs. → `progressive-framework`, `declarative-rendering`, `reactivity-fundamentals`
- **progressive-framework** — beginner — 3/2/4 — Vue can be a `<script>` drop-in or a full SPA; adopt incrementally. ← `what-is-vue`
- **vue-instance-app** — beginner — 4/3/5 — `createApp(root)` creates an application instance you mount to the DOM. ← `what-is-vue` → `lifecycle-hooks`
- **declarative-rendering** — beginner — 4/3/5 — Describe UI as a function of state; Vue keeps the DOM in sync. ← `what-is-vue` → `template-syntax`, `virtual-dom`
- **vue2-vs-vue3** — intermediate — 4/4/4 — Proxy reactivity, Composition API, multiple roots, Fragments, faster runtime. ← `what-is-vue` → `options-vs-composition-api`, `proxy-reactivity`
- **options-vs-composition-api** — intermediate — 5/5/5 — Two authoring styles; Composition organizes by logical concern. ← `vue2-vs-vue3` → `setup-function`, `composables`

### 2. Reactivity System  (category: `reactivity`)
- **reactivity-fundamentals** — beginner — 5/5/5 — Vue tracks reads and re-runs effects on writes. → `ref`, `reactive`, `computed`
- **ref** — beginner — 5/5/5 — A reactive container whose `.value` holds any value. ← `reactivity-fundamentals` → `ref-vs-reactive`, `computed`, `template-refs`
- **reactive** — beginner — 5/5/5 — A deep reactive Proxy wrapper around an object. ← `reactivity-fundamentals` → `ref-vs-reactive`, `reactivity-caveats`
- **ref-vs-reactive** — intermediate — 5/5/5 — When to use each; why `reactive` loses reactivity on destructure. ← `ref`, `reactive` → `toref-torefs`
- **proxy-reactivity** — advanced — 5/4/3 — How Vue 3 uses ES Proxy + track/trigger to implement reactivity. ← `reactive` → `reactivity-caveats`, `reactivity-render-link`
- **computed** — beginner — 5/5/5 — Cached derived state that recomputes only when dependencies change. ← `ref` → `computed-caching`
- **watch** — intermediate — 5/5/5 — Run a callback when specific reactive sources change. ← `ref`, `reactive` → `watch-vs-watcheffect`
- **watcheffect** — intermediate — 4/4/4 — Auto-tracks dependencies and runs immediately. ← `reactivity-fundamentals` → `watch-vs-watcheffect`
- **watch-vs-watcheffect** — intermediate — 4/5/4 — Explicit-source + lazy vs auto-tracked + eager. ← `watch`, `watcheffect`
- **shallowref-shallowreactive** — advanced — 3/3/4 — Opt out of deep reactivity for performance / large structures. ← `ref`, `reactive` → `reactivity-performance`
- **toref-torefs** — intermediate — 4/4/5 — Keep reactivity when destructuring a reactive object / props. ← `ref-vs-reactive` → `composables`
- **readonly-reactivity** — intermediate — 3/2/4 — Create a read-only Proxy to prevent mutation. ← `reactive`
- **reactivity-caveats** — advanced — 4/4/4 — Array index / new property pitfalls and the Vue 3 Proxy fix. ← `reactive`, `proxy-reactivity`
- **reactivity-transform** — advanced — 2/2/2 — (Deprecated experiment) compiler sugar dropping `.value`; know its status. ← `ref` (overlooked)

### 3. Templates & Directives  (category: `templates`)
- **template-syntax** — beginner — 4/4/5 — HTML-based templates compiled to render functions. ← `declarative-rendering` → `interpolation-expressions`, `v-bind`
- **interpolation-expressions** — beginner — 3/3/5 — `{{ }}` mustaches and in-template JS expressions. ← `template-syntax`
- **v-bind** — beginner — 5/4/5 — Bind attributes/props to dynamic values (`:href`). ← `template-syntax` → `class-style-bindings`
- **v-if-v-show** — beginner — 5/5/5 — Conditional rendering vs CSS toggling; cost trade-off. ← `template-syntax`
- **v-for** — beginner — 5/5/5 — Render lists from arrays/objects. ← `template-syntax` → `v-for-key`, `list-rendering-performance`
- **v-for-key** — intermediate — 5/5/5 — Why stable keys matter for diffing/state. ← `v-for` → `virtual-dom`
- **v-on-events** — beginner — 5/4/5 — Listen to DOM/component events (`@click`). ← `template-syntax` → `event-modifiers`, `component-events`
- **event-modifiers** — beginner — 3/3/4 — `.prevent`, `.stop`, `.once`, key modifiers. ← `v-on-events`
- **v-model** — beginner — 5/5/5 — Two-way binding sugar over `:value` + `@input`. ← `v-bind`, `v-on-events` → `v-model-components`, `form-handling`
- **class-style-bindings** — beginner — 4/3/5 — Dynamic class/style via objects/arrays. ← `v-bind`
- **custom-directives** — advanced — 3/3/3 — Low-level DOM access via directive hooks. ← `template-syntax`, `lifecycle-hooks` (overlooked)
- **template-refs** — intermediate — 4/4/5 — `ref` to access a DOM element / child component. ← `ref` → `lifecycle-hooks`

### 4. Components  (category: `components`)
- **components-basics** — beginner — 5/5/5 — Reusable instances with their own state/template. ← `vue-instance-app` → `props`, `single-file-components`
- **single-file-components** — beginner — 5/4/5 — `.vue` files: template + script + style. ← `components-basics` → `script-setup`
- **props** — beginner — 5/5/5 — Pass data parent → child; one-way down. ← `components-basics` → `prop-validation`, `v-model-components`
- **prop-validation** — intermediate — 3/3/4 — Types, required, default, validators. ← `props`
- **component-events** — beginner — 5/5/5 — `emit` events child → parent. ← `components-basics`, `v-on-events` → `v-model-components`
- **v-model-components** — intermediate — 5/5/5 — Custom two-way binding via `modelValue` + `update:modelValue`. ← `v-model`, `component-events`
- **slots** — intermediate — 5/5/5 — Content projection from parent into child. ← `components-basics` → `scoped-slots`
- **scoped-slots** — advanced — 5/5/4 — Child exposes data to parent-defined slot content. ← `slots` → `headless-components`, `render-props-vue`
- **dynamic-components** — intermediate — 4/4/4 — `<component :is>` to swap components at runtime. ← `components-basics` → `keepalive`
- **async-components** — advanced — 4/4/5 — `defineAsyncComponent` for code-split, lazily loaded components. ← `components-basics` → `suspense`, `lazy-loading-components`
- **provide-inject** — intermediate — 4/4/4 — Pass data deep without prop drilling. ← `components-basics` → `dependency-injection-composition`, `provide-inject-state`
- **component-registration** — beginner — 3/2/4 — Global vs local registration trade-offs. ← `components-basics`
- **attribute-fallthrough** — intermediate — 3/3/3 — Non-prop attrs falling through to root; `inheritAttrs`. ← `props` (overlooked)
- **recursive-components** — advanced — 2/3/3 — Components that render themselves (trees/menus). ← `components-basics`, `component-registration`

### 5. Composition API  (category: `composition-api`)
- **setup-function** — intermediate — 5/4/4 — The Composition API entry point; returns state/methods. ← `options-vs-composition-api` → `script-setup`, `composables`
- **script-setup** — intermediate — 5/5/5 — Compile-time sugar; the modern default authoring style. ← `setup-function`, `single-file-components` → `composables`
- **composables** — advanced — 5/5/5 — Reusable stateful logic functions (`useXxx`). ← `script-setup`, `ref`, `lifecycle-hooks-composition` → `composition-reuse-patterns`, `state-sharing-composables`
- **lifecycle-hooks-composition** — intermediate — 4/4/5 — `onMounted`/`onUnmounted` etc. inside setup. ← `setup-function`, `lifecycle-hooks`
- **dependency-injection-composition** — intermediate — 3/3/4 — Typed `provide`/`inject` in Composition API. ← `provide-inject`, `setup-function`
- **composition-reuse-patterns** — advanced — 4/4/5 — Composing, returning refs, naming, SSR-safety. ← `composables` → `headless-components`
- **composition-vs-mixins** — intermediate — 4/4/3 — Why composables beat mixins (no name clashes, explicit). ← `composables` (overlooked)

### 6. Lifecycle & Rendering  (category: `lifecycle-rendering`)
- **lifecycle-hooks** — beginner — 5/5/5 — created/mounted/updated/unmounted phases. ← `vue-instance-app` → `mounting-process`, `lifecycle-hooks-composition`
- **mounting-process** — intermediate — 4/3/4 — How an app goes from `createApp` to live DOM. ← `lifecycle-hooks`, `vue-instance-app` → `virtual-dom`
- **virtual-dom** — advanced — 5/5/3 — In-memory VNode tree diffed to minimize DOM ops. ← `declarative-rendering`, `v-for-key` → `render-functions`, `reactivity-render-link`
- **render-functions** — advanced — 4/4/3 — Author components in JS with `h()` instead of templates. ← `virtual-dom` → `jsx-in-vue`
- **jsx-in-vue** — advanced — 2/2/3 — Using JSX/TSX as an alternative to templates. ← `render-functions` (overlooked)
- **nexttick** — intermediate — 4/5/4 — Await the next DOM flush after a reactive change. ← `reactivity-render-link` → `mounting-process`
- **template-compilation** — advanced — 4/4/3 — Templates compile to optimized render functions (hoisting, patch flags). ← `template-syntax` → `virtual-dom`
- **reactivity-render-link** — advanced — 5/4/3 — How a reactive change schedules a batched component re-render. ← `proxy-reactivity`, `virtual-dom` → `nexttick`, `reactivity-performance`

### 7. Built-in Components & Features  (category: `built-in`)
- **keepalive** — intermediate — 4/4/4 — Cache toggled components to preserve state. ← `dynamic-components`, `lifecycle-hooks`
- **teleport** — intermediate — 4/4/4 — Render content to a different DOM location (modals). ← `components-basics`
- **suspense** — advanced — 3/3/3 — Coordinate async component/setup loading states. ← `async-components` (overlooked)
- **transition** — intermediate — 4/4/4 — Animate enter/leave of a single element/component. ← `v-if-v-show`
- **transition-group** — intermediate — 3/3/4 — Animate list insert/remove/reorder. ← `transition`, `v-for`
- **built-in-special-attributes** — beginner — 2/2/3 — `key`, `ref`, `is` and their roles. ← `template-syntax` (overlooked)

### 8. Routing (Vue Router)  (category: `routing`)
- **vue-router-basics** — beginner — 5/5/5 — Client-side routing: routes, `<router-view>`, `<router-link>`. → `dynamic-routes`, `navigation-guards`
- **dynamic-routes** — intermediate — 4/4/5 — Path params (`/user/:id`) and matching. ← `vue-router-basics` → `route-params-query`
- **nested-routes** — intermediate — 4/4/4 — Child routes rendered in nested `<router-view>`. ← `vue-router-basics`
- **navigation-guards** — advanced — 5/5/5 — beforeEach/per-route/in-component hooks (auth). ← `vue-router-basics` → `route-meta-lazy-loading`
- **programmatic-navigation** — beginner — 4/4/5 — `router.push/replace` in code. ← `vue-router-basics`
- **route-meta-lazy-loading** — intermediate — 4/4/5 — `meta` fields + route-level code splitting. ← `navigation-guards`, `async-components`
- **route-params-query** — intermediate — 3/4/5 — Reading/reacting to `params` and `query`. ← `dynamic-routes`

### 9. State Management  (category: `state`)
- **state-management-overview** — intermediate — 4/4/5 — When local state, provide/inject, or a store fits. → `pinia-basics`, `state-sharing-composables`
- **pinia-basics** — intermediate — 5/5/5 — The official store: state/getters/actions, setup syntax. ← `state-management-overview`, `composables` → `pinia-stores-actions`
- **pinia-vs-vuex** — intermediate — 4/4/3 — Why Pinia replaced Vuex (TS, no mutations, simpler). ← `pinia-basics`
- **pinia-stores-actions** — intermediate — 4/4/5 — Defining stores, actions, async, composition. ← `pinia-basics`
- **provide-inject-state** — intermediate — 3/3/4 — App-level shared state without a library. ← `provide-inject`, `state-management-overview`
- **state-sharing-composables** — advanced — 4/4/5 — Module-scoped reactive state shared via a composable. ← `composables`, `state-management-overview` (overlooked)

### 10. Performance & Optimization  (category: `performance`)
- **vue-performance-overview** — advanced — 4/4/4 — Where Vue apps get slow and the levers to pull. → `computed-caching`, `list-rendering-performance`
- **lazy-loading-components** — intermediate — 4/4/5 — Defer/code-split components and routes. ← `async-components`, `route-meta-lazy-loading`
- **v-once-v-memo** — advanced — 3/3/3 — Skip re-render of static / unchanged subtrees. ← `virtual-dom`, `template-compilation` (overlooked)
- **computed-caching** — intermediate — 4/4/5 — Why computed beats methods for derived values. ← `computed`
- **list-rendering-performance** — advanced — 4/4/4 — Keys, virtualization, avoiding index keys. ← `v-for-key`, `virtual-dom`
- **reactivity-performance** — advanced — 4/3/3 — `shallowRef`, `markRaw`, large structures, over-reactivity. ← `shallowref-shallowreactive`, `reactivity-render-link`
- **bundle-optimization** — intermediate — 3/3/4 — Tree-shaking, async chunks, analyzing Vue bundles. ← `lazy-loading-components`, `vite-vue`

### 11. Forms, Async & Data  (category: `forms-async`)
- **form-handling** — beginner — 4/4/5 — `v-model` on inputs, validation, submission. ← `v-model` → `v-model-components`
- **data-fetching-patterns** — intermediate — 4/4/5 — Fetch in lifecycle/watchers/composables; loading/error. ← `lifecycle-hooks-composition`, `composables`
- **error-handling-vue** — advanced — 4/4/4 — `errorCaptured`, `onErrorCaptured`, global handler, boundaries. ← `lifecycle-hooks` (overlooked)
- **ssr-hydration** — advanced — 3/4/3 — Server render + client hydrate; mismatch pitfalls. ← `mounting-process`, `virtual-dom` → `nuxt-overview`

### 12. Testing  (category: `testing`)
- **testing-overview** — intermediate — 3/3/4 — Unit vs component vs e2e in Vue. → `component-testing`, `testing-composables`
- **component-testing** — intermediate — 4/4/4 — Vue Test Utils / Testing Library mounting & assertions. ← `testing-overview`, `components-basics`
- **testing-composables** — advanced — 3/3/4 — Testing reactive logic in isolation. ← `composables`, `testing-overview`
- **e2e-testing-vue** — intermediate — 2/2/4 — Cypress/Playwright flows for Vue apps. ← `testing-overview`

### 13. Patterns & Architecture  (category: `patterns`)
- **component-design-patterns** — advanced — 4/4/4 — Composition over inheritance; component API design. ← `props`, `slots`, `composables`
- **smart-dumb-components** — intermediate — 3/3/4 — Container/presentational separation. ← `components-basics`, `props`
- **render-props-vue** — advanced — 3/3/3 — Scoped slots as Vue's render-prop equivalent. ← `scoped-slots`
- **higher-order-components-vue** — advanced — 2/2/2 — Wrapping components; why composables usually win. ← `components-basics`, `composables` (overlooked)
- **compound-components** — advanced — 3/3/3 — Coordinated component sets sharing implicit state via provide/inject. ← `provide-inject`, `slots`
- **headless-components** — advanced — 4/3/4 — Logic-only components/composables exposing behavior, not markup. ← `scoped-slots`, `composables`
- **project-structure** — intermediate — 3/3/5 — Organizing features, stores, composables, components. ← `composables`, `pinia-basics`

### 14. Ecosystem & Tooling  (category: `ecosystem`)
- **vite-vue** — beginner — 3/3/5 — Vite as the default Vue build tool; dev server + HMR. → `bundle-optimization`
- **vue-devtools** — beginner — 3/2/5 — Inspect component tree, state, events, timeline. ← `vue-instance-app`
- **typescript-with-vue** — intermediate — 4/5/5 — Typing props/emits/refs, `defineProps<>()`, generics. ← `script-setup`, `props`
- **nuxt-overview** — intermediate — 3/4/4 — The meta-framework: SSR/SSG, file routing, server routes. ← `ssr-hydration`, `vue-router-basics`
- **vue-style-options** — beginner — 3/2/4 — `<style scoped>`, modules, deep selectors. ← `single-file-components`

---

## 4. Top Concepts for Senior Vue Developers (priority order)

1. reactivity-fundamentals · 2. ref-vs-reactive · 3. proxy-reactivity · 4. computed · 5. watch-vs-watcheffect ·
6. composables · 7. script-setup · 8. virtual-dom · 9. reactivity-render-link · 10. scoped-slots ·
11. v-model-components · 12. provide-inject · 13. nexttick · 14. lifecycle-hooks-composition ·
15. navigation-guards · 16. pinia-stores-actions · 17. async-components · 18. reactivity-caveats ·
19. v-for-key · 20. teleport · 21. keepalive · 22. suspense · 23. reactivity-performance ·
24. list-rendering-performance · 25. typescript-with-vue · 26. error-handling-vue · 27. ssr-hydration ·
28. headless-components · 29. state-sharing-composables · 30. template-compilation.

## 5. Top 20 Most Commonly Asked in Interviews

ref-vs-reactive · computed · watch-vs-watcheffect · v-model-components · props/component-events ·
slots / scoped-slots · composables · script-setup vs options-api · lifecycle-hooks · v-for-key ·
v-if-v-show · provide-inject · virtual-dom · nexttick · navigation-guards · pinia-basics ·
proxy-reactivity · async-components · keepalive · reactivity-caveats.

## 6. Overlooked Concepts (high senior-signal, low candidate-coverage)

`reactivity-caveats`, `attribute-fallthrough`, `custom-directives`, `jsx-in-vue`, `suspense`,
`composition-vs-mixins`, `state-sharing-composables`, `v-once-v-memo`, `error-handling-vue`,
`higher-order-components-vue`, `built-in-special-attributes`, `reactivity-transform`,
`render-props-vue`. These separate "used Vue" from "understands Vue".

## 7. Route Map

Every concept renders at `/vue/<slug>` (standalone "bare" lesson page) and appears in the Knowledge Map tab
at `/tech/vue/knowledge`. Slugs above are the canonical ids used in `ConceptNode.slug`, lesson filenames
(`src/data/lessons/vue/<slug>.ts`), and the lesson registry key (`vue/<slug>`).

Total: ~100 concepts across 14 categories.
