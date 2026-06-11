import type { ConceptCategory, ConceptMap } from '../../types/knowledge'

export const jsCategories: ConceptCategory[] = [
  { slug: 'fundamentals-engine', title: 'Fundamentals & Engine', description: 'What JS is, the spec, and how V8 actually runs your code.', order: 1 },
  { slug: 'memory-model', title: 'Memory Model', description: 'Stack vs heap, garbage collection, and how memory leaks really happen.', order: 2 },
  { slug: 'types-coercion', title: 'Variables, Types & Coercion', description: 'var/let/const, the type system, equality and the coercion rules behind trick questions.', order: 3 },
  { slug: 'execution-model', title: 'Execution Model', description: 'The interview core: execution contexts, scope, hoisting, closures and this.', order: 4 },
  { slug: 'functions', title: 'Functions', description: 'First-class functions: HOFs, currying, memoization, recursion, generators.', order: 5 },
  { slug: 'objects-prototypes', title: 'Objects & Prototypes', description: 'Delegation, the prototype chain, classes, copying and Proxy.', order: 6 },
  { slug: 'async', title: 'Asynchronous JavaScript', description: 'Event loop, task queues, promises, async/await, cancellation and concurrency.', order: 7 },
  { slug: 'iteration-collections', title: 'Iteration & Collections', description: 'Array methods, Map/Set, iteration protocols and JSON.', order: 8 },
  { slug: 'modules', title: 'Modules', description: 'ESM vs CJS, live bindings, tree shaking, dynamic import and circular deps.', order: 9 },
  { slug: 'browser-dom', title: 'Browser & DOM', description: 'Events, delegation, the rendering pipeline, storage and browser APIs.', order: 10 },
  { slug: 'performance', title: 'Performance', description: 'Debounce/throttle, scheduling, workers, virtualization and code splitting.', order: 11 },
  { slug: 'errors-debugging', title: 'Error Handling & Debugging', description: 'Error design, global handlers and DevTools workflows — the overlooked category.', order: 12 },
  { slug: 'security', title: 'Security', description: 'XSS, CSRF, CORS, token storage and prototype pollution — attack → defense.', order: 13 },
  { slug: 'design-patterns', title: 'Design Patterns in JS', description: 'Module, factory, singleton, observer/emitter and strategy — the JS way.', order: 14 },
]

export const vueCategories: ConceptCategory[] = [
  { slug: 'fundamentals', title: 'Fundamentals & Mental Model', description: 'What Vue is, the app instance, declarative rendering, and Options vs Composition API.', order: 1 },
  { slug: 'reactivity', title: 'Reactivity System', description: 'The heart of Vue: ref/reactive, Proxy tracking, computed, and watchers.', order: 2 },
  { slug: 'templates', title: 'Templates & Directives', description: 'Template syntax, bindings, conditionals, lists, events, v-model and custom directives.', order: 3 },
  { slug: 'components', title: 'Components', description: 'Props down, events up, slots, provide/inject and dynamic/async components.', order: 4 },
  { slug: 'composition-api', title: 'Composition API', description: 'setup, <script setup>, composables and logic reuse — the modern idiom.', order: 5 },
  { slug: 'lifecycle-rendering', title: 'Lifecycle & Rendering', description: 'Lifecycle hooks, the virtual DOM, render functions, nextTick and the reactivity-to-render link.', order: 6 },
  { slug: 'built-in', title: 'Built-in Components', description: 'KeepAlive, Teleport, Suspense, Transition and special attributes.', order: 7 },
  { slug: 'routing', title: 'Routing (Vue Router)', description: 'Routes, params, nesting, navigation guards and lazy-loaded views.', order: 8 },
  { slug: 'state', title: 'State Management', description: 'Local state, provide/inject, shared composables and Pinia.', order: 9 },
  { slug: 'performance', title: 'Performance', description: 'Lazy loading, computed caching, v-memo, list and reactivity performance.', order: 10 },
  { slug: 'forms-async', title: 'Forms, Async & Data', description: 'Form handling, data fetching patterns, error handling and SSR/hydration.', order: 11 },
  { slug: 'testing', title: 'Testing', description: 'Unit, component and e2e testing plus testing composables.', order: 12 },
  { slug: 'patterns', title: 'Patterns & Architecture', description: 'Component design, headless/compound components and project structure.', order: 13 },
  { slug: 'ecosystem', title: 'Ecosystem & Tooling', description: 'Vite, DevTools, TypeScript, Nuxt and component styling.', order: 14 },
]

const maps: Record<string, () => Promise<ConceptMap>> = {
  javascript: async () => {
    const [a, b, c, d] = await Promise.all([
      import('./js-concepts-foundations'),
      import('./js-concepts-core'),
      import('./js-concepts-async-modules'),
      import('./js-concepts-browser-patterns'),
    ])
    return {
      techId: 'javascript',
      categories: jsCategories,
      concepts: [...a.concepts, ...b.concepts, ...c.concepts, ...d.concepts],
    }
  },
  vue: async () => {
    const [a, b, c, d] = await Promise.all([
      import('./vue-concepts-foundations'),
      import('./vue-concepts-components'),
      import('./vue-concepts-rendering-routing'),
      import('./vue-concepts-advanced'),
    ])
    return {
      techId: 'vue',
      categories: vueCategories,
      concepts: [...a.concepts, ...b.concepts, ...c.concepts, ...d.concepts],
    }
  },
}

const cache = new Map<string, ConceptMap>()

export function hasConceptMap(techId: string): boolean {
  return techId in maps
}

export async function loadConceptMap(techId: string): Promise<ConceptMap | null> {
  if (cache.has(techId)) return cache.get(techId)!
  const loader = maps[techId]
  if (!loader) return null
  const map = await loader()
  cache.set(techId, map)
  return map
}
