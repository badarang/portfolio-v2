TITLE: [Riot Games] 리그오브레전드 레나타 챔피언 개발 & 광란 CC기 & 리팩토링
SLUG: renata-champion-refactoring
TAGS: Riot Games, League of Legends, Refactoring
EXCERPT: Getting into the Guts of BerserkIn this article, I’ll cover how we took Renata Glasc's ultimate from a hacky prototype to a game-changing spell, cleaning up some legacy code and sy
PUBLISHED: true
PUBLISHED_AT: 2025-04-07T15:17:31+09:00
---
Riot Games의 Tech Blog 포스트를 번역 및 정리한 글입니다.

### 레나타 궁극기가 뭘까?

레나타 궁극기에는 '광란' CC기가 달려 있습니다.

**궁극기에 맞은 적이 같은 팀을 공격하게 만드는 기술**인데요.

당연하게도 스킬은 사용하지 않고, 기본 공격만을 사용하기 때문에 원거리 딜러에게 치명적인 CC기입니다.

한타의 판도를 뒤집을 수 있는 강력한 궁극기로 평가받는 이 기술을 개발하면서, 어떤 고민을 했는지 살펴보겠습니다.

<img class="blog-media-wide" src="/blog/tistory-11/media-01.webp" alt="티스토리 11 이미지 1" loading="lazy" />

사실 저도 'Necro Rumble' 이라는 전 작품에서 레나타 스킬과 비슷한 서큐버스 유닛을 개발한 경험이 있습니다.

적 엘리트 유닛인 '천사'는 적군에게 힐을 주는 힐러입니다.

하지만 이를 언데드 유닛으로 만들면, 서큐버스로 되살아납니다.

서큐버스는 적군 유닛을 매혹시켜 같은 팀을 공격하게 만드는 방사형 파도를 방출합니다.

저는 이 기능을 만들때 Unit의 로컬 변수인 **TargetFaction을 일정 기간 변경하는 방법**으로 개발했습니다.

'네크로맨서'가 컨셉인 게임었기 때문에, 공격 타켓 종족을 설정하는 TargetFaction을 미리 만들어 두었습니다.

그래서 비교적 쉽게 기능을 추가할 수 있었습니다.

유닛을 강령술로 부활시킬 때, **새로운 오브젝트가 생성되는 것이 아니라 기존 오브젝트를 다시 Init**시키는 방법을 사용했거든요.

하지만 League Of Legends 에서는 이런 기능을 염두하고 개발하지 않았을 것입니다. (*그렇다면 리팩토링이 쉽지 않겠군요..)*

### 초기 프로토타입 설계

초기에는 광란 효과를 당한 적 근처에 보이지 않는 미니언을 생성했습니다.

광란 효과 동안 미니언에게 입힌 데미지를 근처 적에게 적용하는 식으로 적들을 공격하게 하는 효과를 검증하는 데 성공했죠.

이런 방식으로 &ldquo;서로 때리는 것처럼 보이게는&rdquo; 만들 수 있었지만, **진짜 공격을 하는 건 아니라서** 게임 시스템들이 제대로 작동하지 않았어요.그랬기에 엔지니어 팀들이 투입되었습니다.

출시 가능한 품질에 도달하기 위해서는 다음과 같은 몇 가지 사항을 보장해야 했습니다:

- 광란 상태의 적이 **실제로 공격을 해야 하고**, 그 공격에 **온히트 효과** 같은 것도 적용돼야 함.
- 적이 동료를 죽여도, **레나타가 처치/어시를 받게 해야 함**.
- 어떤 아군을 먼저 때릴지, **타겟 우선순위**를 설정할 수 있어야 함.

가장 가까이 있는 적을 공격하는 것이 가장 합리적으로 보입니다.

만약 '가장 체력이 낮은 적' 을 공격할 수 있게 바꾼다면, 레나타의 평균 킬 수는 비약적으로 증가하게 되겠죠.

