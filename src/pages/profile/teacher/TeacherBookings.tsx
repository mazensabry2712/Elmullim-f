import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import cookieService from "@/utils/cookieService";
import {
  useAcceptBooking,
  useGetTeacherBookings,
  useProposeBookingTime,
  useRejectBooking,
} from "@/lib/react-query/booking";
import { IBooking } from "@/interfaces/bookings/booking";
import { useSearchParams } from "react-router-dom";
import { getBookingCopy } from "@/pages/bookings/bookingCopy";
import { dateTimeLocalToIso, formatDateTime, formatDateTimeLocalInput } from "@/utils/dateTime";

const TeacherBookings = () => {
  const { language } = useI18n();
  const copy = getBookingCopy(language).teacherBookings;
  const token = cookieService.getToken() || "";
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const lessonIdParam = Number(searchParams.get("lesson_id"));
  const lessonId = Number.isInteger(lessonIdParam) && lessonIdParam > 0 ? lessonIdParam : undefined;
  const { data, isLoading, isFetching, isError, refetch } = useGetTeacherBookings({
    token,
    page,
    lessonId,
    enabled: !!token,
  });

  useEffect(() => {
    setPage(1);
  }, [lessonId]);
  const acceptMutation = useAcceptBooking();
  const rejectMutation = useRejectBooking();
  const proposeMutation = useProposeBookingTime();
  const [note, setNote] = useState<Record<number, string>>({});
  const [proposedTime, setProposedTime] = useState<Record<number, string>>({});
  const [error, setError] = useState("");

  const bookings = data?.data ?? [];
  const pagination = data?.meta;
  const isPaginating = isFetching && !isLoading;
  const minimumProposalTime = formatDateTimeLocalInput();

  const run = async (action: () => Promise<unknown>) => {
    setError("");
    try {
      await action();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : copy.couldNotUpdate);
    }
  };

  return (
    <main className="bg-white min-h-screen py-12">
      <div className="container">
        <div className="mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-black-blue">{copy.title}</h1>
              <p className="mt-3 font-sora text-[#4D5756]">{copy.description}</p>
            </div>
            {lessonId ? (
              <a
                href="/profile/teacher/bookings"
                className="inline-flex w-fit items-center rounded-xl border border-black-blue/10 bg-white px-4 py-2.5 text-sm font-bold text-black-blue transition hover:border-main hover:text-main"
              >
                {language === "ar" ? "عرض كل الحجوزات" : "View all bookings"}
              </a>
            ) : null}
          </div>
          {lessonId ? (
            <div className="mt-4 rounded-2xl border border-main/10 bg-main/[0.04] px-4 py-3 text-sm font-bold text-main">
              {language === "ar"
                ? `الحجوزات الخاصة بالدرس #${lessonId}`
                : `Showing bookings for lesson #${lessonId}`}
            </div>
          ) : null}
        </div>

        {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">{error}</div>}

        {isLoading && (
          <div className="py-16 text-center" role="status"><Loader className="mx-auto animate-spin" size={36} /></div>
        )}

        {isError && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6" role="alert">
            <p>{copy.couldNotLoad}</p>
            <button type="button" onClick={() => refetch()} className="mt-3 rounded-md bg-main px-4 py-2 text-white">{copy.retry}</button>
          </div>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center font-sora text-[#4D5756]">{copy.noBookings}</div>
        )}

        <div className="grid gap-5">
          {bookings.map((booking: IBooking) => {
            const pendingApproval = booking.status === "pending_teacher_approval";
            return (
              <article key={booking.id} className="rounded-xl border border-gray-200 bg-[#F0F1F1] p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-black-blue">{booking.lesson?.title ?? `${getBookingCopy(language).bookings.lesson} #${booking.lesson_id}`}</h2>
                    <p className="mt-1 font-sora text-sm text-[#4D5756]">{copy.student}: {booking.student?.name ?? `#${booking.student_id}`}</p>
                    <p className="mt-1 font-sora text-sm text-[#4D5756]">{copy.requested}: {formatDateTime(booking.requested_start_at, language)}</p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-main">{getBookingCopy(language).bookings.status[booking.status]}</span>
                </div>

                {booking.teacher_note && <p className="mt-4 rounded-md bg-white p-3 font-sora text-sm">{booking.teacher_note}</p>}

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div>
                    <label htmlFor={`proposed-${booking.id}`} className="block text-sm font-medium">{copy.newTime}</label>
                    <input
                      id={`proposed-${booking.id}`}
                      type="datetime-local"
                      value={proposedTime[booking.id] ?? ""}
                      min={minimumProposalTime}
                      onChange={(event) => setProposedTime((current) => ({ ...current, [booking.id]: event.target.value }))}
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`note-${booking.id}`} className="block text-sm font-medium">{copy.note}</label>
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
                      {copy.accept}
                    </button>
                  )}
                  {pendingApproval && (
                    <button
                      type="button"
                      onClick={() => run(() => rejectMutation.mutateAsync({ token, bookingId: booking.id, teacherNote: note[booking.id] }))}
                      disabled={rejectMutation.isPending}
                      className="rounded-md border border-red-200 bg-white px-4 py-2 text-red-600 disabled:opacity-60"
                    >
                      {copy.reject}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const value = proposedTime[booking.id];
                      if (!value) {
                        setError(copy.chooseTime);
                        return;
                      }
                      const proposedStartAt = dateTimeLocalToIso(value);
                      if (!proposedStartAt) {
                        setError(copy.chooseTime);
                        return;
                      }
                      void run(() => proposeMutation.mutateAsync({
                        token,
                        bookingId: booking.id,
                        proposedStartAt,
                        teacherNote: note[booking.id],
                      }));
                    }}
                    disabled={proposeMutation.isPending}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 disabled:opacity-60"
                  >
                    {copy.propose}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {pagination && pagination.last_page > 1 && (
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-3" aria-label={copy.paginationLabel}>
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || isPaginating}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              {copy.previous}
            </button>
            <span className="font-sora text-sm text-[#4D5756]">
              {copy.page} {pagination.current_page} {copy.of} {pagination.last_page}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(pagination.last_page, current + 1))}
              disabled={!pagination.has_more_pages || isPaginating}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copy.next}
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </div>
    </main>
  );
};

export default TeacherBookings;
