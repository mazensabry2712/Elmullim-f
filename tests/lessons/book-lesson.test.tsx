import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookLessonDialog from "@/components/lessons/BookLessonDialog";

const mocks = vi.hoisted(() => ({
  role: "student" as "student" | "parent",
  mutateAsync: vi.fn(),
  get: vi.fn(),
  availability: vi.fn(),
}));

vi.mock("@/lib/react-query/booking", () => ({
  useCreateBooking: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }),
}));

vi.mock("@/lib/react-query/lessons/lessons", () => ({
  useGetLessonAvailability: () => mocks.availability(),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => "test-token",
    getRole: () => mocks.role,
  },
}));

vi.mock("@/config/axios.config", () => ({
  default: {
    get: mocks.get,
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
    mocks.get.mockReset();
    mocks.get.mockResolvedValue({ data: { data: { id: 42 } } });
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
  });

  it("opens, shows available times for a date, and submits the selected slot", async () => {
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

    await waitFor(() => expect(screen.getByRole("option", { name: /18:00/ })).toBeInTheDocument());
    fireEvent.change(screen.getByRole("combobox", { name: "Choose available time" }), {
      target: { value: "18:00|Africa/Cairo" },
    });
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
    mocks.get.mockResolvedValueOnce({
      data: {
        data: {
          students: [
            { id: 42, name: "Child One" },
            { id: 43, name: "Child Two" },
          ],
        },
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
    await waitFor(() => expect(screen.getByRole("option", { name: /18:00/ })).toBeInTheDocument());
    fireEvent.change(screen.getByRole("combobox", { name: "Choose available time" }), { target: { value: "18:00|Africa/Cairo" } });
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

  it("captures student location for teacher-to-student offline lessons", async () => {
    render(
      <BookLessonDialog
        lessonId={9}
        bookingType="private"
        deliveryMode="offline"
        offlineVisitType="teacher_goes_to_student"
        price="300.00"
        durationMinutes={60}
        language="en"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Book now" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("Choose date"), {
      target: { value: "2099-01-10" },
    });
    await waitFor(() => expect(screen.getByRole("option", { name: /18:00/ })).toBeInTheDocument());
    fireEvent.change(screen.getByRole("combobox", { name: "Choose available time" }), {
      target: { value: "18:00|Africa/Cairo" },
    });

    const location = screen.getByPlaceholderText("Enter the area/address where the lesson will take place");
    fireEvent.change(location, { target: { value: "Nasr City, Cairo" } });

    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() =>
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        token: "test-token",
        lessonId: 9,
        booking: {
          student_id: 42,
          requested_start_at: expect.stringMatching(/^2099-01-10T16:00:00\.000Z$/),
          student_location: "Nasr City, Cairo",
        },
      })
    );
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
    expect(screen.getByLabelText("اختر الموعد المتاح")).toBeInTheDocument();
    expect(screen.getByText("السعر: 0 جنيه")).toBeInTheDocument();
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
