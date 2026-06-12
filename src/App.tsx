import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Navigation from './components/Navigation';
import Overview from './components/Overview';
import SuccessProfile from './components/SuccessProfile';
import Products from './components/Products';
import CoachingLifecycle from './components/CoachingLifecycle';
import CoachingLifecycleDetail from './components/CoachingLifecycleDetail';
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
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <ScrollToTop />
        
        <div className="min-h-screen bg-bg text-fg-1 pb-20 selection:bg-brand-tint selection:text-brand antialiased font-sans flex flex-col transition-colors duration-300">
          {/* Ambient gradient — 1 per page (motion-budget: ambient) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-radial-[circle_800px_at_50%_-200px] from-brand/[0.03] to-transparent" />

        {/* Thanh điều hướng chính thức */}
        <Navigation />

        {/* Nội dung trang — container-max from DS portal surface */}
        <main className="flex-grow mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8" style={{ maxWidth: 'var(--container-max)' }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/profile" element={<SuccessProfile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/lifecycle" element={<CoachingLifecycle />} />
            <Route path="/lifecycle-detail" element={<CoachingLifecycleDetail />} />
            <Route path="/lifecycle-concept-c" element={<Navigate to="/lifecycle" replace />} />
            <Route path="/scorecard" element={<Scorecard />} />
            <Route path="/journal" element={<WorkingJournal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer — DS eyebrow + mono pattern */}
        <footer className="mx-auto w-full px-4 sm:px-6 lg:px-8 border-t border-border mt-20 pt-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between text-fg-3 font-mono text-[10px] uppercase gap-4 z-10 relative" style={{ maxWidth: 'var(--container-max)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 justify-center sm:justify-start">
            <span style={{ letterSpacing: '0.08em' }}>Công ty Cổ phần Thời Trang YODY</span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span className="text-brand font-semibold" style={{ letterSpacing: '0.12em' }}>BẢO MẬT — CHỈ DÙNG NỘI BỘ</span>
          </div>
          <div>
            <span style={{ letterSpacing: '0.08em' }}>Bản quyền © 2026 YODY ITDX</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}
