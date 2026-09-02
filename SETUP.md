# Quick Setup Guide

Complete guide for getting the workshop registration platform up and running locally.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up PostgreSQL

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker-compose up -d

# Database will be ready at localhost:5432
# Username: workshop_user
# Password: workshop_password
# Database: workshop_db
```

### Option B: Local PostgreSQL

```bash
# Create database
createdb workshop_db

# Update DATABASE_URL in .env.local:
# DATABASE_URL="postgresql://username:password@localhost:5432/workshop_db"
```

## Step 3: Environment Configuration

```bash
# Copy example env file
cp .env.example .env.local
```

### Required Environment Variables

#### 1. Generate AUTH_SECRET

```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local:
AUTH_SECRET="<generated-secret>"
```

#### 2. Google OAuth Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
4. Choose "Web application"
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`:

```
AUTH_GOOGLE_ID="<your-client-id>"
AUTH_GOOGLE_SECRET="<your-client-secret>"
```

#### 3. GitHub OAuth Setup

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "Workshop Registration (Local)"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`:

```
AUTH_GITHUB_ID="<your-app-id>"
AUTH_GITHUB_SECRET="<your-app-secret>"
```

#### 4. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Settings → API keys
3. **Make sure you're in TEST MODE** (toggle in top-right)
4. Copy test keys to `.env.local`:

```
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### 5. Resend Email Setup (Optional)

1. Go to [Resend](https://resend.com)
2. Create account and get API key
3. Add to `.env.local`:

```
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

#### 6. Admin Configuration

Add your email address to `.env.local`:

```
ADMIN_EMAILS="your-email@example.com"
```

### Complete .env.local Example

```
# Database
DATABASE_URL="postgresql://workshop_user:workshop_password@localhost:5432/workshop_db"

# NextAuth
AUTH_SECRET="<your-generated-secret>"
AUTH_URL="http://localhost:3000"

# OAuth
AUTH_GOOGLE_ID="<google-client-id>"
AUTH_GOOGLE_SECRET="<google-client-secret>"
AUTH_GITHUB_ID="<github-app-id>"
AUTH_GITHUB_SECRET="<github-app-secret>"

# Stripe (TEST MODE)
STRIPE_SECRET_KEY="sk_test_<key>"
STRIPE_WEBHOOK_SECRET="whsec_<key>" (fill in after webhook setup)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_<key>"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_<key>"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Admin
ADMIN_EMAILS="your-email@example.com"

# Node
NODE_ENV="development"
```

## Step 4: Database Setup

```bash
# Run migrations (creates all tables)
npx prisma migrate dev

# Seed database with default workshop
npx prisma db seed

# (Optional) Open Prisma Studio to inspect database
npx prisma studio
```

## Step 5: Stripe Webhook Setup

**In a new terminal:**

```bash
# Install Stripe CLI if not already installed
# https://stripe.com/docs/stripe-cli

# Start webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will output:
# > Ready! Your webhook signing secret is: whsec_xxx...

# Copy the webhook signing secret to .env.local:
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

**Keep this terminal open while developing.**

## Step 6: Start Development Server

```bash
# In your main terminal (different from webhook listener)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing the Flow

### 1. Sign In
- Click "Sign In"
- Choose Google or GitHub
- Complete OAuth flow

### 2. Register for Workshop
- Click "Register Now"
- Review details
- Click "Proceed to Payment"

### 3. Payment
- Use Stripe test card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits
- Complete payment

### 4. Verify
- Check dashboard shows "PAID" status
- Check email for confirmation (if Resend configured)

### 5. Admin Panel
- Make sure your email is in `ADMIN_EMAILS`
- Sign out and sign back in
- Visit [http://localhost:3000/admin](http://localhost:3000/admin)
- View all registrations and statistics

## Common Issues

### "Error: connect ECONNREFUSED 127.0.0.1:5432"
PostgreSQL is not running. Start it:
```bash
docker-compose up -d  # or start your local PostgreSQL
```

### "OAuth callback mismatch"
Ensure redirect URIs in Google/GitHub match exactly:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### "Stripe webhook not processing"
1. Ensure `stripe listen` command is running
2. Verify webhook secret is correct in `.env.local`
3. Check server logs for errors

### "Email not sending"
Email failure won't block payments. Check:
1. Resend API key is valid
2. Domain is verified in Resend
3. Server logs for email errors

## Useful Commands

```bash
# Database
npx prisma migrate dev       # Run migrations
npx prisma db seed          # Seed database
npx prisma studio           # Open database UI
npx prisma db reset         # Reset database (⚠️ deletes all data)

# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm start                  # Start production server

# Testing
npm test                   # Run tests
npm run test:watch        # Run tests in watch mode

# Code Quality
npm run lint              # Run ESLint
```

## Deployment

When ready to deploy to production:

1. Update environment variables:
   - `AUTH_URL` to your production domain
   - Stripe keys to production keys (not test)
   - OAuth redirect URIs to production domain
   - Resend domain verification

2. Build and test:
   ```bash
   npm run build
   npm start
   ```

3. Deploy to Vercel, AWS, or other platform

See README.md for full documentation.

---

**Need help?** Check the troubleshooting section in README.md
