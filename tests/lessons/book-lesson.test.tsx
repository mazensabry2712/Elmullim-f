import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import BookLessonDialog from "@/components/lessons/BookLessonDialog";

const mutateAsync = vi.fn().mockResolvedValue({
  status: true,
  message: "Booking created successfully.",
  data: { status: "pending_teacher_approval" },
});

vi.mock("@/lib/react-query/booking", () => ({
  useCreateBooking: () => ({ mutateAsync, isPending: false }),
}));

vi.mock("@/utils/cookieService", () => ({
  default: {
    getToken: () => "test-token",
    getRole: () => "student",
  },
}));

vi.mock("@/config/axios.config", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: { id: 42 } } }),
  },
}));

describe("BookLessonDialog", () => {
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
      expect(mutateAsync).toHaveBeenCalledWith({
        token: "test-token",
        lessonId: 7,
        booking: {
          student_id: 42,
          requested_start_at: new Date("2099-01-10T20:00").toISOString(),
        },
      })
    );
  });
});
