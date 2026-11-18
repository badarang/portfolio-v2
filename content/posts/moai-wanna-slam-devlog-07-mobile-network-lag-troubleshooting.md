TITLE: [모아이는내려찍고싶다] 7. 트러블슈팅: 모바일 렉과 Pullback
SLUG: moai-wanna-slam-devlog-07-mobile-network-lag-troubleshooting
TAGS: 게임개발, Troubleshooting, Mobile, Networking, Performance, Special
EXCERPT: 모바일 서버 대전에서 보이던 렉을 Android 프레임 스파이크, SFX 초기화, 서버 보정, Pullback 문제로 나눠 추적한 기록입니다.
PUBLISHED: true
---

6편에서는 모바일에서 셰이더가 깨지는 문제를 다뤘습니다. 화면이 이상하게 보였기 때문에 원인을 좁히기 쉬운 편이었습니다.

그 다음에 더 오래 붙잡은 문제는 훨씬 애매했습니다.

**화면은 정상인데, 플레이가 끊겨 보인다.**

처음에는 그냥 “렉이 있다”로 느껴졌습니다. 그런데 로그를 쌓아보니 이 렉은 하나가 아니었습니다. Android에서는 프레임이 크게 멈추는 순간이 있었고, iOS에서는 프레임은 괜찮은데 캐릭터가 서버 위치로 다시 끌려가는 느낌이 더 컸습니다.

이 글은 그 둘을 분리해보는 트러블슈팅 기록입니다.

<aside class="blog-term-note">
  <strong>먼저 분리한 것</strong>
  <ul>
    <li><strong>프레임 스파이크</strong>: 한 프레임의 update가 갑자기 100ms, 500ms처럼 커지는 문제</li>
    <li><strong>SNAP backlog</strong>: 서버 스냅샷이 밀렸다가 한 프레임에 몰려 들어오는 문제</li>
    <li><strong>correction</strong>: 클라이언트가 그리던 위치와 서버 위치가 달라서 좌표를 보정하는 일</li>
    <li><strong>rubberband / pullback</strong>: 보정이 화면에 보이면서 캐릭터가 뒤로 끌려가는 느낌</li>
  </ul>
</aside>

## 처음에는 SNAP backlog를 의심했다

서버는 전투 시뮬레이션을 60Hz로 돌리고, 매 tick마다 `SNAP`을 보냅니다. Android 클라이언트는 매 프레임 socket에서 가능한 만큼 데이터를 읽고, 받은 SNAP을 파싱해서 적용합니다.

처음 로그는 꽤 충격적이었습니다.

```text
kind=network dt=0.033 netMs=354.59 snapCount=79 snapMs=218.43
qBeforeNet=0 qAfterNet=79 qAfterApply=0 recvChunks=7 recvBytes=25278 recvFrames=79

kind=frame rawDt=0.885 clampedDt=0.033 updateMs=583.77
```

한 프레임에서 SNAP 79개를 받고, 네트워크 receive와 SNAP 적용만으로 500ms 이상을 썼습니다. 이때 RTT는 45ms 정도였기 때문에 “서버 ping이 높아서 느리다”라고 보기 어려웠습니다.

그래서 첫 번째 가설은 단순했습니다.

| 가설 | 대응 |
| --- | --- |
| Android가 60Hz SNAP을 한 프레임에 몰아서 처리한다 | 한 프레임 처리량 제한 |
| 오래된 SNAP까지 전부 적용한다 | stale snapshot 정리 |
| apply가 update frame을 잠식한다 | apply budget 추가 |

이 방향은 필요했습니다. 하지만 이것만으로는 설명되지 않는 렉이 남았습니다.

## SNAP이 적어도 멈췄다

다음 로그에서는 SNAP이 1~2개뿐인데도 프레임이 크게 멈췄습니다.

```text
tick=198 playersMs=286.85 playerStateMs=286.80 updateMs=356.48
tick=272 playersMs=97.59 playerStateMs=97.43
tick=347 playersMs=57.99 playerStateMs=57.82
```

이때부터는 `Player:applyNetworkState()` 안을 더 잘게 쪼갰습니다. `playerWaterMs`, `playerLandSfxMs`, `playerLandHapticsMs`, `timingCountdownMs`처럼 실제로 무엇이 update frame을 막는지 보기 시작했습니다.

결과적으로 Android의 큰 프레임 멈춤은 네트워크 계산보다 **SFX 재생/초기화** 쪽에 가까웠습니다.

```text
tick=482 playerLandSfxMs=94.49ms
tick=871 sfxMs=29.17ms
tick=1171 sfxMs=16.85ms
timingCountdownMs=32.94ms, 27.42ms
```

플레이어는 이걸 네트워크 렉처럼 느낍니다. 하지만 실제로는 전투 중 캐시되지 않은 사운드를 만들거나 재생 준비하면서 update가 막히는 문제였습니다.

그래서 Android에서는 다음처럼 바꿨습니다.

