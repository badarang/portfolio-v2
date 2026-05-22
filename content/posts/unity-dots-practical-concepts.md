TITLE: [Unity] DOTS 실전 개념 정리 - Tag, EnableableComponent, CompanionLink 이해하기
SLUG: unity-dots-practical-concepts
TAGS: Unity, DOTS, ECS
EXCERPT: Unity DOTS를 공부하다 보면 구조 자체는 단순하게 느껴지지만, 막상 직접 사용해 보면 쉽게 이해되지 않는 개념들이 자주 등장합니다.특히 Tag Component, EnableableComponent, CompanionLink의 동작 방식 등은 처음 접하는 입장에서 혼란을 주기 쉽습니다. 게다가 C#에서 갑자기 En
PUBLISHED: true
PUBLISHED_AT: 2025-04-23T10:05:39+09:00
---
Unity DOTS를 공부하다 보면 구조 자체는 단순하게 느껴지지만, 막상 직접 사용해 보면 쉽게 이해되지 않는 개념들이 자주 등장합니다.
특히 **Tag Component, EnableableComponent, CompanionLink**의 동작 방식 등은 처음 접하는 입장에서 혼란을 주기 쉽습니다. 게다가 C#에서 갑자기 **EntityQuery **쿼리문 같은 문법이 등장한다는 점도 당황스럽습니다.
**Enumerable.Where()**처럼 LINQ를 통해 간접적으로 쿼리 비슷한 경험을 해본 적은 있어도, **ECS 구조에서 직접 쿼리를 날리는 방식**은 낯설게 느껴질 수밖에 없습니다.

이번 글에서는 이러한 DOTS의 핵심 개념들을 실전 위주로 정리해 보겠습니다.

## 1. 태그(Tag Component)는 GameObject의 Tag와 어떻게 다를까요?

Unity를 처음 배울 때 자주 사용하는 API 중 하나가 GameObject.FindWithTag("Player") 같은 방식입니다.
여기서 말하는 "태그(tag)"는 GameObject의 **Inspector**에서 설정할 수 있는 문자열 기반의 속성입니다.
즉, Unity 엔진이 내부적으로 오브젝트를 구분하거나 찾을 수 있도록 도와주는 **문자열 메타데이터**입니다.

하지만 Unity DOTS에서 말하는 **Tag Component**는 완전히 다른 개념입니다.

```csharp
public struct Selected : IComponentData { }
```

위와 같은 구조체는 **데이터 없이 존재만 하는 컴포넌트**입니다.
DOTS에서는 컴포넌트를 붙이는 것이 곧 데이터를 부여하는 것인데,
이처럼 아무 멤버가 없는 구조체를 붙이면 그 Entity가 특정 상태에 있다는 것을 의미하게 됩니다.
이러한 컴포넌트를 흔히 "태그 컴포넌트(Tag Component)"라고 부릅니다.

즉, GameObject의 태그는 문자열입니다.
반면, DOTS의 태그 컴포넌트는 빈 구조체 데이터입니다.

실제로 사용법도 다릅니다.

- MonoBehaviour 방식:

```csharp
GameObject.FindWithTag("Enemy");
```

- DOTS 방식:

```csharp
foreach (RefRO<Enemy> in SystemAPI.Query<RefRO<Enemy>>()) { ... }
public struct Enemy : IComponentData { }
```

## 2. 태그(Tag Component)에 변수를 추가한다면?

```csharp
public struct Selected : IComponentData
{
    public bool isSelected;
}
```

이렇게 구성하면 이제 태그가 아니라, 데이터를 가진 일반 컴포넌트가 됩니다.
WithAll<Selected>()처럼 태그를 조건으로 삼는 쿼리나, SetComponentEnabled 같은 Enable/Disable 동작에 사용할 수 없습니다.

<img class="blog-media-compact" src="/blog/tistory-14/media-01.webp" alt="티스토리 14 이미지 1" loading="lazy" />

Tag Component로서 작용할 때는 Runtime Inspector 상에서 체크박스가 나타납니다.

하지만 변수를 추가하게 되면,

