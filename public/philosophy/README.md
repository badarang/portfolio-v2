# Hook · Simple · Juicy 예시 미디어

이 폴더에 아래 파일명으로 GIF(권장) 또는 무음 자동재생 MP4 를 넣으세요.
넣는 즉시 Philosophy 섹션의 해당 항목 여백에 그라데이션으로 표시됩니다.

- `hook.gif`   — Hook 예시 (글 왼쪽 / 미디어 오른쪽)
- `simple.gif` — Simple 예시 (글 오른쪽 / 미디어 왼쪽)
- `juicy.gif`  — Juicy 예시 (글 왼쪽 / 미디어 오른쪽)

## 형식
- **GIF 권장** (소리 없이 자동재생, 가장 단순). `<img>` 로 렌더링됩니다.
- **MP4 도 가능** — 파일명을 `hook.mp4` 등으로 바꾸고 `src/data/profile.js` 의
  `media` 경로를 `.mp4` 로 수정하면 `muted autoplay loop playsinline` 으로 자동재생됩니다.
- 권장 비율: 4:3 근처 (컨테이너가 4:3, `object-contain` 이라 다른 비율도 잘립니다 X 여백 O)

## 파일이 없을 때
경로만 잡혀 있고 파일이 없으면 "예시 미디어 자리" 자리표시자가 보입니다.
