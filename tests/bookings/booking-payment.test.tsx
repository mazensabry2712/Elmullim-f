import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookingPaymentDialog from "@/components/bookings/BookingPaymentDialog";
import { I18nProvider, useI18n } from "@/i18n";
import { useEffect } from "react";

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

  it("submits the unified payment request with the authenticated token", async () => {
    render(<I18nProvider><BookingPaymentDialog bookingId={15} price="250.00" /></I18nProvider>);

    fireEvent.click(screen.getByRole("button", { name: "Pay 250.00" }));
    expect(screen.getByText("Visa / Mastercard")).toBeInTheDocument();
    expect(screen.getByText("Fawry / Kiosk")).toBeInTheDocument();
    expect(screen.getByText("Egyptian mobile wallets")).toBeInTheDocument();
    expect(screen.queryByText(/paymob/i)).not.toBeInTheDocument();

    const fawryOption = screen.getByRole("radio", { name: /Fawry/i });
    fireEvent.click(fawryOption);
    expect(fawryOption).toHaveAttribute("aria-checked", "true");

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() =>
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        token: "student-token",
        bookingId: 15,
        paymentMethod: "fawry",
        isParent: false,
      })
    );
  });
  it("renders Arabic payment labels", async () => {
    const ArabicPaymentDialog = () => {
      const { setLanguage } = useI18n();
      useEffect(() => {
        setLanguage("ar");
      }, [setLanguage]);
      return <BookingPaymentDialog bookingId={15} price="250.00" />;
    };

    render(<I18nProvider><ArabicPaymentDialog /></I18nProvider>);
    await waitFor(() => expect(screen.getByRole("button", { name: "ادفع 250.00" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "ادفع 250.00" }));
    expect(screen.getByRole("heading", { name: "دفع الحجز" })).toBeInTheDocument();
    expect(screen.getByText("Visa / Mastercard")).toBeInTheDocument();
    expect(screen.getByText("Fawry / Kiosk")).toBeInTheDocument();
    expect(screen.getByText("المحافظ الإلكترونية المصرية")).toBeInTheDocument();
  });
});
