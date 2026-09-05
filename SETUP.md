# Setup Guide

This guide configures the existing Next.js application to use Supabase PostgreSQL through Prisma. PostgreSQL does not need to be installed locally, and Docker is not required.

## Step 1: Create a Supabase Project

Create a project at [supabase.com](https://supabase.com). Keep the database password available; it is needed in the connection strings.

## Step 2: Get Supabase PostgreSQL Connection Strings

In the Supabase dashboard, go to **Project Settings -> Database -> Connection string** or open the **Connect** dialog.

Set:

- `DATABASE_URL`: Supabase pooled PostgreSQL connection string used by the application at runtime.
- `DIRECT_URL`: Supabase direct PostgreSQL connection string used by Prisma migrations when required.

Use the connection string formats shown by Supabase and replace their password placeholder. Do not use a localhost PostgreSQL URL.

## Step 3: Create `.env.local`

```bash
npm install
copy .env.example .env.local
```

On macOS/Linux, use `cp .env.example .env.local`.

`.env.example` contains placeholders only. Put real values only in `.env.local`; it is ignored by Git.

## Step 4: Configure Database and Application Variables

At minimum, set the following in `.env.local`:

```env
DATABASE_URL="YOUR_SUPABASE_DATABASE_URL"
DIRECT_URL="YOUR_SUPABASE_DIRECT_DATABASE_URL"
AUTH_SECRET="<random-secret>"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAILS="your-email@example.com"
```

`DATABASE_URL` and `DIRECT_URL` must never be exposed through a `NEXT_PUBLIC_*` variable.

## Step 5: Run Prisma Generate

```bash
npx prisma generate
npx prisma validate
```

The Prisma datasource is PostgreSQL and uses `DIRECT_URL` for direct migration connections.

## Step 6: Run Prisma Migrations

```bash
npx prisma migrate dev --name init
```

This creates the Auth.js and application tables in Supabase. For a deployment environment with existing migrations, use:

```bash
npx prisma migrate deploy
```

## Step 7: Run Prisma Seed

```bash
npx prisma db seed
```

The seed connects through Prisma, upserts the stable `default-workshop` record, and upserts admin users from `ADMIN_EMAILS`. It is safe to run repeatedly.

## Step 8: Configure Google and GitHub OAuth

### Google

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create OAuth credentials for a web application.
3. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
4. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

### GitHub

1. Open GitHub **Settings -> Developer settings -> OAuth Apps**.
2. Create an OAuth app.
3. Set the callback URL to `http://localhost:3000/api/auth/callback/github`.
4. Set `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`.

## Step 9: Configure Stripe Test Mode

In the [Stripe Dashboard](https://dashboard.stripe.com), enable test mode and set:

```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

Keep `STRIPE_SECRET_KEY` server-only.

## Step 10: Start the Stripe Webhook Listener

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then run this in a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the emitted signing secret into:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

The application only marks registrations as paid after verifying this webhook.

## Step 11: Configure Resend

Create an API key at [Resend](https://resend.com), verify the sending domain, and set:

```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

## Step 12: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000/).

## Verify Supabase Tables

Open the Supabase dashboard and choose **Table Editor**. The Prisma schema creates `User`, `Account`, `Session`, `Workshop`, `Registration`, `StripeEvent`, and `VerificationToken`. `npx prisma studio` also connects using the configured environment variables.

## Test the Complete Flow

1. Sign in with Google or GitHub.
2. Register for the seeded workshop.
3. Create a Stripe Checkout session.
4. Pay using `4242 4242 4242 4242`.
5. Confirm the Stripe CLI forwards `checkout.session.completed`.
6. Confirm the webhook updates the Supabase `Registration` row to `PAID`.
7. Confirm the dashboard and optional Resend email.

## Useful Commands

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma migrate deploy
npx prisma db seed
npx prisma studio
npm test
npm run lint
npm run build
```

## Troubleshooting

### Supabase connection error

Check that both connection strings came from the Supabase dashboard, the password is URL-encoded where necessary, and the project is running. Use the pooled URL for `DATABASE_URL` and the direct URL for `DIRECT_URL`.

### OAuth callback mismatch

The provider callback URL must exactly match the local URL configured above.

### Stripe webhook not processing

Keep the Stripe CLI listener running and verify that `STRIPE_WEBHOOK_SECRET` matches its current output.

### Email not sending

Check the Resend key, verified sending domain, and server logs. Email failure does not change payment verification.
