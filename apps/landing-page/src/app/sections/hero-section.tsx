"use client";

import { CTAButton } from "@/components/cta-button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg-warm min-h-[90vh] flex items-center">
      {/* Watercolor blobs decoration */}
      <WatercolorBlobs />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-14 py-24 md:py-32 w-full">
        {/* Eyebrow */}
        <div className="s-eyebrow text-brand">
          ITDX × CRAFTSMANSHIP
        </div>

        {/* Hero headline */}
        <h1 className="hero-display mt-6 max-w-4xl">
          Digital infrastructure for{" "}
          <span className="art-italic">fashion</span>{" "}
          <span className="big-num brand">scale</span>
        </h1>

        {/* Brush underline */}
        <BrushUnderline className="mt-4" />

        {/* Subheadline */}
        <p className="mt-8 max-w-2xl text-fg-2" style={{ fontSize: "23px", lineHeight: 1.65 }}>
          PHOENIX · UNICORN · GLAUX — three platforms powering{" "}
          <strong className="text-fg-1">274 stores</strong> toward{" "}
          <em className="em-accent gold">IPO 2030</em>.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mt-10">
          <CTAButton variant="primary">
            Explore Platforms
          </CTAButton>
          <CTAButton variant="secondary">
            View Roadmap
          </CTAButton>
        </div>

        {/* Trust signal */}
        <div className="mt-12 flex items-center gap-6 text-fg-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-mint" />
            <span className="text-sm">274 stores LIVE</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-iris" />
            <span className="text-sm">34 provinces BUILD</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WatercolorBlobs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg className="absolute top-0 left-0 w-full h-full" width="100%" height="100%">
        <defs>
          <filter id="watercolor">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <radialGradient id="blob1" cx="30%" cy="40%" r="50%">
            <stop offset="0%" stopColor="rgba(124,108,245,0.08)" />
            <stop offset="100%" stopColor="rgba(124,108,245,0)" />
          </radialGradient>
          <radialGradient id="blob2" cx="70%" cy="60%" r="50%">
            <stop offset="0%" stopColor="rgba(252,175,22,0.06)" />
            <stop offset="100%" stopColor="rgba(252,175,22,0)" />
          </radialGradient>
        </defs>
        <circle cx="30%" cy="40%" r="300" fill="url(#blob1)" filter="url(#watercolor)" style={{ mixBlendMode: "multiply", opacity: 0.4 }} />
        <circle cx="70%" cy="60%" r="250" fill="url(#blob2)" filter="url(#watercolor)" style={{ mixBlendMode: "multiply", opacity: 0.4 }} />
      </svg>
    </div>
  );
}

function BrushUnderline({ className = "" }: { className?: string }) {
  return (
    <svg className={`h-3 ${className}`} width="200" height="12" viewBox="0 0 200 12" aria-hidden="true">
      <defs>
        <linearGradient id="brushGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fcaf16" />
          <stop offset="100%" stopColor="#b07a00" />
        </linearGradient>
        <filter id="brushRough">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </defs>
      <path
        d="M2 8 Q50 2 100 6 Q150 10 198 4"
        stroke="url(#brushGrad)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        filter="url(#brushRough)"
        style={{
          strokeDasharray: 300,
          strokeDashoffset: 300,
          animation: "yd-brush 1.2s cubic-bezier(0.6, 0.05, 0.3, 1) forwards 0.5s",
        }}
      />
    </svg>
  );
}
