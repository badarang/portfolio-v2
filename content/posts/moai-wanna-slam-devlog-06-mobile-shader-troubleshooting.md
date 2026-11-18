TITLE: [모아이는내려찍고싶다] 6. 모바일 셰이더: 깨진 파도를 납득 가능한 화면으로 고치기
SLUG: moai-wanna-slam-devlog-06-mobile-shader-troubleshooting
TAGS: 게임개발, Troubleshooting, Shader, LÖVE, Android, Special
EXCERPT: 데스크톱에서는 멀쩡하던 파도와 화면 효과가 모바일에서 깨졌을 때, GLSL ES 문법, 좌표계, UV mesh, fallback으로 문제를 좁혀간 기록입니다.
PUBLISHED: true
---

5편까지는 게임의 규칙과 AI를 정리했습니다. 이제부터는 실제 기기에서 만난 문제입니다.

처음에는 클라이언트와 서버가 붙고, 게임이 돌아가고, 배포까지 되면 거의 끝난 줄 알았습니다. 그런데 모바일 실기 테스트를 시작하자 전혀 다른 문제가 나왔습니다.

<strong>데스크톱에서는 멀쩡한 화면이 Android와 WebView에서는 다르게 보였습니다.</strong>

특히 바다 맵의 파도가 문제였습니다. 파도가 너무 높게 올라오거나, 물 표면이 이상하게 밀리거나, 어떤 환경에서는 셰이더가 아예 fallback으로 빠졌습니다. 화면 효과는 장식처럼 보이지만, 실제로는 플레이 감각에 영향을 줍니다. 물이 화면을 이상하게 덮으면 유저는 “버그가 난 게임”으로 먼저 받아들입니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog6-wave-too-high.png" alt="모바일에서 파도 셰이더가 과하게 올라온 장면" class="blog-media-compact" />
  <figcaption>처음에는 파도 높이 자체가 이상했습니다. UI와 캐릭터보다 물 표면이 먼저 눈에 들어왔습니다.</figcaption>
</figure>

## 처음에는 감으로 고쳤다

처음 반응은 단순했습니다.

<strong>“파도 수치를 조금 낮추면 되나?”</strong>

실제로 amplitude나 waveBase 같은 값을 만져보면 어느 정도 좋아지는 것처럼 보였습니다. 하지만 이 방식은 오래 가지 않았습니다. 한 기기에서 맞춘 값이 다른 화면비에서는 다시 어긋났고, LÖVE 앱과 WebView에서도 보이는 위치가 조금씩 달랐습니다.

이때부터 문제를 “파도 모양이 별로다”가 아니라 <strong>좌표계가 흔들린다</strong>로 보기 시작했습니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog6-water-height-compare.png" alt="화면비와 출력 환경에 따라 물 높이가 다르게 보이는 비교 장면" class="blog-media-medium" />
  <figcaption>같은 맵이어도 화면비와 출력 환경에 따라 물이 차지하는 느낌이 달라졌습니다.</figcaption>
</figure>

## 문제를 나눠서 봤다

셰이더 문제는 한 번에 고치려고 하면 헷갈립니다. 그래서 증상을 먼저 쪼갰습니다.

- <strong>컴파일 문제</strong>: Android GLSL ES에서 통과하지 않는 문법이 있는가
- <strong>좌표 문제</strong>: 물 영역 안에서 계산해야 할 값을 화면 좌표로 계산하고 있지 않은가
- <strong>렌더링 문제</strong>: 사각형을 그릴 때 셰이더가 안정적인 UV를 받고 있는가
- <strong>실패 경로 문제</strong>: 셰이더가 실패했을 때 게임 화면이 계속 유지되는가

이렇게 나누고 보니, 단순히 “파도를 예쁘게 만들기”가 아니었습니다. 목표는 <strong>모바일에서도 같은 장면을 믿고 볼 수 있게 만드는 것</strong>이었습니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog6-shader-fix-pipeline.png" alt="셰이더 문제를 증상 분리, 문법 안정화, 좌표계 교체, UV mesh, fallback 순서로 해결한 흐름" class="blog-media-wide" />
  <figcaption>셰이더를 고친 순서. 예쁜 효과보다 먼저 같은 화면이 나오는 구조를 만들었습니다.</figcaption>
</figure>

## GLSL ES는 생각보다 까다로웠다

모바일에서는 셰이더 문법도 더 보수적으로 봐야 했습니다. 데스크톱에서는 넘어가던 코드가 Android에서는 컴파일 오류로 이어질 수 있었습니다.

처음에는 모바일이면 precision 선언을 직접 넣어야 할 것처럼 보였습니다.

