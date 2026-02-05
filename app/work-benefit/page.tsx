import { SiteShell } from "@/components/zas/site-shell"

const benefits = [
  "Skill development academy for stitch operators and line supervisors",
  "Health support and annual medical camps for all employees",
  "Performance bonuses tied to quality and attendance",
  "Safe workplace standards with regular safety drills",
]

export default function WorkBenefitPage() {
  return (
    <SiteShell
      title="Work Benefit"
      subtitle="We invest in people first to build long-term excellence in every production line."
    >
      <div className="grid gap-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
            <p>{benefit}</p>
          </div>
        ))}
      </div>
    </SiteShell>
  )
}
