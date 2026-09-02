# Project Structure

Complete directory structure and file descriptions for the workshop registration platform.

## Root Configuration Files

```
.env.example                 # Example environment variables
.env.local                   # Local environment variables (create from .env.example)
.eslintrc.json              # ESLint configuration
.gitignore                  # Git ignore patterns
.prettierrc                 # Prettier code formatting rules
docker-compose.yml          # Docker Compose for PostgreSQL
jest.config.js              # Jest testing configuration
jest.setup.ts               # Jest test environment setup
middleware.ts               # NextAuth middleware for route protection
next.config.ts              # Next.js configuration
package.json                # Project dependencies and scripts
postcss.config.js           # PostCSS configuration
README.md                   # Main documentation
QUICK_START.md              # 5-minute quick start guide
SETUP.md                    # Detailed setup instructions
IMPLEMENTATION_SUMMARY.md   # Complete feature list
tsconfig.json               # TypeScript configuration
```

## App Directory (Next.js App Router)

```
app/
├── globals.css                              # Global CSS and Tailwind imports
├── layout.tsx                               # Root layout with SessionProvider
├── page.tsx                                 # Landing page with workshop hero
│
├── login/
│   └── page.tsx                             # OAuth login page (Google/GitHub)
│
├── register/
│   └── page.tsx                             # Workshop registration form
│
├── dashboard/
│   └── page.tsx                             # User dashboard - view registrations
│
├── admin/
│   └── page.tsx                             # Admin dashboard - manage all registrations
│
├── checkout/
│   ├── success/
│   │   └── page.tsx                         # Payment success page
│   └── cancel/
│       └── page.tsx                         # Payment cancelled page
│
└── api/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts                     # NextAuth routes (signin/callback)
    │
    ├── registrations/
    │   ├── route.ts                         # POST: create registration
    │   │                                    # GET: user's registrations
    │   └── me/
    │       └── route.ts                     # GET: specific user registration
    │
    ├── checkout/
    │   └── route.ts                         # POST: create Stripe checkout session
    │
    ├── workshops/
    │   └── route.ts                         # GET: active workshop details
    │
    ├── admin/
    │   ├── registrations/
    │   │   └── route.ts                     # GET: all registrations (admin only)
    │   └── stats/
    │       └── route.ts                     # GET: dashboard statistics (admin only)
    │
    └── webhooks/
        └── stripe/
            └── route.ts                     # POST: Stripe webhook handler
```

## Components Directory

```
components/
├── Navbar.tsx                               # Navigation bar with auth menu
├── WorkshopHero.tsx                         # Hero section for landing page
├── StatusBadge.tsx                          # Status indicator badge
├── States.tsx                               # Loading, Error, Empty states
│   ├── LoadingState                         # Spinner/skeleton loader
│   ├── ErrorState                           # Error message with retry
│   └── EmptyState                           # Empty data display
```

## Library Directory

