# Virtual Try-On E-commerce

Minimal Next.js app demonstrating switchable auth (NextAuth credentials or Clerk) and CSV ingestion from Google Drive.

## Setup

```bash
npm install
npm run prisma:generate
npm run db:push
```

Create `.env` based on `.env.example`. Set `AUTH_PROVIDER` to either `credentials` or `clerk`.

Run development server:

```bash
npm run dev
```

## CSV Ingest

Place a CSV at `data/products.csv` or use the admin page to provide a Google Drive sharing link.

## Auth

- `credentials` – simple email/password with bcrypt.
- `clerk` – requires Clerk keys and middleware.

This repository is a simplified skeleton; additional UI polish, error handling and S3 support can be added.
