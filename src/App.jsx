import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import Resume from "./pages/Resume";
import DevRel from "./pages/DevRel";

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
          <Route path="/resume-devrel" element={<Resume variant="devrel" />} />
          <Route path="/devrel" element={<DevRel />} />
        </Routes>
      </main>
    </div>
  );
}
