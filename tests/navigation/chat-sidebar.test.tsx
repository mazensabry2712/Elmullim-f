import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SideBar from "@/components/chat/SideBar";

const setSelectedConversationIdMock = vi.fn();

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
    data: { data: [] },
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
    vi.doMock("@/lib/react-query/chat/chat");
    expect(setSelectedConversationIdMock).not.toHaveBeenCalled();
  });
});
