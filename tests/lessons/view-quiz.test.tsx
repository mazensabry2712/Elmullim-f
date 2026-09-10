import { act, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ViewQuiz from "@/components/profiles/student/quizes/ViewQuiz";
import { I18nProvider, useI18n } from "@/i18n";

const mockUseGetStudentQuiz = vi.fn();

vi.mock("@/lib/react-query/student/quizzes", () => ({
  useGetStudentQuiz: (...args: unknown[]) => mockUseGetStudentQuiz(...args),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: vi.fn(() => "token"),
  },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};

describe("ViewQuiz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  const renderPage = (children: React.ReactNode, path = "/view-quiz?quiz=7") =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <I18nProvider>{children}</I18nProvider>
      </MemoryRouter>
    );

  it("does not show fake quiz data or answer inputs when the backend quiz cannot be loaded", () => {
    mockUseGetStudentQuiz.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    renderPage(<ViewQuiz />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to quiz schedule/i })).toHaveAttribute("href", "/profile");
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/enter your name/i)).not.toBeInTheDocument();
  });

  it("supports Arabic and RTL with backend quiz data", async () => {
    mockUseGetStudentQuiz.mockReturnValue({
      data: {
        data: {
          quiz: {
            title: "اختبار الرياضيات",
            subject: { name: "الرياضيات" },
            teacher: { name: "المعلم" },
            date: "2026-09-10",
            start_time: "10:00",
            end_time: "10:30",
            time_limit: 30,
            total_score: 10,
          },
          questions: [],
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage(
      <>
        <ViewQuiz />
        <LanguageToggle />
      </>
    );

    await act(async () => {
      screen.getByRole("button", { name: "toggle" }).click();
    });

    expect(screen.getByRole("heading", { name: "اختبار الرياضيات", level: 1 })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
