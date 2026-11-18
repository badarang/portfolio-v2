import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "../i18n";
import SectionHeader from "./SectionHeader";

// 여기까지 온 이야기를 글 대신 그물처럼 얽힌 그래프로 보여준다.
// 도구에서 게임으로, 게임에서 회사로, 그 전부가 A4Room 으로 이어진다.
// 노드에 마우스를 올리거나 누르면 이어진 것들만 남고 나머지는 흐려진다.

const shots = import.meta.glob("../assets/project/*.png", { eager: true, import: "default" });
const shot = (n) => shots[`../assets/project/project${n}.png`];
const si = (slug, color = "ffffff") => `https://cdn.simpleicons.org/${slug}/${color}`;

// x, y 는 0~100 의 캔버스 좌표.
const NODES = [
  { id: "start", type: "start", x: 5, y: 50, label: { ko: "11살", en: "Age 11", zh: "11岁", ja: "11歳" }, stat: { ko: "첫 게임을 만들다", en: "First game", zh: "做出第一款游戏", ja: "初めてゲームを作る" } },

  { id: "easytoon", type: "tool", x: 13, y: 22, label: "EasyToon", mark: "Ez" },
  { id: "ps", type: "tool", x: 23, y: 9, label: "Photoshop", icon: "/story/ps.svg" },
  { id: "ae", type: "tool", x: 27, y: 28, label: "After Effects", icon: "/story/ae.svg" },
  { id: "pr", type: "tool", x: 35, y: 12, label: "Premiere", icon: "/story/pr.svg" },
  { id: "gamemaker", type: "tool", x: 14, y: 76, label: "GameMaker", icon: si("gamemaker", "00A4A6") },
  { id: "unity", type: "tool", x: 32, y: 56, label: "Unity", icon: si("unity") },
  { id: "love", type: "tool", x: 58, y: 91, label: "LÖVE", icon: si("lua", "5B6CFF") },
  { id: "godot", type: "tool", x: 76, y: 94, label: "Godot", icon: si("godotengine", "478CBF") },
  { id: "luau", type: "tool", x: 95, y: 14, label: "Luau", icon: si("roblox") },

  { id: "itch", type: "game", x: 25, y: 86, label: "itch.io", img: "/story/itch.svg", imgBg: "#fff", stat: { ko: "게임 20개+", en: "20+ games", zh: "20+ 款游戏", ja: "ゲーム 20本+" }, href: "https://badarang.itch.io" },
  { id: "necro", type: "game", x: 44, y: 76, label: "Necro Rumble", img: shot(19), stat: { ko: "Steam 4만 장", en: "40K on Steam", zh: "Steam 4万份", ja: "Steam 4万本" }, href: "https://store.steampowered.com/app/2735950/Necro_Rumble/" },
  { id: "animal", type: "game", x: 54, y: 50, label: "Animal Jumping!", img: shot(20), stat: { ko: "버닝비버 3일 연속 선정", en: "Burning Beaver pick, 3 days", zh: "Burning Beaver 连续 3 天入选", ja: "Burning Beaver 3日連続選出" } },
  { id: "heroll", type: "game", x: 66, y: 66, label: "Heroll", img: "/story/heroll.png", stat: { ko: "100만+ 다운로드", en: "1M+ downloads", zh: "100万+ 下载", ja: "100万+ ダウンロード" } },
  { id: "jjr", type: "game", x: 79, y: 50, label: "Jetpack Joyride Racing", img: "/story/jjr.png", stat: { ko: "글로벌 런칭 · 10만+", en: "Global launch · 100K+", zh: "全球上线 · 10万+", ja: "グローバルローンチ · 10万+" } },
  { id: "slam", type: "game", x: 69, y: 84, label: "Moai Wanna Slam", img: "/story/moai.png", stat: { ko: "출시됨", en: "Live", zh: "已上线", ja: "配信中" }, href: "https://a4room.com/#slam" },
  { id: "frog", type: "game", x: 85, y: 90, label: "Judgy Froggy", img: "/a4room/frog.jpg", stat: { ko: "웹에서 플레이", en: "Play on web", zh: "网页可玩", ja: "ブラウザでプレイ" }, href: "https://a4room.com/#frog" },
  { id: "troll", type: "game", x: 96, y: 82, label: "Trolling", img: "/a4room/troll-capsule.jpg", stat: { ko: "Steam 출시 예정", en: "Coming to Steam", zh: "即将登陆 Steam", ja: "Steam 配信予定" }, href: "https://a4room.com/#troll" },

  { id: "jungle", type: "org", x: 40, y: 38, label: "KRAFTON Jungle", img: "/story/jungle.png", imgBg: "#fff" },
  { id: "sgm", type: "org", x: 50, y: 20, label: "Smilegate Membership", img: "/story/smilegate.png", imgBg: "#fff" },
  { id: "p111", type: "org", x: 63, y: 32, label: "111%", img: "/companies/111percent.svg", imgBg: "#fff" },
  { id: "halfbrick", type: "org", x: 75, y: 22, label: "Halfbrick", img: "/companies/halfbrick.jpg", imgBg: "#fff" },
  { id: "overdare", type: "org", x: 87, y: 32, label: "OVERDARE", img: "/companies/krafton.png", imgBg: "#000" },

  { id: "a4room", type: "hub", x: 90, y: 62, label: "A4Room", stat: { ko: "지금", en: "Now", zh: "现在", ja: "今" }, href: "https://a4room.com" },
];

