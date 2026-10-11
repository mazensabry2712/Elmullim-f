import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import OurTeachers from "@/components/home/our teachers/OurTeachers";
import { I18nProvider, useI18n } from "@/i18n";

const queryState = vi.hoisted(() => ({
  data: {
    data: [
      { id: 1, name: "Teacher One", profile_image: "", rating: 4.8, rating_count: 12, lessons_count: 3, subjects: [{ id: 1, name: "Math" }] },
      { id: 2, name: "Teacher Two", profile_image: "", rating: 0, rating_count: 0, lessons_count: 1, subjects: [{ id: 2, name: "Science" }] },
      { id: 3, name: "Teacher Three", profile_image: "", rating: 4.5, rating_count: 4, lessons_count: 2, subjects: [] },
      { id: 4, name: "Teacher Four", profile_image: "", rating: 0, rating_count: 0, lessons_count: 1, subjects: [] },
    ],
  },
  isPending: false,
  isError: false,
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => queryState,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    article: ({ children }: { children?: React.ReactNode }) => <article>{children}</article>,
  },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};

describe("Home Our Teachers", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    queryState.isPending = false;
    queryState.isError = false;
  });

  it("renders live teacher names and real rating counts", () => {
    render(<I18nProvider><OurTeachers /></I18nProvider>);

    expect(screen.getByRole("heading", { name: "Our Teachers" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Our Teachers" })).toHaveAttribute("id", "our-teachers");
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Teacher One" })).toBeInTheDocument();
    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(screen.getByText("(12 ratings)")).toBeInTheDocument();
    expect(screen.getAllByText("No ratings yet")).toHaveLength(2);
  });

  it("shows an empty state when there are no public teachers", () => {
    queryState.data = { data: [] };
    render(<I18nProvider><OurTeachers /></I18nProvider>);
    expect(screen.getByRole("status")).toHaveTextContent("Our teachers will be featured here soon.");
    queryState.data = {
      data: [
        { id: 1, name: "Teacher One", profile_image: "", rating: 4.8, rating_count: 12, lessons_count: 3, subjects: [{ id: 1, name: "Math" }] },
        { id: 2, name: "Teacher Two", profile_image: "", rating: 0, rating_count: 0, lessons_count: 1, subjects: [{ id: 2, name: "Science" }] },
        { id: 3, name: "Teacher Three", profile_image: "", rating: 4.5, rating_count: 4, lessons_count: 2, subjects: [] },
        { id: 4, name: "Teacher Four", profile_image: "", rating: 0, rating_count: 0, lessons_count: 1, subjects: [] },
      ],
    };
  });

  it("shows a friendly error state when the API is unavailable", () => {
    queryState.isError = true;
    render(<I18nProvider><OurTeachers /></I18nProvider>);
    expect(screen.getByRole("status")).toHaveTextContent("Teachers are unavailable right now.");
  });

  it("switches the section to Arabic and RTL", async () => {
    const user = userEvent.setup();
    render(<I18nProvider><OurTeachers /><LanguageToggle /></I18nProvider>);
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByRole("heading", { name: "معلمونا" })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
