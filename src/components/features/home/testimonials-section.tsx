"use client";

import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";
import {
  Testimonial,
  TestimonialQuote,
  TestimonialAuthor,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
} from "@/components/ui/testmonials-marquee";
import { Reveal } from "@/components/shared/Reveal";
import { Star } from "lucide-react";

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5 px-5 pt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < rating ? "text-accent fill-accent" : "text-border"}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsMarqueeDemo2() {
  return (
    <section className="bg-background py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full px-6 md:px-10 lg:px-12">
        <Reveal variant="fadeUp" delay={0.1}>
          <div className="mb-14 text-center lg:text-left">
            <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Athlete
              <br />
              <span className="mt-1 inline-block text-gradient-primary">
                Testimonials
              </span>
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg lg:mx-0 lg:max-w-2xl">
              Real feedback from players, coaches, and organizers using Court
              Connect to discover, book, and manage premium sports venues.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative w-full space-y-6 overflow-hidden">
        {[TESTIMONIALS_1, TESTIMONIALS_2].map((list, index) => (
          <Marquee key={index}>
            <MarqueeFade side="left" className="from-background via-background/95 to-transparent w-24 sm:w-32 z-30" />
            <MarqueeFade side="right" className="from-background via-background/95 to-transparent w-24 sm:w-32 z-30" />

            <MarqueeContent direction={index % 2 === 1 ? "right" : "left"}>
              {list.map((item, i) => (
                <MarqueeItem key={i} className="mx-3 h-full">
                  <div className="h-full w-[22rem] rounded-xl glass p-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <StarRating rating={5} />
                    <Testimonial>
                      <TestimonialQuote className="px-5 py-3 text-sm leading-relaxed text-text-secondary">
                        <p>&ldquo;{item.quote}&rdquo;</p>
                      </TestimonialQuote>

                      <TestimonialAuthor className="px-5 pt-1 pb-4">
                        <TestimonialAvatar>
                          <TestimonialAvatarImg src={item.authorAvatar} alt={item.authorName} />
                          <TestimonialAvatarRing className="ring-primary/25" />
                        </TestimonialAvatar>

                        <TestimonialAuthorName className="text-sm font-bold text-foreground">
                          {item.authorName}
                        </TestimonialAuthorName>

                        <TestimonialAuthorTagline className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
                          {item.authorTagline}
                        </TestimonialAuthorTagline>
                      </TestimonialAuthor>
                    </Testimonial>
                  </div>
                </MarqueeItem>
              ))}
            </MarqueeContent>
          </Marquee>
        ))}
      </div>
    </section>
  );
}

export const TESTIMONIALS_1 = [
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
    authorName: "Alex Chen",
    authorTagline: "Amateur Footballer",
    quote:
      "I found a high-quality turf near my office in under five minutes. Booking and payment were both instant.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=687&q=80",
    authorName: "Sarah Miller",
    authorTagline: "Triathlon Athlete",
    quote:
      "The venue filters are excellent. I can quickly pick courts by lighting and amenities before morning training sessions.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=687&q=80",
    authorName: "James Wilson",
    authorTagline: "Weekend Tennis Player",
    quote:
      "GameSpot made weekend match planning effortless. My group now books one week ahead without any friction.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=761&q=80",
    authorName: "Maya Patel",
    authorTagline: "Basketball Coach",
    quote:
      "Consistent court quality and simple checkout. It has become the default booking platform for our academy sessions.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=880&q=80",
    authorName: "David Kim",
    authorTagline: "Badminton Enthusiast",
    quote:
      "I love how transparent the pricing is. No hidden surprises, and confirmations arrive immediately after payment.",
  },
];

export const TESTIMONIALS_2 = [
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=880&q=80",
    authorName: "Robert Fox",
    authorTagline: "Venue Organizer",
    quote:
      "As an organizer, I can manage bookings and slot visibility in one dashboard. Operations are much smoother now.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=688&q=80",
    authorName: "Emily Zhang",
    authorTagline: "Padel Player",
    quote:
      "The platform helps me compare venues quickly and choose the right one for league prep sessions.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=687&q=80",
    authorName: "Michael Brown",
    authorTagline: "Academy Manager",
    quote:
      "Verification and admin controls are strong. It gives our players confidence that facilities meet a professional standard.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&w=880&q=80",
    authorName: "Lisa Wang",
    authorTagline: "Recreational Runner",
    quote:
      "UI is clean and fast. Even on mobile, finding and reserving a venue near me takes less than two minutes.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=687&q=80",
    authorName: "Chris Johnson",
    authorTagline: "Table Tennis Player",
    quote:
      "I added GameSpot to our club workflow. Booking disputes dropped because all confirmations are clear and centralized.",
  },
];

export const TestimonialsSection = TestimonialsMarqueeDemo2;
