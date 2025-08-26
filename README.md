# Virtual Try-On E-commerce

A premium fashion e-commerce platform with AI-powered virtual try-on capabilities. Built with Next.js 15, Clerk authentication, Prisma ORM, and FastAPI integration.

## Features

- **Product Catalog**: Browse and search fashion items with high-quality images
- **Virtual Try-On**: Upload photos and see how clothes look on you using AI
- **Authentication**: Secure user management with Clerk
- **Admin Panel**: CSV product ingestion from files or Google Drive URLs
- **Responsive Design**: Premium dark theme with glass morphism effects

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, Tailwind CSS, Framer Motion
- **Authentication**: Clerk
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Storage**: Local filesystem (dev) / AWS S3 (prod)
- **AI Service**: FastAPI backend for try-on processing

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Get from Clerk dashboard
- `CLERK_SECRET_KEY`: Get from Clerk dashboard
- `DATABASE_URL`: SQLite file path for development
- `NEXT_PUBLIC_FASTAPI_BASE_URL`: Your FastAPI service URL

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Seed Data (Optional)

```bash
# Ingest products from CSV file
npm run seed data/wrogn_tshirts_min.csv
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

### Product Management

1. **Admin Access**: Navigate to `/admin` (requires admin email in `ADMIN_EMAILS`)
2. **CSV Ingest**: 
   - Upload a CSV file directly, or
   - Paste a Google Drive share URL (will be converted to direct download)
3. **CSV Format**: Must include columns for `product_url`, `description` (key-value pairs), `image_url` (semicolon-separated URLs)

### Virtual Try-On

1. **Browse Products**: Go to `/products` to see the catalog
2. **Select Item**: Click on any product to view details
3. **Upload Photos**: Use the try-on panel to upload 1-3 photos
4. **Start Try-On**: Click "Try On" to begin AI processing
5. **View Results**: Results appear in a modal and are saved to history

### User Management

- **Sign Up/In**: Use the header buttons (powered by Clerk)
- **Account**: View profile at `/account`
- **History**: See past try-on jobs at `/try-on/history`

## CSV Format

The system expects CSV files with these columns:

- `handle`: Unique product identifier (optional, will be generated from title)
- `title`: Product name
- `description`: Key-value pairs separated by semicolons (e.g., "Title: Cool Shirt; Color: Blue; Size: M")
- `image_url`: Multiple URLs separated by semicolons
- `product_url`: Link to original product page
- `vendor`: Brand name
- `product_type`: Category
- `price`: Numeric price

## API Endpoints

### Products
- `GET /api/products?q=search` - List products with search
- `GET /api/products/[handle]` - Get single product

### Admin
- `POST /api/admin/ingest` - Ingest CSV (multipart file or JSON with URL)

### Try-On
- `POST /api/try-on` - Start try-on job
- `GET /api/try-on/status?id=jobId` - Check job status

### Upload
- `POST /api/upload` - Upload user photos (multipart)

## Deployment

### Environment Variables (Production)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Storage
USE_S3=true
AWS_S3_BUCKET=your-bucket
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# App URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_FASTAPI_BASE_URL=https://api.yourdomain.com
```

### Build

```bash
npm run build
npm start
```

## Troubleshooting

### Prisma Engine Issues

If you encounter "engine 403" errors:

```bash
# Reinstall Prisma with specific versions
npm install -D prisma@5.10.2 @prisma/client@5.10.2
rm -rf node_modules/.prisma
npx prisma generate

# Optional: Use mirror for engine downloads
export PRISMA_ENGINES_MIRROR=https://binaries.prisma.sh
```

### Clerk Middleware

This project uses `@clerk/nextjs@4.31.8` which requires `authMiddleware` (not `clerkMiddleware`). The middleware is already configured correctly.

### Image Loading Issues

- **Product Images**: Must be valid CDN URLs from the CSV file
- **User Photos**: Uploaded to `/public/uploads/` in development
- **Remote Patterns**: Configured in `next.config.mjs` for external image domains

### FastAPI Integration

Ensure your FastAPI service is running and accessible at `NEXT_PUBLIC_FASTAPI_BASE_URL`. The service should provide:
- `POST /try-on` - Accept user photos and garment image, return job ID
- `GET /try-on/{job_id}` - Return job status and result image URL

## Development

### Database Schema

The app uses three main models:
- `User`: Clerk integration with local user data
- `Product`: Fashion items with images and metadata
- `TryOnJob`: Try-on requests and results

### File Structure

```
app/
├── api/           # API routes
├── products/      # Product pages
├── try-on/        # Try-on related pages
├── admin/         # Admin panel
└── globals.css    # Global styles

components/        # Reusable UI components
lib/              # Utilities and configurations
prisma/           # Database schema
scripts/          # Build and maintenance scripts
```

## License

MIT License - see LICENSE file for details.