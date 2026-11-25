import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { DemoCtx, ensure, reducer, seedFor, weddingDate, type Act, type DemoState, type LoginReason, type ScreenId } from '../demo/state'
import { Screen } from '../screens'
import { budgetError, parseNum } from '../screens/ui'
import { regionLacksData, venueById } from '../data/mock'
import { OverlayCtx, SCREEN_W } from '../screens/ui'
import { SPEC, screenById } from '../data/spec'
import { BAR_H, BrowserFrame, useHeight } from './Static'

const firstId = SPEC.screens[0].id

const LOGIN_SCREEN: Record<LoginReason, ScreenId> = { save: 'LOGIN-01', step: 'LOGIN-02', todo: 'LOGIN-03', invite: 'LOGIN-04', cand: 'LOGIN-05', join: 'INVITE-03' }
const ROAD_BASE = new Set<string>(['LOGIN-04', 'INVITE-01', 'STEP-06', 'STEP-07'])
const STEP_BASE = new Set<string>(['LOGIN-02', 'LOGIN-03', 'LOGIN-05'])

/** 지금 상태가 어떤 화면 정의서 항목에 해당하는지 (변형 · 팝업 포함) */
function detect(id: ScreenId, s: DemoState): ScreenId {
  if (s.login) return LOGIN_SCREEN[s.login.reason]
  if (s.inviteOpen) return 'INVITE-01'
  if (s.newPlanOpen) return 'MAIN-04'
  if (s.profileOpen) return 'HOME-03'
  if (s.unlinkOpen) return 'MY-02'
  if (s.clearOpen) return 'VENDOR-05'
  if (s.cancelOpen) return 'STEP-05'
  if (s.todoOpen) return 'STEP-06'
  if (s.dateModal) return 'ROAD-05'
  if (s.pastOpen) return 'ROAD-07'
  const p = id.split('-')[0]
  if (id === 'Q-02' || id === 'Q-03') return !s.a.noBudget && budgetError(parseNum(s.a.budgetText)) ? 'Q-03' : 'Q-02'
  if ((p === 'COST' && id !== 'COST-01') || id === 'LOGIN-01') {
    if (s.panel) return 'COST-06'
    if (s.shared) return 'COST-07'
    if (s.loggedIn) return 'COST-08'
    if (s.basis) return 'COST-05'
    if (!s.a.budget) return 'COST-03'
    return s.a.guests === '아직 모르겠어요' ? 'COST-04' : 'COST-02'
  }
  if (p === 'ROAD' || ROAD_BASE.has(id)) {
    if (!s.loggedIn) return 'ROAD-01'
    if (s.stages.every((x) => x.done)) return 'ROAD-03'
    if (weddingDate(s.a.when).estimated) return 'ROAD-04'
    return s.a.budget ? 'ROAD-02' : 'ROAD-06'
  }
  if (p === 'STEP' || STEP_BASE.has(id)) {
    const done = s.stages[s.view]?.done
    if (s.view === 2) return done ? 'STEP-04' : 'STEP-03'
    return done ? 'STEP-02' : 'STEP-01'
  }
  if (p === 'VENUE') return !s.loggedIn ? 'VENUE-04' : regionLacksData(s.vf.region) ? 'VENUE-03' : s.vf.grid ? 'VENUE-02' : 'VENUE-01'
  if (p === 'SDM') return s.loggedIn ? 'SDM-01' : 'SDM-02'
  if (id === 'VENDOR-01' || id === 'VENDOR-02') return venueById(s.vendor)?.status === '휴업' ? 'VENDOR-02' : 'VENDOR-01'
  if (p === 'VENDOR') return s.compare.length ? 'VENDOR-03' : 'VENDOR-04'
  if (p === 'HOME') return s.stages.every((x) => x.done) ? 'HOME-02' : 'HOME-01'
  if (p === 'INVITE') return s.invite === 'expired' ? 'INVITE-04' : s.invite === 'linked' ? 'INVITE-05' : 'INVITE-02'
  if (p === 'MY') return 'MY-01'
  if (id === 'MAIN-04') return 'MAIN-03'
  return id
}

