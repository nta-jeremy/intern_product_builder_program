import React, { useState } from 'react';
import { COACHING_LIFECYCLE_DATA } from '../data';
import { Milestone, Flag, Compass, Hammer, CheckSquare, Ship, Check, ChevronRight } from 'lucide-react';

export default function Roadmap() {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  const activePhase = COACHING_LIFECYCLE_DATA[activePhaseIndex];

  const getPhaseIcon = (phaseKey: string) => {
    switch (phaseKey) {
      case 'PHASE 1':
        return Compass;
      case 'PHASE 2':
        return Hammer;
      case 'PHASE 3':
        return CheckSquare;
      default:
        return Ship;
    }
  };

  const getPhaseProgressPercent = () => {
    return ((activePhaseIndex + 1) / COACHING_LIFECYCLE_DATA.length) * 100;
  };

  const ActiveIconComponent = getPhaseIcon(activePhase.phase);

  return (
    <div className="space-y-10 py-6 font-sans" id="lifecycle-roadmap-container">
      {/* Page header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center space-x-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-1 text-xs font-medium text-yellow-500 tracking-wider font-mono">
          <Milestone className="h-3.5 w-3.5" />
          <span>COACHING LIFECYCLE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Lộ Trình Đồng Hành — 4 Giai Đoạn Phát Triển
        </h2>
        <p className="text-sm text-neutral-400 max-w-4xl leading-relaxed">
          Chúng tôi không quản lý bạn bằng cách giao những đầu việc chi li không suy nghĩ. 
          Phương pháp **Coaching Lifecycle** huấn luyện bạn cách tự bơi, tự giải quyết vấn đề từ Khám phá cho đến Ship code thật. 
          Bốn giai đoạn phát triển dưới đây là khung hoạt động độc lập giúp bạn bứt phá.
        </p>
      </div>

      {/* Visual Timeline Progressive Bar */}
      <div className="relative rounded-2xl border border-white/[0.08] bg-neutral-950 p-6 sm:p-8 space-y-8">
        {/* Horizontal Line for Desktop progress */}
        <div className="hidden md:block absolute top-[4.2rem] left-16 right-16 h-0.5 bg-neutral-800 -z-10">
          <div
            className="h-full bg-yellow-500 transition-all duration-500 ease-out"
            style={{ width: `${getPhaseProgressPercent() - 12}%` }}
          />
        </div>

        {/* Phase Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10" id="roadmap-flow-grid">
          {COACHING_LIFECYCLE_DATA.map((item, idx) => {
            const PhaseIcon = getPhaseIcon(item.phase);
            const isSelected = idx === activePhaseIndex;
            const isCompleted = idx < activePhaseIndex;

            return (
              <button
                key={item.phase}
                id={`roadmap-node-${idx}`}
                onClick={() => setActivePhaseIndex(idx)}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-neutral-900 border-yellow-500 shadow-xl shadow-yellow-500/[0.02]'
                    : isCompleted
                    ? 'bg-neutral-950/60 border-emerald-500/20 text-emerald-400'
                    : 'bg-neutral-950/20 border-white/[0.04] text-neutral-500 hover:bg-neutral-900/40 hover:border-white/[0.08]'
                }`}
              >
                {/* Phase state icon */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border mb-3 transition-transform duration-300 ${
                    isSelected
                      ? 'bg-yellow-500 text-neutral-950 border-yellow-500 scale-110 shadow-lg shadow-yellow-500/20'
                      : isCompleted
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                  }`}
                >
                  {isCompleted ? <Check className="h-4.5 w-4.5" /> : <PhaseIcon className="h-4.5 w-4.5" />}
                </div>

                <div className="space-y-1">
                  <span className={`font-mono text-[9px] uppercase tracking-widest block font-bold ${isSelected ? 'text-yellow-500' : 'text-neutral-500'}`}>
                    {item.phase}
                  </span>
                  <span className={`font-sans text-xs font-bold block ${isSelected ? 'text-white' : 'text-neutral-400'}`}>
                    {item.title.split(' ')[0]}
                  </span>
                  <span className="font-mono text-[9px] text-neutral-500 block">
                    {item.time.split('•')[0]}
                  </span>
                </div>

                {/* Arrow helper for desktop */}
                {idx < 3 && (
                  <ChevronRight className="hidden md:block absolute -right-3 top-10 h-5 w-5 text-neutral-700" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Phase Detail Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="selected-phase-detail-sheet">
        {/* Left Aspect: Objectives list */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-white/[0.08] bg-neutral-950 p-6 sm:p-8 space-y-5">
            <div className="flex items-center space-x-3 border-b border-white/[0.06] pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                <ActiveIconComponent className="h-5.5 w-5.5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-yellow-500 tracking-wider">
                  MỤC TIÊU CHI TIẾT — {activePhase.phase}
                </span>
                <h3 className="font-sans text-xl font-bold text-white">{activePhase.title}</h3>
              </div>
            </div>

            {/* Time label block */}
            <div className="rounded-lg bg-neutral-900 border border-white/[0.03] px-4 py-2.5 inline-flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="font-mono text-xs text-neutral-300">{activePhase.time}</span>
            </div>

            {/* Objectives bullets */}
            <div className="space-y-3 pt-2">
              <ul className="space-y-4">
                {activePhase.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start text-xs text-neutral-300 leading-relaxed">
                    <span className="mr-3 mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-yellow-500/30 border border-yellow-500/60" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Aspect: Coaching Focus & Checkpoints */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coaching Focus Block */}
          <div className="rounded-xl border border-white/[0.08] bg-neutral-950 p-6 space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold block border-b border-white/[0.06] pb-2">
              COACHING FOCUS (TẦM NHÌN HUẤN LUYỆN)
            </span>
            <div className="space-y-3.5 pt-1">
              {activePhase.coachingFocus.map((focus, idx) => {
                const isPO = focus.startsWith('Product');
                return (
                  <div key={idx} className="rounded-lg bg-neutral-900/60 border border-white/[0.03] p-3 space-y-1">
                    <span className={`font-mono text-[9px] uppercase font-bold ${isPO ? 'text-cyan-400' : 'text-yellow-500'}`}>
                      {isPO ? 'PO COACH FOCUS' : 'TECH LEAD COACH FOCUS'}
                    </span>
                    <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                      {isPO ? focus.replace('Product Owner (PO) hỗ trợ: ', '') : focus.replace('Tech Lead hỗ trợ: ', '')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkpoints Checklist */}
          <div className="rounded-xl border border-emerald-500/10 bg-emerald-950/5 p-6 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400 border-b border-emerald-500/10 pb-2">
              <Flag className="h-4.5 w-4.5" />
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
                CHECKPOINT NGHIỆM THU GIAI ĐOẠN
              </span>
            </div>
            <div className="space-y-3 text-[11px] text-neutral-400">
              Đạt những mốc cứng dưới đây để tiến tục mở khóa giai đoạn phát triển kế tiếp:
            </div>
            <ul className="space-y-3">
              {activePhase.checkpoints.map((checkpoint, idx) => (
                <li key={idx} className="flex items-start text-xs text-neutral-300 bg-emerald-950/10 border border-emerald-500/10 rounded-lg p-2.5 space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 bg-emerald-950/40 rounded-full border border-emerald-500/25 p-0.5 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{checkpoint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
