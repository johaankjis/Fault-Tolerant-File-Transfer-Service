import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
            <p className="mt-2 text-muted-foreground">Configure file transfer and retry settings</p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-medium text-foreground">Retry Configuration</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-retries">Maximum Retries</Label>
                  <Input id="max-retries" type="number" defaultValue="3" />
                  <p className="text-sm text-muted-foreground">
                    Number of retry attempts before marking transfer as failed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initial-delay">Initial Retry Delay (ms)</Label>
                  <Input id="initial-delay" type="number" defaultValue="1000" />
                  <p className="text-sm text-muted-foreground">Starting delay for exponential backoff</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-delay">Maximum Retry Delay (ms)</Label>
                  <Input id="max-delay" type="number" defaultValue="10000" />
                  <p className="text-sm text-muted-foreground">Maximum delay cap for exponential backoff</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-medium text-foreground">Transfer Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chunk-size">Chunk Size (MB)</Label>
                  <Input id="chunk-size" type="number" defaultValue="5" />
                  <p className="text-sm text-muted-foreground">Size of each file chunk for parallel transfers</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concurrent">Concurrent Transfers</Label>
                  <Input id="concurrent" type="number" defaultValue="3" />
                  <p className="text-sm text-muted-foreground">Maximum number of simultaneous file transfers</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-medium text-foreground">System Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono text-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime Target</span>
                  <span className="font-mono text-foreground">99.99%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol</span>
                  <span className="font-mono text-foreground">TCP/IP (TLS)</span>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
