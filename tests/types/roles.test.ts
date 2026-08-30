import { expectTypeOf, describe, it } from "vitest";
import type { TRole } from "@/types";

describe("TRole contract", () => {
  it("supports the roles used by the application", () => {
    expectTypeOf<TRole>().toEqualTypeOf<
      "parent" | "student" | "teacher"
    >();
  });
});
