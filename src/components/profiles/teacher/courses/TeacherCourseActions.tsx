import { LockKeyhole, PencilLine } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import DeleteTeacherCourseAction from "./DeleteTeacherCourseAction";

type CourseActionStatus = string;

interface TeacherCourseActionsProps {
  courseId: string;
  courseTitle: string;
  status: CourseActionStatus;
  onDeleted?: () => void;
  layout?: "card" | "detail";
}

const TeacherCourseActions = ({
  courseId,
  courseTitle,
  status,
  onDeleted,
  layout = "detail",
}: TeacherCourseActionsProps) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const canManage = status === "draft" || status === "rejected" || status === "published";

  const lockedReason =
    status === "pending_approval"
      ? isArabic
        ? "الكورس قيد مراجعة الإدارة؛ انتظر انتهاء المراجعة قبل التعديل أو الحذف."
        : "This course is under review. Wait for the review to finish before editing or deleting it."
      : isArabic
        ? "التعديل والحذف غير متاحين في حالة الكورس الحالية."
        : "Editing and deletion are unavailable in the current course state.";

  const actionLayout =
    layout === "card"
      ? "grid grid-cols-2 gap-2"
      : "flex flex-wrap items-center gap-2";

  const editClassName =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold transition " +
    (layout === "card" ? "w-full " : "w-full sm:w-auto ") +
    (canManage
      ? "border-main bg-main text-white hover:bg-main/90"
      : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400");

  return (
    <div className={layout === "card" ? "space-y-2" : "min-w-0 space-y-2"}>
      <div className={actionLayout}>
        {canManage ? (
          <Link
            to={"/profile/my-courses/" + courseId + "/update"}
            aria-label={isArabic ? "تعديل الكورس" : "Edit course"}
            className={editClassName}
          >
            <PencilLine className="h-4 w-4" aria-hidden="true" />
            {isArabic ? "تعديل الكورس" : "Edit course"}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            title={lockedReason}
            aria-label={isArabic ? "تعديل الكورس غير متاح" : "Edit course unavailable"}
            className={editClassName}
          >
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            {isArabic ? "تعديل الكورس" : "Edit course"}
          </button>
        )}

        <DeleteTeacherCourseAction
          id={courseId}
          courseTitle={courseTitle}
          onDeleted={onDeleted}
          disabled={!canManage}
          disabledReason={lockedReason}
          fullWidth={layout === "card"}
        />
      </div>

      {status === "published" ? (
        <p role="note" className="text-xs leading-5 text-slate-500">
          {isArabic
            ? "السعر ثابت بعد النشر، والحذف يتوقف لو فيه نشاط طلابي."
            : "Price stays fixed after publishing. Deletion is blocked when learner activity exists."}
        </p>
      ) : null}

      {!canManage ? (
        <p
          role="note"
          className="flex items-start gap-2 text-xs leading-5 text-amber-800"
        >
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{lockedReason}</span>
        </p>
      ) : null}
    </div>
  );
};

export default TeacherCourseActions;
