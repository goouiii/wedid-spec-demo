import { createContext, useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  Building2, Camera, Check, ChevronDown, ChevronRight, CircleDollarSign, Heart, House, Map as MapIcon, MapPin, Shirt, Sparkles, Mail, User, X,
} from 'lucide-react'
import { STAGES, shortRegion, ymKo } from '../data/mock'
import { dday, nextStage, progress, useDemo, weddingDate, type ScreenId } from '../demo/state'

export const SCREEN_W = 1440
export const SCREEN_MIN_H = 900
export const OverlayCtx = createContext<HTMLElement | null>(null)
export type Anno = Record<string, string>

export function Logo({ small = false, light = false }: { small?: boolean; light?: boolean }) {
  return (
    <span className={`flex items-center gap-1.5 ${light ? 'text-white/80' : 'text-wd-g'}`} aria-label="WEDID">
      <svg width={small ? 24 : 30} height={small ? 18 : 22} viewBox="0 0 40 30" fill="none" aria-hidden>
        <path d="M2 6c3 0 4 2 6 8l4 12 6-16 6 16 4-12c2-6 3-8 6-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 1.5l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="currentColor" />
      </svg>
      <span className={`font-serif font-semibold tracking-[0.06em] ${small ? 'text-[16px]' : 'text-[20px]'}`}>WEDID</span>
    </span>
  )
}

export function Page({ children, bg = 'bg-wd-bg' }: { children: ReactNode; bg?: string }) {
  return <div className={`relative flex min-h-[max(900px,var(--win-h,0px))] w-[1440px] flex-col ${bg} text-wd-ink`}>{children}</div>
}

/* ───────── 버튼 · 배지 ───────── */
type BtnKind = 'primary' | 'outline' | 'soft' | 'ghost' | 'dark' | 'white' | 'kakao'
export function Btn({ kind = 'primary', className = '', anno, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: BtnKind; anno?: Anno }) {
  const k = {
    primary: 'bg-wd-g text-white hover:bg-wd-gd disabled:bg-[#e9e9e6] disabled:text-[#a8a8a4]',
    outline: 'border border-wd-line bg-white hover:bg-[#fafaf8] disabled:opacity-40',
    soft: 'bg-wd-gl text-wd-g hover:brightness-[.97] disabled:opacity-40',
    ghost: 'text-wd-g hover:underline underline-offset-4 disabled:opacity-40',
    dark: 'bg-wd-ink text-white disabled:opacity-40',
    white: 'bg-white text-wd-ink hover:bg-white/90 disabled:opacity-40',
    kakao: 'bg-[#FEE500] text-[#191919] hover:brightness-[.98]',
  }[kind]
  return <button type="button" {...anno} {...p} className={`inline-flex items-center justify-center gap-1.5 rounded-[12px] font-semibold transition ${k} ${className}`} />
}

export function Dot({ children, tone = 'g', className = '' }: { children: ReactNode; tone?: 'g' | 'gray' | 'warn' | 'red'; className?: string }) {
  const t = { g: 'text-wd-g', gray: 'text-neutral-400', warn: 'text-amber-700', red: 'text-rose-600' }[tone]
  return <span className={`inline-flex items-center gap-1 text-[12.5px] font-semibold ${t} ${className}`}><span className="size-1.5 rounded-full bg-current" />{children}</span>
}

