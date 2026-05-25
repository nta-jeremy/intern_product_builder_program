"use client";

import { CTAButton } from "@/components/cta-button";

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-32 bg-bg-ink relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-14 text-center relative z-10">
        {/* Gold accent line */}
        <div className="w-24 h-1 bg-gradient-to-r from-gold to-gold-deep rounded-full mx-auto mb-8" />

        <h2 className="font-[var(--font-impact)] font-extrabold text-4xl md:text-5xl text-white max-w-3xl mx-auto leading-tight">
          Ready to build{" "}
          <em className="text-gold">your</em> digital foundation?
        </h2>

        <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          YODY ITDX partners with enterprises ready to unify their technology
          landscape. From assessment to IPO-ready architecture.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <CTAButton variant="gold" href="#contact">
            Start Your Assessment
          </CTAButton>
          <CTAButton variant="secondary" href="#roadmap">
            View Full Roadmap
          </CTAButton>
        </div>

        {/* Trust signal */}
        <div className="mt-12 flex items-center justify-center gap-6 text-white/50 text-sm">
          <span>No credit card required</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>2-week assessment</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>Enterprise NDA</span>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
