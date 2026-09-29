import { describe, expect, it } from "vitest";
import { routes } from "@/routes";

describe("Bookings route", () => {
  it("restricts the bookings page to student and parent roles", () => {
    const rootRoute = routes.find((route) => route.id === "root-layout");
    const bookingsRoute = rootRoute?.children?.find(
      (route) => route.id === "bookings"
    );

    expect(bookingsRoute).toBeDefined();
    expect(bookingsRoute?.path).toBe("/bookings");
    const protectedElement = bookingsRoute?.element as {
      props?: { requiredRole?: string[] };
    };

    expect(protectedElement.props?.requiredRole).toEqual(["student", "parent"]);
  });
});
