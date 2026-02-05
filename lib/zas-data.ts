export type NavItem = {
  label: string
  href: string
}

export type ServiceCard = {
  title: string
  description: string
  metrics: string
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Cuttings", href: "/cuttings" },
  { label: "Finish", href: "/finish" },
  { label: "Buyers", href: "/buyers" },
  { label: "Factory", href: "/factory" },
  { label: "Work Benefit", href: "/work-benefit" },
]

export const featuredServices: ServiceCard[] = [
  {
    title: "Pattern & Cut Planning",
    description:
      "Digital marker planning and precision spreading reduce fabric wastage while improving consistency.",
    metrics: "8% less fabric loss",
  },
  {
    title: "Premium Finishing",
    description:
      "Steam shaping, detail checking, and final quality seals for export-ready garments.",
    metrics: "99.2% QC pass rate",
  },
  {
    title: "Buyer Collaboration",
    description:
      "Real-time sampling updates, approval windows, and shipment tracking for all partner brands.",
    metrics: "24/7 status visibility",
  },
]

export const homeHighlights = [
  { label: "Monthly production", value: "1.2M+ pcs" },
  { label: "Countries served", value: "28" },
  { label: "On-time delivery", value: "97%" },
  { label: "Skilled workforce", value: "1,900+" },
]
