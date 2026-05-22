import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import Philosophy from "../components/Philosophy";
import Professional from "../components/Professional";
import Projects from "../components/Projects";
import Testimonials from "../components/Testimonials";
import Blog from "../components/Blog";
import Activities from "../components/Activities";
import Contact from "../components/Contact";

// 홈: 홈 → 프로젝트 → 블로그 → 대외활동 으로 이어지는 연속 스크롤.
export default function Home() {
  const location = useLocation();

  // 다른 페이지에서 /#section 으로 돌아왔을 때 해당 섹션으로 스크롤
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Philosophy />
      <Professional />
      <Projects />
      <Blog />
      <Activities />
      <Testimonials />
      <Contact />
    </>
  );
}
