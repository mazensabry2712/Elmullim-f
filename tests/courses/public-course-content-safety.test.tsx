import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import CourseContent from "@/components/courses/CourseContent";
import { getCoursesCopy } from "@/pages/courses/courseCopy";

const mocks = vi.hoisted(() => ({
  useGetCourseContents: vi.fn(),
  useGetCourseLectures: vi.fn(),
}));

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourseContents: (...args: unknown[]) => mocks.useGetCourseContents(...args),
  useGetCourseLectures: (...args: unknown[]) => mocks.useGetCourseLectures(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "" },
}));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: { auth: { isAuthenticated: boolean } }) => unknown) =>
    selector({ auth: { isAuthenticated: false } }),
}));

vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

describe("Public course content text safety", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    mocks.useGetCourseContents.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: [
          {
            id: 29,
            title: "Request failed with status code 500",
            description: "Request failed with status code 500",
          },
          {
            id: 30,
            title: "Unit one",
            description: "Core concepts",
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    mocks.useGetCourseLectures.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  it("hides technical error messages but preserves readable course content", () => {
    render(
      <MemoryRouter>
        <I18nProvider>
          <CourseContent courseId={13} hasEnrolled={false} copy={getCoursesCopy("en")} />
        </I18nProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Content title under review")).toBeInTheDocument();
    expect(screen.queryByText("Request failed with status code 500")).not.toBeInTheDocument();
    expect(screen.getByText("Unit one")).toBeInTheDocument();
    expect(screen.getByText("Core concepts")).toBeInTheDocument();
  });
});
