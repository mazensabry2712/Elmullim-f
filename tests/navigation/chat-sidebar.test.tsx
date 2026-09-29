import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SideBar from "@/components/chat/SideBar";

const setSelectedConversationIdMock = vi.fn();
let conversationData: {
  data: Array<{
    conversation_id: string;
    unread_count: number;
    participant: {
      id: number;
      name: string;
      role: string;
      phone: string;
      profile_image: string;
    };
    last_message: {
      id: number;
      data: { body: string } | null;
      created_at: string;
      deleted_at: string | null;
      read: { status: boolean } | null;
      sender: null;
    } | null;
  }>;
} = { data: [] };

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
  useGetAllConversations: () => ({
    data: conversationData,
    isLoading: false,
    refetch: vi.fn(),
  }),
  useCreateConversation: () => ({
    mutate: vi.fn(),
  }),
}));

vi.mock("@/lib/react-query/main", () => ({
  useGetUserSearch: () => ({
    data: [],
    isLoading: false,
  }),
}));

describe("Chat sidebar", () => {
  it("exposes accessible new-chat controls and a way back", () => {
    render(
      <SideBar setSelectedConversationId={setSelectedConversationIdMock} />
    );

    const newChatButton = screen.getByRole("button", {
      name: "Start a new chat",
    });

    expect(newChatButton).toHaveAttribute("type", "button");
    expect(screen.getByRole("searchbox", { name: "🔍 Search Here..." })).toBeInTheDocument();

    fireEvent.click(newChatButton);

    expect(screen.getByRole("heading", { name: "Start a new chat" })).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "🔍 Search For The Name...." })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close new chat" }));

    expect(
      screen.queryByRole("heading", { name: "Start a new chat" })
    ).not.toBeInTheDocument();
  });

  it("renders conversation entries as keyboard-accessible buttons", () => {
    conversationData = {
      data: [
        {
          conversation_id: "42",
          unread_count: 1,
          participant: {
            id: 2,
            name: "Teacher",
            role: "teacher",
            phone: "01000000000",
            profile_image: "",
          },
          last_message: {
            id: 1,
            data: { body: "Welcome" },
            created_at: "2026-09-29T10:00:00.000Z",
            deleted_at: null,
            read: { status: true },
            sender: null,
          },
        },
      ],
    };

    render(
      <SideBar setSelectedConversationId={setSelectedConversationIdMock} />
    );

    const conversation = screen.getByRole("button", { name: "Teacher" });
    expect(conversation).toHaveAttribute("type", "button");

    fireEvent.click(conversation);

    expect(setSelectedConversationIdMock).toHaveBeenCalledWith("42");
  });
});
