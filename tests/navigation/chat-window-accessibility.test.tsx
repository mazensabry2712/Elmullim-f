import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatWindow from "@/components/chat/ChatWindow";

const onCloseMock = vi.fn();
const sendMessageMock = vi.fn();

const renderChatWindow = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <ChatWindow conversationId="1" onClose={onCloseMock} />
    </QueryClientProvider>
  );
};

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

const deleteConversationMock = vi.fn();

vi.mock("@/lib/react-query/chat/chat", () => ({
  useCreateMessage: () => ({
    mutate: sendMessageMock,
    isPending: false,
  }),
  useDeleteConversation: () => ({
    mutate: deleteConversationMock,
    isPending: false,
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
  it("provides essential chat controls and a mobile back action", () => {
    renderChatWindow();

    expect(screen.getByRole("button", { name: "Back to conversations" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove conversation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Attach image" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type your message.....")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Back to conversations" }));
    expect(onCloseMock).toHaveBeenCalledOnce();
  });

  it("removes a conversation from the list after confirmation", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderChatWindow();

    fireEvent.click(screen.getByRole("button", { name: "Remove conversation" }));

    expect(deleteConversationMock).toHaveBeenCalledOnce();
    expect(deleteConversationMock.mock.calls[0][0]).toEqual({
      token: "token",
      conversationId: "1",
    });

    vi.restoreAllMocks();
  });

  it("shows a bounded preview for a valid image attachment", () => {
    renderChatWindow();

    const fileInput = document.getElementById("hiddenFileInput");
    const image = new File(["image"], "lesson.png", { type: "image/png" });

    fireEvent.change(fileInput as HTMLInputElement, {
      target: { files: [image] },
    });

    expect(
      screen.getByRole("img", { name: "Attached image preview" })
    ).toBeInTheDocument();
  });

  it("sends an image even when the message body is empty", () => {
    renderChatWindow();

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
