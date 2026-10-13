import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import HomeHighlights from "@/components/home/comments/Comments";
import { I18nProvider, useI18n } from "@/i18n";

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return (
    <button type="button" onClick={toggleLanguage}>
      toggle
    </button>
  );
};

const renderHighlights = () =>
  render(
    <I18nProvider>
      <LanguageToggle />
      <HomeHighlights />
    </I18nProvider>
  );

describe("Homepage highlights", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders platform features without placeholder testimonials or fabricated statistics", () => {
    renderHighlights();

    expect(
      screen.getByRole("heading", { name: /everything you need to stay on track/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("Lessons that fit your needs")).toBeInTheDocument();
    expect(screen.getByText("Flexible learning options")).toBeInTheDocument();
    expect(screen.getByText("Keep learning connected")).toBeInTheDocument();

    expect(screen.queryByText("Courtney Henry")).not.toBeInTheDocument();
    expect(screen.queryByText("97.5k+")).not.toBeInTheDocument();
  });

  it("switches the section to Arabic and RTL", async () => {
    const user = userEvent.setup();
    renderHighlights();

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(
      screen.getByRole("heading", { name: /كل ما تحتاجه لمواصلة رحلتك التعليمية/i })
    ).toBeInTheDocument();
    expect(screen.getByText("دروس تناسب احتياجاتك")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
