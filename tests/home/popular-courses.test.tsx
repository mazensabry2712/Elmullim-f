import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import PopularCourses from "@/components/home/PopularCourses";
import { I18nProvider, useI18n } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourses: () => ({ data: { data: [] }, isLoading: false, isError: false, refetch: vi.fn() }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => null, getRole: () => undefined },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return (
    <button type="button" onClick={toggleLanguage}>
      toggle
    </button>
  );
};

const renderPopularCourses = (withToggle = false) =>
  render(
    <MemoryRouter>
      <I18nProvider>
        <PopularCourses />
        {withToggle && <LanguageToggle />}
      </I18nProvider>
    </MemoryRouter>
  );

describe("Home courses discovery", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders the English content, truthful empty state, and courses link", () => {
    renderPopularCourses();

    expect(
      screen.getByRole("heading", {
        name: /browse available courses and find/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("No courses are available right now.");
    expect(screen.getByRole("link", { name: "All Courses" })).toHaveAttribute(
      "href",
      "/courses"
    );
  });

  it("switches to Arabic and RTL", async () => {
    const user = userEvent.setup();
    renderPopularCourses(true);

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(
      screen.getByRole("heading", {
        name: /تصفح الكورسات المتاحة وابحث عن/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("لا توجد كورسات متاحة حاليًا.");
    expect(screen.getByRole("link", { name: "كل الكورسات" })).toHaveAttribute(
      "href",
      "/courses"
    );
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
