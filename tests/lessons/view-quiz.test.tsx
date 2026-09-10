import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ViewQuiz from "@/components/profiles/student/quizes/ViewQuiz";
import { I18nProvider, useI18n } from "@/i18n";

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return <button type="button" onClick={toggleLanguage}>toggle</button>;
};

describe("ViewQuiz", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  const renderPage = (children: React.ReactNode) =>
    render(
      <MemoryRouter initialEntries={["/view-quiz"]}>
        <I18nProvider>{children}</I18nProvider>
      </MemoryRouter>
    );

  it("does not show fake quiz data or answer inputs", () => {
    renderPage(<ViewQuiz />);

    expect(screen.getByRole("heading", { name: "Quiz", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /quiz is not available yet/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/enter your name/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to lessons/i })).toHaveAttribute("href", "/lessons");
  });

  it("supports Arabic and RTL", async () => {
    renderPage(
      <>
        <ViewQuiz />
        <LanguageToggle />
      </>
    );

    screen.getByRole("button", { name: "toggle" }).click();

    expect(screen.getByRole("heading", { name: "الاختبار", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /الاختبار غير متاح حاليًا/i, level: 2 })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
