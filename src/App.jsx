import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NeurologyHome from "./pages/NeurologyHome";
import About from "./pages/About";
import Doctor from "./pages/Doctor";
import Course from "./pages/Course";
import CourseDetail from "./pages/CourseDetail";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Sitemap from "./pages/Sitemap";
import RefundPolicy from "./pages/RefundPolicy";
import NotFound from "./pages/NotFound";

// New page = start at the top (e.g. after clicking a footer link). Skipped for #hash links
// such as /courses/:slug#enroll, which scroll to their own section. Query-only changes
// (/courses?type=...) keep the pathname, so they don't jump.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <ScrollToTop />
      <Navbar />
      {/* flex-1 pushes the footer to the bottom on short pages */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<NeurologyHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