/** 문서와 독립된 시연. 상태는 이 페이지 안에서만 유지되고 새로고침하면 진입 화면 기준으로 초기화된다. */
export function DemoPage() {
  const params = useParams()
  const id = (screenById(params.id ?? '') ? params.id : firstId) as ScreenId
  const nav = useNavigate()
  const [s, raw] = useReducer(reducer, id, seedFor)
  const scrollRef = useRef<HTMLDivElement>(null)
  const go = useCallback((to: ScreenId) => { nav(`/demo/${to}`); scrollRef.current?.scrollTo({ top: 0 }) }, [nav])
  const sRef = useRef(s)
  useEffect(() => { sRef.current = s }, [s])
  /** 로그인 뒤 이동(goAfter)처럼 화면 이동이 따르는 동작을 처리한다 */
  const dispatch = useCallback((a: Act) => {
    const cur = sRef.current
    if (a.type === 'needLogin' && cur.loggedIn && a.goAfter) go(a.goAfter)
    if (a.type === 'loginOk' && cur.login) {
      if (cur.login.reason === 'join') go('ROAD-02')
      else if (cur.login.goAfter) go(cur.login.goAfter)
    }
    raw(a)
  }, [go])
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null)
  const [contentRef, contentH] = useHeight<HTMLDivElement>()

  /** 계획이 필요한 화면으로 '이동'했을 때만 그 화면 기본 상태로 맞춘다 (상태 교체 직후의 경합 방지) */
  useEffect(() => {
    const fix = ensure(id, sRef.current)
    if (fix) raw({ type: 'replace', state: fix })
  }, [id])

  useEffect(() => {
    if (!s.toast) return
    const t = setTimeout(() => dispatch({ type: 'set', patch: { toast: null } }), 2600)
    return () => clearTimeout(t)
  }, [s.toast, dispatch])

  const boxRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 1100, h: 700 })
  useLayoutEffect(() => {
    const f = () => {
      const w = boxRef.current?.clientWidth ?? 1100
      setBox({ w, h: Math.max(520, window.innerHeight - 150) })
    }
    f()
    const ro = new ResizeObserver(f)
    if (boxRef.current) ro.observe(boxRef.current)
    window.addEventListener('resize', f)
    return () => { ro.disconnect(); window.removeEventListener('resize', f) }
  }, [])
  const scale = Math.min(1, box.w / SCREEN_W)
  const viewH = box.h - BAR_H * scale

  const api = useMemo(() => ({ s, dispatch, go, readonly: false, docId: null }), [s, dispatch, go])
  const now = detect(id, s)
  const sc = screenById(now)!

  const jump = (to: ScreenId) => { dispatch({ type: 'replace', state: seedFor(to) }); go(to) }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-5 sm:px-8 xl:flex-row xl:items-start">
      <div ref={boxRef} className="min-w-0 flex-1">
        <div style={{ width: SCREEN_W * scale, height: box.h }} className="relative mx-auto">
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: SCREEN_W }}>
            <BrowserFrame url={`wedid.co.kr${sc.route.startsWith('/') ? sc.route : '/'}`}>
              <div ref={scrollRef} className="relative overflow-y-auto overflow-x-hidden" style={{ height: viewH / scale }}>
                <DemoCtx.Provider value={api}>
                  <OverlayCtx.Provider value={overlay}>
                    <div ref={contentRef} style={{ ["--win-h" as string]: `${viewH / scale}px` }}><Screen id={id} /></div>
                  </OverlayCtx.Provider>
                </DemoCtx.Provider>
              </div>
            </BrowserFrame>
          </div>
          {/* 모달 · 패널 · 토스트는 보이는 창 위에 띄운다 */}
          <div className="pointer-events-none absolute inset-x-0 overflow-hidden rounded-b-[14px]" style={{ top: BAR_H * scale, height: viewH }}>
            <div ref={setOverlay} className="relative [&>*]:pointer-events-auto" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: SCREEN_W, height: viewH / scale }} />
          </div>
        </div>
        <p className="mt-2 text-center text-[11.5px] text-neutral-400">화면 높이 {Math.round(contentH)}px · 창 안에서 스크롤해요</p>
      </div>

      <aside className="no-print w-full shrink-0 space-y-4 xl:w-[320px]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-[12px] font-bold text-[#44695b]">시연하기</p>
          <p className="mt-1 text-[18px] font-extrabold">{sc.name}</p>
          <p className="font-mono text-[11.5px] text-neutral-500">{sc.id} · {sc.type}</p>
          <p className="mt-2 text-[13px] text-neutral-500">창 안의 버튼 · 입력이 실제로 동작해요. 문서와는 따로 움직여요.</p>
          <label className="mt-4 block text-[12px] font-bold text-neutral-500" htmlFor="jump">화면 바로 가기 (그 화면 기본 상태로 시작)</label>
          <select id="jump" value={id} onChange={(e) => jump(e.target.value as ScreenId)} className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[13px]">
            {SPEC.screens.map((x) => <option key={x.id} value={x.id}>{x.id} · {x.name}</option>)}
          </select>
          <button type="button" onClick={() => jump(firstId)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-300 py-2 text-[13px] hover:bg-neutral-50">
            <RotateCcw size={14} /> 처음부터 다시
          </button>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-[13px] font-bold">짝꿍 · 시스템 시뮬레이터</p>
          <p className="mt-1 text-[12px] text-neutral-500">소셜 로그인 · 짝꿍 행동처럼 화면 밖에서 일어나는 일을 대신 일으켜요.</p>
          <label className="mt-3 flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={s.loginFailNext} onChange={(e) => dispatch({ type: 'set', patch: { loginFailNext: e.target.checked } })} />
            다음 로그인 실패시키기
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <SimBtn disabled={!s.plan || !s.loggedIn || s.partner === 'joined'} onClick={() => dispatch({ type: 'set', patch: { partner: 'joined', toast: '민지 님이 합류했어요' } })}>짝꿍 합류</SimBtn>
            <SimBtn disabled={s.partner !== 'joined'} onClick={() => { const st = s.stages.findIndex((x) => !x.done); const j = s.todos[st]?.findIndex((t) => t.owner === '짝꿍' && !t.done) ?? -1; if (j >= 0) dispatch({ type: 'check', stage: st, i: j }); dispatch({ type: 'toast', text: '짝꿍이 할 일을 체크했어요' }) }}>짝꿍이 체크</SimBtn>
            <SimBtn onClick={() => { dispatch({ type: 'replace', state: seedFor('INVITE-02') }); go('INVITE-02') }}>초대 링크로 접속</SimBtn>
            <SimBtn onClick={() => { dispatch({ type: 'replace', state: seedFor('INVITE-04') }); go('INVITE-04') }}>만료된 링크 접속</SimBtn>
            <SimBtn disabled={!s.plan} onClick={() => { dispatch({ type: 'recalc', a: { ...s.a, when: { mode: 'date', date: '2027-02-13', year: '2027', month: '2' } } }); go(s.loggedIn ? 'ROAD-02' : 'ROAD-01') }}>예식일 앞당기기</SimBtn>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">예식일 앞당기기 = 2027.02.13(D-90)으로 바꿔 지난 단계 확인(ROAD-07)을 띄워요.</p>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[12.5px] leading-relaxed text-amber-900">
          <p className="font-bold">Mock 범위</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            <li>오늘 날짜는 디자인 기준인 2026.11.15로 고정이에요 (D-334).</li>
            <li>금액은 디자인 예시값에 맞춘 Mock, 업체는 모두 '예시' 이름이고 사진은 일러스트로 대체했어요.</li>
            <li>카카오 · 구글 로그인, 링크 발급, 클립보드 외 공유는 실제로 처리하지 않아요.</li>
            <li>상태는 이 탭에서만 유지되고 새로고침하면 지금 화면 기본 상태로 돌아가요.</li>
          </ul>
        </section>
      </aside>
    </div>
  )
}

function SimBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" disabled={disabled} onClick={onClick} className="h-9 rounded-lg bg-neutral-900 px-2 text-[12.5px] font-semibold text-white disabled:bg-neutral-200 disabled:text-neutral-400">{children}</button>
}
