import { ArrowUpRight, Check, Heart, Info, LayoutGrid, List, Lock, Sparkle } from 'lucide-react'
import { COMBOS, GUESTS, MOODS, REGIONS, SDM_VENDORS, SOURCE_DATE, VENUES, bandOf, fmtRange, lacksInfo, regionLacksData, venueRange, type HallType, type Region, type Guests, type Venue } from '../data/mock'
import { costs, stageBudget, useAnno, useDemo, type MoodPick, type ScreenId } from '../demo/state'
import { AppShell, Back, Btn, BudgetBox, Card, Chip, Head, Page, Photo, Switch, Tag, selCls, type Anno } from './ui'
import { BandPicker, ComboCards, ExtraCosts } from './parts'

const V1: ScreenId[] = ['VENUE-01']

function LoginNeeded({ kind }: { kind: 'venue' | 'sdm' }) {
  const { dispatch } = useDemo()
  const an = useAnno()
  const id: ScreenId = kind === 'venue' ? 'VENUE-04' : 'SDM-02'
  return (
    <div {...an(id, '01')} className="mt-10 flex flex-col items-center rounded-[24px] border border-wd-line2 bg-white px-10 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-[16px] bg-wd-gl text-wd-g"><Lock size={24} /></span>
      <p className="mt-6 text-[24px] font-bold">로그인하면 {kind === 'venue' ? '예식장' : '스드메'} 후보를 볼 수 있어요</p>
      <p className="mt-2 text-[15px] text-neutral-500">{kind === 'venue' ? '내 조건(지역 · 하객 수 · 예산 · 분위기)에 맞춰 공개 가격과 함께 정리해 드려요.' : '선택한 예산대 안의 스튜디오 · 드레스 · 메이크업 조합을 공개 단품가로 비교해 드려요.'}</p>
      <Btn anno={an(id, '02')} onClick={() => dispatch({ type: 'needLogin', reason: 'cand', goAfter: kind === 'venue' ? 'VENUE-01' : 'SDM-01' })} className="mt-8 h-12 px-7 text-[15px]">로그인하고 보기</Btn>
    </div>
  )
}

function rank(v: Venue, moods: MoodPick[]) {
  const m = moods.includes(v.mood) ? 0 : 1
  const f = v.fit === 'in' ? 0 : 1
  return m * 10 + f
}

function CardActions({ v, anno }: { v: Venue; anno?: Anno }) {
  const { s, dispatch } = useDemo()
  const inCmp = s.compare.includes(v.id)
  const fav = s.fav.includes(v.id)
  return (
    <div {...anno} className="flex items-center gap-2">
      <span className="mr-1 flex items-center gap-0.5 text-[12.5px] font-semibold text-neutral-700">공식 채널 보기 <ArrowUpRight size={13} /></span>
      <button type="button" aria-label={fav ? '관심 업체 해제' : '관심 업체로 저장'} aria-pressed={fav} onClick={(e) => { e.stopPropagation(); dispatch({ type: 'toggleFav', id: v.id }) }} className="grid size-8 place-items-center rounded-full border border-wd-line2"><Heart size={14} className={fav ? 'fill-rose-500 text-rose-500' : ''} /></button>
      <button type="button" aria-pressed={inCmp} disabled={v.status === '휴업'} onClick={(e) => { e.stopPropagation(); dispatch({ type: 'toggleCompare', id: v.id }) }} className={`flex h-8 items-center gap-1.5 rounded-[9px] border px-3 text-[12.5px] font-semibold disabled:opacity-40 ${inCmp ? 'border-wd-g bg-wd-g text-white' : 'border-wd-line2 bg-white'}`}>
        <span className={`grid size-3.5 place-items-center rounded-[3px] border ${inCmp ? 'border-white' : 'border-neutral-400'}`}>{inCmp && <Check size={10} strokeWidth={3} />}</span>{inCmp ? '비교 담음' : '비교 담기'}
      </button>
    </div>
  )
}

