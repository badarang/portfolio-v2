// Self-branding / 게임 가치관. 한 곳에서 관리하는 카피.
export const profile = {
  name: "Haein Oh",
  realName: "Haein Oh",
  role: "Rapid Gameplay Programmer",
  tagline: "Make It Fun, Make It Fast, Make It Juicy",
  // 메인 슬로건(개발 철학)
  slogan: ["Fun", "Fast", "Juicy"],
  links: {
    linkedin: "https://kr.linkedin.com/in/haein-oh-979b29304/en",
    github: "https://github.com/badarang",
    emailAddress: "badarangdev@gmail.com",
    email: "mailto:badarangdev@gmail.com",
  },
  intro:
    "A game developer focused on rapid prototyping, live service iteration, and player-first design. I enjoy building tools, systems, and gameplay that help teams move faster and make games more fun.",
};

// "Hook, Simple, Juicy" 세 기둥
// media: public/philosophy/ 에 넣은 GIF 또는 무음 자동재생 MP4 경로.
//   - .gif → <img>, .mp4 → <video muted autoplay loop playsinline>
//   - 파일이 없으면 자리표시자가 표시됩니다.
// textSide: 글이 놓이는 쪽 ("left" | "right"), 미디어는 반대쪽 여백에 그라데이션으로.
export const philosophy = [
  {
    key: "Hook",
    accent: "hook",
    title: "Hook",
    kr: "플레이어를 단번에 사로잡는 첫 순간",
    desc: "처음 마주하는 장면과 조작에서 곧바로 몰입이 시작되도록,<br>명확한 목표와 강한 첫 인상을 설계합니다.",
    media: "/philosophy/Hook.mp4",
    textSide: "left",
  },
  {
    key: "Simple",
    accent: "simple",
    title: "Simple",
    kr: "복잡함을 덜고, 핵심 재미만 남게",
    desc: "Easy to Learn, Hard to Master.<br>쉽게 시작하고, 파고들수록 깊어지는 재미를 만듭니다.",
    media: "/philosophy/Simple.mp4",
    textSide: "right",
  },
  {
    key: "Juicy",
    accent: "juicy",
    title: "Juicy",
    kr: "플레이어의 경험을 풍족하게 만드는 Skill",
    desc: "같은 행동도 더 신나게, 더 짜릿하게.<br>이펙트·사운드·연출로 입력마다 살아 있는 피드백을 더합니다.",
    media: "/philosophy/Juicy.mp4",
    textSide: "left",
  },
];

// 나를 한 줄로 설명하는 강점들
export const strengths = [
  {
    stat: "14년+",
    title: "인디 개발 경력",
    desc: "개인 프로젝트 제작과 출시 경험",
  },
  {
    stat: "Unity",
    title: "클라이언트 개발",
    desc: "게임플레이, UI, 데이터 연동, 콘텐츠 시스템",
  },
  {
    stat: "FX",
    title: "그래픽 폴리싱",
    desc: "Post Processing, 간단한 쉐이더 작성",
  },
  {
    stat: "Crash",
    title: "크래시 대응",
    desc: "Android Logcat, Firebase Crashlytics 기반 분석",
  },
  {
    stat: "Optimization",
    title: "최적화",
    desc: "Profiler 기반 병목 분석과 GC Spike 핸들링",
  },
  {
    stat: "Tools",
    title: "인하우스 툴 개발",
    desc: "React / Electron 기반 협업 툴 개발",
  },
  {
    stat: "AI",
    title: "AI 활용",
    desc: "코드 작성, 프로토타이핑, 자동화, 생산성 개선",
  },
];

export const techGroups = [
  {
    title: "엔진 / 언어",
    items: [
      { name: "Unity", icon: "https://cdn.simpleicons.org/unity/ffffff" },
      {
        name: "Unreal",
        icon: "https://cdn.simpleicons.org/unrealengine/ffffff",
      },
      {
        name: "GameMaker",
        icon: "https://cdn.simpleicons.org/gamemaker/00A4A6",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
      },
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
      {
        name: "GitHub Actions",
        icon: "https://cdn.simpleicons.org/githubactions/2088FF",
      },
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
      {
        name: "Firebase Analytics",
        icon: "https://cdn.simpleicons.org/firebase/FFCA28",
      },
      { name: "Crashlytics", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
      { name: "Android Logcat", icon: "https://cdn.simpleicons.org/android/3DDC84" },
      { name: "Unity Profiler", icon: "https://cdn.simpleicons.org/unity/ffffff" },
    ],
  },
];

// 추천서
export const testimonials = [
  {
    subject: "Professional Reference for Haein Oh",
    name: "Jason Turnbull",
    role: "Head of People and Culture",
    company: "Halfbrick",
    linkedin:
      "https://www.linkedin.com/in/haein-oh-979b29304/overlay/1779425940176/single-media-viewer/?profileId=ACoAAE3D6C0Bx6ZxWuLnEdH0Gf6wz1bF-NQrzXY",
    highlight:
      "Haein is a capable gameplay programmer with real strengths in live-service environments, mobile production troubleshooting, and cross-team collaboration.",
    points: [
      "JJR soft launch · global launch 기여",
      "Crashlytics, QA, dogfooding 기반 라이브 서비스 대응",
      "해외 팀과의 협업에서 명확한 소통과 높은 오너십",
    ],
    paragraphs: [
      "I'm pleased to provide this reference for Haein Oh, who worked with us at Halfbrick as a Gameplay Programmer, contributing to Jetpack Joyride Racing (JJR) and the broader Halfbrick+ HubApp ecosystem.",
      "During his time at Halfbrick, Haein contributed to both the soft launch and the global launch of JJR, a significant period in the project's development. He worked across the full live-service cycle, supporting QA, Crashlytics bug fixing, dogfooding sessions, and the day-to-day maintenance work that keeps a live mobile product stable and improving.",
      "Beyond core JJR work, Haein contributed across the wider Halfbrick+ HubApp ecosystem features, working on elements that connected the broader Halfbrick+ experience together. This breadth gave him exposure to both individual product development and platform-level thinking, and he handled the context-switching between them well.",
      "Haein showed strong troubleshooting capability, particularly on mobile-specific production issues such as deep linking and CTA-related problems. These are the kinds of issues that often sit at the intersection of platform behaviour, third-party integrations, and product code, and require patience and methodical thinking to resolve.",
      "Working in a distributed, international team environment, Haein collaborated effectively across time zones and contributed to team discussions thoughtfully. He communicated clearly, asked good questions, and was willing to dig into unfamiliar areas when the team needed it.",
      "I'd recommend him for gameplay programming roles, particularly on live-service mobile products and on distributed teams where adaptability and ownership matter.",
    ],
  },
];
