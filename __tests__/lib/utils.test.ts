import { generateRegistrationNumber } from "@/lib/registration";
import { getStatusColor, getStatusText, formatCurrency } from "@/lib/utils";

describe("Registration Utils", () => {
  describe("generateRegistrationNumber", () => {
    it("should generate a unique registration number", () => {
      const reg1 = generateRegistrationNumber();
      const reg2 = generateRegistrationNumber();

      expect(reg1).toMatch(/^WR-[A-Z0-9]+-[A-Z0-9]+$/);
      expect(reg2).toMatch(/^WR-[A-Z0-9]+-[A-Z0-9]+$/);
      expect(reg1).not.toEqual(reg2);
    });

    it("should return a string", () => {
      const regNum = generateRegistrationNumber();
      expect(typeof regNum).toBe("string");
    });
  });
});

describe("Utility Functions", () => {
  describe("getStatusColor", () => {
    it("should return correct colors for statuses", () => {
      expect(getStatusColor("PAID")).toBe("green");
      expect(getStatusColor("PENDING")).toBe("yellow");
      expect(getStatusColor("FAILED")).toBe("red");
      expect(getStatusColor("CHECKOUT_STARTED")).toBe("blue");
    });

    it("should be case-insensitive", () => {
      expect(getStatusColor("paid")).toBe("green");
      expect(getStatusColor("Pending")).toBe("yellow");
    });
  });

  describe("getStatusText", () => {
    it("should return readable status text", () => {
      expect(getStatusText("PAID")).toBe("Confirmed");
      expect(getStatusText("PENDING")).toBe("Pending");
      expect(getStatusText("FAILED")).toBe("Failed");
      expect(getStatusText("CHECKOUT_STARTED")).toBe("Checkout In Progress");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(199900, "INR")).toBe("₹1999.00");
      expect(formatCurrency(50000, "USD")).toBe("$500.00");
      expect(formatCurrency(10000, "EUR")).toBe("€100.00");
    });

    it("should handle edge cases", () => {
      expect(formatCurrency(0, "INR")).toBe("₹0.00");
      expect(formatCurrency(99, "INR")).toBe("₹0.99");
    });
  });
});
