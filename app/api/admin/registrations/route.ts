import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, handleAuthError } from "@/lib/authorization";
import { prisma } from "@/lib/db";
import { adminQuerySchema } from "@/lib/validations";
import { ZodError } from "zod";
import { RegistrationStatus, PaymentStatus } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    // Get and validate query parameters
    const searchParams = req.nextUrl.searchParams;
    const queryData = {
      status: searchParams.get("status") || undefined,
      paymentStatus: searchParams.get("paymentStatus") || undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || String(ITEMS_PER_PAGE),
    };

    const { status, paymentStatus, search, page, limit } =
      adminQuerySchema.parse(queryData);

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status as RegistrationStatus;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus as PaymentStatus;
    }

    if (search) {
      where.OR = [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          registrationNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Get total count
    const total = await prisma.registration.count({ where });

    // Get paginated results
    const registrations = await prisma.registration.findMany({
      where,
      include: {
        user: true,
        workshop: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          registrations,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
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

    const authError = handleAuthError(error);
    return NextResponse.json(authError.body, { status: authError.status });
  }
}
