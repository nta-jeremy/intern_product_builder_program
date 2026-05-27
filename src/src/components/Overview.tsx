import { Target, Star, Trophy, Users, CheckCircle, ChevronRight, Milestone, LayoutGrid, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 py-6 font-sans text-fg-2 animate-fade-in" id="overview-dashboard">
      {/* Elegant Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-bg p-8 sm:p-12 shadow-brand">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-brand/[0.05] blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-brand-light/[0.03] blur-3xl"></div>

        <div className="relative z-10 space-y-6 max-w-4xl">
          {/* Micro tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag tag-build">
              YODY CAREER OPPORTUNITY
            </span>
            <span className="tag bg-bg-muted text-fg-3 border border-border-hover">
              VERSION 2.0 — COACHING LIFECYCLE
            </span>
          </div>

          {/* Heading display */}
          <h1 className="text-3xl sm:text-6xl font-impact tracking-tight text-fg-1 leading-tight">
            Chương Trình Thực Tập <br />
            <span className="big-num brand">
              Intern Product Builder
            </span>
          </h1>

          <p className="text-sm sm:text-base text-fg-2 max-w-3xl leading-relaxed">
            Tại YODY, chúng tôi nuôi dưỡng thế hệ lãnh đạo công nghệ trẻ khao khát thực chiến.
            Trách nhiệm chính của bạn là làm chủ và biến các ý tưởng đột phá thành sản phẩm live phục vụ thực tế.
            Ship nhanh, phối ứng cùng đòn bẩy AI thông thạo, và không ngừng cải tiến chính mình.
          </p>

          {/* Focus metrics row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border mt-8" id="hero-kpi-bar">
            {[
              { val: '4 Sản phẩm', desc: 'Thực tế từ số 0 tới MVP' },
              { val: '3 Tháng', desc: 'Đồng hành huấn luyện 1:1' },
              { val: 'AI-First', desc: 'Gấp 3 hiệu suất bằng công cụ' },
              { val: 'Ship Fast', desc: 'Liên lặp & bám sát nhu cầu' },
            ].map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-xl sm:text-2xl font-impact text-fg-1 block">{metric.val}</span>
                <span className="font-mono text-[10px] uppercase text-fg-3 tracking-wider block font-bold">{metric.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Objectives & Core Vision Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Objectives */}
        <div className="rounded-2xl border border-border bg-bg-warm p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand border border-brand/20">
              <Target strokeWidth={1.75} className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="font-impact text-lg text-fg-1 leading-tight">Mục Tiêu Trọng Tâm</h3>
              <span className="font-mono text-[9px] uppercase tracking-wider text-fg-3 block font-bold">Program Core Objectives</span>
            </div>
          </div>

          <p className="text-xs text-fg-2 leading-relaxed border-t border-border pt-4">
            Phát triển trọn vẹn 4 sản phẩm theo quy chuẩn kỹ thuật và tư duy kinh doanh từ ý tưởng ban đầu đến phát hành MVP trong vòng 3 tháng.
            Mỗi dự án trải qua 4 giai đoạn huấn luyện (Discover → Build → Validate → Ship) được hướng dẫn chi tiết bởi Product Owner và Tech Lead.
            Chúng tôi chú trọng vào việc nâng tầm năng lực tự quyết định, tự học sâu và ứng dụng hiệu quả các nền tảng trí tuệ nhân tạo (Claude, Cursor, n8n) của bạn.
          </p>

          {/* Quick features bullets */}
          <div className="space-y-2.5 pt-2">
            <span className="font-mono text-[10px] uppercase text-brand tracking-widest font-bold block">Sẽ được rèn giũa:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-fg-2">
              {[
                'Tư duy bài toán (Problem Thinking)',
                'Kỹ nghệ gõ phím cùng AI (Vibe Coding)',
                'Phản hồi nhanh (Feedback loops)',
                'Làm chủ mã nguồn (Product Ownership)',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-bg-muted border border-border rounded-lg p-2">
                  <CheckCircle strokeWidth={1.75} className="h-4 w-4 text-brand shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* End State Vision (Replaced with Insight Callout pattern) */}
        <div className="insight mt-0!">
          <div className="insight-label">Kết luận Tầm nhìn</div>
          <div className="insight-body">
            Mục tiêu cuối cùng là <em>biến bạn thành Builder</em> có khả năng tự chủ toàn trình. 
            Không chỉ làm chủ công cụ AI, bạn còn thấu hiểu Product Thinking và sở hữu 4 hệ thống hoạt động thực 
            mang lại giá trị trực tiếp cho YODY.
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
            <div className="space-y-2">
              <span className="s-eyebrow text-[9px]!">YODY</span>
              <ul className="space-y-1.5 text-[11px] text-fg-3">
                <li className="flex items-start">
                  <span className="text-gold mr-1 mt-0.5 shrink-0">▪</span>
                  <span className="leading-relaxed font-medium">Sở hữu 4 hệ thống thật.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-1 mt-0.5 shrink-0">▪</span>
                  <span className="leading-relaxed font-medium">Lộ trình convert fulltime.</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="s-eyebrow text-[9px]!">Người dùng</span>
              <ul className="space-y-1.5 text-[11px] text-fg-3">
                <li className="flex items-start">
                  <span className="text-gold mr-1 mt-0.5 shrink-0">▪</span>
                  <span className="leading-relaxed font-medium">HR: Tối ưu bộ ATS.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-1 mt-0.5 shrink-0">▪</span>
                  <span className="leading-relaxed font-medium">QA: Tự động rà lỗi.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Jump to Cards */}
      <div className="space-y-4 pt-4">
        <span className="s-eyebrow">
          Khám phá phân hệ
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'Tiêu Chí Cá Nhân', desc: 'Rèn năng lực hành vi cốt lõi Builder.', path: '/profile', icon: Star },
            { title: 'Chân dung 4 Sản phẩm', desc: 'Rà soát tính năng, KPI nghiệm thu.', path: '/products', icon: LayoutGrid },
            { title: 'Coaching Lifecycle', desc: 'Bản đồ 4 giai đoạn tiến trình.', path: '/lifecycle', icon: Milestone },
            { title: 'Bảng Điểm ScoreCard', desc: 'Tính điểm mô phỏng convert Fulltime.', path: '/scorecard', icon: Trophy },
            { title: 'Sổ Tay Journal', desc: 'Dọn sẵn 5 biểu mẫu viết cùng AI.', path: '/journal', icon: FileText },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(card.path)}
                className="group flex flex-col justify-between items-start text-left bg-bg border border-border rounded-xl p-4 transition-all duration-300 hover:bg-bg-muted hover:border-brand/40 hover:shadow-sm text-xs text-fg-2 cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-brand/5 text-brand mb-3 border border-brand/10 transition-colors group-hover:bg-brand/10">
                  <Icon strokeWidth={1.75} className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-impact text-fg-1 block group-hover:text-brand transition-colors">
                    {card.title}
                  </span>
                  <p className="text-[11px] text-fg-3 leading-snug font-medium">
                    {card.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vibe Quote */}
      <div className="text-center py-6 border-t border-border mt-10">
        <p className="font-mono text-fg-3 tracking-wider text-[11px] uppercase leading-relaxed font-bold">
          "The best way to predict the future is to build it."
        </p>
        <span className="font-sans text-[11px] text-brand block mt-1.5 font-bold tracking-widest">
          3 THÁNG — 4 SẢN PHẨM — 1 MINDSET THAY ĐỔI CẢ SỰ NGHIỆP CỦA BẠN.
        </span>
      </div>
    </div>
  );
}