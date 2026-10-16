import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import UpdateCourse from "@/components/profiles/teacher/courses/UpdateCourse";

const mocks = vi.hoisted(() => ({
  useGetTeacherCourseById: vi.fn(),
  toastError: vi.fn(),
  toastInfo: vi.fn(),
}));

vi.mock("@/lib/react-query/teacher/courses", () => ({
  useGetTeacherCourseById: (...args: unknown[]) =>
    mocks.useGetTeacherCourseById(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "teacher-test-token" },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: mocks.toastError,
    info: mocks.toastInfo,
  },
}));

vi.mock("@/components/forms/teacher/CourseForm", () => ({
  default: ({
    action,
    course,
  }: {
    action: string;
    course: { title: string };
  }) => <div data-testid="course-form">{action}: {course.title}</div>,
}));

const course = {
  id: 10,
  title: "Physics Fundamentals",
  description: "A clear course description with enough meaningful words.",
  image: "/course-image.jpg",
  level: "beginner",
  price: "150",
  sub_category: {
    id: 5,
    name: "Physics",
    category: { id: 2, name: "Science" },
  },
  teacher: { id: 1, name: "Teacher One" },
  publishing_status: "draft",
  publishing_note: null,
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
  hasEnrolled: null,
};

const renderRoute = (id = "10") =>
  render(
    <MemoryRouter initialEntries={[`/profile/my-courses/${id}/update`]}>
      <I18nProvider>
        <Routes>
          <Route
            path="/profile/my-courses/:courseId/update"
            element={<UpdateCourse />}
          />
          <Route
            path="/profile/my-courses/:courseId/view"
            element={<div>Course management destination</div>}
          />
          <Route path="/profile" element={<div>My Courses destination</div>} />
        </Routes>
      </I18nProvider>
    </MemoryRouter>
  );

const mockCourseResponse = (status: string) =>
  mocks.useGetTeacherCourseById.mockReturnValue({
    data: {
      status: true,
      message: null,
      data: { ...course, publishing_status: status },
    },
    isLoading: false,
    isError: false,
  });

describe("UpdateCourse route guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it.each(["draft", "rejected", "published"])(
    "allows editing a %s course",
    async (status) => {
      mockCourseResponse(status);
      renderRoute();

      expect(await screen.findByTestId("course-form")).toHaveTextContent(
        "update: Physics Fundamentals"
      );
      expect(mocks.useGetTeacherCourseById).toHaveBeenCalledWith({
        token: "teacher-test-token",
        id: "10",
        enabled: true,
      });
    }
  );

  it("redirects a course that is pending admin review", async () => {
    mockCourseResponse("pending_approval");
    renderRoute();

    expect(await screen.findByText("Course management destination")).toBeInTheDocument();
    expect(screen.queryByTestId("course-form")).not.toBeInTheDocument();
    expect(mocks.toastInfo).toHaveBeenCalledWith("Courses cannot be edited while under review.");
  });

  it("rejects an invalid course ID instead of rendering an empty form", async () => {
    mocks.useGetTeacherCourseById.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    renderRoute("not-a-course-id");

    expect(await screen.findByText("My Courses destination")).toBeInTheDocument();
    expect(screen.queryByTestId("course-form")).not.toBeInTheDocument();
    expect(mocks.useGetTeacherCourseById).toHaveBeenCalledWith({
      token: "teacher-test-token",
      id: "",
      enabled: false,
    });
  });

  it("returns to My Courses when loading the course fails", async () => {
    mocks.useGetTeacherCourseById.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderRoute();

    expect(await screen.findByText("My Courses destination")).toBeInTheDocument();
    expect(mocks.toastError).toHaveBeenCalledWith("Unable to load the course");
    expect(screen.queryByTestId("course-form")).not.toBeInTheDocument();
  });
});
