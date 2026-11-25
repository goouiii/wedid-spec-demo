import { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, Check, ChevronRight, Copy, LogOut, MessageCircle, RotateCcw, User, UserPlus } from 'lucide-react'
import { STAGES, fmtRange } from '../data/mock'
import { dday, initialState, isPast, seedFor, stageBudget, useAnno, useDemo, type LoginReason, type Todo } from '../demo/state'
import { Avatar, Btn, Chip, Modal, OverlayCtx, inputCls, parseNum, ManInput } from './ui'
import { dText } from './parts'

const LOGIN_COPY: Record<LoginReason, [string, string]> = {
  save: ['계획을 저장하려면 로그인해 주세요', '저장하면 로드맵을 계속 관리하고, 짝꿍과 함께 볼 수 있어요.'],
  step: ['단계를 완료하려면 로그인해 주세요', '실제 금액을 기록하면 남은 예산을 다시 계산해 드려요.'],
  todo: ['할 일을 추가하려면 로그인해 주세요', '추가한 할 일은 짝꿍과 함께 보고 체크할 수 있어요.'],
  invite: ['짝꿍을 초대하려면 로그인해 주세요', '로그인하면 짝꿍에게 보낼 초대 링크를 만들어 드려요.'],
  cand: ['계획을 저장하고 후보를 확인해 보세요', '로그인하면 지금 계획이 저장되고, 내 조건에 맞는 예식장 · 스드메 후보를 볼 수 있어요.'],
  join: ['로그인하고 함께 준비해요', '같은 로드맵에서 할 일을 나누고 예산을 함께 관리해요.'],
}
const LOGIN_IDS = ['LOGIN-01', 'LOGIN-02', 'LOGIN-03', 'LOGIN-04', 'LOGIN-05'] as const

function LoginModal() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  if (!s.login) return null
  const [t, d] = LOGIN_COPY[s.login.reason]
  const L = [...LOGIN_IDS]
  const go = () => dispatch(s.loginFailNext ? { type: 'loginFail' } : { type: 'loginOk' })
  return (
    <Modal eyebrow="로그인" title={t} onClose={() => dispatch({ type: 'set', patch: { login: null, loginError: false } })} anno={{ ...an(L, '01'), ...an('INVITE-03', '01') }}>
      <p className="text-[14.5px] leading-6 text-neutral-600">{d}</p>
      {s.loginError && <p role="alert" className="mt-4 flex items-center gap-2 rounded-[12px] bg-rose-50 px-4 py-3 text-[13.5px] font-semibold text-rose-700"><AlertCircle size={15} />로그인하지 못했어요. 잠시 후 다시 시도해 주세요.</p>}
      <div {...an(L, '02')} {...an('INVITE-03', '02')} className="mt-6 space-y-2">
        <Btn kind="kakao" onClick={go} className="h-[52px] w-full text-[15px]"><MessageCircle size={16} className="fill-current" />카카오로 계속하기</Btn>
        <Btn kind="outline" onClick={go} className="h-[52px] w-full text-[15px]"><span className="font-bold text-[#4285F4]">G</span>구글로 계속하기</Btn>
      </div>
      <p {...an(L, '03')} className="mt-4 text-center text-[11.5px] leading-5 text-neutral-500">계속하면 이용약관에 동의하고 개인정보처리방침을 확인한 것으로 봐요. 만 14세 이상만 이용할 수 있어요.</p>
    </Modal>
  )
}

function InviteModal() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  if (!s.inviteOpen) return null
  const close = () => dispatch({ type: 'set', patch: { inviteOpen: false } })
  return (
    <Modal eyebrow="짝꿍 초대" title="짝꿍 초대하기" icon={<UserPlus size={20} />} onClose={close} width={460}>
      <p className="text-[14.5px] leading-6 text-neutral-600">링크를 받은 짝꿍이 로그인하면 같은 로드맵을 함께 관리할 수 있어요.</p>
      <div {...an('INVITE-01', '01')} className="mt-5 flex items-center gap-2 rounded-[12px] bg-[#f3f3f0] py-1.5 pl-4 pr-1.5"><span className="flex-1 text-[14.5px] font-semibold">wedid.app/invite/a8f3k2</span><Btn kind="outline" onClick={() => dispatch({ type: 'toast', text: '초대 링크를 복사했어요' })} className="h-9 px-3 text-[13px]"><Copy size={13} />복사</Btn></div>
      <Btn kind="kakao" anno={an('INVITE-01', '02')} onClick={() => dispatch({ type: 'set', patch: { inviteOpen: false, toast: '카카오톡 공유 창을 열었어요 (시연)' } })} className="mt-3 h-[52px] w-full text-[15px]"><MessageCircle size={16} className="fill-current" />카카오톡으로 보내기</Btn>
      <p {...an('INVITE-01', '03')} className="mt-4 flex justify-between text-[12.5px] text-neutral-500"><span>초대 링크는 7일 동안 유효해요.</span><button type="button" onClick={() => { dispatch({ type: 'replace', state: seedFor('INVITE-02') }); go('INVITE-02') }} className="font-semibold text-wd-g">받는 사람 화면 보기 ›</button></p>
    </Modal>
  )
}

