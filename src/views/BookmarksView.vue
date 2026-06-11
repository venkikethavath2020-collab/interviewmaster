<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BookmarkStatus } from '../types/content'
import { getTechMeta } from '../data'
import { useUserStore, type NoteEntry } from '../stores/user'

const user = useUserStore()
const statusFilter = ref<BookmarkStatus | 'all'>('all')

const filtered = computed(() =>
  user.bookmarkList.filter((b) => statusFilter.value === 'all' || b.status === statusFilter.value),
)

const statusMeta: Record<BookmarkStatus, { label: string; cls: string }> = {
  weak: { label: 'Weak Area', cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  revise: { label: 'Revision Needed', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  mastered: { label: 'Mastered', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
}

const kindRoute: Record<string, string> = {
  'keyword': 'keywords', 'question': 'questions', 'coding': 'coding', 'internal': 'internals',
  'mental-model': 'mental-models', 'revision': 'revision', 'scenario': 'scenarios',
  'cheat-sheet': 'cheatsheets', 'security': 'security', 'concept': 'knowledge',
}

// Notes (personal knowledge base)
const noteTags = [
  { value: 'note', label: '📝 Note' },
  { value: 'learning', label: '💡 Interview Learning' },
  { value: 'mistake', label: '❌ Mistake Made' },
  { value: 'forgotten', label: '🧠 Keep Forgetting' },
] as const

const editing = ref<Partial<NoteEntry> | null>(null)

function startNew() {
  editing.value = { title: '', body: '', tag: 'note' }
}

function save() {
  if (!editing.value?.title?.trim()) return
  user.saveNote({
    id: editing.value.id,
    title: editing.value.title!,
    body: editing.value.body ?? '',
    tag: (editing.value.tag ?? 'note') as NoteEntry['tag'],
  })
  editing.value = null
}
</script>

<template>
  <div class="grid gap-8">
    <section>
      <h1 class="mb-1 text-2xl font-bold tracking-tight">Bookmarks</h1>
      <p class="mb-4 text-sm text-slate-500">Everything you starred, by mastery status. Weak areas feed the Last-30-Minutes page.</p>

      <div class="mb-4 flex flex-wrap gap-1.5">
        <button
          v-for="s in (['all', 'weak', 'revise', 'mastered'] as const)"
          :key="s"
          class="btn capitalize"
          :class="statusFilter === s ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'"
          @click="statusFilter = s"
        >
          {{ s === 'all' ? 'All' : statusMeta[s].label }}
        </button>
      </div>

      <p v-if="filtered.length === 0" class="card p-6 text-center text-sm text-slate-400">
        No bookmarks yet — hit the ☆ icon on any topic while studying.
      </p>
      <div class="grid gap-2">
        <div v-for="b in filtered" :key="b.ref" class="card flex items-center gap-3 px-4 py-2.5">
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
            :style="{ backgroundColor: getTechMeta(b.techId)?.color ?? '#64748b' }"
          >{{ getTechMeta(b.techId)?.icon }}</span>
          <RouterLink
            :to="`/tech/${b.techId}/${kindRoute[b.kind] ?? 'overview'}#${b.itemId}`"
            class="min-w-0 flex-1 truncate text-sm font-medium hover:text-accent-600"
          >
            {{ b.title }}
          </RouterLink>
          <select
            class="rounded-lg border border-slate-200 bg-transparent px-2 py-1 text-xs dark:border-slate-700"
            :value="b.status"
            @change="user.setBookmarkStatus(b.ref, ($event.target as HTMLSelectElement).value as BookmarkStatus)"
          >
            <option value="weak">Weak Area</option>
            <option value="revise">Revision Needed</option>
            <option value="mastered">Mastered</option>
          </select>
          <button class="text-slate-300 hover:text-rose-500" title="Remove" @click="user.toggleBookmark(b.techId, b.kind, b.itemId, b.title)">✕</button>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold tracking-tight">Personal Knowledge Base</h2>
          <p class="text-sm text-slate-500">Notes, interview learnings, mistakes, and concepts you keep forgetting.</p>
        </div>
        <button class="btn-primary" @click="startNew">+ New note</button>
      </div>

      <div v-if="editing" class="card mb-4 grid gap-3 p-4">
        <input v-model="editing.title" class="input" placeholder="Title — e.g. 'Forgot how Promise.race rejects'" />
        <textarea v-model="editing.body" class="input min-h-24" placeholder="What did you learn? What will you say next time?" />
        <div class="flex items-center gap-2">
          <select v-model="editing.tag" class="input max-w-56">
            <option v-for="t in noteTags" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
          <div class="flex-1" />
          <button class="btn-ghost" @click="editing = null">Cancel</button>
          <button class="btn-primary" @click="save">Save</button>
        </div>
      </div>

      <p v-if="user.notes.length === 0 && !editing" class="card p-6 text-center text-sm text-slate-400">
        After every interview, log what was asked and what you fumbled — future-you revises from this.
      </p>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="n in user.notes" :key="n.id" class="card p-4">
          <div class="mb-1 flex items-start justify-between gap-2">
            <p class="font-medium">{{ n.title }}</p>
            <div class="flex shrink-0 gap-1">
              <button class="text-xs text-slate-400 hover:text-accent-600" @click="editing = { ...n }">Edit</button>
              <button class="text-xs text-slate-400 hover:text-rose-500" @click="user.deleteNote(n.id)">Delete</button>
            </div>
          </div>
          <p class="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{{ n.body }}</p>
          <p class="mt-2 text-xs text-slate-400">{{ noteTags.find((t) => t.value === n.tag)?.label }} · {{ new Date(n.updatedAt).toLocaleDateString() }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
