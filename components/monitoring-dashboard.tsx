"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { TransferRateChart } from "@/components/transfer-rate-chart"
import { RequestsChart } from "@/components/requests-chart"
import { Activity, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"

interface Metrics {
  transferRates: Array<{ timestamp: number; outgoing: number; incoming: number }>
  requests: Array<{ timestamp: number; count: number; errors: number; retries: number }>
  systemHealth: {
    uptime: number
    totalTransfers: number
    successfulTransfers: number
    failedTransfers: number
    averageRetries: number
    totalDataTransferred: string
  }
  timestamp: number
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/metrics")
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("[v0] Failed to fetch metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading metrics...</div>
      </div>
    )
  }

  const successRate = ((metrics.systemHealth.successfulTransfers / metrics.systemHealth.totalTransfers) * 100).toFixed(
    2,
  )

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="System Uptime"
          value={`${metrics.systemHealth.uptime}%`}
          icon={Activity}
          trend="+0.01%"
          trendUp={true}
        />
        <MetricCard title="Success Rate" value={`${successRate}%`} icon={CheckCircle2} trend="+2.3%" trendUp={true} />
        <MetricCard
          title="Total Transfers"
          value={metrics.systemHealth.totalTransfers.toLocaleString()}
          icon={TrendingUp}
          trend="+1,247"
          trendUp={true}
        />
        <MetricCard
          title="Failed Transfers"
          value={metrics.systemHealth.failedTransfers.toString()}
          icon={AlertCircle}
          trend="-5"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground">Transfer Rate</h3>
            <p className="text-sm text-muted-foreground">Real-time data transfer rates</p>
          </div>
          <TransferRateChart data={metrics.transferRates} />
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground">Requests</h3>
            <p className="text-sm text-muted-foreground">Request volume and error rates</p>
          </div>
          <RequestsChart data={metrics.requests} />
        </Card>
      </div>

      {/* System Health Details */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium text-foreground">System Health</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Data Transferred</p>
            <p className="text-2xl font-semibold text-foreground">{metrics.systemHealth.totalDataTransferred}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Average Retries</p>
            <p className="text-2xl font-semibold text-foreground">{metrics.systemHealth.averageRetries.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-2xl font-semibold text-foreground">{new Date(metrics.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
