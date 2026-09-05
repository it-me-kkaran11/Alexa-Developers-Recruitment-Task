import "@testing-library/jest-dom";

// Mock environment variables for tests
process.env.DATABASE_URL = "postgresql://test:test@db.example.test:5432/test";
process.env.DIRECT_URL = "postgresql://test:test@db.example.test:5432/test";
process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_mock";
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_mock";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.AUTH_SECRET = "test-secret";
process.env.ADMIN_EMAILS = "admin@test.com";