```glsl
#ifdef GL_ES
precision highp float;
#endif
```

그런데 LÖVE가 플랫폼별 셰이더 코드를 변환하는 과정이 있고, 앱 코드에서 넣은 preamble이 오히려 충돌을 만들 수 있었습니다. 그래서 직접 넣은 GLSL ES preamble은 제거했습니다.

또 하나는 변수명이었습니다. 물결 하이라이트 계산 중 `patch`라는 이름을 썼는데, Android 쪽에서는 예약어처럼 걸렸습니다.

```glsl
float lightPatch = 1.0 - smoothstep(...);
lightPatch *= ...;
lightArea += lightPatch;
```

이건 엄청난 알고리즘 수정이 아닙니다. 하지만 모바일 셰이더에서는 이런 작은 문법 차이가 바로 검은 화면이나 fallback으로 이어집니다. 그래서 셰이더 코드는 <strong>멋있게 쓰는 것보다 보수적으로 쓰는 게 먼저</strong>였습니다.

## 진짜 핵심은 screen 좌표를 버리는 것이었다

가장 크게 바꾼 부분은 좌표계였습니다.

기존 방식은 물 영역의 사각형과 화면 좌표를 이용해 내부 좌표를 계산하는 쪽에 가까웠습니다.

```glsl
vec2 p = (screen_coords - rect.xy) / rect.zw;
```

이 방식은 얼핏 자연스럽습니다. 화면의 어느 지점을 그리고 있는지 아니까, 거기서 물 영역 안의 위치를 계산하면 될 것 같았습니다.

하지만 모바일에서는 화면 크기, canvas, viewport scale, 카메라 transform이 섞입니다. 여기서 조금만 어긋나도 셰이더 입장에서는 “물 영역 안의 y 위치”가 달라집니다. 그 결과가 파도 높이 이상, 표면 밀림, 기기별 차이로 보였습니다.

그래서 계산 기준을 바꿨습니다.

```glsl
vec2 p = texture_coords;
```

물 사각형 안에서 셰이더가 보는 좌표는 항상 `0.0`부터 `1.0` 사이입니다. 화면 어디에 그리든, 카메라가 어떻게 잡히든, 물 영역 내부의 좌표는 안정적으로 유지됩니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog6-uv-stability.gif" alt="screen 좌표 기반 물결과 UV 기반 물결의 차이를 보여주는 애니메이션" class="blog-media-medium" />
  <figcaption>왼쪽처럼 화면 좌표에 기대면 물결 기준점이 같이 흔들립니다. 오른쪽처럼 UV 기준으로 보면 물 사각형 안에서만 계산됩니다.</figcaption>
</figure>

## rectangle이 아니라 UV mesh로 그렸다

좌표를 `texture_coords` 기준으로 쓰려면 렌더링 쪽도 그에 맞춰야 했습니다. 그래서 단순한 사각형 그리기 대신, 0부터 1까지의 UV가 명시된 mesh를 만들었습니다.

```lua
mesh:setVertices({
    { x,     y,     0, 0 },
    { x + w, y,     1, 0 },
    { x + w, y + h, 1, 1 },
    { x,     y,     0, 0 },
    { x + w, y + h, 1, 1 },
    { x,     y + h, 0, 1 },
})
```

핵심은 화면 좌표와 셰이더 좌표를 분리하는 것입니다.

- 화면 좌표는 “어디에 그릴지”를 정합니다.
- UV 좌표는 “셰이더가 사각형 내부를 어떻게 볼지”를 정합니다.

이렇게 나누고 나서야 물결 계산이 화면비와 기기 차이에 덜 흔들렸습니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog6-wave-before-after.png" alt="파도 셰이더를 조정하며 이상한 상태와 정상에 가까운 상태를 비교한 장면" class="blog-media-medium" />
  <figcaption>왼쪽은 WebView에서 파도가 살짝 깨져 보인 상태이고, 오른쪽은 LÖVE2D로 직접 실행했을 때 정상에 가깝게 보인 상태입니다.</figcaption>
</figure>

## 실패해도 게임은 보여야 했다

셰이더는 실패할 수 있습니다. 특히 모바일에서는 기기와 드라이버 차이까지 감안해야 합니다. 그래서 셰이더가 실패했을 때 게임이 멈추거나 화면이 깨지는 것보다, 효과는 빠져도 플레이 가능한 상태로 돌아가는 편이 낫습니다.

그래서 물 셰이더는 세 단계로 처리했습니다.

