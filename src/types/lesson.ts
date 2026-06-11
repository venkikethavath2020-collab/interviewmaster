/**
 * ConceptLesson — a complete, progressive "mentor" lesson page for a single concept.
 * Layered ON TOP of the lightweight ConceptNode (knowledge map / index layer):
 * a ConceptNode may optionally have a ConceptLesson keyed by the same `slug`.
 *
 * Teaches from child-level understanding to senior-engineer mastery.
 * Renders at a dedicated route, e.g. /javascript/closure.
 * Every field maps to one of the 24 required sections.
 */

import type { ConceptLevel } from './knowledge'

export interface LessonCode {
  label?: string
  lang: string
  code: string
  /** Per-line or per-block explanation shown beneath the code. */
  explanation: string[]
}

export interface LessonQA {
  level: ConceptLevel
  question: string
  answer: string
  explanation: string
}

export interface LessonExercise {
  difficulty: 'easy' | 'medium' | 'hard' | 'interview'
  prompt: string
  hint?: string
  solution: LessonCode
}

export interface LessonProductionUsage {
  /** e.g. 'Vue', 'React', 'Node.js', 'Backend' */
  area: string
  detail: string
}

export interface ConceptLesson {
  // 1. Concept Summary
  slug: string
  name: string
  category: string
  difficulty: ConceptLevel
  importance: number
  interviewFrequency: number

  // 2. Why Should I Care? (max 5)
  whyCare: string[]

  // 3. Child Explanation (Age 10) — story / analogy, no jargon
  childExplanation: {
    analogy: string
    story: string[]
  }

  // 4. School Student Explanation — basic technical intuition
  schoolExplanation: string[]

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: string
    how: string
    why: string
    code?: LessonCode
  }

  // 6. Technical Explanation — interview-ready definition
  technicalDefinition: string

  // 7. Internal Working — step by step (engine/memory/runtime)
  internalWorking: string[]

  // 8. Visual Mental Model — ASCII diagram (preserve whitespace)
  mentalModelDiagram: string

  // 9. Memory Visualization — stack/heap/references (optional)
  memoryVisualization?: string[]

  // 10. Code Examples
  examples: {
    basic: LessonCode
    intermediate: LessonCode
    advanced: LessonCode
    realProject: LessonCode
  }

  // 11. Common Interview Questions (beginner → senior)
  interviewQuestions: LessonQA[]

  // 12. Common Follow-Up Questions
  followUps: string[]

  // 13. Common Mistakes
  commonMistakes: { mistake: string; why: string; fix: string }[]

  // 14. Real Production Usage
  productionUsage: LessonProductionUsage[]

  // 15. Performance Impact
  performance: { good: string[]; bad: string[]; optimizations: string[] }

  // 16. Security Considerations (optional)
  security?: { risks: string[]; bestPractices: string[] }

  // 17. Related Concepts
  related: { prerequisites: string[]; nextConcepts: string[]; dependencyNote: string }

  // 18. Whiteboard Interview Version
  whiteboard: { script: string[]; diagram: string }

  // 19. 30 Second Revision — one paragraph
  thirtySecond: string

  // 20. 2 Minute Interview Answer
  twoMinute: string

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: string[]
    edgeCases: string[]
    runtimeBehavior: string[]
    scalability: string[]
    productionConcerns: string[]
  }

  // 22. Cheat Sheet — bullets only
  cheatSheet: string[]

  // 23. Coding Exercises
  exercises: LessonExercise[]

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant: string
    howCompaniesAsk: string
    whatInterviewersExpect: string
  }
}
