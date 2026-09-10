import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Services from "@/pages/services/Services";
import ServiceDetails from "@/pages/services/ServiceDetails";
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

const renderPage = (children: React.ReactNode, initialEntries = ["/"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <I18nProvider>{children}</I18nProvider>
    </MemoryRouter>
  );

describe("Services", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders the localized service catalog without placeholder content", () => {
    renderPage(<Services />);

    expect(screen.getByRole("heading", { name: /services/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /learning support/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /video learning/i, level: 2 })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(6);
    expect(screen.queryByText(/lorem ipsum/i)).not.toBeInTheDocument();
  });

  it("uses a unique service route and safe unavailable details state", async () => {
    const user = userEvent.setup();
    renderPage(
      <Routes>
        <Route path="/" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
      </Routes>,
      ["/services/video"]
    );

    expect(screen.getByRole("heading", { name: /service details are not available yet/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/video learning/i)).toBeInTheDocument();
    expect(screen.queryByText(/lorem ipsum/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /back to services/i }));
  });

  it("supports Arabic and RTL", async () => {
    const user = userEvent.setup();
    renderPage(
      <>
        <Services />
        <LanguageToggle />
      </>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /الخدمات/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /الدعم والإرشاد التعليمي/i, level: 2 })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
