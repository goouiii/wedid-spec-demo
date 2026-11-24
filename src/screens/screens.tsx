import { useEffect, useState, type ReactNode } from 'react'
import {
  AlertTriangle, ArrowLeft, ArrowRight, Building2, CalendarDays, Check, ChevronDown, ChevronUp, CircleDollarSign,
  Copy, ExternalLink, Hotel, Info, Link2, Loader2, MapPin, Trees, Church, Users,
} from 'lucide-react'
import {
  BANDS, COMBOS, FIT_TEXT, GUESTS, MOODS, REGIONS, SOURCE_DATE, STAGES, TODAY, VENUES,
  bandOf, fitOf, fmtMan, fmtRange, guestLabel, guestRange, lacksInfo, regionLacksData, venueRef, ym, ymKo,
  type Band, type Combo, type Guests, type HallType, type Mood, type Region, type Venue,
} from '../data/mock'
import {
  costs, dday, isPast, nextStage, pastStages, remainingNeed, spent, stageBudget, stageWindow, useAnno, useDemo, weddingDate,
  type Answers, type MoodPick, type ScreenId,
} from '../demo/state'
import {
  Btn, Card, Footer, Layer, Modal, Nav, Page, Pill, SideMenu, Toast, budgetError, inputCls, onlyNum, parseNum,
} from './ui'

const CH = '공식 채널 →'

/* ═════════ 공통 조각 ═════════ */
function FitBadge({ budget, range }: { budget: number; range: [number, number] }) {
  const f = fitOf(budget, range)
  const tone = f === 'in' ? 'bg-wd-gl text-wd-g' : f === 'maybe' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
  const Icon = f === 'in' ? Check : f === 'maybe' ? Info : AlertTriangle
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[15px] font-semibold ${tone}`}><Icon size={16} />{FIT_TEXT[f]}</span>
}

function BudgetInput({ value, onChange, anno, big = true, placeholder = '예: 3,000' }: { value: string; onChange: (v: string) => void; anno?: Record<string, string>; big?: boolean; placeholder?: string }) {
  const err = budgetError(parseNum(value))
  return (
    <div {...anno}>
      <div className="relative">
        <input
          aria-label="예산 (만 원)"
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(onlyNum(e.target.value))}
          className={`${inputCls} ${big ? '' : '!h-[54px] !text-[16px]'} pr-20 ${err ? '!border-2 !border-rose-500' : ''}`}
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[17px] text-neutral-600">만 원</span>
      </div>
      {err ? <p className="mt-2 text-[14px] text-rose-600">{err}</p> : value ? <p className="mt-2 text-[14px] text-wd-g">{value}만 원</p> : null}
    </div>
  )
}

/* ═════════ SCR-01 · SCR-01-B 첫 화면 ═════════ */
function Home({ id }: { id: ScreenId }) {
  const { s, go } = useDemo()
  const an = useAnno()
  const isB = id === 'SCR-01-B' || (s.plan && s.loggedIn && id !== 'SCR-11' && id !== 'SCR-11-B')
  if (isB) return <HomeB />
  return (
    <>
      <Nav anno={an('SCR-01', '01')} />
      <section className="flex items-center justify-between bg-wd-bg px-[143px] py-[58px]">
        <div>
          <h1 {...an('SCR-01', '02')} className="text-[56px] font-bold leading-[1.12] tracking-tight">우리 결혼,<br />얼마나 들까?
            <p className="mt-9 text-[20px] font-normal leading-[1.6] tracking-normal text-neutral-500">질문 5개로 우리 결혼의 예상 비용을 계산하고,<br />짝꿍과 함께 준비 로드맵을 관리하세요.</p>
          </h1>
          <Btn anno={an('SCR-01', '03')} onClick={() => go('SCR-02-Q1')} className="mt-8 flex h-[66px] items-center gap-2 px-8 text-[19px]">우리 결혼 비용 계산하기 <ArrowRight size={20} /></Btn>
        </div>
        <Card anno={an('SCR-01', '04')} className="w-[366px] !border-0 px-5 pb-6 pt-5">
          <div className="flex items-center justify-between"><p className="text-[18px] font-semibold">웨딩 준비 현황</p><Pill tone="gray" className="!text-[12px]">예시</Pill></div>
          <ol className="relative mt-5 space-y-5">
            <span className="absolute bottom-5 left-[11px] top-5 w-px bg-neutral-300" aria-hidden />
            {[
              { t: '예식장 계약', d: 'D-300 · 실제 계약 1,980만 원', st: 'done' },
              { t: '스드메 계약', d: 'D-240 · 250만 ~ 350만 원 · 할 일 1/3', st: 'now' },
              { t: '촬영 · 신혼여행 예약', d: 'D-180', st: 'todo' },
            ].map((x) => (
              <li key={x.t} className={`relative flex items-start gap-3 ${x.st === 'now' ? '-mx-2 rounded-xl border-2 border-wd-g/60 bg-white px-2 py-2' : ''} ${x.st === 'todo' ? 'opacity-50' : ''}`}>
                <span className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full ${x.st === 'done' ? 'bg-wd-g text-white' : x.st === 'now' ? 'border-4 border-wd-gl bg-wd-g' : 'border border-neutral-300 bg-white'}`}>{x.st === 'done' && <Check size={14} strokeWidth={3} />}</span>
                <span className="flex-1">
                  <span className="block text-[16px] font-medium">{x.t}</span>
                  <span className="block text-[12.5px] text-neutral-500">{x.d}</span>
                  {x.st === 'now' && <span className="mt-1 inline-flex items-center gap-1 text-[12px] text-wd-g"><Users size={13} /> 짝꿍과 함께</span>}
                </span>
                <Pill tone={x.st === 'done' ? 'dark' : x.st === 'now' ? 'g' : 'gray'} className="!px-3 !text-[12px]">{x.st === 'done' ? '✓ 완료' : x.st === 'now' ? '진행중' : '예정'}</Pill>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="text-[15px]">예상 총비용</span>
            <span className="text-[20px] font-semibold text-wd-g">1,800만 ~ 2,250만원</span>
          </div>
        </Card>
      </section>
      <section {...an('SCR-01', '05')} className="grid grid-cols-3 gap-[84px] bg-wd-card px-[145px] py-6">
        {[
          { I: CircleDollarSign, t: '① 비용 계산', d: '질문 5개로 우리 결혼 예상 비용 확인' },
          { I: MapPin, t: '② 준비 로드맵', d: '언제 무엇을, 얼마에 정할지 한눈에' },
          { I: Users, t: '③ 짝꿍과 함께', d: '할 일을 나누고 같은 계획을 함께 관리' },
        ].map(({ I, t, d }) => (
          <div key={t} className="rounded-[4px] border border-wd-line bg-[#f9f9f6] px-10 py-8">
            <I size={28} className="text-wd-g" strokeWidth={1.6} />
            <p className="mt-4 text-[20px] font-semibold">{t}</p>
            <p className="mt-2 text-[14px] text-neutral-500">{d}</p>
          </div>
        ))}
      </section>
      <Footer anno={an('SCR-01', '06')} />
    </>
  )
}

function HomeB() {
  const { s, go, dispatch } = useDemo()
  const an = useAnno()
  const c = costs(s)
  const ni = nextStage(s)
  const doneN = s.stages.filter((x) => x.done).length
  const sp = spent(s)
  const wd = weddingDate(s.a.when)
  const d = dday(s)
  const nextName = ni >= 0 ? STAGES[ni].name : '모든 준비를 마쳤어요'
  const todoN = ni >= 0 ? s.checks[ni].filter(Boolean).length : 0
  return (
    <>
      <Nav anno={an('SCR-01-B', '01')} />
      <section className="flex items-start justify-between px-[143px] pb-10 pt-[58px]">
        <div>
          <div {...an('SCR-01-B', '02')}>
            <p className="font-serif text-[18px] tracking-[0.2em] text-wd-g">MY WEDDING PLAN</p>
            <h1 className="mt-3 text-[52px] font-bold leading-[1.15] tracking-tight">준근 님,<br />다시 오셨네요!</h1>
            <p className="mt-6 text-[19px] leading-[1.6] text-neutral-500">저장된 결혼 준비 계획이 있어요.<br />짝꿍을 초대하면 할 일을 함께 나눌 수 있어요.</p>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <Btn anno={an('SCR-01-B', '03')} onClick={() => go('SCR-06')} className="flex h-[64px] items-center gap-2 px-8 text-[19px]">내 로드맵 이어서 보기 <ArrowRight size={20} /></Btn>
            <Btn kind="ghost" anno={an('SCR-01-B', '04')} onClick={() => dispatch({ type: 'set', patch: { confirmNew: true } })} className="text-[16px]">새 계획 시작하기</Btn>
          </div>
        </div>
        <button type="button" {...an('SCR-01-B', '05')} onClick={() => go('SCR-06')} className="w-[420px] rounded-[18px] bg-wd-card p-6 text-left shadow-[0_1px_0_#ebebe6]">
          <div className="grid h-[110px] place-items-center rounded-[12px] bg-wd-gl/70 text-wd-g"><RingsArt /></div>
          <div className="mt-5 flex items-center justify-between"><p className="text-[19px] font-semibold">우리의 웨딩 플랜</p><Pill>진행중</Pill></div>
          <p className="mt-1 text-[14px] text-neutral-500">{s.a.region} · {wd.estimated ? `예식 예정 미정 (${ymKo(wd.date)} 기준)` : `${ymKo(wd.date)} 예식`}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200"><div className="h-full rounded-full bg-wd-g" style={{ width: `${(doneN / 6) * 100}%` }} /></div>
          <dl className="mt-4 grid grid-cols-[96px_1fr] gap-y-2 text-[14.5px]">
            <dt className="text-neutral-500">현재 단계</dt><dd>{doneN}/6 단계 완료</dd>
            <dt className="text-neutral-500">다음 할 일</dt><dd>{nextName} {ni >= 0 && <span className="text-neutral-500">· 할 일 {todoN}/3</span>}</dd>
            <dt className="text-neutral-500">예상 비용</dt><dd className="font-semibold text-wd-g">{fmtRange(c.total)}</dd>
          </dl>
        </button>
      </section>
      <section className="grid grid-cols-3 gap-6 px-[143px] pb-14">
        <Card anno={an('SCR-01-B', '06')} className="p-7">
          {s.a.budget ? (
            <>
              <p className="text-[15px] text-neutral-500">남은 예산</p>
              <p className="mt-2 text-[28px] font-bold text-wd-g">{fmtMan(s.a.budget - sp)} 원</p>
              <p className="mt-1 text-[14px] text-neutral-500">예산 {fmtMan(s.a.budget)} 원</p>
            </>
          ) : (
            <>
              <p className="text-[15px] text-neutral-500">지금까지 쓴 금액</p>
              <p className="mt-2 text-[28px] font-bold text-wd-g">{fmtMan(sp)} 원</p>
            </>
          )}
          <Btn kind="soft" onClick={() => { dispatch({ type: 'set', patch: { view: Math.max(1, ni) } }); go(ni === 2 ? 'SCR-06-D2' : 'SCR-06-D') }} className="mt-4 h-11 px-4 text-[15px]">쓴 금액 입력하기</Btn>
        </Card>
        <div {...an('SCR-01-B', '07')} className="rounded-[18px] bg-wd-gl p-7">
          <p className="text-[15px] text-wd-g">다음 STEP까지</p>
          <p className="mt-2 text-[34px] font-bold text-wd-g">D-{Math.max(0, d - (ni >= 0 ? STAGES[ni].d[0] : 0))}{wd.estimated && <span className="text-[16px] font-medium"> (예상)</span>}</p>
          <p className="mt-1 text-[15px]">다음 STEP : {nextName}</p>
        </div>
        <Card anno={an('SCR-01-B', '08')} className="p-7">
          <p className="text-[15px] text-neutral-500">짝꿍 초대</p>
          {s.partner === 'joined' ? (
            <p className="mt-3 text-[18px] font-semibold">짝꿍과 함께 준비 중이에요</p>
          ) : (
            <>
              <Btn onClick={() => dispatch({ type: 'needLogin', reason: 'invite', then: { type: 'invite' } })} className="mt-3 flex h-12 items-center gap-2 px-5 text-[16px]"><Copy size={16} /> 초대 링크 복사하기</Btn>
              <p className="mt-2 text-[14px] text-neutral-500">{s.partner === 'invited' ? '초대했어요 · 짝꿍 합류를 기다리는 중' : '복사해서 짝꿍에게 보내보세요'}</p>
            </>
          )}
        </Card>
      </section>
      <Footer anno={an('SCR-01-B', '09')} />
      {s.confirmNew && (
        <Modal title="새로 계산할까요?" onClose={() => dispatch({ type: 'set', patch: { confirmNew: false } })} width={480}>
          <p className="text-[16px] text-neutral-600">새로 계산하면 지금 계획의 조건이 바뀌어요. 질문에는 기존 답이 선택된 상태로 시작해요.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Btn kind="outline" className="h-12" onClick={() => dispatch({ type: 'set', patch: { confirmNew: false } })}>취소</Btn>
            <Btn className="h-12" onClick={() => { dispatch({ type: 'newPlan' }); go('SCR-02-Q1') }}>새로 계산하기</Btn>
          </div>
        </Modal>
      )}
    </>
  )
}

