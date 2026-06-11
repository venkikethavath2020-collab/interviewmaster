import { describe, expect, it } from 'vitest'
import { loadConceptMap } from '../knowledge'
import { hasLesson, loadLesson, lessonSlugs } from './index'

/**
 * Every concept in the JavaScript knowledge map should have a full lesson,
 * and every lesson should be structurally complete (all 24 sections populated).
 */
describe('javascript lessons', () => {
  it('has a lesson for every concept in the knowledge map', async () => {
    const map = await loadConceptMap('javascript')
    const missing = map!.concepts.filter((c) => !hasLesson('javascript', c.slug)).map((c) => c.slug)
    expect(missing, `concepts without a lesson:\n${missing.join('\n')}`).toHaveLength(0)
  })

  it('loads every lesson and each is structurally complete', async () => {
    const slugs = [...lessonSlugs('javascript')]
    expect(slugs.length).toBeGreaterThanOrEqual(126)

    for (const slug of slugs) {
      const l = await loadLesson('javascript', slug)
      expect(l, `lesson ${slug} loads`).not.toBeNull()
      if (!l) continue
      expect(l.slug, `${slug} slug matches`).toBe(slug)
      // required scalar sections
      expect(l.name.length, `${slug} name`).toBeGreaterThan(0)
      expect(l.technicalDefinition.length, `${slug} technicalDefinition`).toBeGreaterThan(20)
      expect(l.thirtySecond.length, `${slug} thirtySecond`).toBeGreaterThan(20)
      expect(l.twoMinute.length, `${slug} twoMinute`).toBeGreaterThan(50)
      expect(l.mentalModelDiagram.length, `${slug} mentalModelDiagram`).toBeGreaterThan(0)
      // required arrays
      expect(l.whyCare.length, `${slug} whyCare`).toBeGreaterThan(0)
      expect(l.schoolExplanation.length, `${slug} schoolExplanation`).toBeGreaterThan(0)
      expect(l.childExplanation.story.length, `${slug} child story`).toBeGreaterThan(0)
      expect(l.internalWorking.length, `${slug} internalWorking`).toBeGreaterThan(2)
      expect(l.interviewQuestions.length, `${slug} interviewQuestions`).toBeGreaterThanOrEqual(4)
      expect(l.followUps.length, `${slug} followUps`).toBeGreaterThan(0)
      expect(l.commonMistakes.length, `${slug} commonMistakes`).toBeGreaterThan(0)
      expect(l.productionUsage.length, `${slug} productionUsage`).toBeGreaterThan(0)
      expect(l.cheatSheet.length, `${slug} cheatSheet`).toBeGreaterThanOrEqual(5)
      expect(l.exercises.length, `${slug} exercises`).toBeGreaterThanOrEqual(4)
      // examples present
      for (const k of ['basic', 'intermediate', 'advanced', 'realProject'] as const) {
        expect(l.examples[k].code.length, `${slug} examples.${k}`).toBeGreaterThan(0)
      }
      // related links use only real concept slugs
      const map = await loadConceptMap('javascript')
      const valid = new Set(map!.concepts.map((c) => c.slug))
      for (const ref of [...l.related.prerequisites, ...l.related.nextConcepts]) {
        expect(valid.has(ref), `${slug} related ref "${ref}" exists`).toBe(true)
      }
    }
  })
})

describe('vue lessons', () => {
  it('has a lesson for every concept in the knowledge map', async () => {
    const map = await loadConceptMap('vue')
    const missing = map!.concepts.filter((c) => !hasLesson('vue', c.slug)).map((c) => c.slug)
    expect(missing, `concepts without a lesson:\n${missing.join('\n')}`).toHaveLength(0)
  })

  it('loads every lesson and each is structurally complete', async () => {
    const slugs = [...lessonSlugs('vue')]
    expect(slugs.length).toBeGreaterThanOrEqual(107)

    const map = await loadConceptMap('vue')
    const valid = new Set(map!.concepts.map((c) => c.slug))

    for (const slug of slugs) {
      const l = await loadLesson('vue', slug)
      expect(l, `lesson ${slug} loads`).not.toBeNull()
      if (!l) continue
      expect(l.slug, `${slug} slug matches`).toBe(slug)
      // required scalar sections
      expect(l.name.length, `${slug} name`).toBeGreaterThan(0)
      expect(l.technicalDefinition.length, `${slug} technicalDefinition`).toBeGreaterThan(20)
      expect(l.thirtySecond.length, `${slug} thirtySecond`).toBeGreaterThan(20)
      expect(l.twoMinute.length, `${slug} twoMinute`).toBeGreaterThan(50)
      expect(l.mentalModelDiagram.length, `${slug} mentalModelDiagram`).toBeGreaterThan(0)
      // required arrays
      expect(l.whyCare.length, `${slug} whyCare`).toBeGreaterThan(0)
      expect(l.schoolExplanation.length, `${slug} schoolExplanation`).toBeGreaterThan(0)
      expect(l.childExplanation.story.length, `${slug} child story`).toBeGreaterThan(0)
      expect(l.internalWorking.length, `${slug} internalWorking`).toBeGreaterThan(2)
      expect(l.interviewQuestions.length, `${slug} interviewQuestions`).toBeGreaterThanOrEqual(4)
      expect(l.followUps.length, `${slug} followUps`).toBeGreaterThan(0)
      expect(l.commonMistakes.length, `${slug} commonMistakes`).toBeGreaterThan(0)
      expect(l.productionUsage.length, `${slug} productionUsage`).toBeGreaterThan(0)
      expect(l.cheatSheet.length, `${slug} cheatSheet`).toBeGreaterThanOrEqual(5)
      expect(l.exercises.length, `${slug} exercises`).toBeGreaterThanOrEqual(4)
      // examples present
      for (const k of ['basic', 'intermediate', 'advanced', 'realProject'] as const) {
        expect(l.examples[k].code.length, `${slug} examples.${k}`).toBeGreaterThan(0)
      }
      // related links use only real concept slugs
      for (const ref of [...l.related.prerequisites, ...l.related.nextConcepts]) {
        expect(valid.has(ref), `${slug} related ref "${ref}" exists`).toBe(true)
      }
    }
  })
})
