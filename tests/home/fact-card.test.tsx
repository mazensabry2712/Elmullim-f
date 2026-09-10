import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import FactCard from "@/components/FactCard";
import { I18nProvider } from "@/i18n";

describe("Home fun facts", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders the statistic in English", () => {
    render(
      <I18nProvider>
        <FactCard
          statistic={{
            title: "3.9k+",
            icon: "fi fi-rr-chalkboard-user",
            description: "Successfully graduated",
          }}
        />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { level: 4, name: "3.9k+" })).toBeInTheDocument();
    expect(screen.getByText("Successfully graduated")).toBeInTheDocument();
  });

  it("renders the statistic in Arabic and preserves RTL", async () => {
    const user = userEvent.setup();

    const LanguageToggle = () => {
      const { toggleLanguage } = require("@/i18n") as typeof import("@/i18n");
      return <button type="button" onClick={toggleLanguage}>toggle</button>;
    };

    render(
      <I18nProvider>
        <FactCard
          statistic={{
            title: "3.9k+",
            icon: "fi fi-rr-chalkboard-user",
            description: "Successfully graduated",
          }}
        />
        <LanguageToggle />
      </I18nProvider>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByText("خريجون بنجاح")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