export function Tag({ children, tone = 'g', className = '' }: { children: ReactNode; tone?: 'g' | 'dark' | 'gray' | 'warn' | 'red' | 'line'; className?: string }) {
  const t = { g: 'bg-wd-gl text-wd-g', dark: 'bg-wd-g text-white', gray: 'bg-[#efefec] text-neutral-600', warn: 'bg-amber-50 text-amber-800', red: 'bg-rose-50 text-rose-700', line: 'border border-wd-line bg-white text-neutral-700' }[tone]
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${t} ${className}`}>{children}</span>
}

export function Card({ children, className = '', anno }: { children: ReactNode; className?: string; anno?: Anno }) {
  return <div {...anno} className={`rounded-[20px] border border-wd-line2 bg-white ${className}`}>{children}</div>
}

export function DarkCard({ children, className = '', anno }: { children: ReactNode; className?: string; anno?: Anno }) {
  return <div {...anno} className={`rounded-[22px] bg-[radial-gradient(120%_140%_at_80%_0%,#4c6f61_0%,#2c4b40_45%,#22392f_100%)] text-white ${className}`}>{children}</div>
}

export function Warn({ children, className = '', anno, action }: { children: ReactNode; className?: string; anno?: Anno; action?: ReactNode }) {
  return (
    <div {...anno} className={`flex items-center justify-between gap-6 rounded-[16px] border border-[#ece3cf] bg-[#f8f3e7] px-5 py-4 text-[14px] text-[#6b5a35] ${className}`}>
      <div className="min-w-0">{children}</div>{action}
    </div>
  )
}

export function Switch({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onClick} className="flex items-center gap-2 text-[13px] font-medium text-neutral-700">
      <span className={`relative h-5 w-9 rounded-full transition ${on ? 'bg-wd-g' : 'bg-[#dcdcd8]'}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition ${on ? 'left-[18px]' : 'left-0.5'}`} /></span>
      {label}
    </button>
  )
}

export function Chip({ on, children, onClick, className = '' }: { on: boolean; children: ReactNode; onClick?: () => void; className?: string }) {
  return <button type="button" aria-pressed={on} onClick={onClick} className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${on ? 'border-wd-ink bg-wd-ink text-white' : 'border-wd-line bg-white text-neutral-700 hover:border-neutral-400'} ${className}`}>{children}</button>
}

/** 사진 자리: 업체 사진은 쓰지 않아요 — 분위기 색 일러스트로 대체 */
const MOOD_BG: Record<string, string> = {
  화사한: 'from-[#f6efe6] to-[#efe4d3]', 웅장한: 'from-[#e9e4db] to-[#d8cdbd]', 럭셔리: 'from-[#e8e1d6] to-[#cfc2ad]', 그리너리: 'from-[#e5efe5] to-[#cfe0cf]', 클래식: 'from-[#f3efe9] to-[#e5ddd2]',
}
export function Photo({ mood, label, className = '', icon = 'building', anno, children }: { mood?: string; label?: string; className?: string; icon?: 'building' | 'heart' | 'couple'; anno?: Anno; children?: ReactNode }) {
  return (
    <div {...anno} className={`relative grid place-items-center overflow-hidden bg-gradient-to-br ${MOOD_BG[mood ?? '화사한'] ?? MOOD_BG['화사한']} ${className}`}>
      {icon === 'couple' ? <CoupleArt /> : icon === 'heart' ? <Heart className="text-wd-g/40" size={36} /> : <Building2 className="text-wd-g/40" size={34} strokeWidth={1.3} />}
      {label && <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-neutral-700">{label}</span>}
      {children}
    </div>
  )
}
export function CoupleArt({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" fill="none" aria-hidden className="text-wd-g">
      <circle cx="48" cy="22" r="10" fill="currentColor" opacity=".35" />
      <circle cx="74" cy="20" r="10" fill="currentColor" opacity=".55" />
      <path d="M30 92c2-30 10-48 18-48s14 10 16 26l-4 22z" fill="#fff" stroke="currentColor" strokeOpacity=".3" />
      <path d="M62 92l4-40c2-10 6-14 10-14s8 4 9 14l3 40z" fill="currentColor" opacity=".6" />
      <circle cx="32" cy="66" r="7" fill="#e9b8b8" opacity=".8" />
    </svg>
  )
}

/* ───────── 공개 화면 상단 · 하단 ───────── */
export function PublicNav({ anno }: { anno?: Anno }) {
  const { s, go } = useDemo()
  return (
    <header {...anno} className="z-10 flex h-[78px] shrink-0 items-center justify-between border-b border-wd-line2 bg-white px-[60px]">
      <div className="flex items-center gap-14">
        <button type="button" onClick={() => go(s.loggedIn && s.plan ? 'MAIN-03' : 'MAIN-01')}><Logo /></button>
        <nav className="flex gap-10 text-[15px] font-semibold">
          <button type="button" onClick={() => go('MAIN-02')}>웨딩 플랜</button>
          <button type="button" onClick={() => go(s.plan ? (s.loggedIn ? 'ROAD-02' : 'ROAD-01') : 'Q-01')}>내 로드맵</button>
        </nav>
      </div>
      <div className="flex items-center gap-6 text-wd-ink">
        <Heart size={19} strokeWidth={1.7} />
        <button type="button" onClick={() => go(s.loggedIn ? 'MY-01' : 'MAIN-01')} aria-label="내 정보"><User size={20} strokeWidth={1.7} /></button>
      </div>
    </header>
  )
}

export function PublicFooter({ anno }: { anno?: Anno }) {
  const col = (t: string, items: string[]) => (
    <div><p className="text-[13px] font-bold">{t}</p><ul className="mt-4 space-y-3 text-[13px] text-neutral-500">{items.map((i) => <li key={i}>{i}</li>)}</ul></div>
  )
  return (
    <footer {...anno} className="mt-auto border-t border-wd-line2 bg-white px-[60px] pb-8 pt-14">
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div><Logo small /><p className="mt-3 text-[13px] text-neutral-500">우리의 웨딩을 완성하다</p></div>
        {col('서비스', ['웨딩 플랜', '비용 계산', '준비 로드맵'])}
        {col('고객지원', ['자주 묻는 질문', '고객센터'])}
        {col('정책', ['이용약관', '개인정보처리방침'])}
      </div>
      <div className="mt-12 flex justify-between border-t border-wd-line2 pt-6 text-[12px] text-neutral-400"><span>© 2026 WEDID</span><span>비용 데이터: 한국소비자원 참가격</span></div>
    </footer>
  )
}

export function SimpleFooter({ anno }: { anno?: Anno }) {
  return (
    <footer {...anno} className="mt-auto border-t border-wd-line2 py-7 text-center text-[12.5px] leading-6 text-neutral-500">
      데이터 출처: 한국소비자원 참가격 결혼서비스 통계<br />이용약관 · 개인정보처리방침 · 정보 정정 요청
    </footer>
  )
}

/* ───────── 앱 상단바 · 사이드바 ───────── */
export function Avatar({ t, tone = 'g', size = 30 }: { t: string; tone?: 'g' | 'p' | 'empty'; size?: number }) {
  const c = tone === 'p' ? 'bg-[#f3e1d7] text-[#9a5b43]' : tone === 'empty' ? 'border border-dashed border-neutral-300 bg-white text-neutral-400' : 'bg-[#d9e8f0] text-[#3a6a85]'
  return <span className={`grid shrink-0 place-items-center rounded-full text-[12px] font-bold ring-2 ring-white ${c}`} style={{ width: size, height: size }}>{t}</span>
}

export type GuestMode = 'save' | 'login'
export function AppTop({ crumbs, anno, guestMode = 'save' }: { crumbs: string[]; anno?: Anno; guestMode?: GuestMode }) {
  const { s, dispatch, go } = useDemo()
  return (
    <header {...anno} className="relative z-20 flex h-[62px] shrink-0 items-center justify-between border-b border-wd-line2 bg-white px-6">
      <div className="flex items-center gap-4 text-[14px]">
        <button type="button" onClick={() => go(s.loggedIn ? 'MAIN-03' : 'MAIN-01')}><Logo /></button>
        <span className="h-5 w-px bg-wd-line" />
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={14} className="text-neutral-400" />}
            <span className={i === crumbs.length - 1 ? 'font-bold' : 'text-neutral-500'}>{c}</span>
          </span>
        ))}
      </div>
      {s.loggedIn ? (
        <button type="button" onClick={() => dispatch({ type: 'set', patch: { profileOpen: !s.profileOpen } })} className="flex items-center gap-3 text-[14px] font-semibold">
          <span className="flex -space-x-2"><Avatar t="준" size={26} />{s.partner === 'joined' ? <Avatar t="민" tone="p" size={26} /> : <Avatar t="+" tone="empty" size={26} />}</span>
          <span className="ml-2 flex items-center gap-1.5">준근 님 <ChevronDown size={15} /></span>
        </button>
      ) : guestMode === 'login' ? (
        <button type="button" onClick={() => dispatch({ type: 'needLogin', reason: 'save' })} className="text-[14px] font-semibold">로그인</button>
      ) : (
        <div className="flex items-center gap-7 text-[14px] font-semibold">
          <button type="button" onClick={() => go('ROAD-01')}>내 로드맵</button>
          <button type="button" onClick={() => dispatch({ type: 'needLogin', reason: 'save' })}>로그인</button>
          <Btn onClick={() => dispatch({ type: 'needLogin', reason: 'save' })} className="h-9 px-4 text-[13.5px]">계획 저장하기</Btn>
        </div>
      )}
    </header>
  )
}

export type SideActive = 'home' | 'roadmap' | 'cost' | 'venue' | 'compare' | 'sdm' | number | null
const NAV: { k: SideActive; label: string; Icon: typeof House; to: ScreenId }[] = [
  { k: 'home', label: '홈', Icon: House, to: 'HOME-01' },
  { k: 'roadmap', label: '준비 로드맵', Icon: MapIcon, to: 'ROAD-02' },
  { k: 'cost', label: '예상 비용', Icon: CircleDollarSign, to: 'COST-08' },
  { k: 'venue', label: '예식장 찾기', Icon: MapPin, to: 'VENUE-01' },
]
export type SideAnno = { card?: Anno; nav?: Anno; steps?: Anno; dday?: Anno }

export function Sidebar({ active, annos = {} }: { active: SideActive; annos?: SideAnno }) {
  const { s, go, dispatch } = useDemo()
  const wd = weddingDate(s.a.when)
  const ni = nextStage(s)
  const d = dday(s)
  const guestTo = (to: ScreenId): ScreenId => {
    if (s.loggedIn) return to
    if (to === 'ROAD-02' || to === 'HOME-01') return 'ROAD-01'
    if (to === 'COST-08') return 'COST-02'
    if (to === 'VENUE-01') return 'VENUE-04'
    if (to === 'SDM-01') return 'SDM-02'
    return to
  }
  const open = (i: number) => { dispatch({ type: 'set', patch: { view: i, amountText: '', editAmount: false } }); go(i === 2 ? 'STEP-03' : 'STEP-01') }
  const sub = (label: string, k: SideActive, to: ScreenId, count?: number) => (
    <li key={label}>
      <button type="button" onClick={() => go(guestTo(to))} className={`ml-[26px] flex w-[calc(100%-26px)] items-center justify-between rounded-[8px] px-3 py-1.5 text-left text-[12.5px] ${active === k ? 'bg-wd-gl font-semibold text-wd-g' : 'text-neutral-500 hover:bg-[#f3f3f0]'}`}>
        {label}{count ? <span className="text-[11.5px]">{count}</span> : null}
      </button>
    </li>
  )
  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-wd-line2 bg-white px-3 pb-4 pt-4">
      <div {...annos.card} className="flex items-center gap-3 rounded-[14px] border border-wd-line2 px-3 py-3">
        <span className="grid size-9 place-items-center rounded-[10px] bg-wd-g font-serif text-[16px] font-semibold text-white">W</span>
        <span className="leading-tight"><span className="block text-[14px] font-bold">우리의 웨딩</span><span className="text-[12px] text-neutral-500">{wd.estimated ? '예식일 미정' : ymKo(wd.date)} · {shortRegion(s.a.region ?? '서울 강남권 외')}</span></span>
      </div>
      <nav {...annos.nav} className="mt-4 space-y-0.5">
        {NAV.map(({ k, label, Icon, to }) => (
          <button key={label} type="button" onClick={() => go(guestTo(to))} className={`flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[14px] ${active === k ? 'bg-[#f1f1ee] font-bold' : 'text-neutral-700 hover:bg-[#f6f6f3]'}`}>
            <Icon size={16} strokeWidth={1.7} /> {label}
          </button>
        ))}
      </nav>
      <div {...annos.steps} className="mt-5">
        <p className="px-3 text-[12px] font-semibold text-neutral-500">준비 단계</p>
        <ul className="mt-2 space-y-0.5">
          {STAGES.map((st, i) => {
            const x = s.stages[i]
            const isNow = i === ni
            return (
              <li key={st.name}>
                <button type="button" onClick={() => open(i)} className={`flex w-full items-center gap-2.5 rounded-[10px] px-3 py-1.5 text-left text-[13px] ${active === i ? 'bg-[#f1f1ee] font-bold' : isNow ? 'font-bold' : 'text-neutral-600 hover:bg-[#f6f6f3]'}`}>
                  <span className={`grid size-[18px] shrink-0 place-items-center rounded-[5px] text-[10.5px] font-bold ${x.done ? 'bg-wd-gl text-wd-g' : isNow ? 'bg-wd-g text-white' : 'bg-[#f1f1ee] text-neutral-500'}`}>{x.done ? <Check size={11} strokeWidth={3} /> : i + 1}</span>
                  <span className="truncate">{st.name}</span>{x.late && <span className="ml-auto size-1.5 shrink-0 rounded-full bg-amber-500" />}
                </button>
                {i === 1 && <ul>{sub('예식장 후보 보기', 'venue', 'VENUE-01')}{sub('업체 비교하기', 'compare', 'VENDOR-03', s.compare.length || undefined)}</ul>}
                {i === 2 && <ul>{sub('스드메 후보 보기', 'sdm', 'SDM-01')}</ul>}
              </li>
            )
          })}
        </ul>
      </div>
      <DarkCard anno={annos.dday} className="mt-auto px-4 py-4">
        <p className="text-[12px] text-white/70">예식까지{wd.estimated ? ' (예상)' : ''}</p>
        <p className="mt-1 text-[28px] font-bold">D-{d}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${Math.max(4, progress(s))}%` }} /></div>
        <p className="mt-2 text-[12px] text-white/80">전체 진행률 {progress(s)}%</p>
      </DarkCard>
    </aside>
  )
}

