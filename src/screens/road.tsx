import { useState } from 'react'
import { ArrowRight, Check, CalendarDays, Info, PartyPopper, UserPlus } from 'lucide-react'
import { STAGES, fmtRange, ymKo } from '../data/mock'
import { dday, isPast, spent, stageBudget, useAnno, useDemo, weddingDate, type ScreenId } from '../demo/state'
import { AppShell, Btn, Card, DarkCard, Dot, Head, ManInput, Page, Tag, Warn, budgetError, parseNum } from './ui'
import { CondLine, CondPanel, MembersCard, Timeline, TogetherCard, dText, roadCondText, upcoming, winText } from './parts'

const R: ScreenId[] = ['ROAD-02']

export function BudgetCard() {
  const { s, go } = useDemo()
  const an = useAnno()
  const b = s.a.budget
  const used = spent(s)
  const row = (k: string, v: string, strong = false) => <div className="flex justify-between border-b border-wd-line2 py-3.5 text-[14px] last:border-0"><span className="text-neutral-500">{k}</span><b className={strong ? 'text-[17px] text-wd-g' : ''}>{v}</b></div>
  return (
    <Card anno={{ ...an(R, '06'), ...an('ROAD-03', '03') }} className="px-6 py-5">
      <div className="flex items-center justify-between"><p className="text-[16px] font-bold">우리 예산</p><button type="button" onClick={() => go(s.loggedIn ? 'COST-08' : 'COST-02')} className="text-[13px] font-semibold text-neutral-500">예상 비용 ›</button></div>
      <div className="mt-2">
        {row('설정한 예산', b ? `${b.toLocaleString('ko-KR')}만 원` : '아직 없어요')}
        {row('지금까지 쓴 금액', used ? `${used.toLocaleString('ko-KR')}만 원` : '0원')}
        {row('남은 예산', b ? `${(b - used).toLocaleString('ko-KR')}만 원` : '—', true)}
      </div>
    </Card>
  )
}

function BudgetInputCard() {
  const { dispatch } = useDemo()
  const an = useAnno()
  const [v, setV] = useState('')
  const err = v ? budgetError(parseNum(v)) : null
  return (
    <Card anno={an('ROAD-06', '01')} className="border-wd-g/40 px-6 py-5">
      <p className="text-[16px] font-bold">예산을 정하면 남은 예산을 계산해드려요</p>
      <p className="mt-1.5 text-[13px] leading-6 text-neutral-500">총 예산을 넣으면 단계별로 얼마나 남았는지 보여드려요. 나중에 넣어도 돼요.</p>
      <div className="mt-4"><ManInput value={v} onChange={setV} error={err} /></div>
      {err && <p className="mt-1.5 text-[12px] text-rose-600">{err}</p>}
      <Btn anno={an('ROAD-06', '02')} disabled={!v || !!err} onClick={() => dispatch({ type: 'setBudget', budget: parseNum(v)! })} className="mt-3 h-11 w-full text-[14px]">예산 넣기</Btn>
    </Card>
  )
}

