import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileDropdownMenu from "@/components/profiles/ProfileMenu";

const navigateMock = vi.fn();
let latestPopoverOnOpenChange: ((open: boolean) => void) | undefined;

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getRole: () => "student",
  },
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({
    language: "en",
  }),
}));

vi.mock("@/components/profiles/ChangePasswordModal", () => ({
  default: () => <button type="button">Change Password</button>,
}));

vi.mock("@/components/LogoutModal", () => ({
  default: () => <button type="button">Logout</button>,
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
  AvatarFallback: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock("@/components/ui/popover", () => ({
  Popover: ({
    open,
    onOpenChange,
    children,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children?: React.ReactNode;
  }) => {
    latestPopoverOnOpenChange = onOpenChange;

    const childArray = Array.isArray(children) ? children : [children];
    const trigger = childArray[0];
    const content = childArray[1];

    return (
      <div data-open={open ? "true" : "false"}>
        {trigger}
        {open ? content : null}
      </div>
    );
  },
  PopoverTrigger: ({
    children,
    asChild,
  }: {
    children?: React.ReactNode;
    asChild?: boolean;
  }) => (
    <div data-trigger-as-child={asChild ? "true" : "false"}>{children}</div>
  ),
  PopoverContent: ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <div data-popover-content>{children}</div>,
}));

describe("ProfileDropdownMenu", () => {
  it("uses the popover open callback as a direct state setter and exposes an accessible trigger", () => {
    render(<ProfileDropdownMenu />);

    const trigger = screen.getByRole("button", { name: "Profile" });
    expect(trigger).toBeInTheDocument();
    expect(trigger.closest("[data-trigger-as-child]")).toHaveAttribute(
      "data-trigger-as-child",
      "true"
    );
    expect(latestPopoverOnOpenChange).toBeTypeOf("function");
    expect(screen.queryByText("My Account")).not.toBeInTheDocument();

    act(() => {
      latestPopoverOnOpenChange?.(true);
    });
    expect(screen.getByText("My Account")).toBeInTheDocument();

    act(() => {
      latestPopoverOnOpenChange?.(false);
    });
    expect(screen.queryByText("My Account")).not.toBeInTheDocument();
  });
});
