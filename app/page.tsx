import Link from "next/link"
import { SiteShell } from "@/components/zas/site-shell"
import { featuredServices, homeHighlights, navItems } from "@/lib/zas-data"

export default function HomePage() {
  return (
    <SiteShell
      title="Zas Apparles Pvt Ltd"
      subtitle="A future-ready garment manufacturing partner delivering speed, precision, and quality from yarn to shipment."
    >
      <div className="grid gap-6 md:grid-cols-4">
        {homeHighlights.map((highlight) => (
          <article key={highlight.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-3xl font-semibold text-cyan-300">{highlight.value}</p>
            <p className="mt-2 text-sm text-slate-300">{highlight.label}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {featuredServices.map((service) => (
          <article key={service.title} className="rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50">
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="mt-3 text-slate-300">{service.description}</p>
            <p className="mt-4 text-sm font-medium text-cyan-300">{service.metrics}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-cyan-400/40 bg-cyan-500/10 p-8">
        <h3 className="text-2xl font-semibold">Explore every department</h3>
        <p className="mt-2 max-w-2xl text-slate-300">
          Navigate to operations pages for cuttings, finish, buyers, factory, and work benefit insights.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {navItems
            .filter((item) => item.href !== "/")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-cyan-300 hover:text-cyan-300"
              >
                {item.label}
              </Link>
            ))}
        </div>
      </div>
    </SiteShell>
  )
}
