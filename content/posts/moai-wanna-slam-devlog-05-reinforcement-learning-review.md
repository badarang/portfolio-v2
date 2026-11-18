TITLE: [모아이는내려찍고싶다] 5. 강화학습 AI: Rule Based보다 재밌는 상대 만들기
SLUG: moai-wanna-slam-devlog-05-reinforcement-learning-review
TAGS: 게임개발, Reinforcement Learning, AI, Game AI, Python, Special
EXCERPT: Rule Based AI를 기준선으로 두고, 강화학습으로 더 재밌고 더 강한 상대를 만들기 위해 state, action, reward, 슬램 남용, 카운터 어택, 얼음맵 적응 문제를 실험한 기록입니다.
PUBLISHED: true
---

4편에서는 게임 클라이언트, 서버, DB, 배포, 모니터링이 어떻게 연결되는지 정리했습니다. 이번 글은 그 구조 위에서 돌아가는 **AI 상대**에 대한 이야기입니다.

모아이는내려찍고싶다는 입력이 단순한 게임입니다. 누르면 점프하거나 내려찍고, 위치와 속도와 상태가 판정을 만듭니다. 그래서 AI도 복잡한 버튼 조합을 배우는 것이 아니라, **언제 누를지, 언제 참을지, 언제 위험을 감수할지**를 배워야 했습니다.

AI를 만들 때 목표는 두 가지였습니다.

1. **Rule Based AI보다 상대하기 더 재밌을 것**
2. **내가 쉽게 못 깨는 수준까지 강해질 것**

현재 기준으로 보면 첫 번째는 어느 정도 달성했습니다. 강화학습 AI는 Rule Based AI보다 덜 뻔했고, 가끔 예상 밖의 타이밍을 만들었습니다.

하지만 두 번째는 아직 달성하지 못했습니다. 내가 못 깰 정도로 압도적인 AI가 되지는 않았고, 특정 상황에서는 여전히 이상한 선택을 했습니다. 이 글은 그 과정에서 무엇을 시도했고, 어디서 막혔는지를 정리한 기록입니다.

## 1. 먼저 Rule Based AI를 만들었다

처음부터 강화학습으로 시작하지 않았습니다. 먼저 사람이 이해할 수 있는 Rule Based AI를 만들었습니다. 그래야 나중에 강화학습 AI가 정말 더 나아졌는지 비교할 기준선이 생깁니다.

Rule Based AI는 대략 이런 파라미터 묶음으로 움직였습니다.

<figure class="blog-figure blog-figure-full">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog5-rulebased-knobs.png" alt="Rule Based AI 파라미터를 노브 형태로 정리한 이미지" class="blog-media-wide" />
  <figcaption>Rule Based AI는 판단 주기, 입력 간격, 실수율, 접근 거리, 내려찍기 정렬 같은 값을 사람이 직접 조절하는 방식이었습니다.</figcaption>
</figure>

이 방식의 장점은 명확했습니다. 왜 AI가 접근했는지, 왜 내려찍었는지, 왜 멈췄는지 설명할 수 있습니다.

문제는 행동이 금방 읽힌다는 점이었습니다. 파라미터를 세게 만들면 빠르고 정확한 AI는 만들 수 있었지만, 플레이어 입장에서는 “패턴이 보이는 상대”에 가까웠습니다. 그래서 다음 목표는 이 Rule Based AI를 이기는 강화학습 AI를 만드는 것이었습니다.

<figure class="blog-figure">
  <video src="https://haeinoh.vercel.app/blog/moai-wanna-slam-ai-scroll.mp4" autoplay loop muted playsinline controls class="blog-media-phone"></video>
  <figcaption>스테이지 모드 선택 화면. AI 실험은 결국 플레이어가 고르는 실제 게임 모드 안에서 의미가 있어야 했습니다.</figcaption>
</figure>

## 2. 강화학습으로 Rule Based AI를 이기게 만들기

강화학습으로 바꾸면서 가장 먼저 정해야 하는 것은 세 가지였습니다.

<figure class="blog-figure blog-figure-full">
  <img src="/blog/moai-devlog5-rl-loop-readable.svg" alt="state, action, reward가 순환하는 강화학습 루프 도식" class="blog-media-wide" />
  <figcaption>버튼은 단순했지만, AI가 무엇을 보고 어떤 선택을 했으며 그 선택을 어떻게 평가할지가 핵심이었습니다.</figcaption>
</figure>

이 게임의 action은 단순합니다. 사실상 핵심은 **누른다 / 누르지 않는다**입니다. 그래서 state와 reward 설계가 더 중요했습니다.

