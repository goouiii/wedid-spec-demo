import { useState, type ReactNode } from 'react'
import { ArrowUpRight, Check, ChevronDown, Info, Lightbulb, Flag, SlidersHorizontal, Users } from 'lucide-react'
import {
  BANDS, COMBOS, GUESTS, MOODS, REGIONS, STAGES, bandOf, fmtRange, guestLabel, venueCount, ym, ymKo,
  type Band, type Guests, type Region,
} from '../data/mock'
import {
  isPast, stageWindow, useDemo, weddingDate, type Answers, type DemoState, type MoodPick,
} from '../demo/state'
import { Avatar, Btn, Card, Chip, Layer, ManInput, Tag, budgetError, parseNum, selCls, type Anno } from './ui'

/* ───────── 조건 문구 ───────── */
export function guestText(a: Answers) {
  return a.guests ? guestLabel(a.guests) : '하객 수 미정 (150~200명 기준)'
}
export function moodText(a: Answers) {
  const m = a.moods.filter((x) => x !== '상관없어요')
  return m.length ? m.join(' · ') : null
}
export function condText(s: DemoState) {
  return [s.a.region ?? '서울 강남권 외', guestText(s.a), moodText(s.a), '토요일 낮 예식 기준'].filter(Boolean).join(' · ')
}
/** 로드맵 상단처럼 '예식 예정: 2027년 10월'로 시작하는 문구 */
export function roadCondText(s: DemoState) {
  const wd = weddingDate(s.a.when)
  const d = s.a.when.mode === 'date' && s.a.when.date && wd.date.getDate() !== 15 ? `${wd.date.getFullYear()}년 ${wd.date.getMonth() + 1}월 ${wd.date.getDate()}일` : wd.estimated ? `미정 (${ymKo(wd.date)} 기준)` : ymKo(wd.date)
  return [`예식 예정: ${d}`, s.a.region ?? '서울 강남권 외', guestText(s.a), moodText(s.a), '토요일 낮 예식 기준'].filter(Boolean).join(' · ')
}

export function CondLine({ text, onEdit, anno }: { text: string; onEdit?: () => void; anno?: Anno }) {
  return (
    <p {...anno} className="mt-2.5 flex flex-wrap items-center gap-x-3 text-[14.5px] text-neutral-500">
      <span>{text}</span>
      {onEdit && <button type="button" onClick={onEdit} className="flex items-center gap-1 font-bold text-wd-g"><SlidersHorizontal size={14} />조건 수정</button>}
    </p>
  )
}

