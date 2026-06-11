import { createRouter, createWebHistory } from 'vue-router'
import { techMetas } from '../data'

// Constrain the lesson route's :tech param to real technology ids so it
// doesn't shadow unknown two-segment paths (those fall through to 404).
const techPattern = techMetas.map((m) => m.id).join('|')

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { title: 'InterviewMaster — Frontend & Backend Interview Prep' } },
    { path: '/tech/:id/:section?', name: 'tech', component: () => import('../views/TechView.vue'), meta: { title: 'Technology' } },
    { path: '/revision', name: 'revision', component: () => import('../views/RevisionView.vue'), meta: { title: 'Revision Mode' } },
    { path: '/flashcards', name: 'flashcards', component: () => import('../views/FlashcardsView.vue'), meta: { title: 'Flashcards' } },
    { path: '/bookmarks', name: 'bookmarks', component: () => import('../views/BookmarksView.vue'), meta: { title: 'Bookmarks & Notes' } },
    { path: '/progress', name: 'progress', component: () => import('../views/ProgressView.vue'), meta: { title: 'Progress' } },
    { path: '/last-30', name: 'last-30', component: () => import('../views/Last30View.vue'), meta: { title: 'Last 30 Minutes' } },
    { path: '/companies', name: 'companies', component: () => import('../views/CompaniesView.vue'), meta: { title: 'Company Question Bank' } },
    { path: '/roadmaps', name: 'roadmaps', component: () => import('../views/RoadmapsView.vue'), meta: { title: 'Roadmaps' } },
    { path: '/mock', name: 'mock', component: () => import('../views/MockInterviewView.vue'), meta: { title: 'Mock Interview' } },
    // Dedicated concept lesson, e.g. /javascript/closure — standalone page, no app chrome (opens in its own tab)
    { path: `/:tech(${techPattern})/:slug`, name: 'lesson', component: () => import('../views/LessonView.vue'), meta: { title: 'Lesson', layout: 'bare' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: 'Not Found' } },
  ],
})

router.afterEach((to) => {
  const base = 'InterviewMaster'
  document.title = to.meta.title ? `${to.meta.title} · ${base}` : base
})

export default router
