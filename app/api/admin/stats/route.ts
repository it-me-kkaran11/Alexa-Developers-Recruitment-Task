import { NextResponse } from "next/server";
import { requireAdmin, handleAuthError } from "@/lib/authorization";
import { prisma } from "@/lib/db";
import { RegistrationStatus, PaymentStatus } from "@prisma/client";

export async function GET() {
  try {
    await requireAdmin();

    // Get all registrations for stats
    const registrations = await prisma.registration.findMany({
      select: {
        status: true,
        paymentStatus: true,
        amount: true,
        paidAt: true,
      },
    });

    // Calculate stats
    const totalRegistrations = registrations.length;
    const paidRegistrations = registrations.filter(
      (r) => r.paymentStatus === PaymentStatus.COMPLETED
    ).length;
    const pendingRegistrations = registrations.filter(
      (r) => r.status === RegistrationStatus.PENDING
    ).length;
    const failedRegistrations = registrations.filter(
      (r) => r.status === RegistrationStatus.FAILED
    ).length;
    const cancelledRegistrations = registrations.filter(
      (r) => r.status === RegistrationStatus.CANCELLED
    ).length;

    const totalRevenue = registrations
      .filter((r) => r.paymentStatus === PaymentStatus.COMPLETED)
      .reduce((sum, r) => sum + r.amount, 0);

    return NextResponse.json(
      {
        success: true,
        data: {
          stats: {
            totalRegistrations,
            paidRegistrations,
            pendingRegistrations,
            failedRegistrations,
            cancelledRegistrations,
            totalRevenue,
            averageRevenue:
              paidRegistrations > 0
                ? Math.round(totalRevenue / paidRegistrations)
                : 0,
          },
        },
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    const authError = handleAuthError(error);
    return NextResponse.json(authError.body, { status: authError.status });
  }
}
