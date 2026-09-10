import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Faqs from "@/pages/Faqs";
import { I18nProvider, useI18n } from "@/i18n";

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
  render(<I18nProvider>{children}</I18nProvider>);

describe("FAQs", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders production FAQ content without placeholder copy", () => {
    renderPage(<Faqs />);

    expect(screen.getByRole("heading", { name: /faqs/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /what is elmullim/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /who can use elmullim/i })).toBeInTheDocument();
    expect(screen.queryByText(/lorem ipsum/i)).not.toBeInTheDocument();
  });

  it("opens and closes an FAQ item", async () => {
    const user = userEvent.setup();
    renderPage(<Faqs />);

    const firstTrigger = screen.getByRole("button", { name: /what is elmullim/i });
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/elmullim is a learning platform/i)).toBeVisible();

    await user.click(firstTrigger);
    expect(firstTrigger).toHaveAttribute("aria-expanded", "false");

    await user.click(firstTrigger);
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
  });

  it("supports Arabic and RTL", async () => {
    const user = userEvent.setup();
    renderPage(
      <>
        <Faqs />
        <LanguageToggle />
      </>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /الأسئلة الشائعة/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ما هي منصة المعلّم/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
