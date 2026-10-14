import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n";
import { MemoryRouter } from "react-router-dom";
import ViewCourseContent from "@/components/courses/ViewCourseContent";

const mocks = vi.hoisted(() => ({
  useGetCourseContents: vi.fn(),
  useGetCourseLectures: vi.fn(),
  getToken: vi.fn(() => "student-token"),
}));

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourseContents: (...args: unknown[]) => mocks.useGetCourseContents(...args),
  useGetCourseLectures: (...args: unknown[]) => mocks.useGetCourseLectures(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: mocks.getToken },
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

describe("ViewCourseContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    mocks.useGetCourseContents.mockReturnValue({
      data: {
        data: [
          { id: 11, title: "Unit 1", description: "Foundations" },
          { id: 12, title: "Unit 2", description: "Advanced topics" },
        ],
      },
      isLoading: false,
    });

    mocks.useGetCourseLectures.mockImplementation(
      (args: { contentId?: number }) => ({
        data: {
          data: args.contentId === 12
            ? [{
                id: 22,
                title: "Advanced lecture",
                description: "Continue the course here.",
                videoUrl: "/advanced.mp4",
                quiz: null,
              }]
            : [],
        },
        isLoading: false,
      })
    );
  });

  it("opens the URL-selected unit and loads its lectures after a quiz return or refresh", async () => {
    render(
      <MemoryRouter initialEntries={["/courses/7/view?content=12&lecture=22"]}>
        <I18nProvider>
          <ViewCourseContent courseId={7} />
        </I18nProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /unit 2/i }).getAttribute("data-state")
      ).toBe("open");
    });

    expect(mocks.useGetCourseLectures).toHaveBeenCalledWith(
      expect.objectContaining({
        token: "student-token",
        courseId: 7,
        contentId: 12,
      })
    );
    expect(await screen.findByText("Advanced lecture")).toBeInTheDocument();
  });
});
