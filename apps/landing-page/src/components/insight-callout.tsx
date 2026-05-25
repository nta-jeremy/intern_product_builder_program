interface InsightCalloutProps {
  label: string;
  body: React.ReactNode;
  accent?: "iris" | "gold" | "mint" | "rose";
}

export function InsightCallout({ label, body, accent = "iris" }: InsightCalloutProps) {
  const accentMap = {
    iris: "text-iris",
    gold: "text-gold-deep",
    mint: "text-mint-deep",
    rose: "text-rose-deep",
  };

  return (
    <div className="insight">
      <div className="insight-label">{label}</div>
      <div className="insight-body">
        {body}
        <em className={`${accentMap[accent]} font-[var(--font-serif)] italic font-bold`}>
          &nbsp;AI-Native fashion leader
        </em>
      </div>
    </div>
  );
}
