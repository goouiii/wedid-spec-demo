import { AlertTriangle, ArrowRight, Calculator, Check, ChevronRight, Copy, Heart, MapPin, Users } from 'lucide-react'
import { STAGES, VENUES, ymKo } from '../data/mock'
import { costs, daysToStage, dday, lateStages, progress, remaining, stageAmount, useAnno, useDemo, weddingDate, type ScreenId } from '../demo/state'
import { Avatar, Btn, Card, CoupleArt, DarkCard, Page, Photo, PublicFooter, PublicNav, Tag } from './ui'
import { upcoming, winText } from './parts'

const FEAT = [
  { Icon: Calculator, t: '비용 계산', d: '질문 5개로 우리 결혼 예상 비용 확인' },
  { Icon: MapPin, t: '준비 로드맵', d: '언제 무엇을, 얼마에 정할지 한눈에' },
  { Icon: Users, t: '함께 준비', d: '할 일을 나누고 같은 계획을 함께 관리' },
]
const PICKS = ['v3', 'v2', 'v6', 'v4']

function VenueMini({ id }: { id: string }) {
  const v = VENUES.find((x) => x.id === id)!
  return (
    <div className="overflow-hidden rounded-[16px] border border-wd-line2 bg-white">
      <Photo mood={v.mood} label={v.mood} className="h-[160px]"><Heart size={15} className="absolute right-3 top-3 text-white drop-shadow" /></Photo>
      <div className="px-4 py-4">
        <p className="text-[12px] text-neutral-500">서울 {v.gu}</p>
        <p className="mt-1 text-[15.5px] font-bold">{v.name}</p>
        <div className="mt-2 flex gap-1.5"><Tag tone="gray"><Check size={11} />{v.food}</Tag><Tag tone="gray"><Check size={11} />주차 {v.parking ? '가능' : '불가'}</Tag></div>
        <p className="mt-3 border-t border-wd-line2 pt-3 text-[12px] text-neutral-500">{v.note}</p>
      </div>
    </div>
  )
}

