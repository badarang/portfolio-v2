# portfolio-v2

Haein Oh 포트폴리오 재구성 버전. 기존 `../src`(레거시 3D 사이트)와 **완전히 분리된 독립 앱**입니다.

## 스택
- React 18 + Vite 5 + Tailwind 3 + framer-motion (Three.js 없음)
- 블로그 백엔드: Supabase (Postgres + 자동 REST API)
- 마크다운 렌더링: react-markdown + remark-gfm + syntax-highlighter

## 구조 (단일 페이지 연속 스크롤)
홈(Hero) → 철학(Hook·Simple·Juicy) → 프로젝트 → 연대기 → 블로그 → 대외활동 → 연락처
- Nav 클릭 시 해당 섹션으로 스무스 스크롤
- 블로그 글 상세는 별도 라우트 `/blog/:slug`

## 개발
```bash
cd portfolio-v2
npm install
cp .env.example .env          # Supabase URL / anon key 입력
npm run dev                   # http://localhost:5174
npm run build
```

## 블로그(Supabase) 설정
1. supabase.com 에서 프로젝트 생성
2. SQL Editor 에 `supabase/schema.sql` 붙여넣어 실행 (posts 테이블 + 조회수 RPC + RLS)
3. Project Settings > API 에서 키 복사:
   - 프론트엔드: `.env` 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - 발행 CLI: `.env.publish` 에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (`.env.publish.example` 복사)
   - ⚠️ service_role 키는 절대 프론트엔드/깃에 노출 금지 (.gitignore 처리됨)

## 글쓰기 워크플로우 (Claude CLI)
Hashnode 대체. 두 커맨드는 `~/.claude/commands/` 에 설치됨:
- `/blog-draft <slug>` → `content/drafts/<slug>/post.md` 초안 생성
- `/blog-write <slug>` → 초안을 다듬어 Supabase 에 발행

수동 발행도 가능:
```bash
node scripts/publish.mjs upsert content/drafts/<slug>/post.md  # 생성/수정
node scripts/publish.mjs publish <slug>                         # 발행
node scripts/publish.mjs list                                   # 목록
node scripts/publish.mjs delete <slug>                          # 삭제
```

## 콘텐츠 수정 위치
- 가치관/강점/연대기: `src/data/profile.js`
- 게임 프로젝트: `src/data/projects.js` (이미지: `src/assets/project/`)
- 대외활동(영상/기사): `src/data/activities.js` ← **YouTube ID·기사 URL 채워넣기**

## TODO (선택 최적화)
- `BlogPost` 라우트 lazy-load + syntax-highlighter 경량화로 번들 축소
- 배포: Vercel/Netlify (SPA 리라이트 설정 필요 — `/blog/*` → index.html)
