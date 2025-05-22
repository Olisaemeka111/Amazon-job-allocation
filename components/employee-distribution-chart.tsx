import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

export function EmployeeDistributionChart() {
  // Sample data for employee distribution
  const distributionData = [
    { name: "Picking", value: 65, color: "#0ea5e9" },
    { name: "Packing", value: 45, color: "#8b5cf6" },
    { name: "Stowing", value: 38, color: "#10b981" },
    { name: "Problem Solving", value: 12, color: "#f59e0b" },
    { name: "Inventory", value: 15, color: "#ef4444" },
    { name: "Training", value: 12, color: "#6b7280" },
  ]

  // Sample data for shift distribution
  const shiftData = [
    { name: "Morning", value: 87, color: "#0ea5e9" },
    { name: "Afternoon", value: 64, color: "#8b5cf6" },
    { name: "Night", value: 36, color: "#10b981" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Distribution</CardTitle>
        <CardDescription>Current employee allocation by task type and shift</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-center">By Task Type</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} employees`, "Count"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 text-center">By Shift</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shiftData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {shiftData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} employees`, "Count"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div className="font-medium">187</div>
            <div className="text-muted-foreground">Total Employees</div>
          </div>
          <div>
            <div className="font-medium">92%</div>
            <div className="text-muted-foreground">Utilization Rate</div>
          </div>
          <div>
            <div className="font-medium">15</div>
            <div className="text-muted-foreground">On Training</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