<img class="blog-media-compact" src="/blog/tistory-14/media-02.webp" alt="티스토리 14 이미지 2" loading="lazy" />

이런 식으로 체크박스가 사라지게 됩니다.

### 3. 태그(Tag Component)에 변수를 추가했지만, 여전히 태그처럼 쓰고 싶다면?

### 방법 1. IEnableableComponent 사용

```csharp
public struct Selected : IComponentData, IEnableableComponent
{
    public bool isSelected;
}
```

기존 IComponentData 상속과 함께 IEnableableComponent 인터페이스까지 추가하면 됩니다.

### 방법 2. 태그와 데이터를 분리

```csharp
public struct Selected : IComponentData
{
    public float Value;
}

public struct SelectedActive : IComponentData { }
```

이 방식은 더 직관적이지만, struct를 2개 생성해야 한다는 단점이 있습니다.

## 4. EntityQuery는 정적 리스트가 아니다?

처음 DOTS를 접할 때 흔히 오해하는 것 중 하나는 EntityQuery가 "고정된 리스트"처럼 작동한다고 생각하는 것입니다. 하지만 **EntityQuery는 일종의 조건 필터이며, 호출할 때마다 ECS 월드의 현재 상태를 기준으로 동적으로 평가됩니다.**

즉, 쿼리를 한 번 만들었다고 해서 그 결과가 고정되어 있는 게 아닙니다. 매 프레임마다 **현재 월드에서 조건에 맞는 엔티티들을 즉시 추출**해주는 방식이기 때문에, 시스템 흐름을 짤 때 항상 이 점을 염두에 둬야 합니다.

```csharp
// 1. 쿼리를 통해 Selected 컴포넌트를 가진 모든 엔티티를 배열로 복사
var selectedQuery = SystemAPI.QueryBuilder().WithAll<Selected>().Build();
var selectedEntities = selectedQuery.ToEntityArray(Allocator.Temp); // 예: 10개 존재

// 2. 그 사이에 Selected 컴포넌트를 가진 새로운 엔티티 1개가 추가됨
var ecb = SystemAPI.GetSingleton<EndSimulationEntityCommandBufferSystem.Singleton>().CreateCommandBuffer(state.WorldUnmanaged);
var newEntity = ecb.CreateEntity();
ecb.AddComponent<Selected>(newEntity);

// 3. 복사한 배열(10개)에 대해 11개의 작업을 시도할 경우 오류 발생 가능
for (int i = 0; i < selectedQuery.CalculateEntityCount(); i++) // 이제 쿼리는 11개로 인식됨
{
    // ❗ selectedEntities.Length는 여전히 10
    // i == 10에서 IndexOutOfRangeException 발생!
    Entity e = selectedEntities[i]; // 여기서 에러
}
```

## 5. WithAll / WithNone / WithDisabled / WithPresent / WithAbsent 차이점 정리

DOTS에서 SystemAPI.Query<T>()는 단순히 컴포넌트를 가져오는 것이 아니라, **조건 필터**를 붙여 쿼리를 세분화할 수 있습니다.

<table style="border-collapse: collapse; width: 100%; height: 100px;" border="1" data-end="1002" data-start="718" data-ke-align="alignLeft" data-ke-style="style12">
<tbody>
<tr>
<td>메서드</td>
<td>설명</td>
</tr>
<tr style="height: 18px;" data-end="788" data-start="749">
<td style="height: 18px;" data-end="766" data-start="749">WithAll&lt;T&gt;()</td>
<td style="height: 18px;" data-end="788" data-start="766">T 컴포넌트를 가진 엔티티만 포함</td>
</tr>
<tr style="height: 18px;" data-end="829" data-start="789">
<td style="height: 18px;" data-end="807" data-start="789">WithNone&lt;T&gt;()</td>
<td style="height: 18px;" data-end="829" data-start="807">T 컴포넌트를 가진 엔티티는 제외</td>
</tr>
<tr style="height: 18px;" data-end="890" data-start="830">
<td style="height: 18px;" data-end="852" data-start="830">WithDisabled&lt;T&gt;()</td>
<td style="height: 18px;" data-end="890" data-start="852">Enableable Component 중 비활성화된 것만 포함</td>
</tr>
<tr style="height: 18px;" data-end="955" data-start="891">
<td style="height: 18px;" data-end="912" data-start="891">WithPresent&lt;T&gt;()</td>
<td style="height: 18px;" data-end="955" data-start="912">해당 컴포넌트가 있다면 조건 분기 처리가 가능함 (없어도 쿼리는 가능)</td>
</tr>
<tr style="height: 18px;" data-end="1002" data-start="956">
<td style="height: 18px;" data-end="976" data-start="956">WithAbsent&lt;T&gt;()</td>
<td style="height: 18px;" data-end="1002" data-start="976">해당 컴포넌트가 아예 없는 엔티티만 추출</td>
</tr>
</tbody>
</table>