1. fill, effect, line 셰이더를 각각 만든다.
2. 하나라도 실패하면 fallback 이유를 기록한다.
3. 셰이더 대신 기본 polygon과 foam line으로 물을 그린다.

실기 테스트에서는 디버그 오버레이도 중요했습니다. 이 표시는 유저에게 보여주는 게임 내 기능이 아니라, 개발 중 원인을 좁히기 위한 디버그 툴입니다. 그냥 “화면이 이상한데?”로 시작하면 원인을 찾기 어렵기 때문에, 현재 상태가 `OK`인지 `FALLBACK`인지, 어느 단계에서 실패했는지를 화면에서 바로 확인할 수 있게 했습니다.

```text
SEA SHADER: OK
fill:ok effect:ok line:ok mesh:ok
```

혹은 실패했을 때는 이런 식입니다.

```text
SEA SHADER: FALLBACK
reason: missing effect
```

이 작은 표시가 꽤 중요했습니다. 모바일에서는 로그를 보기도 번거롭고, 화면 캡처만 남을 때도 많기 때문입니다. 오버레이가 있으면 “기분상 이상한 화면”이 아니라 <strong>어느 단계에서 실패했는지 보이는 화면</strong>이 됩니다.

## 화면 전체 효과도 모바일 기준이 필요했다

파도 셰이더만 문제가 아니었습니다. 화면 전체에 걸리는 post-process도 모바일에서는 다르게 보였습니다. 특히 Android에서 fractional scale이 걸리면 nearest sampling과 scanline/pixel grid가 겹쳐 화면이 지저분하게 느껴질 수 있었습니다.

그래서 Android에서 출력 scale이 애매할 때는 canvas filter를 `linear`로 바꾸고, pixel grid 계열 강조를 끄는 처리를 넣었습니다.

```lua
local smoothOutput = isAndroid and hasFractionalScale
local filter = smoothOutput and "linear" or "nearest"
pixelGridAmount = smoothOutput and 0 or 1
```

이건 그래픽 취향 문제가 아니라 가독성 문제였습니다. 화면 효과가 게임의 맛을 살려야지, 캐릭터와 UI를 읽기 어렵게 만들면 안 됩니다.

<figure class="blog-figure">
  <img src="https://haeinoh.vercel.app/blog/moai-devlog6-shader-broken-volcano.png" alt="화면 전체 셰이더가 과하게 적용되어 캐릭터와 배경이 읽기 어려운 장면" class="blog-media-compact" />
  <figcaption>화면 효과가 과하면 분위기는 생기지만, 플레이 화면으로는 읽기 어려워집니다.</figcaption>
</figure>

## 마무리: 셰이더는 실패 경로까지 포함해서 완성된다

이번 문제를 겪고 나서 셰이더를 보는 기준이 조금 바뀌었습니다.

예전에는 “이 효과가 예쁜가?”를 먼저 봤다면, 지금은 먼저 이런 질문을 합니다.

- 모바일에서도 컴파일되는가
- 화면비가 바뀌어도 같은 위치에 그려지는가
- canvas scale이 달라도 너무 지저분해지지 않는가
- 실패했을 때 fallback으로 돌아가는가
- 실기 테스트 중 원인을 바로 볼 수 있는가

모아이는내려찍고싶다는 그래픽이 화려한 게임은 아닙니다. 하지만 그렇기 때문에 작은 화면 효과가 더 잘 보여야 했습니다. 파도, 용암, scanline, 물 하이라이트 같은 것들이 깨지면 게임의 의도된 B급 감성이 아니라 그냥 덜 만든 화면처럼 보입니다.

결국 이 트러블슈팅의 결론은 단순했습니다.

<strong>모바일 셰이더는 화면 좌표에 기대지 말고, UV 기준으로 안정화하고, 실패했을 때의 경로까지 같이 만들어야 합니다.</strong>

다음 글에서는 그래픽 문제를 넘어서, Android/iOS에서 남아 있던 렉과 네트워크 지연을 어떻게 나눠서 추적했는지 정리합니다.

<a class="blog-bookmark" href="/blog/moai-wanna-slam-devlog-07-mobile-network-lag-troubleshooting">
  <img src="/blog/moai-wanna-slam-correction-strategy.gif" alt="7편 대표 이미지" />
  <span class="blog-bookmark-body">
    <strong>7편. 트러블슈팅: 모바일 렉과 Pullback</strong>
    <span>Android 프레임 스파이크, SFX 초기화, SNAP backlog, correction, pullback을 나눠서 추적한 기록입니다.</span>
    <em>/blog/moai-wanna-slam-devlog-07-mobile-network-lag-troubleshooting</em>
  </span>
</a>
