import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import ViewCourseContent from "@/components/courses/ViewCourseContent";

const mockUseGetCourseContents = vi.fn();
const mockUseGetCourseLectures = vi.fn();

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourseContents: (...args: unknown[]) => mockUseGetCourseContents(...args),
  useGetCourseLectures: (...args: unknown[]) => mockUseGetCourseLectures(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "student-token" },
}));

vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionTrigger: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

describe("Student course content integration", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    mockUseGetCourseContents.mockReturnValue({
      data: {
        data: [{ id: 11, title: "Unit 1", description: "Core concepts" }],
      },
      isLoading: false,
    });

    mockUseGetCourseLectures.mockImplementation(
      ({ contentId }: { contentId?: number }) => ({
        data:
          contentId === 11
            ? {
                data: [
                  {
                    id: 21,
                    title: "Introduction",
                    description: "First lecture",
                    duration: null,
                    videoUrl: "https://video.example/intro",
                    hasVideo: true,
                    quiz: {
                      id: 91,
                      title: "Unit review",
                      time_limit: 15,
                      total_score: 5,
                      questions_count: 2,
                    },
                  },
                ],
              }
            : undefined,
        isLoading: false,
      })
    );
  });

  it("connects an enrolled lecture to its course quiz and preserves a return path", async () => {
    render(
      <MemoryRouter>
        <I18nProvider>
          <ViewCourseContent courseId={7} />
        </I18nProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Unit 1" }));

    const quizLink = await screen.findByRole("link", { name: /Unit review.*Take quiz/i });
    expect(quizLink).toHaveAttribute("href", "/view-quiz?quiz=91&course=7");

    await waitFor(() => {
      expect(mockUseGetCourseLectures).toHaveBeenCalledWith(
        expect.objectContaining({ courseId: 7, contentId: 11, token: "student-token" })
      );
    });
  });
});