function PriceBox({ v, anno, unpub }: { v: Venue; anno?: Anno; unpub?: Anno }) {
  const { s } = useDemo()
  const r = venueRange(s.vf.region, s.vf.guests).range
  if (!v.open) {
    return (
      <div {...unpub} className="rounded-[14px] border border-wd-line2 bg-white px-4 py-3.5">
        <p className="flex items-center gap-1.5 border-b border-wd-line2 pb-2.5 text-[12.5px] font-semibold text-neutral-600"><Info size={13} />업체가 가격을 공개하지 않았어요</p>
        <p className="mt-2.5 text-[12px] text-neutral-500">이 지역 시세</p>
        <p className="mt-0.5 text-[19px] font-bold">{fmtRange(r, ' 원')}</p>
        <p className="mt-1.5 text-[11px] leading-4 text-neutral-500">같은 지역 · {s.vf.guests} 기준 예식장 예상 비용의 가운데 50%</p>
      </div>
    )
  }
  return (
    <div {...anno} className="rounded-[14px] bg-[#f3f6f3] px-4 py-3.5">
      <p className="flex justify-between text-[12.5px] text-neutral-500">대관료<b className="text-wd-ink">{v.rent}만 원</b></p>
      <p className="mt-1.5 flex justify-between text-[12.5px] text-neutral-500">식대 (1인)<b className="text-wd-ink">{v.meal}만 원</b></p>
      <p className="mt-3 border-t border-wd-line2 pt-2.5 text-[12px] font-semibold text-neutral-500">참고 금액</p>
      <p className="mt-0.5 text-[19px] font-bold">{v.ref && fmtRange(v.ref, ' 원')}</p>
      <p className="mt-1 text-[11px] leading-4 text-neutral-500">내 하객 {s.vf.guests} 기준, 보증 인원 · 필수 장식비 · VAT 반영</p>
    </div>
  )
}

function VenueRow({ v, first, firstLack, grid }: { v: Venue; first: boolean; firstLack: boolean; grid: boolean }) {
  const { dispatch, go } = useDemo()
  const an = useAnno()
  const open = () => { dispatch({ type: 'set', patch: { vendor: v.id } }); go(v.status === '휴업' ? 'VENDOR-02' : 'VENDOR-01') }
  const info = (
    <>
      <p className="text-[12px] text-neutral-500">{v.gu} · {v.type} · {v.cap ? `${v.cap[0]}~${v.cap[1]}명` : '수용 인원 정보 없음'}</p>
      <div className="mt-1 flex items-center justify-between gap-2"><p className="text-[18px] font-bold">{v.name}</p>{v.open ? <Tag tone="dark" className="!text-[11px]">● 가격 공개</Tag> : <span className="text-[11.5px] font-semibold text-neutral-400">● 가격 미공개</span>}</div>
      <p className="text-[13px] text-neutral-500">{v.hall}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {v.fit === 'in' && <Tag><Check size={11} />예산 안에 들어와요</Tag>}
        {v.fit === 'maybe' && <Tag tone="warn"><Info size={11} />조건에 따라 예산을 넘을 수 있어요</Tag>}
        <Tag tone="line">{v.mood} ({v.moodNote})</Tag>
        {v.lacks && <Tag tone="warn">{v.lacks}</Tag>}
      </div>
    </>
  )
  if (grid) {
    return (
      <div {...(first ? an('VENUE-02', '02') : {})} onClick={open} className="cursor-pointer overflow-hidden rounded-[18px] border border-wd-line2 bg-white">
        <Photo mood={v.mood} className="h-[170px]">{v.status === '휴업' && <Tag tone="dark" className="absolute left-3 top-3">휴업</Tag>}</Photo>
        <div className="px-5 pb-5 pt-4">{info}<div className="mt-4"><PriceBox v={v} /></div><div className="mt-4 flex justify-end"><CardActions v={v} /></div></div>
      </div>
    )
  }
  return (
    <div onClick={open} className="grid cursor-pointer grid-cols-[210px_1fr_250px] gap-5 rounded-[20px] border border-wd-line2 bg-white p-4 hover:border-neutral-300">
      <Photo mood={v.mood} className="h-[160px] rounded-[12px]">{v.status === '휴업' && <Tag tone="dark" className="absolute left-2.5 top-2.5">휴업</Tag>}</Photo>
      <div {...(first ? an(V1, '07') : {})} className="flex flex-col py-1">
        {info}
        <div className="mt-auto flex items-center justify-between pt-3"><span className="text-[12.5px] text-neutral-500">{v.food} · 주차 {v.parking ? '가능' : '불가'}</span><CardActions v={v} anno={first ? an(V1, '09') : undefined} /></div>
      </div>
      <PriceBox v={v} anno={first ? an(V1, '08') : undefined} unpub={firstLack ? an(V1, '11') : undefined} />
    </div>
  )
}

