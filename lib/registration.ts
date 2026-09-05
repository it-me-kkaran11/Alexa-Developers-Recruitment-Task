import { prisma } from "./db";
import { Prisma, RegistrationStatus } from "@prisma/client";

/**
 * Generate a unique human-readable registration number
 */
export function generateRegistrationNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WR-${timestamp}-${random}`;
}

/**
 * Check if user already has a registration for this workshop
 */
export async function hasExistingRegistration(
  userId: string,
  workshopId: string
) {
  const registration = await prisma.registration.findUnique({
    where: {
      userId_workshopId: {
        userId,
        workshopId,
      },
    },
  });

  return !!registration;
}

/**
 * Get user's pending or paid registrations for a workshop
 */
export async function getActiveRegistration(
  userId: string,
  workshopId: string
) {
  const registration = await prisma.registration.findFirst({
    where: {
      userId,
      workshopId,
      status: {
        in: [RegistrationStatus.PENDING, RegistrationStatus.CHECKOUT_STARTED, RegistrationStatus.PAID],
      },
    },
  });

  return registration;
}

/**
 * Create a new registration record
 */
export async function createRegistration(
  userId: string,
  workshopId: string,
  amount: number,
  currency: string
) {
  // Check if already registered
  const existing = await hasExistingRegistration(userId, workshopId);
  if (existing) {
    throw new Error("User already has a registration for this workshop");
  }

  try {
    return await prisma.registration.create({
      data: {
        registrationNumber: generateRegistrationNumber(),
        userId,
        workshopId,
        status: RegistrationStatus.PENDING,
        amount,
        currency,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("User already has a registration for this workshop");
    }
    throw error;
  }
}

/**
 * Update registration checkout started status
 */
export async function updateCheckoutStarted(registrationId: string, stripeSessionId: string) {
  return prisma.registration.update({
    where: { id: registrationId },
    data: {
      status: RegistrationStatus.CHECKOUT_STARTED,
      stripeCheckoutSessionId: stripeSessionId,
    },
  });
}

/**
 * Mark registration as paid after webhook verification
 */
export async function markAsPaid(
  registrationId: string,
  stripeSessionId: string,
  paymentIntentId?: string
) {
  return prisma.registration.update({
    where: { id: registrationId },
    data: {
      status: RegistrationStatus.PAID,
      paymentStatus: "COMPLETED",
      paidAt: new Date(),
      stripeCheckoutSessionId: stripeSessionId,
      ...(paymentIntentId && { stripePaymentIntentId: paymentIntentId }),
    },
  });
}

/**
 * Mark confirmation email as sent
 */
export async function markEmailSent(registrationId: string) {
  return prisma.registration.update({
    where: { id: registrationId },
    data: {
      confirmationEmailSentAt: new Date(),
      confirmationEmailSendingAt: null,
    },
  });
}

/** Claim confirmation-email delivery so concurrent webhook requests cannot send twice. */
export async function claimConfirmationEmail(registrationId: string) {
  const retryAfter = new Date(Date.now() - 10 * 60 * 1000);

  const result = await prisma.registration.updateMany({
    where: {
      id: registrationId,
      confirmationEmailSentAt: null,
      OR: [
        { confirmationEmailSendingAt: null },
        { confirmationEmailSendingAt: { lt: retryAfter } },
      ],
    },
    data: { confirmationEmailSendingAt: new Date() },
  });

  return result.count === 1;
}

export async function releaseConfirmationEmailClaim(registrationId: string) {
  await prisma.registration.updateMany({
    where: { id: registrationId, confirmationEmailSentAt: null },
    data: { confirmationEmailSendingAt: null },
  });
}

/**
 * Check if email was already sent for a registration
 */
export async function emailAlreadySent(registrationId: string): Promise<boolean> {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    select: { confirmationEmailSentAt: true },
  });

  return !!registration?.confirmationEmailSentAt;
}
