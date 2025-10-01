import { Sidebar } from "@/components/sidebar"
import { TransferHistory } from "@/components/transfer-history"

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">Transfer History</h1>
            <p className="mt-2 text-muted-foreground">View all file transfers with detailed status and metrics</p>
          </div>
          <TransferHistory />
        </div>
      </main>
    </div>
  )
}
