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
      nav: { career: "경력 및 프로젝트", blog: "블로그", activities: "대외활동", contact: "Contact" },
      theme: { light: "라이트 모드로 전환", dark: "다크 모드로 전환" },
      hero: {
        bullets: ["플레이어 중심", "빠른 프로토타이핑", "짜릿한 손맛"],
        primary: "경력 및 프로젝트",
        primaryMobile: "프로젝트",
        loading3d: "3D 모델 불러오는 중…",
        scrollDown: "아래로 스크롤",
      },
      philosophy: { eyebrow: "Development Philosophy", title: "재미를 만드는 기준" },
      why: { eyebrow: "Why me", title: "제가 바로 할 수 있는 일" },
      professional: { eyebrow: "Professional", title: "실무 경력", company: "Company", impact: "Key Impact", workAreas: "Work Areas", environment: "Environment" },
      projects: { eyebrow: "Projects", title: "프로젝트", open: "프로젝트 보기", github: "GitHub에서 보기", archiveShow: "아카이브 프로젝트 {count}개 보기", archiveHide: "아카이브 접기" },
      activities: { eyebrow: "Activities & Press", title: "대외활동 · 뉴스", desc: "인터뷰, 프로그램 참여, 외부 보도까지. 게임을 만들고 밖으로 꺼내며 쌓은 기록들입니다." },
      testimonials: { eyebrow: "Professional Reference", title: "추천서", desc: "", label: "Professional reference", linkedin: "LinkedIn에서 보기" },
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
    professional: [
      { company: "Halfbrick Studios", location: "Brisbane, Australia", logo: "/companies/halfbrick.jpg", role: "Gameplay Programmer", period: "(기간 입력)", impact: ["Jetpack Joyride Racing(JJR) 기능 개발 및 런칭 참여", "Halfbrick+ HubApp 기능 개발", "SDK 유지보수 및 라이브 안정화"], workAreas: ["Crashlytics 기반 크래시 분석", "딥링크 / CTA 모바일 이슈 대응", "LiveOps QA 및 버그 수정", "해외 팀과 라이브 이슈 대응"], tech: ["Unity", "Mobile LiveOps", "Firebase", "Crashlytics", "Perforce"], link: "https://www.halfbrick.com", media: "https://www.youtube.com/watch?v=6PWzxNSnN20", accent: "simple" },
      { company: "111%", location: "Seoul, Korea", logo: "/companies/111percent.svg", role: "Game Client Programmer", period: "(기간 입력)", impact: ["도전과제 70+ 시스템 설계/구현", "전투 · 보스 · 스킨 · 증강체 시스템 개발", "라이브 서비스 구조 개선 및 신규 기능 데이터 연동"], workAreas: ["이벤트 / 스킨 / 도전과제 시스템 개발", "전투 및 보스 기믹 로직 구현", "Jenkins / Git 협업 파이프라인", "Redmine QA 대응 및 트러블슈팅"], tech: ["Unity", "Firebase", "Jenkins", "Git", "Rapid Prototyping"], link: "https://111percent.net", media: "https://www.youtube.com/watch?v=uXJrp3pT7Yc", thumbnailZoom: 1.34, thumbnailPosition: "center 62%", accent: "hook" },
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
      nav: { career: "Experience & Projects", blog: "Blog", activities: "Activities", contact: "Contact" },
      theme: { light: "Switch to light mode", dark: "Switch to dark mode" },
      hero: { bullets: ["Player-first", "Fast prototyping", "Juicy game feel"], primary: "Experience & Projects", primaryMobile: "Projects", loading3d: "Loading 3D model…", scrollDown: "Scroll down" },
      philosophy: { eyebrow: "Development Philosophy", title: "How I Design Fun" },
      why: { eyebrow: "Why me", title: "What I Can Contribute Right Away" },
      professional: { eyebrow: "Professional", title: "Professional Experience", company: "Company", impact: "Key Impact", workAreas: "Work Areas", environment: "Environment" },
      projects: { eyebrow: "Projects", title: "Projects", open: "View Project", github: "View on GitHub", archiveShow: "View {count} archive projects", archiveHide: "Collapse archive" },
      activities: { eyebrow: "Activities & Press", title: "Activities & Press", desc: "Interviews, programs, and press coverage from making games and bringing them outside." },
      testimonials: { eyebrow: "Professional Reference", title: "Reference", desc: "", label: "Professional reference", linkedin: "View on LinkedIn" },
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
    professional: [
      { company: "Halfbrick Studios", location: "Brisbane, Australia", logo: "/companies/halfbrick.jpg", role: "Gameplay Programmer", period: "(Add period)", impact: ["Contributed to Jetpack Joyride Racing feature development and launches", "Built features in the Halfbrick+ HubApp ecosystem", "Maintained SDKs and supported live-service stability"], workAreas: ["Crash analysis with Crashlytics", "Mobile deep link / CTA issue resolution", "LiveOps QA and bug fixing", "Live issue response with an international team"], tech: ["Unity", "Mobile LiveOps", "Firebase", "Crashlytics", "Perforce"], link: "https://www.halfbrick.com", media: "https://www.youtube.com/watch?v=6PWzxNSnN20", accent: "simple" },
      { company: "111%", location: "Seoul, Korea", logo: "/companies/111percent.svg", role: "Game Client Programmer", period: "(Add period)", impact: ["Designed and implemented 70+ achievement systems", "Developed combat, boss, skin, and augment systems", "Improved live-service structure and new feature data integration"], workAreas: ["Event, skin, and achievement systems", "Combat and boss mechanic logic", "Jenkins / Git collaboration pipeline", "Redmine QA response and troubleshooting"], tech: ["Unity", "Firebase", "Jenkins", "Git", "Rapid Prototyping"], link: "https://111percent.net", media: "https://www.youtube.com/watch?v=uXJrp3pT7Yc", thumbnailZoom: 1.34, thumbnailPosition: "center 62%", accent: "hook" },
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
      nav: { career: "经历与项目", blog: "博客", activities: "活动", contact: "Contact" },
      theme: { light: "切换到浅色模式", dark: "切换到深色模式" },
      hero: { bullets: ["玩家优先", "快速原型制作", "爽快手感"], primary: "经历与项目", primaryMobile: "项目", loading3d: "正在加载 3D 模型…", scrollDown: "向下滚动" },
      philosophy: { eyebrow: "Development Philosophy", title: "我设计乐趣的标准" },
      why: { eyebrow: "Why me", title: "我能立即贡献的能力" },
      professional: { eyebrow: "Professional", title: "工作经历", company: "公司", impact: "关键成果", workAreas: "工作范围", environment: "开发环境" },
      projects: { eyebrow: "Projects", title: "项目", open: "查看项目", github: "在 GitHub 查看", archiveShow: "查看 {count} 个归档项目", archiveHide: "收起归档" },
      activities: { eyebrow: "Activities & Press", title: "活动 · 新闻", desc: "采访、项目参与和媒体报道，记录我把游戏做出来并带到外部的过程。" },
      testimonials: { eyebrow: "Professional Reference", title: "推荐信", desc: "", label: "Professional reference", linkedin: "在 LinkedIn 查看" },
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
    professional: [
      { company: "Halfbrick Studios", location: "Brisbane, Australia", logo: "/companies/halfbrick.jpg", role: "Gameplay Programmer", period: "(填写期间)", impact: ["参与 Jetpack Joyride Racing 功能开发与上线", "开发 Halfbrick+ HubApp 生态相关功能", "维护 SDK 并支持在线服务稳定性"], workAreas: ["基于 Crashlytics 的崩溃分析", "处理移动端 deep link / CTA 问题", "LiveOps QA 与 Bug 修复", "与海外团队一起处理线上问题"], tech: ["Unity", "Mobile LiveOps", "Firebase", "Crashlytics", "Perforce"], link: "https://www.halfbrick.com", media: "https://www.youtube.com/watch?v=6PWzxNSnN20", accent: "simple" },
      { company: "111%", location: "Seoul, Korea", logo: "/companies/111percent.svg", role: "Game Client Programmer", period: "(填写期间)", impact: ["设计并实现 70+ 成就系统", "开发战斗、Boss、皮肤和增益系统", "改善在线服务结构并接入新功能数据"], workAreas: ["活动 / 皮肤 / 成就系统开发", "战斗与 Boss 机制逻辑实现", "Jenkins / Git 协作流程", "Redmine QA 响应与问题排查"], tech: ["Unity", "Firebase", "Jenkins", "Git", "Rapid Prototyping"], link: "https://111percent.net", media: "https://www.youtube.com/watch?v=uXJrp3pT7Yc", thumbnailZoom: 1.34, thumbnailPosition: "center 62%", accent: "hook" },
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
      nav: { career: "経験とプロジェクト", blog: "ブログ", activities: "活動", contact: "Contact" },
      theme: { light: "ライトモードへ切り替え", dark: "ダークモードへ切り替え" },
      hero: { bullets: ["プレイヤーファースト", "高速プロトタイピング", "気持ちいい手触り"], primary: "経験とプロジェクト", primaryMobile: "プロジェクト", loading3d: "3Dモデルを読み込み中…", scrollDown: "下へスクロール" },
      philosophy: { eyebrow: "Development Philosophy", title: "面白さを作る基準" },
      why: { eyebrow: "Why me", title: "すぐに貢献できること" },
      professional: { eyebrow: "Professional", title: "実務経験", company: "Company", impact: "Key Impact", workAreas: "Work Areas", environment: "Environment" },
      projects: { eyebrow: "Projects", title: "プロジェクト", open: "プロジェクトを見る", github: "GitHubで見る", archiveShow: "アーカイブプロジェクト {count} 件を見る", archiveHide: "アーカイブを閉じる" },
      activities: { eyebrow: "Activities & Press", title: "活動・ニュース", desc: "インタビュー、プログラム参加、外部メディア掲載など、ゲームを作り外へ届けた記録です。" },
      testimonials: { eyebrow: "Professional Reference", title: "推薦文", desc: "", label: "Professional reference", linkedin: "LinkedInで見る" },
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
    professional: [
      { company: "Halfbrick Studios", location: "Brisbane, Australia", logo: "/companies/halfbrick.jpg", role: "Gameplay Programmer", period: "(期間入力)", impact: ["Jetpack Joyride Racing の機能開発とローンチに貢献", "Halfbrick+ HubApp エコシステムの機能開発", "SDK 保守とライブサービス安定化を支援"], workAreas: ["Crashlytics ベースのクラッシュ分析", "モバイル deep link / CTA 問題対応", "LiveOps QA とバグ修正", "海外チームとのライブ問題対応"], tech: ["Unity", "Mobile LiveOps", "Firebase", "Crashlytics", "Perforce"], link: "https://www.halfbrick.com", media: "https://www.youtube.com/watch?v=6PWzxNSnN20", accent: "simple" },
      { company: "111%", location: "Seoul, Korea", logo: "/companies/111percent.svg", role: "Game Client Programmer", period: "(期間入力)", impact: ["70+ の実績システムを設計・実装", "戦闘・ボス・スキン・増強システムを開発", "ライブサービス構造改善と新機能データ連携"], workAreas: ["イベント / スキン / 実績システム開発", "戦闘とボスギミックのロジック実装", "Jenkins / Git 協業パイプライン", "Redmine QA 対応とトラブルシューティング"], tech: ["Unity", "Firebase", "Jenkins", "Git", "Rapid Prototyping"], link: "https://111percent.net", media: "https://www.youtube.com/watch?v=uXJrp3pT7Yc", thumbnailZoom: 1.34, thumbnailPosition: "center 62%", accent: "hook" },
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
