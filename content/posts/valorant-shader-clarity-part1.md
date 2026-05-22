TITLE: [Riot Games] 발로란트 쉐이더 & 게임플레이 명확성 Part 1
SLUG: valorant-shader-clarity-part1
TAGS: Riot Games, Valorant, Shader, Gameplay Clarity
EXCERPT: VALORANT Shaders and Gameplay ClarityVALORANT had three graphics priorities - competitive integrity, high performance, and a sweet art style. This article describes how we balanced
PUBLISHED: true
PUBLISHED_AT: 2025-04-05T15:32:20+09:00
---
Riot Games의 Tech Blog 포스트를 번역 및 정리한 글입니다.

VALORANT 게임에서는 6.9ms 이내에 각 프레임이 렌더링되어야 했습니다.

따라서 엔지니어 Brandon님은 **리얼리즘 vs 성능**에 대한 고민을 끝없이 했다고 합니다.

리얼리즘을 챙기자니 성능이 저하되고, 성능을 챙기자니 리얼리즘이 붕괴될 수 있으니까요.

<img class="blog-media-wide" src="/blog/tistory-9/media-01.webp" alt="티스토리 9 이미지 1" loading="lazy" />

VALORANT 팀에서는 가장 중요하게 생각하는 3가지의 메인 필라를 만들었고, 이를 최대한으로 구현하기 위해 노력했습니다.

필라는 **'성능', '경쟁의 공정성', '예술'** 입니다.

VALORANT는 2012년에 만들어진 가벼운 노트북에서도 원활하게 실행할 수 있으면서도, 게임 내 그래픽 품질이 경쟁에 영향을 미치지 않도록 하는 방법을 오래 고민했다고 합니다. 그래서 가독성을 중요하게 생각했죠. 이 글에서는 가독성에 큰 영향을 주는 3가지 요소 "Material Response, Domain-Specific Shaders, features" 를 다루고 있습니다.

### MATERIAL RESPONSE

<img class="blog-media-wide" src="/blog/tistory-9/media-02.webp" alt="티스토리 9 이미지 2" loading="lazy" />

실제 조명 물리 효과를 단순화해 게임 내에서 어떻게 구현하는지 설명합니다.

게임 조명은 다음과 같은 세 가지 주요 구성 요소로 이루어집니다.

Diffuse: 난반사입니다. 표면이 매트하게 보이도록 합니다.

Specular: 반사광입니다. 표면에 광택을 줍니다.

Ambient: 주변광입니다. 직사광이 없더라도 전체적으로 밝게 만듭니다.

### Diffuse - 난반사

Diffuse를 구현하기 위해 활용되는 기본 개념은 **Lambertian(람베르트) 반사**입니다.

Lambertian Surface는 모든 방향으로 같은 양의 빛을 반사합니다. 따라서 **관찰자의 위치와 관계 없이 같은 밝기로 보이게 됩니다.**

<img class="blog-media-wide" src="/blog/tistory-9/media-03.webp" alt="티스토리 9 이미지 3" loading="lazy" />

현실에서 보이는 물체들은 자세히 보면 굉장히 울퉁불퉁합니다. 그래서 빛이 표면에 흡수&방출되는 과정에서 색상이 조금씩 달라지겠죠.

하지만 컴퓨터로 이를 구현하는 것은 매우 힘들고 불필요합니다. 그래서 **표면에서 균일하게 반사하는 것으로 이를 대체합니다.**

빛이 수직으로 들어온다면, 에너지 효율이 100%가 되겠죠. 이때 cos 0° = 1입니다.

빛이 60도 각도로 들어오면, cos 60° = 0.5 이므로 절반만큼만 에너지를 받겠죠.

**빛이 표면에 닿는 효율은 cosθ 에 비례합니다.**

따라서 컴퓨터 그래픽스에서 Lambertian 모델은

```csharp
최종 밝기 = 광원의 세기 x 재질의 반사율 x cos(θ)
```

이런 식을 사용하여 밝기를 계산합니다.

cos 값은 내적을 이용하면 쉽게 구할 수 있습니다.

표면의 법선 벡터를  A, 광원에서 표면으로 향하는 방향 벡터를 B라고 합시다.

