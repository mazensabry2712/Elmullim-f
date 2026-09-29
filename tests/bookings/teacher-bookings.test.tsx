import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TeacherBookings from "@/pages/profile/teacher/TeacherBookings";
import { I18nProvider } from "@/i18n";
import { dateTimeLocalToIso } from "@/utils/dateTime";

const mocks = vi.hoisted(() => ({
  role: "teacher",
  getToken: vi.fn(),
  getTeacherBookings: vi.fn(),
  acceptBooking: vi.fn(),
  rejectBooking: vi.fn(),
  proposeBookingTime: vi.fn(),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => mocks.getToken(),
    getRole: () => mocks.role,
  },
}));

vi.mock("@/lib/react-query/booking", () => ({
  useGetTeacherBookings: () => ({
    data: mocks.getTeacherBookings(),
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useAcceptBooking: () => ({ mutateAsync: mocks.acceptBooking, isPending: false }),
  useRejectBooking: () => ({ mutateAsync: mocks.rejectBooking, isPending: false }),
  useProposeBookingTime: () => ({ mutateAsync: mocks.proposeBookingTime, isPending: false }),
}));

describe("TeacherBookings", () => {
  beforeEach(() => {
    mocks.getToken.mockReturnValue("token");
    mocks.getTeacherBookings.mockReturnValue({
      status: true,
      message: null,
      data: [{
        id: 7,
        lesson_id: 15,
        student_id: 42,
        booked_by_type: "student",
        booked_by_id: 42,
        booking_type: "private",
        status: "pending_teacher_approval",
        requested_start_at: "2099-01-10T16:00:00.000Z",
        price: "250.00",
        lesson: { id: 15, title: "Mathematics" },
        student: { id: 42, name: "Student One" },
      }],
    });
    mocks.acceptBooking.mockResolvedValue({ status: true, message: null });
    mocks.rejectBooking.mockResolvedValue({ status: true, message: null });
    mocks.proposeBookingTime.mockResolvedValue({ status: true, message: null });
  });

  it("submits a teacher proposal as the browser-local datetime converted to ISO", async () => {
    render(<I18nProvider><TeacherBookings /></I18nProvider>);

    const input = screen.getByLabelText("New time");
    const proposedValue = "2099-01-10T18:30";
    fireEvent.change(input, { target: { value: proposedValue } });
    fireEvent.click(screen.getByRole("button", { name: "Propose time" }));

    await waitFor(() => expect(mocks.proposeBookingTime).toHaveBeenCalledWith({
      token: "token",
      bookingId: 7,
      proposedStartAt: dateTimeLocalToIso(proposedValue),
      teacherNote: undefined,
    }));
  });

  it("uses a local datetime minimum rather than a UTC ISO minimum", () => {
    render(<I18nProvider><TeacherBookings /></I18nProvider>);

    const input = screen.getByLabelText("New time") as HTMLInputElement;
    expect(input.min).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(input.min).not.toContain("Z");
  });
});
