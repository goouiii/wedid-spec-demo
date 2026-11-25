import { ArrowRight, MapPin, Shirt } from 'lucide-react'
import { STAGES, bandOf, fmtRange, venueById } from '../data/mock'
import { remainingNeed, spent, stageBudget, useAnno, useDemo, type ScreenId } from '../demo/state'
import { AppShell, Back, Btn, BudgetBox, Card, Dot, Head, ManInput, Page, Warn, parseNum } from './ui'
import { BandPicker, BasisBox, BasisToggle, CheckList, ComboCards, ComboHead, ExtraCosts, StageAside, dText, winText } from './parts'
import { useGate } from './cost'

const S1: ScreenId[] = ['STEP-01']
const S3: ScreenId[] = ['STEP-03']

function RemainCard() {
  const { s } = useDemo()
  const an = useAnno()
  const b = s.a.budget
  if (!b) return null
  const left = b - spent(s)
  const need = remainingNeed(s)
  const parts = STAGES.map((st, k) => (s.stages[k].done && s.stages[k].amount ? `${st.short.replace(' 계약', '')} 실제 ${s.stages[k].amount!.toLocaleString('ko-KR')}만 원` : null)).filter(Boolean)
  return (
    <Card anno={{ ...an('STEP-02', '02'), ...an('STEP-04', '02') }} className="flex items-center justify-between px-7 py-5">
      <div>
        <p className="text-[13px] text-neutral-500">남은 예산</p>
        <p className="mt-1 text-[28px] font-bold text-wd-g">{left.toLocaleString('ko-KR')}만 원</p>
        <p className="mt-1 text-[12.5px] text-neutral-500">{b.toLocaleString('ko-KR')}만 원 − {parts.join(' − ')}</p>
      </div>
      <div className="text-right">
        {need ? (
          <><p className={`text-[14px] font-bold ${left >= need[1] ? 'text-wd-g' : 'text-amber-700'}`}>{left >= need[1] ? '남은 예산으로 충분해요' : left >= need[0] ? '남은 예산이 빠듯해요' : '남은 예산을 넘을 수 있어요'}</p><p className="mt-1 text-[12.5px] text-neutral-500">남은 단계 예상 비용 {fmtRange(need)}</p></>
        ) : (
          <p className="text-[14px] font-bold text-wd-g">예식장 · 스드메 계약을 모두 마쳤어요</p>
        )}
      </div>
    </Card>
  )
}

function AmountBlock({ i }: { i: number }) {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  const x = s.stages[i]
  const bud = stageBudget(s, i)
  const money = !!STAGES[i].money
  const complete = () => {
    const n = parseNum(s.amountText)
    dispatch({ type: 'needLogin', reason: 'step', then: { type: 'complete', stage: i, amount: money ? n : null } })
  }
  if (x.done) {
    return (
      <div className="mt-6 border-t border-wd-line2 pt-6">
        <div {...an('STEP-02', '01')} {...an('STEP-04', '03')} className="flex items-center justify-between rounded-[14px] bg-wd-gl/60 px-5 py-3.5 text-[14px]">
          <span className="font-semibold text-wd-g">이 단계를 완료했어요{x.amount ? ` · 실제 ${x.amount.toLocaleString('ko-KR')}만 원` : ''}</span>
          <button type="button" onClick={() => dispatch({ type: 'set', patch: { cancelOpen: true } })} className="text-[13.5px] font-bold text-neutral-600 underline underline-offset-4">완료 취소</button>
        </div>
        {money && (
          <div {...an('STEP-02', '03')} className="mt-5">
            <p className="text-[14px] font-bold">실제 계약 금액</p>
            {s.editAmount ? (
              <div className="mt-3 flex gap-2"><div className="flex-1"><ManInput big value={s.amountText} onChange={(v) => dispatch({ type: 'set', patch: { amountText: v } })} /></div><Btn disabled={!s.amountText} onClick={() => dispatch({ type: 'complete', stage: i, amount: parseNum(s.amountText) })} className="h-[58px] w-[180px] text-[15px]">저장</Btn></div>
            ) : (
              <div className="mt-3 flex gap-2"><div className="flex h-[58px] flex-1 items-center justify-between rounded-[12px] bg-[#f3f3f0] px-5 text-[20px] font-bold">{x.amount?.toLocaleString('ko-KR') ?? '—'}<span className="text-[15px] font-normal text-neutral-500">만 원</span></div><Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { editAmount: true, amountText: x.amount?.toLocaleString('ko-KR') ?? '' } })} className="h-[58px] w-[180px] text-[15px]">금액 수정</Btn></div>
            )}
            <p className="mt-2 text-[12.5px] text-neutral-500">금액을 고치면 남은 예산을 바로 다시 계산해요.</p>
          </div>
        )}
      </div>
    )
  }
  return (
    <div {...an(S1, '07')} {...an(S3, '06')} className="mt-6 border-t border-wd-line2 pt-6">
      {money && <p className="text-[14px] font-bold">실제 계약 금액</p>}
      <div className="mt-3 flex gap-2">
        {money && <div className="flex-1"><ManInput big value={s.amountText} placeholder={bud ? bud[0].toLocaleString('ko-KR') : '금액 입력'} onChange={(v) => dispatch({ type: 'set', patch: { amountText: v } })} /></div>}
        <Btn onClick={complete} className={`h-[58px] text-[15.5px] ${money ? 'w-[200px]' : 'w-full'}`}>단계 완료하기</Btn>
      </div>
      {money && bud && <p className="mt-2 text-[12.5px] text-neutral-500">예상 범위 {fmtRange(bud)} · 실제 금액을 넣으면 남은 예산을 다시 계산해요.</p>}
    </div>
  )
}

