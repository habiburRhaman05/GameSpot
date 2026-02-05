import { SiteShell } from "@/components/zas/site-shell"

const metrics = [
  { label: "Production floors", value: "6" },
  { label: "Machines", value: "1,250+" },
  { label: "Compliance audits/year", value: "40" },
  { label: "Solar energy contribution", value: "32%" },
]

export default function FactoryPage() {
  return (
    <SiteShell
      title="Factory Infrastructure"
      subtitle="Built for high-volume execution with safety, sustainability, and automation-first operations."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-3xl font-bold text-cyan-300">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-300">{metric.label}</p>
          </div>
        ))}
      </div>
    </SiteShell>
  )
}
