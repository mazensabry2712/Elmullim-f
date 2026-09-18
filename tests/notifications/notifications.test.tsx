import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Notifications from "@/pages/Notifications";
import { I18nProvider } from "@/i18n";

const mocks = {
  query: vi.fn(),
  markRead: vi.fn(),
  markAll: vi.fn(),
};

vi.mock("@/lib/react-query/notifications", () => ({
  useGetNotifications: () => mocks.query(),
  useMarkNotificationRead: () => ({ mutateAsync: mocks.markRead, isPending: false }),
  useMarkAllNotificationsRead: () => ({ mutateAsync: mocks.markAll, isPending: false }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: () => "token" },
}));

describe("Notifications", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    mocks.query.mockReset();
    mocks.markRead.mockReset();
    mocks.markAll.mockReset();
    mocks.markRead.mockResolvedValue({ status: true });
    mocks.markAll.mockResolvedValue({ status: true });
  });

  it("renders unread notifications and marks one as read", async () => {
    const user = userEvent.setup();
    mocks.query.mockReturnValue({
      data: {
        data: {
          unread_count: 1,
          items: [{
            id: "n-1",
            type: "BookingStatusChanged",
            data: {
              title_en: "Booking accepted",
              title_ar: "تم قبول الحجز",
              body_en: "Your booking was accepted.",
              body_ar: "تم قبول حجزك.",
            },
            read_at: null,
            created_at: "2026-09-18T10:00:00Z",
          }],
        },
      },
      isLoading: false,
      isError: false,
    });

    render(<I18nProvider><Notifications /></I18nProvider>);

    expect(screen.getByRole("heading", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByText("Booking accepted")).toBeInTheDocument();
    expect(screen.getByText("1 Unread")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Read" }));

    expect(mocks.markRead).toHaveBeenCalledWith({
      token: "token",
      notificationId: "n-1",
    });
  });

  it("supports Arabic notification content", () => {
    localStorage.setItem("elmullim-language", "ar");
    mocks.query.mockReturnValue({
      data: {
        data: {
          unread_count: 0,
          items: [{
            id: "n-2",
            type: "BookingStatusChanged",
            data: {
              title_en: "Booking confirmed",
              title_ar: "تم تأكيد الحجز",
              body_en: "Your booking is confirmed.",
              body_ar: "تم تأكيد حجزك.",
            },
            read_at: "2026-09-18T10:00:00Z",
            created_at: "2026-09-18T10:00:00Z",
          }],
        },
      },
      isLoading: false,
      isError: false,
    });

    render(<I18nProvider><Notifications /></I18nProvider>);

    expect(screen.getByRole("heading", { name: "الإشعارات" })).toBeInTheDocument();
    expect(screen.getByText("تم تأكيد الحجز")).toBeInTheDocument();
    expect(screen.getByText("تم تأكيد حجزك.")).toBeInTheDocument();
  });
});
