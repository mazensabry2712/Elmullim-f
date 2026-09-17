import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookLessonDialog from "@/components/lessons/BookLessonDialog";

const mocks = vi.hoisted(() => ({
  role: "student" as "student" | "parent",
  mutateAsync: vi.fn(),
  get: vi.fn(),
}));

vi.mock("@/lib/react-query/booking", () => ({
  useCreateBooking: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }),
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
  });

  it("opens, accepts a requested time, and submits a booking for the student", async () => {
    render(
      <BookLessonDialog
        lessonId={7}
        bookingType="private"
        price="250.00"
        language="en"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Book now" }));

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("Requested date & time"), {
      target: { value: "2099-01-10T20:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() =>
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        token: "test-token",
        lessonId: 7,
        booking: {
          student_id: 42,
          requested_start_at: new Date("2099-01-10T20:00").toISOString(),
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
        language="en"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Book now" }));
    await waitFor(() => expect(screen.getByRole("combobox", { name: "Choose student" })).toBeInTheDocument());

    fireEvent.change(screen.getByRole("combobox", { name: "Choose student" }), {
      target: { value: "43" },
    });
    fireEvent.change(screen.getByLabelText("Requested date & time"), {
      target: { value: "2099-01-11T20:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit booking" }));

    await waitFor(() =>
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        token: "test-token",
        lessonId: 8,
        booking: {
          student_id: 43,
          requested_start_at: new Date("2099-01-11T20:00").toISOString(),
        },
      })
    );
  });
});
