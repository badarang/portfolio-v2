TITLE: [Riot Games] 발로란트 쉐이더 & 게임플레이 명확성 Part 2
SLUG: valorant-shader-clarity-part2
TAGS: Riot Games, Valorant, Shader, Gameplay Clarity
EXCERPT: VALORANT Shaders and Gameplay ClarityVALORANT had three graphics priorities - competitive integrity, high performance, and a sweet art style. This article describes how we balanced
PUBLISHED: true
PUBLISHED_AT: 2025-04-05T16:39:24+09:00
---
Riot Games의 Tech Blog 포스트를 번역 및 정리한 글입니다.

### CATEGORIES OF SHADERS IN VALORANT

VALORANT는 Forward Renderer를 사용합니다. 이는 각 객체가 자신을 완전히 렌더링하도록 지시하는 렌더링 방법입니다.

이 방식은 Deferred Renderer보다 정교하지는 않지만, 구형 GPU에서도 성능이 보장된다는 장점이 있습니다.

VALORANT에서는 Diffuse, Specular, Ambient 말고도 개성있는 스타일을 만들기 위해 추가적인 쉐이더 기술을 사용하는데,

이 글에서는 크게 Characters, Weapons, Environments, VFX 로 나누어 설명하고 있습니다.

### Character

**1. Diffuse, Specular, Ambient같은 기본적인 효과를 적용합니다.**

**2. Friend-or-Foe Fresnel 기법을 적용합니다.**

<img class="blog-media-wide" src="/blog/tistory-10/media-01.webp" alt="티스토리 10 이미지 1" loading="lazy" />

**Friend-or-Foe Fresnel**은 아군과 적군을 구별하기 위한 실루엣(외곽선) 효과입니다.

- 지나치게 밝거나 산만하지 않도록 효과를 조절합니다.
- 주로 상부에서 효과를 강조해, 마치 빛줄기가 캐릭터 위로 내려오는 듯한 느낌을 연출합니다.

**3. Skin Shading을 적용합니다.**

빛이 피부 내부로 산란되는 현상은 계산 비용이 크므로, VALORANT에서는 이를 FAKE로 구현합니다.

- Diffuse Gradient의 어두운 부분에 더 많은 붉은색을 추가합니다.
- ZBrush의 wax preview material을 참고하여 피부 특유의 부드럽고 약간 투명한 느낌(언더글로우)을 추가합니다.
- 언더글로우는 밝은 빛이 닿지 않는 부분에서 효과가 강화됩니다.

<img class="blog-media-wide" src="/blog/tistory-10/media-02.webp" alt="티스토리 10 이미지 2" loading="lazy" />

Skin Shading을 끄면 좀 더 게임같아 보입니다. Shading이 있으면 얼굴을 전체적으로 밝게 만들어 줍니다.

*(개인적으로 Skin Shading을 끄는 것이 좀 더 얄상해 보이네요. 전체적으로 밝으니까 넙데데한 느낌이 듭니다..)*

**4. Texture는 4가지를 사용합니다.**

- Albedo/Base Color: 표면의 기본 색상입니다.
- MAER: Metallic, Ambient Occlusion, Emissive, Roughness 를 한 텍스처에 담습니다.
- Normal Map: 미세한 표면 디테일을 표현합니다. 폴리곤 수를 늘리지 않고도 시각적 디테일을 보장합니다.
- Gradients: 확산 조명, 피부 확산 조명, 피부 언더글로우, 아군/적군 프레넬 효과 등을 구현합니다.

**5. Depth 조정**

<img class="blog-media-wide" src="/blog/tistory-10/media-04.webp" alt="티스토리 10 이미지 3" loading="lazy" />

적군 세이지가 2명 있습니다.

가까이 있는 세이지와 멀리 있는 세이지는 동일한 Friend-or-Foe Fresnel 정도를 가져야 합니다.

가까이 있는 세이지의 외곽선 효과가 더 진하면, 플레이어는 멀리 있는 적을 아군으로 착각할 수도 있으니까요.

<img class="blog-media-wide" src="/blog/tistory-10/media-05.webp" alt="티스토리 10 이미지 4" loading="lazy" />

그래서 VALORANT에서는 **DEPTH를 조절**하여 이를 해결합니다.

확대해서 컬러 스포이드로 체크하면 **멀리서 보이는 세이지의 외곽선 효과가 더 밝습니다. **

*실제 게임할 때 이를 눈치채셨나요?* 이를 똑같이 보이게 하는 것이 VALORANT 팀의 목표였을 것입니다.

**6. Cast Shadow를 1인칭 시점의 손이나 무기에만 적용합니다.**

<img class="blog-media-wide" src="/blog/tistory-10/media-06.webp" alt="티스토리 10 이미지 5" loading="lazy" />

Cast Shadow가 옵션으로 체크할 수 있다고 해 봅시다.

그러면 벽 뒤에 있는 적의 그림자를 통해 적의 위치를 예측할 수 있습니다.

하지만 Low Resolution으로 플레이하는 유저들은 이를 알아차리기 힘들겠죠.

그렇기 때문에 VALORANT에서는 Cast Shadow 적용 범위를 제한했습니다.

### Weapons

캐릭터에 사용되는 Gradient 방식 대신, **과거 방식인 Smoothstep 함수**를 사용하여 확산 효과를 조절합니다.

