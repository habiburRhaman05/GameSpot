"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { authClient } from "@/lib/auth-client";
import { userService } from "@/service/user.service";
import { toast } from "sonner";
import { Reveal } from "@/components/shared/Reveal";

export function OrganizerCtaSection() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const userProfileQuery = useQuery({
    queryKey: ["cta-user-profile"],
    queryFn: () => userService.getProfile(),
    enabled: Boolean(session?.session?.id),
    staleTime: 30_000,
  });

  const handleGetStarted = () => {
    if (isPending || userProfileQuery.isLoading) return;
    const role = userProfileQuery.data?.data?.role;
    if (!role) {
      router.push("/signin?callbackUrl=/dashboard/become-organizer");
      return;
    }
    if (role === "ORGANIZER") {
      router.push("/organizer");
      toast.success("Welcome back, Organizer! Manage your courts and bookings here.");
      return;
    }
    if (role === "ADMIN") {
      router.push("/admin");
      return;
    }
    router.push("/dashboard/become-organizer");
  };

  return (
    <section className="relative overflow-hidden bg-card px-6 py-20 md:py-24 lg:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-3xl" />

      <Reveal variant="fadeUp" delay={0.1}>
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <span className="inline-flex rounded-lg bg-primary-soft px-3 py-1 font-display text-[10px] font-black uppercase tracking-[0.16em] text-primary mb-6">
            For Organizers
          </span>

          <h2 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-foreground md:text-7xl lg:text-8xl">
            List Your Venue.
            <br />
            <span className="text-gradient-primary">Scale Your Impact.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-text-secondary">
            Join a premium network of sports facilities and manage bookings,
            analytics, and member growth from one platform.
          </p>

          <motion.div
            className="mt-10 flex justify-center gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="button"
              onClick={handleGetStarted}
              className="group inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 font-display text-sm font-black uppercase tracking-widest text-primary-foreground transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 cursor-pointer"
            >
              Get Started Today
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </motion.div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10">
            {[
              { value: "500+", label: "Venues Listed" },
              { value: "99%", label: "Uptime" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-black text-primary md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
