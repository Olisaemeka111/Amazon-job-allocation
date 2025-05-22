import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { AppShell } from "@/components/app-shell"

// Make sure we use a consistent version of the Icon component throughout the app
export { Icon } from "@/components/ui/icon-fix"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Amazon Warehouse Job Allocation System",
  description: "Optimally assigns daily tasks to warehouse employees",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <DataProvider>
              <AppShell>{children}</AppShell>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
