"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, UserPlus } from "lucide-react"

interface Employee {
  id: number
  name: string
  email: string
  role: string
  skills: string[]
  certifications: string[]
  shift: string
  status: "active" | "break" | "offline"
  currentTask: string | null
}

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample employee data
  const employees: Employee[] = [
    {
      id: 101,
      name: "Jane Doe",
      email: "jane.doe@amazon.com",
      role: "Associate",
      skills: ["picking", "stowing"],
      certifications: ["PIT"],
      shift: "Morning",
      status: "active",
      currentTask: "Picking - Zone A",
    },
    {
      id: 102,
      name: "Michael Smith",
      email: "michael.smith@amazon.com",
      role: "Associate",
      skills: ["stowing", "inventory"],
      certifications: [],
      shift: "Morning",
      status: "break",
      currentTask: null,
    },
    {
      id: 103,
      name: "Sarah Johnson",
      email: "sarah.johnson@amazon.com",
      role: "Team Lead",
      skills: ["picking", "packing", "problem solving"],
      certifications: ["Hazmat"],
      shift: "Morning",
      status: "active",
      currentTask: "Problem Solving - Zone C",
    },
    {
      id: 104,
      name: "Robert Chen",
      email: "robert.chen@amazon.com",
      role: "Associate",
      skills: ["packing", "inventory"],
      certifications: ["PIT", "Hazmat"],
      shift: "Afternoon",
      status: "offline",
      currentTask: null,
    },
    {
      id: 105,
      name: "Emily Wilson",
      email: "emily.wilson@amazon.com",
      role: "Associate",
      skills: ["picking", "stowing", "packing"],
      certifications: [],
      shift: "Morning",
      status: "active",
      currentTask: "Picking - Zone D",
    },
    {
      id: 106,
      name: "David Martinez",
      email: "david.martinez@amazon.com",
      role: "Associate",
      skills: ["stowing", "inventory"],
      certifications: ["PIT"],
      shift: "Afternoon",
      status: "offline",
      currentTask: null,
    },
    {
      id: 107,
      name: "Lisa Wang",
      email: "lisa.wang@amazon.com",
      role: "Team Lead",
      skills: ["picking", "packing", "problem solving"],
      certifications: ["Hazmat", "PIT"],
      shift: "Afternoon",
      status: "offline",
      currentTask: null,
    },
  ]

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      employee.certifications.some((cert) => cert.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "break":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-300"
      default:
        return "bg-gray-300"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Employee Management" text="Manage employee profiles, skills, and task assignments">
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>View and manage warehouse employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, skills or certifications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="ml-2">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Skills & Certifications</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Task</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
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
                  </TableCell>
                  <TableCell>{employee.shift} Shift</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(employee.status)}`}></div>
                      <span className="capitalize">{employee.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {employee.currentTask || <span className="text-muted-foreground">Not assigned</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
