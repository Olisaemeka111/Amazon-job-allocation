"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon } from "@/components/ui/icon-fix"
import { Badge } from "@/components/ui/badge"

export default function RealTimeMonitoringPage() {
  const [status, setStatus] = useState("active")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Real-Time Monitoring"
        text="Live monitoring of warehouse operations and task execution."
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant={status === "active" ? "default" : "destructive"}>
            {status === "active" ? "Active" : "Inactive"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
        
        <Button onClick={() => setStatus(status === "active" ? "inactive" : "active")}>
          <Icon name={status === "active" ? "Pause" : "Play"} className="mr-2 h-4 w-4" />
          {status === "active" ? "Pause Monitoring" : "Resume Monitoring"}
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                <Icon name="CheckSquare" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <div className="flex mt-2 text-xs items-center text-muted-foreground">
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: "65%" }}></div>
                  </div>
                  <span className="ml-2">65%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <Icon name="Users2" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28/34</div>
                <p className="text-xs text-muted-foreground">
                  82% of workforce active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Icon name="Activity" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Optimal</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Activity Map</CardTitle>
              <CardDescription>
                Real-time location and activity tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <div className="text-muted-foreground">[Interactive Warehouse Map]</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Idle</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Alert</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Icon name="Maximize2" className="mr-2 h-4 w-4" />
                Expand
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Last 10 events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">Task #{2483 + i} {i % 2 === 0 ? "Started" : "Completed"}</div>
                        <div className="text-sm text-muted-foreground">Zone A-{i + 1}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(Date.now() - i * 3 * 60000).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Current shift metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Task Completion Rate</span>
                      <span className="text-sm">92%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Average Response Time</span>
                      <span className="text-sm">1.4 min</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Resource Utilization</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Activity</CardTitle>
              <CardDescription>
                Real-time employee status and workload
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                [Employee Status Table]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zone Activity</CardTitle>
              <CardDescription>
                Activity levels by warehouse zone
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                [Zone Heat Map]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Issues requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                No active alerts at this time
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>
                Recent alerts and resolutions
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                [Alert History Table]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
} 