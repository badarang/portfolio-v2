TITLE: [SGM] 스마일게이트 멤버십 유저평가단 피드백 정리
SLUG: sgm-feedback-summary
TAGS: 애니멀 점핑, 스마일게이트 멤버십, 유저 피드백, 데이터 시각화
EXCERPT: 애니멀 점핑! 유저평가단 피드백을 CSV 시각화 도구로 정리하며, 게임의 문제와 개선 방향을 다시 확인한 기록.
PUBLISHED: true
---

스마일게이트 멤버십 유저평가단을 통해 `<애니멀 점핑!>`의 피드백 엑셀 파일을 받았다. 자료는 따끈따끈했지만, 동시에 꽤 방대하고 난잡했다.

<img class="blog-media-wide" src="/blog/sgm-feedback/01-feedback-sheet.webp" alt="애니멀 점핑 유저평가단 피드백 엑셀 파일" loading="lazy" />

웹 개발을 했던 입장에서 엑셀 파일을 보자마자 한 가지 생각이 들었다.

> **시각화 모듈을 만들어서 SGM 동기분들께 뿌리자.**

그래서 만든 것이 CSV 시각화 사이트다. 엑셀 파일을 CSV로 변환해서 업로드하면, 설문 결과를 자동으로 분류하고 그래프로 보여주는 방식이다.

[CSV Visualization 보기](https://badarang.github.io/Data-Visualization/)

<img class="blog-media-compact" src="/blog/sgm-feedback/02-csv-tool.webp" alt="CSV Visualization 업로드 화면" loading="lazy" />

<img class="blog-media-wide" src="/blog/sgm-feedback/03-upload-demo.gif" alt="CSV 파일을 업로드해 차트를 생성하는 과정" loading="lazy" />

## 어떻게 분류했나

피드백 항목은 크게 세 가지로 나누었다.

- 객관식
- 숫자 객관식
- 주관식

객관식은 파이 차트로 보여주고, 숫자로만 구성된 객관식은 막대 그래프와 함께 평균, 표준편차를 계산했다. 주관식 응답은 단어 빈도를 기반으로 키워드를 크게 보여주는 방식으로 정리했다.

처음에는 단순히 보기 편하게 만들자는 생각이었지만, 막상 시각화해보니 피드백을 훨씬 빠르게 읽을 수 있었다. 어떤 의견이 반복되는지, 어디에서 평가가 갈리는지 한눈에 보였다.

<img class="blog-media-compact" src="/blog/sgm-feedback/04-wordcloud.webp" alt="주관식 응답을 단어 빈도로 시각화한 워드클라우드" loading="lazy" />

## 참여자 분포

조금 놀랐던 부분은 40대 유저도 꽤 있었다는 점이다. 캐주얼 모바일 게임이라 10~30대 중심일 거라고 생각했는데, 실제 데이터는 생각보다 넓었다.

<img class="blog-media-compact" src="/blog/sgm-feedback/05-age.webp" alt="유저평가단 연령 분포 차트" loading="lazy" />

## 재미 점수

재미에 대한 평가는 평균 **3.59점**이었다. 아주 높은 점수는 아니었지만, 기분이 나쁘지는 않았다.

<img class="blog-media-compact" src="/blog/sgm-feedback/06-fun-score.webp" alt="애니멀 점핑 재미 만족도 평균 3.59점 차트" loading="lazy" />

첫 번째 이유는 **1점이 하나도 없었다는 것**이고, 두 번째 이유는 **3점을 준 유저를 4~5점으로 끌어올릴 방법이 보였기 때문**이다.

유저 평가단 빌드와 비교하면 지금 빌드는 이미 많이 달라졌다. 불편하다고 나온 부분, 마음에 들지 않는다고 나온 부분도 대부분 수정한 상태다. 그래서 이 점수는 실망보다는 개선 방향을 확인해주는 자료에 가까웠다.

<img class="blog-media-compact" src="/blog/sgm-feedback/07-comments.webp" alt="긍정적인 주관식 피드백 일부" loading="lazy" />

## 난이도

난이도는 5점 만점에 **2.49점**이었다.

<img class="blog-media-compact" src="/blog/sgm-feedback/08-difficulty.webp" alt="애니멀 점핑 난이도 평균 2.49점 차트" loading="lazy" />

너무 쉽지도, 너무 어렵지도 않은 꽤 좋은 위치라고 느꼈다. 다만 앞으로는 전체 난이도를 단순히 올리기보다는, 초반은 더 쉽게 시작하고 후반은 더 어렵게 가는 구조로 바꿀 생각이다.

처음에는 누구나 바로 이해할 수 있어야 하고, 오래 할수록 더 깊게 파고들 여지가 있어야 한다.

## 좋았던 부분

유저들이 좋게 본 지점은 크게 두 갈래로 나뉘었다.

- 원터치 조작과 랭킹을 통한 점수 경쟁
- 수집 요소와 귀여운 캐릭터 디자인

<img class="blog-media-wide" src="/blog/sgm-feedback/09-best-parts.webp" alt="게임에서 가장 좋았던 부분에 대한 주관식 응답 워드클라우드" loading="lazy" />

어느 정도 예상한 결과였다. 게임의 재미가 하나의 축에만 몰려 있지 않다는 것은 좋은 신호라고 생각한다. 나는 조작의 긴장감과 수집의 즐거움을 둘 다 잡고 싶다.

## 가장 중요했던 피드백

2점을 준 유저분의 피드백이 특히 좋았다. 요약하면, 단순히 버튼을 연타하는 것만으로도 플레이가 가능해 보였고, 명확한 조작 실력보다는 랜덤성에 기대는 느낌이 있었다는 내용이었다.

> 단지 점프 버튼만 연타해도 얼마든지 플레이할 수 있어서, 직관적이지 못하고 랜덤성이 느껴지는 게임 플레이에 불만이 생겼다.

이 피드백은 정말 고마웠다. 비슷한 의견을 가진 분들이 꽤 있었고, 내가 생각하던 문제와도 정확히 맞닿아 있었다.

해결 방향은 맵 디자인이다. 프리팹 기반으로 구조를 설계해, 단순 연타가 아니라 상황을 보고 판단해야 하는 형태로 바꿀 생각이다.

<blockquote class="blog-pullquote">
  <p>전반적으로 잘 만든 게임인데, 차별점이 부족하고 갈수록 지루해진다.</p>
</blockquote>

정리하면 오픈베타데이 빌드의 핵심 문제는 이 문장에 가깝다.

차별점은 스토리로, 지루해지는 문제는 맵 디자인으로 해결하고 있다. 여러 번의 플레이테스트를 거치면서 이미 느끼고 있던 문제였고, 예상과 거의 같은 피드백이 나와서 오히려 기분이 좋았다.

내일도 개발을 하러 신촌에 간다.
