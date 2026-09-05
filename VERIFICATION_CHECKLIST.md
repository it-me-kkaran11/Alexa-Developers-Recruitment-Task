# Setup Verification Checklist

Use this checklist to verify your setup is complete and correct before running the application.

## Pre-Setup Requirements

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] PostgreSQL 12+ running locally or remote
- [ ] Git installed
- [ ] Text editor or IDE (VS Code recommended)

## OAuth Setup

### Google OAuth
- [ ] Google account available
- [ ] Google Cloud Console access
- [ ] OAuth 2.0 Client IDs created
- [ ] Redirect URI added: `http://localhost:3000/api/auth/callback/google`
- [ ] `AUTH_GOOGLE_ID` copied to `.env.local`
- [ ] `AUTH_GOOGLE_SECRET` copied to `.env.local`

### GitHub OAuth
- [ ] GitHub account available
- [ ] OAuth App created in GitHub settings
- [ ] Authorization callback URL set: `http://localhost:3000/api/auth/callback/github`
- [ ] `AUTH_GITHUB_ID` copied to `.env.local`
- [ ] `AUTH_GITHUB_SECRET` copied to `.env.local`

## Stripe Setup

- [ ] Stripe account created
- [ ] In TEST MODE (not live)
- [ ] API keys generated
- [ ] `STRIPE_SECRET_KEY` starts with `sk_test_` in `.env.local`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_test_` in `.env.local`
- [ ] Webhook listener ready to configure

## Environment Variables

- [ ] `.env.local` file created from `.env.example`
- [ ] `DATABASE_URL` configured and valid
- [ ] `AUTH_SECRET` generated and set
- [ ] `AUTH_URL` set to `http://localhost:3000`
- [ ] `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` set
- [ ] `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` set
- [ ] `STRIPE_SECRET_KEY` set
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set
- [ ] `NEXT_PUBLIC_APP_URL` set to `http://localhost:3000`
- [ ] `ADMIN_EMAILS` set with your email
- [ ] All required variables present (no missing values)

## Optional Email Setup

- [ ] Resend account created (optional)
- [ ] `RESEND_API_KEY` set in `.env.local` (optional)
- [ ] `RESEND_FROM_EMAIL` set in `.env.local` (optional)

## Database Setup

- [ ] PostgreSQL running
- [ ] `npm install` completed successfully
- [ ] No TypeScript errors in terminal
- [ ] `npx prisma migrate dev` completed successfully
- [ ] `npx prisma db seed` completed successfully
- [ ] `npx prisma studio` shows workshop and user tables

## Stripe Webhook Setup

- [ ] Stripe CLI installed
- [ ] `stripe login` completed
- [ ] `stripe listen --forward-to localhost:3000/api/webhooks/stripe` running
- [ ] Webhook signing secret obtained from Stripe CLI
- [ ] `STRIPE_WEBHOOK_SECRET` set in `.env.local`
- [ ] Webhook secret starts with `whsec_`

## Project Setup

- [ ] `npm install` completed
- [ ] No package installation errors
- [ ] `.env.local` exists with all required variables
- [ ] Database migrations applied
- [ ] Database seeded with default workshop
- [ ] `npm run dev` starts without errors
- [ ] No console errors on startup

## Testing Before Running

- [ ] All environment variables are set
- [ ] Database connection works (`npx prisma studio` opens successfully)
- [ ] No conflicting services on port 3000
- [ ] Stripe CLI webhook listener is running
- [ ] Terminal 1: `npm run dev` (dev server)
- [ ] Terminal 2: `stripe listen ...` (webhook listener)

## Pre-Launch Verification

