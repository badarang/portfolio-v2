TITLE: [모아이는내려찍고싶다] 4. 전체 아키텍처: 클라이언트/서버/DB/배포/모니터링
SLUG: moai-wanna-slam-devlog-04-fullstack-architecture
TAGS: 게임개발, Fullstack, Architecture, Supabase, Sentry, DevOps, Special
EXCERPT: LÖVE 클라이언트, WebSocket 프로토콜, Node.js 서버, Supabase, Sentry, GitHub Actions 배포 흐름을 전체 아키텍처 관점에서 정리합니다.
PUBLISHED: true
---

3편에서는 서버 권위 모델과 스냅샷 구조를 살펴봤습니다.

이번 글에서는 판정 하나의 세부 흐름보다, 프로젝트 전체가 어떻게 서비스처럼 연결되어 있는지 보려고 합니다.

<strong>모아이는내려찍고싶다는 클라이언트, 실시간 서버, DB, 모니터링, 배포가 어떻게 나뉘어 있을까?</strong>

아래 이미지는 이 프로젝트의 전체 아키텍처를 블로그용으로 정리한 것입니다.

<figure class="blog-figure blog-figure-full">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog4-service-architecture.png" alt="모아이는내려찍고싶다 서비스 아키텍처" class="blog-media-wide" />
  <figcaption>플레이어 접속, 웹 클라이언트, 실시간 서버, DB, 모니터링, 배포 흐름을 영역별로 나눈 구조</figcaption>
</figure>

이 그림에서 중요한 건 기술 이름 자체보다 <strong>책임이 어디서 갈라지는지</strong>입니다.

LÖVE 클라이언트는 게임을 실행합니다. WebSocket은 클라이언트와 서버 사이의 실시간 통로입니다. Node.js 서버는 매칭과 전투 상태를 관리합니다. Supabase는 계정, 티켓, 결과처럼 남겨야 하는 데이터를 저장합니다. Sentry와 이벤트 로그는 문제가 생긴 위치를 추적합니다. GitHub Actions와 GitHub Pages는 빌드 결과물을 사용자가 접근할 수 있는 형태로 배포합니다.

<figure class="blog-figure blog-figure-full">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog4-runtime-architecture-flow-v3.gif" alt="실시간 플레이 요청이 클라이언트, WebSocket, 서버, Supabase, Sentry를 거쳐 흐르는 애니메이션" class="blog-media-wide" />
  <figcaption>실시간 플레이 요청은 클라이언트와 서버 사이를 계속 오가고, DB와 모니터링은 필요한 순간에만 관여합니다.</figcaption>
</figure>

## 🎮 1. Client / Game Runtime

가장 왼쪽은 플레이어가 직접 만지는 게임 클라이언트입니다.

이 프로젝트의 클라이언트는 LÖVE 기반 Lua 게임이고, 웹에서는 love.js로 패키징되어 브라우저에서 실행됩니다. 클라이언트가 맡는 일은 입력 처리, 렌더링, 사운드 재생, UI 표시, 서버에서 받은 스냅샷 반영입니다.

여기서 클라이언트는 게임의 모든 것을 혼자 결정하는 계층이 아닙니다. 화면을 부드럽게 보여주고, 플레이어 조작을 받아 서버로 보내고, 서버에서 돌아온 상태를 화면에 맞게 반영하는 실행 환경에 가깝습니다.

그래서 클라이언트 박스 안에는 iOS, Android, Web App, Browser Play가 함께 들어갑니다. 하나의 게임 소스를 여러 실행 환경으로 포장하는 영역이기 때문입니다.

## 🔌 2. Transport / Protocol

클라이언트와 서버 사이에는 WebSocket 프로토콜 계층을 따로 두었습니다.

이 계층은 단순히 "서버에 메시지를 보낸다"가 아니라, 게임에서 오가는 메시지의 모양을 정하는 영역입니다.

| 방향 | 예시 메시지 | 의미 |
| --- | --- | --- |
| 클라이언트 → 서버 | PRESS, MATCH, PING | 입력, 매칭 요청, 연결 유지 |
| 서버 → 클라이언트 | SNAP, RESULT, ERROR | 상태 스냅샷, 경기 결과, 실패 응답 |

이렇게 프로토콜을 분리해두면 클라이언트 코드와 서버 코드가 서로의 내부 구현을 직접 알 필요가 줄어듭니다. 클라이언트는 약속된 메시지를 보내고, 서버는 약속된 메시지로 답합니다.

## 🖥️ 3. Authoritative Server

가운데의 Node.js 서버가 멀티플레이의 기준점입니다.

서버는 WebSocket 연결을 받고, 매칭 큐에 넣고, 방을 만들고, 경기 진행 상태를 관리합니다. 그림 안의 60Hz Tick Loop는 전투 중 계속 돌면서 게임 상태를 갱신하는 서버 런타임입니다.

서버가 맡는 범위는 대략 다음과 같습니다.

- 게스트 세션과 게임 티켓 확인
- WebSocket 연결 관리
- 매칭 큐와 방 생성
- 전투 런타임 실행
- 경기 종료와 결과 계산
- 타임아웃, 이탈, 재대결 같은 라이프사이클 처리

여기서 자세한 판정 흐름은 3편의 주제입니다. 4편에서는 서버가 전체 구조에서 <strong>실시간 게임 상태를 관리하는 중심 계층</strong>이라는 점만 보면 됩니다.

## ☁️ 4. Server Runtime

