import { useState } from "react";
import { CalendarClock, ExternalLink, Loader } from "lucide-react";
import { toast } from "react-toastify";
import cookieService from "@/utils/cookieService";
import {
  useGetSchedule,
  useGetTeacherSchedule,
  useUpdateSessionStatus,
} from "@/lib/react-query/booking";
import { IBookingSession } from "@/interfaces/bookings/session";
import { joinBookingSession } from "@/services/booking";

const Schedule = () => {
  const token = cookieService.getToken() || "";
  const role = cookieService.getRole();
  const isTeacher = role === "teacher";
  const studentSchedule = useGetSchedule({ token, enabled: !!token && !isTeacher });
  const teacherSchedule = useGetTeacherSchedule({ token, enabled: !!token && isTeacher });
  const updateStatus = useUpdateSessionStatus();
  const [joinLoading, setJoinLoading] = useState<number | null>(null);

  const data = (isTeacher ? teacherSchedule.data?.data : studentSchedule.data?.data) ?? [];
  const loading = isTeacher ? teacherSchedule.isLoading : studentSchedule.isLoading;
  const error = isTeacher ? teacherSchedule.isError : studentSchedule.isError;

  const join = async (bookingId: number) => {
    setJoinLoading(bookingId);
    try {
      const response = await joinBookingSession({ token, bookingId });
      if (!response.status) {
        toast.error(response.message || "Session is not available.");
        return;
      }
      if (response.data?.meeting_url) {
        window.open(response.data.meeting_url, "_blank", "noopener,noreferrer");
      } else if (response.data?.location) {
        toast.info(response.data.location);
      } else {
        toast.info("Session access granted.");
      }
    } catch {
      toast.error("Could not open the session.");
    } finally {
      setJoinLoading(null);
    }
  };

  const update = async (session: IBookingSession, status: "in_progress" | "completed" | "cancelled") => {
    try {
      await updateStatus.mutateAsync({ token, sessionId: session.id, status });
      toast.success(`Session marked ${status.replace("_", " ")}.`);
    } catch {
      toast.error("Could not update session status.");
    }
  };

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-black-blue">
            {isTeacher ? "Teaching Schedule" : "My Schedule"}
          </h1>
          <p className="mt-3 font-sora text-[#4D5756]">
            {isTeacher ? "Manage upcoming lesson sessions and execution status." : "View your confirmed lesson sessions and join when available."}
          </p>
        </div>

        {(loading || (isTeacher ? teacherSchedule.isFetching : studentSchedule.isFetching)) && (
          <div className="py-16 text-center" role="status"><Loader className="mx-auto animate-spin" size={36} /></div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6" role="alert">
            Could not load the schedule. Please try again.
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center font-sora text-[#4D5756]">
            No scheduled sessions yet.
          </div>
        )}

        <div className="space-y-5">
          {data.map((session) => (
            <article key={session.id} className="rounded-xl border border-gray-200 bg-[#F0F1F1] p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarClock size={19} className="text-main" />
                    <h2 className="text-xl font-bold text-black-blue">{session.lesson?.title ?? `Lesson #${session.lesson_id}`}</h2>
                  </div>
                  <p className="mt-2 font-sora text-sm text-[#4D5756]">
                    {new Date(session.start_at).toLocaleString()} → {new Date(session.end_at).toLocaleTimeString()}
                  </p>
                  {session.bookings?.length && (
                    <p className="mt-1 font-sora text-sm text-[#4D5756]">
                      Students: {session.bookings.map((item) => item.student?.name ?? `#${item.student_id}`).join(", ")}
                    </p>
                  )}
                </div>
                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-main">{session.status}</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {!isTeacher && session.bookings?.map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => void join(booking.id)}
                    disabled={joinLoading === booking.id || !["upcoming", "in_progress", "confirmed"].includes(session.status)}
                    className="inline-flex items-center gap-2 rounded-md bg-main px-4 py-2 text-white disabled:opacity-50"
                  >
                    <ExternalLink size={17} />
                    {joinLoading === booking.id ? "Opening..." : "Join session"}
                  </button>
                ))}

                {isTeacher && session.status === "upcoming" && (
                  <button type="button" onClick={() => void update(session, "in_progress")} disabled={updateStatus.isPending} className="rounded-md bg-main px-4 py-2 text-white disabled:opacity-50">
                    Start session
                  </button>
                )}
                {isTeacher && session.status === "in_progress" && (
                  <button type="button" onClick={() => void update(session, "completed")} disabled={updateStatus.isPending} className="rounded-md bg-main px-4 py-2 text-white disabled:opacity-50">
                    Complete session
                  </button>
                )}
                {isTeacher && ["upcoming", "in_progress"].includes(session.status) && (
                  <button type="button" onClick={() => void update(session, "cancelled")} disabled={updateStatus.isPending} className="rounded-md border border-red-200 bg-white px-4 py-2 text-red-600 disabled:opacity-50">
                    Cancel session
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

export default Schedule;
