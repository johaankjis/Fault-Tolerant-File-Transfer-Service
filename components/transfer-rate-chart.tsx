"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TransferRateData {
  timestamp: number
  outgoing: number
  incoming: number
}

interface TransferRateChartProps {
  data: TransferRateData[]
}

export function TransferRateChart({ data }: TransferRateChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    outgoing: Math.round(d.outgoing),
    incoming: Math.round(d.incoming),
  }))

  return (
    <ChartContainer
      config={{
        outgoing: {
          label: "Outgoing",
          color: "hsl(var(--chart-1))",
        },
        incoming: {
          label: "Incoming",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px] w-full"
    >
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} MB/s`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="outgoing"
          stroke="hsl(var(--chart-1))"
          fill="hsl(var(--chart-1))"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="incoming"
          stroke="hsl(var(--chart-2))"
          fill="hsl(var(--chart-2))"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
