import { useState } from "react";
import { Loader } from "lucide-react";
import cookieService from "@/utils/cookieService";
import {
  useAcceptBooking,
  useGetTeacherBookings,
  useProposeBookingTime,
  useRejectBooking,
} from "@/lib/react-query/booking";
import { IBooking } from "@/interfaces/bookings/booking";

const TeacherBookings = () => {
  const token = cookieService.getToken() || "";
  const { data, isLoading, isError, refetch } = useGetTeacherBookings({ token, enabled: !!token });
  const acceptMutation = useAcceptBooking();
  const rejectMutation = useRejectBooking();
  const proposeMutation = useProposeBookingTime();
  const [note, setNote] = useState<Record<number, string>>({});
  const [proposedTime, setProposedTime] = useState<Record<number, string>>({});
  const [error, setError] = useState("");

  const bookings = data?.data ?? [];

  const run = async (action: () => Promise<unknown>) => {
    setError("");
    try {
      await action();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update booking.");
    }
  };

  return (
    <main className="bg-white min-h-screen py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-black-blue">Lesson Bookings</h1>
          <p className="mt-3 font-sora text-[#4D5756]">Review requests and manage your lesson booking schedule.</p>
        </div>

        {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">{error}</div>}

        {isLoading && (
          <div className="py-16 text-center" role="status"><Loader className="mx-auto animate-spin" size={36} /></div>
        )}

        {isError && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6" role="alert">
            <p>Could not load lesson bookings.</p>
            <button type="button" onClick={() => refetch()} className="mt-3 rounded-md bg-main px-4 py-2 text-white">Retry</button>
          </div>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center font-sora text-[#4D5756]">No bookings found.</div>
        )}

        <div className="grid gap-5">
          {bookings.map((booking: IBooking) => {
            const pendingApproval = booking.status === "pending_teacher_approval";
            return (
              <article key={booking.id} className="rounded-xl border border-gray-200 bg-[#F0F1F1] p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-black-blue">{booking.lesson?.title ?? `Lesson #${booking.lesson_id}`}</h2>
                    <p className="mt-1 font-sora text-sm text-[#4D5756]">Student: {booking.student?.name ?? `#${booking.student_id}`}</p>
                    <p className="mt-1 font-sora text-sm text-[#4D5756]">Requested: {new Date(booking.requested_start_at).toLocaleString()}</p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-main">{booking.status}</span>
                </div>

                {booking.teacher_note && <p className="mt-4 rounded-md bg-white p-3 font-sora text-sm">{booking.teacher_note}</p>}

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div>
                    <label htmlFor={`proposed-${booking.id}`} className="block text-sm font-medium">New time</label>
                    <input
                      id={`proposed-${booking.id}`}
                      type="datetime-local"
                      value={proposedTime[booking.id] ?? ""}
                      min={new Date().toISOString().slice(0, 16)}
                      onChange={(event) => setProposedTime((current) => ({ ...current, [booking.id]: event.target.value }))}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`note-${booking.id}`} className="block text-sm font-medium">Teacher note</label>
                    <textarea
                      id={`note-${booking.id}`}
                      value={note[booking.id] ?? ""}
                      onChange={(event) => setNote((current) => ({ ...current, [booking.id]: event.target.value }))}
                      rows={3}
                      maxLength={5000}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {pendingApproval && (
                    <button
                      type="button"
                      onClick={() => run(() => acceptMutation.mutateAsync({ token, bookingId: booking.id }))}
                      disabled={acceptMutation.isPending}
                      className="rounded-md bg-main px-4 py-2 text-white disabled:opacity-60"
                    >
                      Accept
                    </button>
                  )}
                  {pendingApproval && (
                    <button
                      type="button"
                      onClick={() => run(() => rejectMutation.mutateAsync({ token, bookingId: booking.id, teacherNote: note[booking.id] }))}
                      disabled={rejectMutation.isPending}
                      className="rounded-md border border-red-200 bg-white px-4 py-2 text-red-600 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const value = proposedTime[booking.id];
                      if (!value) {
                        setError("Choose a new date and time first.");
                        return;
                      }
                      void run(() => proposeMutation.mutateAsync({
                        token,
                        bookingId: booking.id,
                        proposedStartAt: new Date(value).toISOString(),
                        teacherNote: note[booking.id],
                      }));
                    }}
                    disabled={proposeMutation.isPending}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 disabled:opacity-60"
                  >
                    Propose new time
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default TeacherBookings;