```
lib/
├── auth.ts                                  # NextAuth configuration
│                                            # - OAuth providers (Google, GitHub)
│                                            # - Session callbacks
│                                            # - Admin email configuration
│
├── db.ts                                    # Prisma client singleton
│
├── stripe.ts                                # Stripe utilities
│   ├── createCheckoutSession()
│   ├── getWebhookSecret()
│   └── retrieveCheckoutSession()
│
├── email.ts                                 # Email/Resend configuration
│   └── sendConfirmationEmail()
│
├── validations.ts                           # Zod validation schemas
│   ├── registrationCreateSchema
│   ├── checkoutSchema
│   ├── adminQuerySchema
│   └── workshopSeedSchema
│
├── authorization.ts                         # Authorization helpers
│   ├── requireUser()                        # Require authentication
│   ├── requireAdmin()                       # Require admin role
│   ├── verifyOwnership()                    # Verify resource ownership
│   ├── handleAuthError()                    # Consistent error handling
│   └── AuthorizationError                   # Custom error class
│
├── registration.ts                          # Registration utilities
│   ├── generateRegistrationNumber()         # Unique registration ID
│   ├── hasExistingRegistration()            # Check duplicates
│   ├── createRegistration()                 # Create new registration
│   ├── updateCheckoutStarted()              # Update checkout status
│   ├── markAsPaid()                         # Mark registration paid
│   ├── markEmailSent()                      # Mark email as sent
│   └── emailAlreadySent()                   # Check email status
│
├── utils.ts                                 # General utilities
│   ├── formatCurrency()                     # Format money display
│   ├── formatDate()                         # Format date display
│   ├── getStatusColor()                     # Status badge color
│   ├── getStatusText()                      # Status display text
│   ├── isValidEmail()                       # Email validation
│   ├── truncate()                           # Truncate text
│   ├── generateRandomString()               # Random ID generation
│   └── safeJsonParse()                      # Safe JSON parsing
│
└── errors.ts                                # Error handling utilities
    ├── ApiError                             # Custom API error class
    ├── handleApiError()                     # Error response handler
    └── API_ERRORS                           # Error constants
```

## Emails Directory

```
emails/
└── RegistrationConfirmation.tsx             # HTML email template
    # Contains workshop details, registration info, and next steps
```

## Prisma Directory

```
prisma/
├── schema.prisma                            # Database schema
│   ├── User                                 # User accounts
│   ├── Account                              # OAuth accounts
│   ├── Session                              # User sessions
│   ├── Workshop                             # Workshop definitions
│   ├── Registration                         # User registrations
│   ├── StripeEvent                          # Webhook tracking
│   └── VerificationToken                    # Auth tokens
│
└── seed.ts                                  # Database seeding script
    # - Creates default workshop
    # - Sets up admin users from ADMIN_EMAILS
```

## Types Directory

```
types/
└── index.ts                                 # TypeScript interfaces
    ├── AuthUser                             # Authenticated user type
    ├── RegistrationData                     # Registration details
    ├── WorkshopData                         # Workshop details
    ├── StripeCheckoutData                   # Stripe checkout data
    ├── ApiResponse<T>                       # API response type
    └── WebhookPayload                       # Webhook data type
```

## Tests Directory

```
__tests__/
└── lib/
    ├── utils.test.ts                        # Utility function tests
    │   ├── generateRegistrationNumber()
    │   ├── getStatusColor()
    │   ├── getStatusText()
    │   └── formatCurrency()
    │
    └── validations.test.ts                  # Validation schema tests
        ├── registrationCreateSchema
        ├── checkoutSchema
        └── adminQuerySchema
```

## API Routes Summary

### Authentication Routes
- `POST /api/auth/signin/{provider}` - Sign in with OAuth
- `GET /api/auth/callback/{provider}` - OAuth callback
- `POST /api/auth/signout` - Sign out

### Registration Routes
- `POST /api/registrations` - Create registration
- `GET /api/registrations` - Get user's registrations
- `GET /api/registrations/me` - Get specific registration

### Workshop Routes
- `GET /api/workshops` - Get active workshop

### Checkout Routes
- `POST /api/checkout` - Create Stripe checkout session

### Webhook Routes
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Admin Routes
- `GET /api/admin/registrations` - List all registrations
- `GET /api/admin/stats` - Dashboard statistics

## Page Routes Summary

### Public Routes
- `/` - Landing page with workshop info
- `/login` - OAuth login

### Protected Routes (Authenticated)
- `/register` - Workshop registration
- `/checkout/success` - Payment success
- `/checkout/cancel` - Payment cancelled
- `/dashboard` - User dashboard

### Admin Routes (Admin Only)
- `/admin` - Admin dashboard

## Database Schema

