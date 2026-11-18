const imageMap = import.meta.glob("../assets/project/*.png", {
  eager: true,
  import: "default",
});
const img = (n) => imageMap[`../assets/project/project${n}.png`];

const links = {
  linkedin: "https://kr.linkedin.com/in/haein-oh-979b29304/en",
  github: "https://github.com/badarang",
  emailAddress: "badarangdev@gmail.com",
  email: "mailto:badarangdev@gmail.com",
  itch: "https://badarang.itch.io",
};

const techGroups = {
  ko: [
    {
      title: "엔진 / 언어",
      items: [
        { name: "Unity", icon: "https://cdn.simpleicons.org/unity/ffffff" },
        { name: "Unreal", icon: "https://cdn.simpleicons.org/unrealengine/ffffff" },
        { name: "GameMaker", icon: "https://cdn.simpleicons.org/gamemaker/00A4A6" },
        { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
        { name: "Lua", icon: "https://cdn.simpleicons.org/lua/5B6CFF" },
        { name: "C#", mark: "C#" },
      ],
    },
    {
      title: "서버 / 클라우드",
      items: [
        { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3FCF8E" },
        { name: "Firebase", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
        { name: "Backnd", mark: "B" },
        { name: "AWS", mark: "AWS" },
        { name: "Nakama", mark: "N" },
      ],
    },
    {
      title: "빌드 / 배포",
      items: [
        { name: "GitHub Actions", icon: "https://cdn.simpleicons.org/githubactions/2088FF" },
        { name: "Jenkins", icon: "https://cdn.simpleicons.org/jenkins/D24939" },
        { name: "TeamCity", icon: "https://cdn.simpleicons.org/teamcity/ffffff" },
        { name: "Steamworks", icon: "https://cdn.simpleicons.org/steam/ffffff" },
        { name: "Android Build", icon: "https://cdn.simpleicons.org/android/3DDC84" },
      ],
    },
    {
      title: "버전관리 / 협업",
      items: [
        { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
        { name: "Perforce", icon: "https://cdn.simpleicons.org/perforce/404040" },
        { name: "Linear", icon: "https://cdn.simpleicons.org/linear/5E6AD2" },
        { name: "Jira", icon: "https://cdn.simpleicons.org/jira/0052CC" },
        { name: "Redmine", mark: "R" },
      ],
    },
    {
      title: "분석 / 운영",
      items: [
        { name: "Sentry", icon: "https://cdn.simpleicons.org/sentry/ffffff" },
        { name: "Firebase Analytics", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
        { name: "Crashlytics", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
        { name: "Android Logcat", icon: "https://cdn.simpleicons.org/android/3DDC84" },
        { name: "Unity Profiler", icon: "https://cdn.simpleicons.org/unity/ffffff" },
      ],
    },
  ],
  en: [
    { title: "Engines / Languages", items: null },
    { title: "Server / Cloud", items: null },
    { title: "Build / Release", items: null },
    { title: "Versioning / Collaboration", items: null },
    { title: "Analytics / Operations", items: null },
  ],
  zh: [
    { title: "引擎 / 语言", items: null },
    { title: "服务器 / 云服务", items: null },
    { title: "构建 / 发布", items: null },
    { title: "版本管理 / 协作", items: null },
    { title: "分析 / 运营", items: null },
  ],
  ja: [
    { title: "エンジン / 言語", items: null },
    { title: "サーバー / クラウド", items: null },
    { title: "ビルド / 配信", items: null },
    { title: "バージョン管理 / 協業", items: null },
    { title: "分析 / 運用", items: null },
  ],
};

for (const language of ["en", "zh", "ja"]) {
  techGroups[language] = techGroups[language].map((group, index) => ({
    ...group,
    items: techGroups.ko[index].items,
  }));
}

const projectBase = [
  {
    key: "moai",
    image: img(22),
    link: "https://youtu.be/NQWIjDBJFcg?si=7qa5_IgFxliFEN-9",
    platform: "YouTube",
    video: "https://youtu.be/NQWIjDBJFcg?si=7qa5_IgFxliFEN-9",
    badge: "Latest · Lua / LÖVE",
    featured: true,
  },
  {
    key: "necro",
    image: img(19),
    link: "https://store.steampowered.com/app/2735950/Necro_Rumble/",
    platform: "Steam",
    video: "https://www.youtube.com/watch?v=pypLJMlGsOE",
    badge: "KRAFTON Jungle · Steam",
    secondaryLinks: [{ labelKey: "github", url: "https://github.com/badarang/NecroRumble" }],
    featured: true,
  },
  {
    key: "animal",
    image: img(20),
    link: "https://www.pinpointnews.co.kr/news/articleView.html?idxno=305741",
    platform: "Interview",
    video: "https://www.youtube.com/watch?v=HEng9UIQQyU",
    badge: "Smilegate Membership",
    secondaryLinks: [{ labelKey: "github", url: "https://github.com/badarang/AnimalJumping_Sample" }],
    featured: true,
  },
  { key: "lucky", image: img(21), link: "https://badarang.notion.site/Lucky-Defense-1b74124737e380eb806ed5725ea679c6" },
  { key: "ninja", image: img(18), link: "https://badarang.itch.io/collecting-ninja" },
  { key: "monster", image: img(17), link: "https://badarang.itch.io/monsterrushtactics" },
  { key: "stars", image: img(16), link: "https://badarang.itch.io/among-the-stars" },
  { key: "dash", image: img(15), link: "https://badarang.itch.io/dash-and-friends" },
  { key: "bbuzit", image: img(14), link: "https://badarang.itch.io/bbuzit" },
  { key: "smith", image: img(13), link: "https://blog.naver.com/badarangdev/223106103199" },
  { key: "hugevill", image: img(12), link: "https://replit.com/@ltebtr/Hugevill?v=1" },
  { key: "nuasis", image: img(11), link: "https://badarang.itch.io/nuasis-the-planet" },
  { key: "bastabo", image: img(10), link: "https://badarang.itch.io/bastabo-action" },
  { key: "espectro", image: img(9), link: "https://badarang.itch.io/espectro" },
  { key: "velocity", image: img(8), link: "https://badarang.itch.io/velocity" },
  { key: "morathon", image: img(7), link: "https://badarang.itch.io/morathon" },
  { key: "involution", image: img(6), link: "https://badarang.itch.io/involution" },
  { key: "peacetown", image: img(5), link: "https://badarang.itch.io/peacetown" },
  { key: "eaten", image: img(4), link: "https://badarang.itch.io/eaten" },
  { key: "running", image: img(3), link: "https://badarang.itch.io/running-alpha" },
  { key: "santa", image: img(2), link: "https://badarang.itch.io/santasanta" },
  { key: "help", image: img(1), link: "https://badarang.itch.io/i-will-help-you" },
];

const projectText = {
  ko: {
    moai: {
      name: "모아이는 내려찍고 싶다",
      storeLabel: "영상 보기",
      period: "2026, 개인 프로젝트",
      highlights: [
        { metric: "Android", text: "멀티플레이 렉 원인 분석 및 개선" },
        { metric: "iOS / APK / PC", text: "빌드별 쉐이더 렌더링 차이 해결" },
        { metric: "DDQN AI 봇", text: "강화학습 기반 대전 봇 제작" },
      ],
    },
    necro: {
      name: "네크로 럼블",
      storeLabel: "Steam에서 보기",
      period: "2023~2024, 크래프톤 정글 게임랩 팀 프로젝트",
      highlights: [
        { metric: "4만 장+", text: "Steam 판매 기록" },
        { metric: "유닛 / 스킬 / 전투", text: "핵심 시스템 설계 및 구현" },
        { metric: "FSM -> BT", text: "AI 구조를 Behavior Tree로 리팩토링" },
      ],
    },
    animal: {
      name: "애니멀 점핑!",
      storeLabel: "인터뷰 기사 보기",
      period: "2024~2025, 1인 개발 프로젝트",
      highlights: [
        { metric: "3일 연속", text: "버닝비버 전시 재미있는 게임 선정" },
        "뒤끝 매치 기반 1:1 멀티플레이와 AdMob, IAP 적용",
        { metric: "202KB -> 37KB", text: "풀링과 프리셋 캐싱으로 GC 메모리 절감" },
      ],
    },
    lucky: { name: "운빨존많겜 모작", desc: "‘운빨존많겜’을 클론코딩한 디펜스 프로젝트.", tags: ["디펜스"] },
    ninja: { name: "줍는 닌자", desc: "닌자 토너먼트에서 마지막까지 살아남는 탑뷰 액션 게임.", tags: ["액션", "탑뷰"] },
    monster: { name: "우르르 몬스터 대작전!", desc: "몬스터 군단으로 인간과 맞서 싸우는 턴제 전략 게임.", tags: ["전략"] },
    stars: { name: "Among The Stars", desc: "다양한 성격의 행성들과 교감하는 스크립트 기반 게임.", tags: ["시뮬레이션"] },
    dash: { name: "대시와 친구들", desc: "뛰어난 조작감과 자유로움을 선사하는 3D 샌드박스 게임.", tags: ["플랫포머"] },
    bbuzit: { name: "뿌짓뿌짓", desc: "플랫폼을 설치하여 스테이지를 클리어하는 샌드박스 게임.", tags: ["플랫포머"] },
    smith: { name: "With Smith", desc: "3x3 타일을 색칠해 무기를 만드는 로그라이크 게임.", tags: ["로그라이크", "플랫포머"] },
    hugevill: { name: "Hugevill", desc: "점프로 벽돌을 부수고 올라가는 스코어링 게임.", tags: ["플랫포머"] },
    nuasis: { name: "누아시스: 더 플래닛", desc: "우주에서 식물을 키우고 탈출 재료를 모으는 클리커 게임.", tags: ["클리커"] },
    bastabo: { name: "바스타보 액션", desc: "무기를 얻어 적을 베는 플랫포머 게임.", tags: ["플랫포머"] },
    espectro: { name: "Espectro", desc: "유령들과 맞서 싸우는 탑뷰 스코어링 게임.", tags: ["슈팅"] },
    velocity: { name: "Velocity", desc: "보스와 싸우는 그리드 기반 슈팅 게임.", tags: ["슈팅"] },
    morathon: { name: "모라톤", desc: "마라톤에서 1등을 하기 위해 달리는 PvE 플랫포머 게임.", tags: ["플랫포머"] },
    involution: { name: "Involution", desc: "X2배로 분열하는 바이러스를 막는 탑뷰 전략 게임.", tags: ["전략"] },
    peacetown: { name: "피스타운", desc: "전직 시스템이 있는 아늑한 분위기의 RPG 게임.", tags: ["RPG"] },
    eaten: { name: "Eaten", desc: "왕따를 당하는 주인공에게 먹히기 위해 험난한 여정을 떠나는 음식들의 이야기.", tags: ["플랫포머"] },
    running: { name: "러닝 알파", desc: "트로피를 얻기 위한 사투! 장애물을 피해 달리는 PvE 플랫포머.", tags: ["플랫포머"] },
    santa: { name: "산타산타", desc: "산타가 되어 아이들의 눈덩이를 피해 선물을 배달하는 탄막 게임.", tags: ["슈팅", "플랫포머"] },
    help: { name: "I will help you", desc: "바다 생물을 피하는 스코어링 플랫포머 게임.", tags: ["플랫포머"] },
  },
  en: {
    moai: {
      name: "Moai Wanna Slam",
      storeLabel: "Watch Video",
      period: "2026, solo project",
      highlights: [
        { metric: "Android", text: "Analyzed and improved multiplayer lag" },
        { metric: "iOS / APK / PC", text: "Resolved shader rendering differences across builds" },
        { metric: "DDQN AI Bot", text: "Built a reinforcement-learning battle bot" },
      ],
    },
    necro: {
      name: "Necro Rumble",
      storeLabel: "View on Steam",
      period: "2023-2024, KRAFTON Jungle Game Lab team project",
      highlights: [
        { metric: "40K+", text: "Steam copies sold" },
        { metric: "Units / Skills / Combat", text: "Designed and implemented core systems" },
        { metric: "FSM -> BT", text: "Refactored AI into Behavior Trees" },
      ],
    },
    animal: {
      name: "Animal Jumping!",
      storeLabel: "Read Interview",
      period: "2024-2025, solo project",
      highlights: [
        { metric: "3 days", text: "Selected as a fun Burning Beaver showcase game" },
        "Implemented 1v1 multiplayer with Backnd Match plus AdMob and IAP",
        { metric: "202KB -> 37KB", text: "Reduced GC memory through pooling and preset caching" },
      ],
    },
    lucky: { name: "Lucky Defense Clone", desc: "A defense project cloned from Lucky Defense.", tags: ["Defense"] },
    ninja: { name: "Collecting Ninja", desc: "A top-down action game about surviving a ninja tournament.", tags: ["Action", "Top-down"] },
    monster: { name: "Monster Rush Tactics", desc: "A turn-based strategy game where monsters fight humans.", tags: ["Strategy"] },
    stars: { name: "Among The Stars", desc: "A script-driven game about connecting with planets of different personalities.", tags: ["Simulation"] },
    dash: { name: "Dash and Friends", desc: "A 3D sandbox game built around responsive controls and freedom.", tags: ["Platformer"] },
    bbuzit: { name: "Bbuzit Bbuzit", desc: "A sandbox game where players place platforms to clear stages.", tags: ["Platformer"] },
    smith: { name: "With Smith", desc: "A roguelike where weapons are crafted by coloring 3x3 tiles.", tags: ["Roguelike", "Platformer"] },
    hugevill: { name: "Hugevill", desc: "A scoring game about jumping upward while breaking bricks.", tags: ["Platformer"] },
    nuasis: { name: "Nuasis: The Planet", desc: "A clicker game about growing plants in space and gathering escape materials.", tags: ["Clicker"] },
    bastabo: { name: "Bastabo Action", desc: "A platformer where players collect weapons and cut through enemies.", tags: ["Platformer"] },
    espectro: { name: "Espectro", desc: "A top-down scoring game about fighting ghosts.", tags: ["Shooter"] },
    velocity: { name: "Velocity", desc: "A grid-based shooter built around boss fights.", tags: ["Shooter"] },
    morathon: { name: "Morathon", desc: "A PvE platformer about racing to win a marathon.", tags: ["Platformer"] },
    involution: { name: "Involution", desc: "A top-down strategy game about stopping viruses that split by x2.", tags: ["Strategy"] },
    peacetown: { name: "Peacetown", desc: "A cozy RPG with a job-change system.", tags: ["RPG"] },
    eaten: { name: "Eaten", desc: "A story of food taking a harsh journey to be eaten by an isolated protagonist.", tags: ["Platformer"] },
    running: { name: "Running Alpha", desc: "A PvE platformer about dodging obstacles to claim a trophy.", tags: ["Platformer"] },
    santa: { name: "Santa Santa", desc: "A bullet-hell game where Santa dodges snowballs and delivers presents.", tags: ["Shooter", "Platformer"] },
    help: { name: "I will help you", desc: "A scoring platformer about avoiding sea creatures.", tags: ["Platformer"] },
  },
  zh: {
    moai: {
      name: "想把摩艾砸下去",
      storeLabel: "观看视频",
      period: "2026，个人项目",
      highlights: [
        { metric: "Android", text: "分析并改善多人游戏延迟" },
        { metric: "iOS / APK / PC", text: "解决不同构建中的 Shader 渲染差异" },
        { metric: "DDQN AI 机器人", text: "制作基于强化学习的对战机器人" },
      ],
    },
    necro: {
      name: "Necro Rumble",
      storeLabel: "在 Steam 查看",
      period: "2023-2024，KRAFTON Jungle Game Lab 团队项目",
      highlights: [
        { metric: "4万+", text: "Steam 销售记录" },
        { metric: "单位 / 技能 / 战斗", text: "设计并实现核心系统" },
        { metric: "FSM -> BT", text: "将 AI 结构重构为 Behavior Tree" },
      ],
    },
    animal: {
      name: "Animal Jumping!",
      storeLabel: "阅读采访",
      period: "2024-2025，个人开发项目",
      highlights: [
        { metric: "连续3天", text: "入选 Burning Beaver 有趣游戏展区" },
        "接入 Backnd Match 的 1v1 多人游戏、AdMob 与 IAP",
        { metric: "202KB -> 37KB", text: "通过对象池和预设缓存降低 GC 内存" },
      ],
    },
    lucky: { name: "幸运防御仿作", desc: "基于《幸运防御》进行克隆开发的防御项目。", tags: ["防御"] },
    ninja: { name: "Collecting Ninja", desc: "在忍者锦标赛中生存到最后的俯视角动作游戏。", tags: ["动作", "俯视角"] },
    monster: { name: "Monster Rush Tactics", desc: "带领怪物军团与人类对抗的回合制策略游戏。", tags: ["策略"] },
    stars: { name: "Among The Stars", desc: "与不同性格的星球互动的脚本驱动游戏。", tags: ["模拟"] },
    dash: { name: "Dash and Friends", desc: "强调手感和自由度的 3D 沙盒游戏。", tags: ["平台跳跃"] },
    bbuzit: { name: "Bbuzit Bbuzit", desc: "通过放置平台来通关关卡的沙盒游戏。", tags: ["平台跳跃"] },
    smith: { name: "With Smith", desc: "在 3x3 方格上涂色来制作武器的 Roguelike 游戏。", tags: ["Roguelike", "平台跳跃"] },
    hugevill: { name: "Hugevill", desc: "通过跳跃打碎砖块向上攀登的得分游戏。", tags: ["平台跳跃"] },
    nuasis: { name: "Nuasis: The Planet", desc: "在太空种植植物并收集逃脱材料的点击游戏。", tags: ["点击"] },
    bastabo: { name: "Bastabo Action", desc: "获得武器并斩击敌人的平台动作游戏。", tags: ["平台跳跃"] },
    espectro: { name: "Espectro", desc: "与幽灵战斗的俯视角得分游戏。", tags: ["射击"] },
    velocity: { name: "Velocity", desc: "围绕 Boss 战构建的网格射击游戏。", tags: ["射击"] },
    morathon: { name: "Morathon", desc: "为了赢得马拉松而奔跑的 PvE 平台游戏。", tags: ["平台跳跃"] },
    involution: { name: "Involution", desc: "阻止成倍分裂病毒的俯视角策略游戏。", tags: ["策略"] },
    peacetown: { name: "Peacetown", desc: "带有转职系统的温馨 RPG。", tags: ["RPG"] },
    eaten: { name: "Eaten", desc: "食物们为了被孤立的主角吃掉而踏上艰难旅程的故事。", tags: ["平台跳跃"] },
    running: { name: "Running Alpha", desc: "躲避障碍、争夺奖杯的 PvE 平台游戏。", tags: ["平台跳跃"] },
    santa: { name: "Santa Santa", desc: "扮演圣诞老人躲避雪球并派送礼物的弹幕游戏。", tags: ["射击", "平台跳跃"] },
    help: { name: "I will help you", desc: "躲避海洋生物的得分平台游戏。", tags: ["平台跳跃"] },
  },
  ja: {
    moai: {
      name: "モアイを叩き落としたい",
      storeLabel: "動画を見る",
      period: "2026、個人プロジェクト",
      highlights: [
        { metric: "Android", text: "マルチプレイの遅延原因を分析・改善" },
        { metric: "iOS / APK / PC", text: "ビルドごとの Shader 描画差異を解決" },
        { metric: "DDQN AI Bot", text: "強化学習ベースの対戦 Bot を制作" },
      ],
    },
    necro: {
      name: "Necro Rumble",
      storeLabel: "Steamで見る",
      period: "2023-2024、KRAFTON Jungle Game Lab チームプロジェクト",
      highlights: [
        { metric: "4万本+", text: "Steam 販売実績" },
        { metric: "ユニット / スキル / 戦闘", text: "コアシステムの設計・実装" },
        { metric: "FSM -> BT", text: "AI 構造を Behavior Tree にリファクタリング" },
      ],
    },
    animal: {
      name: "Animal Jumping!",
      storeLabel: "インタビューを見る",
      period: "2024-2025、個人開発プロジェクト",
      highlights: [
        { metric: "3日連続", text: "Burning Beaver 展示で面白いゲームに選定" },
        "Backnd Match による 1v1 マルチプレイ、AdMob、IAP を実装",
        { metric: "202KB -> 37KB", text: "プーリングとプリセットキャッシュで GC メモリを削減" },
      ],
    },
    lucky: { name: "ラッキーディフェンス模作", desc: "『ラッキーディフェンス』をクローンコーディングした防衛プロジェクト。", tags: ["防衛"] },
    ninja: { name: "Collecting Ninja", desc: "忍者トーナメントで最後まで生き残るトップビューアクションゲーム。", tags: ["アクション", "トップビュー"] },
    monster: { name: "Monster Rush Tactics", desc: "モンスター軍団で人間に立ち向かうターン制ストラテジー。", tags: ["戦略"] },
    stars: { name: "Among The Stars", desc: "さまざまな性格の惑星と交流するスクリプトベースのゲーム。", tags: ["シミュレーション"] },
    dash: { name: "Dash and Friends", desc: "操作感と自由度を重視した 3D サンドボックスゲーム。", tags: ["プラットフォーマー"] },
    bbuzit: { name: "Bbuzit Bbuzit", desc: "足場を設置してステージをクリアするサンドボックスゲーム。", tags: ["プラットフォーマー"] },
    smith: { name: "With Smith", desc: "3x3 タイルを塗って武器を作るローグライクゲーム。", tags: ["ローグライク", "プラットフォーマー"] },
    hugevill: { name: "Hugevill", desc: "ジャンプでレンガを壊しながら登るスコアリングゲーム。", tags: ["プラットフォーマー"] },
    nuasis: { name: "Nuasis: The Planet", desc: "宇宙で植物を育て、脱出素材を集めるクリッカーゲーム。", tags: ["クリッカー"] },
    bastabo: { name: "Bastabo Action", desc: "武器を手に入れて敵を斬るプラットフォーマー。", tags: ["プラットフォーマー"] },
    espectro: { name: "Espectro", desc: "幽霊と戦うトップビュースコアリングゲーム。", tags: ["シューティング"] },
    velocity: { name: "Velocity", desc: "ボス戦を中心にしたグリッドベースのシューティングゲーム。", tags: ["シューティング"] },
    morathon: { name: "Morathon", desc: "マラソンで1位を目指して走る PvE プラットフォーマー。", tags: ["プラットフォーマー"] },
    involution: { name: "Involution", desc: "倍々に分裂するウイルスを止めるトップビュー戦略ゲーム。", tags: ["戦略"] },
    peacetown: { name: "Peacetown", desc: "転職システムのある穏やかな雰囲気の RPG。", tags: ["RPG"] },
    eaten: { name: "Eaten", desc: "孤立した主人公に食べられるため、食べ物たちが過酷な旅に出る物語。", tags: ["プラットフォーマー"] },
    running: { name: "Running Alpha", desc: "トロフィーを得るため障害物を避けて走る PvE プラットフォーマー。", tags: ["プラットフォーマー"] },
    santa: { name: "Santa Santa", desc: "サンタとなって雪玉を避け、プレゼントを配る弾幕ゲーム。", tags: ["シューティング", "プラットフォーマー"] },
    help: { name: "I will help you", desc: "海の生き物を避けるスコアリングプラットフォーマー。", tags: ["プラットフォーマー"] },
  },
};

function buildProjects(language) {
  return projectBase.map((project) => {
    const text = projectText[language][project.key];
    return {
      ...project,
      ...text,
      desc: text.desc ?? "",
      tags: text.tags ?? [],
      secondaryLinks: project.secondaryLinks?.map((link) => ({
        ...link,
        label: localizedContent[language].ui.projects.github,
      })),
    };
  });
}

function makeContent(language, content) {
  return {
    ...content,
    profile: { ...content.profile, links },
    techGroups: techGroups[language],
    projects: [],
  };
}

export const localizedContent = {
  ko: makeContent("ko", {
    documentTitle: "Haein Oh - Rapid Game Dev",
    profile: {
      name: "Haein Oh",
      realName: "Haein Oh",
      role: "Rapid Gameplay Programmer",
      slogan: ["Fun", "Fast", "Juicy"],
      intro: "빠른 프로토타이핑, 라이브 서비스 반복 개선, 플레이어 중심 설계에 집중하는 게임 개발자입니다.",
    },
    ui: {
      language: "언어",
      nav: { career: "경력 및 프로젝트", community: "멘토링", blog: "블로그", activities: "대외활동", resume: "이력서", contact: "Contact" },
      theme: { light: "라이트 모드로 전환", dark: "다크 모드로 전환" },
      hero: {
        bullets: ["플레이어 중심", "빠른 프로토타이핑", "짜릿한 손맛"],
        supportLine: "빠르게 만들고, 직접 플레이하며, 더 재미있게 다듬는 게임 개발자입니다.",
        primary: "경력 및 프로젝트",
        primaryMobile: "프로젝트",
        loading3d: "3D 모델 불러오는 중…",
        scrollDown: "아래로 스크롤",
      },
      devrelHero: {
        role: "Developer Relations",
        slogan: ["Clear", "Helpful", "Connected"],
        bullets: ["개발자 경험 이해", "기술 커뮤니케이션", "커뮤니티 성장"],
        supportLine: "게임 제작 경험을 바탕으로 개발자가 겪는 기술적 고민을 정리하고, 커뮤니티와 제품 사이의 피드백 루프를 만드는 데 집중합니다.",
        primary: "DevRel 경험 보기",
        primaryMobile: "DevRel 경험",
        loading3d: "3D 모델 불러오는 중…",
        scrollDown: "DevRel 섹션으로 이동",
      },
      philosophy: { eyebrow: "Development Philosophy", title: "재미를 만드는 기준" },
      why: { eyebrow: "Why me", title: "제가 바로 할 수 있는 일" },
      professional: { eyebrow: "Professional", title: "실무 경력", company: "Company", impact: "Key Impact", workAreas: "Work Areas", environment: "Environment" },
      community: { eyebrow: "Community & Mentorship", title: "커뮤니티와 멘토링", desc: "기술 멘토링을 넘어 프로젝트 방향, 학습 로드맵, 커리어 고민까지 다루며 개발자가 다음 선택의 방향을 잡을 수 있도록 도와온 기록입니다." },
      projects: { eyebrow: "Projects", title: "프로젝트", open: "프로젝트 보기", github: "GitHub에서 보기", archiveShow: "아카이브 프로젝트 {count}개 보기", archiveHide: "아카이브 접기" },
      activities: { eyebrow: "Activities & Press", title: "대외활동 · 뉴스", desc: "인터뷰, 프로그램 참여, 외부 보도까지. 게임을 만들고 밖으로 꺼내며 쌓은 기록들입니다." },
      testimonials: { eyebrow: "Professional Reference", title: "추천서", desc: "", label: "Professional reference", linkedin: "LinkedIn에서 보기" },
      devrel: { primary: "Get in touch", resume: "이력서 보기", contact: "Get in touch" },
      blog: { eyebrow: "Blog", title: "개발 일지 & 생각", desc: "게임 개발, 재미에 대한 고민, 그리고 만든 도구들에 대한 기록.", indexDesc: "프로젝트 회고, 개발 과정, 문제 해결 기록을 한곳에 모았습니다.", viewAll: "블로그 바로가기", views: "조회", openOriginal: "원문 보기", loading: "불러오는 중…", closed: "블로그가 곧 열립니다.", configured: "Supabase 연결 후 글이 이곳에 표시됩니다.", empty: "첫 글을 준비하고 있어요. 곧 만나요!", notFound: "글을 찾을 수 없습니다.", backToBlog: "← 블로그로 돌아가기", back: "← 블로그" },
      media: { placeholder: "예시 미디어 자리", playVideo: "영상 재생" },
      contact: { copied: "복사 완료!", footer: "Made with Hook · Simple · Juicy." },
    },
    philosophy: [
      { key: "Hook", accent: "hook", title: "Hook", kr: "플레이어를 단번에 사로잡는 첫 순간", desc: "처음 마주하는 장면과 조작에서 곧바로 몰입이 시작되도록,<br>명확한 목표와 강한 첫 인상을 설계합니다.", media: "/philosophy/Hook.mp4", textSide: "left" },
      { key: "Simple", accent: "simple", title: "Simple", kr: "복잡함을 덜고, 핵심 재미만 남게", desc: "Easy to Learn, Hard to Master.<br>쉽게 시작하고, 파고들수록 깊어지는 재미를 만듭니다.", media: "/philosophy/Simple.mp4", textSide: "right" },
      { key: "Juicy", accent: "juicy", title: "Juicy", kr: "플레이어의 경험을 풍족하게 만드는 Skill", desc: "같은 행동도 더 신나게, 더 짜릿하게.<br>이펙트·사운드·연출로 입력마다 살아 있는 피드백을 더합니다.", media: "/philosophy/Juicy.mp4", textSide: "left" },
    ],
    strengths: [
      { stat: "14년+", title: "인디 개발 경력", desc: "개인 프로젝트 제작과 출시 경험" },
      { stat: "Unity", title: "클라이언트 개발", desc: "게임플레이, UI, 데이터 연동, 콘텐츠 시스템" },
      { stat: "FX", title: "그래픽 폴리싱", desc: "Post Processing, 간단한 쉐이더 작성" },
      { stat: "Crash", title: "크래시 대응", desc: "Android Logcat, Firebase Crashlytics 기반 분석" },
      { stat: "Optimization", title: "최적화", desc: "Profiler 기반 병목 분석과 GC Spike 핸들링" },
      { stat: "AI", title: "AI 활용", desc: "코드 작성, 프로토타이핑, 자동화, 생산성 개선" },
      { stat: "Tools", title: "인하우스 툴 개발", desc: "React / Electron 기반 협업 툴 개발" },
    ],
    community: {
      proofLine: "DevRel 역할에 필요한 개발 이해도, 멘토링, 커뮤니티 운영, 외부 커뮤니케이션 경험을 게임 개발 여정 안에서 꾸준히 쌓아왔습니다.",
      cards: [
        {
          stat: "5개월째",
          accent: "simple",
          title: "Unity 멘토링",
          desc: "기술 멘토링을 넘어 프로젝트 방향, 학습 로드맵, 커리어 고민까지 다루며 후배 개발자가 다음 선택의 방향을 잡을 수 있도록 도왔습니다.",
          items: [
            { title: "오즈코딩스쿨 Unity 멘토", period: "현재", desc: "5개월째 Unity 멘토로 활동하며 코드 리뷰, 구현 방향 제안, 디버깅 피드백과 함께 학습 우선순위와 커리어 방향에 대한 대화도 이어가고 있습니다." },
            { title: "크래프톤 정글게임랩 후배 멘토링", period: "Alumni", desc: "수료 이후 후배 기수들이 프로젝트 방향, 협업 방식, 개발 우선순위, 이후 커리어 선택을 정리할 수 있도록 경험 기반 멘토링을 진행했습니다." },
          ],
        },
        {
          stat: "Alumni",
          accent: "hook",
          title: "개발자 커뮤니티 활동",
          desc: "프로그램 수료 이후에도 개발자 커뮤니티 안에서 학습과 네트워킹이 이어지도록 운영과 참여를 계속하고 있습니다.",
          items: [
            { title: "JDC Dev Club 크루", period: "KRAFTON Jungle", desc: "크래프톤 정글게임랩 Alumni 커뮤니티에서 크루로 활동하며 수료생과 후배 개발자를 연결하는 커뮤니티 활동에 참여하고 있습니다." },
            { title: "Smilegate Membership 스터디파티 / Going", period: "SGM 16기", desc: "게임 인사이트, 보드게임 등 스터디파티 활동을 이어가고 있으며, Going 활동을 통해 새로운 기수가 적응하고 성장하도록 돕고 있습니다." },
          ],
        },
        {
          stat: "1년",
          accent: "juicy",
          title: "교육과 진로 멘토링",
          desc: "기술 설명뿐 아니라 상대의 수준과 상황에 맞춰 동기를 만들고 방향을 제시하는 경험을 쌓았습니다.",
          items: [
            { title: "인하대학교 컴퓨터공학과 멘토 대표", period: "1년", desc: "고등학교를 방문해 학과 소개와 진로 멘토링을 진행하고, 학생들이 컴퓨터공학과 개발 경험을 현실적으로 이해하도록 도왔습니다." },
            { title: "수학학원 보조교사", period: "4개월", desc: "학생의 이해도에 맞춰 설명 방식을 조정하고, 질문을 끌어내며 학습을 지원하는 커뮤니케이션 경험을 쌓았습니다." },
          ],
        },
        {
          stat: "현장 경험",
          accent: "gold",
          title: "외부 커뮤니케이션",
          desc: "개발자가 아닌 이해관계자에게 프로젝트와 상황을 설명하고, 현장에서 다양한 사람과 조율하는 경험을 쌓았습니다.",
          items: [
            { title: "애니멀 점핑! 퍼블리싱 / 지원사업 발표", period: "Solo Indie", desc: "1인 개발 프로젝트를 외부 파트너에게 설명하고, 퍼블리싱 미팅과 지원사업 발표를 통해 프로젝트의 가치와 방향을 전달했습니다." },
            { title: "주유소 · 경륜장 질서유지 팀", period: "11개월 · 5개월", desc: "고객 응대와 현장 질서유지 업무를 통해 다양한 상황에서 침착하게 설명하고 조율하는 실전 커뮤니케이션 역량을 길렀습니다." },
          ],
        },
      ],
    },
    professional: [
      { company: "Halfbrick Studios", location: "Brisbane, Australia", logo: "/companies/halfbrick.jpg", role: "Gameplay Programmer", period: "2026.01 - 2026.05 · 정규직", impact: ["Jetpack Joyride Racing(JJR) 기능 개발 및 런칭 참여", "Halfbrick+ HubApp 기능 개발", "SDK 유지보수 및 라이브 안정화"], workAreas: ["Crashlytics 기반 크래시 분석", "딥링크 / CTA 모바일 이슈 대응", "LiveOps QA 및 버그 수정", "해외 팀과 라이브 이슈 대응"], tech: ["Unity", "Mobile LiveOps", "Firebase", "Crashlytics", "Perforce"], link: "https://www.halfbrick.com", media: "https://www.youtube.com/watch?v=6PWzxNSnN20", accent: "simple" },
      { company: "111%", location: "Seoul, Korea", logo: "/companies/111percent.svg", role: "Game Client Programmer", period: "2025.08 - 2026.01 · 정규직", impact: ["1.5.x 라이브 서비스 업데이트 콘텐츠 출시", "도전과제 70+ · 스킨 · 프로필/프레임 시스템 설계/구현", "시즌 재화·마이그레이션 리스크를 고려한 안정적 출시 대응"], workAreas: ["이벤트 / 스킨 / 도전과제 시스템 개발", "전투 및 보스 기믹 로직 구현", "Jenkins / Git 협업 파이프라인", "Redmine QA 대응 및 트러블슈팅"], tech: ["Unity", "Firebase", "Jenkins", "Git", "Rapid Prototyping"], link: "https://111percent.net", media: "https://www.youtube.com/watch?v=uXJrp3pT7Yc", thumbnailZoom: 1.34, thumbnailPosition: "center 62%", accent: "hook" },
    ],
    activityFeature: { type: "Interview", title: "호주 게임회사 취업 이야기", source: "YouTube", youtubeId: "llVMe9Q21N0", url: "https://www.youtube.com/watch?v=llVMe9Q21N0", thumbnail: "/activities/austraila-interview.jpg", desc: "해외 게임회사 취업 과정과 실무 경험을 풀어낸 인터뷰 콘텐츠.", label: "YouTube" },
    activities: [
      { type: "Program Review", title: "크래프톤 정글게임랩 소식", source: "KRAFTON JUNGLE", desc: "정글게임랩 활동을 소개하는 공식 뉴스.", label: "Jungle News", url: "https://jungle.krafton.com/news/75", thumbnail: "/activities/krafton-jungle.png" },
      { type: "Press", title: "애니멀 점핑 보도", source: "Pinpoint News · ETNews", desc: "출시 프로젝트가 외부 매체에 소개된 보도 자료.", label: "Pinpoint News", url: "https://www.pinpointnews.co.kr/news/articleView.html?idxno=305741", thumbnail: "/activities/animal-jumping.png" },
      { type: "Camp", title: "경기게임영재캠프", source: "Gyeonggi News", desc: "초기 게임 개발 경험을 쌓았던 교육/캠프 활동.", label: "Article", url: "https://gnews.gg.go.kr/news/news_detail.do?number=201609072050467055C059&s_code=C059", thumbnail: "/activities/gyunggi-gamecamp.jpg" },
    ],
    testimonials: [
      { subject: "Professional Reference for Haein Oh", name: "Jason Turnbull", role: "Head of People and Culture", company: "Halfbrick", linkedin: "https://www.linkedin.com/in/haein-oh-979b29304/overlay/1779425940176/single-media-viewer/?profileId=ACoAAE3D6C0Bx6ZxWuLnEdH0Gf6wz1bF-NQrzXY", highlight: "Haein is a capable gameplay programmer with real strengths in live-service environments, mobile production troubleshooting, and cross-team collaboration.", points: ["JJR soft launch · global launch 기여", "Crashlytics, QA, dogfooding 기반 라이브 서비스 대응", "해외 팀과의 협업에서 명확한 소통과 높은 오너십"] },
    ],
  }),
  en: makeContent("en", {
    documentTitle: "Haein Oh - Rapid Game Dev",
    profile: { name: "Haein Oh", realName: "Haein Oh", role: "Rapid Gameplay Programmer", slogan: ["Fun", "Fast", "Juicy"], intro: "A gameplay programmer focused on fast prototypes, live-service iteration, and player-first systems." },
    ui: {
      language: "Language",
      nav: { career: "Experience & Projects", community: "Mentorship", blog: "Blog", activities: "Activities", resume: "Resume", contact: "Contact" },
      theme: { light: "Switch to light mode", dark: "Switch to dark mode" },
      hero: { bullets: ["Player-first", "Fast prototyping", "Juicy game feel"], supportLine: "I focus on rapid prototyping, live-service iteration, responsive controls, and polished feedback.", primary: "Experience & Projects", primaryMobile: "Projects", loading3d: "Loading 3D model…", scrollDown: "Scroll down" },
      devrelHero: { role: "Developer Relations", slogan: ["Clear", "Helpful", "Connected"], bullets: ["Developer empathy", "Technical communication", "Community growth"], supportLine: "I use hands-on game development experience to clarify technical questions and build feedback loops between communities and products.", primary: "View DevRel Work", primaryMobile: "DevRel Work", loading3d: "Loading 3D model…", scrollDown: "Go to DevRel sections" },
      philosophy: { eyebrow: "Development Philosophy", title: "How I Design Fun" },
      why: { eyebrow: "Why me", title: "What I Can Contribute Right Away" },
      professional: { eyebrow: "Professional", title: "Professional Experience", company: "Company", impact: "Key Impact", workAreas: "Work Areas", environment: "Environment" },
      community: { eyebrow: "Community & Mentorship", title: "Community & Mentorship", desc: "A record of helping developers clarify not only technical issues, but also project direction, learning priorities, and career choices." },
      projects: { eyebrow: "Projects", title: "Projects", open: "View Project", github: "View on GitHub", archiveShow: "View {count} archive projects", archiveHide: "Collapse archive" },
      activities: { eyebrow: "Activities & Press", title: "Activities & Press", desc: "Interviews, programs, and press coverage from making games and bringing them outside." },
      testimonials: { eyebrow: "Professional Reference", title: "Reference", desc: "", label: "Professional reference", linkedin: "View on LinkedIn" },
      devrel: { primary: "Get in touch", resume: "View Resume", contact: "Get in touch" },
      blog: { eyebrow: "Blog", title: "Dev Logs & Thoughts", desc: "Notes on game development, fun, and tools I build.", indexDesc: "Project retrospectives, development notes, and problem-solving records in one place.", viewAll: "Open Blog", views: "Views", openOriginal: "Open original", loading: "Loading…", closed: "The blog will open soon.", configured: "Posts will appear here after Supabase is connected.", empty: "Preparing the first post. See you soon!", notFound: "Post not found.", backToBlog: "← Back to blog", back: "← Blog" },
      media: { placeholder: "Example media slot", playVideo: "Play video" },
      contact: { copied: "Copied!", footer: "Made with Hook · Simple · Juicy." },
    },
    philosophy: [
      { key: "Hook", accent: "hook", title: "Hook", kr: "The first moment that captures the player", desc: "I design clear goals and a strong first impression<br>so immersion starts from the first scene and input.", media: "/philosophy/Hook.mp4", textSide: "left" },
      { key: "Simple", accent: "simple", title: "Simple", kr: "Less complexity, only the core fun", desc: "Easy to Learn, Hard to Master.<br>I build structures that are easy to start and deeper the more you play.", media: "/philosophy/Simple.mp4", textSide: "right" },
      { key: "Juicy", accent: "juicy", title: "Juicy", kr: "Skill that enriches the player experience", desc: "The same action should feel more exciting and more thrilling.<br>Effects, sound, and presentation make every input feel alive.", media: "/philosophy/Juicy.mp4", textSide: "left" },
    ],
    strengths: [
      { stat: "14Y+", title: "Indie Development", desc: "Years of making and shipping personal projects" },
      { stat: "Unity", title: "Client Development", desc: "Gameplay, UI, data integration, and content systems" },
      { stat: "FX", title: "Visual Polish", desc: "Post-processing and lightweight shader work" },
      { stat: "Crash", title: "Crash Response", desc: "Analysis with Android Logcat and Firebase Crashlytics" },
      { stat: "Optimization", title: "Optimization", desc: "Profiler-based bottleneck analysis and GC spike handling" },
      { stat: "AI", title: "AI-assisted Workflows", desc: "Coding, prototyping, automation, and productivity improvement" },
      { stat: "Tools", title: "In-house Tools", desc: "Collaboration tools built with React / Electron" },
    ],
    community: {
      proofLine: "Alongside hands-on game development, I have built the mentoring, community, and external communication muscles needed for developer relations work.",
      cards: [
        {
          stat: "5 months",
          accent: "simple",
          title: "Unity Mentorship",
          desc: "I support junior developers beyond technical mentoring, helping them clarify project direction, learning roadmaps, and career decisions.",
          items: [
            { title: "Unity Mentor, Oz Coding School", period: "Current", desc: "Mentoring Unity learners for five months through code review, implementation guidance, debugging feedback, learning-priority conversations, and career guidance." },
            { title: "KRAFTON Jungle Game Lab Alumni Mentoring", period: "Alumni", desc: "Mentored later cohorts after graduation, helping teams reason about project direction, collaboration habits, development priorities, and next career steps." },
          ],
        },
        {
          stat: "Alumni",
          accent: "hook",
          title: "Developer Community Work",
          desc: "I continue contributing to game-development communities after formal programs end, supporting learning loops and peer networks.",
          items: [
            { title: "Crew, JDC Dev Club", period: "KRAFTON Jungle", desc: "Serving as crew in a KRAFTON Jungle Game Lab alumni community that connects graduates and junior game developers." },
            { title: "Smilegate Membership Study Party / Going", period: "SGM 16th", desc: "Continuing study-party activities around game insight and board games, while supporting newer cohorts through Going as a mentor-like member." },
          ],
        },
        {
          stat: "1 year",
          accent: "juicy",
          title: "Education & Career Mentoring",
          desc: "I have practiced explaining technical paths at the listener's level, helping people build motivation and next-step clarity.",
          items: [
            { title: "Computer Engineering Mentor Lead, Inha University", period: "1 year", desc: "Visited high schools to introduce the department and mentor students on computer engineering, university life, and developer paths." },
            { title: "Math Academy Teaching Assistant", period: "4 months", desc: "Adjusted explanations to each student's level, encouraged questions, and supported learning through clear communication." },
          ],
        },
        {
          stat: "Field work",
          accent: "gold",
          title: "External Communication",
          desc: "I have explained projects and situations to non-developer stakeholders and coordinated with people in real-world service environments.",
          items: [
            { title: "Animal Jumping! Publishing / Grant Pitches", period: "Solo Indie", desc: "Presented a solo indie project to external partners through publishing meetings and support-program pitches, communicating its value and direction." },
            { title: "Gas Station / Velodrome Order Support", period: "11 mo · 5 mo", desc: "Built practical communication skills through customer-facing service and public-order support roles that required calm explanation and coordination." },
          ],
        },
      ],
    },
    professional: [
      { company: "Halfbrick Studios", location: "Brisbane, Australia", logo: "/companies/halfbrick.jpg", role: "Gameplay Programmer", period: "Jan 2026 - May 2026 · Full-time", impact: ["Contributed to Jetpack Joyride Racing feature development and launches", "Built features in the Halfbrick+ HubApp ecosystem", "Maintained SDKs and supported live-service stability"], workAreas: ["Crash analysis with Crashlytics", "Mobile deep link / CTA issue resolution", "LiveOps QA and bug fixing", "Live issue response with an international team"], tech: ["Unity", "Mobile LiveOps", "Firebase", "Crashlytics", "Perforce"], link: "https://www.halfbrick.com", media: "https://www.youtube.com/watch?v=6PWzxNSnN20", accent: "simple" },
      { company: "111%", location: "Seoul, Korea", logo: "/companies/111percent.svg", role: "Game Client Programmer", period: "Aug 2025 - Jan 2026 · Full-time", impact: ["Shipped 1.5.x live-service update content", "Designed and implemented 70+ achievements, skin, and profile/frame systems", "Supported stable releases with migration and seasonal-currency risk handling"], workAreas: ["Event, skin, and achievement systems", "Combat and boss mechanic logic", "Jenkins / Git collaboration pipeline", "Redmine QA response and troubleshooting"], tech: ["Unity", "Firebase", "Jenkins", "Git", "Rapid Prototyping"], link: "https://111percent.net", media: "https://www.youtube.com/watch?v=uXJrp3pT7Yc", thumbnailZoom: 1.34, thumbnailPosition: "center 62%", accent: "hook" },
    ],
    activityFeature: { type: "Interview", title: "Working at an Australian Game Studio", source: "YouTube", youtubeId: "llVMe9Q21N0", url: "https://www.youtube.com/watch?v=llVMe9Q21N0", thumbnail: "/activities/austraila-interview.jpg", desc: "An interview about the path to overseas game jobs and real production experience.", label: "YouTube" },
    activities: [
      { type: "Program Review", title: "KRAFTON Jungle Game Lab News", source: "KRAFTON JUNGLE", desc: "Official news introducing the Jungle Game Lab program.", label: "Jungle News", url: "https://jungle.krafton.com/news/75", thumbnail: "/activities/krafton-jungle.png" },
      { type: "Press", title: "Animal Jumping Press", source: "Pinpoint News · ETNews", desc: "Press coverage introducing a released project.", label: "Pinpoint News", url: "https://www.pinpointnews.co.kr/news/articleView.html?idxno=305741", thumbnail: "/activities/animal-jumping.png" },
      { type: "Camp", title: "Gyeonggi Game Talent Camp", source: "Gyeonggi News", desc: "An early education/camp experience that shaped my game development path.", label: "Article", url: "https://gnews.gg.go.kr/news/news_detail.do?number=201609072050467055C059&s_code=C059", thumbnail: "/activities/gyunggi-gamecamp.jpg" },
    ],
    testimonials: [
      { subject: "Professional Reference for Haein Oh", name: "Jason Turnbull", role: "Head of People and Culture", company: "Halfbrick", linkedin: "https://www.linkedin.com/in/haein-oh-979b29304/overlay/1779425940176/single-media-viewer/?profileId=ACoAAE3D6C0Bx6ZxWuLnEdH0Gf6wz1bF-NQrzXY", highlight: "Haein is a capable gameplay programmer with real strengths in live-service environments, mobile production troubleshooting, and cross-team collaboration.", points: ["Contributed to JJR soft launch and global launch", "Handled live-service work through Crashlytics, QA, and dogfooding", "Clear communication and strong ownership in an international team"] },
    ],
  }),
  zh: makeContent("zh", {
    documentTitle: "Haein Oh - Rapid Game Dev",
    profile: { name: "Haein Oh", realName: "Haein Oh", role: "Rapid Gameplay Programmer", slogan: ["Fun", "Fast", "Juicy"], intro: "专注于快速原型、在线服务迭代和玩家优先系统的 Gameplay Programmer。" },
    ui: {
      language: "语言",
      nav: { career: "经历与项目", community: "导师经验", blog: "博客", activities: "活动", resume: "简历", contact: "Contact" },
      theme: { light: "切换到浅色模式", dark: "切换到深色模式" },
      hero: { bullets: ["玩家优先", "快速原型制作", "爽快手感"], supportLine: "我专注于快速原型、在线服务迭代、响应式操作和反馈表现的打磨。", primary: "经历与项目", primaryMobile: "项目", loading3d: "正在加载 3D 模型…", scrollDown: "向下滚动" },
      devrelHero: { role: "Developer Relations", slogan: ["Clear", "Helpful", "Connected"], bullets: ["理解开发者体验", "技术沟通", "社区成长"], supportLine: "基于实际游戏开发经验，帮助创作者解决卡点，并建立社区与产品之间的反馈循环。", primary: "查看 DevRel 经验", primaryMobile: "DevRel 经验", loading3d: "正在加载 3D 模型…", scrollDown: "前往 DevRel 内容" },
      philosophy: { eyebrow: "Development Philosophy", title: "我设计乐趣的标准" },
      why: { eyebrow: "Why me", title: "我能立即贡献的能力" },
      professional: { eyebrow: "Professional", title: "工作经历", company: "公司", impact: "关键成果", workAreas: "工作范围", environment: "开发环境" },
      community: { eyebrow: "Community & Mentorship", title: "社区与导师经验", desc: "不仅提供技术指导，也帮助开发者梳理项目方向、学习优先级和职业选择。" },
      projects: { eyebrow: "Projects", title: "项目", open: "查看项目", github: "在 GitHub 查看", archiveShow: "查看 {count} 个归档项目", archiveHide: "收起归档" },
      activities: { eyebrow: "Activities & Press", title: "活动 · 新闻", desc: "采访、项目参与和媒体报道，记录我把游戏做出来并带到外部的过程。" },
      testimonials: { eyebrow: "Professional Reference", title: "推荐信", desc: "", label: "Professional reference", linkedin: "在 LinkedIn 查看" },
      devrel: { primary: "联系我", resume: "查看简历", contact: "联系我" },
      blog: { eyebrow: "Blog", title: "开发日志与想法", desc: "关于游戏开发、乐趣和工具制作的记录。", indexDesc: "项目复盘、开发过程和问题解决记录都整理在这里。", viewAll: "进入博客", views: "浏览", openOriginal: "查看原文", loading: "加载中…", closed: "博客即将开放。", configured: "连接 Supabase 后文章会显示在这里。", empty: "第一篇文章正在准备中，敬请期待！", notFound: "找不到文章。", backToBlog: "← 返回博客", back: "← 博客" },
      media: { placeholder: "示例媒体位置", playVideo: "播放视频" },
      contact: { copied: "已复制！", footer: "Made with Hook · Simple · Juicy." },
    },
    philosophy: [
      { key: "Hook", accent: "hook", title: "Hook", kr: "抓住玩家的第一瞬间", desc: "从初次看到的画面和操作开始就能进入沉浸，<br>我会设计清晰目标和强烈第一印象。", media: "/philosophy/Hook.mp4", textSide: "left" },
      { key: "Simple", accent: "simple", title: "Simple", kr: "去掉复杂，只留下核心乐趣", desc: "Easy to Learn, Hard to Master.<br>让玩家容易上手，也能越玩越深入。", media: "/philosophy/Simple.mp4", textSide: "right" },
      { key: "Juicy", accent: "juicy", title: "Juicy", kr: "让体验更丰富的手感", desc: "同样的动作也要更兴奋、更刺激。<br>通过特效、声音和演出，让每一次输入都有反馈。", media: "/philosophy/Juicy.mp4", textSide: "left" },
    ],
    strengths: [
      { stat: "14年+", title: "独立游戏开发经验", desc: "长期制作并发布个人项目" },
      { stat: "Unity", title: "客户端开发", desc: "Gameplay、UI、数据联动与内容系统" },
      { stat: "FX", title: "视觉打磨", desc: "Post Processing 与简单 Shader 编写" },
      { stat: "Crash", title: "崩溃处理", desc: "基于 Android Logcat 和 Firebase Crashlytics 的分析" },
      { stat: "Optimization", title: "优化", desc: "基于 Profiler 的瓶颈分析与 GC Spike 处理" },
      { stat: "AI", title: "AI 工作流", desc: "代码编写、原型、自动化和生产力提升" },
      { stat: "Tools", title: "内部工具开发", desc: "基于 React / Electron 的协作工具" },
    ],
    community: {
      proofLine: "除了实际游戏开发，我也持续积累 Developer Relations 所需的导师经验、社区运营和对外沟通能力。",
      cards: [
        {
          stat: "5个月",
          accent: "simple",
          title: "Unity 导师经验",
          desc: "不仅进行技术指导，也帮助后辈开发者梳理项目方向、学习路线和职业选择。",
          items: [
            { title: "Oz Coding School Unity 导师", period: "现在", desc: "担任 Unity 导师 5 个月，提供代码评审、实现方向建议、调试反馈，并一起梳理学习优先级和职业困惑。" },
            { title: "KRAFTON Jungle Game Lab 后辈导师", period: "Alumni", desc: "结业后为后续期数提供项目方向、协作方式、开发优先级和后续职业选择方面的经验型指导。" },
          ],
        },
        {
          stat: "Alumni",
          accent: "hook",
          title: "开发者社区活动",
          desc: "正式项目结束后，也持续参与开发者社区，让学习、交流和连接继续发生。",
          items: [
            { title: "JDC Dev Club Crew", period: "KRAFTON Jungle", desc: "在 KRAFTON Jungle Game Lab 校友社区担任 crew，参与连接结业生和后辈开发者的社区活动。" },
            { title: "Smilegate Membership Study Party / Going", period: "SGM 16期", desc: "持续参与游戏洞察、桌游等 study party，并通过 Going 活动帮助新期数适应和成长。" },
          ],
        },
        {
          stat: "1年",
          accent: "juicy",
          title: "教育与职业导师",
          desc: "根据对方的水平和处境调整说明方式，帮助他们建立动机并明确下一步。",
          items: [
            { title: "仁荷大学计算机工程系导师代表", period: "1年", desc: "走访高中介绍学系并进行职业导师活动，帮助学生更现实地理解计算机工程和开发者道路。" },
            { title: "数学学院助教", period: "4个月", desc: "根据学生理解程度调整说明方式，引导提问并支持学习。" },
          ],
        },
        {
          stat: "现场经验",
          accent: "gold",
          title: "对外沟通",
          desc: "向非开发者利益相关者说明项目和现场情况，并在服务环境中与不同的人协调。",
          items: [
            { title: "Animal Jumping! 发行会议 / 支援项目发表", period: "Solo Indie", desc: "向外部合作方说明个人独立游戏项目，通过发行会议和支援项目发表传达项目价值与方向。" },
            { title: "加油站 / 赛车场秩序维护", period: "11个月 · 5个月", desc: "通过客户应对和现场秩序维护，积累了在多样情况下冷静说明和协调的沟通能力。" },
          ],
        },
      ],
    },
    professional: [
      { company: "Halfbrick Studios", location: "Brisbane, Australia", logo: "/companies/halfbrick.jpg", role: "Gameplay Programmer", period: "2026.01 - 2026.05 · 全职", impact: ["参与 Jetpack Joyride Racing 功能开发与上线", "开发 Halfbrick+ HubApp 生态相关功能", "维护 SDK 并支持在线服务稳定性"], workAreas: ["基于 Crashlytics 的崩溃分析", "处理移动端 deep link / CTA 问题", "LiveOps QA 与 Bug 修复", "与海外团队一起处理线上问题"], tech: ["Unity", "Mobile LiveOps", "Firebase", "Crashlytics", "Perforce"], link: "https://www.halfbrick.com", media: "https://www.youtube.com/watch?v=6PWzxNSnN20", accent: "simple" },
      { company: "111%", location: "Seoul, Korea", logo: "/companies/111percent.svg", role: "Game Client Programmer", period: "2025.08 - 2026.01 · 全职", impact: ["发布 1.5.x 在线服务更新内容", "设计并实现 70+ 成就、皮肤、个人资料/头像框系统", "考虑迁移与赛季货币风险，支持稳定上线"], workAreas: ["活动 / 皮肤 / 成就系统开发", "战斗与 Boss 机制逻辑实现", "Jenkins / Git 协作流程", "Redmine QA 响应与问题排查"], tech: ["Unity", "Firebase", "Jenkins", "Git", "Rapid Prototyping"], link: "https://111percent.net", media: "https://www.youtube.com/watch?v=uXJrp3pT7Yc", thumbnailZoom: 1.34, thumbnailPosition: "center 62%", accent: "hook" },
    ],
    activityFeature: { type: "Interview", title: "澳洲游戏公司求职故事", source: "YouTube", youtubeId: "llVMe9Q21N0", url: "https://www.youtube.com/watch?v=llVMe9Q21N0", thumbnail: "/activities/austraila-interview.jpg", desc: "关于海外游戏公司求职过程和实际工作经验的采访内容。", label: "YouTube" },
    activities: [
      { type: "Program Review", title: "KRAFTON Jungle Game Lab 新闻", source: "KRAFTON JUNGLE", desc: "介绍 Jungle Game Lab 活动的官方新闻。", label: "Jungle News", url: "https://jungle.krafton.com/news/75", thumbnail: "/activities/krafton-jungle.png" },
      { type: "Press", title: "Animal Jumping 报道", source: "Pinpoint News · ETNews", desc: "已发布项目被外部媒体介绍的报道。", label: "Pinpoint News", url: "https://www.pinpointnews.co.kr/news/articleView.html?idxno=305741", thumbnail: "/activities/animal-jumping.png" },
      { type: "Camp", title: "京畿游戏英才营", source: "Gyeonggi News", desc: "早期积累游戏开发经验的教育/营队活动。", label: "Article", url: "https://gnews.gg.go.kr/news/news_detail.do?number=201609072050467055C059&s_code=C059", thumbnail: "/activities/gyunggi-gamecamp.jpg" },
    ],
    testimonials: [
      { subject: "Professional Reference for Haein Oh", name: "Jason Turnbull", role: "Head of People and Culture", company: "Halfbrick", linkedin: "https://www.linkedin.com/in/haein-oh-979b29304/overlay/1779425940176/single-media-viewer/?profileId=ACoAAE3D6C0Bx6ZxWuLnEdH0Gf6wz1bF-NQrzXY", highlight: "Haein 是一位优秀的 gameplay programmer，在在线服务环境、移动端生产问题排查和跨团队协作方面有明显优势。", points: ["参与 JJR soft launch 与 global launch", "通过 Crashlytics、QA、dogfooding 处理在线服务问题", "在海外团队协作中保持清晰沟通和高 ownership"] },
    ],
  }),
  ja: makeContent("ja", {
    documentTitle: "Haein Oh - Rapid Game Dev",
    profile: { name: "Haein Oh", realName: "Haein Oh", role: "Rapid Gameplay Programmer", slogan: ["Fun", "Fast", "Juicy"], intro: "高速プロトタイピング、ライブサービス改善、プレイヤーファーストなシステムに注力する Gameplay Programmer です。" },
    ui: {
      language: "言語",
      nav: { career: "経験とプロジェクト", community: "メンタリング", blog: "ブログ", activities: "活動", resume: "履歴書", contact: "Contact" },
      theme: { light: "ライトモードへ切り替え", dark: "ダークモードへ切り替え" },
      hero: { bullets: ["プレイヤーファースト", "高速プロトタイピング", "気持ちいい手触り"], supportLine: "高速プロトタイピング、ライブサービス改善、レスポンスのよい操作感とフィードバックの磨き込みに注力しています。", primary: "経験とプロジェクト", primaryMobile: "プロジェクト", loading3d: "3Dモデルを読み込み中…", scrollDown: "下へスクロール" },
      devrelHero: { role: "Developer Relations", slogan: ["Clear", "Helpful", "Connected"], bullets: ["開発者体験への理解", "技術コミュニケーション", "コミュニティ成長"], supportLine: "実際のゲーム開発経験をもとに、クリエイターの課題解決とコミュニティ・製品間のフィードバックループ作りに取り組みます。", primary: "DevRel経験を見る", primaryMobile: "DevRel経験", loading3d: "3Dモデルを読み込み中…", scrollDown: "DevRelセクションへ" },
      philosophy: { eyebrow: "Development Philosophy", title: "面白さを作る基準" },
      why: { eyebrow: "Why me", title: "すぐに貢献できること" },
      professional: { eyebrow: "Professional", title: "実務経験", company: "Company", impact: "Key Impact", workAreas: "Work Areas", environment: "Environment" },
      community: { eyebrow: "Community & Mentorship", title: "コミュニティとメンタリング", desc: "技術的な相談だけでなく、プロジェクトの方向性、学習優先度、キャリアの悩みまで整理し、次の選択を支援してきた記録です。" },
      projects: { eyebrow: "Projects", title: "プロジェクト", open: "プロジェクトを見る", github: "GitHubで見る", archiveShow: "アーカイブプロジェクト {count} 件を見る", archiveHide: "アーカイブを閉じる" },
      activities: { eyebrow: "Activities & Press", title: "活動・ニュース", desc: "インタビュー、プログラム参加、外部メディア掲載など、ゲームを作り外へ届けた記録です。" },
      testimonials: { eyebrow: "Professional Reference", title: "推薦文", desc: "", label: "Professional reference", linkedin: "LinkedInで見る" },
      devrel: { primary: "Get in touch", resume: "履歴書を見る", contact: "Get in touch" },
      blog: { eyebrow: "Blog", title: "開発日誌と思考", desc: "ゲーム開発、面白さ、制作したツールについての記録。", indexDesc: "プロジェクトの振り返り、開発過程、問題解決の記録をまとめています。", viewAll: "ブログへ", views: "閲覧", openOriginal: "原文を見る", loading: "読み込み中…", closed: "ブログはまもなく公開されます。", configured: "Supabase 接続後、記事がここに表示されます。", empty: "最初の記事を準備しています。お楽しみに！", notFound: "記事が見つかりません。", backToBlog: "← ブログへ戻る", back: "← ブログ" },
      media: { placeholder: "サンプルメディア枠", playVideo: "動画を再生" },
      contact: { copied: "コピーしました！", footer: "Made with Hook · Simple · Juicy." },
    },
    philosophy: [
      { key: "Hook", accent: "hook", title: "Hook", kr: "プレイヤーをつかむ最初の瞬間", desc: "最初に出会う画面と操作から没入が始まるように、<br>明確な目標と強い第一印象を設計します。", media: "/philosophy/Hook.mp4", textSide: "left" },
      { key: "Simple", accent: "simple", title: "Simple", kr: "複雑さを減らし、核心の面白さだけを残す", desc: "Easy to Learn, Hard to Master.<br>始めやすく、遊ぶほど深くなる構造を作ります。", media: "/philosophy/Simple.mp4", textSide: "right" },
      { key: "Juicy", accent: "juicy", title: "Juicy", kr: "体験を豊かにする手触り", desc: "同じ行動でも、もっと楽しく、もっと刺激的に。<br>エフェクト・サウンド・演出で入力ごとに生きたフィードバックを加えます。", media: "/philosophy/Juicy.mp4", textSide: "left" },
    ],
    strengths: [
      { stat: "14年+", title: "インディー開発経験", desc: "個人プロジェクトの制作・リリース経験" },
      { stat: "Unity", title: "クライアント開発", desc: "ゲームプレイ、UI、データ連携、コンテンツシステム" },
      { stat: "FX", title: "グラフィックポリッシュ", desc: "Post Processing と簡単な Shader 作成" },
      { stat: "Crash", title: "クラッシュ対応", desc: "Android Logcat と Firebase Crashlytics による分析" },
      { stat: "Optimization", title: "最適化", desc: "Profiler によるボトルネック分析と GC Spike 対応" },
      { stat: "AI", title: "AI活用", desc: "コーディング、プロトタイピング、自動化、生産性向上" },
      { stat: "Tools", title: "社内ツール開発", desc: "React / Electron ベースの協業ツール開発" },
    ],
    community: {
      proofLine: "実際のゲーム開発に加えて、Developer Relations に必要なメンタリング、コミュニティ活動、外部コミュニケーションの経験を積んできました。",
      cards: [
        {
          stat: "5か月",
          accent: "simple",
          title: "Unity メンタリング",
          desc: "技術メンタリングに加えて、プロジェクトの方向性、学習ロードマップ、キャリアの選択まで整理できるよう支援してきました。",
          items: [
            { title: "Oz Coding School Unity メンター", period: "現在", desc: "5か月間 Unity メンターとして、コードレビュー、実装方針の提案、デバッグフィードバックに加え、学習優先度やキャリア相談も一緒に整理しています。" },
            { title: "KRAFTON Jungle Game Lab 後輩メンタリング", period: "Alumni", desc: "修了後、後輩チームがプロジェクト方針、協業方法、開発優先度、その後のキャリア選択を整理できるよう経験ベースで支援しました。" },
          ],
        },
        {
          stat: "Alumni",
          accent: "hook",
          title: "開発者コミュニティ活動",
          desc: "プログラム修了後も、学習とネットワーキングが続くようにコミュニティへの参加と運営を続けています。",
          items: [
            { title: "JDC Dev Club Crew", period: "KRAFTON Jungle", desc: "KRAFTON Jungle Game Lab の Alumni コミュニティで crew として活動し、修了生と後輩開発者をつなぐ活動に参加しています。" },
            { title: "Smilegate Membership Study Party / Going", period: "SGM 16期", desc: "ゲームインサイトやボードゲームの study party を続けながら、Going 活動を通じて新しい期の適応と成長を支援しています。" },
          ],
        },
        {
          stat: "1年",
          accent: "juicy",
          title: "教育・キャリアメンタリング",
          desc: "相手のレベルや状況に合わせて説明を調整し、動機づけと次の一歩を明確にする経験を積みました。",
          items: [
            { title: "仁荷大学コンピュータ工学科メンター代表", period: "1年", desc: "高校を訪問して学科紹介と進路メンタリングを行い、学生がコンピュータ工学と開発者の道を現実的に理解できるよう支援しました。" },
            { title: "数学塾 補助講師", period: "4か月", desc: "生徒の理解度に合わせて説明方法を調整し、質問を引き出しながら学習を支援しました。" },
          ],
        },
        {
          stat: "現場経験",
          accent: "gold",
          title: "外部コミュニケーション",
          desc: "開発者以外の関係者にプロジェクトや状況を説明し、現場で多様な人と調整する経験を積みました。",
          items: [
            { title: "Animal Jumping! パブリッシング / 支援事業ピッチ", period: "Solo Indie", desc: "1人開発プロジェクトを外部パートナーに説明し、パブリッシングミーティングと支援事業発表を通じて価値と方向性を伝えました。" },
            { title: "ガソリンスタンド / 競輪場秩序維持チーム", period: "11か月 · 5か月", desc: "接客と現場秩序維持を通じて、さまざまな状況で落ち着いて説明し調整する実践的なコミュニケーション力を身につけました。" },
          ],
        },
      ],
    },
    professional: [
      { company: "Halfbrick Studios", location: "Brisbane, Australia", logo: "/companies/halfbrick.jpg", role: "Gameplay Programmer", period: "2026.01 - 2026.05 · 正社員", impact: ["Jetpack Joyride Racing の機能開発とローンチに貢献", "Halfbrick+ HubApp エコシステムの機能開発", "SDK 保守とライブサービス安定化を支援"], workAreas: ["Crashlytics ベースのクラッシュ分析", "モバイル deep link / CTA 問題対応", "LiveOps QA とバグ修正", "海外チームとのライブ問題対応"], tech: ["Unity", "Mobile LiveOps", "Firebase", "Crashlytics", "Perforce"], link: "https://www.halfbrick.com", media: "https://www.youtube.com/watch?v=6PWzxNSnN20", accent: "simple" },
      { company: "111%", location: "Seoul, Korea", logo: "/companies/111percent.svg", role: "Game Client Programmer", period: "2025.08 - 2026.01 · 正社員", impact: ["1.5.x ライブサービス更新コンテンツをリリース", "70+ の実績、スキン、プロフィール/フレームシステムを設計・実装", "マイグレーションとシーズン通貨リスクを考慮し、安定したリリースを支援"], workAreas: ["イベント / スキン / 実績システム開発", "戦闘とボスギミックのロジック実装", "Jenkins / Git 協業パイプライン", "Redmine QA 対応とトラブルシューティング"], tech: ["Unity", "Firebase", "Jenkins", "Git", "Rapid Prototyping"], link: "https://111percent.net", media: "https://www.youtube.com/watch?v=uXJrp3pT7Yc", thumbnailZoom: 1.34, thumbnailPosition: "center 62%", accent: "hook" },
    ],
    activityFeature: { type: "Interview", title: "オーストラリアのゲーム会社就職ストーリー", source: "YouTube", youtubeId: "llVMe9Q21N0", url: "https://www.youtube.com/watch?v=llVMe9Q21N0", thumbnail: "/activities/austraila-interview.jpg", desc: "海外ゲーム会社への就職過程と実務経験を語ったインタビューコンテンツ。", label: "YouTube" },
    activities: [
      { type: "Program Review", title: "KRAFTON Jungle Game Lab ニュース", source: "KRAFTON JUNGLE", desc: "Jungle Game Lab の活動を紹介する公式ニュース。", label: "Jungle News", url: "https://jungle.krafton.com/news/75", thumbnail: "/activities/krafton-jungle.png" },
      { type: "Press", title: "Animal Jumping 掲載記事", source: "Pinpoint News · ETNews", desc: "リリースしたプロジェクトが外部メディアで紹介された記事。", label: "Pinpoint News", url: "https://www.pinpointnews.co.kr/news/articleView.html?idxno=305741", thumbnail: "/activities/animal-jumping.png" },
      { type: "Camp", title: "京畿ゲーム英才キャンプ", source: "Gyeonggi News", desc: "初期のゲーム開発経験を積んだ教育・キャンプ活動。", label: "Article", url: "https://gnews.gg.go.kr/news/news_detail.do?number=201609072050467055C059&s_code=C059", thumbnail: "/activities/gyunggi-gamecamp.jpg" },
    ],
    testimonials: [
      { subject: "Professional Reference for Haein Oh", name: "Jason Turnbull", role: "Head of People and Culture", company: "Halfbrick", linkedin: "https://www.linkedin.com/in/haein-oh-979b29304/overlay/1779425940176/single-media-viewer/?profileId=ACoAAE3D6C0Bx6ZxWuLnEdH0Gf6wz1bF-NQrzXY", highlight: "Haein は、ライブサービス環境、モバイル制作課題のトラブルシューティング、チーム横断の協業に強みを持つ有能な Gameplay Programmer です。", points: ["JJR の soft launch と global launch に貢献", "Crashlytics、QA、dogfooding を通じたライブサービス対応", "海外チームでの明確なコミュニケーションと高い ownership"] },
    ],
  }),
};

for (const language of Object.keys(localizedContent)) {
  localizedContent[language].projects = buildProjects(language);
}
