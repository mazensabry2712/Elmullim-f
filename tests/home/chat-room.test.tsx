import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";
import React from "react";
import ChatRoom from "@/components/home/ChatRoom/ChatRoom";
import { I18nProvider, useI18n } from "@/i18n";
import { MemoryRouter } from "react-router-dom";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

const LanguageToggle = () => {
  const { toggleLanguage } = useI18n();
  return (
    <button type="button" onClick={toggleLanguage}>
      toggle
    </button>
  );
};

const renderChatRoom = () =>
  render(
    <MemoryRouter>
      <I18nProvider>
        <LanguageToggle />
        <ChatRoom />
      </I18nProvider>
    </MemoryRouter>
  );

describe("Home communication", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("shows one direct-chat call to action in English", () => {
    renderChatRoom();

    expect(
      screen.getByRole("heading", {
        name: /stay connected through elmullim chat/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /communicate directly with the people involved in your learning experience/i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Chat" })).toHaveAttribute(
      "href",
      "/chat"
    );
    expect(screen.queryByText("Create a New Room")).not.toBeInTheDocument();
    expect(screen.getByRole("region")).toHaveAttribute("id", "chat-rooms");
  });

  it("switches communication copy to Arabic with RTL direction", async () => {
    const user = userEvent.setup();
    renderChatRoom();

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(
      screen.getByRole("heading", {
        name: /ابقَ على تواصل من خلال دردشة المعلّم/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "فتح الدردشة" })).toHaveAttribute(
      "href",
      "/chat"
    );
    expect(screen.queryByText("إنشاء غرفة جديدة")).not.toBeInTheDocument();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
