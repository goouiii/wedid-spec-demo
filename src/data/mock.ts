/**
 * 시연용 Mock Data. 금액은 화면 정의서 예시값(1,550만~1,900만 · 250만~350만)에 맞춘 가상의 값이고,
 * 업체명은 실제 업체가 아닌 예시 이름이에요. (정책: 업체 사진 · 소개글 미사용, 공식 채널로만 연결)
 */

export const TODAY = new Date(2026, 10, 24) // 2026-11-24 고정
export const SOURCE_DATE = '2026.10.09'

export const REGIONS = [
  '서울 강남권', '서울 강남권 외', '경기', '인천', '부산', '대구', '광주',
  '대전', '울산', '강원', '충청', '전라', '경상', '제주',
] as const
export type Region = (typeof REGIONS)[number]

/** 지역별 예식장 비용 계수 (150~200명 기준 1,550만~1,900만 = 서울 강남권 외 1.0). 데이터 부족 권역은 null */
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

export const MOODS = ['화사한', '웅장한', '클래식', '그리너리', '럭셔리'] as const
export type Mood = (typeof MOODS)[number]

export type Band = 'basic' | 'standard' | 'premium' | 'luxury'
export const BANDS: { id: Band; name: string; label: string; range: [number, number]; parts: [number, number][] }[] = [
  { id: 'basic', name: '베이직', label: '250만원 이하', range: [190, 250], parts: [[80, 110], [75, 100], [35, 40]] },
  { id: 'standard', name: '스탠다드', label: '250 ~ 350만원', range: [250, 350], parts: [[110, 150], [100, 140], [40, 60]] },
  { id: 'premium', name: '프리미엄', label: '350 ~ 450만원', range: [350, 450], parts: [[150, 190], [140, 190], [60, 70]] },
  { id: 'luxury', name: '럭셔리', label: '450만원 이상', range: [450, 600], parts: [[190, 260], [190, 260], [70, 80]] },
]
export const bandOf = (b: Band) => BANDS.find((x) => x.id === b)!
export const MID_BAND: Band = 'standard'

const r50 = (v: number) => Math.round(v / 50) * 50

/** 예식장 예상 비용 (지역 홀 예상 비용의 가운데 50%) */
export function venueRange(region: Region, guests: Guests): { range: [number, number]; fallback: boolean } {
  const f = REGION_FACTOR[region] ?? 0.9
  const [lo, hi] = GUEST_RANGE[guests]
  // 대관료 500만 + 식대 7만 원 × 인원 (VAT · 필수 장식비 반영한 예시 계수)
  const base = (n: number) => (500 + 7 * n) * f
  return { range: [r50(base(lo)), r50(base(hi))], fallback: REGION_FACTOR[region] === null }
}

export type Fit = 'in' | 'maybe' | 'over'
export function fitOf(budget: number, [lo, hi]: [number, number]): Fit {
  if (hi <= budget) return 'in'
  if (lo <= budget) return 'maybe'
  return 'over'
}
export const FIT_TEXT: Record<Fit, string> = {
  in: '예산 안에 들어와요',
  maybe: '조건에 따라 예산을 넘을 수 있어요',
  over: '예산을 넘을 가능성이 높아요',
}

export const fmtMan = (v: number) => `${v.toLocaleString('ko-KR')}만`
export const fmtRange = ([a, b]: [number, number]) => `${fmtMan(a)} ~ ${fmtMan(b)}원`

/* ───────── 스드메 조합 (예시 업체) ───────── */
export interface Vendor { cat: '스튜디오' | '드레스' | '메이크업'; name: string; price: [number, number]; agencies: number; link: boolean }
export interface Combo { type: '실속형' | '균형형' | '프리미엄형'; total: [number, number]; vendors: Vendor[] }

const V = (cat: Vendor['cat'], name: string, price: [number, number], agencies: number, link = true): Vendor => ({ cat, name, price, agencies, link })
const combo = (type: Combo['type'], vendors: Vendor[]): Combo => ({
  type,
  vendors,
  total: [vendors.reduce((s, v) => s + v.price[0], 0), vendors.reduce((s, v) => s + v.price[1], 0)],
})

