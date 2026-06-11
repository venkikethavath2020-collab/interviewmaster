<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../../stores/user'
import type { BookmarkKind, BookmarkStatus } from '../../types/content'

const props = defineProps<{
  techId: string
  kind: BookmarkKind
  itemId: string
  title: string
}>()

const user = useUserStore()
const refKey = computed(() => user.makeRef(props.techId, props.kind, props.itemId))
const bookmark = computed(() => user.bookmarks[refKey.value])

const statusMeta: Record<BookmarkStatus, { label: string; cls: string }> = {
  weak: { label: 'Weak Area', cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  revise: { label: 'Revision Needed', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  mastered: { label: 'Mastered', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
}

function cycleStatus() {
  const order: BookmarkStatus[] = ['weak', 'revise', 'mastered']
  const next = order[(order.indexOf(bookmark.value!.status) + 1) % order.length]
  user.setBookmarkStatus(refKey.value, next)
}
</script>

<template>
  <span class="inline-flex shrink-0 items-center gap-1.5">
    <button
      v-if="bookmark"
      class="badge cursor-pointer"
      :class="statusMeta[bookmark.status].cls"
      :title="'Click to change status'"
      @click.stop="cycleStatus"
    >
      {{ statusMeta[bookmark.status].label }}
    </button>
    <button
      class="cursor-pointer text-lg leading-none transition-colors"
      :class="bookmark ? 'text-accent-500' : 'text-slate-300 hover:text-accent-400 dark:text-slate-600'"
      :title="bookmark ? 'Remove bookmark' : 'Bookmark this topic'"
      @click.stop="user.toggleBookmark(techId, kind, itemId, title)"
    >
      {{ bookmark ? '★' : '☆' }}
    </button>
  </span>
</template>
