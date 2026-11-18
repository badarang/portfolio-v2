TITLE: [모아이는내려찍고싶다] 0. LÖVE로 만든 1v1 슬램 액션 개발기 정리
SLUG: moai-wanna-slam-devlog-00-series-retrospective
TAGS: 게임개발, LÖVE, Lua, Multiplayer, Fullstack, AI, Troubleshooting, Special
EXCERPT: 모아이는내려찍고싶다 1~8편에서 다룬 손맛 설계, LÖVE 클라이언트, WebSocket 서버 권위 모델, 풀스택 아키텍처, AI, 모바일 셰이더, 네트워크 렉, 벤치마크를 압축 정리합니다.
COVER: https://haeinoh.vercel.app/blog/moai-devlog00-hook-thumbnail.mp4
PUBLISHED: true
---

모아이는내려찍고싶다는 LÖVE와 Lua로 만든 1v1 슬램 액션 게임입니다.

처음에는 원터치 액션의 손맛을 빠르게 확인하는 프로젝트였지만, 끝까지 밀어보니 클라이언트 구조, 서버 권위 멀티플레이, 풀스택 운영, AI, 모바일 셰이더, 네트워크 렉, 벤치마크까지 이어졌습니다.

<div class="blog-embed">
  <iframe src="https://www.youtube.com/embed/NQWIjDBJFcg" title="모아이는내려찍고싶다 플레이 영상" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## 1~8편 요약

| 편 | 핵심 |
| --- | --- |
| 1편 | 원터치 입력, 심리전, Juicy한 피드백으로 게임의 훅 만들기 |
| 2편 | LÖVE 클라이언트에서 점프, 슬램, 충돌, 코요테 타임, 점프 버퍼 조정 |
| 3편 | WebSocket 서버 권위 모델, 60Hz tick, PRESS/SNAP 프로토콜 |
| 4편 | LÖVE 클라이언트, Node.js 서버, Supabase, Sentry, GitHub Actions 연결 |
| 5편 | Rule Based AI와 강화학습 AI, state/action/reward, 카운터 어택 |
| 6편 | 모바일 GLSL ES, UV mesh, fallback으로 셰이더 깨짐 해결 |
| 7편 | SNAP backlog, SFX preload, correction, pullback으로 모바일 렉 분해 |
| 8편 | 서버/AI 벤치마크, Auth rate limit 분리, 리포트 저장 |

## 1편: Hook, Simple, Juicy

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-01-hook-simple-juicy">
  <img src="/blog/moai-devlog00-bookmark-01.gif" alt="1편 대표 움짤" />
  <span class="blog-bookmark-body">
    <strong>1편. Hook, Simple, Juicy로 설계한 1v1 슬램액션</strong>
    <span>원터치 입력을 점프와 내려찍기로 연결하고, 단순한 조작 안에 심리전을 남긴 과정을 정리했습니다.</span>
    <em>/blog/moai-wanna-slam-devlog-01-hook-simple-juicy</em>
  </span>
</a>

기술적으로는 입력 수를 줄이는 대신 판단 밀도를 높이는 작업이었습니다. 버튼 하나가 점프, 낙하, 슬램으로 이어지도록 상태를 설계하고, 이펙트와 사운드로 입력 하나를 크게 느끼게 만들었습니다.

## 2편: LÖVE 클라이언트 손맛

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-02-love-client-structure">
  <img src="/blog/moai-wanna-slam-movement-tuning.gif" alt="2편 대표 이미지" />
  <span class="blog-bookmark-body">
    <strong>2편. 짜릿한 손맛 깎기</strong>
    <span>이동, 점프, 슬램, 코요테 타임, 점프 버퍼, 원웨이 플랫폼을 조정하며 원터치 입력을 다듬었습니다.</span>
    <em>/blog/moai-wanna-slam-devlog-02-love-client-structure</em>
  </span>
</a>

손맛은 감으로만 잡히지 않았습니다. 점프 속도, 중력, 슬램 속도, 충돌 박스, 입력 버퍼, 디버그 기즈모를 계속 쪼개면서 “눌렀는데 왜 이렇게 됐는지” 납득 가능한 상태를 만들었습니다.

## 3편: WebSocket 서버 권위 모델

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-03-websocket-authoritative-server">
  <img src="/blog/moai-wanna-slam-connection-flow.gif" alt="3편 대표 이미지" />
  <span class="blog-bookmark-body">
    <strong>3편. WebSocket 멀티플레이: 서버 권위 모델과 스냅샷</strong>
    <span>게스트 세션, 매칭, 60Hz 서버 tick, PRESS/SNAP 프로토콜, 스냅샷 보정을 다뤘습니다.</span>
    <em>/blog/moai-wanna-slam-devlog-03-websocket-authoritative-server</em>
  </span>
</a>

서버가 입력을 받아 판정을 확정하고, 클라이언트는 SNAP을 받아 화면에 반영합니다. 핵심 난점은 공정성을 위해 서버가 정답을 갖되, 화면 반응성은 잃지 않는 것이었습니다.

## 4편: 전체 아키텍처

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-04-fullstack-architecture">
  <img src="/blog/moai-devlog4-runtime-architecture-flow-v3.gif" alt="4편 대표 이미지" />
  <span class="blog-bookmark-body">
    <strong>4편. 전체 아키텍처: 클라이언트/서버/DB/배포/모니터링</strong>
    <span>LÖVE 클라이언트, WebSocket, Node.js 서버, Supabase, Sentry, GitHub Actions 배포 흐름을 묶었습니다.</span>
    <em>/blog/moai-wanna-slam-devlog-04-fullstack-architecture</em>
  </span>
