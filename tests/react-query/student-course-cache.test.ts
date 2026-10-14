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

vi.mock("@/services/student/enrolling", () => ({
  enrollFreeCourse: vi.fn(),
  getMyCourses: vi.fn(),
  initiatePayment: vi.fn(),
  validatePromoCode: vi.fn(),
}));

import QueryKeys from "@/enums";
import { useEnrollFreeCourse } from "@/lib/react-query/student/enrolling";

describe("student course access cache invalidation", () => {
  beforeEach(() => {
    useMutationMock.mockClear();
    queryClientMock.invalidateQueries.mockClear();
    queryClientMock.invalidateQueries.mockResolvedValue(undefined);
  });

  it("refreshes enrolled courses, public cards, details, lectures, and related course cards after enrollment", async () => {
    useEnrollFreeCourse();

    const options = useMutationMock.mock.calls[0]?.[0] as {
      onSuccess: (
        data: unknown,
        variables: { token: string; courseId: number },
      ) => Promise<unknown[]>;
    };

    await options.onSuccess(
      { status: true },
      { token: "test-token", courseId: 7 },
    );

    const invalidatedKeys = queryClientMock.invalidateQueries.mock.calls.map(
      ([query]) => (query as { queryKey: unknown[] }).queryKey,
    );

    expect(invalidatedKeys).toContainEqual([QueryKeys.MY_COURSES]);
    expect(invalidatedKeys).toContainEqual([QueryKeys.COURSES]);
    expect(invalidatedKeys).toContainEqual([QueryKeys.SUB_CATEGORY_COURSES]);
    expect(invalidatedKeys).toContainEqual([QueryKeys.COURSE, 7]);
    expect(invalidatedKeys).toContainEqual([QueryKeys.COURSE_LECTURES, 7]);
  });
});
