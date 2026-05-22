# 실무 경력 — 회사 로고 / 영상

이 폴더에 회사 로고와 데모 영상을 넣고 `src/data/professional.js` 에서 경로를 지정하세요.

## 영상 (선택)
- 무음 자동재생 MP4 를 넣고 `media: "/companies/jjr.mp4"` 처럼 지정
- **최적화 권장** — 넣은 뒤 한 번 실행:
  ```
  node scripts/compress-video.mjs public/companies/파일이름.mp4
  ```
  (원본은 `*.orig.mp4` 로 백업됨. 폭 800px / CRF30 / 무음으로 압축)
- 화면에 보일 때만 로드·재생되도록 이미 처리되어 있습니다.

## 로고 (선택)
- `logo: "/companies/halfbrick.png"` 처럼 지정. 없으면 회사명이 워드마크로 표시됩니다.

## 채워야 할 항목 (professional.js)
- `period` (기간) — 양쪽 다 비어 있음
- `titles` — 111% 는 NDA 고려해 비워둠. 공개 가능한 참여작이 있으면 추가.