```
User
  id: String (primary)
  name: String?
  email: String (unique)
  image: String?
  role: UserRole (USER | ADMIN)
  createdAt: DateTime
  updatedAt: DateTime
  
Account
  userId: String (foreign key)
  provider: String
  providerAccountId: String
  
Session
  sessionToken: String (unique)
  userId: String (foreign key)
  expires: DateTime
  
Workshop
  id: String (primary)
  title: String
  description: String
  price: Int
  currency: String
  date: DateTime
  startTime: String
  endTime: String
  location: String
  capacity: Int
  active: Boolean
  
Registration
  id: String (primary)
  registrationNumber: String (unique)
  userId: String (foreign key)
  workshopId: String (foreign key)
  status: RegistrationStatus
  paymentStatus: PaymentStatus
  amount: Int
  currency: String
  stripeCheckoutSessionId: String?
  stripePaymentIntentId: String?
  registeredAt: DateTime
  paidAt: DateTime?
  confirmationEmailSentAt: DateTime?
  
StripeEvent
  id: String (primary)
  stripeEventId: String (unique)
  type: String
  processedAt: DateTime
```

## Environment Variables

```
DATABASE_URL                   # PostgreSQL connection string
AUTH_SECRET                    # Random secret for NextAuth
AUTH_URL                       # Application URL for callbacks
AUTH_GOOGLE_ID                 # Google OAuth Client ID
AUTH_GOOGLE_SECRET             # Google OAuth Client Secret
AUTH_GITHUB_ID                 # GitHub OAuth App ID
AUTH_GITHUB_SECRET             # GitHub OAuth App Secret
STRIPE_SECRET_KEY              # Stripe Secret Key (sk_test_...)
STRIPE_WEBHOOK_SECRET          # Stripe Webhook Signing Secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Stripe Publishable Key
NEXT_PUBLIC_APP_URL            # Application URL
RESEND_API_KEY                 # Resend Email API Key
RESEND_FROM_EMAIL              # From email address
ADMIN_EMAILS                   # Comma-separated admin emails
NODE_ENV                       # development | production
```

## Scripts

```json
{
  "dev": "next dev",                      # Start dev server
  "build": "next build",                  # Build for production
  "start": "next start",                  # Start production server
  "lint": "next lint",                    # Run ESLint
  "test": "jest",                         # Run tests once
  "test:watch": "jest --watch",           # Run tests in watch mode
  "prisma:migrate": "prisma migrate dev", # Run migrations
  "prisma:seed": "node prisma/seed.js",   # Seed database
  "prisma:studio": "prisma studio"        # Open Prisma Studio
}
```

## File Count

- **Pages**: 8
- **API Routes**: 9
- **Components**: 5
- **Library Files**: 10
- **Type Definitions**: 1
- **Email Templates**: 1
- **Tests**: 2
- **Configuration Files**: 15+
- **Documentation**: 4
- **Total**: 50+ production-ready files

## Key Features by File

### Authentication
- `lib/auth.ts` - OAuth configuration
- `app/login/page.tsx` - Login UI
- `app/api/auth/[...nextauth]/route.ts` - Auth endpoints

### Payments
- `lib/stripe.ts` - Stripe utilities
- `app/api/checkout/route.ts` - Checkout creation
- `app/api/webhooks/stripe/route.ts` - Webhook handling

### Registrations
- `lib/registration.ts` - Registration logic
- `app/api/registrations/route.ts` - Registration endpoints
- `app/register/page.tsx` - Registration UI

### Admin
- `app/admin/page.tsx` - Admin dashboard
- `app/api/admin/registrations/route.ts` - Admin registrations API
- `app/api/admin/stats/route.ts` - Statistics API

### Security
- `lib/authorization.ts` - Authorization checks
- `middleware.ts` - Route protection
- `lib/validations.ts` - Input validation

### Utilities
- `lib/utils.ts` - Helper functions
- `lib/db.ts` - Database client
- `lib/email.ts` - Email sending
- `lib/errors.ts` - Error handling

---

This structure provides a clean, organized, production-ready Next.js application.
