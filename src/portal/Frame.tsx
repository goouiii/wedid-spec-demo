import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Minus, Plus, Maximize2 } from 'lucide-react'
import type { ScreenId } from '../demo/state'
import type { Comp } from '../data/spec'
import { FRAME_W, StaticScreen, useHeight } from './Static'

export interface Rect { no: string; x: number; y: number; w: number; h: number }

interface Props {
  id: ScreenId
  comps: Comp[]
  selected: string | null
  onSelect: (no: string) => void
  onRects: (found: Set<string>) => void
}

/** 큰 프레임 + 원형 번호. 번호 위치는 실제 DOM 요소(data-anno)의 좌표에서 계산한다. */
export function AnnotatedFrame({ id, comps, selected, onSelect, onRects }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  const [scale, setScale] = useState(1)
  const [auto, setAuto] = useState(true)
  const [rects, setRects] = useState<Rect[]>([])
  const [hover, setHover] = useState<string | null>(null)
  const [contentRef, FRAME_H] = useHeight<HTMLDivElement>()

  const computeFit = useCallback(() => {
    const el = scrollRef.current
    if (!el) return 1
    const w = el.clientWidth - 32
    return Math.max(0.2, Math.min(w / FRAME_W, 1))
  }, [])

  useLayoutEffect(() => {
    const update = () => {
      const f = computeFit()
      setFit(f)
      if (auto) setScale(f)
    }
    update()
    const ro = new ResizeObserver(update)
    if (scrollRef.current) ro.observe(scrollRef.current)
    window.addEventListener('resize', update)
    return () => { ro.disconnect(); window.removeEventListener('resize', update) }
  }, [auto, computeFit])

  // 실제 요소 위치 측정 (프레임 원점 기준, 배율 보정)
  const measure = useCallback(() => {
    const root = innerRef.current
    if (!root) return
    const rr = root.getBoundingClientRect()
    const k = rr.width / FRAME_W
    const out: Rect[] = []
    root.querySelectorAll<HTMLElement>('[data-anno]').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      out.push({ no: el.dataset.anno!, x: (r.left - rr.left) / k, y: (r.top - rr.top) / k, w: r.width / k, h: r.height / k })
    })
    setRects(out)
    onRects(new Set(out.map((r) => r.no)))
  }, [onRects])

  useEffect(() => {
    measure()
    const t = setTimeout(measure, 300)
    document.fonts?.ready.then(measure)
    return () => clearTimeout(t)
  }, [id, measure, FRAME_H])

  // 설명 목록에서 선택하면 해당 영역이 보이게 프레임 안에서 이동
  useEffect(() => {
    if (!selected || !scrollRef.current) return
    const r = rects.find((x) => x.no === selected)
    if (!r) return
    const el = scrollRef.current
    const top = r.y * scale - 60
    const left = r.x * scale - 40
    if (top < el.scrollTop || top + 120 > el.scrollTop + el.clientHeight || left < el.scrollLeft || left > el.scrollLeft + el.clientWidth - 80) {
      el.scrollTo({ top: Math.max(0, top), left: Math.max(0, left), behavior: 'smooth' })
    }
  }, [selected, rects, scale])

  const setManual = (v: number) => { setAuto(false); setScale(Math.min(1.2, Math.max(Math.min(0.25, fit), v))) }
  const pct = Math.round(scale * 100)
  const minPct = Math.round(Math.min(0.25, fit) * 100)

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="no-print flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-[13px]">
        <button type="button" onClick={() => setManual(scale - 0.1)} aria-label="축소" className="grid size-8 place-items-center rounded-lg border border-neutral-200 hover:bg-neutral-50"><Minus size={15} /></button>
        <input
          type="range"
          aria-label="배율"
          min={minPct}
          max={120}
          value={pct}
          onChange={(e) => setManual(Number(e.target.value) / 100)}
          className="w-36 accent-emerald-600"
        />
        <button type="button" onClick={() => setManual(scale + 0.1)} aria-label="확대" className="grid size-8 place-items-center rounded-lg border border-neutral-200 hover:bg-neutral-50"><Plus size={15} /></button>
        <span className="w-12 text-center font-semibold tabular-nums">{pct}%</span>
        <button type="button" onClick={() => { setAuto(true); setScale(computeFit()) }} className={`ml-auto flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 ${auto ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-neutral-200 hover:bg-neutral-50'}`}>
          <Maximize2 size={14} /> 화면 맞춤
        </button>
      </div>
      <div ref={scrollRef} className="frame-scroll relative overflow-auto rounded-2xl border border-neutral-200 bg-[#eef0f2] p-4" style={{ maxHeight: 'max(84vh, 460px)' }}>
        <div className="relative mx-auto" style={{ width: FRAME_W * scale, height: FRAME_H * scale }}>
          <div ref={innerRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: FRAME_W, height: FRAME_H }}>
            <div ref={contentRef}><StaticScreen id={id} /></div>
          </div>
          <div className="absolute inset-0">
            {rects.map((r, i) => {
              const on = selected === r.no || hover === r.no
              return (
                <div key={i}>
                  {on && (
                    <div
                      className="pointer-events-none absolute rounded-md border-2 border-violet-600 bg-violet-500/10"
                      style={{ left: r.x * scale - 2, top: r.y * scale - 2, width: r.w * scale + 4, height: r.h * scale + 4 }}
                    />
                  )}
                  <button
                    type="button"
                    aria-label={`${r.no}번 구성 요소: ${comps.find((c) => c.no === r.no)?.label ?? ''}`}
                    onClick={() => onSelect(r.no)}
                    onMouseEnter={() => setHover(r.no)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(r.no)}
                    onBlur={() => setHover(null)}
                    className={`absolute grid size-6 place-items-center rounded-full text-[11px] font-bold text-white shadow ring-2 ring-white transition focus:outline-none focus-visible:ring-violet-300 ${selected === r.no ? 'scale-110 bg-violet-700' : 'bg-violet-600 hover:bg-violet-700'}`}
                    style={{ left: Math.max(2, r.x * scale - 10), top: Math.max(2, r.y * scale - 10) }}
                  >
                    {r.no}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
