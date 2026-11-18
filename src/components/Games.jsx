import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

// 만든 게임을 한 곳에 모았다. A4Room 게임은 스튜디오 사이트의 해당 게임으로 바로 보낸다.
const a4 = [
  { key: "troll", name: "Just a Game About Trolling", image: "/a4room/troll-capsule.jpg", href: "https://a4room.com/#troll" },
  { key: "slam", name: "Moai Wanna Slam", image: "/a4room/slam.webp", href: "https://a4room.com/#slam" },
  { key: "stack", name: "Moai Wanna Stack", image: "/a4room/stack.jpg", href: "https://a4room.com/#stack" },
  { key: "frog", name: "Judgy Froggy", image: "/a4room/frog.jpg", href: "https://a4room.com/#frog" },
];

const copy = {
  ko: {
    eyebrow: "Games",
    title: "만든 게임",
    now: "A4Room",
    before: "그 전에 만든 것",
    archive: "더 오래된 것들",
    all: "a4room.com 가기",
    troll: { status: "Steam 출시 예정", desc: "2대2 MOBA. 당신은 서포터입니다." },
    slam: { status: "출시됨", desc: "탭 한 번으로 뛰고 내려찍는 1대1 실시간 대전." },
    stack: { status: "개발 중", desc: "원버튼 점프, 벽타기, 내려찍기." },
    frog: { status: "웹에서 플레이", desc: "개구리 판사가 심판하는 AI 파티 게임." },
    necro: { stat: "Steam 4만 장", desc: "KRAFTON Jungle 팀 프로젝트" },
    animal: { stat: "버닝비버 3일 연속 선정", desc: "기획부터 출시까지 혼자" },
  },
  en: {
    eyebrow: "Games",
    title: "Games I made",
    now: "A4Room",
    before: "Before that",
    archive: "Older ones",
    all: "Visit a4room.com",
    troll: { status: "Coming to Steam", desc: "A 2v2 MOBA. You are the support." },
    slam: { status: "Live", desc: "One-tap jump and slam, 1v1 in real time." },
    stack: { status: "In progress", desc: "One-button jumping, wall climbing and slams." },
    frog: { status: "Play on web", desc: "An AI party game ruled by a frog judge." },
    necro: { stat: "40K copies on Steam", desc: "KRAFTON Jungle team project" },
    animal: { stat: "Burning Beaver pick, 3 days running", desc: "Solo, from design to release" },
  },
  zh: {
    eyebrow: "Games",
    title: "我做的游戏",
    now: "A4Room",
    before: "在那之前",
    archive: "更早的作品",
    all: "前往 a4room.com",
    troll: { status: "即将登陆 Steam", desc: "2v2 MOBA。你是辅助。" },
    slam: { status: "已上线", desc: "一键跳跃并下砸的 1v1 实时对战。" },
    stack: { status: "开发中", desc: "单键跳跃、爬墙、下砸。" },
    frog: { status: "网页可玩", desc: "由青蛙法官裁决的 AI 派对游戏。" },
    necro: { stat: "Steam 销量 4万份", desc: "KRAFTON Jungle 团队项目" },
    animal: { stat: "Burning Beaver 连续 3 天入选", desc: "从策划到上线独立完成" },
  },
  ja: {
    eyebrow: "Games",
    title: "作ったゲーム",
    now: "A4Room",
    before: "それ以前",
    archive: "もっと前の作品",
    all: "a4room.com へ",
    troll: { status: "Steam で配信予定", desc: "2対2 の MOBA。あなたはサポートです。" },
    slam: { status: "配信中", desc: "ワンタップで跳んで叩きつける 1対1 のリアルタイム対戦。" },
    stack: { status: "開発中", desc: "ワンボタンのジャンプ、壁登り、叩きつけ。" },
    frog: { status: "ブラウザでプレイ", desc: "カエルの裁判官が判定する AI パーティーゲーム。" },
    necro: { stat: "Steam で 4万本", desc: "KRAFTON Jungle のチームプロジェクト" },
    animal: { stat: "Burning Beaver で 3日連続選出", desc: "企画からリリースまで 1 人で" },
  },
};

const label = "font-display text-base font-bold text-soft";

export default function Games() {
  const { content, language } = useI18n();
  const t = copy[language] ?? copy.en;
  const byKey = Object.fromEntries(content.projects.map((p) => [p.key, p]));
  const before = [byKey.necro, byKey.animal].filter(Boolean);
  const archive = content.projects.filter((p) => !p.featured);

  return (
    <section id="a4room" className="container-px py-24">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} />

      <div className="mt-12 flex items-center justify-between gap-4">
        <h3 className={label}>{t.now}</h3>
        <a
          href="https://a4room.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-simple transition hover:text-white"
        >
          {t.all}
          <span aria-hidden="true">→</span>
        </a>
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {a4.map((g, i) => (
          <Reveal key={g.key} delay={i * 0.05} className="h-full">
            <a
              href={g.href}
              target="_blank"
              rel="noreferrer"
              className="card-surface group flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                <img src={g.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-bold text-juicy backdrop-blur">
                  {t[g.key].status}
                </span>
              </div>
              <div className="flex flex-1 flex-col bg-card p-4">
                <h4 className="font-display text-base font-bold leading-snug text-white">{g.name}</h4>
                <p className="mt-1.5 text-sm leading-6 text-muted">{t[g.key].desc}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <h3 className={`mt-12 ${label}`}>{t.before}</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {before.map((p, i) => (
          <Reveal key={p.key} delay={i * 0.05}>
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="card-surface group flex items-center gap-4 overflow-hidden p-3 transition-transform duration-200 hover:-translate-y-1"
            >
              <img src={p.image} alt="" loading="lazy" className="h-20 w-32 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0">
                <h4 className="font-display text-lg font-bold leading-snug text-white">{p.name}</h4>
                <p className="mt-0.5 font-display text-base font-bold text-juicy">{t[p.key].stat}</p>
                <p className="text-sm text-muted">{t[p.key].desc}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <h3 className={`mt-12 ${label}`}>
        {t.archive} · {archive.length}
      </h3>
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-10">
        {archive.map((p) => (
          <a
            key={p.key}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            title={p.name}
            aria-label={p.name}
            className="group relative aspect-video overflow-hidden rounded-md bg-card ring-1 ring-white/10"
          >
            <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover opacity-75 transition duration-300 group-hover:scale-110 group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </section>
  );
}
