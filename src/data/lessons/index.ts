import type { ConceptLesson } from '../../types/lesson'

/**
 * Registry of full 24-section "mentor" lessons, keyed by `${techId}/${slug}`.
 * A concept in the knowledge map may optionally have a lesson here; the
 * Knowledge Map shows an "Open full lesson" link when one exists, and the
 * route /<techId>/<slug> renders the dedicated lesson page.
 *
 * AUTO-GENERATED entries for JavaScript (all 126 concepts).
 */
const loaders: Record<string, () => Promise<{ default: ConceptLesson }>> = {
  'javascript/abortcontroller': () => import('./javascript/abortcontroller'),
  'javascript/array-methods': () => import('./javascript/array-methods'),
  'javascript/arrow-functions': () => import('./javascript/arrow-functions'),
  'javascript/async-await': () => import('./javascript/async-await'),
  'javascript/async-error-handling': () => import('./javascript/async-error-handling'),
  'javascript/bigint': () => import('./javascript/bigint'),
  'javascript/bom': () => import('./javascript/bom'),
  'javascript/browser-rendering-pipeline': () => import('./javascript/browser-rendering-pipeline'),
  'javascript/bundlers-module-resolution': () => import('./javascript/bundlers-module-resolution'),
  'javascript/call-apply-bind': () => import('./javascript/call-apply-bind'),
  'javascript/call-stack': () => import('./javascript/call-stack'),
  'javascript/callback-hell': () => import('./javascript/callback-hell'),
  'javascript/callbacks': () => import('./javascript/callbacks'),
  'javascript/circular-dependencies': () => import('./javascript/circular-dependencies'),
  'javascript/clickjacking': () => import('./javascript/clickjacking'),
  'javascript/closure': () => import('./javascript/closure'),
  'javascript/code-splitting-lazy-loading': () => import('./javascript/code-splitting-lazy-loading'),
  'javascript/commonjs': () => import('./javascript/commonjs'),
  'javascript/concurrency-patterns': () => import('./javascript/concurrency-patterns'),
  'javascript/constructor-functions-new': () => import('./javascript/constructor-functions-new'),
  'javascript/core-web-vitals': () => import('./javascript/core-web-vitals'),
  'javascript/cors': () => import('./javascript/cors'),
  'javascript/csp': () => import('./javascript/csp'),
  'javascript/csrf': () => import('./javascript/csrf'),
  'javascript/currying-partial-application': () => import('./javascript/currying-partial-application'),
  'javascript/custom-errors-cause': () => import('./javascript/custom-errors-cause'),
  'javascript/custom-events': () => import('./javascript/custom-events'),
  'javascript/data-types': () => import('./javascript/data-types'),
  'javascript/debounce': () => import('./javascript/debounce'),
  'javascript/default-rest-spread': () => import('./javascript/default-rest-spread'),
  'javascript/destructuring': () => import('./javascript/destructuring'),
  'javascript/devtools-debugging': () => import('./javascript/devtools-debugging'),
  'javascript/dom': () => import('./javascript/dom'),
  'javascript/dynamic-imports': () => import('./javascript/dynamic-imports'),
  'javascript/ecmascript': () => import('./javascript/ecmascript'),
  'javascript/equality-comparison': () => import('./javascript/equality-comparison'),
  'javascript/error-types-try-catch': () => import('./javascript/error-types-try-catch'),
  'javascript/es-modules': () => import('./javascript/es-modules'),
  'javascript/es6-classes': () => import('./javascript/es6-classes'),
  'javascript/esm-vs-cjs': () => import('./javascript/esm-vs-cjs'),
  'javascript/event-delegation': () => import('./javascript/event-delegation'),
  'javascript/event-emitter': () => import('./javascript/event-emitter'),
  'javascript/event-loop': () => import('./javascript/event-loop'),
  'javascript/event-loop-starvation': () => import('./javascript/event-loop-starvation'),
  'javascript/event-system': () => import('./javascript/event-system'),
  'javascript/execution-context': () => import('./javascript/execution-context'),
  'javascript/factory-pattern': () => import('./javascript/factory-pattern'),
  'javascript/fetch-api': () => import('./javascript/fetch-api'),
  'javascript/function-composition': () => import('./javascript/function-composition'),
  'javascript/function-declaration-vs-expression': () => import('./javascript/function-declaration-vs-expression'),
  'javascript/garbage-collection': () => import('./javascript/garbage-collection'),
  'javascript/generators': () => import('./javascript/generators'),
  'javascript/global-error-handlers': () => import('./javascript/global-error-handlers'),
  'javascript/hidden-classes-inline-caches': () => import('./javascript/hidden-classes-inline-caches'),
  'javascript/higher-order-functions': () => import('./javascript/higher-order-functions'),
  'javascript/history-api': () => import('./javascript/history-api'),
  'javascript/hoisting': () => import('./javascript/hoisting'),
  'javascript/ieee-754-floating-point': () => import('./javascript/ieee-754-floating-point'),
  'javascript/iife': () => import('./javascript/iife'),
  'javascript/inheritance-patterns': () => import('./javascript/inheritance-patterns'),
  'javascript/iterables-iterators': () => import('./javascript/iterables-iterators'),
  'javascript/javascript-engines': () => import('./javascript/javascript-engines'),
  'javascript/jit-compilation': () => import('./javascript/jit-compilation'),
  'javascript/json-serialization': () => import('./javascript/json-serialization'),
  'javascript/lexical-environment': () => import('./javascript/lexical-environment'),
  'javascript/list-virtualization': () => import('./javascript/list-virtualization'),
  'javascript/long-task-scheduling': () => import('./javascript/long-task-scheduling'),
  'javascript/macrotask-queue': () => import('./javascript/macrotask-queue'),
  'javascript/map-vs-object': () => import('./javascript/map-vs-object'),
  'javascript/memoization': () => import('./javascript/memoization'),
  'javascript/memory-leaks': () => import('./javascript/memory-leaks'),
  'javascript/memory-profiling': () => import('./javascript/memory-profiling'),
  'javascript/microtask-queue': () => import('./javascript/microtask-queue'),
  'javascript/module-pattern': () => import('./javascript/module-pattern'),
  'javascript/null-vs-undefined': () => import('./javascript/null-vs-undefined'),
  'javascript/object-creation': () => import('./javascript/object-creation'),
  'javascript/object-immutability': () => import('./javascript/object-immutability'),
  'javascript/observer-pattern': () => import('./javascript/observer-pattern'),
  'javascript/observers': () => import('./javascript/observers'),
  'javascript/optional-chaining-nullish': () => import('./javascript/optional-chaining-nullish'),
  'javascript/primitive-vs-reference': () => import('./javascript/primitive-vs-reference'),
  'javascript/promise-combinators': () => import('./javascript/promise-combinators'),
  'javascript/promises': () => import('./javascript/promises'),
  'javascript/property-descriptors': () => import('./javascript/property-descriptors'),
  'javascript/prototype': () => import('./javascript/prototype'),
  'javascript/prototype-chain': () => import('./javascript/prototype-chain'),
  'javascript/prototype-pollution': () => import('./javascript/prototype-pollution'),
  'javascript/proxy-reflect': () => import('./javascript/proxy-reflect'),
  'javascript/pure-functions': () => import('./javascript/pure-functions'),
  'javascript/recursion': () => import('./javascript/recursion'),
  'javascript/requestanimationframe': () => import('./javascript/requestanimationframe'),
  'javascript/scope': () => import('./javascript/scope'),
  'javascript/scope-chain': () => import('./javascript/scope-chain'),
  'javascript/script-loading': () => import('./javascript/script-loading'),
  'javascript/secure-token-storage': () => import('./javascript/secure-token-storage'),
  'javascript/service-workers': () => import('./javascript/service-workers'),
  'javascript/set-operations': () => import('./javascript/set-operations'),
  'javascript/shallow-vs-deep-copy': () => import('./javascript/shallow-vs-deep-copy'),
  'javascript/singleton-pattern': () => import('./javascript/singleton-pattern'),
  'javascript/stack-vs-heap': () => import('./javascript/stack-vs-heap'),
  'javascript/storage-apis': () => import('./javascript/storage-apis'),
  'javascript/strategy-pattern': () => import('./javascript/strategy-pattern'),
  'javascript/strict-mode': () => import('./javascript/strict-mode'),
  'javascript/supply-chain-security': () => import('./javascript/supply-chain-security'),
  'javascript/symbol': () => import('./javascript/symbol'),
  'javascript/sync-vs-async': () => import('./javascript/sync-vs-async'),
  'javascript/tagged-templates': () => import('./javascript/tagged-templates'),
  'javascript/template-literals': () => import('./javascript/template-literals'),
  'javascript/temporal-dead-zone': () => import('./javascript/temporal-dead-zone'),
  'javascript/this-keyword': () => import('./javascript/this-keyword'),
  'javascript/throttle': () => import('./javascript/throttle'),
  'javascript/timers': () => import('./javascript/timers'),
  'javascript/top-level-await': () => import('./javascript/top-level-await'),
  'javascript/tree-shaking': () => import('./javascript/tree-shaking'),
  'javascript/truthy-falsy': () => import('./javascript/truthy-falsy'),
  'javascript/type-coercion': () => import('./javascript/type-coercion'),
  'javascript/typed-arrays': () => import('./javascript/typed-arrays'),
  'javascript/typeof-instanceof': () => import('./javascript/typeof-instanceof'),
  'javascript/v8-architecture': () => import('./javascript/v8-architecture'),
  'javascript/var-let-const': () => import('./javascript/var-let-const'),
  'javascript/weakmap-weakset': () => import('./javascript/weakmap-weakset'),
  'javascript/weakref-finalizationregistry': () => import('./javascript/weakref-finalizationregistry'),
  'javascript/web-workers': () => import('./javascript/web-workers'),
  'javascript/websocket-sse': () => import('./javascript/websocket-sse'),
  'javascript/what-is-javascript': () => import('./javascript/what-is-javascript'),
  'javascript/xss': () => import('./javascript/xss'),
}

const cache = new Map<string, ConceptLesson>()

export function hasLesson(techId: string, slug: string): boolean {
  return `${techId}/${slug}` in loaders
}

/** Set of slugs (for a tech) that have a full lesson — used to badge the map. */
export function lessonSlugs(techId: string): Set<string> {
  const prefix = `${techId}/`
  return new Set(
    Object.keys(loaders)
      .filter((k) => k.startsWith(prefix))
      .map((k) => k.slice(prefix.length)),
  )
}

export async function loadLesson(techId: string, slug: string): Promise<ConceptLesson | null> {
  const key = `${techId}/${slug}`
  if (cache.has(key)) return cache.get(key)!
  const loader = loaders[key]
  if (!loader) return null
  const mod = await loader()
  cache.set(key, mod.default)
  return mod.default
}
