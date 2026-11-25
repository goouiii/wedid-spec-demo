# 화면 ↔ DESIGN 프레임 · 번호 대응 QA

기준: Figma `[DESIGN - 디자인]` (node 135-472) 프레임 56개. 번호는 `/raw/:id`에서 `[data-anno]`를 세어 화면 정의서 구성 요소와 1:1로 맞췄어요.

## 번호 대응 (56/56 화면 · 누락 0 · 중복 0)

| 화면 ID | 화면명 | 유형 | 번호 | 관련 기능 | DESIGN 프레임 |
| --- | --- | --- | --- | --- | --- |
| MAIN-01 | 첫 화면 (비로그인) | 화면 | 7 / 7 | FR-01 | [메인 01 비로그인](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-962) |
| MAIN-02 | 웨딩 플랜 소개 | 화면 | 9 / 9 | FR-D10, FR-01 | [메인 02 웨딩플랜 소개](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-21828) |
| MAIN-03 | 첫 화면 (로그인 재방문) | 상태 변형 | 8 / 8 | FR-22, FR-18 | [메인 03 로그인 재방문](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-13581) |
| MAIN-04 | 새 계획 시작 팝업 | 팝업 | 2 / 2 | FR-22 | [메인 04 새 계획 시작 팝업](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-14781) |
| Q-01 | 질문 · 지역과 하객 수 | 화면 | 6 / 6 | FR-02 | [질문 01 지역, 하객](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-1251) |
| Q-02 | 질문 · 시기와 예산 | 화면 | 6 / 6 | FR-02 | [질문 02 시기, 예산](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-1379) |
| Q-03 | 질문 · 예산 입력 오류 | 상태 변형 | 2 / 2 | FR-02 | [질문 03 예산 입력 오류](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-3144) |
| Q-04 | 질문 · 예식장 분위기 | 화면 | 4 / 4 | FR-02 | [질문 04 분위기](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-1523) |
| COST-01 | 예상 비용 계산 중 | 상태 변형 | 1 / 1 | FR-03 | [예상비용 01 로딩](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-1642) |
| COST-02 | 예상 비용 결과 | 화면 | 10 / 10 | FR-03, FR-05, FR-06, FR-08, FR-13, FR-19, FR-D08 | [예상비용 02 결과](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-1682) |
| COST-03 | 예상 비용 · 예산 없음 | 상태 변형 | 1 / 1 | FR-06 | [예상비용 03 예산 없음](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-3290) |
| COST-04 | 예상 비용 · 하객 수 미정 | 상태 변형 | 2 / 2 | FR-03 | [예상비용 04 하객 미정](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-3605) |
| COST-05 | 예상 비용 · 산출 근거 펼침 | 상태 변형 | 2 / 2 | FR-05 | [예상비용 05 산출근거](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-3918) |
| COST-06 | 조건 수정 패널 | 패널 | 3 / 3 | FR-D11, FR-03 | [예상비용 06 조건 수정](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-4256) |
| COST-07 | 공유받은 예상 비용 | 화면 | 2 / 2 | FR-08 | [예상비용 07 공유 링크](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-4652) |
| COST-08 | 예상 비용 (로그인 · 메뉴 진입) | 상태 변형 | 3 / 3 | FR-03, FR-05 | [예상비용 08 메뉴로 진입](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-14387) |
| ROAD-01 | 준비 로드맵 (비로그인) | 상태 변형 | 3 / 3 | FR-09, FR-12, FR-13 | [로드맵 01 비로그인](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-1998) |
| ROAD-02 | 준비 로드맵 | 화면 | 9 / 9 | FR-09, FR-10, FR-18, FR-21, FR-14 | [로드맵 02 기본](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-4928) |
| ROAD-03 | 준비 로드맵 · 전체 완료 | 상태 변형 | 3 / 3 | FR-09, FR-17 | [로드맵 03 전체 완료](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-6814) |
| ROAD-04 | 준비 로드맵 · 예식일 미정 | 상태 변형 | 3 / 3 | FR-09 | [로드맵 04 예식일 미정](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-7185) |
| ROAD-05 | 예식일 정하기 팝업 | 팝업 | 2 / 2 | FR-09 | [로드맵 05 예식일 팝업](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-7569) |
| ROAD-06 | 준비 로드맵 · 예산 입력 | 상태 변형 | 2 / 2 | FR-17 | [로드맵 06 예산 입력](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-7979) |
| ROAD-07 | 지난 단계 확인 팝업 | 팝업 | 5 / 5 | FR-09, FR-17 | [로드맵 07 지난 단계 팝업](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-8359) |
| STEP-01 | 단계 상세 · 예식장 계약 진행중 | 화면 | 10 / 10 | FR-10, FR-15, FR-17, FR-21, FR-D09 | [단계 01 예식장 진행중](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-5295) |
| STEP-02 | 단계 상세 · 예식장 계약 완료 | 상태 변형 | 5 / 5 | FR-17, FR-D04 | [단계 02 예식장 완료](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-5569) |
| STEP-03 | 단계 상세 · 스드메 계약 진행중 | 화면 | 7 / 7 | FR-05, FR-19, FR-17, FR-15 | [단계 03 스드메 진행중](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-5856) |
| STEP-04 | 단계 상세 · 스드메 계약 완료 | 상태 변형 | 4 / 4 | FR-17, FR-D04 | [단계 04 스드메 완료](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-6323) |
| STEP-05 | 단계 완료 취소 팝업 | 팝업 | 2 / 2 | FR-D04 | [단계 05 완료 취소](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-8851) |
| STEP-06 | 할 일 추가 팝업 | 팝업 | 2 / 2 | FR-D05, FR-15 | [단계 06 할일 추가](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-9155) |
| STEP-07 | 저장 알림 토스트 | 상태 변형 | 1 / 1 | FR-17 | [단계 07 토스트](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-9566) |
| LOGIN-01 | 로그인 팝업 · 계획 저장 | 팝업 | 3 / 3 | FR-11, FR-12 | [로그인 01 계획 저장](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-2364) |
| LOGIN-02 | 로그인 팝업 · 단계 완료 | 팝업 | 3 / 3 | FR-11 | [로그인 02 단계 완료](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-16940) |
| LOGIN-03 | 로그인 팝업 · 할 일 추가 | 팝업 | 3 / 3 | FR-11, FR-D05 | [로그인 03 할일 추가](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-16972) |
| LOGIN-04 | 로그인 팝업 · 짝꿍 초대 | 팝업 | 3 / 3 | FR-11, FR-14 | [로그인 04 짝꿍 초대](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-17004) |
| LOGIN-05 | 로그인 팝업 · 후보 보기 | 팝업 | 3 / 3 | FR-11, FR-16, FR-20 | [로그인 05 후보 보기](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-17037) |
| VENUE-01 | 예식장 후보 목록 | 화면 | 11 / 11 | FR-16, FR-21, FR-D02, FR-D03 | [예식장 01 목록](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-9950) |
| VENUE-02 | 예식장 후보 · 격자 보기 | 상태 변형 | 2 / 2 | FR-16 | [예식장 02 격자보기](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-11737) |
| VENUE-03 | 예식장 후보 · 지역 정보 부족 | 상태 변형 | 2 / 2 | FR-16 | [예식장 03 정보 부족](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-12325) |
| VENUE-04 | 예식장 후보 · 로그인 필요 | 상태 변형 | 3 / 3 | FR-16, FR-11 | [예식장 04 로그인 필요](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-12560) |
| VENDOR-01 | 업체 상세 | 화면 | 11 / 11 | FR-D01, FR-D02, FR-D03, FR-D09 | [업체 01 상세](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-10548) |
| VENDOR-02 | 업체 상세 · 휴업 | 상태 변형 | 3 / 3 | FR-D01 | [업체 02 휴업](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-12839) |
| VENDOR-03 | 업체 비교 | 화면 | 7 / 7 | FR-D02, FR-D09 | [업체 03 비교](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-10851) |
| VENDOR-04 | 업체 비교 · 비었음 | 상태 변형 | 2 / 2 | FR-D02 | [업체 04 비교 비었음](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-13140) |
| VENDOR-05 | 비교함 비우기 팝업 | 팝업 | 2 / 2 | FR-D02 | [업체 05 비교함 비우기](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-13283) |
| SDM-01 | 스드메 후보 목록 | 화면 | 8 / 8 | FR-20, FR-19, FR-21, FR-D03 | [스드메 01 목록](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-11126) |
| SDM-02 | 스드메 후보 · 로그인 필요 | 상태 변형 | 3 / 3 | FR-20, FR-11 | [스드메 02 로그인 필요](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-12700) |
| HOME-01 | 홈 (로그인 대시보드) | 화면 | 6 / 6 | FR-D06, FR-18, FR-15 | [홈 4](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-14101) |
| HOME-02 | 홈 · 전체 완료 | 상태 변형 | 3 / 3 | FR-D06 | [홈 02 전체 완료](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-15322) |
| HOME-03 | 프로필 메뉴 | 패널 | 2 / 2 | FR-D07 | [홈 03 프로필 메뉴](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-15570) |
| INVITE-01 | 짝꿍 초대 팝업 | 팝업 | 3 / 3 | FR-14, FR-D08 | [초대 01 초대 팝업](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-15984) |
| INVITE-02 | 초대 받은 화면 | 화면 | 5 / 5 | FR-14, FR-11 | [초대 02 합류](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-16398) |
| INVITE-03 | 초대 합류 로그인 팝업 | 팝업 | 2 / 2 | FR-11, FR-14 | [초대 03 로그인](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-16463) |
| INVITE-04 | 초대 링크 만료 | 상태 변형 | 1 / 1 | FR-14 | [초대 04 링크 만료](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-16499) |
| INVITE-05 | 이미 연결된 계획 | 상태 변형 | 1 / 1 | FR-14 | [초대 05 이미 연결됨](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-16524) |
| MY-01 | 내 정보 | 화면 | 4 / 4 | FR-D07 | [내정보 3](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-16550) |
| MY-02 | 짝꿍 연결 해제 팝업 | 팝업 | 2 / 2 | FR-D07 | [내정보 02 연결 해제](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=677-16735) |

## 디자인과 다르게 처리한 부분

- 실제 업체명 · 사진 → "예시 ○○" 이름과 일러스트
- 히어로 커플 사진 → 일러스트
- 할 일 추가 버튼 위치(디자인에 진입 버튼 없음) → 체크리스트 아래 `+ 할 일 추가`
- 질문 Q3 '날짜가 정해졌어요' 날짜 입력칸(디자인에 없음) → 날짜 입력 추가
- 1단계(예산 일정 합의, 상견례) 단계 상세(디자인에 없음) → 같은 단계 상세 틀로 표시
- 업체 비교의 '다름' 표시에서 연락처 · 비고 제외(디자인과 동일하게)
