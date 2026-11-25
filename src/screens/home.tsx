import { AlertTriangle, ArrowRight, Check, CircleDollarSign, Link2Off, LogOut, Mail, MapPin, PartyPopper, UserPlus, Users } from 'lucide-react'
import { STAGES, fmtRange, ymKo } from '../data/mock'
import { costs, dday, lateStages, progress, remaining, spent, stageBudget, useAnno, useDemo, weddingDate, type ScreenId } from '../demo/state'
import { AppShell, Avatar, Btn, Card, DarkCard, Logo, Page, SimpleFooter, Tag } from './ui'
import { condText, dText, upcoming } from './parts'

const H: ScreenId[] = ['HOME-01']

export function Home() {
  const { s, go, dispatch } = useDemo()
  const an = useAnno()
  const nx = upcoming(s)
  const allDone = s.stages.every((x) => x.done)
  const c = costs(s)
  const wd = weddingDate(s.a.when)
  const todos = allDone ? [] : s.todos[nx]
  const done = todos.filter((t) => t.done).length
  const b = s.a.budget
  const est = wd.estimated ? ' (예상)' : ''
  const late = lateStages(s)
  const check = (j: number) => {
    const act = { type: 'check' as const, stage: nx, i: j }
    dispatch(s.loggedIn ? act : { type: 'needLogin', reason: 'todo', then: act })
  }
  const open = (i: number) => { dispatch({ type: 'set', patch: { view: i, amountText: '', editAmount: false } }); go(i === 2 ? 'STEP-03' : 'STEP-01') }
  return (
    <Page>
      <AppShell crumbs={['홈']} active="home">
        <div {...an(H, '01')}>
          <p className="text-[13px] font-bold text-wd-g">홈 · 예식 D-{dday(s)}{est}</p>
          <h1 className="mt-1.5 text-[32px] font-bold">{s.loggedIn ? '준근님, 다시 오셨네요' : '우리 결혼 준비 현황'}</h1>
          <p className="mt-2 text-[15px] text-neutral-600">{wd.estimated ? '예식일 미정' : `${ymKo(wd.date)} 예식`} · {s.a.region} · 지금 할 일과 이번 주 할 일을 확인해요.</p>
        </div>
        <div className="mt-8 grid grid-cols-[1fr_350px] items-start gap-5">
          <div className="space-y-4">
            {late.length > 0 && (
              <button type="button" onClick={() => go('ROAD-02')} className="flex w-full items-center gap-3 rounded-[14px] border border-amber-200 bg-amber-50 px-5 py-3.5 text-left text-[14px] text-amber-900"><AlertTriangle size={17} className="shrink-0 text-amber-600" /><span className="flex-1"><b>확인이 필요한 단계 {late.length}개가 있어요.</b> 이미 했는지 알려주세요.</span><span className="font-semibold">확인하기 ›</span></button>
            )}
            {allDone ? (
              <DarkCard anno={an('HOME-02', '01')} className="px-8 py-8">
                <Tag tone="gray" className="!bg-white/15 !text-white"><PartyPopper size={12} />모든 단계 완료</Tag>
                <p className="mt-5 text-[34px] font-bold">준비를 모두 마쳤어요</p>
                <p className="mt-2 text-[15px] text-white/75">행복한 결혼식 되세요!</p>
              </DarkCard>
            ) : (
              <DarkCard anno={an(H, '02')} className="px-8 py-7">
                <div className="flex justify-between text-[13px]"><Tag tone="gray" className="!bg-white/15 !text-white">● 지금 할 일 · {nx + 1}단계</Tag><span className="text-white/70">예식 D-{dday(s)}{est}</span></div>
                <p className="mt-5 text-[34px] font-bold">{STAGES[nx].name}</p>
                <p className="mt-2 text-[15px] text-white/75">{stageBudget(s, nx) ? `이번 단계 예산은 ${fmtRange(stageBudget(s, nx)!)}이에요.` : `권장 시기 ${dText(nx)}에 해 두면 좋아요.`}</p>
                <div className="mt-7 flex items-center justify-between border-t border-white/15 pt-5">
                  <div className="flex items-center gap-3 text-[13.5px]"><span className="text-white/70">체크리스트</span><b>{done} / {todos.length}</b><span className="h-1.5 w-28 rounded-full bg-white/20"><span className="block h-full rounded-full bg-white" style={{ width: `${todos.length ? (done / todos.length) * 100 : 0}%` }} /></span></div>
                  <div className="flex gap-2">{nx === 1 && <Btn onClick={() => go('VENUE-01')} className="h-10 border border-white/25 !bg-white/10 px-4 text-[13.5px]">예식장 후보</Btn>}<Btn kind="white" onClick={() => open(nx)} className="h-10 px-4 text-[13.5px]">이어서 하기 <ArrowRight size={14} /></Btn></div>
                </div>
              </DarkCard>
            )}
            <Card anno={{ ...an(H, '03'), ...an('HOME-02', '02') }} className="px-7 py-6">
              <div className="flex items-center justify-between"><p className="text-[17px] font-bold">이번 단계 할 일 <span className="ml-1 text-[14px] text-neutral-500">{done}/{todos.length}</span></p>{!allDone && <button type="button" onClick={() => open(nx)} className="text-[13px] font-semibold text-neutral-500">단계 보기 ›</button>}</div>
              {todos.length === 0 ? <p className="mt-6 rounded-[14px] bg-[#f6f6f2] py-8 text-center text-[14px] text-neutral-500">할 일이 없어요</p> : (
                <ul className="mt-4 divide-y divide-wd-line2">{todos.map((t, j) => (
                  <li key={j} className="flex items-center gap-3 py-3">
                    <button type="button" role="checkbox" aria-checked={t.done} aria-label={t.text} onClick={() => check(j)} className={`grid size-5 place-items-center rounded-[5px] border ${t.done ? 'border-wd-g bg-wd-g text-white' : 'border-neutral-300'}`}>{t.done && <Check size={12} strokeWidth={3} />}</button>
                    <span className={`flex-1 text-[14.5px] ${t.done ? 'text-neutral-400 line-through' : ''}`}>{t.text}</span><Tag tone={t.owner === '나' ? 'dark' : 'g'}>{t.owner}</Tag>
                  </li>
                ))}</ul>
              )}
              {!allDone && <button type="button" onClick={() => open(nx)} className="mt-3 text-[13.5px] font-semibold text-wd-g">{STAGES[nx].short} 단계 전체 보기 →</button>}
            </Card>
          </div>
          <div className="space-y-4">
            <Card anno={{ ...an(H, '04'), ...an('HOME-02', '03') }} className="px-6 py-5">
              <div className="flex justify-between"><p className="text-[16px] font-bold">우리 결혼 비용</p><button type="button" onClick={() => go('COST-08')} className="text-[13px] font-semibold text-neutral-500">상세 ›</button></div>
              <div className="mt-2 divide-y divide-wd-line2 text-[14px]">
                <p className="flex justify-between py-3"><span className="text-neutral-500">예상 총 비용</span><b>{fmtRange(c.total)}</b></p>
                <p className="flex items-center justify-between py-3"><span className="text-neutral-500">설정한 예산</span>{b ? <b>{b.toLocaleString('ko-KR')}만 원</b> : <Btn kind="soft" onClick={() => go('ROAD-02')} className="h-8 px-3 text-[12.5px]">예산 넣기</Btn>}</p>
                <p className="flex justify-between py-3"><span className="text-neutral-500">지금까지 쓴 금액</span><b>{spent(s) ? `${spent(s).toLocaleString('ko-KR')}만 원` : '0원'}</b></p>
                <p className="flex justify-between py-3"><span className="text-neutral-500">남은 예산</span><b className="text-wd-g">{b ? `${remaining(s)!.toLocaleString('ko-KR')}만 원` : '—'}</b></p>
              </div>
              <div {...an(H, '05')} className="mt-2 rounded-[12px] bg-[#f6f6f2] px-4 py-3"><p className="flex justify-between text-[13px]"><span className="text-neutral-500">전체 진행률</span><b>{progress(s)}%</b></p><div className="mt-2 h-1.5 rounded-full bg-[#e4e4df]"><div className="h-full rounded-full bg-wd-g" style={{ width: `${progress(s)}%` }} /></div></div>
            </Card>
            <Card anno={an(H, '06')} className="px-6 py-5">
              <p className="text-[16px] font-bold">바로가기</p>
              <div className="mt-3 space-y-2">{[
                { Icon: CircleDollarSign, t: '예상 비용 다시 보기', d: '스드메 예산대 바꿔보기', on: () => go('COST-08') },
                { Icon: MapPin, t: '예식장 후보', d: '조건에 맞는 업체 찾기', on: () => go('VENUE-01') },
                s.partner === 'joined'
                  ? { Icon: Users, t: '함께하는 멤버', d: '민지 님과 연결됨', on: () => go('MY-01') }
                  : { Icon: UserPlus, t: '짝꿍 초대하기', d: '링크로 함께 준비', on: () => dispatch(s.loggedIn ? { type: 'set', patch: { inviteOpen: true } } : { type: 'needLogin', reason: 'invite', then: { type: 'set', patch: { inviteOpen: true } } }) },
              ].map(({ Icon, t, d, on }) => <button type="button" key={t} onClick={on} className="flex w-full items-center gap-3 rounded-[12px] border border-wd-line2 px-4 py-3 text-left hover:bg-[#fafaf8]"><span className="grid size-9 place-items-center rounded-[10px] bg-wd-gl text-wd-g"><Icon size={17} /></span><span className="flex-1 leading-tight"><b className="block text-[14px]">{t}</b><span className="text-[12px] text-neutral-500">{d}</span></span>›</button>)}</div>
            </Card>
          </div>
        </div>
      </AppShell>
    </Page>
  )
}

