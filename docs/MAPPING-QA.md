# 화면 정의서 ↔ 데모 매핑 QA

검수 기준: 문서 페이지에서 화면 정의서 구성 요소 번호가 프레임 안 실제 요소에 모두 붙었는지(Playwright로 자동 확인), 시연 핵심 흐름이 끝까지 동작하는지.

## 번호 대응 (24/24 화면 · 누락 0 · 중복 0)

| 화면 ID | 화면명 | 유형 | 번호 대응 | 관련 기능 | Figma |
| --- | --- | --- | --- | --- | --- |
| SCR-01 | 첫 화면 | 화면 | 6 / 6 | FR-01, FR-11 | [601:33](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-33) |
| SCR-01-B | 첫 화면 · 로그인 (계획 있음) | 화면 | 9 / 9 | FR-22, FR-18, FR-12 | [601:248](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-248) |
| SCR-02-Q1 | 질문 Q1 · 지역 | 화면 | 7 / 7 | FR-02 | [601:830](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-830) |
| SCR-02-Q2 | 질문 Q2 · 하객 수 | 화면 | 6 / 6 | FR-02 | [601:1071](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-1071) |
| SCR-02-Q3 | 질문 Q3 · 예식 시기 | 화면 | 6 / 6 | FR-02, FR-09 | [601:1271](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-1271) |
| SCR-02-Q4 | 질문 Q4 · 예산 | 화면 | 7 / 7 | FR-02, FR-06 | [601:1475](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-1475) |
| SCR-02-Q5 | 질문 Q5 · 선호 분위기 | 화면 | 6 / 6 | FR-02 | [604:2](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=604-2) |
| SCR-02-E | 질문 미정 선택 · 입력 오류 (영역 변형) | 상태 변형 | 6 / 6 | FR-02 | [601:1701](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-1701) |
| SCR-03 | 예상 비용 결과 | 화면 | 15 / 15 | FR-03, FR-05, FR-19, FR-06, FR-08, FR-13 | [601:2183](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-2183) |
| SCR-03-B | 조건 수정 패널 | 패널 | 8 / 8 | FR-02, FR-03 | [601:2504](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-2504) |
| SCR-03-C | 예상 비용 결과 · 예산 없음 | 상태 변형 | 2 / 2 | FR-06 | [601:2754](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-2754) |
| SCR-03-E | 예상 비용 결과 · 하객 수 미정 (영역 변형) | 상태 변형 | 3 / 3 | FR-03 | [601:2919](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-2919) |
| SCR-03-F | 예상 비용 결과 · 산출 근거 펼침 (영역 변형) | 상태 변형 | 5 / 5 | FR-05 | [601:3045](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-3045) |
| SCR-06 | 준비 로드맵 | 화면 | 8 / 8 | FR-09, FR-10, FR-18, FR-14, FR-21, FR-13 | [601:3297](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-3297) |
| SCR-06-B | 준비 로드맵 · 완료 후 남은 예산 | 상태 변형 | 4 / 4 | FR-17 | [601:3727](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-3727) |
| SCR-06-C | 준비 로드맵 · 예산 없음 | 상태 변형 | 3 / 3 | FR-17, FR-06 | [601:4026](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-4026) |
| SCR-06-D | 단계 상세 | 화면 | 9 / 9 | FR-10, FR-15, FR-17, FR-21 | [614:2](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=614-2) |
| SCR-06-D2 | 단계 상세 · 스드메 계약 | 화면 | 9 / 9 | FR-10, FR-15, FR-17, FR-21 | [623:566](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=623-566) |
| SCR-06-E | 준비 로드맵 · 예식일 미정 (영역 변형) | 상태 변형 | 3 / 3 | FR-09, FR-18 | [601:4289](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-4289) |
| SCR-06-F | 준비 로드맵 · 지난 단계 확인 (영역 변형) | 모달 | 5 / 5 | FR-09, FR-17 | [601:4443](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-4443) |
| SCR-09 | 예식장 후보 | 화면 | 16 / 16 | FR-16 | [601:4654](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-4654) |
| SCR-10 | 스드메 후보 | 화면 | 11 / 11 | FR-20 | [625:317](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=625-317) |
| SCR-11 | 로그인 모달 | 모달 | 6 / 6 | FR-11, FR-12 | [601:4984](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-4984) |
| SCR-11-B | 초대 합류 모달 | 모달 | 6 / 6 | FR-14 | [601:5205](https://www.figma.com/design/4uJLQ7PqAXgVzzWLmDRV8g/?node-id=601-5205) |

변형 화면(상태 변형 · 패널 · 모달)은 바뀌는 영역에만 번호를 달았어요.

## 시연 E2E (통과)

첫 화면 → Q1~Q5(예산 오류 · 미정 포함) → 계산 중 → 결과(예산대 4종 · 조합 2개/0개 예외 · 산출 근거) → 조건 수정(지역 변경 시 예산대 재설정 토스트) → 로드맵(예식일 미정 배너) → 초대 시 로그인(실패 → 다시 시도 → 성공 후 이어서 실행) → 예식장 계약 체크 · 실제 금액 → 완료 배너 · 남은 예산 판정 → 예식장 후보(가격 공개만 보기) → 스드메 후보 → 스드메 완료 → 짝꿍 합류 → 지난 단계 확인 모달 → 초대 합류 모달 → 로그인 첫 화면 새 계획 시작.

## 확인 필요로 남긴 것

- 예산대 경계(250 · 350 · 450만 원, Q-05), 범위 반올림 단위(Q-03), 계산 중 기준 시간(Q-11)
- 저장 제안 카드 위치 · 노출 빈도, 후보 보기 보조 항목의 완료 표시 여부 — 원문 미기재
- 로그인 고지 문구 법률 검토
