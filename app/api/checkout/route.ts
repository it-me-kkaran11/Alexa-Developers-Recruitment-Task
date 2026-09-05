import { NextRequest, NextResponse } from "next/server";
import { requireUser, handleAuthError } from "@/lib/authorization";
import { createCheckoutSession } from "@/lib/stripe";
import { updateCheckoutStarted } from "@/lib/registration";
import { prisma } from "@/lib/db";
import { checkoutSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    // Parse and validate request body
    const body = await req.json();
    const { registrationId } = checkoutSchema.parse(body);

    // Get registration and verify ownership
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { workshop: true },
    });

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: "Registration not found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // Verify user owns this registration
    if (registration.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Cannot access this registration",
          statusCode: 403,
        },
        { status: 403 }
      );
    }

    // Verify price from database (never trust client)
    const workshop = registration.workshop;
    if (
      workshop.price !== registration.amount ||
      workshop.currency.toLowerCase() !== registration.currency.toLowerCase()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Price mismatch. Please try registering again",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (
      registration.status === "PAID" ||
      registration.paymentStatus === "COMPLETED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "This registration has already been paid",
          statusCode: 409,
        },
        { status: 409 }
      );
    }

    // Create Stripe checkout session
    const stripeSessionId = await createCheckoutSession(
      registration.amount,
      registration.currency,
      user.email!,
      registrationId,
      user.id,
      registration.workshopId
    );

    // Update registration with checkout session ID
    await updateCheckoutStarted(registrationId, stripeSessionId);

    return NextResponse.json(
      {
        success: true,
        data: {
          sessionId: stripeSessionId,
          stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        },
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    console.error("Checkout error:", error);

    const authError = handleAuthError(error);
    return NextResponse.json(authError.body, { status: authError.status });
  }
}