/* ───────── 짝꿍 초대 받는 화면 ───────── */
export function InviteLanding() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const I: ScreenId[] = ['INVITE-02']
  return (
    <Page bg="bg-[#f6f5f1]">
      <header className="flex h-[70px] items-center justify-between border-b border-wd-line2 bg-white px-10"><Logo /><button type="button" onClick={() => dispatch({ type: 'needLogin', reason: 'join' })} className="text-[14px] font-semibold">로그인</button></header>
      <main className="flex flex-1 flex-col items-center px-6 pt-16 pb-16">
        {s.invite === 'expired' ? (
          <div {...an('INVITE-04', '01')} className="mt-16 w-[520px] text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-[18px] bg-[#f1f1ee]"><Link2Off size={26} /></span>
            <h1 className="mt-6 text-[28px] font-bold">초대 링크가 만료됐어요</h1>
            <p className="mt-2 text-[15.5px] text-neutral-500">짝꿍에게 새 링크를 요청해 주세요</p>
            <Btn onClick={() => go('MAIN-01')} className="mt-8 h-12 px-7 text-[15px]">처음 화면으로</Btn>
          </div>
        ) : s.invite === 'linked' ? (
          <div {...an('INVITE-05', '01')} className="mt-16 w-[520px] text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-[18px] bg-wd-gl text-wd-g"><Users size={26} /></span>
            <h1 className="mt-6 text-[28px] font-bold">이미 짝꿍과 연결된 계획이에요</h1>
            <p className="mt-2 text-[15.5px] text-neutral-500">연결을 해제한 뒤 다시 초대할 수 있어요</p>
            <Btn onClick={() => { dispatch({ type: 'replace', state: { ...s, invite: 'ok' } }); go('ROAD-02') }} className="mt-8 h-12 px-7 text-[15px]">내 로드맵으로</Btn>
          </div>
        ) : (
          <div className="w-[560px]">
            <div {...an(I, '01')} className="text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-[18px] bg-wd-gl text-wd-g"><Mail size={26} /></span>
              <h1 className="mt-6 text-[28px] font-bold leading-snug">준근님이 함께 결혼 준비를<br />하자고 초대했어요</h1>
              <p className="mt-3 text-[15px] text-neutral-500">로그인하면 같은 로드맵에서 할 일을 나누고, 예산을 함께 관리할 수 있어요.</p>
            </div>
            <p {...an(I, '02')} className="mt-7 rounded-[12px] border border-rose-200 bg-rose-50 px-4 py-3 text-center text-[13.5px] font-semibold text-rose-700">이미 만든 계획이 있다면, 합류하면 내 계획은 사라져요</p>
            <Card anno={an(I, '03')} className="mt-4 px-6 py-5">
              <p className="text-[13px] font-bold text-wd-g">우리 결혼 계획</p>
              <p className="mt-1 text-[17px] font-bold">서울 강남권 외 · 2027년 10월</p>
              <div className="mt-3 divide-y divide-wd-line2 text-[14px]">{[['예상 총비용', '1,800만~2,250만 원'], ['다음 할 일', '예식장 계약 · 예식 D-334'], ['진행 중인 할 일', '2개 (짝꿍 담당 1개)']].map(([k, v]) => <p key={k} className="flex justify-between py-2.5"><span className="text-neutral-500">{k}</span><b>{v}</b></p>)}</div>
            </Card>
            <div {...an(I, '04')} className="mt-6 space-y-2">
              <Btn kind="kakao" onClick={() => dispatch({ type: 'needLogin', reason: 'join' })} className="h-[52px] w-full text-[15px]">카카오로 로그인하고 함께하기</Btn>
              <Btn kind="outline" onClick={() => dispatch({ type: 'needLogin', reason: 'join' })} className="h-[52px] w-full text-[15px]">구글로 로그인하고 함께하기</Btn>
            </div>
            <p {...an(I, '05')} className="mt-3 text-center text-[12px] text-neutral-500">계속하면 이용약관에 동의하고 개인정보처리방침을 확인한 것으로 봐요. 만 14세 이상만 이용할 수 있어요.</p>
          </div>
        )}
      </main>
      <SimpleFooter />
    </Page>
  )
}

