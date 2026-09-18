import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookingPaymentDialog from "@/components/bookings/BookingPaymentDialog";
import { I18nProvider } from "@/i18n";

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  getToken: vi.fn(),
}));

vi.mock("@/lib/react-query/booking", () => ({
  useInitiateBookingPayment: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: { getToken: mocks.getToken },
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

describe("BookingPaymentDialog", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    mocks.getToken.mockReturnValue("student-token");
    mocks.mutateAsync.mockReset();
    mocks.mutateAsync.mockResolvedValue({ status: true, message: null, data: {} });
  });

  it("submits the wallet payment request with the authenticated token", async () => {
    render(<I18nProvider><BookingPaymentDialog bookingId={15} price="250.00" /></I18nProvider>);

    fireEvent.click(screen.getByRole("button", { name: "Pay 250.00" }));
    fireEvent.change(screen.getByLabelText("Wallet number"), {
      target: { value: "01012345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() =>
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        token: "student-token",
        bookingId: 15,
        walletNumber: "01012345678",
        isParent: false,
      })
    );
  });
  it("renders Arabic payment labels", () => {
    localStorage.setItem("elmullim-language", "ar");
    render(<I18nProvider><BookingPaymentDialog bookingId={15} price="250.00" /></I18nProvider>);
    expect(screen.getByRole("button", { name: "ادفع 250.00" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "ادفع 250.00" }));
    expect(screen.getByRole("heading", { name: "دفع الحجز" })).toBeInTheDocument();
    expect(screen.getByLabelText("رقم المحفظة")).toBeInTheDocument();
  });
});
