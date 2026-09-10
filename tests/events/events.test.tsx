import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Events from "@/pages/events/Events";
import EventDetails from "@/pages/events/EventDetails";
import { I18nProvider, useI18n } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));

const renderPage = (children: React.ReactNode, initialEntries = ["/"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <I18nProvider>{children}</I18nProvider>
    </MemoryRouter>
  );

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return (
    <button type="button" onClick={toggleLanguage}>
      toggle
    </button>
  );
};

describe("Events", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders a production-safe empty state without template event data", () => {
    renderPage(<Events />);

    expect(screen.getByRole("heading", { name: /events/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /no events available right now/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/no published events at the moment/i)).toBeInTheDocument();
    expect(screen.queryByText(/lorem ipsum/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/print, and publishing industries/i)).not.toBeInTheDocument();
  });

  it("renders the unavailable event details state and lets users return to events", async () => {
    const user = userEvent.setup();
    renderPage(<EventDetails />, ["/events/123"]);

    expect(screen.getByRole("heading", { name: /event details/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /event unavailable/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText("#123")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /back to events/i })).toHaveAttribute("href", "/events");
    await user.click(screen.getByRole("link", { name: /back to events/i }));
  });

  it("supports Arabic and RTL on the events page", async () => {
    const user = userEvent.setup();

    renderPage(
      <>
        <Events />
        <LanguageToggle />
      </>
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /الفعاليات/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /لا توجد فعاليات متاحة حاليًا/i, level: 2 })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
