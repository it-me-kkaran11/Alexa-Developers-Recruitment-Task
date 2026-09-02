import { ZodError } from "zod";
import {
  registrationCreateSchema,
  checkoutSchema,
  adminQuerySchema,
} from "@/lib/validations";

describe("Validation Schemas", () => {
  describe("registrationCreateSchema", () => {
    it("should validate correct registration data", () => {
      const data = {
        workshopId: "cuid123456789012345678901",
      };

      expect(() => registrationCreateSchema.parse(data)).not.toThrow();
    });

    it("should reject invalid workshopId", () => {
      const data = {
        workshopId: "invalid",
      };

      expect(() => registrationCreateSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject missing workshopId", () => {
      const data = {};

      expect(() => registrationCreateSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("checkoutSchema", () => {
    it("should validate correct checkout data", () => {
      const data = {
        registrationId: "cuid123456789012345678901",
      };

      expect(() => checkoutSchema.parse(data)).not.toThrow();
    });

    it("should reject invalid registrationId", () => {
      const data = {
        registrationId: "not-a-cuid",
      };

      expect(() => checkoutSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("adminQuerySchema", () => {
    it("should validate correct query parameters", () => {
      const data = {
        page: "1",
        limit: "10",
      };

      const result = adminQuerySchema.parse(data);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it("should set default values", () => {
      const data = {};

      const result = adminQuerySchema.parse(data);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it("should coerce string values to numbers", () => {
      const data = {
        page: "5",
        limit: "25",
      };

      const result = adminQuerySchema.parse(data);
      expect(typeof result.page).toBe("number");
      expect(typeof result.limit).toBe("number");
      expect(result.page).toBe(5);
      expect(result.limit).toBe(25);
    });

    it("should reject invalid page numbers", () => {
      const data = {
        page: "0",
      };

      expect(() => adminQuerySchema.parse(data)).toThrow(ZodError);
    });

    it("should reject limit exceeding max", () => {
      const data = {
        limit: "101",
      };

      expect(() => adminQuerySchema.parse(data)).toThrow(ZodError);
    });

    it("should accept valid status filters", () => {
      const data = {
        status: "PAID",
      };

      expect(() => adminQuerySchema.parse(data)).not.toThrow();
    });

    it("should accept valid payment status filters", () => {
      const data = {
        paymentStatus: "COMPLETED",
      };

      expect(() => adminQuerySchema.parse(data)).not.toThrow();
    });
  });
});
