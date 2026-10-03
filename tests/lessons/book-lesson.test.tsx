import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookLessonDialog from "@/components/lessons/BookLessonDialog";

const mocks = vi.hoisted(() => ({
  role: "student" as "student" | "parent",
  mutateAsync: vi.fn(),
  availability: vi.fn(),
  bookingOptions: vi.fn(),
  studentProfile: vi.fn(),
  parentProfile: vi.fn(),
}));

vi.mock("@/lib/react-query/booking", () => ({
  useCreateBooking: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }),
}));

vi.mock("@/lib/react-query/lessons/lessons", () => ({
  useGetLessonAvailability: () => mocks.availability(),
  useGetLessonBookingOptions: () => mocks.bookingOptions(),
}));

vi.mock("@/lib/react-query/student/studentProfile", () => ({
  useGetStudentProfile: () => mocks.studentProfile(),
}));

vi.mock("@/lib/react-query/parent/parentProfile", () => ({
  useGetParentProfile: () => mocks.parentProfile(),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => "test-token",
    getRole: () => mocks.role,
  },
}));

describe("BookLessonDialog", () => {
  beforeEach(() => {
    mocks.role = "student";
    mocks.mutateAsync.mockReset();
    mocks.mutateAsync.mockResolvedValue({
      status: true,
      message: "Booking created successfully.",
      data: { status: "pending_teacher_approval" },
    });
    mocks.studentProfile.mockReset();
    mocks.studentProfile.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          id: 42,
          name: "Student One",
          address: "Nasr City, Cairo",
          latitude: 30.0444,
          longitude: 31.2357,
        },
      },
    });
    mocks.parentProfile.mockReset();
    mocks.parentProfile.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          students: [],
        },
      },
    });
    mocks.availability.mockReset();
    mocks.availability.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        status: true,
        message: null,
        data: [
          {
            id: 1,
            lesson_id: 7,
            day_of_week: 6,
            start_time: "18:00:00",
            end_time: "20:00:00",
            timezone: "Africa/Cairo",
            is_active: true,
          },
          {
            id: 2,
            lesson_id: 8,
            day_of_week: 7,
            start_time: "18:00:00",
            end_time: "20:00:00",
            timezone: "Africa/Cairo",
            is_active: true,
          },
        ],
      },
    });

    mocks.bookingOptions.mockReturnValue({
      isLoading: false,
      data: {
        status: true,
        message: null,
        data: [],
      },
    });
  });

  it("opens, shows available times for a date, and submits the selected slot", async () => {
    mocks.bookingOptions.mockReturnValue({
      isLoading: false,
      data: {
        status: true,
        message: null,
        data: [{
          slot_id: 1,
          local_time: "18:00",
          requested_start_at: "2099-01-10T16:00:00.000Z",
          available_seats: null,
          is_available: true,
          timezone: "Africa/Cairo",
        }],
      },
    });
    render(
      <BookLessonDialog
        lessonId={7}
        bookingType="private"
        price="250.00"
        durationMinutes={60}
        language="en"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Book now" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("Choose date"), {
      target: { value: "2099-01-10" },
    });

    const timeButton = await screen.findByRole("button", { name: /18:00/ });
    expect(timeButton).toBeInTheDocument();
    fireEvent.click(timeButton);
    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() =>
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        token: "test-token",
        lessonId: 7,
        booking: {
          student_id: 42,
          requested_start_at: expect.stringMatching(/^2099-01-10T16:00:00\.000Z$/),
        },
      })
    );
  });

  it("loads linked students and submits the selected child for a parent", async () => {
    mocks.role = "parent";
    mocks.parentProfile.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          students: [
            { id: 42, name: "Child One", address: "Nasr City, Cairo", latitude: 30.0444, longitude: 31.2357 },
            { id: 43, name: "Child Two", address: "Dokki, Giza", latitude: 30.0383, longitude: 31.2114 },
          ],
        },
      },
    });

    mocks.bookingOptions.mockReturnValue({
      isLoading: false,
      data: {
        status: true,
        message: null,
        data: [{
          slot_id: 1,
          local_time: "18:00",
          requested_start_at: "2099-01-11T16:00:00.000Z",
          available_seats: 4,
          is_available: true,
          timezone: "Africa/Cairo",
        }],
      },
    });

    render(
      <BookLessonDialog
        lessonId={8}
        bookingType="group"
        price="500.00"
        durationMinutes={60}
        language="en"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Book now" }));
    await waitFor(() => expect(screen.getByRole("combobox", { name: "Choose student" })).toBeInTheDocument());

    fireEvent.change(screen.getByRole("combobox", { name: "Choose student" }), { target: { value: "43" } });
    fireEvent.change(screen.getByLabelText("Choose date"), { target: { value: "2099-01-11" } });
    fireEvent.click(await screen.findByRole("button", { name: /18:00/ }));
    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() =>
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        token: "test-token",
        lessonId: 8,
        booking: {
          student_id: 43,
          requested_start_at: expect.stringMatching(/^2099-01-11T16:00:00\.000Z$/),
        },
      })
    );
  });

  it("uses the saved student location for teacher-to-student offline lessons", async () => {
    mocks.bookingOptions.mockReturnValue({
      isLoading: false,
      data: {
        status: true,
        message: null,
        data: [{
          slot_id: 1,
          local_time: "18:00",
          requested_start_at: "2099-01-10T16:00:00.000Z",
          available_seats: null,
          is_available: true,
          timezone: "Africa/Cairo",
        }],
      },
    });
    render(
      <BookLessonDialog
        lessonId={9}
        bookingType="private"
        deliveryMode="offline"
        offlineVisitType="teacher_to_student"
        price="300.00"
        durationMinutes={60}
        language="en"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Book now" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByText(/saved profile location is used automatically/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Choose date"), {
      target: { value: "2099-01-10" },
    });
    fireEvent.click(await screen.findByRole("button", { name: /18:00/ }));

    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() =>
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        token: "test-token",
        lessonId: 9,
        booking: {
          student_id: 42,
          requested_start_at: expect.stringMatching(/^2099-01-10T16:00:00\.000Z$/),
        },
      })
    );
  });

  it("disables teacher-to-student booking until the student profile location is complete", async () => {
    mocks.studentProfile.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: {
          id: 42,
          name: "Student One",
          address: "",
          latitude: 30.0444,
          longitude: 31.2357,
        },
      },
    });
    mocks.bookingOptions.mockReturnValue({
      isLoading: false,
      data: {
        status: true,
        message: null,
        data: [{
          slot_id: 1,
          local_time: "18:00",
          requested_start_at: "2099-01-10T16:00:00.000Z",
          available_seats: null,
          is_available: true,
          timezone: "Africa/Cairo",
        }],
      },
    });

    render(
      <BookLessonDialog
        lessonId={11}
        bookingType="private"
        deliveryMode="offline"
        offlineVisitType="teacher_to_student"
        price="300.00"
        durationMinutes={60}
        language="en"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Book now" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText("Choose date"), { target: { value: "2099-01-10" } });
    fireEvent.click(await screen.findByRole("button", { name: /18:00/ }));

    expect(screen.getByRole("button", { name: "Submit booking" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it("shows server-provided seats for group booking options", async () => {
    mocks.bookingOptions.mockReturnValue({
      isLoading: false,
      data: {
        status: true,
        message: null,
        data: [{
          slot_id: 1,
          local_time: "18:00",
          requested_start_at: "2099-01-10T16:00:00.000Z",
          available_seats: 2,
          is_available: true,
          timezone: "Africa/Cairo",
        }],
      },
    });

    render(
      <BookLessonDialog
        lessonId={10}
        bookingType="group"
        price="0"
        durationMinutes={60}
        language="en"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Book now" }));
    fireEvent.change(await screen.findByLabelText("Choose date"), { target: { value: "2099-01-10" } });

    expect(await screen.findByRole("button", { name: /18:00.*2 seats available/ })).toBeInTheDocument();
  });

  it("renders Arabic booking labels consistently", async () => {
    render(
      <BookLessonDialog
        lessonId={7}
        bookingType="private"
        price="0"
        durationMinutes={60}
        language="ar"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "احجز الآن" }));

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByRole("heading", { name: "حجز الدرس" })).toBeInTheDocument();
    expect(screen.getByLabelText("اختر التاريخ")).toBeInTheDocument();
    expect(screen.getByText("اختر الموعد المتاح")).toBeInTheDocument();
    expect(screen.getByText("0 جنيه")).toBeInTheDocument();
    expect(screen.getByText("هذا درس خاص ويحتاج إلى موافقة المعلم.")).toBeInTheDocument();
  });

  it("does not offer times on a day without matching availability", async () => {
    render(
      <BookLessonDialog
        lessonId={7}
        bookingType="group"
        price="0"
        durationMinutes={60}
        language="en"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Book now" }));
    fireEvent.change(await screen.findByLabelText("Choose date"), { target: { value: "2099-01-12" } });

    await waitFor(() => expect(screen.getByText("No available times for this date.")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Submit booking" })).toBeDisabled();
  });
});
