import { SiteShell } from "@/components/zas/site-shell"

const stations = [
  "Fabric inspection and defect mapping",
  "CAD marker generation for optimized layout",
  "Automated spreading and tension control",
  "Laser-guided precision cutting",
]

export default function CuttingsPage() {
  return (
    <SiteShell
      title="Cuttings Department"
      subtitle="Engineered material flow to maintain shape integrity, size consistency, and waste efficiency."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {stations.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-lg font-medium">{item}</p>
          </div>
        ))}
      </div>
    </SiteShell>
  )
}
