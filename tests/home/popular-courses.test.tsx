import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import PopularCourses from "@/components/home/PopularCourses";
import { I18nProvider } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/home/courses/CoursesList", () => ({
  default: ({ courses }: { courses: unknown[] }) => <div data-testid="courses-count">{courses.length}</div>,
}));

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourses: () => ({ data: { data: [] }, isLoading: false }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => null },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = require("@/i18n") as typeof import("@/i18n");
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};

describe("Home popular courses", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders the English content and courses link", () => {
    render(
      <I18nProvider>
        <PopularCourses />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { name: /buy these courses too and join/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All Courses" })).toHaveAttribute("href", "/courses");
    expect(screen.getByTestId("courses-count")).toHaveTextContent("0");
  });

  it("switches to Arabic and RTL", async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <PopularCourses />
        <LanguageToggle />
      </I18nProvider>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /اشترِ هذه الكورسات أيضًا وانضم إلى/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "كل الكورسات" })).toHaveAttribute("href", "/courses");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