- lobby/countdown 중 전투 SFX preload
- active 전투 중 캐시 안 된 SFX source 생성 금지
- 캐시 안 된 SFX는 preload queue에 넣고, 그 순간에는 스킵
- iOS와 데스크톱은 기존 동작 유지

이 수정 이후 큰 멈춤은 줄었습니다. 그런데 여전히 다른 종류의 잔렉이 남았습니다.

## 진짜 불편했던 것은 Pullback이었다

남은 렉은 프레임이 0.8초 멈추는 종류가 아니었습니다. 조작 반응은 빠릿해졌는데, 이동 중에 캐릭터가 아주 짧게 뒤로 끌려가는 느낌이 있었습니다.

체감은 이런 쪽이었습니다.

<figure class="blog-figure">
  <img src="/blog/moai-devlog7-pullback-loop.svg" alt="클라이언트 예측 후 서버 보정으로 뒤로 끌려가는 pullback 도식" class="blog-media-wide" />
  <figcaption>입력은 빠르게 반영되지만, 서버 위치와 어긋난 만큼 중간에 다시 끌려가는 느낌이 생겼습니다.</figcaption>
</figure>

내가 1에서 점프해서 4까지 가는 것을 기대하는데, 중간에 3으로 순간이동했다가 다시 4로 가는 듯한 버벅임입니다. 60초 게임 중 10번 넘게 보이면 체감이 꽤 큽니다.

중요한 점은 이때 프레임 로그가 나쁘지 않았다는 것입니다.

```text
FRAME p99 20.4ms
SNAP_MS p99 0.8ms
RECV / DECODE / HANDLE 정상
Q_AFTER max 2
```

큐가 폭발한 것도 아니고, SNAP 적용 시간이 큰 것도 아니었습니다. 대신 correction 수치가 문제였습니다.

```text
PING avg 37.7 / p95 50.7 / p99 82.5
INPUT_ACK_MS avg 41.1 / p95 52.6 / p99 66.0
CORRECTION_PX avg 8.0 / p95 19.7 / p99 32.0
MAX_CORRECTION_PX p95 35.0 / p99 63.0
rubberbands=520
```

이건 “서버에서 데이터가 늦게 온다”보다 “서버가 확정한 위치와 클라이언트가 그리고 있던 위치가 자주 다르다”에 가까웠습니다.

## hostRole 문제가 아니었다

처음에는 hostRole도 의심했습니다. P1이 host라서 더 렉이 있나, P2가 non_host라서 더 늦나 같은 식입니다.

그런데 두 판을 비교해보니 슬롯 문제가 아니었습니다.

| 판 | 빠른 쪽 | 느린 쪽 |
| --- | --- | --- |
| 첫 판 | P1 host, PING avg 17ms | P2 non_host, PING avg 35ms |
| 둘째 판 | P2 non_host, PING avg 17ms | P1 host, PING avg 35ms |

느린 쪽은 슬롯이 아니라 기기/회선 쪽을 따라갔습니다. 서버 권위형 구조에서 여기서 말하는 hostRole은 실제 방장이 아니라 P1 슬롯 의미에 가까웠고, 원인은 hostRole보다 입력 ACK와 correction 쪽에 있었습니다.

## smoothing을 잘못 넣으면 손맛이 깨진다

보정이 튀니까 처음에는 smoothing을 넣으면 될 것처럼 보였습니다. 하지만 로컬 플레이어까지 부드럽게 따라가게 만들면 문제가 생깁니다.

내가 버튼을 눌렀는데 내 캐릭터가 서버 위치를 부드럽게 따라가느라 미끄러지면, 멀티 액션 게임에서 가장 중요한 손맛이 깨집니다.

그래서 다음에는 로컬 입력을 클라이언트에서 먼저 예측했습니다.

반응성은 좋아졌습니다. 누르면 바로 움직였습니다. 하지만 그 다음 문제가 생겼습니다.

**클라이언트가 앞서가고, 서버가 계속 조금씩 뒤로 당기는 Pullback입니다.**

예를 들어 클라이언트 화면에서는 `(3, 0)`까지 간 것처럼 보이는데, 서버 기준으로는 `(2.9, 0)`입니다. 그러면 서버 보정이 아주 작게, 하지만 반복적으로 들어옵니다. 이게 쌓이면 “빠릿한데 이상하게 덜컥이는” 느낌이 됩니다.

<figure class="blog-figure">
  <img src="/blog/moai-devlog7-wall-correction.svg" alt="착지와 벽 접촉 순간에 클라이언트 예측과 서버 판정이 어긋나는 도식" class="blog-media-wide" />
  <figcaption>착지와 벽 접촉처럼 상태가 바뀌는 순간에는 작은 좌표 차이도 뒤로 끌리는 움직임처럼 보였습니다.</figcaption>
</figure>

## forward extrapolation은 실패했다

