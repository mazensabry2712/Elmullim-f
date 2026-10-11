import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import TeachersDirectory from "@/pages/teachers/TeachersDirectory";

const queryState = vi.hoisted(() => ({
  data: {
    data: {
      teachers: Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        name: `Directory Teacher ${index + 1}`,
        profile_image: "",
        description: "Public profile",
        rating: 0,
        rating_count: 0,
        lessons_count: 0,
        subjects: [{ id: index + 1, name: "Math" }],
      })),
      pagination: {
        current_page: 1,
        last_page: 2,
        per_page: 12,
        total: 13,
      },
    },
  },
  isPending: false,
  isError: false,
  refetch: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => queryState,
}));

vi.mock("@/services/main", () => ({
  getPublicTeacherDirectory: vi.fn(),
}));

vi.mock("@/components/Newsletter", () => ({
  default: () => <div data-testid="newsletter" />,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    article: ({ children }: { children?: React.ReactNode }) => <article>{children}</article>,
  },
}));

describe("Teachers directory", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    queryState.isPending = false;
    queryState.isError = false;
    queryState.refetch = vi.fn();
    window.scrollTo = vi.fn();
  });

  it("lists all directory results page-by-page and shows pagination", () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/teachers"]}>
          <TeachersDirectory />
        </MemoryRouter>
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Teachers" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(12);
    expect(screen.getByText("13 teachers")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Teacher directory pagination" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("shows a retryable error when the directory cannot load", () => {
    queryState.isError = true;

    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/teachers"]}>
          <TeachersDirectory />
        </MemoryRouter>
      </I18nProvider>
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Teachers are unavailable right now. Please try again."
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});
