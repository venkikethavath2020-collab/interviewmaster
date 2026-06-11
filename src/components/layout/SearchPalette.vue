<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { watchDebounced } from '@vueuse/core'
import { useSearch } from '../../composables/useSearch'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const { results, indexing, search } = useSearch()
const query = ref('')
const active = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

watch(
  () => props.open,
  async (v) => {
    if (v) {
      query.value = ''
      results.value = []
      await nextTick()
      inputEl.value?.focus()
    }
  },
)

watchDebounced(query, (q) => { active.value = 0; search(q) }, { debounce: 150 })

function go(index: number) {
  const hit = results.value[index]
  if (!hit) return
  emit('close')
  router.push(hit.route)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); active.value = Math.min(active.value + 1, results.value.length - 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); active.value = Math.max(active.value - 1, 0) }
  else if (e.key === 'Enter') go(active.value)
  else if (e.key === 'Escape') emit('close')
}

const kindLabel: Record<string, string> = {
  'overview': 'Overview', 'internal': 'Internals', 'keyword': 'Keyword', 'cheat-sheet': 'Cheat Sheet',
  'question': 'Question', 'coding': 'Coding', 'scenario': 'Scenario', 'mental-model': 'Mental Model',
  'revision': 'Revision', 'security': 'Security', 'concept': 'Knowledge Map',
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh]" @click.self="emit('close')">
      <div class="card w-full max-w-xl overflow-hidden" @keydown="onKey">
        <input
          ref="inputEl"
          v-model="query"
          type="text"
          placeholder="Search anything — Promise, Event Loop, JWT, Pinia, Indexes…"
          class="w-full border-b border-slate-200 bg-transparent px-4 py-3 text-sm outline-none dark:border-slate-800"
        />
        <div class="max-h-[50vh] overflow-y-auto">
          <p v-if="indexing" class="px-4 py-3 text-sm text-slate-500">Building search index…</p>
          <p v-else-if="query.length >= 2 && results.length === 0" class="px-4 py-3 text-sm text-slate-500">No results for “{{ query }}”.</p>
          <button
            v-for="(hit, i) in results"
            :key="hit.ref"
            class="flex w-full items-center gap-3 px-4 py-2.5 text-left"
            :class="i === active ? 'bg-accent-50 dark:bg-accent-900/25' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'"
            @mouseenter="active = i"
            @click="go(i)"
          >
            <span class="badge shrink-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ hit.techName }}</span>
            <span class="min-w-0 flex-1 truncate text-sm">{{ hit.title }}</span>
            <span class="shrink-0 text-[11px] text-slate-400">{{ kindLabel[hit.kind] }}</span>
          </button>
        </div>
        <div class="flex items-center gap-3 border-t border-slate-200 px-4 py-2 text-[11px] text-slate-400 dark:border-slate-800">
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