export function MainPublic() {
  const { s, go } = useDemo()
  const an = useAnno()
  const id: ScreenId = 'MAIN-01'
  return (
    <Page bg="bg-[#f6f5f1]">
      <PublicNav anno={an(id, '01')} />
      <section className="relative grid h-[560px] grid-cols-[1fr_620px] overflow-hidden bg-gradient-to-r from-[#f3efe8] to-[#efeae0]">
        <div className="px-[60px] pt-[110px]">
          <h1 className="text-[64px] font-bold leading-[1.15] tracking-tight">우리 결혼,<br />얼마나 들까?</h1>
          <p className="mt-6 text-[18px] leading-8 text-neutral-700">질문 5개로 우리 결혼의 예상 비용을 계산하고,<br />짝꿍과 함께 준비 로드맵을 관리하세요.</p>
          <div className="mt-10 flex items-center gap-6">
            <Btn anno={an(id, '02')} onClick={() => go('Q-01')} className="h-14 px-7 text-[16px] shadow-lg shadow-wd-g/30">우리 결혼 비용 계산하기 <ArrowRight size={17} /></Btn>
            <button type="button" {...an(id, '03')} onClick={() => go(s.plan ? 'ROAD-01' : 'MAIN-02')} className="flex items-center gap-1 text-[14px] font-semibold text-neutral-700">이미 계획이 있다면 내 로드맵 보기 <ChevronRight size={15} /></button>
          </div>
        </div>
        <div className="relative grid place-items-center bg-gradient-to-br from-[#dfe8df] via-[#eef1ea] to-[#f3efe8]"><CoupleArt size={300} /><span className="absolute bottom-4 right-5 text-[11px] text-neutral-500">일러스트 (실사 사진 대체)</span></div>
      </section>
      <section {...an(id, '04')} className="mx-[60px] -mt-0 grid grid-cols-3 gap-6 pt-10">
        {FEAT.map(({ Icon, t, d }) => (
          <Card key={t} className="px-8 py-8"><span className="grid size-11 place-items-center rounded-[12px] bg-wd-gl text-wd-g"><Icon size={20} /></span><p className="mt-5 text-[19px] font-bold">{t}</p><p className="mt-2 text-[14px] text-neutral-500">{d}</p></Card>
        ))}
      </section>
      <section {...an(id, '05')} className="px-[60px] pt-24">
        <div className="flex items-end justify-between">
          <div><h2 className="text-[26px] font-bold">분위기로 골라보는 예식장</h2><p className="mt-2 text-[14.5px] text-neutral-500">화사한 · 웅장한 · 럭셔리 · 그리너리 · 클래식 중 우리에게 맞는 곳을 찾아보세요</p></div>
          <button type="button" onClick={() => go('VENUE-04')} className="text-[14px] font-semibold">전체 보기 ›</button>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-5">{PICKS.map((p) => <VenueMini key={p} id={p} />)}</div>
      </section>
      <section className="mt-24 grid grid-cols-2 items-center gap-10 bg-white px-[60px] py-24">
        <div>
          <p className="text-[12.5px] font-bold tracking-wide text-wd-g">WEDDING PLAN</p>
          <h2 className="mt-3 text-[44px] font-bold leading-[1.2]">우리 결혼,<br />얼마나 들까?</h2>
          <p className="mt-5 text-[16px] leading-7 text-neutral-600">지역과 하객 수만 알려주세요. 예상 비용을 계산하고, 짝꿍과 함께 볼 준비 로드맵까지 한 번에 만들어 드려요.</p>
          <div className="mt-7 flex gap-3"><Btn onClick={() => go('Q-01')} className="h-12 rounded-full px-6 text-[15px]">결혼 비용 계산하기 <ArrowRight size={15} /></Btn><Btn kind="outline" onClick={() => go('MAIN-02')} className="h-12 rounded-full px-6 text-[15px]">웨딩 플랜 알아보기</Btn></div>
        </div>
        <DarkCard anno={an(id, '06')} className="px-10 py-10">
          <Tag tone="gray" className="!bg-white/15 !text-white">예상 총 비용</Tag>
          <p className="mt-4 text-[34px] font-bold">1,800만 ~ 2,250만원</p>
          <p className="mt-1 text-[13px] text-white/70">서울 강남권 외 · 하객 150~200명 · 스탠다드</p>
          <div className="mt-8 grid grid-cols-6 gap-1.5">{STAGES.map((_, i) => <span key={i} className={`h-1 rounded-full ${i < 2 ? 'bg-white' : 'bg-white/25'}`} />)}</div>
          <p className="mt-4 text-[13px] text-white/80">다음 할 일 · 예식장 계약</p>
        </DarkCard>
      </section>
      <PublicFooter anno={an(id, '07')} />
    </Page>
  )
}

