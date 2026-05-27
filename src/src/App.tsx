import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Overview from './components/Overview';
import SuccessProfile from './components/SuccessProfile';
import Products from './components/Products';
import Roadmap from './components/Roadmap';
import Scorecard from './components/Scorecard';
import WorkingJournal from './components/WorkingJournal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      <div className="min-h-screen bg-[#06080b] pb-20 selection:bg-yellow-500/30 selection:text-yellow-200 antialiased font-sans flex flex-col">
        {/* Nền Gradient mờ ở góc trên */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-radial-[circle_800px_at_50%_-200px] from-yellow-500/[0.03] to-transparent" />

        {/* Thanh điều hướng chính thức (Interactive Smart Hub) */}
        <Navigation />

        {/* Nội dung trang */}
        <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/profile" element={<SuccessProfile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/lifecycle" element={<Roadmap />} />
            <Route path="/scorecard" element={<Scorecard />} />
            <Route path="/journal" element={<WorkingJournal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-white/[0.05] mt-20 pt-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between text-neutral-500 font-mono text-[9px] uppercase gap-4 z-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 justify-center sm:justify-start">
            <span>Công ty Cổ phần Thời Trang YODY</span>
            <span className="hidden sm:inline text-neutral-800">|</span>
            <span className="text-neutral-500 font-semibold text-yellow-500/80">CONFIDENTIAL — Internal Only</span>
          </div>
          <div>
            <span>Bản Quyền © 2026 YODY IT Digital Transformation (ITDX)</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}