import { z } from "zod";
import { RegistrationStatus, PaymentStatus } from "@prisma/client";

export const registrationCreateSchema = z.object({
  workshopId: z.string().cuid("Invalid workshop ID"),
});

export const checkoutSchema = z.object({
  registrationId: z.string().cuid("Invalid registration ID"),
});

export const stripeWebhookSchema = z.object({
  type: z.string(),
  data: z.record(z.unknown()),
  id: z.string(),
});

export const adminQuerySchema = z.object({
  status: z
    .enum(Object.values(RegistrationStatus) as [string, ...string[]])
    .optional(),
  paymentStatus: z
    .enum(Object.values(PaymentStatus) as [string, ...string[]])
    .optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const workshopSeedSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().positive(),
  currency: z.string().default("INR"),
  date: z.string().datetime(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().min(1),
  capacity: z.number().int().positive().default(100),
});

export type RegistrationCreateInput = z.infer<typeof registrationCreateSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type AdminQueryInput = z.infer<typeof adminQuerySchema>;
export type WorkshopSeedInput = z.infer<typeof workshopSeedSchema>;
