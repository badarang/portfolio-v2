TITLE: [Unity] DOTS 개념 정리: Struct 구조 변경, ECB 사용법 등
SLUG: unity-dots-struct-ecb
TAGS: Unity, DOTS, ECS, EntityCommandBuffer
EXCERPT: 개발하다 보니 이런 에러가 떴습니다.InvalidOperationException: System.InvalidOperationException: Structural changes are not allowed while iterating over entities. Please use EntityCommandBuffer in
PUBLISHED: true
PUBLISHED_AT: 2025-04-23T10:44:20+09:00
---
<img class="blog-media-medium" src="/blog/tistory-15/media-01.webp" alt="티스토리 15 이미지 1" loading="lazy" />

개발하다 보니 이런 에러가 떴습니다.

```csharp
InvalidOperationException: System.InvalidOperationException: Structural changes are not allowed
while iterating over entities. Please use EntityCommandBuffer instead.
```

이런 에러는 왜 뜨는 것일까요..?

정답은 **Struct** **구조를 멀티스레드 환경에서 변경**하려고 했기 때문입니다.

Unity DOTS를 사용하다 보면 자주 마주치는 개념들 &mdash;** Struct** **구조 변경**, **EntityCommandBuffer(ECB)**, **WithEntityAccess**, 그리고 **BurstCompile 관련 디버깅 팁**까지 헷갈리는 포인트들을 정리해봤습니다.

### 🔧 1. 구조 변경(Structural Changes)이란?

**구조 변경**은 DOTS에서 Entity의 **구성 자체가 바뀌는 작업**을 말합니다. 예를 들어:

```csharp
//생성
Entity newEntity = ecb.CreateEntity();

//추가
ecb.AddComponent(newEntity, new MyComponent { Value = 1f });

//삭제
ecb.DestroyEntity(entity);
```

모두 구조 변경입니다. 이 작업들은 **멀티스레드 환경에서 위험**할 수 있기 때문에 반드시 안전한 방식으로 처리해야 합니다.

### 🧨 2. Entity 구조 변경이 왜 위험할까?

DOTS에서 Entity의 구조를 변경하는 작업(예: 삭제, 컴포넌트 추가 등)은 **멀티스레드 환경에서 매우 조심해야**합니다.

DOTS의 foreach는 내부적으로 **Job System을 통해 병렬 처리(멀티스레드)** 됩니다. 이 때문에 다음과 같은 문제가 발생할 수 있습니다:

❗ 예시 상황

<img class="blog-media-compact" src="/blog/tistory-15/media-02.webp" alt="티스토리 15 이미지 2" loading="lazy" />

전사 유닛이 죽는 순간, 아군 힐러 유닛이 전사에게 버프를 걸었다고 가정해봅시다.

- **Thread 1**에서 해당 Entity의 HP가 0이 되어 삭제됩니다.
- 동시에 **Thread 2**에서는 아직 살아 있다고 판단해 그 Entity에 버프 컴포넌트를 추가하려고 시도합니다.
- 하지만 Entity는 이미 삭제되었기 때문에, **존재하지 않는 Entity에 접근**하게 되며 다음과 같은 에러가 생길 수 있습니다.

- NullReferenceException
- InvalidOperationException: The entity does not exist
- 또는 런타임 크래시

이것이 바로 **Race Condition(경쟁 조건)** 입니다.

### 🧠 Race Condition이란?

Race Condition이란, 둘 이상의 쓰레드가 동시에 공유 자원에 접근할 때, 실행 순서에 따라 결과가 달라지거나 오류가 발생할 수 있는 상황을 말합니다.

- 공유 자원: 여기서는 Entity 데이터
- 위험성: 실행 타이밍에 따라 버그가 생기기도 하고, 안 생기기도 함 &rarr; **디버깅이 매우 어려움**

### ✔️ 해결 방법: EntityCommandBuffer 사용

Race Condition 문제를 방지하기 위해 DOTS에서는 구조 변경을 바로 하지 않고, **ECB(EntityCommandBuffer)에 '예약'**합니다. 그리고 **메인 스레드에서 안전하게 한번에 적용**하도록 합니다.

```csharp
EntityCommandBuffer ecb = SystemAPI
    .GetSingleton<EndSimulationEntityCommandBufferSystem.Singleton>()
    .CreateCommandBuffer(state.WorldUnmanaged);

//var ecb = new EntityCommandBuffer(Allocator.Temp);

foreach (var (hp, entity) in SystemAPI.Query<RefRO<HP>>().WithEntityAccess())
{
    if (hp.ValueRO.Value <= 0)
    {
        ecb.DestroyEntity(entity); // 안전한 구조 변경
    }
}

//ecb.Playback(state.EntityManager);
```

여기서 중요한 점:

- **ecb**는 변경 요청을 **Queue에 쌓고**,
- **Playback()**을 통해 **Main Thread에서 한번에 처리**합니다.

하지만 **EndSimulationEntityCommandBufferSystem**을 사용했다면,
**매 프레임 자동으로 Playback**되기 때문에 따로 호출할 필요 없습니다.

코드에서 만약 **EndSimulationEntityCommandBufferSystem**를 사용하지 않는다면(주석 처리한 부분),

**Playback**을 호출하여 매 프레임이 끝날 때마다 **EntityCommandBuffer**에 저장된 모든 명령을 실행해야 합니다.

