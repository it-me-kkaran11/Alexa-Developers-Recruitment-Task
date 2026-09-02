import { NextRequest, NextResponse } from "next/server";
import { stripe, getWebhookSecret } from "@/lib/stripe";
import { markAsPaid, emailAlreadySent, markEmailSent } from "@/lib/registration";
import { sendConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/db";

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

    // Check if event was already processed (idempotency)
    const existingEvent = await prisma.stripeEvent.findUnique({
      where: { stripeEventId: event.id },
    });

    if (existingEvent) {
      // Event already processed, return success to acknowledge
      console.log(`Event ${event.id} already processed`);
      return NextResponse.json({ success: true, statusCode: 200 });
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

      // Get registration and verify it exists
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        include: {
          user: true,
          workshop: true,
        },
      });

      if (!registration) {
        console.error(`Registration not found: ${registrationId}`);
        return NextResponse.json(
          {
            success: false,
            error: "Registration not found",
          },
          { status: 404 }
        );
      }

      // Verify amount matches
      if (session.amount_total !== registration.amount) {
        console.error(
          `Amount mismatch for registration ${registrationId}`,
          {
            stripeAmount: session.amount_total,
            registrationAmount: registration.amount,
          }
        );
        return NextResponse.json(
          {
            success: false,
            error: "Amount mismatch",
          },
          { status: 400 }
        );
      }

      // Mark registration as paid
      await markAsPaid(
        registrationId,
        session.id,
        session.payment_intent as string
      );

      // Send confirmation email if not already sent
      const alreadySent = await emailAlreadySent(registrationId);

      if (!alreadySent) {
        const formattedAmount = `₹${(registration.amount / 100).toFixed(2)}`;
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
        }
      }

      // Record that this event was processed
      await prisma.stripeEvent.create({
        data: {
          stripeEventId: event.id,
          type: event.type,
        },
      });

      return NextResponse.json({ success: true, statusCode: 200 });
    }

    // Record unknown event type as processed (to avoid retry)
    await prisma.stripeEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
      },
    });

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