const EDGES = [
  ["start", "easytoon"], ["start", "gamemaker"],
  ["easytoon", "ps"], ["easytoon", "ae"], ["ps", "pr"], ["ae", "pr"],
  ["gamemaker", "itch"], ["unity", "itch"], ["itch", "jungle"],
  ["jungle", "necro"], ["unity", "necro"], ["unity", "animal"], ["ae", "animal"],
  ["animal", "sgm"], ["necro", "p111"], ["animal", "p111"],
  ["p111", "heroll"], ["heroll", "halfbrick"], ["halfbrick", "jjr"], ["jjr", "overdare"],
  ["overdare", "luau"],
  ["easytoon", "a4room"], ["p111", "a4room"], ["halfbrick", "a4room"], ["overdare", "a4room"],
  ["a4room", "slam"], ["a4room", "frog"], ["a4room", "troll"],
  ["love", "slam"], ["godot", "frog"], ["unity", "troll"],
];

const copy = {
  ko: { eyebrow: "Story", title: "여기까지 온 이야기" },
  en: { eyebrow: "Story", title: "How I got here" },
  zh: { eyebrow: "Story", title: "一路走来的故事" },
  ja: { eyebrow: "Story", title: "ここまでの道のり" },
};

const pick = (v, lang) => (v && typeof v === "object" ? v[lang] ?? v.en : v);