### Application Loads
- [ ] [http://localhost:3000](http://localhost:3000) loads without errors
- [ ] Landing page displays correctly
- [ ] "Sign In" button visible
- [ ] Workshop details show correctly
- [ ] No console errors in browser DevTools

### Authentication
- [ ] "Sign In" button redirects to login page
- [ ] Google OAuth button clickable
- [ ] GitHub OAuth button clickable
- [ ] OAuth flow completes successfully
- [ ] Returned to dashboard after login
- [ ] User name/email displays correctly
- [ ] "Sign Out" option available in navbar

### Registration
- [ ] "Register Now" button visible when logged in
- [ ] Click "Register Now" shows registration form
- [ ] Workshop details display correctly
- [ ] "Proceed to Payment" button present
- [ ] Can see pre-filled name and email

### Checkout
- [ ] "Proceed to Payment" redirects to Stripe
- [ ] Stripe Checkout page loads
- [ ] Test card field ready for input
- [ ] Can enter test card: `4242 4242 4242 4242`
- [ ] Can set any future expiry date
- [ ] Can enter any 3-digit CVC

### Payment
- [ ] Payment processes successfully
- [ ] Redirected to success page
- [ ] "Go to Dashboard" button works
- [ ] Registration shows "PAID" status
- [ ] Payment status shows "COMPLETED"

### Dashboard
- [ ] Dashboard loads with registration history
- [ ] Registration shows correct workshop name
- [ ] Registration shows "PAID" status
- [ ] Registration ID visible
- [ ] Payment amount correct (₹1999.00)
- [ ] Registration date displayed

### Webhook
- [ ] Check Stripe CLI terminal for webhook event
- [ ] Webhook event shows "checkout.session.completed"
- [ ] No errors in webhook processing
- [ ] Server logs show payment confirmation

### Email
- [ ] Check email inbox for confirmation (if Resend configured)
- [ ] Confirmation email contains workshop details
- [ ] Confirmation email has registration number
- [ ] Confirmation email looks professional

### Admin (if admin email used)
- [ ] Sign out from dashboard
- [ ] Sign back in with same account
- [ ] "Admin" link appears in navbar
- [ ] Admin dashboard loads
- [ ] Registrations table shows your registration
- [ ] Search function works
- [ ] Status filter works
- [ ] Stats show totals correctly

## Troubleshooting Checklist

### Database Issues
- [ ] Supabase project is running
- [ ] DATABASE_URL and DIRECT_URL are copied from Supabase Database/Connect settings
- [ ] Can connect with Prisma: `npx prisma db execute --stdin < /dev/null`
- [ ] No migration errors in history

### OAuth Issues
- [ ] Redirect URIs match exactly (no trailing slashes)
- [ ] OAuth credentials are for correct environment (test/production)
- [ ] Credentials haven't expired
- [ ] Browser has third-party cookies enabled

### Stripe Issues
- [ ] Using test mode API keys (sk_test_ and pk_test_)
- [ ] Webhook listener is running (`stripe listen`)
- [ ] Webhook secret is correct in `.env.local`
- [ ] Test card is valid: `4242 4242 4242 4242`

### Port Issues
- [ ] Port 3000 is not in use: `lsof -i :3000`
- [ ] Kill any process using port 3000 if needed

### Environment Issues
- [ ] Reload environment after editing `.env.local`
- [ ] Restart dev server after `.env.local` changes
- [ ] Check for typos in variable names
- [ ] No extra spaces in values

## Final Sign-Off

- [ ] All checklist items completed
- [ ] Application runs without errors
- [ ] Can complete registration flow
- [ ] Payment processes successfully
- [ ] Admin dashboard accessible
- [ ] Ready for development or deployment

## Post-Setup

- [ ] Run tests: `npm test`
- [ ] Check for lint errors: `npm run lint`
- [ ] Review QUICK_START.md for fast reference
- [ ] Review README.md for complete documentation
- [ ] Start making customizations

---

If you encounter issues, check:
1. QUICK_START.md for 5-minute setup
2. SETUP.md for detailed instructions
3. README.md troubleshooting section
4. PROJECT_STRUCTURE.md for code organization

