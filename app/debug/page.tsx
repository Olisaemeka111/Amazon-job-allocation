"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { DEBUG_MODE } from "@/lib/debug-mode"
import Link from "next/link"
import { AlertCircle, Bug, Info } from "lucide-react"

export default function DebugPage() {
  const { user } = useAuth()
  const [cookies, setCookies] = useState<string[]>([])
  const [localStorageItems, setLocalStorageItems] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get cookies
    const cookieList = document.cookie.split(";").map((cookie) => cookie.trim())
    setCookies(cookieList)

    // Get localStorage items
    const items: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        items[key] = localStorage.getItem(key) || ""
      }
    }
    setLocalStorageItems(items)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Bug className="mr-2 h-6 w-6" />
        System Debug Page
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Debug Mode Status</CardTitle>
            <CardDescription>Current system debug configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className={DEBUG_MODE ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"}>
              <Info className={`h-4 w-4 ${DEBUG_MODE ? "text-green-600" : "text-red-600"}`} />
              <AlertDescription className={DEBUG_MODE ? "text-green-800" : "text-red-800"}>
                Debug Mode is {DEBUG_MODE ? "ENABLED" : "DISABLED"}
              </AlertDescription>
            </Alert>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Actions:</h3>
              <div className="space-y-2">
                <Link href="/">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Go to Login Page
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
            <CardDescription>Information about the authenticated user</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">ID:</span> {user.id}
                </p>
                <p>
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Role:</span> {user.role}
                </p>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No user is currently authenticated</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
            <CardDescription>Current browser cookies</CardDescription>
          </CardHeader>
          <CardContent>
            {cookies.length > 0 ? (
              <ul className="space-y-1">
                {cookies.map((cookie, index) => (
                  <li key={index} className="text-sm font-mono bg-muted p-2 rounded">
                    {cookie}
                  </li>
                ))}
              </ul>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>No cookies found</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Storage</CardTitle>
            <CardDescription>Current browser local storage items</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(localStorageItems).length > 0 ? (
              <ul className="space-y-1">
                {Object.entries(localStorageItems).map(([key, value]) => (
                  <li key={key} className="text-sm">
                    <span className="font-semibold">{key}:</span>{" "}
                    <span className="font-mono bg-muted p-1 rounded">{value.substring(0, 50)}</span>
                    {value.length > 50 && "..."}
                  </li>
                ))}
              </ul>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>No local storage items found</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
