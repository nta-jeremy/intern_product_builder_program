interface RomanNumeralProps {
  numeral: "I" | "II" | "III" | "IV" | "V";
  tone?: "iris" | "gold" | "mint" | "rose" | "brand";
  className?: string;
}

export function RomanNumeral({ numeral, tone = "iris", className = "" }: RomanNumeralProps) {
  const toneMap = {
    iris: "text-iris",
    gold: "text-gold-deep",
    mint: "text-mint-deep",
    rose: "text-rose-deep",
    brand: "text-brand",
  };

  return <span className={`roman ${toneMap[tone]} ${className}`}>{numeral}</span>;
}
