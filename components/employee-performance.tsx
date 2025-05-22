import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Employee {
  id: number
  name: string
  skills: string[]
  certifications: string[]
  performance: number
  currentTask: string | null
  avatar: string
}

export function EmployeePerformance() {
  // Sample employee data
  const employees: Employee[] = [
    {
      id: 101,
      name: "Jane Doe",
      skills: ["picking", "stowing"],
      certifications: ["PIT"],
      performance: 95,
      currentTask: "Picking - Zone A",
      avatar: "JD",
    },
    {
      id: 102,
      name: "Michael Smith",
      skills: ["stowing", "inventory"],
      certifications: [],
      performance: 92,
      currentTask: "Stowing - Zone B",
      avatar: "MS",
    },
    {
      id: 103,
      name: "Sarah Johnson",
      skills: ["picking", "packing"],
      certifications: ["Hazmat"],
      performance: 88,
      currentTask: null,
      avatar: "SJ",
    },
    {
      id: 104,
      name: "Robert Chen",
      skills: ["packing", "inventory"],
      certifications: ["PIT", "Hazmat"],
      performance: 85,
      currentTask: "Packing - Zone C",
      avatar: "RC",
    },
    {
      id: 105,
      name: "Emily Wilson",
      skills: ["picking", "stowing", "packing"],
      certifications: [],
      performance: 82,
      currentTask: "Picking - Zone D",
      avatar: "EW",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>Employees with highest efficiency ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="flex items-center">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarFallback>{employee.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {employee.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {employee.certifications.map((cert) => (
                        <Badge key={cert} className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-medium">{employee.performance}%</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${employee.performance}%` }}></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{employee.currentTask || "Not assigned"}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