export const COMBOS: Record<Band, Combo[]> = {
  basic: [
    combo('실속형', [V('스튜디오', '예시 스튜디오 A', [80, 95], 4), V('드레스', '예시 드레스 B', [70, 85], 3), V('메이크업', '예시 메이크업 C', [35, 40], 5)]),
    combo('균형형', [V('스튜디오', '예시 스튜디오 D', [90, 105], 3), V('드레스', '예시 드레스 E', [80, 95], 2, false), V('메이크업', '예시 메이크업 F', [35, 45], 4)]),
  ],
  standard: [
    combo('실속형', [V('스튜디오', '예시 스튜디오 G', [105, 120], 5), V('드레스', '예시 드레스 H', [100, 115], 4), V('메이크업', '예시 메이크업 I', [40, 50], 6)]),
    combo('균형형', [V('스튜디오', '예시 스튜디오 J', [120, 135], 4), V('드레스', '예시 드레스 K', [110, 130], 3), V('메이크업', '예시 메이크업 L', [45, 55], 5)]),
    combo('프리미엄형', [V('스튜디오', '예시 스튜디오 M', [135, 150], 3), V('드레스', '예시 드레스 N', [125, 140], 2, false), V('메이크업', '예시 메이크업 O', [50, 60], 4)]),
  ],
  premium: [
    combo('실속형', [V('스튜디오', '예시 스튜디오 P', [150, 165], 4), V('드레스', '예시 드레스 Q', [140, 155], 3), V('메이크업', '예시 메이크업 R', [60, 65], 3)]),
    combo('균형형', [V('스튜디오', '예시 스튜디오 S', [160, 175], 3), V('드레스', '예시 드레스 T', [155, 170], 3), V('메이크업', '예시 메이크업 U', [60, 70], 4)]),
    combo('프리미엄형', [V('스튜디오', '예시 스튜디오 V', [175, 190], 2), V('드레스', '예시 드레스 W', [170, 190], 2), V('메이크업', '예시 메이크업 X', [65, 70], 2, false)]),
  ],
  luxury: [],
}

/* ───────── 예식장 후보 (예시 홀) ───────── */
export type HallType = '호텔' | '컨벤션' | '하우스' | '채플'
export interface Venue {
  id: string; name: string; hall: string; region: Region; gu: string; type: HallType
  min: number | null; max: number | null; open: boolean; rent: number | null; meal: number | null
  moods: Mood[]; link: boolean
}
const VN = (
  id: string, name: string, hall: string, region: Region, gu: string, type: HallType,
  min: number | null, max: number | null, open: boolean, rent: number | null, meal: number | null, moods: Mood[], link = true,
): Venue => ({ id, name, hall, region, gu, type, min, max, open, rent, meal, moods, link })

export const VENUES: Venue[] = [
  VN('v1', '예시 웨딩홀 가', '라온홀', '서울 강남권 외', '마포구', '컨벤션', 150, 250, true, 450, 6.5, ['화사한', '클래식']),
  VN('v2', '예시 호텔 나', '그랜드볼룸', '서울 강남권 외', '중구', '호텔', 200, 350, true, 900, 11, ['웅장한', '럭셔리']),
  VN('v3', '예시 컨벤션 다', '밝은홀', '서울 강남권 외', '영등포구', '컨벤션', 120, 220, true, 400, 6.2, ['화사한']),
  VN('v4', '예시 하우스 라', '가든홀', '서울 강남권 외', '성동구', '하우스', 80, 160, true, 550, 7.5, ['그리너리', '화사한']),
  VN('v5', '예시 웨딩홀 마', '클래식홀', '서울 강남권 외', '구로구', '컨벤션', 150, 300, false, null, null, ['클래식']),
  VN('v6', '예시 채플 바', '채플홀', '서울 강남권 외', '서대문구', '채플', 100, 200, true, 500, 6.8, ['클래식', '웅장한']),
  VN('v7', '예시 컨벤션 사', '크리스탈홀', '서울 강남권 외', '송파구', '컨벤션', 200, 300, true, 600, 7.2, ['럭셔리', '화사한']),
  VN('v8', '예시 웨딩홀 아', '루체홀', '서울 강남권 외', '동대문구', '컨벤션', 150, 250, false, null, null, ['화사한']),
  VN('v9', '예시 호텔 자', '스카이홀', '서울 강남권 외', '용산구', '호텔', 150, 250, true, 800, 9.5, ['럭셔리', '클래식']),
  VN('v10', '예시 하우스 차', '포레스트홀', '서울 강남권 외', '종로구', '하우스', 60, 120, true, 450, 7, ['그리너리']),
  VN('v11', '예시 컨벤션 카', '노블홀', '서울 강남권 외', '강서구', '컨벤션', 180, 280, true, 380, 5.9, ['웅장한']),
  VN('v12', '예시 웨딩홀 타', '모던홀', '서울 강남권 외', '은평구', '컨벤션', 150, 250, false, null, null, []),
  VN('v13', '예시 웨딩홀 파', '하늘홀', '서울 강남권 외', '노원구', '컨벤션', null, null, false, null, null, [], false),
  VN('v14', '예시 하우스 하', '정원홀', '서울 강남권 외', '광진구', '하우스', null, 180, true, null, 7, ['그리너리'], false),
  VN('v15', '예시 호텔 거', '로즈볼룸', '서울 강남권', '강남구', '호텔', 200, 350, true, 1100, 13, ['럭셔리']),
  VN('v16', '예시 웨딩홀 너', '르네홀', '서울 강남권', '서초구', '컨벤션', 150, 250, true, 650, 8, ['화사한', '클래식']),
  VN('v17', '예시 컨벤션 더', '센트럴홀', '경기', '성남시', '컨벤션', 150, 300, true, 380, 5.8, ['화사한']),
]

