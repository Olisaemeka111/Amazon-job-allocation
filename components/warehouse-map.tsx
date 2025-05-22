import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function WarehouseMap() {
  // Sample zone data
  const zones = [
    { id: "A", taskCount: 42, employeeCount: 15, status: "normal" },
    { id: "B", taskCount: 38, employeeCount: 12, status: "high" },
    { id: "C", taskCount: 25, employeeCount: 10, status: "normal" },
    { id: "D", taskCount: 18, employeeCount: 8, status: "low" },
    { id: "E", taskCount: 30, employeeCount: 0, status: "attention" },
    { id: "F", taskCount: 15, employeeCount: 6, status: "normal" },
  ]

  const getZoneColor = (status: string) => {
    switch (status) {
      case "high":
        return "bg-orange-100 border-orange-300"
      case "normal":
        return "bg-blue-50 border-blue-200"
      case "low":
        return "bg-green-50 border-green-200"
      case "attention":
        return "bg-red-100 border-red-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Map</CardTitle>
        <CardDescription>Real-time zone activity and task distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 h-[300px]">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`border-2 rounded-md p-3 flex flex-col justify-between ${getZoneColor(zone.status)}`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">Zone {zone.id}</h3>
                {zone.status === "attention" && <Badge variant="destructive">Needs Attention</Badge>}
              </div>

              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks:</span>
                  <span className="font-medium">{zone.taskCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Employees:</span>
                  <span className="font-medium">{zone.employeeCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ratio:</span>
                  <span className="font-medium">
                    {zone.employeeCount > 0 ? (zone.taskCount / zone.employeeCount).toFixed(1) : "∞"} tasks/employee
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
