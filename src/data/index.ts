import type { TechCategory, Technology } from '../types/content'

export interface TechMeta {
  id: string
  name: string
  icon: string
  color: string
  category: TechCategory
}

/** Sidebar order follows the spec. Content modules are lazy-loaded per technology. */
export const techMetas: TechMeta[] = [
  { id: 'html', name: 'HTML', icon: 'H5', color: '#e34f26', category: 'frontend' },
  { id: 'css', name: 'CSS', icon: 'C3', color: '#1572b6', category: 'frontend' },
  { id: 'javascript', name: 'JavaScript', icon: 'JS', color: '#f7df1e', category: 'language' },
  { id: 'typescript', name: 'TypeScript', icon: 'TS', color: '#3178c6', category: 'language' },
  { id: 'vue', name: 'Vue.js', icon: 'V3', color: '#42b883', category: 'frontend' },
  { id: 'react', name: 'React.js', icon: 'Re', color: '#61dafb', category: 'frontend' },
  { id: 'nodejs', name: 'Node.js', icon: 'No', color: '#539e43', category: 'backend' },
  { id: 'express', name: 'Express.js', icon: 'Ex', color: '#888888', category: 'backend' },
  { id: 'postgresql', name: 'PostgreSQL', icon: 'Pg', color: '#336791', category: 'database' },
  { id: 'sql', name: 'SQL', icon: 'Sq', color: '#e38c00', category: 'database' },
  { id: 'aws', name: 'AWS', icon: 'Aw', color: '#ff9900', category: 'cloud' },
  { id: 'testing', name: 'Testing', icon: 'Te', color: '#99425b', category: 'quality' },
  { id: 'security', name: 'Security', icon: 'Se', color: '#d23669', category: 'quality' },
  { id: 'system-design', name: 'System Design', icon: 'SD', color: '#7c3aed', category: 'design' },
  { id: 'architecture', name: 'Architecture', icon: 'Ar', color: '#0891b2', category: 'design' },
  { id: 'design-patterns', name: 'Design Patterns', icon: 'DP', color: '#db2777', category: 'design' },
]

const loaders: Record<string, () => Promise<{ default: Technology }>> = {
  html: () => import('./technologies/html'),
  css: () => import('./technologies/css'),
  javascript: () => import('./technologies/javascript'),
  typescript: () => import('./technologies/typescript'),
  vue: () => import('./technologies/vue'),
  react: () => import('./technologies/react'),
  nodejs: () => import('./technologies/nodejs'),
  express: () => import('./technologies/express'),
  postgresql: () => import('./technologies/postgresql'),
  sql: () => import('./technologies/sql'),
  aws: () => import('./technologies/aws'),
  testing: () => import('./technologies/testing'),
  security: () => import('./technologies/security'),
  'system-design': () => import('./technologies/system-design'),
  architecture: () => import('./technologies/architecture'),
  'design-patterns': () => import('./technologies/design-patterns'),
}

const cache = new Map<string, Technology>()

export async function loadTech(id: string): Promise<Technology | null> {
  if (cache.has(id)) return cache.get(id)!
  const loader = loaders[id]
  if (!loader) return null
  const mod = await loader()
  cache.set(id, mod.default)
  return mod.default
}

export async function loadAllTech(): Promise<Technology[]> {
  const all = await Promise.all(techMetas.map((m) => loadTech(m.id)))
  return all.filter((t): t is Technology => t !== null)
}

export function getTechMeta(id: string): TechMeta | undefined {
  return techMetas.find((m) => m.id === id)
}
