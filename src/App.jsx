import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import Resume from "./pages/Resume";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-ink">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/resume" element={<Resume />} />
          {/* 예전 DevRel 페이지는 홈의 Teach & Share 섹션으로 합쳤다. 옛 주소는 홈으로 보낸다. */}
          <Route path="/devrel" element={<Navigate to="/#teach" replace />} />
        </Routes>
      </main>
    </div>
  );
}
