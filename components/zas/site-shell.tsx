import Link from "next/link"
import { navItems } from "@/lib/zas-data"

type SiteShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export function SiteShell({ title, subtitle, children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            Zas Apparles Pvt Ltd
          </Link>
          <nav className="hidden gap-5 text-sm text-slate-300 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-cyan-300">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="mx-auto max-w-7xl px-6 py-24">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300">Modern Garment Ecosystem</p>
            <h1 className="max-w-3xl text-4xl font-bold md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-slate-300 md:text-lg">{subtitle}</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">{children}</section>
      </main>

      <footer className="border-t border-white/10 bg-slate-900/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Zas Apparles Pvt Ltd</p>
          <p>Smart manufacturing • Ethical workforce • Global delivery</p>
        </div>
      </footer>
    </div>
  )
}
