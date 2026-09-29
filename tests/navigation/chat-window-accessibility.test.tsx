import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChatWindow from "@/components/chat/ChatWindow";

const onCloseMock = vi.fn();
const sendMessageMock = vi.fn();

vi.mock("@/lib/echo/echo", () => ({
  default: vi.fn(async () => null),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => "token",
  },
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({
    language: "en",
  }),
}));

vi.mock("@/lib/react-query/chat/chat", () => ({
  useCreateMessage: () => ({
    mutate: sendMessageMock,
    isPending: false,
  }),
  useDeleteConversation: () => ({
    mutate: vi.fn(),
  }),
  useGetConversationById: () => ({
    data: {
      data: {
        participant: {
          id: 2,
          name: "Teacher",
          role: "teacher",
          phone: "01000000000",
          profile_image: "",
        },
        messages: [
          {
            id: 1,
            data: {
              body: "Hello",
            },
            side: "right",
            flagged: false,
            created_at: "2026-09-29T10:00:00.000Z",
            deleted_at: null,
            read: true,
            sender: null,
          },
        ],
      },
    },
    refetch: vi.fn(),
  }),
}));

describe("ChatWindow accessibility", () => {
  it("provides keyboard-accessible chat controls and closes from the menu", () => {
    render(<ChatWindow conversationId="1" onClose={onCloseMock} />);

    const optionsButton = screen.getByRole("button", { name: "Chat options" });
    expect(optionsButton).toHaveAttribute("aria-haspopup", "menu");
    expect(optionsButton).toHaveAttribute("aria-expanded", "false");

    expect(screen.getByRole("button", { name: "Attach image" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type your message.....")).toBeInTheDocument();

    fireEvent.click(optionsButton);

    expect(optionsButton).toHaveAttribute("aria-expanded", "true");
    const closeButton = screen.getByRole("menuitem", { name: "Close Chat" });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledOnce();
  });

  it("sends an image even when the message body is empty", () => {
    render(<ChatWindow conversationId="1" onClose={onCloseMock} />);

    const fileInput = document.getElementById("hiddenFileInput");
    expect(fileInput).toBeInTheDocument();

    const image = new File(["image"], "lesson.png", { type: "image/png" });
    fireEvent.change(fileInput as HTMLInputElement, {
      target: { files: [image] },
    });

    const sendButton = screen.getByRole("button", { name: "Send" });
    expect(sendButton).toBeEnabled();

    fireEvent.click(sendButton);

    expect(sendMessageMock).toHaveBeenCalledOnce();
    expect(sendMessageMock.mock.calls[0][0].message).toEqual({
      body: "",
      image,
    });
  });
});
