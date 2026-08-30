import { describe, expect, it } from "vitest";
import { routes } from "@/routes";

describe("Unauthorized route", () => {
  it("registers the route used by ProtectedRoute", () => {
    const unauthorizedRoute = routes.find(
      (route) => route.id === "unauthorized"
    );

    expect(unauthorizedRoute).toBeDefined();
    expect(unauthorizedRoute?.path).toBe("/unauthorized");
  });
});