이때 **A · B = |A| x |B| x cos(θ)** 입니다.

A, B는 단위벡터이므로, **내적을 한 값이 바로 cos 값이 되는 것입니다.**

VALORANT에서는 Lambertian 반사와 함께

- Half-Lambert: 어두운 부분을 부드럽게 하기 위해 상수를 더함.
- Gradient Lambert: 여러 구간에 대해 부드럽게 텍스처를 적용함.

이런 기법을 사용하여 성능 부담 없이 다양한 조명 효과를 표현합니다.

### Specular - 반사광

표면이 빛을 반사해 생기는 하이라이트 효과입니다.

Phong, shading, Blinn-Phong, Beckmann 등의 모델이 널리 알려져 있죠.

<img class="blog-media-wide" src="/blog/tistory-9/media-04.webp" alt="티스토리 9 이미지 4" loading="lazy" />

기존 방식에서는 **가상의 빛을 만들어서 수학적으로 계산**했습니다.

반사광을 하나하나 직접 계산해서 GPU 부하가 컸죠.

게다가, **반사광의 Roughness를 지수함수로 모델링**했기 때문에 시간 복잡도가 컸습니다.

-> *빛의 각도에 따라 밝기가 급격하게 줄어들어야 하기 때문입니다. 그래서 Exponential한 그래프를 사용하여 표현한 것입니다.*

VALORANT에서는 **파노라마 HDR 이미지**를 이용해 복잡한 조명 효과를 비교적 간단하게 구현합니다.

파노라마 HDR 이미지는 High Dynamic Range, 즉 훨씬 넓은 범위의 밝기를 가진 360° 이미지입니다.

이 이미지를 사용해 전체 반사광 정보를 미리 저장하고, 그 이미지를 뿌려주는 방법으로 계산량을 최소화 시킵니다.

- Roughness: 거칠기 수준에 따라 블러 처리한 HDR 이미지를 미리 준비하여, 계산을 최소화합니다.
- Mipmap: 원본 이미지의 축소 버전들을 여러개 준비합니다. (2048, 1024, 512...) 거칠기가 높을수록 더 낮은 해상도의 Mipmap을 사용합니다. 이렇게 하면 자동으로 흐릿한 반사광이 표현되겠죠.

### Ambient - 주변광

기존 게임에서는, 모들 물체에 일정한 밝기를 더하는 방식을 사용합니다. 그렇지 않으면 완전히 검게 렌더링될 것이니까요.

하지만 그렇게 되면 리얼리즘이 보장되지 않습니다. 그림자를 렌더링하는 것이 자연스럽지 않게 되겠죠.

VALORANT에서는 일반적인 Ambient처럼 무조건 일정한 밝기를 주지 않습니다. *그럼 어떻게 하나요?*

VALORANT는** Diffuse Gradient**를 사용합니다.

**환경광은 Unreal의 Indirect Lighting Cache로 해결합니다.** 이미 만들어져 있으니, 로딩 시간은 길어질 수 있어도 실시간 렌더링 속도는 보장하는 것이죠.  *Light를 Baking한다고 생각하면 편할 것 같습니다.*

**움직이는 객체는 가장 가까운 샘플을 찾아 주변 밝기를 계산합니다.** 이때 연산량이 늘어날 수 있으나, 가까운 조명을 찾는 것은 실시간 탐색이 아니고, 조명 샘플을 찾는 과정은 공간 분할을 통해 쉽게 가능하기 때문에 퍼포먼스 부담이 적습니다.

**Diffuse와 Specular도 따로 처리합니다**. 따로 처리하면 리얼리즘이 떨어질 수 있으나 어두운 곳에서도 금속의 느낌을 살리는 등 강조하고 싶은 부분을 확실히 표현할 수 있게 되고, 전반적인 아트 스타일이 유지됩니다.

<img class="blog-media-wide" src="/blog/tistory-9/media-05.webp" alt="티스토리 9 이미지 5" loading="lazy" />

총의 매트한 느낌이 어두운 배경에서도 잘 드러나는 것을 볼 수 있습니다.

Diffuse와 Specular를 함께 처리했다면 이런 느낌을 내는 것이 힘들었겠죠.