export function MainIntro() {
  const { go } = useDemo()
  const an = useAnno()
  const id: ScreenId = 'MAIN-02'
  const sec = 'px-[120px] py-24'
  return (
    <Page bg="bg-white">
      <PublicNav />
      <section {...an(id, '01')} className="bg-gradient-to-b from-[#f3f1ea] to-white px-[120px] pb-16 pt-20 text-center">
        <Tag className="!px-3 !py-1">무료 · 질문 5개로 1분 만에 끝나요</Tag>
        <h1 className="mt-6 text-[72px] font-bold leading-[1.12] tracking-tight">우리 결혼,<br />얼마나 들까?</h1>
        <p className="mx-auto mt-6 max-w-[620px] text-[18px] leading-8 text-neutral-600">지역과 하객 수만 알려주세요. 예상 비용을 계산하고, 짝꿍과 함께 볼 준비 로드맵까지 한 번에 만들어 드려요.</p>
        <div className="mt-9 flex justify-center gap-3"><Btn onClick={() => go('Q-01')} className="h-14 px-8 text-[16px]">결혼 비용 계산하기 <ArrowRight size={16} /></Btn><Btn kind="outline" onClick={() => go('ROAD-01')} className="h-14 px-8 text-[16px]">로드맵 미리보기</Btn></div>
        <p {...an(id, '02')} className="mt-6 flex justify-center gap-6 text-[13.5px] text-neutral-500">{['회원가입 없이 계산', '결과는 링크로 공유', '참가격 통계 기반'].map((t) => <span key={t} className="flex items-center gap-1"><Check size={14} className="text-wd-g" />{t}</span>)}</p>
        <div {...an(id, '03')} className="mx-auto mt-14 grid max-w-[1000px] grid-cols-[180px_1fr_260px] gap-4 rounded-[24px] border border-wd-line2 bg-[#f6f6f2] p-4 text-left shadow-xl shadow-black/5">
          <div className="space-y-1 rounded-[16px] bg-white p-3 text-[13px]">{['홈', '준비 로드맵', '예상 비용', '예식장 찾기'].map((t, i) => <p key={t} className={`rounded-[8px] px-2 py-1.5 ${i === 1 ? 'bg-[#f1f1ee] font-bold' : ''}`}>{t}</p>)}</div>
          <div className="rounded-[16px] bg-white p-5"><p className="text-[12px] text-neutral-500">예상 총 비용 · 서울 강남권 외 · 200명</p><p className="mt-1 text-[26px] font-bold">1,800만 ~ 2,250만원</p><div className="mt-4 grid grid-cols-2 gap-3 text-[13px]"><div className="rounded-[12px] bg-[#f6f6f2] p-3">예식장<p className="font-bold">1,550만~</p></div><div className="rounded-[12px] bg-[#f6f6f2] p-3">스드메<p className="font-bold">250만~</p></div></div><p className="mt-4 text-[12px] text-neutral-500">전체 진행률 45%</p><div className="mt-1 h-1.5 rounded-full bg-[#ebebe6]"><div className="h-full w-[45%] rounded-full bg-wd-g" /></div></div>
          <div className="rounded-[16px] bg-white p-5 text-[13px]"><p className="font-bold">이번 주 할 일</p>{[['투어 예약 3곳', '나'], ['예산 상한 합의', '함께'], ['부모님께 공유', '짝꿍']].map(([t, o]) => <p key={t} className="mt-3 flex justify-between">{t}<Tag tone={o === '나' ? 'dark' : 'g'}>{o}</Tag></p>)}<p className="mt-5 font-bold">함께하는 멤버</p><div className="mt-2 flex -space-x-2"><Avatar t="준" size={28} /><Avatar t="민" tone="p" size={28} /></div></div>
        </div>
      </section>
      <section {...an(id, '04')} className="border-y border-wd-line2 bg-[#fafaf7] px-[120px] py-10 text-center"><p className="text-[13px] font-semibold text-neutral-500">비용 데이터 출처</p><p className="mt-3 flex justify-center gap-10 text-[15px] font-bold text-neutral-700"><span>한국소비자원 참가격</span><span>결혼서비스 14개 권역 통계</span><span>업체 공개 단품가</span></p></section>
      <section {...an(id, '05')} className={sec}>
        <p className="text-center text-[13px] font-bold text-wd-g">사용 방법</p>
        <h2 className="mt-3 text-center text-[36px] font-bold">복잡한 결혼 준비, 세 단계면 정리돼요</h2>
        <div className="mt-12 grid grid-cols-3 gap-6">{[
          ['01', '조건 입력', '질문 5개로 지역, 하객 수, 시기, 예산, 분위기를 고르면 돼요. 모르는 건 건너뛰어도 괜찮아요.'],
          ['02', '예상 비용 확인', '참가격 통계를 기반으로 예식장과 스드메 비용을 범위로 보여드려요.'],
          ['03', '로드맵 따라 준비', 'D-day에 맞춰 할 일과 예산이 단계별로 정리돼요. 짝꿍과 나눠서 체크하세요.'],
        ].map(([n, t, d]) => <Card key={n} className="px-8 py-9"><p className="font-serif text-[34px] font-semibold text-wd-g">{n}</p><p className="mt-4 text-[20px] font-bold">{t}</p><p className="mt-3 text-[14.5px] leading-7 text-neutral-600">{d}</p></Card>)}</div>
      </section>
      <section {...an(id, '06')} className={`${sec} grid grid-cols-2 items-center gap-16 bg-[#f6f6f2]`}>
        <div><p className="text-[13px] font-bold text-wd-g">예상 비용</p><h2 className="mt-3 text-[34px] font-bold">숫자 하나로 감 잡는 우리 결혼 비용</h2><p className="mt-4 text-[15.5px] leading-7 text-neutral-600">예식장은 대관료와 식대로, 스드메는 예산대별로 나눠 계산해요. 예산대를 바꾸면 결과가 바로 바뀌어요.</p><ul className="mt-6 space-y-2 text-[14.5px]">{['지역·하객 수 기준 예상 범위', '베이직부터 럭셔리까지 스드메 예산대 비교', '산출 근거와 출처를 그대로 공개'].map((t) => <li key={t} className="flex gap-2"><Check size={17} className="text-wd-g" />{t}</li>)}</ul></div>
        <Card className="px-8 py-8"><p className="text-[13px] text-neutral-500">예상 총 비용</p><p className="mt-1 text-[32px] font-bold">1,800만 ~ 2,250만원</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="relative rounded-[14px] border border-wd-line2 p-4"><p className="font-bold">베이직</p><p className="text-[12.5px] text-neutral-500">250만원 이하</p></div><div className="relative rounded-[14px] border border-wd-g bg-[#f3f7f4] p-4"><span className="absolute -top-2.5 left-4 rounded-full bg-wd-g px-2 text-[10.5px] font-bold text-white">추천</span><p className="font-bold">스탠다드</p><p className="text-[12.5px] font-semibold text-wd-g">250 ~ 350만원</p></div></div><p className="mt-5 flex justify-between rounded-[12px] bg-wd-gl px-4 py-3 text-[14px] font-bold text-wd-g"><span>예산 대비</span><span>750만원 여유</span></p></Card>
      </section>
      <section {...an(id, '07')} className={`${sec} grid grid-cols-2 items-center gap-16`}>
        <Card className="px-8 py-7">{[['예산 일정 합의, 상견례', 'D-365~300 · 완료', '완료'], ['예식장 계약', 'D-300~240 · 1,550만 ~ 1,900만원', '진행중'], ['스드메 계약', 'D-240~180', '예정']].map(([t, d, st], i) => <div key={t} className="flex items-center gap-4 border-b border-wd-line2 py-4 last:border-0"><span className={`grid size-8 place-items-center rounded-full text-[13px] font-bold ${i === 0 ? 'bg-wd-g text-white' : 'border border-wd-line'}`}>{i === 0 ? <Check size={15} /> : i + 1}</span><div className="flex-1"><p className="font-bold">{t}</p><p className="text-[12.5px] text-neutral-500">{d}</p></div><Tag tone={i === 1 ? 'dark' : 'gray'}>{st}</Tag></div>)}</Card>
        <div><p className="text-[13px] font-bold text-wd-g">준비 로드맵</p><h2 className="mt-3 text-[34px] font-bold">언제 무엇을, 얼마에 정할지 한눈에</h2><p className="mt-4 text-[15.5px] leading-7 text-neutral-600">예식일을 기준으로 6단계 로드맵을 만들어요. 지금 해야 할 일과 이번 단계에 쓸 수 있는 예산을 함께 보여드려요.</p><ul className="mt-6 space-y-2 text-[14.5px]">{['D-day에 맞춘 단계별 체크리스트', '단계 완료 시 남은 예산 자동 재계산'].map((t) => <li key={t} className="flex gap-2"><Check size={17} className="text-wd-g" />{t}</li>)}</ul></div>
      </section>
      <section {...an(id, '08')} className={`${sec} grid grid-cols-2 items-center gap-16 bg-[#f6f6f2]`}>
        <div><p className="text-[13px] font-bold text-wd-g">함께 준비</p><h2 className="mt-3 text-[34px] font-bold">할 일은 나누고, 계획은 하나로</h2><p className="mt-4 text-[15.5px] leading-7 text-neutral-600">링크 하나로 짝꿍을 초대하면 같은 계획을 함께 보고 체크할 수 있어요. 누가 맡았는지도 한눈에 보여요.</p><Btn kind="outline" onClick={() => go('ROAD-01')} className="mt-7 h-12 px-6 text-[15px]">로드맵 둘러보기</Btn></div>
        <Card className="relative px-8 py-7"><span className="absolute -top-4 right-6 rounded-full bg-wd-ink px-4 py-2 text-[12.5px] font-semibold text-white">짝꿍이 체크했어요 · 투어 예약 완료</span><p className="font-bold">이번 주 할 일</p>{[['후보 예식장 3곳 투어 예약', '나'], ['예산 상한 합의하기', '함께'], ['부모님께 후보 공유', '짝꿍']].map(([t, o]) => <p key={t} className="mt-4 flex justify-between text-[14.5px]">{t}<Tag tone={o === '나' ? 'dark' : 'g'}>{o}</Tag></p>)}</Card>
      </section>
      <section {...an(id, '09')} className="mx-[120px] my-24 rounded-[28px] bg-[radial-gradient(120%_140%_at_80%_0%,#4c6f61_0%,#2c4b40_45%,#22392f_100%)] px-16 py-16 text-center text-white">
        <h2 className="text-[38px] font-bold">지금 우리 결혼 비용부터 알아볼까요?</h2>
        <p className="mt-3 text-[16px] text-white/75">로그인 없이 1분이면 결과를 볼 수 있어요.</p>
        <Btn kind="white" onClick={() => go('Q-01')} className="mt-8 h-14 px-8 text-[16px]">무료로 계산하기 <ArrowRight size={16} /></Btn>
      </section>
      <PublicFooter />
    </Page>
  )
}

