import { NextResponse } from "next/server";

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode: number;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  console.error("Unexpected error:", error);

  return NextResponse.json(
    {
      success: false,
      error: "Internal server error",
      statusCode: 500,
    },
    { status: 500 }
  );
}

export const API_ERRORS = {
  UNAUTHORIZED: (message = "Unauthorized") => new ApiError(401, message),
  FORBIDDEN: (message = "Forbidden") => new ApiError(403, message),
  NOT_FOUND: (message = "Not found") => new ApiError(404, message),
  CONFLICT: (message = "Conflict") => new ApiError(409, message),
  VALIDATION_ERROR: (message = "Validation error") =>
    new ApiError(400, message),
  INTERNAL_ERROR: (message = "Internal server error") =>
    new ApiError(500, message),
};
