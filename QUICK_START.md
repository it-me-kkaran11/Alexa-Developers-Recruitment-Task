# Quick Start (5 Minutes)

Get the workshop registration platform running locally in 5 minutes.

## Prerequisites
- Node.js 18+
- PostgreSQL running on localhost:5432
- Google/GitHub OAuth credentials
- Stripe account

## 1. Install & Configure (2 min)

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/workshop_db"

# Auth (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
AUTH_SECRET="your-secret-here"
AUTH_URL="http://localhost:3000"

# OAuth
AUTH_GOOGLE_ID="your-google-id"
AUTH_GOOGLE_SECRET="your-google-secret"
AUTH_GITHUB_ID="your-github-id"
AUTH_GITHUB_SECRET="your-github-secret"

# Stripe (TEST MODE - use sk_test_... and pk_test_...)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." (fill after webhook setup)

# Email (Optional)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Admin
ADMIN_EMAILS="your-email@example.com"
```

## 2. Database Setup (1 min)

```bash
npx prisma migrate dev
npx prisma db seed
```

## 3. Stripe Webhook (1 min) - In a new terminal

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook secret (whsec_...) to .env.local STRIPE_WEBHOOK_SECRET
```

## 4. Start Dev Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Done! 🎉

You now have:
- ✓ Landing page with workshop details
- ✓ OAuth login (Google/GitHub)
- ✓ Workshop registration
- ✓ Stripe payment checkout
- ✓ User dashboard
- ✓ Admin dashboard

## Test It

1. Sign in with Google or GitHub
2. Click "Register Now"
3. Click "Proceed to Payment"
4. Use test card: `4242 4242 4242 4242`
5. Expiry: Any future date, CVC: Any 3 digits
6. Confirm payment
7. Check dashboard and email

## Troubleshooting

**Database connection error?**
```bash
docker-compose up -d  # Start PostgreSQL with Docker
```

**OAuth not working?**
Verify redirect URIs match exactly:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

**Stripe webhook not processing?**
- Ensure `stripe listen` is running
- Verify webhook secret in `.env.local`

**Email not sending?**
Email won't block payments. Check Resend API key is valid.

## Full Documentation

- See [SETUP.md](./SETUP.md) for detailed setup guide
- See [README.md](./README.md) for complete documentation
- See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for feature list

---

**Happy coding!** 🚀
