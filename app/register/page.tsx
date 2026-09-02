"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingState, ErrorState } from "@/components/States";
import { WorkshopData, RegistrationData } from "@/types";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workshopId = searchParams.get("workshopId");

  const [workshop, setWorkshop] = useState<WorkshopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (!workshopId) {
      setError("Workshop ID is required");
      setLoading(false);
      return;
    }

    const fetchWorkshop = async () => {
      try {
        const res = await fetch("/api/workshops");
        const data = await res.json();

        if (!data.success) {
          setError("Failed to load workshop details");
          return;
        }

        if (data.data.id !== workshopId) {
          setError("Workshop not found");
          return;
        }

        setWorkshop(data.data);
      } catch (err) {
        setError("Failed to load workshop details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, [workshopId, status, router]);

  const handleRegister = async () => {
    if (!workshopId) return;

    setRegistering(true);
    setError(null);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId }),
      });

      const data = await res.json();

      if (!data.success) {
        if (res.status === 409) {
          setError(
            "You have already registered for this workshop. Proceed to checkout from your dashboard."
          );
        } else {
          setError(data.error || "Registration failed. Please try again.");
        }
        return;
      }

      const registration = data.data as RegistrationData;

      // Proceed to checkout
      try {
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId: registration.id }),
        });

        const checkoutData = await checkoutRes.json();

        if (!checkoutData.success) {
          setError("Failed to create checkout session. Please try again.");
          return;
        }

        // Redirect to Stripe Checkout
        const { sessionId } = checkoutData.data;
        const stripe = await import("@stripe/stripe-js").then(
          (mod) => mod.loadStripe
        );
        const stripeInstance = await stripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        );

        if (!stripeInstance) {
          setError("Stripe configuration error");
          return;
        }

        const redirectResult = await stripeInstance.redirectToCheckout({
          sessionId,
        });

        if (redirectResult?.error) {
          setError("Failed to redirect to checkout. Please try again.");
        }
      } catch (err) {
        setError("Checkout error. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  if (status === "loading" || loading) return <LoadingState />;

  if (!session?.user) {
    return null;
  }

  if (!workshop) {
    return (
      <ErrorState
        title="Workshop Not Found"
        message="The workshop you're looking for doesn't exist or is not available."
        onRetry={() => router.push("/")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Complete Your Registration
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}

          {/* Workshop Summary */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {workshop.title}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold">Date</p>
                <p>{new Date(workshop.date).toLocaleDateString("en-IN")}</p>
              </div>
              <div>
                <p className="font-semibold">Time</p>
                <p>
                  {workshop.startTime} - {workshop.endTime}
                </p>
              </div>
              <div>
                <p className="font-semibold">Location</p>
                <p>{workshop.location}</p>
              </div>
              <div>
                <p className="font-semibold">Price</p>
                <p className="text-lg font-bold text-blue-600">
                  ₹{(workshop.price / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Attendee Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={session.user?.name || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={session.user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p>
              By clicking "Proceed to Payment", you agree to our Terms of Service
              and understand that you will be charged ₹{(workshop.price / 100).toFixed(2)}{" "}
              for this workshop.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleRegister}
              disabled={registering}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registering ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
