"use client";

import { RegistrationStatus, PaymentStatus } from "@prisma/client";
import { getStatusColor, getStatusText } from "@/lib/utils";

interface StatusBadgeProps {
  status: RegistrationStatus | PaymentStatus | string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const text = getStatusText(status);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const colorClasses = {
    green: "bg-green-100 text-green-800 border border-green-300",
    yellow: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    red: "bg-red-100 text-red-800 border border-red-300",
    blue: "bg-blue-100 text-blue-800 border border-blue-300",
    gray: "bg-gray-100 text-gray-800 border border-gray-300",
  };

  return (
    <span
      className={`inline-block rounded-full font-semibold ${sizeClasses[size]} ${colorClasses[color]}`}
    >
      {text}
    </span>
  );
}
