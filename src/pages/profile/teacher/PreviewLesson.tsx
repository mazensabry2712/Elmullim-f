import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Clock3, Loader, MapPin, Pencil, UsersRound, Video, WalletCards } from "lucide-react";
import { useEffect } from "react";
import { useGetTeacherLessonById } from "@/lib/react-query/teacher/lessons";
import cookieService from "@/utils/cookieService";
import LessonStatusActions from "@/components/profiles/teacher/lessons/LessonStatusActions";
import { useI18n } from "@/i18n";

const PreviewLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const token = cookieService.getToken() || "";
  const { language } = useI18n();
  const isArabic = language === "ar";
  const numericId = Number(lessonId);

  const { data, isLoading, isError } = useGetTeacherLessonById({
    token,
    id: lessonId || "",
    enabled: Number.isInteger(numericId) && numericId > 0,
  });

  useEffect(() => {
    if (!Number.isInteger(numericId) || numericId <= 0 || isError) {
      navigate("/profile", { replace: true });
    }
  }, [isError, navigate, numericId]);

  if (isLoading || !data?.data) {
    return (
      <main className="min-h-screen bg-[#F7FAF9] py-16">
        <div className="container flex min-h-80 items-center justify-center rounded-3xl bg-white">
          <Loader className="animate-spin text-main" size={38} />
        </div>
      </main>
    );
  }

  const lesson = data.data;
  const status = lesson.publishing_status ?? "draft";
  const statusText: Record<string, string> = isArabic
    ? {
        draft: "مسودة",
        pending_approval: "قيد المراجعة",
        published: "منشور",
        rejected: "مرفوض",
        unpublished: "غير منشور",
      }
    : {
        draft: "Draft",
        pending_approval: "Pending review",
        published: "Published",
        rejected: "Rejected",
        unpublished: "Unpublished",
      };

  const dayNames = isArabic
    ? ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
    : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const activeAreas = lesson.service_areas?.filter((area) => area.is_active !== false) ?? [];

  return (
    <main className="min-h-screen bg-[#F7FAF9] py-10 md:py-14">
      <div className="container">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-main">
              {isArabic ? "معاينة المعلم" : "Teacher preview"}
            </p>
            <h1 className="mt-1 text-3xl font-black text-black-blue md:text-4xl">{lesson.title}</h1>
            <p className="mt-2 text-sm font-semibold text-black-blue/50">
              {isArabic ? "هذه المعاينة تعرض الدرس من منظور المعلم، بما في ذلك الدروس غير المنشورة." : "This preview is teacher-only and also works for unpublished lessons."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LessonStatusActions lesson={lesson} />
            <Link
              to={`/profile/my-lessons/${lesson.id}/update`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-main px-4 py-2.5 text-sm font-bold text-white"
            >
              <Pencil className="h-4 w-4" />
              {isArabic ? "تعديل" : "Edit"}
            </Link>
            {status === "published" ? (
              <Link
                to={`/lessons/${lesson.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-black-blue/10 bg-white px-4 py-2.5 text-sm font-bold text-black-blue"
              >
                {isArabic ? "صفحة الطلاب" : "Student page"}
              </Link>
            ) : null}
          </div>
        </div>

        {status === "rejected" && lesson.publishing_note ? (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-red-500">{isArabic ? "ملاحظة المراجعة" : "Review note"}</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-red-700">{lesson.publishing_note}</p>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-3xl border border-black-blue/[0.07] bg-white shadow-sm">
            <div className="aspect-[16/7] overflow-hidden bg-[#EEF4F3]">
              <img
                src={lesson.logo || "/images/placeholder-img.webp"}
                alt={lesson.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-7">
              <p className="text-base leading-8 text-[#4D5756]">{lesson.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  [isArabic ? "المادة" : "Subject", lesson.subject_name || String(lesson.subject_id ?? "—")],
                  [isArabic ? "المرحلة" : "Education stage", lesson.education_level_name || String(lesson.education_level_id ?? "—")],
                  [isArabic ? "الصف" : "Grade", lesson.grade || "—"],
                  [isArabic ? "التوصيل" : "Delivery", lesson.delivery_mode === "offline" ? (isArabic ? "حضوري" : "Offline") : (isArabic ? "أونلاين" : "Online")],
                  [isArabic ? "الحجز" : "Booking", lesson.booking_type === "group" ? (isArabic ? "جماعي" : "Group") : (isArabic ? "خاص" : "Private")],
                  [isArabic ? "المدة" : "Duration", `${lesson.duration_minutes ?? 0} ${isArabic ? "دقيقة" : "min"}`],
                  [isArabic ? "عدد الحصص" : "Sessions", String(lesson.sessions_count ?? 0)],
                  [isArabic ? "السعر" : "Price", Number(lesson.price) === 0 ? (isArabic ? "مجاني" : "Free") : `${Number(lesson.price).toFixed(2)} EGP`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-black-blue/[0.06] bg-[#FBFDFC] px-4 py-3">
                    <p className="text-[11px] font-black uppercase tracking-wide text-black-blue/35">{label}</p>
                    <p className="mt-1 text-sm font-black text-black-blue">{value}</p>
                  </div>
                ))}
              </div>

              {lesson.max_students ? (
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-main/[0.05] p-4">
                  <UsersRound className="h-5 w-5 text-main" />
                  <span className="text-sm font-bold text-black-blue">
                    {isArabic ? `سعة المجموعة: ${lesson.max_students} طالبًا لكل موعد` : `Group capacity: ${lesson.max_students} students per slot`}
                  </span>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-black-blue/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-black-blue/35">{isArabic ? "الحالة" : "Status"}</p>
                  <p className="mt-1 text-xl font-black text-black-blue">{statusText[status] ?? status}</p>
                </div>
                <span className="rounded-full bg-main/10 px-3 py-1.5 text-xs font-black text-main">
                  {isArabic ? "درس" : "Lesson"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-black-blue/[0.06] p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-black-blue/30">{isArabic ? "كل الحجوزات" : "All bookings"}</p>
                  <p className="mt-1 text-2xl font-black text-black-blue">{lesson.bookings_count ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-black-blue/[0.06] p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-black-blue/30">{isArabic ? "النشطة" : "Active"}</p>
                  <p className="mt-1 text-2xl font-black text-main">{lesson.active_bookings_count ?? 0}</p>
                </div>
              </div>

              <Link
                to={`/profile/teacher/bookings?lesson_id=${lesson.id}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-main/20 bg-main/[0.05] px-4 py-3 text-sm font-black text-main"
              >
                <WalletCards className="h-4 w-4" />
                {isArabic ? "إدارة حجوزات الدرس" : "Manage lesson bookings"}
              </Link>
            </section>

            <section className="rounded-3xl border border-black-blue/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-main" />
                <h2 className="text-lg font-black text-black-blue">{isArabic ? "المواعيد" : "Availability"}</h2>
              </div>
              <div className="mt-4 space-y-2">
                {lesson.availability?.length ? lesson.availability.map((slot, index) => (
                  <div key={`${slot.day_of_week}-${slot.start_time}-${index}`} className="rounded-2xl bg-[#FBFDFC] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black text-black-blue">{dayNames[Number(slot.day_of_week) - 1] ?? slot.day_of_week}</span>
                      <span dir="ltr" className="inline-flex items-center gap-1.5 text-xs font-bold text-black-blue/55">
                        <Clock3 className="h-3.5 w-3.5 text-main" />
                        {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                      </span>
                    </div>
                    {lesson.delivery_mode === "online" && slot.meeting_url ? (
                      <p className="mt-2 break-all text-[11px] font-semibold text-main">{slot.meeting_url}</p>
                    ) : null}
                  </div>
                )) : (
                  <p className="rounded-2xl border border-dashed p-4 text-sm font-semibold text-black-blue/45">{isArabic ? "لا توجد مواعيد." : "No availability configured."}</p>
                )}
              </div>
            </section>

            {lesson.delivery_mode === "offline" ? (
              <section className="rounded-3xl border border-black-blue/[0.07] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-main" />
                  <h2 className="text-lg font-black text-black-blue">{isArabic ? "المكان" : "Location"}</h2>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-black-blue/60">
                  {lesson.offline_visit_type === "student_to_teacher"
                    ? (isArabic ? "الطالب يذهب إلى موقع المعلم المحفوظ في الملف الشخصي." : "The student visits the teacher location saved in the profile.")
                    : (isArabic ? "المعلم يذهب إلى الطالب داخل مناطق الخدمة المحددة." : "The teacher visits students inside the selected service areas.")}
                </p>
                {activeAreas.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeAreas.map((area) => (
                      <span key={area.id} className="rounded-full bg-main/[0.06] px-3 py-1.5 text-xs font-black text-main">{area.name}</span>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : (
              <section className="rounded-3xl border border-black-blue/[0.07] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-main" />
                  <h2 className="text-lg font-black text-black-blue">{isArabic ? "اجتماع أونلاين" : "Online meeting"}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-black-blue/55">
                  {isArabic ? "كل موعد يمكن أن يحمل رابط اجتماع مستقل، والرابط لا يظهر للطلاب إلا داخل نافذة الجلسة المسموح بها." : "Each slot may have its own meeting link, and students only receive the effective link during the allowed session window."}
                </p>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default PreviewLesson;
