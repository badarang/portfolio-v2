-- portfolio-v2 블로그 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣어 실행하세요.

-- 1) posts 테이블 ---------------------------------------------------------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,            -- URL: /blog/:slug
  title        text not null,
  excerpt      text,                            -- 목록용 요약
  content_md   text not null default '',        -- 본문 (Markdown)
  cover_url    text,                            -- 대표 이미지 URL
  video_url    text,                            -- 동영상 embed (YouTube 등)
  tags         text[] default '{}',
  views        integer not null default 0,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (published, published_at desc);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- 2) 조회수 증가 RPC (익명도 호출 가능) -----------------------------------
create or replace function public.increment_post_views(post_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.posts set views = views + 1
  where slug = post_slug and published = true;
$$;

-- 3) Row Level Security ---------------------------------------------------
alter table public.posts enable row level security;

-- 공개된 글은 누구나 읽기 가능
drop policy if exists "public can read published posts" on public.posts;
create policy "public can read published posts"
  on public.posts for select
  using (published = true);

-- 쓰기/수정/삭제는 RLS 를 우회하는 service_role 키(=블로그 작성 스킬)만 가능.
-- anon 키에는 INSERT/UPDATE/DELETE 정책을 만들지 않습니다.

grant execute on function public.increment_post_views(text) to anon, authenticated;
