import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ParentProfile from "@/components/profiles/parent/ParentProfile";

let language = "en";

vi.mock("@/i18n", () => ({
  useI18n: () => ({ language }),
}));

vi.mock("@/components/profiles/parent/ParentMainProfile", () => ({
  default: () => <div>Parent overview content</div>,
}));
vi.mock("@/pages/bookings/Bookings", () => ({
  default: () => <div>Parent bookings content</div>,
}));
vi.mock("@/pages/bookings/Schedule", () => ({
  default: () => <div>Parent schedule content</div>,
}));
vi.mock("@/components/chat/Chat", () => ({
  default: () => <div>Parent chat content</div>,
}));

describe("ParentProfile tabs", () => {
  beforeEach(() => {
    language = "en";
  });

  it("provides the same responsive profile section pattern as student and teacher", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <ParentProfile />
      </MemoryRouter>,
    );

    expect(screen.getByRole("tab", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Bookings" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Schedule" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Chat" })).toBeInTheDocument();
    expect(await screen.findByText("Parent overview content")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Bookings" }));
    expect(screen.getByRole("tab", { name: "Bookings" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Parent bookings content")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Schedule" }));
    expect(screen.getByRole("tab", { name: "Schedule" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Parent schedule content")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Chat" }));
    expect(screen.getByRole("tab", { name: "Chat" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText("Parent chat content")).toBeInTheDocument();
  });

  it("localizes parent profile tabs to Arabic", () => {
    language = "ar";
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <ParentProfile />
      </MemoryRouter>,
    );

    expect(screen.getByRole("tab", { name: "الرئيسية" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "الحجوزات" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "جدول الحصص" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "الدردشة" })).toBeInTheDocument();
  });
});
