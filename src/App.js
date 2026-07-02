import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import OurWorks from './pages/OurWorks';
import ContactUs from './pages/ContactUs';
import Philosophy from './pages/Philosophy';
import Process from './pages/Process';

// ScrollToTop helper to ensure scrolling to top on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    // If there's a hash, let the browser scroll to the element natively or via our custom logic.
    // If no hash, scroll to top.
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-works" element={<OurWorks />} />
          <Route path="/philosophy" element={<Philosophy />} />
          <Route path="/process" element={<Process />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