function RingsArt() {
  return (
    <svg width="120" height="70" viewBox="0 0 120 70" fill="none" aria-hidden>
      <circle cx="48" cy="40" r="22" stroke="currentColor" strokeWidth="5" />
      <circle cx="74" cy="40" r="22" stroke="currentColor" strokeWidth="5" opacity=".55" />
      <path d="M48 6l5 6h-10z" fill="currentColor" />
    </svg>
  )
}

/* ═════════ SCR-02 질문 ═════════ */
const Q_ID = ['SCR-02-Q1', 'SCR-02-Q2', 'SCR-02-Q3', 'SCR-02-Q4', 'SCR-02-Q5'] as const

function QShell({ n, title, desc, children, canNext, onNext, nextLabel = '다음', btnNo, footNo }: {
  n: number; title: string; desc: string; children: ReactNode; canNext: boolean; onNext: () => void; nextLabel?: string; btnNo: string; footNo: string
}) {
  const { go, readonly } = useDemo()
  const an = useAnno()
  const id = Q_ID[n - 1]
  const prev = n === 1 ? 'SCR-01' : Q_ID[n - 2]
  useEffect(() => {
    if (readonly) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canNext && !(e.target instanceof HTMLButtonElement)) onNext()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [canNext, onNext, readonly])
  return (
    <>
      <Nav anno={an(id, '01')} roadmap={false} />
      <div className="mx-auto w-[918px] pb-24 pt-10">
        <div {...an(id, '02')}>
          <div className="flex items-center justify-between text-[16px]">
            <button type="button" onClick={() => go(prev)} className="flex items-center gap-1 text-neutral-600 hover:text-black"><ArrowLeft size={18} /> 이전</button>
            <span className="font-semibold text-wd-g">{n} <span className="text-neutral-400">/ 5</span></span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e3e3de]"><div className="h-full rounded-full bg-wd-g transition-all" style={{ width: `${n * 20}%` }} /></div>
        </div>
        <div {...an(id, '03')} className="mt-14">
          <h2 className="text-[38px] font-bold tracking-tight">{title}</h2>
          <p className="mt-3 text-[18px] text-neutral-500">{desc}</p>
        </div>
        <div className="mt-9">{children}</div>
        <div {...an(id, btnNo)} className="mt-16 grid grid-cols-[1fr_2.4fr] gap-4">
          <Btn kind="outline" onClick={() => go(prev)} className="h-[72px] text-[19px]">이전</Btn>
          <Btn disabled={!canNext} onClick={onNext} className="h-[72px] text-[19px]">{nextLabel}</Btn>
        </div>
      </div>
      <Footer anno={an(id, footNo)} />
    </>
  )
}

const Notice = ({ children, anno }: { children: ReactNode; anno?: Record<string, string> }) => (
  <p {...anno} className="mt-4 flex items-start gap-2 rounded-[12px] bg-wd-gl/70 px-5 py-4 text-[16px] text-wd-g"><Info size={18} className="mt-0.5 shrink-0" />{children}</p>
)

function Q1() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  return (
    <QShell n={1} title="어디에서 결혼식을 올릴 예정인가요?" desc="지역마다 예식장 · 스드메 가격이 달라요." canNext={!!s.a.region} onNext={() => go('SCR-02-Q2')} btnNo="06" footNo="07">
      <div className="relative">
        <button
          type="button"
          {...an('SCR-02-Q1', '04')}
          aria-haspopup="listbox"
          aria-expanded={s.regionOpen}
          onClick={() => dispatch({ type: 'set', patch: { regionOpen: !s.regionOpen } })}
          className={`${inputCls} flex items-center justify-between text-left ${s.a.region ? '' : 'text-neutral-400'}`}
        >
          {s.a.region ?? '지역을 선택해 주세요'} <ChevronDown size={22} className="text-neutral-500" />
        </button>
        {s.regionOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => dispatch({ type: 'set', patch: { regionOpen: false } })} aria-hidden />
            <ul {...an('SCR-02-Q1', '05')} role="listbox" className="absolute inset-x-0 top-[70px] z-20 grid grid-cols-2 gap-1 rounded-[12px] border border-wd-line bg-white p-2 shadow-xl">
              {REGIONS.map((r) => (
                <li key={r}>
                  <button type="button" role="option" aria-selected={s.a.region === r} onClick={() => dispatch({ type: 'set', patch: { regionOpen: false, a: { ...s.a, region: r } } })} className={`w-full rounded-lg px-4 py-3 text-left text-[16px] hover:bg-neutral-100 ${s.a.region === r ? 'font-bold text-wd-g' : ''}`}>{r}</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {s.a.region && regionLacksData(s.a.region) && <Notice>이 지역은 데이터가 부족해 결과는 전국 평균으로 계산해요.</Notice>}
    </QShell>
  )
}

const optCls = (on: boolean) => `h-[58px] rounded-[6px] border px-5 text-left text-[16px] transition ${on ? 'border-wd-g bg-wd-g text-white' : 'border-[#cfcfca] bg-white hover:border-wd-g'}`

function Q2() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const pick = (g: Guests) => dispatch({ type: 'answer', patch: { guests: g } })
  return (
    <QShell n={2} title="하객은 몇 명 정도 예상하나요?" desc="잘 모르겠으면 대략적으로 골라도 괜찮아요." canNext={!!s.a.guests} onNext={() => go('SCR-02-Q3')} btnNo="05" footNo="06">
      <div {...an('SCR-02-Q2', '04')} className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="하객 수">
        {GUESTS.map((g) => (
          <button key={g} type="button" role="radio" aria-checked={s.a.guests === g} onClick={() => pick(g)} className={`${optCls(s.a.guests === g)} ${g === '아직 모르겠어요' ? 'col-span-2' : ''}`}>{g}</button>
        ))}
      </div>
      {s.a.guests === '아직 모르겠어요' && <Notice>괜찮아요. 150~200명 기준으로 계산하고, 나중에 바꿀 수 있어요.</Notice>}
    </QShell>
  )
}

const YEARS = ['2026', '2027', '2028']
const selCls = 'h-[56px] rounded-[10px] border border-[#3a3a38] bg-white px-4 text-[17px]'

function WhenFields({ w, onChange, compact = false }: { w: Answers['when']; onChange: (w: Answers['when']) => void; compact?: boolean }) {
  const base = new Date(TODAY.getFullYear() + 1, TODAY.getMonth(), 1)
  const opts = [
    { m: 'date', t: '날짜가 정해졌어요' },
    { m: 'month', t: '대략적인 달만 정했어요' },
    { m: 'none', t: '아직 정하지 않았어요' },
  ] as const
  return (
    <div className="space-y-3">
      {opts.map((o) => (
        <div key={o.m}>
          <button type="button" role="radio" aria-checked={w.mode === o.m} onClick={() => onChange({ mode: o.m, date: '', year: '', month: '' })} className={`${optCls(w.mode === o.m)} w-full ${compact ? '!h-[50px]' : ''}`}>{o.t}</button>
          {w.mode === o.m && o.m === 'date' && (
            <input type="date" aria-label="예식 날짜" min="2026-11-24" max="2028-11-30" value={w.date} onChange={(e) => onChange({ ...w, date: e.target.value })} className={`${selCls} mt-3 w-full`} />
          )}
          {w.mode === o.m && o.m === 'month' && (
            <div className="mt-3 flex gap-3">
              <select aria-label="연도" value={w.year} onChange={(e) => onChange({ ...w, year: e.target.value })} className={`${selCls} flex-1`}><option value="">연 ▾</option>{YEARS.map((y) => <option key={y} value={y}>{y}년</option>)}</select>
              <select aria-label="월" value={w.month} onChange={(e) => onChange({ ...w, month: e.target.value })} className={`${selCls} flex-1`}><option value="">월 ▾</option>{Array.from({ length: 12 }, (_, i) => String(i + 1)).map((m) => <option key={m} value={m}>{m}월</option>)}</select>
            </div>
          )}
          {w.mode === o.m && o.m === 'none' && !compact && <Notice>{ymKo(base)} 예식 기준으로 로드맵을 만들게요. 나중에 바꿀 수 있어요.</Notice>}
        </div>
      ))}
    </div>
  )
}
const whenOk = (w: Answers['when']) => w.mode === 'none' || (w.mode === 'date' && !!w.date) || (w.mode === 'month' && !!w.year && !!w.month)

function Q3() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  return (
    <QShell n={3} title="결혼식은 언제쯤인가요?" desc="날짜가 없어도 괜찮아요. 대략적인 시기로 로드맵을 만들어요." canNext={whenOk(s.a.when)} onNext={() => go('SCR-02-Q4')} btnNo="05" footNo="06">
      <div {...an('SCR-02-Q3', '04')} role="radiogroup" aria-label="예식 시기"><WhenFields w={s.a.when} onChange={(when) => dispatch({ type: 'answer', patch: { when } })} /></div>
    </QShell>
  )
}

