/* eslint-disable react/no-unescaped-entities */
import {
  AboutHero,
  AboutMissionVision,
  AboutPartners,
  AboutWhyChoose,
} from "@/components/features/about";

const AboutPage = () => {
  return (
    <main className="bg-background w-full overflow-x-clip">
      <AboutHero />
      <AboutMissionVision />
      <AboutWhyChoose />

      <AboutPartners />
    </main>
  );
};

export default AboutPage;
