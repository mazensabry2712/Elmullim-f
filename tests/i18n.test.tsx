import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { I18nProvider, useI18n } from "@/i18n";

const I18nProbe = () => {
  const { language, direction, t, toggleLanguage } = useI18n();

  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="direction">{direction}</span>
      <span>{t("nav.home")}</span>
      <button type="button" onClick={toggleLanguage}>
        toggle
      </button>
    </div>
  );
};

describe("frontend i18n", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("switches between English and Arabic and updates document direction", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <I18nProbe />
      </I18nProvider>
    );

    expect(screen.getByTestId("language")).toHaveTextContent("en");
    expect(screen.getByTestId("direction")).toHaveTextContent("ltr");
    expect(screen.getByText("Home")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByTestId("language")).toHaveTextContent("ar");
    expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(screen.getByText("الرئيسية")).toBeInTheDocument();
    expect(localStorage.getItem("elmullim-language")).toBe("ar");
  });
});
