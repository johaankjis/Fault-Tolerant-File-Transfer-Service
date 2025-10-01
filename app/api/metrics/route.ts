import { NextResponse } from "next/server"

// Simulated metrics data (in production, use a time-series database)
function generateMetrics() {
  const now = Date.now()
  const points = 50

  // Generate transfer rate data
  const transferRates = Array.from({ length: points }, (_, i) => ({
    timestamp: now - (points - i) * 60000, // 1 minute intervals
    outgoing: Math.random() * 500 + 100, // MB/s
    incoming: Math.random() * 300 + 50,
  }))

  // Generate request data
  const requests = Array.from({ length: points }, (_, i) => ({
    timestamp: now - (points - i) * 60000,
    count: Math.floor(Math.random() * 1000 + 500),
    errors: Math.floor(Math.random() * 50),
    retries: Math.floor(Math.random() * 100),
  }))

  // Generate system health data
  const systemHealth = {
    uptime: 99.99,
    totalTransfers: 15847,
    successfulTransfers: 15832,
    failedTransfers: 15,
    averageRetries: 0.3,
    totalDataTransferred: "2.4 TB",
  }

  return {
    transferRates,
    requests,
    systemHealth,
    timestamp: now,
  }
}

export async function GET() {
  const metrics = generateMetrics()
  return NextResponse.json(metrics)
}
