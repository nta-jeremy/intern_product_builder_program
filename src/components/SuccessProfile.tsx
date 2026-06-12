import { useState } from 'react';
import { Award, BookOpenCheck, CheckCircle2, CircleHelp, Star } from 'lucide-react';
import { COMPETENCY_LEVELS, JOURNAL_TEMPLATES, SUCCESS_PROFILE_DATA } from '../data';
import type { CompetencyLevel } from '../types';

const levelClasses: Record<CompetencyLevel, string> = {
  1: 'border-gap/30 bg-gap/10 text-gap',
  2: 'border-gold/30 bg-gold/10 text-gold-deep',
  3: 'border-iris/30 bg-iris/10 text-iris-deep',
  4: 'border-brand/30 bg-brand/10 text-brand',
};

export default function SuccessProfile() {
  const [selectedProfile, setSelectedProfile] = useState(SUCCESS_PROFILE_DATA[0].key);
  const [selfRatings, setSelfRatings] = useState<Record<string, CompetencyLevel | undefined>>({});

  const currentItem = SUCCESS_PROFILE_DATA.find((item) => item.key === selectedProfile) ?? SUCCESS_PROFILE_DATA[0];
  const ratedValues = Object.values(selfRatings).filter((value): value is CompetencyLevel => value !== undefined);
  const average = ratedValues.length > 0
    ? ratedValues.reduce((sum, value) => sum + value, 0) / ratedValues.length
    : undefined;

  const focusCompetency = SUCCESS_PROFILE_DATA
    .filter((item) => selfRatings[item.key] !== undefined)
    .sort((a, b) => (selfRatings[a.key] ?? 5) - (selfRatings[b.key] ?? 5))[0];

  const templateNames = new Map(JOURNAL_TEMPLATES.map((template) => [template.id, template.title]));

  return (
    <div className="py-6" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-10)' }} id="success-profile-container">
      <section className="relative overflow-hidden border border-border bg-bg-warm p-6 sm:p-8" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-rest)' }}>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="s-eyebrow">
            <Star className="mr-1 h-4 w-4" strokeWidth={1.75} />
            TIÊU CHÍ THÀNH CÔNG CỦA THỰC TẬP SINH
          </div>
          <h2 className="text-fg-1 leading-tight" style={{ font: 'var(--type-h2)', letterSpacing: '-0.018em' }}>
            Năm năng lực để giải quyết vấn đề và tạo sản phẩm mẫu
          </h2>
          <p style={{ font: 'var(--type-body-sm)', color: 'var(--fg-2)', lineHeight: '1.7' }}>
            Khung này giúp thực tập sinh hiểu kỳ vọng, tự đánh giá và chọn bằng chứng cần ghi lại.
            Chuẩn đầu ra là một sản phẩm mẫu có thể trình diễn, có phản hồi người dùng, đáp ứng tiêu chí nghiệm thu
            và được Hội đồng thẩm định xác nhận.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-4">
          <div className="yds-card-warm p-5 space-y-4">
            <span className="block border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wider text-fg-3">
              Bộ 5 năng lực cốt lõi
            </span>
            <div className="flex flex-col gap-2">
              {SUCCESS_PROFILE_DATA.map((item) => {
                const selected = item.key === selectedProfile;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedProfile(item.key)}
                    aria-pressed={selected}
                    className={`flex cursor-pointer items-start border p-3 text-left transition-all ${
                      selected
                        ? 'border-brand/30 bg-brand/5 text-fg-1'
                        : 'border-transparent text-fg-3 hover:bg-bg-muted hover:text-fg-2'
                    }`}
                    style={{ borderRadius: 'var(--radius-sm)', boxShadow: selected ? 'var(--shadow-rest)' : 'none' }}
                  >
                    <span className={`mr-3 mt-1.5 h-2 w-2 shrink-0 rounded-full ${selected ? 'bg-brand shadow-glow' : 'bg-border-hover'}`} />
                    <span>
                      <span className="block text-xs font-bold tracking-wide">{item.dimension}</span>
                      <span className="mt-0.5 block line-clamp-2 text-[11px] text-fg-3">{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="yds-card-warm p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-fg-3">Tự đánh giá nhanh</span>
              <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-bold text-brand">
                {ratedValues.length}/5
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-fg-3">
              Chọn mức gần nhất với bằng chứng hiện có. Đây là tự đánh giá để định hướng học tập, không phải điểm của Hội đồng.
            </p>

            <div className="space-y-5">
              {SUCCESS_PROFILE_DATA.map((item) => {
                const rating = selfRatings[item.key];
                return (
                  <fieldset key={item.key} className="space-y-2">
                    <legend className="w-full text-xs font-semibold text-fg-2">
                      <span className="flex items-center justify-between gap-3">
                        <span>{item.dimension}</span>
                        <span className="text-[10px] font-normal text-fg-3">
                          {rating ? COMPETENCY_LEVELS[rating - 1].label : 'Chưa tự đánh giá'}
                        </span>
                      </span>
                    </legend>
                    <div className="grid grid-cols-4 gap-1.5">
                      {COMPETENCY_LEVELS.map((level) => (
                        <button
                          key={level.level}
                          type="button"
                          onClick={() => setSelfRatings((previous) => ({ ...previous, [item.key]: level.level }))}
                          aria-label={`${item.dimension}: mức ${level.level} - ${level.label}`}
                          aria-pressed={rating === level.level}
                          title={`${level.label}: ${level.description}`}
                          className={`min-h-9 border text-xs font-bold transition-all ${
                            rating === level.level
                              ? levelClasses[level.level]
                              : 'border-border bg-bg text-fg-3 hover:border-border-hover hover:bg-bg-muted'
                          }`}
                          style={{ borderRadius: 'var(--radius-sm)' }}
                        >
                          {level.level}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <div className="border border-border bg-bg-muted p-3 text-xs text-fg-3" style={{ borderRadius: 'var(--radius-sm)' }}>
              {average === undefined ? (
                <p>Chưa có kết quả. Hãy chọn một mức để bắt đầu tự soi chiếu.</p>
              ) : (
                <div className="space-y-1.5">
                  <p className="font-semibold text-fg-1">Trung bình các mục đã đánh giá: {average.toFixed(1)}/4</p>
                  <p>
                    Năng lực nên tập trung trước: <strong className="text-fg-2">{focusCompetency?.dimension}</strong>.
                    Hãy ghi một bằng chứng gần nhất vào sổ tay thực tập và trao đổi với người hướng dẫn nếu cần hỗ trợ.
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8">
          <article className="yds-card-warm min-h-[520px] p-6 sm:p-8 space-y-6">
            <header className="border-b border-border pb-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center border border-brand/20 bg-brand/10 text-brand" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <Award className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-fg-1 tracking-tight" style={{ font: 'var(--type-h3)' }}>{currentItem.dimension}</h3>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">Năng lực có thể quan sát</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-fg-2">{currentItem.description}</p>
              <p className="border-l-2 border-brand/30 pl-3 text-xs leading-relaxed text-fg-3">{currentItem.whyItMatters}</p>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <section className="border border-mint/20 bg-mint/5 p-5 space-y-4" style={{ borderRadius: 'var(--radius)' }}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mint-deep">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                  Hành vi có thể quan sát
                </div>
                <ul className="space-y-3">
                  {currentItem.observableBehaviors.map((behavior) => (
                    <li key={behavior} className="flex items-start text-xs leading-relaxed text-fg-2">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                      {behavior}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="border border-gold/20 bg-gold/5 p-5 space-y-4" style={{ borderRadius: 'var(--radius)' }}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-deep">
                  <CircleHelp className="h-4 w-4" strokeWidth={1.75} />
                  Dấu hiệu cần người hướng dẫn hỗ trợ
                </div>
                <ul className="space-y-3">
                  {currentItem.supportSignals.map((signal) => (
                    <li key={signal} className="flex items-start text-xs leading-relaxed text-fg-2">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="insight mt-0!">
              <div className="insight-label mb-3! flex items-center gap-2 text-[10px]!">
                <BookOpenCheck className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
                Bằng chứng nên ghi trong sổ tay thực tập
              </div>
              <div className="flex flex-wrap gap-2">
                {currentItem.evidenceTemplateIds.map((id) => (
                  <span key={id} className="border border-brand/20 bg-brand/5 px-2.5 py-1 text-[11px] font-medium text-brand" style={{ borderRadius: 'var(--radius-pill)' }}>
                    {templateNames.get(id)}
                  </span>
                ))}
              </div>
            </section>
          </article>
        </main>
      </div>
    </div>
  );
}
