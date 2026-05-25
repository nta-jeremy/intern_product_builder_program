const PLACEHOLDER_LOGOS = [
  { name: "Partner A", initial: "A" },
  { name: "Partner B", initial: "B" },
  { name: "Partner C", initial: "C" },
  { name: "Partner D", initial: "D" },
  { name: "Partner E", initial: "E" },
  { name: "Partner F", initial: "F" },
  { name: "Partner G", initial: "G" },
  { name: "Partner H", initial: "H" },
];

export function LogoBar() {
  return (
    <section className="py-16 bg-bg border-t border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-14">
        <p className="text-center text-fg-3 text-sm mb-8 tracking-wide">
          TRUSTED BY LEADING RETAILERS
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {PLACEHOLDER_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="w-24 h-12 flex items-center justify-center bg-bg-2 rounded-lg border border-border opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-default"
              title={logo.name}
            >
              <span className="font-[var(--font-brand)] font-bold text-fg-3 text-lg">
                {logo.initial}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
