"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Icon } from "@/components/ui/icon-fix"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchSidebarMetrics, setupMetricsRefresh, SidebarMetrics } from "@/lib/database-service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: "Home",
    metricKey: null,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: "Users2",
    metricKey: "employees",
    metricDisplay: (metrics: SidebarMetrics) => 
      `${metrics.employees.active}/${metrics.employees.count}`,
    metricTooltip: (metrics: SidebarMetrics) => 
      `${metrics.employees.active} active out of ${metrics.employees.count} total employees`,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: "ClipboardList",
    metricKey: "tasks",
    metricDisplay: (metrics: SidebarMetrics) => 
      `${metrics.tasks.count}`,
    metricTooltip: (metrics: SidebarMetrics) => 
      `${metrics.tasks.pending} pending, ${metrics.tasks.inProgress} in progress, ${metrics.tasks.completed} completed`,
    metricHighlight: (metrics: SidebarMetrics) => 
      metrics.tasks.highPriority > 0 ? "destructive" : null,
  },
  {
    title: "Task Allocation",
    href: "/task-allocation",
    icon: "LayoutDashboard",
    metricKey: "allocation",
    metricDisplay: (metrics: SidebarMetrics) => 
      `${metrics.allocation.optimizationScore}%`,
    metricTooltip: (metrics: SidebarMetrics) => 
      `Optimization score: ${metrics.allocation.optimizationScore}%, last run ${formatTimeAgo(new Date(metrics.allocation.lastOptimization))}`,
    metricHighlight: (metrics: SidebarMetrics) => 
      metrics.allocation.engineStatus === "running" ? "default" : "outline",
  },
  {
    title: "Real-Time Monitoring",
    href: "/real-time",
    icon: "Activity",
    metricKey: "monitoring",
    metricDisplay: (metrics: SidebarMetrics) => 
      metrics.monitoring.alerts > 0 ? `${metrics.monitoring.alerts}` : "",
    metricTooltip: (metrics: SidebarMetrics) => 
      metrics.monitoring.alerts > 0 
        ? `${metrics.monitoring.alerts} active alerts requiring attention` 
        : "No active alerts",
    metricHighlight: (metrics: SidebarMetrics) => 
      metrics.monitoring.alerts > 0 ? "destructive" : "default",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "BarChart3",
    metricKey: "analytics",
    metricDisplay: (metrics: SidebarMetrics) => 
      metrics.analytics.insights > 0 ? `${metrics.analytics.insights}` : "",
    metricTooltip: (metrics: SidebarMetrics) => 
      metrics.analytics.insights > 0 
        ? `${metrics.analytics.insights} new insights available` 
        : "No new insights",
    metricHighlight: (metrics: SidebarMetrics) => 
      metrics.analytics.insights > 0 ? "default" : null,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings2",
    metricKey: "settings",
    metricDisplay: (metrics: SidebarMetrics) => 
      metrics.settings.pendingChanges ? "!" : "",
    metricTooltip: (metrics: SidebarMetrics) => 
      metrics.settings.pendingChanges ? "Pending changes require attention" : "No pending changes",
    metricHighlight: (metrics: SidebarMetrics) => 
      metrics.settings.pendingChanges ? "secondary" : null,
  },
]

const adminItems = [
  {
    title: "User Management",
    href: "/settings/users",
    icon: "User",
  },
]

// Helper to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec} seconds ago`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
}

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [metrics, setMetrics] = useState<SidebarMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if the viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Load metrics and set up periodic refresh
  useEffect(() => {
    // Immediate fetch to reduce initial loading time
    const fetchData = async () => {
      try {
        const data = await fetchSidebarMetrics();
        setMetrics(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sidebar metrics:", error);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time metrics updates
    const cleanup = setupMetricsRefresh((newMetrics) => {
      setMetrics(newMetrics);
      setLoading(false);
    }, 30000); // Update every 30 seconds
    
    return cleanup;
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Determine icon size based on viewport
  const iconSize = isMobile ? 18 : 16;

  return (
    <div className="flex flex-col h-full border-r bg-muted/40" data-testid="sidebar">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">AW</span>
          </div>
          <span className={isMobile ? "text-sm" : ""}>Amazon Warehouse</span>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="flex flex-col gap-2 p-4">
          <TooltipProvider>
            {sidebarNavItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "justify-start", 
                      pathname === item.href && "bg-muted",
                      isMobile ? "py-1.5 px-2 text-sm" : ""
                    )}
                    asChild
                  >
                    <Link 
                      href={item.href} 
                      className="relative w-full"
                      data-testid={`sidebar-item-${item.metricKey || 'dashboard'}`}
                    >
                      <div className="flex items-center w-full">
                        <Icon 
                          name={item.icon} 
                          className={cn(
                            "flex-shrink-0",
                            isMobile ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"
                          )} 
                        />
                        <span className={cn(
                          "transition-opacity",
                          isMobile ? "text-sm" : ""
                        )}>
                          {item.title}
                        </span>
                        
                        {/* Render metric badges if we have metrics and this item has a metric key */}
                        {metrics && item.metricKey && item.metricDisplay && item.metricDisplay(metrics) && (
                          <Badge 
                            variant={item.metricHighlight?.(metrics) || "outline"}
                            className={cn(
                              "ml-auto transition-all sidebar-badge",
                              isMobile ? "text-xs px-1.5 py-0" : ""
                            )}
                            data-metric-key={item.metricKey}
                          >
                            {item.metricDisplay(metrics)}
                          </Badge>
                        )}
                        
                        {/* Show loading spinner while metrics are loading */}
                        {loading && item.metricKey && (
                          <div className="ml-auto h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent sidebar-loading"></div>
                        )}
                      </div>
                    </Link>
                  </Button>
                </TooltipTrigger>
                {metrics && item.metricKey && item.metricTooltip && (
                  <TooltipContent side="right" className="max-w-[200px]">
                    {item.metricTooltip(metrics)}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>

          {user && user.role === "admin" && (
            <>
              <div className="my-2 border-t pt-2">
                <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Admin</p>
                {adminItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "justify-start", 
                      pathname === item.href && "bg-muted",
                      isMobile ? "py-1.5 px-2 text-sm" : ""
                    )}
                    asChild
                  >
                    <Link href={item.href} className="relative w-full" data-testid={`sidebar-item-admin-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="flex items-center w-full">
                        <Icon 
                          name={item.icon} 
                          className={cn(
                            "flex-shrink-0",
                            isMobile ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"
                          )} 
                        />
                        <span className={isMobile ? "text-sm" : ""}>
                          {item.title}
                        </span>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 w-64 border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start" data-testid="user-menu-button">
              <Avatar className={cn("mr-2", isMobile ? "h-6 w-6" : "h-8 w-8")}>
                <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.role === "admin" ? "Administrator" : "Manager"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon name="User" className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="Settings2" className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <Icon name="LogOut" className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
