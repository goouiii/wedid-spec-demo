import { HashRouter, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { SPEC } from './data/spec'
import { FlowPage } from './portal/Flow'
import { DocPage } from './portal/Doc'
import { DemoPage } from './portal/Demo'
import { RawPage } from './portal/Raw'

const first = SPEC.screens[0].id

function Top() {
  const loc = useLocation()
  if (loc.pathname.startsWith('/raw')) return null
  // 문서·시연은 각자 마지막으로 본 화면이 아닌, 현재 화면 ID를 이어받지 않는 독립 진입점
  const tab = (to: string, label: string, match: string) => (
    <NavLink
      to={to}
      className={() => `rounded-lg px-3.5 py-2 text-[14px] font-semibold ${loc.pathname.startsWith(match) ? 'bg-[#44695b] text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
    >
      {label}
    </NavLink>
  )
  return (
    <header className="no-print sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#44695b] font-serif text-[17px] font-semibold text-white">W</span>
          <div className="leading-tight">
            <p className="text-[15px] font-extrabold">{SPEC.service} <span className="font-semibold text-neutral-500">화면 정의서와 기능명세서</span></p>
            <p className="text-[12px] text-neutral-500">{SPEC.version} · {SPEC.project}</p>
          </div>
        </div>
        <nav className="flex gap-1" aria-label="메뉴">
          {tab('/flow', '전체 흐름 보기', '/flow')}
          {tab(`/docs/${first}`, '문서 보기', '/docs')}
          {tab(`/demo/${first}`, '시연하기', '/demo')}
        </nav>
        <button type="button" onClick={() => window.print()} className="ml-auto flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-2 text-[13px] hover:bg-neutral-50">
          <Printer size={15} /> 문서 인쇄
        </button>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#f5f6f7] text-neutral-900">
        <Top />
        <Routes>
          <Route path="/" element={<Navigate to="/flow" replace />} />
          <Route path="/flow" element={<FlowPage />} />
          <Route path="/docs" element={<Navigate to={`/docs/${first}`} replace />} />
          <Route path="/docs/:id" element={<DocPage />} />
          <Route path="/demo" element={<Navigate to={`/demo/${first}`} replace />} />
          <Route path="/demo/:id" element={<DemoPage />} />
          <Route path="/raw/:id" element={<RawPage />} />
          <Route path="*" element={<Navigate to="/flow" replace />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
