import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CourseDetails from "@/pages/courses/CourseDetails";
import { I18nProvider } from "@/i18n";

const mockUseGetCourseById = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourseById: (...args: unknown[]) => mockUseGetCourseById(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => "token"),
    getRole: vi.fn(() => "student"),
  },
}));

vi.mock("@/store/store", () => ({
  useSelector: (selector: (state: { auth: { isAuthenticated: boolean } }) => unknown) =>
    selector({ auth: { isAuthenticated: true } }),
  RootState: {},
}));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: { auth: { isAuthenticated: boolean } }) => unknown) =>
    selector({ auth: { isAuthenticated: true } }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));

vi.mock("@/components/courses/CourseContent", () => ({
  default: () => <div>Course content</div>,
}));
vi.mock("@/components/courses/EnrollFreeCourse", () => ({
  default: () => <button>Enroll free</button>,
}));
vi.mock("@/components/courses/RelatedCourses", () => ({
  default: () => <div>Related courses</div>,
}));
vi.mock("@/components/shared/InstructorDetails", () => ({
  default: () => <div>Instructor</div>,
}));
vi.mock("@/components/Newsletter", () => ({
  default: () => <div>Newsletter</div>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.setItem("elmullim-language", "en");
  mockUseGetCourseById.mockReturnValue({
    data: {
      data: {
        id: 7,
        title: "Paid Course",
        description: "Paid course description",
        price: 150,
        hasEnrolled: false,
        teacher: { id: 3, name: "Teacher One" },
        sub_category: { id: 4 },
      },
    },
    isLoading: false,
    isError: false,
    failureReason: undefined,
    refetch: vi.fn(),
  });
});

describe("CourseDetails", () => {
  it("provides the payment/enrollment path for a paid course", () => {
    render(
      <MemoryRouter initialEntries={["/courses/7"]}>
        <I18nProvider>
          <Routes>
            <Route path="/courses/:courseId" element={<CourseDetails />} />
          </Routes>
        </I18nProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /enroll/i })).toHaveAttribute(
      "href",
      "/course/7/enroll"
    );
  });

  it("hides technical and repeated placeholder text from course details", () => {
    mockUseGetCourseById.mockReturnValue({
      data: {
        data: {
          id: 7,
          title: "Request failed with status code 500",
          description: "الحنكليس الحنكليس الحنكليس",
          price: 150,
          hasEnrolled: false,
          teacher: { id: 3, name: "Teacher One" },
          sub_category: { id: 4 },
        },
      },
      isLoading: false,
      isError: false,
      failureReason: undefined,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/courses/7"]}>
        <I18nProvider>
          <Routes>
            <Route path="/courses/:courseId" element={<CourseDetails />} />
          </Routes>
        </I18nProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Course title under review", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Description under review")).toBeInTheDocument();
    expect(screen.queryByText("Request failed with status code 500")).not.toBeInTheDocument();
    expect(screen.queryByText("الحنكليس الحنكليس الحنكليس")).not.toBeInTheDocument();
  });

});
