import React, { useState } from 'react';
import { SUCCESS_PROFILE_DATA } from '../data';
import { CheckCircle2, XCircle, Award, Star, Info, HelpCircle } from 'lucide-react';

export default function SuccessProfile() {
  const [selectedProfile, setSelectedProfile] = useState<string>(SUCCESS_PROFILE_DATA[0].key);
  const [selfScore, setSelfScore] = useState<Record<string, number>>({
    'builder-mindset': 3,
    'ai-first': 3,
    'business-thinking': 3,
    'learning-agility': 3,
    'ownership': 3,
  });

  const currentItem = SUCCESS_PROFILE_DATA.find((item) => item.key === selectedProfile) || SUCCESS_PROFILE_DATA[0];

  const handleScoreChange = (key: string, value: number) => {
    setSelfScore((prev) => ({ ...prev, [key]: value }));
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 1:
        return { text: 'Chưa Đạt', color: 'text-gap bg-gap/10 border-gap/20' };
      case 2:
        return { text: 'Nhận Thức Được', color: 'text-gold-deep bg-gold/10 border-gold/20' };
      case 3:
        return { text: 'Đáp Ứng Đạt', color: 'text-iris-deep bg-iris/10 border-iris/20' };
      case 4:
        return { text: 'Xuất Sắc (Thường xuyên)', color: 'text-brand bg-brand/10 border-brand/20' };
      case 5:
        return { text: 'Hình Mẫu (Coach được)', color: 'text-mint-deep bg-mint/10 border-mint/20' };
      default:
        return { text: 'Mơ hồ', color: 'text-fg-3 bg-bg-muted border-border' };
    }
  };

  // Average self-score
  const scoreKeys = Object.keys(selfScore);
  const avgScore = scoreKeys.reduce((sum, k) => sum + selfScore[k], 0) / scoreKeys.length;

  return (
    <div className="py-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-10)' }} id="success-profile-container">
      {/* Introduction Header Banner */}
      <div className="relative overflow-hidden border border-border bg-bg-warm p-6 sm:p-8" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-rest)' }}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand/5 blur-3xl"></div>
        <div className="relative z-10 max-w-3xl" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
          <div className="s-eyebrow">
            <Star className="h-4 w-4 mr-1" strokeWidth={1.75} />
            INTERN SUCCESS PROFILE
          </div>
          <h2 className="text-fg-1 leading-tight" style={{ font: 'var(--type-h2)', letterSpacing: '-0.018em' }}>
            Chúng tôi không chỉ đánh giá sản phẩm ban đầu — Chúng tôi rèn giũa cách bạn tư duy.
          </h2>
          <p style={{ font: 'var(--type-body-sm)', color: 'var(--fg-2)', lineHeight: '1.7' }}>
            Đây là hệ 5 tiêu chí năng lực hành vi cốt lõi để đánh giá độ chín chắn của một **YODY Product Builder**. 
            Nó đo lường cách bạn tự học, thấu cảm bài toán kinh tế, chủ động tìm lời giải và cộng tác song hành cùng AI trong kỷ nguyên mới. 
            Đạt chuẩn bộ tiêu chí này là chìa khóa vàng để bạn được chuyển đổi trực tiếp sang nhân sự chính thức (Full-Time conversion) sau 3 tháng thực tập.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Interactive Selector & Self Assessment */}
        <div className="lg:col-span-4 space-y-6">
          <div className="yds-card-warm p-5" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
            <span className="font-mono text-xs uppercase text-fg-3 tracking-wider block font-semibold border-b border-border pb-2">
              BỘ 5 TIÊU CHÍ CỐT LÕI
            </span>
            <div className="flex flex-col space-y-2">
              {SUCCESS_PROFILE_DATA.map((item) => {
                const isSelected = item.key === selectedProfile;
                return (
                  <button
                    key={item.key}
                    id={`profile-selector-${item.key}`}
                    onClick={() => setSelectedProfile(item.key)}
                    className={`flex items-start text-left p-3 transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-brand/5 border-brand/30 text-fg-1'
                        : 'border-transparent text-fg-3 hover:bg-bg-muted hover:text-fg-2'
                    }`}
                    style={{ borderRadius: 'var(--radius-sm)', transitionDuration: 'var(--dur)', boxShadow: isSelected ? 'var(--shadow-rest)' : 'none' }}
                  >
                    <div className={`mr-3 mt-1.5 flex h-2 w-2 rounded-full shrink-0 ${isSelected ? 'bg-brand shadow-glow' : 'bg-border-hover'}`} />
                    <div>
                      <div className="font-sans text-xs font-bold tracking-wide">{item.dimension}</div>
                      <div className="font-sans text-[11px] text-fg-3 line-clamp-1 mt-0.5">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Self-Assessment Simulator */}
          <div className="yds-card-warm p-5" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-xs uppercase text-fg-3 tracking-wider block font-semibold">
                TỰ ĐÁNH GIÁ NHANH
              </span>
              <div className="font-mono text-[10px] text-brand border border-brand/20 font-bold" style={{ borderRadius: 'var(--radius-pill)', background: 'color-mix(in srgb, var(--brand) 10%, transparent)', padding: '2px 8px' }}>
                Avg: {avgScore.toFixed(1)}/5
              </div>
            </div>
            
            <p className="font-sans text-[11px] text-fg-3 leading-snug">
              Kéo thanh trượt để tự chấm điểm năng lực hành vi của bạn cho từng khía cạnh thực tập sinh.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
              {SUCCESS_PROFILE_DATA.map((item) => {
                const score = selfScore[item.key] || 3;
                const activeLabel = getScoreLabel(score);
                return (
                  <div key={item.key} className="space-y-1.5" id={`self-assess-${item.key}`}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-sans font-medium text-fg-2">{item.dimension}</span>
                      <span className={`px-1.5 py-0.5 text-[9px] border font-mono font-bold ${activeLabel.color}`} style={{ borderRadius: 'var(--radius-xs)' }}>
                        {activeLabel.text}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={score}
                      onChange={(e) => handleScoreChange(item.key, parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>

            <div className="bg-bg-muted border border-border p-3 text-[11px] text-fg-3 space-y-1.5" style={{ borderRadius: 'var(--radius-sm)' }}>
              <span className="font-sans font-bold text-fg-1 block">Kết quả mô phỏng:</span>
              {avgScore >= 4.0 ? (
                <p className="text-mint font-medium text-xs">
                  ★ **HÌNH MẪU SÁNG GIÁ**: Bạn đang thể hiện năng khiếu vượt trội của một Product Builder thứ thiệt! Cơ hội chuyển đổi Full-Time rộng mở.
                </p>
              ) : avgScore >= 3.0 ? (
                <p className="text-iris font-medium text-xs">
                  ▲ **KHẢ QUAN**: Bạn đáp ứng vừa vặn các kỳ vọng cơ bản của YODY. Hãy tập trung cải tiến các hành vi tốt hơn nữa.
                </p>
              ) : (
                <p className="text-gap font-medium text-xs">
                  ⚠ **CẦN NỖ LỰC**: Bạn cần trao đổi sâu hơn với Mentor để khắc phục ngay các "biểu hiện chưa đạt" nhằm bảo vệ kết quả thực tập.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Selection Tab Content with Details */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="yds-card-warm p-6 sm:p-8 flex-1 min-h-[450px]" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
            {/* Aspect Title & Subheader */}
            <div className="border-b border-border pb-5" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center bg-brand/10 text-brand border border-brand/20" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <Award className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-fg-1 tracking-tight" style={{ font: 'var(--type-h3)' }}>{currentItem.dimension}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-fg-3 font-bold">Khía cạnh đánh giá cốt lõi</p>
                </div>
              </div>
              <p className="font-sans text-sm text-fg-2 italic pl-1 leading-relaxed">
                "{currentItem.description}"
              </p>
            </div>

            {/* Grid for Good Behaviors vs Bad Behaviors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* GOOD SECTION */}
              <div className="border border-mint/20 bg-mint/5 p-4 sm:p-5" style={{ borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
                <div className="flex items-center space-x-2 text-mint font-sans text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                  <span>BIỂU HIỆN ĐƯỢC ĐÁNH GIÁ CAO ★</span>
                </div>
                <div className="text-[11px] text-fg-3 font-mono font-bold">
                  Sẵn sàng conversion thành nhân sự Full-Time nếu bạn thường xuyên:
                </div>
                <ul className="space-y-3">
                  {currentItem.goodBehaviors.map((behavior, idx) => (
                    <li key={idx} className="flex items-start text-xs text-fg-2 font-medium">
                      <span className="mr-2 mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                      <span>{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* BAD SECTION */}
              <div className="border border-gap/20 bg-gap/5 p-4 sm:p-5" style={{ borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
                <div className="flex items-center space-x-2 text-gap font-sans text-xs font-bold uppercase tracking-wider">
                  <XCircle className="h-4 w-4" strokeWidth={1.75} />
                  <span>BIỂU HIỆN CẢNH BÁO / CHƯA ĐẠT</span>
                </div>
                <div className="text-[11px] text-fg-3 font-mono font-bold">
                  Bạn có nguy cơ bị loại khỏi quy trình phỏng vấn bảo vệ nếu:
                </div>
                <ul className="space-y-3">
                  {currentItem.badBehaviors.map((behavior, idx) => (
                    <li key={idx} className="flex items-start text-xs text-fg-2 font-medium">
                      <span className="mr-2 mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-gap" />
                      <span>{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vibe Tip Banner */}
            <div className="insight mt-6! md:mt-10!">
              <div className="insight-label text-[10px]! mb-2! flex items-center space-x-2">
                <Info className="h-3.5 w-3.5 text-brand shrink-0" strokeWidth={1.75} />
                <span>YODY Builder Tip:</span>
              </div>
              <div className="insight-body space-y-1 font-sans text-xs! text-fg-2! leading-relaxed!">
                <p>
                  Tại YODY, sai lầm được chấp nhận (fail-fast), nhưng sự thụ động và thiếu trách nhiệm sẽ dẫn đến thất bại sớm. 
                  Hãy chép đầy đủ cảm nhận thực tế của bạn vào **Working Journal** ở thẻ cuối để Mentor có những công cụ trực tiếp giúp bạn bứt phá ranh giới năng lực hành vi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
