"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Submitted
        </h1>
        <p className="text-gray-600 mb-8">
          Stripe has received your payment. Your registration will be confirmed
          after our server verifies the Stripe webhook. You will receive a
          confirmation email after verification.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-green-800">
            <strong>Next Steps:</strong>
            <br />
            1. Wait for payment verification
            <br />
            2. Review your registration details
            <br />
            3. Add the workshop date to your calendar
          </p>
        </div>

        <p className="text-gray-500 text-sm mb-8">
          Redirecting to your dashboard in 5 seconds...
        </p>

        <Link
          href="/dashboard"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
          Go to Dashboard Now
        </Link>
      </div>
    </div>
  );
}
