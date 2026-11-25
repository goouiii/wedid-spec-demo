import { useState } from 'react'
import { Check, Copy, Heart, Phone, Plus, Share2, X } from 'lucide-react'
import { MOODS, VENUES, fmtRange, venueById, type Venue } from '../data/mock'
import { stageBudget, useAnno, useDemo, type ScreenId } from '../demo/state'
import { AppShell, Back, Btn, BudgetBox, Card, Dot, Head, Page, Photo, Tag } from './ui'

const D: ScreenId[] = ['VENDOR-01']

export function VendorDetail() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const v = venueById(s.vendor) ?? VENUES[3]
  const closed = v.status === '휴업'
  const fav = s.fav.includes(v.id)
  const inCmp = s.compare.includes(v.id)
  const box = (label: string, children: React.ReactNode, extra?: React.ReactNode) => (
    <div className="rounded-[16px] border border-wd-line2 bg-white px-5 py-4"><p className="flex justify-between text-[12.5px] text-neutral-500">{label}{extra}</p><div className="mt-1.5 text-[15.5px] font-bold">{children}</div></div>
  )
  const similar = VENUES.filter((x) => x.id !== v.id && x.status === '운영 중').slice(0, 3)
  return (
    <Page>
      <AppShell crumbs={['준비 로드맵', '예식장 계약', '예식장 후보', v.name]} active="venue">
        <Back onClick={() => go('VENUE-01')}>예식장 후보로</Back>
        <div {...an(D, '01')} {...an('VENDOR-02', '01')} className="mt-5">
          <Photo mood={v.mood} label={v.mood} className="h-[300px] rounded-[22px]">{closed && <Tag tone="dark" className="absolute right-4 top-4">휴업</Tag>}</Photo>
          <p className="mt-6 text-[13px] font-bold text-wd-g">2단계 · 예식장 계약 · 업체 정보</p>
          <h1 className="mt-1.5 flex items-center gap-4 text-[32px] font-bold">{v.name}{closed ? <Dot tone="gray">휴업</Dot> : <Dot>운영 중</Dot>}</h1>
          <p className="mt-1.5 text-[15px] text-neutral-600">서울 {v.gu} · {v.mood} 분위기 · {v.food} · 주차 {v.parking ? '가능' : '불가'}</p>
        </div>
        <div className="mt-7 grid grid-cols-[1fr_340px] items-start gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div {...an(D, '02')} className="col-span-2">{box('주소', v.address, <button type="button" onClick={() => dispatch({ type: 'toast', text: '주소를 복사했어요' })} className="flex items-center gap-1 font-semibold text-wd-g"><Copy size={12} />복사</button>)}</div>
            <div {...an(D, '03')} className="col-span-2 grid grid-cols-2 gap-3">
              {box('연락처', <span className="text-wd-g">{v.phone}</span>)}
              {box('운영 여부', closed ? <span className="text-neutral-500">휴업</span> : <span className="text-wd-g">운영 중</span>)}
              {box('식사 형태', v.food)}
              {box('주차', v.parking ? '가능' : '불가')}
            </div>
            <div {...an(D, '04')} className="col-span-2 rounded-[16px] border border-wd-line2 bg-white px-5 py-4">
              <p className="text-[12.5px] text-neutral-500">분위기</p><p className="mt-1.5 text-[15.5px] font-bold">{v.mood} · {v.moodNote}</p>
              <div className="mt-3 flex gap-1.5">{MOODS.map((m) => <Tag key={m} tone={m === v.mood ? 'dark' : 'gray'}>{m}</Tag>)}</div>
            </div>
            <div {...an(D, '05')} {...an('VENDOR-02', '03')} className="col-span-2">{box('비고', v.note || '—')}</div>
          </div>
          <Card className="sticky top-6 px-6 py-6">
            {closed ? (
              <div {...an('VENDOR-02', '02')}>
                <p className="text-[18px] font-bold">휴업 중이라 선택할 수 없어요</p>
                <p className="mt-1.5 text-[13.5px] text-neutral-500">운영을 다시 시작하면 비교함에 담거나 계약할 업체로 정할 수 있어요.</p>
                <div className="mt-5 space-y-2"><Btn disabled className="h-12 w-full text-[14.5px]">+ 비교 담기</Btn><Btn disabled className="h-12 w-full text-[14.5px]">이 업체로 계약 진행하기</Btn></div>
              </div>
            ) : (
              <>
                <p className="text-[18px] font-bold">이 업체가 마음에 드나요?</p>
                <p className="mt-1.5 text-[13.5px] text-neutral-500">비교함에 담아 다른 곳과 비교하거나, 계약할 업체로 정할 수 있어요.</p>
                <div className="mt-5 space-y-2">
                  <Btn kind="outline" anno={an(D, '06')} onClick={() => dispatch({ type: 'toast', text: `전화 문의 ${v.phone} (시연)` })} className="h-12 w-full text-[14.5px]"><Phone size={15} />전화 문의 {v.phone}</Btn>
                  <Btn kind={inCmp ? 'soft' : 'outline'} anno={an(D, '07')} onClick={() => dispatch({ type: 'toggleCompare', id: v.id })} className="h-12 w-full text-[14.5px]">{inCmp ? <><Check size={15} />비교함에 담음 ({s.compare.length}/3)</> : <><Plus size={15} />비교 담기</>}</Btn>
                  <div {...an(D, '08')} className="grid grid-cols-2 gap-2">
                    <Btn kind="outline" aria-pressed={fav} onClick={() => dispatch({ type: 'toggleFav', id: v.id })} className="h-11 text-[14px]"><Heart size={15} className={fav ? 'fill-rose-500 text-rose-500' : ''} />{fav ? '저장됨' : '저장'}</Btn>
                    <Btn kind="outline" onClick={() => dispatch({ type: 'toast', text: '업체 링크를 복사했어요' })} className="h-11 text-[14px]"><Share2 size={15} />공유</Btn>
                  </div>
                  <Btn anno={an(D, '09')} onClick={() => { dispatch({ type: 'set', patch: { chosen: v.id, toast: `${v.name}을(를) 계약할 업체로 정했어요` } }); go('STEP-01') }} className="h-12 w-full text-[15px]">이 업체로 계약 진행하기</Btn>
                </div>
              </>
            )}
            <p {...an(D, '10')} className="mt-4 text-[12px] leading-5 text-neutral-500">정보는 업체가 제공한 내용이에요. 방문 전 연락처로 최신 운영 여부를 확인해 주세요.</p>
          </Card>
        </div>
        <div {...an(D, '11')} className="mt-12">
          <p className="text-[19px] font-bold">비슷한 예식장</p>
          <div className="mt-4 grid grid-cols-3 gap-4">{similar.map((x) => (
            <button type="button" key={x.id} onClick={() => { dispatch({ type: 'set', patch: { vendor: x.id } }); go('VENDOR-01') }} className="overflow-hidden rounded-[16px] border border-wd-line2 bg-white text-left">
              <Photo mood={x.mood} className="h-[130px]" />
              <div className="px-4 py-3.5"><p className="text-[12px] text-neutral-500">{x.mood} · 서울 {x.gu}</p><p className="mt-0.5 text-[15px] font-bold">{x.name}</p><p className="mt-1 text-[12.5px] text-neutral-500">{x.food} · 주차 {x.parking ? '가능' : '불가'}</p></div>
            </button>
          ))}</div>
        </div>
      </AppShell>
    </Page>
  )
}

