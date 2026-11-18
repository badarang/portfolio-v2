import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import FounderHero from "../components/FounderHero";
import Story from "../components/Story";
import Philosophy from "../components/Philosophy";
import Professional from "../components/Professional";
import Games from "../components/Games";
import Teach from "../components/Teach";
import Activities from "../components/Activities";
import Contact from "../components/Contact";
import { scrollToSection } from "../lib/scrollToSection";

// 홈: Hero → 이야기 → 철학 → 게임 → 경력 → 멘토링 → 대외활동·뉴스 → 연락. 블로그는 상단 메뉴의 /blog 로 간다.
export default function Home() {
  const location = useLocation();

  // 다른 페이지에서 /#section 으로 돌아왔을 때 해당 섹션으로 스크롤
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        scrollToSection(id);
      }, 60);
    }
  }, [location]);

  return (
    <>
      <FounderHero />
      <Story />
      <Philosophy />
      <Games />
      <Professional />
      <Teach />
      <Activities />
      <Contact />
    </>
  );
}
