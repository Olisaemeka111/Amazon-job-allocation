"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Bug, Loader2 } from "lucide-react"
import { initializeDatabase } from "@/lib/init-db"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Initialize database on app startup
initializeDatabase()

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isDebugMode } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user && !isDebugMode) {
      router.push("/login")
    }
  }, [loading, user, router, isDebugMode])

  if (loading && !isDebugMode) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user && !isDebugMode) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        {isDebugMode && (
          <Alert className="m-4 bg-yellow-100 border-yellow-400">
            <Bug className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 flex justify-between items-center">
              <span>Debug mode is active. Authentication is bypassed.</span>
              <a href="/debug" className="text-blue-600 hover:underline text-sm">
                View Debug Info
              </a>
            </AlertDescription>
          </Alert>
        )}
        {children}
      </main>
    </div>
  )
}
