import { isValidPhoneNumber, isValidPrice, isValidObjectId } from "../../utils/validation";

describe("Validation Utilities", () => {
  describe("isValidPhoneNumber", () => {
    it("should validate correct phone numbers", () => {
      expect(isValidPhoneNumber("9999999991")).toBe(true);
      expect(isValidPhoneNumber("9999999993")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(isValidPhoneNumber("123")).toBe(false);
      expect(isValidPhoneNumber("99999999999")).toBe(false);
      expect(isValidPhoneNumber("abc")).toBe(false);
    });

    it("should handle formatted phone numbers", () => {
      expect(isValidPhoneNumber("999-999-9991")).toBe(true);
      expect(isValidPhoneNumber("(999) 999-9991")).toBe(true);
    });
  });

  describe("isValidPrice", () => {
    it("should validate positive prices", () => {
      expect(isValidPrice(100)).toBe(true);
      expect(isValidPrice(50000)).toBe(true);
      expect(isValidPrice("1500")).toBe(true);
    });

    it("should validate zero price", () => {
      expect(isValidPrice(0)).toBe(true);
    });

    it("should reject negative prices", () => {
      expect(isValidPrice(-100)).toBe(false);
      expect(isValidPrice("-50")).toBe(false);
    });

    it("should reject invalid prices", () => {
      expect(isValidPrice("abc")).toBe(false);
      expect(isValidPrice(NaN)).toBe(false);
    });
  });

  describe("isValidObjectId", () => {
    it("should validate MongoDB ObjectIds", () => {
      expect(isValidObjectId("507f1f77bcf86cd799439011")).toBe(true);
      expect(isValidObjectId("507F1F77BCF86CD799439011")).toBe(true);
    });

    it("should reject invalid ObjectIds", () => {
      expect(isValidObjectId("123")).toBe(false);
      expect(isValidObjectId("not-a-valid-id")).toBe(false);
      expect(isValidObjectId("507f1f77bcf86cd79943901")).toBe(false); // 23 chars
    });
  });
});
