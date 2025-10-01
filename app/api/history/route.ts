import { NextResponse } from "next/server"

// Simulated transfer history (in production, use a database)
function generateHistory() {
  const statuses = ["success", "failed", "retrying"]
  const files = [
    "document.pdf",
    "image.png",
    "video.mp4",
    "archive.zip",
    "data.csv",
    "presentation.pptx",
    "spreadsheet.xlsx",
    "code.zip",
  ]

  return Array.from({ length: 50 }, (_, i) => ({
    id: `transfer-${i + 1}`,
    fileName: files[Math.floor(Math.random() * files.length)],
    fileSize: Math.floor(Math.random() * 100000000) + 1000000, // 1MB - 100MB
    status: statuses[Math.floor(Math.random() * statuses.length)],
    retryCount: Math.floor(Math.random() * 4),
    duration: Math.floor(Math.random() * 30000) + 1000, // 1-30 seconds
    timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 7), // Last 7 days
    throughput: Math.floor(Math.random() * 50000000) + 1000000, // bytes/sec
  }))
}

export async function GET() {
  const history = generateHistory()
  return NextResponse.json({ transfers: history })
}
