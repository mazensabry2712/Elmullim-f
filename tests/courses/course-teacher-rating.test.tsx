import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n";
import CourseTeacherRating from "@/components/ratings/CourseTeacherRating";

const mockMutateAsync = vi.fn();
const mockRefetch = vi.fn();
let mockStatus: {
  status: boolean;
  message: string | null;
  data: {
    course_id: number;
    teacher_id: number;
    teacher_name: string;
    eligible: boolean;
    has_rated: boolean;
    rating: number | null;
    description: string | null;
  };
};

vi.mock("@/lib/react-query/courseTeacherRating", () => ({
  useCourseTeacherRatingStatus: () => ({
    data: mockStatus,
    refetch: mockRefetch,
    isLoading: false,
    isError: false,
  }),
  useSubmitCourseTeacherRating: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

describe("CourseTeacherRating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    mockStatus = {
      status: true,
      message: null,
      data: {
        course_id: 7,
        teacher_id: 3,
        teacher_name: "Teacher One",
        eligible: true,
        has_rated: false,
        rating: null,
        description: null,
      },
    };
    mockMutateAsync.mockResolvedValue({ status: true, message: null });
  });

  const renderPanel = () =>
    render(
      <I18nProvider>
        <CourseTeacherRating courseId={7} token="student-token" />
      </I18nProvider>,
    );

  it("lets an enrolled student rate the teacher with stars and a comment", async () => {
    renderPanel();

    fireEvent.click(screen.getByRole("radio", { name: "5 / 5 stars" }));
    fireEvent.change(screen.getByLabelText("Your feedback"), {
      target: { value: "Clear explanations and useful lessons." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit rating" }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        token: "student-token",
        courseId: 7,
        rate: 5,
        description: "Clear explanations and useful lessons.",
      });
    });
  });

  it("shows the saved rating instead of allowing a second submission", () => {
    mockStatus = {
      ...mockStatus,
      data: {
        ...mockStatus.data,
        has_rated: true,
        rating: 4,
        description: "Very clear lessons.",
      },
    };

    renderPanel();

    expect(screen.getByText("You have already rated this course.")).toBeInTheDocument();
    expect(screen.getByText("Very clear lessons.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Submit rating" })).not.toBeInTheDocument();
  });
});
