import { beforeEach, describe, expect, it, vi } from "vitest";

const useQueryMock = vi.hoisted(() => vi.fn((options: unknown) => options));

vi.mock("@tanstack/react-query", () => ({
  useQuery: useQueryMock,
  useMutation: vi.fn(),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: {
    auth: { sessionVersion: number; isAuthenticated: boolean; role: string | null };
  }) => unknown) =>
    selector({
      auth: {
        sessionVersion: 12,
        isAuthenticated: true,
        role: "teacher",
      },
    }),
}));

import QueryKeys from "@/enums";
import {
  useGetTeacherCourses,
  useGetTeacherCourseQuiz,
} from "@/lib/react-query/teacher/courses";

describe("teacher course query keys", () => {
  beforeEach(() => {
    useQueryMock.mockClear();
  });

  it("isolates the teacher course list by active login session without storing the token", () => {
    useGetTeacherCourses("secret-teacher-token");

    const options = useQueryMock.mock.calls[0]?.[0] as {
      queryKey: unknown[];
    };

    expect(options.queryKey).toEqual([QueryKeys.TEACHER_COURSES, "12:teacher"]);
    expect(JSON.stringify(options.queryKey)).not.toContain("secret-teacher-token");
  });

  it("isolates nested course quiz data by active teacher session", () => {
    useGetTeacherCourseQuiz({
      token: "secret-teacher-token",
      courseId: "7",
      contentId: "11",
      lectureId: "21",
    });

    const options = useQueryMock.mock.calls[0]?.[0] as {
      queryKey: unknown[];
    };

    expect(options.queryKey).toEqual([
      QueryKeys.TEACHER_COURSE_QUIZ,
      "7",
      "11",
      "21",
      "12:teacher",
    ]);
    expect(JSON.stringify(options.queryKey)).not.toContain("secret-teacher-token");
  });
});
