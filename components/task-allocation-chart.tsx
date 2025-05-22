import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts"

export function TaskAllocationChart() {
  // Sample data for task distribution
  const taskTypeData = [
    { name: "Picking", value: 35, color: "#0ea5e9" },
    { name: "Packing", value: 25, color: "#8b5cf6" },
    { name: "Stowing", value: 20, color: "#10b981" },
    { name: "Replenishment", value: 10, color: "#f59e0b" },
    { name: "Inventory Count", value: 5, color: "#ef4444" },
    { name: "Tote Move", value: 5, color: "#6b7280" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Allocation</CardTitle>
        <CardDescription>Distribution of tasks by type and priority</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {taskTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
