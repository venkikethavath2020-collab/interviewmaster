<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import SearchPalette from './components/layout/SearchPalette.vue'
import { useThemeStore } from './stores/theme'

const theme = useThemeStore()
const route = useRoute()
const sidebarOpen = ref(false)
const searchOpen = ref(false)

/** Bare layout = standalone page with no sidebar/topbar (lesson pages opened in their own tab). */
const bare = computed(() => route.meta.layout === 'bare')

function onGlobalKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKey))
onUnmounted(() => window.removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <!-- Bare standalone layout: just the content + a small floating theme toggle -->
  <div v-if="bare" class="min-h-screen">
    <button
      class="btn-ghost fixed right-3 top-3 z-30 text-base"
      :title="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="theme.toggle()"
    >
      {{ theme.isDark ? '☀️' : '🌙' }}
    </button>
    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <RouterView />
    </main>
  </div>

  <!-- Full app layout -->
  <div v-else class="min-h-screen">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="lg:pl-64">
      <header
        class="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-2.5 backdrop-blur dark:border-slate-800 dark:bg-[#0b0f17]/80"
      >
        <button class="btn-ghost lg:hidden" aria-label="Open menu" @click="sidebarOpen = true">☰</button>
        <button
          class="flex flex-1 max-w-md cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-400 hover:border-accent-400 dark:border-slate-700"
          @click="searchOpen = true"
        >
          <span>🔍</span>
          <span class="flex-1 text-left">Search anything…</span>
          <kbd class="rounded border border-slate-300 px-1.5 text-[10px] dark:border-slate-600">⌘K</kbd>
        </button>
        <div class="flex-1" />
        <RouterLink to="/last-30" class="btn bg-rose-600 text-white hover:bg-rose-700 max-sm:hidden">🔥 Interview Day</RouterLink>
        <button class="btn-ghost text-base" :title="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="theme.toggle()">
          {{ theme.isDark ? '☀️' : '🌙' }}
        </button>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <RouterView />
      </main>
    </div>

    <SearchPalette :open="searchOpen" @close="searchOpen = false" />
  </div>
</template>