무기의 경우, 금속처럼 단단한 표면 위주로 되어 있어 섬세한 조명 표현이 필요하지 않습니다.그리고 계산이 빨라서 성능에 유리합니다.

<img class="blog-media-wide" src="/blog/tistory-10/media-07.webp" alt="티스토리 10 이미지 6" loading="lazy" />

### Environments

환경은 플레이어가 집중하는 대상이 아니므로, 너무 정교하게 표현할 필요 없이 효율적으로 처리합니다.

VALORANT는 The Finals 게임처럼 건물 구조가 바뀌는 게임이 아닙니다. 따라서 **Lightmaps를 이용해 미리 계산된 조명을 사용합니다.** 실시간 계산량이 줄어들기 때문에 고급 조명 효과도 구현 가능합니다.

<img class="blog-media-wide" src="/blog/tistory-10/media-08.webp" alt="티스토리 10 이미지 7" loading="lazy" />

### VFX

VFX는 각 효과마다 다르므로, 일반 셰이더 방식을 사용하지 않습니다.

대신, 아티스트가 직접 원하는 결과를 내도록 최적화합니다. 여기서는 **Translucency Sorting(반투명 정렬) 문제**를 다루고 있습니다.

반투명 정렬은 유리, 얼음, 연기 등을 렌더링할 때 필수적으로 고려되는 개념입니다.

불투명한 물체는 순서 상관없이 Z-Buffer를 써서 렌더링하면 됩니다.

하지만 반투명 물체는 그러지 못하지 때문에 그리는 순서가 중요합니다.

연기 A 뒤에 반투명 유리구슬 B가 있다고 합시다.

연기 A의 Transform을 점진적으로 뒤로 이동시키면, 유리구슬 B가 서서히 보이는 것이 아니라 1프레임만에 확 튀어나오게 됩니다.

<img class="blog-media-wide" src="/blog/tistory-10/media-09.webp" alt="티스토리 10 이미지 8" loading="lazy" />

출처: [https://dev.epicgames.com/documentation/ko-kr/unreal-engine/using-transparency-in-unreal-engine-materials](https://dev.epicgames.com/documentation/ko-kr/unreal-engine/using-transparency-in-unreal-engine-materials)

이러한 현상을 방지하려면, **연기 VFX가 항상 씬의 다른 반투명 오브젝트 위에서 렌더링되어야 합니다.**

Unreal Engine에서는 Translucency Sort Priority 파라미터 값을 제공하고 있어서, 편하게 이를 수정할 수 있습니다.

### Scaling

맵, 캐릭터 무기 등 각 요소간의 화질&균형을 맞춥니다.

- 환경: 화면 대부분을 차지하기 때문에, 낮은 품질 설정에서는 Diffuse 혹은 Specular 중 하나만 유지하도록 최적화합니다.
- 캐릭터: 게임 플레이에 중요한 요소이므로, Specular(하이라이트)를 꺼도 여전히 잘 보이게끔 디자인합니다.
- 무기: 주로 금속 재질이 많으므로, Diffuse 효과를 줄이고 Specular 효과를 유지합니다.

셰이더 연산 명령어 수 측정**:**

- **각 객체의 셰이더 연산 복잡도를 명령어 수(예: add, multiply 등)로 측정**하고, 품질 설정에 따라 명령어 수를 줄여 최적화합니다.
- ex) 맵은 높은 품질에서 100단위, 낮은 품질에서 41단위로, 캐릭터는 128에서 84단위로, 무기는 103에서 73단위로 조정됩니다.

<img class="blog-media-wide" src="/blog/tistory-10/media-11.webp" alt="티스토리 10 이미지 9" loading="lazy" />

왼쪽이 High, 오른쪽이 Low 입니다. 왼쪽 아래 돌 블럭을 보면 구분이 확실히 되는 것을 확인할 수 있습니다.

### Abilites

VALORANT 캐릭터는 고유한 스킬을 가지고 있고, 고사양/저사양 기기에서 끊임없이 플레이테스트를 진행합니다.

성능 이슈가 발생하면, 엔지니어나 아티스트가 문제를 해결하고, 필요 시 디자이너와 협의하여 대안을 마련합니다.

- **Sova의 궁극기:** 큰 반투명 실린더를 사용했으나, 저사양 기기에서 문제 발생 &rarr; 와이어프레임처럼 얇은 불투명 아웃라인으로 변경.
- **Viper의 궁극기:** 원래 부드러운 시야 제한 효과였으나, 보다 명확한 범위로 조정하여 시야 차단 효과를 구현.

### Conclusion

- 그래픽은 경쟁 게임에서 플레이에 방해되지 않으면서도 아름다움을 제공하는 중요한 요소입니다.
- **셰이더는 예술과 엔지니어링이 만나는 지점**이며, VALORANT 팀은 다양한 최적화와 아티스트의 감각을 통해 게임의 비주얼과 성능을 모두 만족시키는 결과를 만들어냈습니다.
- 이 과정은 단순한 엔지니어링 작업이 아니라,** 팀 전체(특히 아트 팀과의 협업)의 결과물**입니다.

VALORANT 팀이 *Good-Shading*을 위해 얼마나 많이 노력했는지를 엿볼 수 있었습니다.