function ProfileMenu() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const root = useContext(OverlayCtx)
  if (!s.profileOpen || !s.loggedIn) return null
  const close = (patch = {}) => dispatch({ type: 'set', patch: { profileOpen: false, ...patch } })
  const item = (Icon: typeof User, t: string, on: () => void) => <button type="button" onClick={on} className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] font-semibold hover:bg-[#f6f6f3]"><Icon size={16} className="text-neutral-500" />{t}<ChevronRight size={14} className="ml-auto text-neutral-400" /></button>
  const el = (
    <div className="absolute inset-0 z-40" onClick={() => close()}>
      <div role="menu" onClick={(e) => e.stopPropagation()} className="absolute right-6 top-[58px] w-[280px] rounded-[18px] border border-wd-line2 bg-white p-2 shadow-xl">
        <div {...an('HOME-03', '01')} className="flex items-center gap-3 border-b border-wd-line2 px-3 pb-3 pt-2"><Avatar t="준" size={38} /><div className="leading-tight"><p className="text-[15px] font-bold">최준근</p><p className="text-[12px] text-neutral-500">{s.partner === 'joined' ? '민지 님과 연결됨' : '아직 짝꿍과 연결 전이에요'}</p></div></div>
        <div {...an('HOME-03', '02')} className="pt-1.5">
          {item(User, '내 정보', () => { close(); go('MY-01') })}
          {item(UserPlus, '짝꿍 초대하기', () => close({ inviteOpen: true }))}
          {item(RotateCcw, '조건 다시 입력', () => close({ newPlanOpen: true }))}
          {item(LogOut, '로그아웃', () => { close({ loggedIn: false, toast: '로그아웃했어요' }); go('MAIN-01') })}
        </div>
      </div>
    </div>
  )
  return root ? createPortal(el, root) : el
}

function NewPlanModal() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  if (!s.newPlanOpen) return null
  const start = () => { const f = initialState(); dispatch({ type: 'replace', state: { ...s, a: f.a, plan: false, newPlanOpen: false, profileOpen: false } }); go('Q-01') }
  return (
    <Modal title="새 계획을 시작할까요?" anno={an('MAIN-04', '01')} onClose={() => dispatch({ type: 'set', patch: { newPlanOpen: false } })}>
      <p className="text-[14.5px] leading-6 text-neutral-600">질문 5개에 처음부터 답해 새 예상 비용과 로드맵을 만들어요. 지금 계획의 완료 기록과 할 일은 그대로 남아요.</p>
      <div {...an('MAIN-04', '02')} className="mt-6 grid grid-cols-2 gap-2"><Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { newPlanOpen: false } })} className="h-12 text-[15px]">취소</Btn><Btn onClick={start} className="h-12 text-[15px]">새 계획 시작하기</Btn></div>
    </Modal>
  )
}

function DateModal() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  const [mode, setMode] = useState<'date' | 'month'>(s.a.when.mode === 'date' ? 'date' : 'month')
  const [date, setDate] = useState(s.a.when.date || '2027-10-16')
  const [y, setY] = useState(s.a.when.year || '2027')
  const [m, setM] = useState(s.a.when.month || '10')
  if (!s.dateModal) return null
  const save = () => dispatch({ type: 'recalc', a: { ...s.a, when: mode === 'date' ? { mode, date, year: date.slice(0, 4), month: String(Number(date.slice(5, 7))) } : { mode, date: '', year: y, month: m } } })
  const opt = (k: 'date' | 'month', t: string) => <button type="button" role="radio" aria-checked={mode === k} onClick={() => setMode(k)} className={`flex h-12 w-full items-center gap-3 rounded-[12px] border px-4 text-[14.5px] font-bold ${mode === k ? 'border-wd-g bg-[#f3f7f4]' : 'border-wd-line2'}`}><span className={`grid size-4 place-items-center rounded-full border-2 ${mode === k ? 'border-wd-g' : 'border-neutral-300'}`}>{mode === k && <span className="size-2 rounded-full bg-wd-g" />}</span>{t}</button>
  return (
    <Modal title="예식일 정하기" onClose={() => dispatch({ type: 'set', patch: { dateModal: false } })}>
      <p className="text-[14px] text-neutral-600">예식일을 바꾸면 단계 일정과 D-day가 다시 계산돼요.</p>
      <div {...an('ROAD-05', '01')} className="mt-5 space-y-2">
        {opt('date', '날짜가 정해졌어요')}
        {mode === 'date' && <input type="date" aria-label="예식 날짜" min="2026-11-16" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />}
        {opt('month', '대략적인 달만 정했어요')}
        {mode === 'month' && <div className="grid grid-cols-2 gap-2"><label className="text-[12px] text-neutral-500">연도<select aria-label="연도" value={y} onChange={(e) => setY(e.target.value)} className={`${inputCls} mt-1 !h-11 font-semibold text-wd-ink`}>{['2026', '2027', '2028'].map((v) => <option key={v} value={v}>{v}년</option>)}</select></label><label className="text-[12px] text-neutral-500">월<select aria-label="월" value={m} onChange={(e) => setM(e.target.value)} className={`${inputCls} mt-1 !h-11 font-semibold text-wd-ink`}>{Array.from({ length: 12 }, (_, i) => String(i + 1)).map((v) => <option key={v} value={v}>{v}월</option>)}</select></label></div>}
      </div>
      <div {...an('ROAD-05', '02')} className="mt-6 grid grid-cols-2 gap-2"><Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { dateModal: false } })} className="h-12 text-[15px]">취소</Btn><Btn onClick={save} className="h-12 text-[15px]">저장하기</Btn></div>
    </Modal>
  )
}

