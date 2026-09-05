# Workshop Registration Platform

A full-stack workshop registration platform built with Next.js, Auth.js, Prisma, Supabase PostgreSQL, Stripe, and Resend.

## Architecture

```text
Google/GitHub -> Auth.js -> Next.js -> Prisma -> Supabase PostgreSQL
User -> Registration -> Stripe Checkout -> verified webhook -> Prisma -> PAID -> Resend
```

The existing authentication, registration, Stripe checkout, webhook, admin dashboard, user dashboard, and email flows are preserved. Only the database hosting configuration is changed to Supabase PostgreSQL.

## Features

- Google and GitHub OAuth through Auth.js
- Prisma-backed users, OAuth accounts, sessions, workshops, registrations, and Stripe events
- Duplicate registration protection
- Stripe Checkout with server-side price verification
- Idempotent, signature-verified Stripe webhooks
- Resend confirmation emails
- User dashboard and USER/ADMIN dashboard
- Zod validation and server-side authorization

## Prerequisites

- Node.js 18+
- Supabase project
- Google/GitHub OAuth credentials
- Stripe account in test mode
- Resend account (optional)

No local PostgreSQL installation or Docker is required.

## Supabase Setup

### 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com).

### 2. Get the PostgreSQL connection strings

In the Supabase dashboard, open **Project Settings -> Database -> Connection string**, or use the **Connect** button. Supabase provides connection strings there:

- `DATABASE_URL`: the pooled Supabase PostgreSQL connection used by the running application.
- `DIRECT_URL`: the direct Supabase PostgreSQL connection used by Prisma migrations when required.

Keep these values private and replace any password placeholder with the project database password.

### 3. Create `.env.local`

```bash
npm install
copy .env.example .env.local
```

On macOS/Linux, use `cp .env.example .env.local`.

### 4. Configure environment variables

Set the Supabase URLs and provider credentials in `.env.local`:

```env
DATABASE_URL="YOUR_SUPABASE_DATABASE_URL"
DIRECT_URL="YOUR_SUPABASE_DIRECT_DATABASE_URL"
AUTH_SECRET="<random-secret>"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
ADMIN_EMAILS="admin@example.com"
```

Do not use `NEXT_PUBLIC_DATABASE`, `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`, or any other browser-exposed database credential. This application does not need a Supabase service-role key.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run migrations

```bash
npx prisma migrate dev --name init
```

For an environment that already has migration files, use `npx prisma migrate deploy`.

### 7. Seed the database

```bash
npx prisma db seed
```

The TypeScript seed uses Prisma and an idempotent upsert for the stable `default-workshop` ID. Re-running it does not create duplicate workshops.

### 8. Verify tables

In the Supabase dashboard, open **Table Editor**. You should see `User`, `Account`, `Session`, `Workshop`, `Registration`, `StripeEvent`, and `VerificationToken` after migration.

## Provider Setup

### Google and GitHub OAuth

Configure these callback URLs for local development:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Stripe test mode

Use Stripe test keys. In another terminal, forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the CLI signing secret to `STRIPE_WEBHOOK_SECRET`. Registrations become `PAID` only after the verified webhook, never merely after loading the success page.

### Resend

Set a Resend API key and verified sender. Email is optional; failures do not roll back a verified payment.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000/).

## Test the Flow

1. Sign in with Google or GitHub.
2. Register for the seeded workshop.
3. Complete Stripe Checkout with `4242 4242 4242 4242`.
4. Confirm the Stripe CLI receives `checkout.session.completed`.
5. Confirm the webhook changes the Supabase registration to `PAID`.
6. Check the dashboard, admin dashboard, and Resend email.

## Commands

```bash
npx prisma generate
npx prisma validate
npx prisma migrate dev --name init
npx prisma migrate deploy
npx prisma db seed
npx prisma studio
npm test
npm run lint
npm run build
```

## Security

- Database URLs, Auth.js secrets, Stripe secret keys, and Resend keys are server-only.
- `.env`, `.env.local`, and other environment files are ignored by Git.
- Prisma queries write core application data to Supabase PostgreSQL.
- Stripe signatures and payment amounts are verified server-side.
- Auth.js continues to manage Google/GitHub login and database sessions.

See [SETUP.md](./SETUP.md) for the detailed setup guide and [QUICK_START.md](./QUICK_START.md) for the condensed version.
