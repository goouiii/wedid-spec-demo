import { useEffect, useState } from 'react'
import { ArrowRight, Check, Link2, MessageCircle, Info } from 'lucide-react'
import { FIT_TEXT, fitOf, fmtRange } from '../data/mock'
import { costs, useAnno, useDemo, type ScreenId } from '../demo/state'
import { AppShell, AppTop, Btn, Card, DarkCard, ManInput, Page, budgetError, parseNum } from './ui'
import { BandPicker, BasisBox, BasisToggle, ComboCards, ComboHead, CondLine, CondPanel, condText, venueCountText } from './parts'

export function useGate() {
  const { s, go, dispatch } = useDemo()
  return (reason: 'cand' | 'save' | 'step' | 'todo' | 'invite', to: ScreenId) => (s.loggedIn ? go(to) : dispatch({ type: 'needLogin', reason, goAfter: to }))
}

export function CostLoading() {
  const { readonly, dispatch, go } = useDemo()
  const an = useAnno()
  useEffect(() => {
    if (readonly) return
    const t = setTimeout(() => { dispatch({ type: 'finishQuestions' }); go('COST-02') }, 1400)
    return () => clearTimeout(t)
  }, [readonly, dispatch, go])
  return (
    <Page>
      <AppTop crumbs={['비용 계산', '결과']} />
      <div {...an('COST-01', '01')} className="flex flex-1 flex-col items-center pt-[200px]">
        <span className="size-14 animate-spin rounded-full border-[5px] border-wd-gl border-t-wd-g" aria-hidden />
        <p className="mt-8 text-[24px] font-bold">예상 비용을 계산하고 있어요</p>
        <p className="mt-2 text-[15px] text-neutral-500">잠시만 기다려 주세요</p>
      </div>
    </Page>
  )
}

