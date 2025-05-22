"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info, Loader2, Bug } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DEBUG_MODE } from "@/lib/debug-mode"

export default function LoginPage() {
  const { login, isDebugMode } = useAuth()
  const [email, setEmail] = useState("admin@amazon-warehouse.com") // Pre-fill admin email
  const [password, setPassword] = useState("admin123") // Pre-fill admin password
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(!DEBUG_MODE)
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  // Initialize database when the login page loads
  useEffect(() => {
    if (DEBUG_MODE) {
      setInitializing(false)
      return
    }

    const initDb = async () => {
      try {
        const response = await fetch("/api/init-db")

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to initialize database")
        }

        const data = await response.json()
        console.log("Database initialization response:", data)
      } catch (error) {
        console.error("Failed to initialize database:", error)
        setError(error instanceof Error ? error.message : "Failed to connect to database")
      } finally {
        setInitializing(false)
      }
    }

    initDb()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email || !password) {
        setError("Email and password are required")
        setLoading(false)
        return
      }

      console.log("Submitting login form...")

      // Use the auth context login function
      const result = await login(email, password)

      if (!result.success) {
        throw new Error(result.error || "Login failed")
      }

      console.log("Login successful, redirecting to dashboard...")
      router.push("/")
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleDebugLogin = () => {
    console.log("Using debug login")
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Amazon Warehouse</CardTitle>
          <CardDescription>Job Allocation System Login</CardDescription>
        </CardHeader>
        <CardContent>
          {isDebugMode && (
            <Alert className="mb-4 bg-yellow-100 border-yellow-400">
              <Bug className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Debug mode is active. Authentication is bypassed.
              </AlertDescription>
            </Alert>
          )}

          {registered && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>Registration successful! You can now log in with your credentials.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {initializing && (
            <div className="mb-4 flex items-center justify-center space-x-2 rounded-md border border-muted p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Initializing application...</p>
            </div>
          )}

          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Demo credentials: <strong>admin@amazon-warehouse.com</strong> / <strong>admin123</strong>
            </AlertDescription>
          </Alert>

          {isDebugMode ? (
            <div className="space-y-4">
              <Alert className="bg-green-100 border-green-400">
                <Info className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Debug mode is active. Click the button below to access the dashboard directly.
                </AlertDescription>
              </Alert>
              <Button className="w-full" onClick={handleDebugLogin}>
                Access Dashboard (Debug Mode)
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@amazon-warehouse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={initializing || loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={initializing || loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={initializing || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
