import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import Comments from "@/components/home/comments/Comments";
import { I18nProvider, useI18n } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    section: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  },
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/FunFacts", () => ({
  default: () => <div data-testid="fun-facts" />,
}));

vi.mock("@/components/home/comments/CommentCard", () => ({
  default: () => <article>comment-card</article>,
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return (
    <button type="button" onClick={toggleLanguage}>
      toggle
    </button>
  );
};

const renderComments = () =>
  render(
    <I18nProvider>
      <LanguageToggle />
      <Comments />
    </I18nProvider>
  );

describe("Home comments", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders the comments section in English", () => {
    renderComments();

    expect(screen.getByRole("heading", { name: /user comments/i })).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getAllByText("comment-card")).toHaveLength(2);
  });

  it("switches the comments section to Arabic and RTL", async () => {
    const user = userEvent.setup();
    renderComments();

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByRole("heading", { name: /آراء المستخدمين/i })).toBeInTheDocument();
    expect(screen.getByText("التعليقات")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
