/**
 * 시연용 Mock Data — DESIGN 페이지(135-472) 값에 맞췄어요.
 * 업체 이름은 실제 업체와 섞이지 않도록 '예시 ○○'로 바꿨고(가격 · 주소가 가상이라서), 사진 자리는 일러스트로 대체했어요.
 */

export const TODAY = new Date(2026, 10, 15) // 2026-11-15 고정 (디자인의 D-334 기준)
export const SOURCE_DATE = '2026.10.09'

export const REGIONS = [
  '서울 강남권', '서울 강남권 외', '경기', '인천', '부산', '대구', '광주',
  '대전', '울산', '강원', '충청', '전라', '경상', '제주',
] as const
export type Region = (typeof REGIONS)[number]
export const shortRegion = (r: Region) => r.replace('서울 ', '')

const REGION_FACTOR: Record<Region, number | null> = {
  '서울 강남권': 1.3, '서울 강남권 외': 1, '경기': 0.86, '인천': 0.82, '부산': 0.84, '대구': 0.8, '광주': 0.74,
  '대전': 0.76, '울산': null, '강원': null, '충청': 0.72, '전라': 0.7, '경상': 0.74, '제주': null,
}
export const regionLacksData = (r: Region) => REGION_FACTOR[r] === null

export const GUESTS = ['100명 미만', '100~150명', '150~200명', '200~250명', '250~300명', '300명 이상', '아직 모르겠어요'] as const
export type Guests = (typeof GUESTS)[number]
const GUEST_RANGE: Record<Guests, [number, number]> = {
  '100명 미만': [70, 100], '100~150명': [100, 150], '150~200명': [150, 200], '200~250명': [200, 250],
  '250~300명': [250, 300], '300명 이상': [300, 400], '아직 모르겠어요': [150, 200],
}
export const guestRange = (g: Guests) => GUEST_RANGE[g]
export const guestLabel = (g: Guests) =>
  g === '아직 모르겠어요' ? '하객 수 미정 (150~200명 기준)' : g === '300명 이상' ? '하객 300명 이상 (300~400명 기준)' : `하객 ${g}`

export const MOODS = ['화사한', '웅장한', '럭셔리', '그리너리', '클래식'] as const
export type Mood = (typeof MOODS)[number]

export type Band = 'basic' | 'standard' | 'premium' | 'luxury'
export const BANDS: { id: Band; name: string; label: string; range: [number, number]; parts: [number, number][] }[] = [
  { id: 'basic', name: '베이직', label: '250만원 이하', range: [190, 250], parts: [[80, 100], [75, 105], [35, 45]] },
  { id: 'standard', name: '스탠다드', label: '250 ~ 350만원', range: [250, 350], parts: [[95, 120], [110, 135], [50, 65]] },
  { id: 'premium', name: '프리미엄', label: '350 ~ 450만원', range: [350, 450], parts: [[130, 170], [150, 200], [70, 80]] },
  { id: 'luxury', name: '럭셔리', label: '450만원 이상', range: [450, 600], parts: [[180, 240], [200, 270], [70, 90]] },
]
export const bandOf = (b: Band) => BANDS.find((x) => x.id === b)!
export const MID_BAND: Band = 'standard'

const r50 = (v: number) => Math.round(v / 50) * 50

/** 예식장 예상 비용: 지역 홀 예상 비용의 가운데 50% (서울 강남권 외 · 150~200명 = 1,550만~1,900만) */
export function venueRange(region: Region, guests: Guests): { range: [number, number]; fallback: boolean } {
  const f = REGION_FACTOR[region] ?? 1
  const [lo, hi] = GUEST_RANGE[guests]
  const base = (n: number) => (500 + 7 * n) * f
  return { range: [r50(base(lo)), r50(base(hi))], fallback: REGION_FACTOR[region] === null }
}
export const venueCount = (r: Region) => (REGION_FACTOR[r] === null ? 0 : r === '서울 강남권 외' ? 57 : Math.round(30 * (REGION_FACTOR[r] ?? 1)))