export function AppShell({ crumbs, active, children, top, side, guestMode }: { crumbs: string[]; active: SideActive; children: ReactNode; top?: Anno; side?: SideAnno; guestMode?: GuestMode }) {
  return (
    <>
      <AppTop crumbs={crumbs} anno={top} guestMode={guestMode} />
      <div className="flex flex-1">
        <Sidebar active={active} annos={side} />
        <main className="min-w-0 flex-1 px-10 pb-14 pt-8">{children}</main>
      </div>
    </>
  )
}

export function Back({ children, onClick, anno }: { children: ReactNode; onClick: () => void; anno?: Anno }) {
  return <button type="button" {...anno} onClick={onClick} className="flex items-center gap-1 text-[13.5px] font-semibold text-neutral-600 hover:text-black"><ChevronRight size={15} className="rotate-180" />{children}</button>
}

export function Head({ eyebrow, title, badge, desc, right, anno, sub }: { eyebrow?: ReactNode; title: ReactNode; badge?: ReactNode; desc?: ReactNode; right?: ReactNode; anno?: Anno; sub?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div {...anno} className="min-w-0">
        {eyebrow && <p className="text-[13px] font-bold text-wd-g">{eyebrow}</p>}
        <h1 className="mt-1.5 flex items-center gap-4 text-[32px] font-bold tracking-tight">{title}{badge}</h1>
        {desc && <p className="mt-2 text-[15px] text-neutral-600">{desc}</p>}
        {sub}
      </div>
      {right}
    </div>
  )
}

