// 실무 경력 — 회사당 4블록 고정 구조:
//   headline  : 한 줄 요약 (가장 중요)
//   impact    : 🏆 Key Impact (핵심 성과 2~3개)
//   workAreas : ⚙️ Work Areas (주요 시스템/업무 4~6개)
//   tech      : 🧠 Tech (사용 기술, 짧게)
// media: YouTube URL / .mp4 / 이미지 경로. logo: public/companies/ 경로(없으면 워드마크).
// accent: "hook"(핑크) | "simple"(시안) | "juicy"(라임)
export const professional = [
  {
    company: "Halfbrick Studios",
    location: "Brisbane, Australia",
    logo: "/companies/halfbrick.jpg",
    role: "Gameplay Programmer",
    period: "(기간 입력)",
    impact: [
      "Jetpack Joyride Racing(JJR) 기능 개발 및 런칭 참여",
      "Halfbrick+ HubApp 기능 개발",
      "SDK 유지보수 및 라이브 안정화",
    ],
    workAreas: [
      "Crashlytics 기반 크래시 분석",
      "딥링크 / CTA 모바일 이슈 대응",
      "LiveOps QA 및 버그 수정",
      "해외 팀과 라이브 이슈 대응",
    ],
    tech: ["Unity", "Mobile LiveOps", "Firebase", "Crashlytics", "Perforce"],
    link: "https://www.halfbrick.com",
    media: "https://www.youtube.com/watch?v=6PWzxNSnN20",
    accent: "simple",
  },
  {
    company: "111%",
    location: "Seoul, Korea",
    logo: "/companies/111percent.svg",
    role: "Game Client Programmer",
    period: "(기간 입력)",
    impact: [
      "도전과제 70+ 시스템 설계/구현",
      "전투 · 보스 · 스킨 · 증강체 시스템 개발",
      "라이브 서비스 구조 개선 및 신규 기능 데이터 연동",
    ],
    workAreas: [
      "이벤트 / 스킨 / 도전과제 시스템 개발",
      "전투 및 보스 기믹 로직 구현",
      "Jenkins / Git 협업 파이프라인",
      "Redmine QA 대응 및 트러블슈팅",
    ],
    tech: ["Unity", "Firebase", "Jenkins", "Git", "Rapid Prototyping"],
    link: "https://111percent.net",
    media: "https://www.youtube.com/watch?v=uXJrp3pT7Yc",
    thumbnailZoom: 1.34,
    thumbnailPosition: "center 62%",
    accent: "hook",
  },
];
