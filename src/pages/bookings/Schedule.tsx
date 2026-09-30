import { useState } from "react";
import { useI18n } from "@/i18n";
import { useGetStudentProfile } from "@/lib/react-query/student/studentProfile";
import { useGetParentProfile } from "@/lib/react-query/parent/parentProfile";
import { useGetGivenRatings } from "@/lib/react-query/rating";
import type { RatingActorRole, RatingTargetType } from "@/services/rating";
import RatingDialog from "@/components/ratings/RatingDialog";
import { CalendarClock, ChevronLeft, ChevronRight, ExternalLink, Loader } from "lucide-react";
import { toast } from "react-toastify";
import cookieService from "@/utils/cookieService";
import {
  useGetSchedule,
  useGetTeacherSchedule,
  useMarkSessionAttendance,
  useUpdateSessionStatus,
  useUpdateSessionMeetingLink,
} from "@/lib/react-query/booking";
import { IBookingSession } from "@/interfaces/bookings/session";
import { joinBookingSession } from "@/services/booking";
import { getBookingCopy } from "@/pages/bookings/bookingCopy";
import { formatDateTime, formatTime } from "@/utils/dateTime";

const Schedule = () => {
  const { language } = useI18n();
  const copy = getBookingCopy(language).schedule;
  const token = cookieService.getToken() || "";
  const role = cookieService.getRole();
  const isTeacher = role === "teacher";
  const isStudent = role === "student";
  const isParent = role === "parent";
  const ratingRole: RatingActorRole = isTeacher ? "teacher" : isParent ? "parent" : "student";
  const studentProfile = useGetStudentProfile(token, isStudent);
  const parentProfile = useGetParentProfile(token, isParent);
  const linkedStudentIds = new Set(
    (parentProfile.data?.data?.students ?? [])
      .map((student) => student.id)
      .filter((id): id is number => typeof id === "number"),
  );
  const ownStudentId = studentProfile.data?.data?.id;
  const [page, setPage] = useState(1);
  const studentSchedule = useGetSchedule({ token, page, enabled: !!token && !isTeacher });
  const teacherSchedule = useGetTeacherSchedule({ token, page, enabled: !!token && isTeacher });
  const updateStatus = useUpdateSessionStatus();
  const updateMeetingLink = useUpdateSessionMeetingLink();
  const markAttendance = useMarkSessionAttendance();
  const [joinLoading, setJoinLoading] = useState<number | null>(null);
  const [attendancePending, setAttendancePending] = useState<string | null>(null);
  const [meetingLinks, setMeetingLinks] = useState<Record<number, string>>({});

  const data = (isTeacher ? teacherSchedule.data?.data : studentSchedule.data?.data) ?? [];
  const visibleBookingIds = Array.from(
    new Set(
      data.flatMap((session) =>
        (session.bookings ?? [])
          .filter((booking) => {
            if (isTeacher) return true;
            if (isStudent) return booking.student_id === ownStudentId;
            return linkedStudentIds.has(booking.student_id);
          })
          .map((booking) => booking.id),
      ),
    ),
  );
  const givenRatings = useGetGivenRatings(
    token,
    ratingRole,
    !!token && (isTeacher || isStudent || isParent),
    visibleBookingIds,
  );
  const ratingsReady =
    visibleBookingIds.length === 0 || givenRatings.isFetched || givenRatings.isError;
  const pagination = (isTeacher ? teacherSchedule.data?.meta : studentSchedule.data?.meta);
  const loading = isTeacher ? teacherSchedule.isLoading : studentSchedule.isLoading;
  const fetching = isTeacher ? teacherSchedule.isFetching : studentSchedule.isFetching;
  const error = isTeacher ? teacherSchedule.isError : studentSchedule.isError;
  const refetch = isTeacher ? teacherSchedule.refetch : studentSchedule.refetch;
  const isPaginating = fetching && !loading;

  const openMeeting = (meetingUrl?: string | null) => {
    const url = meetingUrl?.trim();
    if (!url) {
      toast.error(copy.meetingLinkMissing);
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const join = async (bookingId: number) => {
    setJoinLoading(bookingId);
    try {
      const response = await joinBookingSession({ token, bookingId });
      if (!response.status) {
        toast.error(response.message || copy.sessionUnavailable);
        return;
      }
      if (response.data?.meeting_url) {
        openMeeting(response.data.meeting_url);
      } else if (response.data?.location) {
        toast.info(response.data.location);
      } else {
        toast.info(copy.accessGranted);
      }
    } catch {
      toast.error(copy.couldNotOpen);
    } finally {
      setJoinLoading(null);
    }
  };

  const mark = async (sessionId: number, bookingId: number, status: "present" | "absent" | "no_show" | "excused") => {
    const key = `${sessionId}-${bookingId}`;
    setAttendancePending(key);
    try {
      await markAttendance.mutateAsync({ token, sessionId, bookingId, status });
      toast.success(copy.saved);
    } catch {
      toast.error(copy.couldNotSaveAttendance);
    } finally {
      setAttendancePending(null);
    }
  };

  const saveMeetingLink = async (session: IBookingSession) => {
    const meetingUrl = (meetingLinks[session.id] ?? session.meeting_url ?? "").trim();
    if (!meetingUrl) {
      toast.error(copy.meetingLinkMissing);
      return;
    }

    try {
      await updateMeetingLink.mutateAsync({ token, sessionId: session.id, meetingUrl });
      toast.success(copy.meetingLinkSaved);
    } catch {
      toast.error(copy.couldNotSaveMeetingLink);
    }
  };

  const update = async (session: IBookingSession, status: "in_progress" | "completed" | "cancelled") => {
    try {
      await updateStatus.mutateAsync({ token, sessionId: session.id, status });
      toast.success(`${copy.marked} ${copy.status[status]}.`);
    } catch {
      toast.error(copy.couldNotUpdate);
    }
  };

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-black-blue">
            {isTeacher ? copy.teacherTitle : copy.studentTitle}
          </h1>
          <p className="mt-3 font-sora text-[#4D5756]">
            {isTeacher ? copy.teacherDescription : copy.studentDescription}
          </p>
        </div>

        {loading && (
          <div className="py-16 text-center" role="status"><Loader className="mx-auto animate-spin" size={36} /></div>
        )}

        {isPaginating && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-[#F0F1F1] px-3 py-2 font-sora text-sm text-[#4D5756]" role="status">
            <Loader className="animate-spin" size={16} />
            {copy.opening}
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6" role="alert">
            <p>{copy.couldNotLoad}</p>
            <button type="button" onClick={() => void refetch()} className="mt-3 rounded-md bg-main px-4 py-2 text-white">
              {copy.retry}
            </button>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center font-sora text-[#4D5756]">
            {copy.noSessions}
          </div>
        )}

        <div className="space-y-5">
          {data.map((session) => {
            const bookings = session.bookings ?? [];
            const attendances = session.attendances ?? [];
            const teacherId = session.lesson?.teacher_id;

            return (
            <article key={session.id} className="rounded-xl border border-gray-200 bg-[#F0F1F1] p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarClock size={19} className="text-main" />
                    <h2 className="text-xl font-bold text-black-blue">{session.lesson?.title ?? `${getBookingCopy(language).bookings.lesson} #${session.lesson_id}`}</h2>
                  </div>
                  <p className="mt-2 font-sora text-sm text-[#4D5756]">
                    {formatDateTime(session.start_at, language)} → {formatTime(session.end_at, language)}
                  </p>
                  {bookings.length > 0 && (
                    <p className="mt-1 font-sora text-sm text-[#4D5756]">
                      {copy.students}: {bookings.map((item) => item.student?.name ?? `#${item.student_id}`).join(", ")}
                    </p>
                  )}
                  {!isTeacher && attendances.length > 0 && (
                    <p className="mt-2 font-sora text-sm text-[#4D5756]">
                      {copy.attendance}: {attendances.map((item) => `${item.student?.name ?? `#${item.student_id}`}: ${copy[item.status === "no_show" ? "noShow" : item.status]}`).join(", ")}
                    </p>
                  )}
                </div>
                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-main">{copy.status[session.status]}</span>
              </div>

              {isTeacher && session.lesson?.delivery_mode === "online" && (
                <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
                  <label className="block text-sm font-bold text-black-blue">
                    {copy.meetingLink}
                    <input
                      type="url"
                      value={meetingLinks[session.id] ?? session.meeting_url ?? ""}
                      onChange={(event) => setMeetingLinks((current) => ({ ...current, [session.id]: event.target.value }))}
                      placeholder={copy.meetingLinkPlaceholder}
                      className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-sora text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => void saveMeetingLink(session)}
                    disabled={updateMeetingLink.isPending}
                    className="mt-3 rounded-md bg-main px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {updateMeetingLink.isPending ? copy.opening : copy.saveMeetingLink}
                  </button>
                </div>
              )}

              {isTeacher && bookings.length > 0 && (
                <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="mb-3 text-sm font-bold text-black-blue">{copy.attendance}</h3>
                  <div className="space-y-3">
                    {bookings.map((booking) => {
                      const record = attendances.find((item) => item.booking_id === booking.id);
                      const studentName = booking.student?.name ?? `#${booking.student_id}`;
                      return (
                        <div key={booking.id} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <span className="font-sora text-sm text-[#4D5756]">{studentName}</span>
                          <div className="flex flex-wrap gap-2">
                            {([
                              ["present", copy.present],
                              ["absent", copy.absent],
                              ["no_show", copy.noShow],
                              ["excused", copy.excused],
                            ] as const).map(([status, label]) => {
                              const pending = attendancePending === `${session.id}-${booking.id}`;
                              return (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => void mark(session.id, booking.id, status)}
                                  disabled={pending}
                                  className={`rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${record?.status === status ? "bg-main text-white" : "border border-gray-300 bg-white text-black-blue"}`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {!isTeacher && bookings.map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => void join(booking.id)}
                    disabled={joinLoading === booking.id || !["upcoming", "in_progress"].includes(session.status)}
                    className="inline-flex items-center gap-2 rounded-md bg-main px-4 py-2 text-white disabled:opacity-50"
                  >
                    <ExternalLink size={17} />
                    {joinLoading === booking.id ? copy.opening : copy.join}
                  </button>
                ))}

                {isTeacher && session.meeting_url && (
                  <button
                    type="button"
                    onClick={() => openMeeting(session.meeting_url)}
                    className="inline-flex items-center gap-2 rounded-md border border-main bg-white px-4 py-2 text-main"
                  >
                    <ExternalLink size={17} />
                    {copy.openMeeting}
                  </button>
                )}

                {ratingsReady && session.status === "completed" && (
                  <>
                    {!isTeacher && isStudent && teacherId && ownStudentId && (
                      (() => {
                        const ownBooking = bookings.find((booking) => booking.student_id === ownStudentId);
                        return ownBooking?.status === "completed" && !hasRated("teacher", teacherId, ownBooking.id) ? (
                          <RatingDialog
                            token={token}
                            actorRole="student"
                            targetType="teacher"
                            targetId={teacherId}
                            bookingId={ownBooking.id}
                            triggerLabel={copy.rateTeacher}
                          />
                        ) : null;
                      })()
                    )}

                    {!isTeacher && isParent && teacherId && bookings
                      .filter((booking) => linkedStudentIds.has(booking.student_id))
                      .map((booking) => (
                      booking.status === "completed" ? (
                        <div key={"rating-" + booking.id} className="flex flex-wrap gap-2">
                          {!hasRated("teacher", teacherId, booking.id) && (
                            <RatingDialog
                              token={token}
                              actorRole="parent"
                              targetType="teacher"
                              targetId={teacherId}
                              bookingId={booking.id}
                              triggerLabel={copy.rateTeacher}
                            />
                          )}
                          {!hasRated("student", booking.student_id, booking.id) && (
                            <RatingDialog
                              token={token}
                              actorRole="parent"
                              targetType="student"
                              targetId={booking.student_id}
                              bookingId={booking.id}
                              targetName={booking.student?.name}
                              triggerLabel={copy.rateStudent}
                            />
                          )}
                        </div>
                      ) : null
                    ))}

                    {isTeacher && bookings.map((booking) => (
                      booking.status === "completed" && !hasRated("student", booking.student_id, booking.id) ? (
                        <RatingDialog
                          key={"teacher-rating-" + booking.id}
                          token={token}
                          actorRole="teacher"
                          targetType="student"
                          targetId={booking.student_id}
                          bookingId={booking.id}
                          targetName={booking.student?.name}
                          triggerLabel={copy.rateStudent}
                        />
                      ) : null
                    ))}
                  </>
                )}

                {!isTeacher && !ratingsReady && session.status === "completed" && (
                  <span className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-sora text-[#697372]">
                    {copy.ratingLoading}
                  </span>
                )}

                {isTeacher && session.status === "upcoming" && (
                  <button type="button" onClick={() => void update(session, "in_progress")} disabled={updateStatus.isPending} className="rounded-md bg-main px-4 py-2 text-white disabled:opacity-50">
                    {copy.start}
                  </button>
                )}
                {isTeacher && session.status === "in_progress" && (
                  <button type="button" onClick={() => void update(session, "completed")} disabled={updateStatus.isPending} className="rounded-md bg-main px-4 py-2 text-white disabled:opacity-50">
                    {copy.complete}
                  </button>
                )}
                {isTeacher && ["upcoming", "in_progress"].includes(session.status) && (
                  <button type="button" onClick={() => void update(session, "cancelled")} disabled={updateStatus.isPending} className="rounded-md border border-red-200 bg-white px-4 py-2 text-red-600 disabled:opacity-50">
                    {copy.cancel}
                  </button>
                )}
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

export default Schedule;
