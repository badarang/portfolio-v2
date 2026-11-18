import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "../i18n";
import Hero from "../components/Hero";
import Professional from "../components/Professional";
import Community from "../components/Community";
import Blog from "../components/Blog";
import Activities from "../components/Activities";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import { scrollToSection } from "../lib/scrollToSection";

function DevRelSectionNav() {
  const { content } = useI18n();
  const { ui } = content;
  const navItems = [
    { id: "career", label: ui.nav.career },
    { id: "community", label: ui.community.title },
    { id: "blog", label: ui.blog.title },
    { id: "activities", label: ui.activities.title },
    { id: "testimonials", label: ui.testimonials.title },
    { id: "contact", label: ui.nav.contact },
  ];

  return (
    <div className="sticky top-16 z-30 border-y border-line bg-ink/92 py-3 backdrop-blur">
      <div className="container-px">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="rounded-full border border-line bg-card px-4 py-2 text-xs font-bold text-muted transition hover:border-simple hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DevRel() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const id = location.hash.slice(1);
    setTimeout(() => {
      scrollToSection(id);
    }, 60);
  }, [location]);

  return (
    <>
      <Hero variant="devrel" />
      <DevRelSectionNav />
      <Professional />
      <Community />
      <Blog />
      <Activities />
      <Testimonials />
      <Contact />
    </>
  );
}