const CAL = Array.from({ length: 35 }, (_, i) => i) // 2026-11-01은 일요일

/** 요약 카드 3번째: 짝꿍 초대 전 → 초대함 → 합류 */
function PartnerCard() {
  const { s, dispatch } = useDemo()
  const copy = () => dispatch({ type: 'set', patch: { partner: 'invited', toast: '초대 링크를 복사했어요 · 7일 동안 유효해요' } })
  return (
    <Card className="px-7 py-6">
      <p className="text-[13px] text-neutral-500">짝꿍</p>
      {s.partner === 'joined' ? <p className="mt-2 text-[20px] font-bold">민지 님이 합류했어요</p> : (
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[18px] font-bold leading-snug">{s.partner === 'invited' ? <>초대함<span className="block text-[13px] font-medium text-neutral-500">합류를 기다리고 있어요</span></> : '아직 초대 전이에요'}</p>
          <Btn kind={s.partner === 'invited' ? 'outline' : 'soft'} onClick={copy} className="h-9 shrink-0 px-3 text-[13px]"><Copy size={13} />{s.partner === 'invited' ? '링크 다시 복사' : '초대 링크 복사'}</Btn>
        </div>
      )}
    </Card>
  )
}

export function MainMember() {
  const { s, go, dispatch } = useDemo()
  const an = useAnno()
  if (!s.plan) return <MainPublic />
  const id: ScreenId[] = ['MAIN-03']
  const c = costs(s)
  const nx = upcoming(s)
  const allDone = nx === -1
  const est = weddingDate(s.a.when).estimated
  const ex = est ? ' (예상)' : ''
  const budget = s.a.budget
  const vAmt = stageAmount(s, 1)
  const sAmt = stageAmount(s, 2)
  const base = budget ?? vAmt + sAmt
  const rest = budget ? Math.max(0, budget - vAmt - sAmt) : 0
  // 디자인 기준(57 · 10 · 33): 예식장 · 스드메는 내림, 마지막 칸이 나머지를 가져가 합이 100이 되게 한다
  const floorPct = (v: number) => (base ? Math.min(100, Math.floor((v / base) * 100 + 1e-9)) : 0)
  const vPct = floorPct(vAmt)
  const sPct = budget ? Math.min(100 - vPct, floorPct(sAmt)) : 100 - vPct
  const rPct = budget ? 100 - vPct - sPct : 0
  const pctOf: Record<string, number> = { v: vPct, s: sPct, r: rPct }
  const won = (man: number) => `${(man * 10000).toLocaleString('ko-KR')}원`
  const late = lateStages(s)
  const toBudget = () => go('ROAD-02')
  const until = allDone ? 0 : daysToStage(s, nx)
  const todos = allDone ? [] : s.todos[nx]
  const vDone = s.stages[1].done && s.stages[1].amount
  const sDone = s.stages[2].done && s.stages[2].amount
  return (
    <Page bg="bg-[#f6f5f1]">
      <PublicNav />
      <section className="grid grid-cols-[1fr_440px] gap-10 px-[60px] pt-14">
        <div {...an(id, '01')}>
          <p className="text-[15px] font-semibold text-wd-g">안녕하세요, 준근님</p>
          <h1 className="mt-3 text-[46px] font-bold leading-tight">우리만의 웨딩을<br />차근차근 완성해요</h1>
          <div {...an(id, '02')} className="mt-10 flex gap-3">
            <Btn onClick={() => go('ROAD-02')} className="h-14 px-7 text-[16px]">내 로드맵 이어서 보기 <ArrowRight size={16} /></Btn>
            <Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { newPlanOpen: true, newPlanMode: 'new' } })} className="h-14 px-7 text-[16px]">새 계획 시작하기</Btn>
          </div>
        </div>
        <DarkCard className="px-8 py-8">
          <div className="flex justify-between text-[13px] text-white/75"><span>전체 준비 진행률</span><span>예식 D-{dday(s)}{est && ' 예상'}</span></div>
          <p className="mt-3 text-[56px] font-bold leading-none">{progress(s)}<span className="text-[26px]">%</span></p>
          <p className="mt-4 text-[13.5px] text-white/80">지금까지의 준비가 더 특별한 날을 만들어줄 거예요.</p>
          <div className="mt-5 h-1.5 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${progress(s)}%` }} /></div>
          <p className="mt-2 text-right text-[12.5px] text-white/75">{s.stages.filter((x) => x.done).length} / 6 단계</p>
        </DarkCard>
      </section>
      <section {...an(id, '03')} className="grid grid-cols-3 gap-5 px-[60px] pt-12">
        <Card className="px-7 py-6">
          <p className="text-[13px] text-neutral-500">남은 예산</p>
          {budget ? <p className="mt-2 text-[26px] font-bold">{remaining(s)!.toLocaleString('ko-KR')}만 원</p> : <div className="mt-2 flex items-center justify-between"><p className="text-[20px] font-bold">예산 미입력</p><Btn kind="soft" onClick={toBudget} className="h-9 px-3 text-[13px]">예산 넣기</Btn></div>}
        </Card>
        <Card className="px-7 py-6">
          {allDone ? <><p className="text-[13px] text-neutral-500">다음 STEP</p><p className="mt-2 text-[22px] font-bold">모든 단계 완료</p></> : <>
            <p className="text-[13px] text-neutral-500">다음 STEP · {STAGES[nx].short}까지</p>
            <p className="mt-2 text-[26px] font-bold">{until <= 0 ? <span className="text-[22px]">지금 할 차례예요</span> : <>D-{until}{est && <span className="ml-1 text-[15px] font-semibold text-neutral-500">(예상)</span>}</>}</p>
          </>}
        </Card>
        <PartnerCard />
      </section>
      {late.length > 0 && (
        <button type="button" onClick={() => { dispatch({ type: 'set', patch: { pastOpen: true } }); go('ROAD-02') }} className="mx-[60px] mt-5 flex w-[calc(100%-120px)] items-center gap-3 rounded-[16px] border border-amber-200 bg-amber-50 px-6 py-4 text-left text-[14.5px] text-amber-900">
          <AlertTriangle size={18} className="shrink-0 text-amber-600" />
          <span className="flex-1"><b>확인이 필요한 단계 {late.length}개가 있어요.</b> 이미 했는지 알려주면 남은 예산을 다시 계산해 드려요.</span>
          <span className="font-semibold">확인하기 ›</span>
        </button>
      )}
      <section {...an(id, '04')} className="mx-[60px] mt-6 rounded-[20px] border border-wd-line2 bg-white px-8 py-7">
        <div className="flex justify-between"><p className="text-[18px] font-bold">우리의 결혼 준비 로드맵</p><button type="button" onClick={() => go('ROAD-02')} className="text-[13.5px] font-semibold text-neutral-500">전체보기 ›</button></div>
        <div className="mt-6 grid grid-cols-6 gap-3">{STAGES.map((st, i) => {
          const past = late.includes(i)
          return (
            <div key={st.name} className="text-center"><span className={`mx-auto grid size-10 place-items-center rounded-full text-[14px] font-bold ${s.stages[i].done ? 'bg-wd-g text-white' : i === nx ? 'border-2 border-wd-g text-wd-g' : past ? 'border-2 border-amber-400 text-amber-600' : 'border border-wd-line text-neutral-400'}`}>{s.stages[i].done ? <Check size={17} /> : i + 1}</span><p className="mt-3 text-[13.5px] font-bold">{st.short}</p><p className={`mt-1 text-[12px] ${i === nx ? 'font-semibold text-wd-g' : past ? 'font-semibold text-amber-700' : 'text-neutral-500'}`}>{s.stages[i].done ? '완료' : i === nx ? '지금 할 일' : past ? '확인 필요' : `D-${st.d[0]}~${st.d[1]}`}</p></div>
          )
        })}</div>
      </section>
      <section className="grid grid-cols-2 gap-6 px-[60px] pt-6">
        <Card anno={an(id, '05')} className="px-8 py-7">
          <div className="flex justify-between"><p className="text-[18px] font-bold">예산 현황</p><button type="button" onClick={() => go('COST-08')} className="text-[13.5px] font-semibold text-neutral-500">상세보기 ›</button></div>
          <div className="mt-6 flex items-center gap-8">
            <div className="relative grid size-[150px] shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#44695b 0 ${vPct}%, #9dbcaf 0 ${vPct + sPct}%, #ebebe6 0)` }}>
              <div className="grid size-[108px] place-items-center rounded-full bg-white text-center">
                {budget ? <p className="text-[11.5px] text-neutral-500">총 예산<br /><b className="text-[13px] text-wd-ink">{won(budget)}</b></p>
                  : <p className="text-[11px] leading-snug text-neutral-500">예상 총비용<br /><b className="text-[12px] leading-tight text-wd-ink">{c.total[0].toLocaleString('ko-KR')}만 ~<br />{c.total[1].toLocaleString('ko-KR')}만원</b><br /><button type="button" onClick={toBudget} className="mt-0.5 font-semibold text-wd-g">예산 넣기 ›</button></p>}
              </div>
            </div>
            <ul className="flex-1 space-y-3 text-[13.5px]">{([['v', vDone ? '예식장 실제' : '예식장 예상', vAmt, 'bg-wd-g'], ['s', sDone ? '스드메 실제' : '스드메 예상', sAmt, 'bg-[#9dbcaf]'], ...(budget ? [['r', '여유 · 기타', rest, 'bg-[#ebebe6]']] : [])] as [string, string, number, string][]).map(([k, t, v, cls]) => <li key={k} className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${cls}`} /><span className="flex-1 text-neutral-600">{t}</span><b>{won(v)}</b><span className="w-10 text-right text-neutral-500">{pctOf[k]}%</span></li>)}</ul>
          </div>
        </Card>
        <Card anno={an(id, '06')} className="px-8 py-7">
          <div className="flex justify-between"><p className="text-[18px] font-bold">이번 단계 할 일</p>{!allDone && <button type="button" onClick={() => go('STEP-01')} className="text-[13.5px] font-semibold text-neutral-500">더보기 ›</button>}</div>
          {todos.length === 0 ? <p className="mt-5 rounded-[14px] bg-[#f6f6f2] py-8 text-center text-[14px] text-neutral-500">할 일이 없어요</p> : (
            <ul className="mt-5 space-y-3">{todos.map((t) => <li key={t.text} className="flex items-center gap-3 text-[14.5px]"><span className={`grid size-5 place-items-center rounded-[5px] border ${t.done ? 'border-wd-g bg-wd-g text-white' : 'border-neutral-300'}`}>{t.done && <Check size={12} strokeWidth={3} />}</span><span className={`flex-1 ${t.done ? 'text-neutral-400 line-through' : ''}`}>{t.text}</span><Tag tone={t.owner === '나' ? 'dark' : 'g'}>{t.owner}</Tag></li>)}</ul>
          )}
          {!allDone && <Btn kind="soft" onClick={() => { dispatch({ type: 'set', patch: { view: nx, amountText: '', editAmount: false } }); go(nx === 2 ? 'STEP-03' : 'STEP-01') }} className="mt-6 h-11 w-full text-[14px]">단계 상세 보기</Btn>}
        </Card>
      </section>
      <section className="grid grid-cols-[1fr_400px] gap-6 px-[60px] pb-20 pt-6">
        <Card anno={an(id, '07')} className="px-8 py-7">
          <div className="flex justify-between"><p className="text-[18px] font-bold">추천 예식장 <span className="text-[13px] font-normal text-neutral-500">· 관심 업체 먼저</span></p><button type="button" onClick={() => go('VENUE-01')} className="text-[13.5px] font-semibold text-neutral-500">더보기 ›</button></div>
          <div className="mt-5 grid grid-cols-3 gap-4">{['v2', 'v4', 'v1'].map((v) => { const x = VENUES.find((y) => y.id === v)!; return <button type="button" key={v} onClick={() => { dispatch({ type: 'set', patch: { vendor: v } }); go('VENDOR-01') }} className="overflow-hidden rounded-[14px] border border-wd-line2 text-left"><Photo mood={x.mood} className="h-[110px]" /><div className="p-3"><p className="text-[11.5px] text-neutral-500">서울 {x.gu}</p><p className="text-[14px] font-bold">{x.name}</p><p className="mt-1 text-[12px] text-neutral-500">{x.food} · 주차 {x.parking ? '가능' : '불가'}</p><p className="mt-1 truncate text-[11.5px] text-neutral-400">{x.note}</p></div></button> })}</div>
        </Card>
        <Card anno={an(id, '08')} className="px-7 py-7">
          <p className="text-[18px] font-bold">웨딩 일정</p>
          <p className="mt-3 text-center text-[14px] font-bold">2026년 11월</p>
          <div className="mt-3 grid grid-cols-7 gap-y-1.5 text-center text-[12.5px]">
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => <span key={d} className="text-neutral-400">{d}</span>)}
            {CAL.map((i) => { const day = i + 1; if (day > 30) return <span key={i} />; return <span key={i} className={`mx-auto grid size-7 place-items-center rounded-full ${day === 15 ? 'bg-wd-g font-bold text-white' : ''}`}>{day}</span> })}
          </div>
          <div className="mt-4 space-y-2 border-t border-wd-line2 pt-4 text-[12.5px]">
            {!allDone && <p className="flex justify-between gap-3"><span className="text-neutral-500">{STAGES[nx].short} 권장 기간</span><b>{winText(s, nx)}</b></p>}
            <p className="flex justify-between"><span className="text-neutral-500">예식일 D-{dday(s)}</span><b>{ymKo(weddingDate(s.a.when).date)}{ex}</b></p>
          </div>
        </Card>
      </section>
      <PublicFooter />
    </Page>
  )
}
