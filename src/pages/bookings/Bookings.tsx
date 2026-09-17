import { Link } from "react-router-dom";
import { useState } from "react";
import { CalendarDays, Loader, XCircle } from "lucide-react";
import cookieService from "@/utils/cookieService";
import { useCancelBooking, useGetBookings, useRespondToBookingProposal } from "@/lib/react-query/booking";
import { IBooking } from "@/interfaces/bookings/booking";
import BookingPaymentDialog from "@/components/bookings/BookingPaymentDialog";

const statusLabel: Record<IBooking["status"], string> = {
  booking_requested: "Booking requested",
  pending_teacher_approval: "Pending teacher approval",
  accepted: "Accepted — payment required",
  confirmed: "Confirmed",
  upcoming: "Upcoming",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
  rescheduled: "Rescheduled",
  no_show: "No show",
  disputed: "Disputed",
};

const canCancel = (status: IBooking["status"]) =>
  ["booking_requested", "pending_teacher_approval", "accepted", "rescheduled"].includes(status);

const isParentBooker = (booking: IBooking) => booking.booked_by_type?.endsWith("\\Family") ?? false;

const canPay = (booking: IBooking) =>
  Number(booking.price) > 0 &&
  (booking.status === "accepted" || (booking.booking_type === "group" && booking.status === "booking_requested"));

const Bookings = () => {
  const token = cookieService.getToken() || "";
  const role = cookieService.getRole();
  const { data, isLoading, isError, refetch } = useGetBookings({ token, enabled: !!token });
  const cancelMutation = useCancelBooking();
  const respondMutation = useRespondToBookingProposal();
  const [error, setError] = useState("");

  const bookings = data?.data ?? [];

  const cancel = async (bookingId: number) => {
    setError("");
    try {
      await cancelMutation.mutateAsync({ token, bookingId });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not cancel booking.");
    }
  };

  const respond = async (bookingId: number, decision: "accept" | "reject") => {
    setError("");
    try {
      await respondMutation.mutateAsync({ token, bookingId, decision });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update booking.");
    }
  };

  return (
    <main className="bg-white min-h-screen py-12">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-black-blue">My Bookings</h1>
            <p className="mt-3 font-sora text-[#4D5756]">
              {role === "parent" ? "Manage bookings created for your linked students." : "Track your lesson booking requests and status."}
            </p>
          </div>
          <Link to="/schedule" className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-300 px-4 py-2 font-sora">
            <CalendarDays size={18} />
            View schedule
          </Link>
        </div>

        {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">{error}</div>}

        {isLoading && (
          <div className="py-16 text-center" role="status"><Loader className="mx-auto animate-spin" size={36} /></div>
        )}

        {isError && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6" role="alert">
            <p>Could not load your bookings.</p>
            <button type="button" onClick={() => refetch()} className="mt-3 rounded-md bg-main px-4 py-2 text-white">Retry</button>
          </div>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center font-sora text-[#4D5756]">No bookings found.</div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-xl border border-gray-200 bg-[#F0F1F1] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-black-blue">{booking.lesson?.title ?? `Lesson #${booking.lesson_id}`}</h2>
                  {role === "parent" && booking.student?.name && <p className="mt-1 font-sora text-sm text-[#4D5756]">Student: {booking.student.name}</p>}
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-main">{statusLabel[booking.status]}</span>
              </div>

              <div className="mt-5 space-y-2 font-sora text-sm text-[#4D5756]">
                <p>Type: {booking.booking_type}</p>
                <p>Requested: {new Date(booking.requested_start_at).toLocaleString()}</p>
                {booking.proposed_start_at && <p>Proposed: {new Date(booking.proposed_start_at).toLocaleString()}</p>}
                {booking.confirmed_start_at && <p>Confirmed: {new Date(booking.confirmed_start_at).toLocaleString()}</p>}
                <p>Price: {booking.price} EGP</p>
                {booking.teacher_note && <p>Teacher note: {booking.teacher_note}</p>}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {booking.status === "rescheduled" && (
                  <>
                    <button type="button" onClick={() => respond(booking.id, "accept")} disabled={respondMutation.isPending} className="rounded-md bg-main px-4 py-2 text-white disabled:opacity-60">Accept new time</button>
                    <button type="button" onClick={() => respond(booking.id, "reject")} disabled={respondMutation.isPending} className="rounded-md border border-gray-300 bg-white px-4 py-2 disabled:opacity-60">Reject new time</button>
                  </>
                )}

                {canPay(booking) && (role === "student" || (role === "parent" && isParentBooker(booking))) && (
                  <BookingPaymentDialog bookingId={booking.id} price={booking.price} isParent={role === "parent"} />
                )}

                {canCancel(booking.status) && (
                  <button type="button" onClick={() => cancel(booking.id)} disabled={cancelMutation.isPending} className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-red-600 disabled:opacity-60">
                    <XCircle size={17} />
                    Cancel
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Bookings;
