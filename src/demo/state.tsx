import { createContext, useContext } from 'react'
import {
  MID_BAND, STAGES, TODAY, addDays, bandOf, daysBetween, venueRange,
  type Band, type Guests, type HallType, type Mood, type Region, type SdmCat,
} from '../data/mock'

export const SCREEN_IDS = [
  'MAIN-01', 'MAIN-02', 'MAIN-03', 'MAIN-04',
  'Q-01', 'Q-02', 'Q-03', 'Q-04',
  'COST-01', 'COST-02', 'COST-03', 'COST-04', 'COST-05', 'COST-06', 'COST-07', 'COST-08',
  'ROAD-01', 'ROAD-02', 'ROAD-03', 'ROAD-04', 'ROAD-05', 'ROAD-06', 'ROAD-07',
  'STEP-01', 'STEP-02', 'STEP-03', 'STEP-04', 'STEP-05', 'STEP-06', 'STEP-07',
  'LOGIN-01', 'LOGIN-02', 'LOGIN-03', 'LOGIN-04', 'LOGIN-05',
  'VENUE-01', 'VENUE-02', 'VENUE-03', 'VENUE-04',
  'VENDOR-01', 'VENDOR-02', 'VENDOR-03', 'VENDOR-04', 'VENDOR-05',
  'SDM-01', 'SDM-02',
  'HOME-01', 'HOME-02', 'HOME-03',
  'INVITE-01', 'INVITE-02', 'INVITE-03', 'INVITE-04', 'INVITE-05',
  'MY-01', 'MY-02',
] as const
export type ScreenId = (typeof SCREEN_IDS)[number]

export type MoodPick = Mood | '상관없어요'
export interface When { mode: 'date' | 'month' | 'none' | null; date: string; year: string; month: string }
export interface Answers { region: Region | null; guests: Guests | null; when: When; budget: number | null; noBudget: boolean; budgetText: string; moods: MoodPick[] }
export interface StageState { done: boolean; amount: number | null; late: boolean }
export interface Todo { text: string; owner: '나' | '짝꿍' | '함께'; done: boolean }
export type LoginReason = 'save' | 'step' | 'todo' | 'invite' | 'cand' | 'join'

export interface DemoState {
  a: Answers
  plan: boolean
  band: Band
  basis: boolean
  loggedIn: boolean
  partner: 'none' | 'joined'
  stages: StageState[]
  todos: Todo[][]
  view: number
  amountText: string
  editAmount: boolean
  panel: boolean
  dateModal: boolean
  pastOpen: boolean
  pastExpanded: number | null
  pastAmount: string
  cancelOpen: boolean
  todoOpen: boolean
  inviteOpen: boolean
  newPlanOpen: boolean
  profileOpen: boolean
  unlinkOpen: boolean
  clearOpen: boolean
  login: null | { reason: LoginReason; then?: Act; goAfter?: ScreenId }
  loginFailNext: boolean
  loginError: boolean
  shared: boolean
  calculating: boolean
  budgetCard: string
  compare: string[]
  fav: string[]
  chosen: string | null
  vendor: string
  vf: { region: Region; guests: Guests; type: '전체' | HallType; priceOnly: boolean; favOnly: boolean; moods: MoodPick[]; grid: boolean }
  sf: { cat: '전체' | SdmCat; inCombo: boolean; favOnly: boolean; sort: 'low' | 'high' }
  toast: string | null
  invite: 'ok' | 'expired' | 'linked'
}

export type Act =
  | { type: 'set'; patch: Partial<DemoState> }
  | { type: 'replace'; state: DemoState }
  | { type: 'answer'; patch: Partial<Answers> }
  | { type: 'band'; band: Band }
  | { type: 'toast'; text: string }
  | { type: 'needLogin'; reason: LoginReason; then?: Act; goAfter?: ScreenId }
  | { type: 'loginOk' }
  | { type: 'loginFail' }
  | { type: 'check'; stage: number; i: number }
  | { type: 'complete'; stage: number; amount: number | null }
  | { type: 'uncomplete'; stage: number }
  | { type: 'recalc'; a: Answers }
  | { type: 'setBudget'; budget: number }
  | { type: 'addTodo'; stage: number; text: string; owner: Todo['owner'] }
  | { type: 'pastDone'; stage: number; amount: number | null }
  | { type: 'pastLater'; stage: number }
  | { type: 'toggleCompare'; id: string }
  | { type: 'toggleFav'; id: string }
  | { type: 'finishQuestions' }
  | { type: 'join' }
  | { type: 'unlink' }