function NextCard() {
  const { s, go, dispatch } = useDemo()
  const an = useAnno()
  const nx = upcoming(s)
  const allDone = s.stages.every((x) => x.done)
  if (allDone) {
    return (
      <DarkCard anno={an('ROAD-03', '01')} className="px-8 py-8">
        <Tag tone="gray" className="!bg-white/15 !text-white"><PartyPopper size={12} />모든 단계 완료</Tag>
        <p className="mt-5 text-[34px] font-bold">결혼 준비를 모두 마쳤어요</p>
        <p className="mt-2 text-[15px] text-white/75">행복한 결혼식 되세요!</p>
        <div className="mt-7 flex gap-8 border-t border-white/15 pt-5 text-[14px]"><p><span className="text-white/65">쓴 금액</span><b className="ml-3 text-[19px]">{spent(s).toLocaleString('ko-KR')}만</b></p>{s.a.budget && <p><span className="text-white/65">남은 예산</span><b className="ml-3 text-[19px]">{(s.a.budget - spent(s)).toLocaleString('ko-KR')}만</b></p>}</div>
      </DarkCard>
    )
  }
  const st = STAGES[nx]
  const bud = stageBudget(s, nx)
  const open = () => { dispatch({ type: 'set', patch: { view: nx, amountText: '', editAmount: false } }); go(nx === 2 ? 'STEP-03' : 'STEP-01') }
  return (
    <DarkCard anno={an(R, '03')} className="px-8 py-7">
      <div className="flex items-center justify-between text-[13px]"><Tag tone="gray" className="!bg-white/15 !text-white">● 다음 할 일 · {nx + 1}단계</Tag><span className="text-white/70">{winText(s, nx)}</span></div>
      <p className="mt-6 text-[36px] font-bold">{st.name}</p>
      <p className="mt-2 text-[15px] text-white/75">예식 D-{dday(s)}{weddingDate(s.a.when).estimated ? ' (예상)' : ''} · 권장 시기 {dText(nx)}</p>
      <div className="mt-7 flex items-end justify-between border-t border-white/15 pt-5">
        <div><p className="text-[12.5px] text-white/70">이번 단계 예산</p><p className="mt-1 text-[22px] font-bold">{bud ? fmtRange(bud) : '따로 드는 비용 없음'}</p></div>
        <Btn kind="white" onClick={open} className="h-11 px-5 text-[14.5px]">단계 보기 <ArrowRight size={15} /></Btn>
      </div>
    </DarkCard>
  )
}