const C: ScreenId[] = ['VENDOR-03']
const ROWS: { k: string; get: (v: Venue) => string; tone?: (v: Venue) => string; nodiff?: boolean }[] = [
  { k: '분위기', get: (v) => v.mood },
  { k: '운영 여부', get: (v) => v.status, tone: (v) => (v.status === '운영 중' ? 'text-wd-g font-semibold' : 'text-neutral-400') },
  { k: '식사 형태', get: (v) => v.food },
  { k: '주차', get: (v) => (v.parking ? '가능' : '불가'), tone: (v) => (v.parking ? 'font-semibold text-wd-g' : 'text-neutral-400') },
  { k: '주소', get: (v) => v.address },
  { k: '연락처', get: (v) => v.phone, tone: () => 'font-semibold text-wd-g', nodiff: true },
  { k: '비고', get: (v) => v.note || '—', nodiff: true },
]

export function Compare() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const [pick, setPick] = useState<string | null>(null)
  const list = s.compare.map((id) => venueById(id)!).filter(Boolean)
  const bud = stageBudget(s, 1)
  const cols = `120px repeat(3, minmax(0, 1fr))`
  const picked = list.find((v) => v.id === pick)
  return (
    <Page>
      <AppShell crumbs={['준비 로드맵', '예식장 계약', '예식장 후보', '비교하기']} active="compare">
        <Back onClick={() => go('VENUE-01')}>예식장 후보로</Back>
        <div className="mt-5"><Head anno={an(C, '01')} eyebrow="2단계 · 예식장 계약" title="업체 비교" desc={<>최대 3개 업체까지 비교할 수 있어요. 값이 다른 항목은 <mark className="bg-[#fbf3d5] px-1">노란색</mark>으로 표시돼요.</>} right={bud && <BudgetBox value={fmtRange(bud)} />} /></div>
        {list.length === 0 ? (
          <div {...an('VENDOR-04', '01')} className="mt-8 flex flex-col items-center rounded-[22px] border border-wd-line2 bg-white px-10 py-20 text-center">
            <span className="grid size-14 place-items-center rounded-[16px] bg-[#f1f1ee]"><Plus size={24} /></span>
            <p className="mt-6 text-[22px] font-bold">비교할 업체를 담아 주세요</p>
            <p className="mt-2 text-[14.5px] text-neutral-500">업체 찾기에서 [비교 담기]로 최대 3곳까지 담을 수 있어요</p>
            <Btn anno={an('VENDOR-04', '02')} onClick={() => go('VENUE-01')} className="mt-7 h-12 px-6 text-[15px]">업체 찾으러 가기</Btn>
          </div>
        ) : (
          <>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-[19px] font-bold">비교표</p>
              <div {...an(C, '02')} className="flex items-center gap-3 text-[14px]"><span className="text-neutral-600">선택한 업체 <b className="text-wd-ink">{list.length}</b>/3</span><Btn kind="outline" onClick={() => dispatch({ type: 'set', patch: { clearOpen: true } })} className="h-9 px-3.5 text-[13px]">전체 해제</Btn></div>
            </div>
            <div className="mt-3 overflow-hidden rounded-[20px] border border-wd-line2 bg-white">
              <div className="grid" style={{ gridTemplateColumns: cols }}>
                <div className="flex items-end bg-[#f6f6f2] px-4 pb-5 text-[13.5px] font-semibold text-neutral-600">업체명</div>
                {[0, 1, 2].map((k) => {
                  const v = list[k]
                  if (!v) {
                    return (
                      <div key={k} className="p-4">
                        <button type="button" {...(k === list.length ? an(C, '05') : {})} onClick={() => go('VENUE-01')} className="grid h-[140px] w-full place-items-center rounded-[14px] border border-wd-line2 text-center text-neutral-500 hover:border-neutral-300"><span><Plus size={18} className="mx-auto" /><b className="mt-2 block text-[13.5px] text-wd-ink">업체 더 담기</b><span className="text-[12px]">{3 - list.length}곳 더 담을 수 있어요</span></span></button>
                      </div>
                    )
                  }
                  return (
                    <div key={v.id} {...(k === 0 ? an(C, '03') : {})} className="p-4">
                      <Photo mood={v.mood} className="h-[140px] rounded-[14px]"><button type="button" aria-label={`${v.name} 빼기`} onClick={() => dispatch({ type: 'toggleCompare', id: v.id })} className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/50 text-white"><X size={14} /></button></Photo>
                      <p className="mt-3 text-[16px] font-bold">{v.name}</p>
                      <label {...(k === 0 ? an(C, '04') : {})} className="mt-2 flex cursor-pointer items-center gap-2 text-[13.5px] font-semibold"><input type="radio" name="pick" checked={pick === v.id} onChange={() => setPick(v.id)} className="size-4 accent-[#44695b]" />이 업체로 진행</label>
                    </div>
                  )
                })}
              </div>
              <div {...an(C, '06')}>
                {ROWS.map((r) => {
                  const vals = list.map(r.get)
                  const diff = !r.nodiff && list.length > 1 && new Set(vals).size > 1
                  return (
                    <div key={r.k} className={`grid border-t border-wd-line2 ${diff ? 'bg-[#fdfaf0]' : ''}`} style={{ gridTemplateColumns: cols }}>
                      <div className="flex items-center gap-1.5 bg-[#f6f6f2] px-4 py-3.5 text-[13.5px] font-semibold text-neutral-600">{r.k}{diff && <span className="rounded-[4px] bg-[#f6e7b5] px-1 text-[10.5px] font-bold text-[#8a6d1d]">다름</span>}</div>
                      {[0, 1, 2].map((k) => <div key={k} className={`px-4 py-3.5 text-[14px] ${list[k] && r.tone ? r.tone(list[k]) : ''}`}>{list[k] ? r.get(list[k]) : ''}</div>)}
                    </div>
                  )
                })}
              </div>
            </div>
            <div {...an(C, '07')} className="mt-5 flex justify-between">
              <Btn kind="outline" onClick={() => go('VENUE-01')} className="h-12 px-5 text-[15px]">‹ 업체 더 보기</Btn>
              <Btn disabled={!picked} onClick={() => { if (!picked) return; dispatch({ type: 'set', patch: { chosen: picked.id, toast: `${picked.name}을(를) 계약할 업체로 정했어요` } }); go('STEP-01') }} className="h-12 w-[280px] text-[15px]">{picked ? `${picked.name}로 진행하기` : '진행할 업체를 골라 주세요'}</Btn>
            </div>
          </>
        )}
      </AppShell>
    </Page>
  )
}