/* ───────── 스드메 예산대 · 산출 근거 · 조합 ───────── */
export function BandPicker({ anno, disabled = false, compact = false }: { anno?: Anno; disabled?: boolean; compact?: boolean }) {
  const { s, dispatch } = useDemo()
  return (
    <div {...anno} className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="스드메 예산대">
      {BANDS.map((b) => {
        const on = s.band === b.id
        return (
          <button key={b.id} type="button" role="radio" aria-checked={on} disabled={disabled && !on} onClick={() => !disabled && dispatch({ type: 'band', band: b.id })}
            className={`relative rounded-[14px] border px-4 text-left transition ${compact ? 'py-3' : 'py-4'} ${on ? 'border-wd-g bg-[#f3f7f4] ring-1 ring-wd-g' : 'border-wd-line2 bg-white hover:border-neutral-300'} ${disabled && !on ? 'opacity-50' : ''}`}>
            {b.id === 'standard' && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-wd-g px-2 py-0.5 text-[10.5px] font-bold text-white">추천</span>}
            <p className="text-[15px] font-bold">{b.name}</p>
            <p className={`mt-1.5 text-[12.5px] ${on ? 'font-semibold text-wd-g' : 'text-neutral-500'}`}>{b.label}</p>
          </button>
        )
      })}
    </div>
  )
}

export function BasisToggle({ anno }: { anno?: Anno }) {
  const { s, dispatch } = useDemo()
  return (
    <button type="button" {...anno} aria-expanded={s.basis} onClick={() => dispatch({ type: 'set', patch: { basis: !s.basis } })} className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#f1f1ee] px-3 py-1.5 text-[12.5px] font-semibold text-neutral-700">
      산출 근거 보기 <ChevronDown size={14} className={s.basis ? 'rotate-180' : ''} />
    </button>
  )
}

export function BasisBox({ anno }: { anno?: Anno }) {
  const { s } = useDemo()
  if (!s.basis) return null
  const b = bandOf(s.band)
  const row = (k: string, v: ReactNode, bold = false) => (
    <div className={`flex justify-between py-2.5 text-[14px] ${bold ? 'border-t border-wd-line2 font-bold' : 'text-neutral-600'}`}><span>{k}</span><span className={bold ? 'text-wd-g' : 'font-semibold text-wd-ink'}>{v}</span></div>
  )
  return (
    <div {...anno} className="mt-3 rounded-[16px] bg-[#f7f7f4] px-5 py-4">
      <p className="text-[14.5px] font-bold">"{b.name}" 예산대 금액은 이렇게 계산했어요</p>
      <div className="mt-2">
        {row('스튜디오 공개 단품가 (중간 범위)', fmtRange(b.parts[0]))}
        {row('드레스 공개 단품가 (중간 범위)', fmtRange(b.parts[1]))}
        {row('메이크업 공개 단품가 (중간 범위)', fmtRange(b.parts[2]))}
        {row('스드메 총액 (합산)', fmtRange(b.range), true)}
      </div>
      <p className="mt-1 text-[12px] text-neutral-500">출처: 참가격 공개 단품가 (결혼준비대행업체) · 서울 공개 업체 27곳 · 기준일 2026.10.09</p>
    </div>
  )
}

export function ComboHead({ right, anno, title = '이 예산대의 스드메 조합' }: { right?: ReactNode; anno?: Anno; title?: string }) {
  const { s } = useDemo()
  return (
    <div {...anno} className="mt-7 flex items-end justify-between">
      <p className="text-[16px] font-bold">{title}<span className="ml-2 text-[12.5px] font-normal text-neutral-500">{bandOf(s.band).name} 예산대 · 서울 공개 가격 기준</span></p>
      {right}
    </div>
  )
}

export function ComboCards({ band, anno, detailed = false }: { band: Band; anno?: Anno; detailed?: boolean }) {
  const combos = COMBOS[band]
  if (!combos.length) {
    return <div {...anno} className="mt-3 rounded-[16px] border border-dashed border-wd-line px-6 py-8 text-center text-[14px] text-neutral-500">이 예산대에 맞는 공개 조합이 아직 없어요. 공개 단품가가 모이면 보여드릴게요.</div>
  }
  return (
    <div {...anno} className="mt-3 grid grid-cols-3 gap-3">
      {combos.map((c) => (
        <div key={c.type} className="rounded-[16px] border border-wd-line2 bg-white px-4 py-4">
          <p className="text-[12.5px] font-bold text-wd-g">{c.type}</p>
          <p className="mt-1.5 text-[17px] font-bold">{fmtRange(c.total, detailed ? ' 원' : '원')}</p>
          {detailed && <p className="mt-0.5 text-[11.5px] text-neutral-500">기본 상품 합산 · 플래너 경유가</p>}
          <div className="mt-3 space-y-3 border-t border-wd-line2 pt-3">
            {c.vendors.map((v) => (
              <div key={v.id} className={detailed ? '' : 'flex items-end justify-between gap-2'}>
                <div className="min-w-0">
                  <p className="text-[11px] text-neutral-500">{v.cat}</p>
                  <p className="truncate text-[13.5px] font-bold">{v.name}</p>
                  {detailed && <p className="mt-0.5 text-[12px] text-neutral-600"><b className="text-wd-ink">{fmtRange(v.price, ' 원')}</b> · 공개 대행사 {v.agencies}곳</p>}
                  {detailed && <p className="mt-1 flex items-center gap-0.5 text-[12px] font-semibold text-wd-g">공식 채널 보기 <ArrowUpRight size={12} /></p>}
                </div>
                {!detailed && <span className="flex shrink-0 items-center gap-2 text-[13.5px] font-bold">{v.price[0]}만~ <ArrowUpRight size={13} className="text-wd-g" /></span>}
              </div>
            ))}
          </div>
          {!detailed && <p className="mt-3 text-[11.5px] text-neutral-500">기본 상품 합산 · 플래너 경유가</p>}
        </div>
      ))}
    </div>
  )
}

export function ExtraCosts({ anno, more = false }: { anno?: Anno; more?: boolean }) {
  const items = ['원본 사진 · 수정본', '드레스 업그레이드', '헬퍼비', ...(more ? ['그 밖의 추가 옵션'] : [])]
  return (
    <div {...anno} className="mt-4 flex gap-3 rounded-[16px] border border-[#d9c18c] bg-[#fbf7ec] px-5 py-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-[#f4e7c6] text-[#9a7a2e]"><Info size={16} /></span>
      <div>
        <p className="text-[14px]"><b>별도로 생길 수 있는 비용</b><span className="text-neutral-600"> · 위 합계에 포함되지 않아요</span></p>
        <div className="mt-2 flex flex-wrap gap-2">{items.map((i) => <span key={i} className="rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-700">{i}</span>)}</div>
      </div>
    </div>
  )
}

/* ───────── 조건 수정 패널 (예상 비용 · 로드맵 공용) ───────── */
export function CondPanel({ anno }: { anno?: { fields?: Anno; submit?: Anno; mood?: Anno } }) {
  const { s, dispatch } = useDemo()
  const [d, setD] = useState<Answers>(() => ({ ...s.a, when: { ...s.a.when }, moods: [...s.a.moods] }))
  const close = () => dispatch({ type: 'set', patch: { panel: false } })
  const err = budgetError(parseNum(d.budgetText))
  const toggleMood = (m: MoodPick) => setD((p) => ({ ...p, moods: m === '상관없어요' ? ['상관없어요'] : p.moods.includes(m) ? p.moods.filter((x) => x !== m) : [...p.moods.filter((x) => x !== '상관없어요'), m] }))
  const label = (t: string) => <p className="mb-2 text-[13px] font-bold text-neutral-700">{t}</p>
  return (
    <Layer align="right" onClose={close}>
      <aside role="dialog" aria-label="조건 수정" className="flex h-full w-[440px] flex-col bg-white shadow-2xl">
        <div className="border-b border-wd-line2 px-7 pb-5 pt-7">
          <h2 className="text-[22px] font-bold">조건 수정</h2>
          <p className="mt-1.5 text-[13.5px] text-neutral-500">바꾼 조건으로 예상 비용을 다시 계산해요. 질문 화면으로 돌아가지 않아요.</p>
        </div>
        <div {...anno?.fields} className="flex-1 space-y-6 overflow-auto px-7 py-6">
          <div>{label('지역')}<select aria-label="지역" className={`${selCls} w-full`} value={d.region ?? ''} onChange={(e) => setD({ ...d, region: e.target.value as Region })}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div>
          <div>{label('하객 수')}<select aria-label="하객 수" className={`${selCls} w-full`} value={d.guests ?? ''} onChange={(e) => setD({ ...d, guests: e.target.value as Guests })}>{GUESTS.map((g) => <option key={g}>{g}</option>)}</select></div>
          <div>
            {label('예식 예정 시기')}
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[12px] text-neutral-500">연도<select aria-label="연도" className={`${selCls} mt-1 w-full`} value={d.when.year || '2027'} onChange={(e) => setD({ ...d, when: { mode: 'month', date: '', year: e.target.value, month: d.when.month || '10' } })}>{['2026', '2027', '2028'].map((y) => <option key={y} value={y}>{y}년</option>)}</select></label>
              <label className="text-[12px] text-neutral-500">월<select aria-label="월" className={`${selCls} mt-1 w-full`} value={d.when.month || '10'} onChange={(e) => setD({ ...d, when: { mode: 'month', date: '', year: d.when.year || '2027', month: e.target.value } })}>{Array.from({ length: 12 }, (_, i) => String(i + 1)).map((m) => <option key={m} value={m}>{m}월</option>)}</select></label>
            </div>
          </div>
          <div>
            {label('예산 (선택)')}
            <ManInput value={d.budgetText} error={err} onChange={(v) => setD({ ...d, budgetText: v, budget: parseNum(v), noBudget: !v })} placeholder="예: 3,000" />
            <p className={`mt-1.5 text-[12px] ${err ? 'text-rose-600' : 'text-neutral-500'}`}>{err ?? "비워 두면 '아직 없어요'로 계산해요."}</p>
          </div>
          <div {...anno?.mood}>
            {label('선호 분위기 (선택)')}
            <div className="flex flex-wrap gap-2">{[...MOODS, '상관없어요' as const].map((m) => <Chip key={m} on={d.moods.includes(m)} onClick={() => toggleMood(m)}>{m}</Chip>)}</div>
            <p className="mt-2 text-[12px] text-neutral-500">분위기는 비용에 영향을 주지 않고, 예식장 후보 순서에만 반영돼요.</p>
          </div>
        </div>
        <div className="space-y-2 border-t border-wd-line2 px-7 py-5">
          <Btn anno={anno?.submit} disabled={!!err} onClick={() => dispatch({ type: 'recalc', a: d })} className="h-12 w-full text-[15px]">이 조건으로 다시 계산</Btn>
          <Btn kind="outline" onClick={close} className="h-12 w-full text-[15px]">취소</Btn>
        </div>
      </aside>
    </Layer>
  )
}

/* ───────── 로드맵 · 홈 공용 위젯 ───────── */
export const upcoming = (s: DemoState) => {
  const i = s.stages.findIndex((x, k) => !x.done && !isPast(s, k))
  return i === -1 ? s.stages.findIndex((x) => !x.done) : i
}
export const winText = (s: DemoState, i: number) => {
  const w = stageWindow(s, i)
  return `${ym(w.from)} ~ ${ym(w.to)}${weddingDate(s.a.when).estimated ? ' (예상)' : ''}`
}
export const dText = (i: number) => `D-${STAGES[i].d[0]}~${STAGES[i].d[1]}`

export function Timeline({ anno }: { anno?: Anno }) {
  const { s } = useDemo()
  const nx = upcoming(s)
  return (
    <div {...anno} className="grid grid-cols-6 gap-2">
      {STAGES.map((st, i) => {
        const x = s.stages[i]
        return (
          <div key={st.name}>
            <div className="h-1 rounded-full bg-[#ebebe6]"><div className={`h-full rounded-full ${x.done ? 'w-full bg-wd-g' : i === nx ? 'w-2/5 bg-wd-g' : isPast(s, i) ? 'w-full bg-amber-300' : 'w-0'}`} /></div>
            <p className={`mt-3 text-[12.5px] ${x.done || i === nx ? 'font-bold' : 'text-neutral-500'}`}>{st.short}</p>
            <p className="mt-1 text-[11.5px] text-neutral-500">{dText(i)}</p>
          </div>
        )
      })}
    </div>
  )
}

export function MembersCard({ anno, onManage }: { anno?: Anno; onManage?: () => void }) {
  const { s, dispatch } = useDemo()
  return (
    <Card anno={anno} className="px-6 py-5">
      <div className="flex items-center justify-between"><p className="text-[16px] font-bold">함께하는 멤버</p>{s.loggedIn && <button type="button" onClick={onManage} className="text-[13px] font-semibold text-neutral-500">관리 ›</button>}</div>
      <div className="mt-4 divide-y divide-wd-line2">
        <div className="flex items-center gap-3 pb-3"><Avatar t="준" size={34} /><div className="flex-1 leading-tight"><p className="text-[14px] font-bold">나 (준근)</p><p className="text-[12px] text-neutral-500">계획 만든 사람</p></div><Tag tone="dark">나</Tag></div>
        {s.partner === 'joined' ? (
          <div className="flex items-center gap-3 pt-3"><Avatar t="민" tone="p" size={34} /><div className="flex-1 leading-tight"><p className="text-[14px] font-bold">파트너 (민지)</p><p className="text-[12px] text-neutral-500">구글로 합류</p></div><Tag>짝꿍</Tag></div>
        ) : (
          <button type="button" onClick={() => dispatch({ type: 'needLogin', reason: 'invite', then: { type: 'set', patch: { inviteOpen: true } } })} className="flex w-full items-center gap-3 pt-3 text-left"><Avatar t="+" tone="empty" size={34} /><div className="leading-tight"><p className="text-[14px] font-bold text-neutral-500">짝꿍 자리</p><p className="text-[12px] text-neutral-400">{s.loggedIn ? '초대하면 여기에 보여요' : '로그인하면 저장돼요'}</p></div></button>
        )}
      </div>
    </Card>
  )
}

export function TogetherCard({ anno }: { anno?: Anno }) {
  const { s, dispatch } = useDemo()
  return (
    <Card anno={anno} className="overflow-hidden px-6 pb-6 pt-6">
      <div className="grid h-[110px] place-items-center rounded-[16px] bg-gradient-to-b from-[#eef3ee] to-[#f7f1e6]"><Users size={34} className="text-wd-g/60" strokeWidth={1.4} /></div>
      <p className="mt-5 text-[16px] font-bold">웨딧과 함께하는 웨딩 플랜</p>
      {s.partner === 'joined' ? (
        <p className="mt-1.5 text-[13.5px] text-neutral-500">민지 님과 같은 로드맵을 함께 보고 있어요.</p>
      ) : (
        <>
          <p className="mt-1.5 text-[13.5px] text-neutral-500">링크를 보내 짝꿍을 초대하세요. 같은 계획을 함께 보고 체크할 수 있어요.</p>
          <Btn kind="soft" onClick={() => dispatch({ type: 'needLogin', reason: 'invite', then: { type: 'set', patch: { inviteOpen: true } } })} className="mt-4 h-10 w-full text-[13.5px]">초대 링크 만들기</Btn>
        </>
      )}
    </Card>
  )
}

export function StageAside({ i, anno }: { i: number; anno?: { decide?: Anno; tips?: Anno; nav?: Anno } }) {
  const { dispatch, go } = useDemo()
  const st = STAGES[i]
  const open = (k: number) => { dispatch({ type: 'set', patch: { view: k, amountText: '', editAmount: false } }); go(k === 2 ? 'STEP-03' : 'STEP-01') }
  const list = (items: string[]) => <ul className="mt-3 space-y-2.5">{items.map((t) => <li key={t} className="flex gap-2.5 text-[13.5px] text-neutral-700"><span className="mt-2 size-1 shrink-0 rounded-full bg-wd-g/60" />{t}</li>)}</ul>
  return (
    <div className="space-y-3">
      <Card anno={anno?.decide} className="px-6 py-5"><p className="flex items-center gap-2.5 text-[16px] font-bold"><span className="grid size-8 place-items-center rounded-[9px] bg-[#f1f1ee]"><Flag size={15} /></span>정해야 할 것</p>{list(st.decide)}</Card>
      <Card anno={anno?.tips} className="px-6 py-5"><p className="flex items-center gap-2.5 text-[16px] font-bold"><span className="grid size-8 place-items-center rounded-[9px] bg-[#f1f1ee]"><Lightbulb size={15} /></span>알아두면 좋은 점</p>{list(st.tips)}</Card>
      <div {...anno?.nav} className="flex justify-between px-2 pt-1 text-[13px] font-semibold text-neutral-600">
        {i > 0 ? <button type="button" onClick={() => open(i - 1)}>‹ {STAGES[i - 1].short}</button> : <span />}
        {i < 5 ? <button type="button" onClick={() => open(i + 1)}>{STAGES[i + 1].short} ›</button> : <span />}
      </div>
    </div>
  )
}

export function CheckList({ i, anno }: { i: number; anno?: { list?: Anno; add?: Anno } }) {
  const { s, dispatch } = useDemo()
  const todos = s.todos[i]
  const done = todos.filter((t) => t.done).length
  return (
    <div {...anno?.list}>
      <div className="flex items-center justify-between">
        <p className="text-[14.5px] font-bold">체크리스트</p>
        <div className="flex items-center gap-3 text-[12.5px] text-neutral-500"><span><b className="text-wd-ink">{done}</b> / {todos.length} 완료</span><span className="h-1 w-20 rounded-full bg-[#ebebe6]"><span className="block h-full rounded-full bg-wd-g" style={{ width: `${todos.length ? (done / todos.length) * 100 : 0}%` }} /></span></div>
      </div>
      <ul className="mt-3 space-y-1">
        {todos.map((t, j) => (
          <li key={j} className="flex items-center gap-3 py-2">
            <button type="button" role="checkbox" aria-checked={t.done} aria-label={t.text} disabled={s.stages[i].done} onClick={() => dispatch(s.loggedIn ? { type: 'check', stage: i, i: j } : { type: 'needLogin', reason: 'todo' })} className={`grid size-5 place-items-center rounded-[5px] border ${t.done ? 'border-wd-g bg-wd-g text-white' : 'border-neutral-300 bg-white'}`}>{t.done && <Check size={13} strokeWidth={3} />}</button>
            <span className={`flex-1 text-[14.5px] ${t.done ? 'text-neutral-400 line-through' : ''}`}>{t.text}</span>
            <Tag tone={t.owner === '나' ? 'dark' : 'g'}>{t.owner}</Tag>
          </li>
        ))}
      </ul>
      {!s.stages[i].done && (
        <button type="button" {...anno?.add} onClick={() => dispatch({ type: 'needLogin', reason: 'todo', then: { type: 'set', patch: { todoOpen: true } } })} className="mt-1 text-[13px] font-semibold text-wd-g">+ 할 일 추가</button>
      )}
    </div>
  )
}

export function venueCountText(region: Region) {
  return `${region === '서울 강남권 외' ? '서울(강남 외)' : region} 예식장 ${venueCount(region)}곳의 공개 가격 기준 (가운데 50%)`
}

