"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Registration {
  id: string;
  registrationNumber: string;
  status: string;
  paymentStatus: string;
  amount: number;
  currency: string;
  registeredAt: string;
  paidAt?: string;
  confirmationEmailSentAt?: string;
  workshop: {
    id: string;
    title: string;
    date: string;
    location: string;
    startTime: string;
    endTime: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status !== "authenticated") return;

    const fetchRegistrations = async () => {
      try {
        const res = await fetch("/api/registrations");
        const data = await res.json();

        if (!data.success) {
          setError(data.error || "Failed to load registrations");
          return;
        }

        setRegistrations(data.data || []);
      } catch (err) {
        setError("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [status, router]);

  const handleRetryPayment = (registrationId: string) => {
    router.push(`/register?workshopId=${registrations.find((r) => r.id === registrationId)?.workshop.id}`);
  };

  if (status === "loading" || loading) return <LoadingState />;

  if (!session?.user) {
    return null;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Dashboard"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {session.user.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-600">{session.user.email}</p>
        </div>

        {/* Registrations Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <h2 className="text-2xl font-bold">Your Registrations</h2>
          </div>

          {registrations.length === 0 ? (
            <div className="p-12">
              <EmptyState
                title="No Registrations Yet"
                message="You haven't registered for any workshops yet. Visit the home page to register!"
                icon="📭"
              />
              <div className="text-center mt-6">
                <button
                  onClick={() => router.push("/")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Browse Workshops
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Workshop
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Registration ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {reg.workshop.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(reg.workshop.date).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {reg.registrationNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <StatusBadge status={reg.status} size="sm" />
                          <StatusBadge status={reg.paymentStatus} size="sm" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatCurrency(reg.amount, reg.currency)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <p>Registered: {formatDate(new Date(reg.registeredAt))}</p>
                        {reg.paidAt && (
                          <p className="text-green-600">
                            Paid: {formatDate(new Date(reg.paidAt))}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {reg.status === "PENDING" && (
                          <button
                            onClick={() => handleRetryPayment(reg.id)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            Complete Payment
                          </button>
                        )}
                        {reg.status === "PAID" && (
                          <span className="text-green-600 font-semibold text-sm">
                            ✓ Confirmed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Email Confirmation Info */}
        {registrations.some((r) => r.status === "PAID" && !r.confirmationEmailSentAt) && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              📧 Confirmation Email
            </h3>
            <p className="text-blue-800">
              A confirmation email with your registration details will be sent once
              your payment is verified by our payment processor.
            </p>
          </div>
        )}

        {/* Register More Section */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Browse More Workshops
          </button>
        </div>
      </div>
    </div>
  );
}
