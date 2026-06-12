import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenCheck,
  Compass,
  Hammer,
  Milestone,
  Orbit,
  Rocket,
  Sparkles,
  CheckSquare,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { COACHING_LIFECYCLE_DATA, JOURNAL_TEMPLATES, SUCCESS_PROFILE_DATA } from '../data';
import type { LifecycleStepId } from '../types';

type Point = {
  left: string;
  top: string;
};

const stepIcons: Record<LifecycleStepId, typeof Compass> = {
  discover: Compass,
  build: Hammer,
  validate: CheckSquare,
  ship: Rocket,
  learn: Sparkles,
};

const spiralNodePositions: Record<number, Record<LifecycleStepId, Point>> = {
  1: {
    discover: { left: '31%', top: '49%' },
    build: { left: '47%', top: '35%' },
    validate: { left: '64%', top: '40%' },
    ship: { left: '62%', top: '60%' },
    learn: { left: '43%', top: '69%' },
  },
  2: {
    discover: { left: '20%', top: '39%' },
    build: { left: '38%', top: '21%' },
    validate: { left: '68%', top: '27%' },
    ship: { left: '79%', top: '56%' },
    learn: { left: '50%', top: '81%' },
  },
  3: {
    discover: { left: '8%', top: '31%' },
    build: { left: '35%', top: '8%' },
    validate: { left: '77%', top: '13%' },
    ship: { left: '89%', top: '52%' },
    learn: { left: '59%', top: '88%' },
  },
};