export type Fit = 'in' | 'maybe' | 'over'
export function fitOf(budget: number, [lo, hi]: [number, number]): Fit {
  if (hi <= budget) return 'in'
  if (lo <= budget) return 'maybe'
  return 'over'
}
export const FIT_TEXT: Record<Fit, string> = { in: '예산 안에 들어와요', maybe: '조건에 따라 예산을 넘을 수 있어요', over: '예산을 넘을 가능성이 높아요' }

export const fmtMan = (v: number) => `${v.toLocaleString('ko-KR')}만`
export const fmtRange = ([a, b]: [number, number], unit = '원') => (a === b ? `${fmtMan(a)} ${unit}` : `${fmtMan(a)} ~ ${fmtMan(b)}${unit}`)
export const fmtWon = (man: number) => `${(man * 10000).toLocaleString('ko-KR')}원`

/* ───────── 스드메 ───────── */
export type SdmCat = '스튜디오' | '드레스' | '메이크업'
export interface SdmVendor { id: string; cat: SdmCat; name: string; tag: string; price: [number, number]; agencies: number; combos: Band[] }
const SV = (id: string, cat: SdmCat, name: string, tag: string, price: [number, number], agencies: number, combos: Band[] = []): SdmVendor => ({ id, cat, name, tag, price, agencies, combos })

export const SDM_VENDORS: SdmVendor[] = [
  SV('s1', '스튜디오', '예시 스튜디오 가', '자연광 · 인물 중심', [95, 105], 3, ['standard']),
  SV('s2', '스튜디오', '예시 스튜디오 나', '실내 세트 다양', [105, 115], 2, ['standard']),
  SV('s3', '스튜디오', '예시 스튜디오 다', '야외 촬영 강점', [120, 130], 1, ['standard', 'premium']),
  SV('d1', '드레스', '예시 드레스 가', '실크 · 미니멀', [110, 120], 2, ['standard']),
  SV('d2', '드레스', '예시 드레스 나', '레이스 라인', [125, 140], 1, ['standard']),
  SV('d3', '드레스', '예시 드레스 다', '수입 드레스', [135, 150], 4, ['standard', 'premium']),
  SV('m0', '메이크업', '예시 메이크업 결', '내추럴', [40, 45], 3, ['basic']),
  SV('m4', '메이크업', '예시 메이크업 이음', '피부 표현 중심', [45, 50], 2, ['basic']),
  SV('m1', '메이크업', '예시 메이크업 담', '내추럴 · 단아', [50, 55], 1, ['standard']),
  SV('m2', '메이크업', '예시 메이크업 메이', '헤어 스타일링 강점', [60, 65], 4, ['standard']),
  SV('m3', '메이크업', '예시 메이크업 블룸', '화사한 톤', [65, 70], 3, ['standard', 'premium']),
]
const sv = (id: string) => SDM_VENDORS.find((v) => v.id === id)!

export interface Combo { type: '실속형' | '균형형' | '프리미엄형'; total: [number, number]; vendors: SdmVendor[] }
const combo = (type: Combo['type'], total: [number, number], ids: string[]): Combo => ({ type, total, vendors: ids.map(sv) })
export const COMBOS: Record<Band, Combo[]> = {
  basic: [combo('실속형', [195, 215], ['s1', 'd1', 'm0']), combo('균형형', [220, 245], ['s1', 'd1', 'm4'])],
  standard: [combo('실속형', [255, 280], ['s1', 'd1', 'm1']), combo('균형형', [290, 320], ['s2', 'd2', 'm2']), combo('프리미엄형', [320, 350], ['s3', 'd3', 'm3'])],
  premium: [combo('실속형', [355, 390], ['s3', 'd3', 'm3']), combo('균형형', [395, 420], ['s3', 'd3', 'm2']), combo('프리미엄형', [420, 450], ['s3', 'd3', 'm3'])],
  luxury: [],
}

