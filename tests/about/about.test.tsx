import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import About from "@/pages/About";
import { I18nProvider, useI18n } from "@/i18n";

const authState = { isAuthenticated: false };

vi.mock("@/utils/cookieService", () => ({ default: { getToken: vi.fn(() => null) } }));
vi.mock("react-redux", () => ({ useSelector: vi.fn(() => authState) }));
vi.mock("@/lib/react-query/courses/courses", () => ({
  useGetCourses: vi.fn(() => ({ data: undefined, isLoading: false })),
}));
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));
vi.mock("@/components/FunFacts", () => ({ default: () => <div data-testid="fun-facts" /> }));
vi.mock("@/components/about/AboutTestimonial", () => ({ default: () => <div data-testid="testimonial" /> }));
vi.mock("@/components/courses/CoursesList", () => ({
  default: ({ courses }: { courses: unknown[] }) => <div data-testid="courses">{courses.length}</div>,
}));
vi.mock("@/components/Newsletter", () => ({ default: () => <div data-testid="newsletter" /> }));

const Toggle = () => {
  const { toggleLanguage } = useI18n();
  return <button onClick={toggleLanguage}>toggle</button>;
};

const renderAbout = () =>
  render(
    <MemoryRouter>
      <I18nProvider>
        <About />
        <Toggle />
      </I18nProvider>
    </MemoryRouter>
  );

describe("About page", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders sections and safely handles missing course data", () => {
    renderAbout();
    expect(screen.getByRole("heading", { name: /about us/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByTestId("fun-facts")).toBeInTheDocument();
    expect(screen.getByTestId("testimonial")).toBeInTheDocument();
    expect(screen.getByTestId("courses")).toHaveTextContent("0");
  });

  it("uses the real sign-in route for the admission CTA", () => {
    renderAbout();
    expect(screen.getByRole("link", { name: /admission open/i })).toHaveAttribute("href", "/sign-in");
    expect(screen.getByRole("link", { name: /all courses/i })).toHaveAttribute("href", "/courses");
  });

  it("switches the page to Arabic and RTL", async () => {
    const user = userEvent.setup();
    renderAbout();
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByRole("heading", { name: /من نحن/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /التقديم مفتوح/i })).toHaveAttribute("href", "/sign-in");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
