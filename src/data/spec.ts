import raw from './spec.json'
import type { ScreenId } from '../demo/state'

export interface Comp { no: string; label: string; desc: string }
export interface StateRow { state: string; cond: string; show: string }
export interface ScreenSpec {
  id: ScreenId; name: string; type: string; route: string; purpose: string; figmaNode: string; figmaFrame?: string
  entry: string[]; exit: string[]; related: string; components: Comp[]; states: StateRow[]; confirm: string[]; features: string[]
}
export interface FeatureSpec {
  id: string; name: string; screens: string[]; type: string; priority: string; req: string
  desc: string; condition: string; logic: string; success: string; exception: string
}

export const SPEC = raw as unknown as {
  service: string; tagline: string; version: string; project: string
  screens: ScreenSpec[]; features: FeatureSpec[]
}

export const screenById = (id: string) => SPEC.screens.find((s) => s.id === id)
export const featureById = (id: string) => SPEC.features.find((f) => f.id === id)

const N = 'https://app.notion.com/p/'
/** Notion 원문: 잇타 3팀 > PM > 화면 정의서 · 기능명세서 (MVP 11/14) */
export const NOTION_PAGE = `${N}4224aecd0f9b817d9642e08e4674c10d`
/** 노션 DB 행 id (화면 ID · 기능 ID → 페이지 id). 행을 새로 만든 뒤 채운다 */
export const NOTION: Record<string, string> = {}
export const notionUrl = (id: string) => (NOTION[id] ? `${N}${NOTION[id]}` : undefined)
export const figmaUrl = (node: string) => `https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=${node.replace(':', '-')}`

export type Impl = 'done' | 'mock' | 'partial'
/** 현재 데모 구현 상태 — 기획된 동작(명세)과 구분해서 표시 */
export const IMPL: Record<string, { state: Impl; note: string }> = {
  'FR-01': { state: 'done', note: '첫 화면 · 소개 화면에서 로그인 없이 바로 질문으로 이동.' },
  'FR-02': { state: 'done', note: '3개 화면 · 미정 선택 · 예산 범위 오류(Q-03) · 왼쪽 요약 즉시 반영까지 동작. 도중 이탈 복원은 미구현.' },
  'FR-03': { state: 'mock', note: '계산식 구조는 같고 금액은 예시 계수로 만든 Mock(서울 강남권 외 · 150~200명 = 1,550만~1,900만).' },
  'FR-05': { state: 'done', note: '예산대 4구간 · 산출 근거 펼침 · 지역 변경 시 스탠다드로 재설정 · 완료 후 잠금.' },
  'FR-06': { state: 'done', note: '3단계 판정 · 예산 없음 → 입력 후 넣기.' },
  'FR-08': { state: 'mock', note: '링크 복사는 토스트만, 공유받은 화면(COST-07)은 상태로 재현.' },
  'FR-09': { state: 'done', note: '6단계 · D-구간 · (예상) · 예식일 팝업 · 지난 단계 확인까지 동작. 오늘 날짜는 2026.11.15 고정.' },
  'FR-10': { state: 'done', note: '단계 상세 · 이전/다음 단계 이동.' },
  'FR-11': { state: 'mock', note: '실제 인증 없이 로그인 상태만 전환. 진입 이유별 문구 6종 · 이어서 실행 · 실패(시뮬레이터) 동작.' },
  'FR-12': { state: 'partial', note: '시연 탭 안에서만 유지, 새로고침하면 초기화.' },
  'FR-13': { state: 'done', note: '상단 계획 저장하기 · 로드맵 임시 보관 배너.' },
  'FR-14': { state: 'mock', note: '링크는 고정값. 초대 팝업 · 받는 화면 · 만료 · 이미 연결 · 합류까지 상태로 재현.' },
  'FR-15': { state: 'done', note: '체크 · 담당 배지 · 짝꿍 체크는 시뮬레이터.' },
  'FR-16': { state: 'mock', note: '예시 예식장 7곳으로 필터 · 정렬 · 목록/격자 · 정보 부족 묶음 · 지역 정보 부족 동작.' },
  'FR-17': { state: 'done', note: '실제 금액 → 남은 예산 · 충분/빠듯/넘을 수 있어요 · 금액 수정 · 예산 넣기.' },
  'FR-18': { state: 'done', note: '지난 단계를 건너뛴 다음 단계 · D-day.' },
  'FR-19': { state: 'mock', note: '예시 업체 조합(럭셔리는 0개로 빈 상태 확인 가능).' },
  'FR-20': { state: 'mock', note: '예시 스드메 업체 11곳으로 분류 · 조합 포함 · 관심 · 정렬 동작.' },
  'FR-21': { state: 'done', note: '사이드 메뉴 보조 항목 3개 · 비교 담은 수 표시.' },
  'FR-22': { state: 'done', note: '로그인 첫 화면 · 새 계획 시작 확인.' },
  'FR-D01': { state: 'done', note: '상세 · 주소 복사 · 비슷한 예식장 · 휴업 차단.' },
  'FR-D02': { state: 'done', note: '최대 3곳 · 다른 값 표시 · 전체 해제 확인.' },
  'FR-D03': { state: 'done', note: '♡ 저장 · 관심 업체만 필터 (시연 탭 안에서만 유지).' },
  'FR-D04': { state: 'done', note: '완료 취소 확인 → 진행중 + 금액 되살림.' },
  'FR-D05': { state: 'done', note: '단계 · 내용 · 담당 입력 후 추가.' },
  'FR-D06': { state: 'done', note: '홈 · 전체 완료 상태.' },
  'FR-D07': { state: 'done', note: '내 정보 · 연결 해제 · 로그아웃.' },
  'FR-D08': { state: 'mock', note: '카카오 SDK 없이 토스트만.' },
  'FR-D09': { state: 'done', note: '상세 · 비교표에서 고르면 단계 상세 안내 줄이 바뀜.' },
  'FR-D10': { state: 'done', note: '소개 페이지 (예시 콘텐츠).' },
  'FR-D11': { state: 'done', note: '패널 재계산 · 지역 변경 시 예산대 재설정 · 지난 단계 생기면 확인 팝업.' },
}

/** 핵심 흐름: 첫 방문 → 비용 확인 → 계획 저장 → 예식장 · 스드메 계약 (DESIGN 135-472 메인 플로우) */
export const CORE_FLOW: { id: ScreenId; note?: string }[] = [
  { id: 'MAIN-01' },
  { id: 'Q-01', note: '질문 5개' },
  { id: 'COST-02', note: '예산대 조정' },
  { id: 'ROAD-01', note: '비회원 로드맵' },
  { id: 'LOGIN-01', note: '계획 저장' },
  { id: 'ROAD-02' },
  { id: 'STEP-01', note: '예식장 계약' },
  { id: 'VENUE-01' },
  { id: 'VENDOR-03', note: '최대 3곳 비교' },
  { id: 'STEP-02', note: '실제 금액 입력' },
  { id: 'STEP-03', note: '스드메 계약' },
  { id: 'SDM-01' },
]
