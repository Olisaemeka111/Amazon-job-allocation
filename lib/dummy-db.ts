// Comprehensive in-memory database that mimics Supabase structure
// This will allow all features to work while waiting for real database setup

// Types for our database tables
export interface User {
  id: number
  email: string
  password: string
  name: string
  role: string
  created_at: string
  last_login: string | null
}

export interface Employee {
  id: number
  name: string
  email: string
  role: string
  skills: string[]
  certifications: string[]
  shift: string
  status: "active" | "break" | "offline"
  current_task: string | null
  performance_score: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  type: string
  priority: "high" | "medium" | "low"
  duration: number
  required_skills: string[]
  assigned_to: number | null
  status: "pending" | "assigned" | "in-progress" | "completed" | "blocked"
  location: string
  created_at: string
  updated_at: string
}

export interface Alert {
  id: number
  type: "error" | "warning" | "info" | "success"
  title: string
  description: string
  time: string
  source: "system" | "employee" | "task"
  resolved: boolean
  created_at: string
}

export interface Shift {
  id: number
  name: string
  start_time: string
  end_time: string
  employees_total: number
  employees_present: number
  task_coverage: number
  status: "active" | "upcoming" | "completed"
}

export interface Zone {
  id: string
  name: string
  task_count: number
  employee_count: number
  status: "normal" | "high" | "low" | "attention"
}

// In-memory database with pre-hashed password for admin
// This is the hash for "admin123"
const ADMIN_PASSWORD_HASH = "$2b$10$8OwZ1wG9Y5.lQOJ2QrUoWO9RQzaby/Hg.jWQ.TD8KI0.fNrEPD7nS"

// Database singleton
class DummyDatabase {
  private static instance: DummyDatabase

  users: User[] = [
    {
      id: 1,
      email: "admin@amazon-warehouse.com",
      password: ADMIN_PASSWORD_HASH,
      name: "System Administrator",
      role: "admin",
      created_at: new Date().toISOString(),
      last_login: null,
    },
  ]

  employees: Employee[] = [
    {
      id: 101,
      name: "Jane Doe",
      email: "jane.doe@amazon.com",
      role: "Associate",
      skills: ["picking", "stowing"],
      certifications: ["PIT"],
      shift: "Morning",
      status: "active",
      current_task: "Picking - Zone A",
      performance_score: 95,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
      current_task: null,
      performance_score: 92,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
      current_task: "Problem Solving - Zone C",
      performance_score: 88,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
      current_task: null,
      performance_score: 85,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
      current_task: "Picking - Zone D",
      performance_score: 82,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  tasks: Task[] = [
    {
      id: "T-92883",
      type: "picking",
      priority: "high",
      duration: 25,
      required_skills: ["picking"],
      assigned_to: 101,
      status: "in-progress",
      location: "Zone A-12",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "T-92884",
      type: "stowing",
      priority: "medium",
      duration: 40,
      required_skills: ["stowing"],
      assigned_to: 102,
      status: "assigned",
      location: "Zone B-05",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "T-92885",
      type: "packing",
      priority: "high",
      duration: 15,
      required_skills: ["packing"],
      assigned_to: null,
      status: "pending",
      location: "Zone C-08",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "T-92886",
      type: "replenishment",
      priority: "low",
      duration: 60,
      required_skills: ["stowing", "PIT"],
      assigned_to: null,
      status: "pending",
      location: "Zone D-14",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "T-92887",
      type: "inventory count",
      priority: "medium",
      duration: 30,
      required_skills: ["inventory"],
      assigned_to: 103,
      status: "blocked",
      location: "Zone B-22",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  alerts: Alert[] = [
    {
      id: 1,
      type: "error",
      title: "Zone E Understaffed",
      description: "No employees assigned to Zone E with 30 pending tasks",
      time: "10 minutes ago",
      source: "system",
      resolved: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      type: "warning",
      title: "High Priority Tasks Increasing",
      description: "24 high priority tasks in queue, up 15% from average",
      time: "25 minutes ago",
      source: "task",
      resolved: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      type: "error",
      title: "Blocked Location",
      description: "Inventory location B-22 is blocked, affecting 3 tasks",
      time: "32 minutes ago",
      source: "employee",
      resolved: false,
      created_at: new Date().toISOString(),
    },
  ]

  shifts: Shift[] = [
    {
      id: 1,
      name: "Morning Shift",
      start_time: "06:00 AM",
      end_time: "02:00 PM",
      employees_total: 85,
      employees_present: 78,
      task_coverage: 92,
      status: "active",
    },
    {
      id: 2,
      name: "Afternoon Shift",
      start_time: "02:00 PM",
      end_time: "10:00 PM",
      employees_total: 70,
      employees_present: 64,
      task_coverage: 88,
      status: "upcoming",
    },
    {
      id: 3,
      name: "Night Shift",
      start_time: "10:00 PM",
      end_time: "06:00 AM",
      employees_total: 45,
      employees_present: 42,
      task_coverage: 95,
      status: "upcoming",
    },
  ]

  zones: Zone[] = [
    { id: "A", name: "Zone A", task_count: 42, employee_count: 15, status: "normal" },
    { id: "B", name: "Zone B", task_count: 38, employee_count: 12, status: "high" },
    { id: "C", name: "Zone C", task_count: 25, employee_count: 10, status: "normal" },
    { id: "D", name: "Zone D", task_count: 18, employee_count: 8, status: "low" },
    { id: "E", name: "Zone E", task_count: 30, employee_count: 0, status: "attention" },
  ]

  // Singleton pattern
  public static getInstance(): DummyDatabase {
    if (!DummyDatabase.instance) {
      DummyDatabase.instance = new DummyDatabase()
    }
    return DummyDatabase.instance
  }

  // Helper to generate IDs
  generateId(collection: any[]): number {
    return Math.max(0, ...collection.map((item) => (typeof item.id === "number" ? item.id : 0))) + 1
  }

  // Helper to generate task IDs
  generateTaskId(): string {
    return `T-${Math.floor(90000 + Math.random() * 10000)}`
  }
}

// Export singleton instance
export const dummyDb = DummyDatabase.getInstance()
