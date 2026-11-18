TITLE: [모아이는내려찍고싶다] 3. WebSocket 멀티플레이: 서버 권위 모델과 스냅샷
SLUG: moai-wanna-slam-devlog-03-websocket-authoritative-server
TAGS: 게임개발, Multiplayer, WebSocket, Authoritative Server, Node.js, Special
EXCERPT: WebSocket 연결, 게임 티켓, 매칭, 60Hz 서버 tick, 스냅샷 보정까지 실시간 1v1 전투를 서버 권위 모델로 만든 과정을 정리합니다.
PUBLISHED: true
---

2편에서는 플레이 손맛을 깎는 과정을 정리했습니다. 그런데 멀티플레이가 들어오자 기준이 하나 더 생겼습니다.

<p class="blog-emphasis-line">입력은 클라이언트에서 즉시 느껴져야 하는데, 판정은 서버에서 해야 했습니다.</p>

이번 글은 이 간극을 <strong>WebSocket 기반 서버 권위 모델</strong>로 다룬 기록입니다. 클라이언트는 누른 순간의 반응을 보여주고, <strong>누가 맞았고 누가 이겼는지는 서버가 확정</strong>합니다.

## 왜 서버가 판정을 가져야 했나

가장 피하고 싶은 상황이 있습니다.

<p class="blog-emphasis-line">내 화면에서는 맞췄는데 상대 화면에서는 아니었다.</p>

실시간 게임에서 두 클라이언트가 완전히 같은 순간을 보는 것은 어렵습니다. 네트워크 지연, 기기 성능 차이, 모바일 프레임 드랍이 섞이기 때문입니다.

그래서 전투 결과의 기준점은 서버에 뒀습니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-wanna-slam-server-authority-flow.gif" alt="입력 하나가 서버 판정과 스냅샷으로 확정되는 흐름 애니메이션" class="blog-media-wide" />
  <figcaption>클라이언트는 손맛을 먼저 보여주고, 서버는 전투 결과를 확정합니다.</figcaption>
</figure>

여기서 <span class="blog-inline-term">PRESS</span>는 플레이어가 액션 버튼을 눌렀다는 입력 이벤트입니다. 게임 안에서는 상황에 따라 점프 또는 내려찍기로 해석됩니다.

## 연결 흐름: 게스트 세션에서 매칭까지

WebSocket에 바로 들어가게 만들지는 않았습니다. 먼저 세션을 확인하고, 짧은 <span class="blog-inline-term">게임 티켓</span>을 발급한 뒤, 그 티켓으로 소켓 입장을 통과시켰습니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-wanna-slam-connection-flow.gif" alt="게스트 세션에서 매칭 큐까지 이어지는 연결 애니메이션" class="blog-media-wide" />
  <figcaption>세션 확인, 티켓 발급, 소켓 입장, 매칭 큐를 나눠야 실패 지점을 좁힐 수 있습니다.</figcaption>
</figure>

이렇게 나누면 문제가 났을 때 원인을 좁히기 쉽습니다. 접속이 실패했는지, 티켓이 잘못됐는지, 매칭 큐에서 멈췄는지 따로 볼 수 있기 때문입니다.

개발 중에는 <strong>Supabase Auth rate limit</strong>도 만났습니다. 신규 게스트/익명 유저를 한 번에 많이 만들면 전투 서버가 아니라 인증 단계가 먼저 막혔습니다. 그래서 테스트에서는 티켓을 미리 준비하거나 재사용하는 흐름도 필요했습니다.

## 60Hz tick과 스냅샷

전투 런타임은 <strong>60Hz tick</strong>을 기준으로 설계했습니다. 내려찍기처럼 짧은 판정을 다루려면 서버가 일정한 간격으로 위치, 상태, 충돌, 승패를 갱신해야 했습니다.

서버는 매 tick마다 전투 상태를 만들고, 클라이언트는 <span class="blog-inline-term">스냅샷</span>을 받아 화면을 맞춥니다. 스냅샷은 서버가 현재 전투 상태를 묶어 보내는 상태 패킷입니다. 문제는 클라이언트 처리가 밀릴 때였습니다. 스냅샷이 한 프레임에 몰리면 렉이 더 크게 느껴집니다.

실제로 Android 렉을 추적할 때 처음 본 로그는 꽤 충격적이었습니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-wanna-slam-snapshot-metrics-readable.png" alt="Android 렉 추적 로그를 시각화한 스냅샷 처리 지표" class="blog-media-wide" />
  <figcaption>처음 본 신호는 ping보다 한 프레임에 몰린 스냅샷 처리 비용에 가까웠습니다.</figcaption>
</figure>

처음에는 "스냅샷이 너무 자주 와서 문제인가?"라고 생각했습니다. 나중에 다시 보니 원인은 하나가 아니었습니다. <strong>클라이언트 프레임 비용, 사운드 비용, 스냅샷 적용 비용</strong>이 같이 엮여 있었습니다.

그래도 이 로그 덕분에 봐야 할 지표는 선명해졌습니다.

- 서버 tick은 안정적인가
- 스냅샷은 몇 개씩 들어오는가
- 큐가 쌓이는가
- 적용 비용이 얼마인가
- 입력 ACK는 얼마나 늦는가
- 보정 픽셀은 얼마나 큰가

## 스냅샷은 정답이지만, 화면에는 조심히 반영해야 한다

서버 스냅샷은 전투의 정답입니다. 하지만 매번 그대로 덮어쓰면 화면이 튑니다. 특히 내려찍기 타이밍은 짧고, 플레이어는 <span class="blog-inline-term">지금 눌렀다</span>는 감각에 민감합니다.

