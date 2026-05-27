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

  const getPhaseTheme = (phaseKey: string) => {
    switch (phaseKey) {
      case 'PHASE 1': // Discover (Green)
        return {
          accentColor: 'text-mint-deep dark:text-mint',
          bgLight: 'bg-mint/5',
          bgMedium: 'bg-mint/10',
          border: 'border-mint/20',
          borderActive: 'border-mint',
          glowActive: 'shadow-mint/20 ring-mint/10',
          dot: 'bg-mint-deep dark:bg-mint',
          borderLight: 'border-mint/30',
          iconGradient: 'bg-gradient-to-br from-mint-deep to-mint text-white border-mint/40',
        };
      case 'PHASE 2': // Build (Violet/Iris)
        return {
          accentColor: 'text-iris-deep dark:text-iris',
          bgLight: 'bg-iris/5',
          bgMedium: 'bg-iris/10',
          border: 'border-iris/20',
          borderActive: 'border-iris',
          glowActive: 'shadow-iris/20 ring-iris/10',
          dot: 'bg-iris-deep dark:bg-iris',
          borderLight: 'border-iris/30',
          iconGradient: 'bg-gradient-to-br from-iris-deep to-iris text-white border-iris/40',
        };
      case 'PHASE 3': // Validate (Gold/Amber)
        return {
          accentColor: 'text-gold-deep dark:text-gold',
          bgLight: 'bg-gold/5',
          bgMedium: 'bg-gold/10',
          border: 'border-gold/20',
          borderActive: 'border-gold',
          glowActive: 'shadow-gold/20 ring-gold/10',
          dot: 'bg-gold-deep dark:bg-gold',
          borderLight: 'border-gold/30',
          iconGradient: 'bg-gradient-to-br from-gold-deep to-gold text-white border-gold/40',
        };
      default: // Ship / PHASE 4 (Brand Indigo)
        return {
          accentColor: 'text-brand-light dark:text-brand',
          bgLight: 'bg-brand/5',
          bgMedium: 'bg-brand/10',
          border: 'border-brand/20',
          borderActive: 'border-brand',
          glowActive: 'shadow-brand/20 ring-brand/10',
          dot: 'bg-brand',
          borderLight: 'border-brand/30',
          iconGradient: 'bg-gradient-to-br from-brand to-brand-light text-white border-brand-light',
        };
    }
  };

  const getPhaseProgressPercent = () => {
    return ((activePhaseIndex + 1) / COACHING_LIFECYCLE_DATA.length) * 100;
  };

  const ActiveIconComponent = getPhaseIcon(activePhase.phase);
  const activeTheme = getPhaseTheme(activePhase.phase);

  return (
    <div className="space-y-10 py-6 font-sans" id="lifecycle-roadmap-container">
      {/* Page header */}
      <div className="space-y-4 border-b border-border pb-6">
        <div className="s-eyebrow">
          <Milestone className="h-4 w-4 mr-1" strokeWidth={1.75} />
          COACHING LIFECYCLE
        </div>
        <h2 className="text-2xl sm:text-4xl font-impact font-extrabold text-fg-1 tracking-tight">
          Lộ Trình Đồng Hành — 4 Giai Đoạn Phát Triển
        </h2>
        <p className="text-sm text-fg-2 max-w-4xl leading-relaxed">
          Chúng tôi không quản lý bạn bằng cách giao những đầu việc chi li không suy nghĩ. 
          Phương pháp **Coaching Lifecycle** huấn luyện bạn cách tự bơi, tự giải quyết vấn đề từ Khám phá cho đến Ship code thật. 
          Bốn giai đoạn phát triển dưới đây là khung hoạt động độc lập giúp bạn bứt phá.
        </p>
      </div>

      {/* Visual Timeline Progressive Bar */}
      <div className="relative rounded-2xl border border-border bg-bg-warm p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Horizontal Line for Desktop progress */}
        <div className="hidden md:block absolute top-[4.2rem] left-16 right-16 h-0.5 bg-border-hover -z-10">
          <div
            className="h-full bg-brand transition-all duration-500 ease-out"
            style={{ width: `${getPhaseProgressPercent() - 12}%` }}
          />
        </div>

        {/* Phase Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10" id="roadmap-flow-grid">
          {COACHING_LIFECYCLE_DATA.map((item, idx) => {
            const PhaseIcon = getPhaseIcon(item.phase);
            const isSelected = idx === activePhaseIndex;
            const isCompleted = idx < activePhaseIndex;
            const itemTheme = getPhaseTheme(item.phase);

            return (
              <button
                key={item.phase}
                id={`roadmap-node-${idx}`}
                onClick={() => setActivePhaseIndex(idx)}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 relative ${
                  isSelected
                    ? `${itemTheme.bgLight} ${itemTheme.borderActive} shadow-md ring-1 ${itemTheme.glowActive}`
                    : isCompleted
                    ? 'bg-mint/5 border-mint/30 text-mint-deep dark:text-mint'
                    : 'bg-bg border-border text-fg-3 hover:bg-bg-muted hover:border-brand/30'
                }`}
              >
                {/* Phase state icon */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border mb-3 transition-transform duration-300 ${
                    isSelected
                      ? `${itemTheme.iconGradient} scale-110 shadow-lg`
                      : isCompleted
                      ? 'bg-mint/10 text-mint-deep dark:text-mint border-mint/30'
                      : 'bg-bg-muted text-fg-3 border-border-hover'
                  }`}
                >
                  {isCompleted ? <Check className="h-4.5 w-4.5" strokeWidth={2} /> : <PhaseIcon className="h-4.5 w-4.5" strokeWidth={1.75} />}
                </div>

                <div className="space-y-1">
                  <span className={`font-mono text-[9px] uppercase tracking-widest block font-bold ${isSelected ? itemTheme.accentColor : isCompleted ? 'text-mint-deep dark:text-mint' : 'text-fg-3'}`}>
                    {item.phase}
                  </span>
                  <span className={`font-impact text-xs font-bold block ${isSelected ? 'text-fg-1' : 'text-fg-2'}`}>
                    {item.title.split(' ')[0]}
                  </span>
                  <span className="font-mono text-[9px] text-fg-3 block font-bold">
                    {item.time.split('•')[0]}
                  </span>
                </div>

                {/* Arrow helper for desktop */}
                {idx < 3 && (
                  <ChevronRight strokeWidth={1.75} className={`hidden md:block absolute -right-3 top-10 h-5 w-5 ${isCompleted ? 'text-brand' : 'text-border-hover'}`} />
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
          <div className="rounded-xl border border-border bg-bg-warm p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center space-x-3 border-b border-border pb-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${activeTheme.bgMedium} ${activeTheme.accentColor} border ${activeTheme.border}`}>
                <ActiveIconComponent className="h-5.5 w-5.5" strokeWidth={1.75} />
              </div>
              <div>
                <span className={`font-mono text-[10px] uppercase font-bold ${activeTheme.accentColor} tracking-wider block mb-1`}>
                  MỤC TIÊU CHI TIẾT — {activePhase.phase}
                </span>
                <h3 className="font-impact text-xl font-bold text-fg-1">{activePhase.title}</h3>
              </div>
            </div>

            {/* Time label block */}
            <div className="rounded-lg bg-bg-muted border border-border px-4 py-2.5 inline-flex items-center space-x-2">
              <span className={`h-2 w-2 rounded-full ${activeTheme.dot} animate-pulse`} />
              <span className="font-mono text-xs text-fg-1 font-bold">{activePhase.time}</span>
            </div>

            {/* Objectives bullets */}
            <div className="space-y-3 pt-2">
              <ul className="space-y-4">
                {activePhase.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start text-xs text-fg-2 leading-relaxed font-medium">
                    <span className={`mr-3 mt-1.5 flex h-2 w-2 shrink-0 rounded-full ${activeTheme.dot}`} />
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
          <div className="rounded-xl border border-border bg-bg-warm p-6 space-y-4 shadow-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-fg-3 font-bold block border-b border-border pb-2">
              COACHING FOCUS (TẦM NHÌN HUẤN LUYỆN)
            </span>
            <div className="space-y-3.5 pt-1">
              {activePhase.coachingFocus.map((focus, idx) => {
                const isPO = focus.startsWith('Product') || focus.startsWith('PO');
                return (
                  <div key={idx} className="rounded-lg bg-bg-muted border border-border p-3 space-y-1">
                    <span className={`font-mono text-[9px] uppercase font-bold ${isPO ? 'text-iris-deep dark:text-iris' : 'text-brand'}`}>
                      {isPO ? 'PO COACH FOCUS' : 'TECH LEAD COACH FOCUS'}
                    </span>
                    <p className="font-sans text-xs text-fg-2 leading-relaxed">
                      {isPO 
                        ? focus.replace('Product Owner (PO) hỗ trợ: ', '').replace('PO hỗ trợ: ', '') 
                        : focus.replace('Tech Lead hỗ trợ: ', '')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkpoints Checklist */}
          <div className="rounded-xl border border-mint/20 bg-mint/5 p-6 space-y-4">
            <div className="flex items-center space-x-2 text-mint-deep dark:text-mint border-b border-mint/20 pb-2">
              <Flag className="h-4.5 w-4.5" strokeWidth={1.75} />
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
                CHECKPOINT NGHIỆM THU GIAI ĐOẠN
              </span>
            </div>
            <div className="space-y-3 text-[11px] text-fg-2 font-medium">
              Đạt những mốc cứng dưới đây để tiến tục mở khóa giai đoạn phát triển kế tiếp:
            </div>
            <ul className="space-y-3">
              {activePhase.checkpoints.map((checkpoint, idx) => (
                <li key={idx} className="flex items-start text-xs text-fg-2 bg-bg border border-mint/10 rounded-lg p-2.5 space-x-2.5 shadow-sm">
                  <Check className="h-4 w-4 text-mint-deep dark:text-mint bg-mint/10 rounded-full border border-mint/20 p-0.5 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="leading-relaxed font-medium">{checkpoint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
