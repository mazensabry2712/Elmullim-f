import { describe, expect, it, vi } from "vitest";

const useQueryMock = vi.hoisted(() => vi.fn((options: unknown) => options));

vi.mock("@tanstack/react-query", () => ({
  useQuery: useQueryMock,
}));

import { useGetLessons } from "@/lib/react-query/lessons/lessons";

describe("useGetLessons", () => {
  it("keeps the authentication token out of the query key", () => {
    useGetLessons({
      token: "secret-token",
      q: "math",
      booking_type: "private",
      education_level_id: 3,
    });

    const options = useQueryMock.mock.calls[0]?.[0] as {
      queryKey: unknown;
    };

    expect(options.queryKey).toEqual([
      "lessons",
      {
        q: "math",
        booking_type: "private",
        education_level_id: 3,
      },
    ]);
    expect(JSON.stringify(options.queryKey)).not.toContain("secret-token");
  });
});
