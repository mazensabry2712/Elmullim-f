import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import PopularLessons from "@/components/home/PopularLesson";
import { I18nProvider, useI18n } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/home/lessons/LessonsList", () => ({
  default: () => <p>No lessons found</p>,
}));

vi.mock("@/lib/react-query/lessons/lessons", () => ({
  useGetLessons: () => ({ data: { data: [] }, isLoading: false }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => null },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};

const renderPopularLessons = () =>
  render(
    <MemoryRouter>
      <I18nProvider>
        <PopularLessons />
      </I18nProvider>
    </MemoryRouter>
  );

describe("Home popular lessons", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders the English content and lessons link", () => {
    renderPopularLessons();

    expect(screen.getByRole("heading", { name: /buy these lessons too and join/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All Lessons" })).toHaveAttribute("href", "/lessons");
    expect(screen.getByText("No lessons found")).toBeInTheDocument();
  });

  it("switches to Arabic and RTL", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <I18nProvider>
          <PopularLessons />
          <LanguageToggle />
        </I18nProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /اشترِ هذه الدروس أيضًا وانضم إلى/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "كل الدروس" })).toHaveAttribute("href", "/lessons");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
