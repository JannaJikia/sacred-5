import { CtaSection } from "@/app/components/welcome/CtaSection";
import { FeaturesSection } from "@/app/components/welcome/FeaturesSection";
import { HeroSection } from "@/app/components/welcome/HeroSection";
import { PointsSection } from "@/app/components/welcome/PointsSection";
import { PracticePreviewSection } from "@/app/components/welcome/PracticePreviewSection";
import { WelcomeFooter } from "@/app/components/welcome/WelcomeFooter";
import { WelcomeNav } from "@/app/components/welcome/WelcomeNav";

export default function WelcomePage() {
  return (
    <div
      data-surface="marketing"
      className="min-h-screen font-sans"
      style={{ background: "var(--mkt-bg)", color: "var(--mkt-text)" }}
    >
      <WelcomeNav />
      <main>
        <HeroSection />
        <PracticePreviewSection />
        <FeaturesSection />
        <PointsSection />
        <CtaSection />
      </main>
      <WelcomeFooter />
    </div>
  );
}
