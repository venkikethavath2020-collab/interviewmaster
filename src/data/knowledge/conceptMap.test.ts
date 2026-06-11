import { describe, expect, it } from 'vitest'
import { loadConceptMap } from './index'

describe('javascript concept map', () => {
  it('loads with all categories populated and no duplicate slugs', async () => {
    const map = await loadConceptMap('javascript')
    expect(map).not.toBeNull()
    const slugs = map!.concepts.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs.length).toBeGreaterThanOrEqual(120)

    const populated = new Set(map!.concepts.map((c) => c.category))
    for (const cat of map!.categories) {
      expect(populated, `category ${cat.slug} has concepts`).toContain(cat.slug)
    }
  })

  it('has only valid category references and rating ranges', async () => {
    const map = await loadConceptMap('javascript')
    const catSlugs = new Set(map!.categories.map((c) => c.slug))
    for (const c of map!.concepts) {
      expect(catSlugs, `${c.slug} category`).toContain(c.category)
      for (const r of [c.importance, c.interviewFrequency, c.realWorldUsage]) {
        expect(r).toBeGreaterThanOrEqual(1)
        expect(r).toBeLessThanOrEqual(5)
      }
      expect(c.explanation.length).toBeGreaterThan(0)
      expect(c.questions.length).toBeGreaterThan(0)
    }
  })

  it('prerequisites and leadsTo only reference existing concepts', async () => {
    const map = await loadConceptMap('javascript')
    const slugs = new Set(map!.concepts.map((c) => c.slug))
    const broken: string[] = []
    for (const c of map!.concepts) {
      for (const ref of [...c.prerequisites, ...c.leadsTo]) {
        if (!slugs.has(ref)) broken.push(`${c.slug} -> ${ref}`)
      }
    }
    expect(broken, `broken graph links:\n${broken.join('\n')}`).toHaveLength(0)
  })
})

describe('vue concept map', () => {
  it('loads with all categories populated and no duplicate slugs', async () => {
    const map = await loadConceptMap('vue')
    expect(map).not.toBeNull()
    const slugs = map!.concepts.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs.length).toBeGreaterThanOrEqual(100)

    const populated = new Set(map!.concepts.map((c) => c.category))
    for (const cat of map!.categories) {
      expect(populated, `category ${cat.slug} has concepts`).toContain(cat.slug)
    }
  })

  it('has only valid category references and rating ranges', async () => {
    const map = await loadConceptMap('vue')
    const catSlugs = new Set(map!.categories.map((c) => c.slug))
    for (const c of map!.concepts) {
      expect(catSlugs, `${c.slug} category`).toContain(c.category)
      for (const r of [c.importance, c.interviewFrequency, c.realWorldUsage]) {
        expect(r).toBeGreaterThanOrEqual(1)
        expect(r).toBeLessThanOrEqual(5)
      }
      expect(c.explanation.length).toBeGreaterThan(0)
      expect(c.questions.length).toBeGreaterThan(0)
    }
  })

  it('prerequisites and leadsTo only reference existing concepts', async () => {
    const map = await loadConceptMap('vue')
    const slugs = new Set(map!.concepts.map((c) => c.slug))
    const broken: string[] = []
    for (const c of map!.concepts) {
      for (const ref of [...c.prerequisites, ...c.leadsTo]) {
        if (!slugs.has(ref)) broken.push(`${c.slug} -> ${ref}`)
      }
    }
    expect(broken, `broken graph links:\n${broken.join('\n')}`).toHaveLength(0)
  })
})
