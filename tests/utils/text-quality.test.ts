import { describe, expect, it } from "vitest";
import { hasMinimumWords, hasRepeatedTextPattern, isDisplayableProfileText } from "@/utils/textQuality";

describe("text quality safeguards", () => {
  it("detects repetitive placeholder strings", () => {
    expect(hasRepeatedTextPattern("gfdgdfdfgfdgfdgdfgf")).toBe(true);
    expect(hasRepeatedTextPattern("fdfdgfdgfdgfdgfdgfdgfdgdfgfdgfdgfdgfdgfd")).toBe(true);
    expect(hasRepeatedTextPattern("قثبقثبثقبقثبقثبقثب")).toBe(true);
    expect(hasRepeatedTextPattern("ؤؤصيؤصؤسيؤسصؤسصثبؤسصثي")).toBe(true);
  });
  it("keeps ordinary subject names and sentences", () => {
    expect(hasRepeatedTextPattern("Mathematics")).toBe(false);
    expect(hasRepeatedTextPattern("الرياضيات")).toBe(false);
    expect(hasRepeatedTextPattern("A qualified teacher with classroom experience")).toBe(false);
  });
  it("requires complete profile descriptions", () => {
    expect(hasMinimumWords("Experienced teacher with a patient teaching style", 3)).toBe(true);
    expect(isDisplayableProfileText("fdfdgfdgfdgfdgfdgfdgfdgdfgfdgfdgfdgfdgfd", 3)).toBe(false);
    expect(isDisplayableProfileText("Experienced teacher with classroom experience", 3)).toBe(true);
  });
});
