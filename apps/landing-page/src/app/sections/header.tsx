"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Platforms", href: "#platforms" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Results", href: "#results" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-14">
        <div className="flex items-center justify-between h-14">
          {/* Logo lockup */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
              <span className="font-[var(--font-brand)] font-bold text-white text-sm">Y</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-[var(--font-brand)] font-bold text-fg-1 text-lg tracking-tight">
                yody
              </span>
              <span className="font-[var(--font-brand)] font-medium text-fg-3 text-xs">
                ·id
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-fg-2 hover:text-fg-1 transition-colors duration-150"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="cta-primary px-5 h-9 text-sm inline-flex items-center gap-1 rounded-full"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-fg-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-bg border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-fg-2 hover:text-fg-1 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="block cta-primary text-center py-3 rounded-full mt-4"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
