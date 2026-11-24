import { createContext, useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Settings, Users, X } from 'lucide-react'
import { STAGES } from '../data/mock'
import { useAnno, useDemo, type ScreenId } from '../demo/state'

export const SCREEN_W = 1440
export const SCREEN_MIN_H = 900

/** 시연 화면에서 모달 · 토스트를 스크롤 영역 밖(보이는 창 위)에 띄우기 위한 레이어 */
export const OverlayCtx = createContext<HTMLElement | null>(null)

type Anno = Record<string, string>

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className="flex items-center gap-2 text-wd-g" aria-label="WEDID">
      <svg width={small ? 30 : 40} height={small ? 22 : 30} viewBox="0 0 40 30" fill="none" aria-hidden>
        <path d="M2 6c3 0 4 2 6 8l4 12 6-16 6 16 4-12c2-6 3-8 6-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 1.5l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="currentColor" />
      </svg>
      <span className={`font-serif tracking-[0.08em] ${small ? 'text-[19px]' : 'text-[26px]'}`}>WEDID</span>
    </span>
  )
}

export function Nav({ anno, roadmap = true }: { anno?: Anno; roadmap?: boolean }) {
  const { s, go, dispatch } = useDemo()
  return (
    <header {...anno} className="flex h-[77px] shrink-0 items-center justify-between border-b border-wd-line bg-wd-nav px-[60px]">
      <button type="button" onClick={() => go(s.plan && s.loggedIn ? 'SCR-01-B' : 'SCR-01')} aria-label="첫 화면으로"><Logo /></button>
      <nav className="flex items-center gap-14 text-[18px]">
        {roadmap && s.plan && <button type="button" onClick={() => go('SCR-06')}>내 로드맵</button>}
        {s.loggedIn ? (
          <span className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-wd-gl text-[13px] font-bold text-wd-g">준</span>준근 님 <ChevronDown size={16} /></span>
        ) : (
          <button type="button" onClick={() => dispatch({ type: 'needLogin', reason: 'top' })}>로그인</button>
        )}
      </nav>
    </header>
  )
}

export function Footer({ anno }: { anno?: Anno }) {
  return (
    <footer {...anno} className="mt-auto flex h-[66px] shrink-0 items-center justify-between bg-wd-foot px-[60px] text-[14px] text-neutral-500">
      <span className="flex items-center gap-8"><Logo small /> 우리가 함께 만들어 나가는 웨딩</span>
      <span className="flex gap-9"><span>데이터 출처</span><span>이용약관</span><span>개인정보처리방침</span><span>정보 정정 요청</span></span>
    </footer>
  )
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="relative flex min-h-[max(900px,var(--win-h,0px))] w-[1440px] flex-col bg-wd-bg text-[#1d1d1b]">{children}</div>
}

type BtnKind = 'primary' | 'outline' | 'soft' | 'ghost'
export function Btn({ kind = 'primary', className = '', anno, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: BtnKind; anno?: Anno }) {
  const k = {
    primary: 'bg-wd-g text-white hover:bg-wd-gd disabled:bg-[#e8e8e6] disabled:text-white',
    outline: 'border border-[#1d1d1b] bg-wd-card hover:bg-white disabled:opacity-40',
    soft: 'bg-wd-gl text-wd-g hover:brightness-95 disabled:opacity-40',
    ghost: 'text-neutral-600 underline-offset-4 hover:underline disabled:opacity-40',
  }[kind]
  return <button type="button" {...anno} {...p} className={`rounded-[10px] text-center transition ${k} ${className}`} />
}

