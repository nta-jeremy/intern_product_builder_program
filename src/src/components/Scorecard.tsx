import React, { useState } from 'react';
import { SCORECARD_DATA } from '../data';
import { Award, Trophy, ShieldAlert, BadgeCheck, CheckCircle, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

export default function Scorecard() {
  // Store selected level (1 - unmet, 2 - met, 3 - good, 4 - excellent) for each item
  // Key format: "categoryIndex-itemIndex"
  const [selectedLevels, setSelectedLevels] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SCORECARD_DATA.forEach((cat, catIdx) => {
      cat.items.forEach((_, itemIdx) => {
        initial[`${catIdx}-${itemIdx}`] = 3; // Default to 'Tốt' (Level 3)
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

  // Calculate scores
  let totalScore = 0;
  const categoryScores: number[] = SCORECARD_DATA.map(() => 0);

  SCORECARD_DATA.forEach((cat, catIdx) => {
    let catComputed = 0;
    cat.items.forEach((item, itemIdx) => {
      const level = selectedLevels[`${catIdx}-${itemIdx}`] || 3;
      // Calculate contribution: level 1 = 25%, 2 = 50%, 3 = 75%, 4 = 100% of maximum weight
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
        classes: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500',
        textColor: 'text-yellow-400',
      };
    } else if (score >= 70) {
      return {
        rating: 'STRONG (ĐÁP ỨNG TỐT)',
        desc: 'Hoàn thành tốt mọi tiêu chí hành vi đề cử. Có nhiều điểm sáng nổi bật trong sản phẩm.',
        action: 'Yes — Phù hợp chuyển đổi Full-Time',
        classes: 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400',
        textColor: 'text-emerald-400',
      };
    } else if (score >= 55) {
      return {
        rating: 'MEETS KỲ VỌNG (ĐẠT CHUẨN)',
        desc: 'Hoàn tất vừa vặn nhiệm vụ bàn giao cốt lõi. Cần nâng cao thêm tính chủ động và tốc độ lặp lại.',
        action: 'Maybe — Cần thảo luận cân nhắc thêm',
        classes: 'border-blue-500/30 bg-blue-950/30 text-blue-400',
        textColor: 'text-blue-400',
      };
    } else {
      return {
        rating: 'NEEDS IMPROVEMENT (CẦN CẢI THIỆN)',
        desc: 'Chưa đáp ứng đúng các kỳ vọng đầu ra của YODY. Thường xuyên thụ động hoặc chậm trễ.',
        action: 'No — Biên bản tổng kết & Rời chương trình',
        classes: 'border-red-500/30 bg-red-950/30 text-red-400',
        textColor: 'text-red-400',
      };
    }
  };

  const badge = getResultBadge(roundedTotal);

  return (
    <div className="space-y-10 py-6 font-sans" id="scorecard-app-container">
      {/* Intro Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center space-x-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-1 text-xs font-medium text-yellow-500 tracking-wider font-mono">
          <Calculator className="h-3.5 w-3.5" />
          <span>SCORECARD TRÌNH THẨM ĐỊNH</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          ScoreCard Tổng Sắp — Đánh Giá Sau 3 Tháng
        </h2>
        <p className="text-sm text-neutral-400 max-w-4xl leading-relaxed">
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
              <div key={catIdx} className="rounded-xl border border-white/[0.08] bg-neutral-950 overflow-hidden">
                {/* Category Header Bar */}
                <button
                  onClick={() => toggleCat(catIdx)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-white/[0.04] text-left hover:bg-neutral-900/80 transition-all font-semibold"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500 font-mono text-xs font-bold border border-yellow-500/20">
                      0{catIdx + 1}
                    </span>
                    <div>
                      <span className="text-sm text-white block leading-tight">{cat.category}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 mt-0.5 block">
                        Trọng số tối đa: {cat.maxScore} điểm
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-neutral-950 border border-white/[0.08] px-3 py-1 font-mono text-xs font-bold text-yellow-500">
                      Đạt: {categoryScores[catIdx]}/{cat.maxScore}đ
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                  </div>
                </button>

                {/* Sub items */}
                {isExpanded && (
                  <div className="divide-y divide-white/[0.04] p-6 space-y-8">
                    {cat.items.map((item, itemIdx) => {
                      const currentLevel = selectedLevels[`${catIdx}-${itemIdx}`] || 3;
                      const activeItemPoints = ((currentLevel / 4) * item.points).toFixed(1);
                      return (
                        <div key={itemIdx} className="space-y-4 pt-4 first:pt-0 pb-2" id={`calc-item-${catIdx}-${itemIdx}`}>
                          {/* Item header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="font-sans text-xs font-bold text-neutral-200">
                              {item.name}
                            </h4>
                            <div className="rounded bg-neutral-900 border border-white/[0.06] px-2.5 py-1 font-mono text-xs text-neutral-400 flex items-center space-x-1.5 self-start">
                              <span className="text-yellow-500 font-bold">{activeItemPoints}</span>
                              <span className="text-[10px] text-neutral-500">/ {item.points}đ</span>
                            </div>
                          </div>

                          {/* Grid of 4 assessment descriptions */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            {[
                              { lvl: 1, label: '1 — Chưa Đạt', txt: item.unmet, accent: 'group-hover:text-red-400', actColor: 'border-red-500 bg-red-950/20 text-red-400 ring-1 ring-red-500/20' },
                              { lvl: 2, label: '2 — Đạt', txt: item.met, accent: 'group-hover:text-amber-500', actColor: 'border-amber-500 bg-amber-950/20 text-amber-500 ring-1 ring-amber-500/20' },
                              { lvl: 3, label: '3 — Tốt', txt: item.good, accent: 'group-hover:text-blue-400', actColor: 'border-blue-500 bg-blue-950/20 text-blue-400 ring-1 ring-blue-500/20' },
                              { lvl: 4, label: '4 — Xuất Sắc', txt: item.excellent, accent: 'group-hover:text-yellow-400', actColor: 'border-yellow-500 bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20' },
                            ].map((levelItem) => {
                              const isActive = currentLevel === levelItem.lvl;
                              return (
                                <button
                                  key={levelItem.lvl}
                                  onClick={() => handleLevelChange(catIdx, itemIdx, levelItem.lvl)}
                                  className={`group flex flex-col items-start text-left p-3 rounded-lg border text-xs transition-all duration-200 min-h-[140px] relative ${
                                    isActive
                                      ? levelItem.actColor
                                      : 'bg-neutral-900/40 border-white/[0.04] text-neutral-400 hover:bg-neutral-900 hover:border-white/[0.08]'
                                  }`}
                                >
                                  {/* Radio indicator */}
                                  <div className="flex w-full items-center justify-between mb-2">
                                    <span className={`font-mono text-[9px] uppercase font-bold tracking-wider ${isActive ? '' : 'text-neutral-500'}`}>
                                      {levelItem.label}
                                    </span>
                                    <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${isActive ? 'border-current' : 'border-neutral-700'}`}>
                                      {isActive && <div className="h-1.5 w-1.5 rounded-full bg-current" />}
                                    </div>
                                  </div>
                                  <p className={`font-sans text-[10px] leading-relaxed transition-colors ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
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
          <div className="rounded-xl border border-white/[0.08] bg-neutral-950 p-6 shadow-2xl space-y-6 text-center">
            <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              MÔ PHỎNG KẾT QUẢ ĐẦU RA
            </span>

            {/* Dynamic circular-like score progress */}
            <div className="relative inline-flex items-center justify-center">
              <svg className="h-32 w-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  className="stroke-neutral-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  className="stroke-yellow-500 transition-all duration-500 ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={351.8}
                  strokeDashoffset={351.8 - (351.8 * roundedTotal) / 100}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-sans text-3xl font-extrabold text-white leading-none">
                  {roundedTotal}
                </span>
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
                  Trên 100đ
                </span>
              </div>
            </div>

            {/* Detail score breakdown tags */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/[0.06]">
              {categoryScores.map((score, idx) => (
                <div key={idx} className="space-y-1 text-center">
                  <span className="font-mono text-[9px] text-neutral-500 block">PHẦN {idx + 1}</span>
                  <span className="font-sans text-xs font-bold text-white block">{score}đ</span>
                </div>
              ))}
            </div>

            {/* Performance Level */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider block">Xếp hạng năng lực</span>
              <div className={`rounded-lg border px-3 py-2 text-xs font-bold tracking-wide ${badge.classes}`}>
                {badge.rating}
              </div>
              <p className="font-sans text-[11px] text-neutral-400 leading-relaxed px-1">
                {badge.desc}
              </p>
            </div>

            {/* Conversion status indicator */}
            <div className="space-y-1.5 p-4 rounded-xl bg-neutral-900/60 border border-white/[0.03] text-xs">
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider block">CƠ HỘI ĐỖ FULL-TIME</span>
              <span className={`font-sans font-extrabold block text-sm ${badge.textColor}`}>
                {badge.action}
              </span>
            </div>
          </div>

          {/* Vibe Rule Indicator Card */}
          <div className="rounded-xl border border-white/[0.08] bg-neutral-950 p-5 space-y-4">
            <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 tracking-wider block border-b border-white/[0.06] pb-1.5">
              QUY ĐỊNH BẢO VỆ PHẢN BIỆN
            </span>
            <div className="space-y-3 font-sans text-xs text-neutral-400 leading-relaxed">
              <p>
                Để được phép tham dự ngày thẩm định cuối trước Hội đồng BoD YODY (Tuần 12):
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Hoàn chỉnh 100% tài liệu nhật ký báo cáo **Working Journal** (Phần VII).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Cả 4 sản phẩm chính được deploy, sếp duyệt và vận hành thực tế.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
