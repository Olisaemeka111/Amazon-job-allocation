"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pause, RefreshCw, Settings, Filter, Plus } from "lucide-react"
import { EmployeeDistributionChart } from "@/components/employee-distribution-chart"

type TaskPriority = "high" | "medium" | "low"
type TaskStatus = "pending" | "assigned" | "in-progress" | "completed" | "blocked"

interface Task {
  id: string
  type: string
  priority: TaskPriority
  duration: number
  requiredSkills: string[]
  assignedTo: string | null
  status: TaskStatus
  location: string
  createdAt: string
}

export default function TaskAllocationPage() {
  const [engineStatus, setEngineStatus] = useState<"running" | "paused">("running")
  const [algorithm, setAlgorithm] = useState<"constraint" | "weighted" | "realtime">("constraint")

  // Sample task data
  const tasks: Task[] = [
    {
      id: "T-92883",
      type: "picking",
      priority: "high",
      duration: 25,
      requiredSkills: ["picking"],
      assignedTo: "Jane D.",
      status: "in-progress",
      location: "Zone A-12",
      createdAt: "2025-05-12T08:30:00Z",
    },
    {
      id: "T-92884",
      type: "stowing",
      priority: "medium",
      duration: 40,
      requiredSkills: ["stowing"],
      assignedTo: "Michael S.",
      status: "assigned",
      location: "Zone B-05",
      createdAt: "2025-05-12T08:35:00Z",
    },
    {
      id: "T-92885",
      type: "packing",
      priority: "high",
      duration: 15,
      requiredSkills: ["packing"],
      assignedTo: null,
      status: "pending",
      location: "Zone C-08",
      createdAt: "2025-05-12T08:40:00Z",
    },
    {
      id: "T-92886",
      type: "replenishment",
      priority: "low",
      duration: 60,
      requiredSkills: ["stowing", "PIT"],
      assignedTo: null,
      status: "pending",
      location: "Zone D-14",
      createdAt: "2025-05-12T08:45:00Z",
    },
    {
      id: "T-92887",
      type: "inventory count",
      priority: "medium",
      duration: 30,
      requiredSkills: ["inventory"],
      assignedTo: "Sarah J.",
      status: "blocked",
      location: "Zone B-22",
      createdAt: "2025-05-12T08:50:00Z",
    },
    {
      id: "T-92888",
      type: "tote move",
      priority: "low",
      duration: 10,
      requiredSkills: ["PIT"],
      assignedTo: null,
      status: "pending",
      location: "Zone A-03",
      createdAt: "2025-05-12T08:55:00Z",
    },
    {
      id: "T-92889",
      type: "picking",
      priority: "high",
      duration: 20,
      requiredSkills: ["picking"],
      assignedTo: "Emily W.",
      status: "in-progress",
      location: "Zone D-09",
      createdAt: "2025-05-12T09:00:00Z",
    },
    {
      id: "T-92890",
      type: "packing",
      priority: "medium",
      duration: 15,
      requiredSkills: ["packing"],
      assignedTo: null,
      status: "pending",
      location: "Zone C-11",
      createdAt: "2025-05-12T09:05:00Z",
    },
  ]

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "assigned":
        return "default"
      case "in-progress":
        return "default"
      case "completed":
        return "success"
      case "blocked":
        return "destructive"
    }
  }

  const toggleEngine = () => {
    setEngineStatus(engineStatus === "running" ? "paused" : "running")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Task Allocation" text="Manage and monitor task assignments across the warehouse">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={toggleEngine}>
            {engineStatus === "running" ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {engineStatus === "running" ? "Pause Engine" : "Start Engine"}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Optimization
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Allocation Engine</CardTitle>
            <CardDescription>Configure task allocation algorithm</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="constraint" onValueChange={(value) => setAlgorithm(value as any)}>
              <TabsList className="grid w-full grid-cols-1 mb-4">
                <TabsTrigger value="constraint">Constraint-Based</TabsTrigger>
                <TabsTrigger value="weighted">Weighted Rotation</TabsTrigger>
                <TabsTrigger value="realtime">Real-Time Rebalancing</TabsTrigger>
              </TabsList>
              <TabsContent value="constraint" className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Constraint-Based Allocation</h3>
                  <p className="text-sm text-muted-foreground">
                    Using OptaPlanner to enforce skill matching, workload balancing, and fatigue prevention constraints.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Constraints:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Optimization Score:</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Optimization:</span>
                      <span className="font-medium">2 minutes ago</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Active Constraints</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        Hard
                      </Badge>
                      <span>Required skills must match</span>
                    </li>
                    <li className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        Hard
                      </Badge>
                      <span>Employee must be available</span>
                    </li>
                    <li className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        Soft
                      </Badge>
                      <span>Minimize travel distance</span>
                    </li>
                    <li className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        Soft
                      </Badge>
                      <span>Balance workload</span>
                    </li>
                    <li className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        Soft
                      </Badge>
                      <span>Rotate task types</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="weighted" className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Weighted Randomized Rotation</h3>
                  <p className="text-sm text-muted-foreground">
                    Assigning weights based on fatigue, past workload, and preferences for fair task distribution.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="realtime" className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Real-Time Rebalancing</h3>
                  <p className="text-sm text-muted-foreground">
                    Event-driven architecture using Kafka to trigger job reallocation based on real-time events.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Task Queue</CardTitle>
                <CardDescription>Current and pending tasks</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell className="capitalize">{task.type}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {task.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{task.location}</TableCell>
                    <TableCell>
                      {task.assignedTo || <span className="text-muted-foreground">Unassigned</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <EmployeeDistributionChart />

        <Card>
          <CardHeader>
            <CardTitle>Allocation Metrics</CardTitle>
            <CardDescription>Performance indicators for task allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Efficiency</h3>
                <div className="flex items-center">
                  <div className="w-full h-2 bg-muted rounded-full mr-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: "92%" }}></div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <p className="text-xs text-muted-foreground">Task completion rate</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Fairness</h3>
                <div className="flex items-center">
                  <div className="w-full h-2 bg-muted rounded-full mr-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: "87%" }}></div>
                  </div>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <p className="text-xs text-muted-foreground">Workload distribution</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Skill Utilization</h3>
                <div className="flex items-center">
                  <div className="w-full h-2 bg-muted rounded-full mr-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: "95%" }}></div>
                  </div>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <p className="text-xs text-muted-foreground">Optimal skill matching</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Response Time</h3>
                <div className="flex items-center">
                  <div className="w-full h-2 bg-muted rounded-full mr-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: "89%" }}></div>
                  </div>
                  <span className="text-sm font-medium">89%</span>
                </div>
                <p className="text-xs text-muted-foreground">Task assignment speed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