/* ───────── 예식장 ───────── */
export type HallType = '호텔' | '컨벤션' | '하우스' | '채플' | '야외'
export interface Venue {
  id: string; name: string; hall: string; region: Region; gu: string; type: HallType
  cap: [number, number] | null; open: boolean; rent: number | null; meal: number | null; ref: [number, number] | null
  mood: Mood; moodNote: string; food: '뷔페' | '코스'; parking: boolean; note: string; address: string; phone: string
  status: '운영 중' | '휴업'; fit: 'in' | 'maybe' | null; lacks?: string
}
const VN = (v: Venue) => v
export const VENUES: Venue[] = [
  VN({ id: 'v1', name: '예시 웨딩홀 라온', hall: '채플홀', region: '서울 강남권 외', gu: '영등포구', type: '채플', cap: [120, 250], open: true, rent: 250, meal: 6.2, ref: [1300, 1610], mood: '클래식', moodNote: '밝은 톤의 채플', food: '뷔페', parking: false, note: '건물 주차 불가 · 인근 공영주차장 2시간 지원', address: '서울 영등포구 예시로 55', phone: '02-555-0505', status: '운영 중', fit: 'in' }),
  VN({ id: 'v2', name: '예시 컨벤션 아름', hall: '그랜드홀', region: '서울 강남권 외', gu: '마포구', type: '컨벤션', cap: [150, 300], open: true, rent: 300, meal: 5.9, ref: [1335, 1630], mood: '화사한', moodNote: '밝은홀', food: '뷔페', parking: true, note: '플라워 장식 기본 포함', address: '서울 마포구 예시로 202', phone: '02-555-0202', status: '운영 중', fit: 'in' }),
  VN({ id: 'v3', name: '예시 호텔 베이', hall: '그랜드볼룸', region: '서울 강남권 외', gu: '중구', type: '호텔', cap: [200, 400], open: true, rent: 600, meal: 8.5, ref: [2750, 2750], mood: '럭셔리', moodNote: '호텔', food: '코스', parking: true, note: '호텔 뷔페로 변경 가능 · 보증 인원 200명부터', address: '서울 중구 예시대로 10', phone: '02-555-0101', status: '운영 중', fit: 'maybe' }),
  VN({ id: 'v4', name: '예시 오페라홀', hall: '단독홀', region: '서울 강남권 외', gu: '송파구', type: '컨벤션', cap: [150, 300], open: true, rent: 450, meal: 6.8, ref: [1600, 1950], mood: '웅장한', moodNote: '높은 층고와 넓은 홀', food: '코스', parking: true, note: '층고 12m 단독홀', address: '서울 송파구 예시길 44', phone: '02-555-0404', status: '운영 중', fit: 'in' }),
  VN({ id: 'v5', name: '예시 컨벤션 그레이스', hall: '크리스탈홀', region: '서울 강남권 외', gu: '영등포구', type: '컨벤션', cap: [200, 350], open: false, rent: null, meal: null, ref: null, mood: '웅장한', moodNote: '밝은홀', food: '뷔페', parking: true, note: '', address: '서울 영등포구 예시로 88', phone: '02-555-0303', status: '운영 중', fit: null }),
  VN({ id: 'v6', name: '예시 웨딩하우스', hall: '가든홀', region: '서울 강남권 외', gu: '성동구', type: '하우스', cap: null, open: false, rent: null, meal: null, ref: null, mood: '그리너리', moodNote: '하우스', food: '뷔페', parking: true, note: '야외 가든 예식 가능 (4~10월)', address: '서울 성동구 예시로 12', phone: '02-555-0707', status: '운영 중', fit: null, lacks: '수용 인원 확인 필요' }),
  VN({ id: 'v7', name: '예시 블룸가든', hall: '야외홀', region: '서울 강남권 외', gu: '은평구', type: '야외', cap: [100, 200], open: false, rent: null, meal: null, ref: null, mood: '그리너리', moodNote: '식물 · 야외 가든 분위기', food: '코스', parking: true, note: '리모델링으로 휴업 중 (재개 일정 미정)', address: '서울 은평구 예시로 66', phone: '02-555-0606', status: '휴업', fit: null }),
]
export const venueById = (id: string) => VENUES.find((v) => v.id === id)
/** 필수 가격 · 인원 정보가 빠진 홀 → 맨 뒤 '정보가 부족한 예식장' 묶음 */
export const lacksInfo = (v: Venue) => !v.open || v.cap === null