function PastModal() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  if (!s.pastOpen) return null
  const rows = STAGES.map((_, i) => i).filter((i) => isPast(s, i))
  const close = () => dispatch({ type: 'set', patch: { pastOpen: false, pastExpanded: null } })
  return (
    <Modal eyebrow="지난 단계 확인" title="확인해주세요!" onClose={close} width={520}>
      <p className="text-[14px] leading-6 text-neutral-600">예식까지 {dday(s)}일 남아 권장 시기가 지난 단계가 있어요. 이미 했는지 알려주시면 남은 예산을 맞게 계산해 드려요.</p>
      <ul {...an('ROAD-07', '01')} className="mt-5 space-y-2">
        {rows.map((i, k) => {
          const bud = stageBudget(s, i)
          const exp = s.pastExpanded === i
          return (
            <li key={i} className={`rounded-[14px] border px-4 py-3.5 ${s.stages[i].late ? 'border-wd-line2 opacity-60' : 'border-wd-line2'}`}>
              <div className="flex items-center gap-3">
                <div className="flex-1"><p className="text-[12px] font-semibold text-amber-700">{dText(i)} · 시기가 지났어요</p><p className="mt-0.5 text-[15px] font-bold">{STAGES[i].name}</p><p className="text-[12.5px] text-neutral-500">{bud ? `예상 ${fmtRange(bud)}` : '따로 드는 비용 없음'}</p></div>
                {!exp && (
                  <div {...(k === 0 ? an('ROAD-07', '02') : {})} className="flex gap-1.5">
                    <Btn kind="soft" onClick={() => (bud ? dispatch({ type: 'set', patch: { pastExpanded: i, pastAmount: '' } }) : dispatch({ type: 'pastDone', stage: i, amount: null }))} className="h-9 px-3 text-[13px]"><Check size={13} />이미 했어요</Btn>
                    <Btn kind="outline" onClick={() => dispatch({ type: 'pastLater', stage: i })} className="h-9 px-3 text-[13px]">아직 안 했어요</Btn>
                  </div>
                )}
              </div>
              {exp && (
                <div className="mt-3 flex gap-2 border-t border-wd-line2 pt-3"><div className="flex-1"><ManInput value={s.pastAmount} onChange={(v) => dispatch({ type: 'set', patch: { pastAmount: v } })} placeholder="실제 금액 (선택)" /></div><Btn onClick={() => dispatch({ type: 'pastDone', stage: i, amount: parseNum(s.pastAmount) })} className="h-[52px] px-4 text-[14px]">완료로 기록</Btn></div>
              )}
            </li>
          )
        })}
      </ul>
      <p {...an('ROAD-07', '03')} className="mt-4 text-center text-[12.5px] text-neutral-500"><button type="button" onClick={close} className="font-semibold text-wd-ink underline underline-offset-4">나중에 해도 돼요</button> · 로드맵 위 [확인하기]로 다시 열 수 있어요</p>
    </Modal>
  )
}

function CancelModal() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  if (!s.cancelOpen) return null
  const i = s.view
  return (
    <Modal title={`${STAGES[i].name} 완료를 취소할까요?`} anno={an('STEP-05', '01')} onClose={() => dispatch({ type: 'set', patch: { cancelOpen: false } })}>
      <p className="text-[14.5px] leading-6 text-neutral-600">진행중 상태로 돌아가요. 넣은 실제 금액은 지워지지 않고, 남은 예산 계산에서만 빠져요.</p>
      <div {...an('STEP-05', '02')} className="mt-6 grid grid-cols-2 gap-2"><Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { cancelOpen: false } })} className="h-12 text-[15px]">닫기</Btn><Btn onClick={() => dispatch({ type: 'uncomplete', stage: i })} className="h-12 text-[15px]">완료 취소</Btn></div>
    </Modal>
  )
}

