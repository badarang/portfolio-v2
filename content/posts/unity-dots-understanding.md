TITLE: [Unity] DOTS 이해하기
SLUG: unity-dots-understanding
TAGS: Unity, DOTS, ECS, Burst, Data-Oriented
EXCERPT: Unity DOTS의 기본 개념, ECS 구조, Baking Process, 런타임 Entity 확인 방식, 값 타입과 참조 타입 차이를 정리한 글.
PUBLISHED: true
PUBLISHED_AT: 2025-04-08T23:54:33+09:00
---

Unity의 차세대 퍼포먼스 시스템인 **DOTS(Data-Oriented Technology Stack)**는 대규모 게임 개발에서 성능을 획기적으로 향상시켜주는 기술입니다.

## DOTS란?

DOTS는 **Data-Oriented Technology Stack**의 약자로, Unity에서 성능 중심으로 설계된 기술 스택입니다. 주요 구성 요소는 다음과 같습니다.

- ECS (Entity Component System)
- Burst Compiler
- Unity Physics
- NetCode (Network)

이러한 기술들은 특히 **RTS 게임**, **대규모 멀티플레이어 게임**처럼 많은 유닛을 빠르게 처리해야 하는 상황에서 매우 효과적입니다.

---

## ECS란?

ECS는 다음과 같은 구조로 이루어져 있습니다.

- **Entity**: ID만 존재하는 빈 껍데기입니다. 예: `Human`
- **Component**: 데이터만 가지고 있는 구조체입니다. 예: `EatingSpeed`
- **System**: Entity와 Component를 대상으로 실제 로직을 수행하는 부분입니다. 예: `DoEatSystem`

즉, 데이터와 로직을 철저히 분리하여, 캐시 최적화를 극대화할 수 있는 구조입니다.

<img class="blog-media-wide" src="/blog/unity-dots/cache-miss.webp" alt="객체 지향 구조에서 캐시 미스가 발생하는 예시" loading="lazy" />

CPU는 RAM(메인 메모리)에서 데이터를 가져오는 데 걸리는 시간을 방지하기 위해 캐시 메모리를 사용합니다.

하지만 캐시 메모리는 메인 메모리에 비해 용량이 훨씬 적기 때문에 어떤 데이터를 올려놓느냐가 굉장히 중요하죠.

캐시 메모리에 Random Access할 때, 기존 객체 지향 프로그래밍의 경우 메모리에 있는 데이터를 가져오기 위해 **포인터를 따라 여러 번의 간접 참조**를 해야 했습니다. 이 과정에서 *캐시 미스*가 자주 발생하게 되어 성능 저하로 이어질 수 있습니다.

*캐시 미스는 찾으려 하는 데이터가 캐시에 없어서 RAM까지 가게 되는 현상을 뜻합니다.*

예를 들어, 이런 코드가 있다고 합시다.

```csharp
List<MyClass> MyClassList = new List<MyClass>(10);

class MyClass {
    private int myNum;
    public int GetMyNum() => myNum;
}

foreach (auto e in MyClassList) {
    Debug.Log(e.myNum);
}
```

여기서 `e.MyNum`을 가져오기 위해 캐시 메모리에 산발적으로 흩어져 있는 데이터를 하나하나 가져와야 합니다.

캐시 메모리에 공간이 부족할 때마다 LRU, LFU 등의 방법을 통해 데이터를 바꿔치기 하는데, 이때 위치가 뒤섞이기 때문입니다.

<img class="blog-media-wide" src="/blog/unity-dots/linear-memory.webp" alt="DOTS에서 데이터가 선형적으로 배치되는 예시" loading="lazy" />

하지만 DOTS를 이용하면 **데이터가 메모리 상에 선형적으로 배치되어 있어** 캐시 친화적인 방식으로 접근할 수 있으며, 이를 통해 **연속적인 메모리 접근과 더 높은 성능**을 기대할 수 있습니다.

배열의 원소가 10개 있으면, 그 10개 객체의 주소가 순차적이라는 것입니다.

영상 출처:

<div class="blog-embed">
  <iframe src="https://www.youtube.com/embed/3m2GI_GSt5Y" title="[ECS/DOTS #1] Unity ECS - Entity Component System" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

---

## DOTS Baking Process란?

DOTS의 **Baking**은 GameObject 기반 데이터를 **Entity 데이터로 변환**하는 과정을 말합니다. GameObject를 미리 Bake해서 런타임에 바로 Entity로 사용할 수 있게 만들어 성능을 극대화하죠.

```text
GameObject (에디터에서 존재)
↓ Baking
Entity (런타임에서 생성되어 사용)
```

참고로 **빈 GameObject(Empty Object)**는 변환할 정보가 없기 때문에 Entity로 Bake되지 않습니다.

---

## Baking이 일어나는 타이밍

다음과 같은 시점에 Baking이 자동으로 일어납니다.

- 씬을 저장할 때
- GameObject의 위치 등을 변경했을 때
- Play Mode로 진입할 때

이때 Unity는 **Baker** 스크립트를 통해 GameObject를 Entity로 변환합니다.

---

## Scene에서 오브젝트가 안 움직이는 이유는?

DOTS를 처음 접할 때 많이 헷갈리는 부분이 바로 이 부분입니다. “씬에선 보이는데, Play하면 사라진다”는 현상은 다음과 같은 이유 때문입니다.

#### Entity는 에디터 Scene에서 보이지 않습니다

DOTS에서 생성된 Entity는 런타임에서만 존재합니다.

씬 뷰에서는 GameObject만 보이며, 변환된 Entity는 **Entity Debugger**를 통해서만 확인할 수 있습니다.

#### Bake된 GameObject는 런타임에서 Destroy됩니다

Bake가 완료된 GameObject는 실행 시 자동으로 파괴되고, Entity로 대체됩니다.

그래서 씬에서는 움직이는 GameObject가 보이지 않게 되는 것이죠.

---

## 움직이게 만들려면?

Entity를 Scene 뷰에서 확인하고 싶다면 Unity 설정에서 다음과 같이 바꾸면 됩니다.

1. `Edit → Preferences → Entities → Baking`
2. `Scene View Mode`를 **Runtime Data**로 설정

이렇게 하면 씬 뷰에서 런타임 데이터를 시각적으로 확인할 수 있게 됩니다.

<img class="blog-media-wide" src="/blog/unity-dots/runtime-data.webp" alt="Unity Entities Baking 설정에서 Runtime Data를 선택하는 화면" loading="lazy" />

---

## 값 타입과 참조 타입 구분

`IComponentData` 타입은 왜 `struct`만 받을까요? `class`는 안될까요?

`struct`는 **값 타입(Value Type)**으로, Unity DOTS의 핵심 원칙인 **고성능, 메모리 효율성, 캐시 최적화**를 만족시킬 수 있습니다.

`class`는 이에 비해 참조 타입(Reference Type)이기 때문에 GC 등의 이유로 성능에 문제를 일으킬 수 있죠.

| 구분 | 값 타입(struct) | 참조 타입(class) |
| --- | --- | --- |
| 메모리 위치 | 연속적(Stack) | 흩어짐(Heap) |
| 접근 | 직접 접근 | 간접 접근(포인터 참조) |
| GC 대상 | X | O |
| Burst/Jobs | 사용 가능 | 제한됨 |
| 복사 비용 | 작고 단순할수록 매우 효율적 | 포인터만 복사해도 캐시 비효율, 성능 저하 |
