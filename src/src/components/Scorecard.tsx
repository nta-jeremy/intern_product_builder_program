import React, { useState } from 'react';
import { SCORECARD_DATA } from '../data';
import { Award, Trophy, ShieldAlert, BadgeCheck, CheckCircle, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

export default function Scorecard() {
  const [selectedLevels, setSelectedLevels] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SCORECARD_DATA.forEach((cat, catIdx) => {
      cat.items.forEach((_, itemIdx) => {
        initial[`${catIdx}-${itemIdx}`] = 3; 
      });
    });
    return initial;
  });

  const [expandedCats, setExpandedCats] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
  });

  const handleLevelChange = (catIdx: number, itemIdx: number, level: number) => {
    setSelectedLevels((prev) => ({
      ...prev,
      [`${catIdx}-${itemIdx}`]: level,
    }));
  };

  const toggleCat = (idx: number) => {
    setExpandedCats((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  let totalScore = 0;
  const categoryScores: number[] = SCORECARD_DATA.map(() => 0);

  SCORECARD_DATA.forEach((cat, catIdx) => {
    let catComputed = 0;
    cat.items.forEach((item, itemIdx) => {
      const level = selectedLevels[`${catIdx}-${itemIdx}`] || 3;
      const points = (level / 4) * item.points;
      catComputed += points;
    });
    categoryScores[catIdx] = parseFloat(catComputed.toFixed(1));
    totalScore += catComputed;
  });

  const roundedTotal = Math.round(totalScore);

  const getResultBadge = (score: number) => {
    if (score >= 85) {
      return {
        rating: 'EXCEPTIONAL (VỢT TRỘI)',
        desc: 'Vượt kỳ vọng ở mọi chiều kích. Chủ động hoàn toàn. Có khả năng coach và hướng dẫn người khác.',
        action: 'Strong Yes — Tuyển dụng đặc cách Fast-track',
        classes: 'border-gold/30 bg-gold/10 text-gold-deep',
        textColor: 'text-gold',
      };
    } else if (score >= 70) {
      return {
        rating: 'STRONG (ĐÁP ỨNG TỐT)',
        desc: 'Hoàn thành tốt mọi tiêu chí hành vi đề cử. Có nhiều điểm sáng nổi bật trong sản phẩm.',
        action: 'Yes — Phù hợp chuyển đổi Full-Time',
        classes: 'border-mint/30 bg-mint/10 text-mint-deep',
        textColor: 'text-mint',
      };
    } else if (score >= 55) {
      return {
        rating: 'MEETS KỲ VỌNG (ĐẠT CHUẨN)',
        desc: 'Hoàn tất vừa vặn nhiệm vụ bàn giao cốt lõi. Cần nâng cao thêm tính chủ động và tốc độ lặp lại.',
        action: 'Maybe — Cần thảo luận cân nhắc thêm',
        classes: 'border-iris/30 bg-iris/10 text-iris-deep',
        textColor: 'text-iris',
      };
    } else {
      return {
        rating: 'NEEDS IMPROVEMENT (CẦN CẢI THIỆN)',
        desc: 'Chưa đáp ứng đúng các kỳ vọng đầu ra của YODY. Thường xuyên thụ động hoặc chậm trễ.',
        action: 'No — Biên bản tổng kết & Rời chương trình',
        classes: 'border-gap/30 bg-gap/10 text-gap',
        textColor: 'text-gap',
      };
    }
  };

  const badge = getResultBadge(roundedTotal);

  return (
    <div className="py-6 font-sans" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-10)' }} id="scorecard-app-container">
      {/* Intro Header */}
      <div className="border-b border-border pb-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
        <div className="s-eyebrow">
          <Calculator className="h-4 w-4 mr-1" strokeWidth={1.75} />
          SCORECARD TRÌNH THẨM ĐỊNH
        </div>
        <h2 className="text-fg-1" style={{ font: 'var(--type-h2)', letterSpacing: '-0.018em' }}>
          ScoreCard Tổng Sắp — Đánh Giá Sau 3 Tháng
        </h2>
        <p className="max-w-4xl" style={{ font: 'var(--type-body-sm)', color: 'var(--fg-2)', lineHeight: '1.7' }}>
          Hội đồng Thẩm định độc lập (mô tả tại Phần V) sử dụng ScoreCard tiêu chuẩn 100 điểm dưới đây để chấm điểm thực tế. 
          Điểm số được tổng hợp từ: Năng lực Bàn giao (40%), Độ Phát triển (40%) và Chất lượng Quy trình (20%). 
          Sử dụng bảng mô phỏng dưới đây để chấm điểm nháp cho bản thân!
        </p>
      </div>

      {/* Calculator Results Grid Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Aspect: Breakdown controls */}
        <div className="lg:col-span-8 space-y-6">
          {SCORECARD_DATA.map((cat, catIdx) => {
            const isExpanded = expandedCats[catIdx];
            return (
              <div key={catIdx} className="border border-border bg-bg-warm overflow-hidden" style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-rest)' }}>
                {/* Category Header Bar */}
                <button
                  onClick={() => toggleCat(catIdx)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-bg border-b border-border text-left hover:bg-bg-muted transition-all font-semibold"
                  style={{ transitionDuration: 'var(--dur)' }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex h-7 w-7 items-center justify-center bg-brand/10 text-brand font-mono text-xs font-bold border border-brand/20" style={{ borderRadius: 'var(--radius-sm)' }}>
                      0{catIdx + 1}
                    </span>
                    <div>
                      <span className="text-sm text-fg-1 block leading-tight font-impact">{cat.category}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-fg-3 mt-0.5 block font-bold">
                        Trọng số tối đa: {cat.maxScore} điểm
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-bg-muted border border-border-hover px-3 py-1 font-mono text-xs font-bold text-brand" style={{ borderRadius: 'var(--radius-pill)' }}>
                      Đạt: {categoryScores[catIdx]}/{cat.maxScore}đ
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-fg-3" strokeWidth={1.75} /> : <ChevronDown className="h-4 w-4 text-fg-3" strokeWidth={1.75} />}
                  </div>
                </button>

                {/* Sub items */}
                {isExpanded && (
                  <div className="divide-y divide-border p-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-8)' }}>
                    {cat.items.map((item, itemIdx) => {
                      const currentLevel = selectedLevels[`${catIdx}-${itemIdx}`] || 3;
                      const activeItemPoints = ((currentLevel / 4) * item.points).toFixed(1);
                      return (
                        <div key={itemIdx} className="pt-4 first:pt-0 pb-2" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }} id={`calc-item-${catIdx}-${itemIdx}`}>
                          {/* Item header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="font-sans text-xs font-bold text-fg-1">
                              {item.name}
                            </h4>
                            <div className="bg-bg-muted border border-border-hover px-2.5 py-1 font-mono text-xs text-fg-2 flex items-center space-x-1.5 self-start" style={{ borderRadius: 'var(--radius-xs)' }}>
                              <span className="text-brand font-bold">{activeItemPoints}</span>
                              <span className="text-[10px] text-fg-3">/ {item.points}đ</span>
                            </div>
                          </div>

                          {/* Grid of 4 assessment descriptions */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            {[
                              { lvl: 1, label: '1 — Chưa Đạt', txt: item.unmet, accent: 'group-hover:text-gap', actColor: 'border-gap/40 bg-gap/10 text-gap ring-1 ring-gap/20' },
                              { lvl: 2, label: '2 — Đạt', txt: item.met, accent: 'group-hover:text-gold', actColor: 'border-gold/40 bg-gold/10 text-gold-deep ring-1 ring-gold/20' },
                              { lvl: 3, label: '3 — Tốt', txt: item.good, accent: 'group-hover:text-iris', actColor: 'border-iris/40 bg-iris/10 text-iris-deep ring-1 ring-iris/20' },
                              { lvl: 4, label: '4 — Xuất Sắc', txt: item.excellent, accent: 'group-hover:text-brand', actColor: 'border-brand/40 bg-brand/10 text-brand ring-1 ring-brand/20' },
                            ].map((levelItem) => {
                              const isActive = currentLevel === levelItem.lvl;
                              return (
                                <button
                                  key={levelItem.lvl}
                                  onClick={() => handleLevelChange(catIdx, itemIdx, levelItem.lvl)}
                                  className={`group flex flex-col items-start text-left p-3 border text-xs transition-all min-h-[140px] relative ${
                                    isActive
                                      ? levelItem.actColor
                                      : 'bg-bg border-border text-fg-3 hover:bg-bg-muted hover:border-border-hover'
                                  }`}
                                  style={{ borderRadius: 'var(--radius-sm)', transitionDuration: 'var(--dur)' }}
                                >
                                  {/* Radio indicator */}
                                  <div className="flex w-full items-center justify-between mb-2">
                                    <span className={`font-mono text-[9px] uppercase font-bold tracking-wider ${isActive ? '' : 'text-fg-3'}`}>
                                      {levelItem.label}
                                    </span>
                                    <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${isActive ? 'border-current' : 'border-border-hover'}`}>
                                      {isActive && <div className="h-1.5 w-1.5 rounded-full bg-current" />}
                                    </div>
                                  </div>
                                  <p className={`font-sans text-[10px] leading-relaxed transition-colors ${isActive ? 'text-fg-1' : 'text-fg-3 group-hover:text-fg-2'}`}>
                                    {levelItem.txt}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Aspect: Sticky Final Result Dashboard */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="yds-card-warm p-6 text-center" style={{ boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: 'var(--s-6)' }}>
            <span className="font-mono text-[10px] uppercase font-bold text-fg-3 tracking-wider block">
              MÔ PHỎNG KẾT QUẢ ĐẦU RA
            </span>

            {/* Dynamic circular-like score progress */}
            <div className="relative inline-flex items-center justify-center mx-auto">
              <svg className="h-32 w-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  className="stroke-border-hover"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  className="stroke-brand transition-all ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={351.8}
                  strokeDashoffset={351.8 - (351.8 * roundedTotal) / 100}
                  style={{ transitionDuration: '500ms' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-impact text-3xl font-extrabold text-brand leading-none">
                  {roundedTotal}
                </span>
                <span className="font-mono text-[9px] text-fg-3 uppercase tracking-widest mt-1 font-bold">
                  Trên 100đ
                </span>
              </div>
            </div>

            {/* Detail score breakdown tags */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-border">
              {categoryScores.map((score, idx) => (
                <div key={idx} className="space-y-1 text-center">
                  <span className="font-mono text-[9px] text-fg-3 block font-bold">PHẦN {idx + 1}</span>
                  <span className="font-sans text-xs font-bold text-fg-1 block">{score}đ</span>
                </div>
              ))}
            </div>

            {/* Performance Level */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-fg-3 uppercase tracking-wider block font-bold">Xếp hạng năng lực</span>
              <div className={`border px-3 py-2 text-xs font-bold tracking-wide ${badge.classes}`} style={{ borderRadius: 'var(--radius-sm)' }}>
                {badge.rating}
              </div>
              <p className="font-sans text-[11px] text-fg-2 leading-relaxed px-1">
                {badge.desc}
              </p>
            </div>

            {/* Conversion status indicator */}
            <div className="p-4 bg-bg-muted border border-border text-xs" style={{ borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: 'var(--s-1)' }}>
              <span className="font-mono text-[9px] text-fg-3 uppercase tracking-wider block font-bold">CƠ HỘI ĐỖ FULL-TIME</span>
              <span className={`font-sans font-extrabold block text-sm ${badge.textColor}`}>
                {badge.action}
              </span>
            </div>
          </div>

          {/* Vibe Rule Indicator Card using standard insight callout */}
          <div className="insight mt-0! px-6! py-6!">
            <div className="insight-label text-[10px]! mb-4!">QUY ĐỊNH BẢO VỆ PHẢN BIỆN</div>
            <div className="font-sans text-xs text-fg-2 leading-relaxed" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              <p>
                Để được phép tham dự ngày thẩm định cuối trước Hội đồng BoD YODY (Tuần 12):
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-gold mr-2 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="font-medium">Hoàn chỉnh 100% tài liệu nhật ký báo cáo **Working Journal**.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-gold mr-2 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="font-medium">Cả 4 sản phẩm chính được deploy, sếp duyệt và vận hành thực tế.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
