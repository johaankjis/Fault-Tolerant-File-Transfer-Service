import { type NextRequest, NextResponse } from "next/server"

// Simulated storage for uploaded files (in production, use a database)
const uploadedFiles = new Map<string, { name: string; size: number; uploadedAt: Date; checksum: string }>()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const chunkIndex = formData.get("chunkIndex") as string
    const totalChunks = formData.get("totalChunks") as string
    const fileId = formData.get("fileId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Simulate random failures for testing retry logic (10% failure rate)
    if (Math.random() < 0.1) {
      return NextResponse.json({ error: "Simulated network error" }, { status: 500 })
    }

    // Calculate checksum for idempotency
    const arrayBuffer = await file.arrayBuffer()
    const checksum = await generateChecksum(arrayBuffer)

    // Check if this exact file was already uploaded (idempotent operation)
    const existingFile = uploadedFiles.get(checksum)
    if (existingFile) {
      return NextResponse.json({
        success: true,
        message: "File already uploaded (idempotent)",
        fileId: checksum,
        file: existingFile,
      })
    }

    // Store file metadata
    uploadedFiles.set(checksum, {
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      checksum,
    })

    // Log transfer metrics
    console.log("[v0] File uploaded:", {
      name: file.name,
      size: file.size,
      checksum,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      fileId: checksum,
      file: {
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
        checksum,
      },
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

// Generate a simple checksum for file deduplication
async function generateChecksum(arrayBuffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

export async function GET() {
  // Return list of uploaded files
  const files = Array.from(uploadedFiles.values())
  return NextResponse.json({ files })
}
