import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { IMPL, SPEC, featureById, figmaUrl, notionUrl, screenById, type FeatureSpec } from '../data/spec'
import { AnnotatedFrame } from './Frame'
import type { ScreenId } from '../demo/state'

const order = SPEC.screens.map((s) => s.id)
const ID_RE = /(SCR-\d{2}(?:-(?:Q\d|D2|[A-F]))?)/g

/** 문장 안의 화면 ID를 문서 링크로 */
function Linked({ text }: { text: string }) {
  const parts = text.split(ID_RE)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 && screenById(p) ? (
          <Link key={i} to={`/docs/${p}`} className="font-semibold text-emerald-700 underline-offset-2 hover:underline" title={screenById(p)!.name}>{p}</Link>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function Marked({ text }: { text: string }) {
  const parts = text.split(/(확인 필요|원문 미기재)/g)
  return <>{parts.map((p, i) => (p === '확인 필요' || p === '원문 미기재' ? <mark key={i} className="rounded bg-amber-100 px-1 text-amber-800">{p}</mark> : <Linked key={i} text={p} />))}</>
}

const TAG: Record<string, string> = { 문구: 'bg-sky-50 text-sky-700', 데이터: 'bg-violet-50 text-violet-700', 상태: 'bg-amber-50 text-amber-700', 동작: 'bg-emerald-50 text-emerald-700' }
/** "[문구] ... [동작] ..." 형식을 태그별 줄로 */
function Desc({ text }: { text: string }) {
  const chunks = text.split(/\[(문구|데이터|상태|동작)\]\s*/).filter((x) => x !== '')
  if (chunks.length === 1) return <span className="block text-[13px] leading-relaxed text-neutral-600"><Marked text={text} /></span>
  const rows: { tag: string | null; body: string }[] = []
  for (let i = 0; i < chunks.length; i++) {
    if (TAG[chunks[i]]) { rows.push({ tag: chunks[i], body: chunks[i + 1] ?? '' }); i++ } else rows.push({ tag: null, body: chunks[i] })
  }
  return (
    <span className="mt-1 block space-y-1">
      {rows.map((r, i) => (
        <span key={i} className="flex gap-2 text-[13px] leading-relaxed text-neutral-700">
          {r.tag && <span className={`mt-[1px] h-fit shrink-0 rounded px-1.5 text-[11px] font-semibold ${TAG[r.tag]}`}>{r.tag}</span>}
          <span><Marked text={r.body.trim()} /></span>
        </span>
      ))}
    </span>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[14px] leading-relaxed">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2"><span className="mt-[9px] size-1 shrink-0 rounded-full bg-neutral-400" /><span><Linked text={t} /></span></li>
      ))}
    </ul>
  )
}

const IMPL_LABEL = { done: ['구현됨', 'bg-emerald-50 text-emerald-700 border-emerald-200'], mock: ['Mock 재현', 'bg-amber-50 text-amber-700 border-amber-200'], partial: ['일부 구현', 'bg-sky-50 text-sky-700 border-sky-200'] } as const

