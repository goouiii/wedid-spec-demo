import { Check, ChevronDown, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { GUESTS, MOODS, REGIONS, type Region } from '../data/mock'
import { useAnno, useDemo, type MoodPick, type ScreenId } from '../demo/state'
import { Btn, Chip, Logo, Page, budgetError, onlyNum, parseNum, inputCls, type Anno } from './ui'

const STEPS = [
  { t: '기본 정보', d: '지역 · 하객 수' },
  { t: '예산, 일정', d: '결혼 시기 · 예산' },
  { t: '취향', d: '예식장 분위기 (선택)' },
]

function whenText(w: { mode: string | null; date: string; year: string; month: string }) {
  if (w.mode === 'date' && w.date) return w.date.replace(/-/g, '.')
  if (w.mode === 'month' && w.year && w.month) return `${w.year}년 ${w.month}월`
  if (w.mode === 'none') return '아직 미정'
  return '—'
}

function QShell({ page, children, footer, anno }: { page: 1 | 2 | 3; children: ReactNode; footer: ReactNode; anno: { steps?: Anno; top?: Anno; summary?: Anno } }) {
  const { s, go } = useDemo()
  const a = s.a
  const n = page === 1 ? 2 : page === 2 ? 4 : 5
  const sum: [string, string][] = [
    ['지역', a.region ?? '—'],
    ['하객', a.guests ? (a.guests === '아직 모르겠어요' ? '미정' : a.guests) : '—'],
    ['시기', whenText(a.when)],
    ['예산', a.noBudget ? '아직 없어요' : a.budgetText ? `${a.budgetText}만 원` : '—'],
    ['분위기', a.moods.length ? a.moods.join(' · ') : '—'],
  ]
  return (
    <Page bg="bg-white">
      <div className="flex min-h-[inherit] flex-1">
        <aside className="relative flex w-[420px] shrink-0 flex-col bg-[radial-gradient(120%_70%_at_30%_0%,#3f6457_0%,#22392f_55%,#1d3128_100%)] px-10 pb-8 pt-10 text-white">
          <Logo light />
          <h2 className="mt-20 text-[30px] font-bold leading-[1.35]">우리 결혼 비용,<br />1분이면 알 수 있어요</h2>
          <p className="mt-4 text-[15.5px] leading-7 text-white/70">모르는 질문은 건너뛰어도 괜찮아요.<br />나중에 언제든 바꿀 수 있어요.</p>
          <ol {...anno.steps} className="mt-20 space-y-8">
            {STEPS.map((st, i) => {
              const done = i + 1 < page
              const on = i + 1 === page
              return (
                <li key={st.t} className={`flex items-center gap-4 ${on || done ? '' : 'opacity-50'}`}>
                  <span className={`grid size-7 place-items-center rounded-full text-[13px] font-bold ${on ? 'bg-white text-wd-g' : 'border border-white/50'}`}>{done ? <Check size={14} /> : i + 1}</span>
                  <span className="leading-tight"><span className="block text-[15px] font-bold">{st.t}</span><span className="text-[12.5px] text-white/70">{st.d}</span></span>
                </li>
              )
            })}
          </ol>
          <div {...anno.summary} className="mt-auto rounded-[18px] border border-white/15 bg-white/5 px-5 py-4">
            <p className="text-[13px] font-semibold text-white/85">지금까지 입력한 정보</p>
            <dl className="mt-3 space-y-2 text-[13.5px]">{sum.map(([k, v]) => <div key={k} className="flex justify-between"><dt className="text-white/65">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <div {...anno.top} className="flex items-start justify-between px-12 pt-8">
            <div className="w-[200px]"><p className="text-[13px] text-neutral-500">질문 <b className="text-wd-ink">{n}</b> / 5</p><div className="mt-2 h-1 rounded-full bg-[#ebebe6]"><div className="h-full rounded-full bg-wd-g" style={{ width: `${(n / 5) * 100}%` }} /></div></div>
            <button type="button" onClick={() => go('MAIN-01')} className="flex items-center gap-1.5 text-[14px] font-semibold"><X size={16} />나가기</button>
          </div>
          <div className="mx-auto w-[600px] flex-1 pb-10 pt-12">{children}</div>
          <div className="sticky bottom-0 border-t border-wd-line2 bg-white py-4"><div className="mx-auto flex w-[600px] gap-3">{footer}</div></div>
        </div>
      </div>
    </Page>
  )
}

function QHead({ q, title, desc }: { q: string; title: string; desc: string }) {
  return (<><p className="text-[13px] font-bold text-wd-g">{q}</p><h1 className="mt-2 text-[34px] font-bold tracking-tight">{title}</h1><p className="mt-2 text-[16px] text-neutral-600">{desc}</p></>)
}

function Radio({ on, children, onClick, className = '' }: { on: boolean; children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick} className={`flex h-[58px] items-center gap-3 rounded-[14px] border px-5 text-left text-[16px] font-bold transition ${on ? 'border-wd-g bg-[#f3f7f4] ring-1 ring-wd-g' : 'border-wd-line2 bg-white hover:border-neutral-300'} ${className}`}>
      <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-wd-g' : 'border-neutral-300'}`}>{on && <span className="size-2.5 rounded-full bg-wd-g" />}</span>{children}
    </button>
  )
}

export function QBasic() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const id: ScreenId = 'Q-01'
  const a = s.a
  return (
    <QShell page={1} anno={{ steps: an(id, '01'), top: an(id, '02'), summary: an(id, '05') }}
      footer={<Btn anno={an(id, '06')} disabled={!a.region || !a.guests} onClick={() => go('Q-02')} className="h-14 flex-1 text-[16px]">다음</Btn>}>
      <QHead q="Q1" title="어디에서 결혼식을 올릴 예정인가요?" desc="지역마다 예식장, 스드메 가격이 달라요." />
      <div {...an(id, '03')} className="relative mt-7">
        <select aria-label="지역" value={a.region ?? ''} onChange={(e) => dispatch({ type: 'answer', patch: { region: e.target.value as Region } })} className={`${inputCls} appearance-none text-[16px] ${a.region ? 'font-semibold' : 'text-neutral-500'}`}>
          <option value="" disabled>지역을 선택해 주세요</option>
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-4 top-[17px] text-neutral-500" />
        <p className="mt-3 text-[13px] text-neutral-500">참가격 결혼서비스 통계의 14개 권역 기준이에요.</p>
      </div>
      <div className="mt-16"><QHead q="Q2" title="하객은 몇 명 정도 예상하나요?" desc="잘 모르겠으면 대략적으로 골라도 괜찮아요." /></div>
      <div {...an(id, '04')} role="radiogroup" aria-label="하객 수" className="mt-7 grid grid-cols-3 gap-2.5">
        {GUESTS.map((g) => <Radio key={g} on={a.guests === g} onClick={() => dispatch({ type: 'answer', patch: { guests: g } })} className={g === '아직 모르겠어요' ? 'col-span-3 font-semibold' : ''}>{g}</Radio>)}
      </div>
    </QShell>
  )
}

export function QPlan() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const a = s.a
  const n = parseNum(a.budgetText)
  const err = a.noBudget ? null : budgetError(n)
  const setBudget = (t: string) => dispatch({ type: 'answer', patch: { budgetText: t, budget: parseNum(t), noBudget: false } })
  const add = (v: number) => setBudget(((n ?? 0) + v).toLocaleString('ko-KR'))
  const whenOk = a.when.mode === 'none' || (a.when.mode === 'month' && a.when.year && a.when.month) || (a.when.mode === 'date' && a.when.date)
  return (
    <QShell page={2} anno={{ steps: an('Q-02', '06') }}
      footer={<><Btn kind="outline" onClick={() => go('Q-01')} className="h-14 w-[140px] text-[16px]">이전</Btn><Btn anno={{ ...an('Q-02', '05'), ...an('Q-03', '02') }} disabled={!!err || !whenOk} onClick={() => go('Q-04')} className="h-14 flex-1 text-[16px]">다음</Btn></>}>
      <QHead q="Q3" title="결혼식은 언제쯤인가요?" desc="날짜가 없어도 괜찮아요. 대략적인 시기로 로드맵을 만들어요." />
      <div {...an('Q-02', '01')} role="radiogroup" aria-label="결혼 시기" className="mt-7 space-y-2.5">
        <Radio on={a.when.mode === 'date'} onClick={() => dispatch({ type: 'answer', patch: { when: { mode: 'date', date: a.when.date || '2027-10-16', year: '2027', month: '10' } } })} className="w-full">날짜가 정해졌어요</Radio>
        {a.when.mode === 'date' && <input type="date" aria-label="예식 날짜" min="2026-11-16" value={a.when.date} onChange={(e) => dispatch({ type: 'answer', patch: { when: { ...a.when, date: e.target.value } } })} className={inputCls} />}
        <div className={`rounded-[14px] border ${a.when.mode === 'month' ? 'border-wd-g bg-[#f3f7f4] ring-1 ring-wd-g' : 'border-wd-line2'}`}>
          <Radio on={a.when.mode === 'month'} onClick={() => dispatch({ type: 'answer', patch: { when: { mode: 'month', date: '', year: a.when.year || '2027', month: a.when.month || '10' } } })} className="w-full !border-0 !bg-transparent !ring-0">대략적인 달만 정했어요</Radio>
          {a.when.mode === 'month' && (
            <div {...an('Q-02', '02')} className="grid grid-cols-2 gap-3 px-5 pb-5">
              <label className="text-[12.5px] text-neutral-500">연도<select aria-label="연도" value={a.when.year} onChange={(e) => dispatch({ type: 'answer', patch: { when: { ...a.when, year: e.target.value } } })} className={`${inputCls} mt-1 !h-12 bg-white font-semibold text-wd-ink`}>{['2026', '2027', '2028'].map((y) => <option key={y} value={y}>{y}년</option>)}</select></label>
              <label className="text-[12.5px] text-neutral-500">월<select aria-label="월" value={a.when.month} onChange={(e) => dispatch({ type: 'answer', patch: { when: { ...a.when, month: e.target.value } } })} className={`${inputCls} mt-1 !h-12 bg-white font-semibold text-wd-ink`}>{Array.from({ length: 12 }, (_, i) => String(i + 1)).map((m) => <option key={m} value={m}>{m}월</option>)}</select></label>
            </div>
          )}
        </div>
        <Radio on={a.when.mode === 'none'} onClick={() => dispatch({ type: 'answer', patch: { when: { mode: 'none', date: '', year: '', month: '' } } })} className="w-full">아직 정하지 않았어요</Radio>
      </div>
      <div className="mt-16"><QHead q="Q4" title="생각해 둔 예산이 있나요?" desc="예식장과 스드메에 쓸 예산이에요. 대략적인 금액도 괜찮아요." /></div>
      <div {...an('Q-02', '03')} className="mt-7">
        <div {...an('Q-03', '01')} className="relative">
          <input aria-label="예산 (만 원)" aria-invalid={!!err} inputMode="numeric" placeholder="예: 3,000" value={a.budgetText} onChange={(e) => setBudget(onlyNum(e.target.value))} className={`${inputCls} !h-[64px] pr-16 !text-[24px] font-bold ${err ? '!border-rose-400 !bg-rose-50/50' : ''}`} />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px] text-neutral-500">만 원</span>
        </div>
        <p className={`mt-2 text-[13.5px] ${err ? 'font-semibold text-rose-600' : 'text-neutral-500'}`}>{err ?? (n ? `${a.budgetText}만 원` : "비워 두면 '아직 없어요'로 계산해요")}</p>
        <div className="mt-3 flex gap-2">{[500, 1000, 3000].map((v) => <Chip key={v} on={false} onClick={() => add(v)}>+{v.toLocaleString('ko-KR')}만</Chip>)}<Chip on={false} onClick={() => setBudget('')}>지우기</Chip></div>
      </div>
      <div {...an('Q-02', '04')} className="mt-4"><Radio on={a.noBudget} onClick={() => dispatch({ type: 'answer', patch: { noBudget: !a.noBudget, budget: null, budgetText: '' } })} className="w-full">아직 없어요</Radio></div>
    </QShell>
  )
}

