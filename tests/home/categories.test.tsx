import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";
import React from "react";
import Categories from "@/components/home/categories/Categories";
import { I18nProvider, useI18n } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/home/categories/CategoryCard", () => ({
  default: ({ title, searchTerm = title }: { title: string; searchTerm?: string }) => (
    <a href={`/courses?q=${encodeURIComponent(searchTerm)}`}>{title}</a>
  ),
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();

  return (
    <button type="button" onClick={toggleLanguage}>
      toggle
    </button>
  );
};

const renderCategories = () =>
  render(
    <I18nProvider>
      <LanguageToggle />
      <Categories />
    </I18nProvider>
  );

describe("Home categories", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders all configured categories in English and links them to course search", () => {
    renderCategories();

    expect(
      screen.getByRole("heading", { name: /browse by categories/i })
    ).toBeInTheDocument();

    for (const category of [
      "Physics",
      "Maths",
      "Languages",
      "History",
      "Geography",
      "Chemistry",
      "Biology",
      "Philosophy and Logic",
    ]) {
      expect(screen.getByRole("link", { name: category })).toHaveAttribute(
        "href",
        `/courses?q=${encodeURIComponent(category)}`
      );
    }
  });

  it("switches category content to Arabic with RTL direction", async () => {
    const user = userEvent.setup();
    renderCategories();

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(
      screen.getByRole("heading", { name: /تصفح حسب التصنيفات/i })
    ).toBeInTheDocument();

    for (const category of [
      "الفيزياء",
      "الرياضيات",
      "اللغات",
      "التاريخ",
      "الجغرافيا",
      "الكيمياء",
      "الأحياء",
      "الفلسفة والمنطق",
    ]) {
      expect(screen.getByText(category)).toBeInTheDocument();
    }

    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
