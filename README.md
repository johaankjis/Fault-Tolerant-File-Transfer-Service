# Fault-Tolerant File Transfer Service

A modern, production-ready file transfer service built with Next.js 14, featuring automatic retry logic, real-time monitoring, and comprehensive transfer history tracking.

## 🚀 Features

### Core Functionality
- **Fault-Tolerant Upload System**: Automatic retry mechanism with exponential backoff for failed transfers
- **Real-time Progress Tracking**: Live upload progress visualization with retry count display
- **Drag & Drop Interface**: Intuitive file upload interface supporting multiple file types
- **Idempotent Operations**: Checksum-based file deduplication prevents duplicate uploads
- **Concurrent Transfers**: Support for multiple simultaneous file uploads (configurable)

### Monitoring & Analytics
- **Real-time Dashboard**: Live monitoring of transfer rates, system health, and performance metrics
- **Transfer History**: Complete audit trail of all file transfers with detailed metadata
- **System Health Metrics**: Track uptime (99.99% target), success rates, and throughput
- **Visual Charts**: Interactive charts for transfer rates, request volumes, and error tracking

### Advanced Features
- **Chunked Uploads**: Large file support with configurable chunk sizes (default: 5MB)
- **Exponential Backoff**: Smart retry delays (1s → 2s → 4s → 8s, capped at 10s)
- **Configurable Settings**: Customizable retry policies, chunk sizes, and concurrent transfer limits
- **TLS/TCP Security**: Secure file transfers over TCP/IP with TLS encryption

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) with React 18
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom design system
- **Charts**: [Recharts](https://recharts.org/) for data visualization
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Geist Sans & Mono](https://vercel.com/font) by Vercel

### Backend
- **API Routes**: Next.js 14 API routes with TypeScript
- **File Processing**: Native Web APIs (FormData, Crypto)
- **Checksum**: SHA-256 hashing for file integrity and deduplication

### Development
- **Language**: TypeScript 5
- **Package Manager**: pnpm
- **Build Tool**: Next.js built-in compiler
- **Analytics**: Vercel Analytics integration

## 📁 Project Structure

```
.
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API Routes
│   │   ├── upload/route.ts       # File upload endpoint with retry logic
│   │   ├── history/route.ts      # Transfer history endpoint
│   │   └── metrics/route.ts      # Real-time metrics endpoint
│   ├── history/                  # Transfer history page
│   ├── monitoring/               # Real-time monitoring dashboard
│   ├── settings/                 # Configuration page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (upload interface)
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── file-upload.tsx           # Main upload component with retry logic
│   ├── monitoring-dashboard.tsx  # Metrics dashboard
│   ├── transfer-history.tsx      # History table component
│   ├── sidebar.tsx               # Navigation sidebar
│   └── ui/                       # Reusable UI components
├── lib/                          # Utility libraries
│   ├── upload-client.ts          # File upload client with fault tolerance
│   └── utils.ts                  # Helper functions
├── public/                       # Static assets
└── styles/                       # Additional styles
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ (recommended: Node.js 20)
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Fault-Tolerant-File-Transfer-Service.git
   cd Fault-Tolerant-File-Transfer-Service
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📖 Usage Guide

### Uploading Files

1. Navigate to the home page
2. Drag and drop files onto the upload area, or click "Select Files" to browse
3. Monitor upload progress in real-time
4. Automatic retries will occur if uploads fail (up to 3 retries by default)
5. View completed uploads with success/failure status

### Monitoring System Health

1. Navigate to the **Monitoring** page
2. View real-time metrics:
   - System uptime percentage
   - Transfer success rate
   - Total transfer count
   - Failed transfer count
3. Analyze transfer rate charts (incoming/outgoing data)
4. Track request volumes, errors, and retry counts

### Viewing Transfer History

1. Navigate to the **History** page
2. Browse complete transfer history with:
   - File name and size
   - Transfer status (success/failed/retrying)
   - Retry count
   - Duration and throughput
   - Timestamp
3. Filter by status or search by filename

### Configuring Settings

1. Navigate to the **Settings** page
2. Adjust retry configuration:
   - Maximum retries (default: 3)
   - Initial retry delay (default: 1000ms)
   - Maximum retry delay (default: 10000ms)
3. Configure transfer settings:
   - Chunk size for parallel transfers (default: 5MB)
   - Concurrent transfer limit (default: 3)
4. View system information (version, uptime target, protocol)

## 🔌 API Documentation

### POST /api/upload

Upload a file with automatic retry and idempotency support.

**Request:**
```typescript
FormData {
  file: File              // The file to upload
  fileId: string         // Unique file identifier
  chunkIndex?: string    // Optional: for chunked uploads
  totalChunks?: string   // Optional: total number of chunks
}
```

**Response:**
```typescript
{
  success: boolean
  fileId: string
  file: {
    name: string
    size: number
    uploadedAt: Date
    checksum: string
  }
}
```

**Features:**
- 10% simulated failure rate for testing retry logic
- SHA-256 checksum validation
- Idempotent operation (duplicate detection)
- 100ms processing delay simulation

### GET /api/history

Retrieve transfer history.

**Response:**
```typescript
{
  transfers: Array<{
    id: string
    fileName: string
    fileSize: number
    status: "success" | "failed" | "retrying"
    retryCount: number
    duration: number
    throughput: number
    timestamp: number
  }>
}
```

### GET /api/metrics

Get real-time system metrics.

**Response:**
```typescript
{
  transferRates: Array<{
    timestamp: number
    outgoing: number  // MB/s
    incoming: number  // MB/s
  }>
  requests: Array<{
    timestamp: number
    count: number
    errors: number
    retries: number
  }>
  systemHealth: {
    uptime: number
    totalTransfers: number
    successfulTransfers: number
    failedTransfers: number
    averageRetries: number
    totalDataTransferred: string
  }
  timestamp: number
}
```

## ⚙️ Configuration

### Default Settings

| Setting | Default Value | Description |
|---------|--------------|-------------|
| Maximum Retries | 3 | Number of retry attempts before failure |
| Initial Retry Delay | 1000ms | Starting delay for exponential backoff |
| Maximum Retry Delay | 10000ms | Cap for exponential backoff delay |
| Chunk Size | 5MB | Size of each file chunk for parallel transfers |
| Concurrent Transfers | 3 | Maximum simultaneous uploads |
| Uptime Target | 99.99% | System availability goal |
| Protocol | TCP/IP (TLS) | Transfer protocol with encryption |

### Retry Logic

The system implements **exponential backoff** for retries:
- Retry 1: 1 second delay
- Retry 2: 2 seconds delay
- Retry 3: 4 seconds delay
- Maximum delay capped at 10 seconds

## 🏗️ Architecture

### Upload Client (`lib/upload-client.ts`)

The `FileUploadClient` class provides:
- Automatic retry with exponential backoff
- Progress callback hooks
- Retry callback notifications
- Unique file ID generation
- Configurable retry limits

### API Layer

- **Serverless Functions**: Each API route is a Next.js API route handler
- **In-Memory Storage**: Current implementation uses Map for demo purposes
  - Production: Replace with database (PostgreSQL, MongoDB, etc.)
- **Simulated Failures**: 10% failure rate for testing retry logic
- **Idempotency**: SHA-256 checksums prevent duplicate uploads

### Frontend Architecture

- **Client Components**: React 18 with hooks for state management
- **Server Components**: Where possible for better performance
- **Real-time Updates**: 5-second polling interval for metrics
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔒 Security Features

- **TLS Encryption**: All transfers secured with TLS
- **Checksum Validation**: SHA-256 hashing for file integrity
- **Idempotent Operations**: Prevents duplicate processing
- **TypeScript**: Type safety throughout the application

## 🧪 Testing

To test the fault-tolerance features:

1. Upload files through the UI
2. Observe automatic retries when simulated failures occur (10% rate)
3. Check the monitoring dashboard for retry statistics
4. Review transfer history for detailed retry information

## 📈 Performance

- **Target Uptime**: 99.99%
- **Concurrent Uploads**: Supports multiple simultaneous transfers
- **Chunked Processing**: Efficient handling of large files
- **Real-time Metrics**: 5-second refresh interval

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [v0.dev](https://v0.dev) - Vercel's AI-powered development platform
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready ✨
