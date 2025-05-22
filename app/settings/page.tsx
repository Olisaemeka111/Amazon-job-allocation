"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon } from "@/components/ui/icon-fix"

export default function SettingsPage() {
  const [systemFeatures, setSystemFeatures] = useState({
    autoReassignment: true,
    predictiveAnalytics: true,
    pushNotifications: true,
    employeeFeedback: true
  })

  const [integrations, setIntegrations] = useState({
    warehouseManagement: true,
    hrSystem: true,
    iotDevices: true,
    analyticsPlatform: false
  })

  const toggleFeature = (feature: keyof typeof systemFeatures) => {
    setSystemFeatures({
      ...systemFeatures,
      [feature]: !systemFeatures[feature]
    })
  }

  const toggleIntegration = (integration: keyof typeof integrations) => {
    setIntegrations({
      ...integrations,
      [integration]: !integrations[integration]
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="System Settings" 
        text="Configure system parameters and optimization algorithms."
      >
        <Button variant="outline">
          <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure general system parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="dataRefresh">Data Refresh Rate (seconds)</Label>
                <Input id="dataRefresh" defaultValue="30" type="number" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="taskAllocation">Task Allocation Frequency</Label>
                <Select defaultValue="hourly">
                  <SelectTrigger id="taskAllocation" className="mt-1">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="minutes15">Every 15 minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="shift">Per Shift</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="optimization">Optimization Level</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger id="optimization" className="mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">System Features</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Task Reassignment</Label>
                </div>
                <Switch 
                  checked={systemFeatures.autoReassignment}
                  onCheckedChange={() => toggleFeature('autoReassignment')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Predictive Analytics</Label>
                </div>
                <Switch 
                  checked={systemFeatures.predictiveAnalytics}
                  onCheckedChange={() => toggleFeature('predictiveAnalytics')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                </div>
                <Switch 
                  checked={systemFeatures.pushNotifications}
                  onCheckedChange={() => toggleFeature('pushNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Employee Feedback Collection</Label>
                </div>
                <Switch 
                  checked={systemFeatures.employeeFeedback}
                  onCheckedChange={() => toggleFeature('employeeFeedback')}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Icon name="Save" className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>Configure integrations with other systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Warehouse Management System</Label>
                    <p className="text-sm text-muted-foreground">Connect to inventory and order management</p>
                  </div>
                  <Switch 
                    checked={integrations.warehouseManagement}
                    onCheckedChange={() => toggleIntegration('warehouseManagement')}
                  />
                </div>
                
                {integrations.warehouseManagement && (
                  <div>
                    <Label htmlFor="wmsApi">WMS API Endpoint</Label>
                    <Input 
                      id="wmsApi" 
                      defaultValue="https://api.warehouse.example.com/v1" 
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">HR System</Label>
                    <p className="text-sm text-muted-foreground">Connect to employee data and scheduling</p>
                  </div>
                  <Switch 
                    checked={integrations.hrSystem}
                    onCheckedChange={() => toggleIntegration('hrSystem')}
                  />
                </div>
                
                {integrations.hrSystem && (
                  <div>
                    <Label htmlFor="hrApi">HR API Endpoint</Label>
                    <Input 
                      id="hrApi" 
                      defaultValue="https://api.hr.example.com/v2" 
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">IoT Devices</Label>
                    <p className="text-sm text-muted-foreground">Connect to warehouse sensors and wearables</p>
                  </div>
                  <Switch 
                    checked={integrations.iotDevices}
                    onCheckedChange={() => toggleIntegration('iotDevices')}
                  />
                </div>
                
                {integrations.iotDevices && (
                  <div>
                    <Label htmlFor="iotGateway">IoT Gateway</Label>
                    <Input 
                      id="iotGateway" 
                      defaultValue="https://iot.warehouse.example.com" 
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Analytics Platform</Label>
                    <p className="text-sm text-muted-foreground">Export data for advanced analytics</p>
                  </div>
                  <Switch 
                    checked={integrations.analyticsPlatform}
                    onCheckedChange={() => toggleIntegration('analyticsPlatform')}
                  />
                </div>
                
                {integrations.analyticsPlatform && (
                  <div>
                    <Label htmlFor="analyticsApi">Analytics API</Label>
                    <Input 
                      id="analyticsApi" 
                      defaultValue="https://analytics.example.com/ingest" 
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Icon name="Save" className="mr-2 h-4 w-4" />
              Save Integration Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
} 