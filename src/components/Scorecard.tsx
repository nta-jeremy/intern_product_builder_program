import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Info,
  ShieldCheck,
} from 'lucide-react';
import {
  COMPETENCY_LEVELS,
  ENTRY_SCORECARD_DATA,
  FINAL_SCORECARD_DATA,
  FINAL_SCORECARD_GATES,
  JOURNAL_TEMPLATES,
} from '../data';
import type {
  CompetencyLevel,
  ScorecardDefinition,
  ScorecardResultBand,
  ScorecardType,
} from '../types';

type RatingState = Record<ScorecardType, Record<string, CompetencyLevel | undefined>>;
type ExpandedState = Record<ScorecardType, Record<string, boolean>>;

const scorecards: Record<ScorecardType, ScorecardDefinition> = {
  entry: ENTRY_SCORECARD_DATA,
  final: FINAL_SCORECARD_DATA,
};

const levelClasses: Record<CompetencyLevel, string> = {
  1: 'border-gap/40 bg-gap/10 text-gap ring-1 ring-gap/20',
  2: 'border-gold/40 bg-gold/10 text-gold-deep ring-1 ring-gold/20',
  3: 'border-iris/40 bg-iris/10 text-iris-deep ring-1 ring-iris/20',
  4: 'border-brand/40 bg-brand/10 text-brand ring-1 ring-brand/20',
};

function getResultBand(definition: ScorecardDefinition, score: number): ScorecardResultBand {
  return definition.resultBands.find((band) => score >= band.minScore) ?? definition.resultBands.at(-1)!;
}