</a>

게임 로직과 서비스 구조는 달랐습니다. 실제로 운영하려면 전투 런타임뿐 아니라 DB, 로그, 모니터링, 배포 자동화가 같이 필요했습니다.

## 5편: 강화학습 AI

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-05-reinforcement-learning-review">
  <img src="/blog/moai-devlog00-bookmark-05.gif" alt="5편 대표 움짤" />
  <span class="blog-bookmark-body">
    <strong>5편. 강화학습 AI: Rule Based보다 재밌는 상대 만들기</strong>
    <span>Rule Based AI를 기준선으로 두고 state, action, reward, 슬램 남용, 카운터 어택을 실험했습니다.</span>
    <em>/blog/moai-wanna-slam-devlog-05-reinforcement-learning-review</em>
  </span>
</a>

목표는 Rule Based AI보다 재밌고, 내가 쉽게 못 깨는 AI였습니다. 첫 목표는 어느 정도 달성했지만 두 번째는 아직 미달성입니다. 슬램이 너무 좋은 선택지가 되자 AI가 슬램만 반복했고, 그래서 규칙과 reward를 함께 조정해야 했습니다.

## 6편: 모바일 셰이더

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-06-mobile-shader-troubleshooting">
  <img src="/blog/moai-devlog6-uv-stability.gif" alt="6편 대표 이미지" />
  <span class="blog-bookmark-body">
    <strong>6편. 모바일 셰이더: 깨진 파도를 납득 가능한 화면으로 고치기</strong>
    <span>GLSL ES 제약, screen 좌표 문제, UV mesh, fallback으로 모바일 화면 깨짐을 좁혔습니다.</span>
    <em>/blog/moai-wanna-slam-devlog-06-mobile-shader-troubleshooting</em>
  </span>
</a>

데스크톱에서 멀쩡하던 효과가 모바일에서 깨졌습니다. screen 좌표 의존을 줄이고 UV mesh 기반으로 바꾸면서, 셰이더가 실패해도 게임이 보이는 fallback 경로까지 정리했습니다.

## 7편: 모바일 렉과 Pullback

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-07-mobile-network-lag-troubleshooting">
  <img src="/blog/moai-wanna-slam-correction-strategy.gif" alt="7편 대표 움짤" />
  <span class="blog-bookmark-body">
    <strong>7편. 트러블슈팅: 모바일 렉, Pullback, True Residual</strong>
    <span>SNAP backlog, Android SFX preload, correction, rubberband, pullback 문제를 나눠 봤습니다.</span>
    <em>/blog/moai-wanna-slam-devlog-07-mobile-network-lag-troubleshooting</em>
  </span>
</a>

플레이어가 말하는 렉은 하나가 아니었습니다. Android에서는 SFX 초기화와 SNAP 처리 문제가 컸고, iOS에서는 프레임은 괜찮아도 서버 보정이 화면에 보이는 pullback이 더 크게 느껴졌습니다.

## 8편: 서버와 AI 벤치마크

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-08-benchmark-infrastructure">
  <img src="/blog/moai-devlog00-bookmark-08.gif" alt="8편 대표 움짤" />
  <span class="blog-bookmark-body">
    <strong>8편. 벤치마크: 서버와 AI를 숫자로 검증하기</strong>
    <span>서버 시나리오 테스트, Auth rate limit 분리, 리포트 저장, AI 난이도 검증을 정리했습니다.</span>
    <em>/blog/moai-wanna-slam-devlog-08-benchmark-infrastructure</em>
  </span>
</a>

서버와 AI는 감으로만 검증하기 어려웠습니다. WELCOME, MATCH, RESULT 같은 단계별 실패를 기록하고, AI끼리 리그를 돌려 난이도 정렬의 근거를 만들었습니다.

## 느낀 점

이번 프로젝트는 제 첫 LÖVE2D 프로젝트였습니다. Unity보다 훨씬 빠르게 프로토타이핑할 수 있었고, 작은 손맛을 고치고 바로 확인하는 루프가 짧았습니다.

Lua는 Python과 JavaScript를 섞은 듯한 느낌이었습니다. 클래스, 메소드 오버로딩, 오버라이드가 기본으로 없다는 점은 충격이었지만, `Player.__index = Player`와 `setmetatable`로 클래스 비슷한 구조를 직접 만드는 방식이 인상적이었습니다. 언어가 많은 것을 강제하지 않으니 LÖVE가 왜 가볍게 느껴지는지도 이해됐습니다.

또 하나 크게 느낀 것은 AI와 시각적 감각을 맞추는 방식입니다. Unity나 Unreal에서는 “예쁘다”라는 미적인 관점을 AI에게 전달하기까지 엔진 에디터, 씬 오브젝트, 컴포넌트, MCP 같은 중간 계층을 많이 거쳐야 했습니다. 반면 LÖVE2D에서는 화면에 보이는 것이 좌표, 색, 이미지, 셰이더, draw 호출로 더 직접적으로 드러났고, 제 기준에서는 AI와 시각 피드백을 맞추는 간극을 많이 줄일 수 있었습니다.

결국 이 시리즈는 작은 1v1 액션 게임 하나를 통해, 입력 하나의 손맛부터 서버 판정, 모바일 화면, AI, 벤치마크까지 어떻게 연결되는지 확인한 기록입니다.
