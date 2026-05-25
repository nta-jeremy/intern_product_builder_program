"use client";

import { SectionTemplate } from "@/components/section-template";
import { Quote } from "lucide-react";

const STATS = [
  { value: "274", label: "Retail stores" },
  { value: "34", label: "Provinces" },
  { value: "2.8K", label: "Daily staff" },
  { value: "2030", label: "IPO target" },
];

const TESTIMONIALS = [
  {
    quote:
      "YODY ITDX transformed our supply chain from a cost center into a competitive advantage. Real-time visibility changed everything.",
    name: "Nguyen Van A",
    title: "COO, YODY Retail",
    initials: "NA",
    tone: "rose" as const,
  },
  {
    quote:
      "The AI forecasting engine reduced our overstock by 35% in the first quarter. That's not incremental — that's transformational.",
    name: "Tran Thi B",
    title: "Head of Merchandising",
    initials: "TB",
    tone: "iris" as const,
  },
  {
    quote:
      "Implementing the TOGAF governance framework gave us clarity on every investment. No more blind spots.",
    name: "Le Van C",
    title: "CTO, YODY ITDX",
    initials: "LC",
    tone: "mint" as const,
  },
];

export function SocialProofSection() {
  return (
    <SectionTemplate
      eyebrow="SOCIAL PROOF"
      title={
        <>
          Numbers that{" "}
          <em className="em-accent rose">speak.</em>
        </>
      }
      subtitle="Real results from the teams building YODY's digital future."
      insight={{
        label: "Insight",
        body: (
          <>
            <strong>Operational excellence</strong> is the foundation of
            YODY's IPO readiness — every metric reflects a system, not a slogan.
          </>
        ),
        accent: "rose",
      }}
      accent="rose"
    >
      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-2 border border-border rounded-lg p-6 text-center"
          >
            <div className="kpi-num text-brand text-4xl">{stat.value}</div>
            <div className="text-fg-3 text-sm mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
    </SectionTemplate>
  );
}

function TestimonialCard({
  quote,
  name,
  title,
  initials,
  tone,
}: {
  quote: string;
  name: string;
  title: string;
  initials: string;
  tone: "rose" | "iris" | "mint";
}) {
  const toneBorder = {
    rose: "border-rose/20",
    iris: "border-iris/20",
    mint: "border-mint/20",
  };

  const toneBg = {
    rose: "bg-rose-tint",
    iris: "bg-iris-tint",
    mint: "bg-mint-tint",
  };

  return (
    <div className={`bg-bg border rounded-lg p-6 ${toneBorder[tone]} yd-lift`}>
      <Quote className={`w-8 h-8 mb-4 ${tone === "rose" ? "text-rose" : tone === "iris" ? "text-iris" : "text-mint"}`} />
      <p className="text-fg-1 text-lg leading-relaxed mb-6">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${toneBg[tone]} flex items-center justify-center`}>
          <span className="font-[var(--font-brand)] font-bold text-sm text-fg-1">
            {initials}
          </span>
        </div>
        <div>
          <div className="font-[var(--font-brand)] font-semibold text-fg-1 text-sm">
            {name}
          </div>
          <div className="text-fg-3 text-xs">{title}</div>
        </div>
      </div>
    </div>
  );
}