AI가 봐야 하는 state는 화면 픽셀보다 전투 정보에 가까웠습니다.

- 나와 상대의 위치
- 나와 상대의 속도
- 서로의 높이 차이
- 내가 점프 중인지, 내려찍기 중인지
- 상대가 접근 중인지, 멀어지는 중인지
- 지금 내려찍으면 맞출 수 있는지
- 플랫폼이나 지형이 사이를 막고 있는지
- 착지까지 남은 시간

그리고 reward는 단순히 이기면 `+1`, 지면 `-1`로만 두기 어려웠습니다. 승패만 보상으로 주면 학습 신호가 너무 늦게 옵니다. 그래서 중간 보상이 필요했습니다.

제가 보고 싶었던 reward는 한 가지가 아니라 여러 전투 감각의 조합이었습니다.

<figure class="blog-figure blog-figure-full">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog5-reward-map.png" alt="강화학습 AI의 중간 보상 설계를 육각형 맵으로 표현한 이미지" class="blog-media-wide" />
  <figcaption>승패만 보상으로 주기보다, 유리한 위치, 좋은 타이밍, 회피, 유효타, 위험 회피를 중간 신호로 나눠보고 싶었습니다.</figcaption>
</figure>

여기까지는 자연스러워 보였습니다. Rule Based AI를 상대로 반복해서 싸우게 하면, 강화학습 AI가 더 좋은 타이밍과 위치를 배울 것이라고 기대했습니다.

## 3. 첫 결과: 너무 슬램만 반복했다

처음 나온 AI는 똑똑하다기보다, **슬램을 남용하는 AI**에 가까웠습니다.

이유는 단순했습니다. 이 게임에서 슬램은 너무 좋은 행동이었습니다.

- 공격 수단이다.
- 빠르게 위치를 바꿀 수 있다.
- 특정 구간에서는 무적 시간처럼 작동한다.
- 맞추면 바로 큰 이득을 얻는다.

AI 입장에서는 슬램을 자주 누르는 것이 가장 쉬운 reward 경로였습니다. 사람처럼 “지금은 아껴야 한다”거나 “상대가 읽을 수 있다”는 감각이 없으니, 보상이 잘 나오는 행동을 계속 반복했습니다.

이 상태의 AI는 강해 보일 수는 있어도 재밌지는 않았습니다. 상대가 판단하는 느낌이 아니라, 좋은 기술을 계속 난사하는 느낌에 가까웠습니다.

그래서 슬램 자체의 규칙을 다시 봐야 했습니다.

## 3-1. 슬램에 0.2초 빈틈을 추가했다

슬램이 너무 좋은 선택지가 된 이유는 공격성과 안전성을 동시에 가지고 있었기 때문입니다. 공격 수단이면서 동시에 위험을 회피하는 수단이 되면, AI는 당연히 슬램을 많이 씁니다.

그래서 슬램 뒤에 약 `0.2초` 정도의 빈틈을 추가했습니다.

<figure class="blog-figure blog-figure-full">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog5-slam-risk.png" alt="슬램 후 0.2초 취약 시간을 추가해 행동 비용을 만든 이미지" class="blog-media-wide" />
  <figcaption>슬램이 공격, 이동, 안전을 동시에 해결하면 AI는 그 행동만 반복합니다. 짧은 빈틈은 빗나간 슬램을 카운터 타이밍으로 바꿨습니다.</figcaption>
</figure>

이 수정은 AI뿐 아니라 게임 자체에도 중요했습니다. 특정 행동이 공격, 이동, 방어를 동시에 해결하면 학습 AI는 그 행동만 파고듭니다. 결국 AI를 고치려면 reward만 만지는 것이 아니라, 게임 규칙 안에서 **선택지의 비용**도 같이 맞춰야 했습니다.

## 4. 카운터 어택을 AI에게 알려줬다

다음 문제는 AI가 상대 행동을 “기회”로 해석하지 못한다는 점이었습니다.

플레이어는 상대 슬램이 빗나간 순간을 금방 알아챕니다.

**지금 빈틈이다.**

하지만 AI에게는 이걸 따로 알려줘야 했습니다. 단순히 위치와 속도만 보면, 상대가 위험한 상태인지, 공격 후 빈틈인지, 지금 받아칠 타이밍인지 구분하기 어렵습니다.

그래서 카운터 어택을 하나의 스킬처럼 다뤘습니다. AI가 무조건 공격만 하는 것이 아니라, 상대의 실패를 보고 받아치는 행동을 선택할 수 있게 만든 것입니다.

