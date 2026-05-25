export function Footer() {
  return (
    <footer className="bg-bg-ink py-12 md:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
                <span className="font-[var(--font-brand)] font-bold text-white text-sm">Y</span>
              </div>
              <span className="font-[var(--font-brand)] font-bold text-white text-lg">yody</span>
            </div>
            <p className="text-white/60 text-base max-w-sm leading-relaxed">
              YODY ITDX builds the digital infrastructure powering Vietnam's leading fashion retail brand. 274 stores. 34 provinces. IPO 2030.
            </p>
          </div>

          {/* Platforms */}
          <div>
            <h4 className="font-[var(--font-brand)] font-semibold text-white text-sm mb-4 tracking-wide">
              PLATFORMS
            </h4>
            <ul className="space-y-3">
              {["PHOENIX — Supply Chain", "UNICORN — Retail", "GLAUX — Innovation"].map((item) => (
                <li key={item}>
                  <span className="text-white/50 text-sm hover:text-white/80 transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[var(--font-brand)] font-semibold text-white text-sm mb-4 tracking-wide">
              CONTACT
            </h4>
            <ul className="space-y-3">
              {[
                "itdx@yody.vn",
                "+84 24 3200 0000",
                "Hanoi, Vietnam",
              ].map((item) => (
                <li key={item}>
                  <span className="text-white/50 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © 2026 YODY. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Status"].map((item) => (
              <span
                key={item}
                className="text-white/40 text-sm hover:text-white/60 transition-colors cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
