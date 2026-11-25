import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DemoCtx, seedFor, type ScreenId } from '../demo/state'
import { Screen } from '../screens'
import { SCREEN_MIN_H, SCREEN_W } from '../screens/ui'

export const FRAME_W = SCREEN_W
export const BAR_H = 36

/** 데스크톱 브라우저 창 모양 */
export function BrowserFrame({ children, url = 'wedid.co.kr' }: { children: ReactNode; url?: string }) {
  return (
    <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_10px_40px_-12px_rgba(0,0,0,.25)] ring-1 ring-black/5" style={{ width: FRAME_W }}>
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-[#f3f3f1] px-4" style={{ height: BAR_H }}>
        <span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-4 flex-1 rounded-md bg-white px-3 py-1 text-[12px] text-neutral-500">{url}</span>
      </div>
      {children}
    </div>
  )
}

const noop = () => {}

/** 문서·전체 흐름용 정적 화면: 목업 상태로 그리고 조작은 막는다 */
export function StaticScreen({ id }: { id: ScreenId }) {
  const api = useMemo(() => ({ s: seedFor(id), dispatch: noop, go: noop, readonly: true, docId: id }), [id])
  return (
    <DemoCtx.Provider value={api}>
      <BrowserFrame>
        <div inert className="select-none"><Screen id={id} /></div>
      </BrowserFrame>
    </DemoCtx.Provider>
  )
}

/** 카드용 축소 화면: 첫 화면 높이(스크롤 전 보이는 영역)만 잘라서 보여준다 */
export function ScaledStatic({ id, scale }: { id: ScreenId; scale: number }) {
  const h = (SCREEN_MIN_H * 0.62 + BAR_H) * scale
  const api = useMemo(() => ({ s: seedFor(id), dispatch: noop, go: noop, readonly: true, docId: null }), [id])
  return (
    <div className="relative mx-auto max-w-full overflow-hidden rounded-lg" style={{ width: FRAME_W * scale, height: h }} aria-hidden>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: FRAME_W }}>
        <DemoCtx.Provider value={api}>
          <BrowserFrame><div inert><Screen id={id} /></div></BrowserFrame>
        </DemoCtx.Provider>
      </div>
    </div>
  )
}

/** 자식 높이 측정 */
export function useHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [h, setH] = useState(SCREEN_MIN_H + BAR_H)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const f = () => setH(el.offsetHeight)
    f()
    const ro = new ResizeObserver(f)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, h] as const
}
