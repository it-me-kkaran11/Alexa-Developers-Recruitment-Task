# Workshop Registration Platform

A production-ready, full-stack workshop/event registration platform with integrated payments, email confirmations, and admin dashboard.
https://alexa-developers-recruitment-task-l50vykhnu-it-me-kkaran11.vercel.app
## 🎯 Features

- **OAuth Authentication**: Google and GitHub OAuth integration with Auth.js
- **Workshop Registration**: Users can browse and register for workshops
- **Stripe Payments**: Secure payment processing with Stripe Checkout
- **Email Confirmations**: Automated confirmation emails via Resend
- **Admin Dashboard**: Full registration management and analytics
- **Role-Based Access Control**: USER and ADMIN roles with server-side authorization
- **Duplicate Prevention**: Prevents duplicate registrations and payment processing
- **Idempotent Webhooks**: Safely handles Stripe webhook retries
- **Responsive UI**: Professional, mobile-friendly design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Responsive Design

### Backend
- Next.js API Routes
- Node.js/TypeScript
- PostgreSQL
- Prisma ORM

### Authentication
- Auth.js
- Google OAuth
- GitHub OAuth

### Payments
- Stripe Checkout (TEST MODE)
- Webhook handling with signature verification

### Email
- Resend
- HTML templates

### Validation & Security
- Zod validation
- Server-side authorization helpers

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+ (local or remote)
- Stripe Account (test keys)
- Google OAuth Credentials
- GitHub OAuth App Credentials
- Resend Account (optional for email)

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

#### Database
```
DATABASE_URL="postgresql://username:password@localhost:5432/workshop_db"
```

#### NextAuth Configuration
```
AUTH_SECRET="generate-a-random-secret-with: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"
```

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Create OAuth 2.0 credentials (Web application)
4. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
5. Copy Client ID and Secret to `.env.local`:

```
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

#### GitHub OAuth Setup
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`:

```
AUTH_GITHUB_ID="your-github-app-id"
AUTH_GITHUB_SECRET="your-github-app-secret"
```

#### Stripe Configuration
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Ensure you're in **TEST MODE**
3. Get your API keys from Settings → API keys
4. Add to `.env.local`:

```
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." (get this after webhook setup)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### Resend Email Setup (Optional)
1. Go to [Resend Dashboard](https://resend.com)
2. Create API key
3. Add to `.env.local`:

```
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

#### Admin Configuration
```
ADMIN_EMAILS="admin@example.com,another-admin@example.com"
```

### 3. Database Setup

```bash
# Create database
createdb workshop_db

# Run migrations
npx prisma migrate dev

# Seed database with default workshop and admin user
npx prisma db seed
```

### 4. Stripe Webhook Setup (Local Development)

Install Stripe CLI: https://stripe.com/docs/stripe-cli

```bash
# Start webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will output a webhook signing secret
# Copy the signing secret to your .env.local:
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Testing the Complete Flow

### 1. Sign In
- Click "Sign In" on home page
- Choose Google or GitHub
- Follow OAuth flow

### 2. Register for Workshop
- On home page, click "Register Now"
- Review registration summary
- Click "Proceed to Payment"

### 3. Stripe Checkout
- Use Stripe test card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits
- Complete payment

### 4. Verify Payment
- Webhook should process payment automatically
- You'll be redirected to success page
- Check dashboard to see "PAID" status
- Check email for confirmation (if Resend configured)

### 5. Admin Dashboard
- Set your email in `ADMIN_EMAILS` in `.env.local`
- Sign out and sign back in
- Access /admin dashboard
- View all registrations, stats, and search/filter

## 💳 Stripe Test Cards

| Card | Number | Result |
|------|--------|--------|
| Visa | 4242 4242 4242 4242 | Success |
| Decline | 4000 0000 0000 0002 | Declined |

[Full Stripe Test Cards List](https://stripe.com/docs/testing)

## 🔐 Security Features

- **OAuth Only**: No password storage, delegated authentication
- **Server-Side Authorization**: All API routes verify permissions server-side
- **Webhook Signature Verification**: Stripe signatures verified before processing
- **Idempotent Webhooks**: Prevents duplicate payment processing
- **CSRF Protection**: Built into Next.js and Auth.js
- **Secure Session**: HTTP-only cookies via Auth.js
- **Price Verification**: Server always verifies prices, not client
- **No Secret Leakage**: Secrets never sent to frontend
- **Rate Limiting**: Can be added to API routes as needed

## 📊 Database Schema

### User
- id, name, email, image, role, createdAt, updatedAt
- Relations: registrations, accounts, sessions

### Workshop
- id, title, description, price, currency, date, startTime, endTime, location, capacity, active
- Indexes: active, date

### Registration
- id, registrationNumber, userId, workshopId, status, paymentStatus, amount, currency
- stripeCheckoutSessionId, stripePaymentIntentId, registeredAt, paidAt, confirmationEmailSentAt
- Unique constraint: userId + workshopId (prevents duplicates)
- Indexes: userId, workshopId, status, paymentStatus

### StripeEvent
- id, stripeEventId (unique), type, processedAt
- Prevents duplicate webhook processing

## 📁 Project Structure

```
app/
├── page.tsx                      # Home/landing page
├── login/page.tsx               # OAuth login
├── register/page.tsx            # Workshop registration
├── dashboard/page.tsx           # User dashboard
├── admin/page.tsx               # Admin dashboard
├── checkout/
│   ├── success/page.tsx         # Payment success
│   └── cancel/page.tsx          # Payment cancelled
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── registrations/
│   │   ├── route.ts             # POST: create, GET: user's registrations
│   │   └── me/route.ts          # GET: specific registration
│   ├── checkout/route.ts        # POST: create Stripe session
│   ├── workshops/route.ts       # GET: active workshop
│   ├── admin/
│   │   ├── registrations/route.ts  # GET: all registrations (admin)
│   │   └── stats/route.ts          # GET: dashboard stats (admin)
│   └── webhooks/
│       └── stripe/route.ts       # POST: Stripe events