function FeatureCard({ f }: { f: FeatureSpec }) {
  const impl = IMPL[f.id]
  const rows: [string, string][] = [
    ['실행 조건', f.condition],
    ['데이터 · 로직', f.logic],
    ['성공 결과', f.success],
    ['예외 · 제한사항', f.exception],
    ['시나리오', f.req ? `기획서 핵심 시나리오 ${f.req}` : '원문 미기재'],
  ]
  return (
    <article id={`f-${f.id}`} className="avoid-break overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <header className="flex flex-wrap items-center gap-2 border-b border-neutral-100 px-5 py-3.5">
        <span className="rounded-md bg-neutral-900 px-2 py-0.5 font-mono text-[12px] font-semibold text-white">{f.id}</span>
        <h4 className="text-[16px] font-bold">{f.name}</h4>
        <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] text-neutral-600">{f.type}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${f.priority === 'P0' ? 'bg-rose-50 text-rose-700' : 'bg-orange-50 text-orange-700'}`}>{f.priority}</span>
        {notionUrl(f.id) && (
          <a href={notionUrl(f.id)} target="_blank" rel="noreferrer" className="no-print ml-auto flex items-center gap-1 text-[12px] text-neutral-500 hover:text-neutral-900">Notion 원문 <ExternalLink size={12} /></a>
        )}
      </header>
      <div className="px-5 py-4">
        <p className="text-[14px]">{f.desc}</p>
        <p className="mt-1 text-[12px] text-neutral-500">
          관련 화면: {f.screens.map((s, i) => <span key={s}>{i > 0 && ', '}<Link to={`/docs/${s}`} className="text-emerald-700 hover:underline">{screenById(s)?.name}({s})</Link></span>)}
        </p>
        <p className="mb-2 mt-4 text-[12px] font-bold text-neutral-500">기획된 동작 (기능명세서)</p>
        <dl className="divide-y divide-neutral-100 rounded-xl border border-neutral-100">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[130px_1fr] sm:gap-4">
              <dt className="text-[12px] font-semibold text-neutral-500">{k}</dt>
              <dd className="text-[13.5px] leading-relaxed"><Marked text={v} /></dd>
            </div>
          ))}
        </dl>
        {impl && (
          <div className="mt-3 flex flex-wrap items-start gap-2 rounded-xl bg-neutral-50 px-4 py-3">
            <span className="text-[12px] font-bold text-neutral-500">현재 데모 구현 상태</span>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${IMPL_LABEL[impl.state][1]}`}>{IMPL_LABEL[impl.state][0]}</span>
            <span className="basis-full text-[13px] text-neutral-700 sm:basis-auto sm:flex-1">{impl.note}</span>
          </div>
        )}
      </div>
    </article>
  )
}

function Card({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`avoid-break rounded-2xl border border-neutral-200 bg-white p-5 ${className}`}>
      {title && <h3 className="mb-3 text-[13px] font-bold tracking-wide text-neutral-500">{title}</h3>}
      {children}
    </section>
  )
}

export function DocPage() {
  const { id } = useParams()
  useEffect(() => { window.scrollTo({ top: 0 }) }, [id])
  const sc = id ? screenById(id) : undefined
  if (!sc) return <Navigate to={`/docs/${order[0]}`} replace />
  return <DocBody key={sc.id} id={sc.id} />
}

function DocBody({ id }: { id: string }) {
  const sc = screenById(id)!
  const [selected, setSelected] = useState<string | null>(null)
  const [found, setFound] = useState<Set<string>>(new Set())
  const listRef = useRef<HTMLOListElement>(null)
  const onRects = useCallback((s: Set<string>) => setFound(s), [])

  const pick = (no: string) => {
    setSelected(no)
    listRef.current?.querySelector(`[data-item="${no}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const idx = order.indexOf(sc.id)
  const prev = idx > 0 ? screenById(order[idx - 1]) : null
  const next = idx < order.length - 1 ? screenById(order[idx + 1]) : null
  const actions = sc.components.filter((c) => c.desc.includes('[동작]')).map((c) => `${c.no} ${c.label}: ${c.desc.split('[동작]')[1].split(/\[(?:문구|데이터|상태)\]/)[0].trim()}`)

  return (
    <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-8">
      <aside className="no-print sticky top-[88px] hidden h-[calc(100vh-110px)] w-60 shrink-0 overflow-y-auto xl:block">
        <p className="mb-2 px-2 text-[12px] font-bold text-neutral-500">화면 {SPEC.screens.length}개</p>
        <nav className="space-y-0.5">
          {SPEC.screens.map((s) => (
            <Link key={s.id} to={`/docs/${s.id}`} aria-current={s.id === sc.id ? 'page' : undefined} className={`block rounded-lg px-2.5 py-2 text-[13px] ${s.id === sc.id ? 'bg-emerald-50 font-bold text-emerald-800' : 'text-neutral-600 hover:bg-neutral-100'}`}>
              <span className="block font-mono text-[10.5px] opacity-70">{s.id}{s.type !== '화면' ? ` · ${s.type}` : ''}</span>
              {s.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 space-y-5">
        {/* A. 화면 개요 */}
        <section className="avoid-break rounded-2xl border border-neutral-200 bg-white">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-neutral-100 px-4 py-3 text-[12px]">
            {prev ? <Link to={`/docs/${prev.id}`} className="no-print flex items-center gap-1 justify-self-start text-neutral-500 hover:text-neutral-900"><ArrowLeft size={14} /> {prev.name}</Link> : <span />}
            <span className="text-neutral-400">문서 순서 {idx + 1} / {order.length}</span>
            {next ? <Link to={`/docs/${next.id}`} className="no-print flex items-center gap-1 justify-self-end text-neutral-500 hover:text-neutral-900">{next.name} <ArrowRight size={14} /></Link> : <span />}
          </div>
          <div className="px-6 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-emerald-700 px-2 py-0.5 font-mono text-[12px] font-semibold text-white">{sc.id}</span>
              <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] text-neutral-600">{sc.type}</span>
            </div>
            <h2 className="mt-2 text-[28px] font-extrabold tracking-tight">{sc.name}</h2>
            <p className="mt-1 text-[15px] text-neutral-600">{sc.purpose}</p>
            <dl className="mt-5 grid gap-x-8 gap-y-4 text-[13.5px] md:grid-cols-2">
              <div><dt className="mb-1 text-[12px] font-bold text-neutral-500">진입 경로</dt><dd><Bullets items={sc.entry} /></dd></div>
              <div><dt className="mb-1 text-[12px] font-bold text-neutral-500">종료 · 이동 경로</dt><dd><Bullets items={sc.exit} /></dd></div>
              <div><dt className="mb-1 text-[12px] font-bold text-neutral-500">서비스 Route</dt><dd className="font-mono text-[13px]">{sc.route}</dd></div>
              <div>
                <dt className="mb-1 text-[12px] font-bold text-neutral-500">원문 · 프레임 출처</dt>
                <dd className="space-y-0.5">
                  {notionUrl(sc.id) && <a href={notionUrl(sc.id)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-700 hover:underline">Notion 화면 정의서 행 <ExternalLink size={12} /></a>}
                  <a href={figmaUrl(sc.figmaNode)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-700 hover:underline">Figma 화면설계서 ({sc.figmaNode}) <ExternalLink size={12} /></a>
                  <p className="text-[12px] text-neutral-500">아래 프레임은 DESIGN 하이파이 스타일로 React에서 다시 그린 화면이에요</p>
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-[11.5px] text-neutral-400">이전 · 다음은 문서를 읽는 순서예요. 실제 서비스 이동은 '진입 경로 · 종료 · 이동 경로'를 보세요.</p>
          </div>
        </section>

        {/* B. 화면 설명 */}
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <Card title="주요 동작">{actions.length ? <Bullets items={actions} /> : <p className="text-[14px] text-neutral-500">클릭 동작 없음 (표시 전용)</p>}</Card>
          <Card title="상태 · 예외 처리">
            {sc.states.length ? (
              <table className="w-full text-left text-[13px]">
                <thead><tr className="border-b border-neutral-200 text-[11.5px] text-neutral-500"><th className="py-1.5 pr-3 font-semibold">상태</th><th className="py-1.5 pr-3 font-semibold">조건</th><th className="py-1.5 font-semibold">표시 · 처리</th></tr></thead>
                <tbody className="divide-y divide-neutral-100 align-top">
                  {sc.states.map((r, i) => (
                    <tr key={i}><td className="py-2 pr-3 font-semibold">{r.state}</td><td className="py-2 pr-3 text-neutral-600"><Marked text={r.cond} /></td><td className="py-2 leading-relaxed"><Marked text={r.show} /></td></tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-[14px] text-neutral-500"><Marked text="원문 미기재" /></p>}
            {sc.confirm.length > 0 && (
              <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3">
                <p className="text-[12px] font-bold text-amber-800">확인 필요</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[13px] text-amber-900">{sc.confirm.map((c, i) => <li key={i}><Linked text={c} /></li>)}</ul>
              </div>
            )}
          </Card>
        </div>

        {/* C. 프레임과 번호별 구성 요소 */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h3 className="mb-1 text-[13px] font-bold tracking-wide text-neutral-500">화면과 번호별 구성 요소</h3>
          <p className="mb-4 text-[12.5px] text-neutral-500">번호는 피그마 화면설계서 번호와 같아요{sc.type === '상태 변형' || sc.type === '모달' || sc.type === '패널' ? ' · 이 문서는 바뀌는 영역에만 번호를 달았어요' : ''}. 번호나 목록을 누르면 서로 강조돼요.</p>
          <div className="grid items-start gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <AnnotatedFrame id={sc.id as ScreenId} comps={sc.components} selected={selected} onSelect={pick} onRects={onRects} />
            <ol ref={listRef} className="space-y-2 2xl:max-h-[84vh] 2xl:overflow-y-auto 2xl:pr-1">
              {sc.components.map((c) => (
                <li key={c.no} data-item={c.no}>
                  <button
                    type="button"
                    onClick={() => setSelected(c.no)}
                    aria-pressed={selected === c.no}
                    className={`flex w-full gap-3 rounded-xl border px-4 py-3 text-left transition ${selected === c.no ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500' : 'border-neutral-200 hover:border-neutral-300'}`}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-violet-600 text-[11px] font-bold text-white">{c.no}</span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold">{c.label}</span>
                      <Desc text={c.desc} />
                      {!found.has(c.no) && <span className="mt-1 inline-block rounded bg-amber-100 px-1.5 text-[11px] text-amber-800">대응 영역 확인 필요</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* D. 기능명세 */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between px-1">
            <h3 className="text-[18px] font-extrabold">기능명세 <span className="text-neutral-400">{sc.features.length}</span></h3>
            <span className="text-[12px] text-neutral-500">관련 기능 ID: {sc.features.join(', ')}</span>
          </div>
          {sc.features.map((fid) => {
            const f = featureById(fid)
            return f ? <FeatureCard key={fid} f={f} /> : <p key={fid} className="rounded-xl bg-amber-50 p-4 text-[13px]">{fid}: 기능명세서에 없음 (확인 필요)</p>
          })}
        </section>
      </main>
    </div>
  )
}