/* ───────── 계산 도우미 ───────── */
export function weddingDate(w: When): { date: Date; estimated: boolean } {
  if (w.mode === 'date' && w.date) return { date: new Date(w.date + 'T00:00:00'), estimated: false }
  if (w.mode === 'month' && w.year && w.month) return { date: new Date(Number(w.year), Number(w.month) - 1, 15), estimated: false }
  return { date: addDays(TODAY, 365), estimated: true }
}
export const dday = (s: DemoState) => daysBetween(TODAY, weddingDate(s.a.when).date)
export const stageWindow = (s: DemoState, i: number) => {
  const w = weddingDate(s.a.when).date
  return { from: addDays(w, -STAGES[i].d[0]), to: addDays(w, -STAGES[i].d[1]) }
}
export const isPast = (s: DemoState, i: number) => !s.stages[i].done && dday(s) < STAGES[i].d[1]
export const pastStages = (s: DemoState) => STAGES.map((_, i) => i).filter((i) => isPast(s, i) && !s.stages[i].late)
export const nextStage = (s: DemoState) => s.stages.findIndex((x) => !x.done)
export const progress = (s: DemoState) => Math.round((s.stages.filter((x) => x.done).length / 6) * 100)

export function costs(s: DemoState) {
  const v = venueRange(s.a.region ?? '서울 강남권 외', s.a.guests ?? '150~200명')
  const sdm = bandOf(s.band).range
  return { venue: v.range, fallback: v.fallback, sdm, total: [v.range[0] + sdm[0], v.range[1] + sdm[1]] as [number, number] }
}
export const stageBudget = (s: DemoState, i: number): [number, number] | null => {
  const m = STAGES[i].money
  if (!m) return null
  const c = costs(s)
  return m === 'venue' ? c.venue : c.sdm
}
export const spent = (s: DemoState) => s.stages.reduce((sum, x) => sum + (x.done && x.amount ? x.amount : 0), 0)
export const remainingNeed = (s: DemoState): [number, number] | null => {
  const idx = STAGES.map((_, i) => i).filter((i) => STAGES[i].money && !s.stages[i].done)
  if (!idx.length) return null
  return idx.reduce<[number, number]>((acc, i) => { const r = stageBudget(s, i)!; return [acc[0] + r[0], acc[1] + r[1]] }, [0, 0])
}

/* ───────── 기본 상태 ───────── */
export const ANSWERED: Answers = {
  region: '서울 강남권 외', guests: '150~200명', when: { mode: 'date', date: '2027-10-15', year: '2027', month: '10' },
  budget: 3000, noBudget: false, budgetText: '3,000', moods: ['화사한', '클래식'],
}
const EMPTY: Answers = { region: null, guests: null, when: { mode: null, date: '', year: '', month: '' }, budget: null, noBudget: false, budgetText: '', moods: [] }
const freshStages = (): StageState[] => STAGES.map(() => ({ done: false, amount: null, late: false }))
const freshTodos = (): Todo[][] => STAGES.map((st) => st.todos.map((t) => ({ ...t, done: false })))

export const initialState = (): DemoState => ({
  a: { ...EMPTY, when: { ...EMPTY.when }, moods: [] },
  plan: false, band: MID_BAND, basis: false, loggedIn: false, partner: 'none',
  stages: freshStages(), todos: freshTodos(), view: 1, amountText: '', editAmount: false,
  panel: false, dateModal: false, pastOpen: false, pastExpanded: null, pastAmount: '', cancelOpen: false, todoOpen: false,
  inviteOpen: false, newPlanOpen: false, profileOpen: false, unlinkOpen: false, clearOpen: false,
  login: null, loginFailNext: false, loginError: false, shared: false, calculating: false, budgetCard: '',
  compare: [], fav: ['v2', 'v1', 'v4'], chosen: null, vendor: 'v4',
  vf: { region: '서울 강남권 외', guests: '150~200명', type: '전체', priceOnly: false, favOnly: false, moods: ['화사한', '클래식'], grid: false },
  sf: { cat: '전체', inCombo: false, favOnly: false, sort: 'low' },
  toast: null, invite: 'ok',
})

