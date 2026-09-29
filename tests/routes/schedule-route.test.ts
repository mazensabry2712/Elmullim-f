import { describe, expect, it } from "vitest";
import { routes } from "@/routes";

describe("Schedule route", () => {
  it("restricts the shared schedule page to supported user roles", () => {
    const rootRoute = routes.find((route) => route.id === "root-layout");
    const scheduleRoute = rootRoute?.children?.find(
      (route) => route.id === "schedule"
    );

    expect(scheduleRoute).toBeDefined();
    const protectedElement = scheduleRoute?.element as {
      props?: { requiredRole?: string[] };
    };

    expect(protectedElement.props?.requiredRole).toEqual([
      "student",
      "parent",
      "teacher",
    ]);
  });
});