function Q4() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const n = parseNum(s.a.budgetText)
  const ok = s.a.noBudget || (n !== null && !budgetError(n))
  return (
    <QShell n={4} title="생각해 둔 예산이 있나요?" desc="예식장과 스드메에 쓸 예산이에요. 대략적인 금액도 괜찮아요." canNext={ok} onNext={() => go('SCR-02-Q5')} btnNo="06" footNo="07">
      <p className="mb-2 text-[16px] font-semibold">예산</p>
      <div className={s.a.noBudget ? 'pointer-events-none opacity-40' : ''}>
        <BudgetInput anno={an('SCR-02-Q4', '04')} value={s.a.budgetText} onChange={(v) => dispatch({ type: 'answer', patch: { budgetText: v, budget: parseNum(v), noBudget: false } })} />
      </div>
      {!s.a.budgetText && <p className="mt-2 text-[14px] text-neutral-500">만 원 단위로 입력해 주세요. 숫자만 입력할 수 있어요.</p>}
      <button type="button" {...an('SCR-02-Q4', '05')} aria-pressed={s.a.noBudget} onClick={() => dispatch({ type: 'answer', patch: s.a.noBudget ? { noBudget: false } : { noBudget: true, budget: null, budgetText: '' } })} className={`${optCls(s.a.noBudget)} mt-4 w-full`}>아직 없어요</button>
      {s.a.noBudget && <Notice>예산 없이도 예상 비용을 볼 수 있어요. 결과 화면에서 언제든 넣을 수 있어요.</Notice>}
    </QShell>
  )
}

function Q5() {
  const { s, dispatch, go, readonly } = useDemo()
  const an = useAnno()
  const toggle = (m: MoodPick) => {
    const cur = s.a.moods
    const next = m === '상관없어요' ? (cur.includes(m) ? [] : ['상관없어요' as const]) : cur.includes(m) ? cur.filter((x) => x !== m) : [...cur.filter((x) => x !== '상관없어요'), m]
    dispatch({ type: 'answer', patch: { moods: next } })
  }
  useEffect(() => {
    if (readonly || !s.calculating) return
    const t = setTimeout(() => { dispatch({ type: 'finishQuestions' }); go('SCR-03') }, 1100)
    return () => clearTimeout(t)
  }, [s.calculating, readonly, dispatch, go])
  return (
    <QShell n={5} title="원하는 예식장 분위기가 있나요?" desc="여러 개 골라도 돼요. 없으면 [상관없어요]를 눌러 주세요." canNext={s.a.moods.length > 0} onNext={() => dispatch({ type: 'set', patch: { calculating: true } })} nextLabel="결과 보기" btnNo="05" footNo="06">
      <div {...an('SCR-02-Q5', '04')} className="grid grid-cols-2 gap-3">
        {[...MOODS, '상관없어요' as const].map((m) => (
          <button key={m} type="button" aria-pressed={s.a.moods.includes(m)} onClick={() => toggle(m)} className={optCls(s.a.moods.includes(m))}>{m}</button>
        ))}
      </div>
      {s.calculating && (
        <Layer>
          <div role="status" className="flex w-[420px] flex-col items-center rounded-[20px] bg-white px-8 py-10 shadow-2xl">
            <Loader2 size={36} className="animate-spin text-wd-g" />
            <p className="mt-4 text-[19px] font-semibold">예상 비용을 계산하고 있어요</p>
            <p className="mt-1 text-[14px] text-neutral-500">공개 가격 기준으로 범위를 계산 중이에요</p>
          </div>
        </Layer>
      )}
    </QShell>
  )
}

/* SCR-02-E · 상태 모음 보드 */
const NB = ({ children }: { children: ReactNode }) => <p className="mt-3 rounded-[10px] bg-wd-gl/70 px-4 py-3 text-[14.5px] text-wd-g">{children}</p>

function QStates() {
  const an = useAnno()
  const box = (no: string, label: string, children: ReactNode) => (
    <div {...an('SCR-02-E', no)} className="rounded-[18px] border border-wd-line2 bg-wd-card p-6">
      <p className="mb-4 text-[14px] font-semibold text-neutral-500">{label}</p>
      {children}
    </div>
  )
  return (
    <>
      <Nav roadmap={false} />
      <div className="px-[110px] pb-16 pt-12">
        <h2 className="text-[30px] font-bold">질문 화면 · 미정 선택과 입력 오류</h2>
        <p className="mt-2 text-[16px] text-neutral-500">적용 화면 SCR-02-Q2 · Q3 · Q4 · 나머지 영역은 각 질문 화면과 같아요.</p>
        <div className="mt-8 grid grid-cols-3 gap-6">
          {box('01', 'Q4 · 금액 입력 중', <><div className="relative"><input readOnly aria-label="예산 예시" value="3,000" className={`${inputCls} !h-[56px]`} /><span className="absolute right-5 top-1/2 -translate-y-1/2">만 원</span></div><p className="mt-2 text-[14px] text-wd-g">3,000만 원</p><Btn className="mt-4 h-12 w-full">다음</Btn></>)}
          {box('02', 'Q4 · 아직 없어요', <><input readOnly aria-label="예산 비활성 예시" placeholder="예: 3,000" className={`${inputCls} !h-[56px] opacity-40`} /><button type="button" className={`${optCls(true)} mt-3 w-full`}>아직 없어요</button><NB>예산 없이도 예상 비용을 볼 수 있어요. 결과 화면에서 언제든 넣을 수 있어요.</NB></>)}
          {box('03', 'Q4 · 입력 오류', <><div className="relative"><input readOnly aria-label="예산 오류 예시" value="50" className={`${inputCls} !h-[56px] !border-2 !border-rose-500`} /><span className="absolute right-5 top-1/2 -translate-y-1/2">만 원</span></div><p className="mt-2 text-[14px] text-rose-600">100만 원 이상으로 입력해 주세요</p><p className="text-[13px] text-neutral-400">(최대값 초과 시: 99,999만 원까지 입력할 수 있어요)</p><Btn disabled className="mt-3 h-12 w-full">다음</Btn></>)}
          {box('04', 'Q2 · 아직 모르겠어요', <><button type="button" className={`${optCls(true)} w-full`}>아직 모르겠어요</button><NB>괜찮아요. 150~200명 기준으로 계산하고, 나중에 바꿀 수 있어요.</NB></>)}
          {box('05', 'Q3 · 아직 정하지 않았어요', <><button type="button" className={`${optCls(true)} w-full`}>아직 정하지 않았어요</button><NB>2027년 11월 예식 기준으로 로드맵을 만들게요. 나중에 바꿀 수 있어요.</NB><p className="mt-2 text-[13px] text-neutral-400">기준 월 = 오늘(2026.11.24)로부터 12개월 뒤</p></>)}
          {box('06', 'Q3 · 대략적인 달', <><button type="button" className={`${optCls(true)} w-full`}>대략적인 달만 정했어요</button><div className="mt-3 flex gap-2"><select aria-label="연도 예시" className={`${selCls} flex-1`} defaultValue="2027"><option value="2027">2027년</option></select><select aria-label="월 예시" className={`${selCls} flex-1`} defaultValue="10"><option value="10">10월</option></select></div><p className="mt-2 text-[13px] text-neutral-400">둘 다 고르면 [다음] 활성 · 범위 이번 달 ~ 2년 뒤</p></>)}
        </div>
      </div>
      <Footer />
    </>
  )
}

