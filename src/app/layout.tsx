import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ChatAssistant } from "@/components/shared/ChatAssistant";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B14" },
  ],
};

export const metadata: Metadata = {
  title: "Court Connect",
  description:
    "Your destination for seamless court bookings and exclusive athletic experiences.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const htmlClassName = [
    "antialiased",
    inter.variable,
    instrumentSerif.variable,
    dmSans.variable,
    geistMono.variable,
    "font-sans",
  ].join(" ");

  return (
    <html lang="en" className={htmlClassName} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <Toaster position="top-left" />
            {children}
            <ChatAssistant />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