export function BudgetBox({ label = '이번 단계 예산', value, sub, anno }: { label?: string; value: string; sub?: string; anno?: Anno }) {
  return (
    <div {...anno} className="shrink-0 rounded-[16px] border border-wd-line2 bg-white px-5 py-3.5 text-right">
      <p className="text-[12px] text-neutral-500">{label}</p>
      <p className="whitespace-nowrap text-[21px] font-bold text-wd-g">{value}</p>
      {sub && <p className="text-[11.5px] text-neutral-500">{sub}</p>}
    </div>
  )
}

export const STAGE_ICON = { check: Check, building: Building2, shirt: Shirt, camera: Camera, mail: Mail, sparkles: Sparkles } as const

/* ───────── 모달 · 패널 · 토스트 ───────── */
export function Layer({ children, align = 'center', onClose }: { children: ReactNode; align?: 'center' | 'right'; onClose?: () => void }) {
  const root = useContext(OverlayCtx)
  const body = (
    <div className={`absolute inset-0 z-40 flex bg-[#1f2a25]/45 ${align === 'right' ? 'justify-end' : 'items-start justify-center pt-[140px]'}`} onClick={onClose}>
      <div className={align === 'right' ? 'h-full' : ''} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
  return root ? createPortal(body, root) : body
}

export function Modal({ eyebrow, title, children, onClose, width = 440, anno, icon }: { eyebrow?: string; title: ReactNode; children: ReactNode; onClose?: () => void; width?: number; anno?: Anno; icon?: ReactNode }) {
  return (
    <Layer onClose={onClose}>
      <div {...anno} role="dialog" aria-label={typeof title === 'string' ? title : eyebrow} className="relative rounded-[24px] bg-white px-7 pb-6 pt-6 shadow-2xl" style={{ width }}>
        {onClose && <button type="button" onClick={onClose} aria-label="닫기" className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-[#f3f3f0] hover:bg-[#ebebe7]"><X size={16} /></button>}
        {eyebrow && <p className="text-[12.5px] font-semibold text-neutral-500">{eyebrow}</p>}
        {icon && <span className="mt-3 grid size-11 place-items-center rounded-[12px] bg-wd-gl text-wd-g">{icon}</span>}
        <h2 className="mt-3 pr-8 text-[22px] font-bold leading-snug">{title}</h2>
        <div className="mt-2">{children}</div>
      </div>
    </Layer>
  )
}

/* ───────── 입력 ───────── */
export const inputCls = 'h-[52px] w-full rounded-[12px] border border-transparent bg-[#f3f3f0] px-4 text-[16px] outline-none focus:border-wd-g focus:bg-white focus:ring-2 focus:ring-wd-g/15'
export const selCls = 'h-[44px] rounded-[12px] border border-wd-line2 bg-white px-3.5 text-[14px] font-semibold outline-none focus:border-wd-g'
export const onlyNum = (v: string) => {
  const d = v.replace(/[^0-9]/g, '').replace(/^0+/, '').slice(0, 6)
  return d ? Number(d).toLocaleString('ko-KR') : ''
}
export const parseNum = (v: string) => (v ? Number(v.replace(/,/g, '')) : null)
export const budgetError = (n: number | null) => (n === null ? null : n < 100 ? '100만 원 이상으로 입력해 주세요' : n > 99999 ? '99,999만 원까지 입력할 수 있어요' : null)

export function ManInput({ value, onChange, placeholder = '금액 입력', anno, error, big = false, label = '금액 (만 원)' }: { value: string; onChange: (v: string) => void; placeholder?: string; anno?: Anno; error?: string | null; big?: boolean; label?: string }) {
  return (
    <div {...anno} className="relative">
      <input aria-label={label} inputMode="numeric" value={value} placeholder={placeholder} onChange={(e) => onChange(onlyNum(e.target.value))} className={`${inputCls} ${big ? '!h-[58px] !text-[20px]' : ''} pr-16 ${error ? '!border-rose-400 !bg-rose-50/40' : ''}`} />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-neutral-500">만 원</span>
    </div>
  )
}
