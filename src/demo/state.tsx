import { createContext, useContext } from 'react'
import {
  MID_BAND, STAGES, TODAY, addDays, bandOf, daysBetween, venueRange,
  type Band, type Guests, type HallType, type Mood, type Region,
} from '../data/mock'

export const SCREEN_IDS = [
  'SCR-01', 'SCR-01-B', 'SCR-02-Q1', 'SCR-02-Q2', 'SCR-02-Q3', 'SCR-02-Q4', 'SCR-02-Q5', 'SCR-02-E',
  'SCR-03', 'SCR-03-B', 'SCR-03-C', 'SCR-03-E', 'SCR-03-F',
  'SCR-06', 'SCR-06-B', 'SCR-06-C', 'SCR-06-D', 'SCR-06-D2', 'SCR-06-E', 'SCR-06-F',
  'SCR-09', 'SCR-10', 'SCR-11', 'SCR-11-B',
] as const
export type ScreenId = (typeof SCREEN_IDS)[number]

export type MoodPick = Mood | '상관없어요'
export interface When { mode: 'date' | 'month' | 'none' | null; date: string; year: string; month: string }
export interface Answers {
  region: Region | null; guests: Guests | null; when: When
  budget: number | null; noBudget: boolean; budgetText: string; moods: MoodPick[]
}
export interface StageState { done: boolean; amount: number | null; late: boolean }
export type LoginReason = 'top' | 'save' | 'amount' | 'todo' | 'invite'

export interface DemoState {
  a: Answers
  plan: boolean
  band: Band
  basis: boolean
  loggedIn: boolean
  partner: 'none' | 'invited' | 'joined'
  partnerEdited: boolean
  stages: StageState[]
  checks: boolean[][]
  view: number
  banner: number | null
  editAmount: boolean
  amountText: string
  panel: boolean
  pastOpen: boolean
  pastExpanded: number | null
  pastAmount: string
  login: null | { reason: LoginReason; then?: Act }
  loginFailNext: boolean
  loginError: boolean
  invite: null | { hasPlan: boolean }
  regionOpen: boolean
  calculating: boolean
  confirmNew: boolean
  budgetCard: string
  vf: { region: Region; guests: Guests; moods: Mood[]; type: '전체' | HallType; priceOnly: boolean; shown: number }
  toast: string | null
}

export type Act =
  | { type: 'set'; patch: Partial<DemoState> }
  | { type: 'replace'; state: DemoState }
  | { type: 'answer'; patch: Partial<Answers> }
  | { type: 'band'; band: Band }
  | { type: 'toast'; text: string }
  | { type: 'needLogin'; reason: LoginReason; then?: Act }
  | { type: 'loginOk' }
  | { type: 'loginFail' }
  | { type: 'check'; stage: number; i: number }
  | { type: 'complete'; stage: number; amount: number | null }
  | { type: 'recalc'; a: Answers }
  | { type: 'setBudget'; budget: number }
  | { type: 'join' }
  | { type: 'pastDone'; stage: number; amount: number | null }
  | { type: 'pastLater'; stage: number }
  | { type: 'invite' }
  | { type: 'finishQuestions' }
  | { type: 'newPlan' }

/* ───────── 계산 도우미 ───────── */
export function weddingDate(w: When): { date: Date; estimated: boolean } {
  if (w.mode === 'date' && w.date) return { date: new Date(w.date + 'T00:00:00'), estimated: false }
  if (w.mode === 'month' && w.year && w.month) return { date: new Date(Number(w.year), Number(w.month) - 1, 1), estimated: true }
  const d = new Date(TODAY.getFullYear() + 1, TODAY.getMonth(), 1)
  return { date: d, estimated: true }
}
export const dday = (s: DemoState) => daysBetween(TODAY, weddingDate(s.a.when).date)
export const stageWindow = (s: DemoState, i: number) => {
  const w = weddingDate(s.a.when).date
  return { from: addDays(w, -STAGES[i].d[0]), to: addDays(w, -STAGES[i].d[1]) }
}
/** 권장 기간이 지난 미완료 단계 */
export const isPast = (s: DemoState, i: number) => !s.stages[i].done && dday(s) < STAGES[i].d[1]
export const pastStages = (s: DemoState) => STAGES.map((_, i) => i).filter((i) => isPast(s, i) && !s.stages[i].late)
export const nextStage = (s: DemoState) => s.stages.findIndex((x) => !x.done)