/* ═════════ SCR-03 결과 ═════════ */
function Result() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const c = costs(s)
  const band = bandOf(s.band)
  const region = s.a.region ?? '서울 강남권 외'
  const guests = s.a.guests ?? '150~200명'
  const moods = s.a.moods.filter((m) => m !== '상관없어요')
  const unknownGuests = guests === '아직 모르겠어요'
  const [glo, ghi] = guestRange(guests)
  const combos = COMBOS[s.band]
  return (
    <>
      <Nav anno={an('SCR-03', '01')} />
      <div className="px-[60px] pb-14 pt-10">
        <div className="flex items-start justify-between gap-10">
          <div className="flex-1">
            <div {...an('SCR-03', '02')}>
              <h1 className="text-[38px] font-bold tracking-tight">우리 결혼 예상 비용</h1>
              <p {...an('SCR-03-E', '01')} className="mt-2 text-[17px] text-neutral-600">
                {region} · {guestLabel(guests)}{moods.length ? ` · ${moods.join(' · ')}` : ''} · 토요일 낮 예식 기준
              </p>
            </div>
            <button type="button" {...an('SCR-03', '03')} onClick={() => dispatch({ type: 'set', patch: { panel: true } })} className="mt-2 text-[15px] text-wd-g underline underline-offset-4">조건 수정</button>
            {c.fallback && <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-[14px] text-amber-800"><Info size={15} /> {region} 지역은 데이터가 부족해 공공 통계(권역 중앙값) 기준으로 계산했어요</p>}
            <div {...an('SCR-03', '10')} className="mt-7">
              <p className="text-[16px] text-neutral-500">예상 총비용 <span className="text-[13px]">(예식장 + 스드메)</span></p>
              <p className="mt-1 text-[54px] font-bold tracking-tight text-wd-g">{fmtRange(c.total)}</p>
            </div>
            <Btn anno={an('SCR-03', '13')} onClick={() => { void navigator.clipboard?.writeText(location.href).catch(() => {}); dispatch({ type: 'toast', text: '링크를 복사했어요' }) }} className="mt-5 flex h-[56px] w-[330px] items-center justify-center gap-2 text-[17px]"><Link2 size={18} /> 결과 링크 복사</Btn>
          </div>
          {s.a.budget ? (
            <Card anno={an('SCR-03', '11')} className="w-[432px] p-7">
              <p className="text-[19px] font-semibold">내 예산</p>
              <p className="mt-2 text-[30px] font-bold">{fmtMan(s.a.budget)} 원</p>
              <div className="mt-4"><FitBadge budget={s.a.budget} range={c.total} /></div>
              <p className="mt-3 text-[13.5px] text-neutral-500">예상 총비용 상한 {fmtMan(c.total[1])} 원과 비교했어요</p>
            </Card>
          ) : (
            <BudgetCard />
          )}
        </div>

        <Card className="mt-8 px-[60px] py-8">
          <div {...an('SCR-03', '04')} className="flex items-start justify-between">
            <div>
              <p className="text-[30px] font-bold">예식장</p>
              <p {...an('SCR-03-E', '02')} className="mt-2 text-[17px] text-neutral-500">대관료 500만 원 + 식대 7만 원 × {glo}~{ghi}명{unknownGuests ? ' (하객 수 미정 · 기준 인원)' : ''}</p>
              <p className="mt-1 text-[13.5px] text-neutral-400">{region} 예식장 공개 가격 기준 (가운데 50%) · VAT 반영</p>
            </div>
            <p className="text-[32px] font-semibold text-wd-g">{fmtRange(c.venue)}</p>
          </div>
          {unknownGuests && (
            <p {...an('SCR-03-E', '03')} className="mt-4 flex items-center gap-2 rounded-[10px] bg-wd-gl/70 px-4 py-3 text-[15px] text-wd-g">
              <Info size={16} /> 하객 수를 정하면 더 정확해져요 → <button type="button" onClick={() => dispatch({ type: 'set', patch: { panel: true } })} className="font-semibold underline underline-offset-4">조건 수정</button>에서 바꿀 수 있어요
            </p>
          )}
          <hr className="my-7 border-neutral-300" />
          <div {...an('SCR-03', '05')} className="flex items-start justify-between">
            <div>
              <p className="flex items-baseline gap-3 text-[30px] font-bold">스드메
                <button type="button" {...an('SCR-03', '07')} {...an('SCR-03-F', '01')} onClick={() => dispatch({ type: 'set', patch: { basis: !s.basis } })} className="flex items-center gap-0.5 text-[14px] font-normal text-neutral-500">
                  {s.basis ? <>산출 근거 접기 <ChevronUp size={15} /></> : <>산출 근거 보기 <ChevronDown size={15} /></>}
                </button>
              </p>
              <p className="mt-2 text-[17px] text-neutral-500">예산대를 바꾸면 예상 비용이 바로 바뀌어요 · 기본값: 이 지역 중간 수준 구간</p>
            </div>
            <p className="text-[32px] font-semibold text-wd-g">{fmtRange(c.sdm)}</p>
          </div>
          <div {...an('SCR-03', '06')} className="mt-7 grid grid-cols-4 gap-6" role="radiogroup" aria-label="스드메 예산대">
            {BANDS.map((b) => (
              <button key={b.id} type="button" role="radio" aria-checked={s.band === b.id} onClick={() => dispatch({ type: 'band', band: b.id })} className={`relative rounded-[10px] border bg-white px-5 py-6 text-left ${s.band === b.id ? 'border-[3px] border-wd-g' : 'border-[#cfcfca]'}`}>
                {b.id === 'standard' && <span className="absolute -top-3 right-2 rounded-md bg-wd-g px-3 py-0.5 text-[13px] text-white">추천</span>}
                <p className="text-[19px] font-semibold text-wd-g">{b.name}</p>
                <p className="mt-2 text-[17px] text-neutral-500">{b.label}</p>
              </button>
            ))}
          </div>
          {s.basis && (
            <div className="mt-6 rounded-[10px] bg-[#f1f1ee] px-6 py-5 text-[14px]">
              <div {...an('SCR-03-F', '02')}>
                <p className="mb-2 font-semibold">"{band.name}" 예산대 금액은 이렇게 계산했어요</p>
                {['스튜디오', '드레스', '메이크업'].map((k, i) => (
                  <p key={k} className="flex justify-between py-1 text-neutral-600"><span>{k} 공개 단품가 (중간 범위)</span><span>{fmtMan(band.parts[i][0])} ~ {fmtMan(band.parts[i][1])} 원</span></p>
                ))}
              </div>
              <p {...an('SCR-03-F', '03')} className="mt-2 flex justify-between border-t border-neutral-300 pt-3 font-semibold"><span>스드메 총액 (합산)</span><span>{fmtRange(band.range)}</span></p>
              <p {...an('SCR-03-F', '04')} className="mt-2 text-[12.5px] text-neutral-500">출처: 한국소비자원 참가격 · 서울 결혼준비대행업체 공개 단품가 · 공개 업체 12곳 · 기준일 {SOURCE_DATE}</p>
              <p {...an('SCR-03-F', '05')} className="mt-1 text-[12.5px] text-neutral-500">ⓘ 같은 업체도 대행사에 따라 공개 가격과 포함 구성이 다를 수 있어요</p>
            </div>
          )}
          <div {...an('SCR-03', '15')} className="mt-7">
            <p className="text-[18px] font-semibold">이 예산대의 스드메 조합</p>
            <ComboList combos={combos} compact />
          </div>
          <p {...an('SCR-03', '08')} className="mt-6 rounded-[10px] border border-dashed border-neutral-300 px-5 py-3 text-[14.5px] text-neutral-600"><b>별도로 생길 수 있는 비용</b> · 원본 사진, 드레스 업그레이드, 헬퍼비 등 (합계 미포함)</p>
          <p {...an('SCR-03', '09')} className="mt-3 text-[13px] text-neutral-500">출처: 업체 공개 가격 (참가격 · 업체 홈페이지, {SOURCE_DATE} 기준) · 실제 견적은 날짜, 옵션, 업체에 따라 달라질 수 있어요.</p>
          {!s.loggedIn && (
            <div className="mt-6 flex items-center justify-between rounded-[12px] bg-wd-gl/60 px-6 py-4">
              <p className="text-[15.5px] text-wd-g">저장하지 않으면 7일 뒤 사라져요</p>
              <Btn kind="primary" onClick={() => dispatch({ type: 'needLogin', reason: 'save' })} className="h-11 px-5 text-[15px]">로그인하고 저장하기</Btn>
            </div>
          )}
          <div className="mt-8 grid grid-cols-[1fr_2.6fr] gap-7">
            <Btn kind="outline" onClick={() => go('SCR-02-Q5')} className="h-[80px] text-[19px]">이전</Btn>
            <Btn anno={an('SCR-03', '12')} onClick={() => go('SCR-06')} className="h-[80px] text-[19px]">준비 로드맵 보기</Btn>
          </div>
        </Card>
      </div>
      <Footer anno={an('SCR-03', '14')} />
    </>
  )
}

function BudgetCard() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  const n = parseNum(s.budgetCard)
  const ok = n !== null && !budgetError(n)
  return (
    <Card anno={an('SCR-03-C', '01')} className="w-[432px] p-7">
      <p className="text-[19px] font-semibold">내 예산</p>
      <p className="mt-1 text-[14.5px] text-neutral-500">예산을 넣으면 예상 비용 안에 들어오는지 알려드려요</p>
      <div className="mt-4 flex gap-3">
        <div className="flex-1"><BudgetInput big={false} value={s.budgetCard} onChange={(v) => dispatch({ type: 'set', patch: { budgetCard: v } })} /></div>
        <Btn anno={an('SCR-03-C', '02')} disabled={!ok} onClick={() => n && dispatch({ type: 'setBudget', budget: n })} className="h-[54px] px-6 text-[16px]">확인</Btn>
      </div>
    </Card>
  )
}

