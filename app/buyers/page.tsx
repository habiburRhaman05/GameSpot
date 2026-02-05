import { SiteShell } from "@/components/zas/site-shell"

const buyers = [
  "Dedicated merchandising desk per account",
  "Weekly sample review and feedback loops",
  "Real-time production dashboard",
  "Shipment and documentation support",
]

export default function BuyersPage() {
  return (
    <SiteShell
      title="Buyers & Partnerships"
      subtitle="Transparent communication channels that keep global buyers in sync with production."
    >
      <ul className="space-y-4">
        {buyers.map((item) => (
          <li key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
            {item}
          </li>
        ))}
      </ul>
    </SiteShell>
  )
}
