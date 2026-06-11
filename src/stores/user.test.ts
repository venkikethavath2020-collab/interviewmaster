import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from './user'

describe('user store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('toggles bookmarks on and off', () => {
    const user = useUserStore()
    user.toggleBookmark('javascript', 'keyword', 'closure', 'Closure')
    expect(user.bookmarkList).toHaveLength(1)
    expect(user.bookmarkList[0].status).toBe('revise')

    user.toggleBookmark('javascript', 'keyword', 'closure', 'Closure')
    expect(user.bookmarkList).toHaveLength(0)
  })

  it('cycles bookmark status and surfaces weak areas', () => {
    const user = useUserStore()
    user.toggleBookmark('vue', 'revision', 'r-reactivity', 'Reactivity')
    const ref = user.makeRef('vue', 'revision', 'r-reactivity')
    user.setBookmarkStatus(ref, 'weak')
    expect(user.weakAreas).toHaveLength(1)
    expect(user.weakAreas[0].title).toBe('Reactivity')
  })

  it('tracks read topics and revision counts', () => {
    const user = useUserStore()
    user.markRead('javascript/internal/event-loop')
    user.markRead('javascript/internal/event-loop') // idempotent
    expect(user.completedCount).toBe(1)

    user.bumpRevision('javascript')
    user.bumpRevision('javascript')
    expect(user.totalRevisions).toBe(2)
  })

  it('computes flashcard accuracy', () => {
    const user = useUserStore()
    user.recordFlashcard(true)
    user.recordFlashcard(true)
    user.recordFlashcard(false)
    expect(user.accuracy).toBe(67)
  })

  it('saves, updates and deletes notes', () => {
    const user = useUserStore()
    user.saveNote({ title: 'Forgot Promise.any', body: 'AggregateError on all-reject', tag: 'forgotten' })
    expect(user.notes).toHaveLength(1)

    const id = user.notes[0].id
    user.saveNote({ id, title: 'Forgot Promise.any', body: 'updated', tag: 'forgotten' })
    expect(user.notes).toHaveLength(1)
    expect(user.notes[0].body).toBe('updated')

    user.deleteNote(id)
    expect(user.notes).toHaveLength(0)
  })
})
