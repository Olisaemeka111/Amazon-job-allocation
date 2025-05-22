"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon } from "@/components/ui/icon-fix"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TaskAllocationPage() {
  const [engineStatus, setEngineStatus] = useState("running")
  const [allocationMethod, setAllocationMethod] = useState("constraint-based")
  const [optimizationLevel, setOptimizationLevel] = useState(80)
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Task Allocation"
        text="AI-powered task assignment and optimization."
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Allocation Engine</CardTitle>
            <CardDescription>
              Current status and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={engineStatus === "running" ? "default" : "outline"}>
                  {engineStatus === "running" ? "Running" : "Paused"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last optimization: 3 minutes ago
                </span>
              </div>
              
              <Button 
                variant={engineStatus === "running" ? "outline" : "default"} 
                onClick={() => setEngineStatus(engineStatus === "running" ? "paused" : "running")}
              >
                <Icon name={engineStatus === "running" ? "Pause" : "Play"} className="mr-2 h-4 w-4" />
                {engineStatus === "running" ? "Pause Engine" : "Start Engine"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="allocation-method">Allocation Method</Label>
                <Select value={allocationMethod} onValueChange={setAllocationMethod}>
                  <SelectTrigger id="allocation-method" className="w-[180px]">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="constraint-based">Constraint-Based</SelectItem>
                    <SelectItem value="weighted-rotation">Weighted Rotation</SelectItem>
                    <SelectItem value="real-time-rebalancing">Real-Time Rebalancing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="optimization-level">Optimization Level</Label>
                  <span className="text-sm">{optimizationLevel}%</span>
                </div>
                <Slider 
                  id="optimization-level" 
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[optimizationLevel]} 
                  onValueChange={(value) => setOptimizationLevel(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Balanced</span>
                  <span>Optimized</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label>Optimization Constraints</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="skill-matching" className="cursor-pointer text-sm">Skill Matching</Label>
                    <Switch id="skill-matching" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="workload-balancing" className="cursor-pointer text-sm">Workload Balancing</Label>
                    <Switch id="workload-balancing" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fatigue-prevention" className="cursor-pointer text-sm">Fatigue Prevention</Label>
                    <Switch id="fatigue-prevention" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="zone-proximity" className="cursor-pointer text-sm">Zone Proximity</Label>
                    <Switch id="zone-proximity" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Reset Defaults</Button>
            <Button>Apply Settings</Button>
          </CardFooter>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Current Optimization</CardTitle>
            <CardDescription>
              Performance metrics and statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Optimization Score</div>
                <div className="text-3xl font-bold">94.2%</div>
                <div className="text-xs text-muted-foreground">+2.7% from last run</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Active Constraints</div>
                <div className="text-3xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">All constraints satisfied</div>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Skill Utilization</span>
                  <span className="text-sm">96%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: "96%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Workload Balance</span>
                  <span className="text-sm">88%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: "88%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Travel Efficiency</span>
                  <span className="text-sm">92%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: "92%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Priority Satisfaction</span>
                  <span className="text-sm">100%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
              Run Optimization Now
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Task Assignments</TabsTrigger>
          <TabsTrigger value="employees">Employee Workloads</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Task Assignments</CardTitle>
              <CardDescription>
                All active and pending task allocations
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                [Task Assignment Table]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Workload Distribution</CardTitle>
              <CardDescription>
                Current workload per employee
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                [Employee Workload Chart]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Schedule</CardTitle>
              <CardDescription>
                Task timeline for current shift
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                [Schedule Timeline]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
