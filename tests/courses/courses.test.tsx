import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Courses from "@/pages/courses/Courses";
import { I18nProvider, useI18n } from "@/i18n";

const mockRefetch = vi.fn();
const mockUseGetCourses = vi.fn();

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourses: (...args: unknown[]) => mockUseGetCourses(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => undefined),
  },
}));

vi.mock("@/components/courses/CoursesList", () => ({
  default: ({ courses, copy }: { courses: Array<{ title: string }>; copy: { empty: string } }) =>
    courses.length ? (
      <div data-testid="courses-list">{courses.map((course) => <span key={course.title}>{course.title}</span>)}</div>
    ) : (
      <p>{copy.empty}</p>
    ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};

const renderPage = (children: React.ReactNode) =>
  render(
    <MemoryRouter>
      <I18nProvider>{children}</I18nProvider>
    </MemoryRouter>
  );

describe("Courses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders API courses and an accessible search field", () => {
    mockUseGetCourses.mockReturnValue({
      data: { data: [{ id: 1, title: "Physics Fundamentals" }] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderPage(<Courses />);

    expect(screen.getByRole("heading", { name: /courses/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /search courses/i })).toBeInTheDocument();
    expect(screen.getByTestId("courses-list")).toHaveTextContent("Physics Fundamentals");
  });

  it("renders a retryable error state", async () => {
    const user = userEvent.setup();
    mockUseGetCourses.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
    });

    renderPage(<Courses />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("supports Arabic and RTL", async () => {
    const user = userEvent.setup();
    mockUseGetCourses.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    renderPage(
      <>
        <Courses />
        <LanguageToggle />
      </>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /الكورسات/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/لم يتم العثور على كورسات/i)).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
