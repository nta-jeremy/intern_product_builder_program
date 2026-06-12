import { Target, Star, Trophy, Users, CheckCircle, ChevronRight, Milestone, LayoutGrid, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const navigate = useNavigate();

  return (
    <div className="py-6 font-sans text-fg-2 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-12)' }} id="overview-dashboard">
      {/* Elegant Hero Banner */}
      <div className="relative overflow-hidden border border-border bg-bg p-8 sm:p-12" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-brand)' }}>
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-brand/[0.05] blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-brand-light/[0.03] blur-3xl"></div>

        <div className="relative z-10 max-w-4xl" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
          {/* Micro tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag tag-build">
              CƠ HỘI PHÁT TRIỂN TẠI YODY
            </span>
            <span className="tag bg-bg-muted text-fg-3 border border-border-hover">
              PHIÊN BẢN 2.0 — VÒNG LẶP PHÁT TRIỂN
            </span>
          </div>

          {/* Heading display — using YDS type-h1 token */}
          <h1 className="text-fg-1" style={{ font: 'var(--type-h1)', letterSpacing: '-0.022em' }}>
            Chương Trình Thực Tập <br />
            <span className="big-num brand">
              Intern Product Builder
            </span>
          </h1>

          <p style={{ font: 'var(--type-body-sm)', color: 'var(--fg-2)', maxWidth: '720px' }}>
            Trong ba tháng, mỗi thực tập sinh đảm nhận một trong bốn sản phẩm theo phân công của chương trình.
            Bạn sẽ tìm hiểu bài toán, xây dựng sản phẩm mẫu, kiểm chứng với người dùng và cải tiến dựa trên bằng chứng.
            AI hỗ trợ tăng tốc, nhưng bạn chịu trách nhiệm kiểm tra và giải thích kết quả.
          </p>

          {/* Focus metrics row — using YDS numeric type tokens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border mt-8" id="hero-kpi-bar">
            {[
              { val: '4 Sản phẩm', desc: 'Bốn lựa chọn để phân công' },
              { val: '3 Tháng', desc: 'Đồng hành phát triển' },
              { val: 'AI', desc: 'Gấp đôi hiệu suất bằng công cụ' },
              { val: 'Đưa vào sử dụng nhanh', desc: 'Tốc độ gắn với nhu cầu' },
            ].map((metric, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-1)' }}>
                <span className="text-fg-1 block" style={{ font: 'var(--type-num)', letterSpacing: '-0.02em' }}>{metric.val}</span>
                <span className="font-mono text-[10px] uppercase text-fg-3 tracking-wider block font-bold">{metric.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Objectives & Core Vision Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Objectives */}
        <div className="yds-card-warm p-6 sm:p-8" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center bg-brand/10 text-brand border border-brand/20" style={{ borderRadius: 'var(--radius-sm)' }}>
              <Target strokeWidth={1.75} className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-fg-1 leading-tight" style={{ font: 'var(--type-h3)' }}>Mục Tiêu Trọng Tâm</h3>
              <span className="font-mono text-[9px] uppercase tracking-wider text-fg-3 block font-bold">MỤC TIÊU CHƯƠNG TRÌNH</span>
            </div>
          </div>

          <p className="text-fg-2 leading-relaxed border-t border-border pt-4" style={{ font: 'var(--type-body-sm)', fontSize: '13px' }}>
            Phát triển một sản phẩm được phân công từ ý tưởng ban đầu đến MVP trong vòng ba tháng.
            Mỗi tháng đều đi qua năm bước Tìm hiểu → Xây dựng → Kiểm chứng → Đưa vào sử dụng → Rút kinh nghiệm để tăng dần mức tự chủ và chất lượng bằng chứng.
            Chương trình chú trọng khả năng ra quyết định, tự học và sử dụng hiệu quả các công cụ AI như Claude, Cursor và n8n.
          </p>

          {/* Quick features bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)', paddingTop: 'var(--s-2)' }}>
            <span className="font-mono text-[10px] uppercase text-brand tracking-widest font-bold block">Năng lực được rèn luyện:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-fg-2">
              {[
                'Hiểu người dùng và bài toán',
                'Thực thi cùng AI có kiểm chứng',
                'Cải tiến dựa trên phản hồi',
                'Chủ động với sản phẩm được giao',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-bg-muted border border-border p-2" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle strokeWidth={1.75} className="h-4 w-4 text-brand shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* End State Vision (Insight Callout pattern) */}
        <div className="insight mt-0!">
          <div className="insight-label">Kết quả hướng tới</div>
          <div className="insight-body">
            Mục tiêu cuối cùng là <em>giúp bạn trở thành người xây dựng sản phẩm</em> có khả năng tự chủ trong phạm vi được giao.
            Bạn biết dùng AI có trách nhiệm, hiểu bài toán và tạo ra sản phẩm mẫu có giá trị cho người dùng tại YODY.
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              <span className="s-eyebrow text-[9px]!">YODY</span>
              <ul className="space-y-1.5 text-[11px] text-fg-3">
                <li className="flex items-start">
                  <span className="text-gold mr-1 mt-0.5 shrink-0">▪</span>
                  <span className="leading-relaxed font-medium">Có sản phẩm mẫu giải quyết bài toán thực tế.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-1 mt-0.5 shrink-0">▪</span>
                  <span className="leading-relaxed font-medium">Lộ trình phát triển rõ ràng.</span>
                </li>
              </ul>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              <span className="s-eyebrow text-[9px]!">Người dùng</span>
              <ul className="space-y-1.5 text-[11px] text-fg-3">
                <li className="flex items-start">
                  <span className="text-gold mr-1 mt-0.5 shrink-0">▪</span>
                  <span className="leading-relaxed font-medium">HR: Hệ thống ATS.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-1 mt-0.5 shrink-0">▪</span>
                  <span className="leading-relaxed font-medium">QA: Hệ thống kiểm soát chất lượng tự động.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Jump to Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)', paddingTop: 'var(--s-4)' }}>
        <span className="s-eyebrow">
          Khám phá phân hệ
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'Tiêu chí cá nhân', desc: 'Hiểu năm năng lực cốt lõi.', path: '/profile', icon: Star },
            { title: 'Danh mục sản phẩm', desc: 'Xem bốn lựa chọn sản phẩm được phân công.', path: '/products', icon: LayoutGrid },
            { title: 'Vòng lặp phát triển', desc: 'Theo dõi lộ trình ba tháng.', path: '/lifecycle', icon: Milestone },
            { title: 'Bảng đánh giá', desc: 'Đối chiếu năng lực với bằng chứng.', path: '/scorecard', icon: Trophy },
            { title: 'Sổ tay thực tập', desc: 'Ghi bằng chứng bằng năm biểu mẫu.', path: '/journal', icon: FileText },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(card.path)}
                className="group flex flex-col justify-between items-start text-left bg-bg border border-border p-4 transition-all hover:bg-bg-muted hover:border-brand/40 text-xs text-fg-2 cursor-pointer"
                style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-rest)', transitionDuration: 'var(--dur-slow)' }}
              >
                <div className="flex h-8 w-8 items-center justify-center bg-brand/5 text-brand mb-3 border border-brand/10 transition-colors group-hover:bg-brand/10" style={{ borderRadius: 'var(--radius-sm)' }}>
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
          "Cách tốt nhất để dự đoán tương lai là cùng xây dựng nó."
        </p>
        <span className="font-sans text-[11px] text-brand block mt-1.5 font-bold tracking-widest">
          3 THÁNG — 1 SẢN PHẨM ĐƯỢC PHÂN CÔNG — PHÁT TRIỂN QUA TỪNG VÒNG.
        </span>
      </div>
    </div>
  );
}