서버 코드는 작성하는 것만으로 끝나지 않습니다. 멀티플레이 서버는 사용자가 접속할 수 있는 곳에 계속 떠 있어야 합니다.

여기서 말하는 런타임은 어려운 말로 보면 "서버가 실제로 실행되는 자리"입니다. 로컬 PC에서 `node server.js`를 켜는 것은 개발용이고, 사용자가 접속하는 멀티플레이 서버는 운영 환경에서 계속 떠 있어야 합니다.

이 영역은 그림에서 `Server Env`로 묶었습니다. 실제 역할은 다음에 가깝습니다.

- 개발 서버와 운영 서버 분리
- WebSocket 서버 실행
- 환경 변수와 시크릿 관리
- 운영 로그 확인
- 서버 재시작과 배포 흐름 관리

정적 페이지는 GitHub Pages에 올려두면 파일을 내려주는 것으로 끝납니다. 하지만 WebSocket 서버는 플레이어가 접속하는 동안 계속 실행되고 있어야 합니다. 그래서 게임 웹 페이지와 실시간 서버는 배포 방식이 다릅니다.

## 🗄️ 5. Supabase

Supabase는 게임 바깥의 상태를 저장하는 계층입니다.

전투 중 매 프레임의 위치를 전부 DB에 저장하는 구조는 아닙니다. 대신 DB에는 나중에도 남아야 하는 정보가 들어갑니다.

- 유저와 게스트 세션
- 게임 티켓
- 매치 결과
- 보상과 재화
- 코스튬 보유/선택 상태
- RLS 정책과 접근 제어

즉 Supabase는 "실시간 전투를 돌리는 곳"이 아니라, 계정과 결과, 보상처럼 영속성이 필요한 데이터를 책임지는 곳입니다.

## 📈 6. Monitoring

오른쪽 아래의 Sentry와 이벤트 로그는 배포 이후 문제를 추적하기 위한 계층입니다.

웹에서 실제 사용자가 접속하면 개발 중에는 보지 못한 문제가 나옵니다. 브라우저별 실행 실패, WebSocket 끊김, 결과 저장 실패, 특정 단계에서의 예외 같은 것들입니다.

모니터링을 붙인 이유는 단순히 에러 수를 보기 위해서가 아닙니다. 가장 큰 목적은 <strong>크래시가 어디서 났는지 빠르게 대응</strong>하고, 유저가 <strong>어느 단계에서 이탈하는지</strong>를 보는 것이었습니다. 문제가 생겼을 때 다음 질문에 답해야 했습니다.

- 클라이언트에서 터진 문제인가?
- 서버에서 터진 문제인가?
- 매칭 전인가, 경기 중인가, 결과 저장 중인가?
- 어떤 이벤트 직후 실패했는가?
- 특정 환경에서만 반복되는가?
- 유저가 로딩, 매칭, 전투, 결과 중 어디서 나갔는가?

그래서 클라이언트와 서버 양쪽에서 이벤트 컨텍스트를 남기고, 이상 상황을 추적할 수 있게 했습니다.

## ⚙️ 7. Build / Deploy Flow

아래쪽 긴 박스는 게임 실행 중의 로직이 아니라, <strong>코드를 빌드해서 사용자가 접속할 수 있는 형태로 내보내는 과정</strong>입니다.

GitHub Repository에 소스 코드가 있고, GitHub Actions가 빌드와 패키징을 수행합니다. 그 결과물 중 웹 빌드는 GitHub Pages에 올라가고, 사용자는 브라우저에서 게임 페이지에 접속합니다.

이 흐름은 게임 로직과 직접 관련 없어 보일 수 있지만, 포트폴리오 프로젝트에서는 중요했습니다.

코드를 설명하는 것과 실제로 눌러볼 수 있는 링크를 제공하는 것은 다릅니다. 이 프로젝트에서는 배포 흐름까지 갖춰야 "웹에서 플레이 가능한 멀티플레이 게임"으로 보여줄 수 있었습니다.

<figure class="blog-figure blog-figure-full">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog4-devops-deploy-flow-v3.gif" alt="GitHub Repository에서 Actions, Artifacts, Web, Server로 배포되는 흐름 애니메이션" class="blog-media-wide" />
  <figcaption>같은 저장소에서 출발하지만, 정적 웹 빌드와 실시간 서버는 서로 다른 목적지로 배포됩니다.</figcaption>
</figure>

## 마무리

4편에서 정리하고 싶었던 것은 특정 기술 하나가 아니라, 전체 구조의 역할 분리였습니다.

모아이는내려찍고싶다는 작은 1v1 게임이지만, 웹에서 실제로 플레이 가능한 형태로 만들려면 클라이언트만으로는 부족했습니다. 실시간 서버, DB, 배포, 모니터링이 함께 있어야 하나의 서비스처럼 동작합니다.

다음 글에서는 이 구조 위에서 사람 플레이어가 아니라 AI가 같은 규칙을 어떻게 읽고 행동으로 바꾸는지, 강화학습 실험을 다시 읽어봅니다.

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-05-reinforcement-learning-review">
  <img src="/blog/moai-devlog00-bookmark-05.gif" alt="5편 대표 이미지" />
  <span class="blog-bookmark-body">
    <strong>5편. 강화학습 AI: Rule Based보다 재밌는 상대 만들기</strong>
    <span>Rule Based AI를 기준선으로 두고 state, action, reward, 슬램 남용, 카운터 어택 문제를 실험한 기록입니다.</span>
    <em>/blog/moai-wanna-slam-devlog-05-reinforcement-learning-review</em>
  </span>
</a>
