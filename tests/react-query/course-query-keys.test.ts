import { beforeEach, describe, expect, it, vi } from "vitest";

const useQueryMock = vi.hoisted(() => vi.fn((options: unknown) => options));

vi.mock("@tanstack/react-query", () => ({
  useQuery: useQueryMock,
}));

import QueryKeys from "@/enums";
import { useGetCourseLectures, useGetCourses } from "@/lib/react-query/courses/courses";

describe("course query keys", () => {
  beforeEach(() => {
    useQueryMock.mockClear();
  });

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

  it("uses the lecture query key that enrollment invalidates", () => {
    useGetCourseLectures({
      token: "student-token",
      courseId: 10,
      contentId: 26,
    });

    const options = useQueryMock.mock.calls[0]?.[0] as {
      queryKey: unknown;
    };

    expect(options.queryKey).toEqual([QueryKeys.COURSE_LECTURES, 10, 26]);
  });
});
