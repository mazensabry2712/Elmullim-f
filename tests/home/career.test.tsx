import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import Career from "@/components/home/Career/Career";
import { I18nProvider } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/home/Career/CareerCard", () => ({
  default: ({ title, description }: { title: string; description: string }) => (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  ),
}));

const LanguageToggle = () => {
  const { toggleLanguage } = require("@/i18n") as typeof import("@/i18n");
  const { toggleLanguage: toggle } = toggleLanguage ? { toggleLanguage } : { toggleLanguage: () => undefined };
  return <button type="button" onClick={toggle}>toggle</button>;
};

const renderCareer = () =>
  render(
    <I18nProvider>
      <Career />
      <LanguageToggle />
    </I18nProvider>
  );

describe("Home career", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders career content in English", () => {
    renderCareer();

    expect(screen.getByRole("heading", { name: /discover your gain/i })).toBeInTheDocument();
    expect(screen.getByText("For Students")).toBeInTheDocument();
    expect(screen.getByText("For Teachers")).toBeInTheDocument();
  });

  it("switches career content to Arabic and RTL", async () => {
    const user = userEvent.setup();
    renderCareer();

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /اكتشف مستقبلك/i })).toBeInTheDocument();
    expect(screen.getByText("للطلاب")).toBeInTheDocument();
    expect(screen.getByText("للمعلمين")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
