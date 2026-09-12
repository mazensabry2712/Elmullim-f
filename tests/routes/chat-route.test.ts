import { describe, expect, it } from "vitest";
import { routes } from "@/routes";

describe("Chat route", () => {
  it("registers the protected chat route", () => {
    const rootRoute = routes.find((route) => route.id === "root-layout");
    const chatRoute = rootRoute?.children?.find((route) => route.id === "chat");

    expect(chatRoute).toBeDefined();
    expect(chatRoute?.path).toBe("/chat");
  });
});
