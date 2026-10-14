import { beforeEach, describe, expect, it, vi } from "vitest";

const useMutationMock = vi.hoisted(() => vi.fn((options: unknown) => options));
const queryClientMock = vi.hoisted(() => ({
  invalidateQueries: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: useMutationMock,
  useQuery: vi.fn(),
  useQueryClient: () => queryClientMock,
}));

import QueryKeys from "@/enums";
import { useUpdateTeacherCourseContent } from "@/lib/react-query/teacher/courses";

describe("teacher course structure cache invalidation", () => {
  beforeEach(() => {
    useMutationMock.mockClear();
    queryClientMock.invalidateQueries.mockClear();
    queryClientMock.invalidateQueries.mockResolvedValue(undefined);
  });

  it("refreshes content details, lecture lists, and quiz data after content edits", async () => {
    useUpdateTeacherCourseContent();

    const options = useMutationMock.mock.calls[0]?.[0] as {
      onSuccess: (
        data: unknown,
        variables: {
          token: string;
          content: {
            id: string;
            courseId: string;
            title: string;
            description: string;
          };
        },
      ) => Promise<unknown[]>;
    };

    await options.onSuccess(
      { status: true },
      {
        token: "test-token",
        content: {
          id: "12",
          courseId: "7",
          title: "Updated unit",
          description: "Updated content description",
        },
      },
    );

    const invalidatedKeys = queryClientMock.invalidateQueries.mock.calls.map(
      ([query]) => (query as { queryKey: unknown[] }).queryKey,
    );

    expect(invalidatedKeys).toContainEqual([
      QueryKeys.TEACHER_COURSE_CONTENTS,
      "7",
    ]);
    expect(invalidatedKeys).toContainEqual([
      QueryKeys.TEACHER_COURSE_CONTENT,
    ]);
    expect(invalidatedKeys).toContainEqual([
      QueryKeys.TEACHER_COURSE_LECTURES,
    ]);
    expect(invalidatedKeys).toContainEqual([
      QueryKeys.TEACHER_COURSE_QUIZ,
      "7",
    ]);
  });
});
