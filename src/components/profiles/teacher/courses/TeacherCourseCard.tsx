import { Link } from "react-router-dom";
import { ICourse } from "@/interfaces/courses/courses";
import truncateTxt from "@/utils/truncateTxt";
import DeleteTeacherCourseAction from "./DeleteTeacherCourseAction";
import {
  BookOpen,
  CalendarDays,
  Eye,
  Layers3,
  LockKeyhole,
  Pen,
  Tag,
  Video,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { isDisplayableProfileText } from "@/utils/textQuality";

interface IProps {
  course: ICourse;
}

const TeacherCourseCard = ({ course }: IProps) => {
  const { language } = useI18n();
  const isArabic = language === "ar";

  const courseTitle = isDisplayableProfileText(course.title)
    ? course.title
    : isArabic ? "عنوان الكورس يحتاج إلى تصحيح" : "Course title needs correction";
  const courseDescription = isDisplayableProfileText(course.description, 3)
    ? truncateTxt(course.description, 110)
    : isArabic ? "وصف الكورس يحتاج إلى تصحيح" : "Course description needs correction";
  const status = course.publishing_status ?? "draft";

  const statusCopy = isArabic
    ? {
        published: "منشور",
        pending_approval: "قيد المراجعة",
        rejected: "مرفوض",
        draft: "مسودة",
      }
    : {
        published: "Published",
        pending_approval: "Pending review",
        rejected: "Rejected",
        draft: "Draft",
      };

  const statusClass =
    status === "published"
      ? "bg-emerald-50 text-emerald-700"
      : status === "pending_approval"
        ? "bg-amber-50 text-amber-700"
        : status === "rejected"
          ? "bg-red-50 text-red-700"
          : "bg-slate-100 text-slate-600";

  const categoryName =
    course.sub_category?.category?.name ||
    course.sub_category?.name ||
    (isArabic ? "كورس" : "Course");

  const level = course.level || (isArabic ? "غير محدد" : "Not specified");
  const price = Number(course.price);

  const formattedUpdatedAt = course.updated_at
    ? new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(course.updated_at))
    : null;

  const canEdit = status === "draft" || status === "rejected";
  const canEditDetails = canEdit || status === "published";
  const deleteUnavailableReason = status === "published"
    ? isArabic
      ? "لا يمكن حذف كورس منشور لحماية وصول الطلاب المسجلين إلى المحتوى."
      : "Published courses cannot be deleted because enrolled students need continued access."
    : isArabic
      ? "لا يمكن حذف كورس أثناء مراجعته."
      : "A course cannot be deleted while it is under review.";
  const editButtonLabel = canEdit
    ? isArabic ? "تعديل" : "Edit"
    : isArabic ? "تعديل البيانات" : "Edit details";

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-black-blue/[0.07] bg-white shadow-[0_12px_38px_rgba(33,55,75,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(33,55,75,0.1)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#F4F7F7]">
        <img
          src={course.image || "/images/placeholder-img.webp"}
          alt={courseTitle}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="inline-flex max-w-[68%] min-w-0 items-center gap-1.5 truncate rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-main shadow-sm backdrop-blur">
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{categoryName}</span>
          </span>

          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-extrabold shadow-sm ${statusClass}`}
          >
            {statusCopy[status] ?? status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link
          to={`/profile/my-courses/${course.id}/view`}
          className="block"
        >
          <h3 className="line-clamp-2 text-lg font-black leading-7 text-black-blue transition-colors hover:text-main sm:text-xl">
            {courseTitle}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#4D5756]">
            {courseDescription}
          </p>
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-main/[0.055] px-3 py-2.5 text-xs font-bold text-black-blue/70">
            <Layers3 className="h-4 w-4 shrink-0 text-main" />
            <span className="truncate">{level}</span>
          </span>

          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-black-blue/70">
            <Tag className="h-4 w-4 shrink-0 text-black-blue/40" />
            <span className="truncate">{course.sub_category?.name || categoryName}</span>
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-black-blue/55">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-black-blue/[0.06] px-3 py-2.5">
            <Video className="h-4 w-4 shrink-0 text-main" />
            <span className="truncate">
              {isArabic ? "محتوى بالفيديو" : "Video course"}
            </span>
          </span>

          <span className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-black-blue/[0.06] px-3 py-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-main" />
            <span className="truncate">
              {formattedUpdatedAt || (isArabic ? "آخر تحديث" : "Updated")}
            </span>
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-y border-dashed border-black-blue/[0.08] py-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-black-blue/35">
              {isArabic ? "سعر الكورس" : "Course price"}
            </p>
            <p className="mt-1 truncate text-xl font-black text-main">
              {price === 0
                ? isArabic
                  ? "مجاني"
                  : "Free"
                : `${price.toFixed(2)} EGP`}
            </p>
          </div>

          <div className="min-w-0 text-end">
            <p className="text-[11px] font-bold uppercase tracking-wide text-black-blue/35">
              {isArabic ? "الحالة" : "Status"}
            </p>
            <p className="mt-1 truncate text-sm font-extrabold text-black-blue">
              {statusCopy[status] ?? status}
            </p>
          </div>
        </div>

        {status === "rejected" && course.publishing_note ? (
          <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-3 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-red-500">
              {isArabic ? "سبب الرفض" : "Review note"}
            </p>
            <p className="mt-1 line-clamp-3 text-xs font-semibold leading-5 text-red-700">
              {course.publishing_note}
            </p>
          </div>
        ) : null}

        <div className="mt-auto space-y-2 pt-5">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/profile/my-courses/${course.id}/view`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-main px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-main/90"
            >
              <Eye className="h-4 w-4" />
              {isArabic ? "إدارة الكورس" : "Manage course"}
            </Link>

            {canEditDetails ? (
              <Link
                to={`/profile/my-courses/${course.id}/update`}
                aria-label={isArabic ? "تعديل بيانات الكورس" : "Edit course details"}
                title={isArabic ? "تعديل بيانات الكورس" : "Edit course details"}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-extrabold text-blue-600 transition hover:bg-blue-600 hover:text-white"
              >
                <Pen className="h-4 w-4" />
                {editButtonLabel}
              </Link>
            ) : (
              <div
                title={isArabic ? "التعديل متاح بعد انتهاء مراجعة الإدارة." : "Editing becomes available after the review is complete."}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-extrabold text-slate-500"
              >
                <LockKeyhole className="h-4 w-4" />
                {isArabic ? "بانتظار المراجعة" : "Awaiting review"}
              </div>
            )}
          </div>

          {canEdit ? (
            <div className="flex justify-end">
              <DeleteTeacherCourseAction
                id={course.id.toString()}
                courseTitle={courseTitle}
              />
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                disabled
                title={deleteUnavailableReason}
                aria-label={isArabic ? "حذف غير متاح" : "Delete unavailable"}
                className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-400"
              >
                <LockKeyhole className="h-4 w-4" />
                {isArabic ? "حذف غير متاح" : "Delete unavailable"}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default TeacherCourseCard;
