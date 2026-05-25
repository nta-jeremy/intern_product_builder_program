import { ArrowRight } from "lucide-react";

interface CTAButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gold";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function CTAButton({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
}: CTAButtonProps) {
  const base = `cta yd-press ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={`${base} ${
          variant === "primary"
            ? "cta-primary"
            : variant === "secondary"
            ? "cta-secondary"
            : "cta-gold"
        }`}
      >
        {children}
        <ArrowRight className="w-5 h-5" />
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${
        variant === "primary"
          ? "cta-primary"
          : variant === "secondary"
          ? "cta-secondary"
          : "cta-gold"
      }`}
    >
      {children}
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}
