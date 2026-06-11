<script setup lang="ts">
import { ref } from 'vue'
import type { RevisionItem, Technology } from '../../types/content'
import ImportanceStars from '../content/ImportanceStars.vue'
import BookmarkButton from '../content/BookmarkButton.vue'
import { useUserStore } from '../../stores/user'

const props = defineProps<{ tech: Technology }>()
const user = useUserStore()

const openId = ref<string | null>(null)
const depth = ref<'thirty' | 'two' | 'deep'>('thirty')

function toggle(item: RevisionItem) {
  openId.value = openId.value === item.id ? null : item.id
  depth.value = 'thirty'
}

function checkRef(id: string) {
  return user.makeRef(props.tech.id, 'revision', id)
}
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-slate-500">
        The {{ tech.name }} 15-minute checklist. Click any item for 30-second → 2-minute → deep-dive explanations.
      </p>
      <button class="btn-primary" @click="user.bumpRevision(tech.id)">✓ Finished a revision pass</button>
    </div>

    <div v-for="item in tech.revision" :id="item.id" :key="item.id" class="card scroll-mt-20 overflow-hidden">
      <div class="flex items-center gap-3 px-4 py-2.5">
        <input
          type="checkbox"
          class="h-4 w-4 accent-accent-600"
          :checked="user.isRead(checkRef(item.id))"
          @change="user.toggleRead(checkRef(item.id))"
        />
        <button class="flex flex-1 cursor-pointer items-center gap-2 text-left" @click="toggle(item)">
          <span class="text-sm font-medium">{{ item.topic }}</span>
          <ImportanceStars :value="item.importance" />
        </button>
        <BookmarkButton :tech-id="tech.id" kind="revision" :item-id="item.id" :title="item.topic" />
        <span class="text-slate-400 transition-transform" :class="openId === item.id ? 'rotate-180' : ''">▾</span>
      </div>

      <div v-if="openId === item.id" class="border-t border-slate-100 px-4 py-4 dark:border-slate-800">
        <div class="mb-3 flex gap-1.5">
          <button class="btn" :class="depth === 'thirty' ? 'bg-accent-600 text-white' : 'bg-slate-100 dark:bg-slate-800'" @click="depth = 'thirty'">30 seconds</button>
          <button class="btn" :class="depth === 'two' ? 'bg-accent-600 text-white' : 'bg-slate-100 dark:bg-slate-800'" @click="depth = 'two'">2 minutes</button>
          <button class="btn" :class="depth === 'deep' ? 'bg-accent-600 text-white' : 'bg-slate-100 dark:bg-slate-800'" @click="depth = 'deep'">Deep dive</button>
        </div>
        <p class="text-sm leading-relaxed">
          {{ depth === 'thirty' ? item.thirtySecond : depth === 'two' ? item.twoMinute : item.deepDive }}
        </p>
        <div v-if="item.whiteboard?.length && depth === 'deep'" class="mt-3">
          <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Whiteboard version</p>
          <ul class="list-disc space-y-1 pl-5 text-sm">
            <li v-for="(w, i) in item.whiteboard" :key="i">{{ w }}</li>
          </ul>
        </div>
        <div v-if="item.followUps.length" class="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
          <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Expected follow-ups</p>
          <ul class="list-disc space-y-1 pl-5 text-sm">
            <li v-for="(f, i) in item.followUps" :key="i">{{ f }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
