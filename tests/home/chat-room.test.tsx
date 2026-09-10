import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";
import React from "react";
import ChatRoom from "@/components/home/ChatRoom/ChatRoom";
import { I18nProvider, useI18n } from "@/i18n";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    article: ({ children, ...props }: { children?: React.ReactNode }) => (
      <article {...props}>{children}</article>
    ),
  },
}));

vi.mock("@/components/ui/BadgeTitle", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span aria-hidden="true" />,
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
    <I18nProvider>
      <LanguageToggle />
      <ChatRoom />
    </I18nProvider>
  );

describe("Home chat room", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("renders all chat room options in English", () => {
    renderChatRoom();

    expect(
      screen.getByRole("heading", {
        name: /stay in touch with your teacher through our chat rooms/i,
      })
    ).toBeInTheDocument();

    for (const text of [
      "Create a New Room",
      "Join a Room",
      "View Available Rooms",
      "Create a private learning room for you and your classmates.",
      "Join a learning room using the provided access code.",
      "Explore available learning rooms and request to join.",
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }

    expect(screen.getByRole("region")).toHaveAttribute("id", "chat-rooms");
  });

  it("switches chat room content to Arabic with RTL direction", async () => {
    const user = userEvent.setup();
    renderChatRoom();

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(
      screen.getByRole("heading", {
        name: /ابقَ على تواصل مع معلمك من خلال غرف الدردشة/i,
      })
    ).toBeInTheDocument();

    for (const text of [
      "إنشاء غرفة جديدة",
      "الانضمام إلى غرفة",
      "عرض الغرف المتاحة",
      "أنشئ غرفة تعليمية خاصة لك ولزملائك في الدراسة.",
      "انضم إلى غرفة تعليمية باستخدام رمز الدخول المتاح.",
      "استعرض الغرف التعليمية المتاحة واطلب الانضمام إليها.",
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }

    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