function ComboList({ combos, compact = false, annoBase }: { combos: Combo[]; compact?: boolean; annoBase?: boolean }) {
  const an = useAnno()
  if (!combos.length) return <p className="mt-3 rounded-[12px] bg-[#f1f1ee] px-6 py-6 text-[15.5px] text-neutral-600">{compact ? '다른 예산대를 선택해 보세요' : '이 예산대에 맞는 조합이 아직 없어요 · 다른 예산대를 골라 보세요'}</p>
  return (
    <>
      {combos.length < 3 && <p className="mt-2 text-[14px] text-amber-700">이 예산대에서 찾은 조합은 {combos.length}개예요</p>}
      <div className="mt-3 grid grid-cols-3 gap-5">
        {combos.map((c, ci) => (
          <div key={c.type} {...(annoBase && ci === 0 ? an('SCR-10', '06') : {})} className="rounded-[14px] border border-[#dcdcd6] bg-white p-5">
            <div className="flex items-center justify-between"><Pill className="!text-[13px]">{c.type}</Pill><span className="text-[17px] font-semibold text-wd-g">{fmtRange(c.total)}</span></div>
            {!compact && <p className="mt-1 text-right text-[12px] text-neutral-400">기본 상품 단품가 합산</p>}
            <ul className="mt-3 divide-y divide-neutral-100">
              {c.vendors.map((v, vi) => (
                <li key={v.name} {...(annoBase && ci === 0 && vi === 0 ? an('SCR-10', '07') : {})} className="flex items-center gap-2 py-2.5 text-[14px]">
                  <span className="w-[60px] shrink-0 text-neutral-500">{v.cat}</span>
                  <span className="flex-1"><span className="block font-medium">{v.name}</span>{!compact && <span className="block text-[12px] text-neutral-500">{fmtMan(v.price[0])}~{fmtMan(v.price[1])} 원 · 공개 대행사 {v.agencies}곳</span>}</span>
                  {v.link ? <a href="#official" {...(annoBase && ci === 0 && vi === 0 ? an('SCR-10', '08') : {})} onClick={(e) => e.preventDefault()} className="shrink-0 text-[13px] text-wd-g underline underline-offset-4">{CH}</a> : <span className="shrink-0 text-[12px] text-neutral-300">링크 없음</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

/* SCR-03-B 조건 수정 패널 (결과 · 로드맵 공통) */
function ConditionPanel() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  const [a, setA] = useState<Answers>(() => ({ ...s.a, when: { ...s.a.when }, moods: [...s.a.moods] }))
  const changed = JSON.stringify(a) !== JSON.stringify(s.a)
  const n = parseNum(a.budgetText)
  const err = !a.noBudget && (n === null || !!budgetError(n))
  const close = () => dispatch({ type: 'set', patch: { panel: false } })
  const lab = 'mb-2 text-[15px] font-semibold'
  const togg = (m: MoodPick) => setA((p) => ({ ...p, moods: m === '상관없어요' ? ['상관없어요'] : p.moods.includes(m) ? p.moods.filter((x) => x !== m) : [...p.moods.filter((x) => x !== '상관없어요'), m] }))
  return (
    <Layer align="right" onClose={close}>
      <div {...an('SCR-03-B', '01')} role="dialog" aria-label="조건 수정" className="flex h-full w-[440px] flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-neutral-100 px-7 py-6">
          <div><p className="text-[22px] font-bold">조건 수정</p><p className="mt-1 text-[14px] text-neutral-500">바꾼 조건으로 예상 비용을 다시 계산해요.<br />질문 화면으로 돌아가지 않아요.</p></div>
          <button type="button" {...an('SCR-03-B', '07')} onClick={close} aria-label="닫기" className="grid size-9 place-items-center rounded-full hover:bg-neutral-100">✕</button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-7 py-6">
          <div {...an('SCR-03-B', '02')}><p className={lab}>지역</p><select aria-label="지역" value={a.region ?? ''} onChange={(e) => setA({ ...a, region: e.target.value as Region })} className={`${selCls} w-full`}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div>
          <div {...an('SCR-03-B', '03')}><p className={lab}>하객 수</p><select aria-label="하객 수" value={a.guests ?? ''} onChange={(e) => setA({ ...a, guests: e.target.value as Guests })} className={`${selCls} w-full`}>{GUESTS.map((g) => <option key={g}>{g}</option>)}</select></div>
          <div {...an('SCR-03-B', '04')}><p className={lab}>예식 예정 시기</p><WhenFields compact w={a.when} onChange={(when) => setA({ ...a, when })} /></div>
          <div {...an('SCR-03-B', '05')}>
            <p className={lab}>예산 <span className="font-normal text-neutral-400">(선택)</span></p>
            <div className={a.noBudget ? 'pointer-events-none opacity-40' : ''}><BudgetInput big={false} value={a.budgetText} onChange={(v) => setA({ ...a, budgetText: v, budget: parseNum(v), noBudget: false })} /></div>
            <label className="mt-2 flex items-center gap-2 text-[14.5px]"><input type="checkbox" checked={a.noBudget} onChange={(e) => setA({ ...a, noBudget: e.target.checked, budget: e.target.checked ? null : a.budget, budgetText: e.target.checked ? '' : a.budgetText })} /> 아직 없어요</label>
          </div>
          <div {...an('SCR-03-B', '08')}>
            <p className={lab}>선호 분위기 <span className="font-normal text-neutral-400">(선택 · 복수)</span></p>
            <div className="flex flex-wrap gap-2">{[...MOODS, '상관없어요' as const].map((m) => <button key={m} type="button" aria-pressed={a.moods.includes(m)} onClick={() => togg(m)} className={`rounded-full border px-4 py-2 text-[14px] ${a.moods.includes(m) ? 'border-wd-g bg-wd-g text-white' : 'border-neutral-300'}`}>{m}</button>)}</div>
            <p className="mt-2 text-[12.5px] text-neutral-500">분위기는 비용 계산에 쓰지 않고 예식장 후보 순서에만 반영돼요</p>
          </div>
          {s.stages.some((x) => x.done) && <p className="rounded-[10px] bg-amber-50 px-4 py-3 text-[13px] text-amber-800">할 일 · 완료 기록 · 실제 계약 금액은 그대로 두고, 미완료 단계 예산만 다시 계산해요.</p>}
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-3 border-t border-neutral-100 px-7 py-5">
          <Btn kind="outline" onClick={close} className="h-14 text-[16px]">취소</Btn>
          <Btn anno={an('SCR-03-B', '06')} disabled={!changed || err || !whenOk(a.when)} onClick={() => dispatch({ type: 'recalc', a })} className="h-14 text-[16px]">이 조건으로 다시 계산</Btn>
        </div>
      </div>
    </Layer>
  )
}

/* ═════════ SCR-06 로드맵 ═════════ */
function Roadmap() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  const wd = weddingDate(s.a.when)
  const ni = nextStage(s)
  const d = dday(s)
  return (
    <>
      <Nav anno={an('SCR-06', '01')} />
      <div className="flex flex-1">
        <SideMenu active="roadmap" anno={an('SCR-06', '02')} spec={['SCR-06']} />
        <main className="min-w-0 flex-1 px-[48px] pb-16 pt-10">
          {s.a.when.mode === 'none' && (
            <div {...an('SCR-06-E', '01')} className="mb-6 flex items-center justify-between rounded-[14px] bg-wd-gl/80 px-6 py-4 text-[16px] text-wd-g">
              <span className="flex items-center gap-2"><CalendarDays size={18} /> 예식일을 정하면 일정이 바뀌어요. 지금은 {ymKo(wd.date)} 기준이에요.</span>
              <button type="button" onClick={() => dispatch({ type: 'set', patch: { panel: true } })} className="font-semibold underline underline-offset-4">예식일 정하기 →</button>
            </div>
          )}
          <div {...an('SCR-06', '03')}>
            <h1 className="flex items-center gap-4 text-[38px] font-bold tracking-tight">우리의 웨딩 로드맵 <Pill className="!text-[16px]">{ni < 0 ? '준비 완료' : '진행중'}</Pill></h1>
            <p className="mt-2 text-[18px] text-neutral-500">결혼식을 위한 일정을 확인하고, 차근차근 준비해보세요. · 예식까지 D-{d}{wd.estimated ? ' (예상)' : ''}</p>
          </div>
          <div className="mt-7 grid grid-cols-[1.45fr_1fr] gap-6">
            {s.partner !== 'joined' ? (
              <Card anno={an('SCR-06', '04')} className="flex gap-5 p-5">
                <div className="grid w-[180px] shrink-0 place-items-center rounded-[14px] bg-wd-gl/80 text-wd-g"><RingsArt /></div>
                <div className="flex flex-1 flex-col">
                  <p className="mt-3 text-[19px] font-semibold">웨딧과 함께하는 웨딩 플랜</p>
                  <p className="mt-1 text-[14.5px] text-neutral-500">링크를 보내 초대하세요.{s.partner === 'invited' && ' · 짝꿍 합류를 기다리는 중'}</p>
                  <div className="mt-auto flex gap-2 pt-4">
                    <span className="flex h-11 flex-1 items-center rounded-[8px] border border-neutral-400 px-4 text-[14px] text-neutral-500">wedid.co.kr/invite/••••</span>
                    <Btn onClick={() => dispatch({ type: 'needLogin', reason: 'invite', then: { type: 'invite' } })} className="h-11 px-6 text-[14px]">복사</Btn>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="flex items-center gap-4 p-6"><Users className="text-wd-g" /><p className="text-[17px]">짝꿍과 같은 로드맵을 함께 관리하고 있어요</p></Card>
            )}
            <Card anno={an('SCR-06', '05')} className="p-6">
              <p className="text-[19px] font-semibold">함께하는 멤버</p>
              <ul className="mt-4 space-y-3 text-[17px]">
                <li className="flex items-center gap-3"><Avatar t="나" />나 {s.loggedIn ? '(준근)' : '(비회원)'}</li>
                {s.partner === 'joined' ? <li className="flex items-center gap-3"><Avatar t="짝" alt />파트너 (지은)</li> : <li className="flex items-center gap-3 text-neutral-400"><Avatar t="?" muted />파트너 (초대 전)</li>}
              </ul>
              <button type="button" onClick={() => dispatch({ type: 'needLogin', reason: 'invite', then: { type: 'invite' } })} className="mt-4 flex w-full items-center justify-end gap-1 border-t border-neutral-200 pt-3 text-[14px] text-neutral-500">멤버 추가하기 <ArrowRight size={14} /></button>
            </Card>
          </div>
          <Card anno={an('SCR-06', '06')} className="mt-6 px-10 py-9">
            <div {...an('SCR-06-E', '02')}>
              <ol className="relative grid grid-cols-6">
                <span className="absolute left-[8%] right-[8%] top-[25px] h-px bg-wd-g/50" aria-hidden />
                {STAGES.map((st, i) => {
                  const x = s.stages[i]
                  const cur = i === ni
                  const w = stageWindow(s, i)
                  const late = isPast(s, i)
                  return (
                    <li key={st.name} className="relative z-10 flex flex-col items-center text-center">
                      <span className={`grid size-[50px] place-items-center rounded-full border text-[22px] ${x.done ? 'border-wd-g bg-wd-g text-white' : cur ? 'border-wd-g bg-wd-g text-white ring-4 ring-wd-gl' : 'border-wd-g bg-wd-card text-wd-g'}`}>{x.done ? <Check size={22} strokeWidth={3} /> : i + 1}</span>
                      <span className={`mt-4 text-[15.5px] ${cur ? 'font-bold' : ''}`}>{st.short}</span>
                      <span className={`mt-2 text-[17px] ${cur ? 'font-bold text-wd-g' : 'text-wd-g/80'}`}>D-{st.d[0]}~{st.d[1]}</span>
                      <span className="mt-1 text-[12.5px] text-neutral-500">{ym(w.from)}~{ym(w.to)}{wd.estimated ? ' (예상)' : ''}</span>
                      {late && x.late && <span className="mt-1 rounded bg-amber-100 px-1.5 text-[11px] text-amber-800">⚠ 시기가 지났어요</span>}
                    </li>
                  )
                })}
              </ol>
              {wd.estimated && <p className="mt-6 text-center text-[13px] text-neutral-500">(예상) 기준 · 예식 예정 월 {ymKo(wd.date)} 1일로 계산한 일정이에요</p>}
            </div>
          </Card>
          <div {...an('SCR-06-E', '03')} className="mt-6 flex items-center justify-between rounded-[14px] border border-wd-line2 bg-wd-card px-6 py-5">
            <p className="text-[16px]"><b>다음 할 일</b> · {ni >= 0 ? `${STAGES[ni].name} (D-${STAGES[ni].d[0]}~${STAGES[ni].d[1]})` : '모든 준비를 마쳤어요'}</p>
            <button type="button" onClick={() => dispatch({ type: 'set', patch: { panel: true } })} className="text-[15px] text-wd-g underline underline-offset-4">기존 정보 수정</button>
          </div>
          {!s.loggedIn && (
            <div className="mt-4 flex items-center justify-between rounded-[12px] bg-wd-gl/60 px-6 py-4">
              <p className="text-[15.5px] text-wd-g">저장하지 않으면 7일 뒤 사라져요</p>
              <Btn onClick={() => dispatch({ type: 'needLogin', reason: 'save' })} className="h-11 px-5 text-[15px]">로그인하고 저장하기</Btn>
            </div>
          )}
        </main>
      </div>
      <Footer />
      {s.pastOpen && pastStages(s).length > 0 && <PastModal />}
    </>
  )
}

const Avatar = ({ t, alt, muted }: { t: string; alt?: boolean; muted?: boolean }) => (
  <span className={`grid size-9 place-items-center rounded-full text-[13px] font-bold ${muted ? 'border border-dashed border-neutral-300' : alt ? 'bg-[#f2dfd6] text-[#9a5b43]' : 'bg-wd-gl text-wd-g'}`}>{t}</span>
)

/* SCR-06-F 지난 단계 확인 */
function PastModal() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  const list = pastStages(s)
  const d = dday(s)
  return (
    <Modal anno={an('SCR-06-F', '01')} title="확인해주세요!" width={640} onClose={() => dispatch({ type: 'set', patch: { pastOpen: false } })}>
      <div {...an('SCR-06-F', '02')}>
        <p className="text-[18px] font-semibold">확인이 필요한 단계 {list.length}개</p>
        <p className="mt-1 text-[15px] text-neutral-500">예식까지 {d}일 남아 시기가 지난 단계예요. 이미 했는지 알려주시면 남은 예산을 맞게 계산해 드려요.</p>
      </div>
      <ul className="mt-5 space-y-3">
        {list.map((i, k) => {
          const st = STAGES[i]
          const b = stageBudget(s, i)
          const open = s.pastExpanded === i
          const amt = parseNum(s.pastAmount)
          return (
            <li key={i} {...(k === 0 ? an('SCR-06-F', '03') : {})} className="rounded-[14px] border border-neutral-200 p-4">
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-wd-g">D-{st.d[0]}~{st.d[1]}</span>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[12px] text-amber-800">시기가 지났어요</span>
                <span className="text-[16px] font-semibold">{st.name}</span>
                <span className="ml-auto text-[14px] text-neutral-500">{b ? fmtRange(b) : '—'}</span>
              </div>
              {open ? (
                <div className="mt-3 flex gap-2">
                  <div className="flex-1"><BudgetInput big={false} placeholder="실제 금액" value={s.pastAmount} onChange={(v) => dispatch({ type: 'set', patch: { pastAmount: v } })} /></div>
                  <Btn disabled={!amt} onClick={() => dispatch({ type: 'pastDone', stage: i, amount: amt })} className="h-[54px] px-5">완료하기</Btn>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Btn kind="soft" anno={k === 0 ? an('SCR-06-F', '04') : undefined} onClick={() => dispatch(st.money ? { type: 'needLogin', reason: 'amount', then: { type: 'set', patch: { pastExpanded: i, pastAmount: '' } } } : { type: 'needLogin', reason: 'amount', then: { type: 'pastDone', stage: i, amount: null } })} className="h-11 text-[15px]">이미 했어요</Btn>
                  <Btn kind="outline" anno={k === 0 ? an('SCR-06-F', '05') : undefined} onClick={() => dispatch({ type: 'pastLater', stage: i })} className="h-11 text-[15px]">아직 안 했어요</Btn>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}

/* ═════════ SCR-06-D 단계 상세 (06-B · 06-C 포함) ═════════ */
function StageDetail({ id }: { id: ScreenId }) {
  const { s, dispatch, go, readonly } = useDemo()
  const an = useAnno()
  const i = id === 'SCR-06-D2' ? 2 : s.view
  const st = STAGES[i]
  const x = s.stages[i]
  const b = stageBudget(s, i)
  const w = stageWindow(s, i)
  const wd = weddingDate(s.a.when)
  const D: ScreenId[] = ['SCR-06-D', 'SCR-06-D2']
  const amt = parseNum(s.amountText)
  const amtErr = amt !== null && amt < 1
  const canDone = st.money ? !!amt && !amtErr : true

  useEffect(() => {
    if (readonly || s.banner === null) return
    const t = setTimeout(() => dispatch({ type: 'set', patch: { banner: null } }), 3000)
    return () => clearTimeout(t)
  }, [s.banner, readonly, dispatch])

  const complete = () => dispatch({ type: 'needLogin', reason: 'amount', then: { type: 'complete', stage: i, amount: st.money ? amt : null } })
  return (
    <>
      <Nav anno={an(D, '01')} />
      <div className="flex flex-1">
        <SideMenu active={i} anno={an(D, '02')} />
        <main className="min-w-0 flex-1 px-[48px] pb-14 pt-10">
          {s.banner === i && (
            <div {...an('SCR-06-B', '01')} role="status" className="mb-6 flex items-center gap-2 rounded-[14px] bg-wd-g px-6 py-4 text-[17px] text-white"><Check size={20} strokeWidth={3} /> {st.name} 완료! 남은 예산을 다시 계산했어요</div>
          )}
          <div className="flex items-start justify-between gap-8">
            <div {...an(D, '03')}>
              <h1 className="flex items-center gap-4 text-[38px] font-bold tracking-tight">이번 단계 예산 <span {...an('SCR-06-B', '02')}><Pill tone={x.done ? 'dark' : 'g'} className="!text-[16px]">{x.done ? '✓ 완료' : '진행중'}</Pill></span></h1>
              <p className="mt-3 text-[34px] font-semibold text-wd-g">{b ? fmtRange(b) : '—'}</p>
              {st.money === 'sdm' && <p className="mt-1 text-[14px] text-neutral-500">{bandOf(s.band).name} 예산대 · 스·드·메 단품가 합산</p>}
              {st.money === 'venue' && <p className="mt-1 text-[14px] text-neutral-500">예식장 예상 비용 (결과 화면과 같은 값)</p>}
            </div>
            {st.money === 'venue' && <Btn anno={an('SCR-06-D', '04')} onClick={() => go('SCR-09')} className="h-[80px] w-[420px] text-[18px]">예식장 후보 보기</Btn>}
            {st.money === 'sdm' && <Btn anno={an('SCR-06-D2', '04')} onClick={() => go('SCR-10')} className="h-[80px] w-[420px] text-[18px]">스드메 후보 보기</Btn>}
          </div>

          <Card className="mt-8 px-8 py-7">
            <div {...an(D, '05')}>
              <p className="text-[26px] font-bold">진행 리스트</p>
              <p className="mt-2 text-[18px] text-wd-g">D - {st.d[0]}~{st.d[1]} <span className="ml-6">{ym(w.from)} ~ {ym(w.to)}{wd.estimated ? ' (예상)' : ''}</span></p>
            </div>
            <div className="mt-6 grid grid-cols-[1.05fr_1fr] border-t border-neutral-300 pt-6">
              <div {...an(D, '06')} className="border-r border-neutral-300 pr-6">
                <p className="text-[18px] font-semibold">체크리스트</p>
                <ul className="mt-4 space-y-4">
                  {st.todos.map((t, k) => {
                    const on = s.checks[i][k]
                    return (
                      <li key={t.text} className="flex items-center gap-3">
                        <button type="button" role="checkbox" aria-checked={on} aria-label={t.text} onClick={() => dispatch({ type: 'needLogin', reason: 'todo', then: { type: 'check', stage: i, i: k } })} className={`grid size-6 shrink-0 place-items-center rounded-md border ${on ? 'border-wd-g bg-wd-g text-white' : 'border-neutral-500 bg-white'}`}>{on && <Check size={16} strokeWidth={3} />}</button>
                        <span className={`flex-1 text-[15.5px] ${on ? 'font-medium' : 'text-neutral-500'}`}>{t.text}{s.partnerEdited && k === 2 && <span className="ml-2 text-[12px] text-neutral-400">마지막 수정: 짝꿍 · 11.24</span>}</span>
                        <Pill tone={t.owner === '짝꿍' ? 'gray' : 'dark'} className="!rounded-md !px-3 !text-[13px]">{t.owner}</Pill>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="pl-8">
                <div {...an(D, '07')}>
                  <p className="text-[18px] font-semibold">정해야 할 것</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px]">{st.decide.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
                <div {...an(D, '08')} className="mt-7">
                  <p className="text-[18px] font-semibold">알아두면 좋은 점</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px]">{st.tips.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-neutral-300 pt-6">
              {x.done ? (
                <div className="flex items-center justify-between">
                  <p className="text-[18px]">{st.money ? <>실제 계약 금액 <b className="ml-2 text-[22px] text-wd-g">{fmtMan(x.amount ?? 0)} 원</b></> : '이 단계를 완료했어요'}</p>
                  {st.money && (s.editAmount ? (
                    <div className="flex gap-2">
                      <div className="w-[260px]"><BudgetInput big={false} value={s.amountText} onChange={(v) => dispatch({ type: 'set', patch: { amountText: v } })} /></div>
                      <Btn disabled={!amt} onClick={() => dispatch({ type: 'complete', stage: i, amount: amt })} className="h-[54px] px-5">저장</Btn>
                    </div>
                  ) : (
                    <Btn kind="outline" anno={an('SCR-06-B', '04')} onClick={() => dispatch({ type: 'set', patch: { editAmount: true, amountText: (x.amount ?? 0).toLocaleString('ko-KR') } })} className="h-12 px-6">금액 수정</Btn>
                  ))}
                </div>
              ) : (
                <div {...an(D, '09')}>
                  {st.money && <p className="mb-3 text-[18px] font-semibold">실제 계약 금액</p>}
                  <div className="flex gap-5">
                    {st.money && <div className="flex-1"><BudgetInput placeholder={st.money === 'sdm' ? '스드메 3개를 합친 금액' : '예: 1,980'} value={s.amountText} onChange={(v) => dispatch({ type: 'set', patch: { amountText: v } })} /></div>}
                    <Btn disabled={!canDone} onClick={complete} className={`h-[64px] text-[18px] ${st.money ? 'w-[325px]' : 'w-full'}`}>단계 완료하기</Btn>
                  </div>
                  {st.money && !amt && <p className="mt-2 text-[13.5px] text-neutral-500">금액을 넣어야 완료할 수 있어요 · 만 원 단위</p>}
                </div>
              )}
            </div>
          </Card>
          {x.done && st.money && <RemainCard />}
        </main>
      </div>
      <Footer />
    </>
  )
}

function RemainCard() {
  const { s } = useDemo()
  const an = useAnno()
  const sp = spent(s)
  const need = remainingNeed(s)
  const done = s.stages.filter((x, i) => x.done && STAGES[i].money)
  const formula = done.map((x) => `${STAGES[s.stages.indexOf(x)].short} 실제 ${fmtMan(x.amount ?? 0)} 원`).join(' + ')
  if (!s.a.budget) {
    return (
      <div className="mt-6 grid grid-cols-[1fr_1.3fr] gap-6">
        <Card anno={an('SCR-06-C', '01')} className="p-7">
          <p className="text-[16px] text-neutral-500">지금까지 쓴 금액</p>
          <p className="mt-2 text-[34px] font-bold text-wd-g">{fmtMan(sp)} 원</p>
          <p className="mt-1 text-[14px] text-neutral-500">{formula}</p>
        </Card>
        <div className="rounded-[18px] bg-wd-gl/60 p-7">
          <p className="text-[19px] font-semibold">예산을 정하면 남은 예산을 계산해드려요</p>
          <p className="mt-1 text-[14.5px] text-neutral-600">총 예산을 넣으면 단계별로 얼마나 남았는지 보여드려요. 나중에 넣어도 돼요.</p>
          <div className="mt-4"><BudgetCardInline /></div>
        </div>
      </div>
    )
  }
  const remain = s.a.budget - sp
  const judge = !need ? null : remain >= need[1] ? ['여유 있어요', 'g'] : remain >= need[0] ? ['빠듯해요', 'warn'] : ['부족해요', 'red']
  return (
    <Card anno={an('SCR-06-B', '03')} className="mt-6 flex items-center justify-between p-7">
      <div>
        <p className="text-[16px] text-neutral-500">남은 예산</p>
        <p className="mt-1 text-[34px] font-bold text-wd-g">{remain >= 0 ? `${fmtMan(remain)} 원` : `예산을 ${fmtMan(-remain)} 원 넘었어요`}</p>
        <p className="mt-1 text-[14.5px] text-neutral-500">{fmtMan(s.a.budget)} 원 − {formula}</p>
      </div>
      <div className="text-right">
        {need && judge ? (
          <>
            <p className="text-[14.5px] text-neutral-500">남은 금액 단계 예상 {fmtRange(need)}</p>
            <Pill tone={judge[1] as 'g' | 'warn' | 'red'} className="mt-2 !px-5 !py-2 !text-[17px] font-semibold">{remain < 0 ? '남은 예산이 부족해요' : judge[0]}</Pill>
          </>
        ) : (
          <p className="text-[16px] text-wd-g">예식장 · 스드메 계약을 모두 마쳤어요</p>
        )}
      </div>
    </Card>
  )
}

function BudgetCardInline() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  const n = parseNum(s.budgetCard)
  const ok = n !== null && !budgetError(n)
  return (
    <div {...an('SCR-06-C', '02')} className="flex gap-3">
      <div className="flex-1"><BudgetInput big={false} value={s.budgetCard} onChange={(v) => dispatch({ type: 'set', patch: { budgetCard: v } })} /></div>
      <Btn anno={an('SCR-06-C', '03')} disabled={!ok} onClick={() => n && dispatch({ type: 'setBudget', budget: n })} className="h-[54px] px-6 text-[16px]">예산 넣기</Btn>
    </div>
  )
}

/* ═════════ SCR-09 예식장 후보 ═════════ */
const HALL_ICON: Record<HallType, typeof Hotel> = { 호텔: Hotel, 컨벤션: Building2, 하우스: Trees, 채플: Church }

function Venues() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const f = s.vf
  const setF = (p: Partial<typeof f>) => dispatch({ type: 'set', patch: { vf: { ...f, shown: 10, ...p } } })
  const [glo, ghi] = guestRange(f.guests)
  const budgetVenue = s.a.budget ? s.a.budget - bandOf(s.band).range[1] : null
  const inRegion = VENUES.filter((v) => v.region === f.region)
  const list = inRegion.filter((v) => (f.type === '전체' || v.type === f.type) && (!f.priceOnly || v.open) && (v.max === null || v.max >= glo) && (v.min === null || v.min <= ghi))
  const good = list.filter((v) => !lacksInfo(v))
  const poor = list.filter(lacksInfo).sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  const score = (v: Venue) => {
    const ref = venueRef(v, f.guests)
    const mid = ref ? (ref[0] + ref[1]) / 2 : 2100
    const fit = budgetVenue ? (mid <= budgetVenue ? 40 : mid <= budgetVenue * 1.1 ? 20 : 0) : 0
    const mood = f.moods.length ? (v.moods.some((m) => f.moods.includes(m)) ? 25 : 0) : 0
    const price = Math.max(0, 25 - (mid - 1400) / 60)
    const size = 10
    const max = (budgetVenue ? 40 : 0) + (f.moods.length ? 25 : 0) + 35
    return ((fit + mood + price + size) / max) * 100
  }
  good.sort((a, b) => score(b) - score(a))
  const shown = good.slice(0, f.shown)
  const firstOpen = shown.findIndex((v) => v.open)
  const firstClosed = shown.findIndex((v) => !v.open)
  const reset = () => setF({ type: '전체', priceOnly: false, moods: [] })
  return (
    <>
      <Nav anno={an('SCR-09', '01')} />
      <div className="flex flex-1">
        <SideMenu active="venues" />
        <main className="min-w-0 flex-1 px-[32px] pb-14 pt-8">
          <button type="button" {...an('SCR-09', '02')} onClick={() => { dispatch({ type: 'set', patch: { view: 1 } }); go('SCR-06-D') }} className="flex items-center gap-1 text-[15px] text-neutral-600 hover:text-black"><ArrowLeft size={16} /> 예식장 계약 단계로</button>
          <div {...an('SCR-09', '03')} className="mt-4">
            <h1 className="text-[38px] font-bold tracking-tight">예식장 후보</h1>
            <p className="mt-2 text-[17px] text-neutral-500">공개 가격 기준 · 출처: 참가격 / 업체 홈페이지 · 업체 사진과 소개글은 싣지 않고 공식 채널로 연결해요</p>
          </div>
          <Card anno={an('SCR-09', '04')} className="mt-6 px-7 py-5">
            <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-5">
              <label className="text-[14px] font-semibold">지역<select value={f.region} onChange={(e) => setF({ region: e.target.value as Region })} className={`${selCls} mt-2 block w-full !h-[50px] font-normal`}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></label>
              <label className="text-[14px] font-semibold">하객 수<select value={f.guests} onChange={(e) => setF({ guests: e.target.value as Guests })} className={`${selCls} mt-2 block w-full !h-[50px] font-normal`}>{GUESTS.map((g) => <option key={g}>{g}</option>)}</select></label>
              <label className="text-[14px] font-semibold">홀 유형<select value={f.type} onChange={(e) => setF({ type: e.target.value as typeof f.type })} className={`${selCls} mt-2 block w-full !h-[50px] font-normal`}>{['전체', '호텔', '컨벤션', '하우스', '채플'].map((t) => <option key={t}>{t}</option>)}</select></label>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="mr-2 text-[14px] font-semibold">분위기</span>
              {MOODS.map((m) => <button key={m} type="button" aria-pressed={f.moods.includes(m)} onClick={() => dispatch({ type: 'set', patch: { vf: { ...f, moods: f.moods.includes(m) ? f.moods.filter((x) => x !== m) : [...f.moods, m] } } })} className={`rounded-full border px-3.5 py-1.5 text-[13.5px] ${f.moods.includes(m) ? 'border-wd-g bg-wd-g text-white' : 'border-neutral-300 bg-white'}`}>{m}</button>)}
              <label {...an('SCR-09', '05')} className="ml-auto flex items-center gap-2 text-[14.5px]">
                <button type="button" role="switch" aria-checked={f.priceOnly} aria-label="가격 공개만 보기" onClick={() => setF({ priceOnly: !f.priceOnly })} className={`relative h-6 w-11 rounded-full transition ${f.priceOnly ? 'bg-wd-g' : 'bg-neutral-300'}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white transition ${f.priceOnly ? 'left-[22px]' : 'left-0.5'}`} /></button>
                가격 공개만 보기
              </label>
            </div>
            <p className="mt-3 text-[12.5px] text-neutral-500">필터를 바꾸면 목록만 바뀌어요 · 내 계획 조건은 그대로예요</p>
          </Card>
          {inRegion.length === 0 ? (
            <div className="mt-6 rounded-[18px] bg-wd-card p-10 text-center"><p className="text-[19px] font-semibold">이 지역 예식장 정보는 아직 모으는 중이에요</p><p className="mt-2 text-[15px] text-neutral-500">이 지역 시세(공공 통계 기준) {fmtRange(costs({ ...s, a: { ...s.a, region: f.region } }).venue)}</p></div>
          ) : good.length + poor.length === 0 ? (
            <div className="mt-6 rounded-[18px] bg-wd-card p-10 text-center"><p className="text-[19px] font-semibold">조건에 맞는 예식장이 없어요</p><Btn kind="outline" onClick={reset} className="mt-4 h-11 px-6">필터 초기화</Btn></div>
          ) : (
            <>
              <p {...an('SCR-09', '14')} className="mt-6 flex items-center gap-1 text-[15px] text-neutral-600"><b className="text-black">내 조건에 맞는 순</b> <span title="예산 · 분위기 · 가격 · 하객 수 조건을 기준으로 정렬했어요"><Info size={15} /></span> · 조건에 맞는 예식장 {good.length}곳 · {SOURCE_DATE} 기준</p>
              <ul className="mt-3 space-y-4">
                {shown.map((v, k) => <VenueCard key={v.id} v={v} guests={f.guests} budgetVenue={budgetVenue} moods={f.moods} first={k === firstOpen} firstClosed={k === firstClosed} />)}
              </ul>
              {good.length > f.shown && <Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { vf: { ...f, shown: f.shown + 10 } } })} className="mt-5 h-12 w-full">더 보기 ({good.length - f.shown}곳 더)</Btn>}
              {poor.length > 0 && (
                <div {...an('SCR-09', '16')} className="mt-8 rounded-[18px] border border-dashed border-neutral-300 p-6">
                  <p className="text-[17px] font-semibold">정보가 부족한 예식장 ({poor.length}곳) · 가나다순</p>
                  <p className="mt-1 text-[14px] text-neutral-500">필수 가격 · 인원 정보가 없어 순서의 맨 뒤에 모았어요</p>
                  <ul className="mt-3 divide-y divide-neutral-200">{poor.map((v) => <li key={v.id} className="flex items-center justify-between py-3 text-[15px]"><span>{v.name} · {v.hall} <span className="text-neutral-500">· {v.gu} · {v.type}</span></span><span className="text-[13px] text-neutral-400">{v.link ? CH : '공식 채널 없음'}</span></li>)}</ul>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer anno={an('SCR-09', '13')} />
    </>
  )
}

function VenueCard({ v, guests, budgetVenue, moods, first, firstClosed }: { v: Venue; guests: Guests; budgetVenue: number | null; moods: Mood[]; first: boolean; firstClosed: boolean }) {
  const an = useAnno()
  const { s } = useDemo()
  const ref = venueRef(v, guests)
  const I = HALL_ICON[v.type]
  const market = costs(s).venue
  const a = (no: string) => (first ? an('SCR-09', no) : {})
  const matched = v.moods.filter((m) => moods.includes(m))
  return (
    <li {...a('06')} className="flex gap-7 rounded-[18px] bg-wd-card p-5">
      <div {...a('07')} className="grid h-[150px] w-[220px] shrink-0 place-items-center rounded-[12px] bg-wd-gl/60 text-wd-g"><div className="text-center"><I size={40} strokeWidth={1.4} className="mx-auto" /><p className="mt-2 text-[13px]">{v.type}</p></div></div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center gap-2 text-[14px]"><Pill className="!py-0.5 !text-[13px]">{v.type}</Pill><Pill tone="gray" className="!py-0.5 !text-[13px]">{v.min}~{v.max}명</Pill></p>
            <p className="mt-2 text-[22px] font-semibold">{v.name} · {v.hall}</p>
            <p className="mt-1 flex items-center gap-1 text-[14.5px] text-neutral-500"><MapPin size={15} /> {v.region} {v.gu}</p>
          </div>
          <span {...a('08')}><Pill tone={v.open ? 'g' : 'gray'} className="!rounded-md !text-[14px]">{v.open ? '가격 공개' : '가격 미공개'}</Pill></span>
        </div>
        <p {...a('15')} className="mt-2 flex flex-wrap gap-2 text-[13px]">
          {budgetVenue && ref && <span className={`rounded px-2 py-0.5 ${fitOf(budgetVenue, ref) === 'in' ? 'bg-wd-gl text-wd-g' : fitOf(budgetVenue, ref) === 'maybe' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'}`}>{FIT_TEXT[fitOf(budgetVenue, ref)]}</span>}
          <span className="rounded bg-[#ececea] px-2 py-0.5 text-neutral-600">{v.moods.length ? `${(matched.length ? matched : v.moods).join(' · ')} (${v.hall})` : '분위기 정보 없음'}</span>
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-3">
          {v.open && ref ? (
            <div className="min-w-0">
              <span {...a('09')} className="flex items-baseline gap-3 whitespace-nowrap text-[15px] text-wd-g">대관료 <b className="text-[22px] text-[#2c3e37]">{v.rent}만원</b> <span className="text-neutral-300">|</span> 식대 <b className="text-[22px] text-[#2c3e37]">{v.meal}만원</b></span>
              <span {...a('10')} className="mt-1 block text-[14px] text-neutral-600">참고 금액 <b className="text-wd-g">{fmtRange(ref)}</b> <span className="text-[12px] text-neutral-400">· 내 하객 {guests === '아직 모르겠어요' ? '하객 수 미정 · 150~200명' : guests} 기준, 보증 인원 · 필수 장식비 · VAT 반영</span></span>
            </div>
          ) : (
            <span {...(firstClosed ? an('SCR-09', '11') : {})} className="text-[15px] text-wd-g">가격 미공개 · 이 지역 시세 <b className="text-[21px] text-[#2c3e37]">{fmtRange(market)}</b></span>
          )}
          {v.link && <Btn anno={first ? an('SCR-09', '12') : undefined} onClick={() => {}} className="flex h-[50px] shrink-0 items-center gap-1.5 px-8 text-[15px]">공식 채널 보기 <ExternalLink size={15} /></Btn>}
        </div>
      </div>
    </li>
  )
}

/* ═════════ SCR-10 스드메 후보 ═════════ */
function Sdm() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const combos = COMBOS[s.band]
  return (
    <>
      <Nav anno={an('SCR-10', '01')} />
      <div className="flex flex-1">
        <SideMenu active="sdm" />
        <main className="min-w-0 flex-1 px-[40px] pb-14 pt-8">
          <button type="button" {...an('SCR-10', '02')} onClick={() => go('SCR-06-D2')} className="flex items-center gap-1 text-[15px] text-neutral-600 hover:text-black"><ArrowLeft size={16} /> 스드메 계약 단계로</button>
          <div {...an('SCR-10', '03')} className="mt-4">
            <h1 className="text-[38px] font-bold tracking-tight">스드메 후보</h1>
            <p className="mt-2 text-[17px] text-neutral-500">공개 단품가 기준 · 출처: 참가격 결혼준비대행업체 공개 가격</p>
          </div>
          <div {...an('SCR-10', '04')} className="mt-6 flex gap-3" role="radiogroup" aria-label="스드메 예산대">
            {BANDS.map((b) => (
              <button key={b.id} type="button" role="radio" aria-checked={s.band === b.id} onClick={() => dispatch({ type: 'band', band: b.id as Band })} className={`rounded-full border px-6 py-3 text-[16px] ${s.band === b.id ? 'border-wd-g bg-wd-g text-white' : 'border-neutral-300 bg-white'}`}>
                {b.label.replace('만원', '만')} {b.name}
              </button>
            ))}
          </div>
          <p {...an('SCR-10', '05')} className="mt-6 text-[16px]"><b>이 예산대의 스드메 조합 {combos.length}개</b> <span className="text-neutral-500">· 서울 공개 가격 기준 · {SOURCE_DATE} 기준</span></p>
          {s.a.region && !s.a.region.startsWith('서울') && <p className="mt-1 text-[14px] text-amber-700">서울 공개 가격 기준이에요</p>}
          <ComboList combos={combos} annoBase />
          <p {...an('SCR-10', '09')} className="mt-6 rounded-[12px] border border-dashed border-neutral-300 px-5 py-4 text-[15px] text-neutral-600"><b>별도로 생길 수 있는 비용</b> · 원본 사진 · 수정본, 드레스 업그레이드, 헬퍼비 등 (합계 미포함)</p>
          <p {...an('SCR-10', '10')} className="mt-3 text-[13.5px] text-neutral-500">같은 업체도 대행사에 따라 가격이 다를 수 있어요 · 실제 견적은 날짜, 옵션, 업체에 따라 달라질 수 있어요.</p>
        </main>
      </div>
      <Footer anno={an('SCR-10', '11')} />
    </>
  )
}

/* ═════════ SCR-11 로그인 · SCR-11-B 초대 합류 ═════════ */
const LOGIN_TITLE = {
  top: '로그인하고 우리 계획을 이어서 관리하세요',
  save: '계획을 저장하려면 로그인해 주세요',
  amount: '실제 금액을 기록하려면 로그인해 주세요',
  todo: '할 일을 함께 관리하려면 로그인해 주세요',
  invite: '짝꿍을 초대하려면 로그인해 주세요',
} as const

function SocialBtns({ onPick, labels, annos }: { onPick: () => void; labels: [string, string]; annos: [Record<string, string>, Record<string, string>] }) {
  return (
    <div className="space-y-3">
      <button type="button" {...annos[0]} onClick={onPick} className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#FEE500] text-[17px] font-semibold text-[#191919]"><span className="grid size-6 place-items-center rounded-full bg-[#191919] text-[11px] text-[#FEE500]">K</span>{labels[0]}</button>
      <button type="button" {...annos[1]} onClick={onPick} className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[12px] border border-neutral-300 bg-white text-[17px] font-semibold"><span className="grid size-6 place-items-center rounded-full border border-neutral-300 text-[12px] font-bold text-[#4285F4]">G</span>{labels[1]}</button>
    </div>
  )
}
const Terms = ({ anno }: { anno?: Record<string, string> }) => (
  <p {...anno} className="mt-5 text-center text-[12.5px] leading-relaxed text-neutral-500">계속하면 <u>이용약관</u>에 동의하고 <u>개인정보처리방침</u>을 확인한 것으로 봐요.<br />만 14세 이상만 이용할 수 있어요.</p>
)

function LoginModal() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  if (!s.login) return null
  const pick = () => dispatch(s.loginFailNext ? { type: 'loginFail' } : { type: 'loginOk' })
  return (
    <Modal anno={an('SCR-11', '01')} title="로그인" width={500} onClose={() => dispatch({ type: 'set', patch: { login: null, loginError: false } })}>
      <p {...an('SCR-11', '02')} className="text-[22px] font-bold leading-snug">{LOGIN_TITLE[s.login.reason]}</p>
      <p {...an('SCR-11', '03')} className="mb-6 mt-2 text-[15px] text-neutral-500">저장하면 로드맵을 계속 관리하고, 짝꿍과 함께 볼 수 있어요.</p>
      {s.loginError ? (
        <div className="rounded-[12px] bg-rose-50 p-5 text-center">
          <p className="text-[16px] font-semibold text-rose-700">로그인하지 못했어요</p>
          <Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { loginError: false } })} className="mt-3 h-11 px-6">다시 시도</Btn>
        </div>
      ) : (
        <SocialBtns onPick={pick} labels={['카카오로 계속하기', '구글로 계속하기']} annos={[an('SCR-11', '04'), an('SCR-11', '05')]} />
      )}
      <Terms anno={an('SCR-11', '06')} />
    </Modal>
  )
}

function InviteModal() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  if (!s.invite) return null
  return (
    <Modal anno={an('SCR-11-B', '01')} title="초대 받음" width={540} onClose={() => { dispatch({ type: 'set', patch: { invite: null } }); go('SCR-01') }}>
      <p {...an('SCR-11-B', '02')} className="text-[22px] font-bold leading-snug">준근님이 함께 준비하자고 초대했어요</p>
      <div {...an('SCR-11-B', '03')} className="mt-5 rounded-[14px] bg-wd-gl/60 p-5 text-[15px]">
        <p className="font-semibold text-wd-g">서울 강남권 외 · 2027년 10월 예식 예정</p>
        <p className="mt-1">예상 총비용 1,800만 ~ 2,250만원 · 다음 할 일 예식장 계약</p>
        <p className="mt-1 text-[13px] text-neutral-500">금액 · 일정 세부는 합류 후 로드맵에서 확인해요</p>
      </div>
      {s.invite.hasPlan && <p {...an('SCR-11-B', '04')} className="mt-4 flex items-center gap-2 rounded-[12px] bg-amber-50 px-4 py-3 text-[14.5px] text-amber-800"><AlertTriangle size={17} /> 이미 만든 계획이 있다면, 합류하면 내 계획은 사라져요</p>}
      <div className="mt-6">
        <SocialBtns onPick={() => { dispatch({ type: 'replace', state: { ...seedJoin(s) } }); go('SCR-06') }} labels={['카카오로 로그인하고 함께하기', '구글로 로그인하고 함께하기']} annos={[an('SCR-11-B', '05'), an('SCR-11-B', '06')]} />
      </div>
      <Terms />
    </Modal>
  )
}
/** 합류: 초대한 사람의 계획으로 전환 (시연은 기본 계획을 초대한 계획으로 사용) */
function seedJoin(s: ReturnType<typeof useDemo>['s']) {
  const st = s.stages.map((x, i) => (i === 0 ? { done: true, amount: null, late: false } : x))
  return {
    ...s,
    invite: null, loggedIn: true, plan: true, partner: 'joined' as const,
    a: { region: '서울 강남권 외' as Region, guests: '150~200명' as Guests, when: { mode: 'date' as const, date: '2027-10-16', year: '2027', month: '10' }, budget: 3000, noBudget: false, budgetText: '3,000', moods: ['화사한', '클래식'] as MoodPick[] },
    stages: st, toast: '준근님과 함께 준비를 시작했어요',
  }
}

/* ═════════ 화면 매핑 ═════════ */
export function ScreenView({ id }: { id: ScreenId }) {
  const { s } = useDemo()
  let body: ReactNode
  switch (id) {
    case 'SCR-01': case 'SCR-01-B': case 'SCR-11': case 'SCR-11-B': body = <Home id={id} />; break
    case 'SCR-02-Q1': body = <Q1 />; break
    case 'SCR-02-Q2': body = <Q2 />; break
    case 'SCR-02-Q3': body = <Q3 />; break
    case 'SCR-02-Q4': body = <Q4 />; break
    case 'SCR-02-Q5': body = <Q5 />; break
    case 'SCR-02-E': body = <QStates />; break
    case 'SCR-03': case 'SCR-03-B': case 'SCR-03-C': case 'SCR-03-E': case 'SCR-03-F': body = <Result />; break
    case 'SCR-06': case 'SCR-06-E': case 'SCR-06-F': body = <Roadmap />; break
    case 'SCR-06-B': case 'SCR-06-C': case 'SCR-06-D': case 'SCR-06-D2': body = <StageDetail id={id} />; break
    case 'SCR-09': body = <Venues />; break
    case 'SCR-10': body = <Sdm />; break
  }
  return (
    <Page>
      {body}
      {s.panel && <ConditionPanel />}
      {s.login && <LoginModal />}
      {s.invite && <InviteModal />}
      <Toast />
    </Page>
  )
}
