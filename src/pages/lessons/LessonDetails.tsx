import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader,
  MapPin,
  Share2,
  Star,
  UsersRound,
} from "lucide-react";
import InstructorDetails from "@/components/shared/InstructorDetails";
import Newsletter from "@/components/Newsletter";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AxiosResErr } from "@/types";
import { ITeacher } from "@/interfaces/teachers/teacherProfile";
import cookieService from "@/utils/cookieService";
import { useGetLessonById } from "@/lib/react-query/lessons/lessons";
import RelatedLessons from "@/components/lessons/RelatedLessons";
import BookLessonDialog from "@/components/lessons/BookLessonDialog";
import { useI18n } from "@/i18n";
import { getLessonsCopy } from "./lessonCopy";

const LessonDetails = () => {
  const { language } = useI18n();
  const copy = getLessonsCopy(language);
  const role = cookieService.getRole() || "";
  const token = cookieService.getToken() || "";
  const { lessonId } = useParams();
  const [copied, setCopied] = useState(false);
  const { data: lesson, isLoading, isError, failureReason } = useGetLessonById({
    lessonId: Number(lessonId),
    ...(token && { token }),
  });
  const lessonFailure = failureReason as AxiosResErr;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = copy.detailTitle + " | Elmullim";
    if (!Number(lessonId)) {
      navigate("/lessons", { replace: true });
      return;
    }
    if (isError || lessonFailure) {
      toast.error(lessonFailure?.response?.data?.message || copy.detailsError);
      navigate("/lessons", { replace: true });
    }
  }, [copy.detailTitle, copy.detailsError, navigate, lessonFailure, isError, lessonId]);

  const lessonData = lesson?.data;
  const bookingEnabled =
    !!lessonData &&
    (lessonData.booking_type === "private" || lessonData.booking_type === "group") &&
    lessonData.publishing_status === "published" &&
    lessonData.is_bookable !== false;

  const lifecycleNotice =
    lessonData?.operational_status === "full"
      ? language === "ar" ? "اكتملت سعة هذا الدرس حاليًا." : "This lesson has reached its capacity."
      : lessonData?.operational_status === "booking_expired"
        ? language === "ar" ? "انتهت فترة الحجز لهذا الدرس." : "The booking period for this lesson has ended."
        : lessonData?.operational_status === "ended"
          ? language === "ar" ? "انتهى هذا الدرس." : "This lesson has ended."
          : lessonData?.operational_status === "scheduled"
            ? language === "ar" ? "لم يبدأ الحجز لهذا الدرس بعد." : "Booking for this lesson has not opened yet."
            : null;
  const canBook = role === "student" || role === "parent";

  const dayNames =
    language === "ar"
      ? {
          1: "الاثنين",
          2: "الثلاثاء",
          3: "الأربعاء",
          4: "الخميس",
          5: "الجمعة",
          6: "السبت",
          7: "الأحد",
        }
      : {
          1: "Monday",
          2: "Tuesday",
          3: "Wednesday",
          4: "Thursday",
          5: "Friday",
          6: "Saturday",
          7: "Sunday",
        };

  const activeAvailability = useMemo(
    () => lessonData?.availability?.filter((slot) => slot.is_active !== false) ?? [],
    [lessonData?.availability]
  );

  const recurringAvailability = useMemo(
    () => activeAvailability.filter((slot) => !slot.available_on),
    [activeAvailability]
  );

  const oneOffAvailability = useMemo(
    () => activeAvailability.filter((slot) => slot.available_on),
    [activeAvailability]
  );

  const activeServiceAreas = useMemo(
    () => lessonData?.service_areas?.filter((area) => area.is_active !== false) ?? [],
    [lessonData?.service_areas]
  );

  const weeklyHours = useMemo(() => {
    return recurringAvailability.reduce((total, slot) => {
      const [startHour, startMinute] = slot.start_time.slice(0, 5).split(":").map(Number);
      const [endHour, endMinute] = slot.end_time.slice(0, 5).split(":").map(Number);
      const minutes = Math.max(
        0,
        endHour * 60 + endMinute - (startHour * 60 + startMinute)
      );
      return total + minutes / 60;
    }, 0);
  }, [recurringAvailability]);

  const infoItems = [
    lessonData?.subject_name && {
      label: copy.subject,
      value: lessonData.subject_name,
      icon: GraduationCap,
    },
    lessonData?.education_level_name && {
      label: copy.educationStage,
      value: lessonData.education_level_name,
      icon: BadgeCheck,
    },
    lessonData?.grade && {
      label: copy.grade,
      value: lessonData.grade,
      icon: GraduationCap,
    },
    lessonData?.booking_type && {
      label: copy.bookingType,
      value: lessonData.booking_type === "private" ? copy.private : copy.group,
      icon: UsersRound,
    },
    lessonData?.delivery_mode && {
      label: copy.delivery,
      value: lessonData.delivery_mode === "offline" ? copy.offline : copy.online,
      icon: MapPin,
    },
    lessonData?.duration_minutes && {
      label: copy.duration,
      value: String(lessonData.duration_minutes) + " " + copy.durationUnit,
      icon: Clock3,
    },
    lessonData?.sessions_count && {
      label: copy.sessions,
      value: String(lessonData.sessions_count),
      icon: CalendarDays,
    },
    lessonData?.booking_type === "group" && lessonData.max_students && {
      label: copy.maximumStudents,
      value: String(lessonData.max_students),
      icon: UsersRound,
    },
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    icon: typeof GraduationCap;
  }>;

  const shareLesson = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: lessonData?.title || copy.detailTitle,
          text: lessonData?.description || "",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
        toast.success(copy.linkCopied);
      }
    } catch {
      // The user can dismiss the native share dialog without an error.
    }
  };

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container pt-16 text-white md:pt-24"
      >
        <div className="flex flex-col items-center gap-4 pb-12 text-center md:pb-16">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl md:leading-[74px]">
            {copy.detailTitle}
          </h1>
          <nav
            className="font-sora text-sm font-light leading-6 text-white/75"
            aria-label={copy.detailBreadcrumb}
          >
            <ol className="flex items-center justify-center gap-2">
              <li>
                <Link to="/" className="transition hover:text-white">
                  {copy.home}
                </Link>
              </li>
              <li aria-hidden="true" className="text-main">›</li>
              <li>
                <Link to="/lessons" className="transition hover:text-white">
                  {copy.title}
                </Link>
              </li>
              <li aria-hidden="true" className="text-main">›</li>
              <li className="text-white">{copy.detailTitle}</li>
            </ol>
          </nav>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white"
      >
        <div className="bg-[#F5F7F8] py-10 md:py-20">
          <div className="container">
            {isLoading ? (
              <div className="py-10" role="status" aria-live="polite">
                <Loader className="mx-auto animate-spin" size={40} aria-hidden="true" />
                <span className="sr-only">{copy.loading}</span>
              </div>
            ) : !lessonData ? (
              <div className="py-10 text-center" role="alert">
                <p className="font-sora text-lg text-[#4D5756]">{copy.detailsError}</p>
                <Link
                  to="/lessons"
                  className="inline-flex min-h-11 mt-4 items-center justify-center bg-main hover:bg-main/90 rounded-xl text-white font-sora text-sm px-6 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
                >
                  {copy.backToLessons}
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
                  <div className="col-span-12 lg:col-span-7 order-2 lg:order-1">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-main/10 px-3 py-1.5 text-xs font-extrabold text-main">
                        <CheckCircle2 className="h-4 w-4" />
                        {copy.published}
                      </span>
                      {lessonData.delivery_mode && (
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black-blue/65 border border-black-blue/[0.07]">
                          {lessonData.delivery_mode === "offline" ? copy.offline : copy.online}
                        </span>
                      )}
                      {lessonData.booking_type && (
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black-blue/65 border border-black-blue/[0.07]">
                          {lessonData.booking_type === "group" ? copy.group : copy.private}
                        </span>
                      )}
                    </div>

                    <h2 className="text-black-blue font-black text-3xl md:text-4xl xl:text-5xl leading-tight">
                      {lessonData.title}
                    </h2>

                    <p className="mt-4 max-w-3xl font-sora text-base md:text-lg text-[#4D5756] leading-8">
                      {lessonData.description}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-white border border-black-blue/[0.07] px-4 py-3 shadow-sm">
                        <img
                          src={lessonData.teacher.profile_image || "/images/profile-avatar.webp"}
                          alt={copy.teacherImageAlt + ": " + lessonData.teacher.name}
                          onError={(event) => {
                            event.currentTarget.src = "/images/profile-avatar.webp";
                          }}
                          className="h-11 w-11 rounded-full object-cover object-top"
                        />
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">
                            {copy.by}
                          </p>
                          <p className="text-sm font-black text-black-blue">{lessonData.teacher.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-2xl bg-white border border-black-blue/[0.07] px-4 py-3 shadow-sm">
                        <Star className="h-5 w-5 text-main fill-current" />
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">
                            {copy.ratingLabel}
                          </p>
                          <p className="text-sm font-black text-black-blue">
                            {Number(lessonData.teacher.rating ?? 0) > 0
                              ? Number(lessonData.teacher.rating).toFixed(1)
                              : copy.noRatingsYet}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="rounded-2xl border border-main/10 bg-main/[0.045] px-5 py-4">
                        <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">
                          {copy.price}
                        </p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-2xl font-black text-main">
                            {Number(lessonData.price) === 0 ? copy.free : lessonData.price}
                          </span>
                          {Number(lessonData.price) !== 0 && (
                            <span className="text-sm font-bold text-black-blue/45">{copy.currency}</span>
                          )}
                        </div>
                      </div>

                      {lifecycleNotice && role !== "teacher" ? (
                        <div className="flex-1 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-extrabold leading-6 text-amber-700">
                          {lifecycleNotice}
                        </div>
                      ) : bookingEnabled && canBook ? (
                        <BookLessonDialog
                          lessonId={lessonData.id}
                          bookingType={lessonData.booking_type!}
                          deliveryMode={lessonData.delivery_mode}
                          offlineVisitType={lessonData.offline_visit_type}
                          price={lessonData.price}
                          durationMinutes={lessonData.duration_minutes ?? 60}
                          language={language}
                            endsAt={lessonData.ends_at}
                        />
                      ) : bookingEnabled && role !== "teacher" ? (
                        <Link
                          to="/login"
                          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-main px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-main/15 transition hover:bg-main/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2"
                        >
                          {copy.loginToBook}
                        </Link>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => void shareLesson()}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black-blue/10 bg-white px-5 py-3 text-sm font-extrabold text-black-blue/65 transition hover:border-main/30 hover:text-main"
                      >
                        <Share2 className="h-4 w-4" />
                        {copied ? copy.linkCopied : copy.share}
                      </button>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-5 order-1 lg:order-2">
                    <div className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-[0_18px_55px_rgba(33,55,75,0.12)]">
                      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-[#EDF2F3]">
                        <img
                          src={lessonData.logo || "/images/placeholder-img.webp"}
                          alt={copy.imageAlt + ": " + lessonData.title}
                          onError={(event) => {
                            event.currentTarget.src = "/images/placeholder-img.webp";
                          }}
                          className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                  {infoItems.map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-black-blue/[0.07] bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-main">
                        <Icon className="h-4 w-4" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wide">
                          {label}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm font-black text-black-blue">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-6">
                    <section className="rounded-3xl border border-black-blue/[0.07] bg-white p-5 md:p-6 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-main/10 text-main">
                          <BadgeCheck className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-xl font-black text-black-blue">{copy.aboutLesson}</h3>
                          <p className="mt-1 font-sora text-sm leading-7 text-[#4D5756]">
                            {lessonData.description}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-3xl border border-black-blue/[0.07] bg-white p-5 md:p-6 shadow-sm">
                      <div className="mb-5 flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-main/10 text-main">
                          <CheckCircle2 className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-xl font-black text-black-blue">{copy.whatYouGet}</h3>
                          <p className="mt-1 text-sm text-black-blue/45">{copy.whatYouGetHint}</p>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          copy.whatYouGetItemAvailability,
                          copy.whatYouGetItemDuration,
                          lessonData.booking_type === "group"
                            ? copy.whatYouGetItemGroup
                            : copy.whatYouGetItemPrivate,
                          lessonData.delivery_mode === "offline"
                            ? copy.whatYouGetItemOffline
                            : copy.whatYouGetItemOnline,
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3 rounded-2xl bg-[#F7F9F9] px-4 py-3"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-main" />
                            <span className="text-sm font-semibold leading-6 text-black-blue/70">{item}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {recurringAvailability.length > 0 && (
                      <section className="rounded-3xl border border-black-blue/[0.07] bg-white p-5 md:p-6 shadow-sm">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-main/10 text-main">
                              <CalendarDays className="h-5 w-5" />
                            </span>
                            <div>
                              <h3 className="text-xl font-black text-black-blue">{copy.weeklySchedule}</h3>
                              <p className="mt-1 text-sm text-black-blue/45">{copy.weeklyScheduleHint}</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-2 rounded-full bg-main/[0.06] px-3 py-2 text-xs font-extrabold text-main">
                            <Clock3 className="h-4 w-4" />
                            {weeklyHours.toFixed(0)} {copy.weeklyHours}
                          </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {recurringAvailability.map((slot) => {
                            const dayName =
                              dayNames[slot.day_of_week as keyof typeof dayNames] ??
                              String(slot.day_of_week);
                            const [startHour, startMinute] = slot.start_time
                              .slice(0, 5)
                              .split(":")
                              .map(Number);
                            const [endHour, endMinute] = slot.end_time
                              .slice(0, 5)
                              .split(":")
                              .map(Number);
                            const slotMinutes = Math.max(
                              0,
                              endHour * 60 + endMinute - (startHour * 60 + startMinute)
                            );

                            return (
                              <div
                                key={
                                  String(slot.day_of_week) +
                                  "-" +
                                  slot.start_time +
                                  "-" +
                                  slot.end_time
                                }
                                className="rounded-2xl border border-black-blue/[0.06] bg-[#FBFDFC] p-4 transition hover:-translate-y-0.5 hover:border-main/20 hover:shadow-sm"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm font-black text-black-blue">{dayName}</span>
                                  <span className="rounded-full bg-main/[0.06] px-2.5 py-1 text-[10px] font-extrabold text-main">
                                    {slotMinutes} {copy.durationUnit}
                                  </span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-base font-black text-black-blue" dir="ltr">
                                  <Clock3 className="h-4 w-4 shrink-0 text-main" />
                                  <span>{slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {bookingEnabled && canBook && (
                          <div className="mt-5 rounded-2xl bg-main/[0.04] px-4 py-4">
                            <p className="text-sm font-bold leading-6 text-black-blue/70">
                              {copy.bookingScheduleHint}
                            </p>
                          </div>
                        )}
                      </section>
                    )}

                    {oneOffAvailability.length > 0 && (
                      <section className="rounded-3xl border border-black-blue/[0.07] bg-white p-5 md:p-6 shadow-sm">
                        <div className="mb-5 flex items-start gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-main/10 text-main">
                            <CalendarDays className="h-5 w-5" />
                          </span>
                          <div>
                            <h3 className="text-xl font-black text-black-blue">
                              {language === "ar" ? "المواعيد الاستثنائية" : "One-off dates"}
                            </h3>
                            <p className="mt-1 text-sm text-black-blue/45">
                              {language === "ar"
                                ? "مواعيد محددة متاحة في تواريخها فقط."
                                : "Exact dates available only on their specified calendar dates."}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {oneOffAvailability.map((slot) => {
                            const value = slot.available_on as string;
                            const [startHour, startMinute] = slot.start_time
                              .slice(0, 5)
                              .split(":")
                              .map(Number);
                            const [endHour, endMinute] = slot.end_time
                              .slice(0, 5)
                              .split(":")
                              .map(Number);
                            const slotMinutes = Math.max(
                              0,
                              endHour * 60 + endMinute - (startHour * 60 + startMinute)
                            );
                            const formattedDate = (() => {
                              try {
                                return new Intl.DateTimeFormat(
                                  language === "ar" ? "ar-EG" : "en-US",
                                  {
                                    timeZone: slot.timezone,
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                ).format(new Date(value + "T12:00:00.000Z"));
                              } catch {
                                return value;
                              }
                            })();

                            return (
                              <div
                                key={
                                  String(slot.id) +
                                  "-" +
                                  value +
                                  "-" +
                                  slot.start_time +
                                  "-" +
                                  slot.end_time
                                }
                                className="rounded-2xl border border-black-blue/[0.06] bg-[#FBFDFC] p-4 transition hover:-translate-y-0.5 hover:border-main/20 hover:shadow-sm"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm font-black text-black-blue">{formattedDate}</span>
                                  <span className="rounded-full bg-main/[0.06] px-2.5 py-1 text-[10px] font-extrabold text-main">
                                    {slotMinutes} {copy.durationUnit}
                                  </span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-base font-black text-black-blue" dir="ltr">
                                  <Clock3 className="h-4 w-4 shrink-0 text-main" />
                                  <span>{slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {lessonData.delivery_mode === "offline" && (
                      <section className="rounded-3xl border border-black-blue/[0.07] bg-white p-5 md:p-6 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-main/10 text-main">
                            <MapPin className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xl font-black text-black-blue">{copy.lessonLocation}</h3>
                            <p className="mt-1 text-sm leading-6 text-black-blue/55">
                              {lessonData.offline_visit_type === "teacher_to_student"
                                ? copy.teacherToStudentLocation
                                : copy.studentToTeacherLocation}
                            </p>
                            {activeServiceAreas.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {activeServiceAreas.map((area) => (
                                  <span
                                    key={area.id}
                                    className="inline-flex items-center gap-2 rounded-full bg-main/[0.06] px-3 py-2 text-xs font-bold text-main"
                                  >
                                    <MapPin className="h-3.5 w-3.5" />
                                    {area.name}
                                    {area.radius_km != null
                                      ? " · " + area.radius_km + " km"
                                      : ""}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="mt-4 rounded-2xl bg-[#F7F9F9] px-4 py-3 text-xs font-semibold leading-5 text-black-blue/55">
                              {copy.locationPrivacy}
                            </div>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>

                  <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-3xl bg-black-blue p-5 text-white shadow-xl">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-main">
                        <Banknote className="h-5 w-5" />
                          <span className="text-xs font-extrabold uppercase tracking-wide">{copy.bookingSummary}</span>
                        </div>
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-extrabold text-white/70">
                          {copy.published}
                        </span>
                      </div>
                      <p className="mt-3 text-3xl font-black">
                        {Number(lessonData.price) === 0
                          ? copy.free
                          : lessonData.price + " " + copy.currency}
                      </p>
                      <div className="mt-4 space-y-2 text-sm text-white/70">
                        <div className="flex items-center justify-between gap-3">
                          <span>{copy.bookingType}</span>
                          <strong className="text-white">
                            {lessonData.booking_type === "group" ? copy.group : copy.private}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>{copy.duration}</span>
                          <strong className="text-white">
                            {lessonData.duration_minutes} {copy.durationUnit}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>{copy.sessions}</span>
                          <strong className="text-white">{lessonData.sessions_count}</strong>
                        </div>
                        {lessonData.booking_type === "group" && lessonData.max_students ? (
                          <div className="flex items-center justify-between gap-3">
                            <span>{copy.maximumStudents}</span>
                            <strong className="text-white">{lessonData.max_students}</strong>
                          </div>
                        ) : null}
                      </div>

                      {lifecycleNotice && role !== "teacher" ? (
                        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-extrabold leading-6 text-amber-700">
                          {lifecycleNotice}
                        </div>
                      ) : bookingEnabled && canBook ? (
                        <div className="mt-5">
                          <BookLessonDialog
                            lessonId={lessonData.id}
                            bookingType={lessonData.booking_type!}
                            deliveryMode={lessonData.delivery_mode}
                            offlineVisitType={lessonData.offline_visit_type}
                            price={lessonData.price}
                            durationMinutes={lessonData.duration_minutes ?? 60}
                            language={language}
                            endsAt={lessonData.ends_at}
                          />
                        </div>
                      ) : bookingEnabled && role !== "teacher" ? (
                        <Link
                          to="/login"
                          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-main px-6 py-3 text-sm font-extrabold text-white transition hover:bg-main/90"
                        >
                          {copy.loginToBook}
                        </Link>
                      ) : null}

                      <div className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-white/45">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-main" />
                        <span>
                          {lessonData.booking_type === "private"
                            ? copy.booking.privateRequiresApproval
                            : copy.booking.groupBookingRequest}
                        </span>
                      </div>
                    </div>
                  </aside>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="container py-8 md:py-12">
          {lessonData && (
            <>
              <InstructorDetails instructor={lessonData.teacher as ITeacher} />
              <RelatedLessons
                lessonId={Number(lessonId)}
                teacherId={lessonData.teacher.id}
                copy={copy}
              />
            </>
          )}
        </div>


        {lessonData && bookingEnabled && role !== "teacher" && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black-blue/[0.08] bg-white/95 px-4 py-3 shadow-[0_-12px_35px_rgba(33,55,75,0.12)] backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-3xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-black-blue/35">
                  {copy.price}
                </p>
                <p className="truncate text-lg font-black text-main">
                  {Number(lessonData.price) === 0 ? copy.free : lessonData.price + " " + copy.currency}
                </p>
              </div>
              <div className="shrink-0">
                {canBook ? (
                  <BookLessonDialog
                    lessonId={lessonData.id}
                    bookingType={lessonData.booking_type!}
                    deliveryMode={lessonData.delivery_mode}
                    offlineVisitType={lessonData.offline_visit_type}
                    price={lessonData.price}
                    durationMinutes={lessonData.duration_minutes ?? 60}
                    language={language}
                            endsAt={lessonData.ends_at}
                  />
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-main px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-main/15 transition hover:bg-main/90"
                  >
                    {copy.loginToBook}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <Newsletter />
      </motion.section>
    </main>
  );
};

export default LessonDetails;
