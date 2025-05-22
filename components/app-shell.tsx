"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon-fix"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          className="fixed top-4 left-4 z-50 md:hidden mobile-toggle"
          size="sm"
          variant="outline"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          data-testid="mobile-sidebar-toggle"
        >
          <Icon name={isSidebarOpen ? "X" : "Menu"} className="h-4 w-4" />
        </Button>
      )}

      {/* Sidebar for mobile (with overlay) */}
      {isMobile && (
        <>
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsSidebarOpen(false)}
              data-testid="mobile-sidebar-overlay"
            />
          )}
          <div 
            className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            data-testid="mobile-sidebar-container"
            data-state={isSidebarOpen ? "open" : "closed"}
          >
            <Sidebar />
          </div>
        </>
      )}

      {/* Desktop sidebar (always visible) */}
      {!isMobile && (
        <div className="hidden md:block w-64 fixed h-full" data-testid="desktop-sidebar-container">
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto ${!isMobile ? "md:ml-64" : ""}`} data-testid="main-content">
        {children}
      </main>
    </div>
  )
} 