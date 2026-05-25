import { InsightCallout } from "./insight-callout";

interface SectionTemplateProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  insight?: { label: string; body: React.ReactNode; accent?: "iris" | "gold" | "mint" | "rose" };
  accent?: "iris" | "gold" | "mint" | "rose";
  className?: string;
  bg?: "default" | "mist" | "warm" | "ink";
}

export function SectionTemplate({
  eyebrow,
  title,
  subtitle,
  children,
  insight,
  accent = "iris",
  className = "",
  bg = "default",
}: SectionTemplateProps) {
  const bgMap = {
    default: "bg-bg",
    mist: "bg-bg-2",
    warm: "bg-bg-warm",
    ink: "bg-bg-ink text-fg-on-brand",
  };

  const eyebrowTone = {
    iris: "text-iris-deep",
    gold: "text-gold-deep",
    mint: "text-mint-deep",
    rose: "text-rose-deep",
  };

  return (
    <section className={`py-24 md:py-32 ${bgMap[bg]} ${className}`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-14">
        {/* Eyebrow */}
        <div className={`s-eyebrow ${eyebrowTone[accent]}`}>
          {eyebrow}
        </div>

        {/* Title */}
        <h2 className="h1 mt-6 max-w-[920px]">{title}</h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-4 max-w-[720px] text-fg-2" style={{ fontSize: "21px", lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}

        {/* Content blocks */}
        <div className="mt-14">{children}</div>

        {/* Insight callout */}
        {insight && (
          <InsightCallout
            label={insight.label}
            body={insight.body}
            accent={insight.accent || accent}
          />
        )}
      </div>
    </section>
  );
}
