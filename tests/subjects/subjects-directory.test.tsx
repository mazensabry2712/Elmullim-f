import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import SubjectsDirectory from "@/pages/subjects/SubjectsDirectory";

const queryState = vi.hoisted(() => ({
  data: { data: { subjects: [
    { id: 7, name: "Mathematics", education_level_id: 3, education_level_name: "Primary", image: null, visibility_mode: "core", is_core: true, published_lessons_count: 0 },
  ], pagination: { current_page: 1, last_page: 2, per_page: 24, total: 25 } } },
  isPending: false, isError: false, refetch: vi.fn(),
}));
vi.mock("@tanstack/react-query", () => ({ useQuery: () => queryState }));
vi.mock("@/services/main", () => ({ getPublicSubjects: vi.fn() }));
vi.mock("@/components/Newsletter", () => ({ default: () => <div data-testid="newsletter" /> }));
vi.mock("@/components/home/categories/SubjectCard", () => ({
  default: ({ subject }: { subject: { id: number; name: string } }) => <a href={`/lessons?subject_id=${subject.id}`}>{subject.name}</a>,
}));

describe("Subjects directory", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    queryState.isPending = false;
    queryState.isError = false;
  });

  it("shows public subjects and pagination", () => {
    render(<MemoryRouter initialEntries={["/subjects"]}><I18nProvider><SubjectsDirectory /></I18nProvider></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1, name: "All Subjects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mathematics" })).toHaveAttribute("href", "/lessons?subject_id=7");
    expect(screen.getByText("25 subjects")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Subject catalog pagination" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });
});