카운터를 위해 AI가 알아야 하는 정보는 이런 것들이었습니다.

- 상대가 방금 슬램을 사용했는가
- 그 슬램이 빗나갔는가
- 상대에게 빈틈 시간이 남아 있는가
- 내가 그 시간 안에 접근하거나 공격할 수 있는가
- 카운터를 시도했을 때 내가 더 위험해지지는 않는가

이걸 넣으면서 AI 행동이 조금 더 게임처럼 보이기 시작했습니다. 단순히 먼저 때리는 봇이 아니라, 상대 실수를 기다렸다가 받아치는 순간이 생겼습니다.

## 5. 얼음맵에서도 적응할 수 있을까

마지막으로 확인하고 싶었던 것은 얼음맵이었습니다.

얼음맵은 일반 맵보다 어렵습니다. 바닥이 미끄럽고, 얼음 플랫폼이 부서지며, 같은 입력을 해도 결과가 안정적이지 않습니다. 평범한 맵에서 배운 거리 감각과 착지 타이밍이 그대로 통하지 않습니다.

여기서 질문은 이거였습니다.

**AI가 단순히 기본맵 패턴을 외운 것이 아니라, 지형이 바뀌어도 적응할 수 있을까?**

얼음맵에서 AI가 봐야 하는 정보는 더 늘어납니다.

<figure class="blog-figure blog-figure-full">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog5-ice-map-adaptation.png" alt="얼음맵에서 강화학습 AI가 고려해야 하는 요소를 정리한 이미지" class="blog-media-wide" />
  <figcaption>부서지는 플랫폼, 낮은 마찰, 착지 위치, 낙사 위험, 수직 위치가 모두 판단 대상이 되면서 기본맵보다 훨씬 불안정한 문제가 됐습니다.</figcaption>
</figure>

이 부분은 아직 완전히 해결됐다고 보기 어렵습니다. 기본맵에서는 Rule Based AI보다 재밌는 순간을 만들었지만, 얼음맵처럼 지형 자체가 전투 규칙을 흔드는 곳에서는 더 많은 학습과 보정이 필요했습니다.

## 현재 결론

이번 AI 실험의 결론은 단순히 “강화학습을 붙였다”가 아닙니다.

제가 얻은 결론은 이쪽에 가깝습니다.

<figure class="blog-figure blog-figure-full">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog5-result-summary.png" alt="강화학습 AI 실험의 현재 결론을 성공과 미달성으로 나눈 이미지" class="blog-media-wide" />
  <figcaption>덜 뻔한 상대를 만드는 데는 가까워졌지만, 내가 못 깨는 수준의 AI까지는 아직 도달하지 못했습니다.</figcaption>
</figure>

강화학습 AI는 Rule Based AI보다 덜 뻔한 장면을 만들었습니다. 특히 슬램 타이밍, 접근 방식, 카운터 시도에서 사람이 설계한 규칙과 다른 선택을 보여줬습니다.

하지만 강한 AI를 만드는 것은 별개의 문제였습니다. 보상을 잘못 주면 슬램만 반복했고, 슬램이 너무 강하면 게임 규칙 자체를 조정해야 했고, 얼음맵에서는 지형 변화까지 이해해야 했습니다.

그래서 이 실험은 “AI가 알아서 잘하게 만들었다”가 아니라, **게임의 재미를 reward와 규칙으로 다시 정의해본 과정**에 가까웠습니다. AI가 어떤 행동을 반복한다면, 그것은 AI가 이상한 것이 아니라 게임이 그 행동을 가장 이득이라고 말해주고 있는 것일 수 있습니다.

다음 글부터는 실제 모바일 기기에서 드러난 문제로 넘어갑니다. AI가 재밌게 움직여도, 모바일에서 셰이더가 깨지거나 렉이 생기면 플레이 경험은 바로 무너졌습니다.

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-06-mobile-shader-troubleshooting">
  <img src="/blog/moai-devlog6-uv-stability.gif" alt="6편 대표 이미지" />
  <span class="blog-bookmark-body">
    <strong>6편. 모바일 셰이더: 깨진 파도를 납득 가능한 화면으로 고치기</strong>
    <span>Android와 WebView에서 파도 셰이더가 깨지는 문제를 GLSL ES, 좌표계, UV mesh, fallback으로 나눠 해결한 기록입니다.</span>
    <em>/blog/moai-wanna-slam-devlog-06-mobile-shader-troubleshooting</em>
  </span>
</a>
