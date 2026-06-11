<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InterviewQuestion, QuestionLevel } from '../types/content'
import { loadTech } from '../data'
import LevelBadge from '../components/content/LevelBadge.vue'
import { useUserStore } from '../stores/user'

interface MockQuestion extends InterviewQuestion {
  techName: string
}

const user = useUserStore()

const roles = [
  { id: 'frontend', label: 'Frontend Developer', techs: ['html', 'css', 'javascript', 'typescript'] },
  { id: 'vue', label: 'Vue Developer', techs: ['javascript', 'typescript', 'vue'] },
  { id: 'react', label: 'React Developer', techs: ['javascript', 'typescript', 'react'] },
  { id: 'node', label: 'Node Developer', techs: ['javascript', 'nodejs', 'express', 'postgresql'] },
  { id: 'fullstack', label: 'Full Stack Developer', techs: ['javascript', 'vue', 'nodejs', 'express', 'sql'] },
  { id: 'senior', label: 'Senior Engineer', techs: ['javascript', 'system-design', 'architecture', 'security', 'aws'] },
]

const levels: QuestionLevel[] = ['beginner', 'intermediate', 'advanced', 'expert']

const roleId = ref('fullstack')
const level = ref<QuestionLevel>('intermediate')
const count = ref(8)

type Stage = 'setup' | 'asking' | 'done'
const stage = ref<Stage>('setup')
const questions = ref<MockQuestion[]>([])
const index = ref(0)
const revealed = ref(false)
const scores = ref<Array<'correct' | 'partial' | 'missed'>>([])

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

async function start() {
  const role = roles.find((r) => r.id === roleId.value)!
  const techs = await Promise.all(role.techs.map((id) => loadTech(id)))
  // The chosen level plus its neighbor keeps the pool realistic, like a real interviewer probing around your level.
  const levelIdx = levels.indexOf(level.value)
  const allowed = new Set([level.value, levels[Math.min(levelIdx + 1, 3)]])
  const pool: MockQuestion[] = techs
    .filter((t) => t !== null)
    .flatMap((t) => t!.questions.filter((q) => allowed.has(q.level)).map((q) => ({ ...q, techName: t!.name })))
  questions.value = shuffle(pool).slice(0, count.value)
  index.value = 0
  revealed.value = false
  scores.value = []
  stage.value = questions.value.length > 0 ? 'asking' : 'setup'
}

const current = computed(() => questions.value[index.value])

function score(s: 'correct' | 'partial' | 'missed') {
  scores.value.push(s)
  revealed.value = false
  if (index.value + 1 >= questions.value.length) {
    finish()
  } else {
    index.value++
  }
}

const summary = computed(() => ({
  correct: scores.value.filter((s) => s === 'correct').length,
  partial: scores.value.filter((s) => s === 'partial').length,
  missed: scores.value.filter((s) => s === 'missed').length,
}))

function finish() {
  stage.value = 'done'
  user.recordMock({
    id: `m-${Date.now()}`,
    role: roles.find((r) => r.id === roleId.value)?.label ?? roleId.value,
    level: level.value,
    total: questions.value.length,
    correct: summary.value.correct,
    partial: summary.value.partial,
    finishedAt: Date.now(),
  })
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <h1 class="mb-1 text-2xl font-bold tracking-tight">🎤 Mock Interview</h1>
    <p class="mb-6 text-sm text-slate-500">
      Answer each question OUT LOUD before revealing — verbalizing is the skill being tested in real interviews.
    </p>

    <!-- Setup -->
    <div v-if="stage === 'setup'" class="card grid gap-4 p-6">
      <div>
        <label class="mb-1 block text-sm font-medium">Role</label>
        <select v-model="roleId" class="input">
          <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.label }}</option>
        </select>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Difficulty</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="l in levels"
            :key="l"
            class="btn capitalize"
            :class="level === l ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'"
            @click="level = l"
          >
            {{ l }}
          </button>
        </div>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Questions</label>
        <div class="flex gap-1.5">
          <button
            v-for="n in [5, 8, 12]"
            :key="n"
            class="btn"
            :class="count === n ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'"
            @click="count = n"
          >
            {{ n }}
          </button>
        </div>
      </div>
      <button class="btn-primary mt-2" @click="start">Start interview</button>
    </div>

    <!-- Interview -->
    <div v-else-if="stage === 'asking' && current" class="grid gap-4">
      <div class="flex items-center gap-3 text-sm text-slate-500">
        <span>Question {{ index + 1 }} / {{ questions.length }}</span>
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div class="h-full rounded-full bg-accent-600 transition-all" :style="{ width: `${(index / questions.length) * 100}%` }" />
        </div>
      </div>

      <div class="card p-6">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <span class="badge bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{ current.techName }}</span>
          <LevelBadge :level="current.level" />
        </div>
        <p class="text-lg font-medium leading-relaxed">{{ current.question }}</p>

        <div v-if="revealed" class="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm leading-relaxed dark:border-slate-800">
          <p><span class="badge mr-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Expected answer</span> {{ current.answer }}</p>
          <p v-if="current.deepDive"><span class="badge mr-1 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">Strong candidates add</span> {{ current.deepDive }}</p>
          <div v-if="current.followUps.length">
            <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">The interviewer would follow up with</span>
            <ul class="mt-1.5 list-disc space-y-1 pl-5">
              <li v-for="(f, i) in current.followUps" :key="i">{{ f }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="!revealed" class="flex justify-center">
        <button class="btn-primary" @click="revealed = true">I've answered — show expected answer</button>
      </div>
      <div v-else class="flex flex-wrap justify-center gap-2">
        <button class="btn bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300" @click="score('correct')">✓ Nailed it</button>
        <button class="btn bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300" @click="score('partial')">~ Partially</button>
        <button class="btn bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300" @click="score('missed')">✗ Missed it</button>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="stage === 'done'" class="card p-8 text-center">
      <p class="text-4xl">{{ summary.correct >= questions.length * 0.7 ? '🎉' : summary.correct >= questions.length * 0.4 ? '💪' : '📚' }}</p>
      <h2 class="mt-2 text-xl font-bold">
        {{ summary.correct }} / {{ questions.length }} solid answers
      </h2>
      <p class="mt-1 text-sm text-slate-500">
        {{ summary.partial }} partial · {{ summary.missed }} missed — result saved to your progress.
      </p>
      <div class="mt-6 flex justify-center gap-2">
        <button class="btn-primary" @click="stage = 'setup'">New interview</button>
        <RouterLink to="/progress" class="btn-ghost">View progress</RouterLink>
      </div>
    </div>
  </div>
</template>
