TITLE: [Unity] DOTS 성능 최적화 단계별 비교
SLUG: unity-dots-performance-comparison
TAGS: Unity, DOTS, Optimization, ECS
EXCERPT: Unity 성능 최적화 단계별 비교: DOTS ECS, Job System, Burst Compile의 차이점은?Unity로 게임을 개발하다 보면 성능 최적화에 대한 고민은 피할 수 없습니다. Unity의 최신 아키텍처인 DOTS(Data-Oriented Technology Stack)는 이런 고민을 해결해줄 수 있는 강
PUBLISHED: true
PUBLISHED_AT: 2025-04-13T23:15:14+09:00
---
<img class="blog-media-compact" src="/blog/tistory-13/media-01.webp" alt="티스토리 13 이미지 1" loading="lazy" />

## Unity 성능 최적화 단계별 비교: DOTS ECS, Job System, Burst Compile의 차이점은?

Unity로 게임을 개발하다 보면 성능 최적화에 대한 고민은 피할 수 없습니다. Unity의 최신 아키텍처인 DOTS(Data-Oriented Technology Stack)는 이런 고민을 해결해줄 수 있는 강력한 도구입니다. 하지만 실제 개발 상황에서는 DOTS를 전부 도입하는 것이 어렵거나 불필요한 경우도 있죠.

그래서 이번 글에서는 다음과 같은 4가지 시나리오를 기준으로 성능 구조를 비교해보겠습니다:

- DOTS ECS를 사용하지 않는 경우
- DOTS ECS를 Main Thread에서만 사용하는 경우
- Job System을 사용하지만 Burst Compile은 하지 않는 경우
- Burst Compile까지 사용하는 경우

### ✅ 1번과 2번의 차이는 무엇일까?

**1번**은 기존 Unity 스타일의 개발 방식입니다. MonoBehaviour 중심으로 모든 로직이 돌아가고, Unity의 GameObject/Component 시스템만을 사용합니다. Transform.position += ... 이런 식으로 객체를 직접 조작하죠.

**2번**은 **DOTS의 ECS(Entity Component System)** 구조를 사용하지만, Job System이나 Burst 없이 **메인 스레드**에서만 실행하는 경우입니다. 즉, IComponentData, SystemBase, EntityQuery 등 ECS 기반 구조로 설계는 했지만, Job.Schedule() 또는 BurstCompile 없이 CPU 한 코어만을 사용합니다.

1번과 비교하여 2번은 struct 기반 데이터를 사용하므로, GC(Garbage Collecting)가 거의 발생하지 않고 런타임 성능이 보장됩니다.

## 💥 Job System을 사용하지만 Burst Compile은 하지 않는 경우

IJob, IJobParallelFor, IJobEntity 등을 사용해서 **병렬 처리**를 구현하지만, Burst Compiler를 적용하지는 않은 상태입니다.

- CPU 코어 다중 사용 가능 (성능 향상)
- 코드 구조가 더 복잡해짐
- Burst를 사용하지 않아도 많은 오브젝트에서 성능 차이 체감 가능

```csharp
public partial struct MoveJob : IJobEntity {
    public float deltaTime;

    public void Execute(ref LocalTransform transform, in MoveSpeed speed) {
        transform.Position += new float3(0, 0, speed.Value * deltaTime);
    }
}
```

## ⚡️Burst Compile까지 사용하는 경우

DOTS ECS + Job System + BurstCompile까지 결합한 **최고의 성능 구조**입니다. SIMD 명령어, LLVM 최적화 등을 통해 CPU 레벨에서 극한의 최적화가 이루어집니다.

- **멀티코어 + SIMD 최적화** &rarr; 매우 빠른 처리 가능
- 대량의 Entity를 실시간으로 처리할 수 있음
- 단점: Burst Compile이 적용된 코드는 고성능 네이티브 코드(C++ 수준)로 컴파일됩니다. 이 과정에서 다음과 같은 일반적인 C# 기능은 사용할 수 없습니다:

