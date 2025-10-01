"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { FileUploadClient } from "@/lib/upload-client"

interface FileUploadItem {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "success" | "error" | "retrying"
  retryCount: number
  error?: string
}

const uploadClient = new FileUploadClient(3)

export function FileUpload() {
  const [files, setFiles] = useState<FileUploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }, [])

  const addFiles = (newFiles: File[]) => {
    const fileItems: FileUploadItem[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "pending",
      retryCount: 0,
    }))
    setFiles((prev) => [...prev, ...fileItems])
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const uploadFiles = async () => {
    for (const fileItem of files) {
      if (fileItem.status === "success") continue

      await uploadFile(fileItem)
    }
  }

  const uploadFile = async (fileItem: FileUploadItem) => {
    setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, status: "uploading" } : f)))

    const result = await uploadClient.upload({
      file: fileItem.file,
      onProgress: (progress) => {
        setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, progress } : f)))
      },
      onRetry: (retryCount) => {
        setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, status: "retrying", retryCount } : f)))
      },
    })

    if (result.success) {
      setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, status: "success", progress: 100 } : f)))
    } else {
      setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, status: "error", error: result.error } : f)))
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getStatusIcon = (status: FileUploadItem["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "uploading":
      case "retrying":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />
      default:
        return <File className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center p-12">
          <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium text-foreground">Drop files here or click to upload</h3>
          <p className="mb-4 text-sm text-muted-foreground">Supports any file type, automatic retry on failure</p>
          <input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
          <label htmlFor="file-upload">
            <Button asChild>
              <span>Select Files</span>
            </Button>
          </label>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Files ({files.length})</h3>
            <Button onClick={uploadFiles} disabled={files.every((f) => f.status === "success")}>
              Upload All
            </Button>
          </div>
          <div className="space-y-4">
            {files.map((fileItem) => (
              <div key={fileItem.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                {getStatusIcon(fileItem.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="truncate text-sm font-medium text-card-foreground">{fileItem.file.name}</p>
                    <span className="text-xs text-muted-foreground">{formatFileSize(fileItem.file.size)}</span>
                  </div>
                  {(fileItem.status === "uploading" || fileItem.status === "retrying") && (
                    <div className="space-y-1">
                      <Progress value={fileItem.progress} className="h-1" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {fileItem.status === "retrying" ? `Retrying (${fileItem.retryCount}/3)...` : "Uploading..."}
                        </span>
                        <span>{fileItem.progress}%</span>
                      </div>
                    </div>
                  )}
                  {fileItem.status === "error" && <p className="text-xs text-destructive">{fileItem.error}</p>}
                  {fileItem.status === "success" && <p className="text-xs text-success">Upload complete</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(fileItem.id)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
