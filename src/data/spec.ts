import raw from './spec.json'
import type { ScreenId } from '../demo/state'

export interface Comp { no: string; label: string; desc: string }
export interface StateRow { state: string; cond: string; show: string }
export interface ScreenSpec {
  id: ScreenId; name: string; type: string; route: string; purpose: string; figmaNode: string
  entry: string[]; exit: string[]; related: string[]; components: Comp[]; states: StateRow[]; confirm: string[]; features: string[]
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
export const NOTION: Record<string, string> = {
  'SCR-01': '4224aecd0f9b819fb866e079796d3b2f',
  'SCR-01-B': '4224aecd0f9b81e3ada8c15811b46ab6',
  'SCR-02-Q1': '4224aecd0f9b81bab9ecc4862f95654e',
  'SCR-02-Q2': '4224aecd0f9b8160977cc1f4215359e1',
  'SCR-02-Q3': '4224aecd0f9b8107a059ca27543246d3',
  'SCR-02-Q4': '4224aecd0f9b81d4b994f669f65834cd',
  'SCR-02-Q5': '4224aecd0f9b8191a08ffb32683b6402',
  'SCR-02-E': '4224aecd0f9b81b880d2d1a9a89142bd',
  'SCR-03': '4224aecd0f9b811f88aac6b009871ed0',
  'SCR-03-B': '4224aecd0f9b8139b288f4f3e754731c',
  'SCR-03-C': '4224aecd0f9b81a5828bf62332622ee6',
  'SCR-03-E': '4224aecd0f9b81089065cdc610a437a2',
  'SCR-03-F': '4224aecd0f9b8134b6a7e4f3bcace1d6',
  'SCR-06': '4224aecd0f9b81e1ab1ec9716483b40a',
  'SCR-06-B': '4224aecd0f9b81f890e5c8f0307bcf11',
  'SCR-06-C': '4224aecd0f9b81ad96a6d8370a7cc907',
  'SCR-06-D': '4224aecd0f9b81b38fb1cc7800e395cd',
  'SCR-06-D2': '4224aecd0f9b81629392fffc1dee2082',
  'SCR-06-E': '4224aecd0f9b8140b8fcd260515026be',
  'SCR-06-F': '4224aecd0f9b81bd8990f661accca48b',
  'SCR-09': '4224aecd0f9b812ba5aee0495335ac6a',
  'SCR-10': '4224aecd0f9b81e28471f02dc275f5ac',
  'SCR-11': '4224aecd0f9b81c6b5caf554eb09bac9',
  'SCR-11-B': '4224aecd0f9b816a8edac52b7f24925f',
  'FR-01': '4224aecd0f9b81069b53f353ad1af72b',
  'FR-02': '4224aecd0f9b8117b84ff318e95dbef3',
  'FR-03': '4224aecd0f9b814eb339e3dbb569539f',
  'FR-05': '4224aecd0f9b813bb5bad158310af218',
  'FR-06': '4224aecd0f9b814cbeffe0cfee77e378',
  'FR-08': '4224aecd0f9b81f488b0c9d5dbdfaad5',
  'FR-09': '4224aecd0f9b81fda691d6e9f0c696b7',
  'FR-10': '4224aecd0f9b8162b731e3f4429582cd',
  'FR-11': '4224aecd0f9b813fb4dce868fd32344d',
  'FR-12': '4224aecd0f9b816cadcaf8092152acf3',
  'FR-13': '4224aecd0f9b813b9ae3e228bc1d97c8',
  'FR-14': '4224aecd0f9b81548af3eef7c255a7b1',
  'FR-15': '4224aecd0f9b81c385e4e23dab797d60',
  'FR-16': '4224aecd0f9b81ffa851d64b04ff4816',
  'FR-17': '4224aecd0f9b8189803afa109d964062',
  'FR-18': '4224aecd0f9b81c9899ee219ae4201c3',
  'FR-19': '4224aecd0f9b81b583d0db9f719a165d',
  'FR-20': '4224aecd0f9b818ba302f559c8b7f436',
  'FR-21': '4224aecd0f9b81aeab52e09866c1b279',
  'FR-22': '4224aecd0f9b81b7a396d2e651c63f98',
}
export const notionUrl = (id: string) => (NOTION[id] ? `${N}${NOTION[id]}` : undefined)
export const figmaUrl = (node: string) => `https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=${node.replace(':', '-')}`

export type Impl = 'done' | 'mock' | 'partial'
/** 현재 데모 구현 상태 — 기획된 동작(명세)과 구분해서 표시 */
export const IMPL: Record<string, { state: Impl; note: string }> = {
  'FR-01': { state: 'done', note: '첫 화면에서 로그인 없이 바로 질문으로 이동.' },
  'FR-02': { state: 'partial', note: '질문 5개 · 미정 선택 · 예산 입력 규칙 · Enter 진행까지 동작. 도중 이탈 후 7일 내 재방문 복원은 미구현.' },
  'FR-03': { state: 'mock', note: '계산식 구조(예식장 + 스드메, 하한끼리 · 상한끼리)는 같고, 금액은 예시 계수로 만든 Mock. 데이터 부족 권역(울산 · 강원 · 제주) 안내 포함.' },
  'FR-05': { state: 'done', note: '예산대 4구간 · 산출 근거 펼침 · 지역 변경 시 중간 구간으로 재설정.' },
  'FR-06': { state: 'done', note: '3단계 판정과 예산 없음 → 예산 입력 카드까지 동작.' },
  'FR-08': { state: 'mock', note: '현재 주소를 복사하고 토스트만 표시. 받은 사람용 보기 전용 화면은 미구현.' },
  'FR-09': { state: 'partial', note: '6단계 · D-구간 · (예상) 표시 · 지난 단계 확인 모달 동작. 시연 오늘 날짜는 2026.11.24로 고정.' },
  'FR-10': { state: 'done', note: '사이드 메뉴 · 진행 바 · 단계 상세 전환.' },
  'FR-11': { state: 'mock', note: '카카오 · 구글 인증 없이 로그인 상태만 전환. 진입별 제목 5종과 누른 동작 이어서 실행은 동작. 실패는 시뮬레이터로 재현, 계획 충돌 선택 모달은 미구현.' },
  'FR-12': { state: 'partial', note: '시연 탭 안에서만 유지되고 새로고침하면 초기화(브라우저 7일 보관 미구현).' },
  'FR-13': { state: 'done', note: '비회원일 때 결과 · 로드맵에 저장 제안 카드 표시, 로그인 후 토스트.' },
  'FR-14': { state: 'mock', note: '링크 복사 토스트 · 초대 합류 모달 · 합류 후 멤버 표시. 실제 링크 발급과 만료 · 이미 연결 예외는 미구현.' },
  'FR-15': { state: 'done', note: '체크 · 담당 배지 동작. 짝꿍 수정 표시는 시뮬레이터로 재현.' },
  'FR-16': { state: 'partial', note: '예시 홀 17곳 Mock으로 필터 · 정렬 · 더 보기 · 정보 부족 묶음 · 결과 없음 동작. 정렬 점수는 가중치만 반영한 단순 계산.' },
  'FR-17': { state: 'done', note: '실제 금액 → 남은 예산 · 여유/빠듯/부족 · 금액 수정 · 예산 없음 분기 동작.' },
  'FR-18': { state: 'done', note: '가장 이른 미완료 단계와 D-day 표시.' },
  'FR-19': { state: 'mock', note: '예시 업체 조합 Mock(베이직 2개 · 럭셔리 0개로 예외 상태 확인 가능).' },
  'FR-20': { state: 'mock', note: 'FR-19와 같은 조합 데이터. 예산대 변경 시 계획의 예산대도 함께 바뀜.' },
  'FR-21': { state: 'done', note: '사이드 메뉴 보조 항목 2개로 후보 화면 이동.' },
  'FR-22': { state: 'done', note: '요약 카드 · 하단 카드 3개 · 새 계획 시작 확인 모달 동작.' },
}

/** UT(11/28) 범위 핵심 흐름: 첫 화면 → 스드메 계약 (기능명세 시나리오 Step 0~12) */
export const CORE_FLOW: { id: ScreenId; note?: string }[] = [
  { id: 'SCR-01' },
  { id: 'SCR-02-Q1', note: 'Q1~Q5' },
  { id: 'SCR-03', note: '예산대 조정' },
  { id: 'SCR-06' },
  { id: 'SCR-11', note: '저장 · 초대 시' },
  { id: 'SCR-06-D', note: '예식장 계약' },
  { id: 'SCR-09' },
  { id: 'SCR-06-B', note: '실제 금액 입력' },
  { id: 'SCR-06-D2' },
  { id: 'SCR-10' },
]
