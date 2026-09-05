import { UserRole, RegistrationStatus, PaymentStatus } from '@prisma/client';

export interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: UserRole;
}

export interface RegistrationData {
  id: string;
  registrationNumber: string;
  userId: string;
  workshopId: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  registeredAt: Date;
  paidAt?: Date | null;
  confirmationEmailSentAt?: Date | null;
  confirmationEmailSendingAt?: Date | null;
}

export interface WorkshopData {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  active: boolean;
}

export interface StripeCheckoutData {
  registrationId: string;
  userId: string;
  workshopId: string;
  amount: number;
  currency: string;
  customerEmail: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface WebhookPayload {
  type: string;
  data: Record<string, unknown>;
}
