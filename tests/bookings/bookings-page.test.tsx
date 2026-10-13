import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n";
import Bookings from "@/pages/bookings/Bookings";

const mocks = vi.hoisted(() => ({
  role: "parent" as "parent" | "student",
  query: vi.fn(),
  cancel: vi.fn(),
  respond: vi.fn(),
  refetch: vi.fn(),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => "parent-token",
    getRole: () => mocks.role,
  },
}));

vi.mock("@/lib/react-query/booking", () => ({
  useGetBookings: () => mocks.query(),
  useCancelBooking: () => ({ mutateAsync: mocks.cancel, isPending: false }),
  useRespondToBookingProposal: () => ({ mutateAsync: mocks.respond, isPending: false }),
}));

vi.mock("@/components/bookings/BookingPaymentDialog", () => ({
  default: () => null,
}));

const linkedStudentBooking = {
  id: 101,
  lesson_id: 7,
  student_id: 42,
  booked_by_type: "App\\Models\\Family",
  booked_by_id: 3,
  booking_type: "private" as const,
  status: "pending_teacher_approval" as const,
  requested_start_at: "2026-10-14T16:00:00.000Z",
  proposed_start_at: null,
  confirmed_start_at: null,
  duration_minutes: 60,
  price: "250.00",
  lesson: { id: 7, title: "Algebra lesson" },
  student: { id: 42, name: "Linked child" },
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <I18nProvider>
        <Bookings />
      </I18nProvider>
    </MemoryRouter>,
  );

describe("Parent bookings page", () => {
  beforeEach(() => {
    localStorage.setItem("elmullim-language", "en");
    mocks.role = "parent";
    mocks.cancel.mockReset().mockResolvedValue({ status: true });
    mocks.respond.mockReset().mockResolvedValue({ status: true });
    mocks.refetch.mockReset();
    mocks.query.mockReturnValue({
      data: {
        status: true,
        message: null,
        data: [linkedStudentBooking],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 25,
          total: 1,
          from: 1,
          to: 1,
          has_more_pages: false,
        },
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: mocks.refetch,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows which linked student a booking belongs to", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "My Bookings" })).toBeInTheDocument();
    expect(screen.getByText("Linked child")).toBeInTheDocument();
    expect(screen.getByText("Algebra lesson")).toBeInTheDocument();
  });

  it("requires confirmation before cancelling a booking", async () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(confirm).toHaveBeenCalledWith("Are you sure you want to cancel this booking?");
    expect(mocks.cancel).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() =>
      expect(mocks.cancel).toHaveBeenCalledWith({
        token: "parent-token",
        bookingId: linkedStudentBooking.id,
      }),
    );
  });
});
