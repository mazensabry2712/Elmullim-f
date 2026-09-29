import { describe, expect, it } from "vitest";
import { dateTimeLocalToIso, formatDateTime, formatDateTimeLocalInput } from "@/utils/dateTime";

describe("dateTime utilities", () => {
  it("formats a Date for datetime-local without converting it to UTC", () => {
    const value = new Date(2099, 0, 10, 18, 7);
    expect(formatDateTimeLocalInput(value)).toBe("2099-01-10T18:07");
  });

  it("converts a local datetime-local value to an ISO instant", () => {
    const value = "2099-01-10T18:07";
    expect(dateTimeLocalToIso(value)).toBe(new Date(value).toISOString());
  });

  it("returns an empty string for invalid display dates", () => {
    expect(formatDateTime("not-a-date")).toBe("");
  });
});
