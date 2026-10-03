import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import TeacherLessons from "@/components/profiles/teacher/TeacherLessons";

const mockUseGetTeacherLessons = vi.fn();

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: vi.fn(() => "teacher-token") },
}));

vi.mock("@/lib/react-query/teacher/lessons", () => ({
  useGetTeacherLessons: (...args: unknown[]) => mockUseGetTeacherLessons(...args),
}));

vi.mock("@/components/profiles/teacher/lessons/TeacherLessonCard", () => ({
  default: ({ lesson }: { lesson: { title: string } }) => <article>{lesson.title}</article>,
}));

vi.mock("@/animations", () => ({
  containerVariants: {},
  itemVariants: {},
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

describe("TeacherLessons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    mockUseGetTeacherLessons.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: [
          {
            id: 1,
            title: "Algebra Private",
            description: "Private lesson",
            price: "100",
            grade: "Grade 10",
            delivery_mode: "online",
            booking_type: "private",
            publishing_status: "published",
            subject_id: 10,
            subject_name: "Mathematics",
            education_level_id: 5,
            education_level_name: "Secondary",
          },
          {
            id: 2,
            title: "Physics Group",
            description: "Group lesson",
            price: "150",
            grade: "Grade 11",
            delivery_mode: "offline",
            booking_type: "group",
            publishing_status: "unpublished",
            subject_id: 11,
            subject_name: "Physics",
            education_level_id: 5,
            education_level_name: "Secondary",
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <I18nProvider>
          <TeacherLessons />
        </I18nProvider>
      </MemoryRouter>,
    );

  it("shows all lesson statuses and filters by delivery and booking type", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText("Algebra Private")).toBeInTheDocument();
    expect(screen.getByText("Physics Group")).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: "Delivery" }), "offline");
    expect(screen.queryByText("Algebra Private")).not.toBeInTheDocument();
    expect(screen.getByText("Physics Group")).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: "Booking type" }), "group");
    expect(screen.getByText("Physics Group")).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: "Filter status" }), "unpublished");
    expect(screen.getByText("Physics Group")).toBeInTheDocument();
  });

  it("filters by subject and education stage", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByRole("combobox", { name: "Subject" }), "11");
    expect(screen.queryByText("Algebra Private")).not.toBeInTheDocument();
    expect(screen.getByText("Physics Group")).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: "Education stage" }), "5");
    expect(screen.getByText("Physics Group")).toBeInTheDocument();
  });
});