/** 필수 가격 · 인원 정보가 빠진 홀 (정보 부족 묶음, 정책 D-16) */
export const lacksInfo = (v: Venue) => v.min === null || v.max === null || (v.open && (v.rent === null || v.meal === null))

/** 참고 금액: 대관료 + 필수 장식비(50만) + 식대 × 과금 인원, VAT 10% */
export function venueRef(v: Venue, guests: Guests): [number, number] | null {
  if (!v.open || v.rent === null || v.meal === null) return null
  const [lo, hi] = GUEST_RANGE[guests]
  const n = (k: number) => Math.max(k, v.min ?? 0)
  const f = (k: number) => r50((v.rent! + 50 + v.meal! * n(k)) * 1.1)
  return [f(lo), f(hi)]
}

/* ───────── 로드맵 단계 ───────── */
export interface StageDef {
  name: string; short: string; d: [number, number]; money: 'venue' | 'sdm' | null
  todos: { text: string; owner: '함께' | '나' | '짝꿍' }[]; decide: string[]; tips: string[]
}
export const STAGES: StageDef[] = [
  {
    name: '예산 · 일정 합의, 상견례', short: '예산, 상견례', d: [365, 300], money: null,
    todos: [{ text: '예산 상한 합의하기', owner: '함께' }, { text: '양가 상견례 날짜 잡기', owner: '함께' }, { text: '예식 희망 시기 정하기', owner: '나' }],
    decide: ['총 예산과 양가 분담', '예식 희망 시기', '예식 규모'], tips: ['예산은 범위로 먼저 합의하기', '상견례 전 서로 기대치 나누기'],
  },
  {
    name: '예식장 계약', short: '예식장 계약', d: [300, 240], money: 'venue',
    todos: [{ text: '예산 상한 합의하기', owner: '함께' }, { text: '후보 예식장 3곳 투어 예약', owner: '나' }, { text: '부모님께 후보 공유', owner: '짝꿍' }],
    decide: ['예식 날짜, 시간대', '보증 인원', '식사 형태(뷔페 / 코스)'], tips: ['보증인원은 실제 예상보다 보수적으로', '계약금 환급 기준 확인', '박람회 당일 계약은 서두르지 않기'],
  },
  {
    name: '스드메 계약', short: '스드메 계약', d: [240, 180], money: 'sdm',
    todos: [{ text: '스드메 예산대 정하기', owner: '함께' }, { text: '스드메 조합 후보 상담 예약', owner: '나' }, { text: '드레스 투어 일정 잡기', owner: '짝꿍' }],
    decide: ['촬영 스타일 (스튜디오 · 야외)', '드레스 투어 샵 수', '원본 · 수정본 포함 여부'],
    tips: ['추가금(원본 · 드레스 업그레이드 · 헬퍼비) 미리 확인', '같은 업체도 대행사마다 가격이 달라요', '당일 계약 할인은 서두르지 않기'],
  },
  {
    name: '촬영, 신혼여행 예약', short: '촬영, 신혼여행', d: [180, 120], money: null,
    todos: [{ text: '스튜디오 촬영 날짜 확정', owner: '함께' }, { text: '신혼여행지 후보 정하기', owner: '함께' }, { text: '항공 · 숙소 예약', owner: '나' }],
    decide: ['신혼여행 시기와 지역', '촬영 의상 수'], tips: ['성수기 항공권은 일찍 예약하기'],
  },
  {
    name: '청첩장 전달, 하객 수 확정', short: '청첩장, 하객', d: [120, 30], money: null,
    todos: [{ text: '청첩장 문구 · 디자인 확정', owner: '함께' }, { text: '모바일 청첩장 발송', owner: '나' }, { text: '하객 명단 정리', owner: '짝꿍' }],
    decide: ['최종 하객 수', '청첩장 인쇄 수량'], tips: ['보증인원 변경 마감일을 예식장에 확인'],
  },
  {
    name: '최종 점검', short: '최종 점검', d: [30, 0], money: null,
    todos: [{ text: '예식 당일 타임라인 공유', owner: '함께' }, { text: '본식 리허설 · 드레스 가봉', owner: '나' }, { text: '잔금 일정 확인', owner: '짝꿍' }],
    decide: ['당일 도움 줄 사람', '잔금 결제 방식'], tips: ['당일 연락처 목록을 한 장으로 정리'],
  },
]

/* ───────── 날짜 ───────── */
const DAY = 86400000
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY)
export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY)
export const ym = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
export const ymKo = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월`
export const ymd = (d: Date) => `${ym(d)}.${String(d.getDate()).padStart(2, '0')}`
