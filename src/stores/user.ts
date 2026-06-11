import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Bookmark, BookmarkKind, BookmarkStatus } from '../types/content'

export interface NoteEntry {
  id: string
  title: string
  body: string
  tag: 'note' | 'learning' | 'mistake' | 'forgotten'
  updatedAt: number
}

export interface MockResult {
  id: string
  role: string
  level: string
  total: number
  correct: number
  partial: number
  finishedAt: number
}

/**
 * All user data (bookmarks, progress, notes, mock results) persisted in localStorage.
 * Refs use the format `${techId}/${kind}/${itemId}`.
 */
export const useUserStore = defineStore('user', () => {
  const bookmarks = useStorage<Record<string, Bookmark>>('im-bookmarks', {})
  const readTopics = useStorage<Record<string, number>>('im-read', {}) // ref -> timestamp
  const revisionCounts = useStorage<Record<string, number>>('im-revisions', {}) // techId -> count
  const flashStats = useStorage<{ seen: number; correct: number }>('im-flash', { seen: 0, correct: 0 })
  const mockResults = useStorage<MockResult[]>('im-mocks', [])
  const notes = useStorage<NoteEntry[]>('im-notes', [])

  function makeRef(techId: string, kind: BookmarkKind, itemId: string) {
    return `${techId}/${kind}/${itemId}`
  }

  function isBookmarked(ref: string) {
    return ref in bookmarks.value
  }

  function toggleBookmark(techId: string, kind: BookmarkKind, itemId: string, title: string) {
    const ref = makeRef(techId, kind, itemId)
    if (bookmarks.value[ref]) {
      delete bookmarks.value[ref]
    } else {
      bookmarks.value[ref] = { ref, techId, kind, itemId, title, status: 'revise', addedAt: Date.now() }
    }
  }

  function setBookmarkStatus(ref: string, status: BookmarkStatus) {
    const b = bookmarks.value[ref]
    if (b) b.status = status
  }

  function markRead(ref: string) {
    if (!readTopics.value[ref]) readTopics.value[ref] = Date.now()
  }

  function toggleRead(ref: string) {
    if (readTopics.value[ref]) delete readTopics.value[ref]
    else readTopics.value[ref] = Date.now()
  }

  function isRead(ref: string) {
    return ref in readTopics.value
  }

  function bumpRevision(techId: string) {
    revisionCounts.value[techId] = (revisionCounts.value[techId] ?? 0) + 1
  }

  function recordFlashcard(correct: boolean) {
    flashStats.value.seen++
    if (correct) flashStats.value.correct++
  }

  function recordMock(result: MockResult) {
    mockResults.value.unshift(result)
    if (mockResults.value.length > 50) mockResults.value.length = 50
  }

  function saveNote(note: Omit<NoteEntry, 'id' | 'updatedAt'> & { id?: string }) {
    const existing = note.id ? notes.value.find((n) => n.id === note.id) : undefined
    if (existing) {
      Object.assign(existing, note, { updatedAt: Date.now() })
    } else {
      notes.value.unshift({
        ...note,
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        updatedAt: Date.now(),
      })
    }
  }

  function deleteNote(id: string) {
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  const bookmarkList = computed(() => Object.values(bookmarks.value).sort((a, b) => b.addedAt - a.addedAt))
  const weakAreas = computed(() => bookmarkList.value.filter((b) => b.status === 'weak'))
  const completedCount = computed(() => Object.keys(readTopics.value).length)
  const totalRevisions = computed(() => Object.values(revisionCounts.value).reduce((a, n) => a + n, 0))
  const accuracy = computed(() => {
    const { seen, correct } = flashStats.value
    return seen === 0 ? 0 : Math.round((correct / seen) * 100)
  })
  const mockAccuracy = computed(() => {
    const totals = mockResults.value.reduce(
      (acc, m) => ({ q: acc.q + m.total, c: acc.c + m.correct + m.partial * 0.5 }),
      { q: 0, c: 0 },
    )
    return totals.q === 0 ? 0 : Math.round((totals.c / totals.q) * 100)
  })

  return {
    bookmarks,
    readTopics,
    revisionCounts,
    flashStats,
    mockResults,
    notes,
    makeRef,
    isBookmarked,
    toggleBookmark,
    setBookmarkStatus,
    markRead,
    toggleRead,
    isRead,
    bumpRevision,
    recordFlashcard,
    recordMock,
    saveNote,
    deleteNote,
    bookmarkList,
    weakAreas,
    completedCount,
    totalRevisions,
    accuracy,
    mockAccuracy,
  }
})
