/**
 * Knowledge Map model — the full concept graph for a technology
 * (derived from docs/javascript-knowledge-architecture.md).
 * Rendered as an interactive tree in the "Knowledge Map" section of a technology.
 */

export type ConceptLevel = 'beginner' | 'intermediate' | 'advanced' | 'senior' | 'expert'

export interface ConceptCategory {
  slug: string
  title: string
  description: string
  order: number
}

export interface ConceptNode {
  /** kebab-case, unique across the whole map; used as anchor and in routes */
  slug: string
  name: string
  /** ConceptCategory.slug */
  category: string
  level: ConceptLevel
  /** 1-5 */
  importance: number
  /** 1-5 — rendered as stars; 5 = must-know for interviews */
  interviewFrequency: number
  /** 1-5 */
  realWorldUsage: number
  /** One-line definition */
  definition: string
  /** 3-6 interview-ready sentences: how it works, why it exists, why it's asked, common mistake */
  explanation: string[]
  /** Slugs of concepts to learn first (must exist in the same map) */
  prerequisites: string[]
  /** Slugs this concept unlocks (must exist in the same map) */
  leadsTo: string[]
  /** Common interview questions on this concept */
  questions: string[]
  /** High senior-signal concept most candidates overlook */
  overlooked?: boolean
}

export interface ConceptMap {
  techId: string
  categories: ConceptCategory[]
  concepts: ConceptNode[]
}
