<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import type { Technology } from '../types/content'
import { loadTech, techMetas } from '../data'
import { useUserStore } from '../stores/user'

interface Card {
  front: string
  back: string
  source: string
}

const user = useUserStore()
const techId = ref('javascript')
const tech = shallowRef<Technology | null>(null)
const index = ref(0)
const flipped = ref(false)
const session = ref({ done: 0, correct: 0 })

const cards = computed<Card[]>(() => {
  if (!tech.value) return []
  const t = tech.value
  const fromKeywords: Card[] = t.keywords.map((k) => ({
    front: `What is "${k.term}" and why does it matter?`,
    back: k.explanation,
    source: 'Keyword',
  }))
  const fromRevision: Card[] = t.revision.map((r) => ({
    front: `Explain: ${r.topic}`,
    back: r.thirtySecond,
    source: 'Revision',
  }))
  const fromQuestions: Card[] = t.questions.slice(0, 10).map((q) => ({
    front: q.question,
    back: q.answer,
    source: 'Question',
  }))
  // deterministic interleave so the deck feels mixed
  const all = [fromKeywords, fromRevision, fromQuestions]
  const deck: Card[] = []
  const max = Math.max(...all.map((a) => a.length))
  for (let i = 0; i < max; i++) for (const list of all) if (list[i]) deck.push(list[i])
  return deck
})

watch(techId, async (id) => {
  tech.value = await loadTech(id)
  index.value = 0
  flipped.value = false
  session.value = { done: 0, correct: 0 }
}, { immediate: true })

const card = computed(() => cards.value[index.value])

function answer(correct: boolean) {
  user.recordFlashcard(correct)
  session.value.done++
  if (correct) session.value.correct++
  flipped.value = false
  index.value = (index.value + 1) % cards.value.length
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h1 class="mb-1 text-2xl font-bold tracking-tight">Flashcards</h1>
    <p class="mb-5 text-sm text-slate-500">Question front, answer back. Be honest with yourself — misses feed your weak-areas list.</p>

    <div class="mb-5 flex items-center gap-3">
      <select v-model="techId" class="input max-w-52">
        <option v-for="t in techMetas" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
      <span class="text-sm text-slate-500">Card {{ index + 1 }} / {{ cards.length }}</span>
      <div class="flex-1" />
      <span class="text-sm text-slate-500">Session: {{ session.correct }}/{{ session.done }} ✓</span>
    </div>

    <div
      v-if="card"
      class="card flex min-h-72 cursor-pointer flex-col items-center justify-center p-8 text-center select-none"
      @click="flipped = !flipped"
    >
      <span class="badge mb-4 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {{ flipped ? 'Answer' : 'Question' }} · {{ card.source }}
      </span>
      <p class="text-lg font-medium leading-relaxed">{{ flipped ? card.back : card.front }}</p>
      <p class="mt-6 text-xs text-slate-400">{{ flipped ? 'How did you do?' : 'Click to reveal answer' }}</p>
    </div>

    <div v-if="flipped" class="mt-4 flex justify-center gap-3">
      <button class="btn bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300" @click="answer(false)">✗ Didn't know</button>
      <button class="btn bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300" @click="answer(true)">✓ Knew it</button>
    </div>
    <div v-else class="mt-4 flex justify-center">
      <button class="btn-ghost" @click="flipped = true">Reveal</button>
    </div>
  </div>
</template>
