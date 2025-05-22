"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon-fix"
import { Input } from "@/components/ui/input"

// List of all icon names we support
const iconNames = [
  // Navigation
  "Home",
  "Users",
  "User",
  "Settings",
  "Cog",
  "BarChart",
  "BarChart2",
  "BarChart3",
  "PieChart",
  "Clock",
  "Calendar",
  
  // Tasks
  "ClipboardList",
  "CheckSquare",
  "Package",
  "Box",
  "Boxes",
  "Truck",
  "ShoppingCart",
  
  // Layout
  "LayoutDashboard",
  "Layout",
  "Layers",
  "Grid",
  
  // Alerts
  "AlertTriangle",
  "AlertCircle",
  "AlertOctagon",
  "Bell",
  "BellRing",
  "Info",
  
  // Actions
  "Edit",
  "Pencil",
  "Trash",
  "Trash2",
  "Save",
  "Download",
  "Upload",
  "Plus",
  "Minus",
  "X",
  "Check",
  "Search",
  "Filter",
  "SortAsc",
  "SortDesc",
  
  // Media
  "Play",
  "Pause",
  "Stop",
  "SkipBack",
  "SkipForward",
  "Volume",
  "Volume2",
  "VolumeX",
  
  // User actions
  "UserPlus",
  "UserMinus",
  "UserCheck",
  "UserX",
  "LogIn",
  "LogOut",
  
  // Utility
  "RefreshCw",
  "RefreshCcw",
  "RotateCw",
  "RotateCcw",
  "Link",
  "ExternalLink",
  "Eye",
  "EyeOff",
  "Copy",
  "Clipboard",
  "Star",
  "Heart",
]

export default function IconReferencePage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredIcons = iconNames.filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Icon Reference" 
        text="A reference of all available icons in the application"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Available Icons</CardTitle>
          <CardDescription>
            Use these icons throughout the application with the Icon component
          </CardDescription>
          <div className="mt-4">
            <Input 
              placeholder="Search icons..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredIcons.map(name => (
              <div key={name} className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-muted/50">
                <Icon name={name} className="h-8 w-8 mb-2" />
                <span className="text-xs text-center font-mono">{name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
} 