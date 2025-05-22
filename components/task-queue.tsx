import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

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
}

export function TaskQueue() {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Queue</CardTitle>
            <CardDescription>Current and pending tasks</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{tasks.length} Tasks</Badge>
            <Badge variant="destructive">{tasks.filter((t) => t.priority === "high").length} High Priority</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px]">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center p-3 rounded-md border">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="font-medium">{task.id}</span>
                      <Badge variant={getPriorityColor(task.priority)} className="ml-2">
                        {task.priority}
                      </Badge>
                    </div>
                    <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {task.type.charAt(0).toUpperCase() + task.type.slice(1)} • {task.duration} min • {task.location}
                  </div>
                  <div className="flex justify-between text-xs">
                    <div>
                      <span className="text-muted-foreground">Skills: </span>
                      {task.requiredSkills.join(", ")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Assigned: </span>
                      {task.assignedTo || "Unassigned"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
