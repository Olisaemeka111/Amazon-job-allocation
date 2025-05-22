"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DEBUG_MODE, DEBUG_USER } from "./debug-mode"

type User = {
  id: number
  email: string
  name: string
  role: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: { email: string; password: string; name: string; role: string }) => Promise<{
    success: boolean
    error?: string
  }>
  logout: () => void
  isDebugMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEBUG_MODE ? DEBUG_USER : null)
  const [loading, setLoading] = useState(!DEBUG_MODE)
  const router = useRouter()

  useEffect(() => {
    // In debug mode, we're already logged in
    if (DEBUG_MODE) {
      console.log("Debug mode active - using debug user")
      setUser(DEBUG_USER)
      setLoading(false)
      return
    }

    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...")
        const response = await fetch("/api/auth/session")

        if (!response.ok) {
          console.log("Session check failed:", response.status)
          setUser(null)
          return
        }

        const data = await response.json()

        if (data.user) {
          console.log("User is authenticated:", data.user.email)
          setUser(data.user)
        } else {
          console.log("No authenticated user found")
          setUser(null)
        }
      } catch (error) {
        console.error("Session check error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // In debug mode, always succeed
    if (DEBUG_MODE) {
      console.log("Debug mode active - login automatically successful")
      setUser(DEBUG_USER)
      return { success: true }
    }

    try {
      setLoading(true)
      console.log("Attempting login for:", email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response status:", response.status)
      const data = await response.json()

      if (!response.ok) {
        console.error("Login failed:", data.error)
        return { success: false, error: data.error || "Login failed" }
      }

      console.log("Login successful:", data.user.email)
      setUser(data.user)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: { email: string; password: string; name: string; role: string }) => {
    // In debug mode, always succeed
    if (DEBUG_MODE) {
      console.log("Debug mode active - registration automatically successful")
      return { success: true }
    }

    try {
      setLoading(true)
      console.log("Attempting registration for:", userData.email)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      console.log("Registration response status:", response.status)
      const data = await response.json()

      if (!response.ok) {
        console.error("Registration failed:", data.error)
        return { success: false, error: data.error || "Registration failed" }
      }

      console.log("Registration successful")
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    // In debug mode, just reset the user
    if (DEBUG_MODE) {
      console.log("Debug mode active - logout just resets user")
      setUser(DEBUG_USER)
      router.push("/login")
      return
    }

    try {
      setLoading(true)
      console.log("Logging out...")

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        console.error("Logout failed:", response.status)
      } else {
        console.log("Logout successful")
      }

      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Even if logout fails, clear the user state and redirect
      setUser(null)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isDebugMode: DEBUG_MODE }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
