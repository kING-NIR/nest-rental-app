import { fmt, fmtDate, fmtTime, priorityColor, statusColor, statusLabel } from "../utils/formatters";

describe("Formatter Utilities", () => {
  describe("fmt - Currency formatter", () => {
    it("formats numbers as currency", () => {
      expect(fmt(1000)).toBe("$1,000");
      expect(fmt(50000)).toBe("$50,000");
      expect(fmt(1234.56)).toBe("$1,235");
    });

    it("handles zero and negative numbers", () => {
      expect(fmt(0)).toBe("$0");
      expect(fmt(-500)).toBe("-$500");
    });

    it("handles very large numbers", () => {
      expect(fmt(1000000)).toBe("$1,000,000");
      expect(fmt(1500000)).toBe("$1,500,000");
    });
  });

  describe("fmtDate - Date formatter", () => {
    it("formats date correctly", () => {
      const date = new Date("2024-05-23");
      const formatted = fmtDate(date);
      expect(formatted).toContain("May");
      expect(formatted).toContain("23");
      expect(formatted).toContain("2024");
    });

    it("handles ISO string input", () => {
      const formatted = fmtDate("2024-05-23T10:00:00Z");
      expect(formatted).toContain("May");
    });

    it("handles invalid dates gracefully", () => {
      const formatted = fmtDate("invalid");
      expect(formatted).toBeDefined();
    });
  });

  describe("fmtTime - Time formatter", () => {
    it("formats time in 12-hour format", () => {
      expect(fmtTime("14:30")).toBe("2:30 PM");
      expect(fmtTime("09:15")).toBe("9:15 AM");
      expect(fmtTime("00:00")).toBe("12:00 AM");
      expect(fmtTime("12:00")).toBe("12:00 PM");
    });

    it("handles invalid time format", () => {
      const formatted = fmtTime("invalid");
      expect(formatted).toBeDefined();
    });
  });

  describe("priorityColor - Priority color mapping", () => {
    it("returns correct color for each priority", () => {
      const lowColor = priorityColor("low");
      const mediumColor = priorityColor("medium");
      const highColor = priorityColor("high");

      expect(lowColor).toBeDefined();
      expect(mediumColor).toBeDefined();
      expect(highColor).toBeDefined();
      expect(lowColor).not.toBe(mediumColor);
      expect(mediumColor).not.toBe(highColor);
    });
  });

  describe("statusColor - Status color mapping", () => {
    it("returns correct color for each status", () => {
      const pendingColor = statusColor("pending");
      const activeColor = statusColor("active");
      const completedColor = statusColor("completed");

      expect(pendingColor).toBeDefined();
      expect(activeColor).toBeDefined();
      expect(completedColor).toBeDefined();
    });
  });

  describe("statusLabel - Status label formatting", () => {
    it("returns readable status label", () => {
      expect(statusLabel("pending")).toBe("Pending");
      expect(statusLabel("active")).toBe("Active");
      expect(statusLabel("completed")).toBe("Completed");
    });

    it("capitalizes status", () => {
      const label = statusLabel("pending");
      expect(label[0]).toMatch(/[A-Z]/);
    });
  });
});
