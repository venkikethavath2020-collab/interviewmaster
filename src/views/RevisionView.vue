<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import type { RevisionItem, Technology } from '../types/content'
import { loadTech, techMetas } from '../data'
import ImportanceStars from '../components/content/ImportanceStars.vue'
import { useUserStore } from '../stores/user'

const user = useUserStore()
const techId = ref('javascript')
const minutes = ref<5 | 15 | 30 | 60>(15)
const tech = shallowRef<Technology | null>(null)
const openId = ref<string | null>(null)
const depth = ref<'thirty' | 'two' | 'deep'>('thirty')

watch(techId, async (id) => { tech.value = await loadTech(id) }, { immediate: true })

/** Time budget controls both item count (by importance) and default depth. */
const items = computed<RevisionItem[]>(() => {
  if (!tech.value) return []
  const sorted = [...tech.value.revision].sort((a, b) => b.importance - a.importance)
  if (minutes.value === 5) return sorted.filter((r) => r.importance === 5)
  if (minutes.value === 15) return sorted.filter((r) => r.importance >= 4)
  if (minutes.value === 30) return sorted.filter((r) => r.importance >= 3)
  return sorted
})

const defaultDepth = computed(() => (minutes.value <= 15 ? 'thirty' : minutes.value === 30 ? 'two' : 'deep'))

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
  depth.value = defaultDepth.value
}

const done = ref(false)
function finish() {
  user.bumpRevision(techId.value)
  done.value = true
  setTimeout(() => (done.value = false), 2500)
}
</script>

<template>
  <div>
    <h1 class="mb-1 text-2xl font-bold tracking-tight">Revision Mode</h1>
    <p class="mb-5 text-sm text-slate-500">Pick a technology and how much time you have. The list adapts: less time → only the highest-frequency concepts.</p>

    <div class="mb-5 flex flex-wrap items-center gap-3">
      <select v-model="techId" class="input max-w-52">
        <option v-for="t in techMetas" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
      <div class="flex gap-1.5">
        <button
          v-for="m in [5, 15, 30, 60]"
          :key="m"
          class="btn"
          :class="minutes === m ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'"
          @click="minutes = m as 5 | 15 | 30 | 60"
        >
          {{ m }} min
        </button>
      </div>
      <div class="flex-1" />
      <button class="btn-primary" @click="finish">{{ done ? '✓ Logged!' : 'Finish revision pass' }}</button>
    </div>

    <p v-if="tech" class="mb-3 text-xs uppercase tracking-wide text-slate-400">
      {{ items.length }} concepts · ~{{ minutes }} minutes · {{ tech.name }}
    </p>

    <div class="grid gap-2.5">
      <div v-for="item in items" :key="item.id" class="card overflow-hidden">
        <button class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left" @click="toggle(item.id)">
          <ImportanceStars :value="item.importance" />
          <span class="flex-1 text-sm font-medium">{{ item.topic }}</span>
          <span class="text-slate-400 transition-transform" :class="openId === item.id ? 'rotate-180' : ''">▾</span>
        </button>
        <div v-if="openId === item.id" class="border-t border-slate-100 px-4 py-4 dark:border-slate-800">
          <div class="mb-3 flex gap-1.5">
            <button class="btn" :class="depth === 'thirty' ? 'bg-accent-600 text-white' : 'bg-slate-100 dark:bg-slate-800'" @click="depth = 'thirty'">30s</button>
            <button class="btn" :class="depth === 'two' ? 'bg-accent-600 text-white' : 'bg-slate-100 dark:bg-slate-800'" @click="depth = 'two'">2 min</button>
            <button class="btn" :class="depth === 'deep' ? 'bg-accent-600 text-white' : 'bg-slate-100 dark:bg-slate-800'" @click="depth = 'deep'">Deep</button>
          </div>
          <p class="text-sm leading-relaxed">
            {{ depth === 'thirty' ? item.thirtySecond : depth === 'two' ? item.twoMinute : item.deepDive }}
          </p>
          <div v-if="item.followUps.length" class="mt-3 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Follow-ups</p>
            <ul class="list-disc space-y-1 pl-5">
              <li v-for="(f, i) in item.followUps" :key="i">{{ f }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
