import { Header } from "./sections/header";
import { HeroSection } from "./sections/hero-section";
import { LogoBar } from "./sections/logo-bar";
import { ValuePropSection } from "./sections/value-prop-section";
import { FeaturesSection } from "./sections/features-section";
import { SocialProofSection } from "./sections/social-proof-section";
import { FinalCTASection } from "./sections/final-cta-section";
import { Footer } from "./sections/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-14">
        <HeroSection />
        <LogoBar />
        <ValuePropSection />
        <FeaturesSection />
        <SocialProofSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
