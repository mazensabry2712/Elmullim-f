import { beforeEach, describe, expect, it, vi } from "vitest";

const useQueryMock = vi.hoisted(() => vi.fn((options: unknown) => options));

vi.mock("@tanstack/react-query", () => ({
  useQuery: useQueryMock,
}));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: {
    auth: { sessionVersion: number; isAuthenticated: boolean; role: string | null };
  }) => unknown) =>
    selector({
      auth: {
        sessionVersion: 7,
        isAuthenticated: true,
        role: "student",
      },
    }),
}));

import {
  useGetCourses,
  useGetCourseLectures,
} from "@/lib/react-query/courses/courses";
import { useGetStudentQuiz } from "@/lib/react-query/student/quizzes";

describe("course query keys", () => {
  beforeEach(() => {
    useQueryMock.mockClear();
  });

  it("keeps bearer tokens out of the key and scopes user-dependent listing data to the active session", () => {
    useGetCourses({
      token: "secret-token",
      q: "math",
    });

    const options = useQueryMock.mock.calls[0]?.[0] as {
      queryKey: unknown[];
    };

    expect(options.queryKey).toEqual(["courses", "math", "7:student"]);
    expect(JSON.stringify(options.queryKey)).not.toContain("secret-token");
  });

  it("scopes student quiz details to the active session without storing the token", () => {
    useGetStudentQuiz({ token: "secret-token", quizId: 91 });

    const options = useQueryMock.mock.calls[0]?.[0] as {
      queryKey: unknown[];
    };

    expect(options.queryKey).toEqual(["studentQuiz", 91, "7:student"]);
    expect(JSON.stringify(options.queryKey)).not.toContain("secret-token");
  });

  it("uses the dedicated lecture key and keeps the token out of the query key", () => {
    useGetCourseLectures({
      token: "secret-token",
      courseId: 12,
      contentId: 34,
    });

    const options = useQueryMock.mock.calls[0]?.[0] as {
      queryKey: unknown[];
    };

    expect(options.queryKey).toEqual(["courseLectures", 12, 34, "7:student"]);
    expect(JSON.stringify(options.queryKey)).not.toContain("secret-token");
  });
});