그 다음에는 서버 좌표에 속도와 시간을 곱해서 현재 위치를 앞당기는 방법도 시도했습니다. 여기서 말하는 <span class="blog-inline-term">forward extrapolation</span>은 방금 받은 서버 위치가 약간 과거의 위치라고 보고, 그 사이에 흐른 시간만큼 캐릭터가 더 이동했을 것이라고 예상해서 화면 위치를 앞으로 당겨 그리는 방식입니다.

```text
predictedX = serverX + velocityX * elapsed
predictedY = serverY + velocityY * elapsed
```

단순 이동만 있는 게임이라면 어느 정도 맞을 수 있습니다. 하지만 이 게임에는 연속 이동이 아닌 상태가 많았습니다.

- 얼음 바닥
- 벽 상태
- 낙사와 rescue
- 내려찍기
- 착지 snap
- loading/countdown tick reset

이런 상황에서는 좌표만 앞당기면 오히려 이상한 위치가 나옵니다. 상태 전환이 틀린데 위치만 보정하면 캐릭터가 더 부자연스럽게 튑니다.

그래서 forward extrapolation은 버리는 쪽이 맞았습니다. 이 문제는 generic extrapolate로 해결할 문제가 아니라, **상태별로 prediction과 보정 방식을 다르게 나눠야 하는 문제**였습니다.

## 지금 맞다고 보는 방향

현재 가장 그럴듯한 방향은 로컬 플레이어를 늦추는 smoothing이 아닙니다.

**remote-only correction smoothing**입니다.

상대 캐릭터를 항상 80ms 늦게 보여주는 방식도 아닙니다. 그건 한 박자 늦는 느낌이 납니다. 대신 큰 correction이 발생한 순간만 화면상의 충격을 짧게 흡수하는 방식입니다.

| 원칙 | 이유 |
| --- | --- |
| local player에는 적용하지 않기 | 내 입력 반응성 보호 |
| remote player에만 제한 적용 | 상대가 튀는 느낌만 줄이기 |
| 큰 vertical snap 위주로 적용 | 착지/낙하 correction 완화 |
| 50~67ms 안에 끝내기 | 늦게 따라오는 느낌 방지 |
| x축은 거의 즉시 반영 | 상대가 미끄러지는 느낌 방지 |
| 피격/사망/구조는 즉시 반영 | 의미 있는 전투 결과 보호 |

구현 감각은 이렇습니다.

```text
serverY는 즉시 최신 값으로 갱신한다.
visualY만 이전 화면 위치와 새 serverY의 차이를 offset으로 들고 있는다.
offsetY를 3~4프레임 동안 빠르게 줄인다.
drawY = serverY + offsetY
```

판정은 최신 서버값입니다. 화면만 아주 짧게 충격을 흡수합니다. 그래서 손맛을 해치지 않으면서 상대 캐릭터의 덜컥임만 줄이는 쪽에 가깝습니다.

<figure class="blog-figure">
  <img src="/blog/moai-devlog7-correction-policy.svg" alt="로컬 플레이어, 원격 플레이어, 전투 결과별 보정 정책" class="blog-media-wide" />
  <figcaption>정답은 서버 좌표지만, 화면에는 로컬 입력, 상대 캐릭터, 전투 결과를 서로 다르게 반영해야 했습니다.</figcaption>
</figure>

## 결론: 렉이라는 말을 더 잘게 쪼개야 했다

이 문제에서 제일 중요한 교훈은 하나였습니다.

**플레이어가 말하는 렉은 하나의 원인이 아니다.**

Android의 큰 멈춤은 SFX 초기화와 SNAP backlog 방어로 줄여야 했고, iOS에서 보이던 잔렉은 correction, prediction, pullback을 봐야 했습니다. 둘 다 플레이어에게는 렉처럼 느껴지지만 해결 방법은 완전히 다릅니다.

그래서 이제는 “네트워크가 느리다”로 바로 결론내리지 않으려고 합니다. 먼저 프레임, 사운드, SNAP 큐, 입력 ACK, correction px, rubberband, 상태 전환을 나눠서 보고, 그 다음에 원인을 좁히는 방식으로 접근해야 합니다.

이번 글은 완전히 끝난 해결기가 아니라, **큰 원인을 걷어낸 뒤에도 마지막까지 남는 체감 렉을 어떻게 분해했는지**에 대한 기록입니다. 큰 버그를 잡고 나면 남는 것은 보통 작은 차이입니다. 그런데 액션 게임에서는 그 작은 차이가 손맛을 결정합니다.

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-08-benchmark-infrastructure">
  <img src="/blog/moai-devlog00-bookmark-08.gif" alt="8편 대표 이미지" />
  <span class="blog-bookmark-body">
    <strong>8편. 벤치마크: 서버와 AI를 숫자로 검증하기</strong>
    <span>매칭, WebSocket 연결, 결과 저장, Auth rate limit, AI 난이도를 벤치마크 도구로 확인한 기록입니다.</span>
    <em>/blog/moai-wanna-slam-devlog-08-benchmark-infrastructure</em>
  </span>
</a>
