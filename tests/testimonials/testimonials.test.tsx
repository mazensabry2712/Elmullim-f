import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Testimonials from "@/pages/testimonials/Testimonials";
import { I18nProvider, useI18n } from "@/i18n";
import { MemoryRouter } from "react-router-dom";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};

const renderPage = (children: React.ReactNode) =>
  render(
    <MemoryRouter>
      <I18nProvider>{children}</I18nProvider>
    </MemoryRouter>
  );

describe("Testimonials", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders testimonial content without placeholder copy", () => {
    renderPage(<Testimonials />);

    expect(screen.getByRole("heading", { name: /testimonials/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Elmullim makes lessons easier to follow/i)).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.queryByText(/lorem ipsum/i)).not.toBeInTheDocument();
  });

  it("supports Arabic and RTL", async () => {
    const user = userEvent.setup();
    renderPage(
      <>
        <Testimonials />
        <LanguageToggle />
      </>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /آراء المستخدمين/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/المعلّم يجعل متابعة الدروس أسهل/i)).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("uses meaningful image alternative text", () => {
    renderPage(<Testimonials />);

    expect(screen.getAllByRole("img", { name: /elmullim testimonial profile/i })).toHaveLength(6);
  });
});
