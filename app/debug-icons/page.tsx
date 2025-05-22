"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon, availableIcons } from "@/components/ui/icon-fix"
import { Input } from "@/components/ui/input"
import * as LucideIcons from "lucide-react"

export default function DebugIconsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [iconNames, setIconNames] = useState<string[]>([])
  
  useEffect(() => {
    // Get all the icon names from LucideIcons that are actual components
    const names = Object.keys(LucideIcons).filter(
      key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function'
    )
    setIconNames(names)
    console.log("Available Lucide icons:", names)
  }, [])
  
  const filteredIcons = iconNames.filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Icon Debug" 
        text="See all available Lucide icon names"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Available Lucide Icons ({iconNames.length})</CardTitle>
          <CardDescription>
            These are the actual icon names exported from the Lucide library
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
            {filteredIcons.map(name => {
              const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as any
              return (
                <div key={name} className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-muted/50">
                  {IconComponent && <IconComponent className="h-8 w-8 mb-2" />}
                  <span className="text-xs text-center font-mono">{name}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
} 