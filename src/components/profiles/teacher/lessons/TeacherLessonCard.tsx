import { Link } from "react-router-dom";
import truncateTxt from "@/utils/truncateTxt";
import { ITeacherLessonListItem } from "@/interfaces/lessons/lesson";
import DeleteLesson from "./DeleteLesson";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pen,
  UsersRound,
  Video,
} from "lucide-react";
import { useI18n } from "@/i18n";

interface IProps {
  lesson: ITeacherLessonListItem;
}

const TeacherLessonCard = ({ lesson }: IProps) => {
  const { language } = useI18n();
  const isArabic = language === "ar";

  const status = lesson.publishing_status ?? "draft";
  const statusCopy = isArabic
    ? {
        published: "منشور",
        pending_approval: "قيد المراجعة",
        rejected: "مرفوض",
        draft: "مسودة",
        unpublished: "غير منشور",
      }
    : {
        published: "Published",
        pending_approval: "Pending review",
        rejected: "Rejected",
        draft: "Draft",
        unpublished: "Unpublished",
      };

  const statusClass =
    status === "published"
      ? "bg-emerald-50 text-emerald-700"
      : status === "pending_approval"
        ? "bg-amber-50 text-amber-700"
        : status === "rejected"
          ? "bg-red-50 text-red-700"
          : "bg-slate-100 text-slate-600";

  const delivery = lesson.delivery_mode === "offline"
    ? (isArabic ? "حضوري" : "Offline")
    : (isArabic ? "أونلاين" : "Online");

  const booking = lesson.booking_type === "group"
    ? (isArabic ? "جماعي" : "Group")
    : (isArabic ? "خاص" : "Private");

  const price = Number(lesson.price);
  const serviceAreaCount = lesson.service_area_count ?? lesson.service_areas?.length ?? 0;
  const availabilityCount = lesson.availability_count ?? lesson.availability?.length ?? 0;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-black-blue/[0.07] bg-white shadow-[0_12px_38px_rgba(33,55,75,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(33,55,75,0.1)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#F4F7F7]">
        <img
          src={lesson.logo || "/images/placeholder-img.webp"}
          alt={lesson.title || (isArabic ? "صورة الدرس" : "Lesson")}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-main shadow-sm backdrop-blur">
            <Video className="h-3.5 w-3.5" />
            {isArabic ? "درس" : "Lesson"}
          </span>
          <span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold shadow-sm ${statusClass}`}>
            {statusCopy[status as keyof typeof statusCopy] ?? status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link to={`/lessons/${lesson.id}`} className="block">
          <h3 className="line-clamp-2 text-lg font-black leading-7 text-black-blue transition-colors hover:text-main sm:text-xl">
            {lesson.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4D5756]">
            {truncateTxt(lesson.description, 110)}
          </p>
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-main/[0.055] px-3 py-2.5 text-xs font-bold text-black-blue/70">
            <Video className="h-4 w-4 shrink-0 text-main" />
            <span className="truncate">{delivery}</span>
          </span>
          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-black-blue/70">
            <UsersRound className="h-4 w-4 shrink-0 text-black-blue/40" />
            <span className="truncate">{booking}</span>
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-black-blue/55">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-black-blue/[0.06] px-3 py-2.5">
            <Clock3 className="h-4 w-4 shrink-0 text-main" />
            <span className="truncate">{lesson.duration_minutes ?? 0} {isArabic ? "دقيقة" : "min"}</span>
          </span>
          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-black-blue/[0.06] px-3 py-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-main" />
            <span className="truncate">{availabilityCount} {isArabic ? "مواعيد" : "slots"}</span>
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-y border-dashed border-black-blue/[0.08] py-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-black-blue/35">
              {isArabic ? "سعر الحصة" : "Lesson price"}
            </p>
            <p className="mt-1 truncate text-xl font-black text-main">
              {price === 0 ? (isArabic ? "مجاني" : "Free") : `${price.toFixed(2)} EGP`}
            </p>
          </div>
          <div className="min-w-0 text-end">
            <p className="text-[11px] font-bold uppercase tracking-wide text-black-blue/35">
              {isArabic ? "الحصص" : "Sessions"}
            </p>
            <p className="mt-1 text-sm font-extrabold text-black-blue">
              {lesson.sessions_count ?? 0}
            </p>
          </div>
        </div>

        {lesson.publishing_status === "rejected" && lesson.publishing_note ? (
          <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-3 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-red-500">
              {isArabic ? "سبب المراجعة" : "Review note"}
            </p>
            <p className="mt-1 line-clamp-3 text-xs font-semibold leading-5 text-red-700">
              {lesson.publishing_note}
            </p>
          </div>
        ) : null}

        {lesson.delivery_mode === "offline" ? (
          <div className="mt-3 inline-flex min-w-0 items-center gap-2 rounded-xl bg-[#FBFDFC] px-3 py-2.5 text-xs font-semibold text-black-blue/60">
            <MapPin className="h-4 w-4 shrink-0 text-main" />
            <span className="truncate">
              {lesson.offline_visit_type === "student_to_teacher"
                ? (isArabic ? "المكان من ملف المعلم" : "Location comes from teacher profile")
                : serviceAreaCount
                  ? serviceAreaCount + " " + (isArabic ? "منطقة خدمة" : "service area")
                  : (isArabic ? "المكان يحتاج إعداد" : "Location needs setup")}
            </span>
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          <Link
            to={`/lessons/${lesson.id}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-main px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-main/90"
          >
            {isArabic ? "عرض الدرس" : "View lesson"}
          </Link>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <Link
              to={`/profile/my-lessons/${lesson.id}/update`}
              aria-label={isArabic ? "تحديث الدرس" : "Update lesson"}
              title={isArabic ? "تحديث الدرس" : "Update lesson"}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-3 text-blue-600 transition hover:bg-blue-600 hover:text-white sm:w-11 sm:px-0"
            >
              <Pen className="h-4 w-4" />
            </Link>
            <DeleteLesson id={lesson.id.toString()} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default TeacherLessonCard;