### 초기 프로토타입의 오류

초기 프로토타입을 그대로 게임에 적용하면 큰일 날 것입니다.

- 보이지 않는 미니언이 근처 적과 동일한 방어력/마법저항력/체력을 가져야 함.
- 챔피언 특성 또한 고려해야함. (ex. 말파이트의 경우 ad 데미지를 적게 받는다.)
- 평타 데미지가 보이지 않는 미니언에 들어갈 것이기 때문에, 시각적으로 버그처럼 보인다.

간단히만 생각해도 이런 오류가 생깁니다.

역시나, 프로토타입 형태의 방법은 개발 초기 단계에서 한계가 명확히 드러났어요.

베인의 '은화살', '루난의 허리케인'과 같은 OnHit 효과들은 진짜 공격을 했을 때만 작동했기 때문에,

가짜 공격 시뮬레이션들에게는 이런 효과들이 발동하지 않았습니다.

그래서, **광란 상태는 진짜 공격이어야만 한다.** 라는 결론이 나게 됩니다.

<img class="blog-media-wide" src="/blog/tistory-11/media-02.webp" alt="티스토리 11 이미지 2" loading="lazy" />

이 다이어그램은 루난의 허리케인, 볼리베어 패시브, 시비르 W가 광분 상태와 어떻게 Interaction 하는지 보여줍니다.

첫 번째 사진은 **아군 + 적군 미니언**을 공격합니다.

두 번째 사진은 **아군 + 아군 미니언**을 공격합니다.

세 번째 사진은 **아군 + 근처의 미니언**을 공격합니다. *(이 방법이 제일 직관적이네요.)*

### 광란 코드의 복잡함을 과소평가하지 말라

공격이 끝난 이후에도, 광란 시스템과 관련한 의문점은 사그라들지 않았습니다.

예를 들어 티모가 광란 상태에서 아군을 때렸습니다.

티모는 지속 피해를 주는 E 스킬이 있어서, 광란 상태가 끝난 뒤에도 독 때문에 아군이 죽을 수 있습니다.

그렇다면, 누가 킬을 가져가야 할까요?

<img class="blog-media-compact" src="/blog/tistory-11/media-03.webp" alt="티스토리 11 이미지 3" loading="lazy" />

광란 끝난 티모의 독 스킬에 죽은 아군은 레나타에게 킬 골드를 주어야 합니다.

**이런 상황을 위해, 광란 상태에서 한 공격을 끝까지 추격할 수 있어야 합니다.**

### 흠.. 알겠어. 이제 코드를 어떻게 짜지?

<img class="blog-media-wide" src="/blog/tistory-11/media-04.webp" alt="티스토리 11 이미지 4" loading="lazy" />

자동 공격 코드 AutoAttack의 Start 함수를 열어보니,

같은 편이면 return false를 하는 로직이 맨 앞에 있었다고 합니다.. *(예외 처리를 아주 잘 해 놓았군요!)*

다행히도 League Of Legends 에는 캐릭터 상태라는 시스템이 있었습니다.

여기에는 CanMove, CanAttack, Stun 등의 상태이상을 관리할 수 있었습니다.

그래서 여기에 **CanAttackAllies(같은 편을 공격할 수 있는지) 변수도 넣어서**, 광란 상태일 때는 false를 return하지 않도록 바꿨습니다.

<img class="blog-media-wide" src="/blog/tistory-11/media-05.webp" alt="티스토리 11 이미지 5" loading="lazy" />

사실 이렇게 코드를 짜면, if문이 길어지게 되고 이는 코드 완성도를 떨어뜨릴 수 있습니다.

이를 보완하기 위해 **전략 패턴이나, 조건 분기를 함수로 추출하는 방법**을 고려할 수 있습니다.

