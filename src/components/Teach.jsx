import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

// 가르치고 나누는 일. 예전의 DevRel 페이지와 커뮤니티 섹션을 하나로 합쳤다.
// 인용문은 실제로 받은 메시지에서 가져왔고, 보낸 사람은 익명으로 표기한다.
const copy = {
  ko: {
    eyebrow: "Teach & Share",
    title: "만들고, 가르치고, 나눕니다",
    desc: "게임을 만드는 것만큼, 다음 사람이 덜 헤매게 돕는 일을 좋아합니다.",
    headline: "수강생이 가장 많이 찾은 멘토",
    headlineSub: "팀이 멘토를 직접 고르게 되자 희망 팀이 몰려서, 운영진이 두 팀을 맡아달라고 부탁했습니다.",
    headlineBy: "오즈코딩스쿨 Unity 멘토 · 2026.01 ~ 2026.09",
    stats: [
      { n: "9개월", label: "Unity 멘토" },
      { n: "20팀+", label: "거쳐 간 팀 (6인 1팀)" },
      { n: "1:1", label: "진로와 취업 상담" },
    ],
    quotes: [
      { text: "해인님을 희망하는 팀이 정말 많았습니다. 다들 해인님과의 멘토링을 많이 기대하신 것 같아서, 두 팀까지 맡아주실 수 있을지 조심스럽게 여쭤봅니다.", by: "오즈코딩스쿨 운영진" },
      { text: "방금 최종합격 연락 받았습니다!! 좋은 조언 많이 해주셔서, 좋은 결과가 있었던 것 같습니다.", by: "멘티, 취업 상담 이후" },
      { text: "말씀해주신 부분들 이번 주에 열심히 작업해서 다음 주에 개선된 결과물 보여드리겠습니다. 늦은 시간까지 멘토링 진행해주셔서 감사합니다.", by: "수강생, 팀 멘토링 이후" },
      { text: "멘토링 경험이 너무 좋아서 오늘도 받고 싶었습니다.", by: "수강생" },
    ],
  },
  en: {
    eyebrow: "Teach & Share",
    title: "I build, teach and share",
    desc: "I enjoy helping the next person get lost less as much as I enjoy making games.",
    headline: "The mentor students asked for most",
    headlineSub: "When teams got to choose their mentor, so many picked me that the staff asked me to take on two.",
    headlineBy: "Unity Mentor, Oz Coding School · Jan 2026 to Sep 2026",
    stats: [
      { n: "9 mo", label: "Unity mentor" },
      { n: "20+", label: "Teams mentored (6 per team)" },
      { n: "1:1", label: "Career and job coaching" },
    ],
    quotes: [
      { text: "So many teams asked for you. Everyone seems to be looking forward to your mentoring, so may I carefully ask whether you could take on two teams?", by: "Oz Coding School staff" },
      { text: "I just got the final offer!! I think the result came from all the good advice you gave me.", by: "Mentee, after job coaching" },
      { text: "I will work hard on what you pointed out this week and show you an improved build next week. Thank you for mentoring us so late.", by: "Student, after team mentoring" },
      { text: "The mentoring was so good that I wanted another session today.", by: "Student" },
    ],
  },
  zh: {
    eyebrow: "Teach & Share",
    title: "制作、教学、分享",
    desc: "和做游戏一样，我也喜欢帮助后来的人少走弯路。",
    headline: "学员选择最多的导师",
    headlineSub: "当各组可以自己选导师时，想选我的组太多，运营方请我同时带两个组。",
    headlineBy: "Oz Coding School Unity 导师 · 2026.01 ~ 2026.09",
    stats: [
      { n: "9个月", label: "Unity 导师" },
      { n: "20组+", label: "指导过的团队（每组 6 人）" },
      { n: "1:1", label: "职业与求职辅导" },
    ],
    quotes: [
      { text: "想选您的组真的很多。大家都很期待您的指导，所以想冒昧问一下，您能否带两个组？", by: "Oz Coding School 运营人员" },
      { text: "刚刚收到最终录取通知了！！多亏您给了很多好建议，才有这样的好结果。", by: "学员，求职辅导之后" },
      { text: "您指出的部分我这周会认真修改，下周给您看改进后的成果。感谢您指导到这么晚。", by: "学员，团队指导之后" },
      { text: "指导的体验太好了，今天也想再上一次。", by: "学员" },
    ],
  },
  ja: {
    eyebrow: "Teach & Share",
    title: "作って、教えて、共有する",
    desc: "ゲームを作るのと同じくらい、次の人が迷わないように手伝うことが好きです。",
    headline: "受講生に最も選ばれたメンター",
    headlineSub: "チームがメンターを自分で選べるようになると希望が集中し、運営から 2 チームの担当を頼まれました。",
    headlineBy: "Oz Coding School Unity メンター · 2026.01 ~ 2026.09",
    stats: [
      { n: "9か月", label: "Unity メンター" },
      { n: "20チーム+", label: "担当したチーム（1 チーム 6 人）" },
      { n: "1:1", label: "進路と就職の相談" },
    ],
    quotes: [
      { text: "ヘインさんを希望するチームが本当に多かったです。皆さんとても期待しているようなので、2 チームまで担当していただけないか、恐縮ですがお伺いします。", by: "Oz Coding School 運営スタッフ" },
      { text: "たった今、最終合格の連絡をもらいました！！たくさん良いアドバイスをいただいたおかげだと思います。", by: "メンティー、就職相談のあと" },
      { text: "ご指摘いただいた部分を今週しっかり作業して、来週は改善した成果をお見せします。遅い時間までメンタリングありがとうございました。", by: "受講生、チームメンタリングのあと" },
      { text: "メンタリングがとても良かったので、今日も受けたかったです。", by: "受講生" },
    ],
  },
};

export default function Teach() {
  const { language } = useI18n();
  const t = copy[language] ?? copy.en;

  return (
    <section id="teach" className="container-px py-24">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} desc={t.desc} />

      <Reveal delay={0.05}>
        <div className="mt-12 rounded-2xl border border-juicy/25 bg-juicy/[0.05] p-6 sm:p-8">
          <p className="max-w-3xl font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
            {t.headline}
          </p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-soft">{t.headlineSub}</p>
          <p className="mt-2 text-sm font-semibold text-muted">{t.headlineBy}</p>
          <dl className="mt-7 grid max-w-2xl grid-cols-3 gap-4">
            {t.stats.map((s) => (
              <div key={s.label} className="border-t border-line pt-3">
                <dt className="font-display text-2xl font-bold text-juicy sm:text-3xl">{s.n}</dt>
                <dd className="mt-1 text-xs leading-5 text-muted sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {t.quotes.map((q, i) => (
          <Reveal key={q.by + i} delay={i * 0.05} className="h-full">
            <figure className="dark-panel card-surface flex h-full flex-col p-5 sm:p-6">
              <blockquote className="text-[0.95rem] leading-7 text-soft">"{q.text}"</blockquote>
              <figcaption className="mt-auto pt-4 text-xs font-semibold text-muted">{q.by}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
