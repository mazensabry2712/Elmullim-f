import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";
import React from "react";
import { MemoryRouter, Link } from "react-router-dom";
import Categories from "@/components/home/categories/Categories";
import { I18nProvider, useI18n } from "@/i18n";

const queryState = vi.hoisted(() => ({
  data: { data: { subjects: [
    { id: 11, name: "Mathematics", education_level_id: 3, education_level_name: "Primary", is_core: true, visibility_mode: "core", published_lessons_count: 0 },
    { id: 12, name: "Physics", education_level_id: 4, education_level_name: "Secondary", is_core: false, visibility_mode: "after_published_lesson", published_lessons_count: 2 },
  ], pagination: { current_page: 1, last_page: 1, per_page: 8, total: 2 } } },
  isPending: false, isError: false, refetch: vi.fn(),
}));
vi.mock("@tanstack/react-query", () => ({ useQuery: () => queryState }));
vi.mock("@/services/main", () => ({ getPublicSubjects: vi.fn() }));
vi.mock("@/components/ui/BadgeTitle", () => ({ default: ({ title }: { title: string }) => <div>{title}</div> }));
vi.mock("@/components/home/categories/SubjectCard", () => ({
  default: ({ subject }: { subject: { id: number; name: string } }) => <a href={`/lessons?subject_id=${subject.id}`}>{subject.name}</a>,
}));
vi.mock("framer-motion", () => ({ motion: { div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div> } }));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};
const renderCategories = () => render(<MemoryRouter><I18nProvider><LanguageToggle /><Categories /></I18nProvider></MemoryRouter>);

describe("Home subjects", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    queryState.isPending = false;
    queryState.isError = false;
    queryState.refetch = vi.fn();
  });

  it("renders the dynamic subject list and links to the full catalog", () => {
    renderCategories();
    expect(screen.getByRole("heading", { level: 2, name: /Explore school subjects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mathematics" })).toHaveAttribute("href", "/lessons?subject_id=11");
    expect(screen.getByRole("link", { name: "Physics" })).toHaveAttribute("href", "/lessons?subject_id=12");
    expect(screen.getByRole("link", { name: "Browse all subjects" })).toHaveAttribute("href", "/subjects");
  });

  it("shows a retry action when subjects fail to load", () => {
    queryState.isError = true;
    renderCategories();
    expect(screen.getByRole("alert")).toHaveTextContent("Subjects could not be loaded right now.");
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("switches the catalog link to Arabic", async () => {
    const user = userEvent.setup();
    renderCategories();
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByRole("heading", { level: 2, name: /اكتشف المواد الدراسية/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "تصفح المواد الدراسية كلها" })).toHaveAttribute("href", "/subjects");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
