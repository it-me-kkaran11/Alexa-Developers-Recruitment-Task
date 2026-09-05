import { NextRequest, NextResponse } from "next/server";
import { stripe, getWebhookSecret } from "@/lib/stripe";
import {
  claimConfirmationEmail,
  releaseConfirmationEmailClaim,
  markEmailSent,
} from "@/lib/registration";
import { sendConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

/**
 * Stripe Webhook Handler
 * Processes checkout.session.completed events
 * 
 * Important:
 * - Verifies Stripe signature
 * - Makes operations idempotent to prevent duplicate processing
 * - Marks registration as PAID only after verification
 * - Sends confirmation email after successful payment
 */
export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();

    // Get Stripe signature from headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        {
          success: false,
          error: "Missing signature",
        },
        { status: 400 }
      );
    }

    // Verify Stripe signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        getWebhookSecret()
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Signature verification failed",
        },
        { status: 400 }
      );
    }

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Extract metadata
      const registrationId = session.metadata?.registrationId as string;
      const userId = session.metadata?.userId as string;
      const workshopId = session.metadata?.workshopId as string;

      if (!registrationId || !userId || !workshopId) {
        console.error("Missing metadata in Stripe session", session.id);
        return NextResponse.json(
          {
            success: false,
            error: "Missing metadata",
          },
          { status: 400 }
        );
      }

      if (session.payment_status !== "paid") {
        return NextResponse.json(
          { success: false, error: "Payment is not complete" },
          { status: 400 }
        );
      }

      let registration;
      try {
        // Claim the event and update the registration in one transaction. The
        // unique event ID makes simultaneous deliveries safe.
        registration = await prisma.$transaction(async (tx) => {
          await tx.stripeEvent.create({
            data: { stripeEventId: event.id, type: event.type },
          });

          const currentRegistration = await tx.registration.findUnique({
            where: { id: registrationId },
            include: { user: true, workshop: true },
          });

          if (!currentRegistration) {
            throw new Error("Registration not found");
          }

          if (
            currentRegistration.userId !== userId ||
            currentRegistration.workshopId !== workshopId
          ) {
            throw new Error("Registration metadata does not match");
          }

          if (
            session.amount_total !== currentRegistration.amount ||
            session.currency?.toLowerCase() !==
              currentRegistration.currency.toLowerCase() ||
            currentRegistration.workshop.price !== currentRegistration.amount ||
            currentRegistration.workshop.currency.toLowerCase() !==
              currentRegistration.currency.toLowerCase()
          ) {
            throw new Error("Payment amount or currency mismatch");
          }

          await tx.registration.update({
            where: { id: registrationId },
            data: {
              status: "PAID",
              paymentStatus: "COMPLETED",
              paidAt: currentRegistration.paidAt || new Date(),
              stripeCheckoutSessionId: session.id,
              ...(typeof session.payment_intent === "string" && {
                stripePaymentIntentId: session.payment_intent,
              }),
            },
          });

          return currentRegistration;
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          console.log(`Event ${event.id} already processed`);
          return NextResponse.json({ success: true, statusCode: 200 });
        }

        if (error instanceof Error && error.message === "Registration not found") {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 404 }
          );
        }

        if (
          error instanceof Error &&
          (error.message === "Registration metadata does not match" ||
            error.message === "Payment amount or currency mismatch")
        ) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
          );
        }

        throw error;
      }

      // Send confirmation email if not already sent
      const emailClaimed = await claimConfirmationEmail(registrationId);

      if (emailClaimed) {
        const formattedAmount = formatCurrency(
          registration.amount,
          registration.currency
        );
        const workshopDate = new Date(registration.workshop.date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const emailResult = await sendConfirmationEmail({
          to: registration.user.email,
          attendeeName: registration.user.name || "Attendee",
          workshopName: registration.workshop.title,
          registrationNumber: registration.registrationNumber,
          date: workshopDate,
          time: `${registration.workshop.startTime} - ${registration.workshop.endTime}`,
          location: registration.workshop.location,
          amount: formattedAmount,
        });

        if (emailResult.success) {
          // Mark email as sent
          await markEmailSent(registrationId);
        } else {
          // Log error but don't fail - payment is already confirmed
          console.error(
            `Failed to send confirmation email for registration ${registrationId}:`,
            emailResult.error
          );
          await releaseConfirmationEmailClaim(registrationId);
        }
      }

      return NextResponse.json({ success: true, statusCode: 200 });
    }

    // Record unknown event type as processed (to avoid retry)
    try {
      await prisma.stripeEvent.create({
        data: { stripeEventId: event.id, type: event.type },
      });
    } catch (error) {
      if (
        !(
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        )
      ) {
        throw error;
      }
    }

    return NextResponse.json({ success: true, statusCode: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