<figure class="blog-figure">
  <video src="https://haeinoh.vercel.app/blog/moai-wanna-slam-slam4.mp4" autoplay loop muted playsinline controls class="blog-media-phone"></video>
  <figcaption>판정이 짧은 액션일수록 입력, 서버 확정, 화면 보정의 간극이 잘 보입니다.</figcaption>
</figure>

그래서 스냅샷 적용은 단순한 복사가 아니었습니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-wanna-slam-snapshot-correction-01-input.png" alt="로컬 입력이 화면에 먼저 반응하는 장면" class="blog-media-snapshot-step" />
  <figcaption>1. 입력은 먼저 화면에 반응합니다. 이 즉시성이 없으면 손맛이 죽습니다.</figcaption>
</figure>

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-wanna-slam-snapshot-correction-02-snapshot.png" alt="서버 스냅샷 위치와 클라이언트 예측 위치가 다른 장면" class="blog-media-snapshot-step" />
  <figcaption>2. 서버 스냅샷이 도착하면 예측 위치와 서버 정답 위치가 어긋날 수 있습니다.</figcaption>
</figure>

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-wanna-slam-snapshot-correction-03-snap-bad.png" alt="서버 좌표를 그대로 덮어써서 화면이 튀는 장면" class="blog-media-snapshot-step" />
  <figcaption>3. 이 차이를 그대로 덮어쓰면 캐릭터가 순간 이동한 것처럼 보입니다.</figcaption>
</figure>

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-wanna-slam-snapshot-correction-04-smooth.png" alt="예측 위치와 서버 위치 사이를 부드럽게 보정하는 장면" class="blog-media-snapshot-step" />
  <figcaption>4. 그래서 화면에 보이는 위치는 서버 좌표를 향해 부드럽게 따라가게 했습니다.</figcaption>
</figure>

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-wanna-slam-snapshot-correction-05-large-error.png" alt="큰 위치 오차를 즉시 보정하고 기록하는 장면" class="blog-media-snapshot-step" />
  <figcaption>5. 너무 큰 오차는 숨기지 않고 바로 맞춘 뒤, rubberband로 기록해 원인을 추적했습니다.</figcaption>
</figure>

실제 구현도 이 방향이었습니다. 서버 좌표는 내부 상태에 반영하되, 화면에 보이는 좌표는 별도로 다뤘습니다. 원격 플레이어는 렌더 좌표가 서버 좌표를 부드럽게 따라가고, 로컬 플레이어는 예측으로 생긴 차이를 <strong>드리프트</strong>로 잡아 서서히 줄였습니다. 착지나 수직 정지처럼 눈에 잘 띄는 순간은 더 빠르게 보정했고, 16px 이상 크게 어긋난 경우는 rubberband로 기록해 원인을 분류했습니다.

또 한 프레임에 스냅샷을 무한히 처리하지 않도록 제한했습니다. 한 프레임에서 최대 4개까지만 적용하고, 적용 시간이 길어지면 다음 프레임으로 넘겼습니다. 큐가 오래 쌓이면 오래된 스냅샷을 줄여서 최신 상태를 따라가게 했습니다. 손맛을 살리려면 보정 자체보다도 <strong>보정을 언제, 얼마나, 어떤 방식으로 보여줄지</strong>가 중요했습니다.

결론은 단순했습니다. <strong>서버 상태는 정답이지만, 정답을 화면에 보여주는 방식은 별도의 설계 문제</strong>였습니다.

## 다음 문제: 서버는 전투만 돌리면 끝이 아니었다

여기까지는 전투 안쪽의 이야기입니다. 실제 서비스 형태로 만들자 서버의 책임은 전투 밖으로 넓어졌습니다.

- 상대가 나갔는데 바로 결과 처리되지 않는 문제
- 매치 성공 직후 게임 승리로 넘어가는 문제
- 게임 종료 후 바로 매칭이 다시 시작되는 문제
- 재대결 요청 UI가 겹치거나 softlock에 걸리는 문제
- AI 대전 결과가 레이팅/전적에 들어가면 안 되는 문제
- 코스튬과 칭호가 바로 동기화되지 않는 문제

이 문제들은 전투 tick과는 다른 영역입니다. 하지만 플레이어에게는 모두 <strong>"멀티가 불안하다"</strong>로 느껴집니다. 그래서 <strong>방 생성, 입장, 이탈, 결과, 재대결, 저장</strong>까지 하나의 흐름으로 봐야 했습니다.

## 마무리: 손맛과 공정성 사이

WebSocket 서버는 데이터를 주고받는 통로가 아니라, <strong>공정한 판정과 좋은 손맛 사이를 조율하는 장치</strong>였습니다.

그리고 이 서버는 혼자 존재하지 않았습니다. 인증은 Supabase와 연결되고, 오류는 Sentry로 추적되고, 웹 빌드는 GitHub Pages로 배포되고, 결과는 DB에 저장됩니다. 다음 글에서는 이 연결을 전체 아키텍처 관점에서 정리합니다.

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-04-fullstack-architecture">
  <img src="/blog/moai-devlog4-runtime-architecture-flow-v3.gif" alt="4편 대표 이미지" />
  <span class="blog-bookmark-body">
    <strong>4편. 전체 아키텍처: 클라이언트/서버/DB/배포/모니터링</strong>
    <span>LÖVE 클라이언트, WebSocket 서버, Supabase, Sentry, 배포 흐름이 어떻게 나뉘어 연결되는지 정리합니다.</span>
    <em>/blog/moai-wanna-slam-devlog-04-fullstack-architecture</em>
  </span>
</a>
