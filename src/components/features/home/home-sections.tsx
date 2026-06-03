import { Reveal } from "@/components/shared/Reveal";
import { AnnouncementSection } from "./announcement-section";
import { DiscountSection } from "./discount-section";
import { FeaturedSpotlightSection } from "./featured-spotlight-section";
import { GlobalPresenceSection } from "./global-presence-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { OrganizerCtaSection } from "./organizer-cta-section";
import { TestimonialsSection } from "./testimonials-section";
import { TrendingVenuesSection } from "./trending-venues-section";

export function HomeSections() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <div className="space-y-0">
        <HeroSection />
        <AnnouncementSection />
      </div>

      <Reveal variant="fadeUp" delay={0.1}>
        <HowItWorksSection />
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <FeaturedSpotlightSection />
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <TrendingVenuesSection />
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <GlobalPresenceSection />
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <TestimonialsSection />
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <DiscountSection />
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <OrganizerCtaSection />
      </Reveal>
    </main>
  );
}
