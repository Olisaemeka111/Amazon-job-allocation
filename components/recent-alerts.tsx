"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, Info, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppData } from "@/lib/data-context"

interface SystemAlert {
  id: number
  type: "error" | "warning" | "info" | "success"
  title: string
  description: string
  time: string
  source: "system" | "employee" | "task"
  resolved: boolean
}

export function RecentAlerts() {
  const { alerts: initialAlerts } = useAppData()
  const [alerts, setAlerts] = useState<SystemAlert[]>(initialAlerts)

  const resolveAlert = (id: number) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, resolved: !alert.resolved } : alert)))
  }

  const getAlertIcon = (type: SystemAlert["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-6 w-6 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case "info":
      case "success":
      default:
        return <Info className="h-6 w-6 text-blue-500" />
    }
  }

  const getAlertBgColor = (type: SystemAlert["type"], resolved: boolean) => {
    if (resolved) return "bg-gray-800"

    switch (type) {
      case "error":
        return "bg-red-950 border-red-800"
      case "warning":
        return "bg-gray-800 border-gray-700"
      case "info":
        return "bg-gray-900 border-gray-800"
      case "success":
        return "bg-green-950 border-green-900"
      default:
        return "bg-gray-900 border-gray-800"
    }
  }

  const getAlertTextColor = (type: SystemAlert["type"], resolved: boolean) => {
    if (resolved) return "text-gray-400"

    switch (type) {
      case "error":
        return "text-red-500"
      case "warning":
        return "text-yellow-500"
      case "info":
        return "text-blue-500"
      case "success":
        return "text-green-500"
      default:
        return "text-gray-300"
    }
  }

  const getSourceLabel = (source: SystemAlert["source"]) => {
    switch (source) {
      case "system":
        return "System Alert"
      case "employee":
        return "Employee Report"
      case "task":
        return "Task Queue"
    }
  }

  return (
    <Card className="bg-black text-white border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl">System Alerts</CardTitle>
        <CardDescription className="text-gray-400">Real-time feedback and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No alerts found</div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={cn("rounded-lg border p-4", getAlertBgColor(alert.type, alert.resolved))}>
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={cn("text-xl font-medium", getAlertTextColor(alert.type, alert.resolved))}>
                        {alert.title}
                      </h3>
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{alert.time}</span>
                      </div>
                    </div>
                    <p className={cn("mt-1", alert.resolved ? "text-gray-500" : "text-gray-300")}>
                      {alert.description}
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="inline-flex items-center justify-center rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-sm">
                        {getSourceLabel(alert.source)}
                      </div>
                      <Button
                        variant="ghost"
                        className={cn(
                          "h-8 px-3",
                          alert.resolved ? "text-gray-400 hover:text-white" : "text-red-500 hover:text-red-400",
                        )}
                        onClick={() => resolveAlert(alert.id)}
                      >
                        {alert.resolved ? "Reopen" : "Resolve"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
