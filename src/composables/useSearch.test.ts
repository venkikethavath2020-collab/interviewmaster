import { describe, expect, it } from 'vitest'
import { useSearch } from './useSearch'

describe('useSearch', () => {
  it('finds exact keyword matches ranked above body matches', async () => {
    const { results, search } = useSearch()
    await search('closure')
    expect(results.value.length).toBeGreaterThan(0)
    // The Closure keyword itself should rank at/near the top
    const top = results.value[0]
    expect(top.title.toLowerCase()).toContain('closure')
  })

  it('returns nothing for sub-2-char queries', async () => {
    const { results, search } = useSearch()
    await search('a')
    expect(results.value).toHaveLength(0)
  })

  it('searches across technologies', async () => {
    const { results, search } = useSearch()
    await search('event loop')
    const techIds = new Set(results.value.map((r) => r.techId))
    expect(techIds.size).toBeGreaterThan(1) // JS and Node at minimum
  })
})
