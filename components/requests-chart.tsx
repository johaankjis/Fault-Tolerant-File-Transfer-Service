"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RequestData {
  timestamp: number
  count: number
  errors: number
  retries: number
}

interface RequestsChartProps {
  data: RequestData[]
}

export function RequestsChart({ data }: RequestsChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    requests: d.count,
    errors: d.errors,
    retries: d.retries,
  }))

  return (
    <ChartContainer
      config={{
        requests: {
          label: "Requests",
          color: "hsl(var(--chart-1))",
        },
        errors: {
          label: "Errors",
          color: "hsl(var(--chart-3))",
        },
        retries: {
          label: "Retries",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px] w-full"
    >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="requests" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="errors" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="retries" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  )
}
