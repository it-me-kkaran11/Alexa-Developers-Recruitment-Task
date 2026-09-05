import { NextRequest, NextResponse } from "next/server";
import { requireUser, handleAuthError } from "@/lib/authorization";
import { createRegistration } from "@/lib/registration";
import { prisma } from "@/lib/db";
import { registrationCreateSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const user = await requireUser();

    // Parse and validate request body
    const body = await req.json();
    const { workshopId } = registrationCreateSchema.parse(body);

    // Get workshop details
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
    });

    if (!workshop) {
      return NextResponse.json(
        {
          success: false,
          error: "Workshop not found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    if (!workshop.active) {
      return NextResponse.json(
        {
          success: false,
          error: "Workshop is not available for registration",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Create registration (will throw if duplicate)
    const registration = await createRegistration(
      user.id,
      workshopId,
      workshop.price,
      workshop.currency
    );

    return NextResponse.json(
      {
        success: true,
        data: registration,
        statusCode: 201,
      },
      { status: 201 }
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

    if (error instanceof Error) {
      if (error.message.includes("already has a registration")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            statusCode: 409,
          },
          { status: 409 }
        );
      }
    }

    const authError = handleAuthError(error);
    return NextResponse.json(authError.body, { status: authError.status });
  }
}

/**
 * Get user's registrations
 */
export async function GET() {
  try {
    const user = await requireUser();

    const registrations = await prisma.registration.findMany({
      where: { userId: user.id },
      include: {
        workshop: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: registrations,
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    const authError = handleAuthError(error);
    return NextResponse.json(authError.body, { status: authError.status });
  }
}
