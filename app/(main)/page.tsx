"use client";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { MissionSection } from "@/components/mission-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { CollectivesSection } from "@/components/collectives-section";
import { ContributionTableSection } from "@/components/contribution-table-section";
import { WhyJoinSection } from "@/components/why-join-section";
import { CTABanner } from "@/components/cta-banner";
import { HomepageContactForm } from "@/components/HomepageContactForm";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <HowItWorksSection />
      <CollectivesSection />
      <ContributionTableSection />
      <WhyJoinSection />
      <HomepageContactForm />
      <CTABanner />
    </div>
  );
}
