import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Shift {
  id: number
  name: string
  employees: {
    total: number
    present: number
  }
  start: string
  end: string
  status: "active" | "upcoming" | "completed"
  taskCoverage: number
}

export function UpcomingShifts() {
  const shifts: Shift[] = [
    {
      id: 1,
      name: "Morning Shift",
      employees: {
        total: 85,
        present: 78,
      },
      start: "06:00 AM",
      end: "02:00 PM",
      status: "active",
      taskCoverage: 92,
    },
    {
      id: 2,
      name: "Afternoon Shift",
      employees: {
        total: 70,
        present: 64,
      },
      start: "02:00 PM",
      end: "10:00 PM",
      status: "upcoming",
      taskCoverage: 88,
    },
    {
      id: 3,
      name: "Night Shift",
      employees: {
        total: 45,
        present: 42,
      },
      start: "10:00 PM",
      end: "06:00 AM",
      status: "upcoming",
      taskCoverage: 95,
    },
    {
      id: 4,
      name: "Weekend Shift",
      employees: {
        total: 40,
        present: 35,
      },
      start: "08:00 AM",
      end: "04:00 PM",
      status: "upcoming",
      taskCoverage: 85,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shift Schedule</CardTitle>
        <CardDescription>Current and upcoming shifts with staffing levels</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shift Name</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Task Coverage</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">{shift.name}</TableCell>
                <TableCell>
                  {shift.employees.present}/{shift.employees.total}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({Math.round((shift.employees.present / shift.employees.total) * 100)}%)
                  </span>
                </TableCell>
                <TableCell>
                  {shift.start} - {shift.end}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-muted rounded-full mr-2">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${shift.taskCoverage}%` }}></div>
                    </div>
                    <span>{shift.taskCoverage}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      shift.status === "active" ? "default" : shift.status === "upcoming" ? "outline" : "secondary"
                    }
                  >
                    {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
