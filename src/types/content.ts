/**
 * Content model for InterviewMaster.
 * Every technology module exports a single `Technology` object.
 * All UI features (search, flashcards, revision modes, last-30-minutes)
 * are derived from this structure — keep it the single source of truth.
 */

export type Importance = 1 | 2 | 3 | 4 | 5

export type QuestionLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type TechCategory =
  | 'frontend'
  | 'language'
  | 'backend'
  | 'database'
  | 'cloud'
  | 'quality'
  | 'design'

/** Overview — section 1 */
export interface Overview {
  what: string
  why: string
  problemsSolved: string[]
  whenToUse: string[]
  whenNotToUse: string[]
}

/** Internal Working — section 2. `diagram` is an ordered flow rendered as a vertical flow chart. */
export interface InternalTopic {
  id: string
  title: string
  summary: string
  details: string[]
  diagram?: string[]
  code?: CodeSample
}

export interface CodeSample {
  lang: string
  code: string
  caption?: string
}

/** Interview Keywords — section 3 */
export interface Keyword {
  id: string
  term: string
  importance: Importance
  whyAsked: string
  explanation: string
  realWorldExample?: string
  commonMistakes?: string[]
  followUps: string[]
  diagram?: string[]
}

/** Cheat Sheets — section 4. Rendered as a compact comparison/reference table. */
export interface CheatSheet {
  id: string
  title: string
  rows: CheatSheetRow[]
}

export interface CheatSheetRow {
  concept: string
  description: string
  code?: string
}

/** Interview Questions — section 5 */
export interface InterviewQuestion {
  id: string
  level: QuestionLevel
  question: string
  answer: string
  deepDive?: string
  realWorldExample?: string
  followUps: string[]
}

/** Coding Questions — section 6 */
export interface CodingQuestion {
  id: string
  title: string
  level: QuestionLevel
  problem: string
  solution: CodeSample
  explanation: string
  timeComplexity: string
  spaceComplexity: string
  alternatives?: string[]
}

/** Real Project / Production Scenarios — sections 7 & 18 */
export interface Scenario {
  id: string
  title: string
  situation: string
  approach: string[]
  keyTakeaways: string[]
}

/** Security topics — section 8 (used by the Security technology and per-tech security notes) */
export interface SecurityTopic {
  id: string
  title: string
  attackExample: string
  howItWorks: string[]
  impact: string
  mitigation: string[]
  bestPractices: string[]
  questions: string[]
}

/** Mental Models — section 14. `flow` renders as a vertical diagram. */
export interface MentalModel {
  id: string
  title: string
  flow: string[]
  explanation: string[]
  whatBreaksWithoutIt: string
  interviewTip: string
}

/**
 * Revision items — sections 10, 15, 16, 24.
 * Each item is one clickable checklist entry with layered explanations
 * (Interview Day Mode: 30s → 2min → deep dive).
 */
export interface RevisionItem {
  id: string
  topic: string
  importance: Importance
  thirtySecond: string
  twoMinute: string
  deepDive: string
  whiteboard?: string[]
  followUps: string[]
}

export interface Technology {
  id: string
  name: string
  icon: string
  /** Tailwind-compatible accent color hex, used for badges/sidebar dot */
  color: string
  tagline: string
  category: TechCategory
  overview: Overview
  internals: InternalTopic[]
  keywords: Keyword[]
  cheatSheets: CheatSheet[]
  questions: InterviewQuestion[]
  codingQuestions: CodingQuestion[]
  scenarios: Scenario[]
  securityTopics?: SecurityTopic[]
  mentalModels: MentalModel[]
  revision: RevisionItem[]
}

/** Company interview experiences — section 21 */
export interface Company {
  id: string
  name: string
  category: 'service' | 'product' | 'startup' | 'faang'
  difficulty: 1 | 2 | 3 | 4 | 5
  technicalQuestions: string[]
  codingQuestions: string[]
  hrQuestions: string[]
  managerialQuestions: string[]
  notes: string
}

/** Roadmaps — section 20 */
export interface Roadmap {
  id: string
  title: string
  icon: string
  levels: {
    beginner: string[]
    intermediate: string[]
    advanced: string[]
    expert: string[]
  }
}

/** Bookmark status — section 12 */
export type BookmarkStatus = 'weak' | 'revise' | 'mastered'

export interface Bookmark {
  /** `${techId}/${sectionKind}/${itemId}` */
  ref: string
  techId: string
  kind: BookmarkKind
  itemId: string
  title: string
  status: BookmarkStatus
  addedAt: number
}

export type BookmarkKind =
  | 'keyword'
  | 'question'
  | 'coding'
  | 'internal'
  | 'mental-model'
  | 'revision'
  | 'scenario'
  | 'cheat-sheet'
  | 'security'
  | 'concept'

/** Search index entry, built at runtime from all content */
export interface SearchDoc {
  ref: string
  techId: string
  techName: string
  kind: BookmarkKind | 'overview'
  title: string
  body: string
  importance?: Importance
  route: string
}
