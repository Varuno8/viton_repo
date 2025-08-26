Here’s the cleaned-up content in markdown format — you can copy it directly:

````markdown
# Virtual Try-On E-commerce

Minimal Next.js app demonstrating switchable auth (NextAuth credentials or Clerk) and CSV ingestion from Google Drive.

## Setup

```bash
npm install
npm run prisma:generate
npm run db:push
````

Create `.env` based on `.env.example`. Set `AUTH_PROVIDER` to either `credentials` or `clerk`.
For Clerk, the example file includes ready-to-use test keys.

Run development server:

```bash
npm run dev
```

## CSV Ingest

Place a CSV at `data/products.csv` or use the admin page to provide a Google Drive sharing link.

## Auth

Set `AUTH_PROVIDER` in your `.env`.

* **credentials** – simple email/password with bcrypt using custom forms at `/auth/signin` and `/auth/signup`.
* **clerk** – uses Clerk components. Sign in at `/sign-in` and sign up at `/sign-up`. A small header renders `<SignInButton/>`, `<SignUpButton/>`, and `<UserButton/>` when Clerk is active.

This repository is a simplified skeleton; additional UI polish, error handling and S3 support can be added.

```
```
