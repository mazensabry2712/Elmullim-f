import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach } from "vitest";
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
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
  };
} = {
  data: [],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0,
    from: null,
    to: null,
    has_more_pages: false,
  },
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

vi.mock("@/lib/react-query/chat/chat", () => ({
  useGetAllConversations: () => ({
    data: conversationData,
    isLoading: false,
    isFetching: false,
    isError: false,
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
  beforeEach(() => {
    conversationData = {
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 25,
        total: 0,
        from: null,
        to: null,
        has_more_pages: false,
      },
    };
    setSelectedConversationIdMock.mockReset();
  });
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

    const newChatPanel = screen
      .getByRole("heading", { name: "Start a new chat" })
      .closest('[aria-label="Start a new chat"]');

    expect(newChatPanel).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close new chat" }));

    expect(newChatPanel).toHaveClass("translate-x-full");
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
      meta: {
        current_page: 1,
        last_page: 2,
        per_page: 1,
        total: 2,
        from: 1,
        to: 1,
        has_more_pages: true,
      },
    };

    render(
      <SideBar setSelectedConversationId={setSelectedConversationIdMock} />
    );

    const conversation = screen.getByRole("button", { name: "Teacher" });
    expect(conversation).toHaveAttribute("type", "button");

    fireEvent.click(conversation);

    expect(setSelectedConversationIdMock).toHaveBeenCalledWith("42");
  });

  it("renders pagination controls when the API reports multiple pages", () => {
    conversationData = {
      data: [],
      meta: {
        current_page: 1,
        last_page: 3,
        per_page: 1,
        total: 3,
        from: null,
        to: null,
        has_more_pages: true,
      },
    };

    render(
      <SideBar setSelectedConversationId={setSelectedConversationIdMock} />
    );

    expect(screen.getByRole("button", { name: "Previous conversations" })).toBeDisabled();
    const next = screen.getByRole("button", { name: "Next conversations" });
    expect(next).toBeEnabled();

    fireEvent.click(next);

    expect(next).toBeInTheDocument();
  });
});