export default function CoachingLifecycle() {
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [activeStepId, setActiveStepId] = useState<LifecycleStepId>('discover');
  const reduceMotion = useReducedMotion();

  const competencyNames = new Map(SUCCESS_PROFILE_DATA.map((item) => [item.key, item.dimension]));
  const journalNames = new Map(JOURNAL_TEMPLATES.map((template) => [template.id, template.title]));
  const activeMonth = COACHING_LIFECYCLE_DATA[activeMonthIndex];
  const activeStep = activeMonth.steps.find((step) => step.id === activeStepId) ?? activeMonth.steps[0];

  const accessibleSummary = useMemo(
    () =>
      COACHING_LIFECYCLE_DATA.map((month) => ({
        title: `Tháng ${month.month} - ${month.title}`,
        steps: month.steps.map((step) => `${step.title}: ${step.question}`),
      })),
    [],
  );

  const selectMonth = (index: number) => {
    setActiveMonthIndex(index);
    setActiveStepId(COACHING_LIFECYCLE_DATA[index].steps[0].id);
  };

  const selectStep = (stepId: LifecycleStepId) => {
    setActiveStepId(stepId);
  };

  return (
    <div className="py-6 font-sans" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-10)' }}>
      <header className="space-y-5 border-b border-border pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl space-y-5">
            <div className="s-eyebrow">
              <Milestone className="mr-1 h-4 w-4" strokeWidth={1.75} />
              VÒNG LẶP PHÁT LẶP TRIỂN
            </div>
            <div className="space-y-3">
              <h2 className="text-fg-1" style={{ font: 'var(--type-h2)', letterSpacing: '-0.018em' }}>
                Ba vòng lặp phát triển với mức tự chủ tăng dần
              </h2>
              <p className="text-sm leading-relaxed text-fg-2">
                Mỗi tháng đi qua năm bước Tìm hiểu → Xây dựng → Kiểm chứng → Đưa vào sử dụng → Rút kinh nghiệm.
                Chọn một tháng để xem đầy đủ năm bước và theo dõi quá trình phát triển từ vòng trong ra vòng ngoài.
              </p>
            </div>
          </div>

          <Link
            to="/lifecycle-detail"
            className="cta cta-secondary cta-sm group"
            style={{ minHeight: '44px', padding: '0 16px', borderRadius: 'var(--radius)' }}
          >
            <span>Xem bản chi tiết đầy đủ</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
          </Link>
        </div>
      </header>

      <div className="sr-only">
        <h3>Tóm tắt ba vòng lặp phát triển</h3>
        <ul>
          {accessibleSummary.map((month) => (
            <li key={month.title}>
              {month.title}
              <ul>
                {month.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <section className="hidden xl:grid xl:grid-cols-12 xl:gap-10">
        <div className="xl:col-span-8">
          <div className="relative overflow-hidden border border-border bg-bg-warm p-6 xl:p-7" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-rest)' }}>
            {/* Month tabs */}
            <div className="mb-6 flex gap-2">
              {COACHING_LIFECYCLE_DATA.map((month, index) => {
                const selected = index === activeMonthIndex;
                return (
                  <button
                    key={month.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectMonth(index)}
                    className={`flex-1 min-h-11 border p-3 text-center transition-all ${
                      selected
                        ? 'border-brand bg-brand/8 text-fg-1 shadow-sm'
                        : 'border-border bg-bg text-fg-2 hover:border-brand/30 hover:bg-bg-muted'
                    }`}
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${selected ? 'text-brand' : 'text-fg-3'}`}>
                      Tháng {month.month}
                    </span>
                    <h3 className={`mt-1 text-sm font-bold ${selected ? 'text-fg-1' : 'text-fg-2'}`}>{month.title}</h3>
                  </button>
                );
              })}
            </div>

            {/* Spiral + Step cards */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left: Spiral */}
              <div className="col-span-7 relative h-[520px]">
                <svg
                  viewBox="0 0 900 760"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  role="img"
                  aria-labelledby="spiral-title spiral-desc"
                >
                  <title id="spiral-title">Ba vòng lặp phát triển trong ba tháng</title>
                  <desc id="spiral-desc">Ba vòng tháng 1, tháng 2, tháng 3 mở rộng dần. Mỗi vòng có năm bước Tìm hiểu, Xây dựng, Kiểm chứng, Đưa vào sử dụng và Rút kinh nghiệm.</desc>
                  <ellipse cx="430" cy="390" rx="118" ry="92" fill="none" stroke="rgba(42,43,134,0.14)" strokeWidth="2" aria-hidden="true" />
                  <ellipse cx="430" cy="390" rx="230" ry="182" fill="none" stroke="rgba(42,43,134,0.12)" strokeWidth="2" aria-hidden="true" />
                  <ellipse cx="430" cy="390" rx="340" ry="286" fill="none" stroke="rgba(42,43,134,0.1)" strokeWidth="2" aria-hidden="true" />
                  <path d="M132 248 C230 160, 340 154, 430 240" fill="none" stroke="rgba(252,175,22,0.42)" strokeDasharray="6 12" aria-hidden="true" />
                  <path d="M430 240 C552 336, 664 318, 742 212" fill="none" stroke="rgba(252,175,22,0.42)" strokeDasharray="6 12" aria-hidden="true" />
                  <path d="M742 212 C830 346, 814 570, 618 652" fill="none" stroke="rgba(252,175,22,0.42)" strokeDasharray="6 12" aria-hidden="true" />
                </svg>

                {COACHING_LIFECYCLE_DATA.flatMap((month, monthIndex) => {
                  const monthSelected = monthIndex === activeMonthIndex;
                  return month.steps.map((step) => {
                    const position = spiralNodePositions[month.month][step.id];
                    const active = monthSelected && step.id === activeStepId;
                    return (
                      <button
                        key={`${month.id}-${step.id}`}
                        type="button"
                        onClick={() => {
                          selectMonth(monthIndex);
                          selectStep(step.id);
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: position.left, top: position.top }}
                        aria-label={`${step.title} - Tháng ${month.month}`}
                      >
                        <span
                          className={`relative flex items-center justify-center rounded-full border transition-all ${
                            active
                              ? 'border-gold/40 bg-gold/15'
                              : monthSelected
                                ? 'border-brand/30 bg-bg/96'
                                : 'border-brand/15 bg-bg/90'
                          }`}
                          style={{
                            width: active ? '24px' : monthSelected ? '20px' : '14px',
                            height: active ? '24px' : monthSelected ? '20px' : '14px',
                            zIndex: active ? 4 : 3,
                          }}
                          aria-hidden="true"
                        >
                          <span
                            className={`rounded-full ${active ? 'bg-gold' : monthSelected ? 'bg-brand' : 'bg-brand/50'}`}
                            style={{ width: active ? '10px' : '6px', height: active ? '10px' : '6px' }}
                          />
                        </span>
                      </button>
                    );
                  });
                })}
              </div>

              {/* Right: Step cards */}
              <div className="col-span-5 flex flex-col gap-3">
                <div className="mb-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
                    Tháng {activeMonth.month} · {activeMonth.title}
                  </span>
                  <p className="mt-1 text-xs text-fg-3">{activeMonth.autonomy}</p>
                </div>
                {activeMonth.steps.map((step, stepIndex) => {
                  const StepIcon = stepIcons[step.id];
                  const active = step.id === activeStepId;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => selectStep(step.id)}
                      className={`flex min-h-11 w-full items-start gap-3 border p-3 text-left transition-all ${
                        active
                          ? 'border-brand bg-brand/8 text-fg-1 shadow-sm'
                          : 'border-border bg-bg text-fg-2 hover:border-brand/30 hover:bg-bg-muted'
                      }`}
                      style={{ borderRadius: 'var(--radius)' }}
                      aria-pressed={active}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${active ? 'border-brand/20 bg-brand/10 text-brand' : 'border-border-hover bg-bg-muted text-fg-3'}`}>
                        <StepIcon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0">
                        <span className={`block font-mono text-[9px] font-bold uppercase tracking-widest ${active ? 'text-brand' : 'text-fg-3'}`}>
                          {String(stepIndex + 1).padStart(2, '0')} · {step.title}
                        </span>
                        <span className={`block text-xs font-semibold leading-snug ${active ? 'text-fg-1' : 'text-fg-2'}`}>
                          {step.question}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 border-t border-border/70 pt-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
                <p className="max-w-3xl text-xs leading-relaxed text-fg-3">
                  Chọn tháng để xem quỹ đạo phát triển. Nhấn vào một điểm trên vòng hoặc chọn bước bên phải để xem chi tiết.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-4 xl:sticky xl:top-6 self-start">
          <article className="yds-card-warm p-6 sm:p-7">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
              Chi tiết bước · Tháng {activeMonth.month}
            </span>
            <h3 className="mt-2 text-fg-1" style={{ font: 'var(--type-h3)' }}>
              {activeMonth.title} · {activeStep.title}
            </h3>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeMonth.id}-${activeStep.id}`}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{activeStep.question}</p>

                <div className="mt-6 min-h-[420px] space-y-5">
                  <section>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">Hành động</span>
                    <ul className="mt-3 space-y-2.5">
                      {activeStep.actions.map((action) => (
                        <li key={action} className="flex items-start text-xs leading-relaxed text-fg-2">
                          <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">Năng lực liên quan</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeStep.competencyIds.map((competencyId) => (
                        <span key={competencyId} className="rounded-full border border-brand/15 bg-brand/5 px-2.5 py-1 text-[10px] font-medium text-brand">
                          {competencyNames.get(competencyId)}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2">
                      <BookOpenCheck className="h-4 w-4 text-brand" strokeWidth={1.75} />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">Bằng chứng và hỗ trợ</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeStep.evidenceTemplateIds.map((evidenceId) => (
                        <span key={evidenceId} className="rounded-full border border-mint/20 bg-mint/5 px-2.5 py-1 text-[10px] font-medium text-fg-2">
                          {journalNames.get(evidenceId)}
                        </span>
                      ))}
                    </div>
                    <ul className="mt-4 space-y-2.5">
                      {activeMonth.coachingCadence.map((item) => (
                        <li key={item} className="flex items-start text-xs leading-relaxed text-fg-2">
                          <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </motion.div>
            </AnimatePresence>
          </article>

          <section className="yds-card-warm p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand/20 bg-brand/10 text-brand" style={{ borderRadius: 'var(--radius-sm)' }}>
                <Orbit className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">Cần xem bảng đầy đủ?</span>
                <p className="mt-2 text-xs leading-relaxed text-fg-2">
                  Bản chi tiết giúp so sánh cả ba tháng, năng lực mục tiêu, điều kiện hoàn thành tháng và bằng chứng mà không phải đổi bước liên tục.
                </p>
                <Link to="/lifecycle-detail" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-brand hover:text-brand-light">
                  Mở bản chi tiết
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="space-y-6 xl:hidden">
        <div className="yds-card-warm p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Giao diện trên điện thoại</span>
              <p className="mt-2 text-xs leading-relaxed text-fg-3">
                Các bước được xếp thành từng thẻ để nhãn dễ đọc, vùng nhấn đủ lớn và không phải cuộn ngang.
              </p>
            </div>
            <Link
              to="/lifecycle-detail"
              className="cta cta-secondary cta-sm"
              style={{ minHeight: '44px', padding: '0 14px', borderRadius: 'var(--radius)' }}
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {COACHING_LIFECYCLE_DATA.map((month, monthIndex) => (
          <article key={month.id} className="yds-card-warm p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Tháng {month.month}</span>
                <h3 className="mt-1 text-fg-1" style={{ font: 'var(--type-h3)' }}>{month.title}</h3>
              </div>
              <button
                type="button"
                aria-pressed={monthIndex === activeMonthIndex}
                onClick={() => selectMonth(monthIndex)}
                className={`min-h-11 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
                  monthIndex === activeMonthIndex
                    ? 'border-brand bg-brand text-white'
                    : 'border-border bg-bg text-fg-2'
                }`}
              >
                Chọn tháng
              </button>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-fg-3">{month.autonomy}</p>

            <div className="mt-4 space-y-2.5">
              {month.steps.map((step) => {
                const StepIcon = stepIcons[step.id];
                const active = monthIndex === activeMonthIndex && step.id === activeStepId;
                return (
                  <button
                    key={`${month.id}-${step.id}`}
                    type="button"
                    onClick={() => {
                      selectMonth(monthIndex);
                      setActiveStepId(step.id);
                    }}
                    className={`flex min-h-11 w-full items-start gap-3 border p-3 text-left transition-all ${
                      active
                        ? 'border-brand bg-brand/8 text-fg-1'
                        : 'border-border bg-bg text-fg-2'
                    }`}
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${active ? 'border-brand/20 bg-brand/10 text-brand' : 'border-border-hover bg-bg-muted text-fg-3'}`}>
                      <StepIcon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span>
                      <span className={`block font-mono text-[10px] font-bold uppercase tracking-widest ${active ? 'text-brand' : 'text-fg-3'}`}>
                        {step.title}
                      </span>
                      <span className="mt-1 block text-xs font-semibold leading-relaxed">{step.question}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </article>
        ))}

        <article className="yds-card-warm p-5 sm:p-6">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
            Chi tiết đang xem · Tháng {activeMonth.month}
          </span>
          <h3 className="mt-2 text-fg-1" style={{ font: 'var(--type-h3)' }}>
            {activeStep.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-2">{activeStep.question}</p>
          <ul className="mt-4 space-y-2.5">
            {activeStep.actions.map((action) => (
              <li key={action} className="flex items-start text-xs leading-relaxed text-fg-2">
                <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {action}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeStep.competencyIds.map((competencyId) => (
              <span key={competencyId} className="rounded-full border border-brand/15 bg-brand/5 px-2.5 py-1 text-[10px] font-medium text-brand">
                {competencyNames.get(competencyId)}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeStep.evidenceTemplateIds.map((evidenceId) => (
              <span key={evidenceId} className="rounded-full border border-mint/20 bg-mint/5 px-2.5 py-1 text-[10px] font-medium text-fg-2">
                {journalNames.get(evidenceId)}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="insight mt-0!">
        <div className="insight-label">Kết luận</div>
        <div className="insight-body">
          Ba vòng lặp phát triển cho thấy mỗi tháng không phải một giai đoạn rời rạc, mà là cùng một vòng học được thực hiện tốt hơn qua từng tháng.
        </div>
      </section>
    </div>
  );
}
