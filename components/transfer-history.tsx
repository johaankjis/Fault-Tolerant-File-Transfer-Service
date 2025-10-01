"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Download, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Transfer {
  id: string
  fileName: string
  fileSize: number
  status: string
  retryCount: number
  duration: number
  timestamp: number
  throughput: number
}

export function TransferHistory() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = transfers.filter((transfer) =>
        transfer.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTransfers(filtered)
    } else {
      setFilteredTransfers(transfers)
    }
  }, [searchQuery, transfers])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history")
      const data = await response.json()
      setTransfers(data.transfers)
      setFilteredTransfers(data.transfers)
    } catch (error) {
      console.error("[v0] Failed to fetch history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatThroughput = (bytesPerSec: number) => {
    return formatFileSize(bytesPerSec) + "/s"
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      case "retrying":
        return (
          <Badge className="bg-warning/10 text-warning-foreground hover:bg-warning/20">
            <RefreshCw className="mr-1 h-3 w-3" />
            Retrying
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading transfer history...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={fetchHistory}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-muted-foreground">File Name</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Size</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Retries</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Throughput</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map((transfer, index) => (
                <tr
                  key={transfer.id}
                  className={cn("border-b border-border transition-colors hover:bg-muted/50", {
                    "bg-muted/20": index % 2 === 0,
                  })}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{transfer.fileName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{formatFileSize(transfer.fileSize)}</td>
                  <td className="p-4">{getStatusBadge(transfer.status)}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {transfer.retryCount > 0 ? (
                      <span className="text-warning">{transfer.retryCount}x</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDuration(transfer.duration)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{formatThroughput(transfer.throughput)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{formatTimestamp(transfer.timestamp)}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filteredTransfers.length} of {transfers.length} transfers
        </div>
        <div>
          Success: {transfers.filter((t) => t.status === "success").length} | Failed:{" "}
          {transfers.filter((t) => t.status === "failed").length}
        </div>
      </div>
    </div>
  )
}
