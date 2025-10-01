import { FileUpload } from "@/components/file-upload"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">File Transfer</h1>
            <p className="mt-2 text-muted-foreground">
              Upload files with fault-tolerant retry logic and real-time monitoring
            </p>
          </div>
          <FileUpload />
        </div>
      </main>
    </div>
  )
}