export function costs(s: DemoState) {
  const region = s.a.region ?? '서울 강남권 외'
  const guests = s.a.guests ?? '150~200명'
  const v = venueRange(region, guests)
  const sdm = bandOf(s.band).range
  const total: [number, number] = [v.range[0] + sdm[0], v.range[1] + sdm[1]]
  return { venue: v.range, fallback: v.fallback, sdm, total }
}
export const stageBudget = (s: DemoState, i: number): [number, number] | null => {
  const m = STAGES[i].money
  if (!m) return null
  const c = costs(s)
  return m === 'venue' ? c.venue : c.sdm
}
export const spent = (s: DemoState) => s.stages.reduce((sum, x) => sum + (x.done && x.amount ? x.amount : 0), 0)
/** 남은 미완료 금액 단계의 예상 비용 합 */
export const remainingNeed = (s: DemoState): [number, number] | null => {
  const idx = STAGES.map((_, i) => i).filter((i) => STAGES[i].money && !s.stages[i].done)
  if (!idx.length) return null
  return idx.reduce<[number, number]>((acc, i) => { const r = stageBudget(s, i)!; return [acc[0] + r[0], acc[1] + r[1]] }, [0, 0])
}

/* ───────── 기본 상태 ───────── */
const ANSWERED: Answers = {
  region: '서울 강남권 외', guests: '150~200명',
  when: { mode: 'date', date: '2027-10-16', year: '2027', month: '10' },
  budget: 3000, noBudget: false, budgetText: '3,000', moods: ['화사한', '클래식'],
}
const EMPTY: Answers = { region: null, guests: null, when: { mode: null, date: '', year: '', month: '' }, budget: null, noBudget: false, budgetText: '', moods: [] }

const freshStages = (): StageState[] => STAGES.map(() => ({ done: false, amount: null, late: false }))

export const initialState = (): DemoState => ({
  a: { ...EMPTY, when: { ...EMPTY.when }, moods: [] },
  plan: false,
  band: MID_BAND,
  basis: false,
  loggedIn: false,
  partner: 'none',
  partnerEdited: false,
  stages: freshStages(),
  checks: STAGES.map((st) => st.todos.map(() => false)),
  view: 1,
  banner: null,
  editAmount: false,
  amountText: '',
  panel: false,
  pastOpen: false,
  pastExpanded: null,
  pastAmount: '',
  login: null,
  loginFailNext: false,
  loginError: false,
  invite: null,
  regionOpen: false,
  calculating: false,
  confirmNew: false,
  budgetCard: '',
  vf: { region: '서울 강남권 외', guests: '150~200명', moods: ['화사한', '클래식'], type: '전체', priceOnly: false, shown: 10 },
  toast: null,
})

const planned = (patch: Partial<DemoState> = {}): DemoState => {
  const s = initialState()
  const st = freshStages()
  st[0] = { done: true, amount: null, late: false }
  const checks = s.checks.map((c) => [...c])
  checks[0] = [true, true, true]
  checks[1] = [false, true, false]
  return { ...s, a: { ...ANSWERED, when: { ...ANSWERED.when }, moods: [...ANSWERED.moods] }, plan: true, stages: st, checks, ...patch }
}

/** 문서·시연 진입용 화면별 목업 상태 */
export function seedFor(id: ScreenId): DemoState {
  const s0 = initialState()
  const done2 = () => { const st = planned().stages; st[1] = { done: true, amount: 1980, late: false }; return st }
  switch (id) {
    case 'SCR-01': return s0
    case 'SCR-01-B': return planned({ loggedIn: true, stages: done2() })
    case 'SCR-02-Q1': return { ...s0, regionOpen: true }
    case 'SCR-02-Q2': return { ...s0, a: { ...s0.a, region: '서울 강남권 외', guests: '150~200명' } }
    case 'SCR-02-Q3': return { ...s0, a: { ...s0.a, region: '서울 강남권 외', guests: '150~200명', when: { ...ANSWERED.when } } }
    case 'SCR-02-Q4': return { ...s0, a: { ...ANSWERED, moods: [] } }
    case 'SCR-02-Q5': return { ...s0, a: { ...ANSWERED } }
    case 'SCR-02-E': return { ...s0, a: { ...ANSWERED } }
    case 'SCR-03': return planned({ stages: freshStages() })
    case 'SCR-03-B': return planned({ stages: freshStages(), panel: true })
    case 'SCR-03-C': return planned({ stages: freshStages(), a: { ...ANSWERED, budget: null, noBudget: true, budgetText: '' } })
    case 'SCR-03-E': return planned({ stages: freshStages(), a: { ...ANSWERED, guests: '아직 모르겠어요' } })
    case 'SCR-03-F': return planned({ stages: freshStages(), basis: true })
    case 'SCR-06': return planned({ loggedIn: true })
    case 'SCR-06-B': return planned({ loggedIn: true, stages: done2(), view: 1, banner: 1 })
    case 'SCR-06-C': return planned({ loggedIn: true, stages: done2(), view: 1, a: { ...ANSWERED, budget: null, noBudget: true, budgetText: '' } })
    case 'SCR-06-D': return planned({ loggedIn: true, view: 1, amountText: '' })
    case 'SCR-06-D2': return planned({ loggedIn: true, stages: done2(), view: 2 })
    case 'SCR-06-E': return planned({ loggedIn: true, a: { ...ANSWERED, when: { mode: 'none', date: '', year: '', month: '' } } })
    case 'SCR-06-F': return planned({ loggedIn: true, stages: freshStages(), pastOpen: true, pastExpanded: 1, a: { ...ANSWERED, when: { mode: 'date', date: '2027-04-17', year: '2027', month: '4' } } })
    case 'SCR-09': return planned({ loggedIn: true, view: 1 })
    case 'SCR-10': return planned({ loggedIn: true, stages: done2(), view: 2 })
    case 'SCR-11': return { ...s0, login: { reason: 'top' } }
    case 'SCR-11-B': return { ...s0, invite: { hasPlan: true } }
  }
}

