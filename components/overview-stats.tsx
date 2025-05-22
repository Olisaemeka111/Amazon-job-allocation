import { Icon } from "@/components/ui/icon-fix"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OverviewStats() {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Associates</CardTitle>
          <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">187/245</div>
          <p className="text-xs text-muted-foreground">76% of total workforce</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasks in Queue</CardTitle>
          <Icon name="Package" className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">342</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500">+24%</span> from average
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Allocation Rate</CardTitle>
          <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98.2%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+2.5%</span> from yesterday
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Icon name="AlertTriangle" className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Optimal</div>
          <p className="text-xs text-muted-foreground">All systems operational</p>
        </CardContent>
      </Card>
    </>
  )
}
