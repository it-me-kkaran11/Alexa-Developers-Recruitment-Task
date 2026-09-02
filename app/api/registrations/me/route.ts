import { NextRequest, NextResponse } from "next/server";
import { requireUser, handleAuthError } from "@/lib/authorization";
import { prisma } from "@/lib/db";

/**
 * Get current user's registration for a specific workshop
 * Query: ?workshopId=xyz
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();

    const workshopId = req.nextUrl.searchParams.get("workshopId");

    if (!workshopId) {
      return NextResponse.json(
        {
          success: false,
          error: "workshopId is required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: {
        userId_workshopId: {
          userId: user.id,
          workshopId,
        },
      },
      include: {
        workshop: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: registration,
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    const authError = handleAuthError(error);
    return NextResponse.json(authError.body, { status: authError.status });
  }
}