export function StepPage() {
  const { s, go, dispatch } = useDemo()
  const an = useAnno()
  const gate = useGate()
  const i = Math.min(5, Math.max(0, s.view))
  const st = STAGES[i]
  const x = s.stages[i]
  const bud = stageBudget(s, i)
  const isVenue = st.money === 'venue'
  const isSdm = st.money === 'sdm'
  const chosen = s.chosen ? venueById(s.chosen) : null
  const open = (k: number) => { dispatch({ type: 'set', patch: { view: k, amountText: '', editAmount: false } }); go(k === 2 ? 'STEP-03' : 'STEP-01') }
  return (
    <Page>
      <AppShell crumbs={['준비 로드맵', st.name]} active={i}>
        <Back onClick={() => go(s.loggedIn ? 'ROAD-02' : 'ROAD-01')}>준비 로드맵으로</Back>
        <div className="mt-5">
          <Head anno={an(S1, '01')} eyebrow={`${i + 1}단계 · ${dText(i)}`} title={st.name} badge={x.done ? <Dot>완료</Dot> : <Dot>진행중</Dot>}
            desc={x.done ? '이 단계를 완료했어요. 실제 금액을 고치면 남은 예산이 다시 계산돼요.' : '이번 단계에 할 일을 마치고 실제 계약 금액을 넣으면 단계를 완료할 수 있어요.'}
            right={(isVenue || isSdm) && (
              <div className="flex items-end gap-3">
                <Btn anno={an(S1, '02')} onClick={() => gate('cand', isVenue ? 'VENUE-01' : 'SDM-01')} className="h-12 px-5 text-[15px]">{isVenue ? <MapPin size={16} /> : <Shirt size={16} />}{isVenue ? '예식장' : '스드메'} 후보 보기</Btn>
                {x.done && x.amount ? <BudgetBox anno={an('STEP-02', '05')} label="실제 계약 금액" value={`${x.amount.toLocaleString('ko-KR')}만 원`} sub={bud ? `예상 ${fmtRange(bud)}` : undefined} />
                  : <BudgetBox anno={{ ...an(S1, '03'), ...an(S3, '07') }} value={bud ? fmtRange(bud) : '—'} sub={isSdm ? `${bandOf(s.band).name} 예산대 · 스·드·메 단품가 합산` : undefined} />}
              </div>
            )} />
        </div>
        <div className="mt-8 grid grid-cols-[1fr_300px] items-start gap-5">
          <div className="space-y-4">
            {isVenue && !x.done && (chosen ? (
              <Warn className="!border-wd-g/30 !bg-wd-gl/50 !text-wd-g" action={<Btn kind="outline" onClick={() => go('VENDOR-01')} className="h-9 px-3 text-[13px]">업체 보기</Btn>}><b>계약할 예식장: {chosen.name}</b> · 실제 계약 금액을 넣고 단계를 완료하세요.</Warn>
            ) : (
              <Warn anno={an(S1, '04')} action={<Btn kind="outline" onClick={() => gate('cand', 'VENUE-01')} className="h-9 shrink-0 px-3 text-[13px]">예식장 찾기</Btn>}><span className="flex items-center gap-2"><MapPin size={16} className="shrink-0" /><span><b>계약할 예식장을 아직 정하지 않았어요.</b> 후보를 비교하고 한 곳을 골라 보세요.</span></span></Warn>
            ))}
            {x.done && st.money && <RemainCard />}
            {isSdm && (
              <Card className="px-7 py-7">
                <div className="flex items-start justify-between"><div><p className="text-[19px] font-bold">스드메 예산</p><p className="mt-1.5 max-w-[360px] text-[13px] text-neutral-500">예산대를 바꾸면 이번 단계 예산과 예상 비용이 같이 바뀌어요 · 기본값: 이 지역 중간 수준 구간</p></div><p className="text-[30px] font-bold">{bud && fmtRange(bud)}</p></div>
                <div className="mt-6"><BandPicker anno={an(S3, '01')} disabled={x.done} compact /></div>
                {x.done && <p {...an('STEP-04', '01')} className="mt-3 rounded-[10px] bg-[#f6f6f2] px-4 py-2.5 text-[12.5px] text-neutral-600">완료한 단계라 예산대를 바꿀 수 없어요 · 완료를 취소하면 바꿀 수 있어요</p>}
                <BasisToggle anno={an(S3, '02')} />
                <BasisBox />
                <ComboHead anno={an(S3, '03')} right={<button type="button" onClick={() => gate('cand', 'SDM-01')} className="text-[13.5px] font-semibold text-wd-g">스드메 후보 자세히 보기 ›</button>} />
                <ComboCards band={s.band} />
                <ExtraCosts anno={an(S3, '04')} />
              </Card>
            )}
            <Card className="px-7 py-7">
              <p className="text-[19px] font-bold">진행 리스트</p>
              <p className="mt-1 text-[13px] text-neutral-500">{dText(i)} · {winText(s, i)}</p>
              <div className="mt-6"><CheckList i={i} anno={{ list: { ...an(S1, '05'), ...an(S3, '05') }, add: an(S1, '06') }} /></div>
              <AmountBlock i={i} />
              {x.done && i < 5 && (
                <button type="button" {...an('STEP-02', '04')} {...an('STEP-04', '04')} onClick={() => open(i + 1)} className="mt-6 flex w-full items-center justify-between rounded-[14px] bg-[#f6f6f2] px-5 py-4 text-[14.5px] font-bold">다음: {STAGES[i + 1].name}<ArrowRight size={16} /></button>
              )}
            </Card>
          </div>
          <StageAside i={i} anno={{ decide: an(S1, '08'), tips: an(S1, '09'), nav: an(S1, '10') }} />
        </div>
      </AppShell>
    </Page>
  )
}