/** 계획이 있는 상태 (1단계 완료, 2단계 할 일 1/3) */
export const planned = (patch: Partial<DemoState> = {}): DemoState => {
  const s = initialState()
  const stages = freshStages()
  stages[0] = { done: true, amount: null, late: false }
  const todos = freshTodos()
  todos[0] = todos[0].map((t) => ({ ...t, done: true }))
  todos[1][1].done = true
  return { ...s, a: { ...ANSWERED, when: { ...ANSWERED.when }, moods: [...ANSWERED.moods] }, plan: true, stages, todos, ...patch }
}
const member = (patch: Partial<DemoState> = {}) => planned({ loggedIn: true, partner: 'joined', ...patch })
const doneUpTo = (n: number, amounts: Record<number, number> = { 1: 1980, 2: 310 }) =>
  STAGES.map((_, i) => ({ done: i < n, amount: i < n ? amounts[i] ?? null : null, late: false }))

/** 문서 · 시연 진입용 화면별 목업 상태 */
export function seedFor(id: ScreenId): DemoState {
  const s0 = initialState()
  switch (id) {
    case 'MAIN-01': case 'MAIN-02': return s0
    case 'MAIN-03': return member()
    case 'MAIN-04': return member({ partner: 'none', newPlanOpen: true })
    case 'Q-01': return { ...s0, a: { ...s0.a, guests: '150~200명' } }
    case 'Q-02': return { ...s0, a: { ...s0.a, region: '서울 강남권 외', guests: '150~200명', when: { mode: 'month', date: '', year: '2027', month: '10' }, budgetText: '3,000', budget: 3000 } }
    case 'Q-03': return { ...s0, a: { ...s0.a, region: '서울 강남권 외', guests: '150~200명', when: { mode: 'month', date: '', year: '2027', month: '10' }, budgetText: '50', budget: 50 } }
    case 'Q-04': return { ...s0, a: { ...ANSWERED, moods: ['화사한', '클래식'] } }
    case 'COST-01': return { ...planned(), plan: false, calculating: true }
    case 'COST-02': return planned()
    case 'COST-03': return planned({ a: { ...ANSWERED, budget: null, noBudget: true, budgetText: '' } })
    case 'COST-04': return planned({ a: { ...ANSWERED, guests: '아직 모르겠어요' } })
    case 'COST-05': return planned({ basis: true })
    case 'COST-06': return planned({ panel: true, a: { ...ANSWERED, when: { mode: 'month', date: '', year: '2027', month: '10' } } })
    case 'COST-07': return planned({ shared: true })
    case 'COST-08': return member()
    case 'ROAD-01': return planned()
    case 'ROAD-02': return member()
    case 'ROAD-03': return member({ stages: doneUpTo(6) })
    case 'ROAD-04': return member({ partner: 'none', a: { ...ANSWERED, when: { mode: 'none', date: '', year: '', month: '' } } })
    case 'ROAD-05': return member({ partner: 'none', dateModal: true })
    case 'ROAD-06': return member({ a: { ...ANSWERED, budget: null, noBudget: true, budgetText: '' } })
    case 'ROAD-07': return member({ stages: doneUpTo(1), pastOpen: true, a: { ...ANSWERED, when: { mode: 'date', date: '2027-02-13', year: '2027', month: '2' } } })
    case 'STEP-01': return member({ view: 1 })
    case 'STEP-02': return member({ view: 1, stages: doneUpTo(2) })
    case 'STEP-03': return member({ view: 2, stages: doneUpTo(2), amountText: '' })
    case 'STEP-04': return member({ view: 2, stages: doneUpTo(3) })
    case 'STEP-05': return member({ view: 1, stages: doneUpTo(2), cancelOpen: true })
    case 'STEP-06': return member({ partner: 'none', todoOpen: true })
    case 'STEP-07': return member({ partner: 'none', toast: '예산을 넣었어요. 남은 예산을 다시 계산했어요' })
    case 'LOGIN-01': return planned({ login: { reason: 'save' } })
    case 'LOGIN-02': return planned({ view: 1, login: { reason: 'step' } })
    case 'LOGIN-03': return planned({ view: 1, login: { reason: 'todo' } })
    case 'LOGIN-04': return planned({ login: { reason: 'invite' } })
    case 'LOGIN-05': return planned({ view: 1, login: { reason: 'cand' } })
    case 'VENUE-01': return member({ compare: ['v2', 'v1'] })
    case 'VENUE-02': return member({ compare: ['v2', 'v1'], vf: { ...s0.vf, grid: true } })
    case 'VENUE-03': return member({ vf: { ...s0.vf, region: '제주' } })
    case 'VENUE-04': return planned()
    case 'VENDOR-01': return member({ vendor: 'v4', compare: ['v2'] })
    case 'VENDOR-02': return member({ vendor: 'v7' })
    case 'VENDOR-03': return member({ compare: ['v2', 'v1'] })
    case 'VENDOR-04': return member({ compare: [] })
    case 'VENDOR-05': return member({ compare: ['v2', 'v1'], clearOpen: true })
    case 'SDM-01': return member({ stages: doneUpTo(2) })
    case 'SDM-02': return planned()
    case 'HOME-01': return member()
    case 'HOME-02': return member({ stages: doneUpTo(6) })
    case 'HOME-03': return member({ partner: 'none', profileOpen: true })
    case 'INVITE-01': return member({ partner: 'none', inviteOpen: true })
    case 'INVITE-02': return { ...s0, invite: 'ok' }
    case 'INVITE-03': return { ...s0, invite: 'ok', login: { reason: 'join' } }
    case 'INVITE-04': return { ...s0, invite: 'expired' }
    case 'INVITE-05': return { ...s0, invite: 'linked' }
    case 'MY-01': return member()
    case 'MY-02': return member({ unlinkOpen: true })
  }
}