```csharp
//전략 패턴
class ITargetingPolicy {
public:
    virtual bool CanAttack(const GameObject* owner, const GameObject* target) const = 0;
    virtual ~ITargetingPolicy() = default;
};

class DefaultTargetingPolicy : public ITargetingPolicy {
public:
    bool CanAttack(const GameObject* owner, const GameObject* target) const override {
        if (target == nullptr) return false;
        if (owner->GetTeam() == target->TeamID && !owner->CharState.CanAttackAllies()) return false;
        return true;
    }
};

class BerserkTargetingPolicy : public ITargetingPolicy {
public:
    bool CanAttack(const GameObject* owner, const GameObject* target) const override {
        if (target == nullptr || target == owner) return false; // NeverSelf 예외
        return true; // 광란 상태에선 모두 공격 가능
    }
};
```

### 진짜 문제는 지금부터

이제 아군이 독 데미지도 주고, 은화살도 터지고.. 다 되는데

문제는 킬 보상이 레나타가 아니라 때린 대상에게 전달되었습니다.

이를 위해 추적 시스템이 필요해졌습니다.

다행히, 기존에 **Spell Origination**이라는 기능이 있었습니다.

이는 스킬이 쓰이고 난 뒤 누가 언제 시전했는지에 대한 정보를 가지고 있었어요.

여기에 **BerserkInstigatorID**를 추가하는 방법으로 해결했습니다.

**BerserkInstigatorID에 레나타의 ID를 기록**하고, 스킬의 BerserkInstigatorID값이 0이 아니라면 광란에 의한 공격으로 판단합니다.

그 스킬에 적이 죽는다면 킬이 레나타에게 들어가는 것이죠.

*(ID 기록을 하지 않고 단순히 레나타에게 킬을 지급한다면, 단일 챔피언 모드에서 레나타를 볼 수 없겠네요..)*

또, 기존 **TargetHelper**라는 함수에서 광역 효과의 타겟을 return하고 있었습니다.

이 안에서 **BerserkInstigatorID가 있으면 아군도 적처럼 취급**하도록 처리했습니다.

그 결과 루난, 시비르 w, 볼리베어 패시브 등 전부 자동으로 아군을 타겟으로 포함할 수 있게 됐습니다.

스크립트를 따로 손 볼 필요가 없이 간단하게 해결했다고 합니다.

자기 자신도 때릴 수 있다?!

레나타에게 **광란당한 유닛이 티아맷을 사용하면 자기 자신에게도 데미지가 들어가는 현상**이 발생했습니다.

여기서는 **NeverSelf**라는 플래그를 사용해 해결했다고 합니다. 이 플래그는 원래 타겟이 무조건 적이기 때문에 쓸모가 없었으나, 이번에 진가를 발휘하게 되었습니다.

### 디자이너도 쉽게 테스트

광란 시스템이 완벽히 작동하더라도, 디자이너들이 직접 설정/테스트하기 어렵다면 의미가 없겠죠.

원래 CC기는 하나만 넣으려고 해도

- 특정 버프 타입 지정
- 전용 로직 호출 (ex. ApplyStun)
- 상태 업데이트 (이동 불가, 공격 불가)

이렇게 많은 함수를 추가로 호출해 주어야 했기 때문에 불편했습니다.

하지만, 광란 시스템에서는 **새로운 CC Framework**를 도입했다고 합니다.

버프 타입만 BUFF_Berserk로 지정하면 나머지는 자동으로 처리하게 바꾸었다고 해요.

이 구조는 **매혹 스킬에도 확장**되었고, 12.3패치에 반영되었습니다.

<img class="blog-media-wide" src="/blog/tistory-11/media-06.webp" alt="티스토리 11 이미지 6" loading="lazy" />

디자이너가 쉽게 테스트할 수 있도록 **AICCBehaviors** 라는 디자이너 전용 인터페이스까지 만들었다고 하네요.

라이엇 게임즈는 협업을 정말 중요시하는 것 같습니다.
