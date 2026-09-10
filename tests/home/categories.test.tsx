import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import React from "react";
import Categories from "@/components/home/categories/Categories";
import { I18nProvider } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/home/categories/CategoryCard", () => ({
  default: ({ title }: { title: string }) => <article>{title}</article>,
}));

const renderCategories = () =>
  render(
    <I18nProvider>
      <Categories />
    </I18nProvider>
  );

describe("Home categories", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders the categories section with all configured categories", () => {
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
      expect(screen.getByText(category)).toBeInTheDocument();
    }
  });
});
