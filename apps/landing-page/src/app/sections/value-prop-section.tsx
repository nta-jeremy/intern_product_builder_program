"use client";

import { SectionTemplate } from "@/components/section-template";
import { RomanNumeral } from "@/components/roman-numeral";
import { Zap, Shield, TrendingUp } from "lucide-react";

const VALUE_PROPS = [
  {
    numeral: "I" as const,
    title: "Unified Supply Chain",
    description:
      "PHOENIX platform integrates PLM, APS, WMS, and TMS into a single operational view. Real-time inventory across 274 stores with 99.7% accuracy.",
    icon: Zap,
    metric: "99.7%",
    metricLabel: "Inventory accuracy",
  },
  {
    numeral: "II" as const,
    title: "Omnichannel Retail Engine",
    description:
      "UNICORN connects POS, OMS, and ERP for seamless customer experience. One profile, one cart, one loyalty program across all touchpoints.",
    icon: Shield,
    metric: "2.8K+",
    metricLabel: "Daily transactions",
  },
  {
    numeral: "III" as const,
    title: "AI-Native Innovation",
    description:
      "GLAUX drives AI×Performance, eLMS, YOAI, and intelligent automation. Predictive demand forecasting with 94% weekly accuracy.",
    icon: TrendingUp,
    metric: "94%",
    metricLabel: "Forecast accuracy",
  },
];

export function ValuePropSection() {
  return (
    <SectionTemplate
      eyebrow="VALUE PROPOSITION"
      title={
        <>
          Three platforms.{" "}
          <em className="em-accent iris">One mission.</em>
        </>
      }
      subtitle="YODY ITDX unifies supply chain, retail operations, and AI innovation under a single governance framework."
      insight={{
        label: "Insight",
        body: (
          <>
            <strong>Unified digital infrastructure</strong> reduces operational
            friction by 40% — enabling YODY to scale from 274 to 500 stores
            without proportional headcount growth.
          </>
        ),
        accent: "iris",
      }}
      accent="iris"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VALUE_PROPS.map((prop) => (
          <ValuePropCard key={prop.numeral} {...prop} />
        ))}
      </div>
    </SectionTemplate>
  );
}

function ValuePropCard({
  numeral,
  title,
  description,
  icon: Icon,
  metric,
  metricLabel,
}: {
  numeral: "I" | "II" | "III";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  metric: string;
  metricLabel: string;
}) {
  return (
    <div className="bg-bg border border-border rounded-lg p-6 yd-lift">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <RomanNumeral numeral={numeral} tone="iris" className="text-4xl" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Icon className="w-5 h-5 text-iris" />
            <h3 className="font-[var(--font-brand)] font-bold text-lg text-fg-1">
              {title}
            </h3>
          </div>
          <p className="text-fg-2 text-base leading-relaxed">{description}</p>
          <div className="mt-4 pt-4 border-t border-border-light">
            <div className="kpi-num text-iris">{metric}</div>
            <div className="text-fg-3 text-sm mt-1">{metricLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
