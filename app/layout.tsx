import Header from "@/components/shared/Header"
import { AppSidebar } from "@/components/shared/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import QueryProvider from "@/providers/QueryProvider"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/shared/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Zas Apparles Pvt Ltd",
  description: "Modern garment manufacturing and buyer collaboration website.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  <html lang="en" suppressHydrationWarning>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          
        >
      <QueryProvider>
    <SidebarProvider>
      
        <Toaster richColors/>
      
          
          <main className="w-full">
            {children}
          </main>
     
    </SidebarProvider>
      </QueryProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}
