import { describe, expect, it } from "vitest";
import { getPageTitle } from "@/components/PageTitle";

describe("page titles", () => {
  it("uses the correct English titles for main routes", () => {
    expect(getPageTitle("/", "en")).toBe("Home");
    expect(getPageTitle("/about", "en")).toBe("About Us");
    expect(getPageTitle("/courses", "en")).toBe("Courses");
    expect(getPageTitle("/lessons", "en")).toBe("Lessons");
    expect(getPageTitle("/services", "en")).toBe("Services");
    expect(getPageTitle("/faqs", "en")).toBe("FAQs");
  });

  it("handles dynamic pages and Arabic titles", () => {
    expect(getPageTitle("/courses/123", "en")).toBe("Course Details");
    expect(getPageTitle("/courses/123/view", "en")).toBe("View Course");
    expect(getPageTitle("/lessons/456", "ar")).toBe("تفاصيل الدرس");
    expect(getPageTitle("/services/789", "ar")).toBe("تفاصيل الخدمة");
    expect(getPageTitle("/profile/my-courses/123/update", "ar")).toBe("تحديث الكورس");
    expect(getPageTitle("/parent/sign-in", "ar")).toBe("تسجيل دخول ولي الأمر");
    expect(getPageTitle("/teacher/sign-in", "ar")).toBe("تسجيل دخول المعلم");
  });

  it("falls back cleanly for unknown routes", () => {
    expect(getPageTitle("/does-not-exist", "en")).toBe("Page Not Found");
    expect(getPageTitle("/does-not-exist", "ar")).toBe("الصفحة غير موجودة");
  });
});
