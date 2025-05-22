"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RefreshCw, Settings } from "lucide-react"
import { useState } from "react"

export function AllocationEngine() {
  const [engineStatus, setEngineStatus] = useState<"running" | "paused">("running")
  const [algorithm, setAlgorithm] = useState<"constraint" | "weighted" | "realtime">("constraint")

  const toggleEngine = () => {
    setEngineStatus(engineStatus === "running" ? "paused" : "running")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scheduler Engine</CardTitle>
            <CardDescription>Task allocation and optimization</CardDescription>
          </div>
          <Badge variant={engineStatus === "running" ? "default" : "outline"}>
            {engineStatus === "running" ? "Running" : "Paused"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="constraint" onValueChange={(value) => setAlgorithm(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="constraint">Constraint-Based</TabsTrigger>
            <TabsTrigger value="weighted">Weighted Rotation</TabsTrigger>
            <TabsTrigger value="realtime">Real-Time Rebalancing</TabsTrigger>
          </TabsList>
          <TabsContent value="constraint" className="space-y-4 mt-4">
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
          </TabsContent>
          <TabsContent value="weighted" className="space-y-4 mt-4">
            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">Weighted Randomized Rotation</h3>
              <p className="text-sm text-muted-foreground">
                Assigning weights based on fatigue, past workload, and preferences for fair task distribution.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fairness Index:</span>
                  <span className="font-medium">87.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rotation Frequency:</span>
                  <span className="font-medium">Every 2 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Weight Factors:</span>
                  <span className="font-medium">4 active</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="realtime" className="space-y-4 mt-4">
            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">Real-Time Rebalancing</h3>
              <p className="text-sm text-muted-foreground">
                Event-driven architecture using Kafka to trigger job reallocation based on real-time events.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Events Processed:</span>
                  <span className="font-medium">142 today</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg. Response Time:</span>
                  <span className="font-medium">1.2 seconds</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rebalancing Events:</span>
                  <span className="font-medium">24 today</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={toggleEngine}>
            {engineStatus === "running" ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {engineStatus === "running" ? "Pause Engine" : "Start Engine"}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Optimization
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Engine Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
