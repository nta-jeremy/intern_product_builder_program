import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenCheck,
  Compass,
  Hammer,
  Milestone,
  Rocket,
  Sparkles,
  Target,
  CheckSquare,
} from 'lucide-react';
import { COACHING_LIFECYCLE_DATA, JOURNAL_TEMPLATES, SUCCESS_PROFILE_DATA } from '../data';
import type { LifecycleStep, LifecycleStepId } from '../types';

const stepIcons: Record<LifecycleStepId, typeof Compass> = {
  discover: Compass,
  build: Hammer,
  validate: CheckSquare,
  ship: Rocket,
  learn: Sparkles,
};

const stepOrderLabel: Record<LifecycleStepId, string> = {
  discover: '01',
  build: '02',
  validate: '03',
  ship: '04',
  learn: '05',
};

function collectEvidence(steps: LifecycleStep[]) {
  return Array.from(new Set(steps.flatMap((step) => step.evidenceTemplateIds)));
}

export default function CoachingLifecycleDetail() {
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);

  const activeMonth = COACHING_LIFECYCLE_DATA[activeMonthIndex];
  const competencyNames = new Map(SUCCESS_PROFILE_DATA.map((item) => [item.key, item.dimension]));
  const journalNames = new Map(JOURNAL_TEMPLATES.map((template) => [template.id, template.title]));
  const evidenceIds = collectEvidence(activeMonth.steps);

  return (
    <div className="py-6 font-sans" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-10)' }} id="lifecycle-roadmap-container">
      <header className="space-y-5 border-b border-border pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl space-y-5">
            <div className="s-eyebrow">
              <Milestone className="mr-1 h-4 w-4" strokeWidth={1.75} />
              COACHING LIFECYCLE DETAIL
            </div>
            <div className="space-y-3">
              <h2 className="text-fg-1" style={{ font: 'var(--type-h2)', letterSpacing: '-0.018em' }}>
                Bản tra cứu đầy đủ cho cả ba vòng coaching
              </h2>
              <p className="text-sm leading-relaxed text-fg-2">
                Đây là view chi tiết để so sánh competency, evidence, monthly gate và coaching cadence của từng tháng.
                Nếu cần nhìn nhanh mô hình ba vòng và chọn node đang học, bạn có thể quay lại Progressive Spiral.
              </p>
            </div>
          </div>

          <Link
            to="/lifecycle"
            className="cta cta-secondary cta-sm group"
            style={{ minHeight: '44px', padding: '0 16px', borderRadius: 'var(--radius)' }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.75} />
            <span>Quay lại Progressive Spiral</span>
          </Link>
        </div>
      </header>

      <section className="border border-border bg-bg-warm p-5 sm:p-6" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-rest)' }}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">Month selector</span>
            <p className="mt-1 text-xs leading-relaxed text-fg-3">Chọn một tháng để xem vòng học, năng lực mục tiêu và evidence cần có.</p>
          </div>
          <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 font-mono text-[10px] font-bold text-brand">
            3 tháng · 5 bước lặp
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {COACHING_LIFECYCLE_DATA.map((month, index) => {
            const selected = index === activeMonthIndex;
            return (
              <button
                key={month.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveMonthIndex(index)}
                className={`min-h-11 border p-4 text-left transition-all ${
                  selected
                    ? 'border-brand bg-brand/8 text-fg-1 shadow-sm'
                    : 'border-border bg-bg text-fg-2 hover:border-brand/30 hover:bg-bg-muted'
                }`}
                style={{ borderRadius: 'var(--radius)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${selected ? 'text-brand' : 'text-fg-3'}`}>
                      Tháng {month.month}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-fg-1">{month.title}</h3>
                  </div>
                  <span className="rounded-full border border-border-hover bg-bg-muted px-2 py-1 font-mono text-[10px] font-bold text-fg-2">
                    Level {month.targetLevel}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-fg-3">{month.autonomy}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <article className="yds-card-warm p-6 sm:p-8">
            <div className="border-b border-border pb-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center border border-brand/20 bg-brand/10 text-brand" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <Target className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
                    Tháng {activeMonth.month} · {activeMonth.title}
                  </span>
                  <h3 className="mt-1 text-fg-1" style={{ font: 'var(--type-h3)' }}>
                    {activeMonth.summary}
                  </h3>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-fg-2">{activeMonth.autonomy}</p>
            </div>

            <div className="mt-6 space-y-4">
              {activeMonth.steps.map((step) => {
                const StepIcon = stepIcons[step.id];
                return (
                  <article key={step.id} className="border border-border bg-bg p-4 sm:p-5" style={{ borderRadius: 'var(--radius)' }}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/15 bg-brand/5 text-brand" style={{ borderRadius: 'var(--radius-sm)' }}>
                        <StepIcon className="h-4.5 w-4.5" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
                            {stepOrderLabel[step.id]} · {step.title}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-semibold leading-relaxed text-fg-1">{step.question}</p>
                        <ul className="mt-4 space-y-2.5">
                          {step.actions.map((action) => (
                            <li key={action} className="flex items-start text-xs leading-relaxed text-fg-2">
                              <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {step.evidenceTemplateIds.map((evidenceId) => (
                            <span
                              key={evidenceId}
                              className="rounded-full border border-brand/15 bg-brand/5 px-2.5 py-1 text-[10px] font-medium text-brand"
                            >
                              {journalNames.get(evidenceId)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <section className="yds-card-warm p-6">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <BookOpenCheck className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">
                Năng lực mục tiêu
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {activeMonth.competencyTargets.map((target) => (
                <article key={target.competencyId} className="border border-border bg-bg p-3.5" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-semibold leading-relaxed text-fg-1">
                      {competencyNames.get(target.competencyId)}
                    </h4>
                    <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-bold text-brand">
                      Level {target.targetLevel}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-fg-3">{target.focus}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border border-mint/20 bg-mint/5 p-6" style={{ borderRadius: 'var(--radius)' }}>
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-mint-deep">
              Evidence cần có trong tháng
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {evidenceIds.map((evidenceId) => (
                <span
                  key={evidenceId}
                  className="rounded-full border border-mint/20 bg-bg px-2.5 py-1 text-[10px] font-medium text-fg-2"
                >
                  {journalNames.get(evidenceId)}
                </span>
              ))}
            </div>
          </section>

          <section className="yds-card-warm p-6 space-y-5">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">Coaching cadence</span>
              <ul className="mt-3 space-y-2.5">
                {activeMonth.coachingCadence.map((item) => (
                  <li key={item} className="flex items-start text-xs leading-relaxed text-fg-2">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">Monthly gate</span>
              <ul className="mt-3 space-y-2.5">
                {activeMonth.monthlyGate.map((item) => (
                  <li key={item} className="flex items-start text-xs leading-relaxed text-fg-2">
                    <ArrowUpRight className="mr-2 mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {activeMonth.futureSignals && activeMonth.futureSignals.length > 0 ? (
              <div className="border-t border-border pt-5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">
                  Tín hiệu phát triển tiếp theo
                </span>
                <ul className="mt-3 space-y-2.5">
                  {activeMonth.futureSignals.map((item) => (
                    <li key={item} className="flex items-start text-xs leading-relaxed text-fg-2">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>
      </section>

      <section className="insight mt-0!">
        <div className="insight-label">Kết luận</div>
        <div className="insight-body">
          Sau mỗi vòng, mục tiêu không phải “mở khóa phase tiếp theo” mà là tạo ra một prototype tốt hơn,
          một bộ bằng chứng rõ hơn và một Product Builder tự chủ hơn.
        </div>
      </section>
    </div>
  );
}