특히 WithPresent는 옵셔널 컴포넌트를 다룰 때 유용하며, EnableableComponent와 함께 쓰면 상태 기반 로직을 깔끔하게 구성할 수 있습니다.

## 6. CompanionLink란?

Unity DOTS에서 GameObject를 Entity로 변환하면, **일부 MonoBehaviour 컴포넌트가 동작 가능한 상태로 유지**되어야 할 때가 있습니다. 이때 Unity는 자동으로 CompanionLink라는 특수 컴포넌트를 추가해, GameObject와 Entity 간의 동기화를 유지합니다.

대표적인 경우는 다음과 같습니다:

- SpriteRenderer가 붙어 있는 오브젝트
- Animator가 있는 오브젝트

Entity만 순수하게 유지하고 싶다면 MeshRenderer 기반으로 재구성하거나,

SubScene에 들어가는 프리팹을 DOTS 친화적으로 다시 설계해야 합니다.

## 7. 값 타입과 힙 할당 (GC 유발 여부)

C#에서 float, int, struct 등은 값 타입(Value Type)입니다. 이들은 스택에 저장되며, 일반적으로 GC(가비지 컬렉션)을 유발하지 않습니다. GC는 관리되는 힙(Managed Heap)에서만 일어납니다.

```csharp
object o = new float3(1, 2, 3); // ✅ 박싱(Boxing) &rarr; 힙 할당 &rarr; GC 유발
float3 pos = new float3(1, 2, 3); // ✅ 값 타입 &rarr; GC 없음
```

DOTS에서 GC를 피하기 위한 대표적인 방법은 다음과 같습니다:

- 값 타입 사용 (struct, float, int) *(이유: 스택에 저장되기 때문)*
- NativeArray, NativeList 등의 NativeCollection 사용 *(이유: Unity의 Allocator를 사용해 관리되는 메모리이기 때문)*
- ISystem 기반 시스템으로 전환 *(이유: 구조체 기반이기 때문, struct이므로 힙 할당 없음)*
- BurstCompile 활용 *(이유: Burst는 C# IL 코드를 네이티브 코드로 컴파일하기 때문에 참조 객체는 사용할 수 없음)*

## 📌 핵심 개념 한 줄 요약

- **태그 컴포넌트(Tag Component)**: 멤버 변수가 없는 빈 struct로, Entity의 상태를 나타내는 데 사용됩니다.
- **태그에 멤버 추가 시**: 더 이상 태그가 아니며, 일반 데이터 컴포넌트로 인식됩니다.
- **태그처럼 쓰고 싶을 땐**: IEnableableComponent를 쓰거나, 태그와 데이터를 별도로 나누는 방식이 좋습니다.
- **EntityQuery는 동적 필터**: 쿼리는 매번 실행 시 월드 상태를 다시 평가하며, 정적 배열과는 달리 실시간으로 변합니다.
- **WithAll / WithNone 등 쿼리 필터**: 조건에 맞는 엔티티만 쿼리 대상으로 삼는 필터 메서드로, 상태 기반 분기 로직에 유용합니다.
- **CompanionLink**: GameObject와 Entity를 연결하는 브리지로, SpriteRenderer나 Animator가 있을 때 자동 생성됩니다.
- **GC를 피하는 구조**: NativeCollection, ISystem, Burst는 관리되지 않는 메모리/구조체 기반이라 GC가 발생하지 않습니다.