export function VenueList() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const vf = s.vf
  const set = (patch: Partial<typeof vf>) => dispatch({ type: 'set', patch: { vf: { ...vf, ...patch } } })
  const bud = stageBudget(s, 1)
  const noData = regionLacksData(vf.region)
  const list = VENUES.filter((v) => v.region === vf.region && (vf.type === '전체' || v.type === vf.type) && (!vf.priceOnly || v.open) && (!vf.favOnly || s.fav.includes(v.id)))
  const good = list.filter((v) => !lacksInfo(v)).sort((a, b) => rank(a, vf.moods) - rank(b, vf.moods))
  const lack = list.filter(lacksInfo).sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  const toggleMood = (m: MoodPick) => set({ moods: m === '상관없어요' ? ['상관없어요'] : vf.moods.includes(m) ? vf.moods.filter((x) => x !== m) : [...vf.moods.filter((x) => x !== '상관없어요'), m] })
  return (
    <Page>
      <AppShell crumbs={['준비 로드맵', '예식장 계약', '예식장 후보']} active="venue" top={an('VENUE-04', '03')}>
        <Back onClick={() => go('STEP-01')}>예식장 계약 단계로</Back>
        <div className="mt-5"><Head anno={an(V1, '01')} eyebrow="2단계 · 예식장 계약" title="예식장 후보" desc="조건에 맞는 예식장을 공개 가격으로 비교하고, 최대 3곳까지 담아 비교할 수 있어요." right={bud && <BudgetBox value={fmtRange(bud)} />} /></div>
        {!s.loggedIn ? <LoginNeeded kind="venue" /> : (
          <>
            <Card className="mt-7 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <div {...an(V1, '02')} {...an('VENUE-03', '01')} className="flex gap-2.5">
                  <select aria-label="지역" className={selCls} value={vf.region} onChange={(e) => set({ region: e.target.value as Region })}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
                  <select aria-label="하객 수" className={selCls} value={vf.guests} onChange={(e) => set({ guests: e.target.value as Guests })}>{GUESTS.filter((g) => g !== '아직 모르겠어요').map((g) => <option key={g} value={g}>하객 {g}</option>)}</select>
                  <select aria-label="홀 유형" className={selCls} value={vf.type} onChange={(e) => set({ type: e.target.value as '전체' | HallType })}>{['전체', '호텔', '컨벤션', '하우스', '채플', '야외'].map((t) => <option key={t} value={t}>홀 유형: {t}</option>)}</select>
                </div>
                <div {...an(V1, '03')} className="ml-3 flex gap-4"><Switch on={vf.priceOnly} onClick={() => set({ priceOnly: !vf.priceOnly })} label="가격 공개만 보기" /><Switch on={vf.favOnly} onClick={() => set({ favOnly: !vf.favOnly })} label="관심 업체만" /></div>
                <div {...an(V1, '04')} {...an('VENUE-02', '01')} className="ml-auto flex rounded-[10px] border border-wd-line2 p-0.5">
                  <button type="button" aria-label="목록 보기" aria-pressed={!vf.grid} onClick={() => set({ grid: false })} className={`grid size-8 place-items-center rounded-[8px] ${!vf.grid ? 'bg-[#f1f1ee]' : ''}`}><List size={15} /></button>
                  <button type="button" aria-label="격자 보기" aria-pressed={vf.grid} onClick={() => set({ grid: true })} className={`grid size-8 place-items-center rounded-[8px] ${vf.grid ? 'bg-[#f1f1ee]' : ''}`}><LayoutGrid size={15} /></button>
                </div>
              </div>
              <div {...an(V1, '05')} className="mt-4 flex items-center gap-2">
                <span className="mr-2 text-[13.5px] font-bold">분위기</span>
                {[...MOODS, '상관없어요' as const].map((m) => <Chip key={m} on={vf.moods.includes(m)} onClick={() => toggleMood(m)}>{m}</Chip>)}
                <span className="ml-2 text-[12px] text-neutral-500">분위기는 순서에만 반영돼요</span>
              </div>
              <p className="mt-3 flex items-center gap-1 text-[12px] text-neutral-500"><Info size={12} />기본값은 내 계획 조건이에요 · 여기서 바꿔도 계획은 그대로예요</p>
            </Card>
            {noData ? (
              <div {...an('VENUE-03', '02')} className="mt-5 flex flex-col items-center rounded-[20px] border border-wd-line2 bg-white px-10 py-16 text-center">
                <p className="text-[21px] font-bold">이 지역 예식장 정보는 아직 모으는 중이에요</p>
                <p className="mt-2 text-[14.5px] text-neutral-500">{vf.region} 예식장 시세는 공공 통계 기준으로 {fmtRange(venueRange(vf.region, vf.guests).range, ' 원')}이에요.</p>
                <Btn kind="outline" onClick={() => set({ region: s.a.region ?? '서울 강남권 외' })} className="mt-6 h-11 px-5 text-[14px]">내 계획 지역으로</Btn>
              </div>
            ) : (
              <>
                <div {...an(V1, '06')} className="mt-6">
                  <p className="text-[14px]"><b>내 조건에 맞는 순</b> <span className="text-neutral-500">ⓘ 조건에 맞는 예식장 {list.length}곳 · {SOURCE_DATE} 기준</span></p>
                  <p className="mt-1 text-[12px] text-neutral-500">공개 가격 기준 · 출처: 참가격 / 업체 홈페이지</p>
                </div>
                {list.length === 0 && <p className="mt-6 rounded-[16px] bg-white px-6 py-10 text-center text-[14.5px] text-neutral-500">조건에 맞는 예식장이 없어요. 필터를 바꿔 보세요.</p>}
                <div className={`mt-4 ${vf.grid ? 'grid grid-cols-3 gap-4' : 'space-y-3'}`}>{good.map((v, k) => <VenueRow key={v.id} v={v} first={k === 0} firstLack={false} grid={vf.grid} />)}</div>
                {lack.length > 0 && (
                  <>
                    <div {...an(V1, '10')} className="mt-6 rounded-[14px] border border-wd-line2 bg-[#f6f6f2] px-5 py-3.5"><p className="text-[14px] font-bold">정보가 부족한 예식장 ({lack.length}곳) · 가나다순</p><p className="mt-0.5 text-[12.5px] text-neutral-500">필수 가격 · 인원 정보가 없어 순서의 맨 뒤에 모았어요</p></div>
                    <div className={`mt-3 ${vf.grid ? 'grid grid-cols-3 gap-4' : 'space-y-3'}`}>{lack.map((v, k) => <VenueRow key={v.id} v={v} first={false} firstLack={k === 0} grid={vf.grid} />)}</div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </AppShell>
    </Page>
  )
}

const D1: ScreenId[] = ['SDM-01']
export function SdmList() {
  const { s, dispatch, go } = useDemo()
  const an = useAnno()
  const sf = s.sf
  const set = (patch: Partial<typeof sf>) => dispatch({ type: 'set', patch: { sf: { ...sf, ...patch } } })
  const c = costs(s)
  const inBand = new Set(COMBOS[s.band].flatMap((x) => x.vendors.map((v) => v.id)))
  const list = SDM_VENDORS.filter((v) => (sf.cat === '전체' || v.cat === sf.cat) && (!sf.inCombo || inBand.has(v.id)) && (!sf.favOnly || s.fav.includes(v.id))).sort((a, b) => (sf.sort === 'low' ? a.price[0] - b.price[0] : b.price[0] - a.price[0]))
  return (
    <Page>
      <AppShell crumbs={['준비 로드맵', '스드메 계약', '스드메 후보']} active="sdm" top={an('SDM-02', '03')}>
        <Back onClick={() => go('STEP-03')}>스드메 계약 단계로</Back>
        <div className="mt-5"><Head anno={an(D1, '01')} eyebrow="3단계 · 스드메 계약" title="스드메 후보" desc="선택한 예산대 안의 스튜디오 · 드레스 · 메이크업 조합을 공개 단품가로 비교해요." right={<BudgetBox value={fmtRange(c.sdm)} />} /></div>
        {!s.loggedIn ? <LoginNeeded kind="sdm" /> : (
          <>
            <Card className="mt-7 px-7 py-7">
              <p className="text-[19px] font-bold">예산대별 스드메 조합</p>
              <p className="mt-1.5 text-[13px] text-neutral-500">예산대를 바꾸면 아래 조합이 바로 바뀌어요 · 기본값: 내 계획의 예산대</p>
              <div className="mt-6"><BandPicker anno={an(D1, '02')} compact /></div>
              <p className="mt-6 text-[15px] font-bold">{bandOf(s.band).name} 예산대 조합 {COMBOS[s.band].length}개</p>
              <p className="text-[12.5px] text-neutral-500">서울 공개 가격 기준 · {SOURCE_DATE} 기준</p>
              <ComboCards band={s.band} detailed anno={an(D1, '03')} />
              <ExtraCosts more anno={an(D1, '04')} />
              <p className="mt-4 text-[11.5px] text-neutral-500">공개 단품가 기준 · 출처: 참가격 결혼준비대행업체 공개 가격 · 같은 업체도 대행사에 따라 가격이 다를 수 있어요 · 실제 견적은 날짜, 옵션, 업체에 따라 달라질 수 있어요.</p>
            </Card>
            <div className="mt-12 border-t border-wd-line pt-10">
              <p className="text-[22px] font-bold">스드메 업체 둘러보기</p>
              <p className="mt-1.5 text-[13.5px] text-neutral-500">공개 단품가 기준 · 사진 · 소개글은 업체 공식 채널에서 확인해요</p>
              <div {...an(D1, '05')} className="mt-5 flex items-center gap-2">
                {(['전체', '스튜디오', '드레스', '메이크업'] as const).map((k) => <Chip key={k} on={sf.cat === k} onClick={() => set({ cat: k })}>{k}</Chip>)}
                <span className="ml-3 flex gap-4"><Switch on={sf.inCombo} onClick={() => set({ inCombo: !sf.inCombo })} label="이 예산대 조합 업체만" /><Switch on={sf.favOnly} onClick={() => set({ favOnly: !sf.favOnly })} label="관심 업체만" /></span>
                <select aria-label="정렬" className={`${selCls} ml-auto`} value={sf.sort} onChange={(e) => set({ sort: e.target.value as 'low' | 'high' })}><option value="low">낮은 가격순</option><option value="high">높은 가격순</option></select>
              </div>
              <p className="mt-5 text-[13.5px]"><b>{sf.sort === 'low' ? '낮은 가격순' : '높은 가격순'}</b> <span className="text-neutral-500">업체 {list.length}곳 · {SOURCE_DATE} 기준</span></p>
              <div className="mt-3 space-y-3">
                {list.map((v, k) => (
                  <div key={v.id} className="grid grid-cols-[190px_1fr_260px] gap-5 rounded-[20px] border border-wd-line2 bg-white p-4">
                    <div className="grid h-[150px] place-items-center rounded-[12px] bg-[#eef3ef] text-center text-wd-g"><div><Sparkle size={24} className="mx-auto" /><p className="mt-2 text-[12.5px] font-bold">{v.cat}</p></div></div>
                    <div {...(k === 0 ? an(D1, '06') : {})} className="flex flex-col py-1">
                      <p className="text-[12px] text-neutral-500">{v.cat} · 서울 강남구 · 공개 대행사 {v.agencies}곳</p>
                      <div className="mt-1 flex items-center justify-between"><p className="text-[18px] font-bold">{v.name}</p><Tag tone="dark" className="!text-[11px]">● 가격 공개</Tag></div>
                      <p className="text-[13px] text-neutral-500">{v.tag}</p>
                      <div className="mt-2.5 flex gap-1.5">{v.combos.includes(s.band) && <Tag><Check size={11} />{bandOf(s.band).name} 조합에 포함</Tag>}<Tag tone="line">기본 상품 기준</Tag></div>
                      <div {...(k === 0 ? an(D1, '08') : {})} className="mt-auto flex items-center justify-between pt-3"><span className="text-[12px] text-neutral-500">사진 · 소개글은 공식 채널에서</span><span className="flex items-center gap-2"><span className="flex items-center gap-0.5 text-[12.5px] font-semibold">공식 채널 보기 <ArrowUpRight size={13} /></span><button type="button" aria-label="관심 업체" aria-pressed={s.fav.includes(v.id)} onClick={() => dispatch({ type: 'toggleFav', id: v.id })} className="grid size-8 place-items-center rounded-full border border-wd-line2"><Heart size={14} className={s.fav.includes(v.id) ? 'fill-rose-500 text-rose-500' : ''} /></button></span></div>
                    </div>
                    <div {...(k === 0 ? an(D1, '07') : {})} className="rounded-[14px] bg-[#f3f6f3] px-4 py-3.5">
                      <p className="flex justify-between text-[12.5px] text-neutral-500">최저 단품가<b className="text-wd-ink">{v.price[0]}만 원</b></p>
                      <p className="mt-1.5 flex justify-between text-[12.5px] text-neutral-500">공개 대행사<b className="text-wd-ink">{v.agencies}곳</b></p>
                      <p className="mt-3 border-t border-wd-line2 pt-2.5 text-[12px] font-semibold text-neutral-500">공개 단품가 범위</p>
                      <p className="mt-0.5 text-[19px] font-bold">{fmtRange(v.price, ' 원')}</p>
                      <p className="mt-1 text-[11px] leading-4 text-neutral-500">대행사별 공개 가격의 최소~최대 · 플래너 경유가 · 추가 옵션 별도</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </AppShell>
    </Page>
  )
}
