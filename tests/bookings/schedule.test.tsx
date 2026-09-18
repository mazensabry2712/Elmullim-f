import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Schedule from "@/pages/bookings/Schedule";
import { I18nProvider } from "@/i18n";

const mocks = vi.hoisted(() => ({
  role: "student" as "student" | "teacher",
  getSchedule: vi.fn(),
  getTeacherSchedule: vi.fn(),
  updateStatus: vi.fn(),
  markAttendance: vi.fn(),
  join: vi.fn(),
  getToken: vi.fn(),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => mocks.getToken(),
    getRole: () => mocks.role,
  },
}));

vi.mock("@/lib/react-query/booking", () => ({
  useGetSchedule: () => ({ data: mocks.getSchedule(), isLoading: false, isFetching: false, isError: false }),
  useGetTeacherSchedule: () => ({ data: mocks.getTeacherSchedule(), isLoading: false, isFetching: false, isError: false }),
  useMarkSessionAttendance: () => ({ mutateAsync: mocks.markAttendance, isPending: false }),
  useUpdateSessionStatus: () => ({ mutateAsync: mocks.updateStatus, isPending: false }),
}));

vi.mock("@/services/booking", () => ({
  joinBookingSession: mocks.join,
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

describe("Schedule", () => {
  beforeEach(() => {
    vi.spyOn(window, "open").mockImplementation(() => null);
    localStorage.setItem("elmullim-language", "en");
    mocks.role = "student";
    mocks.getToken.mockReturnValue("token");
    mocks.getSchedule.mockReturnValue({
      status: true,
      message: null,
      data: [
        {
          id: 1,
          lesson_id: 15,
          start_at: "2099-01-10T20:00:00Z",
          end_at: "2099-01-10T21:00:00Z",
          status: "upcoming",
          meeting_url: "https://meet.example.test/1",
          bookings: [{ id: 99, student_id: 42, student: { id: 42, name: "Student" }, status: "confirmed" }],
          lesson: { id: 15, title: "Frontend Development" },
        },
      ],
    });
    mocks.getTeacherSchedule.mockReturnValue({ status: true, message: null, data: [] });
    mocks.join.mockReset();
    mocks.join.mockResolvedValue({ status: true, message: null, data: { session_id: 1, meeting_url: "https://meet.example.test/1", start_at: "2099-01-10T20:00:00Z", end_at: "2099-01-10T21:00:00Z" } });
    mocks.markAttendance.mockReset();
    mocks.markAttendance.mockResolvedValue({ status: true, message: "Attendance saved." });
    mocks.updateStatus.mockReset();
    mocks.updateStatus.mockResolvedValue({ status: true, message: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("allows a student to join an upcoming scheduled session", async () => {
    render(<I18nProvider><Schedule /></I18nProvider>);

    fireEvent.click(screen.getByRole("button", { name: "Join session" }));

    await waitFor(() => expect(mocks.join).toHaveBeenCalledWith({ token: "token", bookingId: 99 }));
  });

  it("allows a teacher to mark attendance", async () => {
    mocks.role = "teacher";
    mocks.getTeacherSchedule.mockReturnValue({
      status: true,
      message: null,
      data: [{
        id: 2,
        lesson_id: 15,
        start_at: "2099-01-10T20:00:00Z",
        end_at: "2099-01-10T21:00:00Z",
        status: "in_progress",
        bookings: [{ id: 77, student_id: 42, student: { id: 42, name: "Student" }, status: "in_progress" }],
        attendances: [],
        lesson: { id: 15, title: "Frontend Development" }
      }],
    });
    render(<I18nProvider><Schedule /></I18nProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Present" }));
    await waitFor(() => expect(mocks.markAttendance).toHaveBeenCalledWith({
      token: "token",
      sessionId: 2,
      bookingId: 77,
      status: "present",
    }));
  });

  it("allows a teacher to start an upcoming session", async () => {
    mocks.role = "teacher";
    mocks.getTeacherSchedule.mockReturnValue({
      status: true,
      message: null,
      data: [{ id: 2, lesson_id: 15, start_at: "2099-01-10T20:00:00Z", end_at: "2099-01-10T21:00:00Z", status: "upcoming", bookings: [], lesson: { id: 15, title: "Frontend Development" } }],
    });

    render(<I18nProvider><Schedule /></I18nProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Start session" }));

    await waitFor(() => expect(mocks.updateStatus).toHaveBeenCalledWith({ token: "token", sessionId: 2, status: "in_progress" }));
  });
  it("renders the student schedule in Arabic", () => {
    localStorage.setItem("elmullim-language", "ar");
    render(<I18nProvider><Schedule /></I18nProvider>);
    expect(screen.getByRole("heading", { name: "جدولي" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "الانضمام إلى الحصة" })).toBeInTheDocument();
  });

});