/** 시연 중 화면 이동 시 필요한 전제(결과 있음 등)가 없으면 그 화면 기본 상태로 맞춘다 */
export function ensure(id: ScreenId, s: DemoState): DemoState | null {
  const needsPlan = id.startsWith('SCR-03') || id.startsWith('SCR-06') || id === 'SCR-09' || id === 'SCR-10' || id === 'SCR-01-B'
  if (needsPlan && !s.plan) return seedFor(id)
  return null
}

const LOGIN_TOAST: Partial<Record<LoginReason, string>> = { save: '계획을 저장했어요' }

export function reducer(s: DemoState, a: Act): DemoState {
  switch (a.type) {
    case 'set': return { ...s, ...a.patch }
    case 'replace': return a.state
    case 'answer': return { ...s, a: { ...s.a, ...a.patch } }
    case 'band': return { ...s, band: a.band }
    case 'toast': return { ...s, toast: a.text }
    case 'needLogin':
      if (s.loggedIn) return a.then ? reducer(s, a.then) : s
      return { ...s, login: { reason: a.reason, then: a.then }, loginError: false }
    case 'loginOk': {
      const then = s.login?.then
      const reason = s.login?.reason
      let n: DemoState = { ...s, loggedIn: true, login: null, loginError: false }
      if (then) n = reducer(n, then)
      const t = reason && LOGIN_TOAST[reason]
      return t && !n.toast ? { ...n, toast: t } : n
    }
    case 'loginFail': return { ...s, loginError: true, loginFailNext: false }
    case 'check': {
      const checks = s.checks.map((c, i) => (i === a.stage ? c.map((v, j) => (j === a.i ? !v : v)) : c))
      return { ...s, checks }
    }
    case 'complete': {
      const stages = s.stages.map((x, i) => (i === a.stage ? { done: true, amount: a.amount, late: false } : x))
      return { ...s, stages, banner: a.stage, editAmount: false, amountText: '' }
    }
    case 'recalc': {
      const regionChanged = a.a.region !== s.a.region
      const onlyMood = !regionChanged && a.a.guests === s.a.guests && JSON.stringify(a.a.when) === JSON.stringify(s.a.when) && a.a.budget === s.a.budget && a.a.noBudget === s.a.noBudget
      const toast = regionChanged ? '지역이 바뀌어 스드메 예산대를 다시 정했어요' : onlyMood ? '분위기는 예식장 후보 순서에 반영돼요' : '바꾼 조건으로 다시 계산했어요'
      const n: DemoState = { ...s, a: a.a, panel: false, band: regionChanged ? MID_BAND : s.band, toast }
      // 예식일을 바꿔 지난 단계가 생기면 확인 모달
      return pastStages(n).length && JSON.stringify(a.a.when) !== JSON.stringify(s.a.when) ? { ...n, pastOpen: true } : n
    }
    case 'setBudget': return { ...s, a: { ...s.a, budget: a.budget, noBudget: false, budgetText: a.budget.toLocaleString('ko-KR') }, budgetCard: '' }
    case 'join': return { ...s, invite: null, loggedIn: true, plan: true, partner: 'joined', toast: '준근님과 함께 준비를 시작했어요' }
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
    case 'invite': return { ...s, partner: s.partner === 'none' ? 'invited' : s.partner, toast: '초대 링크를 복사했어요. 링크는 7일 동안 열 수 있어요' }
    case 'finishQuestions': {
      const n: DemoState = { ...s, plan: true, calculating: false, band: MID_BAND, basis: false }
      return pastStages(n).length ? { ...n, pastOpen: true } : n
    }
    case 'newPlan': return { ...s, confirmNew: false }
  }
}

export interface DemoApi { s: DemoState; dispatch: (a: Act) => void; go: (id: ScreenId) => void; readonly: boolean; docId: ScreenId | null }
export const DemoCtx = createContext<DemoApi>(null as unknown as DemoApi)
export const useDemo = () => useContext(DemoCtx)

/** 문서 화면에서만 번호를 붙인다: an('SCR-03','04') */
export function useAnno() {
  const { docId } = useDemo()
  return (spec: ScreenId | ScreenId[], no: string): Record<string, string> =>
    docId && (Array.isArray(spec) ? spec.includes(docId) : spec === docId) ? { 'data-anno': no } : {}
}