### 🧬 4. WithEntityAccess

쿼리에 .WithEntityAccess()를 붙이면 foreach에서 마지막 인자로 entity를 받을 수 있습니다:

```csharp
foreach (var (hp, entity) in SystemAPI.Query<RefRO<HP>>().WithEntityAccess())
{
    ...
}
```

이 entity를 사용해 **삭제**, **버프**, **컴포넌트 추가 등**을 할 수 있습니다.

### 🔍 5. Bake 단계에서는 왜 구조 변경이 가능할까?

Bake 시점에서는 AddComponent() 등을 마음껏 해도 됩니다.

```csharp
public override void Bake(MyAuthoring authoring)
{
    var entity = GetEntity(TransformUsageFlags.Dynamic);
    AddComponent(entity, new MyComponent { ... }); // 문제 없음!
}
```

왜냐하면:

- 아직 게임이 실행되기 전이므로
- **멀티스레드도 아니고 구조 안정성 문제도 없음**

### ⚠️ 6. Burst 오류 디버깅 팁

Burst -> **Enable Compilation** 체크를 끄면, Burst 컴파일러가 꺼지면서 **에러 메시지가 직관적으로 보입니다**.

**왜 그런가요?**
Burst는 C# 코드를 **LLVM IR &rarr; 네이티브 코드**로 바꾸는 과정에서 난독화가 발생하기 때문입니다. 컴파일러 최적화가 꺼지면 오류 위치도 더 정확하게 보입니다.

(*C#에서 한 줄로 작성된 코드는 컴파일러 내부에서 여러 중간 단계(IL, IR, native) 로 분해되기 때문에, Enable Compilation을 끄더라도 오류의 줄이 정확하지 않을 수 있습니다.)*

## 📚 부록: NativeArray, NativeList, DynamicBuffer 비교 정리

DOTS에서는 자료구조도 **퍼포먼스**와 **동시성 제어**에 맞게 설계되어 있습니다. 다음은 대표적인 3가지 Native 구조 비교입니다.

<table style="border-collapse: collapse; width: 100%; height: 72px;" border="1" data-end="1257" data-start="967" data-ke-align="alignLeft" data-ke-style="style12">
<tbody>
<tr style="height: 18px;">
<td style="height: 18px; width: 21.162791%;"><span style="color: #000000; text-align: start; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">자료구조</span></td>
<td style="height: 18px; width: 12.325581%;"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">크기 변경</span></td>
<td style="height: 18px; width: 21.162791%;"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">사용 위치</span></td>
<td style="height: 18px; width: 45.348837%;"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">특징</span></td>
</tr>
<tr style="height: 18px;" data-end="1108" data-start="1043">
<td style="height: 18px; width: 21.162791%;" data-end="1062" data-start="1043"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">NativeArray&lt;T&gt;</span></td>
<td style="height: 18px; width: 12.325581%;" data-end="1069" data-start="1062"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">❌ 고정</span></td>
<td style="height: 18px; width: 21.162791%;" data-end="1083" data-start="1069"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">함수 내부 / Job</span></td>
<td style="height: 18px; width: 45.348837%;" data-end="1108" data-start="1083"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">고정된 크기의 빠른 배열. 가장 효율적</span></td>
</tr>
<tr style="height: 18px;" data-end="1171" data-start="1109">
<td style="height: 18px; width: 21.162791%;" data-end="1127" data-start="1109"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">NativeList&lt;T&gt;</span></td>
<td style="height: 18px; width: 12.325581%;" data-end="1134" data-start="1127"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">✅ 동적</span></td>
<td style="height: 18px; width: 21.162791%;" data-end="1148" data-start="1134"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">함수 내부 / Job</span></td>
<td style="height: 18px; width: 45.348837%;" data-end="1171" data-start="1148"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">가변 크기. 내부적으로 자동 재할당</span></td>
</tr>
<tr style="height: 18px;" data-end="1257" data-start="1172">
<td style="height: 18px; width: 21.162791%;" data-end="1193" data-start="1172"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">DynamicBuffer&lt;T&gt;</span></td>
<td style="height: 18px; width: 12.325581%;" data-end="1200" data-start="1193"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">✅ 동적</span></td>
<td style="height: 18px; width: 21.162791%;" data-end="1222" data-start="1200"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;"><b>Entity에 붙는 컴포넌트</b></span></td>
<td style="height: 18px; width: 45.348837%;" data-end="1257" data-start="1222"><span style="color: #000000; font-family: AppleSDGothicNeo-Regular, 'Malgun Gothic', '맑은 고딕', dotum, 돋움, sans-serif;">엔티티별 여러 개의 값 저장용 (ex. 블록 리스트 등)</span></td>
</tr>
</tbody>
</table>

NativeArray와 NativeList는 OnUpdate 등에서 **한두 프레임 단위로 배열 관리**를 할 때 주로 사용합니다.

일반 C# 배열과 비슷해 보여도, Unity의 **Allocator** 시스템을 통해 **Native 메모리에서 직접 관리**됩니다. *(GC 영향을 받지 않겠죠!)*

DynamicBuffer는 특정 Entity에 종속된 컴포넌트이며, **동적 배열처럼 작동하는 멤버 변수**의 기능을 수행합니다.

예를 들어, **MonoBehaviour Script의 List<GameObject> objectList;** 와 비슷한 맥락으로 사용이 가능합니다.