export function QMood() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const id: ScreenId = 'Q-04'
  const a = s.a
  const toggle = (m: MoodPick) => dispatch({ type: 'answer', patch: { moods: m === '상관없어요' ? (a.moods.includes('상관없어요') ? [] : ['상관없어요']) : a.moods.includes(m) ? a.moods.filter((x) => x !== m) : [...a.moods.filter((x) => x !== '상관없어요'), m] } })
  const finish = () => { dispatch({ type: 'set', patch: { calculating: true } }); go('COST-01') }
  return (
    <QShell page={3} anno={{ summary: an(id, '03') }}
      footer={<><Btn kind="outline" onClick={() => go('Q-02')} className="h-14 w-[140px] text-[16px]">이전</Btn><Btn anno={an(id, '04')} onClick={finish} className="h-14 flex-1 text-[16px]">결과 보기</Btn></>}>
      <QHead q="Q5 · 선택" title="원하는 예식장 분위기가 있나요?" desc="여러 개 골라도 돼요. 없으면 [상관없어요]를 눌러 주세요." />
      <div {...an(id, '01')} className="mt-7 grid grid-cols-2 gap-2.5">
        {[...MOODS, '상관없어요' as const].map((m) => (
          <button key={m} type="button" aria-pressed={a.moods.includes(m)} onClick={() => toggle(m)} className={`flex h-[58px] items-center justify-between rounded-[14px] border px-5 text-[16px] font-bold ${a.moods.includes(m) ? 'border-wd-g bg-[#f3f7f4] ring-1 ring-wd-g' : 'border-wd-line2 hover:border-neutral-300'}`}>
            {m}<span className={`grid size-5 place-items-center rounded-[5px] border ${a.moods.includes(m) ? 'border-wd-g bg-wd-g text-white' : 'border-neutral-300'}`}>{a.moods.includes(m) && <Check size={13} strokeWidth={3} />}</span>
          </button>
        ))}
      </div>
      <p {...an(id, '02')} className="mt-5 rounded-[12px] bg-[#f6f6f2] px-4 py-3 text-[13.5px] text-neutral-600">고른 분위기는 예식장 후보 순서에만 반영돼요. 예상 비용 계산에는 쓰지 않아요.</p>
    </QShell>
  )
}
