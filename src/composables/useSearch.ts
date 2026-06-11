import { ref, shallowRef } from 'vue'
import type { Importance, SearchDoc, Technology } from '../types/content'
import { loadAllTech, techMetas } from '../data'
import { hasConceptMap, loadConceptMap } from '../data/knowledge'
import type { ConceptMap } from '../types/knowledge'

let indexPromise: Promise<SearchDoc[]> | null = null
const docs = shallowRef<SearchDoc[]>([])
const indexing = ref(false)

function buildDocs(techs: Technology[]): SearchDoc[] {
  const out: SearchDoc[] = []
  for (const t of techs) {
    const base = `/tech/${t.id}`
    out.push({
      ref: `${t.id}/overview/overview`,
      techId: t.id,
      techName: t.name,
      kind: 'overview',
      title: `${t.name} — Overview`,
      body: `${t.overview.what} ${t.overview.why}`,
      route: `${base}/overview`,
    })
    for (const i of t.internals)
      out.push({ ref: `${t.id}/internal/${i.id}`, techId: t.id, techName: t.name, kind: 'internal', title: i.title, body: `${i.summary} ${i.details.join(' ')}`, route: `${base}/internals#${i.id}` })
    for (const k of t.keywords)
      out.push({ ref: `${t.id}/keyword/${k.id}`, techId: t.id, techName: t.name, kind: 'keyword', title: k.term, body: `${k.whyAsked} ${k.explanation}`, importance: k.importance, route: `${base}/keywords#${k.id}` })
    for (const c of t.cheatSheets)
      out.push({ ref: `${t.id}/cheat-sheet/${c.id}`, techId: t.id, techName: t.name, kind: 'cheat-sheet', title: c.title, body: c.rows.map((r) => `${r.concept} ${r.description}`).join(' '), route: `${base}/cheatsheets#${c.id}` })
    for (const q of t.questions)
      out.push({ ref: `${t.id}/question/${q.id}`, techId: t.id, techName: t.name, kind: 'question', title: q.question, body: q.answer, route: `${base}/questions#${q.id}` })
    for (const q of t.codingQuestions)
      out.push({ ref: `${t.id}/coding/${q.id}`, techId: t.id, techName: t.name, kind: 'coding', title: q.title, body: `${q.problem} ${q.explanation}`, route: `${base}/coding#${q.id}` })
    for (const s of t.scenarios)
      out.push({ ref: `${t.id}/scenario/${s.id}`, techId: t.id, techName: t.name, kind: 'scenario', title: s.title, body: `${s.situation} ${s.approach.join(' ')}`, route: `${base}/scenarios#${s.id}` })
    for (const m of t.mentalModels)
      out.push({ ref: `${t.id}/mental-model/${m.id}`, techId: t.id, techName: t.name, kind: 'mental-model', title: m.title, body: m.explanation.join(' '), route: `${base}/mental-models#${m.id}` })
    for (const r of t.revision)
      out.push({ ref: `${t.id}/revision/${r.id}`, techId: t.id, techName: t.name, kind: 'revision', title: r.topic, body: `${r.thirtySecond} ${r.twoMinute}`, importance: r.importance, route: `${base}/revision#${r.id}` })
    for (const s of t.securityTopics ?? [])
      out.push({ ref: `${t.id}/security/${s.id}`, techId: t.id, techName: t.name, kind: 'security', title: s.title, body: `${s.attackExample} ${s.impact}`, route: `${base}/security#${s.id}` })
  }
  return out
}

function buildConceptDocs(maps: ConceptMap[]): SearchDoc[] {
  const out: SearchDoc[] = []
  for (const map of maps) {
    const techName = techMetas.find((m) => m.id === map.techId)?.name ?? map.techId
    for (const c of map.concepts) {
      out.push({
        ref: `${map.techId}/concept/${c.slug}`,
        techId: map.techId,
        techName,
        kind: 'concept',
        title: c.name,
        body: `${c.definition} ${c.explanation.join(' ')}`,
        importance: Math.min(5, Math.max(1, c.interviewFrequency)) as Importance,
        route: `/tech/${map.techId}/knowledge#${c.slug}`,
      })
    }
  }
  return out
}

async function ensureIndex(): Promise<SearchDoc[]> {
  if (!indexPromise) {
    indexing.value = true
    indexPromise = Promise.all([
      loadAllTech(),
      Promise.all(
        techMetas.filter((m) => hasConceptMap(m.id)).map((m) => loadConceptMap(m.id)),
      ).then((maps) => maps.filter((m): m is ConceptMap => m !== null)),
    ]).then(([techs, maps]) => {
      docs.value = [...buildDocs(techs), ...buildConceptDocs(maps)]
      indexing.value = false
      return docs.value
    })
  }
  return indexPromise
}

export interface SearchHit extends SearchDoc {
  score: number
}

function scoreDoc(doc: SearchDoc, terms: string[]): number {
  let score = 0
  const title = doc.title.toLowerCase()
  const body = doc.body.toLowerCase()
  for (const term of terms) {
    if (title === term) score += 100
    else if (title.includes(term)) score += title.startsWith(term) ? 40 : 25
    if (body.includes(term)) score += 5
  }
  if (score > 0 && doc.importance) score += doc.importance * 2
  if (score > 0 && (doc.kind === 'keyword' || doc.kind === 'overview')) score += 8
  return score
}

export function useSearch() {
  const results = shallowRef<SearchHit[]>([])
  const searching = ref(false)

  async function search(query: string, limit = 30) {
    const q = query.trim().toLowerCase()
    if (q.length < 2) {
      results.value = []
      return
    }
    searching.value = true
    const all = await ensureIndex()
    const terms = q.split(/\s+/).filter(Boolean)
    results.value = all
      .map((d) => ({ ...d, score: scoreDoc(d, terms) }))
      .filter((d) => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
    searching.value = false
  }

  return { results, searching, indexing, search }
}