GameManager.Instance 같은 **싱글톤 접근**
- Camera.main, Input.GetKey() 같은 **UnityEngine 클래스 접근**
- 예외 처리 (try-catch)
- 할당 기반 컬렉션 (List<T>, Dictionary<T> 등)
- 참조 타입 클래스 (class) 사용 제한

### 💡 정리: 4단계 성능 비교

<table style="color: #000000; text-align: start; border-collapse: collapse; width: 100%; height: 92px;" border="1" data-end="3524" data-start="3273" data-ke-align="alignLeft" data-ke-style="style12">
<tbody>
<tr style="height: 10px;">
<td style="height: 10px; width: 9.069767%;">구분</td>
<td style="height: 10px; width: 18.953488%;">DOTS ECS</td>
<td style="height: 10px; width: 20.581395%;">Job System</td>
<td style="height: 10px; width: 17.55814%;">Burst 사용</td>
<td style="height: 10px; width: 15.465116%;">병렬 처리</td>
<td style="height: 10px; width: 18.139535%;">최적화 수준</td>
</tr>
<tr style="height: 18px;" data-end="3434" data-start="3407">
<td style="height: 18px; width: 9.069767%;" data-end="3412" data-start="3407">1번</td>
<td style="height: 18px; width: 18.953488%;" data-end="3416" data-start="3412">❌</td>
<td style="height: 18px; width: 20.581395%;" data-end="3420" data-start="3416">❌</td>
<td style="height: 18px; width: 17.55814%;" data-end="3424" data-start="3420">❌</td>
<td style="height: 18px; width: 15.465116%;" data-end="3428" data-start="3424">❌</td>
<td style="height: 18px; width: 18.139535%;" data-end="3434" data-start="3428">낮음</td>
</tr>
<tr style="height: 18px;" data-end="3465" data-start="3435">
<td style="height: 18px; width: 9.069767%;" data-end="3440" data-start="3435">2번</td>
<td style="height: 18px; width: 18.953488%;" data-end="3444" data-start="3440">✅</td>
<td style="height: 18px; width: 20.581395%;" data-end="3448" data-start="3444">❌</td>
<td style="height: 18px; width: 17.55814%;" data-end="3452" data-start="3448">❌</td>
<td style="height: 18px; width: 15.465116%;" data-end="3456" data-start="3452">❌</td>
<td style="height: 18px; width: 18.139535%;" data-end="3465" data-start="3456">중간 이하</td>
</tr>
<tr style="height: 18px;" data-end="3496" data-start="3466">
<td style="height: 18px; width: 9.069767%;" data-end="3471" data-start="3466">3번</td>
<td style="height: 18px; width: 18.953488%;" data-end="3475" data-start="3471">✅</td>
<td style="height: 18px; width: 20.581395%;" data-end="3479" data-start="3475">✅</td>
<td style="height: 18px; width: 17.55814%;" data-end="3483" data-start="3479">❌</td>
<td style="height: 18px; width: 15.465116%;" data-end="3487" data-start="3483">✅</td>
<td style="height: 18px; width: 18.139535%;" data-end="3496" data-start="3487">중간 이상</td>
</tr>
<tr style="height: 18px;" data-end="3524" data-start="3497">
<td style="height: 18px; width: 9.069767%;" data-end="3502" data-start="3497">4번</td>
<td style="height: 18px; width: 18.953488%;" data-end="3506" data-start="3502">✅</td>
<td style="height: 18px; width: 20.581395%;" data-end="3510" data-start="3506">✅</td>
<td style="height: 18px; width: 17.55814%;" data-end="3514" data-start="3510">✅</td>
<td style="height: 18px; width: 15.465116%;" data-end="3518" data-start="3514">✅</td>
<td style="height: 18px; width: 18.139535%;" data-end="3524" data-start="3518">최고</td>
</tr>
</tbody>
</table>
