"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2, Database, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline" | "missing-env" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = async () => {
    if (isChecking) return

    setIsChecking(true)
    try {
      const response = await fetch("/api/init-db")

      if (!response.ok) {
        setStatus("error")
        setErrorMessage(`API error: ${response.status} ${response.statusText}`)
        setIsChecking(false)
        return
      }

      let data
      try {
        data = await response.json()
      } catch (e) {
        setStatus("error")
        setErrorMessage("Failed to parse API response")
        setIsChecking(false)
        return
      }

      if (data.error && data.error.includes("Missing Supabase environment variables")) {
        setStatus("missing-env")
        setErrorMessage("Missing Supabase environment variables")
      } else if (data.error) {
        setStatus("error")
        setErrorMessage(data.error)
      } else {
        setStatus(data.usingFallback ? "offline" : "online")
        setErrorMessage(data.error || null)
      }
    } catch (error) {
      console.error("Error checking database status:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to check database status")
    } finally {
      setIsChecking(false)
    }
  }

  const resetConnection = async () => {
    setIsChecking(true)
    try {
      await fetch("/api/init-db?reset=true")
      checkStatus()
    } catch (error) {
      console.error("Error resetting database connection:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to reset connection")
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (status === "checking") {
    return (
      <Alert variant="outline" className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>Checking database connection...</AlertDescription>
      </Alert>
    )
  }

  if (status === "missing-env") {
    return (
      <Alert variant="warning" className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Running with in-memory database. Supabase environment variables are not configured.</span>
          <Button variant="outline" size="sm" onClick={checkStatus} disabled={isChecking}>
            {isChecking && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Check Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "error" || status === "offline") {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <span>Running in offline mode with in-memory database. Some features may be limited.</span>
            {errorMessage && <div className="text-xs mt-1 text-muted-foreground">{errorMessage}</div>}
          </div>
          <Button variant="outline" size="sm" onClick={resetConnection} disabled={isChecking}>
            {isChecking && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Reconnect
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="success" className="mb-4">
      <Database className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Connected to Supabase database</span>
        <Button variant="outline" size="sm" onClick={checkStatus} disabled={isChecking}>
          {isChecking && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          Check Status
        </Button>
      </AlertDescription>
    </Alert>
  )
}