/* ───────── 내 정보 ───────── */
export function MyInfo() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const M: ScreenId[] = ['MY-01']
  const sec = (t: string, children: React.ReactNode, anno?: Record<string, string>) => <Card anno={anno} className="px-7 py-6"><p className="text-[13px] font-bold text-neutral-500">{t}</p><div className="mt-3">{children}</div></Card>
  return (
    <Page>
      <AppShell crumbs={['내 정보']} active={null}>
        <p className="text-[13px] font-bold text-wd-g">계정</p>
        <h1 className="mt-1.5 text-[32px] font-bold">내 정보</h1>
        <p className="mt-2 text-[15px] text-neutral-600">계정과 짝꿍 연결, 우리 결혼 계획을 관리해요.</p>
        <div className="mt-8 max-w-[760px] space-y-4">
          {sec('계정', <div className="divide-y divide-wd-line2 text-[14.5px]"><p className="flex justify-between py-2.5"><span className="text-neutral-500">이름</span><b>최준근</b></p><p className="flex items-center justify-between py-2.5"><span className="text-neutral-500">로그인 수단</span><span className="flex items-center gap-2 font-bold"><span className="grid size-6 place-items-center rounded-full bg-[#FEE500] text-[11px] font-bold">K</span>카카오</span></p></div>, an(M, '01'))}
          {sec('함께 준비', s.partner === 'joined' ? (
            <div className="flex items-center gap-3"><Avatar t="민" tone="p" size={38} /><div className="flex-1 leading-tight"><p className="text-[15px] font-bold">연결된 짝꿍: 민지</p><p className="text-[12.5px] text-neutral-500">구글로 로그인</p></div><Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { unlinkOpen: true } })} className="h-10 px-4 text-[13.5px]">연결 해제</Btn></div>
          ) : (
            <div className="flex items-center gap-3"><Avatar t="+" tone="empty" size={38} /><p className="flex-1 text-[14.5px] text-neutral-500">아직 짝꿍과 연결 전이에요</p><Btn kind="soft" onClick={() => dispatch({ type: 'set', patch: { inviteOpen: true } })} className="h-10 px-4 text-[13.5px]">짝꿍 초대하기</Btn></div>
          ), an(M, '02'))}
          {sec('우리 결혼 계획', <div className="flex items-center justify-between gap-4"><p className="text-[15px] font-bold">{condText(s).replace(' · 토요일 낮 예식 기준', '')} · {ymKo(weddingDate(s.a.when).date)}{s.a.budget ? ` · 예산 ${s.a.budget.toLocaleString('ko-KR')}만 원` : ''}</p><Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { newPlanOpen: true, newPlanMode: 'redo' } })} className="h-10 shrink-0 px-4 text-[13.5px]">조건 다시 입력하기</Btn></div>, an(M, '03'))}
          <button type="button" {...an(M, '04')} onClick={() => { dispatch({ type: 'set', patch: { loggedIn: false, toast: '로그아웃했어요' } }); go('MAIN-01') }} className="flex items-center gap-2 px-2 text-[14px] font-semibold text-neutral-500"><LogOut size={15} />로그아웃</button>
        </div>
      </AppShell>
    </Page>
  )
}
