<script setup lang="ts">
import type { Technology } from '../../types/content'
import FlowDiagram from '../content/FlowDiagram.vue'
import CodeBlock from '../content/CodeBlock.vue'
import BookmarkButton from '../content/BookmarkButton.vue'
import { useUserStore } from '../../stores/user'

const props = defineProps<{ tech: Technology }>()
const user = useUserStore()

function readRef(id: string) {
  return user.makeRef(props.tech.id, 'internal', id)
}
</script>

<template>
  <div class="grid gap-5">
    <article v-for="t in tech.internals" :id="t.id" :key="t.id" class="card scroll-mt-20 p-5">
      <div class="mb-2 flex items-start justify-between gap-3">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ t.title }}</h2>
        <div class="flex items-center gap-2">
          <button
            class="badge cursor-pointer"
            :class="user.isRead(readRef(t.id))
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'"
            @click="user.toggleRead(readRef(t.id))"
          >
            {{ user.isRead(readRef(t.id)) ? '✓ Read' : 'Mark read' }}
          </button>
          <BookmarkButton :tech-id="tech.id" kind="internal" :item-id="t.id" :title="t.title" />
        </div>
      </div>
      <p class="mb-3 text-sm font-medium text-accent-700 dark:text-accent-300">{{ t.summary }}</p>

      <div class="grid gap-4" :class="t.diagram ? 'lg:grid-cols-[1fr_240px]' : ''">
        <ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li v-for="(d, i) in t.details" :key="i">{{ d }}</li>
        </ul>
        <FlowDiagram v-if="t.diagram" :steps="t.diagram" :color="tech.color" />
      </div>

      <CodeBlock v-if="t.code" class="mt-4" :code="t.code.code" :lang="t.code.lang" :caption="t.code.caption" />
    </article>
  </div>
</template>