/** 시연 중 전제(계획 있음)가 없는 화면으로 이동하면 그 화면 기본 상태로 맞춘다 */
export function ensure(id: ScreenId, s: DemoState): DemoState | null {
  const needsPlan = /^(COST-0[2-8]|ROAD|STEP|VENUE|VENDOR|SDM|HOME|MY|MAIN-03)/.test(id)
  if (needsPlan && !s.plan) return seedFor(id)
  return null
}

export function reducer(s: DemoState, a: Act): DemoState {
  switch (a.type) {
    case 'set': return { ...s, ...a.patch }
    case 'replace': return a.state
    case 'answer': return { ...s, a: { ...s.a, ...a.patch } }
    case 'band': return { ...s, band: a.band }
    case 'toast': return { ...s, toast: a.text }
    case 'needLogin':
      if (s.loggedIn) return a.then ? reducer(s, a.then) : s
      return { ...s, login: { reason: a.reason, then: a.then, goAfter: a.goAfter }, loginError: false }
    case 'loginOk': {
      const then = s.login?.then
      const reason = s.login?.reason
      let n: DemoState = { ...s, loggedIn: true, login: null, loginError: false }
      if (reason === 'join') return reducer(n, { type: 'join' })
      if (then) n = reducer(n, then)
      return n.toast ? n : { ...n, toast: '로그인했어요. 계획이 저장됐어요' }
    }
    case 'loginFail': return { ...s, loginError: true, loginFailNext: false }
    case 'check': return { ...s, todos: s.todos.map((l, i) => (i === a.stage ? l.map((t, j) => (j === a.i ? { ...t, done: !t.done } : t)) : l)) }
    case 'complete': {
      const stages = s.stages.map((x, i) => (i === a.stage ? { done: true, amount: a.amount, late: false } : x))
      return { ...s, stages, editAmount: false, amountText: '', toast: a.amount ? '단계를 완료했어요. 남은 예산을 다시 계산했어요' : '단계를 완료했어요' }
    }
    case 'uncomplete': {
      const stages = s.stages.map((x, i) => (i === a.stage ? { ...x, done: false } : x))
      const amt = s.stages[a.stage].amount
      return { ...s, stages, cancelOpen: false, amountText: amt ? amt.toLocaleString('ko-KR') : '', toast: '완료를 취소했어요' }
    }
    case 'recalc': {
      const regionChanged = a.a.region !== s.a.region
      const onlyMood = !regionChanged && a.a.guests === s.a.guests && JSON.stringify(a.a.when) === JSON.stringify(s.a.when) && a.a.budget === s.a.budget && a.a.noBudget === s.a.noBudget
      const toast = regionChanged ? '지역이 바뀌어 스드메 예산대를 다시 정했어요' : onlyMood ? '분위기는 예식장 후보 순서에만 반영돼요' : '바꾼 조건으로 다시 계산했어요'
      const n: DemoState = { ...s, a: a.a, panel: false, dateModal: false, band: regionChanged ? MID_BAND : s.band, toast }
      return pastStages(n).length && JSON.stringify(a.a.when) !== JSON.stringify(s.a.when) ? { ...n, pastOpen: true } : n
    }
    case 'setBudget': return { ...s, a: { ...s.a, budget: a.budget, noBudget: false, budgetText: a.budget.toLocaleString('ko-KR') }, budgetCard: '', toast: '예산을 넣었어요. 남은 예산을 다시 계산했어요' }
    case 'addTodo': return { ...s, todos: s.todos.map((l, i) => (i === a.stage ? [...l, { text: a.text, owner: a.owner, done: false }] : l)), todoOpen: false, toast: '할 일을 추가했어요' }
    case 'pastDone': {
      const stages = s.stages.map((x, i) => (i === a.stage ? { done: true, amount: a.amount, late: false } : x))
      const n = { ...s, stages, pastExpanded: null, pastAmount: '' }
      return pastStages(n).length ? n : { ...n, pastOpen: false, toast: '남은 예산을 다시 계산했어요' }
    }
    case 'pastLater': {
      const stages = s.stages.map((x, i) => (i === a.stage ? { ...x, late: true } : x))
      const n = { ...s, stages, pastExpanded: null }
      return pastStages(n).length ? n : { ...n, pastOpen: false }
    }
    case 'toggleCompare': {
      if (s.compare.includes(a.id)) return { ...s, compare: s.compare.filter((x) => x !== a.id), toast: '비교함에서 뺐어요' }
      if (s.compare.length >= 3) return { ...s, toast: '비교는 최대 3곳까지 담을 수 있어요' }
      return { ...s, compare: [...s.compare, a.id], toast: `비교함에 담았어요 (${s.compare.length + 1}/3)` }
    }
    case 'toggleFav': return { ...s, fav: s.fav.includes(a.id) ? s.fav.filter((x) => x !== a.id) : [...s.fav, a.id] }
    case 'finishQuestions': {
      const n: DemoState = { ...s, plan: true, calculating: false, band: MID_BAND, basis: false }
      return pastStages(n).length ? { ...n, pastOpen: true } : n
    }
    case 'join': {
      const p = planned()
      return { ...s, a: p.a, stages: p.stages, todos: p.todos, plan: true, loggedIn: true, partner: 'joined', login: null, toast: '준근님과 함께 준비를 시작했어요' }
    }
    case 'unlink': return { ...s, partner: 'none', unlinkOpen: false, toast: '짝꿍 연결을 해제했어요' }
  }
}

export interface DemoApi { s: DemoState; dispatch: (a: Act) => void; go: (id: ScreenId) => void; readonly: boolean; docId: ScreenId | null }
export const DemoCtx = createContext<DemoApi>(null as unknown as DemoApi)
export const useDemo = () => useContext(DemoCtx)

/** 문서 화면에서만 번호를 붙인다: an('ROAD-02','03') */
export function useAnno() {
  const { docId } = useDemo()
  return (spec: ScreenId | ScreenId[], no: string): Record<string, string> =>
    docId && (Array.isArray(spec) ? spec.includes(docId) : spec === docId) ? { 'data-anno': no } : {}
}