function Node({ n, lang, on, active, onEnter, onLeave, onToggle, index }) {
  const label = pick(n.label, lang);
  const stat = pick(n.stat, lang);
  const Tag = n.href ? "a" : "button";
  const linkProps = n.href ? { href: n.href, target: "_blank", rel: "noreferrer" } : { type: "button" };

  let body;
  if (n.type === "tool") {
    body = (
      <span className="flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1.5">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-[5px] bg-white/[0.07] font-mono text-[0.6rem] font-black text-white">
          {n.icon ? <img src={n.icon} alt="" loading="lazy" className="h-3.5 w-3.5 object-contain" /> : n.mark}
        </span>
        <span className="whitespace-nowrap text-xs font-bold text-soft">{label}</span>
      </span>
    );
  } else if (n.type === "hub") {
    body = (
      <span className="flex flex-col items-center gap-2">
        <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-[#f3efe6] shadow-[0_0_0_6px_rgba(243,239,230,0.12)]">
          <img src="/story/a4room.webp" alt="" className="h-full w-full scale-150 object-contain" />
        </span>
        <span className="font-display text-base font-bold text-white">{label}</span>
      </span>
    );
  } else if (n.type === "start") {
    body = (
      <span className="flex flex-col items-center gap-1.5">
        <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-juicy font-display text-sm font-bold text-juicy">
          {label}
        </span>
        <span className="whitespace-nowrap text-[0.7rem] font-semibold text-muted">{stat}</span>
      </span>
    );
  } else {
    const big = n.type === "game";
    body = (
      <span className="flex flex-col items-center gap-1.5">
        <span
          className={`grid shrink-0 place-items-center overflow-hidden border border-white/15 ${big ? "h-14 w-14 rounded-xl" : "h-11 w-11 rounded-full"}`}
          style={{ background: n.imgBg ?? "#16161a" }}
        >
          {n.img ? (
            <img src={n.img} alt="" loading="lazy" className={`h-full w-full ${n.imgBg ? "object-contain p-1" : "object-cover"}`} />
          ) : (
            <span className="font-mono text-xs font-black text-white">{n.mark}</span>
          )}
        </span>
        <span className="max-w-[8.5rem] text-center text-[0.72rem] font-bold leading-tight text-white">{label}</span>
        {stat && <span className="whitespace-nowrap text-[0.68rem] font-bold text-juicy">{stat}</span>}
      </span>
    );
  }

  return (
    <motion.div
      className="absolute"
      style={{ left: `${n.x}%`, top: `${n.y}%`, x: "-50%", zIndex: active ? 3 : 2 }}
      animate={{ y: ["-50%", "calc(-50% - 4px)", "-50%"] }}
      transition={{ duration: 4 + (index % 5) * 0.6, repeat: Infinity, ease: "easeInOut", delay: (index % 7) * 0.3 }}
    >
      <Tag
        {...linkProps}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        onClick={n.href ? undefined : onToggle}
        className={`block transition duration-200 ${on ? "opacity-100" : "opacity-20"} ${active ? "scale-110" : "hover:scale-105"}`}
      >
        {body}
      </Tag>
    </motion.div>
  );
}

export default function Story() {
  const { language } = useI18n();
  const t = copy[language] ?? copy.en;
  const [active, setActive] = useState(null);

  const pos = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);
  const near = useMemo(() => {
    const m = Object.fromEntries(NODES.map((n) => [n.id, new Set([n.id])]));
    for (const [a, b] of EDGES) {
      m[a].add(b);
      m[b].add(a);
    }
    return m;
  }, []);

  return (
    <section id="story" className="container-px py-24">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} />

      <div className="mt-10 overflow-x-auto pb-2">
        <div className="relative h-[560px] min-w-[900px]" onMouseLeave={() => setActive(null)}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {EDGES.map(([a, b], i) => {
              const A = pos[a];
              const B = pos[b];
              const mx = (A.x + B.x) / 2;
              const my = (A.y + B.y) / 2;
              const dx = B.x - A.x;
              const dy = B.y - A.y;
              const len = Math.hypot(dx, dy) || 1;
              const bend = (i % 2 ? 1 : -1) * Math.min(7, len * 0.18);
              const d = `M ${A.x} ${A.y} Q ${mx - (dy / len) * bend} ${my + (dx / len) * bend} ${B.x} ${B.y}`;
              const lit = active && (a === active || b === active);
              return (
                <path
                  key={`${a}-${b}`}
                  d={d}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeWidth={lit ? 2 : 1}
                  className={`transition-all duration-200 ${lit ? "stroke-juicy" : "stroke-line"}`}
                  style={{ opacity: active ? (lit ? 1 : 0.18) : 0.9 }}
                />
              );
            })}
          </svg>

          {NODES.map((n, i) => (
            <Node
              key={n.id}
              n={n}
              index={i}
              lang={language}
              on={!active || near[active].has(n.id)}
              active={active === n.id}
              onEnter={() => setActive(n.id)}
              onLeave={() => {}}
              onToggle={() => setActive((cur) => (cur === n.id ? null : n.id))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