function TotalCard({ shared }: { shared: boolean }) {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const c = costs(s)
  const [b, setB] = useState('')
  const err = budgetError(parseNum(b))
  const vw = Math.round((c.venue[1] / c.total[1]) * 100)
  const fit = s.a.budget ? fitOf(s.a.budget, c.total) : null
  return (
    <DarkCard anno={{ ...an('COST-02', '06'), ...an('COST-07', '02'), ...an('COST-08', '03') }} className="sticky top-6 px-7 py-7">
      <p className="text-[13px] text-white/70">예상 총비용</p>
      <p className="mt-2 text-[30px] font-bold tracking-tight">{fmtRange(c.total)}</p>
      <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/15"><span className="bg-white" style={{ width: `${vw}%` }} /><span className="bg-[#9dbcaf]" style={{ width: `${100 - vw}%` }} /></div>
      <p className="mt-3 flex gap-4 text-[12px] text-white/70"><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-white" />예식장</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[#9dbcaf]" />스드메</span></p>
      <div className="mt-6 border-t border-white/15 pt-5">
        {s.a.budget ? (
          <>
            <p className="flex justify-between text-[14px]"><span className="text-white/70">내 예산</span><b>{s.a.budget.toLocaleString('ko-KR')}만 원</b></p>
            {fit && <p className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${fit === 'in' ? 'bg-white/15' : 'bg-amber-300/25 text-amber-100'}`}>{fit === 'in' ? <Check size={13} /> : <Info size={13} />}{FIT_TEXT[fit]}</p>}
          </>
        ) : shared ? (
          <p className="text-[13.5px] text-white/70">공유받은 결과에는 예산이 표시되지 않아요.</p>
        ) : (
          <div {...an('COST-03', '01')}>
            <p className="text-[13.5px] text-white/80">예산을 넣으면 예산 안에 들어오는지 알려드려요.</p>
            <div className="mt-3 flex gap-2"><div className="flex-1 [&_input]:!bg-white [&_input]:!h-11 [&_input]:!text-[15px]"><ManInput value={b} onChange={setB} placeholder="3,000" error={b ? err : null} label="예산 (만 원)" /></div><Btn kind="white" disabled={!b || !!err} onClick={() => dispatch({ type: 'setBudget', budget: parseNum(b)! })} className="h-11 px-4 text-[14px]">넣기</Btn></div>
            {b && err && <p className="mt-1.5 text-[12px] text-rose-200">{err}</p>}
          </div>
        )}
      </div>
      {!shared && (
        <>
          <Btn kind="white" onClick={() => go(s.loggedIn ? 'ROAD-02' : 'ROAD-01')} className="mt-6 h-12 w-full text-[15px]">준비 로드맵 보기 <ArrowRight size={15} /></Btn>
          <div {...an('COST-02', '07')} className="mt-2.5 grid grid-cols-2 gap-2">
            <Btn onClick={() => dispatch({ type: 'toast', text: '결과 링크를 복사했어요' })} className="h-11 border border-white/20 !bg-white/10 text-[13.5px] hover:!bg-white/15"><Link2 size={14} />결과 링크 복사</Btn>
            <Btn kind="kakao" onClick={() => dispatch({ type: 'toast', text: '카카오톡 공유 창을 열었어요 (시연)' })} className="h-11 text-[13.5px]"><MessageCircle size={14} />카카오톡 공유</Btn>
          </div>
        </>
      )}
    </DarkCard>
  )
}

function CostBody() {
  const { s, go, dispatch } = useDemo()
  const an = useAnno()
  const gate = useGate()
  const c = costs(s)
  const shared = s.shared
  const undecided = s.a.guests === '아직 모르겠어요'
  return (
    <>
      {shared && (
        <div {...an('COST-07', '01')} className="mb-8 flex items-center justify-between rounded-[16px] border border-wd-line2 bg-white px-6 py-4">
          <p className="text-[14.5px]"><b>공유받은 예상 비용이에요</b><span className="text-neutral-500"> · 11월 15일 기준</span></p>
          <Btn onClick={() => go('Q-01')} className="h-10 px-4 text-[14px]">나도 계산해 보기</Btn>
        </div>
      )}
      <div {...an('COST-02', '01')}>
        <p className="text-[13px] font-bold text-wd-g">비용 계산 결과</p>
        <h1 className="mt-1.5 text-[38px] font-bold tracking-tight">우리 결혼 예상 비용</h1>
        <p className="mt-2 text-[16px] text-neutral-600">답해 주신 조건으로 예식장과 스드메 비용을 범위로 계산했어요.</p>
        <CondLine anno={{ ...an('COST-04', '01'), ...an('COST-08', '02') }} text={condText(s)} onEdit={shared ? undefined : () => dispatch({ type: 'set', patch: { panel: true } })} />
      </div>
      <div className="mt-9 grid grid-cols-[1fr_350px] items-start gap-5">
        <div className="space-y-4">
          <Card anno={{ ...an('COST-02', '02'), ...an('COST-04', '02') }} className="flex items-center justify-between px-8 py-7">
            <div><p className="text-[19px] font-bold">예식장</p><p className="mt-2 text-[13.5px] text-neutral-500">{venueCountText(s.a.region ?? '서울 강남권 외')}{undecided ? ' · 하객 수 미정 · 150~200명 기준' : ''}</p></div>
            <p className="text-[32px] font-bold tracking-tight">{fmtRange(c.venue)}</p>
          </Card>
          <Card className="px-8 py-7">
            <div className="flex items-start justify-between">
              <div><p className="text-[19px] font-bold">스드메</p><p className="mt-2 text-[13.5px] text-neutral-500">예산대를 바꾸면 예상 비용이 바로 바뀌어요 · 기본값: 이 지역 중간 수준 구간</p></div>
              <p className="text-[32px] font-bold tracking-tight">{fmtRange(c.sdm)}</p>
            </div>
            <div className="mt-6"><BandPicker anno={an('COST-02', '03')} disabled={shared} /></div>
            <BasisToggle anno={{ ...an('COST-02', '04'), ...an('COST-05', '02') }} />
            <BasisBox anno={an('COST-05', '01')} />
            <ComboHead anno={an('COST-02', '05')} right={shared ? undefined : <button type="button" onClick={() => gate('cand', 'SDM-01')} className="text-[14px] font-semibold text-wd-g">스드메 후보 보기 ›</button>} />
            <ComboCards band={s.band} />
          </Card>
          <div {...an('COST-02', '08')} className="px-6 pt-6">
            <p className="text-[17px] font-bold">별도로 생길 수 있는 비용</p>
            <p className="mt-1.5 text-[14px] text-neutral-500">원본 사진, 드레스 업그레이드, 헬퍼비 등 (합계 미포함)</p>
            <p className="mt-8 text-[12px] text-neutral-500">출처: 업체 공개 가격 (참가격 · 업체 홈페이지, 2026.11 기준) · 실제 견적은 날짜, 옵션, 업체에 따라 달라질 수 있어요.</p>
          </div>
        </div>
        <TotalCard shared={shared} />
      </div>
      {!shared && !s.loggedIn && (
        <Card anno={an('COST-02', '09')} className="mt-8 flex items-center justify-between px-7 py-5">
          <div><p className="text-[16px] font-bold">다음 단계</p><p className="mt-1 text-[14px] text-neutral-500">이 비용을 기준으로 D-day별 준비 로드맵을 만들어 드려요.</p></div>
          <div className="flex gap-2"><Btn kind="outline" onClick={() => go('Q-04')} className="h-12 px-6 text-[15px]">이전</Btn><Btn onClick={() => go('ROAD-01')} className="h-12 px-6 text-[15px]">준비 로드맵 보기 <ArrowRight size={15} /></Btn></div>
        </Card>
      )}
      {s.panel && <CondPanel anno={{ fields: an('COST-06', '01'), mood: an('COST-06', '02'), submit: an('COST-06', '03') }} />}
    </>
  )
}

export function CostResult() {
  const { s } = useDemo()
  const an = useAnno()
  if (s.loggedIn) {
    return (
      <Page>
        <AppShell crumbs={['준비 로드맵', '예상 비용']} active="cost" side={{ nav: an('COST-08', '01') }}>
          <div className="max-w-[1040px]"><CostBody /></div>
        </AppShell>
      </Page>
    )
  }
  return (
    <Page>
      <AppTop crumbs={['비용 계산', '결과']} anno={an('COST-02', '10')} />
      <main className="mx-auto w-[1166px] pb-16 pt-11"><CostBody /></main>
    </Page>
  )
}