components/
├── Navbar.tsx                   # Navigation
├── WorkshopHero.tsx            # Landing page hero
├── StatusBadge.tsx             # Status display
├── States.tsx                  # Loading/Error/Empty states

lib/
├── auth.ts                     # Auth.js configuration
├── db.ts                       # Prisma client
├── stripe.ts                   # Stripe utilities
├── email.ts                    # Email utilities
├── validations.ts              # Zod schemas
├── authorization.ts            # Auth helpers
├── registration.ts             # Registration utilities
└── utils.ts                    # General utilities

emails/
└── RegistrationConfirmation.tsx # Email template

prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Database seeding script

types/
└── index.ts                    # TypeScript interfaces

__tests__/
└── lib/
    ├── utils.test.ts           # Utility tests
    └── validations.test.ts     # Validation tests

middleware.ts                   # Route protection middleware
```

## 🔄 Application Flow

```
1. User visits landing page
   ↓
2. User clicks "Sign In"
   ↓
3. OAuth authentication (Google/GitHub)
   ↓
4. User returns, can see "Register Now"
   ↓
5. User clicks "Register Now"
   ↓
6. Registration created (PENDING status)
   ↓
7. User clicks "Proceed to Payment"
   ↓
8. Stripe Checkout Session created
   ↓
9. User redirected to Stripe Checkout
   ↓
10. User enters payment details (test card)
    ↓
11. Payment processed by Stripe
    ↓
12. Stripe sends webhook to /api/webhooks/stripe
    ↓
13. Webhook signature verified
    ↓
14. Registration marked PAID
    ↓
15. Confirmation email sent (if Resend configured)
    ↓
16. User redirected to success page
    ↓
17. Dashboard shows PAID status
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Test Coverage
- Utility functions
- Validation schemas
- Authorization helpers
- Registration logic
- Email sending

## 🐛 Troubleshooting

### Webhook Not Processing
1. Check Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Verify webhook secret in `.env.local` matches Stripe CLI output
3. Check server logs for webhook errors

### Email Not Sending
1. Verify Resend API key is set in `.env.local`
2. Check RESEND_FROM_EMAIL is a valid domain in Resend
3. Email will not block payment - check logs for errors

### Database Connection Error
1. Ensure PostgreSQL is running
2. Verify DATABASE_URL is correct
3. Run migrations: `npx prisma migrate dev`

### OAuth Not Working
1. Verify OAuth app is configured correctly
2. Check redirect URIs match exactly: `http://localhost:3000/api/auth/callback/{provider}`
3. Ensure environment variables are loaded: `npm run dev`

### Stripe Payment Failing
1. Use test card: `4242 4242 4242 4242`
2. Ensure STRIPE_SECRET_KEY starts with `sk_test_`
3. Check Stripe Dashboard for payment status

## 📈 Production Deployment

### Pre-Deployment Checklist
- [ ] Verify all environment variables are set
- [ ] Run tests: `npm test`
- [ ] Build project: `npm run build`
- [ ] Test in production-like environment
- [ ] Set up real Stripe keys (not test keys)
- [ ] Configure real OAuth credentials
- [ ] Set up Resend with real domain
- [ ] Enable HTTPS
- [ ] Set AUTH_URL to production domain
- [ ] Backup database regularly

### Deployment Options
- Vercel (recommended for Next.js)
- AWS (EC2, ECS, Lambda)
- Google Cloud Run
- DigitalOcean App Platform
- Heroku

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Auth.js Documentation](https://authjs.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Tailwind CSS](https://tailwindcss.com)

## 📝 License

This project is open source and available under the MIT License.

## 💬 Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs
3. Check Stripe Dashboard
4. Verify environment variables

---

**Happy coding! 🎉**
