"use client";

import { SectionTemplate } from "@/components/section-template";
import { RomanNumeral } from "@/components/roman-numeral";
import { Box, Truck, ShoppingCart, Brain } from "lucide-react";

const FEATURES = [
  {
    numeral: "I" as const,
    eyebrow: "PHOENIX — SUPPLY CHAIN",
    title: "From factory to shelf in 72 hours",
    description:
      "Integrated PLM, APS, WMS, and TMS eliminate silos. Real-time visibility from raw material to retail floor.",
    icon: Box,
    stat: "72h",
    statLabel: "Factory-to-shelf cycle",
    tone: "mint" as const,
  },
  {
    numeral: "II" as const,
    eyebrow: "UNICORN — RETAIL",
    title: "One customer. One experience. Every channel.",
    description:
      "POS, OMS, and ERP unified. A single loyalty profile works in-store, online, and on the app.",
    icon: ShoppingCart,
    stat: "274",
    statLabel: "Stores connected",
    tone: "iris" as const,
  },
  {
    numeral: "III" as const,
    eyebrow: "GLAUX — INNOVATION",
    title: "AI that predicts before you order",
    description:
      "YOAI and intelligent automation forecast demand, optimize pricing, and automate replenishment.",
    icon: Brain,
    stat: "94%",
    statLabel: "Weekly forecast accuracy",
    tone: "rose" as const,
  },
  {
    numeral: "IV" as const,
    eyebrow: "TOGAF GOVERNANCE",
    title: "Enterprise architecture that scales",
    description:
      "9 TOGAF domains, ~120 capabilities mapped. Clear ownership, investment tracking, and roadmap governance.",
    icon: Truck,
    stat: "120",
    statLabel: "Capabilities mapped",
    tone: "brand" as const,
  },
];

export function FeaturesSection() {
  return (
    <SectionTemplate
      eyebrow="PLATFORM CAPABILITIES"
      title={
        <>
          Four pillars.{" "}
          <em className="em-accent iris">Zero silos.</em>
        </>
      }
      subtitle="Each platform is a self-contained capability. Together, they form an integrated digital nervous system."
      insight={{
        label: "Insight",
        body: (
          <>
            <strong>Platform unification</strong> reduces cross-team coordination
            overhead by 60% — decisions that took weeks now take hours.
          </>
        ),
        accent: "iris",
      }}
      accent="iris"
      bg="mist"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.numeral} {...feature} />
        ))}
      </div>
    </SectionTemplate>
  );
}

function FeatureCard({
  numeral,
  eyebrow,
  title,
  description,
  icon: Icon,
  stat,
  statLabel,
  tone,
}: {
  numeral: "I" | "II" | "III" | "IV";
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  stat: string;
  statLabel: string;
  tone: "mint" | "iris" | "rose" | "brand";
}) {
  const toneMap = {
    mint: "bg-mint-tint border-mint/20 text-mint-deep",
    iris: "bg-iris-tint border-iris/20 text-iris-deep",
    rose: "bg-rose-tint border-rose/20 text-rose-deep",
    brand: "bg-brand-tint border-brand/20 text-brand",
  };

  const iconToneMap = {
    mint: "text-mint",
    iris: "text-iris",
    rose: "text-rose",
    brand: "text-brand",
  };

  const statToneMap = {
    mint: "text-mint",
    iris: "text-iris",
    rose: "text-rose",
    brand: "text-brand",
  };

  return (
    <div className={`bg-bg border rounded-lg p-6 yd-lift ${toneMap[tone]}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <RomanNumeral numeral={numeral} tone={tone} className="text-3xl" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-5 h-5 ${iconToneMap[tone]}`} />
            <span className="mono text-xs tracking-wider text-fg-3 uppercase">
              {eyebrow}
            </span>
          </div>
          <h3 className="font-[var(--font-brand)] font-bold text-xl text-fg-1 mb-2">
            {title}
          </h3>
          <p className="text-fg-2 text-base leading-relaxed">{description}</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`kpi-num text-3xl ${statToneMap[tone]}`}>{stat}</span>
            <span className="text-fg-3 text-sm">{statLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