export default function Scorecard() {
  const [activeScorecard, setActiveScorecard] = useState<ScorecardType>('entry');
  const [ratings, setRatings] = useState<RatingState>({ entry: {}, final: {} });
  const [gateChecks, setGateChecks] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<ExpandedState>(() => ({
    entry: Object.fromEntries(ENTRY_SCORECARD_DATA.categories.map((category) => [category.id, true])),
    final: Object.fromEntries(FINAL_SCORECARD_DATA.categories.map((category) => [category.id, true])),
  }));

  const definition = scorecards[activeScorecard];
  const activeRatings = ratings[activeScorecard];
  const allCriteria = definition.categories.flatMap((category) => category.criteria);
  const ratedCount = allCriteria.filter((criterion) => activeRatings[criterion.id] !== undefined).length;
  const allRated = ratedCount === allCriteria.length;
  const allGatesChecked = FINAL_SCORECARD_GATES.every((gate) => gateChecks[gate.id]);
  const canConclude = allRated && (activeScorecard === 'entry' || allGatesChecked);

  const categoryScores = Object.fromEntries(
    definition.categories.map((category) => [
      category.id,
      category.criteria.reduce((sum, criterion) => {
        const level = activeRatings[criterion.id];
        return sum + (level ? (level / 4) * criterion.points : 0);
      }, 0),
    ]),
  );
  const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
  const roundedScore = Math.round(totalScore * 10) / 10;
  const resultBand = getResultBand(definition, roundedScore);
  const journalNames = new Map(JOURNAL_TEMPLATES.map((template) => [template.id, template.title]));

  const setRating = (criterionId: string, level: CompetencyLevel) => {
    setRatings((previous) => ({
      ...previous,
      [activeScorecard]: {
        ...previous[activeScorecard],
        [criterionId]: level,
      },
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((previous) => ({
      ...previous,
      [activeScorecard]: {
        ...previous[activeScorecard],
        [categoryId]: !previous[activeScorecard][categoryId],
      },
    }));
  };

  const selectScorecardFromKeyboard = (event: KeyboardEvent<HTMLButtonElement>, type: ScorecardType) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const nextType = type === 'entry' ? 'final' : 'entry';
    setActiveScorecard(nextType);
    event.currentTarget.parentElement
      ?.querySelector<HTMLButtonElement>(`#scorecard-tab-${nextType}`)
      ?.focus();
  };

  return (
    <div className="py-6 font-sans space-y-10" id="scorecard-app-container">
      <header className="border-b border-border pb-6 space-y-4">
        <div className="s-eyebrow">
          <Calculator className="mr-1 h-4 w-4" strokeWidth={1.75} />
          INTERN PRODUCT BUILDER SCORECARDS
        </div>
        <h2 className="text-fg-1" style={{ font: 'var(--type-h2)', letterSpacing: '-0.018em' }}>
          Chấm bằng chứng theo đúng thời điểm
        </h2>
        <p className="max-w-4xl text-sm leading-relaxed text-fg-2">
          Scorecard đầu vào đánh giá tiềm năng trước chương trình; Scorecard cuối kỳ đánh giá một prototype
          và quá trình tạo ra kết quả. Cả hai đều là đầu vào cho Hội đồng, không tự động quyết định tuyển dụng.
        </p>

        <div
          className="grid max-w-2xl grid-cols-2 gap-2 border border-border bg-bg-muted p-1.5"
          role="tablist"
          aria-label="Chọn loại scorecard"
          style={{ borderRadius: 'var(--radius)' }}
        >
          {(['entry', 'final'] as ScorecardType[]).map((type) => (
            <button
              key={type}
              type="button"
              role="tab"
              id={`scorecard-tab-${type}`}
              aria-controls={`scorecard-panel-${type}`}
              aria-selected={activeScorecard === type}
              tabIndex={activeScorecard === type ? 0 : -1}
              onClick={() => setActiveScorecard(type)}
              onKeyDown={(event) => selectScorecardFromKeyboard(event, type)}
              className={`px-4 py-2.5 text-xs font-bold transition-all ${
                activeScorecard === type
                  ? 'bg-bg-warm text-brand shadow-sm'
                  : 'text-fg-3 hover:text-fg-1'
              }`}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {type === 'entry' ? 'Đánh giá đầu vào' : 'Đánh giá cuối kỳ'}
            </button>
          ))}
        </div>

        <div
          id={`scorecard-panel-${activeScorecard}`}
          role="tabpanel"
          aria-labelledby={`scorecard-tab-${activeScorecard}`}
          className="max-w-4xl"
        >
          <h3 className="text-lg font-bold text-fg-1">{definition.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-fg-2">{definition.description}</p>
          <p className="mt-2 flex items-start gap-2 text-[11px] leading-relaxed text-fg-3">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
            {definition.audienceNote}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <main className="space-y-6 lg:col-span-8">
          {definition.categories.map((category, categoryIndex) => {
            const expanded = expandedCategories[activeScorecard][category.id];
            const categoryRated = category.criteria.filter((criterion) => activeRatings[criterion.id] !== undefined).length;
            return (
              <section key={category.id} className="overflow-hidden border border-border bg-bg-warm" style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-rest)' }}>
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between gap-4 border-b border-border bg-bg px-4 py-4 text-left transition-all hover:bg-bg-muted sm:px-6"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-brand/20 bg-brand/10 font-mono text-xs font-bold text-brand" style={{ borderRadius: 'var(--radius-sm)' }}>
                      {String(categoryIndex + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-fg-1">{category.name}</span>
                      <span className="mt-0.5 block text-[10px] leading-relaxed text-fg-3">{category.description}</span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="border border-border-hover bg-bg-muted px-2.5 py-1 font-mono text-[10px] font-bold text-brand" style={{ borderRadius: 'var(--radius-pill)' }}>
                      {categoryRated}/{category.criteria.length} · {categoryScores[category.id].toFixed(1)}/{category.points}đ
                    </span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-fg-3" /> : <ChevronDown className="h-4 w-4 text-fg-3" />}
                  </span>
                </button>

                {expanded && (
                  <div className="divide-y divide-border px-4 sm:px-6">
                    {category.criteria.map((criterion) => {
                      const currentLevel = activeRatings[criterion.id];
                      const currentPoints = currentLevel ? (currentLevel / 4) * criterion.points : 0;
                      return (
                        <article key={criterion.id} className="py-6 space-y-4">
                          <header className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                            <div>
                              <h4 className="text-xs font-bold text-fg-1">{criterion.name}</h4>
                              <p className="mt-1 text-[11px] leading-relaxed text-fg-3">{criterion.description}</p>
                            </div>
                            <span className="self-start border border-border-hover bg-bg-muted px-2.5 py-1 font-mono text-xs text-fg-2" style={{ borderRadius: 'var(--radius-xs)' }}>
                              <strong className="text-brand">{currentPoints.toFixed(1)}</strong> / {criterion.points}đ
                            </span>
                          </header>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {COMPETENCY_LEVELS.map((level) => {
                              const selected = currentLevel === level.level;
                              return (
                                <button
                                  key={level.level}
                                  type="button"
                                  onClick={() => setRating(criterion.id, level.level)}
                                  aria-pressed={selected}
                                  className={`group min-h-[150px] border p-3 text-left text-xs transition-all ${
                                    selected
                                      ? levelClasses[level.level]
                                      : 'border-border bg-bg text-fg-3 hover:border-border-hover hover:bg-bg-muted'
                                  }`}
                                  style={{ borderRadius: 'var(--radius-sm)' }}
                                >
                                  <span className="mb-2 flex items-start justify-between gap-2">
                                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider">
                                      {level.level}. {level.label}
                                    </span>
                                    <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-current' : 'border-border-hover'}`}>
                                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                                    </span>
                                  </span>
                                  <span className={`block text-[10px] leading-relaxed ${selected ? 'text-fg-1' : 'text-fg-3 group-hover:text-fg-2'}`}>
                                    {criterion.levels[level.level]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {criterion.evidenceTemplateIds.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-fg-3">Bằng chứng gợi ý:</span>
                              {criterion.evidenceTemplateIds.map((id) => (
                                <span key={id} className="border border-brand/15 bg-brand/5 px-2 py-0.5 text-[10px] text-brand" style={{ borderRadius: 'var(--radius-pill)' }}>
                                  {journalNames.get(id)}
                                </span>
                              ))}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </main>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
          <section className="yds-card-warm p-6 text-center space-y-6" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-fg-3">
                {allRated ? 'Tổng điểm' : 'Điểm tạm tính'}
              </span>
              <span className="mt-2 block text-4xl font-extrabold text-brand">{roundedScore}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-fg-3">trên 100 điểm</span>
            </div>

            <div className="border-y border-border py-3">
              <p className="text-xs font-semibold text-fg-1">Đã chấm {ratedCount}/{allCriteria.length} tiêu chí</p>
              <div className="mx-auto mt-2 h-1.5 max-w-48 overflow-hidden rounded-full bg-border">
                <div className="h-full bg-brand transition-all" style={{ width: `${(ratedCount / allCriteria.length) * 100}%` }} />
              </div>
            </div>

            {canConclude ? (
              <div className="space-y-2">
                <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-fg-3">Kết luận đánh giá</span>
                <div className="border border-brand/30 bg-brand/10 px-3 py-2 text-xs font-bold text-brand" style={{ borderRadius: 'var(--radius-sm)' }}>
                  {resultBand.label}
                </div>
                <p className="text-[11px] leading-relaxed text-fg-2">{resultBand.description}</p>
              </div>
            ) : (
              <div className="border border-border bg-bg-muted p-4 text-left" style={{ borderRadius: 'var(--radius)' }}>
                <p className="text-xs font-bold text-fg-1">Chưa đủ điều kiện kết luận</p>
                <p className="mt-1 text-[11px] leading-relaxed text-fg-3">
                  {!allRated
                    ? 'Cần chấm đủ mọi tiêu chí. Điểm hiện tại chỉ là tạm tính.'
                    : 'Điểm đã đủ nhưng các điều kiện bắt buộc cuối kỳ chưa được xác nhận.'}
                </p>
              </div>
            )}

            <p className="text-[10px] leading-relaxed text-fg-3">
              Không dùng tổng điểm như quyết định tuyển dụng tự động.
            </p>
          </section>

          {activeScorecard === 'final' && (
            <section className="border border-border bg-bg-warm p-5 space-y-4" style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-rest)' }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-fg-1">Điều kiện bắt buộc</h3>
              </div>
              <p className="text-[11px] leading-relaxed text-fg-3">
                Hội đồng hoặc stakeholder cần đối chiếu bằng chứng trước khi đánh dấu.
              </p>
              <div className="space-y-3">
                {FINAL_SCORECARD_GATES.map((gate) => (
                  <label key={gate.id} className="flex cursor-pointer items-start gap-3 border border-border bg-bg p-3 hover:bg-bg-muted" style={{ borderRadius: 'var(--radius-sm)' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(gateChecks[gate.id])}
                      onChange={(event) => setGateChecks((previous) => ({ ...previous, [gate.id]: event.target.checked }))}
                      className="mt-0.5 h-4 w-4 accent-[var(--brand)]"
                    />
                    <span>
                      <span className="block text-[11px] font-semibold leading-relaxed text-fg-1">{gate.label}</span>
                      <span className="mt-1 block text-[10px] leading-relaxed text-fg-3">{gate.description}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className={`flex items-center gap-2 border p-3 text-[11px] font-semibold ${
                allGatesChecked
                  ? 'border-mint/30 bg-mint/10 text-mint-deep'
                  : 'border-gold/30 bg-gold/10 text-gold-deep'
              }`} style={{ borderRadius: 'var(--radius-sm)' }}>
                {allGatesChecked ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <ClipboardCheck className="h-4 w-4 shrink-0" />}
                {allGatesChecked ? 'Đã xác nhận đủ điều kiện bắt buộc' : 'Còn điều kiện chưa được xác nhận'}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
