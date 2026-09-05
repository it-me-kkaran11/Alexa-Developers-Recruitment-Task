# Quick Start

This application uses Supabase PostgreSQL through Prisma. No local PostgreSQL server or Docker is required.

## Prerequisites

- Node.js 18+
- A Supabase project
- Google and/or GitHub OAuth credentials
- Stripe account in test mode
- Resend account (optional for confirmation email)

## 1. Create a Supabase Project

Create a project at [supabase.com](https://supabase.com). Wait until the database is ready.

## 2. Get Supabase Connection Strings

In the Supabase dashboard, open **Project Settings -> Database** and find **Connection string** or **Connect**. Copy:

- The pooled connection string for `DATABASE_URL`, used by the running application.
- The direct connection string for `DIRECT_URL`, used by Prisma migrations when required.

Keep both URLs private. Replace any placeholders in the copied strings with your database password.

## 3. Create `.env.local`

```bash
npm install
copy .env.example .env.local
```

On macOS/Linux, use `cp .env.example .env.local` instead of `copy`.

## 4. Configure `DATABASE_URL` and `DIRECT_URL`

Edit `.env.local` and set both Supabase URLs. Also set your Auth.js, Stripe, Resend, and admin values. Never prefix either database variable with `NEXT_PUBLIC_`.

## 5. Generate Prisma Client

```bash
npx prisma generate
npx prisma validate
```

## 6. Run Prisma Migrations

```bash
npx prisma migrate dev --name init
```

For a hosted Supabase database, this applies the schema to Supabase. If your deployment workflow does not allow `migrate dev`, use `npx prisma migrate deploy` after creating migrations in development.

## 7. Seed Supabase

```bash
npx prisma db seed
```

The seed uses Prisma and an idempotent upsert, so running it again does not create duplicate workshops. Admin users are created or promoted from `ADMIN_EMAILS`.

## 8. Configure Google/GitHub OAuth

Use these local callback URLs:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Put the client IDs and secrets in `.env.local`.

## 9. Configure Stripe Test Mode

Set the Stripe test secret and publishable keys. Do not expose `STRIPE_SECRET_KEY` to browser code.

## 10. Start the Stripe Webhook Listener

In a second terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the displayed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`. Only the verified webhook marks a registration as paid.

## 11. Configure Resend

Set `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL`. Email is optional and does not block payment confirmation.

## 12. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000/).

## Verify Supabase Tables

In Supabase, open **Table Editor** to inspect `User`, `Account`, `Session`, `Workshop`, `Registration`, `StripeEvent`, and `VerificationToken`. You can also run `npx prisma studio` against the configured Supabase database.

## Test Payment

1. Sign in with Google or GitHub.
2. Register for the workshop.
3. Pay with Stripe test card `4242 4242 4242 4242`.
4. Confirm the Stripe webhook runs.
5. Verify the registration becomes `PAID` in the dashboard and Supabase.

For detailed provider setup, see [SETUP.md](./SETUP.md) and [README.md](./README.md).
