import { describe, expect, it, vi } from "vitest";

const useQueryMock = vi.hoisted(() => vi.fn((options: unknown) => options));

vi.mock("@tanstack/react-query", () => ({
  useQuery: useQueryMock,
}));

import { useGetCourses } from "@/lib/react-query/courses/courses";

describe("useGetCourses", () => {
  it("keeps the authentication token out of the query key", () => {
    useGetCourses({
      token: "secret-token",
      q: "math",
    });

    const options = useQueryMock.mock.calls[0]?.[0] as {
      queryKey: unknown;
    };

    expect(options.queryKey).toEqual(["courses", "math"]);
    expect(JSON.stringify(options.queryKey)).not.toContain("secret-token");
  });
});
