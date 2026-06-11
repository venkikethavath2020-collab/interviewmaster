<script setup lang="ts">
import { techMetas } from '../../data'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const modes = [
  { to: '/revision', label: 'Revision Mode', icon: '⏱' },
  { to: '/flashcards', label: 'Flashcards', icon: '🃏' },
  { to: '/mock', label: 'Mock Interview', icon: '🎤' },
  { to: '/last-30', label: 'Last 30 Minutes', icon: '🔥' },
  { to: '/companies', label: 'Companies', icon: '🏢' },
  { to: '/roadmaps', label: 'Roadmaps', icon: '🗺' },
  { to: '/bookmarks', label: 'Bookmarks & Notes', icon: '⭐' },
  { to: '/progress', label: 'Progress', icon: '📈' },
]
</script>

<template>
  <!-- mobile overlay -->
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/40 lg:hidden"
    @click="emit('close')"
  />
  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-[#0d1320] lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <RouterLink to="/" class="flex items-center gap-2 px-5 py-4" @click="emit('close')">
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 font-bold text-white">IM</span>
      <span class="text-lg font-bold tracking-tight">InterviewMaster</span>
    </RouterLink>

    <nav class="flex-1 overflow-y-auto px-3 pb-6">
      <p class="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Prep Modes</p>
      <RouterLink
        v-for="m in modes"
        :key="m.to"
        :to="m.to"
        class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        active-class="!bg-accent-50 !text-accent-700 dark:!bg-accent-900/30 dark:!text-accent-300 font-medium"
        @click="emit('close')"
      >
        <span class="w-5 text-center text-xs">{{ m.icon }}</span>
        {{ m.label }}
      </RouterLink>

      <p class="px-2 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Technologies</p>
      <RouterLink
        v-for="t in techMetas"
        :key="t.id"
        :to="`/tech/${t.id}/overview`"
        class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        active-class="!bg-accent-50 !text-accent-700 dark:!bg-accent-900/30 dark:!text-accent-300 font-medium"
        @click="emit('close')"
      >
        <span
          class="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white"
          :style="{ backgroundColor: t.color }"
        >{{ t.icon }}</span>
        {{ t.name }}
      </RouterLink>
    </nav>
  </aside>
</template>
