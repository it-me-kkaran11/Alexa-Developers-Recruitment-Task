import { auth } from "./auth";
import { prisma } from "./db";
import { UserRole } from "@prisma/client";

export class AuthorizationError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Verify user is authenticated
 * Returns the user object or throws error
 */
export async function requireUser() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new AuthorizationError(401, "Unauthorized: Please sign in");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new AuthorizationError(401, "User not found");
  }

  return user;
}

/**
 * Verify user is authenticated and is an admin
 * Returns the user object or throws error
 */
export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== UserRole.ADMIN) {
    throw new AuthorizationError(
      403,
      "Forbidden: Admin access required"
    );
  }

  return user;
}

/**
 * Verify user owns a specific resource
 */
export async function verifyOwnership(userId: string) {
  const user = await requireUser();

  if (user.id !== userId) {
    throw new AuthorizationError(
      403,
      "Forbidden: Access denied"
    );
  }

  return user;
}

/**
 * Handle authorization errors in API routes
 */
export function handleAuthError(error: unknown) {
  if (error instanceof AuthorizationError) {
    return {
      status: error.statusCode,
      body: {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
      },
    };
  }

  // Unexpected error
  console.error("Unexpected error:", error);
  return {
    status: 500,
    body: {
      success: false,
      error: "Internal server error",
      statusCode: 500,
    },
  };
}
