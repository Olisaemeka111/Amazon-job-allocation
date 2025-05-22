"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { dummyDb } from "./dummy-db"

// Define the shape of our application data
interface AppData {
  alerts: any[]
  employees: any[]
  tasks: any[]
  zones: any[]
  shifts: any[]
  isLoading: boolean
  error: string | null
}

// Create the context
const DataContext = createContext<AppData>({
  alerts: dummyDb.alerts,
  employees: dummyDb.employees,
  tasks: dummyDb.tasks,
  zones: dummyDb.zones,
  shifts: dummyDb.shifts,
  isLoading: false,
  error: null,
})

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({
    alerts: dummyDb.alerts,
    employees: dummyDb.employees,
    tasks: dummyDb.tasks,
    zones: dummyDb.zones,
    shifts: dummyDb.shifts,
    isLoading: false,
    error: null,
  })

  // No need to fetch data, just use the dummy data directly
  // This avoids API calls that might fail during deployment

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}

// Hook to use the data
export function useAppData() {
  return useContext(DataContext)
}
