interface UploadOptions {
  file: File
  onProgress?: (progress: number) => void
  onRetry?: (retryCount: number) => void
  maxRetries?: number
}

interface UploadResult {
  success: boolean
  fileId?: string
  error?: string
}

export class FileUploadClient {
  private maxRetries: number

  constructor(maxRetries = 3) {
    this.maxRetries = maxRetries
  }

  async upload({ file, onProgress, onRetry, maxRetries = this.maxRetries }: UploadOptions): Promise<UploadResult> {
    let retryCount = 0

    while (retryCount <= maxRetries) {
      try {
        if (retryCount > 0 && onRetry) {
          onRetry(retryCount)
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("fileId", this.generateFileId(file))

        // Simulate progress
        if (onProgress) {
          for (let progress = 0; progress <= 90; progress += 10) {
            onProgress(progress)
            await new Promise((resolve) => setTimeout(resolve, 100))
          }
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`)
        }

        const result = await response.json()

        if (onProgress) {
          onProgress(100)
        }

        return { success: true, fileId: result.fileId }
      } catch (error) {
        retryCount++

        if (retryCount > maxRetries) {
          return {
            success: false,
            error: `Upload failed after ${maxRetries} retries`,
          }
        }

        // Exponential backoff: 1s, 2s, 4s, 8s (capped at 10s)
        const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000)
        console.log(`[v0] Retry ${retryCount}/${maxRetries} after ${delay}ms`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    return { success: false, error: "Upload failed" }
  }

  private generateFileId(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`
  }
}
