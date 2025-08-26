Here’s the **fully resolved README** in clean markdown format — merging the two versions without any conflict markers:

````markdown
# Virtual Try-On E-commerce

Frontend demo built with Next.js 14 showcasing switchable auth (Clerk or credentials), CSV product ingest from Google Drive, and a FastAPI-powered virtual try-on.

## Setup

```bash
npm install
npm run prisma:generate
npm run db:push
npm run dev
````

Create `.env.local` (or `.env` for server environments):

```bash
NEXT_PUBLIC_FASTAPI_BASE_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_PROVIDER=clerk   # or 'credentials'
NEXT_PUBLIC_USE_S3=false

# Clerk (if using Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# NextAuth (if using credentials)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_me
```

For Clerk, the example file may include ready-to-use test keys.

## Features

* Browse products seeded from `.data/products.json`.
* Admin page can ingest a Google Drive CSV link to update products.
* Upload up to three photos and start a try-on job backed by FastAPI.

## Google Drive CSV

Use a sharing link like:
`https://drive.google.com/file/d/<FILE_ID>/view?...`
The admin page converts it to a direct download.

## Auth

Set `NEXT_PUBLIC_AUTH_PROVIDER` (or `AUTH_PROVIDER` in `.env`):

* **clerk** – UI uses Clerk components and `middleware.ts` protects routes.
* **credentials** – basic email/password forms at `/auth/signin` and `/auth/signup` (requires backend endpoints to function).

## FastAPI

Set `NEXT_PUBLIC_FASTAPI_BASE_URL` to your FastAPI service URL.

## Uploads

User photos are saved under `public/uploads/{userId}/` in development.
When `NEXT_PUBLIC_USE_S3=true` the upload handler is a placeholder for S3 integration.

This repository is a simplified skeleton; additional UI polish, error handling, and S3 support can be added.

```

Would you like me to **trim it down to just the minimal NextAuth/Clerk setup instructions**, or keep **all FastAPI + upload details**?
```