function StageList() {
  const { s, go, dispatch } = useDemo()
  const an = useAnno()
  const nx = upcoming(s)
  const wd = weddingDate(s.a.when)
  const open = (i: number) => { dispatch({ type: 'set', patch: { view: i, amountText: '', editAmount: false } }); go(i === 2 ? 'STEP-03' : 'STEP-01') }
  return (
    <Card className="px-8 py-7">
      <div className="flex items-center justify-between"><p className="text-[19px] font-bold">전체 일정</p><p className="text-[13px] text-neutral-500">예식일 {ymKo(wd.date)} 기준{wd.estimated ? ' (예상)' : ''}</p></div>
      <div className="mt-6"><Timeline anno={an(R, '04')} /></div>
      {wd.estimated && <p {...an('ROAD-04', '02')} className="mt-5 rounded-[12px] bg-[#f6f6f2] px-4 py-2.5 text-[13px] text-neutral-600">(예상) {ymKo(wd.date)} 예식 기준 일정이에요 · 예식일을 정하면 다시 계산돼요</p>}
      <ol {...an(R, '05')} {...an('ROAD-03', '02')} {...an('ROAD-07', '05')} className="relative mt-6 border-t border-wd-line2 pt-6">
        <span className="absolute bottom-8 left-[15px] top-10 w-px bg-wd-line2" aria-hidden />
        {STAGES.map((st, i) => {
          const x = s.stages[i]
          const past = isPast(s, i)
          const bud = stageBudget(s, i)
          return (
            <li key={st.name} className="relative flex items-start gap-4 py-3.5">
              <span className={`relative z-10 grid size-[31px] shrink-0 place-items-center rounded-full text-[13px] font-bold ${x.done ? 'bg-wd-g text-white' : i === nx ? 'border-2 border-wd-g bg-white text-wd-g ring-4 ring-wd-gl/60' : past ? 'border border-amber-400 bg-amber-50 text-amber-700' : 'border border-wd-line bg-white text-neutral-500'}`}>{x.done ? <Check size={15} strokeWidth={3} /> : i + 1}</span>
              <div className="flex-1">
                <p className={`text-[16px] ${i === nx || x.done ? 'font-bold' : 'font-semibold text-neutral-700'}`}>{st.name}</p>
                <p className="mt-1 text-[13px] text-neutral-500">{dText(i)} · {winText(s, i)}{bud && !x.done ? ` · ${fmtRange(bud)}` : ''}{x.done && x.amount ? ` · 실제 ${x.amount.toLocaleString('ko-KR')}만 원` : ''}</p>
              </div>
              {x.done ? <Dot>완료</Dot> : past ? <button type="button" onClick={() => dispatch({ type: 'set', patch: { pastOpen: true } })}><Tag tone="warn">확인 필요</Tag></button> : i === nx ? <Btn onClick={() => open(i)} className="h-9 px-4 text-[13.5px]">시작하기</Btn> : <button type="button" onClick={() => open(i)} className="px-3 text-[14px] font-bold">보기</button>}
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

export function Roadmap() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const wd = weddingDate(s.a.when)
  const allDone = s.stages.every((x) => x.done)
  const past = STAGES.map((_, i) => i).filter((i) => isPast(s, i))
  return (
    <Page>
      <AppShell crumbs={['홈', '준비 로드맵']} active="roadmap" top={an('ROAD-01', '02')} side={{ steps: an(R, '09'), dday: an('ROAD-04', '03') }}>
        <Head anno={an(R, '01')} eyebrow={`준비 로드맵 · 전체 6단계 · 예식 D-${dday(s)}${wd.estimated ? ' (예상)' : ''}`} title="우리의 웨딩 로드맵" badge={allDone ? <Dot>모든 단계 완료</Dot> : <Dot>진행중</Dot>}
          desc="결혼식을 위한 일정을 확인하고, 차근차근 준비해보세요."
          sub={<CondLine text={roadCondText(s)} onEdit={() => dispatch({ type: 'set', patch: { panel: true } })} />}
          right={<Btn kind="outline" anno={an(R, '02')} onClick={() => dispatch({ type: 'needLogin', reason: 'invite', then: { type: 'set', patch: { inviteOpen: true } } })} className="h-11 px-4 text-[14px]"><UserPlus size={15} />짝꿍 초대</Btn>} />
        <div className="mt-7 space-y-3">
          {!s.loggedIn && (
            <Warn anno={an('ROAD-01', '01')} action={<Btn onClick={() => dispatch({ type: 'needLogin', reason: 'save' })} className="h-10 shrink-0 px-4 text-[13.5px]">로그인하고 계획 저장</Btn>}>
              <span className="flex items-center gap-2"><Info size={16} className="shrink-0" />지금 계획은 이 브라우저에만 임시로 보관돼요. 로그인하면 계획이 저장되고, 내 조건에 맞는 예식장 후보를 볼 수 있어요.</span>
            </Warn>
          )}
          {wd.estimated && (
            <Warn anno={an('ROAD-04', '01')} action={<Btn onClick={() => dispatch({ type: 'set', patch: { dateModal: true } })} className="h-10 shrink-0 px-4 text-[13.5px]"><CalendarDays size={15} />예식일 정하기</Btn>}>
              예식일이 아직 정해지지 않았어요. 지금은 {ymKo(wd.date)} 예식 기준으로 계산한 (예상) 일정이에요.
            </Warn>
          )}
          {past.length > 0 && (
            <Warn anno={an('ROAD-07', '04')} action={<Btn onClick={() => dispatch({ type: 'set', patch: { pastOpen: true } })} className="h-10 shrink-0 px-4 text-[13.5px]">확인하기</Btn>}>
              <b>확인해주세요!</b> 확인이 필요한 단계 {past.length}개가 있어요. 이미 했는지 알려주시면 남은 예산을 맞게 계산해 드려요.
            </Warn>
          )}
        </div>
        <div className="mt-5 grid grid-cols-[1fr_350px] items-start gap-5">
          <div className="space-y-4"><NextCard /><StageList /></div>
          <div className="space-y-4">
            <BudgetCard />
            {!s.a.budget && <BudgetInputCard />}
            <TogetherCard anno={an(R, '07')} />
            <MembersCard anno={{ ...an(R, '08'), ...an('ROAD-01', '03') }} onManage={() => go('MY-01')} />
          </div>
        </div>
      </AppShell>
      {s.panel && <CondPanel />}
    </Page>
  )
}
