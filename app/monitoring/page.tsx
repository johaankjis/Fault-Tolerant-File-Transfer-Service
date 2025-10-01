import { Sidebar } from "@/components/sidebar"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"

export default function MonitoringPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">Monitoring</h1>
            <p className="mt-2 text-muted-foreground">Real-time metrics and system health monitoring</p>
          </div>
          <MonitoringDashboard />
        </div>
      </main>
    </div>
  )
}
