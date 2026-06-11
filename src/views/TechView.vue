<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Technology } from '../types/content'
import { getTechMeta, loadTech } from '../data'
import OverviewSection from '../components/tech/OverviewSection.vue'
import InternalsSection from '../components/tech/InternalsSection.vue'
import KeywordsSection from '../components/tech/KeywordsSection.vue'
import CheatSheetsSection from '../components/tech/CheatSheetsSection.vue'
import QuestionsSection from '../components/tech/QuestionsSection.vue'
import CodingSection from '../components/tech/CodingSection.vue'
import ScenariosSection from '../components/tech/ScenariosSection.vue'
import SecuritySection from '../components/tech/SecuritySection.vue'
import MentalModelsSection from '../components/tech/MentalModelsSection.vue'
import RevisionSection from '../components/tech/RevisionSection.vue'
import KnowledgeSection from '../components/tech/KnowledgeSection.vue'
import { hasConceptMap } from '../data/knowledge'

const route = useRoute()
const router = useRouter()
const tech = shallowRef<Technology | null>(null)
const loading = shallowRef(true)

const techId = computed(() => String(route.params.id))
const section = computed(() => String(route.params.section || 'overview'))
const meta = computed(() => getTechMeta(techId.value))

watch(
  techId,
  async (id) => {
    loading.value = true
    tech.value = await loadTech(id)
    loading.value = false
    if (!tech.value) router.replace('/404')
    else document.title = `${tech.value.name} · InterviewMaster`
  },
  { immediate: true },
)

const sections = computed(() => {
  const base = [
    { key: 'overview', label: 'Overview' },
    ...(hasConceptMap(techId.value) ? [{ key: 'knowledge', label: 'Knowledge Map' }] : []),
    { key: 'internals', label: 'Internal Working' },
    { key: 'keywords', label: 'Keywords' },
    { key: 'cheatsheets', label: 'Cheat Sheets' },
    { key: 'questions', label: 'Questions' },
    { key: 'coding', label: 'Coding' },
    { key: 'scenarios', label: 'Scenarios' },
    { key: 'mental-models', label: 'Mental Models' },
    { key: 'revision', label: '15-Min Revision' },
  ]
  if (tech.value?.securityTopics?.length) {
    base.splice(7, 0, { key: 'security', label: 'Attacks & Defenses' })
  }
  return base
})

const sectionComponent = computed(() => {
  switch (section.value) {
    case 'knowledge': return KnowledgeSection
    case 'internals': return InternalsSection
    case 'keywords': return KeywordsSection
    case 'cheatsheets': return CheatSheetsSection
    case 'questions': return QuestionsSection
    case 'coding': return CodingSection
    case 'scenarios': return ScenariosSection
    case 'security': return SecuritySection
    case 'mental-models': return MentalModelsSection
    case 'revision': return RevisionSection
    default: return OverviewSection
  }
})
</script>

<template>
  <div v-if="loading" class="py-20 text-center text-slate-400">Loading {{ meta?.name ?? '…' }}…</div>

  <div v-else-if="tech">
    <div class="mb-5 flex items-center gap-3">
      <span
        class="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white"
        :style="{ backgroundColor: tech.color }"
      >{{ tech.icon }}</span>
      <div>
        <h1 class="text-2xl font-bold tracking-tight">{{ tech.name }}</h1>
        <p class="text-sm text-slate-500">{{ tech.tagline }}</p>
      </div>
    </div>

    <nav class="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200 pb-px dark:border-slate-800">
      <RouterLink
        v-for="s in sections"
        :key="s.key"
        :to="`/tech/${tech.id}/${s.key}`"
        class="whitespace-nowrap rounded-t-lg border-b-2 px-3 py-2 text-sm transition-colors"
        :class="section === s.key
          ? 'border-accent-600 font-semibold text-accent-700 dark:text-accent-300'
          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
      >
        {{ s.label }}
      </RouterLink>
    </nav>

    <component :is="sectionComponent" :tech="tech" />
  </div>
</template>
