import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Get active workshop
 * We'll assume there's only one active workshop for this platform
 */
export async function GET(req: NextRequest) {
  try {
    const workshop = await prisma.workshop.findFirst({
      where: { active: true },
    });

    if (!workshop) {
      return NextResponse.json(
        {
          success: false,
          error: "No active workshop found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: workshop,
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Workshop fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
