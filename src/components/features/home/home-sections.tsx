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
        <div className="pt-16 md:pt-20 lg:pt-24">
          <HowItWorksSection />
        </div>
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <div className="pt-16 md:pt-20 lg:pt-24">
          <FeaturedSpotlightSection />
        </div>
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <div className="pt-16 md:pt-20 lg:pt-24">
          <TrendingVenuesSection />
        </div>
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <div className="pt-16 md:pt-20 lg:pt-24">
          <GlobalPresenceSection />
        </div>
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <div className="pt-16 md:pt-20 lg:pt-24">
          <TestimonialsSection />
        </div>
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <div className="pt-16 md:pt-20 lg:pt-24">
          <DiscountSection />
        </div>
      </Reveal>

      <Reveal variant="fadeUp" delay={0.1}>
        <div className="pt-16 md:pt-20 lg:pt-24">
          <OrganizerCtaSection />
        </div>
      </Reveal>
    </main>
  );
}
