import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import ContactUs from "@/pages/ContactUs";
import ContactUsForm from "@/components/forms/contactUs/ContactUsForm";
import { I18nProvider, useI18n } from "@/i18n";

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return (
    <button type="button" onClick={toggleLanguage}>
      toggle
    </button>
  );
};

describe("Contact Us", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders contact information and form", () => {
    render(
      <I18nProvider>
        <ContactUs />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { name: /contact us/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /get in touch/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /support@elmullim\.com/i })).toHaveAttribute(
      "href",
      "mailto:support@elmullim.com"
    );
    expect(screen.getByRole("link", { name: /\+99-35895-4565/i })).toHaveAttribute(
      "href",
      "tel:+99358954565"
    );
    expect(screen.getByRole("button", { name: /send a message/i })).toBeInTheDocument();
  });

  it("shows validation feedback for an empty form", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <ContactUsForm />
      </I18nProvider>
    );

    await user.click(screen.getByRole("button", { name: /send a message/i }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByText("Phone number must be at least 10 digits.")).toBeInTheDocument();
    expect(screen.getByText("Subject is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
  });

  it("switches contact content to Arabic and RTL", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <ContactUs />
        <LanguageToggle />
      </I18nProvider>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /تواصل معنا/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /تواصل معنا/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /إرسال الرسالة/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
