"use client"

import { useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { OverviewStats } from "@/components/overview-stats"
import { TaskAllocationChart } from "@/components/task-allocation-chart"
import { EmployeePerformance } from "@/components/employee-performance"
import { RecentAlerts } from "@/components/recent-alerts"
import { WarehouseMap } from "@/components/warehouse-map"
import { UpcomingShifts } from "@/components/upcoming-shifts"
import { TaskQueue } from "@/components/task-queue"
import { AllocationEngine } from "@/components/allocation-engine"
import { DatabaseStatus } from "@/components/database-status"
import { initializeDatabase } from "@/lib/init-db"

export default function DashboardPage() {
  useEffect(() => {
    // Initialize database on client side
    initializeDatabase()
  }, [])

  return (
    <DashboardShell>
      <DatabaseStatus />

      <DashboardHeader
        heading="Job Allocation Dashboard"
        text="Real-time task assignment and warehouse operations monitoring."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewStats />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <AllocationEngine />
        </div>
        <div className="col-span-3">
          <TaskQueue />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-3">
          <RecentAlerts />
        </div>
        <div className="col-span-4">
          <WarehouseMap />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <TaskAllocationChart />
        <EmployeePerformance />
      </div>

      <div className="mt-4">
        <UpcomingShifts />
      </div>
    </DashboardShell>
  )
}