function TodoModal() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  const [stage, setStage] = useState(Math.max(1, s.stages.findIndex((x) => !x.done)))
  const [text, setText] = useState('')
  const [owner, setOwner] = useState<Todo['owner']>('함께')
  if (!s.todoOpen) return null
  return (
    <Modal title="할 일 추가" onClose={() => dispatch({ type: 'set', patch: { todoOpen: false } })}>
      <div {...an('STEP-06', '01')} className="mt-3 space-y-4">
        <label className="block text-[13px] font-bold text-neutral-700">단계<select aria-label="단계" value={stage} onChange={(e) => setStage(Number(e.target.value))} className={`${inputCls} mt-1.5 !h-12 text-[15px] font-semibold`}>{STAGES.map((st, i) => <option key={st.name} value={i} disabled={s.stages[i].done}>{i + 1}. {st.name}</option>)}</select></label>
        <label className="block text-[13px] font-bold text-neutral-700">내용<input aria-label="내용" value={text} maxLength={40} placeholder="예: 부모님께 후보 공유" onChange={(e) => setText(e.target.value)} className={`${inputCls} mt-1.5 !h-12 text-[15px]`} /></label>
        <div><p className="text-[13px] font-bold text-neutral-700">담당</p><div className="mt-1.5 flex gap-2">{(['나', '짝꿍', '함께'] as const).map((o) => <Chip key={o} on={owner === o} onClick={() => setOwner(o)}>{o}</Chip>)}</div></div>
      </div>
      <Btn anno={an('STEP-06', '02')} disabled={!text.trim()} onClick={() => dispatch({ type: 'addTodo', stage, text: text.trim(), owner })} className="mt-6 h-12 w-full text-[15px]">추가하기</Btn>
    </Modal>
  )
}

function ClearModal() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  if (!s.clearOpen) return null
  return (
    <Modal title="비교함을 비울까요?" anno={an('VENDOR-05', '01')} onClose={() => dispatch({ type: 'set', patch: { clearOpen: false } })}>
      <p className="text-[14.5px] text-neutral-600">담아 둔 업체가 모두 빠져요.</p>
      <div {...an('VENDOR-05', '02')} className="mt-6 grid grid-cols-2 gap-2"><Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { clearOpen: false } })} className="h-12 text-[15px]">취소</Btn><Btn onClick={() => dispatch({ type: 'set', patch: { clearOpen: false, compare: [], toast: '비교함을 비웠어요' } })} className="h-12 text-[15px]">전체 해제</Btn></div>
    </Modal>
  )
}

function UnlinkModal() {
  const { s, dispatch } = useDemo()
  const an = useAnno()
  if (!s.unlinkOpen) return null
  return (
    <Modal title="짝꿍 연결을 해제할까요?" anno={an('MY-02', '01')} onClose={() => dispatch({ type: 'set', patch: { unlinkOpen: false } })}>
      <p className="text-[14.5px] leading-6 text-neutral-600">민지 님은 더 이상 이 계획을 볼 수 없어요. 다시 초대하면 연결할 수 있어요.</p>
      <div {...an('MY-02', '02')} className="mt-6 grid grid-cols-2 gap-2"><Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { unlinkOpen: false } })} className="h-12 text-[15px]">취소</Btn><Btn onClick={() => dispatch({ type: 'unlink' })} className="h-12 !bg-rose-600 text-[15px] hover:!bg-rose-700">연결 해제</Btn></div>
    </Modal>
  )
}

function ToastLayer() {
  const { s } = useDemo()
  const an = useAnno()
  const root = useContext(OverlayCtx)
  if (!s.toast) return null
  const el = (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-50 flex justify-center">
      <div role="status" {...an('STEP-07', '01')} className="flex items-center gap-2 rounded-full bg-wd-ink/90 px-6 py-3 text-[14.5px] text-white shadow-lg"><Check size={16} className="text-[#9fd3b5]" />{s.toast}</div>
    </div>
  )
  return root ? createPortal(el, root) : el
}

export function Overlays() {
  const { s } = useDemo()
  return (
    <>
      <ProfileMenu />
      <NewPlanModal />
      {s.dateModal && <DateModal />}
      <PastModal />
      <CancelModal />
      {s.todoOpen && <TodoModal />}
      <ClearModal />
      <UnlinkModal />
      <InviteModal />
      <LoginModal />
      <ToastLayer />
    </>
  )
}