/* ───────── 로드맵 단계 ───────── */
export interface StageDef {
  name: string; short: string; d: [number, number]; money: 'venue' | 'sdm' | null; icon: string
  todos: { text: string; owner: '함께' | '나' | '짝꿍' }[]; decide: string[]; tips: string[]
}
export const STAGES: StageDef[] = [
  { name: '예산 일정 합의, 상견례', short: '예산, 상견례', d: [365, 300], money: null, icon: 'check',
    todos: [{ text: '예산 상한 합의하기', owner: '함께' }, { text: '양가 상견례 날짜 잡기', owner: '함께' }, { text: '예식 희망 시기 정하기', owner: '나' }],
    decide: ['총 예산과 양가 분담', '예식 희망 시기'], tips: ['예산은 범위로 먼저 합의하기'] },
  { name: '예식장 계약', short: '예식장 계약', d: [300, 240], money: 'venue', icon: 'building',
    todos: [{ text: '예산 상한 합의하기', owner: '함께' }, { text: '후보 예식장 3곳 투어 예약', owner: '나' }, { text: '부모님께 후보 공유', owner: '짝꿍' }],
    decide: ['예식 날짜, 시간대', '보증 인원', '식사 형태 (뷔페 / 코스)'], tips: ['보증 인원은 실제 예상보다 보수적으로', '계약금 환급 기준 확인', '박람회 당일 계약은 서두르지 않기'] },
  { name: '스드메 계약', short: '스드메 계약', d: [240, 180], money: 'sdm', icon: 'shirt',
    todos: [{ text: '스튜디오·드레스·메이크업 후보 비교', owner: '함께' }, { text: '패키지 견적 2곳 이상 받기', owner: '나' }, { text: '드레스 투어 예약', owner: '짝꿍' }],
    decide: ['스드메 예산대', '스튜디오 촬영 스타일', '드레스 투어 업체 (2~3곳)'], tips: ['기본 상품에 원본·수정본이 포함되는지 확인', '드레스 업그레이드·헬퍼비 같은 추가금 확인', '플래너 경유가와 직접 계약가 비교하기'] },
  { name: '촬영, 신혼여행 예약', short: '촬영, 신혼여행', d: [180, 120], money: null, icon: 'camera',
    todos: [{ text: '스튜디오 촬영 날짜 확정', owner: '함께' }, { text: '신혼여행지 후보 정하기', owner: '함께' }, { text: '항공 · 숙소 예약', owner: '나' }],
    decide: ['신혼여행 시기와 지역'], tips: ['성수기 항공권은 일찍 예약하기'] },
  { name: '청첩장 전달, 하객 수 확정', short: '청첩장, 하객', d: [120, 30], money: null, icon: 'mail',
    todos: [{ text: '청첩장 문구 확정', owner: '함께' }, { text: '모바일 청첩장 발송', owner: '나' }, { text: '하객 명단 정리', owner: '짝꿍' }],
    decide: ['최종 하객 수'], tips: ['보증 인원 변경 마감일 확인'] },
  { name: '최종 점검', short: '최종 점검', d: [30, 0], money: null, icon: 'sparkles',
    todos: [{ text: '당일 타임라인 공유', owner: '함께' }, { text: '드레스 가봉', owner: '나' }, { text: '잔금 일정 확인', owner: '짝꿍' }],
    decide: ['당일 도움 줄 사람'], tips: ['당일 연락처를 한 장으로 정리'] },
]

/* ───────── 날짜 ───────── */
const DAY = 86400000
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY)
export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY)
export const ym = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
export const ymKo = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월`