export function Pill({ children, tone = 'g', className = '' }: { children: ReactNode; tone?: 'g' | 'dark' | 'gray' | 'warn' | 'red'; className?: string }) {
  const t = { g: 'bg-wd-gl text-wd-g', dark: 'bg-wd-g text-white', gray: 'bg-[#e6e6e2] text-neutral-600', warn: 'bg-amber-100 text-amber-800', red: 'bg-rose-100 text-rose-700' }[tone]
  return <span className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-[14px] ${t} ${className}`}>{children}</span>
}

export function Card({ children, className = '', anno }: { children: ReactNode; className?: string; anno?: Anno }) {
  return <div {...anno} className={`rounded-[18px] border border-wd-line2 bg-wd-card ${className}`}>{children}</div>
}

/** 로드맵 왼쪽 단계 메뉴 (보조 항목: 예식장 후보 보기 · 스드메 후보 보기) */
export function SideMenu({ active, anno, spec }: { active: 'roadmap' | number | 'venues' | 'sdm'; anno?: Anno; spec?: ScreenId[] }) {
  const { s, go, dispatch } = useDemo()
  const an = useAnno()
  const item = (key: string, label: string, state: 'done' | 'now' | 'todo' | 'aux', on: () => void, isActive: boolean, late = false) => (
    <li key={key} className="relative">
      <button type="button" onClick={on} className={`relative z-10 flex w-full items-center gap-4 rounded-[10px] px-4 py-3.5 text-left text-[17px] ${isActive ? 'bg-wd-gl font-semibold text-wd-g' : state === 'done' ? 'text-[#1d1d1b]' : 'text-neutral-500'}`}>
        <span className={`grid size-6 shrink-0 place-items-center rounded-full ${state === 'done' ? 'bg-wd-g text-white' : isActive ? 'bg-wd-g' : state === 'aux' ? 'border border-dashed border-wd-g/60 bg-wd-bg' : 'border border-neutral-300 bg-wd-bg'}`}>
          {state === 'done' && <Check size={14} strokeWidth={3} />}
        </span>
        <span className={state === 'aux' ? 'text-[15px]' : ''}>{label}</span>
        {late && <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[11px] text-amber-800">⚠ 시기가 지났어요</span>}
      </button>
    </li>
  )
  const rows: ReactNode[] = []
  STAGES.forEach((st, i) => {
    if (i === 1) rows.push(item('aux-v', '예식장 후보 보기', 'aux', () => go('SCR-09'), active === 'venues'))
    if (i === 2) rows.push(item('aux-s', '스드메 후보 보기', 'aux', () => go('SCR-10'), active === 'sdm'))
    const x = s.stages[i]
    rows.push(item(`st${i}`, st.name, x.done ? 'done' : 'todo', () => { dispatch({ type: 'set', patch: { view: i, banner: null, editAmount: false, amountText: '' } }); go(i === 2 ? 'SCR-06-D2' : 'SCR-06-D') }, active === i, x.late))
  })
  return (
    <aside {...anno} className="flex w-[310px] shrink-0 flex-col border-r border-wd-line bg-wd-side px-[9px] pb-6 pt-12">
      <button type="button" onClick={() => go('SCR-06')} className={`mb-2 rounded-[10px] px-4 py-4 text-left text-[18px] font-semibold ${active === 'roadmap' ? 'bg-wd-g text-white' : 'text-wd-g'}`}>웨딩 로드맵</button>
      <ul className="relative">
        <span className="absolute bottom-6 left-[29px] top-6 w-px bg-neutral-300" aria-hidden />
        {rows}
      </ul>
      <div className="mt-auto space-y-3 pt-10">
        <button type="button" {...(spec ? an(spec, '07') : {})} onClick={() => dispatch({ type: 'set', patch: { panel: true } })} className="flex w-full items-center gap-3 rounded-[10px] bg-wd-side2 px-5 py-4 text-[17px]"><Settings size={18} className="text-wd-g" /> 기존 정보 수정</button>
        <button type="button" {...(spec ? an(spec, '08') : {})} onClick={() => dispatch({ type: 'toast', text: s.partner === 'joined' ? '파트너 연결 해제는 확인 모달 후 진행돼요 (시연 범위 밖)' : '아직 연결된 짝꿍이 없어요' })} className="flex w-full items-center gap-3 rounded-[10px] bg-wd-side2 px-5 py-4 text-[17px]"><Users size={18} className="text-wd-g" /> 파트너 관리</button>
      </div>
    </aside>
  )
}

/** 모달 · 패널 · 토스트: 문서에서는 화면 위에 그대로, 시연에서는 보이는 창 위에 */
export function Layer({ children, dim = true, align = 'center', onClose }: { children: ReactNode; dim?: boolean; align?: 'center' | 'right'; onClose?: () => void }) {
  const root = useContext(OverlayCtx)
  const body = (
    <div className={`absolute inset-0 z-40 flex ${align === 'right' ? 'justify-end' : 'items-start justify-center pt-[110px]'} ${dim ? 'bg-black/40' : 'pointer-events-none'}`} onClick={onClose} onKeyDown={(e) => { if (e.key === 'Escape') onClose?.() }}>
      <div className={align === 'right' ? 'h-full' : ''} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
  return root ? createPortal(body, root) : body
}

export function Modal({ title, children, onClose, width = 560, anno }: { title: string; children: ReactNode; onClose?: () => void; width?: number; anno?: Anno }) {
  return (
    <Layer onClose={onClose}>
      <div {...anno} role="dialog" aria-label={title} className="overflow-hidden rounded-[20px] bg-white shadow-2xl" style={{ width }}>
        <div className="flex items-center justify-between border-b border-neutral-100 px-7 py-5">
          <p className="text-[18px] font-bold">{title}</p>
          {onClose && <button type="button" onClick={onClose} aria-label="닫기" className="grid size-9 place-items-center rounded-full hover:bg-neutral-100"><X size={20} /></button>}
        </div>
        <div className="px-7 py-6">{children}</div>
      </div>
    </Layer>
  )
}

export function Toast() {
  const { s } = useDemo()
  const root = useContext(OverlayCtx)
  if (!s.toast) return null
  const el = (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-50 flex justify-center">
      <div role="status" className="rounded-full bg-[#1d1d1b]/90 px-7 py-3.5 text-[16px] text-white shadow-lg">{s.toast}</div>
    </div>
  )
  return root ? createPortal(el, root) : el
}

export const inputCls = 'h-[64px] w-full rounded-[12px] border border-[#3a3a38] bg-wd-card px-6 text-[18px] outline-none focus:border-wd-g focus:ring-2 focus:ring-wd-g/20'

/** 숫자만 · 천 단위 콤마 */
export const onlyNum = (v: string) => {
  const d = v.replace(/[^0-9]/g, '').replace(/^0+/, '').slice(0, 6)
  return d ? Number(d).toLocaleString('ko-KR') : ''
}
export const parseNum = (v: string) => (v ? Number(v.replace(/,/g, '')) : null)
export const budgetError = (n: number | null) => (n === null ? null : n < 100 ? '100만 원 이상으로 입력해 주세요' : n > 99999 ? '99,999만 원까지 입력할 수 있어요' : null)
