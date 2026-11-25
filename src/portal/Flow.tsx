import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, FileText, Play } from 'lucide-react'
import { CORE_FLOW, NOTION_PAGE, SPEC, screenById } from '../data/spec'
import { ScaledStatic } from './Static'

/** DESIGN 135-472의 6개 섹션 */
const GROUPS: { title: string; ids: string[] }[] = [
  { title: '01 첫 방문 · 비용 계산', ids: ['MAIN-01', 'MAIN-02', 'Q-01', 'Q-02', 'Q-03', 'Q-04', 'COST-01', 'COST-02', 'COST-03', 'COST-04', 'COST-05', 'COST-06', 'COST-07', 'ROAD-01', 'LOGIN-01'] },
  { title: '02 로드맵 · 단계 진행', ids: ['ROAD-02', 'ROAD-03', 'ROAD-04', 'ROAD-05', 'ROAD-06', 'ROAD-07', 'STEP-01', 'STEP-02', 'STEP-03', 'STEP-04', 'STEP-05', 'STEP-06', 'STEP-07'] },
  { title: '03 업체 찾기 · 비교', ids: ['VENUE-01', 'VENUE-02', 'VENUE-03', 'VENUE-04', 'VENDOR-01', 'VENDOR-02', 'VENDOR-03', 'VENDOR-04', 'VENDOR-05', 'SDM-01', 'SDM-02'] },
  { title: '04 재방문 (로그인)', ids: ['MAIN-03', 'MAIN-04', 'HOME-01', 'HOME-02', 'HOME-03', 'COST-08'] },
  { title: '05 짝꿍 초대 · 내 정보', ids: ['INVITE-01', 'INVITE-02', 'INVITE-03', 'INVITE-04', 'INVITE-05', 'MY-01', 'MY-02'] },
  { title: '06 로그인 팝업', ids: ['LOGIN-02', 'LOGIN-03', 'LOGIN-04', 'LOGIN-05'] },
]

export function FlowPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-8">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-extrabold">전체 흐름 보기</h2>
            <p className="mt-1 max-w-[760px] text-[14px] text-neutral-600">{SPEC.tagline}. 화면 {SPEC.screens.length}개 · 기능 {SPEC.features.length}개를 카드에서 문서와 시연으로 각각 열 수 있어요.</p>
          </div>
          <a href={NOTION_PAGE} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-2 text-[13px] hover:bg-neutral-50">Notion 원문 (화면 정의서 · 기능명세서) <ExternalLink size={13} /></a>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-[12px] font-bold text-neutral-500">핵심 흐름 · 첫 방문부터 스드메 계약까지 <span className="font-normal text-neutral-400">(DESIGN 135-472 메인 플로우)</span></p>
          <ol className="flex flex-wrap items-stretch gap-2">
            {CORE_FLOW.map((c, i) => {
              const s = screenById(c.id)!
              return (
                <li key={c.id} className="flex items-center gap-2">
                  <Link to={`/docs/${c.id}`} className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 hover:bg-emerald-100">
                    <p className="font-mono text-[10.5px] text-neutral-500">{s.id}</p>
                    <p className="text-[13px] font-bold">{s.name}</p>
                    {c.note && <p className="text-[11px] text-neutral-500">{c.note}</p>}
                  </Link>
                  {i < CORE_FLOW.length - 1 && <ArrowRight size={16} className="shrink-0 text-neutral-400" />}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {GROUPS.map((g) => {
        const list = g.ids.map((x) => screenById(x)!).filter(Boolean)
        return (
          <section key={g.title}>
            <h3 className="mb-3 px-1 text-[16px] font-extrabold">{g.title} <span className="text-neutral-400">{list.length}</span></h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {list.map((s) => (
                <li key={s.id} className="flex min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white p-4">
                  <p className="flex items-center gap-2 text-[11px] text-neutral-500"><span className="font-mono font-semibold text-neutral-700">{s.id}</span>· {s.type}</p>
                  <h4 className="mt-0.5 text-[16px] font-bold">{s.name}</h4>
                  <div className="my-3 overflow-hidden rounded-xl bg-[#eef0f2] p-3">
                    <ScaledStatic id={s.id} scale={0.22} />
                  </div>
                  <p className="text-[13px] text-neutral-700">{s.purpose}</p>
                  <p className="mb-1 mt-3 text-[11px] font-bold text-neutral-500">다음 이동 경로</p>
                  <ul className="mb-4 space-y-0.5 text-[12px] text-neutral-600">
                    {s.exit.map((e) => <li key={e}>· {e}</li>)}
                  </ul>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <Link to={`/docs/${s.id}`} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-neutral-300 text-[13px] font-semibold hover:bg-neutral-50"><FileText size={15} /> 문서 보기</Link>
                    <Link to={`/demo/${s.id}`} className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#44695b] text-[13px] font-semibold text-white hover:bg-[#375749]"><Play size={15} /> 시연하기</Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
