import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProfileDropdownMenu from "@/components/profiles/ProfileMenu";

const { performLogoutMock, swalFireMock } = vi.hoisted(() => ({
  performLogoutMock: vi.fn(),
  swalFireMock: vi.fn(),
}));

let latestPopoverOnOpenChange: ((open: boolean) => void) | undefined;

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("@/hooks/useLogout", () => ({
  default: () => ({
    performLogout: performLogoutMock,
    isPending: false,
  }),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: swalFireMock,
  },
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getRole: () => "student",
    getToken: () => "student-token",
  },
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({
    language: "en",
  }),
}));

vi.mock("@/lib/react-query/student/studentProfile", () => ({
  useGetStudentProfile: () => ({
    data: {
      data: {
        name: "Ahmed Student",
        profile_image: "data:image/webp;base64,profile-image",
      },
    },
  }),
}));

vi.mock("@/lib/react-query/parent/parentProfile", () => ({
  useGetParentProfile: () => ({
    data: undefined,
  }),
}));

vi.mock("@/lib/react-query/teacher/teacherProfile", () => ({
  useGetTeacherProfile: () => ({
    data: undefined,
  }),
}));

vi.mock("@/components/profiles/ChangePasswordModal", () => ({
  default: () => <button type="button">Change Password</button>,
}));

vi.mock("@/components/LogoutModal", () => ({
  default: () => <button type="button">Logout</button>,
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => <span {...props}>{children}</span>,
  AvatarImage: ({
    src,
    alt,
  }: {
    src?: string;
    alt?: string;
  }) => <img src={src} alt={alt} />,
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
  beforeEach(() => {
    vi.clearAllMocks();
    swalFireMock.mockResolvedValue({ isConfirmed: false });
    performLogoutMock.mockResolvedValue({
      response: {
        status: true,
        message: "success logout",
      },
    });
  });

  it("renders the authenticated user's profile image in the navbar trigger", () => {
    render(<ProfileDropdownMenu />);

    expect(screen.getByRole("img", { name: "Ahmed Student" })).toHaveAttribute(
      "src",
      "data:image/webp;base64,profile-image"
    );
  });

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

  it("confirms and executes logout from the profile menu", async () => {
    const user = userEvent.setup();
    swalFireMock.mockResolvedValueOnce({ isConfirmed: true });

    render(<ProfileDropdownMenu />);

    act(() => {
      latestPopoverOnOpenChange?.(true);
    });

    await user.click(screen.getByRole("button", { name: /Logout.*End your current session/i }));

    await waitFor(() => {
      expect(swalFireMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Logout Confirmation",
          showCancelButton: true,
          confirmButtonText: "Logout",
          cancelButtonText: "Cancel",
        })
      );
    });

    await waitFor(() => {
      expect(performLogoutMock).toHaveBeenCalledTimes(1);
    });
  });
});
