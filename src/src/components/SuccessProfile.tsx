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
        return { text: 'Chưa Đạt', color: 'text-red-400 bg-red-950/40 border-red-500/20' };
      case 2:
        return { text: 'Nhận Thức Được', color: 'text-orange-400 bg-orange-950/40 border-orange-500/20' };
      case 3:
        return { text: 'Đáp Ứng Đạt', color: 'text-blue-400 bg-blue-950/40 border-blue-500/20' };
      case 4:
        return { text: 'Xuất Sắc (Thường xuyên)', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-500/20' };
      case 5:
        return { text: 'Hình Mẫu (Coach được)', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20' };
      default:
        return { text: 'Mơ hồ', color: 'text-neutral-400 bg-neutral-900' };
    }
  };

  // Average self-score
  const scoreKeys = Object.keys(selfScore);
  const avgScore = scoreKeys.reduce((sum, k) => sum + selfScore[k], 0) / scoreKeys.length;

  return (
    <div className="space-y-10 py-6" id="success-profile-container">
      {/* Introduction Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-1 text-xs font-medium text-yellow-500 tracking-wider font-mono">
            <Star className="h-3 w-3 fill-yellow-500" />
            <span>INTERN SUCCESS PROFILE</span>
          </div>
          <h2 className="font-sans text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Chúng tôi không chỉ đánh giá sản phẩm ban đầu — Chúng tôi rèn giũa cách bạn tư duy.
          </h2>
          <p className="font-sans text-sm text-neutral-400 leading-relaxed">
            Đây là hệ 5 tiêu chí năng lực hành vi cốt lõi để đánh giá độ chín chắn của một **YODY Product Builder**. 
            Nó đo lường cách bạn tự học, thấu cảm bài toán kinh tế, chủ động tìm lời giải và cộng tác song hành cùng AI trong kỷ nguyên mới. 
            Đạt chuẩn bộ tiêu chí này là chìa khóa vàng để bạn được chuyển đổi trực tiếp sang nhân sự chính thức (Full-Time conversion) sau 3 tháng thực tập.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Interactive Selector & Self Assessment Radar Checklist */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-white/[0.08] bg-neutral-950 p-5 space-y-4">
            <span className="font-mono text-xs uppercase text-neutral-400 tracking-wider block font-semibold border-b border-white/[0.06] pb-2">
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
                    className={`flex items-start text-left rounded-lg p-3 transition-all duration-200 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/0 border-yellow-500/30 text-white'
                        : 'border-transparent text-neutral-400 hover:bg-white/[0.02] hover:text-neutral-200'
                    }`}
                  >
                    <div className="mr-3 mt-1 flex h-2 w-2 rounded-full bg-yellow-500 shadow-glow" />
                    <div>
                      <div className="font-sans text-xs font-bold tracking-wide">{item.dimension}</div>
                      <div className="font-sans text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Self-Assessment Simulator */}
          <div className="rounded-xl border border-white/[0.08] bg-neutral-950 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="font-mono text-xs uppercase text-neutral-400 tracking-wider block font-semibold">
                TỰ ĐÁNH GIÁ NHANH
              </span>
              <div className="rounded-full bg-yellow-500/10 px-2 py-0.5 font-mono text-[10px] text-yellow-500 border border-yellow-500/20">
                Avg: {avgScore.toFixed(1)}/5
              </div>
            </div>
            
            <p className="font-sans text-[11px] text-neutral-400 leading-snug">
              Kéo thanh trượt để tự chấm điểm năng lực hành vi của bạn cho từng khía cạnh thực tập sinh.
            </p>

            <div className="space-y-4">
              {SUCCESS_PROFILE_DATA.map((item) => {
                const score = selfScore[item.key] || 3;
                const activeLabel = getScoreLabel(score);
                return (
                  <div key={item.key} className="space-y-1.5" id={`self-assess-${item.key}`}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-sans font-medium text-neutral-300">{item.dimension}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] border font-mono ${activeLabel.color}`}>
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
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg bg-neutral-900 border border-white/[0.04] p-3 text-[11px] text-neutral-400 space-y-1.5">
              <span className="font-sans font-bold text-white block">Kết quả mô phỏng:</span>
              {avgScore >= 4.0 ? (
                <p className="text-emerald-400 text-xs">
                  ★ **HÌNH MẪU SÁNG GIÁ**: Bạn đang thể hiện năng khiếu vượt trội của một Product Builder thứ thiệt! Cơ hội chuyển đổi Full-Time rộng mở.
                </p>
              ) : avgScore >= 3.0 ? (
                <p className="text-yellow-500 text-xs">
                  ▲ **KHẢ QUAN**: Bạn đáp ứng vừa vặn các kỳ vọng cơ bản của YODY. Hãy tập trung cải tiến các hành vi tốt hơn nữa.
                </p>
              ) : (
                <p className="text-red-400 text-xs">
                  ⚠ **CẦN NỖ LỰC**: Bạn cần trao đổi sâu hơn với Mentor để khắc phục ngay các "biểu hiện chưa đạt" nhằm bảo vệ kết quả thực tập.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Selection Tab Content with Details */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="rounded-xl border border-white/[0.08] bg-neutral-950 p-6 sm:p-8 space-y-6 flex-1 min-h-[450px]">
            {/* Aspect Title & Subheader */}
            <div className="space-y-3 border-b border-white/[0.06] pb-5">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-white tracking-tight">{currentItem.dimension}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Khía cạnh đánh giá cốt lõi</p>
                </div>
              </div>
              <p className="font-sans text-sm text-neutral-300 italic pl-1 leading-relaxed">
                "{currentItem.description}"
              </p>
            </div>

            {/* Grid for Good Behaviors vs Bad Behaviors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* GOOD SECTION */}
              <div className="space-y-4 rounded-xl border border-emerald-500/10 bg-emerald-950/5 p-4 sm:p-5">
                <div className="flex items-center space-x-2 text-emerald-400 font-sans text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>BIỂU HIỆN ĐƯỢC ĐÁNH GIÁ CAO ★</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Sẵn sàng conversion thành nhân sự Full-Time nếu bạn thường xuyên:
                </div>
                <ul className="space-y-3">
                  {currentItem.goodBehaviors.map((behavior, idx) => (
                    <li key={idx} className="flex items-start text-xs text-neutral-300">
                      <span className="mr-2 mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span>{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* BAD SECTION */}
              <div className="space-y-4 rounded-xl border border-red-500/10 bg-red-950/5 p-4 sm:p-5">
                <div className="flex items-center space-x-2 text-red-400 font-sans text-xs font-bold uppercase tracking-wider">
                  <XCircle className="h-4 w-4" />
                  <span>BIỂU HIỆN CẢNH BÁO / CHƯA ĐẠT</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Bạn có nguy cơ bị loại khỏi quy trình phỏng vấn bảo vệ nếu:
                </div>
                <ul className="space-y-3">
                  {currentItem.badBehaviors.map((behavior, idx) => (
                    <li key={idx} className="flex items-start text-xs text-neutral-400">
                      <span className="mr-2 mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      <span>{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vibe Tip Banner */}
            <div className="flex items-start space-x-3 rounded-lg bg-neutral-900 border border-white/[0.04] p-4 text-xs text-neutral-400 mt-6 md:mt-10">
              <Info className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-sans font-semibold text-white">YODY Builder Tip:</span>
                <p className="leading-relaxed">
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
