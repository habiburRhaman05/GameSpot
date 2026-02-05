import { SiteShell } from "@/components/zas/site-shell"

const finishFlow = [
  { title: "Thread Trimming", detail: "Fine-edge cleanup to ensure polished presentation." },
  { title: "Steam & Press", detail: "Shape correction for runway-level finishing." },
  { title: "Final QA", detail: "AQL-based inspection by trained quality teams." },
  { title: "Packing", detail: "Barcode tagging, folding standards, and carton mapping." },
]

export default function FinishPage() {
  return (
    <SiteShell
      title="Finish & Quality"
      subtitle="Where craftsmanship meets compliance for global retail standards."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {finishFlow.map((step) => (
          <article key={step.title} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-cyan-300">{step.title}</h2>
            <p className="mt-3 text-slate-300">{step.detail}</p>
          </article>
        ))}
      </div>
    </SiteShell>
  )
}
