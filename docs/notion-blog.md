# Notion → 블로그 연동 가이드

Notion 데이터베이스에서 글을 쓰면, 한 번의 명령으로 자체 블로그(Supabase `posts` 테이블)에
동기화되어 기존 테마 그대로 렌더링됩니다. 기존 글은 건드리지 않고, Notion 으로 쓴 글만 추가돼요.

```
Notion 페이지 → 마크다운 변환 → 이미지 압축·재호스팅 → posts 테이블 upsert → 기존 테마로 렌더
```

- 이미지는 **Supabase Storage(`blog-images` 버킷, 무료 1GB)** 에 다시 올립니다. (Notion URL 은 1시간 뒤 만료되므로 직접 링크 불가)
- **GIF 는 자동으로 MP4 로 변환**(약 10배 감소)되고, 큰 이미지는 가로 1600px 로 다운스케일됩니다. → 1GB 로도 사실상 걱정 없음.

---

## 최초 1회 설정

### 1. Notion 통합(integration) 만들기
1. https://www.notion.so/my-integrations → **New integration**
2. 이름 아무거나 (예: `blog-sync`), 워크스페이스 선택 → 생성
3. **Internal Integration Secret** 복사 → `.env.publish` 의 `NOTION_TOKEN` 에 붙여넣기

### 2. 블로그 DB 만들기
Notion 에서 **Table** 데이터베이스를 하나 만들고, 아래 속성(property)을 추가:

| 속성 이름 | Notion 타입 | 역할 |
|---|---|---|
| (기본 title) | Title | 글 제목 — 속성 이름은 무관, 타입으로 인식 |
| `Slug` | Text | URL (`/blog/여기`). 비우면 제목에서 자동 생성 |
| `Tags` | Multi-select | 태그 (블로그 카테고리 필터에 연결) |
| `Excerpt` | Text | 목록용 한 줄 요약 |
| `Published` | Checkbox | **체크해야 블로그에 노출** |
| `Published At` | Date | 발행일 (선택, 비우면 최초 발행 시각 자동) |
| `Video` | URL | YouTube 등 embed (선택) |

> 페이지 커버 이미지를 넣으면 `cover_url` 로 사용됩니다.

### 3. DB 를 통합에 공유
DB 페이지 우상단 `...` → **Connections(연결)** → 방금 만든 통합(`blog-sync`) 추가.
(이걸 안 하면 API 가 DB 를 못 봅니다.)

### 4. DB id 를 .env 에 넣기
DB 를 브라우저로 열면 URL 이 `notion.so/<워크스페이스>/<32자리>?v=...` 형태예요.
그 **32자리**를 `.env.publish` 의 `NOTION_DATABASE_ID` 에 붙여넣기.

---

## 사용법 (자동)

**평소엔 아무 명령어도 필요 없어요.** GitHub Actions 가 15분마다 자동으로 동기화합니다.

1. Notion DB 에서 글 작성 (이미지·GIF 마음껏)
2. **`Published` 체크박스 켜기**
3. 최대 15분 안에 블로그에 자동 반영 (GIF 는 자동으로 MP4 압축)

`Published` 를 해제하면 다음 동기화 때 비공개 처리됩니다.

- **즉시 반영하고 싶으면**: GitHub → Actions 탭 → "Notion → Blog Sync" → **Run workflow** 버튼.
- 워크플로우: `.github/workflows/notion-sync.yml`. 키는 GitHub 저장소 Secrets 에 등록됨
  (`NOTION_TOKEN`, `NOTION_DATABASE_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).

## 사용법 (수동 / 로컬)

로컬에서 직접 돌리고 싶을 때:

```bash
# Published 체크된 글 전체 동기화
npm run notion-sync

# 특정 글 하나만 (slug 로)
node scripts/notion-sync.mjs my-post-slug

# 실제 쓰기 없이 어떤 글이 잡히는지 미리보기
node scripts/notion-sync.mjs --dry-run
```

글을 쓰거나 수정한 뒤 `npm run notion-sync` 한 번 치면 블로그에 반영됩니다.
`Published` 를 해제하면 다음 sync 때 비공개 처리돼요.

### 특징
- **멱등(idempotent)**: 여러 번 돌려도 안전. 이미 올라간 이미지는 URL 해시로 식별해 재업로드하지 않습니다.
- **압축 로그**: 실행 중 `GIF→MP4`, `압축` 로그로 얼마나 줄었는지 확인 가능.

---

## 나중에 용량이 정말 부족해지면

Supabase 1GB 가 꽉 차면, 업로드 대상만 **Cloudflare R2**(10GB 무료 + egress 영구 무료)로 바꾸면 됩니다.
`scripts/notion-sync.mjs` 의 `uploadBuffer` / `publicUrlOf` 두 함수만 S3 호환 업로드로 교체하면 되고,
나머지(압축·마크다운 치환·DB upsert)는 그대로예요. 락인 없음.
