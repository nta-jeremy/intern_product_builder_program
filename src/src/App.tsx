import React, { useState } from 'react';
import Navigation from './components/Navigation';
import SuccessProfile from './components/SuccessProfile';
import Products from './components/Products';
import Roadmap from './components/Roadmap';
import Scorecard from './components/Scorecard';
import WorkingJournal from './components/WorkingJournal';
import { Target, Star, Trophy, Users, CheckCircle, ChevronRight, Milestone, LayoutGrid, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-[#06080b] pb-20 selection:bg-yellow-500/30 selection:text-yellow-200">
      {/* Dynamic Background subtle grid light accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-radial-[circle_800px_at_50%_-200px] from-yellow-500/[0.03] to-transparent" />

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Render Tab views */}
        {activeTab === 'overview' && (
          <div className="space-y-12 py-6 font-sans text-neutral-300 animate-fade-in" id="overview-dashboard">
            {/* Elegant Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-neutral-950 p-8 sm:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-yellow-500/[0.03] blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-9w w-96 rounded-full bg-yellow-500/[0.01] blur-3xl"></div>

              <div className="relative z-10 space-y-6 max-w-4xl">
                {/* Micro tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-1 text-xs font-mono font-medium text-yellow-500 tracking-wider">
                    YODY CAREER OPPORTUNITY
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-neutral-900 px-3 py-1 text-[10px] font-mono text-neutral-400">
                    VERSION 2.0 — COACHING LIFECYCLE
                  </span>
                </div>

                {/* Heading display */}
                <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Chương Trình Thực Tập <br />
                  <span className="text-gradient bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Intern Product Builder
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-neutral-400 max-w-3xl leading-relaxed">
                  Tại YODY, chúng tôi nuôi dưỡng thế hệ lãnh đạo công nghệ trẻ khao khát thực chiến. 
                  Trách nhiệm chính của bạn là làm chủ và biến các ý tưởng đột phá thành sản phẩm live phục vụ thực tế. 
                  Ship nhanh, phối ứng cùng đòn bẩy AI thông thạo, và không ngừng cải tiến chính mình.
                </p>

                {/* Focus metrics row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/[0.06] mt-8" id="hero-kpi-bar">
                  {[
                    { val: '4 Sản phẩm', desc: 'Thực tế từ số 0 tới MVP' },
                    { val: '3 Tháng', desc: 'Đồng hành huấn luyện 1:1' },
                    { val: 'AI-First', desc: 'Gấp 3 hiệu suất bằng công cụ' },
                    { val: 'Ship Fast', desc: 'Liên lặp & bám sát nhu cầu' },
                  ].map((metric, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-xl sm:text-2xl font-extrabold text-white block">{metric.val}</span>
                      <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider block">{metric.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Program Objectives & Core Vision Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Objectives */}
              <div className="rounded-2xl border border-white/[0.08] bg-neutral-950 p-6 sm:p-8 space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <Target className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-white leading-tight">Mục Tiêu Trọng Tâm</h3>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block">Program Core Objectives</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed border-t border-white/[0.04] pt-4">
                  Phát triển trọn vẹn 4 sản phẩm theo quy chuẩn kỹ thuật và tư duy kinh doanh từ ý tưởng ban đầu đến phát hành MVP trong vòng 3 tháng. 
                  Mỗi dự án trải qua 4 giai đoạn huấn luyện (Discover → Build → Validate → Ship) được hướng dẫn chi tiết bởi Product Owner và Tech Lead. 
                  Chúng tôi chú trọng vào việc nâng tầm năng lực tự quyết định, tự học sâu và ứng dụng hiệu quả các nền tảng trí tuệ nhân tạo (Claude, Cursor, n8n) của bạn.
                </p>

                {/* Quick features bullets */}
                <div className="space-y-2.5 pt-2">
                  <span className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest font-semibold block">Sẽ được rèn giũa:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                    {[
                      'Tư duy bài toán (Problem Thinking)',
                      'Kỹ nghệ gõ phím cùng AI (Vibe Coding)',
                      'Phản hồi nhanh (Feedback loops)',
                      'Làm chủ mã nguồn (Product Ownership)',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 bg-neutral-900 border border-white/[0.03] rounded-lg p-2">
                        <CheckCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* End State Vision (Perspective matching document) */}
              <div className="rounded-2xl border border-white/[0.08] bg-neutral-950 p-6 sm:p-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <Trophy className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-white leading-tight">Tầm Nhìn Cuối Kỳ</h3>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block">End State Vision</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/[0.04] pt-4">
                  {[
                    {
                      role: 'PHÍA INTERN',
                      list: [
                        'Làm chủ công cụ AI để sinh mã nhanh.',
                        'Thấu hiểu chân dung Product Thinking.',
                        'Sở hữu Portfolio 4 sản phẩm thật.'
                      ]
                    },
                    {
                      role: 'PHÍA YODY',
                      list: [
                        'Sở hữu 4 hệ thống hoạt động thực.',
                        'Mở rộng nguồn nhân sự Builder thế hệ mới.',
                        'Lộ trình convert rõ ràng.'
                      ]
                    },
                    {
                      role: 'NGƯỜI DÙNG CUỐI',
                      list: [
                        'HR sở hữu bộ ATS tối ưu hóa tuyển dụng.',
                        'QA tự động hóa rà lỗi website tức thời.',
                        'Ban thẩm định biểu mẫu an tâm tự động.'
                      ]
                    }
                  ].map((col, idx) => (
                    <div key={idx} className="space-y-2" id={`end-state-col-${idx}`}>
                      <span className="font-mono text-[10px] uppercase text-yellow-500 tracking-wider font-bold block">{col.role}</span>
                      <ul className="space-y-1.5 text-[11px] text-neutral-400">
                        {col.list.map((it, liIdx) => (
                          <li key={liIdx} className="flex items-start">
                            <span className="text-yellow-500 mr-1 mt-0.5 shrink-0">▪</span>
                            <span className="leading-relaxed">{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Navigation Jump to Cards */}
            <div className="space-y-4 pt-4">
              <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-widest font-bold block">
                BẮT ĐẦU KHÁM PHÁ CÁC PHÂN HỆ PORTAL
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { title: 'Tiêu Chí Cá Nhân', desc: 'Rèn năng lực hành vi cốt lõi Builder.', tab: 'profile', icon: Star },
                  { title: 'Chân dung 4 Sản phẩm', desc: 'Rà soát tính năng, KPI nghiệm thu.', tab: 'products', icon: LayoutGrid },
                  { title: 'Coaching Lifecycle', desc: 'Bản đồ 4 giai đoạn tiến trình.', tab: 'lifecycle', icon: Milestone },
                  { title: 'Bảng Điểm ScoreCard', desc: 'Tính điểm mô phỏng convert Fulltime.', tab: 'scorecard', icon: Trophy },
                  { title: 'Sổ Tay Journal', desc: 'Dọn sẵn 5 biểu mẫu viết cùng AI.', tab: 'journal', icon: FileText },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(card.tab)}
                      className="group flex flex-col justify-between items-start text-left bg-neutral-950 border border-white/[0.04] rounded-xl p-4 transition-all duration-300 hover:bg-neutral-900/80 hover:border-yellow-500/30 text-xs text-neutral-400 cursor-pointer"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-yellow-500/10 text-yellow-500 mb-3 border border-yellow-500/20">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-sans font-bold text-white block group-hover:text-yellow-400 transition-colors">
                          {card.title}
                        </span>
                        <p className="text-[11px] text-neutral-500 leading-snug">
                          {card.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vibe Quote */}
            <div className="text-center py-6 border-t border-white/[0.06] mt-10">
              <p className="font-mono text-neutral-500 tracking-wider text-xs uppercase leading-relaxed">
                "The best way to predict the future is to build it."
              </p>
              <span className="font-sans text-xs font-bold text-yellow-500/80 block mt-1.5 font-semibold">
                3 THÁNG — 4 SẢN PHẨM — 1 MINDSET THAY ĐỔI CẢ SỰ NGHIỆP CỦA BẠN.
              </span>
            </div>
          </div>
        )}

        {activeTab === 'profile' && <SuccessProfile />}
        {activeTab === 'products' && <Products />}
        {activeTab === 'lifecycle' && <Roadmap />}
        {activeTab === 'scorecard' && <Scorecard />}
        {activeTab === 'journal' && <WorkingJournal />}
      </main>

      {/* Footer copyright */}
      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] mt-20 pt-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between text-neutral-500 font-mono text-[10px] uppercase gap-4 z-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
          <span>Công ty Cổ phần Thời Trang YODY</span>
          <span className="hidden sm:inline text-neutral-800">|</span>
          <span className="text-neutral-500 font-semibold text-yellow-500/80">CONFIDENTIAL — Internal Only</span>
        </div>
        <div>
          <span>Bản Quyền © 2026 YODY IT Digital Transformation (ITDX)</span>
        </div>
      </footer>
    </div>
  );
}
